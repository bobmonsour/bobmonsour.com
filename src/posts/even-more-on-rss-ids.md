---
title: My last word on RSS entry IDs
description: In an effort to create more robust and truly unique and permanent IDs for my RSS feed entries, I built a thing to help.
date: 2025-01-30
image:
  source: creating-permanently-unique-entry-id-for-rss.png
  alt: Icon for RSS feeds
tags:
  - blogging
  - RSSness
rssid: 536734acd12c6a20d71296673361307a
---

As has been pointed out to me, the IDs I was using for my RSS feed entries were not as permanently unique and robust as they could be.

As one who can sometimes not let go of a bone once it's been picked up, I decided to do something about it.

Right now, I'm sitting on a branch of this site that has a new ID for each entry that is based on the MD5 hash of the filename for the post, note, or til entry.

The approach uses the [tag URI scheme](https://en.wikipedia.org/wiki/Tag_URI_scheme) that was noted in [my blog post](/blog/creating-permanently-unique-entry-id-for-rss/) about this, which I had learned from [Evan's blog post](https://darthmall.net/2025/on-the-importance-of-stable-ids/).

Evan's approach to create these IDs uses a tool called [Expanso](https://espanso.org/) that generates an MD5 hash of his posts.

While I have done a similar thing, i.e., generating an MD5 hash of the filename, I have not used Expanso to do it. Instead, I wrote a small node script that does the job.

I wrote the script to process all the files in a directory, or just a specific file.

If you are interested taking a closer look at this approach, check out this [GitHub repo](https://github.com/bobmonsour/rssid). The README contains everything you need to know.

Finally, the reason that I have not yet merged that repo branch that I referred to up front is that it will result in a flood of new entries arriving in everyone's feed reader.

I will, at some point in the near future, put out a _**FLOOD WARNING**_ post to let everyone know that it's coming.

## Related posts

- [On RSS entry IDs](/til/on-rss-entry-ids/), _Jan 25, 2025_
- [Much more to come on RSS entry IDs](/til/much-more-to-come-on-rss-entry-ids/), _Jan 26, 2025_
- [Creating quasi-permanently unique entry IDs for RSS](/blog/creating-permanently-unique-entry-id-for-rss/), _Jan 27, 2025_
- [Prepare for a minor flood of RSS entries](/til/prepare-for-a-minor-flood-of-rss-entries/), _Jan 31, 2025_
- [I wanted to validate the presence of an rssid in my front matter](/til/i-wanted-to-validate-the-presence-of-an-rssid-in-my-front-matter/), _Feb 1, 2025_
- [Ok, this is my 'final' final word on RSS entry IDs](/blog/final-final-word-on-rss-entry-ids/), _Feb 2, 2025_
