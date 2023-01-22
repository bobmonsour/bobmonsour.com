module.exports = {
  env: process.env.ELEVENTY_ENV,
  dev_url: "http://localhost:8080",
  prod_url: "https://bobmonsour.com",
  title: "Bob Monsour | Home",
  url: "https://www.bobmonsour.com",
  mainNavLinks: [
    { url: "/archives/", text: "Archives", class: "nav__item" },
    { url: "/about/", text: "About", class: "nav__item" },
  ],
};
