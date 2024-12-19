---
title: A tweak to how I use Pagefind
description: I use the Pagefind package to add search to my personal site. It was returning way too many result for simple words. I made a small tweak to fix that.
date: 2024-11-27
tags:
  - 11ty
  - futzing
pageHasCode: true
---

I have been using [Pagefind](https://pagefind.app/) on this site for some time to handle [site search](/search/).

I was finding that some searches turned up pages and posts that had more results than made sense, i.e., the results were overly broad. For example, prior to the tweak that I'm about to describe, a search for the word "doing" would return any word with "do" as its stem.

This was raised [on Mastodon](https://dice.camp/@arestelle/113229586080600304). I [chimed in](https://indieweb.social/@bobmonsour/113230178462020918).

[Liam Bigelow](https://fosstodon.org/@bglw), the author of Pagefind, showed up and shared a way to tone down the results, which I implemented. In short, Liam said "_For sites where it isn't performing well, a current escape hatch is to use --force-language unknown when indexing, which doesn't perform any stemming at indexing or query time."_

All I had to do was add `--force-language unknown` to the indexing commands in my `package.json` file, one for local development and one for production. I did that and reindexed the site. Now, the search results are much more in line with what I expect.

If you've had the sense that Pagefind search results were overly broad, give this a try. It worked for me.
