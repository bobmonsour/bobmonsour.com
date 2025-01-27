import { DateTime } from "luxon";

// create a plain date from an ISO date (for webmentions)
export const plainDate = (isoDate) => {
	let date = new Date(isoDate);
	let options = { year: "numeric", month: "long", day: "numeric" };
	let formattedDate = date.toLocaleDateString("en-US", options);
	return formattedDate;
};

// format the post date
export const formatPostDate = (date) => {
	return DateTime.fromJSDate(date, { zone: "utc" }).toLocaleString(
		DateTime.DATE_MED
	);
};

// convert a date to a date string in the form yyyy-mm-dd
export const toDateString = (date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};
