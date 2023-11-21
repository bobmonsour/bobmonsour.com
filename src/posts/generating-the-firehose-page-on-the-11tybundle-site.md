---
title: Generating the Firehose page on the 11tybundle site
date: 2023-11-21
tags:
  - 11ty
description: Here's how the Firehose page of the 11tybundle.dev site is built.
keywords: firehose template, eleventy, 11tybundle.dev
image:
  source: "generating-the-firehose-page-on-the-11tybundle-site.jpg"
  alt: "A notebook of pages"
showImage: true
pageHasCode: true
---

## Table of Contents

<div class='toc'>

1. [Introduction](#section1)
2. [Where does the data come from?](#section2)
3. [The Firehose template](#section3)

</div>

---

<section id='section1'></section>

## 1. Introduction

I just added a feature to the [Firehose page](https://11tybundle.dev/firehose/) of the [11tybundle.dev](https://11tybundle.dev/) site. You can now collapse the list of posts by year. I thought I'd share how the page is built. The collapsing feature has been on my list of things to do, but I was feeling a bit intimidated by it. It turned out to be a lot simpler than I expected. I'm glad I finally got around to it.

<section id='section2'></section>

## 2. Where does the data come from?

First off, I think it's important to understand the format of the data that the Firehose template has available to it.

All of the blog post, site, starter, and release data is stored in a Google Sheet. I [wrote about how I go about fetching this data at build time](https://www.bobmonsour.com/posts/scratch-that-use-google-sheets-api/).

What I didn't share at the time, but has been the case since before moving the data to Google Sheets is that the global data file that fetches the data does a lot of processing to generate a bunch of useful items that are used throughout the site.

Here's a glimpse of what is returned by that global data file (you can see the [full file on GitHub](https://github.com/bobmonsour/11tybundle.dev/blob/main/src/_data/bundledata.js)). Oddly enough, it's called bundledata.js.

The data is returned as an object with a bunch of properties. Here's a list of the properties and what they contain. Aside from the counts, they are largely arrays of objects.

```js
return {
  bundleRecords,
  firehose,
  postCount,
  starters,
  starterCount,
  authors,
  authorsByCount,
  authorCount,
  categories,
  categoryCount,
  gettingStartedCount,
};
```

As you might imagine, this makes it very simple to generate all of the pages of the site. The Firehose page is no exception. The firehose array of posts is available as bundledata.firehose.

<section id='section2'></section>

## 3. The Firehose template

The Firehose template is written in nunjucks. You'll see that I am using eleventyComputed in the front matter so I can construct the title and page description using the post count from the global data file.

Once I realized that the simplest way to do the year by year collapsing of the posts was to use the [details disclosure element of html](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details), the intimidation level was greatly reduced. The only logic required as I looped through the posts was detecting the change of year, closing the previous details element, and opening a new one. This can easily be accomplished using nunjucks [set](https://mozilla.github.io/nunjucks/templating.html#set) and [if](https://mozilla.github.io/nunjucks/templating.html#if) statements.

Here's what the template looks like.

```yaml{% raw %}
---
eleventyComputed:
  title: "{{ bundledata.postCount }} Blog Posts"
  description: "A list of {{ bundledata.postCount }} blog posts by year"
permalink: /firehose/
---
{% endraw %}
```

```jinja2{% raw %}
<h1>{{ title }}</h1>
<h3>The Firehose has it's own <a href="/firehosefeed.xml">RSS feed</a>!</h3>
<div class="bundleposts">
  {# We've processed no posts...yet #}
  {% set previous_year = "no posts yet" %}
  {% for item in bundledata.firehose %}
    {# Post dates are formatted as yyy-mm-yy, so we can extract the year #}
    {% set current_year = item.Date | truncate(4, true, '') %}
    {#
      If there's a change from post to post in the year part of the date,
      and if it's not the first post, close the previous details tag and
      open a new one. And set the previous year to the current post's year.
    #}
    {% if current_year != previous_year %}
      {% if previous_year != "no posts yet" %}
        </details>
      {% endif %}
      <details open>
      <summary>{{ current_year }}</summary>
      {% set previous_year = current_year %}
    {% endif %}
    <div class="bundleitem">
      {# ...this is where we output the various elements of a post... #}
      {# ...title, author, date, and categories... #}
    </div>
  {% endfor %}
</div>
{% endraw %}
```

If you've got questions about any of this, please feel free to reach out to me on [Mastodon](https://indieweb.social/@bobmonsour).
