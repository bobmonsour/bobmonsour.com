---
title: Eleventy Transform speeds local development...a lot!
date: 2024-11-24
tags: [11ty, performance]
description: I just converted all the images on my site to use the Eleventy Transform capability in v3.0.0 and wow did it slash my local build times.
keywords: images, build time, eleventy transform, local development
image:
  source: luging-on-dirt.jpg
  alt: looks like a guy riding a luge on a dirt road
  creditPerson: Matthew Brodeur
  creditLink: https://unsplash.com/@mrbrodeur
pageHasCode: true
rssid: 7427ee63664534335e4465123dd56d27
---

Ever since the Eleventy v3.0.0 came out and the new Eleventy Image plugin came out with the its new [Transform capability](https://www.11ty.dev/docs/plugins/image/#eleventy-transform), I had been wanting to give it a try.

We'll I did that today and coverted my entire site into using it. The results are pretty astonishing.

Here are the basics steps I took to do it:

- Removed the image shortcode
- Updated all of my blog posts that contained images to revert to basic html img tags
- Added "eleventy:ignore" to images that I did not want to be transformed; those included the SVGs that you see at the footer of every page for social media links
- Updated my eleventy config to use the new Eleventy Image plugin and the new Transform capability

I did run into a couple of issues, but those were largely around me not correctly understanding the urlPath and outputDir options. Once I got all my edits done and figured out how things work, the results were truly astonishing.

As noted in the docs under [Optimize Images on Request](https://www.11ty.dev/docs/plugins/image/#optimize-images-on-request), **_"When using the transform method or the WebC component, image processing is removed from the build for extra performance. Instead, they are processed when requested by the browser using a special middleware built-in to the Eleventy Dev Server."_**

My local build times for this site went from 15 seconds to less than 1 second. I kid you not. It's really quite amazing.

For those of you with very large sites (my site is only a couple of years old and I don't have that many posts), the conversion might be a bit cumbersome. That said, VS Code as well as many other editors have pretty good tooling to do global changes (as long as you're careful).

For those wanting to learn more, [Aleksandr Hovhannisyan](https://www.aleksandrhovhannisyan.com/) has an [excellent blog post](https://www.aleksandrhovhannisyan.com/blog/eleventy-image-transform/) that goes into the nitty gritty details of how he transformed his site to use it.
