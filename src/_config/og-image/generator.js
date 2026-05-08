import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import satori from "satori";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const moduleDir = path.dirname(fileURLToPath(import.meta.url));

// Lazy-loaded once per process and cached. Loading inside generate()
// (rather than at module import) so any failure is caught by the
// orchestrator's try/catch and degrades to a per-post warning rather
// than crashing eleventy.config.js at import time.
//
// Note: if the avatar file or its visual treatment changes in a way
// that should invalidate cached PNGs, bump RENDERER_VERSION in cache.js.
let assets = null;

function loadAssets() {
	if (assets) return assets;
	const fontPath = require.resolve(
		"@fontsource/ibm-plex-serif/files/ibm-plex-serif-latin-600-normal.woff",
	);
	const fontData = fs.readFileSync(fontPath);
	const avatarPath = path.resolve(moduleDir, "../../assets/img/about-bob.jpg");
	const avatarBuffer = fs.readFileSync(avatarPath);
	const avatarDataUri = `data:image/jpeg;base64,${avatarBuffer.toString("base64")}`;
	assets = { fontData, avatarDataUri };
	return assets;
}

// Deterministic font-size ramp keyed to title length. Same title always
// renders at the same size.
function pickFontSize(title) {
	if (title.length <= 30) return 88;
	if (title.length <= 60) return 72;
	return 60;
}

function formatDate(date) {
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "UTC",
	});
}

function buildTree(title, date, avatarDataUri) {
	const titleSize = pickFontSize(title);
	const wordmarkSize = Math.round(titleSize / 2);
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
							display: "flex",
							flexDirection: "column",
							maxWidth: "1040px",
						},
						children: [
							{
								type: "div",
								props: {
									style: {
										color: "#ffffff",
										fontFamily: "IBM Plex Serif",
										fontWeight: 600,
										fontSize: `${titleSize}px`,
										lineHeight: 1.15,
										letterSpacing: "-0.01em",
										display: "flex",
									},
									children: title,
								},
							},
							{
								type: "div",
								props: {
									style: {
										color: "#c7e2f6",
										fontFamily: "IBM Plex Serif",
										fontWeight: 600,
										fontSize: `${wordmarkSize}px`,
										marginTop: "24px",
										display: "flex",
									},
									children: formatDate(date),
								},
							},
						],
					},
				},
				{
					type: "img",
					props: {
						src: avatarDataUri,
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
				{
					type: "div",
					props: {
						style: {
							position: "absolute",
							left: "80px",
							bottom: "50px",
							color: "#c7e2f6",
							fontFamily: "IBM Plex Serif",
							fontWeight: 600,
							fontSize: `${wordmarkSize}px`,
							display: "flex",
						},
						children: "bobmonsour.com",
					},
				},
			],
		},
	};
}

// Renders the OG image for `title` and returns a PNG Buffer.
// Throws on font/image load failure, malformed input, or sharp error.
// Callers should catch and log a warning per the spec's error policy.
export async function generate(title, date) {
	const { fontData, avatarDataUri } = loadAssets();
	const svg = await satori(buildTree(title, date, avatarDataUri), {
		width: 1200,
		height: 630,
		fonts: [
			{
				name: "IBM Plex Serif",
				data: fontData,
				weight: 600,
				style: "normal",
			},
		],
	});
	return await sharp(Buffer.from(svg)).png().toBuffer();
}
