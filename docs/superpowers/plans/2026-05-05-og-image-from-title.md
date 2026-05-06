# OG Image From Title — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate a per-post Open Graph PNG (1200×630, post title + round profile photo on dark background) at build time for every post in `collections.posts` not tagged `notes` or `til`, cached by title hash so unchanged posts don't re-render.

**Architecture:** A self-contained module under `src/_config/og-image/` registers two hooks on Eleventy: an `addCollection` callback that captures matching posts during the data cascade, and an `eleventy.after` event that renders/caches PNGs into `_site/assets/img/og/`. Posts get a new computed `ogImage` property in their data; `head.njk` reads `ogImage` for the `og:image` meta tag while leaving `image` (the in-body hero) untouched.

**Tech Stack:** Eleventy v4 (alpha), Node ESM, [Satori](https://github.com/vercel/satori) (HTML-to-SVG renderer), [sharp](https://sharp.pixelplumbing.com/) (SVG-to-PNG, already a transitive dep), [@fontsource/ibm-plex-serif](https://www.npmjs.com/package/@fontsource/ibm-plex-serif) (Satori-compatible WOFF font asset).

**Spec:** [`docs/superpowers/specs/2026-05-05-og-image-from-title-design.md`](../specs/2026-05-05-og-image-from-title-design.md). Branch: `og-image-from-title`.

---

## File Structure

| File | Status | Responsibility |
|------|--------|----------------|
| `src/_config/og-image/rule.js` | new | `shouldGenerate(data) -> boolean` predicate |
| `src/_config/og-image/cache.js` | new | `.cache/og/` manifest + cached PNG binaries; hash function with `RENDERER_VERSION` |
| `src/_config/og-image/generator.js` | new | Pure `generate(title) -> Promise<Buffer>`; loads font + avatar once |
| `src/_config/og-image/index.js` | new | `register(eleventyConfig)`; collection-capture closure + `eleventy.after` handler |
| `eleventy.config.js` | modify | Import and call `register()` from the new module |
| `src/posts/posts.11tydata.js` | modify | Add computed `ogImage` property |
| `src/_includes/head.njk` | modify | Switch `og:image` block from `image` to `ogImage` |
| `package.json` | modify | Add `satori`, `@fontsource/ibm-plex-serif`, `sharp` to `devDependencies` |
| `_site/assets/img/og/*.png` | generated at build | Final output, written by after-build hook |
| `.cache/og/manifest.json`, `.cache/og/*.png` | generated at build | Cache; gitignored via existing `.cache` rule |

---

## Task 1: Add dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install satori**

Run from repo root:
```bash
npm install --save-dev satori
```

Expected: `package.json`'s `devDependencies` now includes `satori` (current version is 0.x — accept whatever npm resolves).

- [ ] **Step 2: Install the font asset**

```bash
npm install --save-dev @fontsource/ibm-plex-serif
```

This package ships pre-built WOFF/TTF font files. We'll load the WOFF directly from `node_modules/@fontsource/ibm-plex-serif/files/ibm-plex-serif-latin-600-normal.woff` in the generator. (We can't reuse the existing `src/assets/fonts/ibm-plex-serif-600.woff2` because Satori does not support WOFF2.)

- [ ] **Step 3: Pin sharp explicitly**

```bash
npm install --save-dev sharp
```

Sharp is already pulled in transitively by `@11ty/eleventy-img`. Adding it explicitly so our code doesn't depend on a transitive resolution that could disappear in a future eleventy-img release.

- [ ] **Step 4: Verify the font file exists at the expected path**

```bash
ls node_modules/@fontsource/ibm-plex-serif/files/ibm-plex-serif-latin-600-normal.woff
```

