# PRD: Visual Redesign (Mermet-Inspired Design Language)

**Owner:** Reza Ramdhan
**Type:** Front-end visual redesign — presentation layer only
**Status:** v1 — direction validated via two high-fidelity mockups; not yet implemented in `site/`
**Scope:** Homepage + the case-study detail page template. No changes to the data model, CMS schema, hosting, or database — see [Non-goals](#7-non-goals).
**Design reference:** [`docs/design.md`](design.md) is the source of truth for tokens, type scale, and component treatments. This PRD covers *why*, *what*, and *in what order* — not the visual spec itself, to avoid two documents drifting out of sync.

---

## 1. Problem

The portfolio's CRUD platform (see git history for the superseded platform PRD — CMS, data model, both hosting targets) is shipped and stable. What it renders, visually, is a competent but generic product-portfolio look: safe type, safe spacing, nothing that reads as a deliberate point of view. For a *design* portfolio specifically, the site's own visual identity is part of the pitch — a templated-feeling shell undersells the work it's presenting.

The redesign direction was set by an explicit reference (Mermet, a sunscreen-fabric brand site) rather than left open: bold condensed type, neon-on-ink color blocking, plus-mark image badges, an oversized wordmark. That reference was translated — not copied — into a system suited to a product-design portfolio; see design.md's "What's deliberately not carried over" section for where the line was drawn.

## 2. Goal

Replace the current homepage and case-study visual treatment with the language defined in design.md, implemented as real components in `site/`, without touching the content model underneath. Every project, service, and experience entry that renders today must render under the new system with zero data migration.

## 3. Success Metrics

- Homepage and case-study template both implemented in `site/` using design.md's tokens (no hard-coded one-off colors/sizes outside the token set).
- Every existing project (all current block types — not just the ones the mockups happened to exercise) renders correctly under the new template. See §6 for the gap this closes.
- Lighthouse/Core Web Vitals do not regress versus the current production site (self-hosted variable fonts + any added imagery are the main risk — see §8).
- Both light and dark themes ship, matching design.md's token-based theming (no single-theme shortcut).
- Mobile nav and section layouts hold at 320px–1280px+ with zero horizontal overflow (measured, not eyeballed — see design.md's "recurring implementation traps").
- Old visual code (superseded component styles) fully removed, not left dead alongside the new system.

## 4. What's already done

Two static HTML mockups were built and iterated to validate the direction before touching production code:

- **Homepage** — hero, featured work grid, services, about + experience, closing CTA, footer. [Artifact](https://claude.ai/code/artifact/167fe3c3-71eb-429e-8818-39bd6811b80d)
- **Case-study detail page** — nav with anchor tabs, header + meta grid, hero image, full section body, closing CTA. Built from one real project's actual database content (`reducing-dormant-accounts-through-intent-based-onboarding`) so the content-to-layout fit was tested against real copy length, not lorem ipsum. [Artifact](https://claude.ai/code/artifact/a4fbf6f7-4126-4f71-a179-bc8911eee04f)

These mockups are throwaway reference implementations (standalone HTML, inlined fonts, no framework) — they exist to lock the design direction, not to be lifted into `site/` wholesale. Implementation means rebuilding the same visual result as real React components against the existing data layer.

## 5. Scope gap: block types not yet designed

The case-study mockup only exercised the `richText` block, because that's the only block type the one real project it was built from happens to use. The project schema (per the platform PRD, §4.3) has seven block types total. **Six have no visual treatment defined yet**:

| Block type | Status |
|---|---|
| `richText` | ✅ Designed and validated in the mockup |
| `bulletList` | Not designed |
| `hmwGrid` | Not designed |
| `stepBlock` | Not designed |
| `twoColumn` | Not designed |
| `impactCallout` | Not designed |
| `image` (standalone gallery) | Not designed |

This is real risk, not a formality: several live projects (per the platform PRD's own example content — Solution sections built from `stepBlock`, Problem Statement from `bulletList`, etc.) will hit an undesigned block type immediately on cutover. **Design pass for the remaining six block types is a prerequisite for implementation, not a follow-up.**

## 6. Content readiness gap

The mockups use placeholder imagery (a consistent "photo icon on gradient" treatment, per design.md) everywhere except the hero portrait, which uses one real photo. Before cutover:

- Every featured project needs a real thumbnail image (currently placeholder-key-based per the platform PRD; the new card design is built around a photographic thumbnail, not a flat placeholder key).
- Case-study hero images and in-content images need real assets, or the placeholder treatment needs to be acceptable as a *shipped* state, not just a mockup stand-in — this is a product decision, not a design one (see Open Questions).

## 7. Non-goals

- No changes to the Payload schema, collections, or field structure. This is a rendering-layer change only.
- No changes to Supabase, hosting (Vercel / GitHub Pages), or the CI/CD pipeline.
- No new CMS fields for admins to fill in. If the design pass in §5 reveals a need for new data (e.g., a field the current schema doesn't carry), that's a scope decision to flag, not something to sneak in.
- Not a rewrite of `lib/data.ts` or the block-type contract — components consume the same shapes they do today.

## 8. Architecture impact

- **Fonts**: Anton + Archivo, self-hosted. Decide once: inline as base64 (matches the mockups, zero extra requests, larger initial payload) vs. `next/font/local` with real font files served from `public/` (framework-idiomatic, better caching, standard Next.js pattern). The mockups used base64 only because a static artifact has no build step — that reason doesn't apply inside `site/`. **Recommendation: `next/font/local`.**
- **Global styles**: design.md's token set (`--ink`, `--paper`, `--accent`, etc.) replaces whatever the current `globals.css` defines. Every component migrates to the new tokens in the same pass it's redesigned — no half-migrated state where old and new tokens coexist.
- **Components touched**: `Hero`, `FeaturedWork`, `Services`, `AboutExperience`, `CtaSection`, `HomeNav` (homepage — per `app/(site)/page.tsx`'s actual assembly order), and `CaseStudy`, `CaseNav`, `CaseSections`/`BlockBody` (case study — per `components/case/*.tsx`).
- **No routing changes**: `/work/[slug]` and the homepage route stay as-is; this is a template swap underneath the same URLs.

## 9. Phases

1. **Design language reference** — ✅ `docs/design.md` written and validated against two mockups.
2. **Homepage mockup** — ✅ validated, iterated to close spacing/overflow bugs.
3. **Case-study mockup** — ✅ validated against one real project's real content.
4. **Design the remaining six block types** (§5) — not started. Blocks implementation from starting.
5. **Content readiness** (§6) — real thumbnails + hero images for featured projects; decide the placeholder policy for the rest.
6. **Font strategy decision** (§8) — pick base64 vs. `next/font/local` before writing components, not during.
7. **Implementation** — rebuild homepage components + case-study template in `site/` against the new tokens; remove superseded styles in the same pass.
8. **Cross-content QA** — every published project, not just the one used for the mockup; both themes; 320px–1280px+; zero measured overflow.
9. **Cutover** — replace production styles; confirm Lighthouse/CWV parity before calling done.

## 10. Open Questions

- **Placeholder imagery at launch**: is it acceptable to ship the new design with photo-icon placeholders on projects that don't yet have real images, or is real photography a launch blocker? Affects whether §6 gates §9's cutover step.
- **Font loading strategy**: base64-inline vs. `next/font/local` — leaning `next/font/local` (§8), needs a decision before component work starts.
- **Six undesigned block types** (§5): does each get a bespoke treatment matching the new language, or do some collapse into a shared pattern (e.g., `bulletList` and `impactCallout` both being list-shaped)? Needs a design pass, not an implementation-time improvisation.
- **Rollout mechanism**: direct cutover, or behind a flag/preview route so the old and new designs can sit side by side briefly for comparison? The old CRUD-platform PRD's dual-hosting setup (Vercel + GitHub Pages) means a flag would need to work across both.
- **Locked/password-protected projects** (`ProjectLock`): no visual treatment considered yet under the new system — needs explicit design, not an assumption that the default case-study styling covers it.
