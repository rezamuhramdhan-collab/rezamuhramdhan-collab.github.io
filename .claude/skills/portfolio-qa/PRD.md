# Master PRD: Dynamic Portfolio Platform (CRUD-Driven)

**Owner:** Reza Ramdhan
**Type:** Portfolio site rebuild
**Status:** v2 — implemented through Phase 4; amended with content-flexibility requirements (2026-07-05)
**Scope:** Homepage + Case Study detail pages, fully content-managed

---

## 1. Problem

The entire portfolio — homepage and every case study page — is hardcoded. Editing the hero, adding a project, updating experience, or writing a new case study all require touching code and redeploying. This is slow, duplicative, and makes the "available for new projects" positioning hard to keep current. Every new project today means a duplicated page and hand-edited HTML.

## 2. Goal

Make the whole portfolio data-driven and CRUD-managed. Every section of the homepage and every block of a case study is editable from a data layer / admin — never from layout code. Critically, **one `Project` entity powers both the homepage Featured Work card and its full case study detail page**, so there's no duplicate data entry.

## 3. Success Metrics

- Any homepage section editable without touching component code. ✅
- Add/edit/reorder/delete a project, experience entry, or service card in under 2 minutes. ✅
- A new case study is built entirely from data — zero new page code. ✅
- Featured Work card and case study page stay in sync automatically (single source). ✅
- Reordering (projects, timeline, case-study blocks, images within a block) is drag-based, no code change. ✅
- Publishing an edit updates the live site without a manual redeploy. ✅ (Vercel instant; GitHub Pages on push / manual workflow run)

---

## 4. Unified Data Model

The site splits into **singletons** (one record, edit-only) and **collections** (full CRUD + reorder). The `Project` collection is the backbone — it feeds both surfaces.

### 4.1 Singletons (Update only)

**Site Settings** — `logoText`, `logoImage` (upload; replaces text logo when set), `favicon` (upload; browser tab icon), `navLinks[]`, `ctaButton`, `footerText`, `footerLinks[]`, plus global case-study defaults (`backLink`, `ctaFooter`).

**Hero** — `greeting`, `roleHighlight`, `bio`, `primaryCta`, `secondaryCta`, `socialLinks[]`, `portrait` (upload; built-in silhouette until set), `profileCard` (name, subtitle, avatar initial).

**About** ("I design products…") — `headline`, `headlineAccent`, `paragraphs[]`, `yearsExperience` (drives "over 6 years" so it auto-updates).

**CTA** ("Let's build something great") — `headline`, `headlineAccent`, `subtext`, `buttons[]`.

### 4.2 Collections (full CRUD + reorder)

**Categories** — `id`, `name` (unique). Referenced by projects; creatable inline from the project editor ("Add new" in the dropdown). Renaming a category updates every project using it.

**What I Do** — each card: `id`, `icon`, `title`, `description`, `order`. Supports N cards.

**Experience** — each entry: `id`, `period`, `role`, `company`, `companyLink`, `description`, `order`, `isCurrent`.

**Project** ★ core — powers homepage card **and** detail page:

```
Project {
  // Card fields (homepage grid)
  id, slug, title, category → Categories, year, thumbnail, featured, order,

  // Detail header (MANDATORY — see 4.4)
  summary,
  meta { role, scope, platform, timeline },   // fixed labels, values editable
  heroImage,

  // Detail body — ordered array of content blocks
  sections[],

  // Meta
  status (draft | published),
  nextProjectSlug?   // related-project link, auto if empty
}
```

**Slug rules:** URL-safe, auto-formatted on save (lowercase, hyphens; derived from `title` when left empty). Newly published projects render on demand — no redeploy needed for a new `/work/[slug]` to go live.

### 4.3 Case Study Section Blocks (CRUD within a Project)

The case study body is an ordered array of typed blocks; the template switches rendering on `type`. This is what makes each case study fully CRUD-able.

**Flexible images (all content blocks):** every block below that carries images holds an `images[]` array — add / remove / drag-reorder any number, each with `media` (upload), `alt`, `caption`, and a placeholder fallback — plus an `imageLayout` control:

