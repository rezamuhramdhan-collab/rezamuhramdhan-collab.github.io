# Visual Language — Portfolio v3 (Paper Swiss)

Sources of truth, both read directly over their local MCP servers (every value
below is pulled from a file — fills, type styles, spacing, grid tracks — never
eyeballed from a screenshot):

- **Paper** — `app.paper.design/file/01KYYPM9KKTZ3FN7K4ADRXRVY4`, artboard
  `1-0` ("Container", 1327×4481). This is the **complete and newer** iteration:
  it carries the whole page including the About section and a real contact
  form. Prefer it where the two disagree.
- **Figma** — `MLNiDNVQCd579RLMFLrC1P`, frame `179:7`. Same design system, but
  its landing frame stops at a short email CTA and has no About block.

Where they differ, Paper wins — noted inline at each point.

This **fully replaces** the "Editorial Dark" v2 system documented in the
previous `docs/design.md` (Playfair / Manrope / near-black / `#ff4020`). It is
not an evolution of it — the theme inverts, the display face changes, and the
accent color is removed entirely. The prior spec lives in git history.

Two properties define this system and should survive any adaptation:

1. **It is a light, paper-toned theme.** Warm off-white ground, near-black ink,
   hairline rules. There is no dark variant in the frame.
2. **There is no accent color.** Not one saturated hue appears anywhere. The
   only "loud" value in the system is `#111` — used as ink, as the primary
   button fill, and as the CTA panel. Emphasis is created by weight, size, and
   the ink/muted split, never by hue.

---

## Color

Exact values from the Figma frame. Ten values total, all neutral.

| Token | Value | Use |
|---|---|---|
| `--paper` | `#f4f4f2` | Page background |
| `--surface` | `#fbfbfa` | Raised surfaces: approach card, and inverted text on `#111` |
| `--fill` | `#e9e9e6` | Quiet filled blocks: wordmark chip, icon tiles, project image placeholder |
| `--ink` | `#111` | Headings, project titles, primary button fill, CTA panel fill |
| `--muted` | `#8b8b85` | Body copy, nav links, all mono labels, secondary halves of titles |
| `--line` | `#dededa` | Every hairline: card borders, column dividers, list rules, tag pills, social buttons |
| `--header-bg` | `rgba(244,244,242,0.85)` | Sticky header ground (translucent paper) |
| `--header-line` | `rgba(222,222,218,0.7)` | Header bottom border only — softer than `--line` |

Inversion rule: on `--ink` grounds, text is `--surface` (`#fbfbfa`), never pure
white. On paper grounds, text is `--ink`, never pure black.

**Alpha variants.** The contact card and the About lead paragraph introduce a
small set of transparency steps. These are the only non-opaque values in the
system:

| Token | Value | Use |
|---|---|---|
| `--ink-90` | `#111111E6` (ink 90%) | About lead paragraph — above body, below a heading |
| `--on-ink-line` | `#FBFBFA40` (surface 25%) | Form input underlines on `--ink` |
| `--on-ink-placeholder` | `#FBFBFA59` (surface 35%) | Form placeholder text |
| `--on-ink-subtle` | `#FBFBFA73` (surface 45%) | Secondary text on `--ink` ("Or write to …") |

Worth noting: form **labels on the dark card stay `--muted` `#8B8B85`** — the
same value used on paper. The design does not lighten them for the dark ground,
which lands them dimmer than the placeholder text above the line.

`--line` is used at 1px everywhere. The design never uses a shadow — depth is
entirely borders and the `--surface` / `--paper` half-step.

---

## Typography — three faces, strict roles

| Face | Weights used | Role |
|---|---|---|
| **Archivo** | SemiBold (600) | Display only: h1, section headings, project titles, CTA line |
| **Instrument Sans** | Regular (400), Medium (500), SemiBold (600) | Everything else: body copy, nav, buttons, card and role titles, wordmark |
| **DM Mono** | Regular (400) | Every small caps label: years, tag pills, date ranges, footer |

