// Determine which background image to use on the body element
// based on the page.url and a JSON mapping of paths to images
import bgImages from '../../_data/bgimagerefs.json' with { type: "json" };

export const whichBgImage = (pageUrl) => {
  // Find the first object where path matches pageUrl exactly
  const match = bgImages.find(item => item.path === pageUrl);
  // Return the corresponding image, or a default if not found
  return match ? match.image : "";
};