Expected: the file exists and is non-zero. If it doesn't, the version of `@fontsource/ibm-plex-serif` you got may have a different file layout. Check `node_modules/@fontsource/ibm-plex-serif/files/` and update later tasks' paths to match. Do not proceed with a different filename guessed at random — read the actual contents of the `files/` directory.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "Add satori, sharp, and IBM Plex Serif font for OG image generation"
```

---

## Task 2: Implement the rule predicate

**Files:**
- Create: `src/_config/og-image/rule.js`

- [ ] **Step 1: Write the module**

Create `src/_config/og-image/rule.js`:

```js
// Predicate: should this post receive a generated OG image?
// A post matches if its tags include neither "notes" nor "til".
// Used identically by the data cascade hook and the after-build hook
// so they can never disagree on which posts qualify.
export function shouldGenerate(data) {
  const tags = Array.isArray(data?.tags) ? data.tags : [];
  return !tags.includes("notes") && !tags.includes("til");
}
```

- [ ] **Step 2: Manually verify the predicate**

Run from repo root:
```bash
node --input-type=module -e '
import("./src/_config/og-image/rule.js").then(({ shouldGenerate }) => {
  console.log("regular post:", shouldGenerate({ tags: ["javascript"] }));      // true
  console.log("note:",         shouldGenerate({ tags: ["notes"] }));           // false
  console.log("til:",          shouldGenerate({ tags: ["til"] }));             // false
  console.log("no tags:",      shouldGenerate({}));                            // true
  console.log("mixed:",        shouldGenerate({ tags: ["notes", "x"] }));      // false
});'
```

Expected output:
```
regular post: true
note: false
til: false
no tags: true
mixed: false
```

- [ ] **Step 3: Commit**

```bash
git add src/_config/og-image/rule.js
git commit -m "Add OG image generation rule predicate"
```

---

## Task 3: Implement the cache layer

**Files:**
- Create: `src/_config/og-image/cache.js`

- [ ] **Step 1: Write the module**

Create `src/_config/og-image/cache.js`:

```js
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

// Bump when the visual spec or generator code changes in a way that
// should invalidate every previously-cached PNG. The current value
// is concatenated into the hash input so cached images become stale
// automatically.
const RENDERER_VERSION = "1";

const CACHE_DIR = ".cache/og";
const MANIFEST_PATH = path.join(CACHE_DIR, "manifest.json");

export function hashTitle(title) {
  return crypto
    .createHash("sha1")
    .update(`${RENDERER_VERSION}:${title}`)
    .digest("hex")
    .slice(0, 12);
}

async function ensureDir() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
}

