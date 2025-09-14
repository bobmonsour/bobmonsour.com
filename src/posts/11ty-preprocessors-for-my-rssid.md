---
title: I wanted to validate the presence of an rssid in my front matter
description: Rather than have my RSS entry ID be missing, I wanted to validate its presence at build time.
date: 2025-02-01
tags: [til, blogging, 11ty, RSSness, learned]
pageHasCode: true
rssid: b1614725837b9e912ba3d5b8759c7d5f
---

And you thought I was done with all this RSS entry ID business. Not so fast.

Once I got things working the way I wanted, I had forgotten one key part of the process.

Each time I created a new blog post, note, or TIL, I would have to run the [rssid node script](https://github.com/bobmonsour/rssid#rssid-generating-permanent-and-unique-rss-entry-ids) that [I wrote about earlier](/blog/even-more-on-rss-ids/) before building the site. Needless to say, on the first post that I wrote after doing all this, I forgot to do just that.

So, what I realized is that I really wanted the build to fail if the `rssid` was missing from the front matter of my posts.

At first, I took the approach of testing for its presence in the Nunjucks, forcing the output of a large `<h1>` right before the title of the post, proclaiming that the `rssid` was missing. But I got no console errors and the build succeeded.

That was not good enough for me. I wanted the build to fail and give me an error message indicating so along with the filename of the offending file.

I posted a question on the Discord server and got a couple of good ideas. One was to use a custom [11ty preprocessor](https://www.11ty.dev/docs/config-preprocessors/) to check for the presence of the `rssid` in the front matter. When I first tried this, it seemed that it would be unable to have it focus on the particular directories of interest and would end up including all of the `.md` and `.njk` files in the build process. That was not what I wanted.

When I pointed this out, I learned that the `data.page.inputPath` was available. So, I could use that to only check the files in the directories that I wanted. This worked perfectly.

Here is the code that I added to my eleventy config to make this work:

```js
eleventyConfig.addPreprocessor("rssid", "njk,md", (data, content) => {
  const inputPath = data.page.inputPath;
  const dirs = ["/posts/", "/notes/", "/til/"];
  const containsDirs = dirs.some((word) => inputPath.includes(word));
  if (containsDirs && typeof data.rssid != "string") {
    console.error(
      "\x1b[31m%s\x1b[0m",
      "ERROR: missing rssid in file " + data.page.inputPath
    );
    console.log(
      "\x1b[31m%s\x1b[0m",
      "Run the command: rssid -a -f=" + data.page.inputPath
    );
    process.exit(1);
  }
});
```

What's really nice about this is that it tells me exactly how to use the tool I made to fix the error.

_That odd bit at the start of the console.log statement outputs the message in red. Perhaps there's a better/easier way to do that._

## Related posts

- [On RSS entry IDs](/til/on-rss-entry-ids/), _Jan 25, 2025_
- [Much more to come on RSS entry IDs](/til/much-more-to-come-on-rss-entry-ids/), _Jan 26, 2025_
- [Creating quasi-permanently unique entry IDs for RSS](/blog/creating-permanently-unique-entry-id-for-rss/), _Jan 27, 2025_
- [My last word on RSS entry IDs](/blog/even-more-on-rss-ids/), _Jan 30, 2025_
- [Prepare for a minor flood of RSS entries](/til/prepare-for-a-minor-flood-of-rss-entries/), _Jan 31, 2025_
- [Ok, this is my 'final' final word on RSS entry IDs](/blog/final-final-word-on-rss-entry-ids/), _Feb 2, 2025_
