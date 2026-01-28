---
title: On not minifying CSS & JS (part 2)
description: So this is how I am now not minifying CSS and JS bundles in 11ty.
date: 2026-01-27
tags:
  - 11ty
  - CSS
pageHasCode: true
image:
  source: not-minifying-css-bundles.jpg
  alt: Code for bundling CSS files in 11ty
rssid: 63e3d8c30fdf1b7c0aef81ef4c33fd84
---

[[toc]]

## Introduction

It was as long ago as yesterday when [I wrote about how I had decided to not minify the CSS and JS bundles for the 11ty Bundle website](/blog/minify-that-css-bundle-maybe-not/). As stated in the update, the issue that was causing my long build times was not the minifying itself, but rather the way I had configured the CSS and JS bundling in the base layout file. This meant that for every page of the site, the CSS and JS bundles were being re-bundled and minified, leading to excessive build times. Eliminating the minification step dramatically reduced the build time.

That said, what I was left with was the bundling process happening for every page, though it is far less expensive. This did not sit totally right with me and some members of [the 11ty Discord community](https://www.11ty.dev/blog/discord/) suggested that I look at configuring the bundling outside of the base layout file so that the bundling only happens once per build, rather than once per page.

And so, here we are and here's how I've done exactly that.

## Before: The setup I described yesterday

Prior to today's changes, the following code snippet, and what was shown in yesterday's post is from the base layout file for the project.

```jinja2
  {% raw %}{# bundle the global css files #}{% endraw %}
  {% raw %}{% css "global" %}{% endraw %}
    {% raw %}{% include "public/css/fonts.css" %}{% endraw %}
    {% raw %}{% include "public/css/variables.css" %}{% endraw %}
    {% raw %}{% include "public/css/reset.css" %}{% endraw %}
    {% raw %}{% include "public/css/home.css" %}{% endraw %}
    {% raw %}{% include "public/css/global.css" %}{% endraw %}
    {% raw %}{% include "public/css/site-header.css" %}{% endraw %}
    {% raw %}{% include "public/css/site-footer.css" %}{% endraw %}
    {% raw %}{% include "public/css/pagefind.css" %}{% endraw %}
  {% raw %}{% endcss %}{% endraw %}

  {% raw %}{# load the global css file for all pages #}{% endraw %}
  <link rel="stylesheet" href="{% raw %}{% getBundleFileUrl 'css', 'global' %}{% endraw %}">

  {% raw %}{# bundle the channel-related css files #}{% endraw %}
  {% raw %}{% css "channel" %}{% endraw %}
    {% raw %}{% include "public/css/channels.css" %}{% endraw %}
    {% raw %}{% include "public/css/showcase.css" %}{% endraw %}
    {% raw %}{% include "public/css/blog.css" %}{% endraw %}
    {% raw %}{% include "public/css/prism-okaidia.css" %}{% endraw %}
    {% raw %}{% include "public/css/lite-yt-embed.css" %}{% endraw %}
    {% raw %}{% include "public/css/404.css" %}{% endraw %}
  {% raw %}{% endcss %}{% endraw %}

  {% raw %}{# conditionally load the channel-related css file #}{% endraw %}
  {% raw %}{% if channelsPage %}{% endraw %}
    <link rel="stylesheet" href="{% raw %}{% getBundleFileUrl 'css', 'channel' %}{% endraw %}">
  {% raw %}{%endif %}{% endraw %}
```

I wanted to remove the bundling from the base layout file so that it only happens once per build, for both the CSS files and the Javascript files.

## After: The new setup

What I did was remove the the bundling from the base layout and, for each of the two CSS bundles, create a Nunjucks template file in a "bundles" directory of my input folder. Here's what one of those two files looks like.

```jinja2
---
layout: null
permalink: /css/global.css
eleventyExcludeFromCollections: true
---
{% raw %}{# bundle the global css files #}{% endraw %}
{% raw %}{% css "global" %}{% endraw %}
  {% raw %}{% include "public/css/fonts.css" %}{% endraw %}
  {% raw %}{% include "public/css/variables.css" %}{% endraw %}
  {% raw %}{% include "public/css/reset.css" %}{% endraw %}
  {% raw %}{% include "public/css/home.css" %}{% endraw %}
  {% raw %}{% include "public/css/global.css" %}{% endraw %}
  {% raw %}{% include "public/css/site-header.css" %}{% endraw %}
  {% raw %}{% include "public/css/site-footer.css" %}{% endraw %}
  {% raw %}{% include "public/css/pagefind.css" %}{% endraw %}
  {% raw %}{% include "public/css/404.css" %}{% endraw %}
{% raw %}{% endcss %}{% endraw %}
{% raw %}{% getBundle "css", "global" %}{% endraw %}
```

Rather than having the bundle plugin generate a content-hashed filename for the bundle, I am now specifying a permalink for the file. This means that the bundled CSS file will always be available at /css/global.css.

I have another similar file for the channel-related CSS files and two similar files for the Javascript bundles.

Then, in the base layout file, I simply load the CSS and JS bundles like so:

```jinja2
  {% raw %}{# load the global css file for all pages #}{% endraw %}
  <link rel="stylesheet" href="/css/global.css">

  {% raw %}{# conditionally load the channel-related css file #}{% endraw %}
  {% raw %}{% if channelsPage %}{% endraw %}
    <link rel="stylesheet" href="/css/channel.css">
  {% raw %}{%endif %}{% endraw %}
```

## Conclusion

While this had little impact on the build times, I find this to be a much cleaner and more easily maintained approach. The base layout stays cleaner and the CSS and JS bundling is now clearly defined in their own files.

Thanks to Aankhen and John Brooks in the 11ty Discord community for suggesting this approach!
