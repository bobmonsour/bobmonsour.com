# Add-Book Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a project-level Claude Code skill that adds a book to `src/_data/books.json` from a title, filling in author + ISBN and handling the cover image.

**Architecture:** The deliverable is a `SKILL.md` instruction file (no runtime code). It orchestrates existing tools — Open Library APIs via `curl`, `@sindresorhus/slugify` (already in `node_modules`) for the filename, and `sips` for cover resizing — then edits `books.json`. Verification is an end-to-end dry run of the procedure against a scratch copy of `books.json` covering both cover paths.

**Tech Stack:** Markdown skill file; `curl`; Node one-liners (`@sindresorhus/slugify`); macOS `sips`; Open Library search + covers APIs.

## Global Constraints

- Skill lives at `.claude/skills/add-book/SKILL.md` (project-level, version-controlled).
- New entries **never** include a `rating` field.
- At most **one** `"currently"` entry may exist at a time.
- Local cover filename MUST equal `title | slugify` using `@sindresorhus/slugify` (Eleventy v4-alpha's slugifier) so `_includes/bookitem.njk` resolves it. Verified: `"Either/Or"` → `either-or`.
- Local covers: 180px wide, JPEG, saved to `src/assets/img/<slug>.jpg`.
- Cover presence check: `curl -sL ...?default=false` returns **200** if a cover exists, **404** if not. (Verified.)
- ISBN written as a numeric value; use a 13-digit ISBN (978/979 prefix).
- Do not run a production build as part of the skill; only edit data/assets.

---

### Task 1: Author the add-book skill

**Files:**
- Create: `.claude/skills/add-book/SKILL.md`

**Interfaces:**
- Produces: the skill file. No code interfaces; downstream verification (Task 2) exercises the documented procedure.

- [ ] **Step 1: Create the skill file with the verified content below**

Write `.claude/skills/add-book/SKILL.md` with exactly this content:

````markdown
---
name: add-book
description: Use when Bob wants to add a book to the bobmonsour.com Books page (src/_data/books.json) — e.g. "add a book", "add <title> to my books". Looks up author + ISBN from Open Library, handles the cover (live openlibrary URL, or a locally-resized fallback image Bob provides), enforces a single currently-reading entry, and appends the entry (no rating field).
---

# Add a Book

Adds a book to `src/_data/books.json`. Run from the repo root
(`/Users/Bob/Library/CloudStorage/Dropbox/Docs/Sites/bobmonsour.com`).

## 1. Gather inputs

- **Title** — given by Bob.
- **Type** — *currently reading* or *finished*. Ask if not stated.
- If **finished**, the **finish date** as `yyyy/mm/dd`. Ask if not given.

Never collect a rating — it is legacy data no longer rendered.

## 2. Currently-reading hand-off (only when adding a *currently reading* book)

There may be at most one `"currently"` entry. Check for an existing one:

```bash
node -e "const b=require('./src/_data/books.json');console.log(JSON.stringify(b.filter(x=>x.yearRead==='currently').map(x=>x.title)))"
```

If it returns a non-empty list, ask Bob whether he has finished that book:
- **Yes** → ask for its finish date (`yyyy/mm/dd`), then Edit that entry's
  `"yearRead": "currently"` → `"yearRead": "<date>"`. Then continue.
- **No** → stop. Two current books aren't allowed. Ask whether to add the new
  book as *finished* instead, or cancel. Do not create a second `"currently"` entry.

## 3. Look up author + ISBN (Open Library)

URL-encode the title (spaces → `+`) and search:

```bash
curl -s "https://openlibrary.org/search.json?title=<TITLE+ENCODED>&fields=title,author_name,isbn,first_publish_year&limit=5"
```

- Choose the doc whose `title`/`author_name` best matches what Bob wants.
- If several are plausible (common titles), present the top candidates
  (title / author / first_publish_year) with AskUserQuestion and let Bob pick.
  Never guess on an ambiguous title.
- From the chosen doc's `isbn` array, pick a **13-digit** ISBN (starts with
  `978`/`979`). You'll confirm it has a cover in the next step; if the first has
  no cover (404), try other 13-digit ISBNs from the array before falling back.

## 4. Cover — openlibrary primary, local fallback

Check the chosen ISBN (follows redirects; prints final HTTP status):

```bash
curl -sL -o /dev/null -w "%{http_code}\n" "https://covers.openlibrary.org/b/isbn/<ISBN>-M.jpg?default=false"
```

- **200** → cover exists. Use it live. Do **not** download anything and do
  **not** set `localCover`. `bookitem.njk` builds the `-M.jpg` URL from the ISBN.
