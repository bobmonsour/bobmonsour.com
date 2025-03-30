---
title: Slashing by caching
date: 2024-01-31
tags:
  - CSS
description: I've reduced the build time for the 11ty Bundle site from 30 seconds to 10 seconds. Here's how.
keywords: caching, build time, 11ty
image:
  source: slashing-by-caching.webp
  alt: the word cache on a printed circuit board
  caption: The word 'cache' on a printed circuit board
pageHasCode: true
rssid: 67c0ea7c08e595b6099d5d1567035861
---

As the [https://11tybundle.dev/](https://11tybundle.dev/) site has grown, so has the build time. It was taking about 30 seconds to build the site. It was getting a bit frustrating to wait for a new build each time I wanted to test a small change. I wanted to see if I could reduce that time.

You see, every post has an entry in multiple places on the site. First, it is displayed once on the author's page, and then it's displayed within each of the categories to which it's assigned, and finally, it's displayed on the [firehose page](https://11tybundle.dev/firehose/). Oh, and there's one more page where it might be displayed and that is on the [Bundle Blog](https://11tybundle.dev/blog/) post page where it is first announced.

And for each of these "appearances," or renderings a few things happen. I use the [eleventy-fetch plugin](https://www.11ty.dev/docs/plugins/fetch/) to fetch the full html of the post. Each of these fetches is cached and their cache duration (set as an option to the fetch) is set to infinity as I do not expect the pages to change. They're blog posts after all and who changes their blog posts. I will admit that I, from time to time, make some minor changes to a post, but I don't expect that to happen often. And though a post may change, it is not often that the link to the post changes or the description of the post changes. So, I cache the fetches for a very long time.

Side note: from time to time I run a link checker to see if any of the links to the posts have broken. If they've moved, I try to find them and if I can't find them, then I remove them from the database. I use [dead link checker](https://www.deadlinkchecker.com/) which is both handy and free.

Two other things happen for each of these "appearances." In order to display a short description along with the title and link to the post, I use the [cheerio package ](https://www.npmjs.com/package/cheerio) to extract the content from the meta description tag in the head of the page. And since every rendering results in a call to the cheerio package to get the description, that seemed like a bit of overkill for posts that land on many of the nearly 400 pages that are built for the site.

My first thoughts on reducing the build time led me to consider reducing the number of cheerio calls.

I figured that if I cached the post description in a json object, using the url of the post as the key, I could query the cache before needing to make the cheerio call. And sure enough that reduced the site's build time from around 30 seconds to around 16 seconds. The wonderful thing is that this was so incredibly simple to implement.

Note that I have a filter called getDescription that takes the url for a post and returns the description. Here's the code for that filter...with caching implemented:

```js
const getDescription = async (link) => {
  // Check if the description is in the cache
  if (descriptionCache[link]) {
    return descriptionCache[link];
  }
  try {
    let htmlcontent = await EleventyFetch(link, {
      directory: ".cache",
      duration: "*",
      type: "buffer",
    });
    const $ = cheerio.load(htmlcontent);
    const description = $("meta[name=description]").attr("content");
    if (link.includes("youtube.com")) {
      descriptionCache[link] = "YouTube video";
    } else if (description == undefined) {
      descriptionCache[link] = "";
    } else {
      descriptionCache[link] = description.trim();
    }
    return descriptionCache[link];
  } catch (e) {
    console.log("Error fetching description for " + link + " " + e.message);
    return "";
  }
};
```

Note that for urls that are for YouTube videos, I just return "YouTube video" as the description. I don't need to fetch the description for those. And lack of a description in the meta tag results in an empty string being returned; similarly for an error on the fetch.

Well, that was an exciting result. Where else can I apply this for each of these "appearances"?

I had noted over time that the slugify filter was being called close to 10,000 times for each build. For those unfamiliar, slugify takes a string as input and converts it into a string that can be used in a url...converting things like "Author Name" to "Author-Name."

Now that I had caching working for the descriptions, it made total sense to apply it to slugify as well. The slugs are generated for the author names as well as the category names as I need to generate links for each of them.

> UPDATE (Mar 30, 2025): The following is no longer necessary as, starting with 11ty v3.0, the [unversal slugify filter](https://www.11ty.dev/docs/filters/slugify/) is now wrapped in a memoization layer, which has the effect of caching the results.

All I had to do was replace the slugify incarnation in my templates with my own filter that used caching before calling slugify. Here's what my cachedSlugify filter looks like:

```js
function cachedSlugify(input) {
  // Check if the slug is in the cache
  if (slugCache[input]) {
    return slugCache[input];
  }
  // If not, generate the slug and store it in the cache
  const slug = slugify(input);
  slugCache[input] = slug;
  return slug;
}
```

Note that since I'm using the [slugify package](https://www.npmjs.com/package/@sindresorhus/slugify) in a filter, I had to install it separately. Slugify is available in your Eleventy templates as a filter, but not as a package in my setup. So, I installed it and then used it in my filter.

With that in place, build times for the site are around 10 seconds. From 30 seconds to 10 seconds is a definite win...and I'm very happy with that...I only wish that I had thought of it sooner.
