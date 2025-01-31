---
title: Upgrade 11ty to v3, reorg, ESM, and debug
date: 2024-06-28
tags:
  - 11ty
description: I upgraded to 11ty v3 and proceeded to debug.
keywords: upgrade, debug, eleventy, 11tybundle.dev, canary
image:
  source: upgrade-and-debug.jpg
  alt: Code snippet for generating data for the 11ty Bundle website
  caption: Opening lines of bundledata.js
pageHasCode: true
rssid: 4a55788ca94a7a09dfc9505e4b97781b
---

[[toc]]

_**TL;DR**: I proceeded to do 3 things...re-organize my eleventy configuration, upgrade to v3, and convert everything to ESM...all at the same time. And it turned out ok._

## Introduction

Call me crazy, stupid, or perhaps ambitious. But I had been wanting to clean up and re-organize the eleventy setup of the [11ty Bundle website](https://11tybundle.dev)...meaning everything about how the filters and shortcodes were organized and referenced and simplifying my configuration file.

I'd also been watching the forward march of the eleventy canary releases and I wanted to get on that train. I had upgraded early on, but then backed off to 2.0 (I forget exactly why). I had been reading the release notes and watching the issues and discussions on GitHub. I was ready to try the upgrade again.

I also thought it was time to put in the reps to make a full-fledged conversion to ESM. I had done it half-heartedly in the past and that had left me with a mix of CommonJS and ESM. I wanted to be all in with ESM.

So, why not attempt all three at the same time? I know, crazy, right? I had just put issue 49 of the bundle to bed and I had a week before the next one was due. And hey, isn't this what git branches are for?

Here's the story of some of my hurdles and discoveries. It all turned out ok.

## Let's start by upgrading to 11ty v3

For this, I referred to Zach's post titled ["Calling all courageous canary testers for Eleventy v3.0](https://www.11ty.dev/blog/canary-eleventy-v3/).

Ok, this looks simple...just...

```bash
npm install @11ty/eleventy@canary --save-exact
```

## Now let's reorganize the eleventy configuration

My eleventy config file was officially a mess. It was too big and there were a couple of functions inside of it that should have been in their own files. One was a fairly large shortcode that I had cooked up to refactor the display of bundle items on the site. I had run into a strange problem when trying to use the slugify filter that is included with eleventy. When I first attempted to put this shortcode in its own file, I could not figure out how to access that filter from the external file. So, I just put the shortcode in the eleventy config file and left it there. This was technical debt that I was not fond of.

I had seen [Lene Saile's eleventy config post](https://www.lenesaile.com/en/blog/organizing-the-eleventy-config-file/) and I had also been referred to the [code for Uncenter's website](https://github.com/uncenter/uncenter.dev), both of which are great examples of how to do what I wanted. Lene had also built the [eleventy-excellent starter](https://github.com/madrilene/eleventy-excellent) and it used a slufigy filter, but it was one that she installed as a separate dependency, rather than using the one eleventy has built-in. That served as the solution to my first issue.

My second issue was that almost all of my custom filters resided in a single, unwieldy file. I was getting tired of scrolling up and down as well as searching within that file to find what I wanted. It was time to break them out into separate files to make things more manageable.

I started by moving all of my filters and shortcodes into a folder called \_config, which I placed under the src directory. I had a config folder before, but for whatever reason, I had put it at the same level as src. I wanted things to be cleaner and putting \_config under src made a lot more sense to me. Filters would go in a filters directory under \_config and shortcodes would go in a shortcodes directory under \_config.

Then in the \_config directory, I created an index file for filters and one for shortcodes.

I like how the ultimate organization worked out.

```bash
.
├── filters
│   ├── cachedslugify.js
│   ├── formatting.js
│   ├── getbundleitems.js
│   ├── getdescription.js
│   ├── getrsslink.js
│   ├── iscurrentpage.js
│   ├── postsbyauthor.js
│   ├── postsincategory.js
│   ├── readingtime.js
│   └── webmentionsbyurl.js
├── filters.js
├── shortcodes
│   ├── image.js
│   └── singlepost.js
└── shortcodes.js
```

And here is what filters.js looks like. _Updated to reflect simplified filter imports as suggested by Uncenter._

```js
import { cachedSlugify } from "./filters/cachedslugify.js";
import { isCurrentPage } from "./filters/iscurrentpage.js";
import {
	formatItemDate,
	formatPostDate,
	formatFirehoseDate,
	formatNumber,
} from "./filters/formatting.js";
import { getBundleItems } from "./filters/getbundleitems.js";
import { getDescription } from "./filters/getdescription.js";
import { getRSSlink } from "./filters/getrsslink.js";
import { plainDate } from "./filters/formatting.js";
import { postCountByAuthor, postsByAuthor } from "./filters/postsbyauthor.js";
import { postsInCategory } from "./filters/postsincategory.js";
import { readingTime } from "./filters/readingtime.js";
import { webmentionsByUrl } from "./filters/webmentionsbyurl.js";
export default {
	cachedSlugify,
	isCurrentPage,
	formatItemDate,
	formatPostDate,
	formatFirehoseDate,
	formatNumber,
	getBundleItems,
	getDescription,
	getRSSlink,
	plainDate,
	postCountByAuthor,
	postsByAuthor,
	postsInCategory,
	readingTime,
	webmentionsByUrl,
};
```

Note that all of those formatting filters live in the formatting.js file. It made sense to keep these together as they do similar things. The two author-related filters live together too.

I had another thing to adjust in my eleventy config file. I had been using the eleventy-plugin-bundle as a separately installed plugin. I use it to aggregate the various CSS files into a single bundle file which then gets accessed in the head of each page. With v3, the plugin was integrated into the core of eleventy. So, I removed the dependency from my package.json and added the following bundle configuration to my eleventy config file:

```js
eleventyConfig.addBundle("css", {
	toFileDirectory: "bundle",
});
```

## Things are now quite broken

Attempting to build the site resulted in a bunch of errors, which I then proceeded to pick off on at a time. I had been unaware that eleventy does an eslint process over the javascript code that we use with eleventy (I think that's the case). Anyway, it surfaced a couple of functions where I was accessing a variable that had not been declared with a let, const (or, God forbid, var). I had to go back and add those declarations.

The other thing I ran into was a bunch of spelling errors, the result of the haste that I had used to get all of the filter and shortcode declarations in place. I had several of those.

## It was time to start ESM'ing

Things were still broken, but I figured that it was because I had done only some ESM conversions as I was reorganizing the filters.

With all of those filters and shortcodes in separate files, it was time to get them all over to ESM syntax, and then to properly import them into the eleventy config file. It took a while to get them all correct, meaning without any spelling or capitalization errors (though VS Code does a pretty good job with autocomplete). These were the reps I needed to get comfortable with ESM.

In essence, I changed all the .cjs extensions to .js and changed all of the require statements to import statements. I also had to change the module.exports statements to export statements. I did this in all of the filter and shortcode files as well as in the eleventy config file as well as in a handful of other files.

And here is how I bring all those filters into the eleventy config file:

```js
eleventyConfig.addFilter("cachedSlugify", filters.cachedSlugify);
eleventyConfig.addFilter("formatFirehoseDate", filters.formatFirehoseDate);
eleventyConfig.addFilter("formatItemDate", filters.formatItemDate);
eleventyConfig.addFilter("formatNumber", filters.formatNumber);
eleventyConfig.addFilter("formatPostDate", filters.formatPostDate);
eleventyConfig.addFilter("getBundleItems", filters.getBundleItems);
eleventyConfig.addAsyncFilter("getDescription", filters.getDescription);
eleventyConfig.addAsyncFilter("getRSSlink", filters.getRSSlink);
eleventyConfig.addFilter("isCurrentPage", filters.isCurrentPage);
eleventyConfig.addFilter("plainDate", filters.plainDate);
eleventyConfig.addFilter("postCountByAuthor", filters.postCountByAuthor);
eleventyConfig.addFilter("postsByAuthor", filters.postsByAuthor);
eleventyConfig.addFilter("postsInCategory", filters.postsInCategory);
eleventyConfig.addFilter("readingTime", filters.readingTime);
eleventyConfig.addFilter("webmentionsByUrl", filters.webmentionsByUrl);
```

There's a similar setup for the shortcodes.

## There was one more thing

One of the places where I had been using "require" to load a file was the JSON database containing all the data that drives the site's content. It was trivial to load it that way. But that's not an ESM thing. I had seen two different ways of making that work. One was from [this GitHub discussion](https://github.com/11ty/eleventy/discussions/3196#discussioncomment-9848028) that called for using node's fs module to read the file and then JSON.parse it. The other was to use the import statement with a file URL.

I didn't want to read and parse the file as I had no other use for the fs module. I thought that there had to be a simpler way. I had recently created a new category for bundle articles called [Upgrading](https://11tybundle.dev/categories/upgrading/), I recalled having seen [a post by Max Böck](https://mxb.dev/blog/eleventy-v3-update/) on how he went about upgrading to v3 and it included a way to access JSON files with ESM. And it looked really simple...it would work like this.

```js
import obj from "./bundledb.json" with { "type": "json" }
```

I tried it, but the build failed...kind of. The build actually succeeded in outputting the site in the directory and all of the data was there. But at the end of the build, I was getting both a node warning and an eleventy error message. The node warning told me that I was using an experimental feature and that its functionality could change at any time. But I had no idea what experimental feature it was talking about. I thought it might have to do with the import statement, but I wasn't sure. The eleventy error message was a bit more cryptic.

```bash
Eleventy CLI Error: (more in DEBUG output)
```

Ok, so I ran the build with debug and watched it build the entire site, only to finish and generate this error. The messages that followed referred to something called alpine, which I later learned is a javascript parser. Apparently, alpine doesn't know about the use of import with type JSON, so it barfed.

I decided to try something else. You see, I also use the pagefind search package to add search to the site's functionality. When I build the site locally, I often use a script that skips the pagefind indexing and serving step and I rely on eleventy to serve the site.

I decided to run the script that uses the pagefind and lo and behold, the site built and was correctly served at port 1414, pagefind's default port. This was good news and bad news as I was totally baffled.

I don't often ask for help and I spend a lot of time reading docs and using the usual debugging tactics to figure things out. This is how I learn and keep my mind engaged in reasoning about what is going on.

It was time to ask for help. I posted a cryptic message on Mastodon, but then went to the real source of knowledge, the Eleventy Discord server. I posted my question and within a few minutes, [Uncenter](https://uncenter.dev/) responded that he knew exactly what it was. He also offered the following technique to bring in the JSON file without using the import statement. It looks like this:

```js
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const bundleRecords = require("./bundledb.json");
```

I later learned that this was a known problem and that it was being discussed in [an eleventy GitHub issue](https://github.com/11ty/eleventy/issues/3128). Once I looked there, it was clear how Uncenter knew what it was as he had proposed that solution [back in January](https://github.com/11ty/eleventy/issues/3128#issuecomment-1878745864). Later that day, Zach posted that he improved the error messaging for this in the [3.0.0-alpha.14 release](https://github.com/11ty/eleventy/releases/tag/v3.0.0-alpha.14) (which he just release yesterday). Yay!

With that solved, I was ready to merge this very active branch (with about 25 files modified) back into the main branch, build it locally, and publish the new version of the site. You can now feast your eyes on an [11tybundle.dev](https://11tybundle.dev) that is totally up to date with the latest canary release, has a reasonably well-organized configuration, and is fully ESM. It was a good couple of days and I learned a ton.
