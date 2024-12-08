---
title: I'm finally unvexed by microblog post dates
description: I recently had a problem on this here microblog. It has to do with dates. But it's all ok now.
tags:
  - 11ty
---

**Update #2:** It seems that I once again missed a key result when one eliminates the date field in a post's front matter. It turns out (again, as explicitly mentioned in the [Eleventy docs](https://www.11ty.dev/docs/dates/#collections-out-of-order-when-you-run-eleventy-on-your-server)) that CI environments don't really know what the created date is as the file system creation date, i.e., on my laptop bears no resemblence to the file system at Netlify. So, I dropped back to using "git Created" as the date in my directory data file and all is right in the world...for now, at least.

**UPDATE #1:** What I wrote below was rather wrong-headed. What I really needed to do was eliminate the date field in my YAML front matter. Eleventy defaults to the file's creation date if no date is specified. It even states that as plain as day in the docs: _"Created": automatically resolves to the file’s created date (default, this is what is used when date is omitted)._

So, I just needed to remove the date field from my front matter and everything would sort correctly. Once I did that, all I had to do was change the reference to the date field from "date" to "page.date." I've done that now and everything is working as I originally wanted. Many thanks to Aankhen and Uncenter on the [Eleventy Discord](https://www.11ty.dev/blog/discord/) for nudging me in the right direction.

~~When I first created this microblog, one thing had me worried. What if I wanted to do to two or more posts on the same day. Would they sort in the correct order if I set the YAML date to something like 202411-23? I didn't know. I was vexed. The whole purpose of this microblog was to be able to write short posts quickly and easily. I didn't want to have to worry about the date of the post. But I wanted them to be presented in the order that I created them.~~

~~I had run into the problem once already and decided just to alter the date of one of the two posts so that they came out in the right order. But I ran into it again today and finally dug in to figure out how best to fix it.~~

~~I had recalled that [Robb Knight](https://rknight.me/) had written a blog post about dates in Eleventy, titled [We Need to Talk About Your Eleventy Post Dates](https://rknight.me/blog/eleventy-post-dates/). It was a helpful start, but it also pointed me to the [relevant portion of the Eleventy docs](https://www.11ty.dev/docs/dates/#setting-a-content-date-in-front-matter).~~

~~It was there that I found exactly what I'd need. Rather than set a date like 2024-11-23, I could simply set the date to "git Created." And poof, the posts would sort in the order that I created them which is exactly what I wanted.~~
