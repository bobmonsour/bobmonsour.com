---
title: A keystroke to place focus in the search box
description: How I mimicked the GitHub page functionality of typing a slash key to place focus in the search box.
date: 2025-04-26
tags:
  - 11ty
pageHasCode: true
image:
  source: a-keystroke-to-place-focus-in-the-search-box.jpg
  alt: a magnifying glass icon on a blue background
  creditPerson: Markus Winkler
  creditLink: https://unsplash.com/@markuswinkler

rssid: 3638c61b091a399c0197571339808ffa
---

> UPDATE: It turns out that the '/' key is a shortcut in the Firefox browser to open the search-in-page dialog. As a result, I've written [a short piece on this](/til/who-knew-that-does-search-in-page-on-firefox/) and am seeking feedback on solutions (I offer two in the post). If you have any thoughts, please leave a comment on the post. Thanks!

Way back in [Issue 62 of the 11ty Bundle blog](https://11tybundle.dev/blog/11ty-bundle-62/), I had written about I how I had turned on the autofocus parameter for the search functionality for the [11ty Bundle site](https://11tybundle.dev). The search is powered by [Pagefind](https://pagefind.app/). I asked the community for feedback as I knew from reading the Pagefind docs that there may be implications for accessibility.

Thankfully, I got an incredibly thoughtful response from [Jan De Wilde](https://jandewil.de/), outlining the relevant accessiblity issues. I then turned off autofocus.

While this had not come back into my head until recently, I was getting tired of _mousing around_ to put my cursor in the search box. I thought about how [GitHub](https://github.com/) had a shortcut for this, putting the text 'Type / to search' inside their search box.

I wanted to do the same.

I use Pagefind's default UI, with some styling customizations, but I needed to see how it created the search box at page load time.

Using Chrome's dev tools, I found the html for the search box that Pagefind created:

```html
<input
  class="pagefind-ui__search-input svelte-e9gkc3"
  type="text"
  placeholder="Search the entire site"
  autocapitalize="none"
  enterkeyhint="search"
/>
```

So, all I had to do was to add an event listener for the `/` key. And if that key is pressed and there's an identifiable searchbox on the page, place focus in the search box.

While this _hack_ relies on the fact that Pagefind creates the input element with two particular class names, it feels safe enough to rely on for this kind of project. That said, I only used the first class name in the selector.

Prior to doing this, I had the following code in an include that is on every page of the site.

```html
<script src="/pagefind/pagefind-ui.js" defer></script>
<div id="search" class="content" aria-live="polite" type="search">
	<label for="search" class="visually-hidden-search">Search</label>
</div>
<script>
  window.addEventListener("DOMContentLoaded", (event) => {
    new PagefindUI({
      element: "#search",
      translations: {
        placeholder: "Search the entire site",
        zero_results: "Count not find [SEARCH_TERM]",
      },
      showSubResults: true,
      showImages: false,
      showEmptyFilters: false,
      showSubResults: true,
      excerptLength: 100,
      pageSize: 10,
    });
  });
<script>
```

And here's the event listener that I added to the script to watch for the `/` keypress:

```js
// Add event listener for the '/' key
document.addEventListener("keydown", (e) => {
  // Check if the '/' key was pressed and no input or textarea is focused
  if (e.key === "/" && !e.target.matches("input, textarea")) {
    e.preventDefault();
    const searchInput = document.querySelector(
      "input.pagefind-ui__search-input"
    );
    if (searchInput) {
      searchInput.focus(); // Move focus to the search box
    }
  }
});
```

So, if you're using Pagefind to bring search to your site and want to do something similar, I hope you'll find this helpful. And if there's a better way to do this, I'd welcome the learning.

BTW, the source for the search box include is [here on GitHub](https://github.com/bobmonsour/11tybundle.dev/blob/main/src/_includes/partials/searchbox.njk).
