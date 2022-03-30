---
title: Dipping my toe in the Open Props water
date: 2022-02-22
description: I saw the recent launch of Open Props by Adam Argyle and then watched an intro video by Kevin Powell. I was intrigued, so I dipped my toe in the water.
keywords: open props, css variables, css architecture, adam argyle
image: "https://www.bobmonsour.com/img/dipping-my-toes-in-the-open-props-water-1400w.jpg"
---

{% image "src/img/dipping-my-toe-in-the-open-props-water.jpg", "a foot near the water at the beach", "(min-width: 1000px) 1200px, 100vw" %}

<p class="caption">Photo by <a href="https://unsplash.com/@carlynsuggs?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">carlyn suggs</a> on <a href="https://unsplash.com/s/photos/toe-in-water?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></p>

[Open Props](https://open-props.style/)? What's that, you say? In the words of [Adam Argyle](https://twitter.com/argyleink), they're _Supercharged CSS variables_. I've got to assume that you know what CSS variables are as this post would be way too long for me to describe them and what they're capable of. So, if they're _variables_, why does he call them _props_? It's can be a little confusing, but according to the [spec](https://www.w3.org/TR/2021/CRD-css-variables-1-20211111/), they _are_ variables, but custom _properties_ are used to define them; also, the value of the property is referenced with the `var()` function. Many [others](https://css-tricks.com/a-complete-guide-to-custom-properties/) way [smarter than me](https://treciaks.hashnode.dev/css-variables) have [covered that ground](https://css-tricks.com/using-custom-property-stacks-to-tame-the-cascade/).

Before I get into my initial attempt at using Open Props, [this intro video](https://www.youtube.com/watch?v=szPNMKZazzQ) by Kevin Powell did a great job of jumpstarting my understanding. Prior to that, Kevin had done a [Twitch stream](https://www.twitch.tv/videos/1277849387) with Adam and they played around with Open Props; a longer video, but also incredibly helpful.

I just recently built this site and I had defined around 15 custom properties. I was wondering if I could use Open Props to help deliver a more consistent experience for further developing the site.

Before I started using Open Props, I organized my variables like this:

```css
:root {
  // Colors

  --brand-color: #6c584c;
  --nav-link-color: #6c584c;
  --nav-underline-color: #a98467;
  --nav-hover-color: #dde5b6;
  --footer-background-color: #f0ead2;
  --social-icon-background-color: #a98467;

  // Fonts

  --brand-subtitle-font: sans-serif;
  --body-copy-font: serif;

  // Fonts sizes

  --brand-name-size: 2.5rem;
  --brand-subtitle-size: 1.25rem;
  --nav-link-size: 1.75rem;
  --nav-link-size-mobile: 1.2rem;
  --post-title-size: 2.5rem;
  --post-date-size: 1.25rem;
  --post-excerpt-size: 1.75rem;
  --body-copy-size: 1.75rem;
  --footer-copy-size: 1.5rem;
}
```

As you can see, they are organized more my function, i.e., colors, fonts, and font sizes. As this list grew in size (not that it's terribly large), I started to consider other ways to organize them, perhaps more driven by where they are used in the structure of the site.

Combining this thinking along with the use of Open Props, I revised the list to look more like this:

```css
:root {
  // Brand

  --brand-name-font: "Caveat", cursive;
  --brand-color: var(--green-9);
  --brand-subtitle-font: var(--font-sans);
  --brand-link-radius: var(--radius-blob-5);

  // Navigation

  --nav-link-color: var(--brand-color);
  --nav-link-font: var(--font-sans);
  --nav-link-size: var(--font-size-fluid-2);
  --nav-underline-color: var(--orange-9);
  --nav-hover-color: var(--orange-3);

  // Footer

  --footer-background-color: var(--orange-3);
  --footer-copy-font: var(--font-sans);
  --footer-copy-size: var(--font-size-fluid-1);
  --social-icon-background-color: var(--green-6);

  // Posts

  --post-body-font: var(--font-serif);
  --post-body-size: var(--font-size-fluid-1);
  --post-title-size: var(--font-size-fluid-2);
  --post-date-size: var(--font-size-fluid-1);
  --post-excerpt-size: var(--font-size-fluid-1);
  --post-link-hover-color: var(--nav-hover-color);
  --post-link-radius: var(--radius-blob-5);
}
```

Here is where we begin to see the use of Open Props. For example, the `--brand-color` is now defined using one of the Open Props colors, i.e., `--green-9`. With the exception of the `-brand-name-font`, all of the other variables are now defined using the Open Props variables.

I particularly like the fluid font sizes, of which there are four to choose from. This eliminates the need to do all of that font-size tweaking that often accompanies the use of media queries in responsive designs.

That's the extent of my Open Props experience so far. I plan also take a look at [postcss-jit-props](https://github.com/GoogleChromeLabs/postcss-jit-props) as it does this amazing thing of creating a CSS file of only the props you actually use...and not the entire set of props.

If any of this looks useful as a result of you stumbling across this post, I suggest that you head over to the [Open Props website](https://open-props.style/) and take it for a spin.
