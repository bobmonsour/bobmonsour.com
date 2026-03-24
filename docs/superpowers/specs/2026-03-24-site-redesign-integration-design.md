# Site Redesign Integration — Design Spec

Integrates the visual redesign prototyped in the `gfp` sibling project into the bobmonsour.com Eleventy site. This is a full replacement of the current design using a CSS-first migration approach.

## Summary of Changes

**What changes:**
- Typography: system fonts → IBM Plex Mono (body) + IBM Plex Serif (headings) via Google Fonts
- Colors: peach bg / blue-red accent → sky-blue bg (#C7E2F6) / black text / yellow hover, plus dark mode (#353d4d)
- Header: simple nav → responsive header with hamburger menu (mobile) and light/dark/auto theme toggle
- Footer: icon-based social links with tooltips → text-based social links with underline hover
- Cards: `.boxed` class with red border → `.card` class with partial accent-line borders
- Scroll-to-top: circular SVG button → square text arrow with accent-line border
- Link styling: dashed underlines + dashed outlines → solid thin underlines + yellow highlight hover
- Background images: removed entirely (the `/background-images/` page is kept as historical content)
- Pagefind search: removed (to be re-added later); `data-pagefind-body` attributes left in templates for easier re-integration
- Line-height: 1.35 → 1.6 (intentional — monospace body font needs more vertical spacing for readability)

**What stays:**
- Spacing scale (same Utopia values)
- Content grid system (full/feature/popout/central named grid lines)
- Home grid layouts (homegrid, homegrid2) — same responsive breakpoints
- External link indicator (SVG ::after on external links)
- Border-radius on images, with lighter dashed outline on linked images
- All page types: home, blog posts (postgrid), grid pages (blog listing, tags, books, about, shop)
- Code syntax highlighting (`prism-okaidia.css` — unaffected, loaded conditionally), YouTube embeds (`lite-yt-embed.css` — unaffected, loaded conditionally), table of contents
- View transitions
- Fathom analytics, RSS feed, favicons, OG tags
- `rel="me"` on Mastodon social link (for IndieWeb identity verification)

## Architecture

The migration follows the existing Eleventy architecture: CSS files in `src/_includes/css/` bundled via `addBundle("css")`, Nunjucks layouts in `src/_layouts/`, partials in `src/_includes/`.

No new files are created beyond what's needed for the theme toggle JavaScript and an SVG icon sprite include. The gfp prototype's inline `<script>` will be extracted to a JS file in `src/assets/js/`.

### Important: "Keep" items require manual addition

The approach is "replace CSS file with gfp version, then manually add back items from the current site." Every item marked "Keep" or "Add back" below is **not present in the gfp prototype** and must be manually inserted into the new CSS. This distinction is critical for implementation.

### CSS Migration (5 files)

Each CSS file in `src/_includes/css/` is replaced with its gfp equivalent, adapted as noted.

#### 1. `variables.css`

Replace entirely with gfp version, with these adjustments:
- **Type scale**: adopt the gfp step-based scale (`--step--2` through `--step-5`), replacing the current `--font-size-sm` through `--font-size-xxxl` names
- **Space scale**: identical values, no change needed. The gfp one-up pairs (`--space-s-m`, `--space-m-l`, `--space-l-xl`) are included as they are part of the Utopia scale; remove if no CSS rule references them after migration
- **Fonts**: `--font-body: "IBM Plex Mono"`, `--font-heading-serif: "IBM Plex Serif"` — replaces `--brand-font`. Do NOT include `--font-heading-sans` (undefined prototype artifact)
- **Colors (light)**: `--bg-primary: #C7E2F6`, `--bg-card: #C7E2F6`, all text/link/accent colors black, `--link-hover-bg: #fff066`
- **Colors (dark)**: `--bg-primary: #353d4d`, text/link/accent white, `--link-hover-bg: #fff066`, `--link-hover-color: black`. Fix the duplicate `--link-hover-color` in the gfp dark mode block — remove the first declaration (`white`), keep only the second (`black`, which is correct for yellow hover background)
- **Remove**: `--bg-secondary`, `--jotter-blue`, `--jotter-red`, `--link-primary`, `--link-hover`, `--outline-primary`, `--outline-hover`, `--box-primary`, Pagefind variables
- **Add back** (manual — not in gfp): `--icon-external-link` SVG definition (from current `variables.css`), `--radius: 10px`, `--max-book-width: 200px`, `--caption-size: var(--step-0)`, `--post-title-size: var(--step-2)`
- **Add** (from gfp): `--accent-width`, `--accent-width-heavy`, `--blockquote-border`
- Color scheme uses `[data-theme="light"]` and `[data-theme="dark"]` selectors instead of bare `:root` for color values

#### 2. `base.css`

Replace with gfp version, with these manual additions:
- **Add back** (manual): `@view-transition { navigation: auto; }` — not in gfp, must be inserted after the scrollbar-gutter block
- **Add back** (manual): external link indicator (`a[href^="https"]:not(:has(img))::after` block from current base.css), adapted to use `currentColor` instead of hardcoded black so it works in dark mode
- **Add back** (manual): `border-radius: var(--radius)` on `:where(img)` — gfp does not include this
- **Add**: linked-image styling — lighter dashed outline on `a:has(img) img` to indicate clickability, using `--accent-line` color, `1px` dashed width (lighter than current 3px)
- **Use**: gfp's link styling: `text-decoration-thickness: 1px`, `text-underline-offset: 0.2em`, `background-color` transition on hover. Remove all `data-hover-text` selectors (no longer needed — social links become text-based without that attribute)
- **Use**: gfp heading sizes — `--step-4` for h1, `--step-2` for h2, `--step-1` for h3. Note: this makes h1 substantially larger than h2, unlike the current site where both are `--font-size-xl`. This is intentional per the gfp design
- **Add back** (manual): `article h2` left-aligned override (`:where(article h2) { font-size: var(--step-1); text-align: left; }`) — not in gfp, but required to prevent center-aligned headings in blog posts
- **Use**: gfp `hr` styling (`border: none; margin-block: var(--space-m)`) instead of jotter-red border
- **Use**: gfp blockquote with `--accent-line-heavy` for border color instead of `--jotter-blue`

#### 3. `main.css`

Replace with gfp version, with these adjustments:
- **Body**: use `--font-body` instead of `--brand-font`, `--step-0` instead of `--font-size-md`, line-height 1.6
- **Header**: new multi-element header from gfp — hamburger menu toggle, theme toggle, theme panel. **Exclude**: `.color-picker` CSS block (prototype-only), `.font-label` class (prototype-only), `.section-heading` class (prototype-only), `.heading-sans` class (uses undefined `--font-heading-sans`)
- **Remove**: background-image media queries (700px body background-attachment/size/position)
- **Keep**: content grid system (`.content`, `.full`, `.feature`, `.popout`, `.central`) — identical in both
- **Home grids**: adopt gfp `column-gap`/`row-gap` approach, gfp padding values. 2-column max at both 700px and 1250px breakpoints (gfp has duplicate rules for these — simplify by removing the redundant 1250px homegrid rule, keeping only the `#alltags` constraint at that breakpoint)
- **Cards**: adopt gfp `.card` styling with `::before`/`::after` accent-line borders, replacing `.boxed`
- **Add back** (manual — not in gfp):
  - `.blogdate` — IS in gfp, carries over naturally
  - Bookshelf grid (`.bklist`, `book-item`, `.bookyear`, `.bookyears`) — adapt color references to new variables
  - `.caption` class — carry over from current main.css, update font-size to `--step-0`
  - `.table-of-contents` and `.email-comment` — restyle with: `background-color: var(--bg-card)`, `border: var(--accent-width) solid var(--accent-line)`, `border-radius: var(--radius)`, same padding/margin/width
  - `blockquote { grid-column: popout; }` — add to the blockquote rule in main.css (gfp puts blockquote in base.css which has no grid context)
  - Code block positioning (`pre:has(code)` and `pre:has(code) button`) — carry over from current main.css
  - `.stripe-buy-button` — carry over from current main.css
- **Scroll-to-top**: adopt gfp's simpler arrow style with accent-line borders
- **Remove**: Pagefind `#search` styles

#### 4. `footer.css`

Replace with gfp version:
- **Social icons**: text-based links with bottom-border hover effect, replacing icon-based with tooltips
- **Footer meta**: centered text with `--step--1` size
- **Remove**: tooltip `::after` pseudo-element, social icon image sizing, `> p:nth-of-type(2)` background-secondary stripe
- **Keep**: `#alltags` margin

#### 5. `utilities.css`

Replace with gfp version, with these adjustments:
- **Remove**: `.bg-primary` and `.bg-secondary` opacity classes (no longer needed without background images)
- **Remove**: `.boxed` class (replaced by `.card`)
- **Remove**: `.top-margin`, `.bot-margin`, `.top-n-bot-margin` (replace usages in templates with appropriate margin classes or direct styles)
- **Keep**: `.strikethrough` — it IS used in `src/posts/2022/calculating-reading-time.md`
- **Keep**: all gfp utilities (`.bold`, `.flow`, `.hidden`, `.ital`, `.list-none`, `.round-img`, `.text-center`, `.text-left`, `.text-right`, `.no-bot-margin`, `.parenthetical`, border utilities)
- **Add**: `.heading-serif` class for heading font styling (from gfp main.css, but better placed in utilities)

### Template Changes

#### `head.njk`

- **Add**: Google Fonts `<link>` tags for IBM Plex Mono and IBM Plex Serif (with `preconnect`)
- **Add**: inline theme-detection script (flash-prevention) before any stylesheets — sets `data-theme` attribute from localStorage before paint
- **Remove**: background image `<style>` block (the `whichBgImage` filter usage)
- **Keep**: all other elements (charset, viewport, title, description, canonical, RSS link, conditional syntax highlighting CSS, conditional YouTube CSS, bundled CSS, Fathom analytics, favicon, OG tags, generator meta, GitHub rel=me)

#### `header.njk`

Major restructuring to match gfp prototype:
- **Add**: SVG icon sprite definitions (sun, moon, circle-half, menu, close) as a separate `icons.njk` include, placed at top of `<body>` in layouts (not inside header)
- **Add**: hamburger menu button (`.menu-toggle`) with aria attributes, hidden on desktop (≥700px)
- **Add**: theme toggle button (`.theme-toggle`) with aria attributes, positioned right
- **Add**: theme panel form (`.theme-panel`) with auto/light/dark radio buttons
- **Keep**: skip-nav link, nav element with `listolinks` using `site.mainNavLinks` loop and `isCurrentPage` filter
- **Remove**: `bg-primary` class from header element
- **Wrap**: nav in `#main-nav` for hamburger toggle targeting

#### `footer.njk`

- **Update**: `socials.njk` include to output text-based links instead of icon images (or replace with inline markup). Preserve `rel="me"` on Mastodon link
- **Remove**: background images link paragraph (`"Tell me about those background images"`)
- **Remove**: `bg-primary` class from footer element
- **Keep**: alltags section, generator/source line, 404 tracking script
- **Update**: generator line format

#### Layout files

All three layouts (`home.njk`, `grid.njk`, `postgrid.njk`):
- **Add**: `data-theme="light"` attribute to `<html>` element (theme script will override before paint)
- **Add**: `{% include 'icons.njk' %}` at top of `<body>` (before header include)
- **Remove**: `bg-primary` / `bg-secondary` classes from `<main>` elements
- **Update `grid.njk`**: remove the `{% if boxed %}boxed{% endif %}` conditional from the content wrapper div. The `boxed` front matter key is no longer used
- **Update `postgrid.njk`**: remove `.boxed` class from the `<p class="email-comment boxed">` element (dead class since `.boxed` is removed from CSS)

#### `pages.json`

- **Remove**: `"boxed": "true"` default — no longer needed since `.boxed` class is removed

#### `index.njk` (home page)

- **Replace**: `.boxed` class with `.card` on all card divs
- **Update**: heading classes to use `.heading-serif` where appropriate
- **Keep**: all dynamic content (collections.posts loop, bookitem include, YouTube embeds)
- **Update**: organizations section heading to use `.section-divider` wrapper

#### `bg-images.md` page

- **Keep**: `src/pages/bg-images.md` — retained as historical content. The footer link to it is being removed, but the page itself remains accessible. Remove any `.boxed` class usage on this page (it uses `.boxed .popout` on images via markdown-it-attrs — remove `.boxed`, keep `.popout`).

#### `books.njk`

- **Replace**: `.boxed` on year heading elements (h2 with `.bookyear .text-center .boxed`) — remove `.boxed`, the heading will rely on `.bookyear` styling instead. These are standalone headings, not card containers, so `.card` is not appropriate

#### Other pages

- **Search page**: remove Pagefind UI include/markup
- **All grid pages**: replace any remaining `.boxed` usage with `.card` or remove where not appropriate (check each usage). Also clean up dead `boxed: true` front matter keys in `stats.njk`, `404.md`, and `soda.md`
- **Blog posts**: remove `bg-secondary` class from main element in `postgrid.njk`

### JavaScript

#### Theme toggle (`src/assets/js/theme.js`)

Extract from gfp's inline script into a standalone file:
- Theme toggle button click → show/hide theme panel
- Radio button changes → set `data-theme` attribute and localStorage
- OS preference change listener for auto mode
- Icon updates (sun/moon/circle-half)
- Hamburger menu toggle (`#main-nav.open` class, icon swap)
- **Exclude**: all color picker logic

Load this script at the end of `<body>` or with `defer` in `<head>`.

#### Flash-prevention script

Small inline script in `<head>` (before CSS loads) that reads localStorage and sets `data-theme` to prevent flash of wrong theme. This stays inline — it must run before paint.

### Eleventy Config Changes

- **Remove**: `whichBgImage` filter (verify no other templates reference it first)
- **Remove**: `bgimagerefs.json` data file
- **Leave**: Pagefind post-build step in `package.json` (harmless no-op if `_site/` has no pagefind markup; user will re-add later)
- **No other config changes needed** — bundling, collections, markdown plugins, image transform all stay the same

## Migration Order (Approach A: CSS-first)

1. **CSS files** — replace all 5 CSS files with adapted gfp versions (including all manual additions noted above)
2. **head.njk** — add Google Fonts, theme-detection script, remove background image block
3. **header.njk** — new header structure with hamburger + theme toggle; create `icons.njk` include
4. **footer.njk** — new footer structure with text social links; update `socials.njk`
5. **Layouts** — add data-theme, add icons include, remove bg classes, update grid.njk boxed conditional
6. **index.njk** — update home page card structure
7. **Theme JS** — extract and add theme toggle + hamburger scripts
8. **Other pages** — update class references, remove Pagefind page, delete bg-images page, update pages.json
9. **Cleanup** — remove unused filters/data files, verify all page types render correctly

## Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Light mode bg color | Sky (#C7E2F6) | User selected from prototype options |
| Color picker | Removed | Prototyping tool, not for production |
| Background images | Removed; bg-images page kept as historical content; bgimagerefs.json deleted | New solid-color design |
| External link indicators | Kept | User preference |
| Image border-radius | Kept (10px) | User preference |
| Linked image outlines | Lighter dashed outline (1px) | User wants link indication but lighter than current |
| Pagefind search | Removed (data attributes left in templates) | User will re-add later |
| Home grid max columns | 2 (gfp) not 4 (current) | Follows prototype design |
| Font loading | Google Fonts link tags | Matches gfp approach, simplest integration |
| Line-height | 1.6 (up from 1.35) | Monospace font needs more vertical space |
| h1/h2 sizing | Differentiated (step-4 / step-2) | Follows gfp design; current site had same size for both |
| SVG icon sprites | Separate `icons.njk` include | Follows existing include pattern, keeps layouts clean |
| `.strikethrough` | Kept | Used in existing blog post |
| `data-pagefind-body` | Left in templates | Harmless; eases future re-integration |
| `rel="me"` on Mastodon | Preserved | Required for IndieWeb identity verification |
| `pages.json` boxed default | Removed | `.boxed` class no longer exists |
