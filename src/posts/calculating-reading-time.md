---
title: Calculating reading time for a post
date: 2022-02-06
description: Where does that '2 min read' come from?
---

Where does that '2 min read' come from?

Each of the posts on this site (there are only two so far, and this is the second one), display something like "1 min read." This indicates that it will take about one minute to read the post.

I had seen that on other sites, inlcuding Medium, and I always thought it was kinda neat.

I was inspired to do two things. First, was there something out there in the eleventy world that already did this? And two, I was willing to use it as long as I could understand how it worked. Ok, three things...the third being that if I didn't understand how it worked, could I make it myself?

What you see on this site is the result of the third thing.

I did find one in the wild, [here](https://github.com/johanbrook/eleventy-plugin-reading-time). At first, I used it. I installed the plugin and set up my first post to use it and it looks like it works.

However, when I looked at the code, I didn't really understand it all. I know that if I spent the time, I could understand it. But I also thought back to another project that I started (but never finished) and the piece of code that it included that had one of the core elements of a reading time calculator, that is, counting the number of words in the post. I'll write separately about that other project some time (it involved creating a lightweight search engine for static sites).

So even though the plugin worked, I really wanted to try to make a simpler (in my mind) version of it. One that I could document and share...simply for the sake of learning and sharing (which, if you read my [Is this thing on?](https://www.bobmonsour.com/posts/is-this-thing-on/) post, you'd see that that's one of the purposes of this site.

So, now, I present to you my reading time calculator. Below is a [GitHub gist](https://gist.github.com/bobmonsour/53ea41c50bec94be394a9314858dad1d) of the code that anyone is free to use. I set it up as a filter (rather than a plugin).

<script src="https://gist.github.com/bobmonsour/53ea41c50bec94be394a9314858dad1d.js"></script>

I'm not sure if this is worth taking any further as it suits my purposes of being simple, lightweight, and understandable (to me, at least).

UPDATE: I have since found a second one, listed among the [community-contributed plugins](https://www.11ty.dev/docs/plugins/) on the eleventy docs site. [This one](https://github.com/JKC-Codes/eleventy-plugin-time-to-read) has a lot more features than I need and I found to be even more complex (not always a bad thing, but it does far more than I need).
