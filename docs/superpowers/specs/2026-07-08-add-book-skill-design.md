# Add-Book Skill — Design

**Date:** 2026-07-08
**Status:** Approved (pending spec review)

## Goal

A Claude Code skill that adds a book to `src/_data/books.json` from just a title, filling
in the author, ISBN, and cover image so Bob doesn't have to look them up by hand. Books
marked "currently reading" also render on the home page and at the top of the Books page.

## Deliverable & location

A project-level skill at `.claude/skills/add-book/SKILL.md` (version-controlled with the
repo, since it is specific to this site's `books.json` and asset conventions). Invoked when
Bob asks to add a book (e.g. "add a book: <title>").

## Data model (existing, unchanged)

Each entry in `src/_data/books.json`:

```json
{
  "title": "North Woods",
  "author": "Daniel Mason",
  "ISBN": 9780593597033,
  "rating": 4.5,
  "yearRead": "2024/12/10",
  "localCover": true
}
```

- `yearRead` is either a `yyyy/mm/dd` date, `"currently"`, or `"undated"`.
- `localCover: true` is present **only** when a locally-stored cover file exists.
- Cover rendering in `_includes/bookitem.njk`:
  - `localCover` truthy → `<img src="/assets/img/{{ title | slugify }}.jpg">`
  - else → `https://covers.openlibrary.org/b/isbn/{{ ISBN }}-M.jpg`

## Workflow

1. **Input.** Bob gives a title and says whether it's *currently reading* or *finished*.
   (If he doesn't say, the skill asks.)

2. **Look up author + ISBN.** Query the Open Library search API by title:
   `https://openlibrary.org/search.json?title=<title>&fields=title,author_name,isbn,first_publish_year&limit=5`
   - If there is one clear match, use it.
   - If multiple plausible matches, present the top candidates (title / author / year /
     ISBN) and let Bob pick. Never guess on ambiguous titles.
   - Prefer a 13-digit ISBN. Store `ISBN` as it appears in existing entries (both numeric
     and string ISBNs exist in the file today; match the file's dominant style — numeric).

3. **Cover image — openlibrary primary, local fallback.**
   - Check `https://covers.openlibrary.org/b/isbn/<ISBN>-M.jpg?default=false`.
     `?default=false` makes Open Library return **404** when it has no real cover, so this
     is a reliable presence check (no eyeballing blank placeholders).
   - **Cover exists (200):** use it live. Do **not** download anything. Do **not** set
     `localCover`. The template builds the `-M.jpg` URL from the ISBN.
   - **No cover (404):** Bob downloads a cover image from a source he selects and gives the
     skill the file path (or drops it somewhere known). The skill then:
     - Resizes to **180px wide**, height scaled to the source aspect ratio (lands ~270–278px,
       matching existing local covers), using `sips --resampleWidth 180`.
     - Forces JPEG output (`sips -s format jpeg`), converting PNG/other formats.
     - Writes to `src/assets/img/<slug>.jpg`, where `<slug>` matches Eleventy's
       `title | slugify` (lowercase, spaces→hyphens, punctuation stripped).
     - Sets `localCover: true` on the entry.

4. **Collect remaining fields.**
   - *Finished:* `rating` (Bob provides) and `yearRead` as `yyyy/mm/dd` (Bob provides).
   - *Currently reading:* `yearRead: "currently"`, and **omit `rating`**.

5. **Write the entry.** Append the new object to the `books.json` array. `books.js` sorts
   dated books by date regardless of array position, and supports multiple `"currently"`
   books (home page shows 1, Books page shows up to 2), so a plain append is correct — the
   skill does not need to touch or re-date any existing entry.

6. **Confirm.** Show Bob the final JSON entry (and the local cover path, if one was created)
   before/after writing so he can verify.

## Slug rule (must match Eleventy)

The filename must equal `title | slugify` so `bookitem.njk` finds it. Eleventy's default
`slugify` lowercases, trims, replaces whitespace with `-`, and strips characters that aren't
alphanumeric/`-`. The skill computes the slug the same way (e.g.
`"Let the Great World Spin"` → `let-the-great-world-spin`). When in doubt, the skill can
confirm the expected filename against an existing entry.

## Tools the skill uses

- `WebFetch` — Open Library search API and the cover presence check.
- `AskUserQuestion` — disambiguating multiple title matches; asking book type / rating / date.
- `Bash` + `sips` — resize/convert the fallback cover.
- `Edit` — append the entry to `books.json`.

## Out of scope (YAGNI)

- Amazon scraping / browser automation for covers — Bob supplies the fallback image himself.
- Auto-updating a previously "currently reading" book to a finished date — done manually.
- Editing or removing existing entries.
- Rating/date validation beyond basic format shaping.

## Success criteria

- `add-book "<title>"` produces a correct, well-formed `books.json` entry with author + ISBN.
- Openlibrary-covered books get no local file and no `localCover`; the live URL renders.
- Uncovered books get a `180×~275` JPEG at `src/assets/img/<slug>.jpg` and `localCover: true`,
  and the file resolves via `bookitem.njk`.
- Currently-reading books render on the home page and the top of the Books page.
