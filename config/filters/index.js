const { DateTime } = require("luxon");
const inspect = require("node:util").inspect;
const sanitizeHTML = require("sanitize-html");

// generate reading time for a post
const readingTime = (text) => {
	var content = new String(text);
	const speed = 240; // reading speed in words per minute

	// remove all html elements
	var re = /(&lt;.*?&gt;)|(<[^>]+>)/gi;
	var plain = content.replace(re, "");

	// replace all newlines and 's with spaces
	var plain = plain.replace(/\s+|'s/g, " ");

	// create array of all the words in the post & count them
	var words = plain.split(" ");
	var count = words.length;

	// calculate the reading time
	var readingTime = Math.round(count / speed);
	if (readingTime === 0) {
		return "Less than 1 minute to read";
	} else if (readingTime === 1) {
		return "1 minute to read";
	} else {
		return readingTime + " minutes to read";
	}
};

// format the post date
const formatPostDate = (date) => {
	return DateTime.fromJSDate(date, { zone: "utc" }).toLocaleString(
		DateTime.DATE_MED
	);
};

// get all of the post tags
const getAllTags = (collection) => {
	let tagSet = new Set();
	for (let item of collection) {
		(item.data.tags || []).forEach((tag) => tagSet.add(tag));
	}
	return Array.from(tagSet).sort();
};

// create a plain date from an ISO date (for webmentions)
const plainDate = (isoDate) => {
	let date = new Date(isoDate);
	let options = { year: "numeric", month: "long", day: "numeric" };
	let formattedDate = date.toLocaleDateString("en-US", options);
	return formattedDate;
};

// Determine whether or not to highlight current page in the nav
// if the link text appears within the page url, then do highlight
let lcLinkText = "";
const isCurrentPage = (linkText, pageUrl) => {
	lcLinkText = linkText.toLowerCase();
	if (
		lcLinkText == "blog" &&
		(pageUrl.includes("archive") || pageUrl.includes("posts"))
	) {
		return 'aria-current="page"';
	}
	if (lcLinkText === "microblog" && pageUrl.includes(lcLinkText)) {
		return 'aria-current="page"';
	}
	if (pageUrl.includes(lcLinkText)) {
		return 'aria-current="page"';
	}
};

module.exports = {
	readingTime,
	formatPostDate,
	getAllTags,
	plainDate,
	isCurrentPage,
};
