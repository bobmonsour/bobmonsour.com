import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const theBooks = require("./books.json");

export default async function () {
	// generate an array representing the books currently being read
	const currentBooks = theBooks.filter((book) => book.yearRead === "currently");
	const currentBookCount = currentBooks.length;

	// generate an array of books with dates, excluding the book currently being read
	const datedBooks = theBooks
		.filter(
			(book) => book.yearRead != "undated" && book.yearRead != "currently"
		)
		.sort((a, b) => {
			return a.yearRead > b.yearRead ? -1 : 1;
		});

	// generate an array of books with yearRead as 'undated'
	const undatedBooks = theBooks.filter((book) => book.yearRead === "undated");

	// Extract unique years and format them, sorted in descending order
	// result array looks like this:
	//   ["2025", "2024", etc.]
	const years = [
		...new Set(datedBooks.map((book) => book.yearRead.split("/")[0])),
	]
		.sort()
		.reverse();
	years.push("undated");

	return {
		currentBooks,
		currentBookCount,
		datedBooks,
		undatedBooks,
		years,
	};
}
