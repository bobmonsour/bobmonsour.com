---
title: Migrating this site to Cloudflare
date: 2024-12-16T00:00:00.000Z
tags:
  - 11ty
description: >-
  Netlify surprised me with a bandwidth notice, so I've decided to move this
  site to Cloudflare.
keywords: migration, Cloudflare, Netlify
image:
  source: migrating-this-site-to-cloudflare.jpg
  alt: Wildebeests migrating
  creditPerson: Harshil Gudka
  creditLink: https://unsplash.com/@hgudka97
rssid: f4ebfffdaa2ab53fd9e5d2850109e611
---

I opened my email yesterday morning, only to find this notice from Netlify:

![Netlify bandwidth notice](/assets/img/netlify-bandwidth-notice.png)

I was surprised. I had no idea that I was using that much bandwidth. I had been using Netlify for a while now, and I had been happy with it.

So I logged into my Netlify account to see what might be going on. I found this graph for my bandwidth usage. The graph below shows the dramatic spike in usage over the last few weeks. Needless to say, I was shocked. I had not suddenly become popular. Sure, I had a couple of blog posts about Eleventy and some other stuff, but nothing that would cause this kind of spike.

![Netlify bandwidth usage](/assets/img/netlify-bandwidth-graph.png)

I downloaded the usage CSV that they provide and two of my sites, this site and the [11ty Bundle](https://11tybundle.dev), shared the load, with this site consuming about 20GB and the 11ty Bundle consuming about 30GB. That didn't make a ton of sense to me.

Looking at my analytics (I use [Fathom Analytics](https://usefathom.com/) for all the sites I have), while I have experienced an increase in traffic, it did not seem enough to cause this kind of spike that Netlify is showing.

![Fathom Analytics usage graph](/assets/img/fathom-analytics-12-15.png)

I had been looking at Cloudflare and had even set up a toy project there to see what the interface was like and what it would take to build an Eleventy site there. I got it up and running, but did not feel compelled to make a switch on any of my sites. I was used to the Netlify interface and the way it worked and I found the Cloudflare interface a bit confusing. But that is probably due to my familiarity with Netlify.

I will also note that the [Cloudflare "free"](https://www.cloudflare.com/plans/developer-platform/#overview) plan offers unlimited bandwidth and unlimited sites. And it allows for 500 builds per month as compared with Netlify's 300 build minutes per month. I can certainly live well within the 500 build per month limit.

Funny thing...while I was on Bluesky today, [Sia Karamalegos](https://sia.codes/) just happened to repost an article she had written about her own story of [Migrating from Netlify to Cloudflare](https://sia.codes/posts/migrating-netlify-to-cloudflare/). Her primary reason was to take advantage of the AI bot protection provided by Cloudflare. It's a great overview of what she encountered in the migration process and I will be making full use of the lessons she learned.

If I had to guess, my bandwidth overage has been caused by bot scraping of my sites. Not sure why I'd be on their radar, but that might be what it is.

So, I've decided to move this site to Cloudflare. I'll keep the 11ty Bundle on Netlify for now. I'll write a post about the migration process once I've completed it.

I have a couple of other thoughts on what might be happening and they revolve around Netlify being VC backed. Perhaps they need to get some of their currently "free" tier users to migrate to their $19/mo Pro plans. Or perhaps they simply want to nudge them to migrate so they can free up resources for their enterprise customers. Either way, those are speculations on perhaps some nefarious ways that Netlify is manipulating or altering the way that they measure bandwidth.

The other side of this is that Cloudflare is a public company, and while not yet profitable, has a sizeable market cap and is growing nicely year over year. They have a vested interest in getting more users on their platform and they offer a far broader range of networking services that the narrow niche in which Netlify operates.

All I want is a stable place to host my rather small websites. After all, for me, this is a hobby.