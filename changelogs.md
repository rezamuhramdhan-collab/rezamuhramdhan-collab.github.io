# Changelog

All notable changes to this project. Newest first.

The site deploys continuously — there are no version numbers — so entries are
grouped by date. Changes before the v3 redesign are summarised by phase rather
than commit-by-commit; see `git log` for the full record.

Conventions: **Added** for new capability, **Changed** for altered behaviour,
**Fixed** for defects, **Removed** for things taken out, **Infra** for build,
deploy, and database work.

---

## 2026-08-04

### Removed

- **Stray npm install at the repository root.** `package.json`,
  `package-lock.json`, and `node_modules/` at the root declared a single
  dependency, `@vercel/speed-insights`, that is only imported from
  `site/app/(site)/layout.tsx` and is already declared in `site/package.json`.
  Nothing at the root level is a Node project — the app lives entirely in
  `site/`, and CI installs with `working-directory: site` — so the root
  manifest was unused. Committed by accident in `de2a35d`.
- Deleted the `.DS_Store` files left in the working tree. They were already
  covered by `.gitignore` and never tracked.

### Fixed

- **The `portfolio-qa` skill now loads.** `docs/QA_Engineer.md` carried the
  `name: portfolio-qa` skill frontmatter but sat in `docs/`, where no agent
  reads it, while `.agents/skills/portfolio-qa/` held no `SKILL.md` at all.
  Moved the playbook to `.agents/skills/portfolio-qa/SKILL.md`.
- **De-staled the QA playbook.** It still described Turso as the hosted
  database and documented a manual "boot dev against prod" migration that CI
  now performs via `scripts/push-schema.mts`. Rewrote the schema protocol
  around Supabase, recorded the non-additive-push CI hang as a named failure
  mode, corrected the deploy secrets (`DATABASE_AUTH_TOKEN` is gone,
  `BLOB_READ_WRITE_TOKEN` matters), repointed "root-level HTML files" at
  `prototypes/`, and retired four QA-debt items that are already fixed in the
  code (`PAYLOAD_SECRET` hard-fail, `nextProjectSlug` rendering, `payload.db`
  gitignored, `(site)` error/not-found pages).
- **README repository layout.** The `docs/` row named three of the six docs and
  called the v3 redesign "in-progress"; the `prototypes/` row still framed
  `v3-landing.html` as pending design review. v3 has shipped. Also added a row
  for `.agents/skills/`, which was undocumented.

---

## 2026-08-02

### Changed

- **Experience entries render as bullet lists.** Each line of an entry's
  `description` (or of its rich `content`) is now its own bullet. The v3 row
  previously showed a single line, so only the first achievement of each role
  was visible — the rest was in the CMS but never rendered. Markers are 4px
  muted dots at 55% opacity; a `--line` dot would be near-invisible on paper,
  and v3 has no accent colour. Text keeps the design's 544px measure rather
  than filling the 918px row.
- **Hero buttons revised.** The secondary is now an outlined button (1px
  `--line`, 20px inline padding) instead of a bare ghost link, so it reads as a
  peer of the primary. Row gap 28px → 16px.
- **All buttons take a plain right arrow.** `buttonIcons.arrow` switched from
  the diagonal `ArrowUpRight` to `ArrowRight`. The diagonal now appears only
  inside the circled "read case study" mark and on case-study links.
- `content/experience.ts` now mirrors the LinkedIn profile (6 / 5 / 2 bullets).
- **Hero illustration replaced** with the revised layered stack: four isometric
  planes growing toward the base, joined by dashed risers, over a lighter grid.
  Geometry transcribed from the Paper source rather than traced from an image.
  The grid is a `<pattern>` instead of the 42 individual strokes the design
  export emits, and the planes are generated from a small data array — the
  export was 17KB of repeated paths.

### Fixed

- **The hero image set in the CMS did nothing.** `hero.portrait` was only read
  by `layout.tsx` for the Open Graph/Twitter card — no component rendered it,
  so uploading an image saved but changed nothing on the page. The hero now
  renders the uploaded image in place of the built-in illustration, and the
  admin field says so. The image is rendered flush like the illustration it
  replaces — an earlier attempt gave it a `--fill` panel and radius, which
  showed through the transparent areas of an exported illustration and read as
  a card.

### Added