Both Archivo and Instrument Sans are variable fonts; the design pins the width
axis to default (`font-variation-settings: "wdth" 100`).

DM Mono is the **only face carried over from v2** — but at a different size and
tracking (11px / `0.14em`, was 12px / `1.2px`).

### The three tracking rules

Tracking is not per-size in this design; it is per-role, and each role uses one
constant em value. This is the cleanest way to implement the scale:

| Role | Tracking | Line height |
|---|---|---|
| Archivo display | **`-0.045em`** | **`0.92`** |
| Instrument Sans SemiBold (titles, wordmark) | **`-0.025em`** | `1.5` |
| Instrument Sans Regular (body, nav, buttons) | `0` | `1.625` body / `1.5` UI |
| DM Mono | **`0.14em`**, uppercase | `1.5` |

Verified against every display size in the file: `-3.312/73.6`, `-2.592/57.6`,
`-2.16/48`, `-1.512/33.6` all equal `-0.045`; and `67.712/73.6`, `52.992/57.6`,
`44.16/48`, `30.912/33.6` all equal `0.92`.

### Exact type specs (desktop, 1152px frame)

| Role | Spec |
|---|---|
| H1 (hero) | Archivo SemiBold **73.6px** / 67.71px, three stacked lines |
| Contact line | Archivo SemiBold **57.6px** / 52.99px, `--surface` on `--ink` |
| H2 (section heading) | Archivo SemiBold **48px** / 44.16px |
| About sub-heading | Archivo SemiBold **44.8px** / 41.22px — under the section H2 |
| Project title | Archivo SemiBold **33.6px** / 30.91px |
| About lead paragraph | Instrument Sans Regular **18.4px** / 29.9px, `--ink-90`, width 628px |
| Form input / placeholder | Instrument Sans Regular **15px**, on `--ink` |
| Role title (Experience) | Instrument Sans SemiBold **15px** / 22.5px |
| Wordmark | Instrument Sans SemiBold **14px** / 21px |
| Approach card title | Instrument Sans SemiBold **13.5px** / 20.25px |
| Hero lede | Instrument Sans Regular **14px** / 22.75px, `--muted`, width 416px |
| Project description | Instrument Sans Regular **13.5px** / 21.94px, `--muted`, width 540px |
| Role description | Instrument Sans Regular **13px** / 21.13px, `--muted`, max-width 544px |
| Approach card body | Instrument Sans Regular **12.5px** / 20.31px, `--muted`, width ~213px |
| Project meta ("Client · Domain") | Instrument Sans Regular **12.5px** / 18.75px, `--muted` |
| "Read case study" | Instrument Sans Regular **12.5px** / 18.75px, `--muted` |
| Nav link | Instrument Sans Regular **13px** / 19.5px, `--muted` |
| Button label | Instrument Sans **Medium 13px** / 19.5px |
| Submit pill label | Instrument Sans **Medium 12px** / 18px, `0.14em`, uppercase |
| Mono label (year, tag, date range, form label, footer) | DM Mono Regular **11px** / 16.5px, `0.14em`, uppercase |

Note the deliberate absence of an eyebrow. v2 opened every section with an
accent mono kicker; **this design has none** — sections open directly on the
48px Archivo heading. Mono is demoted to metadata only.

### The split-title pattern

Experience role titles set the role in `--ink` and the company in `--muted`
**within one text node**, separated by `·`:

> **Senior Product Designer** · Mercato

Same size, same weight — the hierarchy is carried by color alone. This is the
design's one recurring typographic device, and it replaces v2's two-voice
Playfair upright/ghost-italic pairing.

---

## Spacing scale

Bound to Figma variables (`--dsq-spacing-and-grid-*`), a 4px scale:

| Token | px |
|---|---|
| `xxs` | 4 |
| `xs` | 8 |
| `sm` | 12 |
| `md` | 16 |
| `xl` | 20 |
| `xxl` | 24 |
| `3xl` | 28 |
| `4xl` | 32 |
| `5xl` | 36 |
| `6xl` | 40 |

