# Pagefind search — design

## Goal

Re-add client-side search to bobmonsour.com using [Pagefind](https://pagefind.app/) v1.5.2. A search input lives in the global header (visible on wide screens, behind a magnifier icon on mobile). Typing opens a centered results overlay that shows two sections: matching posts (sorted newest first) and matching pages (sorted by relevance). The previous `src/pages/search.njk` page is removed.

## Decisions

- **Search engine:** Pagefind v1.5.2 (latest), invoked via the lower-level JS API (`/pagefind/pagefind.js`), not the prebuilt `PagefindUI` component.
- **Wide screens (≥700px):** real `<input type="search">` in the main nav, between the nav `<ul>` and the theme toggle, placeholder `Enter search term...`.
- **Mobile (≤699px):** magnifier `<button>` in the header (alongside the theme toggle); nav input hidden.
- **Result display:** centered overlay below the header containing only results (wide screens). On mobile the overlay also contains the input at the top.
- **Result card:** title (linked) + date + excerpt with `<mark>` highlights. No images.
- **Sort:** Posts sort by date descending. Pages sort by relevance.
- **Two-section results:** "Posts" (date desc) and "Pages" (relevance). Empty section heading is hidden.
- **Keyboard:** `/` focuses the search input from anywhere on the page (suppressed when focus is already in an input/textarea/contenteditable).
- **Existing `/search/` page:** deleted.

## Architecture

The feature lives entirely in the global header plus a sibling overlay container, with one new JS module and one new CSS file. Indexing scope is controlled at the layout level via `data-pagefind-*` attributes — Pagefind only indexes pages whose markup explicitly opts in.

### Files

**New**
- `src/_includes/css/search.css` — input, icon, overlay, result-card styles. Uses existing CSS variables.
- `src/assets/js/search.js` — search controller (deferred, lazy-imports Pagefind on first interaction).

**Modified**
- `src/_includes/header.njk` — add nav input (wide), magnifier button (mobile), and result-overlay container.
- `src/_includes/icons.njk` — add `<symbol id="icon-search">` (magnifier glyph).
- `src/_includes/head.njk` — add `{% include "css/search.css" %}` to the existing `{% css %}` block alongside `main.css`, `variables.css`, etc. Load `search.js` with `defer`.
- `package.json` — extend the `pagefind` script with `--exclude-selectors` (see Indexing scope below). Add `pagefind` (pinned to `1.5.2`) to `devDependencies` — it is currently invoked via `npx -y` but not installed locally.
- `src/_layouts/postgrid.njk` — add `data-pagefind-body` and `data-pagefind-filter="type:post"` to the post's main content wrapper. Add `data-pagefind-sort="date[datetime]"` and `data-pagefind-meta="date[datetime]"` to the post `<time>` element (both attributes can coexist). Confirm the `<time>` already has a machine-readable `datetime` attribute; add one if missing.
- `src/_includes/nextprevlinks.njk` — add a class (e.g. `nextprev`) to its wrapper `<div>` so it can be excluded via `--exclude-selectors`.
- `src/_layouts/grid.njk` (or whichever layout About/Projects/Books use) — add `data-pagefind-body` and `data-pagefind-filter="type:page"` to the main content wrapper. Confirm during implementation which template owns the `<main>` for these pages.
- `src/pages/about.md`, `src/pages/projects.njk`, `src/pages/books.njk` — if their templates don't pass through `grid.njk`'s body wrapper, annotate directly.

**Deleted**
- `src/pages/search.njk`

### Build flow

Unchanged from current `package.json`:
- `npm run build` runs Eleventy, then `postbuild` runs Pagefind against `_site/`.
- `npm run rs` runs a clean build, then `postdev` (Pagefind + serve).
- **Dev caveat:** `npm run sns` does **not** run Pagefind. In that mode the dynamic import of `/pagefind/pagefind.js` will 404; the UI will catch the error and render "Search is unavailable right now." Use `npm run rs` for full search testing in dev.

NOTE: pagefind is not currently installed as a dev dependency

### Indexing scope

Pagefind by default indexes every `.html` under `_site/`. We override this by adding `data-pagefind-body` only to pages we want indexed, which scopes the index to:

| Page type | Filter | Sort attribute | Source |
|---|---|---|---|
| Blog posts (incl. `notes`, `til`) | `type:post` | `date[datetime]` from post `<time>` | `src/posts/**/*.md` via `postgrid.njk` |
| About | `type:page` | none | `src/pages/about.md` |
| Projects | `type:page` | none | `src/pages/projects.njk` |
| Books | `type:page` | none | `src/pages/books.njk` |

All other pages (`/blog/`, `/notes/`, `/til/`, `/tags/*`, `/shop/`, `/`, `/404/`, `/bg-images/`, `/soda/`, paginated archives, RSS) are **not** indexed.

Within indexed pages, the following are excluded by passing `--exclude-selectors` to the Pagefind CLI (cleaner than per-element annotation since these are repeating elements rendered by includes or markdown-it):

```
--exclude-selectors ".taglist,.nextprev,.table-of-contents,pre"
```

- `.taglist` — already the class on the tag list `<ul>` in `taglist.njk`.
- `.nextprev` — class to be added to the wrapper in `nextprevlinks.njk` (currently a bare `<div>`).
- `.table-of-contents` — default class generated by `markdown-it-table-of-contents`.
- `pre` — all code blocks. (Excluding `<pre>` is sufficient; matched terms inside `<code>` are inside `<pre>`.)

## Components

### `header.njk` markup (sketch)

```njk
<header>
  <a class="skip-nav-link" href="#main-content">Skip navigation</a>
  <a href="/" class="site-name">Bob Monsour</a>
  <button class="menu-toggle" ...>...</button>

  <nav id="main-nav" aria-label="Main">
    <ul class="listolinks list-none">
      {% for link in site.mainNavLinks %}
      <li><a href="{{ link.url }}" {{ link.text | isCurrentPage(page.url) | safe }}>{{ link.text }}</a></li>
      {% endfor %}
    </ul>
  </nav>

  {# Wide-screen search input #}
  <label class="search-label visually-hidden" for="site-search">Search this site</label>
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

  {# Mobile-only search trigger #}
  <button class="search-toggle" type="button" aria-label="Search" aria-controls="search-overlay" aria-expanded="false">
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-search"></use></svg>
  </button>

  <button class="theme-toggle" ...>...</button>
  <div id="theme-panel" ...>...</div>
</header>

{# Sibling overlay: rendered once per page, hidden by default #}
<div id="search-overlay" class="search-overlay" role="dialog" aria-label="Search results" hidden>
  {# On mobile, the input is portaled / re-rendered here at the top #}
  <div class="search-overlay__inner" aria-live="polite">
    {# JS injects: section "Posts" (date desc), section "Pages" (relevance), or "No results" #}
  </div>
</div>
```

CSS hides `.site-search` below 700px and hides `.search-toggle` at 700px+. The overlay reflows accordingly: on mobile it pins an input at the top inside `.search-overlay__inner`; on wide it renders only result sections.

### `search.js` responsibilities

1. Bind:
   - `input` event on `#site-search` (debounced ~150ms).
   - `click` on `.search-toggle` (open overlay, focus the inner mobile input).
   - `keydown` on `document` for `/` (focus the visible input) and `Esc` (close overlay).
   - `click` on `document` for click-outside (close overlay if click target is outside header + overlay).
   - `keydown` (ArrowUp/ArrowDown/Enter) inside overlay for result navigation.
2. On first focus or icon click: `await import("/pagefind/pagefind.js")` and store the module-level singleton. Catch failure → render "Search is unavailable right now."
3. On query change: cancel any pending render. Run two queries in parallel:
   ```js
   const [postRes, pageRes] = await Promise.all([
     pagefind.search(q, { filters: { type: "post" }, sort: { date: "desc" } }),
     pagefind.search(q, { filters: { type: "page" } }),
   ]);
   ```
4. Resolve each result via `await r.data()` to get title, url, excerpt, meta. Render two sections; suppress section heading if empty; render single "No results found for *q*." if both empty.
5. Open overlay (set `aria-expanded="true"` on input/button, `hidden=false` on overlay).
6. Out-of-order guard: tag every query with an incrementing token; only render if token === latest.

### Result card

```html
<a class="search-result" href="{url}">
  <h3 class="search-result__title">{meta.title}</h3>
  <time class="search-result__date" datetime="{ISO}">{formatted date}</time>  <!-- posts only -->
  <p class="search-result__excerpt">{excerpt with <mark>}</p>
</a>
```

Block-level `<a>` so the entire card is clickable. Excerpt comes from Pagefind already wrapped in `<mark>`. The post date is exposed via `data-pagefind-meta="date[datetime]"` on the post `<time>` element, so `result.meta.date` is the ISO string. Format in the browser via `Intl.DateTimeFormat` (the existing `formatdates` filter is server-side Nunjucks and not reusable here).

## Accessibility

- Visually-hidden `<label for="site-search">` reads "Search this site".
- Overlay: `role="dialog"`, `aria-label="Search results"`, non-modal (does not trap focus or block page scroll).
- `aria-live="polite"` on the inner overlay container announces result counts when they update.
- Section headings ("Posts", "Pages") are real `<h3>` elements visible to all users.
- Focus management:
  - `/` focuses the visible input (nav input on wide, opens overlay + focuses internal input on mobile).
  - Esc closes the overlay; focus returns to whichever element opened it.
  - Tab moves naturally from input → first result → next result; arrow keys also move between results.
  - Result cards are real `<a>` elements; Enter navigates.
- `.search-toggle` has `aria-label="Search"` and `aria-expanded` reflects overlay state.
- `/` shortcut is suppressed when focus is already inside an `input`, `textarea`, or `contenteditable` element.

## Error handling

| Failure | UI |
|---|---|
| `import("/pagefind/pagefind.js")` rejects | Overlay renders "Search is unavailable right now." Input remains usable. Console logs the error. |
| `pagefind.search()` throws | Same fallback message. |
| Both filtered queries return zero results | "No results found for *[query]*." |
| Empty query (after typing then deleting) | Overlay closes. |

## Edge cases

- **Rapid typing:** debounce + out-of-order render guard (incrementing query token).
- **Empty input:** overlay closes; no "No results" rendered.
- **Quotes / special chars in query:** passed through unchanged; Pagefind handles tokenization.
- **Theme switching:** `search.css` uses existing CSS variables (`--bg-card`, `--accent-line`, `--text-color`, etc.) so light / dark / auto are inherited automatically.
- **Result clicked:** browser navigates; overlay closes naturally on unload. No manual cleanup needed.

## Out of scope (explicit non-goals)

- No images in result cards.
- No tag/category filters in the search UI.
- No analytics on search queries.
- No URL-driven search (`/?q=foo` does not auto-trigger).
- No keyboard shortcut other than `/`.
- No no-JS fallback page.
- No changes to the dev-mode workflow (the live-reload `sns` script does not run Pagefind; this is documented but not fixed).

## Verification

Static site, no test suite. Verification is build-level + manual UI.

### Build-level

- `npm run build` completes without errors.
- `_site/pagefind/pagefind.js` and the index `.pf_*` files exist after build.
- Inspecting a built post HTML file in `_site/` shows: `data-pagefind-body`, `data-pagefind-filter="type:post"`, and `data-pagefind-sort="date[datetime]"` + `data-pagefind-meta="date[datetime]"` on the post `<time>`. Confirm the wrapper `<div>` in `nextprevlinks.njk` carries the `nextprev` class.
- The Pagefind CLI invocation in `package.json` includes `--exclude-selectors ".taglist,.nextprev,.table-of-contents,pre"`.
- Inspecting `_site/about/index.html`, `_site/projects/index.html`, `_site/books/index.html`: each has `data-pagefind-body` and `data-pagefind-filter="type:page"`.
- Inspecting `_site/blog/index.html`, `_site/tags/foo/index.html`, `_site/index.html` (home): no `data-pagefind-body`, so Pagefind ignores them.

### Manual UI checks (after `npm run rs`)

1. Wide screen: nav input visible right of "About"; placeholder reads "Enter search term…"; pressing `/` focuses it.
2. Type a term known to be in multiple recent posts: overlay opens centered below the header; "Posts" section shows results in date desc.
3. Excerpts contain `<mark>` highlights.
4. Esc closes; click outside closes; clearing the input closes.
5. Tab moves from input into first result; ArrowUp/Down moves between results; Enter navigates.
6. Mobile (≤699px or DevTools narrow): magnifier visible; nav input hidden; tapping icon opens overlay with input pinned at top inside it; results render the same.
7. Theme toggle: dark → search → legible; light → search → legible.
8. Search a term that appears only in code (e.g., `addPlugin`): expect zero post matches (code blocks excluded). Confirms exclusion.
9. Search a term that exists only on the About page: expect a result in the Pages section, none in Posts.
10. Search a nonsense term: "No results found for [term]" message renders.

### Negative checks

- Search a term that appears only on a listing page (e.g., a tag name visible on `/tags/`): no result, since listing pages are not indexed.
- The deleted `/search/` URL returns 404.

## Open questions for implementation phase

- Confirm which template owns the `<main>` wrapper for About, Projects, Books — annotate `data-pagefind-body` at the right level so it covers content but not site chrome.
- Confirm `markdown-it-table-of-contents` actually emits `class="table-of-contents"` (default in current versions) — adjust the `--exclude-selectors` value if the site uses a different class.
