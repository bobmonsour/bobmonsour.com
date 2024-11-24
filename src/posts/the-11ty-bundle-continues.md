---
title: The 11ty Bundle continues - A year in review
date: 2024-05-01
tags:
  - 11ty
showImage: true
description: The 11ty Bundle website launched one year ago today. I'm still doing it.
keywords: eleventy, 11ty, bundle, blog
image:
  source: "the-11ty-bundle-continues.avif"
  alt: "an early sketch of the 11ty bundle website design"
  caption: An early sketch of the 11ty Bundle website design
---

The [11ty Bundle](https://11tybundle.dev/) website launched one year ago today. I'm still doing it. I'm still writing posts (check out [Issue 41, the latest](https://11tybundle.dev/blog/11ty-bundle-41/)), still adding features, still tweaking the design. I'm still enjoying it.

It's funny looking back at the first few posts where I kept saying what the next issue would focus on (at the time, Migrating to Eleventy), but not delivering that until [the Launch Day issue](https://11tybundle.dev/blog/11ty-bundle-5/). I guess I was still figuring out what I wanted to do with the site and realizing that I had to start remembering things that I say I'm going to do...and do them.

And when I read the [About page](https://11tybundle.dev/about/), it all sounds so familiar as if I had just written it yesterday.

Perhaps among the most challenging parts of maintaining the site was figuring out how to find posts and trying to not miss any. In [Issue 6](https://11tybundle.dev/blog/11ty-bundle-6/), which came out on May 9, 2023, I had added 158 posts since Issue 5, which had come out on May 1st. I don't know how much coffee I was drinking at the time, but it seemed that I was in overdrive and I felt like I was playing catch up. I was subscribing to RSS feeds, like eating M&amp;Ms...which I tend to eat one after another until the bag is empty.

The underlying database started off as an Airtable database (thank you, Cassey Lottman for showing me [how to do that](https://www.cassey.dev/posts/2023-05-09-airtable-data-fetch/)). And in [Issue 7]() I added a [Starters](https://11tybundle.dev//starters/) page. I chose starters that appeared well-documented and maintained. I wanted to make it easy for people to get started with Eleventy. [Lene Saile](https://11tybundle.dev//authors/lene-saile) shared her [Eleventy Excellent starter](https://eleventy-excellent.netlify.app/), a wonderfully organized and well-designed starter that I've seen chosen by several people as their starter of choice.

There was also a point where, for selected categories in the [Categories](https://11tybundle.dev//categories/) page, if there was a related page in the [eleventy docs](https://www.11ty.dev/docs/) I added a link to that page at the top of the category.

Bit by bit, I added a handful of things to make the site more useful and functional. These were things like a scroll-to-top button, full text search, and a [Firehose](https://11tybundle.dev//firehose/) page that showed all the posts on a single page in reverse chronological order. As of this writing, with 1,052 blog posts all on one page, the Firehose has Lighthouse scores of, 100, 98, 100, and 100. I need to look into that 98 (looks like I have an h3 before an h2...to be fixed).

What was really cool was to see new authors arrive on the scene and incredibly cool sites being built. Here's one of my favorites, [Eleventy Clock](https://eleventy-clock.netlify.app/2:07/) by [Ashur Cabrera](https://11tybundle.dev//authors/ashur-cabrera/). On the design front, [Adam Stoddard](https://11tybundle.dev//authors/adam-stoddard/) gave us the awesome-looking starter called [Grease](https://web-grease.netlify.app/). And there's [Eleventy Notes](https://eleventy-notes.sandroroth.com/) by [Sandro Roth](https://11tybundle.dev/authors/sandro-roth/) that helps you set up a personal Eleventy-based note-taking system. There are way too many good posts, starters and sites to recount here (I'm writing this on April 30th, as I just decided to write it the day before the 1st anniversary of the site).

I took some strange turns, like trying to build my own analytics using Netlify functions and Firebase. The idea was to try to get a measure of the most popular posts and authors and then have a page that showed those trends. I learned a lot, but backed out of it after realizing that the traffic numbers to the site did not rise to a level where I thought the stats would be meaningful. As of today, I've set up Fathom Analytics on the site and it's all I need. It gives me a sense of the traffic to the site and the most popular posts. And I like that I can have a dashboard that shows all of the sites where I'm using Fathom (there are six of them).

Here's a peek at the analytics for the site. I added Fathom in July 2023.

<img src="/assets/img/fathom-analytics.avif" alt="Fathom Analytics for the 11tybundle.dev site" size="100vw">

<p class="caption">Fathom Analytics for the 11tybundle.dev site</p>

I also toyed (for about 2 weeks) with using the Buy Me a Coffee service. I don't need the money and there were no coffee buyers.

It took the gold mine of [Raymond Camden's eleventy blog posts](https://www.raymondcamden.com/tags/eleventy) to cross the 500 post threshold. I had been way behind in capturing his posts. If you check the [Authors by count](https://11tybundle.dev/authors-by-count/) page, you'll see that at the top of the leaderboard by a factor of 2 as of this writing.

In [Issue 16](https://11tybundle.dev/blog/11ty-bundle-16/), I highlighted a micro-site that Zach had built, called [Educational, Sensational, Inspirational, Foundational](https://esif.dev/), or "esif" for short. On the site, he provides _"A historical record of foundational web development blog posts."_ As I recall, these posts were in response to a question he posted, asking for posts that web developers felt had left a mark on them.

While Airtable was a workable solution for managing data for the site, data entry required more mental energy than I liked. I decided to migrate things to Google Sheets. [I documented the migration](https://www.bobmonsour.com/posts/scratch-that-use-google-sheets-api/).

Last October, Zach reached out to me to request an API to various category pages so that he could augment the docs with additional community resources for those categories. I was happy to do that, I just didn't know how. Zach showed me a simple example and I was off to the races. I [wrote about it](https://www.bobmonsour.com/posts/pagination-in-a-javascript-template-with-eleventy/). You can see [an example of that effort here](https://www.11ty.dev/docs/cms/#from-the-community).

By November, the site crossed the 800 post threshold, at which point it was time to add the capability to collapse the Firehose by year, making it easier to get to the prior years' posts. With that and search, you can pretty much find anything on the site.

Snow fell (and still falls) on [Issue 24](https://11tybundle.dev/blog/11ty-bundle-24/) thanks to Zach's [snow-fall web component](https://www.zachleat.com/web/snow-fall/).

[Robb Knight](https://11tybundle.dev/authors/robb-knight) unleashed (and continues to unleash) a handful of cool blog-adjacent things; one of them is the [eleventy-post-graph-plugin](https://rknight.me/blog/eleventy-post-graph-plugin/). You can find it for this site [right here](https://11tybundle.dev/blog/post-graph/). It seems that I've been posting mostly on Tuesdays so far this year. Robb also instigated the [App Defaults](https://defaults.rknight.me/) movement, where many of us have shared blog posts listing our go-to apps for various things. And last, but not least, Robb recently launched [EchoFeed](https://echofeed.app/), a service that _"supports reading RSS and Atom and JSON feeds and then posting those items to Mastodon and Micro.blog and Bluesky and GitHub and Discord and LinkAce."_

As 2024 rang in, we crossed the 900 post mark. I was starting to worry that it might be tough to get to 1,000 as Eleventy was growing out of its teenage years. Silly me; we've already crossed that mark -- by late February -- sooner than I had expected.

[Webmentions](https://11tybundle.dev/categories/webmentions/) became a thing. There are at least 30 posts in that link to show you the way if you're interested.

With [Issue 29](https://11tybundle.dev/blog/11ty-bundle-29/) we shared the announcement for the [11ty International Symposium on Making Web Sites Real Good](https://conf.11ty.dev/). If you're reading this shortly after I post it, it's next week, May 9, 2024.

While search functionality is great, I sometimes find myself just browsing over the categories. And now and then, when I see a bunch of posts related to a specific topic or something that several people are asking questions about, I've added a new category to capture it. Among those added are [RSS](https://11tybundle.dev/categories/rss/), [Drafts](https://11tybundle.dev/categories/drafts/), and [Image Galleries](https://11tybundle.dev/categories/image-galleries/).

The [Eleventy Meetup](https://11tymeetup.dev/) continued with some great talks about various aspects of Eleventy or a specific Eleventy project that they've built. You can find playlists of [all of the episodes on YouTube](https://www.youtube.com/@THEEleventyMeetup/playlists).

Just a few weeks ago, Mike Neumegen (Co-Founder and CEO of CloudCannon), and Zach started a series of videos for all of us in the _"Static Site Fan Club"_. You can find them on [CloudCannon's YouTube channel](https://www.youtube.com/@CloudCannon/videos). They've spent some time building an RSS reader with Eleventy. They've been streaming these [live on Wednesdays on Twitch](https://www.twitch.tv/cloudcannoncms).

My most recent endeavor was to initiate a newsletter for the blog. I'm using [Buttondown](https://buttondown.email/) and I've been very happy with it. Their support is excellent. You can sign up for the newsletter [right here](https://buttondown.email/11tybundle). It delivers the blog posts from the [11tybundle.dev blog](https://11tybundle.dev/blog/).

And finally, if you've been needing a reminder why we all use Eleventy, here's [a post by Ryan Gittings](https://gittings.studio/blog/10-reasons-why-static-site-generators-are-perfect-for-modern-web-development/) extolling all the virtues of static site generators.

Well, that was the year in review for the 11ty Bundle. One down, and I have no idea how many more to go. This has been serving as a fun retirement hobby for me. While [my wife paints](https://www.tascafineart.com/sandra-tasca-paintings), I [Eleventy](https://www.11ty.dev/).

Thanks for reading. You can always reach me at [bob dot monsour at gmail dot com](mailto:bob.monsour@gmail.com). I'd love to hear from you. Seriously, drop me a line...really...[do it](mailto:bob.monsour@gmail.com)!