Off-scale values used intentionally: `10px` (button y-padding and icon gaps),
`14px` (header y-padding, résumé button x-padding), `48`, `56`, `60`, `80`,
`96`, `112`.

## Radii

| Radius | Use |
|---|---|
| **6px** | Everything small: buttons, wordmark chip, icon tiles, social buttons, project thumbnails |
| **14px** | Large panels: approach card, contact card, About portrait |
| **full** | Tag pills, and the contact submit button (the one pill button) |

---

## Layout

**One content grid governs the whole page:** max-width **1152px**, horizontal
padding **36px** → **1080px of content**. Every track in the design resolves to
1080, which is the fastest way to check an implementation:

- Hero: `477.84px + 40 gap + 562.16px` = 1080
- Approach card: 4 × `269.5px` + 2 × 1px border = 1080
- Project row: `280px + 40 gap + 760px` = 1080
- Experience row: `130px + 32 gap + 918px` = 1080
- About: `388.84px + 64 gap + 627.16px` = 1080
- Contact card inner: `1080 − 2 × 56px padding` = 968, and its form grid
  `460px + 48 gap + 460px` = 968

### Header

Sticky, full-bleed `--header-bg` with a `--header-line` bottom border; inner
container 1152px, `padding: 14px 36px`, `space-between`. Three groups:

- **Left — wordmark chip**: `--fill` block, radius 6, `12px/8px` padding, gap 8,
  16px monogram SVG + name in Instrument Sans SemiBold 14px `--ink`. The
  wordmark being a *filled chip* rather than bare text is distinctive; keep it.
- **Center — nav**: gap 32, links 13px `--muted`. Items: Work, Approach,
  Experience, Contact.
- **Right — Résumé**: `--ink` fill, `--surface` text, radius 6, `14px/8px`.

### Hero (`py: 96px`)

Two columns, `477.84 / 562.16`, gap 40, vertically centered.

Left column, stacked with top padding rather than gaps:
1. H1, three lines ("Research. / Shape. / Ship.")
2. Lede — `pt: 28`, width 416
3. Button row — `pt: 36`, gap 28: **primary** (`--ink` fill, `--surface` 13px
   Medium, `16px/10px`, radius 6, gap 10, 14px arrow-right) then **ghost**
   (no fill, `--ink` 13px Medium, gap 10, 20px arrow-in-circle)
4. Social row — `pt: 32`, gap 12: three 36×36 squares, `--line` border,
   radius 6, centered 16px icon (LinkedIn / Mail / WhatsApp)

Right column: **WireframeStack**, 562×468, `overflow: clip`. A full hairline
grid (21 verticals at 4.81% intervals, horizontals at 5.77% intervals, inset
1.92% left/right) with isometric layered planes drawn over it. The group
extends ~15% below the frame and is clipped by it. This is the only illustrative
element on the page and it is line-art in `--line` weight — no fills, no color.

### Approach strip

A single `--surface` card, `--line` border, radius 14, `overflow: hidden`, sat
directly below the hero. Four equal columns divided by `border-right` on the
first three (not gaps). Each cell: `padding: 36px 28px`, gap 20, and contains
a 36×36 `--fill` icon tile (radius 6, 16px icon), a 13.5px SemiBold title, and
a 12.5px `--muted` paragraph.

### Selected projects (`pt: 112px, pb: 60px`)

Section head: `align-items: flex-end`, H2 left + outline "See all projects"
button right (`--line` border, radius 6, `20px/12px`, 13px Medium `--ink`,
14px arrow).

List: `pt: 48`, `border-top` + `border-bottom`, each item with `border-bottom`.
Each row is `280 / 760`, gap 40, `py: 32`, thumbnail 175px tall on `--fill`,
radius 6, `object-fit: cover`.

Right column is `space-between` over two blocks:
- **Top**: title row — 33.6px Archivo title left, DM Mono year hard-right
  (baseline-nudged, not top-aligned); then "Client · Domain" 12.5px at `pt: 8`;
  then the description 13.5px at `pt: 16`, width 540.
