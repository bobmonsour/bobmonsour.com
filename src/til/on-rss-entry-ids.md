---
title: On RSS entry IDs
description: Evan Sheehan has a great post about why using the URL for a post for its RSS ID is not a good idea.
date: 2025-01-25
tags: [blogging, RSSness]
---

[In his post](https://darthmall.net/2025/on-the-importance-of-stable-ids/), Evan shares the pitfalls of using a post's URL as the entry ID in the RSS feed. He also provides a solution for how to handle this problem.

> I think the lesson for me is do not create arbitrary dependencies in your data in the name of automation. There really is no reason why the ID of a post should change just because it’s URL changed. Same goes for the title, or the published date, or anything else. The ID really is it’s own thing, and it should probably not be derived from any other properties. Absolutely everything about an entry in the feed can change — up to a point — while still remaining conceptually the same entry, so the ID should be completely decoupled from everything else.
> --Evan Sheehan
