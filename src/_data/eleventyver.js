import fs from "fs";

export default function () {
	const packageJson = JSON.parse(
		fs.readFileSync("./node_modules/@11ty/eleventy/package.json", "utf8")
	);
	return {
		packageVersion: packageJson.version,
	};
}
