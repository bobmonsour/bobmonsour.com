// get all of the post tags
export const getAllTags = (collection) => {
  let tagCount = {};
  for (let item of collection) {
    (item.data.tags || []).forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  }
  return Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
};
