# Adding search functionality to this site

This document outlines the search function that I want to add to this project.

## Context

The site is built with Eleventy. All of the files in the src directory dictate how content is displayed. I used to have pagefind installed and operating on this site, but I removed it.

I want to re-add it and there is a new version with new capabilities. The documentation can be found on this page: https://pagefind.app/docs/

## Desired UI

I want to add a search box as part of the main navigation; for wide screens, this would appear to the right of the About nav element. It should be of flexible and modest width so that a reasonably sized search term can be displayed. It should contain placeholder text, specifically, "Enter search term..."

## Search result display

As I understand it, Pagefind provides incremental search results as search terms are entered.

I would like for the search results to be presented on the center of the page, but no wider than one of the columns on the home page, or perhaps the same as the width of the main content on the Blog, Projects, Books, or About page.
