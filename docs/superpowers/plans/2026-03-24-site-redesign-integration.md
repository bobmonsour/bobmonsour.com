# Site Redesign Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current bobmonsour.com visual design with the gfp prototype design (new fonts, colors, dark mode, hamburger menu) across all page types.

**Architecture:** CSS-first migration — replace 5 CSS files with adapted gfp versions, then update templates (head, header, footer, layouts), add theme/menu JavaScript, and clean up removed features. The Eleventy architecture (bundling, collections, plugins) stays unchanged.

**Tech Stack:** Eleventy v4, Nunjucks, CSS (no preprocessor), vanilla JS

**Spec:** `docs/superpowers/specs/2026-03-24-site-redesign-integration-design.md`

**GFP prototype source:** `../gfp/` (sibling directory)

---

### Task 1: Replace `variables.css`

**Files:**
- Modify: `src/_includes/css/variables.css`

- [ ] **Step 1: Replace variables.css with adapted gfp version**

Write the complete new `variables.css`. Start from gfp's version, then:
- Add back `--icon-external-link`, `--radius`, `--max-book-width`, `--caption-size`, `--post-title-size` from the current site
- Remove `--font-heading-sans` (undefined prototype artifact)
- Fix duplicate `--link-hover-color` in dark mode (remove `white`, keep `black`)
- Do NOT include one-up space pairs (unused in final CSS)
- Note: `--flow-space` changes from `var(--space-xs)` to `var(--space-s)` (gfp value) — slightly more vertical spacing in `.flow` contexts

```css
:root {
  /* === Type scale from https://utopia.fyi/type/calculator/ === */
  --step--2: clamp(0.7813rem, 0.7747rem + 0.0326vw, 0.8rem);
  --step--1: clamp(0.9375rem, 0.9158rem + 0.1087vw, 1rem);
  --step-0: clamp(1.125rem, 1.0815rem + 0.2174vw, 1.25rem);
  --step-1: clamp(1.35rem, 1.2761rem + 0.3696vw, 1.5625rem);
  --step-2: clamp(1.62rem, 1.5041rem + 0.5793vw, 1.9531rem);
  --step-3: clamp(1.944rem, 1.771rem + 0.8652vw, 2.4414rem);
  --step-4: clamp(2.3328rem, 2.0827rem + 1.2504vw, 3.0518rem);
  --step-5: clamp(2.7994rem, 2.4462rem + 1.7658vw, 3.8147rem);

  /* === Space scale from https://utopia.fyi/space/calculator/ === */
  --space-3xs: clamp(0.3125rem, 0.3125rem + 0vw, 0.3125rem);
  --space-2xs: clamp(0.5625rem, 0.5408rem + 0.1087vw, 0.625rem);
  --space-xs: clamp(0.875rem, 0.8533rem + 0.1087vw, 0.9375rem);
  --space-s: clamp(1.125rem, 1.0815rem + 0.2174vw, 1.25rem);
  --space-m: clamp(1.6875rem, 1.6223rem + 0.3261vw, 1.875rem);
  --space-l: clamp(2.25rem, 2.163rem + 0.4348vw, 2.5rem);
  --space-xl: clamp(3.375rem, 3.2446rem + 0.6522vw, 3.75rem);
  --space-2xl: clamp(4.5rem, 4.3261rem + 0.8696vw, 5rem);
  --space-3xl: clamp(6.75rem, 6.4891rem + 1.3043vw, 7.5rem);

  --flow-space: var(--space-s);

  /* === Fonts === */
  --font-body: "IBM Plex Mono", ui-monospace, monospace;
  --font-heading-serif: "IBM Plex Serif", Georgia, serif;

  /* === Sizing === */
  --accent-width: 1px;
  --accent-width-heavy: 3px;
  --blockquote-border: 4px;
  --radius: 10px;

  /* Carried from current site */
  --max-book-width: 200px;
  --caption-size: var(--step-0);
  --post-title-size: var(--step-2);

  /* SVG icon for external links */
  --icon-external-link: url('data:image/svg+xml,\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">\
  <g style="stroke:currentColor;stroke-width:1">\
    <line x1="5" y1="5" x2="5" y2="14" />\
    <line x1="14" y1="9" x2="14" y2="14" />\
    <line x1="5" y1="14" x2="14" y2="14" />\
    <line x1="5" y1="5" x2="9" y2="5" />\
    <line x1="10" y1="2" x2="17" y2="2" />\
    <line x1="17" y1="2" x2="17" y2="9" />\
    <line x1="10" y1="9" x2="17" y2="2" style="stroke-width:1.5" />\
  </g>\
</svg>');
}

/* === Colors: Light mode === */
[data-theme="light"] {
  --bg-primary: #C7E2F6;
  --bg-card: #C7E2F6;
  --text-color: black;
  --text-muted: black;
  --accent-line: black;
  --accent-line-heavy: black;
  --link-color: black;
  --link-hover-color: black;
  --link-hover-bg: #fff066;
}

/* === Colors: Dark mode === */
[data-theme="dark"] {
  --bg-primary: #353d4d;
  --bg-card: #353d4d;
  --text-color: white;
  --text-muted: white;
  --accent-line: white;
  --accent-line-heavy: white;
  --link-color: white;
  --link-hover-color: black;
  --link-hover-bg: #fff066;
}
```

Note: The `--icon-external-link` SVG uses `currentColor` instead of the original hardcoded `rgb(0,0,0)` so it works in dark mode.

- [ ] **Step 2: Commit**

```bash
git add src/_includes/css/variables.css
git commit -m "Replace variables.css with new design system"
```

---

### Task 2: Replace `base.css`

