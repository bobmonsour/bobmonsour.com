// Predicate: should this post receive a generated OG image?
// A post matches if its tags include neither "notes" nor "til".
// Used identically by the data cascade hook and the after-build hook
// so they can never disagree on which posts qualify.
export function shouldGenerate(data) {
  const tags = Array.isArray(data?.tags) ? data.tags : [];
  return !tags.includes("notes") && !tags.includes("til");
}
