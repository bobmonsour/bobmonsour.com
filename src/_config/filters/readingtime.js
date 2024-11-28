// generate reading time for a post
export const readingTime = (text) => {
	var content = new String(text);
	const speed = 240; // reading speed in words per minute

	// remove all html elements
	var re = /(&lt;.*?&gt;)|(<[^>]+>)/gi;
	var plain = content.replace(re, "");

	// replace all newlines and 's with spaces
	var plain = plain.replace(/\s+|'s/g, " ");

	// create array of all the words in the post & count them
	var words = plain.split(" ");
	var count = words.length;

	// calculate the reading time
	var readingTime = Math.round(count / speed);
	if (readingTime === 0) {
		return "Less than 1 minute to read";
	} else if (readingTime === 1) {
		return "1 minute to read";
	} else {
		return readingTime + " minutes to read";
	}
};
