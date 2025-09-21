---
title: CSS Class Dismissed?
description: null
date: 2025-09-20
tags:
  - 11ty
  - books
  - CSS
  - learned
image:
  source: css-class-dismissed.jpg
  alt: 3 O'Clock on a clock
  creditPerson: DuoNguyen
  creditLink: https://unsplash.com/@duonguyen
draft: true
pageHasCode: true
rssid: d386be124022ca46806f4999814b7168
---

[[toc]]

## Introduction

Having recently launched a redesign of this site, one of the pieces of inspiration came from a post by [Adam Stoddard](https://aaadaaam.com/), titled [There’s no such thing as a CSS reset](https://aaadaaam.com/notes/useful-defaults/).

Over the years, I've followed the various evolution of CSS resets, from the original [Eric Meyer reset](https://meyerweb.com/eric/tools/css/reset/) to Josh Comeau's [A Modern CSS Reset](https://www.joshwcomeau.com/css/custom-css-reset/) to Andy Bell's [A (more) Modern CSS Reset](https://piccalil.li/blog/a-more-modern-css-reset/). No doubt I've missed some of the others.

Adam's post made me think about the idea of a CSS reset and how I might want to approach it differently. In his post, Adam talks about the idea of "useful defaults" and how he prefers to set up his CSS in a way that is more aligned with the design system he is working with. This resonated with me. My CSS skills are marginal at best and I knew that I had some serious bloat by way of adding classes to things over and over again...need to style a thing, add a class to it. Rinse and repeat. Needless to say, things become increasingly difficult to maintain when you want to make a change or redesign a site, even one as small as this one.

Let me walk you through my thinking and process.

## The redesign

When I started the redesign effort, I decided that I was going to start with raw HTML and CSS. I did a "view source" of my home page, threw it into a new file, and started stripping out everything that wasn't necessary. I also started with a fresh CSS file. It's amazing how liberating, yet intimidating that process can be. I found myself experimenting with different layouts, colors, and typography without the baggage of all the previous classes and styles. And the design turned out way different from what I had in mind when I started. It became a fun process once I got over the nervousness of starting from scratch.

Then, when it came time to integrate the elements of this new design into the site, to be honest, I was quite apprehensive. It was (for me) a significant undertaking. That said, I decided that I was going to follow along with the ideas from Adam's post, consider all of the content on my site, and create a base set of styles that would apply to nearly all of the elements on the site. In other words, I could style links, headings, paragraphs, lists, etc. in the form that they would most likely appear on the site...what you might call "useful defaults." This would have the effect of forced consistency across the site. You design system nerds out there might be laughing at this point, but like I said, my CSS skills ain't great.

I already had a file of custom properties that I was using for colors, fonts, font sizes, etc., so I made the necessary adjustments to those for the new design. With this setup, most of the content on the site would be styled appropriately without the need for adding classes to things. See the "class dismissed" part of the title of this post.

The next thing I realized was that rather than the five layouts that I had been using, all I really needed was three: one for the home page, one for blog posts, and one for the rest of the pages on the site.

## A brief digression

One of the features you'll see on the site are some selected background images. These are all photos from my early childhood, each with one or more family members. The background sit on the body element and since they don't fit within the content area, I pre-optimized them "by hand" to be as small as possible while still looking good. The way they are added to the body element is by way of a style tag in the head element. It looks like this:

```html
<style>
  body {
    {% raw %}{% if page.url | whichBgImage === "" %}{% endraw %}
      background-image: none;{% raw %}
    {% else %}{% endraw %}
      background-image: url("{% raw %}{{ page.url | whichBgImage }}{% endraw %}");{% raw %}
    {% endif %}{% endraw %}
  }
</style>
```

Based on the page url, supplied by Eleventy, I've set up a simple filter to return the appropriate image file name. If there is no image for that page, then the background image is set to none (as on the individual blog post pages). I like the way it works. I might make the filter the subject of a future post as that is not what this is about. Consider this a digression from the main topic of this post (and accept my apologies for the digression).

## Web components you say?

Wouldn't you know it, just as I was getting satisfied with my new approach to CSS, Adam wrote another post, this one titled [This website has no class](https://aaadaaam.com/notes/no-class/). In it, he refers back to the earlier post where he says:

> Think of elements like components, but ones that come packed in the browser. Custom elements, without the “custom” part. You can just like, use them.

But it was the sentence in this later post that got me thinking:

> By virtue of their progressively enhanced nature, custom tag names and custom attributes are 100% valid HTML, javascript or no.

What? Does this really work? Can you just make up an element name, use it, and then style it as if it was one of the standard HTML elements? I had to try it.

Here's what I did, and it shocked this old dog. This is what the HTML and css looked like for a book item, as seen on the [Books page](/books/):

```jinja2
<div class="bookitem">
  {% raw %}{% set bookshop_base = "https://bookshop.org/a/109591/" %}{% endraw %}
  <a href="{% raw %}{{ bookshop_base}}{{ book.ISBN }}{% endraw %}">
    {% raw %}{% if book.localCover %}{% endraw %}
    <img
      eleventy:ignore
      src="/assets/img/{% raw %}{{ book.title | slugify }}{% endraw %}.jpg"
      alt="{% raw %}{{ book.title | safe }}{% endraw %}"
    />
    {% raw %}{% else %}{% endraw %}
    <img
      eleventy:ignore
      src="https://covers.openlibrary.org/b/isbn/{% raw %}{{ book.ISBN }}{% endraw %}-M.jpg"
      alt="{% raw %}{{ book.title | safe }}{% endraw %}"
    />
    {% raw %}{% endif %}{% endraw %}
  </a>
  <a href="{% raw %}{{ bookshop_base}}{{ book.ISBN }}{% endraw %}" data-link-type="external">
    {% raw %}{{ book.title | safe }}{% endraw %}
  </a>
  <p>by {% raw %}{{ book.author }}{% endraw %}</p>
</div>
```

And the associated CSS:

```css
.bookitem {
  align-items: center;
  display: grid;
  grid-template-rows: auto auto auto;
  justify-items: center;
  text-align: center;
  a {
    font-weight: bold;
    img {
      height: auto;
      margin-block-end: 0.5em;
      width: 180px;
    }
  }
}
```

And here's what I changed the HTML to:

```jinja2
<book-item>
  {% raw %}{% set bookshop_base = "https://bookshop.org/a/109591/" %}{% endraw %}
  <a href="{% raw %}{{ bookshop_base}}{{ book.ISBN }}{% endraw %}">
    {% raw %}{% if book.localCover %}{% endraw %}
    <img
      eleventy:ignore
      src="/assets/img/{% raw %}{{ book.title | slugify }}{% endraw %}.jpg"
      alt="{% raw %}{{ book.title | safe }}{% endraw %}"
    />
    {% raw %}{% else %}{% endraw %}
    <img
      eleventy:ignore
      src="https://covers.openlibrary.org/b/isbn/{% raw %}{{ book.ISBN }}{% endraw %}-M.jpg"
      alt="{% raw %}{{ book.title | safe }}{% endraw %}"
    />
    {% raw %}{% endif %}{% endraw %}
  </a>
  <a href="{% raw %}{{ bookshop_base}}{{ book.ISBN }}{% endraw %}" data-link-type="external">
    {% raw %}{{ book.title | safe }}{% endraw %}
  </a>
  <p>by {% raw %}{{ book.author }}{% endraw %}</p>
</book-item>
```

And its associated CSS:

```css
book-item {
  align-items: center;
  display: grid;
  grid-template-rows: auto auto auto;
  justify-items: center;
  text-align: center;
  a {
    font-weight: bold;
    img {
      height: auto;
      margin-block-end: 0.5em;
      width: 180px;
    }
  }
}
```

The only changes are from `<div class="bookitem">` to `<book-item>` and from `.bookitem` to `book-item`.

So, what I've got here is a custom element named `book-item`. It has no special behavior, it is just a container for the book information. But it works! The browser recognizes it as a valid element and applies the styles to it. No class needed. If I wanted, I could enhance its "behavior" with some JavaScript, but I don't need to. It works just fine as is.

## Is this the right thing to do?

I have to say that I have the distinct advantage of being a hobbyist who can try anything and get away with it. I work alone on the projects that I build.

So, for me, this works and I like it. It might not make sense for a team of developers working on a large project...yet that would be possible with the right kind of component design system in place.

And I've tested this in Chrome, Firefox, and Safari. It works in all three (on macOS).

This is the only part of the site that I've done this with, but I can imagine applying this same thinking to the [11ty Bundle](https://11tybundle.dev) site. I want to apply some of the same "useful defaults" thinking to that site as well, along with the idea of custom elements. We'll see how that goes.

## CSS Nesting

As a former advocate of Sass, I had really started to miss the nesting ability. Back in 2023, I had written a piece about my [The evolution of my CSS pipeline](https://bobmonsour.com/blog/the-evolution-of-my-CSS-pipeline-in-eleventy-part-1/#do-i-really-need-sass%3F). That link will send you to the part where I asked "Do I really need Sass?", where I noted that nesting was just emerging as a CSS native feature. Well, since that time has arrived, I have embraced it and it has helped reduce the number of classes that I need to accomplish what I want to do. I find that it can also help with CSS readability and maintainability.

## Utility classes

While I have tried to develop a body of "useful defaults" for the site, there have been a few instances where I wanted to "nudge" something a bit differently. For these cases, I created a set of utility classes that I could apply as needed. They revolve largely around spacing and alignment. I have read a lot about utility-first CSS and have developed an understanding of things like Tailwind, but I have never gone down that road until now. I prefer lightweight solutions and I want the HTML to remain lean and readable to me, so I've tried to limit the number of utility classes and will likely try to reduce the number even further over time.

## Something I haven't tried yet - Cascade Layers

In Adam's [second post](https://aaadaaam.com/notes/no-class/), he has embraced CSS layers. While I have given this some thought, I have not yet tried them as my mental model for them is not yet fully formed. I can see how they would be useful in a larger project, but for my small site, I'm not sure that they are necessary. That said, I do want to learn more about them.

## Some other inspirations that came into play

In addition to Adam's posts, there were a couple of other ideas that crept into my redesign along the way. They just happened to arrive at the right time during the redesign process. Here are a few of them:

- [CSS Classes considered harmful](https://www.keithcirkel.co.uk/css-classes-considered-harmful/) by [Keith Cirkel](https://www.keithcirkel.co.uk/). Adam drew inspiration for his posts from this one. It's a good read.

- [Style your underlines](https://adactio.com/journal/22084) by [Jeremy Keith](https://adactio.com/). I hadn't realized far things had come with the ability to style underlines.

- [Jim Nielsen's blog archive](https://blog.jim-nielsen.com/). It's clean and simple. I've added a description and tag list for each post [on mine](/blog/), in addition to the title and date, so it's not quite as minimal.

- Ryan Mulligan's [Layout Breakouts with CSS Grid](https://ryanmulligan.dev/blog/layout-breakouts/) was part of the original site, pre-redesign, but I retained it for its flexibility and simplicity.

## Conclusion

The redesign of this site has been a fun process. I've learned a lot about CSS and how to think about it differently. The idea of "useful defaults" and custom elements has opened up new possibilities for me. I'm excited to see where this takes me in the future.

<hr>

P.S. Now that I've written this post, I need to open the branch with the change to the "book item" component and merge it into main. Fingers crossed. I'll see you on the other side.

P.P.S. If you have any thoughts or questions, please feel free to reach out via the comment by email link below.
