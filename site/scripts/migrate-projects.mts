// One-off production migration: rebuild the projects + categories subsystem
// under the current schema without touching user-edited globals/media/users.
//
// Prereq: the projects/categories tables have been dropped and recreated with
// the new schema (boot once with SKIP_SEED=1 against the target DB). Then:
//   DATABASE_URI=... npx tsx scripts/migrate-projects.mts
//
// Safe to run against an empty-projects DB only; it aborts if projects exist.

// MUST be set before getPayload so onInit's seed() no-ops — otherwise booting
// Payload here would run the full seed and overwrite user-edited globals.
process.env.SKIP_SEED = "1";

import { getPayload } from "payload";
import config from "@payload-config";
import { seedProjects } from "../lib/seed";

const payload = await getPayload({ config });

const { totalDocs } = await payload.count({ collection: "projects" });
if (totalDocs > 0) {
  console.error(`ABORT: projects table not empty (${totalDocs} docs). Refusing to duplicate.`);
  process.exit(1);
}

await seedProjects(payload);

const check = await payload.find({ collection: "projects", limit: 100, depth: 1 });
console.log(`RESULT created ${check.totalDocs} projects:`);
for (const p of check.docs as any[]) {
  console.log(`  - ${p.slug} · category=${p.category?.name} · role=${p.meta?.role}`);
}
process.exit(0);