**Files:**
- Modify: `src/_includes/css/base.css`

- [ ] **Step 1: Replace base.css with adapted gfp version**

Start from gfp's `base.css`, then add back:
- `@view-transition` block
- `border-radius: var(--radius)` on images
- `article h2` left-align override
- External link indicator
- Linked-image lighter outline styling

```css
/* Reset and set default element styles */
html {
  scroll-behavior: smooth;
  overflow-y: scroll;
}

@view-transition {
  navigation: auto;
}

@supports (scrollbar-gutter: stable) {
  html {
    overflow-y: auto;
    scrollbar-gutter: stable;
  }
}

:where(body, h1, h2, h3, h4, h5, h6) {
  margin: 0;
  padding: 0;
}

:where(h1, h2) {
  line-height: 1.2;
  text-align: center;
  text-wrap: balance;
}

:where(h1) {
  font-size: var(--step-4);
}

:where(h2) {
  font-size: var(--step-2);
}

:where(h3) {
  font-size: var(--step-1);
}

:where(article h2) {
  font-size: var(--step-1);
  text-align: left;
}

:where(hr) {
  border: none;
  margin-block: var(--space-m);
}

:where(ol, ul) {
  margin-block: var(--space-xs);
  padding: 0;
}

:where(ol:not([class]), ul:not([class])) {
  margin-inline-start: var(--space-l);
}

/* Box sizing rules */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Inherit fonts for inputs and buttons */
:where(input, button, textarea, select) {
  font: inherit;
}

:where(p) {
  margin-block: 0 var(--space-s);
  text-wrap: pretty;
}

/* Default img to handle fluid images */
:where(img) {
  border-radius: var(--radius);
  display: block;
  max-width: 100%;
}
:where(img[width]) {
  width: auto;
}
:where(img[width][height]) {
  height: auto;
}
:where(img:not([class])) {
  margin-block-end: var(--space-s);
}

/* Links */
:where(a) {
  color: var(--link-color);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
  transition: background-color 0.15s ease;
}
:where(a:hover, a:focus) {
  color: var(--link-hover-color);
  background-color: var(--link-hover-bg);
  text-decoration: none;
}

/* Lighter dashed outline on linked images to indicate clickability */
:where(a:has(img)) {
  text-decoration: none;
}
:where(a:has(img) img) {
  outline: 1px dashed var(--accent-line);
}
:where(a:has(img):hover img, a:has(img):focus img) {
  outline: 2px dashed var(--accent-line);
}

/* Indicate links to external sites */
a[href^="https"]:not(:has(img))::after {
  background: no-repeat var(--icon-external-link);
  background-size: 0.8em 0.8em;
  content: "";
  display: inline-block;
  width: 0.8em;
  height: 0.8em;
  padding-inline-start: 0.25em;
}

blockquote {
  border-inline-start: var(--blockquote-border) solid var(--accent-line-heavy);
  font-style: italic;
  font-size: var(--step-0);
  margin: var(--space-m) 0;
  padding: var(--space-s) var(--space-m);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/_includes/css/base.css
git commit -m "Replace base.css with new design system"
```

---

### Task 3: Replace `main.css`

**Files:**
- Modify: `src/_includes/css/main.css`

- [ ] **Step 1: Replace main.css with adapted gfp version**

Start from gfp's `main.css`, then:
- **Exclude**: `.color-picker`, `.font-label`, `.heading-sans`, `.section-heading` blocks
- **Simplify**: remove redundant 1250px homegrid rule (keep only `#alltags` constraint)
- **Add back**: bookshelf (`.bklist`, `book-item`, `.bookyear`, `.bookyears`), `.caption`, `.table-of-contents`, `.email-comment`, `blockquote { grid-column: popout }`, code block positioning, `.stripe-buy-button`

