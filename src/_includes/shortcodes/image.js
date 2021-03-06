// --- START, eleventy-img ---
const Image = require("@11ty/eleventy-img");
const path = require("path");

async function imageShortcode(src, alt, sizes = "100vw", loading = "lazy") {
  let metadata = await Image(src, {
    widths: [300, 600, 1400],
    formats: ["webp", "jpeg"],
    outputDir: "_site/img",
    filenameFormat: function (id, src, width, format) {
      const extension = path.extname(src);
      const name = path.basename(src, extension);
      return `${name}-${width}w.${format}`;
    },
  });

  let lowsrc = metadata.jpeg[0];
  let highsrc = metadata.jpeg[metadata.jpeg.length - 1];

  return `<picture>
    ${Object.values(metadata).map(imageFormat => {
      return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
    }).join("\n")}
      <img
        src="${lowsrc.url}"
        width="${highsrc.width}"
        height="${highsrc.height}"
        alt="${alt}"
        loading="${loading}"
        decoding="async">
    </picture>`;
}
module.exports = (imageShortcode);
