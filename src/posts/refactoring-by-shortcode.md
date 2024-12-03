---
title: Refactoring by shortcode
date: 2024-02-19
tags:
  - 11ty
description: I decided to take on some overdue refactoring of the 11tybundle.dev site. Here's what I did.
keywords: refactor, shortcode, 11tybundle.dev
image:
  source: "refactoring-by-shortcode.jpg"
  alt: "A programmer feverishly refactoring some code"
  caption: "A programmer feverishly refactoring some code"
pageHasCode: true
---

<div class='toc'>

# Table of Contents

[[toc]]

</div>

---

## Introduction

I've been tinkering with the [11tybundle](https://11tybundle.dev/) site here and there, doing things like:

- adding Robb Knight's [post graph plugin](https://github.com/rknightuk/eleventy-plugin-post-graph)
- adding [pagefind search](https://pagefind.app/) to the whole site
- adding webmentions to the occasional blog posts
- redesigned the category page listings
- featuring the [11ty conference announcement](https://conf.11ty.dev/)

But in the back of my mind, I had some technical debt that I had been ignoring. Nothing major, but it was time to deal with it. There are two things on my debt list:

- simplifying the site's CSS
- removing the redundancies in how posts are displayed

## Displaying the posts

I'm saving the simplification of the CSS for later. For this post, we'll tackle the dreaded redundancies.

The lists of blog posts that appear on the site show up on several different pages of the site. You can find them on:

- every category page
- every author page
- the firehose page
- the site's own blog posts

Each post has the same set of basic ingredients (as [retrieved from a Google Sheet](/posts/scratch-that-use-google-sheets-api/)):

- post title
- link to the post
- description fetched from the post
- post author
- post date
- set of categories assigned to the post

I consider this set of elements to be properties of what I call a "bundleitem." In fact, the json that I fetch from the source of all the items is an array of these. They also include a type, for example, they can be a "blog post," a "release," a "site," or a "starter."

I'm only dealing with "blog posts" as bundleitems in this exercise.

## But they're all a little different

Each of these had a similar structure for the html of the posts...but they varied in subtle ways.

I made a few stabs at removing the redundancy.

At first, I thought I could just put the elements of each post into an include...until I discovered that having an asynchronous filter in the include wouldn't fly. The description uses an asynchronous filter on the link to fetch it.

On the category pages, the main focus is the category for each of the posts displayed.

On the author pages, the main focus is the author of each of the posts displayed.

On another attempt, I turned a couple of the lines of each entry into macros. It worked fine, but in my mind it was messy and hard to read. It looked like this on the firehose template:

```jinja2 {% raw %}
<div class="bundleitem">
	{{ itemTitle(item.Title, item.Link) }}
	<p class="bundleitem-description">{{ item.Link | getDescription | truncate(100) }}</p>
	{{ itemDateline(item.Author, item.Date) }}
	<p class="bundleitem-categories">Categories: {% for category in item.Categories  | sort %}<a href="/categories/{{category | slugify }}/">{{ category }}</a>&nbsp;&nbsp;{% endfor %}</p>
</div>{% endraw %}
```

In hindsight, the itemTitle macro doesn't buy much and I think it hurts overall readability. The itemDateline macro displays the author and date for the post on the same line. Overall, this whole bundleitem div looks awkward.

Lastly, once I added pagefind search to the site, I needed to tune the weights of various lists of posts. I wanted the category pages to have the highest weights, meaning that those pages (which collectively represent all of the site's posts) would appear first in the search results. The author pages were to have the second highest weight, and the site's blog posts, and the firehose would have the lowest weights. This required adding a data-pagefind-attribute to each of the h2 elements that are used for the post titles. This made these bundleitems differ yet again.

While this added complexity, it was certainly doable, but it caused me to consider ways to rethink the entire single post construct.

## An interim step before short-coding

Before heading to shortcode-land, I decided to take an interim step. This involved using the nunjucks 'set' to set up a context such that I could then include a partial to generate the html for the bundleitem.

The setup looked like this (for a day or 2):

```jinja2 {% raw %}
{%- set singleItem = item -%}
{%- set singleItemID -%}{{ author[0] | cachedSlugify }}-{{ item.Title | cachedSlugify }}{%- endset -%}
{%- set singleItemDescription = singleItem.Link | getDescription | truncate(100) -%}
{%- set pagefindWeight = "5" %}
{%- include "partials/singleitem.njk" -%}{% endraw %}
```

An item was the object containing all of the main properties of a post. I needed to generate a unique ID for each title's h2 so that pagefind could link directly to that post from the search results. A slug of the author combined with a slug of the title felt sufficiently unique.

The particular instance above was used for the page of a specific author's posts, where the pagefindWeight was set to 5.

If I'm honest, I still didn't like the looks of this and it was in a bunch of templates. It looked fat (no weight-ist). It worked, but I wanted to do better.

For a brief moment, I wondered if I should consider turning this into a "web component". I knew that I still had a lot to learn before deciding on which component approach to take. I wanted a fix sooner than that. And when I finally do get around to web components, I want to have played with them a bit.

So, I decided instead to turn the html generation for a post item into a shortcode. I knew that it could include asynchronous calls...so off I went.

## Shortcode to the rescue

As this was my first ever shortcode, I read what I could in the docs and various blog posts. I was familiar with the [Eleventy Image plugin](https://www.11ty.dev/docs/plugins/image/) and its associated shortcode.

Typical for my initial approaches, I tried to make a shortcode that did way too much. I should have just gotten the shortcode plumbing installed before turning on the water. But no, I was foolishly impatient.

Ultimately, I had to turn off the water and disconnect the pipes and set up one pipe at a time. This was a much less frustrating approach and more amenable to debugging. For those of you far more experienced than I at this, it's ok to chuckle here. I can laugh at this now too.

AAAAANNNNDDDD NNNOOOOOWWWW...

So, with the shortcode implementation, here's what each "bundleitem" instantiation looks like. This is the specific instance used for generating each category page's set of bundleitems (generated via pagination; hence the category[0]).

```jinja2 {% raw %}
{% singlePost item, "category", category[0] %}
{% endraw %}
```

The 3 parameters passed into this shortcode instance are:

- the bundleitem object as defined earlier
- the type of page being generated, which implies the needed page weight
- the category name assigned to all of these posts

And here is the shortcode that does all the not-so-heavy lifting to generate the html for each bundleitem:

```js
eleventyConfig.addNunjucksAsyncShortcode(
	"singlePost",
	async function (post, type, idKey) {
		const titleSlug = cachedSlugify(post.Title);
		const description = await getDescription(post.Link);
		const authorSlug = cachedSlugify(post.Author);
		const date = formatItemDate(post.Date);
		const id =
			'"' + cachedSlugify(idKey) + "-" + titleSlug + "-" + post.Date + '"';
		switch (type) {
			case "category":
				pageWeight = 10;
				break;
			case "author":
				pageWeight = 5;
				break;
			case "firehose":
			case "blog":
				pageWeight = 0;
		}
		let categories = "";
		post.Categories.forEach((category) => {
			let slugifiedCategory = cachedSlugify(category);
			categories += `<a href="/categories/${slugifiedCategory}/">${category}</a>`;
		});
		return `
	<div class="bundleitem">
		<h2 class="bundleitem-title" ID=${id} data-pagefind-weight="${pageWeight}"><a href="${post.Link}" data-link-type="external">${post.Title}</a></h2>
		<p class="bundleitem-description">${description}</p>
		<p class="bundleitem-dateline"><a href="/authors/${authorSlug}/">${post.Author}</a> &middot; ${date}</p>
		<p class="bundleitem-categories">Categories: ${categories}</p>
	</div>`;
	}
);
```

This works and makes each of the pages that use the shortcode much smaller and reason-able. For example, here is the loop that wraps the shortcode instance to generate all of the category pages.

```jinja2 {% raw %}
<div class="bundleposts" data-pagefind-body>
  {% for item in bundledata.bundleRecords | postsInCategory(category[0], 0) %}
    {% singlePost item, "category", category[0] %}
  {% endfor %}
</div>{% endraw %}
```

One unintended, but I consider positive side effect of this implementation is that the description is no longer truncated to 100 characters for each post item. There is the visual result of the post items no longer being all the same height, but I think that the added description when it exists provides more insight into the purpose of the post. I could certainly do the truncation in the shortcode, but when I saw the result without it, I thought it was better for readers.

## Outstanding issues

While this works well for my purposes, I have a small mess on my hands with respect to my eleventy config. If you noticed, I use a filter called cachedSlugify, which was featured in my post called [Slashing by caching](/posts/slashing-by-caching/). It relies on the slugify filter included with Eleventy. That filter lives directly inside of my eleventy config file and makes use of the getFilter function in Eleventy. I made an attempt to move it into my filters file where all of my other filters are located, but I couldn't get it to work. And since the shortcode relies on it, I took the path of least resistance and placed the shortcode directly in my Eleventy config too. I'll figure this out at some point, but for now I'm happy to get the shortcode working. Redundancies be gone!

## Conclusion

As with most of my posts about this site or the [11tybundle.dev](https://11tybundle.dev/) site, I learn a ton. I grind sometimes for hours and days, but the learning is in the grinding.

I've got a "to do" list of other things and I'll likely write about the ones that I find most challenging.
