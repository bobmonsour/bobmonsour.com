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
			if (pageUrl.includes("archive") || pageUrl.includes("posts")) {
				return 'aria-current="page"';
			}
			break;
		case "microblog":
			if (pageUrl.includes("microblog")) {
				return 'aria-current="page"';
			}
			break;
		case "about":
			if (pageUrl.includes("about")) {
				return 'aria-current="page"';
			}
	}
};
