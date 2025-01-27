// For posts, notes, and TILs following the hashStartDate,
// generate an ID for eah RSS entry that consists of a
// MD5 hash of the title of the entry. For earlier posts,
// the absolutePostUrl is used as the ID so as not to
// alter how those earlier posts are viewed by RSS readers.
import crypto from "crypto";

const hashingStartDate = "2025-01-24";

function MD5Hash(input) {
	return crypto.createHash("md5").update(input).digest("hex");
}

export function genRSSId(postTitle, postDate, absolutePostUrl) {
	if (postDate > hashingStartDate) {
		let hash = MD5Hash(postTitle);
		return hash;
	} else {
		return absolutePostUrl;
	}
}
