#!/usr/bin/env bash
# Prints the bobmonsour.com usage summary at session start (SessionStart hook).
# Output is JSON with a systemMessage field, displayed to the user in the UI.

read -r -d '' MESSAGE <<'EOF'
bobmonsour.com — personal website and blog

WHAT IT IS
Bob's personal site at https://www.bobmonsour.com, built with Eleventy (11ty) v4 alpha using ESM and Nunjucks templates. Content is markdown under src/posts/ (blog posts, notes, and TILs across 2022-2026), organized in a single posts collection and differentiated by tags. Client-side search runs on Pagefind, indexed as a post-build step.

WORKFLOW
1. Dev server with live reload: npm run sns (or npm run rsns for a clean rebuild).
2. Write posts as markdown in src/posts/<year>/; set draft: true to keep a post out of production but visible in dev.
3. Production build: npm run build (runs Eleventy, then postbuild Pagefind indexing). Check links with npm run links.
EOF

jq -nc --arg m "$MESSAGE" '{systemMessage: $m}'
