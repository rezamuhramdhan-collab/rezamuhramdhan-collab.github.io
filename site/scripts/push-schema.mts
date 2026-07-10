// Apply pending additive schema migrations to the target database.
//   DATABASE_URI=... DATABASE_AUTH_TOKEN=... npx tsx scripts/push-schema.mts
//
// Runs explicit idempotent ALTERs instead of drizzle push: push introspection
// is unreliable against Turso (it tries to recreate indexes that already
// exist). When adding fields to payload.config.ts, add the matching ALTERs
// here (column names per the drizzle snake_case schema — check payload.db
// with `.schema <table>` after a local dev boot).

import { createClient } from "@libsql/client";

const MIGRATIONS: string[] = [
  // 2026-07: password-locked case studies (locked + password on projects)
  "ALTER TABLE `projects` ADD COLUMN `locked` integer DEFAULT false",
  "ALTER TABLE `projects` ADD COLUMN `password` text",
  "ALTER TABLE `_projects_v` ADD COLUMN `version_locked` integer DEFAULT false",
  "ALTER TABLE `_projects_v` ADD COLUMN `version_password` text",
];

const url = process.env.DATABASE_URI;
if (!url) {
  console.error("DATABASE_URI is required — refusing to guess a target database.");
  process.exit(1);
}

const client = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });

for (const sql of MIGRATIONS) {
  try {
    await client.execute(sql);
    console.log(`applied: ${sql}`);
  } catch (err) {
    const message = String(err);
    if (message.includes("duplicate column name")) {
      console.log(`already applied: ${sql}`);
    } else {
      console.error(`FAILED: ${sql}\n${message}`);
      process.exit(1);
    }
  }
}

const check = await client.execute("SELECT COUNT(*) AS n FROM projects");
console.log(`Done. Target DB reachable — ${check.rows[0].n} projects.`);
process.exit(0);
