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
      if (data.tags?.includes("notes")) {
        return { source: "notes-og-image.jpg" };
      }
      if (data.tags?.includes("til")) {
        return { source: "til-og-image.jpg" };
      }
    },
    // OG image (social-share card) is independent of `image` (in-body hero).
    // Notes and TILs use their dedicated default cards; every other post
    // uses a build-time-generated card at /assets/img/og/<slug>.png.
    ogImage: (data) => {
      if (data.tags?.includes("notes")) {
        return {
          source: "notes-og-image.jpg",
          alt: "Bob Monsour's blog — note",
        };
      }
      if (data.tags?.includes("til")) {
        return {
          source: "til-og-image.jpg",
          alt: "Bob Monsour's blog — TIL",
        };
      }
      return {
        source: `og/${data.page.fileSlug}.png`,
        alt: data.title,
      };
    },
    showImage: true,
    keywords: "retired, web development, blog, eleventy, tennis",
  },
};