- **404** → no cover. Fall back to a local file:
  1. Ask Bob to download a cover image from a source he selects and give you the
     file path (e.g. `~/Downloads/whatever.jpg`).
  2. Compute the slug (exact match to Eleventy's filter):
     ```bash
     node --input-type=module -e "import s from '@sindresorhus/slugify';console.log((s.default||s)(process.argv[1]))" "<TITLE>"
     ```
  3. Resize to 180px wide + force JPEG, writing to the assets dir:
     ```bash
     sips --resampleWidth 180 -s format jpeg "<BOB_FILE>" --out "src/assets/img/<SLUG>.jpg"
     ```
  4. Verify the result is 180px wide:
     ```bash
     sips -g pixelWidth -g pixelHeight "src/assets/img/<SLUG>.jpg"
     ```
     Expect `pixelWidth: 180` and `pixelHeight` ~250–280.
  5. The entry will carry `"localCover": true`.

## 5. Append the entry to books.json

Build the object (no `rating`; ISBN numeric):

- Finished: `{ "title": …, "author": …, "ISBN": <13-digit>, "yearRead": "yyyy/mm/dd" }`
- Currently: `{ "title": …, "author": …, "ISBN": <13-digit>, "yearRead": "currently" }`
- Add `"localCover": true` only if step 4 saved a local file.

Edit `src/_data/books.json`: append the new object as the last element of the
array — add a comma after the current last entry's closing `}`, then the new
object, then the closing `]`. Match the existing 2-space indentation. A plain
append is correct: `books.js` sorts dated books by date and filters
currently-reading separately, so array position doesn't matter.

## 6. Confirm

Show Bob the final JSON entry (and the local cover path if one was created).
Note that a currently-reading book appears on the home page and the top of
`/books/`. He can preview with `npm run sns`.
````

- [ ] **Step 2: Verify the frontmatter and that the skill is discoverable**

Run:
```bash
head -4 .claude/skills/add-book/SKILL.md
```
Expected: a `---` fenced frontmatter block with `name: add-book` and a `description:` line.

- [ ] **Step 3: Sanity-check every embedded command is the verified form**

Run:
```bash
grep -nE "default=false|resampleWidth 180|@sindresorhus/slugify|search.json" .claude/skills/add-book/SKILL.md
```
Expected: matches for the cover check (`?default=false`), the `sips` resize (`--resampleWidth 180`), the slug one-liner (`@sindresorhus/slugify`), and the search API (`search.json`) — the four dependencies validated during planning.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/add-book/SKILL.md
git commit -m "Add add-book skill for books.json entries"
```

---

### Task 2: End-to-end dry run (both cover paths)

Exercise the documented procedure against a **scratch copy** of `books.json` so the real data is untouched, proving both the openlibrary-live path and the local-fallback path produce correct results.

**Files:**
- Test scratch dir: `/private/tmp/claude-501/-Users-Bob-Library-CloudStorage-Dropbox-Docs-Sites-bobmonsour-com/5733ffb8-a68b-4ba8-bd6f-fc4fa9d4a703/scratchpad/`

**Interfaces:**
- Consumes: the `SKILL.md` procedure from Task 1.

- [ ] **Step 1: Live-cover path — verify a real title resolves to a 200 cover with no local file**

Pick a known-covered title (e.g. "Pachinko", ISBN 9781455563920). Run the skill's step-3 and step-4 checks:
```bash
curl -s "https://openlibrary.org/search.json?title=Pachinko&fields=title,author_name,isbn,first_publish_year&limit=3"
curl -sL -o /dev/null -w "%{http_code}\n" "https://covers.openlibrary.org/b/isbn/9781455563920-M.jpg?default=false"
```
Expected: search returns "Pachinko" / "Min Jin Lee"; cover check prints `200`. Confirm the resulting entry would carry **no** `localCover`.

- [ ] **Step 2: Fallback path — verify slug + resize produce a correct local cover**

Simulate an uncovered book. Confirm the 404 branch and the resize pipeline using a real image and a title with punctuation:
```bash
# 404 branch (bogus ISBN)
curl -sL -o /dev/null -w "%{http_code}\n" "https://covers.openlibrary.org/b/isbn/9999999999999-M.jpg?default=false"
# slug for a punctuated title
node --input-type=module -e "import s from '@sindresorhus/slugify';console.log((s.default||s)(process.argv[1]))" "Test: A Sample/Title"
# resize a source image into the scratchpad and check dimensions
SCRATCH="/private/tmp/claude-501/-Users-Bob-Library-CloudStorage-Dropbox-Docs-Sites-bobmonsour-com/5733ffb8-a68b-4ba8-bd6f-fc4fa9d4a703/scratchpad"
sips --resampleWidth 180 -s format jpeg src/assets/img/nuclear-war.jpg --out "$SCRATCH/slug-test.jpg"
sips -g pixelWidth -g pixelHeight "$SCRATCH/slug-test.jpg"
```
Expected: cover check prints `404`; slug prints `test-a-sample-title`; final image reports `pixelWidth: 180`.

- [ ] **Step 3: Hand-off logic — verify the current-book detector works**

```bash
node -e "const b=require('./src/_data/books.json');console.log(JSON.stringify(b.filter(x=>x.yearRead==='currently').map(x=>x.title)))"
```
Expected: prints a JSON array of currently-reading titles (may be `[]` given the recent Nuclear War edit). Confirms the hand-off check in step 2 of the skill returns usable output.

- [ ] **Step 4: Record the dry-run result**

No commit needed (verification only; no repo files changed). Report to Bob: both cover paths verified, slug exact-matches Eleventy, hand-off detector works. Note the current `books.json` has **no** `"currently"` entry right now (Nuclear War was recently dated), so the next currently-reading add won't trigger a hand-off.

---

## Follow-up (after the skill is verified)

Per the spec, once the skill works, return to Bob with a suggestion to strip the legacy `rating` property from **all** existing `books.json` entries (no longer rendered). Separate one-off edit — not part of this skill.

## Self-Review

- **Spec coverage:** input/type → Task 1 §1; author+ISBN lookup + disambiguation → §3; cover primary/fallback + resize + slug → §4 + Task 2 §1–2; single-current invariant + hand-off → §2 + Task 2 §3; no rating → Global Constraints + §5; append → §5; confirm → §6; cleanup follow-up → Follow-up section. No gaps.
- **Placeholder scan:** `<TITLE>`, `<ISBN>`, `<SLUG>`, `<BOB_FILE>` are intentional runtime substitutions inside the skill text, not plan placeholders; every command is a verified concrete form. No TBD/TODO.
- **Consistency:** slug command, cover-check command, and resize command are byte-identical across Task 1, Task 2, and Global Constraints.
