# Reza Ramdhan — Portfolio

Product-design portfolio: a Next.js site with a Payload CMS admin, published
as a static export to GitHub Pages with the admin running on Vercel.

## Repository layout

| Path | What it is |
|---|---|
| [`site/`](site/) | The application — Next.js 15 (App Router) + Payload CMS 3 (Supabase Postgres hosted, SQLite locally). All active development happens here. |
| [`changelogs.md`](changelogs.md) | Running history of every change, newest first. Updated alongside the code. |
| [`docs/`](docs/) | Reference docs, none of them load-bearing for the build. [`desain.md`](docs/desain.md) is the v3 "Paper Swiss" visual language — the spec the live site is built to. [`PRD.md`](docs/PRD.md) is the redesign product brief. [`solid-architecture-research.md`](docs/solid-architecture-research.md) and [`solid-code-audit.md`](docs/solid-code-audit.md) are the SOLID reference and the audit of this codebase against it. [`seo-best-practices-research.md`](docs/seo-best-practices-research.md) is the search-visibility research behind the metadata work. |
| [`.agents/skills/`](.agents/skills/) | Skills shared across IDE agents. [`portfolio-qa/`](.agents/skills/portfolio-qa/) is the QA and deploy playbook for this repo; the rest are vendored [caveman](https://github.com/JuliusBrussee/caveman) skills, pinned by [`skills-lock.json`](skills-lock.json). |
| [`prototypes/`](prototypes/) | Static HTML mockups, not deployed. The original hand-written ones (pre-CMS Phase 1) are kept for reference — the seed content in `site/content/` was derived from them. [`v3-landing.html`](prototypes/v3-landing.html) is the most recent: the v3 "Paper Swiss" landing page built to [`docs/desain.md`](docs/desain.md) for design review. That direction has since shipped in `site/`, so the mockup is a reference, not a pending design. |
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