async function loadManifest() {
  try {
    const raw = await fs.readFile(MANIFEST_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return {};
    console.warn(`[og-image] manifest unreadable, starting fresh: ${err.message}`);
    return {};
  }
}

async function saveManifest(manifest) {
  await ensureDir();
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

function cacheFileFor(slug, hash) {
  return path.join(CACHE_DIR, `${slug}-${hash}.png`);
}

// Returns the cached PNG buffer if the slug+hash matches a stored entry,
// else null. Errors (file missing, unreadable) are logged and treated
// as cache miss.
export async function get(slug, hash) {
  const manifest = await loadManifest();
  const entry = manifest[slug];
  if (!entry || entry.hash !== hash) return null;
  try {
    return await fs.readFile(cacheFileFor(slug, hash));
  } catch (err) {
    console.warn(`[og-image] cache read failed for ${slug}: ${err.message}`);
    return null;
  }
}

// Writes the buffer to the cache file and updates the manifest.
// Errors are logged but do not throw — the build proceeds with the
// freshly-rendered buffer in memory.
export async function put(slug, hash, buffer) {
  await ensureDir();
  const file = `${slug}-${hash}.png`;
  try {
    await fs.writeFile(path.join(CACHE_DIR, file), buffer);
  } catch (err) {
    console.warn(`[og-image] cache write failed for ${slug}: ${err.message}`);
    return;
  }
  const manifest = await loadManifest();
  manifest[slug] = { hash, file };
  await saveManifest(manifest);
}

// Removes any cache file whose <slug>-<hash> isn't in activeKeys (a Set
// of "<slug>-<hash>" strings) and prunes orphan manifest entries.
export async function gc(activeKeys) {
  let entries;
  try {
    entries = await fs.readdir(CACHE_DIR);
  } catch (err) {
    if (err.code === "ENOENT") return;
    console.warn(`[og-image] gc readdir failed: ${err.message}`);
    return;
  }
  for (const name of entries) {
    if (!name.endsWith(".png")) continue;
    const key = name.replace(/\.png$/, "");
    if (!activeKeys.has(key)) {
      try {
        await fs.unlink(path.join(CACHE_DIR, name));
      } catch (err) {
        console.warn(`[og-image] gc unlink failed for ${name}: ${err.message}`);
      }
    }
  }
  const manifest = await loadManifest();
  let dirty = false;
  for (const [slug, entry] of Object.entries(manifest)) {
    if (!activeKeys.has(`${slug}-${entry.hash}`)) {
      delete manifest[slug];
      dirty = true;
    }
  }
  if (dirty) await saveManifest(manifest);
}
```

- [ ] **Step 2: Manually verify hash determinism and round-trip**

```bash
node --input-type=module -e '
import("./src/_config/og-image/cache.js").then(async (m) => {
  const h1 = m.hashTitle("Hello world");
  const h2 = m.hashTitle("Hello world");
  const h3 = m.hashTitle("Hello world!");
  console.log("same title same hash:", h1 === h2);          // true
  console.log("different title different hash:", h1 !== h3); // true
  await m.put("test-slug", h1, Buffer.from("not a png"));
  const buf = await m.get("test-slug", h1);
  console.log("round-trip:", buf?.toString());               // not a png
  const miss = await m.get("test-slug", "deadbeef0000");
  console.log("miss:", miss);                                // null
  await m.gc(new Set());
  const after = await m.get("test-slug", h1);
  console.log("after gc:", after);                           // null
});'
```

Expected output:
```
same title same hash: true
different title different hash: true
round-trip: not a png
miss: null
after gc: null
```

- [ ] **Step 3: Confirm `.cache` is gitignored**

```bash
grep -E "^\.cache" .gitignore
```

Expected: outputs `.cache`. (It already is — this is just a sanity check before committing.)

- [ ] **Step 4: Commit**

```bash
git add src/_config/og-image/cache.js
git commit -m "Add OG image cache with title-hash invalidation"
```

---

## Task 4: Implement the renderer

**Files:**
- Create: `src/_config/og-image/generator.js`

- [ ] **Step 1: Write the module**

Create `src/_config/og-image/generator.js`:

```js
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import satori from "satori";
import sharp from "sharp";

const require = createRequire(import.meta.url);

// Load font and avatar once per process. Both are small (~100KB each)
// and reused for every render.
const FONT_PATH = require.resolve(
  "@fontsource/ibm-plex-serif/files/ibm-plex-serif-latin-600-normal.woff",
);
const FONT_DATA = fs.readFileSync(FONT_PATH);

const AVATAR_PATH = path.resolve("src/assets/img/about-bob.jpg");
const AVATAR_BUFFER = fs.readFileSync(AVATAR_PATH);
const AVATAR_DATA_URI = `data:image/jpeg;base64,${AVATAR_BUFFER.toString("base64")}`;

// Deterministic font-size ramp keyed to title length. Same title always
// renders at the same size.
function pickFontSize(title) {
  if (title.length <= 60) return 88;
  if (title.length <= 90) return 72;
  return 60;
}

function buildTree(title) {
  return {
    type: "div",
    props: {
      style: {
        width: "1200px",
        height: "630px",
        backgroundColor: "#353d4d",
        display: "flex",
        position: "relative",
        padding: "80px",
        boxSizing: "border-box",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              color: "#ffffff",
              fontFamily: "IBM Plex Serif",
              fontWeight: 600,
              fontSize: `${pickFontSize(title)}px`,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              maxWidth: "880px",
              display: "flex",
            },
            children: title,
          },
        },
        {
          type: "img",
          props: {
            src: AVATAR_DATA_URI,
            width: 180,
            height: 180,
            style: {
              position: "absolute",
              bottom: "60px",
              right: "60px",
              borderRadius: "9999px",
              border: "4px solid #c7e2f6",
            },
          },
        },
      ],
    },
  };
}

