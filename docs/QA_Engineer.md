---
name: portfolio-qa
description: QA and verification playbook for this portfolio (Next.js + Payload CMS in site/). Use before committing, after any schema/field change in payload.config.ts, before deploying to Vercel or GitHub Pages, when the admin or a page breaks, or when adding tests. Encodes the verification commands, the Turso schema-migration protocol, known failure modes with fixes, and the project's testing standards.
---

# Portfolio QA Playbook

The live app is `site/` (Next.js 15.4 App Router + Payload 3.85 embedded, SQLite locally / Turso hosted).
The root-level HTML files are a **frozen legacy prototype** — never edit them to change the live site.

## Data flow (what a change actually touches)

```
site/content/*.ts (seed fixtures, run once on empty DB)
      └─ lib/seed.ts  (toBlock / toProjectDoc)   ← must mirror ↓
site/payload.config.ts (schema: collections, globals, blocks)
      └─ SQLite: payload.db (dev) / Turso (prod)
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

**Production (Turso):** prod never auto-pushes schema. To migrate:
1. Check for real user data first: `turso db shell portfolio "SELECT ..."` — anything
   uploaded/edited in the hosted admin since the last sync must be backed up and restored.
2. Push schema by booting dev against prod once:
   `DATABASE_URI=<libsql-url> DATABASE_AUTH_TOKEN=<token> npm run dev` → hit a page → kill.
3. Restore data via `turso db shell`.
4. Deploy Vercel (`npx vercel --prod --yes`), verify hosted /admin/login and pages,
   then push to git (triggers the Pages rebuild, which reads Turso via repo secrets).

**Schema drift is the #1 recurring hazard**: local payload.db and Turso diverge whenever
local-first development happens. Before ANY production deploy, confirm the prod schema
matches the code's expectations (spot-check a new column/table via turso shell).

## Known failure modes → fixes

| Symptom | Cause | Fix |
|---|---|---|
| /admin renders blank, logs show `getFromImportMap` | Admin client component missing from import map (e.g. after adding a Payload plugin) | `npx payload generate:importmap`, redeploy |
| `Cannot find module './vendor-chunks/...'` | `.next` corrupted by running two builds/servers against it | kill all next processes, `rm -rf .next`, restart |
| Dev starts on port 3001 / stale behavior on 3000 | zombie next-server processes | `pkill -9 -f "next dev"; pkill -9 -f next-server; lsof -ti :3000 | xargs kill -9` |
| Build queries Turso unexpectedly / `no such table` in prod-mode build | stray `.env.production.local` (or similar) overriding DATABASE_URI | delete it; Vercel owns prod env vars |
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
  `DATABASE_AUTH_TOKEN`, `BLOB_READ_WRITE_TOKEN`. Deploy: `npx vercel --prod --yes` from `site/`.
- **GitHub Pages** (static mirror): `.github/workflows/deploy.yml` builds with
  `STATIC_EXPORT=1`, strips `app/(payload)`, reads Turso via repo secrets
  `DATABASE_URI`/`DATABASE_AUTH_TOKEN`. Rebuilds on push or `gh workflow run deploy.yml`.
- Media uploads only persist via Vercel Blob (prod) — local `media/` is dev-only.
- Dev admin login (local, seeded only when NODE_ENV≠production): `reza@gmail.com` / `admin123`.
  Hosted admin uses the real account; never seed credentials into production.

## Open QA debt (verify before assuming fixed)

- No automated tests exist yet (Vitest/Playwright above are the plan, not reality).
- `payload.db` is committed but stale — CI reads Turso; candidate for removal from git.
- `PAYLOAD_SECRET` has an insecure fallback string; should hard-fail in production.
- `nextProjectSlug` is stored but no component renders it.
- Draft-preview (`draftMode()`) path exists but nothing enables it — unreachable.
- No `error.tsx` / branded `not-found.tsx` in the `(site)` route group.
- `next` pinned to 15.4.x by Payload peer range with an open high-severity advisory;
  upgrade path is Next 16.2.6+ when convenient.
