import { bookRating } from "./bookrating.js";
import { genRSSId } from "./rssid.js";
import { getAllTags } from "./getalltags.js";
import { isCurrentPage } from "./iscurrentpage.js";
import { plainDate, formatPostDate, toDateString } from "./formatdates.js";
import { readingTime } from "./readingtime.js";
import { whichBgImage } from "./whichbgimage.js";

const filters = {
  bookRating,
  genRSSId,
  getAllTags,
  isCurrentPage,
  plainDate,
  formatPostDate,
  readingTime,
  toDateString,
  whichBgImage,
};

export default (eleventyConfig) => {
  return Object.keys(filters).forEach((filter) => {
    eleventyConfig.addFilter(filter, filters[filter]);
  });
};
