---
title: Three years in on the 11ty Bundle
description: The 11ty Bundle site launched on May 1, 2023. Here's a recap of the past  year.
date: 2026-05-04
tags:
  - 11ty
image:
  source: three-years-in-on-the-11ty-bundle.png
  alt: screenshot of the 11ty bundle with a celebration banner
rssid: c41db6d58cd7b38cedcb0160add59a45
---

[[toc]]

## Introduction

I'm finding it increasingly hard to believe that I've just completed 3 full years of building, refining, and maintaining the [11ty Bundle website](https://11tybundle.dev). But here we are...

I [wrote a recap of the 2nd year](/blog/1-%2B-1%3A-celebrating-2-years-of-the-11ty-bundle/) too.

## Highlights

In no particular order:

- Crossed the 1,700 post mark in April of this year
- Jumped to over 1,500 sites built with Eleventy, including a large jump in January by integrating sites from the [11ty leaderboard](https://www.11ty.dev/speedlify/) that we didn't already capture
- Created a [Showcase page](https://11tybundle.dev/showcase/) to show off screenshots of all of those sites
- Crossed the 500 author mark
- Published 16 issues of the [11ty Bundle blog](https://11tybundle.dev/blog/)
- Enjoyed a wonderful collaboration with [Damian Walsh](https://damianwalsh.co.uk/) on a redesign of the site which we launched in January of this year
- Added an [Insights page](https://11tybundle.dev/insights/), providing a 'by the numbers' look at the data underpinning the site
- Added a [Liquid category](https://11tybundle.dev/categories/liquid/), a [Books Pages category](https://11tybundle.dev/categories/books-pages/), and a [Vento category](https://11tybundle.dev/categories/vento/)
- Search functionality has been dramatically improved in both utility and interace. I've upgraded to the latest version of [Pagefind](https://pagefind.app/) and have taken advantage of some of the new capabilities. I will confess freely that I used Claude Code to assist with the integration.

## Analytics

I won't be sharing the analytics data like I did last year. I did note an appreciable jump in traffic as a result of the redesign. That's the good news. The bad news is that it seems that the bots and AI crawlers have arrived and seem to have skewed the numbers dramatically. I have noticed this on my personal site as well and have since removed analytics from that site. I have not removed them from the 11ty Bundle site, but I just don't look at them very often any more. It's not really the point. I know that real people use the site and that's good enough for me.

## Deployment

As I wrote in a [recent blog post about how I now deploy my Eleventy sites](/blog/changing-how-i-deploy-my-eleventy-sites/), I now use Cloudflare's Wrangler utility to deploy the site. The build takes place locally, and Wrangler pushes any files that have changed to the Cloudflare Workers platform. I'm very happy with this method of deployment.

## Tooling

Last year, I had written a highlight that said _"Created some node scripts to make the site easier to maintain."_ That highlight linked to the [post where I described what I had built](/blog/node-cli-of-my-dreams/).

As much as those tools had served me, there remained more friction than I could bear in maintaining the data that underpins the site.

I embarked on a path of using Claude Code to build a Flask app (a python framework) to make it easier to deploy the site. In fact, it started out as an app to post to mutiple social media sites with a single post. It gradually became a full blown CMS for the 11ty Bundle data, all of which is stored in a few json files. It's a local-only app that serves me well and save me a ton of time when creating or editing the site contents.

You can find it at [this anchor link](/blog/how-ive-been-using-ai/#a-custom-cms-for-the-11ty-bundle), which is part-way down a [blog post about how I've been using AI](/blog/how-ive-been-using-ai/).

## Finding my web dev tribe in retirement

I've been happy with how all of this has come about and, being struck at the moment earlier this year, I decided to submit a talk proposal to the [North Bay Python](https://northbaypython.org/) 2026 event. It takes place just 10 miles north of where I live. Shocked, pleased, and nervous, my proposal was accepted and I gave the talk on May 25th. I wrote [a short piece (and included the video) about it](/blog/north-bay-python-2026-afterthoughts/).

## Eleventy becoming Build Awesome

Lastly, Eleventy is becoming Build Awesome, and [the Kickstarter has relaunched](https://www.kickstarter.com/projects/fontawesome/build-awesome-pro).

I am fully supportive of this as it means the Eleventy will continue to have a supported open source version and there is a path for economic stability of the project through Build Awesome Pro subscriptions. I am hopeful that this will work out for everyone involved.

I wrote a short "editorial" with my thoughts on this in [Issue 85 of the 11ty Bundle](https://11tybundle.dev/blog/11ty-bundle-85/).

## Conclusion

Three years down...not sure how many more to go. Now that capturing and maintaining the site has become more efficient, I have been working on some other side projects, many of them being built with Eleventy. You can find more about them in [my post about my use of AI](https://bobmonsour.com/blog/how-ive-been-using-ai/).

I'm still happy to be part of this community and continue to enjoy using and learning more about Eleventy as well as other methods and platforms for building useful tools and sites.
