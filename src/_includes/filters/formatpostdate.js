/*
 * Format the date of a post into Month Day, Year (in US English)
 *
 * Date input is from the frontmatter of each post, in the form of yyyy-mm-dd
 *
 * Usage contexts include:
 *  - index page
 *  - archives page
 *  - individual post pages
 *
 *
 * Output:
 * - date string in the form of "September 1, 2020"
 *
 */

module.exports = function (dateString) {
  return dateString.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
