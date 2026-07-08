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

New entries written by this skill look like the above **minus `rating`**, e.g. a finished
book: `{ title, author, ISBN, yearRead: "2026/07/08"[, localCover: true] }`; a currently-
reading book: `{ title, author, ISBN, yearRead: "currently"[, localCover: true] }`.

- `yearRead` is either a `yyyy/mm/dd` date, `"currently"`, or `"undated"`.
- `localCover: true` is present **only** when a locally-stored cover file exists.
- `rating` is **legacy** — it is no longer rendered anywhere in the web interface. New
  entries written by this skill omit `rating` entirely. (Existing entries keep it until the
  separate cleanup below.)
- **Invariant:** there is at most **one** `"currently"` entry at a time.
- Cover rendering in `_includes/bookitem.njk`:
  - `localCover` truthy → `<img src="/assets/img/{{ title | slugify }}.jpg">`
  - else → `https://covers.openlibrary.org/b/isbn/{{ ISBN }}-M.jpg`

## Workflow

1. **Input.** Bob gives a title and says whether it's *currently reading* or *finished*.
   (If he doesn't say, the skill asks.)

   **If *currently reading* and a `"currently"` entry already exists** (enforcing the
   single-current invariant): before adding the new one, the skill asks whether Bob has
   finished that existing book.
   - *Yes* → ask for the finish date (`yyyy/mm/dd`) and update the existing entry's
     `yearRead` from `"currently"` to that date. Then proceed to add the new current book.
   - *No* → he can't have two current books; the skill stops and asks how he'd like to
     proceed (e.g. add this as a *finished* book instead, or cancel) rather than creating a
     second `"currently"` entry.

2. **Look up author + ISBN.** Query the Open Library search API by title:
   `https://openlibrary.org/search.json?title=<title>&fields=title,author_name,isbn,first_publish_year&limit=5`
   - If there is one clear match, use it.
   - If multiple plausible matches, present the top candidates (title / author / year /
     ISBN) and let Bob pick. Never guess on ambiguous titles.
   - Prefer a 13-digit ISBN. Both numeric and string ISBNs exist in the file today; the
     skill writes it as a numeric value (the dominant style) — the value is what matters for
     the cover URL, not the type.

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

4. **Collect remaining fields.** No `rating` is ever collected or written.
   - *Finished:* `yearRead` as `yyyy/mm/dd` (Bob provides).
   - *Currently reading:* `yearRead: "currently"`.

5. **Write the entry.** Append the new object to the `books.json` array. `books.js` sorts
   dated books by date regardless of array position, so a plain append is correct for the
   new entry. (If an existing current book was handed off in step 1, that entry is updated
   in place — only its `yearRead` changes.)

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
- `AskUserQuestion` — disambiguating multiple title matches; asking book type, finish date,
  and the currently-reading hand-off question.
- `Bash` + `sips` — resize/convert the fallback cover.
- `Edit` — append the new entry to `books.json` (and, on hand-off, update the outgoing
  current book's `yearRead`).

## Out of scope (YAGNI)

- Amazon scraping / browser automation for covers — Bob supplies the fallback image himself.
- Removing existing entries.
- Date-format validation beyond basic shaping.
- Bulk cleanup of legacy `rating` fields (handled as a one-off follow-up, below — not by the
  add-book skill).

## Follow-up (after the skill is built)

Once the skill exists and works, come back to Bob with a suggestion to clean up
`books.json` by removing the legacy `rating` property from **all** existing entries (it is
no longer rendered). This is a separate, one-off edit — not part of the add-book skill.

## Success criteria

- `add-book "<title>"` produces a correct, well-formed `books.json` entry with author + ISBN.
- Openlibrary-covered books get no local file and no `localCover`; the live URL renders.
- Uncovered books get a `180×~275` JPEG at `src/assets/img/<slug>.jpg` and `localCover: true`,
  and the file resolves via `bookitem.njk`.
- Currently-reading books render on the home page and the top of the Books page.
- Adding a new currently-reading book when one already exists prompts the hand-off; on "yes"
  the outgoing book is dated and only one `"currently"` entry remains.
- No new entry carries a `rating` field.
