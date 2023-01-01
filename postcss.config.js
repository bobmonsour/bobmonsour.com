// postcss.config.js
const cssnano = require("cssnano");
const autoprefixer = require("autoprefixer");
const postcssLogical = require("postcss-logical")({
  dir: "ltr",
});

module.exports = {
  plugins: [postcssLogical, cssnano, autoprefixer],
};
