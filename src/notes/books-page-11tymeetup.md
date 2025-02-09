---
title: 11ty Meetup - How I built my Books page
description: I presented at the 11ty Meetup on how I built my Books page. Here's the video and a link to a PDF of the slides.
date: 2025-02-06
tags:
  - 11ty
pageHasYoutube: true
rssid: 8a782588da3b04d5e0bb6e4430a0fafc
---

I presented at the [February 6, 2025 Eleventy Meetup](https://11tymeetup.dev/events/ep-21-book-pages-and-privacy-first-analytics/) on how I built my [Books page](/books/). Here's the video and a [link to a PDF of the slides](/assets/pdf/books-page-11tymeetup-020625.pdf).

{% set videoTitle = "How I built my Books page with Bob Monsour" %}
{% set videoId = "r2StAHsZllQ" %}
{% include 'youtube.njk' %}

> UPDATE: I have evolved in the way that I add a book to the books.json file. I'm finding that VS Code snippets, while they largely work, can be somewhat fragile when entering info. As a result, I've created a dedicated node script that does exactly what I want and provides the option to deal with the idiosyncrasies of the data entry, including handling things like "currently read" and "localCover". If you're interested, I've [put the script on GitHub](https://github.com/bobmonsour/addbook).
