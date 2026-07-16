// Import a content-export.json into a fresh Supabase/Postgres database
// (step 2 of the Turso → Supabase migration; step 1 is export-content.mts).
//
//   DATABASE_URI=postgres://... PAYLOAD_SECRET=... \
//     [ADMIN_EMAIL=... ADMIN_PASSWORD=...] \
//     npx tsx scripts/import-content.mts [infile.json]
//
// Runs in dev mode on purpose: booting Payload lets drizzle push create the
// Postgres schema on the empty database before rows are inserted. Media and
// category rows get new serial IDs, so every reference to them (upload
// fields, the project category relationship, lexical upload nodes) is
// remapped via old-ID → new-ID maps. Media files themselves stay in Vercel
// Blob — only the rows move, and the docs keep their filenames, which is all
// the blob storage plugin needs to resolve URLs.
//
// Refuses to run against a non-Postgres target or a database that already
// has content.

process.env.SKIP_SEED = "1";

import { readFileSync } from "fs";
import { getPayload } from "payload";
import config from "@payload-config";

const infile = process.argv[2] || "content-export.json";

if (!process.env.DATABASE_URI?.startsWith("postgres")) {
  console.error("DATABASE_URI must be a postgres:// connection string (the Supabase target).");
  process.exit(1);
}

type Doc = Record<string, unknown> & { id: number | string };
const data = JSON.parse(readFileSync(infile, "utf8")) as {
  media: Doc[];
  categories: Doc[];
  services: Doc[];
  experience: Doc[];
  projects: Doc[];
  projectsLatest: Doc[];
  globals: Record<string, Doc>;
};

const payload = await getPayload({ config });

for (const collection of ["projects", "media", "categories"] as const) {
  const { totalDocs } = await payload.count({ collection });
  if (totalDocs > 0) {
    console.error(`ABORT: target already has ${totalDocs} ${collection} docs. Refusing to duplicate.`);
    process.exit(1);
  }
}

const mediaMap = new Map<number, number | string>();
const categoryMap = new Map<number, number | string>();

// Field names that hold a media relationship anywhere in the config
// (upload fields + the two site-settings upload slots).
const MEDIA_KEYS = new Set(["media", "file", "logoImage", "favicon"]);
const SYSTEM_KEYS = new Set(["id", "_order", "globalType"]);

const isId = (v: unknown): v is number | string =>
  typeof v === "number" || typeof v === "string";

// Deep-remap media/category IDs and strip system keys. Lexical
// relationship/upload nodes carry { relationTo, value }.
function remap(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(remap);
  if (!node || typeof node !== "object") return node;
  const obj = node as Record<string, unknown>;
  if ("relationTo" in obj && "value" in obj && isId(obj.value)) {
    const map =
      obj.relationTo === "media" ? mediaMap : obj.relationTo === "categories" ? categoryMap : null;
    if (map) return { ...obj, value: map.get(Number(obj.value)) ?? obj.value };
  }
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SYSTEM_KEYS.has(key)) continue;
    if (MEDIA_KEYS.has(key) && isId(value)) out[key] = mediaMap.get(Number(value)) ?? value;
    else if (key === "category" && isId(value)) out[key] = categoryMap.get(Number(value)) ?? value;
    else out[key] = remap(value);
  }
  return out;
}

const stripped = ({ id: _id, _order: _o, ...rest }: Doc) => rest;

// Media: db-level create bypasses the upload handler (there's no file to
// re-upload — the binaries already live in Vercel Blob under `filename`).
for (const doc of data.media) {
  const created = (await payload.db.create({
    collection: "media",
    data: stripped(doc),
  })) as Doc;
  mediaMap.set(Number(doc.id), created.id);
}
console.log(`media: ${mediaMap.size} created`);

for (const doc of data.categories) {
  const created = await payload.create({ collection: "categories", data: stripped(doc) as never });
  categoryMap.set(Number(doc.id), created.id);
}
console.log(`categories: ${categoryMap.size} created`);

// Orderable collections were exported sorted by _order; sequential creation
// reassigns equivalent fractional order keys.
for (const collection of ["services", "experience"] as const) {
  for (const doc of data[collection]) {
    await payload.create({ collection, data: remap(stripped(doc)) as never });
  }
  console.log(`${collection}: ${data[collection].length} created`);
}

// Projects: recreate the published state first, then re-apply any newer
// draft on top (version history beyond that doesn't survive the move).
const projectIdBySlug = new Map<string, number | string>();
for (const doc of data.projects) {
  if (doc._status !== "published") continue;
  const created = await payload.create({
    collection: "projects",
    draft: false,
    data: remap(stripped(doc)) as never,
  });
  projectIdBySlug.set(String(doc.slug), created.id);
}
let drafts = 0;
for (const doc of data.projectsLatest) {
  if (doc._status !== "draft") continue;
  const body = remap(stripped(doc)) as Record<string, unknown>;
  const existingId = projectIdBySlug.get(String(doc.slug));
  if (existingId) {
    await payload.update({ collection: "projects", id: existingId, draft: true, data: body as never });
  } else {
    await payload.create({ collection: "projects", draft: true, data: body as never });
  }
  drafts++;
}
console.log(`projects: ${projectIdBySlug.size} published, ${drafts} draft states applied`);

for (const [slug, doc] of Object.entries(data.globals)) {
  const { createdAt: _c, updatedAt: _u, ...rest } = stripped(doc);
  await payload.updateGlobal({ slug: slug as never, data: remap(rest) as never });
  console.log(`global ${slug}: updated`);
}

if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
  await payload.create({
    collection: "users",
    data: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD } as never,
  });
  console.log(`admin user created: ${process.env.ADMIN_EMAIL}`);
} else {
  console.log("No ADMIN_EMAIL/ADMIN_PASSWORD set — create the admin via the /admin first-user screen.");
}

const check = await payload.find({ collection: "projects", limit: 100, depth: 1 });
console.log(`RESULT ${check.totalDocs} projects in target:`);
for (const p of check.docs as never as Array<{ slug: string; category?: { name?: string }; _status?: string }>) {
  console.log(`  - ${p.slug} · category=${p.category?.name} · status=${p._status}`);
}
process.exit(0);
