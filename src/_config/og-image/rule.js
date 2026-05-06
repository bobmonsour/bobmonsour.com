// Predicate: should this post receive a generated OG image?
// A post matches if its tags include neither "notes" nor "til", and it
// hasn't opted out via `useHeroForOg: true` (with a hero image to use).
// Used identically by the data cascade hook and the after-build hook
// so they can never disagree on which posts qualify.
export function shouldGenerate(data) {
  const tags = Array.isArray(data?.tags) ? data.tags : [];
  if (tags.includes("notes") || tags.includes("til")) return false;
  if (data?.useHeroForOg && data?.image?.source) return false;
  return true;
}
