---
title: The 11ty Bundle - Issue 3
date: 2023-04-11
tags:
  - 11ty
  - 11ty Bundle
description: An occasional bundle of Eleventy releases, blog posts, sites, and resources.
keywords: eleventy, newsletter, roundup, news
image:
  source: "11ty-bundle-3.jpg"
  alt: "an AI-generated image of the number eleven"
  caption: "An AI-generated image of the number eleven"
pageHasCode: "false"
pageID: bundle
bundleIssue: 3
draft: true
---

{% include 'partials/bundlehead.md' %}

## Recent releases

{% for item in bundleitems | getBundleItems(bundleIssue, "release") %}

- [{{ item.Title }}]({{ item.Link }}), {{ item.Date }}

{% endfor %}

## Blog posts: from Discord, Mastodon, Twitter, and around the web

_Ordered by date of publication_

{% for item in bundleitems | getBundleItems(bundleIssue, "blog post") %}

- [{{ item.Title }}]({{ item.Link }}) by [{{ item.Author }}]({{ item.AuthorLink }}), {{ item.Date }}

{% endfor %}

## Built with Eleventy

{% for item in bundleitems | getBundleItems(bundleIssue, "site") %}

- [{{ item.Title }}]({{ item.Link }}), {{ item.Date }} by [{{ item.Author }}]({{ item.AuthorLink }})

{% endfor %}

{% include 'partials/bundlefoot.md' %}
