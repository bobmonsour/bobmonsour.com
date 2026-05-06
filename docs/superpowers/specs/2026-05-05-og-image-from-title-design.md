# Auto-generated OG images from post titles

**Status:** design
**Date:** 2026-05-05
**Branch:** `og-image-from-title`
**Source idea:** [`docs/og-image-based-on-title.md`](../../og-image-based-on-title.md)

## Goal

Generate a per-post Open Graph image at build time for blog posts that don't supply their own, so social shares display the post title alongside a recognizable image of Bob, in the site's visual style. Generation runs during every build (local and deploy), but is cached so unchanged posts don't re-render.

## Scope

A generated OG image is produced for any post in `collections.posts` where:

- The post does **not** have an `image.source` in its front matter, and
- The post is **not** tagged `notes` or `til`.

Posts with explicit `image.source` keep using that image for OG meta. Notes and TILs continue to use `notes-og-image.jpg` / `til-og-image.jpg`. Non-post pages (about, books, projects, etc.) continue to use `fallback-og-image.png`.

In practice this affects only future posts: a check at design time confirmed every existing non-notes/non-TIL post already has `image.source`.

## Visual specification

- **Canvas:** 1200×630 PNG.
- **Background:** solid `#353d4d` (the site's `--color-dark`).
- **Title:** IBM Plex Serif weight 600, color `#ffffff`, left-aligned, ~80px left/top padding, max width ~880px so it never collides with the avatar. Font size is chosen by a deterministic ramp keyed to title length (`<=60` chars → 88px, `<=90` → 72px, otherwise 60px) so the same title always renders the same size. Satori's flexbox layout handles line wrapping at the chosen size.
- **Avatar:** `src/assets/img/about-bob.jpg` (200×200 source) rendered as a 180px circle in the bottom-right corner with ~60px margin from the right and bottom edges. A 4px `#c7e2f6` border (the site's `--color-light`) gives the circle a subtle ring against the dark background.
- **No site name, no tagline, no decorative elements.**

## Architecture

A self-contained module at `src/_config/og-image/` is loaded from `eleventy.config.js`. It does two things:

1. **Data cascade hook.** Extends the existing `eleventyComputed.image` logic in `src/posts/posts.11tydata.js` to also compute a new `ogImage` property. `ogImage` is the only field `head.njk` consults for `og:image` meta. `image` continues to mean "in-body hero" exclusively.
2. **After-build hook.** Iterates `collections.posts`, and for each post matching the rule, resolves the PNG (cache hit or fresh render via Satori + sharp) and writes it to `_site/assets/img/og/<slug>.png`.

The path that the OG meta tag references and the path the file is written to are the same. The data cascade sets the path; the after-build hook makes the file exist.

### Why `ogImage` vs reusing `image`

Today, `image.source` drives both the OG meta tag (`head.njk`) and the in-body hero (`showimage.njk`). If the generated OG image were assigned to `image.source`, every matching post would display the generated OG image as a hero above its content — redundant with the `<h1>` already rendered by `postgrid.njk`. Splitting into two fields decouples the concerns:

- `image` = in-body hero (front-matter, opt-in by author).
- `ogImage` = OG meta (computed, with cascade).

For posts that already set `image`, `ogImage` defaults to that same value, so existing OG behavior is unchanged.

## Components

```
src/_config/og-image/
  index.js              public API: register(eleventyConfig)
  generator.js          pure: (title) -> Promise<Buffer>  (Satori + sharp)
  cache.js              .cache/og/manifest.json + .cache/og/<slug>-<hash>.png
  rule.js               shouldGenerate(postData) -> boolean
```

- **`generator.js`** loads `src/assets/img/about-bob.jpg` and `src/assets/fonts/ibm-plex-serif-600.woff2` once per build, builds the Satori VDOM tree per the visual spec above, runs `satori(...)` to get an SVG string, runs `sharp(svg).png().toBuffer()`, returns the buffer.
- **`cache.js`** owns `.cache/og/`. Methods:
  - `get(slug, titleHash) -> Buffer | null` — reads `.cache/og/<slug>-<hash>.png` if it exists.
  - `put(slug, titleHash, buffer) -> void` — writes the PNG and updates `manifest.json`.
  - `gc(activeEntries)` — at end of build, removes any cache file whose `<slug>-<hash>` doesn't match the current manifest.
  - `titleHash = sha1(title).slice(0, 12)`.
- **`rule.js`** centralizes the predicate: a post matches if it has no `image.source` AND its tags include neither `notes` nor `til`. Used identically by the data hook and the after-build hook so they can never disagree.
- **`index.js`** wires both hooks. Exports a single function called from `eleventy.config.js`.

`src/posts/posts.11tydata.js` is updated to compute `ogImage` via the cascade:

```
ogImage =
    image                                                 (if image.source set)
 || (tags.includes("notes") ? { source: "notes-og-image.jpg", alt: "..." } : null)
 || (tags.includes("til")   ? { source: "til-og-image.jpg",   alt: "..." } : null)
 || { source: "og/<slug>.png", alt: title }               (matching post)
```

`src/_includes/head.njk` is updated so the `og:image` block reads `ogImage` instead of `image`: the conditional becomes `{% if ogImage and ogImage.source %}`, and the two meta tags inside reference `ogImage.source` and `ogImage.alt`. The `fallback-og-image.png` else-branch stays for non-post pages.

`showimage.njk` is **not** changed.

## Data flow

```
build start
  -> posts.11tydata.js eleventyComputed.ogImage runs per post
     -> matching posts: ogImage = { source: "og/<slug>.png", alt: title }
  -> templates render
     -> head.njk emits <meta property="og:image" content="<site.url>/assets/img/og/<slug>.png">
  -> eleventy.after fires
     -> for each post in collections.posts where rule.shouldGenerate(data):
          hash = sha1(title).slice(0,12)
          buf  = cache.get(slug, hash) ?? (generator(title) -> cache.put(slug, hash, .))
          fs.writeFile(_site/assets/img/og/<slug>.png, buf)
     -> cache.gc(activeEntries)
  -> postbuild (pagefind) runs
  -> wrangler deploy ships _site/
```

## Caching and regeneration

- Cache lives at `.cache/og/`. Already gitignored via the existing `.cache` line.
- `manifest.json` shape: `{ "<slug>": { "hash": "<sha1-12>", "file": "<slug>-<hash>.png" } }`.
- Cache hit: file copied to `_site/`. Cache miss: render, persist, copy.
- Title change → hash mismatch → render. No other inputs feed the hash; if the visual spec or rendering code ever changes in a way that should invalidate every cached image, bump a `RENDERER_VERSION` constant defined in `cache.js` and concatenated into the hash input.
- PNGs are not committed. First build on a fresh clone regenerates everything (~150ms × N matching posts; today, 0; in steady state, the per-build delta is "however many posts you wrote since last build").
- Bob deploys via `npm run build && wrangler deploy` from his local machine, so the cache persists naturally across deploys.

## Error handling

- `generator()` throws (font load, image load, Satori panic) → log a warning naming the slug, do not write the PNG, do not update the manifest. The OG meta tag still references the missing path; the social crawler falls through to whatever it does for 404 images. The build does not fail.
- Cache read/write errors → log warning, treat as cache miss / no-op respectively.
- No retry, no fallback rendering. Failures are visible in build logs and rare.

## Dependencies

Add to `devDependencies`:

- `satori` — JSX/HTML-to-SVG renderer.

`sharp` is already pulled in transitively by `@11ty/eleventy-img` and is used directly to convert Satori's SVG output to PNG.

No native deps beyond what's already installed.

## Verification (manual)

No test framework is added. Verification is by eyeball + filesystem checks:

1. Create a test post in `src/posts/2026/` without an `image:` front-matter field. Run `npm run build`. Confirm `_site/assets/img/og/<slug>.png` exists and looks right.
2. View the rendered post HTML; confirm the `<meta property="og:image">` tag points at `/assets/img/og/<slug>.png`.
3. Change the test post's `title`, rebuild. Confirm the PNG changes (mtime updates and the rendered title in the image is the new one).
4. Rebuild without changes. Confirm the cache hit path runs (PNG mtime unchanged).
5. Visual: render with a short title (~20 chars) and a long title (~100 chars); confirm wrapping and font-size step-down both look reasonable.
6. Confirm a notes-tagged post still uses `notes-og-image.jpg` for OG meta and produces no entry under `_site/assets/img/og/`.
7. Confirm an existing post with explicit `image:` still renders its hero in the body and uses the same image for OG meta.
8. Inspect `.cache/og/manifest.json` after a build; confirm one entry per matching post.

## Out of scope

- Regenerating OG images for existing posts that already have `image.source` set. (Explicit author choice wins.)
- Title-from-image generation for notes or TILs. (They keep their dedicated defaults.)
- Light-mode variants. (Single dark image for all consumers.)
- Per-post overrides of the visual template (font, colors, avatar). (Add later if needed.)
- A test framework. (Manual verification only, consistent with the rest of the repo.)
- Pruning historical artifacts. (Generated images are not committed; nothing to prune.)
