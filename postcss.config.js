// postcss.config.js
const postcssJitProps = require("postcss-jit-props");
const OpenProps = require("open-props");
const cssnano = require("cssnano");
const autoprefixer = require("autoprefixer");
const postcssLogical = require("postcss-logical");

module.exports = {
  plugins: [postcssJitProps(OpenProps), postcssLogical, cssnano, autoprefixer],
};
