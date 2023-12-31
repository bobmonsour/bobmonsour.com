---
title: Scratch that...use the Google Sheets API
date: 2023-10-30
tags:
  - 11ty
description: Just generating a json file from Google Sheets was not good enough. I had to use the API.
keywords: Google Sheets, API, 11tybundle.dev
image:
  source: "scratch-that-use-google-sheets-api.png"
  alt: "Google sheet icon on the left, json output on the right"
  caption: "From Google Sheet to JSON via the API"
pageHasCode: true
---

## Table of Contents

<div class='toc'>

1. [Introduction](#section1)
2. [First, a rathole only a mother could love](#section2)
3. [Yes, I relied on ChatGPT again](#section3)
4. [I've got the code, but I need to authenticate](#section4)
5. [Picking away at build errors](#section5)
6. [But something else broke](#section6)
7. [It was time for an "Oh shit!" moment](#section7)
8. [The new, and even better, workflow](#section7)
9. [Conclusion](#section8)
10. [The Code for the Google Sheets API Access](#section9)

</div>

---

<section id='section1'></section>

## 1. Introduction

In [my last post](/posts/from-airtable-to-google-sheets/), I went to great lengths to justify a half-assed approach to getting data out of a Google Sheet. I was using a Google Apps script to export the data to json. It was a bit of a hack, but it worked. I hung my justification on the fact that I wanted to have the exact same form of output that I was getting through the Airtable API.

In that post I described [the resulting workflow](/posts/from-airtable-to-google-sheets/#section5) like this: "while it's a tad more cumbersome, it's not too bad."

I'll be blunt...it sucked.

I soon longed for the days when I could fill out an Airtable form that would populate the database and a nightly rebuild would place the new content on the site.

I was not happy.

A couple of people whose technical judgement I respect suggested that I use the Google Sheets API. I was reluctant to deal with the perceived complexity of the authentication process as well as having yet another API to learn.

I've got this mental hangup of having to dive into new coding skills and paradigms. For some reason, I keep asking myself if this something that I really want to tackle? Am I up for it? I tend to get riddled with self-doubt. I don't know why that happens as I seem to have managed to build some stuff that works. As it turned out, it was not as difficult to do as I had imagined. And I learned a lot in the process. Here's the story of how that went.

<section id='section2'></section>

## 2. First, a rathole only a mother could love

Similar to where I went in the last post, I started Googling for blog posts and videos that showed how others had approached the problem. I found some interesting things. Yet many of them seemed to rely on various hacks based on assumptions that felt tenuous. I won't go into detail here only to say that one of them in particular relied on creating a URL for a sheet that returned a form of json, but with some cruft around it at the start and the end. The solution was to "trim" that cruft.

First, having done embedded systems development for a number of years early in my career, I knew how things usually went when you made some detailed assumptions about the context of the system in which you're working.

I just smelled a little too fishy. I examined a few of these "solutions" and realized that I wanted to do it the "right way" and that meant using the API as intended.

<section id='section3'></section>

## 3. Yes, I relied on ChatGPT again

So, this trip for a blog or video solution didn't last that long and I didn't attempt to use any of those techniques. So, as I did last time, I went to ChatGPT and gave it a prompt. I'm finding that if you can be clear in the description of what you want, it will give you a good answer.

It wasn't too long, going back and forth a bit and providing more specifics, that I had what looked like code that matched what the API docs called for. And I note this here...it's one thing to use ChatGPT to ask it for code, but it's very important to understand what it's giving you. I've found that it's not always correct. It's a good starting point, but you need to understand what it's giving you. At the end of this post, I provide the resulting code with my own mods, mostly to comment it and move the sensitive API credentials out of the source and into environment variables (more on those environment variables later).

<section id='section4'></section>

## 4. I've got the code, but I need to authenticate

Fortunately, when I had once made use of Google's Firestore database, I had gone down the path of having to authenticate with Google (I had written a post about that fateful journey in a [blog post](https://11tybundle.dev/blog/11ty-bundle-9/) on the [11tyBundle.dev site](https://11tybundle.dev/)). I had to create a service account and download a json file that contained the credentials.

I have never liked this part of the process as there are bunch of things that you have to do in the Google Cloud console. And from my perspective, they are not as well described as I would like.

All that said, I got it done and I downloaded the necessary credentials file and referenced it in the code.

It was time to get this thing working.

<section id='section5'></section>

## 5. Picking away at build errors

I spent what seemed like an eternity trying to solve build errors. If you recall from the last post, the way that I integrated the json file that I had extracted from the Google Sheet was to place the file in my global data directory and then reference it in the javascript data file that processed it into the various data sets for use in the site's templates.

My biggest headache in getting the build to work (and here is where my javascript skills need help) was referencing the data returned from the Google Sheets API. I had put the API access code in another file in the global data directory. It took me a while to realize that I had to use 'await' when referencing the function exposed in the data fetching file, rather just using require as I did to reference the json file when it was local.

Once I did that, things started working. I was both happy and amazed. The data looked exactly like the data that I had been exporting from the sheet which was also identical to what I had gotten from the Airtable API.

<section id='section6'></section>

## 6. But something else broke

As I mentioned in [Issue 20 of the 11ty Bundle blog](https://11tybundle.dev/blog/11ty-bundle-20/), I had started producing static json files for some of the [categories in the bundle](https://11tybundle.dev/categories/) so that Zach could add those category posts in some of the [11ty docs](https://www.11ty.dev/docs/) pages as items "From the Community." Here's an example [in the CMS section of the docs site](https://www.11ty.dev/docs/cms/#from-the-community).

I had built that capability using a javascript template using a render function. Just like the challenge I wrote about above, I was no longer referencing a static json file sitting in the global data directory, which I could access with a require statement. I was now referencing a function that returned the data from the Google Sheets API. As it turns out, referencing the data with a require statement wasn't really the best way to go. What I should have done, and what ultimately worked for the API access, was to simply reference the data returned from the function that processed the resulting API data. Thankfully, @Aankhen, from the Eleventy Discord, set me straight and with some back and forth, I got it working. As he showed me, everything in the global data area is available using the "data" object. From there, I could add what I needed, in this case data.bundledata.firehose, a json version of all of the blog posts on the site.

I think at this point, I've managed to reach the "too much information" (TMI) stage of the story, so I'll stop this part here. I'm going to do a separate post on how the code that creates those json files works.

<section id='section7'></section>

## 7. It was time for an "Oh shit!" moment

I told you that I'd come back with something about environment variables.

The way that the Google Sheets API authentication works requires that you download a json file of the credentials. When first working with the file, it's simple to merely reference them in a javascript function by using a require statement and placing the json file alongside the file containing the function.

As I do this, I'm saving changes to the local git repository along the way as things improve. Note that I am doing all of this work on a feature branch so I don't break what I know already works.

And along these lines, while I have managed to get this working locally, I am having qualms as to whether this will work when deployed on Netlify. So, naturally, I set up Netlify to do a deploy of a particular branch.

In order to do this, I have to push this local branch to GitHub to trigger the deploy. I take that step, I examine the deploy branch and everything looks good.

So I merge this branch into main and push the new main to Github.

Within minutes, I am greeted with two email messages. One is from an email address domain of google-cloud-compliance.com with the subject of "Potentially Compromised Credentials." The other is from a place called GitGuardian with the subject of "Google Cloud Keys exposed on GitHub."

Needless to say, that was my "Oh Shit!" moment.

Before all of this, I really did know that I had to put those credentials into environment variables so that they would not be exposed anywhere. I had already learned how to do this with the Airtable credentials. What I had failed to realize was that pushing the branch to GitHub before doing that was a big fat no no.

I clicked through the link in the GitGuardian email and it seemed that the only real way to recover from this involved five steps: (1) revoke the credentials from the Google Cloud Platform, (2) create a new set and download the associated json file, (3) create the necessary environment variables in my .env file from those in the json file, (4) add the environment variables to the site configuration on Netlify, and (5) delete the feature branch that was the source of the exposure.

I hurriedly did all of this at a record pace and everything is just fine now...just fine.

<section id='section8'></section>

## 8. The new, and even better, workflow

I then turned my attention to the way that I get data into the spreadsheet. I had been using a Google form to enter the data. The only niggle that I had with the form was that it had all of the fields for all of the four different types of entries (posts, sites, starters, and releases).

Not all of the types need all of the fields. In particular, the post type is the only one that requires the Categories field. I decided to create a form for each of the type where the Type field would be pre-populated with the type for that entry. I would then put links to each of these forms in a folder in my browser bookmarks toolbar, making them easily accessible when new content showed up.

This caused a minor problem. Even though I could specify that each form would place its responses into the same spreadsheet file, they each landed in a different sheet within the spreadsheet file. Before this, I could easily copy the form responses from the sheet that held all of them, of various types, into the main sheet of records and I had a Google Apps Script that did exactly this. But now I had four sheets that needed to be copied.

So, back to ChatGPT I went. Here's the exact prompt that I gave it:

> I have a Google Sheet and I use 4 different forms to populate it with content. There is a main sheet within the overall sheet called "All Records." Each form results in entries going into 4 different tabs within the overall sheet. They are named "Posts", "Sites", "Starters", and "Releases". The only one of the four that has the full set of columns as the main "All Records" sheet is "Posts." The others have a variable subset of the columns, but all use consistent header names. I'd like to have a Google Apps Script that will be accessible in the overall sheet menu that does the following. It should copy the entries from each of the four form response sheets into the main "All Records" sheet, matching the data according to the headers of each of the form response sheets. I would like a second script, also accessible from the same menu that would delete all of the responses in each of the 4 response sheets. Please do what you do.

At luck would have it, my wonderful wife said "dinner is ready" just as hit enter on the prompt.

After dinner, I returned to find that ChatGPT broke down the task, listing the steps needed and then provided a Google Apps Script to do what I had asked. I had to make one tweak to the script. The column that represents the Categories of a blog post was being returned as a string of comma-separated values and I needed it to be an array of those values.

I looked it over, held my breath, and replaced the previous script that I had been using with the new one.

I entered data into each of the forms as test data. I reloaded the spreadsheet, and like magic, it had made available the two menu items I had asked for. I ran the one that copies the form responses from each of the four sheets to the main sheet...and voila, it did it. I then ran the one that deletes all of the response entries in each of the response sheets, and again, success!

_[NOTE TO SELF:] Next time you do something like this, PLEASE make a copy of the main sheet beforehand. You never know what can happen._

Needless to say, I was pleased. And now with this workflow, it's easier to enter new content, and on each site build, the sheet is accessed through an API.

I had only one thing left to do, reinstate a method for Netlify to do a nightly build of the site. I had previously used the [Quick Tip in the Eleventy docs](https://www.11ty.dev/docs/quicktips/netlify-ifttt/) that made use of IFTTT. I had heard that several Eleventy developers make use of GitHub Actions to accomplish this. I looked for one of those and spun it up. I awoke this morning to the first of what I hope will be many successful nightly builds.

<section id='section9'></section>

## 9. Conclusion

I think that one of the things that will help bring an end of those periods of being "riddled with self-doubt" is writing about these experiences.

I really find it quite gratifying to get these things working as I really do enjoy building things like this.

Speaking of building things, I recently built a site for a friend of a friend. He builds custom acoustic guitars. It's a minimal single-page site, but I'm quite pleased with how it turned out. You can see it at [https://www.jdadamsguitars.com/](https://www.jdadamsguitars.com/). The friend that introduced us also paints and you can find his work at [https://www.marcmarvinfineart.com/](https://www.marcmarvinfineart.com/). Marc did the painting that is the hero image on the guitar site.

<section id='section19'></section>

## 10. The Code for the Google Sheets API access

```js
const { google } = require("googleapis");
const sheets = google.sheets("v4");

module.exports = async function () {
  // Load client secrets from the downloaded service account key file.
  // Items from the file were placed into a .env file.
  const key = {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_x509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_x509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN,
    spreadsheetId: process.env.SPREADSHEET_ID,
    spreadsheetRange: process.env.SPREADSHEET_RANGE,
  };

  const jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  );

  await jwtClient.authorize();

  // Identify the specific spreadsheet
  // The range is the sheet name within the spreadsheet
  const spreadsheetId = key.spreadsheetId;
  const range = key.spreadsheetRange;

  const request = {
    spreadsheetId: spreadsheetId,
    range: range,
    auth: jwtClient,
  };

  try {
    const response = await sheets.spreadsheets.values.get(request);
    const rows = response.data.values;
    const headers = rows[0];

    let jsonData = [];
    for (let i = 1; i < rows.length; i++) {
      let row = rows[i];
      let obj = {};
      for (let j = 0; j < headers.length; j++) {
        // Exclude empty cells (some item types don't have all fields)
        if (row[j]) {
          var itemKey = headers[j];
          var itemValue = row[j].toString();
          // Convert string of comma-separated values to an array
          if (itemKey === "Categories") {
            itemValue = itemValue.split(",").map((item) => item.trim());
          }
          obj[itemKey] = itemValue;
        }
      }
      jsonData.push(obj);
    }
    return jsonData;
  } catch (err) {
    console.error("API request encountered an error:", err);
  }
};
```
