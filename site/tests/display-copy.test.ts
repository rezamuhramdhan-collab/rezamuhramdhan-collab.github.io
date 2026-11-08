import test from "node:test";
import assert from "node:assert/strict";
import { formatDisplayCopy } from "../lib/display-copy";

test("display punctuation covers plain copy, metadata, lists and rich text without mutating saved input", () => {
  const source = {
    title: "Design\u2014Banking",
    paragraphs: ["Discover \u2014 then decide"],
    metaGrid: [{ label: "Timeline", value: "2022 \u2014 Present" }],
    content: { root: { children: [{ type: "text", text: "People\u2014and their needs" }] } },
  };
  const snapshot = structuredClone(source);
  const result = formatDisplayCopy(source);
  assert.equal(result.title, "Design - Banking");
  assert.deepEqual(result.paragraphs, ["Discover - then decide"]);
  assert.equal(result.metaGrid[0].value, "2022 - Present");
  assert.equal(result.content.root.children[0].text, "People - and their needs");
  assert.deepEqual(source, snapshot);
});

test("formatting preserves destinations, anchors, credentials and encrypted payloads exactly", () => {
  const source = {
    slug: "project\u2014slug", anchor: "existing\u2014anchor", id: "record\u2014id",
    href: "/resume\u2014final.pdf", src: "/art\u2014original.webp",
    fields: { url: "https://example.com/a\u2014b" },
    password: "secret\u2014password", lock: { data: "cipher\u2014text", salt: "salt", iv: "iv" },
    nextProjectSlug: "next\u2014project", companyLink: "https://example.com/c\u2014d",
  };
  assert.deepEqual(formatDisplayCopy(source), source);
});
