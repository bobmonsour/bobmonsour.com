# Pagefind Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-add Pagefind v1.5.2 client-side search to bobmonsour.com with a nav input on wide screens, a search-icon button on mobile, and a centered results overlay that shows two sections (posts by date desc, pages by relevance).

**Architecture:** Pagefind indexes `_site/` after every production build. Three indexed types: posts (filter `type:post`, sortable by date), and About/Projects/Books (filter `type:page`). Browser code lazy-imports `/pagefind/pagefind.js` on first user interaction, runs two filtered queries in parallel, and renders results into a sibling-of-header overlay container. Inputs are mirrored: a real `<input>` lives in the nav (visible ≥700px) and a second `<input>` lives at the top of the overlay (visible ≤699px). The mobile-only search-icon button toggles the overlay open.

**Tech Stack:** Eleventy v4 alpha (Nunjucks + Markdown), Pagefind v1.5.2, vanilla ES module, plain CSS using existing CSS variables. No bundler, no test framework.

**Spec:** `docs/superpowers/specs/2026-04-29-pagefind-search-design.md`

---

## File Structure

**New files**
- `src/_includes/css/search.css` — search-related styles (input, icon, overlay, result cards). Uses existing CSS variables.
- `src/assets/js/search.js` — search controller. Single ES module, ~200 lines. Lazy-imports Pagefind, runs queries, renders results, manages overlay state.

**Modified files**
- `package.json` — add `pagefind@1.5.2` to `devDependencies`; extend the `pagefind` script with `--exclude-selectors`.
- `src/_layouts/postgrid.njk` — add `data-pagefind-body` + `data-pagefind-filter="type:post"` to the post `<article>`. Wrap the post date in a `<time>` element with `data-pagefind-sort` and `data-pagefind-meta`.
- `src/_layouts/grid.njk` — conditionally add `data-pagefind-body` + `data-pagefind-filter="type:page"` to the inner `<div class="{{ whichgrid }}">` when front matter sets `pagefindIndex: true`.
- `src/pages/about.md`, `src/pages/projects.njk`, `src/pages/books.njk` — add `pagefindIndex: true` to front matter.
- `src/_includes/nextprevlinks.njk` — add `class="nextprev"` to the wrapper `<div>` so the Pagefind CLI can exclude it.
- `src/_includes/icons.njk` — add `<symbol id="icon-search">`.
- `src/_includes/header.njk` — add the wide-screen `<input>`, the mobile `<button>` with the icon, and the overlay container.
- `src/_includes/head.njk` — add `{% include "css/search.css" %}` to the `{% css %}` block; load `/assets/js/search.js` with `defer`.

**Deleted**
- `src/pages/search.njk`

---

## Verification

There is no test framework. Each task ends with build-level checks (`npm run build` or `npm run rs`) and grep-style assertions on the built `_site/` HTML. The final task walks the manual UI checklist from the spec.

---

## Task 1: Install Pagefind, update build script, add nextprev class

**Files:**
- Modify: `package.json`
- Modify: `src/_includes/nextprevlinks.njk`

- [ ] **Step 1: Install Pagefind as a dev dependency pinned to 1.5.2**

Run:
```bash
npm install --save-dev pagefind@1.5.2
```

Expected: `package.json` and `package-lock.json` updated, `node_modules/pagefind/` exists.

- [ ] **Step 2: Edit `package.json` so the `pagefind` and `postdev` scripts call the local binary and pass `--exclude-selectors`**

Replace these two lines in the `scripts` block:

```json
    "postdev": "npx -y pagefind --site _site --serve --force-language unknown",
    "pagefind": "npx -y pagefind --site _site --force-language unknown",
```

with:

```json
    "postdev": "pagefind --site _site --serve --force-language unknown --exclude-selectors \".taglist,.nextprev,.table-of-contents,pre\"",
    "pagefind": "pagefind --site _site --force-language unknown --exclude-selectors \".taglist,.nextprev,.table-of-contents,pre\"",
```

(`pagefind` is now in `devDependencies`, so `npx -y` is no longer needed and `node_modules/.bin/pagefind` resolves automatically.)

