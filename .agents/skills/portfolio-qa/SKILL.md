---
name: portfolio-qa
description: QA and verification playbook for this portfolio (Next.js + Payload CMS in site/). Use before committing, after any schema/field change in payload.config.ts, before deploying to Vercel or GitHub Pages, when the admin or a page breaks, or when adding tests. Encodes the verification commands, the Supabase schema-migration protocol, known failure modes with fixes, and the project's testing standards.
---

# Portfolio QA Playbook

The live app is `site/` (Next.js 15.4 App Router + Payload 3.85 embedded, SQLite
locally / Supabase Postgres hosted). The adapter is chosen in `payload.config.ts`
by the `DATABASE_URI` scheme: a `postgres://` URI selects `postgresAdapter`,
anything else falls back to the local `payload.db` file.

The HTML files in `prototypes/` are **static mockups, never deployed** — editing
them changes nothing on the live site.

## Data flow (what a change actually touches)

```
site/content/*.ts (seed fixtures, run once on empty DB)
      └─ lib/seed.ts  (toBlock / toProjectDoc)   ← must mirror ↓
site/payload.config.ts (schema: collections, globals, blocks)
      └─ SQLite: payload.db (dev) / Supabase Postgres (prod)
site/lib/data.ts (fromBlock / fromProjectDoc — the ONLY module that knows CMS shapes)
      └─ components (typed by content/types.ts)
```

A schema change is never one file: **payload.config.ts + types.ts + data.ts + seed.ts move together.**
The mappers (`toBlock`/`fromBlock`) are mirror images — if you change one, change the other.

## Verification commands (run from `site/`)

```bash
npx tsc --noEmit                 # typecheck (strict; must stay clean)
npm run build                    # server build — catches query/schema errors at page collection
# Static-export build (GitHub Pages path). NEVER run while dev server is up (corrupts .next):
mv "app/(payload)" /tmp/pb && STATIC_EXPORT=1 npm run build; mv /tmp/pb "app/(payload)"
```

Smoke test (dev or `next start`):

```bash
curl -s -o /dev/null -w "%{http_code}" localhost:3000/                      # 200
curl -s -o /dev/null -w "%{http_code}" localhost:3000/work/bank-saqu-homepage-revamp  # 200
curl -s -o /dev/null -w "%{http_code}" localhost:3000/admin/login           # 200 + HTML contains "email"
curl -s -o /dev/null -w "%{http_code}" localhost:3000/work/nonexistent      # 404
```

An admin page that returns 200 but renders blank is NOT healthy — check for
`getFromImportMap` errors (see failure modes). Note: Payload renders the login
form client-side, so the SSR HTML never contains a literal `<form` tag even when
healthy — check for the "email" field marker instead (verified against the
known-good hosted admin).

## Schema change protocol

**Local:**
1. Back up affected data first: `sqlite3 payload.db "SELECT ..." > /tmp/backup.txt`
2. Destructive changes (drop column/table): pre-drop manually via `sqlite3` —
   drizzle's dev push prompts interactively on data loss and will hang a non-TTY session.
3. Kill dev fully (see zombie ports below), `rm -rf .next`, restart dev, hit any page
   → Payload pushes the new schema on init. Verify: `sqlite3 payload.db "SELECT name FROM pragma_table_info('<table>');"`
4. Restore/transform backed-up data via SQL (remember the versions table `_projects_v`
   mirrors project columns as `version_<name>`).
5. Update seed.ts + data.ts mappers + types.ts, then run all verification commands.

**Production (Supabase Postgres):** CI owns the migration. The Pages workflow runs
`site/scripts/push-schema.mts` before every build, which boots Payload with `NODE_ENV`
unset so drizzle push syncs the schema. It is a no-op when already in sync.

**The push must stay additive.** Drizzle prompts interactively on anything lossy
(dropped or renamed column, narrowed type) and CI has no TTY — the job hangs until
it times out rather than failing fast. So:
1. Additive changes (new field/collection) — just push to `main`; CI handles it.
2. Destructive or renaming changes — apply them manually against Supabase *first*
   (SQL console or `psql "$DATABASE_URI"`), back up affected rows before you do,
   *then* land the code so the CI push sees an already-matching schema.
3. Deploy Vercel (`npx vercel --prod --yes`), verify hosted `/admin/login` and pages.

**Schema drift is the #1 recurring hazard**: local `payload.db` and Supabase diverge
whenever local-first development happens, and a stale local DB fails `npm run build`
with a schema mismatch that predates any code change. Build against a throwaway
`DATABASE_URI` (or delete `payload.db` and let it reseed) rather than debugging the
local file. Before ANY production deploy, spot-check that a newly added column exists
in Supabase.