- **Bottom**: `space-between` — tag pills left (`--line` border, radius full,
  `10px/4px`, gap 6, DM Mono 11 uppercase `--muted`) and "Read case study"
  right (12.5px `--muted` + 20px arrow-in-circle, gap 10).

### Experience (`pb: 60px`)

H2, then list at `pt: 40` with `border-top`/`border-bottom`, rows separated by
`border-bottom` (**last row has none**). Each row: `130 / 918`, gap 32,
`py: 24`. Left is a DM Mono date range ("Since 2023", "2021 to 2023") with
`pt: 4` for optical alignment. Right is the split-title role heading with a
13px `--muted` description at `pt: 8`, max-width 544.

### About

Standard section head (H2 "About", 48px) then a `pt: 40` two-column grid,
`388.84px / 627.16px`, **gap 64** — a wider gutter than anywhere else on the
page (everything else is 40 or less).

**Left column:**
- Portrait in a `--fill` container with a `--line` border, **radius 14**,
  `overflow: clip`, 486px tall. Note this is the large radius, not the 6px used
  for project thumbnails — the About portrait is treated as a panel.
- Then `pt: 32`, a **definition list**: a `--line` top border, then one row per
  entry with `padding-block: 16px` and a `--line` bottom border. Each row is a
  DM Mono 11px uppercase `--muted` *term* over an Instrument Sans **12.5px /
  20.31px `--ink`** *value* at `pt: 8`. Entries: `BASED IN` → "Stockholm,
  working CET with overlap to US East"; `TOOLS` → "Figma, React, TypeScript,
  Rive, a lot of paper".

**Right column:** an Archivo SemiBold heading at **44.8px / 41.22px**
(tracking `-2.016px` — the standard `-0.045em` / `0.92`), deliberately *smaller*
than the 48px section headings, so the section head still outranks it. Then
`pt: 32` and three paragraphs with `gap: 24`, using **lead-paragraph
emphasis**:

| Paragraph | Spec |
|---|---|
| Lead | Instrument Sans **18.4px / 29.9px**, `--ink-90` (`#111111E6`), width 628 |
| Body ×2 | Instrument Sans **14px / 22.75px**, `--muted`, max-width ~541 |

Both the definition list and the ink-lead/muted-body split appear nowhere in
the landing sections. They are part of the system. Note the lead is `--ink` at
**90% alpha**, not solid — softer than a heading but clearly above body copy.

### Contact ("Let us talk about the hard part")

> **Correction:** an earlier draft of this doc said the contact form "collapses
> to a single mailto button." That was read from the Figma frame, which only
> has a short email CTA. **The Paper file has a full contact form** — the site's
> existing form structure survives the redesign rather than being deleted.

Full-width `--ink` card, radius 14, `padding: 80px 56px` → 968px inner. Archivo
**57.6px / 52.99px** heading in `--surface`, max-width 728.64.

Form at `pt: 48`, a `460px / 460px` grid with **column-gap 48, row-gap 40**:

| Row | Field |
|---|---|
| 1 | Name (col 1), Email (col 2) |
| 2 | Service — select, spans both columns |
| 3 | Message — textarea, spans both columns |

Every field is a mono label over an **underline-only** control, `gap: 16`:

- **Label** — DM Mono 11px uppercase `--muted` (the same `#8B8B85` as on paper;
  it is *not* lightened for the dark ground)
- **Control** — no box, no fill, just a 1px bottom border in `--on-ink-line`
  (`#FBFBFA40`), `padding: 8px 0 12px`, 43.5px tall (118.5px for the textarea)
- **Placeholder** — Instrument Sans **15px** in `--on-ink-placeholder`
  (`#FBFBFA59`)
- **Select** adds a 16px chevron at the right edge, stroked `#FBFBFA` at 55%

Submit block at `pt: 56`, centered, `gap: 20`:

- **Pill button** — `--surface` fill, **`border-radius: 9999px`**, `16px/32px`
  padding, gap 12, label Instrument Sans **Medium 12px uppercase, tracking
  1.68px** (`0.14em` — the same tracking as DM Mono), plus a 14px arrow.
