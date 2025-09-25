---
title: Fetching a JSON file from GitHub at build time in Eleventy
description: Today I learned how to fetch a raw JSON file from GitHub at build time in Eleventy. Here's how I did it.
date: 2025-09-25
tags:
  - 11ty
  - til
  - learned
pageHasCode: true
rssid: 519d776dbe769860ed6bd6c520ddd957
---

So, I was reading through an interesting discussion on the [Eleventy Discord server](https://www.11ty.dev/blog/discord/) the other day, and [fLaMEd fury](https://flamedfury.com/) said something that struck me. It was something I didn't know you could do and it was something that removed a roadblock in my mind.

In this simple phrase, he said: _"...powered by a JSON file that is fetched (with eleventy-fetch) from a seperate repo..."_

I had been wanting to undertake a redesign of the [11ty Bundle site](https://11tybundle.dev), but was stuck in my head on a problem that was quite solvable. The JSON file that is the database for the site lives in the same repo as the site itself. Whenever I want to change the code that drives the site, I generally create a new branch. But with the db in the same repo, I would have to revert to the main branch before adding entries to the JSON file and pushing the changes. It was a hassle that I wanted to avoid.

So, I created a separate repo for the JSON file, and then I set about figuring out how to fetch that file at build time in Eleventy. Very simple with the Eleventy's [Fetch plugin](https://www.11ty.dev/docs/plugins/fetch/). I just needed to do something like this:

```js
const BUNDLEDB_URL =
  "https://raw.githubusercontent.com/USERNAME/REPO/BRANCH/path/to/bundledb.json";

// Fetch the json db from its remote repo
const bundleRecords = await Fetch(BUNDLEDB_URL, {
  duration: "1d", // cache for 1 day
  type: "json",
};
```

I learned about the whole `raw.githubusercontent.com` thing by way of GitHub Copilot. I'm finding that as a source of small bits of knowledge, it can be quite useful.

After I set up the build to use the remote JSON file, I realized that I was also faced with the issue of updating the node scripts that I use to manage the file. Thankfully, as I was developing those tools, I set up a config file with all the necessary directory and file references that can be used throughout all the scripts.

Once I adapted the tools to use the new location for the file on my local system, it worked like a charm.

Now I just have to figure out how to trigger a rebuild of the 11ty Bundle site whenever I push changes to the repo for the JSON file. Perhaps I can do that with GitHub Actions or some other triggering mechanism on Cloudflare.
