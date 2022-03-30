/*
 * Format the date of a post into Month Day, Year
 *
 * Input contexts include:
 *  - index page
 *  - archives page
 *  - individual post pages
 *
 * Output:
 * - date string in the form of "September 1, 2020"
 *
 */

module.exports = function (dateString) {
  return dateString.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
