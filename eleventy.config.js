//
// Keep the `.eleventy.js` file clean and uncluttered.
// Most adjustments must be made in:
//  - `./config/filters/index.js`
//  - `./config/shortcodes/index.js`

// environment variable handling
require("dotenv").config();

// module import filters
const {
	readingTime,
	formatPostDate,
	getAllTags,
	plainDate,
} = require("./config/filters/index.js");

// module import shortcodes
const { imageShortcode, year } = require("./config/shortcodes/index.js");

// plugins
const postGraph = require("@rknightuk/eleventy-plugin-post-graph");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const bundlerPlugin = require("@11ty/eleventy-plugin-bundle");
const postcss = require("postcss");
const postcssMinify = require("postcss-minify");

module.exports = function (eleventyConfig) {
	// generate the "posts" collection
	eleventyConfig.addCollection("posts", (collection) => {
		return [...collection.getFilteredByGlob("./src/posts/*.md")];
	});

	// generate the "microblog" collection
	eleventyConfig.addCollection("microblog", (collection) => {
		return [...collection.getFilteredByGlob("./src/microblog/*.md")];
	});

	// add filters
	eleventyConfig.addFilter("readingTime", readingTime);
	eleventyConfig.addFilter("formatPostDate", formatPostDate);
	eleventyConfig.addFilter("getAllTags", getAllTags);
	eleventyConfig.addFilter("plainDate", plainDate);

	// add shortcodes
	eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
	eleventyConfig.addShortcode("year", year);

	// add plugins
	eleventyConfig.addPlugin(postGraph, {
		sort: "desc",
		boxColor: "darkgrey",
		highlightColor: "red",
		textColor: "#fff",
	});
	eleventyConfig.addPlugin(syntaxHighlight);
	eleventyConfig.addPlugin(pluginRss);

	// Bundles CSS, not-minified
	eleventyConfig.addPlugin(bundlerPlugin);

	// bundle CSS with eleventy, use postcss to minify the bundles
	// eleventyConfig.addPlugin(bundlerPlugin, {
	//   transforms: [
	//     async function (content) {
	//       // this.type returns the bundle name.
	//       if (this.type === "css") {
	//         // Same as Eleventy transforms, this.page is available here.
	//         let result = await postcss([postcssMinify]).process(content, {
	//           from: this.page.inputPath,
	//           to: null,
	//         });
	//         return result.css;
	//       }
	//       return content;
	//     },
	//   ],
	// });

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
