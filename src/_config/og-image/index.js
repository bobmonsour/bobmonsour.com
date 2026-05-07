import fs from "node:fs/promises";
import path from "node:path";
import { shouldGenerate } from "./rule.js";
import { generate } from "./generator.js";
import * as cache from "./cache.js";

// Captured during the data cascade (when we have access to post data),
// consumed during the after-build hook (when the data cascade is gone).
// Reset on each build via "eleventy.before".
let queue = [];

export default function register(eleventyConfig) {
  eleventyConfig.on("eleventy.before", () => {
    queue = [];
  });

  // Capture matching posts during the data cascade. Returning [] means
  // this collection is empty in templates — we only use the callback
  // for its side effect of populating `queue`.
  eleventyConfig.addCollection("ogImageQueue", (api) => {
    queue = api
      .getFilteredByGlob("./src/posts/**/*.md")
      .filter((p) => shouldGenerate(p.data))
      .map((p) => ({ slug: p.fileSlug, title: p.data.title, date: p.date }));
    return [];
  });

  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    const outDir = path.join(dir.output, "assets/img/og");
    await fs.mkdir(outDir, { recursive: true });

    const activeKeys = new Set();

    for (const { slug, title, date } of queue) {
      const hash = cache.hashEntry(title, date);
      activeKeys.add(`${slug}-${hash}`);

      let buf = await cache.get(slug, hash);
      if (!buf) {
        try {
          buf = await generate(title, date);
          await cache.put(slug, hash, buf);
        } catch (err) {
          console.warn(
            `[og-image] generation failed for slug=${slug}: ${err.message}`,
          );
          continue;
        }
      }

      try {
        await fs.writeFile(path.join(outDir, `${slug}.png`), buf);
      } catch (err) {
        console.warn(
          `[og-image] write to _site failed for slug=${slug}: ${err.message}`,
        );
      }
    }

    await cache.gc(activeKeys);
  });
}
