# SOLID Audit — Portfolio Site (`site/`)

*Companion to [solid-architecture-research.md](./solid-architecture-research.md). Audited July 2026 against the codebase at commit `e2c6d78`.*

**Scope:** all application code in `site/` — `app/`, `components/`, `lib/`, `content/`, `payload.config.ts` (~2,300 lines excluding generated files). Stack: Next.js App Router + Payload CMS (SQLite/Turso), server components, no client state beyond `ScrollReveal`.

---

## Overall Assessment

**This codebase is in good SOLID shape for its size.** The single most important architectural decision — isolating the CMS behind a data layer with domain-owned types — is exactly what DIP prescribes, and it's done deliberately (the comment in `lib/data.ts` even states the rule). Components are pure functions of props, the composition roots are the route files, and cross-cutting concerns (placeholder art, Lexical detection, scroll reveal) each live in their own module.

The findings below are therefore mostly **hypotheses about future cost of change**, not defects. Severity reflects how likely the cost is to be paid, calibrated to a solo-maintained portfolio site — not an enterprise codebase. One finding (F2) is a latent behavioral bug path, not just a design concern.

> **Status (July 2026): all findings addressed** in the SOLID refactor (F8 partially — see its note). The Finding column describes the code as it was at commit `e2c6d78`; line references throughout the finding sections refer to that commit.

| # | Principle | Finding | Severity | Outcome |
|---|-----------|---------|----------|---------|
| F1 | OCP | Adding a section block type requires edits in 5 files, with no compiler guidance in 2 of them | Medium | ✅ `never`-guards added to all three switches; probe-verified |
| F2 | OCP/LSP | `fromBlock`'s `default:` silently converts unknown block types into image blocks | Medium | ✅ Explicit `image` case; `default:` throws |
| F3 | SRP | `CaseStudy.tsx` holds 7 distinct concerns in one 439-line file | Low–Medium | ✅ Split into `rich-text.tsx`, `images.tsx`, `blocks.tsx`, `CaseStudy.tsx` |
| F4 | DIP | The CMS boundary is typed `any` despite generated `payload-types.ts` | Medium | ✅ `lib/data.ts` fully typed against generated types; eslint-disable removed |
| F5 | OCP/DRY | Registry keys duplicated between `payload.config.ts` selects and code registries | Low–Medium | ✅ Single-sourced in `content/registry.ts` |
| F6 | LSP | `stepBlock` is a `SectionBlock` that the block renderer can't render | Low | ✅ `BlockBody` takes `Exclude<SectionBlock, StepBlock>`; invariant lives in `groupSections`'s types |
| F7 | ISP | `CaseNav` depends on full `SectionBlock[]` but reads two fields; also contains dead label logic | Low | ✅ Takes `anchors: string[]`; dead label code deleted (user chose anchor display) |
| F8 | ISP/SRP | `RichItem`'s `string` shape is handled in renderers but can no longer reach them | Low | ◑ Normalization centralized in one `toRow` helper; type narrowing deferred while seed fixtures use strings |

---

## What Already Follows SOLID (keep doing this)

**DIP — the data layer as an anti-corruption boundary.** [data.ts](site/lib/data.ts) is the only module that knows Payload document shapes; everything else consumes the domain types in [types.ts](site/content/types.ts), which import nothing from Payload. Dependency arrows point the right way: presentation → domain types ← data layer → CMS. Swapping Payload for another CMS is a one-file rewrite. This is textbook ports-and-adapters at exactly the scale where it pays.

