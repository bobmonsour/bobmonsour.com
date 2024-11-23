---
title: I'm finally unvexed by microblog post dates
date: Created
description: I recently had a problem on this here microblog. It has to do with dates. But it's all ok now.
tags: microblog
---

When I first created this microblog, one thing had me worried. What if I wanted to do to two or more posts on the same day. Would they sort in the correct order if I set the YAML date to something like 202411-23? I didn't know. I was vexed. The whole purpose of this microblog was to be able to write short posts quickly and easily. I didn't want to have to worry about the date of the post. But I wanted them to be presented in the order that I created them.

I had run into the problem once already and decided just to alter the date of one of the two posts so that they came out in the right order. But I ran into it again today and finally dug in to figure out how best to fix it.

I had recalled that [Robb Knight](https://rknight.me/) had written a blog post about dates in Eleventy, titled [We Need to Talk About Your Eleventy Post Dates](https://rknight.me/blog/eleventy-post-dates/). It was a helpful start, but it also pointed me to the [relevant portion of the Eleventy docs](https://www.11ty.dev/docs/dates/#setting-a-content-date-in-front-matter).

It was there that I found exactly what I'd need. Rather than set a date like 2024-11-23, I could simply set the date to "git Created." And poof, the posts would sort in the order that I created them which is exactly what I wanted.
