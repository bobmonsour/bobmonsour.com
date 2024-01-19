---
title: Adding webmentions to my site
date: 2024-01-13
tags:
  - 11ty
description: I had told myself that I wouldn't do this...but, seeing them on other people's sites changed my mind.
keywords: webmentions, 11ty, eleventy
image:
  source: "adding-webmentions-to-my-site.jpg"
  alt: "a neon sign with a heart and a zero next to it"
  creditPerson: "Prateek Kayyal"
  creditLink: "https://unsplash.com/@prateekkatyal"
pageHasCode: true
---

## Table of Contents

<div class='toc'>

1. [Introduction](#section1)
2. [What are webmentions?](#section2)
3. [How do I connect my website to the webmention plumbing?](#section3)
4. [Getting the mentions from webmention.io](#section4)
5. [Slicing and dicing the mentions](#section5)
6. [Displaying them with the post](#section6)
7. [Conclusion](#section6)
8. [References](#section7)

</div>

---

<section id='section1'></section>

## 1. Introduction

I had told myself that I wouldn't do this...but, seeing them on other people's sites changed my mind. Call it FOMO, call it a desire to be part of the cool kids club, call it whatever you want. I'm adding webmentions to my 11ty site.

The post that got me hooked was by [Cory Dransfeldt](https://coryd.dev/). It was [this one](https://coryd.dev/posts/2023/i-removed-tailwind-from-my-site/) where I saw the comments I had made on Mastodon about one of his posts. And since I'm on Mastodon and the mentions were sourced from there, it felt like a worthwhile endeavor.

I had recalled reading about them on various people's sites and it looked pretty complicated. In search of another way to get feedback, I had installed [gisqus](https://giscus.app/) on the [https://11tybundle.dev](https://11tybundle.dev) site. After several months, I had gotten a single comment and decided to scrap it.

I have to say that I was helped in this effort by the many bloggers who took this on and wrote about it. They're all right there in the [Webmentions category](https://11tybundle.dev/categories/webmentions/) on 11tybundle.dev. In other words, I stand on the shoulders of giants. They're listed individually in the [References](#section8) section at the end of this post.

<section id='section2'></section>

## 2. What are webmentions?

Webmention is an [open web standard](https://indieweb.org/Webmention) and a [W3C Recommendation](https://www.w3.org/TR/webmention/). The implementation of it that many of us are using is called [webmention.io](https://webmention.io/), developed by [Aaron Parecki](https://github.com/aaronpk/webmention.io).

The standard enables "conversations and interactions across the web, a powerful building block used for a growing distributed network of peer-to-peer comments, likes, reposts, and other responses across the web."

Hopefully, shortly after I publish this post and share it, you'll see some of those mentions at the bottom of this post. If you can't wait, [this post](/posts/adding-pagefind-to-my-eleventy-personal-site.md/#webmentions) already has some mentions.

<section id='section3'></section>

## 3. How do I connect my website to the webmention plumbing?

To get started, one must head over to [webmention.io](https://webmention.io/) and sign up for a free account with the url of your website. Once signed up, you add a line or two to your \<head\> tag and you're good to go. The service will start collecting mentions for you. You'll need to grab the API Key it provides as you'll need it to retrieve the mentions. You'll want to stash this in an environment variable so that it is not exposed to the public.

But how does this connect to my social network, Mastodon in my case? Well that's where another free service, [Bridgy](https://brid.gy/) comes in. Bridgy is a service that connects your website to your social network. You sign up for an account with Bridgy using your social network handle. Bridgy then "periodically checks social networks for responses to your posts and links to your website and sends them back to your site as webmentions."

<section id='section4'></section>

## 4. Getting the mentions from webmention.io

Since we're using [Eleventy](https://www.11ty.dev/), we've got a boatload of options for getting our mentions into our site.

I want to note here that I have opted to gather the mentions at build time. I've seen a handful of implementors that have fetched them client-side. As a proponent of minimizing how much javascript I use, I opted to do it at build time. If you're interested, [Max Böck describes it here](https://mxb.dev/blog/using-webmentions-on-static-sites/#h-client-side-rendering).

That said, given the dynamic nature of mention activity, I have set up a GitHub action that rebuilds my site every 4 hours to capture the intervening mentions. I won't into how to do that here, but you can find some guidance [here](https://www.voorhoede.nl/en/blog/scheduling-netlify-deploys-with-github-actions/) and [here](https://localghost.dev/blog/how-to-schedule-posts-in-eleventy/).

The other thing that I will not be covering here is how to send webmentions from your site to another. A service called [webmention.app](https://webmention.app/) provides this as a service. I may cover this in a future post.

If you're inclined to reach for a plugin, there's [eleventy-plugin-webmentions](https://github.com/CodeFoodPixels/eleventy-plugin-webmentions). As someone who likes to know how the sausage is made, I opted to roll "my own" implementation (again, standing on the shoulders of those aforementioned giants).

The [eleventy-fetch](https://www.11ty.dev/docs/plugins/fetch/) plugin comes in handy here as we're gathering some remote global data for use on our site.

So, in my \_data directory, I have a webmentions.js file that looks like this:

```js
// Fetch webmentions from webmention.io API
const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function () {
  const WEBMENTIONS_BOBM = process.env.WEBMENTION_IO_TOKEN;
  const url = `https://webmention.io/api/mentions.jf2?token=${WEBMENTIONS_BOBM}&per-page=1000`;
  const res = EleventyFetch(url, {
    duration: "1h",
    type: "json",
  });
  const webmentions = await res;
  return {
    mentions: webmentions.children,
  };
};
```

This will generate an array of json webmention data, with each item looking something like the following:

```json
{
  "type": "entry",
  "author": {
    "type": "card",
    "name": "Cassey Lottman",
    "photo": "https://webmention.io/avatar/cdn.masto.host/bb76d061fb429fb82c1d0e99721957cdb951615d224d3ef4c9fe2148e4b373f2.jpg",
    "url": "https://urbanists.social/@cassey"
  },
  "url": "https://urbanists.social/@cassey/111729029363397444",
  "published": "2024-01-10T01:21:31+00:00",
  "wm-received": "2024-01-10T01:36:46Z",
  "wm-id": 1765519,
  "wm-source": "https://brid.gy/comment/mastodon/@bobmonsour@indieweb.social/111728835329670247/111729029425672691",
  "wm-target": "https://www.bobmonsour.com/posts/adding-pagefind-to-my-eleventy-personal-site.md/",
  "wm-protocol": "webmention",
  "content": "<a href=\"https://indieweb.social/@bobmonsour\">@bobmonsour</a> this is a reply to your post, hi from mastodon",
  "in-reply-to": "https://www.bobmonsour.com/posts/adding-pagefind-to-my-eleventy-personal-site.md/",
  "wm-property": "in-reply-to",
  "wm-private": false
}
```

As you can see, there's a lot of good stuff to work with here. The `mentions` array is then available to us in our templates.

Among the most important items in the json are the `wm-target` and `wm-property` properties. The `wm-target` is the url of the page that the mention is for. The `wm-property` is the type of mention. We'll use these to filter the mentions for a particular page.

<section id='section5'></section>

## 5. Slicing and dicing the mentions

There are a variety of types of mentions, the wm-property. Here are the ones listed in the [webmention.io repo](https://github.com/aaronpk/webmention.io#find-links-of-a-specific-type-to-a-specific-page):

- in-reply-to
- like-of
- repost-of
- bookmark-of
- mention-of
- rsvp

The three that I'm interested in are `in-reply-to`, `like-of`, and `repost-of`. I'm not sure what `mention-of` is, but I think it relates to when another site mentions one of your blog posts. In a Mastodon context, in-reply-to is a reply to one of your posts, like-of is a like of one of your posts, and repost-of is a boost of one of your posts.

I've read through, or at least deeply skimmed (if that's a thing), [all of the blog posts about webmentions on the 11tybundle.dev site](https://11tybundle.dev/categories/webmentions/).

It was interesting to study the various coding patterns used to process the mentions. I'm not sure if I'm doing it the best way, but I'm doing it in a way that makes sense to me. It's an amalgamation of the various patterns I saw.

Note that for an experienced javascript developer, this is likely a pretty trivial exercise. But since I'm still learning, I have to admit that I had some struggles.

Ultimately, what you want to achieve in displaying the mentions for a particular page is to filter the mentions by the url of the page and then decide how you wish to group and sort the replies, likes, and reposts. In Eleventy parlance, this calls for a filter with an input of the page.url.

Here is what mine looks like:

```js
const sanitizeHTML = require("sanitize-html");
module.exports = function webmentionsByUrl(webmentions, url) {
  const allowedTypes = {
    likes: ["like-of"],
    reposts: ["repost-of"],
    comments: ["mention-of", "in-reply-to"],
  };

  const sanitize = (entry) => {
    if (entry.content && entry.content.html) {
      entry.content = sanitizeHTML(entry.content.html, {
        allowedTags: ["b", "i", "em", "strong", "a"],
      });
    }
    return entry;
  };

  const pageWebmentions = webmentions
    .filter(
      (mention) => mention["wm-target"] === "https://www.bobmonsour.com" + url
    )
    .sort((a, b) => new Date(b.published) - new Date(a.published))
    .map(sanitize);

  const likes = pageWebmentions
    .filter((mention) => allowedTypes.likes.includes(mention["wm-property"]))
    .filter((like) => like.author)
    .map((like) => like.author);

  const reposts = pageWebmentions
    .filter((mention) => allowedTypes.reposts.includes(mention["wm-property"]))
    .filter((repost) => repost.author)
    .map((repost) => repost.author);

  const comments = pageWebmentions
    .filter((mention) => allowedTypes.comments.includes(mention["wm-property"]))
    .filter((comment) => {
      const { author, published, content } = comment;
      return author && author.name && published && content;
    });

  const mentionCount = likes.length + reposts.length + comments.length;
  const data = { likes, reposts, comments, mentionCount };
  return data;
};
```

Similar to how I handle the global data for the 11tybundle.dev site, I like when the filter does a lot of processing and returns multiple usable pieces of data in a way that simplifies the template code.

So I now have 3 separate arrays of mentions, one for each type. I can then use these in my template to display them in whatever way I want. The reply array (or as I call them here, comments) is sorted in descending date order. For likes and reposts, the date is not relevant.

<section id='section6'></section>

## 6. Displaying them with the post

Now that we have the mentions pre-grouped by type, it's time to use them in a template that will display them at the bottom of each post.

So, to start, I added these few lines to the post template:

```jinja2{% raw %}
{% set mentions = webmentions.mentions | webmentionsByUrl(page.url) %}
{% if  mentions.mentionCount > 0 %}
  {% include 'partials/webmentions.njk' %}
{% endif %}{% endraw %}
```

Simple enough. And here's what the webmentions.njk partial looks like. It's pretty straightforward.

```jinja2{% raw %}
<div class="webmentions" id="webmentions">
  {% if mentions.comments %}
  <h3>Comments ({{ mentions.comments | length }})</h3>
  <div class="comments">
    {% for item in mentions.comments %}
      <div class="comment">
        <a href="{{ item.author.url }}" class="comment-author"><img src="{{ item.author.photo}}" class="mention-image" alt="photo of the author of one of the webmentions for this page"></a>
        <p class="comment-content">{{ item.content | safe }}</p>
        <p class="comment-date">{{ item.published | plainDate }}</p>
      </div>
    {% endfor %}
  </div>
  {% endif %}

  {% if mentions.likes %}
  <h3>Likes ({{ mentions.likes | length }})</h3>
  <div class="likes">
    {% for item in mentions.likes %}
      <a href="{{ item.url }}"><img src="{{ item.photo }}" class="mention-image" alt="photo of the author of one of the webmentions for this page"></a>
    {% endfor %}
  </div>
  {% endif %}

  {% if mentions.reposts %}
  <h3>Reposts ({{ mentions.reposts | length }})</h3>
  <div class="reposts">
    {% for item in mentions.reposts %}
      <a href="{{ item.url }}"><img src="{{ item.photo }}" class="mention-image" alt="photo of the author of one of the webmentions for this page"></a>
    {% endfor %}
  </div>
  {% endif %}
</div>{% endraw %}
```

<section id='section7'></section>

## 7. Conclusion

As is typical for me, while I was worried about what it would take to do this, I got it done and it seems to work pretty well. There may be some edge cases that I haven't considered, but I'll deal with those as they come up.

Needless to say, I'll be adding this post to those of the giants who made this all possible. While they're linked in the 11tybundle.dev site, I've added them below.

<section id='section8'></section>

## 8. References

### Blog Posts (in no particular order)

- [Webmentions in Eleventy](https://coryd.dev/posts/2023/webmentions-in-eleventy/) by [Cory Dransfeldt](https://coryd.dev/)
- [Using Webmentions in Eleventy](https://mxb.dev/blog/using-webmentions-on-static-sites/) by [Max Böck](https://mxb.dev/)
- [Adding Webmention Support to a Static Site](https://keithjgrant.com/posts/2019/02/adding-webmention-support-to-a-static-site/) by [Keith Grant](https://keithjgrant.com/)
- [No comment: Adding Webmentions to my site](https://codefoodpixels.com/blog/2021/03/15/no-comment-adding-webmentions-to-my-site/) by [Luke Bonaccorsi ](https://codefoodpixels.com/)
- [No Comment 2: The Webmentioning](https://codefoodpixels.com/blog/2022/06/28/no-comment-2-the-webmentioning/) by [Luke Bonaccorsi ](https://codefoodpixels.com/)
- [An In-Depth Tutorial of Webmentions + Eleventy](https://sia.codes/posts/webmentions-eleventy-in-depth/) by [Sia Karamalegos](https://sia.codes/)
- [Adding Webmentions to Your Site](https://rknight.me/blog/adding-webmentions-to-your-site/) by [Robb Knight](https://rknight.me/)
- [Additional Webmention Resources](https://rknight.me/blog/additional-webmention-resources/) by [Robb Knight](https://rknight.me/)
- [Webmentions in Eleventy](https://drhayes.io/blog/webmentions-in-11ty/) by [David Hayes](https://drhayes.io/)
- [Updating webmentions on a static site](https://nicolas-hoizey.com/articles/2023/02/05/updating-webmentions-on-a-static-site/) by [Nicolas Hoizey](https://nicolas-hoizey.com/)
- [eleventy-cache-webmentions](https://chrisburnell.com/eleventy-cache-webmentions/) by [Chris Burnell](https://chrisburnell.com/)
- [Adding webmentions to your static blog](https://janmonschke.com/adding-webmentions-to-your-static-blog/) by [Jan Monschke](https://janmonschke.com/)
- [Changing urls but keeping webmentions in Eleventy](https://bnijenhuis.nl/notes/changing-urls-but-keeping-webmentions-in-eleventy/) by [Bart Nijenhuis](https://bnijenhuis.nl/)
- [Webmention Setup for Eleventy](https://chrisburnell.com/article/webmention-eleventy-setup/) by [Chris Burnell](https://chrisburnell.com/)
- [Webmentions + Eleventy Talk](https://sia.codes/posts/webmentions-eleventy-talk/) by [Sia Karamalegos](https://sia.codes/)
- [Webmention Analytics](https://mxb.dev/blog/webmention-analytics/) by [Max Böck](https://mxb.dev/)
- [Webmentions: Joining the IndieWeb](https://darthmall.net/weblog/2021/webmentions/) by [Evan Sheehan](https://darthmall.net/)
- [Grow the IndieWeb with Webmentions](https://amberwilson.co.uk/blog/grow-the-indieweb-with-webmentions/) by [Amber Wilson](https://amberwilson.co.uk/)
- [Webmentions in three SSGs: Part 2](https://www.brycewray.com/posts/2020/04/webmentions-three-ssgs-2/) by [Bryce Wray](https://www.brycewray.com/)

### Services

- [webmention.io](https://github.com/aaronpk/webmention.io)
- [Bridgy](https://brid.gy/)

AND...all together now...Enjoy!

- [https://11tybundle.dev/categories/webmentions/](https://11tybundle.dev/categories/webmentions/)
