// environment variable handling
require("dotenv").config();
const sanitizeHTML = require("sanitize-html");

module.exports = function (eleventyConfig) {
  //
  // Set up file and directory passthroughs
  //
  [
    "src/assets/audio/",
    { "src/assets/favicon/*": "/" },
    "src/assets/img/",
    "src/assets/js/",
    "src/robots.txt",
  ].forEach((path) => eleventyConfig.addPassthroughCopy(path));

  // Add shortcodes
  //
  //  - eleventy image
  //  - current year
  //
  eleventyConfig.addNunjucksAsyncShortcode(
    "image",
    require("./src/eleventy.config.image.js")
  );

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Add filters
  //
  //  - generate reading time for a post
  //  - format the post date
  //  - return all the tags used in a collection
  //  - filter the post tag list to exclude a few collections
  //  - minify css for inline use
  //  - node inspection utility for debugging
  //  - webmentions for a particular post
  //  - create a plain date from an ISO date (for webmentions)
  //
  eleventyConfig.addFilter(
    "readingTime",
    require("./src/_includes/filters/readingtime.js")
  );

  eleventyConfig.addFilter("formatPostDate", function formatPostDate(date) {
    const { DateTime } = require("luxon");
    return DateTime.fromJSDate(date, { zone: "utc" }).toLocaleString(
      DateTime.DATE_MED
    );
  });

  eleventyConfig.addFilter("getAllTags", (collection) => {
    let tagSet = new Set();
    for (let item of collection) {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    }
    return Array.from(tagSet);
  });

  eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
    return (tags || []).filter(
      (tag) => ["all", "nav", "post", "posts"].indexOf(tag) === -1
    );
  });

  const inspect = require("node:util").inspect;
  eleventyConfig.addFilter("inspect", function (obj = {}) {
    return inspect(obj, { sorted: true });
  });

  eleventyConfig.addFilter(
    "webmentionsByUrl",
    require("./src/_includes/filters/webmentionsbyurl.js")
  );

  eleventyConfig.addFilter(
    "plainDate",
    require("./src/_includes/filters/plaindate.js")
  );

  eleventyConfig.setQuietMode(true);

  // Add plugins
  //
  //  - post graph
  //  - syntax highlighting
  //  - RSS feed generation
  //  - have eleventy process sass and post-process with lightning
  //  - support for 'draft: true' in template frontmatter
  //  - directory output to show at build time
  //  - eleventy bundle plugin for CSS (and JS and more)
  //
  const postGraph = require("@rknightuk/eleventy-plugin-post-graph");
  eleventyConfig.addPlugin(postGraph, {
    sort: "desc",
    boxColor: "darkgrey",
    highlightColor: "red",
    textColor: "#fff",
  });

  const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
  eleventyConfig.addPlugin(syntaxHighlight);

  const pluginRss = require("@11ty/eleventy-plugin-rss");
  eleventyConfig.addPlugin(pluginRss);

  const eleventyDrafts = require("./src/eleventy.config.drafts.js");
  eleventyConfig.addPlugin(eleventyDrafts);

  const bundlerPlugin = require("@11ty/eleventy-plugin-bundle");
  const postcss = require("postcss");
  const postcssMinify = require("postcss-minify");
  eleventyConfig.addPlugin(bundlerPlugin, {
    transforms: [
      async function (content) {
        // this.type returns the bundle name.
        if (this.type === "css") {
          // Same as Eleventy transforms, this.page is available here.
          let result = await postcss([postcssMinify]).process(content, {
            from: this.page.inputPath,
            to: null,
          });
          return result.css;
        }

        return content;
      },
    ],
  });

  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
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
