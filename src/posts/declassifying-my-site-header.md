---
title: Declassifying my site header
date: 2024-01-26
tags:
  - CSS
description: I've been reviewing my html and css and decided to remove unnecessary classes from my header.
keywords: CSS, simplify
image:
  source: declassifying-my-site-header.jpg
  alt: an empty classroom with a blackboard and a few chairs
  creditPerson: Ivan Aleksic
  creditLink: https://unsplash.com/@ivalex
pageHasCode: true
rssid: 3b3e61cee4f4eae2c170eab2a31304f0
---

I've been trying to spend less time on social media, primarily Mastodon. There were too many things that I wanted to learn, but I too often found myself scrolling into oblivion.

I wanted to deep my web development knowledge in certain areas; specifically, I wanted to learn more about and become more proficient with CSS.

To that end, I decided to start the process by revisiting this site. I started by examining the html and then the CSS.

I'm not a fan of clutter in both my markup and CSS. And given how ridiculously simple this site is, it seemed that I was over-classifying elements for no particular reason other than to have a handle on which to hang some CSS.

Here's an example of one such simplification. No great shakes here, but it highlights how simple things can be if we try.

Here's what every page header of this site looks like after removing ALL of the classes:

```jinja2{% raw %}
<header>
  <nav>
    <ul>
      {% for link in site.mainNavLinks %}
      <li><a href="{{ link.url }}"{% if page.url == link.url %}aria-current="page"{% endif %}>{{ link.text }}</a></li>
      {% endfor %}
    </ul>
  </nav>
  <a href='#' class="stt" title="scroll to top"></a>
</header>{% endraw %}
```

I have a global data file called site.json that has, among other things, a list of the main navigation items, each with the text for the link and the url. I loop through that list and create the list items for the unordered list.

As you can see, the only class on the entire header is one for the little "scroll to top" link that's sitting in the bottom right corner of your browser window.

> _UPDATE (1-28-24):_ Thanks to [Shiv J.M.](https://shivjm.blog/) (a prolific Discord helper) for some further simplifying recommendations for the CSS. His input is reflected in the CSS below.

And that kind of simplicity lends itself to very simple CSS. Here's the CSS for the header:

```css
header ul {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
	list-style: none;
	padding: 0;
	text-align: center;
}
header a {
	margin: 0;
	padding: 0 5px;
}
header a[aria-current="page"] {
	background-color: var(--light-accent-color);
}
```

You don't see :hover and :focus pseudo-classes in the CSS because the header uses the same values for those as the rest of the site and they are declared outside of this.

I do realize that \<header> is an element that can be used more than once on a site, but they aren't on this site. If I were to use it elsewhere, perhaps within a \<section>, I may have to add a class to raise the specificity.

I've done a bit more of this throughout the site, but there's more work to do. Some of this will also translate over to my work on the [https://11tybundle.dev/](https://11tybundle.dev/) site.

I have a lot of ideas on a redesign for this site and for the bundle site and that's why I want to sharpen my CSS skills. By the way, grid is freaking amazing!
