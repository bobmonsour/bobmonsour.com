---
title: From Airtable to Google Sheets with Some AI
date: 2023-10-17T00:00:00.000Z
tags:
  - 11ty
description: >-
  From paid to free, I've moved the 11tybundle.dev data from Airtable to Google
  Sheets.
keywords: Airtable, Apps Script, json, 11tybundle.dev
image:
  source: from-airtable-to-google-sheets.jpg
  alt: The top portion of the Google Apps script to export a Google Sheet to json.
  caption: A Google Apps script to export a sheet to json.
pageHasCode: true
rssid: e5e34ce7192a51081e92bacb7ba6ae04
---

[[toc]]

---

> _UPDATE (10-30-2023):_ I've abandoned this technique as it was, as they say, a fools errand. I have converted from this method to using the Google Sheets API to get the data at build time. Details can be found in [this recent post](/posts/scratch-that-use-google-sheets-api/).\_

## Introduction

I am the developer of the [11tybundle.dev](https://11tybundle.dev/) site. The site serves as a resource with the goal of helping the web development community make use of the static site generator known as [Eleventy, aka 11ty](https://www.11ty.dev/). The site contains blog posts, starter projects, and other resources. I'd fallen in love with Eleventy and you can find a lot of [reasons why](https://11tybundle.dev/categories/why-eleventy/) at the site.

Up until very recently, all of the data for the site was stored in an Airtable database. I was using the free tier which allow up to 1,000 records per database. As of this writing, there are over 750 blog posts, along with 23 starter projects featured on the site. These, along with various other ephemeral records in the site had brought me to the brink of the free tier. I am paying for enough subscriptions and didn't really want to incur another $20/month for the Airtable Team plan.

I had been anticipating this, but it seemed to have snuck up on me. I was just using Airtable as a glorified spreadsheet with API access. With Airtable, the API access returned a lovely array of json objects. I knew that I could easily get the data into a Google Sheet by downloading the Airtable data to a csv file and then uploading it to a sheet. The challenge then would be how to get the data out of the sheet. And that is what this post is all about.

Buckle up, webbies! It's a bit of a long ramble.

## Google Searching for Google Things

I had no doubt that there had to be a way to extract json data from a Google Sheet. So I proceeded to Google for the answer.

I found [this post](https://thenewstack.io/how-to-convert-google-spreadsheet-to-json-formatted-text/) that appeared to be the answer to my prayers. It was from May 2022, so it seemed recent enough to be usable.

It showed me how to make a Google Apps script and it even supplied a [GitHub gist](https://gist.githubusercontent.com/pamelafox/1878143/raw/6c23f71231ce1fa09be2d515f317ffe70e4b19aa/exportjson.js) with the code. I hate to admit it, but I didn't understand all the code and how it worked, but at first glance, it looked plausible.

Before I even tried to get the data out of the Google Sheet, I made a Google Form to capture new data that it could add to the sheet. This was similar to the setup I had with Airtable. It was even better because with the Google form, all of the categories are listed on the form, so it's harder for me to miss selecting a category. In the Airtable form, there was a popup that I had to scroll through to select categories.

## Did it Work? Kinda...

So I dove in and got it to work...kinda. It created an extension that would show up as a menu item in my Google Sheet. All I had to do was select it and it would process the sheet and display the resulting json in a popup window. I could copy the text, put it in a json file and give it a go.

To integrate it with the site, I had to place the json file in my \_data directory and replace the Airtable API access code with the path to the json file. Easy peasy, right? Not so fast.

First, while the Airtable API access gave me an array for each of the categories associated with each blog post, the export gave me a comma-separated list. Easy enough to fix with a little JavaScript to split the field, converting it into an array. One win for me. Yay!

Then we get to the point where I lost a couple of days. And I still do not understand why. When the export script encountered a blog post row that contained an apostrophe in the title field, it would output a broken link field (the next field in the row for that blog post). It would start the field, but leave the value part of the json key:value pair like this: "https:

Needless to say, broken json doesn't parse very well. The rest of the file was fine, but this one was certainly not.

If I removed that single apostrophe, the whole thing would work...even though there were other apostrophes in the titles of other blog posts.

Then I realized that this was the first blog post of all the records processed by the export script. So I figured it had to do more with it being the first, and not just the apostrophe. So I decided to get hacky and special case that particular item so that it would output the correct link. No dice. I was flummoxed for 2 days.

My worry then became one of new posts coming in and I'm halfway between Airtable and Google Sheets...where do I put the data? I'm sure as hell not going to duplicate it.

Still flummoxed, I had an idea.

## Enter ChatGPT (or Bard)

I was at my wits end. I had no idea what to do. I was about to give up and just pay for the Airtable Team plan. But I decided to give it one more shot. I decided to try to use ChatGPT to see if it could help me.

Here's the first prompt that I gave it:

> Create a Google Apps script that exports a single Google Sheet in JSON format with the following specifications. The first row of the sheet consists of headers that serve as keys for the JSON key:value pairs. Some of the values contain a single apostrophe and this should be handled appropriately. The resulting JSON should be displayed in a pop-up window over the sheet. And the the script should be available to run as a menu entry from the Google Sheet being exported.

Lo and behold, it replied with the following:

> Sure, Here's how you can do it:
>
> 1.  First, we'll set up the Google Apps Script to read the data from the Google Sheet and convert it to JSON format.
> 2.  We'll handle the values containing single apostrophes properly.
> 3.  We'll display the resulting JSON in a pop-up window using Google Apps Script's UI features.
> 4.  Finally, we'll add a menu entry so you can run the script directly from the Google Sheet.

Following that list, it told me exactly what to do and provided the code to do it. I was a bit blown away. I gave it a try and it (sorta) worked...and the code was a lot simpler than what I had gotten from that earlier blog post.

But, of course, it wasn't quite right...yet. First, I had to give it more guidance. So I gave it the following prompt:

> Please modify this so that empty cells do not generate corresponding JSON output.

And, poof, it gave me the updated code and it also (sorta) worked.

But we're not quite there yet. Recall that we have to deal with those comma-separated categories. So I gave it the following prompt:

> For the key value of Categories, which consists of one or more comma-separated items, the resulting JSON value for this key should be an array, with any spaces following the commas removed. Please update the code accordingly.

Another winner...but I was not done. I noticed that its notion of "handling apostrophe's properly" resulted in the code adding two backslashes before each apostrophe. I didn't want that. So I asked why it did that. And here's what it told me:

> Ah, I see the confusion. In the script I provided, we used the JavaScript string .replace(/'/g, "\\\\'") to escape single apostrophes. In the context of the JavaScript code, the string "\\\\" represents a single backslash, and "\\\'' represents an escaped apostrophe. However, when the string gets serialized into JSON format, the backslash itself needs to be escaped, resulting in two backslashes in the output. The solution here is to adjust the handling of apostrophes such that they are escaped only once during JSON serialization. We can achieve this by directly encoding the sheet data into JSON format without first escaping the apostrophes in JavaScript. Let me adjust the script for you:

(an aside: I had to add extra backslashes to the above quote to get it to display properly in markdown)

Another win. Yay!

Now I was curious, ChatGPT knows a lot. Given that Google Sheets is a Google thing, I wondered how Bard would respond to the same initial prompt. Sadly, I tried it twice and it timed out without generating a response both times. They've got work to do.

But I was not done with ChatGPT. In addition to the resulting json being presented in a copy'able pop-up window, I wanted it to be written to a file. So I asked it if it could write to my local file system. I honestly hoped that it could not. And sure enough, due to security constraints, it is unable to do that, but...but...but it CAN write a file to my Google Drive. So I gave it this, my final, prompt:

> Can you modify the code that you last shared with me to write the resulting JSON data to a file on my Google Drive in a pre-existing folder named 11ty? This would be in addition to displaying the resulting JSON in a pop up. If you can do this, the file written should have the name structured as allrecords-mmddyyhhmm.json where mm is the 2-digit form of the current month, dd is the 2-digit form of the current day, yy is the 2-digit form of the current year, hh is the 2-digit form of the current hour (in 24-hour format), and mm is the 2 digit form of the current minute.

And it did it. So now I have a version history of the sheet saved in a folder on my Google Drive.

I think this is pretty amazing...and on top of that, since the code it generated is simpler, I can actually understand it.

## A Workflow Tweak

As a result of this transition, my workflow will now require an extra step. When using Airtable, my workflow for adding content to the site looked like this:

- Fill out an Airtable form for the relevant, blog post, starter project, or other resource.

I arrange for Netlify to rebuild the site nightly, so new content automatically shows up the next day.

With the Google Sheet implementation, my workflow will look like this:

- Fill out the Google form
- Export the Google Sheet to json (once I think there's enough new content to warrant it)
- Replace my local global data file with the new json data
- Push the repo to GitHub (results in a Netlify rebuild)

With this setup, I can remove the nightly build as it doesn't add anything.

So while it's a tad more cumbersome, it's not too bad.

## A Couple of Other Wins with this Approach

One side effect of this new approach is that there are no more API accesses to retrieve the data at build time. And that means I don't have to worry about caching the data and it saves a little bit on build time both locally and on Netlify.

The second side effect is that it would be easier for me to open up the site to user submissions by exposing the Google Form (or some variation of it) on the site. I'm not sure if I'll do this, but this setup makes that a more palatable option.

## Conclusion

I'm fine with the tradeoffs that I made here and I learned a lot.

If you've gotten this far, thank you. I hope you've enjoyed this ramble. I'm still amazed at how well ChatGPT worked for me. I think it's very handy for small things like this.

## The Code

Here's the code to the Google Apps script that does the work of exporting a Google Sheet to json. I've added comments to explain what's going on.

```js
/* Used to export the data for the 11tybundle.dev site from a Google Sheet
   The export feature is available as an extension to the Google Sheet.
   The output is placed into a pop-up window at the end of execution.
   A time-stamped file of the json is also placed in a file on my Google Drive. */
function onOpen() {
	var ui = SpreadsheetApp.getUi();
	ui.createMenu("Export JSON").addItem("Export to JSON", "showJSON").addToUi();
}

function showJSON() {
	var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
	var data = sheet.getDataRange().getValues();
	var headers = data[0];

	var jsonData = [];
	for (var i = 1; i < data.length; i++) {
		var row = data[i];
		var obj = {};
		for (var j = 0; j < headers.length; j++) {
			if (row[j]) {
				var key = headers[j];
				var value = row[j].toString();
				if (key === "Categories") {
					value = value.split(",").map((item) => item.trim());
				}
				obj[key] = value;
			}
		}
		jsonData.push(obj);
	}

	var jsonString = JSON.stringify(jsonData, null, 2);
	displayPopup(jsonString);

	/* Save JSON to Google Drive */
	saveToDrive(jsonString);
}

function displayPopup(jsonString) {
	var htmlOutput = HtmlService.createHtmlOutput("<pre>" + jsonString + "</pre>")
		.setWidth(800)
		.setHeight(600);
	SpreadsheetApp.getUi().showModalDialog(htmlOutput, "Exported JSON");
}

function saveToDrive(data) {
	var mainFolderName = "11ty";
	var subFolderName = "allrecords history";

	var mainFolders = DriveApp.getFoldersByName(mainFolderName);
	var mainFolder;

	if (mainFolders.hasNext()) {
		mainFolder = mainFolders.next();
	} else {
		/* If the main folder not found, create it */
		mainFolder = DriveApp.createFolder(mainFolderName);
	}

	/* Check if the subfolder exists within the main folder */
	var subFolders = mainFolder.getFoldersByName(subFolderName);
	var subFolder;

	if (subFolders.hasNext()) {
		subFolder = subFolders.next();
	} else {
		/* If subfolder not found, create it inside the main folder */
		subFolder = mainFolder.createFolder(subFolderName);
	}

	/* Construct filename with current date and time */
	var date = new Date();
	var filename = Utilities.formatString(
		"allrecords-%02d%02d%02d%02d%02d.json",
		date.getMonth() + 1,
		date.getDate(),
		date.getFullYear() % 100,
		date.getHours(),
		date.getMinutes()
	);

	/* Create the file in the specific subfolder */
	subFolder.createFile(filename, data, MimeType.PLAIN_TEXT);
}
```