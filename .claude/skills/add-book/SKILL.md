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
- If **finished**, the **finish date**. Ask if not given. Bob may enter it in any
  reasonable form (e.g. `June 28, 2026`, `6/28/2026`, `2026-06-28`); normalize it
  to `yyyy/mm/dd` before writing (see **Normalizing dates** below).

Never collect a rating — it is legacy data no longer rendered.

### Normalizing dates

`books.json` stores dates as `yyyy/mm/dd` (zero-padded). Convert whatever Bob types
to that format. For the common `Month Day, Year` form, use macOS `date`:

```bash
date -j -f "%B %d, %Y" "June 28, 2026" "+%Y/%m/%d"   # -> 2026/06/28
```

For other inputs, pick the matching `-f` format string (e.g. `"%m/%d/%Y"` for
`6/28/2026`, `"%Y-%m-%d"` for `2026-06-28`), or just format it yourself. If the
input is ambiguous or the conversion fails, show Bob the normalized date and
confirm before writing.

## 2. Currently-reading hand-off (only when adding a *currently reading* book)

There may be at most one `"currently"` entry. Check for an existing one:

```bash
node -e "const b=require('./src/_data/books.json');console.log(JSON.stringify(b.filter(x=>x.yearRead==='currently').map(x=>x.title)))"
```

If it returns a non-empty list, ask Bob whether he has finished that book:
- **Yes** → ask for its finish date (any reasonable form; normalize to `yyyy/mm/dd`
  per **Normalizing dates** above), then Edit that entry's
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
