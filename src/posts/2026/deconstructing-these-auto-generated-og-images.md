---
title: Deconstructing these auto-generated OG images
description: A walk through the build-time plugin that gives every blog post here its own social-share image.
date: 2026-05-07
tags:
  - AI
  - 11ty
pageHasCode: true
rssid: f3a4f2ae8bd452eb6ed5aab66685a5d1
---

[[toc]]

## Introduction

I've had a love-hate relationship with open graph images for a while now. There were times when I did not have any, or perhaps a fallback to my social media avatar, which looked outsized. Then I had a period where I had posts that were tagged as "Notes" or "TILs" (today-i-learned) and they had their own image that would be shared. And then I made sure that every post had its own image, and I would sometimes show it the post itself or not; but Notes and TILs still had their own special images.

One thing I had noticed with some other blogs were open graph images that had the post title embedded in them. I had seen some describe how they did it. [Sia](https://sia.codes) wrote about how she did it in a post titled [Dynamic social share images using Cloudinary](https://sia.codes/posts/social-share-images-using-cloudinary/). I read it, but it felt way more complicated than I wanted. And I didn't really want to engage with another 3rd party sevice just to accomplish this.

So, a couple of days ago, I enlisted my pair-programmer, Claude Code, along with the [Superpowers](https://github.com/obra/superpowers) plugin (I [wrote about both of those here](/blog/how-ive-been-using-ai/)) to come up with a way to do it that could be implemented at build time, not going out for any external services.

The result is [PR #4](https://github.com/bobmonsour/bobmonsour.com/pull/4) on the repo for this site.

While I had planned on a full deconstruction post that outlined the details of how this works, it was a bit too much for me to get my head around. The code is reasonably well commented so I will leave it to anyone interested to [examine the PR](https://github.com/bobmonsour/bobmonsour.com/pull/4) directly.

I will share some of what happens under the hood as best as I understand it, but not the nitty gritty details.

Before getting into the approach, here's a sample, the OG image for the recent post about [changing the way I deploy my Eleventy sites](/blog/changing-how-i-deploy-my-eleventy-sites/).

![The OG image for the post about changing how I deploy my Eleventy sites. It has a dark background, the post title in large white text, and my avatar and the site name in smaller white text at the bottom.](/assets/img/changing-how-i-deploy-my-eleventy-sites.png) { .outline }

## Specifying what I wanted

Before a line of code was written, I wrote a spec in the form of a markdown file. It's a good starting point when using the Superpowers brainstorm-spec-plan-implement workflow. The markdown is the input to the brainstorm phase.

Here's what I wanted, boiled down:

- Every regular blog post should get its own 1200&times;630 PNG that displays the post title, my avatar, and the bobmonsour.com site name over the same background color the site uses in dark mode.
- The image gets generated at build time and written to `_site/assets/img/og/<slug>.png`.
- Caching the image should mean that on rebuilds, only posts whose titles changed get re-rendered. The first build pays the cost; every build after that is essentially free.
- Notes and TIL posts should keep their existing dedicated images. They're a different kind of content and the new approach doesn't really suit them.
- I wanted an opt-out, so a post that has a really good hero image can use that as its OG image instead of the generated image.
- The `og:image` meta tag in the page head needed to point at the right thing for each kind of page, e.g., Notes, TIL, over-ridden with the desgnated post hero image, or the generated image.

## The Satori plus sharp libraries

The two libraries that do the heavy lifting are [Satori](https://github.com/vercel/satori) (Vercel's HTML-and-CSS-to-SVG renderer) and [sharp](https://sharp.pixelplumbing.com/) (the same image library used by the [eleventy-img plugin](https://www.11ty.dev/docs/plugins/image/)).

Satori takes a tree of elements that look a lot like JSX and turns them into an SVG. Sharp takes that SVG and turns it into a PNG.

With those pieces in place, the rest is a bit of plumbing. Six new source files, all but one of them are small. See [PR #4](https://github.com/bobmonsour/bobmonsour.com/pull/4) for details.

## What posts are eligible for a generated og image?

As noted in the scope outlined above:

- _Notes and TIL posts should keep their existing dedicated images. They're a different kind of content and the new approach doesn't really suit them._

Blog posts with a tag that is either "Notes" or "TIL" are ineligible for a generated OG image. They get their own dedicated default images instead.

- _I wanted an opt-out, so a post that has a really good hero image can use that as its OG image instead of the generated image._

For some blog posts, I find that the hero image that I refer to in the front matter is more appropriate than the generated image and I make sure that they are the proper size, usually manually using Pixelmator Pro. For those, I can set `useHeroForOg: true` in the front matter, and the system will use the hero image as the OG image instead of generating one.

## The renderer

`src/_config/og-image/generator.js` is the file that turns a post title and post date into a PNG buffer. It's the longest file in the plugin, but it's mostly the element tree that defines what the image looks like.

This is where the image gets generated using Satori and Sharp. Again, check out [PR #4](https://github.com/bobmonsour/bobmonsour.com/pull/4) for details.

## Caching the generated PNGs

It was important to have a technique that would result in cached OG images. And if a post title were to change or if the contents of what I wanted included in the image were to change, for example, if I wanted to add another element (or remove one), all the cached PNGs would need to be invalidated so that they would regenerate with the new title or the new spec. The cache.js file makes all that happen. Again, check out [PR #4](https://github.com/bobmonsour/bobmonsour.com/pull/4) for details.

When nothing changes, no new images get constructed. In the normal course of events, only the creation of a non-Notes, non-TIL, or a non-useHeroForOg post would cause a new image to be generated, and only that post's image would be generated, not all the posts.

There's this notion of RENDERER_VERSION in the cache code. Whenever I make a change to the generator that should cause all the images to regenerate, that version gets bumped. The version is part of the hash input, so all the hashes change and all the cached images become stale at once. That's exactly what I want when I make a breaking change to what I want included in the image.

## The orchestrator

`src/_config/og-image/index.js` is the file that ties the others together and registers itself with Eleventy. It's the only file in the plugin that knows anything about Eleventy's lifecycle.

I will refrain from including the code here, but I will include Claude Code's description of how this orchestrator works, in short, by plugging itself into the eleventy.before and eleventy.after hooks.

Here's Claude Code's description of how the orchestrator works:

During the data cascade, there is full access to each post's parsed data (title, tags, dates, everything). During the `eleventy.after` hook, the build has already produced HTML and I no longer have the data cascade — but that's the only safe time to write files into `_site/`. So the plugin uses a module-scoped `queue` array as a bridge: the `addCollection` callback fills it during the data cascade (returning an empty array because we don't actually want a collection in templates, just the side effect), and the `eleventy.after` hook drains it.

The `eleventy.before` reset matters for `--watch` mode. Without it, the queue would accumulate across rebuilds and we'd end up trying to write the same files over and over.

For each entry in the queue, the orchestrator computes the hash, checks the cache, generates a fresh PNG on a cache miss, and writes the result to `_site/assets/img/og/<slug>.png`. After the loop, `cache.gc()` cleans up anything stale. The error handling is deliberately forgiving — if a single post fails to render, we log a warning and move on. The build is not allowed to fail because of an OG card.

The plugin gets registered in `eleventy.config.js` with one line:

```js
import registerOgImage from "./src/_config/og-image/index.js";
// ...
registerOgImage(eleventyConfig);
```

That's the end of Claude Code's description.

## Conclusion

I worked through this with Claude Code using the Superpowers brainstorm-spec-plan-implement workflow. The spec and the implementation plan both got reviewed and edited by me before any code was written. The actual coding part was relatively quick, but the up-front planning is what made it feel calm rather than chaotic. As I [said in the AI post](/blog/how-ive-been-using-ai/), this approach is working for me.

If you're an Eleventy person and you want to do something similar on your own site, I think the pieces here are reasonably copy-and-pasteable. Just check out [PR #4](https://github.com/bobmonsour/bobmonsour.com/pull/4).

Anyway, I'm pleased with how this turned out. I might noodle with the visual treatment over time. For now though, it does what I wanted it to do.
