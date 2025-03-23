---
title: YACCB - Yet Another Copy Code Button
description: After reading of the usefulness of a 'copy code' button, it was time to add one here.
date: 2025-03-23
image:
  source: yet-another-copy-code-button.jpg
  alt: Clipart image of a copy machine
tags:
  - 11ty
  - blogging
pageHasCode: true
rssid: 1fff8c63709454682a9210f50cddf2b7
---

[[toc]]

---

## Introduction

Over the last couple of years, I have written more posts that include code snippets than I ever would have imagined. And as it seems all the rage, and quite useful on top of that, I decided that it was time to add a "copy code" button to the code snippets found in my various posts.

## Reading what others have done

I've read through many of the recent examples and here are just a few that I examined.

- [How to build a copy code snippet button and why it matters](https://whitep4nth3r.com/blog/how-to-build-a-copy-code-snippet-button/) by [Salma Alam-Naylor](https://whitep4nth3r.com/)
- [Adding a Button to Copy Code Snippets | Helen Chong, Web Developer](https://helenchong.dev/blog/posts/2025-02-19-copy-code-button/) by [Helen Chong](https://helenchong.dev/)
- [Adding a Copy Button to Code Blocks - ttntm.me](https://ttntm.me/blog/adding-a-copy-button-to-code-blocks/) by [Tom Doe](https://ttntm.me/)
- [How to add a copy to clipboard button to code blocks](https://www.roboleary.net/2022/01/13/copy-code-to-clipboard-blog.html) by [Rob O'Leary](https://www.roboleary.net/)
- [Copy Code Button – David Bushell – Web Dev (UK)](https://dbushell.com/2025/02/14/copy-code-button/) by [David Bushell](https://dbushell.com/)

Hats off to all of these as they all succeeded.

For my own implementation, I decided to model mine after [Rob O'Leary's post](https://www.roboleary.net/2022/01/13/copy-code-to-clipboard-blog.html) as it seemed the most straightforward and the easiest for me to understand.

## 11ty syntax highlighting and prism

First, a few things to note. I use Eleventy's [Syntax Highlighting plugin](https://www.11ty.dev/docs/plugins/syntaxhighlight/). Second, it uses [prism](https://prismjs.com/) for the actual highlighting.

For all of the posts that include code, I use a front matter item called `pageHasCode` to indicate that the post has code snippets. This allows me to only include the prism CSS on pages that need it.

## Implementation

Since there is client-side Javascript involved, I can use that 'pageHasCode' front matter item to include the Javascript only on those pages that need it.

My outermost layout file, `default.njk`, includes a file I call `check-for-code.njk`, shown below.

It adds the prism CSS code to my CSS bundle (via Eleventy's built-in [bundle plugin](https://www.11ty.dev/docs/plugins/bundle/)) and includes the Javascript file that adds the copy button to each one of the code snippets on the page.

```jinja2{% raw %}
{% if pageHasCode %}
  {%- css "pageHasCode" %}
    {% include "css/prism-okaidia.css" %}
  {% endcss %}
  <script src="/assets/js/copycode.js" defer></script>
{% endif %}{% endraw %}
```

Below is the Javascript file, `copycode.js`, a mere 738 bytes.

In essence, it loops over all of the code blocks, adds a "Copy" button to each one and adds an event listener to each button.

And the event listener, when invoked, copies the related code to the clipboard and changes the button text to "Copied" for 700 milliseconds.

```javascript
let blocks = document.querySelectorAll("pre:has(code)");
let copyButtonLabel = "Copy";

blocks.forEach((block) => {
  // only add button if browser supports Clipboard API
  if (navigator.clipboard) {
    let button = document.createElement("button");

    button.innerText = copyButtonLabel;
    block.appendChild(button);

    button.addEventListener("click", async () => {
      await copyCode(block, button);
    });
  }
});

async function copyCode(block, button) {
  let code = block.querySelector("code");
  let text = code.innerText;

  await navigator.clipboard.writeText(text);

  // visual feedback that task is completed
  button.innerText = "Copied";

  setTimeout(() => {
    button.innerText = copyButtonLabel;
  }, 700);
}
```

And here is the CSS that I use to style the copy button.

```css
pre:has(code) {
  position: relative;
  margin: 5px 0;
  padding: 1.75rem 0 1.75rem 1rem;
}

pre:has(code) button {
  position: absolute;
  top: 3px;
  right: 3px;
  border-radius: 5px;
  font-size: var(--font-size-sm);
}
```

Unlike some of the other implementations that I reviewed, I do not restrict the button to only be shown on non-mobile devices. When I tested my implementation, I could use the button on iOS and paste results in an email to myself. Not that this is something that I would expect to do very often, but I saw no need to preclude it.

## Conclusion

As with most things that I end up implementing on this site, this was more straightforward than expected.

As an avid reader of blog posts that include code, I find the presence of a "Copy Code" button to be quite useful. Over the last couple of years, I have written more posts that include code snippets than I ever would have imagined. And seeing the emergence of the implementations of 'copy code' buttons, I felt it was time to add one here.

I hope you find it useful. And if you have any questions or comments, or if you see something that I may have gotten wrong, please use the email link below.

_P.S. In case anyone was wondering, I conducted fierce internal debates on whether to use the term "Copy Code" in the button, or just "Copy." I landed on "Copy."_
