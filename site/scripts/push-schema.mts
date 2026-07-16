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

// RLS backstop (Supabase): tables in the public schema are exposed through
// the PostgREST Data API. Enabling RLS with no policies denies the Data API
// roles (anon/authenticated) outright, while Payload is unaffected — it
// connects as the table-owning `postgres` role, which bypasses RLS. Runs
// after the push so tables created by this sync are covered too.
if (process.env.DATABASE_URI.startsWith("postgres")) {
  const { sql } = await import("drizzle-orm");
  const db = (payload.db as { drizzle: { execute: (q: unknown) => Promise<unknown> } }).drizzle;
  await db.execute(sql`
    do $$
    declare r record;
    begin
      for r in select tablename from pg_tables where schemaname = 'public' and not rowsecurity loop
        execute format('alter table public.%I enable row level security', r.tablename);
      end loop;
    end $$;
  `);
  console.log("RLS enabled on all public tables.");
}

const { totalDocs } = await payload.count({ collection: "projects" });
console.log(`Done. Target DB reachable — ${totalDocs} projects.`);
process.exit(0);
