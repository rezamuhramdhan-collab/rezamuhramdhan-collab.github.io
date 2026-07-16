// Restore a single project by slug from the content modules (recovery tool).
// Runs in production mode so Payload does not attempt a schema push.
//   NODE_ENV=production DATABASE_URI=... PAYLOAD_SECRET=... \
//     npx tsx scripts/restore-project.mts <slug>

process.env.SKIP_SEED = "1";
import { getPayload } from "payload";
import config from "@payload-config";
import { toProjectDoc } from "../lib/seed";
import { getProjectBySlug } from "../content/projects";

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: restore-project.mts <slug>");
  process.exit(1);
}
const project = getProjectBySlug(slug);
if (!project) {
  console.error(`No content module for slug: ${slug}`);
  process.exit(1);
}

const payload = await getPayload({ config });

const existing = await payload.find({ collection: "projects", where: { slug: { equals: slug } }, limit: 1 });
if (existing.totalDocs > 0) {
  console.log(`SKIP: ${slug} already exists.`);
  process.exit(0);
}

// Resolve (or create) the category the project needs.
const catName = project.category;
const found = await payload.find({ collection: "categories", where: { name: { equals: catName } }, limit: 1 });
const categoryId =
  found.docs[0]?.id ??
  ((await payload.create({ collection: "categories", data: { name: catName } as never })) as { id: number | string })
    .id;

await payload.create({
  collection: "projects",
  draft: false,
  data: toProjectDoc(project, categoryId) as never,
});

const all = await payload.find({ collection: "projects", limit: 100 });
console.log(`RESULT restored ${slug}; projects now: ${all.totalDocs}`);
process.exit(0);
