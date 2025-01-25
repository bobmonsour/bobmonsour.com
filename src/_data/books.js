// All the records stored in books.json are sorted in descending
// order by date
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
	const undatedBooks = theBooks.filter(
		(book) => book.yearRead === "undated" && book.yearRead != "currently"
	);
	// generate the sorted books
	// const datedBooks = filteredBooks.sort((a, b) => {
	// 	return a.yearRead > b.yearRead ? -1 : 1;
	// });

	// Extract unique years and format them
	const uniqueYears = [
		...new Set(datedBooks.map((book) => book.yearRead.split("/")[0])),
	]
		.map((year) => `y${year}`)
		.sort((a, b) => b.slice(1) - a.slice(1)); // Sort in descending order

	// Generate the result array
	const years = uniqueYears.map((year) => ({ year }));
	years.push({ year: "undated" });

	return {
		currentBooks,
		currentBookCount,
		datedBooks,
		undatedBooks,
		years,
	};
}
