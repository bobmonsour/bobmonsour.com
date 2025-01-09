---
title: Going all in with 'native' markdown
date: 2024-12-03
tags:
  - 11ty
description: I've been typing way too much. There are simpler ways to use markdown for images and tables of contents. Here's how I'm doing it.
keywords: markdown, table of contents, images, eleventy
image:
  source: "going-all-in-with-native-markdown.png"
  alt: "The markdown logo"
pageHasCode: true
---

[[toc]]

## Introduction

It has taken me a while, but I'm becoming more comfortable with markdown, and specifically plugins for the [markdown-it]() markdown parser. Up until now, I had been doing a few things in a rather brute force way and it was taking more effort than I thought it should. And it was one of those bits of friction that has kept me from writing more posts like this one. Let me explain.

## Images & captions

One example related to my recent conversion, on this site, to using the [eleventyImageTransformPlugin]() for all the images on this site. It has dramatically sped up my local build times, taking them from around 15 seconds to around 1 second. I wrote [a recent post about the build speed improvement](/posts/fast-as-hell/), but I didn't go into any detail.

By deciding to use this plugin, I went back to all of the image references in my layouts and blog posts, be they of the former shortcode version of the plugin or simple `<img>` tags and replaced them with markdown image syntax. Note that it was not the markdown conversion that sped up the build times, it was the plugin. I just wanted to improve how I wrote image tags in my posts. The post I linked to in the prior paragraph talks about why the build times are so much faster.

Before going into the markdown-related part of this, here's what my configuration of the transform plugin looks like in my eleventy config file.

```javascript
eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
	extensions: "html",
	outputDir: "/assets/img/",
	formats: ["webp", "jpeg"],
	widths: [300, 600, 900, 1200],
	defaultAttributes: {
		loading: "lazy",
		sizes: "100vw",
		decoding: "async",
	},
});
```

What's nice, as with the former shortcode, is that I can specify some default values for things like loading and sizes.

When doing that, I still wanted to be able to have some context-specific control over the images that were generated. For example, I might have an image that sits high above the fold in a blog post or a microblog post. And I might want to override the default of `lazy` loading with `eager` loading.

To do that, I followed the advice of [Aleksandr Hovhannisyan]() in his post titled [Eleventy Images Just Got Better](https://www.aleksandrhovhannisyan.com/blog/eleventy-image-transform/). Specifically, his use of the [markdown-it-attrs](https://www.npmjs.com/package/markdown-it-attrs) plugin.

What this lets me do is something like this:

```js
![Happy Thanksgiving...see the Turkey?](/assets/img/turkey.png){loading="eager" sizes="500px" style="margin: 0 auto;}
```

You can find this image in my recent [Thanksgiving microBlog post](/microblog/happy-thanksgiving-2024/).

Here, I am overriding the `loading` and `sizing` attributes and also injecting some inline styling. I like this a lot more than getting out of markdown and back into HTML to do this kind of thing.

And since some of my images have captions that immediately follow the images. I can have a caption that looks like this in markdown. It adds the class `caption` to that particular paragraph.

```markdown
Your roof is leaking {.caption}
```

You can find this one in the [post about my first knee replacement](/posts/my-winding-road-toward-knee-replacement-surgery/).

## Tables of contents

A bunch of my longer posts have tables of contents. I added one to this piece even though it's not that long.

After digging into how various people have built tables of contents with eleventy, I did some digging and decided to use the [markdown-it-table-of-contents plugin](https://github.com/cmaas/markdown-it-table-of-contents). It's simple to use and works well.

Priot to using it, here's how I might have done a table of contents at the start of this post that you're now reading.

```js
## Table of Contents

- 1. [Introduction](#section1)
- 2. [Images & captions](#section2)
- 3. [Tables of contents](#section3)
- 4. [Conclusion](#section4)
```

And then at the start of each of those sections of the file, I would have something like this:

```js
<section id="section1"></div>

## 1. Introduction
```

I know...pretty lame. It was just what I figured out at the time I first started doing them. Needless to say, like many of us, I'm still learning.

There are myriad problems with this. First, since I chose to use numbered sections, whenever I wanted to reorganize the sections, I'd have to keep them in sync in two places. And I often would rewrite the section titles, which again required me to take care to keep them in sync. What a royal pain in the ass.

With a minor change to my approach, and making use of both the markdown-it-table-of-contents plugin along with the [markdown-it-anchor plugin](https://github.com/valeriangalliat/markdown-it-anchor#readme), things have gotten dramatically simpler.

First, at the top of the blog post, all I need is this:

```markdown
[[toc]]
```

And then for each section of the document, all I need is the heading, like so:

```js
## Introduction
```

I have decided to remove the numbering as I don't think it adds much to the nature of the content.

Among the options, I've configured the plugin to:

- select what heading levels it should process
- use a specified HTML string as the toc header
- choose to use a `ul` or `ol` as the list style

With all this in mind, here is what my markdown-it configuration looks like in my eleventy config file:

```javascript
// set up the markdown-it library
import markdownIt from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";
import markdownItAnchor from "markdown-it-anchor";
import markdownItToc from "markdown-it-table-of-contents";
const markdownItOptions = {
	html: true,
	breaks: false,
};
const markdownItTocOptions = {
	includeLevel: [2],
	containerHeaderHtml: "<h1>Table of Contents</h1>",
	listType: "ul",
};
const markdownLib = markdownIt(markdownItOptions)
	.use(markdownItAttrs)
	.use(markdownItAnchor)
	.use(markdownItToc, markdownItTocOptions);
```

> _UPDATE (12-4-24):_ I forgot to add the one additional line that you need in your eleventy config file to use this markdown library. Here it is:

```javascript
// Set markdown library
eleventyConfig.setLibrary("md", markdownLib);
```

## Conclusion

Using these powerful markdown capabilities, the friction for my writing and using images has been meaningfully reduced. I did the image-related conversion several days ago. And today, I converted the tables of contents for all of the blog posts that had them. For this post, it definitely reduced the friction of writing it.

I hope you find this helpful.
