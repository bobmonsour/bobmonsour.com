---
title: Seeking RSS links, favicons, and descriptions
description: Useful resources to help you add visible RSS links, favicons, and web page descriptions.
date: 2026-02-01
tags:
  - 11ty
  - blogging
  - RSSness
image:
  source: seeking-rss-links-favicons-and-descriptions.jpg
  alt: Header of Zach Leatherman's 11ty Bundle site author page
rssid: 9323c6ee58367b7b3a934b8cdd0830f4
---

One of the beauties and challenges of maintaining the [11tyBundle.dev](https://11tybundle.dev) site is the variety of sources it aggregates. As part of the ongoing effort to enhance the user experience, I'd love to have a complete set of visible RSS links, favicons, and web page descriptions for each of the blog posts and sites featured on the site.

I attempt to "find" these programmatically each time that I enter a blog post's URL into my CLI-based publishing system. That programmatic search has improved over time as I've learned of more comprehensive methods to examine the HTML structure of the pages that I fetch. I probably do not have that perfected, but it's pretty good.

I''ll soon be adding an "Insights" page to the 11ty Bundle site. At the bottom of the page, I'll provide some statistics about how many RSS links, favicons, and descriptions I've been unable to find for the blog posts and sites. If you have posts on the site, please check it out. I'd love to see the missing percentages to all of those things go down over time.

In the hopes of encouraging better practices among bloggers and site maintainers, I'm sharing what I think are credible resources to help you add visible RSS links, favicons, and web page descriptions to your own sites and pages.

## RSS Links

If you're blogging and you want people to be able to subscribe to your content via RSS, it's important to make your RSS feed easily discoverable. Here are some resources that can help you add visible RSS links to your site:

- [Exposed RSS](https://chriscoyier.net/2024/01/13/exposed-rss/) by Chris Coyier
- [Please, Expose your RSS](https://rknight.me/blog/please-expose-your-rss/) by Robb Knight
- [Making Your RSS Feeds Automatically Discoverable](https://blog.jim-nielsen.com/2021/automatically-discoverable-rss-feeds/) by Jim Nielsen

If you use techniques like these, it will make it much easier for services like 11tyBundle.dev to find and link to your RSS feeds.

## Favicons

Favicons are those little images you'll see peppered aroung the 11tybundle site. Some are next to blog posts, some are next to author pages, and some are icons implying that the link is to a GitHub repository.

Like RSS links, I make a programmatic attempt to find favicons for each site that I add to 11tyBundle.dev and to the blog posts for first time authors (once I have it for one post, I re-use it for subsequent posts). Here are some resources that can help you add favicons to your site:

- [Adding a favicon in Eleventy](https://bnijenhuis.nl/notes/adding-a-favicon-in-eleventy/) by Bernard Nijenhuis
- [Favicon Generation In Eleventy](https://equk.co.uk/2023/07/14/favicon-generation-in-eleventy/) by Equk
- [Conditional favicon in Elev­enty using passthrough copy](https://chriskirknielsen.com/blog/conditional-favicon-with-eleventy-passthrough-copy/) by Christopher Kirk-Nielsen

Note that that last one lets you have a different favicon for different build versions, e.g., development vs. production.

## Descriptions

Descriptions are important for SEO and, in the context of the 11tybundle.dev site, it provides a brief summary of what the blog post is about, helping visitors decide whether to read it. Here are some resources that can help you add descriptions to your web pages:

- [Meta info, RSS feeds and module recap](https://learn-eleventy.pages.dev/lesson/17/) from Learn Eleventy by uncenter and Andy Bell
- [Meta Description and Keywords in Eleventy](https://johnwargo.com/posts/2023/meta-keywords-in-eleventy/) by John M. Wargo
- [Best practices for creating quality meta descriptions](https://developers.google.com/search/docs/appearance/snippet#meta-descriptions) by Google Search Central

## Conclusion

I'll close by saying that there is no absolute requirement that you add any of these to your pages or posts. However, to increase your audience of readers and possible readers, I'd encourage you to consider adding visible RSS links, favicons, and descriptions to your sites and blog posts.