| Layout | Renders |
|---|---|
| `full` (default) | stacked full-width below the text |
| `left` / `right` | images beside the text in a two-column split (stacks on mobile, text first) |
| `grid` | two-up image grid |
| `grid3` | three-up grid (gallery block only) |

| Block type | Renders | Fields |
|---|---|---|
| `richText` | Overview, Design Strategy | `heading?`, `paragraphs[]`, `items[]?`, `closingParagraphs[]?`, `images[]`, `imageLayout` |
| `bulletList` | Problem Statement, Goals | `heading?`, `intro?`, `items[]`, `style` (bullet/check/arrow), `images[]`, `imageLayout` |
| `hmwGrid` | How Might We cards | `heading`, `cards[]` (numbered by position) |
| `stepBlock` | Solution 1–N | `sectionHeading?` (first step), `stepNumber`, `title`, `description?`, `bullets[]`, `images[]`, `imageLayout` |
| `twoColumn` | Validation & Iteration | `heading`, `leftTitle`, `leftItems[]`, `rightTitle`, `rightItems[]`, `images[]`, `imageLayout` |
| `impactCallout` | Impact & Results + Business Benefits box | `heading`, `items[]`, `calloutTitle`, `calloutItems[]` |
| `reflection` | Reflection + Key Learnings | `heading`, `paragraphs[]`, `learningsTitle`, `learnings[]`, `pullQuote?` (text + accent phrase) |
| `image` | Standalone gallery | `images[]`, `imageLayout` (full / grid / grid3) |

`ctaFooter` and back-link inherit from Site Settings, overridable per project.

### 4.4 Mandatory Project Fields

A project cannot be **published** unless all of the following are filled (drafts are exempt — validation applies at publish):

- `title`, `slug` (auto-derived), `category`, `year`
- `summary`
- `meta` — all four Project Details values (**labels are fixed** — Role, Scope, Platform, Timeline — and cannot be edited, renamed, added, or removed; only values are editable)
- `thumbnail` — an uploaded image, or an explicitly selected built-in placeholder
- `heroImage` — an uploaded image, or the placeholder deliberately enabled

---

## 5. CRUD Matrix

| Entity | Create | Read | Update | Delete | Reorder |
|---|:---:|:---:|:---:|:---:|:---:|
| Site Settings | — | ✓ | ✓ | — | — |
| Hero | — | ✓ | ✓ | — | — |
| About | — | ✓ | ✓ | — | — |
| CTA | — | ✓ | ✓ | — | — |
| Categories | ✓ | ✓ | ✓ | ✓ | — |
| What I Do | ✓ | ✓ | ✓ | ✓ | ✓ |
| Experience | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Project** | ✓ | ✓ | ✓ | ✓ | ✓ |
| Project → Project Details values | — | ✓ | ✓ | — | — (fixed 4 labels) |
| Project → section blocks | ✓ | ✓ | ✓ | ✓ | ✓ |
| Block → items | ✓ | ✓ | ✓ | ✓ | ✓ |
| Block → images | ✓ | ✓ | ✓ | ✓ | ✓ |
| Media (uploads) | ✓ | ✓ | ✓ | ✓ | — |

Singletons are edit-only. Collections get the full set plus drag-to-reorder. The Project editor's **block builder**: add block → pick type → fill fields → drag to position; same pattern for items and images inside a block.

---

## 6. Behavior & Routing

- **Homepage** renders all sections from data. Featured Work grid = `Projects where featured == true AND status == published, sort by order`.
- **Case study** route: `/work/[slug]`. Published projects are statically generated; **newly published projects render on demand** (no redeploy). Slugs are always URL-safe (auto-slugified).
- Clicking a Featured Work card → `/work/[project.slug]`.
- Case-study tab nav (Overview/Problem/Solution/Results) scroll-links to section anchors, derived from block `anchor` fields.
- Draft projects: excluded from the public grid and public routes; viewable via Next.js draft mode / local dev. Drafts may be saved with incomplete mandatory fields; publishing enforces them.
- Schema-level validation (required `title`, `slug`, category, summary, Project Details, thumbnail, hero image) blocks broken records from publishing.
- **Every image on the site is replaceable by upload** (logo, favicon, hero portrait, project thumbnails, hero images, all section images). Neutral placeholders render until real assets are uploaded.

