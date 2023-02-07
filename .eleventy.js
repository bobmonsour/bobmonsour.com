const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const eleventySass = require("@11tyrocks/eleventy-plugin-sass-lightningcss");

module.exports = function (eleventyConfig) {
  //
  // Set up watch targets and passthroughs
  //
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/js");
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

  // Return all the tags used in a collection
  eleventyConfig.addFilter("getAllTags", (collection) => {
    let tagSet = new Set();
    for (let item of collection) {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    }
    return Array.from(tagSet);
  });

  eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
    if (typeof tags === "string") {
      return (tags.split(",") || []).filter(
        (tag) => ["all", "nav", "post", "posts"].indexOf(tag) === -1
      );
    } else {
      return (tags || []).filter(
        (tag) => ["all", "nav", "post", "posts"].indexOf(tag) === -1
      );
    }
  });

  // Add plugins
  //
  //  - syntax highlighting
  //  - RSS feed generation
  //  - support for draft: true in template frontmatter
  //  - have eleventy process sass and post-process with lightning
  //
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(require("./src/eleventy.config.drafts.js"));
  eleventyConfig.addPlugin(eleventySass);

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