```css
/*
  Page structure:
   1 column grid, forcing footer to bottom
*/
body {
  background-color: var(--bg-primary);
  color: var(--text-color);
  display: grid;
  grid-template-rows: auto 1fr auto;
  font-family: var(--font-body);
  font-size: var(--step-0);
  line-height: 1.6;
  margin-inline: auto;
  min-height: 100vh;
  min-height: 100dvh;
}

/* === Header === */
header {
  padding: var(--space-m) var(--space-m) var(--space-s);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-m);
  position: relative;
}

/* === Hamburger menu === */
.menu-toggle {
  position: absolute;
  left: var(--space-m);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-3xs);
  color: var(--text-color);
  display: grid;
  place-items: center;
  z-index: 20;
}
.menu-toggle:hover {
  opacity: 0.6;
}
.menu-toggle svg {
  width: 1.5rem;
  height: 1.5rem;
}

/* Hide hamburger on larger screens */
@media (min-width: 700px) {
  .menu-toggle {
    display: none;
  }
}

/* Hide nav on mobile by default, show when open */
@media (max-width: 699px) {
  #main-nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--accent-line);
    padding: var(--space-m);
    z-index: 15;
  }
  #main-nav.open {
    display: block;
  }
  #main-nav .listolinks {
    flex-direction: column;
    align-items: center;
    gap: var(--space-s);
  }
}

/* === Theme toggle === */
.theme-toggle {
  position: absolute;
  right: var(--space-m);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-3xs);
  color: var(--text-color);
  display: grid;
  place-items: center;
}
.theme-toggle:hover {
  opacity: 0.6;
}
.theme-toggle svg {
  width: 1.25rem;
  height: 1.25rem;
}

.theme-panel {
  position: absolute;
  right: var(--space-m);
  top: 100%;
  background: var(--bg-card);
  border: var(--accent-width) solid var(--accent-line);
  border-top: none;
  padding: var(--space-2xs) var(--space-s);
  display: flex;
  gap: var(--space-s);
  z-index: 10;
  opacity: 0;
  transform: translateY(-0.25rem);
  pointer-events: none;
  transition: opacity 150ms ease, transform 150ms ease;
}
.theme-panel.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.theme-panel fieldset {
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: var(--space-s);
}

.theme-panel label {
  display: flex;
  align-items: center;
  gap: var(--space-3xs);
  cursor: pointer;
  font-size: var(--step--1);
  font-family: var(--font-body);
  padding: var(--space-3xs) var(--space-2xs);
  border-bottom: var(--accent-width) solid transparent;
  transition: border-color 150ms ease;
}
.theme-panel label:hover {
  border-bottom-color: var(--accent-line);
}

.theme-panel input[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.theme-panel svg {
  width: 1rem;
  height: 1rem;
  color: var(--text-color);
}

.skip-nav-link {
  position: fixed;
  top: 0;
  left: var(--space-xs);
  padding: 5px;
  transform: translateY(-100%);
  transition: transform 300ms ease-in;
  z-index: 100;
  background: var(--bg-primary);
}

.skip-nav-link:focus {
  transform: translateY(0);
}

/* Highlight the nav link of the current page */
nav a[aria-current="page"] {
  border-bottom: 1px solid var(--accent-line-heavy);
  text-decoration: none;
}

.stripe-buy-button {
  display: flex;
  justify-content: center;
  margin: var(--space-s) 0;
}

/*
  Content structure
  - named grid lines for layout
  - for varying content widths within a page
*/
.content {
  --gap: clamp(0.25rem, 3vw, 1rem);
  --full: minmax(var(--gap), 1fr);
  --feature: minmax(0, 5rem);
  --popout: minmax(0, 2rem);
  --central: min(65ch, 100% - var(--gap) * 2);

  display: grid;
  grid-template-columns:
    [full-start] var(--full)
    [feature-start] var(--feature)
    [popout-start] var(--popout)
    [central-start] var(--central) [central-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end]
    var(--full) [full-end];
  max-width: 100vw;
  place-content: start center;
}
.full {
  grid-column: full;
}
.feature {
  grid-column: feature;
}
.popout {
  grid-column: popout;
}
.central {
  grid-column: central;
}

/*
  Home page grid:
  - 1 column on small screens
  - 2 columns on medium & large via media query
*/
.homegrid {
  display: grid;
  grid-template-columns: 1fr;
  column-gap: var(--space-l);
  row-gap: 0;
  padding-inline: 0.25rem;
  padding-block: 0;
  place-content: center;
}

@media (min-width: 700px) {
  .homegrid {
    grid-template-columns: repeat(2, 1fr);
    padding-inline: var(--space-m);
  }
}
@media (min-width: 1250px) {
  #alltags .listolinks {
    margin-inline: auto;
    max-width: 70%;
  }
}

/*
  Home page secondary grid:
  - 1 column on small screens
  - 2 columns on medium & large screens via media query
*/
.homegrid2 {
  display: grid;
  grid-template-columns: 1fr;
  column-gap: var(--space-l);
  row-gap: 0;
  padding-inline: 0.25rem;
  padding-block-start: 0;
  padding-block-end: var(--space-s);
  place-content: center;
}

@media (min-width: 700px) {
  .homegrid2 {
    grid-template-columns: repeat(2, 1fr);
    padding-inline: var(--space-m);
  }
}

/* === Card styling === */
.card {
  background-color: var(--bg-card);
  padding-inline: var(--space-2xs);
  padding-block: 0;
}

@media (min-width: 700px) {
  .card {
    padding-inline: var(--space-m);
    padding-block: 0;
    position: relative;
  }
  /* Left accent — 75% height, from bottom */
  .card::before {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    height: 75%;
    width: 0;
    border-left: 1px solid var(--accent-line);
  }
  .homegrid .card:nth-child(3),
  .homegrid .card:nth-child(4) {
    padding-block-start: var(--space-m);
  }
  /* Bottom accent — 75% width, from left */
  .card::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 75%;
    height: 0;
    border-bottom: 1px solid var(--accent-line);
  }
}

.card img {
  margin-block: var(--space-xs);
  margin-inline: auto;
}

/* === Section dividers === */
.section-divider {
  margin-block: 0;
  padding-block-start: var(--space-m);
  padding-inline: var(--space-m);
}

/* Top navigation links & list of all tags in footer */
.listolinks {
  display: flex;
  flex-wrap: wrap;
  font-size: var(--step-0);
  justify-content: space-around;
  list-style: none;
  text-align: center;
}
.listolinks a {
  padding: 0 var(--space-3xs);
}
.listolinks li {
  margin: var(--space-3xs) var(--space-2xs);
}

nav .listolinks {
  justify-content: center;
  gap: var(--space-s);
}

/* Heading font variant */
.heading-serif {
  font-family: var(--font-heading-serif);
  font-weight: 600;
  margin-block-end: var(--space-s);
}

/* === Blog date / meta === */
.blogdate {
  font-size: var(--step--1);
  color: var(--text-muted);
  margin-block-end: var(--space-s);
}

/* === Bookshelf === */
.bklist {
  display: grid;
  font-size: var(--step-0);
  gap: var(--space-l);
  grid-template-columns: repeat(auto-fit, minmax(var(--max-book-width), 1fr));
  margin-block-start: var(--space-l);
  place-items: start center;
}

book-item {
  align-items: center;
  display: grid;
  grid-template-rows: auto auto auto;
  justify-items: center;
  text-align: center;
}
book-item a {
  font-weight: bold;
}
book-item a img {
  height: auto;
  margin-block-end: 0.5em;
  width: 180px;
}

.bookyear {
  margin-block-start: var(--space-m);
  margin-inline: auto;
  width: 90%;
}
.bookyears a {
  margin-inline: var(--space-3xs);
}

/* Image captions */
.caption {
  font-size: var(--caption-size);
  font-style: italic;
  margin-block-start: var(--space-3xs);
  text-align: center;
}

/* Table of contents and email comment boxes */
.table-of-contents,
.email-comment {
  margin: var(--space-m) auto;
  padding: var(--space-m);
  width: fit-content;
  background-color: var(--bg-card);
  border: var(--accent-width) solid var(--accent-line);
  border-radius: var(--radius);
}
.table-of-contents h2 {
  text-align: center;
}

/* Blockquote uses popout column in content grid */
blockquote {
  grid-column: popout;
}

/* Position the copy code button */
pre:has(code) {
  position: relative;
  margin: 5px 0;
  padding: 1.75rem 0 1.75rem 1rem;
}

pre:has(code) button {
  position: absolute;
  top: 3px;
  right: 3px;
  border-radius: calc(var(--radius) / 2);
  font-size: var(--step--2);
}

/*
  "scroll to top" link
*/
.stt {
  position: fixed;
  right: var(--space-s);
  bottom: var(--space-s);
  width: 2.5rem;
  height: 2.5rem;
  display: grid;
  place-items: center;
  border-top: var(--accent-width) solid var(--accent-line);
  border-left: var(--accent-width) solid var(--accent-line);
  color: var(--text-color);
  text-decoration: none;
  font-size: var(--step-0);
  transition: opacity 0.15s ease;
}
.stt:hover {
  opacity: 0.6;
}

.taglist {
  display: flex;
  flex-wrap: wrap;
  font-size: var(--step--1);
  font-style: italic;
  list-style: none;
  margin-block: 0 var(--space-xl);
  padding: 0;
}

.postmeta {
  text-align: center;
}
.postmeta .taglist {
  justify-content: center;
  margin-block-end: var(--space-s);
}
.postmeta img {
  margin-block-end: var(--space-2xs);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/_includes/css/main.css
git commit -m "Replace main.css with new design system"
```

