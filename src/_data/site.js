export default {
	env: process.env.ELEVENTY_ENV,
	title: "Bob Monsour's personal website",
	description:
		"Hi! I'm Bob Monsour. I'm a web hobbyist that enjoys building websites with 11ty and writing about things.",
	url: "https://www.bobmonsour.com",
	locale: "en",
	author: {
		name: "Bob Monsour",
		email: "bob.monsour@gmail.com",
	},
	snow: "true",
	mainNavLinks: [
		{ url: "/", text: "Home" },
		{ url: "/blog/", text: "Blog" },
		{ url: "/notes/", text: "Notes" },
		{ url: "/til/", text: "TIL" },
		{ url: "/books/", text: "Books" },
		{ url: "/about/", text: "About" },
	],
};