- [ ] **Step 3: Add `class="nextprev"` to the wrapper `<div>` in `src/_includes/nextprevlinks.njk`**

Replace the file's content with:

```njk
{#
  Display next post and previous post links at the bottom of each post.
#}
<div class="nextprev">
  {%- set previousPost = theseposts | getPreviousCollectionItem %}
  {%- set nextPost = theseposts | getNextCollectionItem %}
  {%- if nextPost or previousPost %}
    {%- if previousPost %}
      <p>Previous post: <a href="{{ previousPost.url }}">{{ previousPost.data.title }}</a></p>{% endif %}
    {%- if nextPost %}
      <p>Next post (in time): <a href="{{ nextPost.url }}">{{ nextPost.data.title }}</a></p>{% endif %}
  {%- endif %}
</div>
```

- [ ] **Step 4: Verify a clean production build still succeeds**

Run:
```bash
npm run build
```

Expected: Build completes, `_site/` regenerated, `_site/pagefind/pagefind.js` exists (Pagefind ran on `_site/` even though no pages opt in yet — it indexes the whole site at this point, but that gets fixed in Task 2).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/_includes/nextprevlinks.njk
git commit -m "Install pagefind 1.5.2 and wire CLI excludes"
```

---

## Task 2: Annotate post layout for indexing

**Files:**
- Modify: `src/_layouts/postgrid.njk`

- [ ] **Step 1: Add `data-pagefind-body` and `data-pagefind-filter` to the post `<article>`**

In `src/_layouts/postgrid.njk`, change line 10 from:

```njk
  <article class="central">
```

to:

```njk
  <article class="central" data-pagefind-body data-pagefind-filter="type:post">
```

- [ ] **Step 2: Wrap the post date in a `<time>` element with sort and meta attributes**

Still in `src/_layouts/postgrid.njk`, change line 13 from:

```njk
      <p class="no-bot-margin">{{ date | formatPostDate }} &middot; {{ content | readingTime }}</p>
```

to:

```njk
      <p class="no-bot-margin"><time datetime="{{ date | toDateString }}" data-pagefind-sort="date[datetime]" data-pagefind-meta="date[datetime]">{{ date | formatPostDate }}</time> &middot; {{ content | readingTime }}</p>
```

(`toDateString` is the existing filter in `src/_config/filters/formatdates.js` that returns `yyyy-mm-dd`.)

- [ ] **Step 3: Build and verify a representative post HTML carries the new attributes**

Run:
```bash
npm run build
```

Then check a recent post:
```bash
grep -E 'data-pagefind-body|data-pagefind-filter|data-pagefind-sort|data-pagefind-meta' _site/blog/north-bay-python-2026/index.html
```

Expected output (lines may wrap):
- `<article class="central" data-pagefind-body data-pagefind-filter="type:post">`
- `<time datetime="2026-..." data-pagefind-sort="date[datetime]" data-pagefind-meta="date[datetime]">`

- [ ] **Step 4: Verify Pagefind now sees the post as indexable**

Run:
```bash
ls _site/pagefind/fragment/ | head
```

Expected: a non-empty list of fragment files (one per indexed page). Pagefind 1.5+ writes one fragment per page that has `data-pagefind-body`.

- [ ] **Step 5: Commit**

```bash
git add src/_layouts/postgrid.njk
git commit -m "Annotate post layout for pagefind indexing"
```

---

## Task 3: Annotate page layout & opt About/Projects/Books in

**Files:**
- Modify: `src/_layouts/grid.njk`
- Modify: `src/pages/about.md`
- Modify: `src/pages/projects.njk`
- Modify: `src/pages/books.njk`

- [ ] **Step 1: Make the `grid.njk` body wrapper conditionally indexable**

In `src/_layouts/grid.njk`, change lines 7–11 from:

```njk
  <main id="main-content" class="content">
    <div class="{{ whichgrid }}">
      {{ content | safe }}
    </div>
  </main>
```

to:

```njk
  <main id="main-content" class="content">
    <div class="{{ whichgrid }}"{% if pagefindIndex %} data-pagefind-body data-pagefind-filter="type:page"{% endif %}>
      {{ content | safe }}
    </div>
  </main>
