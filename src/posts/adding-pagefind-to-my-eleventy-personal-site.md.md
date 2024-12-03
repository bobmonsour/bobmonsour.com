---
title: Adding pagefind to my Eleventy personal site
date: 2023-12-06
tags:
  - 11ty
description: I've been wanting to add search functionality to this site for a while. Pagefind made it simple.
keywords: site search, pagefind, eleventy
image:
  source: "adding-pagefind-to-my-eleventy-personal-site.jpg"
  alt: "a magnifying glass sitting on a blue surface"
  creditPerson: "Markus Winkler"
  creditLink: "https://unsplash.com/@markuswinkler"
pageHasCode: true
---

[[toc]]

---

## Introduction

The more blog posts that I write, I've begun to wonder about how best to organize the growing archive. Should the archive show a paginated list of posts? Should they be grouped by date where the posts can be viewed by year or month? The [11tyBundle.dev firehose](https://11tybundle.dev/firehose/) groups post by year, allow a viewer to collapse each year.

Those are certainly viable approaches.

The main reason I go to my own site is to find a post I'd written about something. The key word in that last sentence is "find." I might remember writing a particular sentence or mentioning a topic in a post. Going through pages of posts or expanding and collapsing dates yield just a small amount of the content, typically titles and maybe an excerpt of the displayed posts.

So, how else could I "find" posts that might mention something I recall writing? With full text search functionality, of course.

The approaches I often use to "find" something on a site or page, whether on my site, in the [11tybundle.dev firehose](https://11tybundle.dev/firehose/), are the search functionality built into the site or the browser's "find on page" functionality.

With that background, I decided to add full text search capability to this site. Yeah, it's that somewaht grotesque search bar you see at the top of this post.

Well, this post is all about how I added search to this site.

## Pagefind from CloudCannon

I remember in the olden days when you wanted to add search to a site, you could use a Google widget to generate site-specific search results.

But in these modern times, far better solutions exist, especially for static sites like this one, built with tools like [Eleventy](https://www.11ty.dev/).

I'd read about third-party search things like [Algolia](https://www.algolia.com/). But they felt like a lot more than I wanted or needed. Then I read about [pagefind from CloudCannon](https://cloudcannon.com/blog/introducing-pagefind/). And then a few months ago, as part of the Eleventy Meetup, the author, [Liam Bigelow](https://fosstodon.org/@bglw), gave [a presentation](https://www.youtube.com/watch?v=_4WsZeXMOKQ) showing how easy it was to integate with Eleventy. I was psyched. And, more recently, the project reached it's 1.0 milestone. I had no more excuses.

If you're interested, you can [learn more about pagefind](https://pagefind.app/).

## Getting it working in development

Like most things I try, it usually turns out to be a lot simpler than I expected.

To get this working in development, I just followed the [quick start](https://pagefind.app/docs/). I dropped the following code into the main section of my default page layout:

```html
<link href="/pagefind/pagefind-ui.css" rel="stylesheet" />
<script src="/pagefind/pagefind-ui.js"></script>
<div id="search"></div>
<script>
	window.addEventListener("DOMContentLoaded", (event) => {
		new PagefindUI({ element: "#search", showSubResults: true });
	});
</script>
```

Then, I ran a development build of the site, stopped it, and ran the following command to index and serve the site (note that my eleventy output directory is set to \_site):

```bash
npx -y pagefind --site _site --serve
```

From there, I open the browser to localhost:1414, and voila, a working search bar appears at the top of every page of my site. And it generates actual search results (perhaps too many, but I'll come back to that). Insanely simple, right?

## Integrating with the production build

With me being on the less impatient end of the patience spectrum, I immediately committed this to my repo and pushed it to production. And voila, there was no search bar anywhere to be found. As they say, read the f--king documentation! Rookie mistake, I know.

So I went back to the docs and came to understand that I needed add a postbuild script to my package.json so that the index would be built right after eleventy did its thing.

So I added the following script:

```json
"postbuild": "npx -y pagefind --site _site",
```

With that, I again pushed to production and this time it worked.

## Refining what gets indexed

Ok, so now that it works, what's the problem. Well, the problem is that certain search terms, for example, those that show up in the post title, also show up in the next and/or previous links that appear at the bottom of each post. They add useless noise to the search results.

By default, pagefind starts indexing at the start of the body tag.

Thankfully, pagefind also has an excellent way to designate content that should be excluded from the index. Simply add the attribute data-pagefind-ignore to the area to be excluded and it will not appear in the index.

I had to add a div so that there would be an element to add the attribute to, and it looks like this:

```jinja2{% raw %}
  <div data-pagefind-ignore>
    {{ tagList(tags) }}
    {%- if collections.posts %}
      {%- set previousPost = collections.posts | getPreviousCollectionItem %}
      {%- set nextPost = collections.posts | getNextCollectionItem %}
      {%- if nextPost or previousPost %}
        <ul class="post-nextprev">
          {%- if previousPost %}<li>Previous: <a href="{{ previousPost.url }}">{{ previousPost.data.title }}</a></li>{% endif %}
          {%- if nextPost %}<li>Next: <a href="{{ nextPost.url }}">{{ nextPost.data.title }}</a></li>{% endif %}
        </ul>
      {%- endif %}
    {%- endif %}
  </div>{% endraw %}
```

And with that, the index covers each page's content, no more, no less. There are a lot more [filtering options](https://pagefind.app/docs/filtering/) with pagefind but this was all I needed (at least for now).

## Styling the search box

Ok, it worked, but I didn't like the way it looked. Pagefind comes with a default CSS file to style the search bar and the results. It declares a bunch of CSS custom properties that can be overwritten. But I had to move the CSS file reference from the default layout and up to a place in my head declaration so that my overwrites of the properties would take effect after pagefind's CSS loaded.

I just made a couple of color tweaks to make the search bar more visible, but I plan to make it look better, i.e., a little smaller and with colors that make more sense with the site. Until then, it is what it is. Give it a try.

## Conclusion

As you can see, it is incredibly easy to add site search functionality to an Eleventy site (or any static site for that matter).

So, what is the downside? Adding pagefind to my site adds about 500 KB to my build. The index is less than 100 KB and there's some client-side javascript that has to come along for the ride.

Do I think it's worth it? Absolutely!
