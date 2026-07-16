# Reza Ramdhan — Portfolio

Product-design portfolio: a Next.js site with a Payload CMS admin, published
as a static export to GitHub Pages with the admin running on Vercel.

## Repository layout

| Path | What it is |
|---|---|
| [`site/`](site/) | The application — Next.js 15 (App Router) + Payload CMS 3 (Supabase Postgres hosted, SQLite locally). All active development happens here. |
| [`docs/`](docs/) | Engineering docs: SOLID research reference and the codebase audit. |
| [`prototypes/`](prototypes/) | The original hand-written static HTML mockups (pre-CMS Phase 1). Kept for reference; the seed content in `site/content/` was derived from them. Not deployed. |
| [`.github/workflows/`](.github/workflows/) | CI: schema migration + static build + GitHub Pages deploy on every push to `main`. |

## The two deployments

| | GitHub Pages | Vercel |
|---|---|---|
| URL | rezamuhramdhan-collab.github.io | rezadesign.vercel.app |
| What runs | Static export (`site/out`) — no server, no admin | Full app including `/admin` and the Payload API |
| Content updates | On push to `main` or manual workflow run | Immediately (publish hooks revalidate) |
| Deploy trigger | `git push` → Actions workflow | `npx vercel --prod` from `site/` (no Git integration) |

Both read the same hosted Supabase Postgres database, so content edited in
the Vercel admin appears on Pages after the next workflow run.

## Working on the site

```bash
cd site
npm run dev          # local dev against the local payload.db (seeded fixtures)
npm run build        # production build
npx tsc --noEmit     # typecheck
```

Local dev uses the committed-adjacent `payload.db` SQLite file (gitignored,
seeded from `content/` fixtures on first boot); production data lives in
Supabase Postgres (`DATABASE_URI`), whose connection string exists only in CI
secrets and Vercel env. The adapter is picked per environment in
`payload.config.ts`: a `postgres://` URI selects Postgres, anything else
falls back to the local file.

### Schema changes

Adding fields to `payload.config.ts` requires matching columns in production.
The CI workflow runs [`site/scripts/push-schema.mts`](site/scripts/push-schema.mts)
before every Pages build — it boots Payload in dev mode so drizzle push syncs
the schema (additive-safe). Destructive changes (dropped/renamed columns)
should be applied manually against Supabase first.

### Useful scripts (`site/scripts/`)

- `push-schema.mts` — pre-deploy production schema sync (run by CI)
- `export-content.mts`, `import-content.mts` — full content move between
  databases (used for the Turso → Supabase migration)
- `dev-lock-project.mts` — lock/unlock a project's password gate locally
- `migrate-projects.mts`, `restore-project.mts` — one-off content migrations
