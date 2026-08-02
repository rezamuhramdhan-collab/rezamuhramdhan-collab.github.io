// Push the experience copy in `content/experience.ts` into the CMS, so the
// homepage bullets match the fixture (which mirrors the LinkedIn profile).
//
//   # inspect only — prints a per-entry diff, writes nothing
//   DATABASE_URI=postgres://... PAYLOAD_SECRET=... npx tsx scripts/sync-experience.mts
//
//   # apply
//   DATABASE_URI=postgres://... PAYLOAD_SECRET=... npx tsx scripts/sync-experience.mts --apply
//
// Unlike scripts/fill-v3-fields.mts this OVERWRITES existing copy — it is how
// you push edited bullets to production, so read the dry run before applying.
// Entries are matched on company name; anything in the CMS with no fixture
// counterpart is reported and left untouched.
//
// Only `description` is written. Entries that also carry rich `content` keep
// it, but the homepage prefers `description` when it is non-empty, so the
// bullets below are what render.

process.env.SKIP_SEED = "1";

const APPLY = process.argv.includes("--apply");

if (!process.env.DATABASE_URI) {
  console.error("DATABASE_URI is required — refusing to guess a target database.");
  process.exit(1);
}

const { getPayload } = await import("payload");
const { default: config } = await import("@payload-config");
const { experience: fixtures } = await import("../content/experience.ts");

const payload = await getPayload({ config });

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const bullets = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

const { docs } = await payload.find({ collection: "experience", sort: "_order", limit: 100 });

type Pending = { id: string | number; company: string; from: string[]; to: string[] };
const pending: Pending[] = [];
const unmatched: string[] = [];

for (const doc of docs as Array<{ id: string | number; company: string; description?: string | null }>) {
  const fixture = fixtures.find((f) => norm(f.company) === norm(doc.company));
  if (!fixture) {
    unmatched.push(doc.company);
    continue;
  }
  const from = bullets(doc.description ?? "");
  const to = bullets(fixture.description);
  if (from.join("\n") !== to.join("\n")) {
    pending.push({ id: doc.id, company: doc.company, from, to });
  }
}

for (const company of unmatched) {
  console.warn(`  ! No fixture matches CMS entry "${company}" — left untouched.`);
}

if (!pending.length) {
  console.log("Experience copy already matches the fixture — nothing to do.");
  process.exit(0);
}

console.log(`\n${APPLY ? "Applying" : "Would apply"} ${pending.length} update(s):\n`);
for (const p of pending) {
  console.log(`  ${p.company}: ${p.from.length} bullet(s) -> ${p.to.length}`);
  for (const line of p.from) console.log(`    - ${line}`);
  for (const line of p.to) console.log(`    + ${line}`);
  console.log("");
}

if (!APPLY) {
  console.log("Dry run — nothing written. Re-run with --apply to commit these.");
  process.exit(0);
}

for (const p of pending) {
  await payload.update({
    collection: "experience",
    id: p.id,
    data: { description: p.to.join("\n") },
  });
}

console.log("Done. Rebuild Pages (or re-run the deploy workflow) to publish the change.");
process.exit(0);