// Renders the OG image for `title` and returns a PNG Buffer.
// Throws on font/image load failure, malformed input, or sharp error.
// Callers should catch and log a warning per the spec's error policy.
export async function generate(title) {
  const svg = await satori(buildTree(title), {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "IBM Plex Serif",
        data: FONT_DATA,
        weight: 600,
        style: "normal",
      },
    ],
  });
  return await sharp(Buffer.from(svg)).png().toBuffer();
}
```

- [ ] **Step 2: Render a sample image and eyeball it**

Run from repo root:
```bash
node --input-type=module -e '
import("./src/_config/og-image/generator.js").then(async ({ generate }) => {
  const fs = await import("node:fs/promises");
  const buf = await generate("Auto-generated OG images from post titles");
  await fs.writeFile("/tmp/og-sample.png", buf);
  console.log("wrote", buf.length, "bytes");
});'
```

Open `/tmp/og-sample.png` and confirm:
- 1200×630 PNG
- Dark background (#353d4d)
- Title in white serif on the left, fits within the canvas
- Round Bob avatar in the bottom-right with a light border

- [ ] **Step 3: Try the long-title branch**

```bash
node --input-type=module -e '
import("./src/_config/og-image/generator.js").then(async ({ generate }) => {
  const fs = await import("node:fs/promises");
  const long = "A very long title that should trigger the smaller font size and wrap onto multiple lines without colliding with the avatar in the corner";
  const buf = await generate(long);
  await fs.writeFile("/tmp/og-sample-long.png", buf);
  console.log("wrote", buf.length, "bytes");
});'
```

Open `/tmp/og-sample-long.png`. Confirm the title wraps to multiple lines, font is smaller (60px tier), and the avatar isn't crashed into.

- [ ] **Step 4: Clean up samples and commit**

```bash
rm /tmp/og-sample.png /tmp/og-sample-long.png
git add src/_config/og-image/generator.js
git commit -m "Add Satori-based OG image renderer"
```

---

## Task 5: Implement the orchestrator

**Files:**
- Create: `src/_config/og-image/index.js`

- [ ] **Step 1: Write the module**

Create `src/_config/og-image/index.js`:

```js
import fs from "node:fs/promises";
import path from "node:path";
import { shouldGenerate } from "./rule.js";
import { generate } from "./generator.js";
import * as cache from "./cache.js";

// Captured during the data cascade (when we have access to post data),
// consumed during the after-build hook (when the data cascade is gone).
// Reset on each build via "eleventy.before".
let queue = [];

