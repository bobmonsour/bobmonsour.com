// environment variable handling
import "dotenv/config";

// utils
import addRSSid from "./src/_config/utils/addRSSid.js";

// filters
import filters from "./src/_config/filters/index.js";

// plugins
import postGraph from "@rknightuk/eleventy-plugin-post-graph";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginRss from "@11ty/eleventy-plugin-rss";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

// set up the markdown-it library
import markdownIt from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";
import markdownItAnchor from "markdown-it-anchor";
import markdownItToc from "markdown-it-table-of-contents";
const markdownItOptions = {
	html: true,
	breaks: false,
};
const markdownItAnchorOptions = {
	level: [2],
};
const markdownItTocOptions = {
	includeLevel: [2],
	containerHeaderHtml: "<h1>Table of Contents</h1>",
	listType: "ul",
};
const markdownLib = markdownIt(markdownItOptions)
	.use(markdownItAttrs)
	.use(markdownItAnchor, markdownItAnchorOptions)
	.use(markdownItToc, markdownItTocOptions);

export default function (eleventyConfig) {
	// Passthrough copy for static assets
	[
		"src/assets/audio/",
		{ "src/assets/favicon/*": "/" },
		"src/assets/css/",
		"src/assets/img/",
		"src/assets/js/",
		"src/robots.txt",
		"src/_redirects",
	].forEach((path) => eleventyConfig.addPassthroughCopy(path));

	// Generate four collections
	//	- posts, notes, tils, and a combined collection of those two
	// generate the "posts" collection
	eleventyConfig.addCollection("posts", (collection) => {
		return [...collection.getFilteredByGlob("./src/posts/*.md")];
	});
	// generate the "notes" collection
	eleventyConfig.addCollection("notes", (collection) => {
		return [...collection.getFilteredByGlob("./src/notes/*.md")];
	});
	// generate the "til" collection
	eleventyConfig.addCollection("til", (collection) => {
		return [...collection.getFilteredByGlob("./src/til/*.md")];
	});
	// generate a combined "posts", "notes", and "til" collection
	eleventyConfig.addCollection("postsnotestils", (collection) => {
		return [
			...collection.getFilteredByGlob([
				"./src/posts/*.md",
				"./src/notes/*.md",
				"./src/til/*.md",
			]),
		];
	});

	// Add local filters
	eleventyConfig.addPlugin(filters);

	// Add & configure external plugins
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		extensions: "html",
		outputDir: "/assets/img/",
		cacheOptions: {
			duration: "*",
			directory: ".cache",
			removeUrlQueryParams: false,
		},
		formats: ["webp", "jpeg"],
		widths: [300, 600, 900, 1200],
		defaultAttributes: {
			loading: "lazy",
			sizes: "100vw",
			decoding: "async",
		},
	});
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(postGraph, {
		sort: "desc",
		boxColor: "darkgrey",
		highlightColor: "red",
		textColor: "#fff",
	});
	eleventyConfig.addPlugin(syntaxHighlight);

	// Config the bundle for CSS
	eleventyConfig.addBundle("css");
	// eleventyConfig.addBundle("pageHasCode");

	// Set markdown library
	eleventyConfig.setLibrary("md", markdownLib);

	eleventyConfig.setQuietMode(true);

	eleventyConfig.addPreprocessor("rssid", "njk,md", (data, content) => {
		const inputPath = data.page.inputPath;
		const dirs = ["/posts/", "/notes/", "/til/"];
		const containsDirs = dirs.some((word) => inputPath.includes(word));
		if (containsDirs && typeof data.rssid != "string") {
			console.error(
				"\x1b[31m%s\x1b[0m",
				"ERROR: missing rssid in file " + data.page.inputPath
			);
			console.log(
				"\x1b[31m%s\x1b[0m",
				"Run the command: rssid -a -f=" + data.page.inputPath
			);
			process.exit(1);
		}
	});

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
}
