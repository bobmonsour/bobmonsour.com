import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import crypto from "crypto";

// Generate MD5 hash of a string (the filename and extension)
function generateMD5Hash(filePath) {
	const filename = path.basename(filePath);
	return crypto.createHash("md5").update(filename).digest("hex");
}

// Process a single file
function addrssid(filePath) {
	const fileContent = fs.readFileSync(filePath, "utf-8");

	// Extract existing front matter
	const frontMatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n/);
	let frontMatter = {};
	let content = fileContent;

	if (frontMatterMatch) {
		frontMatter = yaml.load(frontMatterMatch[1], { schema: yaml.JSON_SCHEMA });
		content = fileContent.slice(frontMatterMatch[0].length);
	} else {
		console.error(`Error: No front matter found in file: ${filePath}`);
		return false;
	}

	// Generate an MD5 hash of the filename, including the extension
	const rssid = generateMD5Hash(filePath);
	const filename = path.basename(filePath);
	console.log(
		`Adding rssid to file: ${filePath} + md5 hash based on filename: " + ${filename}`
	);
	frontMatter.rssid = rssid;

	// Reconstruct the file content with updated front matter
	const newFrontMatter = yaml.dump(frontMatter, {
		schema: yaml.JSON_SCHEMA,
		lineWidth: -1,
	});
	const newFileContent = `---\n${newFrontMatter}---\n${content}`;
	fs.writeFileSync(filePath, newFileContent, "utf-8");
	return rssid; // Return the rssid to be added to the template
}

export default addrssid;
