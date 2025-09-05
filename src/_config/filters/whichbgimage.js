// Determine which background image to use on the body element
// based on the page.url
export const whichBgImage = (pageUrl) => {
  let bgImageUrl = "/assets/img/bg-me-and-dad.jpg";
  const paths = ["/blog/", "/tags/", "/stats/", "/notes/", "/til/"];
  if (pageUrl === "/") {
    bgImageUrl = "/assets/img/bg-me-and-dad.jpg";
  } else if (pageUrl.includes("/books/")) {
    bgImageUrl = "/assets/img/bg-bill-and-bob.jpg";
  } else if (pageUrl.includes("/shop/")) {
    bgImageUrl = "/assets/img/bg-whole-family.jpg";
  } else if (pageUrl.includes("/about/")) {
    bgImageUrl = "/assets/img/bg-me-and-bill.jpg";
  } else if (paths.some((path) => pageUrl.includes(path))) {
    bgImageUrl = "/assets/img/bg-me-and-ma.jpg";
  }
  // console.log("bgImageUrl: " + bgImageUrl);
  return bgImageUrl;
};
