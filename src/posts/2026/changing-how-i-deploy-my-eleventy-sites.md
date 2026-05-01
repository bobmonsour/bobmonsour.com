---
title: Changing how I deploy my Eleventy sites
description: I'm using Cloudflare's Wrangler utility to deploy my Eleventy sites.
date: 2026-04-30
tags:
  - 11ty
pageHasCode: true
image:
  source: horse-wrangler.png
  alt: A female horse wrangler
  caption: A female horse wranger
rssid: 663eb43ebc769a7179d5f16acb1f068b
---

[[toc]]

## Introduction

I've got several sites hosted at Netlify and several at Cloudflare. The ones at Netlify do not require frequent updates and, for some of them, I can't even remember the last time I updated them...the blessing of static sites...that remain static.

I had moved this site and the [11ty Bundle](https://11tybundle.dev) to Cloudflare Pages after getting what seemed like insanely high traffic at Netlify that, while likely bot-driven, was on the verge of putting me over the free tier limit.

I've built a few new sites and they've started their life on Cloudflare.

When [Damian](https://damianwalsh.co.uk/) and I undertook the redesign of the 11ty Bundle, I used the ability to upload a full site to the Cloudflare Workers platform as a way to have a sort of preview branch. There had been some writing on the wall that much of Cloudflare's efforts would go into Workers rather than Pages and I wanted to see how that felt.

As it turns out, using Cloudflare's Wrangler utility, it was easier for me to build the site locally, upload it to Cloudflare, and poof, it was deployed. This is is contrast to the typical CI process of pushing the site to GitHub and that triggering a build at Clouflare followed by deployment.

In this piece, I'll share how that works at a conceptual level and what I see as the benefits for my particular use cases.

## Migrating to Cloudflare Workers

A couple of other people have written about Cloudflare Workers. Rick Cogley wrote [this piece comparing Pages and Workers](https://cogley.jp/articles/cloudflare-pages-to-workers-migration). And Alex Zappa wrote [this one about the after effects of the migration](https://alex.zappa.dev/blog/cloudflare-pages-to-workers-migration/). Alex's deals with cleaning up the old Pages deployments (which I'll also cover below).

The essence of migration for the sites I've moved occur through the following steps:

- install the wrangler npm package
- set up a wrangler.toml configuration file
- doing the initial site upload

That 3rd step of the initial site upload can be done on the Cloudflare Workers site itself by choosing a folder to upload. However, there is a limit to folders with 1,000 files. If the folder contains over 1,000 files, it will direct you to use the wrangler method.

Once the site is uploaded, and again, I'm assuming here that your existing site lives on Cloudflare Pages with a custom domain, there are several more steps to take to tell Cloudflare that the Workers version is the new one.

- turn off automatic deployments in the settings of the Pages version
- remove the custom domain linked to the Pages version
- add the custom domain to the Workers version
- delete the Pages project

As Alex noted in his post referenced above, for Pages projects with more than 100 deployments, you will be unable to delete the project through the web interface. Cloudflare will provide a link to a bash script that can be used to incrementally delete all of the old deployments. I had one project with over 600 deployments and it took a while to delete them all, 25 at a time.

Once they are deleted, you can delete the Pages project in the web interface.

## What does deployment look like now?

Once you've done the migration and your Workers version is responding to your custom domain, deployments work differently.

While you will still commit and push your code to GitHub however and whenever you want, those pushes will no longer trigger a build and deployment.

For all of the sites that I've built, I can either build/serve for local development or build to create a production version of the site on my local machine.

After I do the latter, I run the Wrangler utility to upload the new site to Cloudflare.

The **HUGE** benefit to this method, in my opinion is how Wrangler decides what to upload. It creates a manifest of all the files in the site directory, consisting of a hash of each file's contents. It does this on both ends, locally and on Cloudflare. With that in hand, Wrangler only needs to upload files that have changed. So for small changes, a local build followed by a Wrangler upload can be quite efficient. Think of it as incremental deployment.

## Conclusion

Your mileage may vary. All of the sites that I have on Cloudflare Workers are fairly simple static sites with little interaction with the outside world. The method of deployment that I've described here works great for me.

Check out those posts by Rick and Alex to learn a bit more.

And if you've got questions, do what it says below...comment by email.
