# Master PRD: Dynamic Portfolio Platform (CRUD-Driven)

**Owner:** Reza Ramdhan
**Type:** Portfolio site rebuild
**Status:** Draft v1
**Scope:** Homepage + Case Study detail pages, fully content-managed

---

## 1. Problem

The entire portfolio — homepage and every case study page — is hardcoded. Editing the hero, adding a project, updating experience, or writing a new case study all require touching code and redeploying. This is slow, duplicative, and makes the "available for new projects" positioning hard to keep current. Every new project today means a duplicated page and hand-edited HTML.

## 2. Goal

Make the whole portfolio data-driven and CRUD-managed. Every section of the homepage and every block of a case study is editable from a data layer / admin — never from layout code. Critically, **one `Project` entity powers both the homepage Featured Work card and its full case study detail page**, so there's no duplicate data entry.

## 3. Success Metrics

- Any homepage section editable without touching component code.
- Add/edit/reorder/delete a project, experience entry, or service card in under 2 minutes.
- A new case study is built entirely from data — zero new page code.
- Featured Work card and case study page stay in sync automatically (single source).
- Reordering (projects, timeline, case-study blocks) is drag-based, no code change.
- Publishing an edit updates the live site without a manual redeploy.

---

## 4. Unified Data Model

The site splits into **singletons** (one record, edit-only) and **collections** (full CRUD + reorder). The `Project` collection is the backbone — it feeds both surfaces.

### 4.1 Singletons (Update only)

**Site Settings** — `logoText`, `navLinks[]`, `ctaButton`, `availabilityBadge`, `footerText`, `footerLinks[]`, plus global case-study defaults (`backLink`, `ctaFooter`).

**Hero** — `greeting`, `roleHighlight`, `bio`, `primaryCta`, `secondaryCta`, `socialLinks[]`, `heroImage`, `profileCard` (name, subtitle, avatar).

**About** ("I design products…") — `headline`, `paragraphs[]`, `yearsExperience` (drives "over 6 years" so it auto-updates).

**CTA** ("Let's build something great") — `headline`, `subtext`, `buttons[]`.

### 4.2 Collections (full CRUD + reorder)

**What I Do** — each card: `id`, `icon`, `title`, `description`, `order`. Supports N cards.

**Experience** — each entry: `id`, `period`, `role`, `company`, `companyLink`, `description`, `order`, `isCurrent`.

**Project** ★ core — powers homepage card **and** detail page:

```
Project {
  // Card fields (homepage grid)
  id, slug, title, category, year, thumbnail, featured, order,

  // Detail header
  categoryTags[], summary, metaGrid[],   // metaGrid = N key/value pairs: Role, Scope, Platform, Timeline
  heroImage,

  // Detail body — ordered array of content blocks
  sections[],

  // Meta
  status (draft | published),
  nextProjectSlug?   // related-project link, auto if empty
}
```

### 4.3 Case Study Section Blocks (CRUD within a Project)

The case study body is an ordered array of typed blocks; the template switches rendering on `type`. This is what makes each case study fully CRUD-able.

| Block type | Renders | Fields |
|---|---|---|
| `richText` | Overview, Design Strategy | `heading?`, `paragraphs[]` |
| `bulletList` | Problem Statement, Goals | `heading?`, `items[]`, `style` (bullet/check/arrow) |
| `hmwGrid` | How Might We cards | `heading`, `cards[]` (number, text) |
| `stepBlock` | Solution 1–5 | `stepNumber`, `title`, `bullets[]` (1-level nesting), `image?` |
| `twoColumn` | Validation & Iteration | `heading`, `leftTitle`, `leftItems[]`, `rightTitle`, `rightItems[]` |
| `impactCallout` | Impact & Results + Business Benefits box | `heading`, `items[]`, `calloutTitle`, `calloutItems[]` |
| `reflection` | Reflection + Key Learnings | `heading`, `paragraphs[]`, `learningsTitle`, `learnings[]` |
| `image` | Standalone image | `src`, `caption?`, `alt` |

