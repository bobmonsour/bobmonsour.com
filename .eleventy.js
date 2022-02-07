const readingTime = require("eleventy-plugin-reading-time");

module.exports = function (eleventyConfig) {
  // Opt out of using BrowserSync; using Popypane in its place
  // eleventyConfig.setBrowserSyncConfig({
  //   snippet: false
  // });

  // Copy the src/image dir to the _site/images dir
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("robots.txt");

  // Shortcode for the current year
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Add filter to generate reading time for a post
  eleventyConfig.addFilter(
    "readingTime",
    require("./src/_filters/readingtime.js")
  );

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
