---
title: Question...how to count outbound links and saving that count
date: 2023-06-04
tags:
  - 11ty
description: I'm in search of a solution to add outbound link tracking to my site for use as a post popularity indicator.
keywords: 11ty, eleventy, outbound links, link tracking, analytics, popularity
image:
  source: "question-how-to-count-outbound-links.jpg"
  alt: "child playing with abbacus"
draft: false
pageHasCode: false
---

> UPDATE 2023-06-22: I wrote about how I addressed the question posed here in [Issue 9 of the 11ty Bundle](https://11tybundle.dev/blog/11ty-bundle-9/).

You may (or may not) know that I am the developer of the site [11tybundle.dev](https://11tybundle.dev/).

The primary content on the site is a curated list of links to blog posts about the static site generator Eleventy. The posts are organized by category and by author. The links take the visitor directly to the site hosting the blog post.

The only analytics I am currently using are the simple $9/month plan from Netlify, the service that hosts the site. The data is pretty minimal and I added it to find out if what I was building was of use to anyone. Traffic counts would be my evidence.

Since the launch of the site, I am getting about a few hundred unique visitors per day. There are occasional spikes (hitting over 1,000 one day) when I put out a new blog post for the site and announce it on Twitter, Mastodon, and the Discord server.

I am thinking that it might be helpful to site visitors to know which posts are the most popular. In other words, which links get clicked the most. I realize that I could add an event listener to each of the links and use that to track the clicks. But once I do that, I need a static bit of storage to place those counts and then use those counts at build time to indicate popularity.

The links to the blog posts are currently stored in an Airtable database that I access at build time to generate the site. I could add a column to the database to store the click counts...not really. Regrettably, Airtable does not have an "increment" function for a database field. In order to increment, you have to retrieve the field value, increment it, and then write it back to the database. And with multiple people clicking links from various places, that would simply not be accurate. It might provide an approximation, but I am not a fan of this approach (though it might be my first cut at a solution).

What I am thinking is that I could use one of the various database services to write the count to. As you can see, all I need is a 2-dimensional array, with the first dimension being the link and the second dimension being the count. I could then use the database service's API to retrieve the counts at build time for display on the site.

I am leaning toward this route as I'd prefer not to add a clunky client-side analytics package full of javascript to the site. I do realize that I will have some client-side javascript to capture the click before the visitor leaves the site and adding it to the count in the database, but that feels pretty lightweight to me. As of now, there is zero client-side javascript on the site.

Something like Firebase, Supabase, or MongoDB could work.

So, my question is, what would you do? Do you have a better idea? Do you have a suggestion for a database service that would work well for this? I'd love to hear your thoughts. I decided to write this as a blog post instead of a question on the Discord server...mainly because it's long.
