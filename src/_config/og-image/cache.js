import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

// Bump when the visual spec or generator code changes in a way that
// should invalidate every previously-cached PNG. The current value
// is concatenated into the hash input so cached images become stale
// automatically.
const RENDERER_VERSION = "5";

const CACHE_DIR = ".cache/og";
const MANIFEST_PATH = path.join(CACHE_DIR, "manifest.json");

export function hashEntry(title, date) {
  const dateKey = date instanceof Date ? date.toISOString() : String(date);
  return crypto
    .createHash("sha1")
    .update(`${RENDERER_VERSION}:${title}:${dateKey}`)
    .digest("hex")
    .slice(0, 12);
}

async function ensureDir() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
}

async function loadManifest() {
  try {
    const raw = await fs.readFile(MANIFEST_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return {};
    console.warn(`[og-image] manifest unreadable, starting fresh: ${err.message}`);
    return {};
  }
}

async function saveManifest(manifest) {
  await ensureDir();
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

function cacheFileFor(slug, hash) {
  return path.join(CACHE_DIR, `${slug}-${hash}.png`);
}

// Returns the cached PNG buffer if the slug+hash matches a stored entry,
// else null. Errors (file missing, unreadable) are logged and treated
// as cache miss.
export async function get(slug, hash) {
  const manifest = await loadManifest();
  const entry = manifest[slug];
  if (!entry || entry.hash !== hash) return null;
  try {
    return await fs.readFile(cacheFileFor(slug, hash));
  } catch (err) {
    console.warn(`[og-image] cache read failed for ${slug}: ${err.message}`);
    return null;
  }
}

// Writes the buffer to the cache file and updates the manifest.
// Errors are logged but do not throw — the build proceeds with the
// freshly-rendered buffer in memory.
export async function put(slug, hash, buffer) {
  await ensureDir();
  const file = `${slug}-${hash}.png`;
  try {
    await fs.writeFile(path.join(CACHE_DIR, file), buffer);
  } catch (err) {
    console.warn(`[og-image] cache write failed for ${slug}: ${err.message}`);
    return;
  }
  const manifest = await loadManifest();
  manifest[slug] = { hash, file };
  await saveManifest(manifest);
}

// Removes any cache file whose <slug>-<hash> isn't in activeKeys (a Set
// of "<slug>-<hash>" strings) and prunes orphan manifest entries.
export async function gc(activeKeys) {
  let entries;
  try {
    entries = await fs.readdir(CACHE_DIR);
  } catch (err) {
    if (err.code === "ENOENT") return;
    console.warn(`[og-image] gc readdir failed: ${err.message}`);
    return;
  }
  for (const name of entries) {
    if (!name.endsWith(".png")) continue;
    const key = name.replace(/\.png$/, "");
    if (!activeKeys.has(key)) {
      try {
        await fs.unlink(path.join(CACHE_DIR, name));
      } catch (err) {
        console.warn(`[og-image] gc unlink failed for ${name}: ${err.message}`);
      }
    }
  }
  const manifest = await loadManifest();
  let dirty = false;
  for (const [slug, entry] of Object.entries(manifest)) {
    if (!activeKeys.has(`${slug}-${entry.hash}`)) {
      delete manifest[slug];
      dirty = true;
    }
  }
  if (dirty) await saveManifest(manifest);
}
