// Sync the Payload schema to the target database before a static build.
//   DATABASE_URI=postgres://... PAYLOAD_SECRET=... npx tsx scripts/push-schema.mts
//
// Boots Payload in dev mode (NODE_ENV unset) so the adapter's drizzle push
// creates/updates tables — additive-safe and a no-op when already in sync.
// This replaced the hand-written ALTER list the Turso era needed: push
// introspection is reliable against Postgres, unlike libSQL. Destructive
// schema changes (dropped/renamed columns) should not ship through this
// path — handle those manually against Supabase first.

process.env.SKIP_SEED = "1";

if (!process.env.DATABASE_URI) {
  console.error("DATABASE_URI is required — refusing to guess a target database.");
  process.exit(1);
}

const { getPayload } = await import("payload");
const { default: config } = await import("@payload-config");

const payload = await getPayload({ config });
const { totalDocs } = await payload.count({ collection: "projects" });
console.log(`Done. Target DB reachable — ${totalDocs} projects.`);
process.exit(0);
