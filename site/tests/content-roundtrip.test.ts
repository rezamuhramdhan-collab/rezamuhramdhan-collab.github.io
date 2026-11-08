import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { formatDisplayCopy } from "../lib/display-copy";

test("all fixture projects seed into a fresh CMS and round-trip their authored content", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "portfolio-roundtrip-"));
  process.env.DATABASE_URI = `file:${path.join(directory, "test.db")}`;
  assert.notEqual(process.env.NODE_ENV, "production", "Run this isolated fixture test in development or test mode");
  const { getPayload } = await import("payload");
  const config = (await import("../payload.config")).default;
  const payload = await getPayload({ config });
  try {
    const { toProjectDoc } = await import("../lib/seed");
    const fixtures = (await import("../content/projects")).getPublishedProjects();
    const actual = await (await import("../lib/data")).getPublishedProjects();
    assert.equal(actual.length, fixtures.length);
    for (const source of fixtures) {
      const result = actual.find((project) => project.slug === source.slug);
      assert.ok(result, `Seeded ${source.slug}`);
      // Serialize the read model back through the writer. IDs/timestamps are
      // intentionally outside the authored content contract.
      assert.deepEqual(JSON.parse(JSON.stringify(toProjectDoc(result, 1))), JSON.parse(JSON.stringify(toProjectDoc(formatDisplayCopy(source), 1))));
      assert.equal(result.heroImage.src, "placeholder");
    }
  } finally {
    await payload.destroy();
    await rm(directory, { recursive: true, force: true });
  }
});
