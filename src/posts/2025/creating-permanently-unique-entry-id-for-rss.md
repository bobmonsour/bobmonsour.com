---
title: Creating quasi-permanently unique entry IDs for RSS
date: 2025-01-27
tags:
  - 11ty
  - RSSness
description: I was inspired to create permanently unique entry IDs for my RSS feed after reading a post by Evan Sheehan.
keywords: RSS, entry ID, unique ID, Evan Sheehan
image:
  source: creating-permanently-unique-entry-id-for-rss.png
  alt: Icon for RSS feeds
pageHasCode: true
rssid: bf59e428f07a5035c3a15c95005145a5
---

[[toc]]

## Introduction

As I noted in [a recent TIL](/blog/on-rss-entry-ids/), I had read [a post from Evan Sheehan](https://darthmall.net/2025/on-the-importance-of-stable-ids/) about how he decided to alter the ID used for each entry in his RSS feed. His motivation was that he wanted his RSS feed to remain stable in the event that he restructured the URLs for his posts.

I thought that was an interesting idea and decided to implement a form of it on my own site. Here's how I went about it.

## What's wrong with the current entry IDs?

If you haven't read [Evan's post](https://darthmall.net/2025/on-the-importance-of-stable-ids/), here's the gist of it. He wanted to restructure the URLs for his site. One aspect of restructing involved creating redirects from the old to the new, which he had dutifully done. Yet that was no help with his RSS feed. What he learned was that RSS readers around the world were suddenly drowning in what appeared as all new posts from his feed. The reason that all of his posts appeared to be new is that the `<id>` of each entry consisted of the full URL of the post. And all of those URLs had changed when he went about restructuring. So, he decided to change the ID for each entry to something that would remain stable even if he restructured his URLs. I'll let you go on and [read about how he resolved this](https://darthmall.net/2025/on-the-importance-of-stable-ids/). The technique that I describe below has a similar result, but is not quite as permanently unique as what Evan did.

## Why freedom to restructure is really nice

As an [Eleventy](https://11ty.dev) site, I love that I can put my markdown files and Nunjucks templates wherever I want in my input directory and I know that they will get processed correctly. And, on top of that, I can set a permalink for these however I want. That gives me the freedom to reorganize my directory structure and change my permalinks without affecting the URLs that my readers use to access my content. That's a really nice feature of Eleventy. That said, whenever I've done this, I've had to create the necessary redirects so that old links to those pieces of content continue to work and "redirect" users to the new location.

## How can we create permanently unique entry IDs for the RSS feed?

My approach is very similar to Evan's, but it differs in one significant way. He manually creates a unique ID and adds it to the frontmatter of each post, whereas I have automated the process. However, I wind up with quasi-permanent IDs, whereas his are truly permanent.

Where we are nearly identical is our use of the [tag URI scheme](https://en.wikipedia.org/wiki/Tag_URI_scheme) to generate the unique ID. The basic syntax is as follows:

```text
"tag:" authorityName "," YYYY-MM-DD-date ":" specific [ "#" fragment ]
```

Here's an example of an ID that I generated for the post titled "[On RSS entry IDs](/blog/on-rss-entry-ids/):

```text
tag:bobmonsour.com,2025-01-25:fe577f94dac79c3895ae331aa61a2729
```

So, how can we generate that long item, the `specific` portion of the "tag" at the end of the ID?

Evan makes use of a utility that takes several elements of the post along with his `authorityName` and calculates and MD5 hash that he then adds to the front matter of the post for use in his RSS feed.

That certainly works and will result in a never-changing value. He can even change the filename and title and date of the post, but once he captures that initial value, it will be forever unique.

## Ok, so how did I do it?

I use the same tag URI scheme, but I didn't really want to add that step of creating a unique ID by hand every time I created a post. So, I decided to automate the process. It's pretty straightforward and I arranged it so that the newly created IDs would only affect posts created after a certain date. This way, all of the older posts retain their use of the `absolutePostUrl` as the ID.

Here's a look at what a segment of my RSS feed template looks like at the point of the start of each entry:

```jinja2{% raw %}
{% set dateString = post.date | toDateString %}
<id>{{ post.data.title | genRSSId(dateString, absolutePostUrl) }}</id>{% endraw %}
```

And here is what that filter, `genRSSId`, looks like:

```js
import crypto from "crypto";
const hashingStartDate = "2025-01-24";
function MD5Hash(input) {
  return crypto.createHash("md5").update(input).digest("hex");
}
export function genRSSId(postTitle, postDate, absolutePostUrl) {
  if (postDate > hashingStartDate) {
    let tagURIBase = "tag:bobmonsour.com," + postDate + ":";
    return tagURIBase + MD5Hash(postTitle + postDate);
  } else {
    return absolutePostUrl;
  }
}
```

First, I have to take the post date and convert it to a string that I can use to compare to see if the post is after the start date for when the posts will begin having a tag URI ID rather than the `absolutePostUrl`.

If the post is after that date, I create the `tagURI` base and then add the MD5 hash of the post title and date to the end of it. If the post is before that date, I just return the `absolutePostUrl`.

The downside of this approach is that if I ever change the title of a post that uses the tag URI ID, the ID will change. I'm willing to take the rare hit of that happening in order to have the convenience of not having to manually create a unique ID for each post.

## Here's the real dilemma

My real dilemma is that my "older" posts still use the `absolutePostUrl` as the ID. This saves me from flooding those who read this via RSS. Yet it also limits how much I can restructure without affecting the IDs of those older posts. So the real question is whether or not I will ask readers of my site via RSS to take the hit of a flood of older posts if I were to remove the "start date" check from the `genRSSId` filter. I'm not sure what I'll do about that yet.

## Conclusion

So, if you're using the default RSS (or Atom or JSON) feed [sample templates](https://www.11ty.dev/docs/plugins/rss/#sample-feed-templates) provided in the Eleventy docs, and you want to be able to freely reorganize your input files and permalinks, you might want to consider doing something different. It could be something like what I've described or something altogether different.

## Related posts

- [On RSS entry IDs](/blog/on-rss-entry-ids/), _Jan 25, 2025_
- [Much more to come on RSS entry IDs](/blog/much-more-on-rss-entry-ids/), _Jan 26, 2025_
- [My last word on RSS entry IDs](/blog/even-more-on-rss-ids/), _Jan 30, 2025_
- [Prepare for a minor flood of RSS entries](/blog/minor-flood-warning/), _Jan 31, 2025_
- [I wanted to validate the presence of an rssid in my front matter](/blog/11ty-preprocessors-for-my-rssid/), _Feb 1, 2025_
- [Ok, this is my 'final' final word on RSS entry IDs](/blog/final-final-word-on-rss-entry-ids/), _Feb 2, 2025_
