---
title: How I've been using AI
description: I've been using AI quite a bit this year. Here's what I've managed to do.
date: 2026-04-23
tags:
  - 11ty
  - politics
  - learned
image:
  source: how-ive-been-using-ai.png
  alt: How I've been using AI
draft: true
rssid: 6952e24d362da9d7055bc2e7e08fe1a4
---

[[toc]]

## Introduction

There was a knock at the door earlier this year. It was a guy named Claude with an odd last name of Code. He said he was here to help. I wasn't so sure.

I had one bad experience that I'll describe below, but then learned of new tooling that improved the results I was getting.

I'd also been thinking about a redesign of this website for some time. The actual inspiration for it came from a strange place. Some time last fall, I was on my phone reading a blog post and it gave me this nice feeling, based on the background color, font selection, line spacing, etc. that struck me and I thought right at that moment that I would really like for my site to feel like that. It was months before I got around to it.

I decided to talk to this Claude guy to see if he could help.

But first, let me dive into how I stumbled with AI before finding my feet. I'll also describe several projects that I've built using Claude Code.

As a side note, I've also just added a new section to this site, called [Projects](/projects) that showcases many of the sites that I've built with Eleventy and other tools.

## Wouldn't it be nice if...

I had this idea. The [11ty Bundle site](https://11tybundle.dev) has all this data stored in a big json file, blog posts, sites, and releases. Wouldn't it be nice to have a dashboard of "insights" about what's there? Sure!

So I create a new project folder and began to write a spec, in markdown, for what I wanted. I then fired up Claude and pointed it to my spec. It asked me a few questions and proceeded to generate an set of data and an html file of the dashboard. It looked pretty good at first blush.

Next, I worked to integrate it as its own page on the 11ty Bundle site. But I had an issue, the CSS for the file was its own thing and not related to the excellent redesign work that I had recently completed with [Damian Walsh](https://damianwalsh.co.uk/). Somehow, I managed to shoehorn it into place. On top of that, the html that it generated was a bit of a mess and not at all consistent with the work that Damian and I had carefully crafted during the redesign process.

My eyes were opened to all of this after I shared this new "feature" with Damian. He exposed the flaws in what was built by AI. At first, I was troubled, as I thought this was a really cool thing and it only took a short time to implement.

It took a few days and then it dawned on me that I was introducing significant technical debt where I certainly did not want any.

After reflecting on this, I manage to re-architect the html to be comparable in structure to what Damian and I had built. And an unsuprising result was that doing the same to the CSS was very straightforward. The final result is something that retains design consistency with the rest of the project.

In case you're interested, [here is the resulting Insights page](https://11tybundle.dev/insights/).


## Starting on a redesign of this site

Having learned my lesson via 'prompting with great abandon,' I wanted to be certain to constrain Claude as I know he has a lot of ammo, some of which I did not want to be on the receiving end of.

Since my home page has its own unique layout, other than the header/nav and the footer, I decided to take that html along with the full set of CSS files that style the entire site and have a conversation with this Claude guy.

I made it clear that it was vital to retain the design system elements that I already had created for the current site. Specifically, the use of basic element styling, and the use of responsive type and spacing were very important to me. I wanted to be able to recognize whatever changes were made to the CSS that I had written by hand.

On the 'basic element styling,' this was something that I had used to good effect when I did the last redesign of the site, [which I wrote about here]().

## Let's start with colors

The site that inspired me to pursue the redesign was green. Don't ask what sort of green, but it was green with black, or near black text.

I decided to take the home page HTML and all the CSS files and put them in a separate folder named 'gfp' for [Green Flourescent Protein](https://en.wikipedia.org/wiki/Green_fluorescent_protein), as that is what my head came up with when thinking about the green that I was after...not that I was sure that was the green I wanted.

Anyway, I started playing with page background colors. I knew that I wanted to introduce a light/dark mode setting capability on the site, so I needed two colors that would work well in those contexts.

I started by asking Claude to offer several choices of background colors for light and dark modes, focusing on a dark enough green for dark mode, but one that could be lightened sufficiently to use for light mode.

It wasn't too long that I bailed on this green-washing experiment as I could not recreate the feeling that I was after. From there, I went toward blues as blue is my favorite color (me and billions of other people). I finally found a dark blue variation that I liked, but was challenged to find the right light version. One of the features that I had Claude implement was a simple drop-down "history" of all of the color attempts that I made while undertaking this search. You can see it in the upper left of this work-in-progress version of the home page.

![work in progress with a dropdown for color selection](/assets/img/color-selection-dropdown.png)

## Other home page design tweaks

I had no intention of altering the basic content of the home page. I merely wanted a cleaner layout that felt less cluttered and a bit softer.

I proceeded to get Claude to tweak the home page elements into the place where I wanted them.

At that point, I was left with a question. Do I take the updated CSS and make the needed adjustments to integrate it across the remaining pages of the site...or do I ask Claude to do this in a way that preserves maintainability by me.

To be frank here, I was not looking forward to the drudgery (don't shoot me for using that word) of slogging through the CSS and ensuring that all of the other pages would retain their fidelity in keeping with what I had accomplished on the home page.

## Enter Superpowers

As it happens, I've joined a Discourse (not Discord) forum of retired developers and entrepreneurs who were using Claude to do new things. One of the members described a Claude Code plugin called [Superpowers](https://github.com/obra/superpowers), created by [Jesse Vincent](https://blog.fsck.com/). It has come a long way since I began using it. Here's a [post about a more version](https://blog.fsck.com/2026/03/09/superpowers-5/). And here's a piece by [Simon Willison](https://simonwillison.net/) about [how he is using it](https://simonwillison.net/2025/Oct/10/superpowers/).

Superpowers contains a dozen (perhaps more) skills that support a robust development process, from brainstorming an idea through generation of a specification, approved by the user, to the generation of an implementation plan, followed by a validation step that the implementation conforms to the spec.

I was intrigued, started a brainstorming session, described what I wanted to achieve. The brainstorming session results in a lot of back and forth clarifying questions to reduce gaps in understanding.

It generated a spec, which I reviewed and edited (all in a markdown file), and proceeded to generate an implementation plan, which I also reviewed and edited.

Once those steps were done, I told it to go ahead. Note that all of this is done on a feature branch by default so it is completely reversible.

The whole process felt thoughtful and I like that specs and plans were there for me to review, edit, and approve before any implementation would proceed.

In my opinion, this is one area where things can go wrong with AI in general. Proper use of AI in software development and design still requires planning. AI can support those planning and specification efforts, but wihtout them, I believe it's unreasonable to expect a good result.

## A positive result

I was happy with the result and had to do minimal cleanup. Along the way, I also had it add light/dark mode capability, requesting that it model it after the technique used on the 11ty Bundle site.

I also took the step of asking it to use [Font Awesome](https://fontawesome.com/) icons for the light/dark mode as well as for the social media links at the footer of each page. I am very happy with the results of that as well.

## I wasn't done with AI yet

With the redesign in place, I began to get impulsive ideas of what I could build. Having been impressed with the capability of Superpowers.

## I was watching the State of the Union

My wife wanted nothing to do with it, but I was sitting in my office watching President Trump deliver the state of the union address. He was blabbering on about voter ID and I was having a hard time swallowing what he was selling.

I fired up Claude Code and, over the next several hours, generated the start of a website that provides all of the voter registration and voting requirements for all 50 states plus Washington DC. You can find the result at [usvoting.info](https://usvoting.info).

![screenshot of the US voting info site](/assets/img/usvoting-info.png)

As a result of using Superpowers on this project, a "research" skill was created. I run it periodically and it examines what is currently on the site and compare that with what seems to be ever-changing legislation in many states. The skill then updates the site content, all of which is stored in a json file. The skill also scours local news sources to identify legislative efforts or other changes. Each of these new updates are noted in per-state change logs on the site as well as a global change log. News items are added to each sites page each time I run the skill, the links to which are also stored in a state-oriented json file. Once the research skill is run, I run the build process (oddly, it's built with Eleventy) and push the site to its Cloudflare Worker home.

From the start of this process on the night of the state of the union address to the first instance of site reaching its Cloudflare Workers platform home, it was just a few days.

## IKEA makes better cabinets

Sadly, I follow the national news and I like to be kept abreast of what our government is saying. I had reached a point where it seemed that, to a person, each and every cabinet member in the administration would lie without a second thought. And if it wasn't a lie, it was an amazingly misleading thing that they were putting forward.

I had had enough. Thus was born [clown-cabinet.com](https://clown-cabinet.com).

![screenshot of the clown cabinet site](/assets/img/clown-cabinet-com.png)

Again, using Superpowers, a research skill was created (that I can run periodically) to capture the latest of the cabinet members' inane pronouncements.

And, like usvoting.info, this runs on the Cloudflare Workers platform. This project also just took a few days to get up and running.

## A custom CMS for the 11ty bundle

I had managed several iterations of data stores for the data that drives the [11ty Bundle site](https://11tybundle.dev). At first, it was in an Airtable database and I used its API at build time to retrieve it. Next it was in a Google Sheet. [I wrote about using the Google Sheets API](/blog/scratch-that-use-google-sheets-api/). I was using ChatGPT back then to get some help with this. Next was to simply have a local json file. Airtable provided a form for me to input data, and Google Sheets provided a few forms for me to input data. Once it was a local json file, I needed to create a set of CLI scripts to manage the data. [I wrote about that too](https://bobmonsour.com/blog/node-cli-of-my-dreams/).

Needless to say, I occasionally ran into cases that the CLI scripts didn't handle and I ended up editing the json files directly in VS Code. Not fun, yet time consuming...a bad combination.

So, in February, I decided to enlist Claude Code to build a custom CMS. But that's not how it started. One of the other aspects of managing the 11ty Bundle was posting each issue on Mastodon Bluesky, and the Eleventy Discord server. So, what ultimately became a full CMS for the 11ty Bundle json file started out as a tool to post to multiple social sites with a single entry.

I did this prior to my discovery of the Superpowers plugin. So all of this was driven by me writing markdown files of specs that I would feed into Claude Code. I would add a single feature at a time, each one subsuming what had previously been done with various javascript functions.

The resulting tool is built using Flask, a python-based framework for building web apps. This is a local-only app that I can summon with just a few keystrokes. I call it Socially Bundled and here is a screen capture of a portion of its functionality.

This has saved me an immense amount of time in running the 11ty Bundle site and for that, I am exceedlingly grateful.

![screenshot of the Socially Bundled app](/assets/img/socially-bundled.png)

## Conclusion

I'd been meaning to write this for the last several weeks, but my time and mind have been consumed with preparing for a talk that I'm giving on April 25th in Petaluma at [North Bay Python](https://northbaypython.org/).

Anyway, I've had some bumps along with way with using AI. But I have also found significant value in its use, when used properly.

I fully understand and appreciate the concerns of many, including the energy and environment impacts. I believe that these will be solved. The future is indeed uncertain around this transformational technology. And, like the internet itself, it will find uses to improve human lives as well as harm human lives.

Our world is incredibly uncertain right now, with AI being just one of the many [spinning plates](https://en.wikipedia.org/wiki/Plate_spinning) atop the sticks.

[Saadallah Wannous](https://en.wikipedia.org/wiki/Saadallah_Wannous), a Syrian playwright, writer and editor on Arabic theater, has said:

_"We are condemned to hope._"

[Hiba Mohammad writes beautifully about what it means.](https://www.enghibamohammad.com/we-are-condemned-to-hope/)

Quoting her from that piece here:

_"Wannous said it at a time when questions were larger than answers, and betrayal heavier than language itself. For him, hope was not a promise of salvation, but a form of resistance. To hope does not mean you are naïve; it means you have decided not to hand over the keys of your soul to ruin."_
