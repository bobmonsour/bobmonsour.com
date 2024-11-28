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