---

### Task 4: Replace `footer.css`

**Files:**
- Modify: `src/_includes/css/footer.css`

- [ ] **Step 1: Replace footer.css with gfp version**

```css
footer {
  padding-block-start: 0;
  margin-block-start: 0;
}

#alltags {
  margin-inline: var(--space-m);
}

@media (min-width: 700px) {
  footer {
    padding-block-start: var(--space-m);
  }
}

footer .footer-meta {
  padding-block: var(--space-xs);
  margin-block-start: var(--space-m);
  text-align: center;
  font-size: var(--step--1);
  color: var(--text-color);
}

/* Social icons appearing in the footer of every page */
.social-icons {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin-block: var(--space-m);
  justify-content: center;
  gap: var(--space-m);
  font-size: var(--step--1);
}

.social-icons a {
  color: var(--text-color);
  text-decoration: none;
  padding: var(--space-3xs) var(--space-2xs);
  border-bottom: var(--accent-width) solid transparent;
  transition: border-color 0.15s ease;
}

.social-icons a:hover,
.social-icons a:focus {
  border-bottom-color: var(--accent-line);
  color: var(--link-hover-color);
  background-color: transparent;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/_includes/css/footer.css
git commit -m "Replace footer.css with new design system"
```

---

### Task 5: Replace `utilities.css`

**Files:**
- Modify: `src/_includes/css/utilities.css`

- [ ] **Step 1: Replace utilities.css with adapted gfp version**

Start from gfp, add back `.strikethrough`.

```css
/* Utility classes */

.bold {
  font-weight: bold;
}

.flow > * + * {
  margin-block-start: var(--flow-space);
}

.hidden {
  display: none;
}

.ital {
  font-style: italic;
}

.list-none {
  list-style: none;
}

.round-img {
  clip-path: circle(50%);
}

.strikethrough {
  text-decoration: line-through;
}

.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.no-bot-margin {
  margin-block-end: 0;
}

.parenthetical {
  font-size: var(--step--1);
  font-weight: normal;
  font-style: italic;
}

/* Accent line utilities — single edges only */
.border-top {
  border-top: var(--accent-width) solid var(--accent-line);
}

.border-bottom {
  border-bottom: var(--accent-width) solid var(--accent-line);
}

.border-left {
  border-left: var(--accent-width) solid var(--accent-line);
  padding-left: var(--space-s);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/_includes/css/utilities.css
git commit -m "Replace utilities.css with new design system"
```

---

### Task 6: Update `head.njk`

**Files:**
- Modify: `src/_includes/head.njk`

- [ ] **Step 1: Add theme script and Google Fonts, remove background image block**

Replace the entire file with:

