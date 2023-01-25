const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
  //
  // Set up watch targets and passthroughs
  //
  eleventyConfig.addWatchTarget("./src/sass/");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy({ favicon: "/" });

  // Add shortcodes
  //
  //  - eleventy image
  //  - current year
  //
  eleventyConfig.addNunjucksAsyncShortcode(
    "image",
    require("./src/_includes/shortcodes/image.js")
  );

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Add filters
  //
  //  - generate reading time for a post
  //  - generate post date for various contexts
  //
  eleventyConfig.addFilter(
    "readingTime",
    require("./src/_includes/filters/readingtime.js")
  );

  eleventyConfig.addFilter(
    "formatPostDate",
    require("./src/_includes/filters/formatpostdate.js")
  );

  // Add plugins
  //
  //  - syntax highlighting
  //  - RSS feed generation
  //
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
      layouts: "_layouts",
      data: "_data",
    },
  };
};