- `site/scripts/sync-experience.mts` — pushes the experience copy from the
  fixture into the CMS. Unlike `fill-v3-fields.mts` it **overwrites**, so it
  prints a per-entry diff and is dry-run by default. Entries are matched on
  company name; anything unmatched is reported, not touched.

### Removed

- **The About "Download Resume" button.** The v3 design ends that section on
  the fact list, so the button was a v2 carry-over. The nav's Résumé button is
  untouched — it remains the only route to the file.
- `about.resumeButton` is hidden in the CMS rather than dropped, keeping the
  schema push additive; its data is preserved and the field can be un-hidden if
  the button ever returns.
- `.about-body`'s `align-items: flex-start` and the `> p { align-self: stretch }`
  that compensated for it: both existed only to stop that button spanning the
  column.

### Notes

- Authored numbering (`1. `, `2) `) is stripped from bullets so it cannot
  double up with the rendered marker — LinkedIn copy-paste carries those.
- Outline buttons use 9px block padding, not the 12px the design file reports:
  12 renders 45.5px tall against the primary's 39.5, but the design frames both
  at 40 and the reference screenshot shows them equal. The file's padding and
  frame height disagree; the frame is what renders. Horizontal padding of 20
  reproduces the drawn 132px width exactly, so only the vertical was adjusted.

---

## 2026-08-01

### Changed

- **Landing page redesigned to v3 "Paper Swiss"** — replaces the v2 Editorial
  Dark system. Specified in [`docs/desain.md`](docs/desain.md), read from the
  Paper artboard `1-0` (Figma frame `179:7` secondary).
  - Palette inverts to paper (`#f4f4f2`) on ink (`#111`). **No accent hue
    exists in this system** — emphasis is weight, size, and the ink/muted
    split.
  - Archivo (display) + Instrument Sans (body) replace Playfair + Manrope;
    DM Mono carries over at 11px / `0.14em`. Both new faces self-hosted.
  - Tracking and line-height are per-role constants, not per-size: display
    `-0.045em` / `0.92`, semibold labels `-0.025em`, mono `0.14em`.
  - One content grid: 1152 max, 36 padding, **1080 of content**. Every track in
    the design resolves to 1080.
  - Sections: hero with an isometric wireframe, four-up Approach strip, divided
    work list, Experience rows, About, and an ink contact card with an
    underline-only form.
- **Case-study and All-Projects templates re-skinned, layout untouched.**
  `globals.css` keeps the v2 token names as aliases onto v3 values
  (`--bg`→paper, `--fg`/`--accent`→ink, `--panel`→surface), so those templates
  changed appearance with no layout edits.
- **About fact list moved into the copy column** — two terms across, split at
  exactly 50%, between hairlines. It previously sat stacked under the portrait.
- The work index (`/work`) now shares the homepage's divided list; the 2-up
  card grid no longer exists in the design system.
- Footer is two mono lines; v2's giant ghost signature is gone with the
  display-italic "second voice" pattern it belonged to.

### Added

- [`docs/desain.md`](docs/desain.md) — the v3 visual language reference, with
  the exact type scale, the v2→v3 token mapping, and the accent re-spec.
- [`prototypes/v3-landing.html`](prototypes/v3-landing.html) — static prototype
  built to the spec for design review before implementation.
- `site/scripts/fill-v3-fields.mts` — populates the fields v3 introduced for a
  database whose content predates it. Dry-run by default, idempotent, and
  writes only where a field is currently empty.
- CMS: `projects.tags` (pill row on work rows) and `about.subheading` (the
  large display line beside the portrait). Both additive.
- `lexicalToLines` in `lib/lexical.ts` — flattens a rich-text editor state to
  one plain line per paragraph or list item.

### Fixed

- **Experience rows rendered with no copy.** Real CMS entries keep their text
  in the rich `content` field and leave the legacy `description` empty, but the
  v3 row only read `description`.
- **The nav wordmark was invisible.** The uploaded logo is near-white
  (`#fbfbfa`), drawn for the v2 dark theme, and a logo image replaced the whole
  wordmark — so on the paper chip it vanished and the name did not render
  either. The dark monogram tile is now always present and carries the logo.
- Horizontal overflow below 480px: grid items default to `min-width: auto`, so
  the 562px hero illustration refused to shrink.
- The About résumé button rendered as an empty dark pill when its label was
  blank.
- Three case-study rules had hardcoded darks that bypassed the tokens and
  survived the re-skin: `.topbar`, `.img-placeholder`, `.hero-photo`.

