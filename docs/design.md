# Visual Language — Portfolio Redesign

Reference document for the Mermet-inspired redesign explored in two mockups:

- Homepage: https://claude.ai/code/artifact/167fe3c3-71eb-429e-8818-39bd6811b80d
- Case study page: https://claude.ai/code/artifact/a4fbf6f7-4126-4f71-a179-bc8911eee04f

The direction — bold condensed type, neon-on-ink color blocking, plus-mark image
badges — was explicitly requested to match a reference site (Mermet, a sunscreen
fabric brand). Nothing here is a "safe default"; it's a deliberate, pinned
aesthetic. This doc exists so the direction survives past the two mockups and
can be implemented consistently in `site/` when the redesign is greenlit.

## Color

| Token | Value | Use |
|---|---|---|
| `--ink` | `#14130f` | Warm near-black — page bg (dark theme), hero/CTA/card surfaces in both themes |
| `--paper` | `#e7e2d6` | Warm stone — page bg (light theme) |
| `--paper-soft` | `#ddd7c8` | Alt-row tint (light theme), e.g. alternating case-study sections |
| `--cream` | `#f6f3ea` | Off-white text on dark surfaces |
| `--accent` | `#d7ff3d` | Acid chartreuse — the one bold color, spent sparingly |
| `--accent-ink` | `#1c2100` | Dark text/icon color *on* the accent (buttons, badges) |
| `--muted` | `#5a5648` | Secondary text, light theme |
| `--muted-on-dark` | `#a8a495` | Secondary text on fixed-dark surfaces, either theme |
| `--line` | `rgba(20,19,15,.14)` | Hairline dividers, light theme |
| `--line-on-dark` | `rgba(246,243,234,.14)` | Hairline dividers, dark theme / fixed-dark surfaces |

**Rule**: spend the accent in one or two places per screen — a CTA pill, one
headline word, a status dot, list-item arrows. It should never be a background
for body copy or compete with itself across a section.

**Theming**: token-level, not a blind invert. `--bg`/`--fg`/`--fg-muted`/`--card-line`
are the four theme-aware aliases; every component reads through them, never
`--ink`/`--paper` directly (those are theme-*fixed* — used deliberately for
surfaces like the hero photo band or CTA section that stay dark in both themes).
Set via `prefers-color-scheme` and mirrored by `:root[data-theme]` so a manual
toggle can override the OS setting in either direction.

## Typography

- **Display — Anton**: all headlines, giant numbers, nav wordmark. Always
  uppercase, `line-height: 0.94–0.98`, `text-wrap: balance`. Bold/condensed by
  nature — never pair it with a second display face.
- **Body/UI — Archivo** (variable, 100–900): paragraphs, nav, buttons, labels,
  meta values. Weight does the differentiation work Anton can't (regular body,
  700 for buttons/eyebrows).
- Both fonts are self-hosted (`@font-face` + base64 `woff2` data URI) — no
  external font requests.
- **Eyebrow/label**: 0.72rem, weight 700, uppercase, `letter-spacing: 0.16em`.
- **Tabular numbers** (`font-variant-numeric: tabular-nums`) wherever digits
  need to align in a column: experience dates, project years, stat counters.

### Type scale (approximate, clamp-based on the homepage; fixed px where matching an existing page — see Spacing)

| Role | Size |
|---|---|
| Hero h1 | `clamp(3.2rem, 8.5vw, 7.6rem)` |
| Landing section h2 | `clamp(2.1rem, 5vw, 3.6rem)` |
| Case-study h1 | `clamp(2.4rem, 6vw, 4.4rem)` |
| Case-study section h2 | `clamp(1.7rem, 3.4vw, 2.5rem)` |
| Card title (h3) | `clamp(1.2rem, 2vw, 1.5rem)` |
| Footer/meta wordmark | `clamp(3.8rem, 17vw, 12.5rem)` |

## Layout

- **Container**: `.wrap` — `max-width: 1280px`, `margin: 0 auto`,
  `padding-left/right: clamp(1.25rem, 5vw, 4rem)`. One container class, used
  everywhere; don't invent a second one.
- **Full-width content, not artificially narrowed**: headlines, lede
  paragraphs, body prose, and in-content images extend to the container's
  full width. Don't cap them with `max-width: Nch` "for readability" unless a
  real design reason calls for a narrow column (we removed several ch-based
  caps that were fighting the layout for no reason).
