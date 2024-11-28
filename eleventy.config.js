// environment variable handling
import "dotenv/config";

// filters
import filters from "./src/_config/filters/index.js";

// plugins
import postGraph from "@rknightuk/eleventy-plugin-post-graph";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginRss from "@11ty/eleventy-plugin-rss";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

// set up markdown
import markdownIt from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";
const markdownItOptions = {
	html: true,
	breaks: false,
};
const markdownLib = markdownIt(markdownItOptions).use(markdownItAttrs);

export default function (eleventyConfig) {
	// Passthrough copy for static assets
	[
		"src/assets/audio/",
		{ "src/assets/favicon/*": "/" },
		"src/assets/img/",
		"src/assets/js/",
		"src/robots.txt",
	].forEach((path) => eleventyConfig.addPassthroughCopy(path));

	// Generate three collections
	//	- posts, microblog posts, and a combined collection of those two
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

	// Add local filters
	eleventyConfig.addPlugin(filters);

	// Add & configure external plugins
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
