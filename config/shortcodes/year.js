// Return the current year as of build time
// used in page footer
function year() {
  return `${new Date().getFullYear()}`;
}
module.exports = year;