```

- [ ] **Step 2: Opt About page in**

In `src/pages/about.md`, add `pagefindIndex: true` to the front matter. The block becomes:

```yaml
---
layout: grid.njk
title: About
description: A bit more information about Bob Monsour.
date: 2025-08-25
keywords: retired, web development, eleventy, tennis, about
permalink: /about/
pagefindIndex: true
---
```

- [ ] **Step 3: Opt Projects page in**

In `src/pages/projects.njk`, add `pagefindIndex: true` to the front matter. The block becomes:

```yaml
---
layout: grid.njk
title: Projects
description: These are some of the projects and websites that I am either working on or have worked on.
keywords: retired, web development, eleventy, tennis, archives
permalink: /projects/
pagefindIndex: true
---
```

- [ ] **Step 4: Opt Books page in**

In `src/pages/books.njk`, add `pagefindIndex: true` to the front matter. The block becomes:

```yaml
---
layout: grid.njk
whichgrid: popout
title: Books
description: These are books that I've read over the years, though for many, I don't know what year that I read them.
keywords: books, reading, bookshelf
tags: [books]
permalink: /books/
pagefindIndex: true
---
```

- [ ] **Step 5: Build and verify only the three pages got annotated**

Run:
```bash
npm run build
grep -l 'data-pagefind-filter="type:page"' _site/**/index.html 2>/dev/null
```

Expected exactly three matches: `_site/about/index.html`, `_site/projects/index.html`, `_site/books/index.html`. (If your shell does not expand `**`, run `grep -rl 'data-pagefind-filter="type:page"' _site/` instead.)

- [ ] **Step 6: Verify other pages are NOT annotated**

Run:
```bash
grep -L 'data-pagefind-body' _site/blog/index.html _site/notes/index.html _site/til/index.html _site/shop/index.html _site/index.html
```

Expected: all five files listed (none contain the attribute).

- [ ] **Step 7: Commit**

```bash
git add src/_layouts/grid.njk src/pages/about.md src/pages/projects.njk src/pages/books.njk
git commit -m "Index About, Projects, Books as pagefind type:page"
```

---

## Task 4: Add the search icon SVG sprite

**Files:**
- Modify: `src/_includes/icons.njk`

- [ ] **Step 1: Add the `icon-search` symbol to the SVG sprite**

In `src/_includes/icons.njk`, add this `<symbol>` immediately after the existing `<symbol id="icon-circle-half">` line (line 7):

```html
    <symbol id="icon-search" viewBox="0 0 512 512"><path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></symbol>
```

(Font Awesome Free 6.7.2 magnifying-glass, CC BY 4.0 — same source as the existing icons.)

- [ ] **Step 2: Build and verify the icon symbol renders into the page**

Run:
```bash
npm run build
grep 'icon-search' _site/about/index.html
```

Expected: at least one match showing the `<symbol id="icon-search">` line in the inlined sprite.

- [ ] **Step 3: Commit**

```bash
git add src/_includes/icons.njk
git commit -m "Add search icon to SVG sprite"
```

---

## Task 5: Build search.css and include it in head.njk

**Files:**
- Create: `src/_includes/css/search.css`
- Modify: `src/_includes/head.njk`

- [ ] **Step 1: Create `src/_includes/css/search.css` with the full stylesheet**

Create the file with this exact content:

```css
/* === Wide-screen nav search input === */
.site-search {
  font-family: var(--font-body);
  font-size: var(--step--1);
  padding: var(--space-3xs) var(--space-2xs);
  background: transparent;
  color: var(--text-color);
  border: var(--accent-width) solid var(--accent-line);
  border-radius: var(--radius);
  width: 14rem;
  max-width: 100%;
}
.site-search:focus {
  outline: 2px solid var(--text-color);
  outline-offset: 2px;
}
.site-search::placeholder {
  color: var(--text-muted);
  opacity: 0.6;
}