export default function register(eleventyConfig) {
  eleventyConfig.on("eleventy.before", () => {
    queue = [];
  });

  // Capture matching posts during the data cascade. Returning [] means
  // this collection is empty in templates — we only use the callback
  // for its side effect of populating `queue`.
  eleventyConfig.addCollection("ogImageQueue", (api) => {
    queue = api
      .getFilteredByGlob("./src/posts/**/*.md")
      .filter((p) => shouldGenerate(p.data))
      .map((p) => ({ slug: p.fileSlug, title: p.data.title }));
    return [];
  });

  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    const outDir = path.join(dir.output, "assets/img/og");
    await fs.mkdir(outDir, { recursive: true });

    const activeKeys = new Set();

    for (const { slug, title } of queue) {
      const hash = cache.hashTitle(title);
      activeKeys.add(`${slug}-${hash}`);

      let buf = await cache.get(slug, hash);
      if (!buf) {
        try {
          buf = await generate(title);
          await cache.put(slug, hash, buf);
        } catch (err) {
          console.warn(
            `[og-image] generation failed for slug=${slug}: ${err.message}`,
          );
          continue;
        }
      }

      try {
        await fs.writeFile(path.join(outDir, `${slug}.png`), buf);
      } catch (err) {
        console.warn(
          `[og-image] write to _site failed for slug=${slug}: ${err.message}`,
        );
      }
    }

    await cache.gc(activeKeys);
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/_config/og-image/index.js
git commit -m "Add OG image plugin orchestrator"
```

---

## Task 6: Wire the plugin into Eleventy

**Files:**
- Modify: `eleventy.config.js`

- [ ] **Step 1: Add the import and registration**

In `eleventy.config.js`, add a new import alongside the existing utils import (currently around line 5):

```js
import addrssid from "./src/_config/utils/addrssid.js";
import registerOgImage from "./src/_config/og-image/index.js";
```

Inside the default-export function, add the registration call. A good location is right after the existing `eleventyConfig.addPlugin(filters)` line (around line 65), grouped with the other plugin/registration code:

```js
  // Add local filters
  eleventyConfig.addPlugin(filters);

  // Register OG image generation
  registerOgImage(eleventyConfig);
```

- [ ] **Step 2: Run a build and confirm files are generated**

```bash
npm run build
```

Expected: build completes, no errors. Then:

```bash
ls _site/assets/img/og/ | wc -l
```

Expected: 71 (or close — the count from spec is 71 non-notes/non-TIL posts; the actual number depends on whether new posts have been added since spec was written).

```bash
ls _site/assets/img/og/ | head -5
```

Expected: filenames like `<post-slug>.png`.

- [ ] **Step 3: Confirm the cache populated**

```bash
ls .cache/og/ | head -5
cat .cache/og/manifest.json | head -20
```

Expected: PNG files named `<slug>-<hash>.png`, and a manifest mapping slugs to hash/file entries.

- [ ] **Step 4: Open one PNG and eyeball it**

Open any file from `_site/assets/img/og/` (e.g., `_site/assets/img/og/3-years-of-the-11ty-bundle.png` if that post is present). Confirm the title is correct, layout is correct, avatar in bottom-right.

- [ ] **Step 5: Run the build again — it should be a cache-hit pass**

```bash
time npm run build
```

The eleventy build itself should complete in roughly the same time as before this plan (within ~1s of normal) — Satori shouldn't run again. You can verify Satori isn't running by adding a `console.log("rendering", title)` line temporarily in `generator.js` Step 1 of Task 4 (and removing it after); on the second run no logs should appear. (Optional debugging step; skip if confident.)

- [ ] **Step 6: Commit**

```bash
git add eleventy.config.js
git commit -m "Register OG image plugin in Eleventy config"
```

---

## Task 7: Compute `ogImage` in the post data file

**Files:**
- Modify: `src/posts/posts.11tydata.js`

- [ ] **Step 1: Add the computed property**

Replace the contents of `src/posts/posts.11tydata.js` with:

```js
export default {
  eleventyComputed: {
    layout: "postgrid.njk",
    whichgrid: "central",
    permalink: (data) => `blog/${data.page.fileSlug}/`,
    imageDir: "src/assets/img/",
    image: (data) => {
      if (data.image && data.image.source) {
        return data.image;
      }
      if (data.tags?.includes("notes")) {
        return { source: "notes-og-image.jpg" };
      }
      if (data.tags?.includes("til")) {
        return { source: "til-og-image.jpg" };
      }
    },
    // OG image (social-share card) is independent of `image` (in-body hero).
    // Notes and TILs use their dedicated default cards; every other post
    // uses a build-time-generated card at /assets/img/og/<slug>.png.
    ogImage: (data) => {
      if (data.tags?.includes("notes")) {
        return {
          source: "notes-og-image.jpg",
          alt: "Bob Monsour's blog — note",
        };
      }
      if (data.tags?.includes("til")) {
        return {
          source: "til-og-image.jpg",
          alt: "Bob Monsour's blog — TIL",
        };
      }
      return {
        source: `og/${data.page.fileSlug}.png`,
        alt: data.title,
      };
    },
    showImage: true,
    keywords: "retired, web development, blog, eleventy, tennis",
  },
};
```

Note the change to the `image` computed function: I added `?.` to the `data.tags` checks because under the hood `data.tags` may be undefined for posts that don't declare any tags. The original code used `data.tags.includes(...)` which would throw on such posts. Behavior is unchanged for posts that have tags. (If review prefers to keep the data file's existing behavior and only add `ogImage`, leave `data.tags.includes(...)` and trust that all posts declare tags — verify by spot-checking the front matter of a few posts.)

- [ ] **Step 2: Build and inspect a rendered post for the new data**

```bash
npm run build
```

Then check that some non-notes/non-TIL post's HTML still has the old `og:image` referencing the original `image.source` path (because head.njk hasn't been switched yet — that's Task 8). The data file change alone should not yet affect the rendered output:

```bash
grep -m1 "og:image" _site/blog/3-years-of-the-11ty-bundle/index.html
```

Expected: the existing `og:image` line is unchanged from before this task. (We're confirming we didn't accidentally break the rendering path.)

- [ ] **Step 3: Commit**

```bash
git add src/posts/posts.11tydata.js
git commit -m "Compute ogImage data property for posts"
```

---

## Task 8: Switch `head.njk` to consume `ogImage`

**Files:**
- Modify: `src/_includes/head.njk:74-80`

- [ ] **Step 1: Update the OG image block**

In `src/_includes/head.njk`, replace the existing block:

```njk
  {% if image and image.source %}
  <meta property="og:image" content="{{ site.url }}/assets/img/{{ image.source }}">
  <meta property="og:image:alt" content="{{ image.alt }}">
  {% else %}
  <meta property="og:image" content="{{ site.url }}/assets/img/fallback-og-image.png">
  <meta property="og:image:alt" content="Bob Monsour's personal website">
  {% endif %}
```

with:

```njk
  {% if ogImage and ogImage.source %}
  <meta property="og:image" content="{{ site.url }}/assets/img/{{ ogImage.source }}">
  <meta property="og:image:alt" content="{{ ogImage.alt }}">
  {% else %}
  <meta property="og:image" content="{{ site.url }}/assets/img/fallback-og-image.png">
  <meta property="og:image:alt" content="Bob Monsour's personal website">
  {% endif %}
```

The only changes are `image` → `ogImage` (twice in the conditional and meta-tag references). Non-post pages (about, books, projects, etc.) don't define `ogImage`, so they fall through to the `fallback-og-image.png` else-branch as before.

- [ ] **Step 2: Build and verify the OG meta points at the generated path**

```bash
npm run build
grep -m1 "og:image" _site/blog/3-years-of-the-11ty-bundle/index.html
```

Expected:
```
<meta property="og:image" content="https://www.bobmonsour.com/assets/img/og/3-years-of-the-11ty-bundle.png">
```

(Substitute any non-notes/non-TIL post slug present in the build.)

- [ ] **Step 3: Verify a notes-tagged post still uses the notes default**

Pick a notes-tagged post:
```bash
grep -lE "^\s*-\s+notes\s*$" src/posts/**/*.md | head -1
```

Take its slug (the filename without `.md`) and check the rendered output:
```bash
grep -m1 "og:image" _site/blog/<slug>/index.html
```

Expected:
```
<meta property="og:image" content="https://www.bobmonsour.com/assets/img/notes-og-image.jpg">
```

- [ ] **Step 4: Verify a non-post page falls back**

```bash
grep -m1 "og:image" _site/about/index.html
```

Expected:
```
<meta property="og:image" content="https://www.bobmonsour.com/assets/img/fallback-og-image.png">
```

- [ ] **Step 5: Commit**

```bash
git add src/_includes/head.njk
git commit -m "Switch og:image meta tag to read ogImage data property"
```

---

## Task 9: End-to-end verification per spec checklist

This task runs the full spec verification checklist. Each step is an observation, not a code change. No commit at the end unless something needs fixing.

- [ ] **Step 1: Spec check item 1 — fresh post end-to-end**

Create a temporary test post:

```bash
mkdir -p src/posts/2026 && cat > src/posts/2026/_og-image-test-post.md <<'EOF'
---
title: A test post for OG image generation
description: Throwaway post for verifying OG image build behavior.
date: 2026-05-05
tags:
  - testing
draft: true
---

This is a throwaway post.
EOF
```

Note: `draft: true` keeps it out of production builds (per the existing drafts preprocessor in `eleventy.config.js`), but the dev server/local build will still process it. Run a non-build (dev-mode equivalent) build:

```bash
ELEVENTY_RUN_MODE=serve npx @11ty/eleventy
```

Then check:
```bash
ls _site/assets/img/og/_og-image-test-post.png
```

Expected: file exists. Open it and verify the title text in the image matches "A test post for OG image generation."

- [ ] **Step 2: Spec check item 2 — meta tag points at the generated path**

```bash
grep -m1 "og:image" _site/blog/_og-image-test-post/index.html
```

Expected: `content="https://www.bobmonsour.com/assets/img/og/_og-image-test-post.png"`.

- [ ] **Step 3: Spec check item 3 — title change triggers regen**

Edit the test post's `title` to something different (e.g., "A renamed test post"). Re-run the build. Open the PNG; the title text should be the new one. Inspect `.cache/og/manifest.json` and confirm the entry for `_og-image-test-post` now has a different `hash` value than before.

- [ ] **Step 4: Spec check item 4 — unchanged build is a cache hit**

Run the build again with no changes:
```bash
ELEVENTY_RUN_MODE=serve npx @11ty/eleventy
```

`_site/assets/img/og/_og-image-test-post.png` should be byte-identical to the previous build (compare with `cmp` or check that the manifest hash didn't change).

- [ ] **Step 5: Spec check item 5 — short and long titles**

Already covered in Task 4 Step 3 (long-title eyeball). If you want a fresh check after end-to-end integration, edit the test post's title to a long string (~100 chars) and rebuild; open the PNG.

- [ ] **Step 6: Spec check item 6 — notes post unaffected**

Pick a notes-tagged post, e.g. `<slug>` from Task 8 Step 3.

```bash
ls _site/assets/img/og/<slug>.png 2>/dev/null && echo "FAIL: should not exist" || echo "OK: not generated"
grep -m1 "og:image" _site/blog/<slug>/index.html
```

Expected: "OK: not generated" and the meta tag points at `notes-og-image.jpg`.

- [ ] **Step 7: Spec check item 7 — post with explicit `image:` has both hero and generated OG**

Pick any existing post with an `image:` front matter block (most posts have one). Inspect the rendered HTML:

```bash
grep -m1 "og:image" _site/blog/<that-post-slug>/index.html
grep -m1 "<img src" _site/blog/<that-post-slug>/index.html
```

Expected:
- `og:image` content points at `/assets/img/og/<that-post-slug>.png` (the generated card).
- The first `<img>` tag in the rendered article (from `showimage.njk`) still references the front-matter `image.source` (the hero).

- [ ] **Step 8: Spec check item 8 — manifest size**

```bash
node --input-type=module -e '
import("node:fs/promises").then(async (fs) => {
  const m = JSON.parse(await fs.readFile(".cache/og/manifest.json", "utf8"));
  console.log("manifest entries:", Object.keys(m).length);
});'
```

Expected: ~71 (matching the count of non-notes/non-TIL posts at design time, plus 1 for the test post if it's still around).

- [ ] **Step 9: Clean up the test post**

```bash
rm src/posts/2026/_og-image-test-post.md
ELEVENTY_RUN_MODE=serve npx @11ty/eleventy
```

After the rebuild, the manifest should have removed `_og-image-test-post` (gc step), and `_site/assets/img/og/_og-image-test-post.png` should not exist:

```bash
ls _site/assets/img/og/_og-image-test-post.png 2>/dev/null && echo "FAIL: leftover" || echo "OK: cleaned"
```

Expected: "OK: cleaned".

- [ ] **Step 10: Final production build sanity check**

```bash
npm run build
```

Expected: completes without errors. The pagefind postbuild step runs as usual.

```bash
ls _site/assets/img/og/ | wc -l
```

Expected: 71 (the production count, minus draft posts).

- [ ] **Step 11: No commit needed**

This task observes only; nothing is staged.

---

## Self-review checklist (post-write)

- **Spec coverage:**
  - Scope (Task 7 rule + Task 5 queue) ✓
  - Visual spec (Task 4 generator) ✓
  - Architecture: data cascade + after-build hook (Tasks 5, 7) ✓
  - Components: rule.js (Task 2), cache.js (Task 3), generator.js (Task 4), index.js (Task 5) ✓
  - posts.11tydata.js change (Task 7) ✓
  - head.njk change (Task 8) ✓
  - Caching/regen with hash + RENDERER_VERSION (Task 3) ✓
  - Error handling: warn-and-continue (Tasks 3, 5) ✓
  - Dependencies: satori, sharp, @fontsource/ibm-plex-serif (Task 1) ✓
  - Verification per spec items 1–8 (Task 9) ✓
- **Placeholders:** none.
- **Type/name consistency:** `shouldGenerate(data)` (Task 2) used consistently in Task 5; `hashTitle(title)`, `get(slug, hash)`, `put(slug, hash, buffer)`, `gc(activeKeys)` (Task 3) match Task 5's call sites; `generate(title)` (Task 4) matches Task 5; `register(eleventyConfig)` (Task 5) matches Task 6's import name `registerOgImage`.