```njk
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ title }}</title>
  <meta name="description" content="{{ description }}">
  <meta name="keywords" content="{{ keywords }}">
  <link rel="canonical" href="{{ site.url }}{{ page.url }}">

  {# Theme: set before paint to prevent flash #}
  <script>
    (function() {
      var saved = localStorage.getItem('theme');
      var effective;
      if (saved && saved !== 'auto') {
        effective = saved;
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        effective = 'dark';
      } else {
        effective = 'light';
      }
      document.documentElement.setAttribute('data-theme', effective);
    })();
  </script>

  {# Fonts #}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Serif:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">

  {# improve RSS feed visibility #}
  <link rel="alternate" type="application/rss+xml" title="Bob Monsour's blog" href="https://www.bobmonsour.com/feed.xml">

  {# conditionally load the syntax highlighting styles #}
  {% if pageHasCode %}
    <link rel="stylesheet" href="{% getBundleFileUrl 'css', 'pageHasCode' %}" media="print" onload="this.media='all'">
  	<noscript>
	  	<link rel="stylesheet" href="{% getBundleFileUrl 'css', 'pageHasCode' %}">
	  </noscript>
  {% endif %}

  {# conditionally load the lite-youtube-embed styles #}
  {% if pageHasYoutube %}
    <link rel="stylesheet" href="{% getBundleFileUrl 'css', 'pageHasYoutube' %}">
  {% endif %}

  {# bundle the CSS content used on all pages #}
  {% css %}
    {% include "css/variables.css" %}
    {% include "css/base.css" %}
    {% include "css/main.css" %}
    {% include "css/footer.css" %}
    {% include "css/utilities.css" %}
  {% endcss %}
  <link rel="stylesheet" href="{% getBundleFileUrl "css" %}">

  {# Fathom Analytics - don't load when developing locally #}
  {% if site.env != "development" %}
    <script src="https://cdn.usefathom.com/script.js" data-site="MJGSVNXM" defer></script>
  {% endif %}

  {# favicon settings #}
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-96x96.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="msapplication-TileColor" content="#da532c">
  <meta name="theme-color" content="#ffffff">

  {# do all the meta tags #}
  <meta property="og:title" content="{{ title }}">
  <meta property="og:type" content="website">
  <meta property="og:description" content="{{ description }}">
  <meta property="og:image" content="{{ site.url }}/assets/img/{{ image.source }}">
  <meta property="og:url" content="{{ site.url }}{{ page.url }}">
  <meta name="generator" content="{{ eleventy.generator }}">
  {# <meta name="fediverse:creator" content="@bobmonsour@indieweb.social" /> #}
	<link href="https://github.com/bobmonsour" rel="me">

  {# diagnostic for head tag loading order #}
  {# <link rel="stylesheet" href="https://csswizardry.com/ct/ct.css" class="ct" /> #}
</head>
```

Changes from current: added theme-detection script, added Google Fonts links, removed background image `<style>` block.

- [ ] **Step 2: Commit**

```bash
git add src/_includes/head.njk
git commit -m "Update head.njk: add theme script, Google Fonts, remove bg images"
```

---

### Task 7: Create `icons.njk` and update `header.njk`

**Files:**
- Create: `src/_includes/icons.njk`
- Modify: `src/_includes/header.njk`

- [ ] **Step 1: Create icons.njk**

```njk
<!-- SVG icon sprites -->
<svg width="0" height="0" aria-hidden="true" style="position:absolute">
  <defs>
    <g id="icon-sun" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></g>
    <g id="icon-moon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79"/></g>
    <g id="icon-circle-half" fill="currentColor"><path d="M12 20.75a8.75 8.75 0 0 0 0-17.5zM12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20"/></g>
    <g id="icon-menu" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></g>
    <g id="icon-close" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></g>
  </defs>
</svg>
```

- [ ] **Step 2: Replace header.njk**

```njk
<header>
  <a class="skip-nav-link" href="#main-content">Skip navigation</a>
  <button class="menu-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Menu">
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <use href="#icon-menu"></use>
    </svg>
  </button>
  <nav id="main-nav">
    <ul class="listolinks list-none">
      {% for link in site.mainNavLinks %}
      <li><a href="{{ link.url }}" {{ link.text | isCurrentPage(page.url) | safe }}>{{ link.text }}</a></li>
      {% endfor %}
    </ul>
  </nav>
  <button class="theme-toggle" aria-expanded="false" aria-controls="theme-panel" aria-label="Theme settings">
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <use href="#icon-sun"></use>
    </svg>
  </button>
  <form id="theme-panel" class="theme-panel">
    <fieldset>
      <legend class="hidden">Theme</legend>
      <label>
        <input type="radio" name="theme" value="auto">
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-circle-half"></use></svg>
        Auto
      </label>
      <label>
        <input type="radio" name="theme" value="light">
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-sun"></use></svg>
        Light
      </label>
      <label>
        <input type="radio" name="theme" value="dark">
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-moon"></use></svg>
        Dark
      </label>
    </fieldset>
  </form>
</header>
```

- [ ] **Step 3: Commit**

```bash
git add src/_includes/icons.njk src/_includes/header.njk
git commit -m "Add icons.njk, replace header with hamburger menu and theme toggle"
```

---

### Task 8: Update `footer.njk` and `socials.njk`

**Files:**
- Modify: `src/_includes/footer.njk`
- Modify: `src/_includes/socials.njk`

- [ ] **Step 1: Replace socials.njk with text-based links**

```njk
<ul class="social-icons list-none">
  <li><a href="mailto:bob.monsour@gmail.com">Email</a></li>
  <li><a rel="me" href="https://indieweb.social/@bobmonsour">Mastodon</a></li>
  <li><a href="https://github.com/bobmonsour">GitHub</a></li>
  <li><a href="https://bsky.app/profile/bobmonsour.com">Bluesky</a></li>
  <li><a href="https://www.instagram.com/bobmonsour/">Instagram</a></li>
  <li><a href="https://www.linkedin.com/in/bobmonsour/">LinkedIn</a></li>
  <li><a href="/feed.xml">RSS</a></li>
</ul>
```

Note: `rel="me"` preserved on Mastodon link.

- [ ] **Step 2: Update footer.njk**