- Below it, "Or write to `<email>`" in Instrument Sans 12px `--on-ink-subtle`
  (`#FBFBFA73`).

**This is the one place the 6px-radius button rule breaks.** Every other button
on the page is a 6px rectangle with sentence-case 13px Medium; the submit
button is a full pill with uppercase, tracked, 12px type. Treat it as a
distinct "submit" variant rather than normalizing it to the others.

### Footer

`border-top`, `py: 32`, `space-between`, two DM Mono 11px `--muted` lines:
locale/copyright left, a short credit line right.

---

## Case-study pages — re-skin, don't re-lay-out

Case-study detail pages are **not** in the Figma. The decision (confirmed with
the user) is: **keep the existing v2 layout exactly as built** — container
widths, the narrow-text/full-width-image rhythm, section order, the sticky tab
bar, the meta grid, step blocks, pull-quotes, impact stats — and change only the
visual language to this system. No geometry moves.

That makes it a pure token-and-face substitution. The full mapping:

| v2 (dark) | v3 (paper) |
|---|---|
| `--bg #0c0c0a` | `--paper #f4f4f2` |
| `--panel #151513` | `--surface #fbfbfa` |
| `--fg #ede8df` | `--ink #111` |
| `--muted #827d78` | `--muted #8b8b85` |
| `--line rgba(237,232,223,0.1)` | `--line #dededa` (opaque) |
| Sticky bar `rgba(12,12,10,0.95)` + blur | `--header-bg rgba(244,244,242,0.85)` + blur, `--header-line` border |
| Playfair Display (display) | Archivo SemiBold, `-0.045em` / `0.92` |
| Manrope (body) | Instrument Sans, `1.625` body / `1.5` UI |
| DM Mono 12px / `1.2px` | DM Mono 11px / `0.14em` |
| Radius 16px (meta grid, images) | **14px** (matches the two large panels) |

Three v2 constructs need real decisions rather than a swap, because they were
built on the accent or on darkness:

- **The 1px-gap divider trick** in the meta grid (grid background `--line`,
  cells `--panel`) still works on paper — `--dedede` gaps between `--surface`
  cells. Keep it, but do not also add cell borders or you get double lines.
- **Images** relied on "radius + dark fill reads as framed on near-black." On
  paper that disappears. Use the landing page's own answer: `--fill #e9e9e6`
  behind the image, radius 6 for inline thumbnails / 14 for hero-scale.
- **Everything accent-colored** — see the table below.

## The accent re-spec

`--accent: #ff4020` is removed with no replacement hue. Each of its current
jobs resolves to a neutral, following the landing page's own conventions:

| Currently accent | Becomes |
|---|---|
| Section eyebrows (`.eyebrow`) | **Deleted.** Sections open directly on the Archivo heading — the design uses no kickers. |
| Case-study section openers (eyebrow + rule) | Mono 11px `--muted` label + `--line` rule; keep the rule, drop the color |
| Kicker numbers (`01 \| Category`) | DM Mono 11px `--muted`, same as project years |
| Active tab in the sticky nav | `--ink` text (inactive stays `--muted`) — weight/color, not hue |
| Experience date ranges | DM Mono 11px `--muted` (matches "Since 2023" in the frame) |
| Skill dots, bullet markers | `--muted` text or `--line` markers; no filled color dots |
| Step-block 2px left border | `--line` 1px, or `--ink` 2px if the emphasis is load-bearing |
| Pull-quote 2px left border | `--ink` 2px — quotes are the one place ink-weight emphasis is warranted |
| Primary buttons / CTA pills | `--ink` fill, `--surface` text, radius 6 |
| Location tag, "Next Project" pill | `--ink` fill, `--surface` text |

The general rule: **hue becomes ink-vs-muted contrast.** Where v2 used color to
say "this is important," v3 uses `--ink` against `--muted`; where v2 used color
purely decoratively, v3 deletes the element.

## CMS mapping (as implemented)

