---
title: Got RSS Feeds?
date: 2024-06-11
tags:
  - 11ty
  - RSSness
description: How I search for, and find, RSS feeds, programmatically.
keywords: rss, rss feed, eleventy, 11tybundle.dev
image:
  source: got-rss-feeds.jpg
  alt: billboard in a field with the words 'got milk?'
  creditPerson: Christopher Ott
  creditLink: https://unsplash.com/photos/a-sign-in-a-field-that-says-got-milk-kiSLzMLcc7I
pageHasCode: true
rssid: 6a4973c83cf19e2a0d08d93902f381f4
---

[[toc]]

_**TL;DR**: As part of updating the elements of each 11ty Bundle post, I had to find the RSS feed for the author's website. This is how I did it...and some advice._

## Introduction

In [Issue 47](https://11tybundle.dev/blog/11ty-bundle-47/) of the 11ty Bundle blog, I described the new layout for each of the bundle items. One of the pieces of that layout is a link to the RSS feed for the author's website (most times, it is...sometimes, it's not...I'll explain).

Given a link to the blog post by the author, I had to find the home page of the site and then see if I could identify and extract, or create, a link to the site's RSS feed.

Here's how I did that.

## Where to start?

One of the other things that I added to the display of each bundle item was a link to the author's website. I thought that this would be the best place to find the link to the RSS feed.

So, first, I take the link to the blog post and do some very minimal javascript magic to get the origin. Here's what that looks like. Each post object has a Link property that contains the URL of the blog post. I use that to get the origin:

```js
const url = new URL(post.Link);
const siteUrl = url.origin;
```

Pretty simple, right? Thank you, built-in JavaScript stuff!

## Find the link to the RSS feed

For those who follow [Jim Nielsen's Blog](https://blog.jim-nielsen.com/), you may have come across his piece called [Making Your RSS Feeds Automatically Discoverable](https://blog.jim-nielsen.com/2021/automatically-discoverable-rss-feeds/). In it, he describes the best way to make your RSS feed more easily found, particularly by things like RSS feed readers.

Well, the 11ty Bundle site, while not your typical RSS reader, wants to find your RSS feed so that I can make it easier for the site's visitors to find the RSS feed of an author they want to follow.

So, what I get Eleventy to do at build time is to fetch the site's home page, which we've just "calculated" and then, using the [cheerio package](https://cheerio.js.org/), look for the link to the RSS feed in the site's head. Here's what that looks like:

```js
const getRSSlink = async (siteOrigin) => {
	if (rssLinkCache[siteOrigin]) {
		return rssLinkCache[siteOrigin];
	} else {
		try {
			let htmlcontent = await EleventyFetch(siteOrigin, {
				directory: ".cache",
				duration: "*",
				type: "buffer",
			});
			let $ = cheerio.load(htmlcontent);
			let rssLink =
				$('link[type="application/rss+xml"]').attr("href") ||
				$('link[type="application/atom+xml"]').attr("href");
			if (rssLink == undefined) {
				rssLink = "";
				rssLinkCache[siteOrigin] = "";
			} else if (rssLink.startsWith("http")) {
				rssLinkCache[siteOrigin] = rssLink;
			} else {
				if (rssLink.charAt(0) === "/") {
					rssLink = siteOrigin + rssLink;
					rssLinkCache[siteOrigin] = rssLink;
				} else {
					rssLink = siteOrigin + "/" + rssLink;
					rssLinkCache[siteOrigin] = rssLink;
				}
			}
			return rssLink;
		} catch (e) {
			console.log(
				"Error fetching RSS link for " + siteOrigin + " " + e.message
			);
			return "";
		}
	}
};
```

[_NOTE: There are comments in the actual code, but for some reason, the syntax highlighter adds a bunch of blank lines around every comment line, so I removed them here._]

So, what's going on here? If you think I'm handling some edge cases, you'd be right.

The function takes in the origin link of the site. It fetches that home page. And then it uses cheerio to see if at least one of two types of links to the RSS feed are found in the head of the page.

As I worked through building this, I encountered four scenarios:

1. There was no link found in the head of the page.
2. There is a link and it starts with "http," so I can return it as the full URL to the RSS feed.
3. There is a link, but it's a relative link, it starts with a forward slash, so I have to prepend the site's origin to it to generate the full URL.
4. There is a link, but it's a relative link that doesn't start with a forward slash, so I have to prepend the site's origin and a slash to it to generate the full URL.

These seem to cover all the bases for the posts on the [11ty Bundle site](https://11tybundle.dev).

You'll note that I'm caching two things here. First, I'm caching the RSS feed link (from any prior builds), using the site origin as the key, so when I attempt to find it again, I just return the cached version and can avoid the fetch and the cheerio processing. Second, the [eleventy-fetch plugin](https://www.11ty.dev/docs/plugins/fetch/) is caching the home page content itself, so subsequent builds don't have to fetch it again.

Ok, there's actually a fifth scenario that I didn't mention. That is where the post's author has a site of their own, but the blog post that they wrote was published on another site. One example is for posts you might find on a site like [Frontend Masters](https://frontendmasters.com/blog/). In this case, the link to the RSS feed, as I calculate it is actually a link to the RSS feed of the Frontend Masters site. The bad news is that there's not a lot I can do about that. The good news is that there are very few posts that fall into this category. As they say, "it is what it is."

But wait, there a sixth scenario, and that's where the site has more than one RSS feed. Some authors are generating feeds for subsets of their site's content, which is a good thing. I'm only extracting the first feed that I find in the head of the site. I'm banking on it being the main feed.

Overall, I think this is all pretty cool.

## Where's your feed? Please add it to your site

Now that the site is built with this stuff, you'll see some bundle items that do not show an RSS feed link. That is not necessarily because there isn't one. On some of the sites that do not have a link in the head of their home page, I have found displayed links to the site's RSS. The only problem is that I'm only looking for the link in the head, per Jim Nielsen's advice.

Perhaps I could look a little harder, and I'm sure that some RSS readers do, but for now, I'm happy with this as a start.

## More visitors follow more authors, and that's a win!

If this results in more site visitors finding more authors that interest them, and following their RSS feed, that's a win! So, as of today, you can browse [the "bundle,"](https://11tybundle.dev) find a post by an author you like, right-click on the link that says _"RSS feed"_, and copy the link into the feed reader of your choice.

What's not to like?

## What else could be done?

Funny you should ask. One idea I have is to generate an OPML file of all the feeds for the sites that have them. This could be available for download somewhere on the site. That said, it sounds like a bit of overkill since there are 350 authors (even though I cannot find feeds for all of them). But, it's an idea. [Drop me a line](mailto:bob.monsour@gmail.com) if you think it's a good idea; or hit me up on [Mastodon](https://indieweb.social/@bobmonsour).