```njk
<footer>
  <div id="alltags">
    <h2 class="heading-serif text-center">Yes, you can haz all the tags:</h2>
    {% include 'alltags.njk' %}
  </div>
	{% include 'socials.njk' %}
  <p class="footer-meta">Built with <a href="https://11ty.dev">{{ eleventy.generator }}</a>&nbsp;&middot;&nbsp;<a href="https://github.com/bobmonsour/bobmonsour.com">Source</a></p>
  {# if this is the 404 page, track the offending url #}
  {% if title == "404" %}
    <script>
      window.addEventListener('load', () => {
        const path = window.location.pathname;
        fathom.trackEvent('404: ' + path);
      });
    </script>
{% endif %}
</footer>
```

Changes: removed `bg-primary` class, removed bg images link paragraph, added `heading-serif` to h2, changed footer meta to use `.footer-meta` class.

- [ ] **Step 3: Commit**

```bash
git add src/_includes/footer.njk src/_includes/socials.njk
git commit -m "Update footer and social links to text-based design"
```

---

### Task 9: Update layout files

**Files:**
- Modify: `src/_layouts/home.njk`
- Modify: `src/_layouts/grid.njk`
- Modify: `src/_layouts/postgrid.njk`

- [ ] **Step 1: Update home.njk**

```njk
<!DOCTYPE html>
<html lang="en" data-theme="light" data-inputpath="{{ page.inputPath }}" id="{{ title | slugify }}">
  {% include 'head.njk' %}
<body>
  {% include 'icons.njk' %}
  {% include 'header.njk' %}
  {% include "check-for-youtube.njk" %}
  <main id="main-content">
    {{ content | safe }}
  </main>
  {% include 'footer.njk' %}
  <a href="#" class="stt" title="scroll to top">&uarr;</a>
  <script src="/assets/js/theme.js" defer></script>
</body>
</html>
```

Changes: added `data-theme="light"`, added icons include, removed `bg-primary` from main, changed scroll-to-top content to `&uarr;`, added theme.js script.

- [ ] **Step 2: Update grid.njk**

```njk
<!DOCTYPE html>
<html lang="en" data-theme="light" data-inputpath="{{ page.inputPath }}" id="{{ title | slugify }}">
  {% include 'head.njk' %}
<body>
  {% include 'icons.njk' %}
  {% include 'header.njk' %}
  <main id="main-content" class="content">
    <div class="{{ whichgrid }}">
      {{ content | safe }}
    </div>
  </main>
  {% include 'footer.njk' %}
  <a href="#" class="stt" title="scroll to top">&uarr;</a>
  <script src="/assets/js/theme.js" defer></script>
</body>
</html>
```

Changes: added `data-theme="light"`, added icons include, removed `bg-primary` from main, removed `{% if boxed %}boxed{% endif %}` conditional, changed scroll-to-top content, added theme.js.

- [ ] **Step 3: Update postgrid.njk**

```njk
<!DOCTYPE html>
<html lang="en" data-theme="light" data-inputpath="{{ page.inputPath }}" id="{{ title | slugify }}">
  {% include 'head.njk' %}
<body>
  {% include 'icons.njk' %}
  {% include 'header.njk' %}
	{% include "check-for-code.njk" %}
	{% include "check-for-youtube.njk" %}
  <main id="main-content" class="content" data-pagefind-body>
  <article class="central" data-pagefind-body>
    <div class="postmeta">
      <h1>{{ title }}</h1>
      <p class="no-bot-margin">{{ date | formatPostDate }} &middot; {{ content | readingTime }}</p>
      {% set tagsdata = tags %}
      {% include 'taglist.njk' %}
      {% include 'showimage.njk' %}
    </div>
    {{ content | safe }}
    <p class="email-comment"><a href="mailto:bob.monsour@gmail.com?subject=Comment:%20{{ title | urlencode }}">Comment by email</a></p>
    {% set theseposts = collections.posts %}
    {% include 'nextprevlinks.njk' %}
  </article>
</main>
  {% include 'footer.njk' %}
  <a href="#" class="stt" title="scroll to top">&uarr;</a>
  <script src="/assets/js/theme.js" defer></script>
</body>
</html>
```

Changes: added `data-theme="light"`, added icons include, removed `bg-secondary` from main, removed `boxed` from email-comment `<p>`, changed scroll-to-top content, added theme.js.

- [ ] **Step 4: Commit**

```bash
git add src/_layouts/home.njk src/_layouts/grid.njk src/_layouts/postgrid.njk
git commit -m "Update all layouts: add dark mode, icons, remove bg classes"
```

---

### Task 10: Update home page (`index.njk`)

**Files:**
- Modify: `src/pages/index.njk`

- [ ] **Step 1: Replace `.boxed` with `.card`, add `.heading-serif`, update section divider**

