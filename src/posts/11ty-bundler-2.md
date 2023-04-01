---
title: The 11ty Bundler 2
date: 2023-04-01
tags:
  - 11ty
  - 11ty Bundler
description: A bundle of Eleventy releases, blog posts, and resources.
keywords: eleventy, newsletter, roundup, news
image:
  source: "11ty-bundler-2.jpg"
  alt: "an AI-generated image of the number eleven"
  caption: "An AI-generated image of the number eleven"
pageHasCode: "false"
draft: true
---

This is issue #2 of an occasional roundup of Eleventy releases, related blog posts, and resources. Back issues (or, in this case, back issue) can be found under the "11ty Bundler" tag link above.

## Recent releases

- [Eleventy Image v3.10](https://github.com/11ty/eleventy-img/releases/tag/v3.1.0), this release includes eleventy-image as a WebC component [docs](https://www.11ty.dev/docs/plugins/image/#webc), upgrades to [sharp v0.32](https://sharp.pixelplumbing.com/changelog#v032---flow).

- [Eleventy WebC v0.10.0](https://github.com/11ty/eleventy-plugin-webc/releases/tag/v0.10.0); while I included 0.10.1 in last week's Bundler, this release was really the larger one, with several new features, see the release notes in the link. But wait, [here's v0.11.0: Child Components accessing Global Data](https://github.com/11ty/webc/releases/tag/v0.11.0), followed quickly by [v0.11.1: Quick fix for data access on slotted content](https://github.com/11ty/webc/releases/tag/v0.11.1).

## Blog posts: from Discord, Mastodon, and around the web

### Site search for Eleventy

Highlighting the larger capacity of the free tier of Algolia, a service providing search for static sites, and how to update the integration with your Eleventy site.
[Awesome Algolia Updates (and some fixes here...)](https://www.raymondcamden.com/2023/03/30/awesome-algolia-updates-and-some-fixes-here).

### Monitor user metrics with Netlify

If you're a Netlify user (like me), for those on the Pro plan, you can now [Monitor real user metrics directly within Netlify](https://www.netlify.com/blog/monitor-real-user-metrics-directly-within-netlify/).

### A better way to extract and style content excerpts

While the Eleventy docs provide a way to parse excerpts from your content, it doesn't do everything you might want. Nicolas Hoisey built something that you might find useful. [How I built my own excerpt for Markdown content in Eleventy](https://nicolas-hoizey.com/articles/2023/03/31/how-i-built-my-own-excerpt-for-markdown-content-in-eleventy/).

### Slotted content in Eleventy

In [Slotted content in Eleventy](https://danburzo.ro/eleventy-slotted-content/), Dan Burzo shows how to embed pieces of data in the content part of the Markdown file, that can then be referenced by name from the HTML layout, just like any other template data.

### Sass in Eleventy, with versioning

In another piece by Dan Burzo, he shows how to [setup Eleventy to work with content-hashed .scss](https://danburzo.ro/eleventy-sass/). Content hashes are useful as a cache-busting mechanism.

### Internationalization with Eleventy 2.0 and Netlify

Lene (https://www.lenesaile.com/en/blog/internationalization-with-eleventy-20-and-netlify/)

### Syncing Letterboxd Data to Markdown Files (in Eleventy)

(https://www.markllobrera.com/posts/letterboxd-to-markdown/)

### Migrating to Eleventy from AnchorCMS

Josh Vickerson writes about his [migration to Eleventy](https://www.joshvickerson.com/posts/migrating-to-eleventy-from-anchorcms/).

### Blogging with Eleventy

In [Blogging with Eleventy](https://logicalcobwebs.com/blog/blogging-with-eleventy/), Bill Horsman describes creating his own space after previously writing on Medium.

### A lot of people seem to be experimenting with WebC.

### Elsewhere, there are all these interesting pieces.

## A sampling of sites built or redesigned with Eleventy

[David Reed Gracie](https://davidreedgracie.com/) - some very nice artwork

[Emily Leatherman](https://emilyleatherman.com/) - more beautiful artwork

### [Here's a very long list of sites built with Eleventy.](https://www.11ty.dev/speedlify/)

### [Add yours to the list.](https://github.com/11ty/11ty-community/issues/new/choose)

---

## The Bundler's tip of the day

---

## Eleventy resources

- [11ty docs](https://www.11ty.dev/docs/)
- [11ty Rocks!](https://11ty.rocks/)
- [The Eleventy Meetup](https://11tymeetup.dev/)
- [The Discord Server](https://www.11ty.dev/blog/discord/)
- [Github discussion on the Eleventy repo](https://github.com/11ty/eleventy/discussions)
- [YouTube channel](https://www.youtube.com/@EleventyVideo)
- [Eleventy Hub](https://11tyhub.dev/)

---

## Getting help or support with Eleventy

I can say that, without a doubt, if you have any questions or run into problems with Eleventy, the community on the [Discord Server](<(https://www.11ty.dev/blog/discord/)>) is amazing. In the forum-help channel, you can get any question answered, regardless of how simple or complex.

There is also some great help and conversation at the [Discussions section of the Github repo](https://github.com/11ty/eleventy/discussions).

---

Feel free to share a link to this page wiht your friends and colleagues.

If you have any suggestions for The Bundler, please let me know.

You can also grab the [RSS feed for this blog](https://www.bobmonsour.com/feed.xml) and stuff it in your favorite RSS reader (though you also get some bon-Bundler content).

Keep on bundlin...