/* === Mobile search trigger button === */
.search-toggle {
  position: absolute;
  right: calc(var(--space-m) + 2.25rem);
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
.search-toggle:hover { opacity: 0.6; }
.search-toggle:focus-visible {
  opacity: 0.6;
  outline: 2px solid var(--text-color);
  outline-offset: 2px;
}
.search-toggle svg {
  width: 1.25rem;
  height: 1.25rem;
}

/* Hide the wide-screen input on mobile, hide the icon on wide */
@media (max-width: 699px) {
  .site-search { display: none; }
}
@media (min-width: 700px) {
  .search-toggle { display: none; }
}

/* === Results overlay === */
.search-overlay[hidden] { display: none; }
.search-overlay {
  position: relative;
  background: var(--bg-card);
  border-block: var(--accent-width) solid var(--accent-line);
  padding: var(--space-m);
  margin-inline: auto;
  max-width: min(65ch, 100%);
  z-index: 5;
}

/* Input that lives inside the overlay (mobile only) */
.search-overlay__input {
  font-family: var(--font-body);
  font-size: var(--step-0);
  padding: var(--space-2xs) var(--space-s);
  background: transparent;
  color: var(--text-color);
  border: var(--accent-width) solid var(--accent-line);
  border-radius: var(--radius);
  width: 100%;
  margin-block-end: var(--space-m);
}
.search-overlay__input:focus {
  outline: 2px solid var(--text-color);
  outline-offset: 2px;
}
@media (min-width: 700px) {
  .search-overlay__input { display: none; }
}

/* === Result sections & cards === */
.search-section + .search-section {
  margin-block-start: var(--space-m);
}
.search-section__heading {
  font-size: var(--step-0);
  font-family: var(--font-heading-serif);
  margin-block: 0 var(--space-xs);
  border-block-end: var(--accent-width) solid var(--accent-line);
  padding-block-end: var(--space-3xs);
}
.search-results {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--space-s);
}
.search-result {
  display: block;
  text-decoration: none;
  color: var(--text-color);
  padding: var(--space-2xs);
  border-radius: var(--radius);
}
.search-result:hover,
.search-result:focus-visible {
  background: var(--link-hover-bg);
  color: var(--link-hover-color);
  outline: none;
}
.search-result__title {
  font-size: var(--step-0);
  font-weight: 700;
  margin: 0;
}
.search-result__date {
  font-size: var(--step--1);
  color: var(--text-muted);
  display: block;
  margin-block: var(--space-3xs);
}
.search-result__excerpt {
  font-size: var(--step--1);
  margin: 0;
  line-height: 1.5;
}
.search-result__excerpt mark {
  background: var(--link-hover-bg);
  color: inherit;
  font-weight: 700;
  padding: 0 0.1em;
}
.search-empty {
  text-align: center;
  font-style: italic;
  color: var(--text-muted);
  margin: 0;
}