### Removed

- The service accordion (`ServiceAccordion.tsx`) — replaced by the Approach
  strip.
- Section eyebrows on the landing page; v3 opens sections directly on the
  heading.

### CMS

Nothing was deleted — dropping a column makes drizzle push prompt
*"created or renamed?"* and hang CI, so fields the design no longer uses are
`admin: { hidden: true }` instead.

- **Revived** (already in the schema, hidden as deprecated v1): `services.icon`,
  `hero.secondaryCta`, `hero.socialLinks`.
- **Hidden**: `hero.portfolioTag`, `contact.eyebrow`, `contact.location`,
  `contact.availability`, `services.tags`.
- **Kept despite being invisible**: `hero.eyebrow` feeds JSON-LD `jobTitle`;
  `hero.portrait` is the OG/Twitter share image.
- `about.locationTag` and `about.skills` render as the "Based in" and "Tools"
  rows. Their names no longer match their labels, but renaming a column is
  exactly the non-additive change that hangs CI, so only the admin
  descriptions were updated.

### Infra

- Deployed to both targets: GitHub Pages (rezamuhramdhan-collab.github.io) via
  the Actions workflow, and Vercel (designbyreza.com) via `npx vercel --prod`.
  The Supabase schema push ran clean, with no drizzle prompt.
- **Local `payload.db` repaired.** It was a v1-era database from 2026-07-16
  that had never been migrated: `hero` still held v1 fields (`greeting`,
  `role_highlight`, `profile_card_*`) and lacked `eyebrow`, `first_name`,
  `last_name`, `portfolio_tag`; `about` lacked `location_tag`. Payload's SQLite
  recreate-and-copy failed on the missing columns on every boot, breaking
  `npm run build` before Next even started. Fixed by adding the six columns,
  dropping an orphaned `__new_hero` table, and backfilling v1 values onto the
  v3 fields.

---

## 2026-07-24 → 2026-07-25 — v2 polish

Accessibility and performance passes on the Editorial Dark design: colour
contrast fixes, critical-CSS and modern-JavaScript optimisation, and removal of
a duplicate public document request. Interaction and spacing refinements —
hover-only homepage navigation, active navbar states, hero bio dimensions, a
contact service dropdown chevron.

## 2026-07-22 → 2026-07-23 — v2 "Editorial Dark"

The previous redesign: a dark theme on Playfair Display / DM Mono / Manrope
with an `#ff4020` accent, implemented across the homepage and case-study
template. Added the all-projects index page, sticky homepage navigation, active
case-study navigation, and a service accordion. Extended the CMS schema and
data layer for the new design, keeping the schema push additive by retaining v1
fields hidden — the convention the v3 work followed. Backfilled v2 structural
content on the hosted database through a manual workflow. Consolidated the QA
playbook and PRD into `docs/`.

## 2026-07-20 — Domain and infrastructure

Pointed the canonical `SITE_URL` at the designbyreza.com custom domain, served
the header logo through `next/image`, bumped GitHub Actions to Node 24
runtimes, and added a manual position field for the Featured Work grid.

## 2026-07-16 — Turso → Supabase

Migrated the database from Turso/libSQL to Supabase Postgres, enabling row
level security on all public tables after every schema push. Optimised images
with `next/image` (priority LCP hints, CLS-safe sizing) and moved the sitemap to
a build-generated static file.

## 2026-07-10 → 2026-07-12 — SEO, security, and architecture

Implemented SEO: sitemap, robots, canonicals, Open Graph, and JSON-LD, plus a
Search Console verification file. Added password-locked case studies with
build-time encryption, and a pre-deploy schema push that runs in CI before the
Pages build. A SOLID refactor introduced a typed CMS boundary, exhaustive block
handling, and focused modules, documented in `docs/`. Media moved to direct
Vercel Blob URLs. Added a rich-text editor for experience descriptions.

## 2026-07-04 → 2026-07-08 — Foundations

The initial build: a static-pages portfolio rebuilt as a CRUD-driven
Next.js + Payload application. GitHub Pages deployment via static export, the
admin hosted on Vercel, uploads persisted to Vercel Blob, and an uploadable
header logo, favicon, and hero portrait. Flexible case-study sections with
categories and mandatory fields, a Lexical rich-text editor across blocks,
scroll-reveal animations, and a mobile breakpoint.