## Known failure modes → fixes

| Symptom | Cause | Fix |
|---|---|---|
| /admin renders blank, logs show `getFromImportMap` | Admin client component missing from import map (e.g. after adding a Payload plugin) | `npx payload generate:importmap`, redeploy |
| `Cannot find module './vendor-chunks/...'` | `.next` corrupted by running two builds/servers against it | kill all next processes, `rm -rf .next`, restart |
| Dev starts on port 3001 / stale behavior on 3000 | zombie next-server processes | `pkill -9 -f "next dev"; pkill -9 -f next-server; lsof -ti :3000 | xargs kill -9` |
| Build queries the hosted DB unexpectedly / missing-table errors in a prod-mode build | stray `.env.production.local` (or similar) overriding DATABASE_URI | delete it; Vercel owns prod env vars |
| CI `Push schema to database` step hangs until timeout | drizzle hit a lossy change and is waiting on an interactive prompt with no TTY | apply that change manually against Supabase first, then re-run — see the schema protocol above |
| `CREATE INDEX ... already exists` on first request | two dev workers racing the schema push | restart dev once; harmless afterwards |
| Payload CLI fails with `ERR_REQUIRE_ASYNC_MODULE` | package must stay `"type": "module"` | don't remove it |
| New admin-created project 404s | slug not URL-safe or route param restriction | slugs auto-slugify on save; never reintroduce `dynamicParams = false` (static export doesn't need it) |

## Testing standards (adopted from 2026 SQA research)

- **Pipeline gate**: typecheck + build + tests must pass in CI *before* any deploy job.
  Keep the whole pipeline under ~10 minutes.
- **Unit (Vitest)**: highest-value targets are the mapper round-trips
  (`toBlock` → DB shape → `fromBlock` deep-equals the input), `slugify`, and
  publish-validation rules. These guard every future schema change.
- **E2E (Playwright)**: run against the **production build**, not dev. Pages here are
  async Server Components — prefer E2E over unit tests for them. Keep it to critical
  journeys: home grid → case study renders all sections; /admin/login shows a form;
  unknown slug 404s; publishing an incomplete project is blocked.
- **Accessibility**: run `@axe-core/playwright` in the same E2E pass (WCAG 2.2).
  Known open issue: `.meta-label` gray (#9CA3AF at 11px) fails AA contrast.
- **AI-authored code rule**: any AI-generated change to schema/mappers/renderer requires
  a passing round-trip test — do not rely on manual curl checks alone.
- Reserve manual testing for visual/UX judgment, not for regressions.

## Deploy targets & secrets

- **Vercel** (app + admin, instant updates): env `PAYLOAD_SECRET`, `DATABASE_URI`,
  `BLOB_READ_WRITE_TOKEN`. Deploy: `npx vercel --prod --yes` from `site/`.
- **GitHub Pages** (static mirror): `.github/workflows/deploy.yml` pushes the schema,
  strips `app/(payload)`, then builds with `STATIC_EXPORT=1`, reading Supabase via the
  repo secrets `DATABASE_URI` and `BLOB_READ_WRITE_TOKEN` (the blob token is what keeps
  media URLs from becoming `/api/media/file/...`, which 404s on Pages).
  Rebuilds on push to `main` or `gh workflow run deploy.yml`.
- Media uploads only persist via Vercel Blob (prod) — local `media/` is dev-only.
- Dev admin login (local, seeded only when NODE_ENV≠production): `reza@gmail.com` / `admin123`.
  Hosted admin uses the real account; never seed credentials into production.

## Open QA debt (verify before assuming fixed)

- No automated tests exist yet (Vitest/Playwright above are the plan, not reality).
- Draft-preview: `app/(site)/work/[slug]/page.tsx` reads `draftMode()`, but nothing
  enables it — no preview route exists, so the branch is unreachable.
- `next` pinned to `>=15.4.11 <15.5.0` by the Payload peer range, with an open
  high-severity advisory; upgrade path is Next 16.2.6+ when Payload allows it.
- `.meta-label` contrast (see Accessibility above) is still unfixed.

Resolved since this playbook was written — do not re-report:
`PAYLOAD_SECRET` now hard-fails in production (`payload.config.ts:291`);
`nextProjectSlug` is rendered via `lib/data.ts:333`; `payload.db` is gitignored,
not committed; `(site)` has both `error.tsx` and `not-found.tsx`.