`ctaFooter` and back-link inherit from Site Settings, overridable per project.

---

## 5. CRUD Matrix

| Entity | Create | Read | Update | Delete | Reorder |
|---|:---:|:---:|:---:|:---:|:---:|
| Site Settings | — | ✓ | ✓ | — | — |
| Hero | — | ✓ | ✓ | — | — |
| About | — | ✓ | ✓ | — | — |
| CTA | — | ✓ | ✓ | — | — |
| What I Do | ✓ | ✓ | ✓ | ✓ | ✓ |
| Experience | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Project** | ✓ | ✓ | ✓ | ✓ | ✓ |
| Project → meta pairs | ✓ | ✓ | ✓ | ✓ | ✓ |
| Project → section blocks | ✓ | ✓ | ✓ | ✓ | ✓ |
| Block → items | ✓ | ✓ | ✓ | ✓ | ✓ |

Singletons are edit-only. Collections get the full set plus drag-to-reorder. The Project editor needs a **block builder**: add block → pick type → fill fields → drag to position; same pattern for items inside a block.

---

## 6. Behavior & Routing

- **Homepage** renders all sections from data. Featured Work grid = `Projects where featured == true, sort by order`.
- **Case study** route: `/work/[slug]`, statically generated via `generateStaticParams`, revalidated on publish.
- Clicking a Featured Work card → `/work/[project.slug]`.
- Case-study tab nav (Overview/Problem/Solution/Impact) scroll-links to section anchors, auto-derived from headings and overridable.
- Draft projects: viewable by preview link, excluded from the public grid.
- Schema-level validation (required `title`, `slug`, `order`) blocks broken records from publishing.

---

## 7. Recommended Architecture

Given the React/Tailwind stack and the need for real CRUD:

- **Frontend:** Next.js (App Router). Sections and case studies read from the data layer. Static-generated with on-demand revalidation so publishes go live without a full redeploy.
- **Data + CRUD backend — pick one:**
  - **Headless CMS (recommended, least build):** Sanity or Payload — admin UI, image uploads, reordering, draft/publish out of the box. Maps cleanly to the singleton/collection split.
  - **Custom (most control):** Supabase/Postgres + a protected `/admin`. More effort, fully yours.
- **Media:** image field type for thumbnails, hero images, avatars, step images — with automatic optimization and lazy-loading (case studies are image-heavy).
- **Components:** one `<CaseStudy>` renderer maps over `sections[]` and switches on block `type`. Homepage grid and detail page share the same `Project` source.

---

## 8. Admin UX

- **Dashboard** mirrors the site: Hero · Featured Work · What I Do · Experience · About · CTA · Settings.
- **Collections** show a list with add / edit / delete / drag-reorder.
- **Project editor:** two panels — Header/Meta form + Sections block-builder. Each block expands to its type-specific form; drag to reorder.
- **Draft vs. Published** toggle to stage changes; live preview link.

---

## 9. Phases

1. **Model + read path** — define all schemas, build the block components + `<CaseStudy>` renderer, migrate current content (homepage sections + Bank Saqu as reference). Site looks identical but is data-driven.
2. **Routing** — `/work/[slug]` live, wired from Featured Work cards.
3. **Collections CRUD** — Projects, What I Do, Experience: create/edit/delete/reorder. Project block-builder for case-study sections.
4. **Singletons + settings** — Hero, About, CTA, Site Settings editing.
5. **Polish** — draft/publish, image optimization, validation, tab-nav anchors, related-project link, live preview.

---

## 10. Open Questions

- **CMS vs. custom** — Sanity/Payload (configure) vs. Supabase admin (build)? Drives everything downstream.
- **Rich text** — WYSIWYG inside `richText` blocks, or structured fields only?
- **Nesting depth** — cap sub-bullets at one level (matches current design) or allow deeper?
- **Section types** — lock to the block types above, or allow custom block types later?
- **Staging** — draft/publish workflow, or direct-edit-to-live for v1?
- **Collaborators** — single admin (just you) or room for others? (affects auth choice)
