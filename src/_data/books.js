// All the records stored in books.json are sorted in descending
// order by date
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const theBooks = require("./books.json");

export default async function () {
	// exclude books that have 'undated' as the value for the yearRead property
	const filteredBooks = theBooks.filter((book) => book.yearRead != "undated");
	const undatedBooks = theBooks.filter((book) => book.yearRead === "undated");
	// generate the sorted books
	const datedBooks = filteredBooks.sort((a, b) => {
		return a.yearRead > b.yearRead ? -1 : 1;
	});
	return {
		datedBooks,
		undatedBooks,
	};
}