The schema was adjusted to the design on 2026-08-01. **Nothing was deleted** —
dropping a column makes drizzle push prompt "created or renamed?" and hang in
CI, so fields the design no longer uses are `admin: { hidden: true }` instead.

**Revived** (already in the schema, hidden as deprecated v1 — just un-hidden):

| Field | Drives |
|---|---|
| `services.icon` | The Approach cell's icon tile (positional fallback if unset) |
| `hero.secondaryCta` | The ghost button beside the main CTA ("How I work") |
| `hero.socialLinks` | The hero's icon row (was borrowing `contact.socialLinks`) |

**Added** (both additive, no data migration):

| Field | Drives |
|---|---|
| `projects.tags` | The pill row on each work-list row (up to 3 shown) |
| `about.subheading` | The 44.8px display line beside the portrait |

**Hidden** — no longer rendered anywhere: `hero.portfolioTag`,
`contact.eyebrow`, `contact.location`, `contact.availability`, `services.tags`.

**Kept despite being invisible:** `hero.eyebrow` feeds JSON-LD `jobTitle` and
`hero.portrait` is the OG/Twitter share image. Neither appears on the page.

Two fields are rendered under labels that don't match their names, because
renaming a column is exactly the non-additive change that hangs CI:
`about.locationTag` → the "Based in" row, `about.skills` → the "Tools" row.
Their admin descriptions say so.

## Adaptation notes (design → this site's real content)

The frame is a designed mockup with placeholder identity ("Maya Alvarsson",
Stockholm/CET) and placeholder projects. Remaining gaps before build:

- **Section order now maps almost 1:1.** The Paper artboard runs Hero →
  Approach → Work → Experience → **About** → **Contact** → Footer. The site
  runs Hero → Work → Services → Experience → About → Contact. Same set, one
  reorder (Work and the Approach/Services strip swap places).
- **The one real content-shape mismatch is Services → Approach.** The accordion
  becomes the 4-up strip, and each entry needs a short title, a one-sentence
  body, and an icon — which the CMS `services` entries don't currently carry.
  Everything else maps onto existing content.
- **The contact form survives.** It keeps its four fields (name, email, service
  select, message), so the existing form component's structure is reusable and
  only the styling changes. The open question from v2 is unchanged and still
  real: there is **no form backend** — CTAs are currently WhatsApp/mailto links,
  so submission needs an API route on Vercel, plus a degraded path on the static
  export. The design's own fallback line ("Or write to `<email>`") sits directly
  under the button and is a natural place to degrade to.
- **Fonts change.** Archivo and Instrument Sans need adding to
  `site/app/fonts/` (both variable, both Google Fonts); Playfair Display and
  Manrope can be dropped. DM Mono stays but re-specs to 11px / `0.14em`.
- **Hero illustration.** The WireframeStack is a set of Figma-exported SVG
  vectors. It must be exported as one optimized SVG or rebuilt in code — it is
  ~60 individual line elements as authored, which should not ship as-is.
- **Photography.** The four project thumbnails are stock placeholders; real
  screenshots must replace them. The About block does use a portrait (so v2's
  About photo has a home), but the landing frame has no hero portrait — that
  slot is taken by the WireframeStack illustration.
- **Responsive behavior is undefined.** The frame is desktop-only at 1152px.
  Every multi-column construct (hero 2-up, approach 4-up, project 280/760,
  experience 130/918) needs breakpoint behavior invented, and the design gives
  no mobile nav — the current site's mobile nav pattern will have to carry over.

---

## Recurring implementation traps (carried forward, still true)

- Measure rendered output — bounding boxes and screenshots — rather than
  reading the CSS and assuming. This caught real errors in the v2 build.
- The padding shorthand (`padding: X Y`) on an element that also carries a
  container class silently zeroes the container's side padding.
- Column dividers here are **borders on cells**, not grid gaps with a
  background showing through (v2's meta grid used the 1px-gap trick). Mixing
  the two approaches produces double lines at the seams.
- Header centering uses `space-between` with unequal side groups, so the nav is
  not truly optically centered. The Figma accepts this; match it rather than
  "fixing" it.