/* Visually-hidden helper for the announce region */
.search-announce {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
```

- [ ] **Step 2: Include `search.css` in the bundled CSS block of `head.njk`**

In `src/_includes/head.njk`, change lines 49–56 from:

```njk
  {% css %}
    {% include "css/fonts.css" %}
    {% include "css/variables.css" %}
    {% include "css/base.css" %}
    {% include "css/main.css" %}
    {% include "css/footer.css" %}
    {% include "css/utilities.css" %}
  {% endcss %}
```

to:

```njk
  {% css %}
    {% include "css/fonts.css" %}
    {% include "css/variables.css" %}
    {% include "css/base.css" %}
    {% include "css/main.css" %}
    {% include "css/footer.css" %}
    {% include "css/utilities.css" %}
    {% include "css/search.css" %}
  {% endcss %}
```

- [ ] **Step 3: Build and verify the new CSS lands in the bundle**

Run:
```bash
npm run build
grep -l 'site-search' _site/_bundle/*.css 2>/dev/null || grep -r 'site-search' _site/ --include='*.css' | head
```

Expected: at least one `.css` file under `_site/` (Eleventy writes the bundle to a hashed path) contains the `.site-search` rule.

- [ ] **Step 4: Commit**

```bash
git add src/_includes/css/search.css src/_includes/head.njk
git commit -m "Add search.css and include in CSS bundle"
```

---

## Task 6: Update header.njk markup

**Files:**
- Modify: `src/_includes/header.njk`

- [ ] **Step 1: Replace `src/_includes/header.njk` with the new markup**

Replace the entire content of `src/_includes/header.njk` with:

```njk
<header>
  <a class="skip-nav-link" href="#main-content">Skip navigation</a>
  <a href="/" class="site-name">Bob Monsour</a>
  <button class="menu-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Menu">
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <use href="#icon-menu"></use>
    </svg>
  </button>
  <nav id="main-nav" aria-label="Main">
    <ul class="listolinks list-none">
      {% for link in site.mainNavLinks %}
      <li><a href="{{ link.url }}" {{ link.text | isCurrentPage(page.url) | safe }}>{{ link.text }}</a></li>
      {% endfor %}
    </ul>
  </nav>
  <label class="visually-hidden" for="site-search">Search this site</label>
  <input
    id="site-search"
    class="site-search"
    type="search"
    placeholder="Enter search term..."
    autocomplete="off"
    spellcheck="false"
    aria-controls="search-overlay"
    aria-expanded="false"
  >
  <button class="search-toggle" type="button" aria-label="Search" aria-controls="search-overlay" aria-expanded="false">
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <use href="#icon-search"></use>
    </svg>
  </button>
  <button class="theme-toggle" aria-expanded="false" aria-controls="theme-panel" aria-label="Theme settings">
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <use href="#icon-sun"></use>
    </svg>
  </button>
  <div id="theme-panel" class="theme-panel" role="group" aria-labelledby="theme-legend" aria-hidden="true">
    <span id="theme-legend" class="visually-hidden">Theme</span>
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
  </div>
</header>

<div id="search-overlay" class="search-overlay" role="dialog" aria-label="Search results" hidden>
  <input
    type="search"
    class="search-overlay__input"
    placeholder="Enter search term..."
    autocomplete="off"
    spellcheck="false"
    aria-label="Search this site"
  >
  <div class="search-overlay__inner"></div>
  <span class="search-announce" aria-live="polite"></span>
</div>
```

(`visually-hidden` is the project's existing utility class — defined at `src/_includes/css/utilities.css:15`.)

- [ ] **Step 2: Build and verify the markup ends up in pages**

Run:
```bash
npm run build
grep 'id="site-search"' _site/about/index.html
grep 'id="search-overlay"' _site/about/index.html
grep 'class="search-toggle"' _site/about/index.html
```

Expected: each `grep` finds exactly one match.

- [ ] **Step 3: Manual smoke check (no JS yet, just CSS layout)**

Run `npm run sns` and load the site in a browser. Resize the window:
- Wide (≥700px): the `Enter search term...` input is visible in the header next to the nav links; the magnifier icon is hidden.
- Mobile (≤699px): the magnifier icon is visible to the left of the theme toggle; the input is hidden. The overlay container is `[hidden]` so nothing extra appears below the header.

Stop the dev server with Ctrl-C when done.

- [ ] **Step 4: Commit**

```bash
git add src/_includes/header.njk
git commit -m "Add search input, mobile toggle, and overlay container to header"
```

---

## Task 7: Build search.js and load it in head.njk

**Files:**
- Create: `src/assets/js/search.js`
- Modify: `src/_includes/head.njk`

- [ ] **Step 1: Create `src/assets/js/search.js` with the full controller**

Create the file with this exact content:

```js
const PAGEFIND_PATH = "/pagefind/pagefind.js";
const DEBOUNCE_MS = 150;
const MAX_POSTS = 20;
const MAX_PAGES = 10;
const MOBILE_QUERY = "(max-width: 699px)";

const navInput = document.getElementById("site-search");
const toggleBtn = document.querySelector(".search-toggle");
const overlay = document.getElementById("search-overlay");
const overlayInput = overlay && overlay.querySelector(".search-overlay__input");
const overlayInner = overlay && overlay.querySelector(".search-overlay__inner");
const announce = overlay && overlay.querySelector(".search-announce");

let pagefind = null;
let pagefindLoadPromise = null;
let lastQueryToken = 0;
let debounceHandle = null;

if (navInput && toggleBtn && overlay && overlayInput && overlayInner && announce) {
  bind();
}

function bind() {
  navInput.addEventListener("input", onInput);
  overlayInput.addEventListener("input", onInput);

  toggleBtn.addEventListener("click", () => {
    if (overlay.hidden) {
      openOverlay();
      overlayInput.focus();
    } else {
      closeOverlay();
    }
  });

  document.addEventListener("keydown", onKeydown);
  document.addEventListener("click", onDocClick);
}

function onInput(e) {
  const value = e.target.value;
  const q = value.trim();

  if (e.target === navInput) overlayInput.value = value;
  else navInput.value = value;

  if (debounceHandle) clearTimeout(debounceHandle);

  if (q === "") {
    closeOverlay();
    return;
  }
  debounceHandle = setTimeout(() => runQuery(q), DEBOUNCE_MS);
}

function onKeydown(e) {
  if (e.key === "/") {
    const t = e.target;
    if (t && t.matches && t.matches("input, textarea, [contenteditable=true]")) return;
    e.preventDefault();
    if (window.matchMedia(MOBILE_QUERY).matches) {
      openOverlay();
      overlayInput.focus();
    } else {
      navInput.focus();
    }
    return;
  }
  if (e.key === "Escape" && !overlay.hidden) {
    closeOverlay();
    if (window.matchMedia(MOBILE_QUERY).matches) toggleBtn.focus();
    else navInput.focus();
    return;
  }
  if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !overlay.hidden) {
    handleArrow(e);
  }
}

function onDocClick(e) {
  if (overlay.hidden) return;
  if (overlay.contains(e.target)) return;
  const header = document.querySelector("header");
  if (header && header.contains(e.target)) return;
  closeOverlay();
}

async function loadPagefind() {
  if (pagefind) return pagefind;
  if (!pagefindLoadPromise) {
    pagefindLoadPromise = import(PAGEFIND_PATH).then((mod) => {
      pagefind = mod;
      return mod;
    });
  }
  return pagefindLoadPromise;
}

async function runQuery(q) {
  const token = ++lastQueryToken;
  let lib;
  try {
    lib = await loadPagefind();
  } catch (err) {
    console.error("Pagefind failed to load", err);
    showUnavailable();
    return;
  }

  let postRes, pageRes;
  try {
    [postRes, pageRes] = await Promise.all([
      lib.search(q, { filters: { type: "post" }, sort: { date: "desc" } }),
      lib.search(q, { filters: { type: "page" } }),
    ]);
  } catch (err) {
    console.error("Pagefind search failed", err);
    showUnavailable();
    return;
  }

  if (token !== lastQueryToken) return;

  const [postData, pageData] = await Promise.all([
    Promise.all(postRes.results.slice(0, MAX_POSTS).map((r) => r.data())),
    Promise.all(pageRes.results.slice(0, MAX_PAGES).map((r) => r.data())),
  ]);

  if (token !== lastQueryToken) return;

  render(q, postData, pageData);
  openOverlay();
}

function render(q, posts, pages) {
  const sections = [];
  if (posts.length) sections.push(renderSection("Posts", posts, true));
  if (pages.length) sections.push(renderSection("Pages", pages, false));

  if (sections.length === 0) {
    overlayInner.innerHTML =
      `<p class="search-empty">No results found for <em>${escapeHtml(q)}</em>.</p>`;
  } else {
    overlayInner.innerHTML = sections.join("");
  }

  announce.textContent =
    `${posts.length} ${posts.length === 1 ? "post" : "posts"} and ` +
    `${pages.length} ${pages.length === 1 ? "page" : "pages"} found.`;
}

function renderSection(heading, results, withDate) {
  const cards = results.map((r) => renderCard(r, withDate)).join("");
  return `<section class="search-section">
    <h3 class="search-section__heading">${escapeHtml(heading)}</h3>
    <ul class="search-results">${cards}</ul>
  </section>`;
}

function renderCard(r, withDate) {
  const title = (r.meta && r.meta.title) ? r.meta.title : "Untitled";
  const dateIso = withDate && r.meta && r.meta.date;
  const dateHtml = dateIso
    ? `<time class="search-result__date" datetime="${escapeAttr(dateIso)}">${escapeHtml(formatDate(dateIso))}</time>`
    : "";
  return `<li><a class="search-result" href="${escapeAttr(r.url)}">
    <h4 class="search-result__title">${escapeHtml(title)}</h4>
    ${dateHtml}
    <p class="search-result__excerpt">${r.excerpt}</p>
  </a></li>`;
}

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric", month: "short", day: "numeric"
  }).format(d);
}

function showUnavailable() {
  overlayInner.innerHTML =
    `<p class="search-empty">Search is unavailable right now.</p>`;
  announce.textContent = "Search is unavailable.";
  openOverlay();
}

function openOverlay() {
  overlay.hidden = false;
  navInput.setAttribute("aria-expanded", "true");
  toggleBtn.setAttribute("aria-expanded", "true");
}

function closeOverlay() {
  overlay.hidden = true;
  navInput.setAttribute("aria-expanded", "false");
  toggleBtn.setAttribute("aria-expanded", "false");
  navInput.value = "";
  overlayInput.value = "";
  if (debounceHandle) clearTimeout(debounceHandle);
}

function handleArrow(e) {
  const links = overlay.querySelectorAll(".search-result");
  if (links.length === 0) return;
  const idx = Array.from(links).indexOf(document.activeElement);
  e.preventDefault();
  if (e.key === "ArrowDown") {
    if (idx === -1) links[0].focus();
    else if (idx < links.length - 1) links[idx + 1].focus();
  } else {
    if (idx <= 0) {
      const target = window.matchMedia(MOBILE_QUERY).matches ? overlayInput : navInput;
      target.focus();
    } else {
      links[idx - 1].focus();
    }
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}
function escapeAttr(s) { return escapeHtml(s); }
```

Note: result excerpts come from Pagefind already wrapped in `<mark>` tags, so we deliberately do *not* `escapeHtml` `r.excerpt`.

- [ ] **Step 2: Load `search.js` from `head.njk` with `defer`**

In `src/_includes/head.njk`, immediately after the closing `</script>` of the theme-init block (line 24) — i.e., right after the line `</script>` that closes the inline IIFE — add:

```html

  {# Defer-loaded site search controller #}
  <script src="/assets/js/search.js" type="module" defer></script>
```

The `type="module"` is required because `search.js` uses `import()` for the dynamic Pagefind import. `defer` ensures the DOM is parsed before the script runs (modules are deferred by default but explicit `defer` documents intent).

- [ ] **Step 3: Build and verify search.js is present in the output**

Run:
```bash
npm run build
ls _site/assets/js/search.js
grep 'search.js' _site/about/index.html
```

Expected: the file exists in `_site/assets/js/`, and the `<script>` tag appears in built pages.

- [ ] **Step 4: Manual smoke test — full search loop**

Run:
```bash
npm run rs
```

This cleans `_site`, builds, runs Pagefind, and serves with live reload. Open the served URL in a browser.

Test on a wide window (≥700px):
1. Click into the nav input. Type `eleventy` (case-insensitive).
2. Within ~150ms, the overlay appears below the header showing a "Posts" section with multiple results, sorted by date desc (newest at top). Each card has a title, date, and excerpt with `<mark>` highlights.
3. If the term also matches About/Projects/Books, a "Pages" section appears after Posts with relevance-ordered results.
4. Press Esc — overlay closes, focus returns to the input.

Test on a narrow window (DevTools device toolbar, ≤699px):
5. Click the magnifier icon — overlay opens with an input pinned at top; focus lands in that input.
6. Type `eleventy` — same results behavior.
7. Click the magnifier again or press Esc — overlay closes.

Test the keyboard shortcut:
8. With focus anywhere on the page (not in an input), press `/`. On wide, focus jumps to the nav input. On mobile, the overlay opens and focus lands in the overlay input.

Stop the dev server with Ctrl-C when done.

- [ ] **Step 5: Commit**

```bash
git add src/assets/js/search.js src/_includes/head.njk
git commit -m "Add search controller: lazy-load pagefind, render two sections"
```

---

## Task 8: Delete the obsolete /search/ page

**Files:**
- Delete: `src/pages/search.njk`

- [ ] **Step 1: Delete `src/pages/search.njk`**

Run:
```bash
rm src/pages/search.njk
```

- [ ] **Step 2: Verify the build no longer produces `/search/`**

Run:
```bash
npm run build
test ! -d _site/search && echo "OK: /search/ no longer built" || echo "FAIL: _site/search still exists"
```

Expected: `OK: /search/ no longer built`.

- [ ] **Step 3: Verify no template still links to `/search/`**

Run:
```bash
grep -r '/search/' src/ || echo "no internal references"
```

Expected: `no internal references` (or only references that aren't internal links — review any output and remove any stragglers).

- [ ] **Step 4: Commit**

```bash
git add -u src/pages/search.njk
git commit -m "Remove obsolete /search/ page"
```

---

## Task 9: Final manual verification & negative checks

**Files:** none modified — this task is a walk-through of the spec's verification checklist.

- [ ] **Step 1: Clean build and serve**

```bash
npm run rs
```

Wait for the dev server to start.

- [ ] **Step 2: Build-level inspections**

In another terminal, while `_site/` is current:

```bash
ls _site/pagefind/pagefind.js
```
Expected: file exists.

```bash
ls _site/pagefind/fragment/ | wc -l
```
Expected: roughly the number of indexable pages (≈ blog posts + 3 page entries).

```bash
grep -l 'data-pagefind-filter="type:post"' _site/blog/*/index.html | head -3
```
Expected: at least three post HTML files.

```bash
grep -l 'data-pagefind-filter="type:page"' _site/about/index.html _site/projects/index.html _site/books/index.html
```
Expected: all three files listed.

```bash
grep -L 'data-pagefind-body' _site/blog/index.html _site/tags/eleventy/index.html _site/index.html
```
Expected: all three listed (i.e., listing/home pages have NO body annotation).

- [ ] **Step 3: Manual UI checklist (browser)**

Wide screen (≥700px), then narrow (≤699px). For each:

1. Nav input visible / icon visible (per breakpoint). Placeholder reads `Enter search term...` exactly.
2. Press `/` from anywhere on page. Focus lands in input (wide) or overlay opens with input focused (mobile).
3. Type a term known to be in multiple recent posts (e.g., `eleventy`). Overlay opens centered; "Posts" section sorted by date desc.
4. Confirm `<mark>` highlights are visible inside excerpts.
5. Esc closes; click outside the header+overlay closes; clearing the input closes.
6. Tab from input into first result link; Arrow Down/Up moves between results; Arrow Up from first result returns to input. Enter on a focused result navigates.
7. Toggle to dark theme; search again; overlay and results are legible.
8. Search a term that exists only in code blocks (e.g., a token unique to a code sample). Expected: zero matches. (Confirms `pre` exclusion.)
9. Search a term unique to About (e.g., `Tennis` if it appears there). Expected: result appears in "Pages", not "Posts".
10. Search nonsense (e.g., `xyzqqq`). Expected: `No results found for xyzqqq.`

- [ ] **Step 4: Negative checks**

11. Try a term that appears only on a listing page (e.g., a tag name visible at `/tags/`). Expected: no result, since listing pages aren't indexed.
12. Visit `/search/` directly. Expected: 404.

- [ ] **Step 5: Stop the dev server and commit any incidental fixes**

If you needed to adjust styles, copy, or icon offsets during the walkthrough, commit them now. Otherwise this task ends with no code change.

```bash
git status
# if clean: nothing to commit. If you fixed anything during checks:
git add <files>
git commit -m "Polish: <what you fixed>"
```

---

## Self-Review — covered by tasks

Mapping spec sections → tasks:

| Spec section | Task(s) |
|---|---|
| Pagefind v1.5.2 + `--exclude-selectors` + nextprev class | 1 |
| Post layout: `data-pagefind-body`, filter, sort, meta | 2 |
| About/Projects/Books: `data-pagefind-body`, filter | 3 |
| Search icon SVG | 4 |
| `search.css` + bundle wiring | 5 |
| Header markup: input, button, overlay container | 6 |
| `search.js` controller, lazy import, two queries, two sections | 7 |
| Keyboard `/`, Esc, arrows; click-outside; aria | 7 |
| Error handling: load/search failure, no results, empty query | 7 |
| Delete `/search/` page | 8 |
| Build & UI verification, negative checks | 9 |
