// Only presentation text is formatted. Saved CMS content, destinations,
// authored anchors, identifiers and encryption fields stay intact.
const copyFields = new Set([
  "title", "heading", "sectionHeading", "summary", "description", "intro",
  "text", "accent", "alt", "caption", "label", "value", "category", "year",
  "headline", "headlineGhost", "subheading", "subtext", "eyebrow", "bio",
  "firstName", "lastName", "logoText", "footerText", "locationTag",
  "period", "role", "company", "employmentType", "location", "availability",
  "leftTitle", "rightTitle", "calloutTitle", "learningsTitle",
  "paragraphs", "closingParagraphs", "items", "bullets", "cards",
  "leftItems", "rightItems", "calloutItems", "learnings", "skills", "tags",
]);

export function formatDisplayCopy<T>(value: T, field = ""): T {
  if (typeof value === "string") {
    return (copyFields.has(field) ? value.replace(/\s*\u2014\s*/g, " - ") : value) as T;
  }
  if (Array.isArray(value)) return value.map((item) => formatDisplayCopy(item, field)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, formatDisplayCopy(item, key)])) as T;
  }
  return value;
}
