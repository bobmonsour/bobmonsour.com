import { isCurrentPage } from "./iscurrentpage.js";
import { getAllTags } from "./getalltags.js";
import { plainDate, formatPostDate } from "./formatdates.js";
import { readingTime } from "./readingtime.js";

const filters = {
	isCurrentPage,
	getAllTags,
	plainDate,
	formatPostDate,
	readingTime,
};

export default (eleventyConfig) => {
	return Object.keys(filters).forEach((filter) => {
		eleventyConfig.addFilter(filter, filters[filter]);
	});
};
