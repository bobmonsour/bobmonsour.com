// get all of the post tags
export const getAllTags = (collection) => {
	let tagSet = new Set();
	for (let item of collection) {
		(item.data.tags || []).forEach((tag) => tagSet.add(tag));
	}
	return Array.from(tagSet).sort();
};