---

## 7. Architecture (decided & shipped)

- **Frontend:** Next.js (App Router) in `site/`. Sections and case studies read from the data layer through one module (`lib/data.ts`).
- **CMS:** Payload 3 embedded in the same Next.js app — admin at `/admin`, layout-only tabs in the Project editor (see §8). Import map generated via `payload generate:importmap`.
- **Database:** SQLite via `@payloadcms/db-sqlite` — local file (`payload.db`) in development, **Turso (hosted libSQL)** in production via `DATABASE_URI` + `DATABASE_AUTH_TOKEN`.
- **Media:** **Vercel Blob** storage in production (`BLOB_READ_WRITE_TOKEN`); local disk in development. Image fields support upload + alt + caption with placeholder fallback.
- **Hosting:**
  - **Vercel** — serves the app + hosted admin (`portfolio-umber-one-56.vercel.app`); admin edits are live instantly via on-demand revalidation.
  - **GitHub Pages** (`rezamuhramdhan-collab.github.io`) — static export built by GitHub Actions from the same hosted database (`STATIC_EXPORT=1`, Payload routes stripped in CI); rebuilds on push or manual workflow run.
- **Seed:** first boot of an empty database migrates all content from `site/content/` modules (plus a dev-only local admin user).
- **Components:** one `<CaseStudy>` renderer maps over `sections[]` and switches on block `type`; consecutive `stepBlock`s group into one section; section backgrounds alternate automatically.

---

## 8. Admin UX

- **Dashboard** mirrors the site: Projects · Categories · What I Do · Experience · Media · Globals (Hero, About, CTA, Site Settings).
- **Collections** show a list with add / edit / delete / drag-reorder.
- **Project editor — tabbed layout, mandatory-first:**
  1. **Required Info** — everything needed to publish in one tab: title, slug, category + year, summary, Project Details (fixed labels, paired rows), thumbnail, hero image.
  2. **Case Study Sections** — the block builder (add / reorder / delete blocks; images + layout per block).
  3. **Settings** — featured toggle, related-project override.
- **Category dropdown** supports inline "Add new" without leaving the project.
- **Draft vs. Published** toggle to stage changes; drafts skip mandatory-field validation until publish.

---

## 9. Phases

1. **Model + read path** — ✅ schemas, block components, `<CaseStudy>` renderer, content migrated; site data-driven.
2. **Routing** — ✅ `/work/[slug]` live, wired from Featured Work cards; on-demand rendering for new projects.
3. **Collections CRUD** — ✅ Payload admin: Projects, Categories, What I Do, Experience; block builder for case-study sections.
4. **Singletons + settings** — ✅ Hero, About, CTA, Site Settings editing; logo/favicon/portrait uploads.
5. **Polish** — ✅ draft/publish, validation, mandatory header/images, flexible image layouts, tab-nav anchors, related-project link. Remaining: image optimization pass, live preview links.

---

## 10. Open Questions → Resolutions

- **CMS vs. custom** — ✅ Payload (embedded, self-hosted; no external CMS service).
- **Database** — ✅ SQLite locally, Turso hosted in production.
- **Rich text** — structured fields only (paragraph arrays with `**bold**` spans); no WYSIWYG for now.
- **Nesting depth** — capped at one level (matches current design).
- **Section types** — locked to the block types in §4.3; new types are schema additions.
- **Meta grid** — resolved as **fixed four labels** (Role/Scope/Platform/Timeline). A custom fifth cell would be a schema change, accepted trade-off for consistency.
- **Staging** — draft/publish shipped; drafts exempt from mandatory validation until publish.
- **Collaborators** — single admin. Dev seeds a local-only account; production admin created manually.

### Still open

- Image optimization / responsive sizes for uploaded media (case studies are image-heavy).
- Live preview link for drafts from the hosted admin.
- Auto-rebuild schedule for the GitHub Pages mirror (currently push or manual trigger).
