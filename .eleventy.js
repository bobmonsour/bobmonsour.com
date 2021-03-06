const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const directoryOutputPlugin = require("@11ty/eleventy-plugin-directory-output");

module.exports = function (eleventyConfig) {

  // Set directory output during build process
  eleventyConfig.setQuietMode(true);
  eleventyConfig.addPlugin(directoryOutputPlugin, {
    columns: {
      filesize: true, // Use `false` to disable
      benchmark: true, // Use `false` to disable
    },
  });

  // Set up watch targets and passthroughs
  eleventyConfig.addWatchTarget("./src/sass/");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("robots.txt");

  // Add shortcodes and filters

  // shortcode: Eleventy image
  eleventyConfig.addNunjucksAsyncShortcode("image", require("./src/_includes/shortcodes/image.js"));

  // shortcode: current year
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // filter: generate reading time for a post
  eleventyConfig.addFilter(
    "readingTime",
    require("./src/_includes/filters/readingtime.js")
  );

  // filter: generate post date for various contexts
  eleventyConfig.addFilter(
    "formatPostDate",
    require("./src/_includes/filters/formatpostdate.js")
  );

  // Add plugins for syntax highlighting and RSS feed generation
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);

  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};
