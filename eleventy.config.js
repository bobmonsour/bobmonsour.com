module.exports = function (eleventyConfig) {
  //
  // Set up file and directory passthroughs
  //
  [
    "src/assets/fonts/",
    "src/assets/img/",
    "src/assets/audio/",
    "src/robots.txt",
  ].forEach((path) => eleventyConfig.addPassthroughCopy(path));
  eleventyConfig.addPassthroughCopy({ "src/assets/favicon/*": "/" });

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

  // Add plugins
  //
  //  - syntax highlighting
  //  - RSS feed generation
  //  - have eleventy process sass and post-process with lightning
  //  - support for 'draft: true' in template frontmatter
  //  - directory output to show at build time
  //
  const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
  eleventyConfig.addPlugin(syntaxHighlight);

  const pluginRss = require("@11ty/eleventy-plugin-rss");
  eleventyConfig.addPlugin(pluginRss);

  const eleventySass = require("@11tyrocks/eleventy-plugin-sass-lightningcss");
  eleventyConfig.addPlugin(eleventySass);

  const eleventyDrafts = require("./src/eleventy.config.drafts.js");
  eleventyConfig.addPlugin(eleventyDrafts);

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
