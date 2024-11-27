//
// Keep the `.eleventy.js` file clean and uncluttered.
// Most adjustments must be made in:
//  - `./config/filters/index.js`

// environment variable handling
require("dotenv").config();

// set up markdown
const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");
const markdownItOptions = {
	html: true,
	breaks: false,
};
const markdownLib = markdownIt(markdownItOptions).use(markdownItAttrs);

// module import filters
const {
	readingTime,
	formatPostDate,
	getAllTags,
	plainDate,
	isCurrentPage,
} = require("./config/filters/index.js");

// plugins
const postGraph = require("@rknightuk/eleventy-plugin-post-graph");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
	// generate the "posts" collection
	eleventyConfig.addCollection("posts", (collection) => {
		return [...collection.getFilteredByGlob("./src/posts/*.md")];
	});

	// generate the "microblog" collection
	eleventyConfig.addCollection("microblog", (collection) => {
		return [...collection.getFilteredByGlob("./src/microblog/*.md")];
	});

	// generate a combined "posts" and "microblog" collection
	eleventyConfig.addCollection("postsandmicroblog", (collection) => {
		return [
			...collection.getFilteredByGlob([
				"./src/posts/*.md",
				"./src/microblog/*.md",
			]),
		];
	});

	// config the bundle for CSS
	eleventyConfig.addBundle("css");
	eleventyConfig.addBundle("pageHasCode");

	// set markdown library
	eleventyConfig.setLibrary("md", markdownLib);

	// add filters
	eleventyConfig.addFilter("readingTime", readingTime);
	eleventyConfig.addFilter("formatPostDate", formatPostDate);
	eleventyConfig.addFilter("getAllTags", getAllTags);
	eleventyConfig.addFilter("plainDate", plainDate);
	eleventyConfig.addFilter("isCurrentPage", isCurrentPage);

	// add plugins
	eleventyConfig.addPlugin(postGraph, {
		sort: "desc",
		boxColor: "darkgrey",
		highlightColor: "red",
		textColor: "#fff",
	});
	eleventyConfig.addPlugin(syntaxHighlight);
	eleventyConfig.addPlugin(pluginRss);

	// Add the new eleventy image transform plugin
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		extensions: "html",
		outputDir: "/assets/img/",
		formats: ["webp", "jpeg"],
		widths: [300, 600, 900, 1200],
		defaultAttributes: {
			loading: "lazy",
			sizes: "100vw",
			decoding: "async",
		},
	});

	// turn off noisy eleventy output
	eleventyConfig.setQuietMode(true);

	// file and directory passthroughs
	[
		"src/assets/audio/",
		{ "src/assets/favicon/*": "/" },
		"src/assets/img/",
		"src/assets/js/",
		"src/robots.txt",
	].forEach((path) => eleventyConfig.addPassthroughCopy(path));

	return {
		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		dir: {
			input: "src",
			output: "_site",
			includes: "_includes",
			layouts: "_layouts",
			data: "_data",
		},
	};
};
