import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import crypto from "crypto";

// Generate MD5 hash of a string (the filename)
function generateMD5Hash(str) {
	return crypto.createHash("md5").update(str).digest("hex");
}

// Process a single file
export const addRSSid = (filename) => {
	const filePath = path.join(currentDirectory, filename);
	const fileContent = fs.readFileSync(filePath, "utf-8");

	// Extract existing front matter
	const frontMatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n/);
	let frontMatter = {};
	let content = fileContent;

	if (frontMatterMatch) {
		frontMatter = yaml.load(frontMatterMatch[1], { schema: yaml.JSON_SCHEMA });
		content = fileContent.slice(frontMatterMatch[0].length);
	} else {
		console.error(`Error: No front matter found in file: ${filename}`);
		return false;
	}

	// Add or remove rssid based on the option
	const rssid = generateMD5Hash(filename);
	console.log(`Adding rssid to file: ${filename}`);
	frontMatter.rssid = rssid;

	// Reconstruct the file content with updated front matter
	const newFrontMatter = yaml.dump(frontMatter, {
		schema: yaml.JSON_SCHEMA,
		lineWidth: -1,
	});
	const newFileContent = `---\n${newFrontMatter}---\n${content}`;
	fs.writeFileSync(filePath, newFileContent, "utf-8");
	return true; // Return true if processed successfully, false otherwise
};
