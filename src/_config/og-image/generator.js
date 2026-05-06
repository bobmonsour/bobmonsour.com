import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import satori from "satori";
import sharp from "sharp";

const require = createRequire(import.meta.url);

// Load font and avatar once per process. Both are small (~100KB each)
// and reused for every render.
const FONT_PATH = require.resolve(
	"@fontsource/ibm-plex-serif/files/ibm-plex-serif-latin-600-normal.woff",
);
const FONT_DATA = fs.readFileSync(FONT_PATH);

const AVATAR_PATH = path.resolve("src/assets/img/about-bob.jpg");
const AVATAR_BUFFER = fs.readFileSync(AVATAR_PATH);
const AVATAR_DATA_URI = `data:image/jpeg;base64,${AVATAR_BUFFER.toString("base64")}`;

// Deterministic font-size ramp keyed to title length. Same title always
// renders at the same size.
function pickFontSize(title) {
	if (title.length <= 60) return 88;
	if (title.length <= 90) return 72;
	return 60;
}

function buildTree(title) {
	return {
		type: "div",
		props: {
			style: {
				width: "1200px",
				height: "630px",
				backgroundColor: "#353d4d",
				display: "flex",
				position: "relative",
				padding: "80px",
				boxSizing: "border-box",
			},
			children: [
				{
					type: "div",
					props: {
						style: {
							color: "#ffffff",
							fontFamily: "IBM Plex Serif",
							fontWeight: 600,
							fontSize: `${pickFontSize(title)}px`,
							lineHeight: 1.15,
							letterSpacing: "-0.01em",
							maxWidth: "880px",
							display: "flex",
						},
						children: title,
					},
				},
				{
					type: "img",
					props: {
						src: AVATAR_DATA_URI,
						width: 180,
						height: 180,
						style: {
							position: "absolute",
							bottom: "60px",
							right: "60px",
							borderRadius: "9999px",
							border: "4px solid #c7e2f6",
						},
					},
				},
			],
		},
	};
}

// Renders the OG image for `title` and returns a PNG Buffer.
// Throws on font/image load failure, malformed input, or sharp error.
// Callers should catch and log a warning per the spec's error policy.
export async function generate(title) {
	const svg = await satori(buildTree(title), {
		width: 1200,
		height: 630,
		fonts: [
			{
				name: "IBM Plex Serif",
				data: FONT_DATA,
				weight: 600,
				style: "normal",
			},
		],
	});
	return await sharp(Buffer.from(svg)).png().toBuffer();
}