```njk
---
layout: home.njk
title: Bob Monsour
description: Retired. Web hobbyist. Creator of 11tybundle.dev.
keywords: retired, web development, eleventy, tennis
permalink: /index.html
pageHasYoutube: true
---

<h1 class="hidden">The personal website of Bob Monsour</h1>

<div class="homegrid">
  <div class="card">
    <h2 class="heading-serif">Yo!</h2>
    <img
      src="/assets/img/about-bob.jpg"
      alt="Bob, circa 2009"
      class="round-img"
      loading="eager"
      sizes="100px"
    />
    <p>
      Hi! I'm Bob Monsour. Born in Brooklyn, raised in New Jersey, and educated
      in Florida and Los Angeles, I'm now retired and living in Northern
      California with
      <a href="https://www.tascafineart.com/">
        Sandra
      </a>
      , my wonderful wife and artist, and our Portuguese Water Dog,
      <a href="/soda/">Soda</a>.
    </p>
    <p class="ital"><a href="/about/">More...</a></p>
  </div>
  <div class="card">
    <h2 class="heading-serif">From the Blog</h2>
    <ul class="list-none">
      {%- set blogposts = collections.posts | reverse -%} {%- set
      last3posts = blogposts.slice(0,3) -%} {%- for post in last3posts -%}
      <li>
        <a href="{{ post.url }}" class="bold">{{ post.data.title }}</a>
        <p class="blogdate">{{ post.date | formatPostDate }} &middot; {{ post.data.description | safe }}</p>
      </li>
      {%- endfor -%}
    </ul>
    <p class="ital"><a href="/blog/">More...</a></p>
  </div>
  <div class="card">
    <h2 class="heading-serif">Current Project</h2>
    <a href="https://11tybundle.dev">
      <img
        loading="eager"
        decoding="async"
        src="/assets/img/11tybundle-dev.png"
        alt="The 11ty Bundle"
      />
    </a>
    <p>
      A
      <a href="https://11tybundle.dev">website</a>
      of
      <a href="https://11ty.dev">Eleventy</a>
      resources, including more than 1,500 blog posts across 50 categories
      written by more than 400 authors to help you get the most out of this
      great static site generator.
    </p>
  </div>
  <div class="card">
    <h2 class="heading-serif">Currently Reading</h2>
    {%- for book in books.currentBooks.slice(0,1) -%}
      {%- include "bookitem.njk" -%}
    {%- endfor -%}
    <p class="ital"><a href="/books/">More...</a></p>
  </div>
</div>

<div class="section-divider">
  <h2 class="heading-serif text-center">Organizations that I'm supporting (<a href="/blog/organizations-im-supporting/">here's why</a>)</h2>
</div>

<div class="homegrid2">
  <div class="card">
    <h2 class="heading-serif"><a href="https://justvision.org/">Just Vision</a></h2>
      {% set videoTitle = "Boycott: Offical Trailer" %}
      {% set videoId = "FAMAFyR7L9U" %}
      {% include 'youtube.njk' %}
    <p>Since 2012, I have been a supporter of Just Vision, a non-profit organization that <i>"fills a media gap on Israel-Palestine through independent storytelling and strategic audience engagement."</i> They have produced <a href="https://justvision.org/films">award-winning films</a>. They also produce <a href="https://www.mekomit.co.il/">Local Call</a>, a Hebrew-language news site advancing citizen journalism and an independent media. In conjunction with <a href="https://www.972mag.com/">972 Magazine</a>, Local Call publishes <a href="https://www.972mag.com/topic/local-call/">their work in English</a>. If this is an issue of importance to you, perhaps you'll consider <a href="https://justvision.org/ways-to-give">supporting them</a>.</p>
  </div>
  <div class="card">
    <h2 class="heading-serif"><a href="https://www.bradyunited.org/">Brady United</a></h2>
      {% set videoTitle = "Brady: United Against Gun Violence" %}
      {% set videoId = "qGGXupGu10E" %}
      {% include 'youtube.njk' %}
    <p>Brady United is the leading gun violence prevention organization in America. They combine bipartisan leadership with proven behavior change campaigns. Evidence shows they're saving lives. A friend of mine and organizer of our book club recently hosted a gathering at his home where we heard <a href="https://www.bradyunited.org/about-us/our-team/brady-leadership/kris-brown">Kris Brown</a>, the President of the <a href="https://www.bradyunited.org/">Brady Campaign</a>, speak about the work they are doing to address this issue. If this is an issue of importance to you, perhaps you'll consider <a href="https://www.bradyunited.org/take-action/donate-to-brady">supporting them</a>.</p>
  </div>
</div>
```

Changes: `.boxed` → `.card`, added `.heading-serif` to all h2 elements, `top-n-bot-margin` → `.section-divider` wrapper, removed `.bot-margin` and `.top-margin` utility classes from org section.

- [ ] **Step 2: Commit**

```bash
git add src/pages/index.njk
git commit -m "Update home page: cards, heading-serif, section dividers"
```

---

### Task 11: Create theme JavaScript

**Files:**
- Create: `src/assets/js/theme.js`

- [ ] **Step 1: Create theme.js**

Extract from gfp's inline script, excluding color picker logic:

```javascript
document.addEventListener('DOMContentLoaded', function () {
  // Theme toggle
  var toggle = document.querySelector('.theme-toggle');
  var panel = document.getElementById('theme-panel');
  var radios = panel.querySelectorAll('input[type="radio"]');
  var saved = localStorage.getItem('theme') || 'auto';

  // Set initial radio state
  var checked = panel.querySelector('input[value="' + saved + '"]');
  if (checked) checked.checked = true;
  updateIcon(saved);

  // Toggle panel visibility
  toggle.addEventListener('click', function () {
    var expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    panel.classList.toggle('visible');
  });

  // Handle radio changes
  radios.forEach(function (radio) {
    radio.addEventListener('change', function (e) {
      var theme = e.target.value;
      if (theme === 'auto') {
        localStorage.setItem('theme', 'auto');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      } else {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
      }
      updateIcon(theme);
      // Close panel
      toggle.setAttribute('aria-expanded', 'false');
      panel.classList.remove('visible');
    });
  });

  // React to OS preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    var current = localStorage.getItem('theme');
    if (!current || current === 'auto') {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      updateIcon('auto');
    }
  });

  // Hamburger menu
  var menuToggle = document.querySelector('.menu-toggle');
  var mainNav = document.getElementById('main-nav');
  menuToggle.addEventListener('click', function () {
    var expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('open');
    var use = menuToggle.querySelector('use');
    use.setAttribute('href', expanded ? '#icon-menu' : '#icon-close');
  });

  function updateIcon(theme) {
    var use = toggle.querySelector('use');
    if (theme === 'dark') {
      use.setAttribute('href', '#icon-moon');
    } else if (theme === 'light') {
      use.setAttribute('href', '#icon-sun');
    } else {
      use.setAttribute('href', '#icon-circle-half');
    }
  }
});
```

