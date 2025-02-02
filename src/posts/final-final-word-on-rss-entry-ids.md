---
title: Ok, this is my 'final' final word on RSS entry IDs
description: I've been able to fully automate the process of creating, at initial post time, a unique and permanent ID for each RSS feed entry.
date: 2025-02-02
image:
  source: final-final-word-on-rss-entry-ids.jpg
  alt: Message that says 'Difficult roads lead to beautiful destinations'
  creditPerson: Nik
  creditLink: https://unsplash.com/@helloimnik
tags:
  - blogging
  - RSSness
pageHasCode: true
rssid: e02d5218021afbee54c7682f2eddbdb7
---

Let's just say that I was not happy with the manual process that I had been using to create the unique and permanent IDs for my RSS feed entries. There was friction as it required that I run a special node script every time I generated a post. So, here's how I made it fully automated. I just had to do it.

Here goes...

The process is based on things I had written previously and is based on [the tool that I built](https://github.com/bobmonsour/rssid#rssid-generating-permanent-and-unique-rss-entry-ids) that let me create them manually.

Once I learned ([as described here](<(/til/i-wanted-to-validate-the-presence-of-an-rssid-in-my-front-matter/)>)) that I could create an [11ty preprocessor](https://www.11ty.dev/docs/config-preprocessors/) that would alert me to the fact that I had not yet created an ID for a new post. In other words, that the front matter item named `rssid` was missing, I began to believe that there is no reason that I should not be able to add that ID at the time that I run the build process.

All that I would need to do is enhance the preprocessor to not only detect the lack of an `rssid` but also to create one if it was missing and add it to the template prior to its ultimate rendering. I also wanted to be able to write the `rssid` element to the front matter of the file itself such that it would never again be detected as missing.

I have now done that. I have also updated [the README in the repo](https://github.com/bobmonsour/rssid#rssid-generating-permanent-and-unique-rss-entry-ids) of the tool to note that this is now an automated process and to contain links to all of the blog posts that I've written on this topic. Here is that full list, in chronological order:

- [On RSS entry IDs](/til/on-rss-entry-ids/), _Jan 25, 2025_
- [Much more to come on RSS entry IDs](/til/much-more-to-come-on-rss-entry-ids/), _Jan 26, 2025_
- [Creating quasi-permanently unique entry IDs for RSS](/blog/creating-permanently-unique-entry-id-for-rss/), _Jan 27, 2025_
- [My last word on RSS entry IDs](/blog/even-more-on-rss-ids/), _Jan 30, 2025_
- [Prepare for a minor flood of RSS entries](/til/prepare-for-a-minor-flood-of-rss-entries/), _Jan 31, 2025_
- [I wanted to validate the presence of an rssid in my front matter](/til/i-wanted-to-validate-the-presence-of-an-rssid-in-my-front-matter/), _Feb 1, 2025_
- [Ok, this is my 'final' final word on RSS entry IDs](/blog/final-final-word-on-rss-entry-ids/), _Feb 2, 2025_ (this entry)

Needless to say, it's been a learning journey, assisted by the 11ty community on Discord. I'm grateful for the help and the ideas that I've received.

Here is what the ehanced preprocessor looks like:

```javascript
// Preprocess all posts, notes, and TILs, checking for the presence
// of an rssid item in the front matter; if none is presence, it is
// added to the data and written to the file. Thus, the rssid, which
// is a unique RSS entry ID is generated once at initial creation of
// the post, note, or TIL.
eleventyConfig.addPreprocessor("rssid", "njk,md", (data, content) => {
	const inputPath = data.page.inputPath;
	const dirs = ["/posts/", "/notes/", "/til/"];
	const containsDirs = dirs.some((word) => inputPath.includes(word));
	if (containsDirs && typeof data.rssid != "string") {
		data.rssid = addrssid(inputPath);
	}
});
```

The `addrssid` function is a function that generates the ID based on the MD5 hash of the filename of the post, note, or TIL. It is a function that looks like this:

```javascript
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import crypto from "crypto";

// Generate MD5 hash of a string (the filename and extension)
function generateMD5Hash(filePath) {
	const filename = path.basename(filePath);
	return crypto.createHash("md5").update(filename).digest("hex");
}

// Process the file based on the full file path
function addrssid(filePath) {
	const fileContent = fs.readFileSync(filePath, "utf-8");

	// Extract existing front matter
	const frontMatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n/);
	let frontMatter = {};
	let content = fileContent;

	if (frontMatterMatch) {
		frontMatter = yaml.load(frontMatterMatch[1], { schema: yaml.JSON_SCHEMA });
		content = fileContent.slice(frontMatterMatch[0].length);
	} else {
		console.error(`Error: No front matter found in file: ${filePath}`);
		return false;
	}

	// Generate an MD5 hash of the filename, including the extension
	const rssid = generateMD5Hash(filePath);
	const filename = path.basename(filePath);
	console.log(
		`Adding rssid to file: ${filePath} + md5 hash based on filename: " + ${filename}`
	);
	frontMatter.rssid = rssid;

	// Reconstruct the file content with updated front matter
	const newFrontMatter = yaml.dump(frontMatter, {
		schema: yaml.JSON_SCHEMA,
		lineWidth: -1,
	});
	const newFileContent = `---\n${newFrontMatter}---\n${content}`;
	fs.writeFileSync(filePath, newFileContent, "utf-8");
	return rssid; // Return the rssid to be added to the template
}

export default addrssid;
```

Finally, I've added a `utils` directory in my `_config` directory that contains the function, requiring that I add the following line to my Eleventy config:

```javascript
// utils
import addrssid from "./src/_config/utils/addrssid.js";
```

So this is the fourth post after writing that it was _"My last word on RSS entry IDs."_ Go figure.
