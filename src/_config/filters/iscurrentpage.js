// Determine whether or not to highlight current page in the nav
// if the link text appears within the page url, then do highlight
let lcLinkText = "";
export const isCurrentPage = (linkText, pageUrl) => {
  lcLinkText = linkText.toLowerCase();
  switch (lcLinkText) {
    case "home":
      if (pageUrl === "/") {
        return 'aria-current="page"';
      }
      break;
    case "blog":
      if (pageUrl.includes("/blog/")) {
        return 'aria-current="page"';
      }
      break;
    case "notes":
      if (pageUrl.includes("/notes/")) {
        return 'aria-current="page"';
      }
      break;
    case "til":
      if (pageUrl.includes("/til/")) {
        return 'aria-current="page"';
      }
      break;
    case "books":
      if (pageUrl.includes("/books/")) {
        return 'aria-current="page"';
      }
      break;
    case "shop":
      if (pageUrl.includes("/shop/")) {
        return 'aria-current="page"';
      }
      break;
    case "about":
      if (pageUrl.includes("/about/")) {
        return 'aria-current="page"';
      }
  }
};