- **Section rhythm**: prefer *one-sided* padding (top-only) over splitting
  space across both the bottom of section A and the top of section B — doing
  both doubles the visual gap by accident. When a page must match an existing
  site's exact rhythm, use its literal fixed pixel values rather than a
  responsive `clamp()` guess (see the case-study page: header 72px/56px,
  section 88px, mobile step-down to 64px — all pulled from the live site's
  own CSS).
- **Grids**: 2-up (work cards) and 3-up (services) at desktop, collapsing to
  1-column under 900px. Nav collapses to a 2-row stack (logo+CTAs, then links)
  under 900px rather than shrinking text until it breaks.

## Components

- **Nav**: sticky, `border-bottom: 1px solid var(--card-line)`. Logo/back-link
  left, links true-centered (3-column grid `1fr auto 1fr`, *not*
  `justify-content: space-between` — that only centers the middle item when
  the two side groups happen to be equal width), CTA button(s) right.
- **Buttons**: pill (`border-radius: 999px`), uppercase bold label,
  `accent`-filled primary / outline secondary. Always paired outline+filled
  when two actions sit together, never two filled buttons side by side.
- **Hero**: full-bleed photo, bottom gradient scrim for text legibility,
  headline + primary CTA pinned to the bottom corners as an overlay — not a
  split two-column layout. Bio, secondary CTA, and social links live inside
  the same dark band, stacked under the headline, so the hero reads as one
  block rather than a hero-plus-separate-intro-strip.
- **Cards** (project/work): dark ink chip, hairline border, thumbnail image
  with a circular "+" badge overlaid top-right *on the image* (not floating on
  the card corner), hover = lift + accent-tinted border glow.
- **Section header**: two variants —
  - *split*: heading left, one-line intro right, baseline-aligned (`.section-head`)
  - *stacked*: heading, then intro directly below with a fixed 16px gap
    (`.section-head--stacked` — a modifier, not a separate rule set, so it
    doesn't fight the base class's `gap`/`flex-direction`)
- **Meta grid** (case-study role/scope/platform/timeline): bordered box,
  equal cells, uniform `20px 24px` padding on *every* cell (including the
  first — don't special-case it), hairline `border-left` dividers between.
- **Lists**: no default bullets. Arrow (`→`) marker in accent color for
  unordered, accent-colored numeral for ordered.
- **Blockquote**: `border-left: 2px solid var(--accent)`, italic text.
- **Image placeholders**: a consistent "photo icon on a soft accent-tinted
  gradient" treatment for any unfilled media slot — signals "swap this for a
  real asset" without faking a screenshot. Used identically for the hero photo
  slot, work-card thumbnails, and in-content case-study images.

## Recurring implementation traps

These bit us more than once while building the mockups — worth checking for
specifically during real implementation:

1. **Padding shorthand silently overwrites a sibling declaration.**
   `.foo { padding: 1rem 0; }` on an element that also carries `.wrap` (which
   sets `padding-left`/`padding-right`) zeroes those out, because the
   shorthand always sets all four sides and a later rule with equal
   specificity wins. Always use `padding-top`/`padding-bottom` explicitly on
   any class that shares an element with `.wrap`. This exact bug appeared
   independently in the homepage nav, the homepage footer, and the case-study
   nav — three separate times.
2. **`gap` on a flex/grid container plus a child's own margin double-count.**
   If a parent sets `gap`, don't *also* put `margin-top` on a child expecting
   a specific spacing value — they add together. Pick one mechanism (prefer
   `gap`) and zero the other, including the browser's own default `<p>`
   margin (`1em`), which will quietly reappear the moment an explicit
   override is removed.
3. **Verify spacing and overflow by measuring, not by reading the CSS.**
   Several of the above were only caught by rendering the page headlessly and
   reading `getBoundingClientRect()` / computed styles — visual inspection or
   re-reading the source missed them. Worth doing for any nav, hero, or
   section-boundary change before calling it done.
4. **A full desktop nav (logo + several links + two buttons) will not fit a
   360–390px viewport at any font size.** Design the mobile nav layout
   deliberately (stacked rows, hidden tabs) rather than assuming it degrades
   gracefully.

## What's deliberately *not* carried over

- The literal Mermet fabric-catalog subject matter — only the visual grammar
  (type, color, card/plus-mark conventions) was borrowed, not the imagery.
  The hero/case-study background texture is a faint CSS-drawn grid (a nod to
  design systems/UI grids) rather than fabric grain, since a design portfolio
  and a textile brand carry different material worlds.
- Numbered "01/02/03" markers, unless the content is genuinely sequential
  (the Design Strategy section's two ordered steps qualify; a plain list of
  three unrelated services doesn't).
