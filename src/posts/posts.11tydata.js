export default {
  eleventyComputed: {
    layout: "postgrid.njk",
    whichgrid: "central",
    permalink: (data) => `blog/${data.page.fileSlug}/`,
    imageDir: "src/assets/img/",
    image: (data) => {
      if (data.image && data.image.source) {
        return data.image;
      }
      if (data.tags.includes("notes")) {
        return { source: "notes-og-image.jpg" };
      }
      if (data.tags.includes("til")) {
        return { source: "til-og-image.jpg" };
      }
    },
    showImage: true,
    keywords: "retired, web development, blog, eleventy, tennis",
  },
};