**DIP — components receive, never fetch.** Every component takes data via props ([CaseStudy.tsx:369](site/components/case/CaseStudy.tsx#L369), [sections.tsx:14](site/components/home/sections.tsx#L14)); the route files [page.tsx](site/app/(site)/page.tsx) and [work/[slug]/page.tsx](site/app/(site)/work/[slug]/page.tsx) are clean composition roots that fetch in parallel and wire props. Components are renderable with fixtures, no mocking required.

**SRP — well-drawn small modules.** [lexical.ts](site/lib/lexical.ts) owns the one rule "does this editor state have content" and is reused by both the renderer and the CMS field conditions — one authority for one policy. [thumbs.ts](site/components/thumbs.ts) isolates placeholder art. [ScrollReveal.tsx](site/components/ScrollReveal.tsx) keeps the only client-side behavior in one progressive-enhancement component. [seed.ts](site/lib/seed.ts) owns the one-time fixture migration.

**OCP — icon registries.** [icons.tsx:83-99](site/components/icons.tsx#L83-L99) maps names → components (`serviceIcons`, `socialIcons`, `buttonIcons`), so consumers like `Services` never switch on icon type. (The registration story has a gap — see F5.)

**ISP — mostly narrow props.** `Btn` takes a `ButtonItem`, `Hero` takes `Hero`, `Paras` takes `RichItem[]`. Components rarely receive more than they use.

---

## Findings

### F1 — OCP: a new section block type touches 5 files, and the compiler only guards 3 · Medium

The section-block system is the shotgun-switch pattern (research doc §3.2). Adding, say, a `videoEmbed` block requires coordinated edits to:

1. [types.ts:178-186](site/content/types.ts#L178-L186) — new interface + union member
2. [payload.config.ts:132-253](site/payload.config.ts#L132-L253) — new entry in the `blocks` array
3. [data.ts:51-129](site/lib/data.ts#L51-L129) — new case in `fromBlock`
4. [CaseStudy.tsx:169-285](site/components/case/CaseStudy.tsx#L169-L285) — new case in `BlockBody`
5. [seed.ts:24](site/lib/seed.ts#L24) — new case in `toBlock` (only if the fixture needs it)

Parallel switches on a discriminated union are *idiomatic TypeScript*, and at this scale a renderer registry would add indirection without paying for itself. The real problem is that **the compiler currently guides none of the five edits**:

- `BlockBody` has no exhaustiveness check — a new union member falls through the `switch` and returns `undefined`, rendering nothing, silently.
- `fromBlock` and `toBlock` operate on `any`/`SectionBlock` with a permissive `default:` (see F2).

**Recommendation (cheap, keeps the idiom):** make the union member additions loud instead of removing the switches. Add a `never` guard to each switch:

```ts
// BlockBody, end of switch
default: {
  const exhausted: never = block;
  return exhausted;
}
```

With all current cases present this compiles; the moment a new `SectionBlock` member exists, every guarded switch becomes a compile error pointing at exactly the files that need the new case. That converts the OCP violation into a compiler-driven checklist — the right trade-off for a solo codebase. (Only if the block count keeps growing — say past 12–15 — would a renderer map keyed by `block.type` start earning its indirection.)

### F2 — OCP/LSP: unknown block types silently become image blocks · Medium

[data.ts:122-128](site/lib/data.ts#L122-L128):

```ts
default:
  return { ...base, type: "image", images: base.images ?? [{ src: "placeholder", alt: "" }] };
```

The `default:` doubles as the handler for the real `image` block. Consequence: any CMS block whose `blockType` the mapper doesn't recognize — a typo, a schema/code version skew during deploy, or step 3 of F1 forgotten — is **silently rendered as an empty placeholder image** on the live site instead of failing visibly. This is the data-layer sibling of an LSP violation: the mapper claims to return a faithful `SectionBlock` for every document but degrades unknown input into a lie.

**Recommendation:** add an explicit `case "image":` and make `default:` throw (or log loudly and return `null` to be filtered) so drift is detected at build/render time rather than shipped as blank placeholders. Pairs with the `never` guard from F1.

### F3 — SRP: `CaseStudy.tsx` is seven modules sharing one file · Low–Medium

[CaseStudy.tsx](site/components/case/CaseStudy.tsx) (439 lines — a quarter of all component code) currently contains: Lexical upload converters, legacy `**bold**` text helpers, the image-layout system (`Placeholder`/`ImageGroup`/`WithImages`), all eight block renderers, the section-grouping algorithm, the tab nav, and the page shell. Its git history already shows the symptom — it changes in nearly every content-feature commit, whatever the feature.

By actor analysis it's really three responsibilities: **rich-text rendering** (changes when the editor integration changes), **block presentation** (changes with visual design), and **page assembly/grouping** (changes with page structure).

**Recommendation:** split along those seams when this file is next touched — no need for a dedicated refactor PR:
- `components/case/rich-text.tsx` — `richConverters`, `RichBody`, `Rich`, `Cell`, `Paras`
- `components/case/images.tsx` — `Placeholder`, `ImageGroup`, `WithImages`
- `components/case/blocks.tsx` — `BlockBody`, `StepGroup`, `listClass`
- `CaseStudy.tsx` keeps `groupSections`, `CaseNav`, and the page shell

Purely mechanical (everything is already function-scoped); imports are the only change.

### F4 — DIP: the boundary module is untyped despite generated types · Medium

[data.ts:19](site/lib/data.ts#L19) disables `no-explicit-any` for the whole file, and every mapper takes `doc: any` / `block: any` — even though Payload generates full document types into `payload-types.ts` (wired at [payload.config.ts:285](site/payload.config.ts#L285)). A boundary is only as strong as its contract: with `any`, a renamed CMS field (`pullQuoteText` → `quoteText`) type-checks fine and ships `undefined` into production; with generated types it's a compile error in the exact mapper that needs updating.

**Recommendation:** type the mappers against the generated types (`import type { Project as ProjectDoc } from "@/payload-types"`), keeping the return types as the domain types. This strengthens the existing good boundary at zero architectural cost. Do it one mapper at a time; `fromProjectDoc` and `fromBlock` carry most of the risk.

### F5 — OCP: registry keys live in two places with no sync check · Low–Medium

Three registries have their key list duplicated between code and CMS schema:

- Placeholder thumbnails: [thumbs.ts:6](site/components/thumbs.ts#L6) keys vs. the hardcoded `placeholderKey` options at [payload.config.ts:450-457](site/payload.config.ts#L450-L457)
- Service icons: `serviceIcons` at [icons.tsx:83](site/components/icons.tsx#L83) vs. options at [payload.config.ts:330](site/payload.config.ts#L330)
- Button/social icons: same pattern ([icons.tsx:89-99](site/components/icons.tsx#L89-L99) vs. config selects)

Adding placeholder art or an icon means editing two files, and nothing verifies they agree. The failure mode is quiet: a `placeholderKey` present in the config but missing from `thumbnails` makes `Thumb` ([sections.tsx:74-79](site/components/home/sections.tsx#L74-L79)) fall through to `<img src="bank-saqu">` — a broken image, no error.

**Recommendation:** single-source the keys. The clean version: export the key lists from a JSX-free module (e.g. `content/registry.ts` with `export const serviceIconKeys = ["pen","grid","bulb"] as const`), and have *both* `payload.config.ts` (select `options: [...serviceIconKeys]`) and `icons.tsx`/`thumbs.ts` (typed `Record<ServiceIconKey, …>`) import from it. Then a key added in one place is demanded by the compiler everywhere else — DIP applied to configuration: both sides depend on a shared abstraction instead of on each other's literals.

### F6 — LSP: `stepBlock` is a `SectionBlock` the renderer refuses · Low

[CaseStudy.tsx:282-283](site/components/case/CaseStudy.tsx#L282-L283):

```ts
case "stepBlock":
  return null; // rendered via StepGroup
```

One member of the union isn't substitutable where the union is accepted — `BlockBody` renders every `SectionBlock` *except* this one, and the real handling lives in `groupSections`/`StepGroup`. It works because `groupSections` guarantees `BlockBody` never receives one, but that invariant is invisible in the types: a future caller rendering `<BlockBody block={someStepBlock} />` gets silent nothing.

**Recommendation:** low priority; the honest fix is to make `groupSections` the type-level gate — have it return `{ kind: "single"; block: Exclude<SectionBlock, StepBlock> }` (a cast inside `groupSections` is acceptable; the lie is then localized to the one function that enforces the invariant) and delete the `stepBlock` case from `BlockBody` entirely. The compiler then documents that step blocks are only renderable as groups.

### F7 — ISP: `CaseNav` takes the whole block union for two fields — and half its logic is dead · Low

[CaseStudy.tsx:333-367](site/components/case/CaseStudy.tsx#L333-L367): `CaseNav` accepts `sections: SectionBlock[]` but reads only `anchor` and `heading`. Narrower props (`{ anchor: string; label: string }[]`, computed by the caller) would decouple the nav from the entire block model.

While auditing this, a dead-code artifact surfaced: lines 344–349 compute a `label` from the block heading (`heading.split(" ")[0].replace("&", "")`), but the render at line 360 displays `a.anchor` with CSS capitalization — **the computed label is never used**. Either the label logic or the anchor-display is unintentional; worth deciding which one you meant.

### F8 — ISP: renderers handle a `RichItem` shape that can no longer reach them · Low

[types.ts:106](site/content/types.ts#L106) defines `RichItem = string | { text?: string; content?: unknown }`, and `Cell`/`Paras` ([CaseStudy.tsx:65-87](site/components/case/CaseStudy.tsx#L65-L87)) branch on the string case. But at runtime, everything the renderers receive has passed through `fromRichArray` ([data.ts:27-31](site/lib/data.ts#L27-L31)), which always produces `{ text, content? }` — the `string` shape survives only in the seed fixtures, which flow into the DB, not into components. The renderers carry permanent branching for an input that can't occur, because the type describes two eras of the data model at once.

**Recommendation:** when the legacy plain-text era is fully retired, narrow the renderer-facing type to `{ text: string; content?: unknown }` and keep the `string` variant only in the seed-side types. Until then this is fine — it's documented as transitional.

---

## Suggested Order of Work

None of this is urgent. If/when you invest, highest value-per-effort first:

1. **F2 + F1** — explicit `image` case, throwing `default`, `never` guards on the three switches (~30 minutes; turns silent failures into compile/build errors).
2. **F4** — type `fromProjectDoc`/`fromBlock` against `payload-types.ts` (locks the boundary contract).
3. **F5** — single-source registry keys in a shared module.
4. **F3** — split `CaseStudy.tsx` opportunistically, next time it's edited.
5. **F6–F8** — fold into whichever future change touches those lines (but decide the `CaseNav` label-vs-anchor question in F7 now — it may be a visible copy bug).

The guiding call, per the research doc's pragmatism section: this codebase should *not* adopt renderer registries, DI containers, or interface layers beyond what it has. Its size, single maintainer, and one-CMS reality mean the discriminated-union-plus-exhaustive-switch idiom is the right amount of SOLID — it just needs the compiler enforcement turned on.