- [ ] **Step 2: Commit**

```bash
git add src/assets/js/theme.js
git commit -m "Add theme toggle and hamburger menu JavaScript"
```

---

### Task 12: Update remaining pages

**Files:**
- Modify: `src/pages/pages.json`
- Modify: `src/pages/books.njk`
- Modify: `src/pages/bg-images.md`
- Modify: `src/pages/search.njk`
- Modify: `src/pages/stats.njk`
- Modify: `src/pages/404.md`
- Modify: `src/pages/soda.md`

- [ ] **Step 1: Update pages.json — remove boxed default**

Replace with:

```json
{
  "whichgrid": "popout",
  "imageDir": "src/assets/img/",
  "image": {
    "source": "about-bob.jpg",
    "alt": "a picture of Bob from 2009"
  }
}
```

- [ ] **Step 2: Update books.njk — remove `.boxed` from year headings**

In `src/pages/books.njk`, change all three occurrences of `class="bookyear text-center boxed"` to `class="bookyear text-center"`:

- Line 30: `<h2 class="bookyear text-center boxed">Currently Reading</h2>` → `<h2 class="bookyear text-center">Currently Reading</h2>`
- Line 46: `<h2 id="y{{ current_year }}" class="bookyear text-center boxed">{{ current_year }}</h2>` → `<h2 id="y{{ current_year }}" class="bookyear text-center">{{ current_year }}</h2>`
- Line 55: `<h2 id="yundated" class="bookyear text-center boxed">Undated: don't know when I read these</h2>` → `<h2 id="yundated" class="bookyear text-center">Undated: don't know when I read these</h2>`

- [ ] **Step 3: Update bg-images.md — remove `.boxed` from images**

In `src/pages/bg-images.md`, on lines 21, 25, 29, 33, 37: change `{.boxed .popout` to `{.popout` and `{.boxed` to `{` (where no `.popout`). Specifically:

- Line 21: `{.boxed .popout loading="eager"` → `{.popout loading="eager"`
- Line 25: `{.boxed loading="lazy"` → `{loading="lazy"`
- Line 29: `{.boxed loading="lazy"` → `{loading="lazy"`
- Line 33: `{.boxed loading="lazy"` → `{loading="lazy"`
- Line 37: `{.boxed loading="lazy"` → `{loading="lazy"`

Also remove the `boxed: false` front matter key (line 12).

- [ ] **Step 4: Verify search.njk needs no changes**

`src/pages/search.njk` already has Pagefind UI commented out and shows a "disabled" message. No changes needed — it will inherit the new design through its grid layout. Confirm no `.boxed` or old color references exist.

- [ ] **Step 5: Clean up dead front matter — remove `boxed: true` from stats.njk, 404.md, soda.md**

Remove the `boxed: true` line from front matter in each file.

- [ ] **Step 6: Commit**

```bash
git add src/pages/pages.json src/pages/books.njk src/pages/bg-images.md src/pages/stats.njk src/pages/404.md src/pages/soda.md
git commit -m "Update pages: remove boxed class and front matter"
```

---

### Task 13: Config cleanup

**Files:**
- Modify: `src/_config/filters/index.js`
- Delete: `src/_config/filters/whichbgimage.js`
- Delete: `src/_data/bgimagerefs.json`

- [ ] **Step 1: Remove whichBgImage from filters/index.js**

Remove the import line and the entry from the filters object:

In `src/_config/filters/index.js`:
- Remove line 7: `import { whichBgImage } from "./whichbgimage.js";`
- Remove line 18: `whichBgImage,`

- [ ] **Step 2: Delete whichbgimage.js and bgimagerefs.json**

```bash
git rm src/_config/filters/whichbgimage.js
git rm src/_data/bgimagerefs.json
```

- [ ] **Step 3: Commit**

```bash
git add src/_config/filters/index.js
git commit -m "Remove whichBgImage filter and background image data"
```

---

### Task 14: Verify the build and all page types

- [ ] **Step 1: Run the dev server**

```bash
npm run sns
```

Expected: site builds without errors.

- [ ] **Step 2: Verify each page type in the browser**

Check in browser at `http://localhost:8080`:
- Home page (`/`) — cards, heading fonts, layout, YouTube embeds
- Blog listing (`/blog/`) — grid layout, link styling
- A blog post — heading alignment, code blocks, blockquotes, images, table of contents, email comment box
- Books page (`/books/`) — bookshelf grid, year headings
- About page (`/about/`)
- Shop page (`/shop/`)
- Background images page (`/background-images/`) — images render without `.boxed`
- Tags page (`/tags/`)
- 404 page — renders, no console errors

- [ ] **Step 3: Verify dark mode**

Toggle to dark mode via the theme panel. Check:
- Background changes to `#353d4d`
- Text becomes white
- Links become white, hover shows yellow bg with black text
- External link icons are visible (white)
- Theme persists across page navigation (localStorage)

- [ ] **Step 4: Verify hamburger menu (mobile)**

Resize browser below 700px:
- Nav links hide, hamburger icon appears
- Clicking hamburger shows nav dropdown
- Clicking again (or X icon) closes it

- [ ] **Step 5: Fix any issues found**

Address any visual or functional issues discovered during verification.

- [ ] **Step 6: Commit any fixes**

Stage specific changed files, then:
```bash
git commit -m "Fix issues found during visual verification"
```

(Only if there are fixes to commit.)
