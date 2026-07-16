// Export all CMS content to a JSON file (step 1 of the Turso → Supabase
// migration; step 2 is import-content.mts). Runs in production mode so
// Payload never attempts a schema push against the source database.
//
//   DATABASE_URI=libsql://... DATABASE_AUTH_TOKEN=... PAYLOAD_SECRET=... \
//     npx tsx scripts/export-content.mts [outfile.json]
//
// Omit DATABASE_URI to export the local payload.db file instead.
//
// Not exported: users (password hashes aren't readable through the API —
// recreate the admin on import via ADMIN_EMAIL/ADMIN_PASSWORD or the
// first-user screen) and project version history (only the published state
// and the latest draft survive).

process.env.SKIP_SEED = "1";
(process.env as Record<string, string>).NODE_ENV = "production";

import { writeFileSync } from "fs";
import { getPayload } from "payload";
import config from "@payload-config";

const outfile = process.argv[2] || "content-export.json";
const payload = await getPayload({ config });

const findAll = async (collection: string, draft = false) =>
  (
    await payload.find({
      collection: collection as never,
      draft,
      depth: 0,
      pagination: false,
      overrideAccess: true,
      sort: "createdAt",
    })
  ).docs;

const orderable = async (collection: string) =>
  (
    await payload.find({
      collection: collection as never,
      depth: 0,
      pagination: false,
      overrideAccess: true,
      sort: "_order",
    })
  ).docs;

const globalSlugs = ["site-settings", "hero", "about", "cta"] as const;
const globals: Record<string, unknown> = {};
for (const slug of globalSlugs) {
  globals[slug] = await payload.findGlobal({ slug: slug as never, depth: 0, overrideAccess: true });
}

const data = {
  exportedAt: new Date().toISOString(),
  media: await findAll("media"),
  categories: await findAll("categories"),
  services: await orderable("services"),
  experience: await orderable("experience"),
  // Published state and latest state (which may be a newer draft) are
  // exported separately; import recreates published first, then drafts.
  projects: await orderable("projects"),
  projectsLatest: await findAll("projects", true),
  globals,
};

writeFileSync(outfile, JSON.stringify(data, null, 2));
console.log(
  `Exported to ${outfile}: ${data.media.length} media, ${data.categories.length} categories, ` +
    `${data.services.length} services, ${data.experience.length} experience, ${data.projects.length} projects.`,
);
process.exit(0);
