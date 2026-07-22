# Visual Language — Portfolio Redesign v2 (Editorial Dark)

Source of truth: the user's Figma file **Website Bank Saqu → "Homepage" frame**
(`mYQVP1MznOJwEJdqcWxdyQ`, node `4379:7830`), read directly via the Figma MCP
(exact fills, type styles, and spacing below are pulled from the file, not
eyeballed from screenshots). A companion case-study detail mockup ("Volta
Studio") from the same design establishes the case-study template conventions.
This replaces the previous "Mermet-inspired" ink/chartreuse system entirely
(see git history), and supersedes the earlier draft of this document that
guessed Fraunces/Inter before file access was available.

This is a **single, committed dark theme** — no light variant exists in the
design, and the mood (dim photography, ghost-italic display lines, hairlines
on near-black) depends on staying dark. A light mode would be a new design
decision, not a default to preserve.

## Color

Exact values from the Figma file:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0c0c0a` | Page background |
| `--panel` | `#151513` | Raised surfaces: project cards, About section band, meta bar, callout cards |
| `--fg` | `#ede8df` | Headings, high-emphasis text (warm off-white); also the fill of the light button |
| `--muted` | `#7a7570` | Body copy, secondary labels, collapsed-state text |
| `--accent` | `#ff4020` | Eyebrows, numbers, primary buttons, active tab, skill dots, About location tag, step-block left border |
| `--line` | `rgba(237,232,223,0.1)` | All hairlines: section top borders, card borders, row dividers, form underlines, tag-pill borders |
| Ghost 30% | `rgba(237,232,223,0.3)` | Hero name second line (italic) |
| Ghost 20% | `rgba(237,232,223,0.2)` | "Start a *Project*" second line |
| Ghost 5% | `rgba(237,232,223,0.05)` | Giant footer signature |
| Nav link | `rgba(237,232,223,0.8)` | Top-nav links at rest |
| Placeholder | `rgba(122,117,112,0.4)` | Form placeholders, footer copyright |

Button text: on accent = `#ede8df` for large CTAs (View Work, Send Message)
but `#0c0c0a` for the small nav Resume pill and the About location tag; the
light button (Download Resume) is `#ede8df` fill with `#0c0c0a` text.

## Typography — three faces, strict roles

| Face | Weights used | Role |
|---|---|---|
| **Playfair Display** | 700, 900, 900 italic | All display/headings: hero name, section headings, card titles, service titles, contact values, wordmark |
| **DM Mono** | 400, 500 | Every small label: eyebrows, numbers, categories, years, meta labels, form labels, tab nav, footer links, tag pills, copyright |
| **Manrope** | 300–700 | Body copy, top-nav links, buttons, skills list, form input text |

The **two-voice display pattern**: paired display lines set the first line in
Playfair Black upright `--fg` and the second in Playfair Black *Italic* at a
ghost opacity — hero name (30%), "Start a / *Project*" (20%), footer
signature (5%, single element that wraps to two lines). Single-word accents
use the same italic voice at full accent color: the trailing "s" in
"Service*s*", the "M" in the "AM"-style wordmark.

### Exact type specs (desktop, 1387px frame)

| Role | Spec |
|---|---|
| Hero name | Playfair Black 152px / 134px line, uppercase; line 2 italic ghost-30 |
| Section heading (Work) | Playfair Black 80px |
| Section heading (Services/About) | Playfair Black 69px |
| "Start a Project" | Playfair Black 111px / 111px |
| Footer signature | Playfair Black Italic 250px, ghost-5, wraps to 2 lines |
| Card / service / contact-value titles | Playfair Bold 18–24px |
| Eyebrow | DM Mono 400 12px, tracking 2.64px, uppercase, accent |
| Small label (meta, form, footer, numbers) | DM Mono 400/500 12px, tracking 1.2px, uppercase |
| Category / tag pill / year | DM Mono 400 12px, tracking 0.6px, no uppercase |
| Nav link | Manrope 600 12px, tracking 2.16px, uppercase, fg-80 |
| Button label | Manrope 700 12px, tracking 1.2px, uppercase |
| Body copy | Manrope 400 14px / 22.75px line, `--muted` |
| Skills item | Manrope 500 12px, tracking 0.3px |
| Form input | Manrope 300 14px |

## Layout

- Frame 1387px wide, max content 1440px; side padding **64px**; section
  vertical padding **144px**; every section separated by a `--line` top
  border (not background alternation — except About, which additionally
  sits on `--panel`).
- **Nav**: 70px tall, absolute over the hero photo. `justify-content:
  space-between`: wordmark left (Playfair Bold 20px, second initial italic),
  links center (gap 40px), small accent Resume pill right (dark text,
  download icon).
- **Hero**: full-viewport photo (object-fit cover) under a bottom-heavy
  gradient — solid `#0c0c0a` at 30% from bottom, ~55% opacity at 70%, 20%
  at top. Content block pinned to bottom (80px bottom padding): accent
  eyebrow + "Portfolio — YYYY" mono tag right-aligned on the same row, the
  two-line name, then bio (max 320px) and the View Work pill side by side.
- **Work grid**: 2-col, 20px gap, starts 64px below the section head. The
  "All Projects" link sits top-right of the section head, aligned with the
  eyebrow.
- **Services**: 377px intro column + flexible rows column, 64px gap. Rows
  divided by `--line`; each row py-24: accent mono number (gap 20) +
  Playfair Bold 24px title, arrow right. First row is expanded: description
  and tag pills indented 40px; expanded arrow points →, collapsed ↗.
- **Experience**: a two-column split with a **wide gutter** — the intro
  ("Career" eyebrow + Playfair Black "Experience" heading + short lede) takes
  the left **~30%**, and the role list is a narrow **~44%** column pushed to
  the far right (`justify-content: space-between` leaves a ~26% gap between
  them; the list is *not* two-thirds-width). Each role is a row divided by `--line`
  bottom borders (last row borderless): the header is `justify-content:
  space-between` — left is the Playfair Bold 20px role title above a meta line
  of `Company` (Manrope SemiBold 14px, `--fg`-80%) `·` `Type` `·` `Location`
  (DM Mono 12px muted, separated by 1px×12px hairline dividers); right is the
  date range (DM Mono 12px **accent**, e.g. "2022 — Present"). Below, the
  bullet list uses small **grey round dots** (4px, `--line` color — not
  accent, unlike the case-study square markers) with Manrope 14px muted text.
  Sits between Services and About; adds an "Experience" nav + footer link.
- **About**: on `--panel`. 2 equal columns, 64px gap, vertically centered.
  Image (max 640px tall) with an accent location tag — square corners, not
  a pill — overlapping near the bottom-right. Text column: eyebrow, heading,
  two paragraphs, then a hairline-topped 2-col skills grid (4px accent dot +
  Manrope 12px), then the light Download Resume pill. **No experience
  timeline in this design** — see "Adaptation notes".
- **Contact ("Start a Project")**: eyebrow + two-voice display heading, then
  a 2:3 split. Left: stacked info items (mono label over Playfair Bold 18px
  value, hairline under each): Email (accent arrow icon), Location,
  Availability, then a mono social-links row. Right: form — mono labels,
  underline-only inputs (no boxes), name/email in one row, service dropdown,
  message textarea, centered accent Send Message pill.
- **Footer**: hairline top; links row (DM Mono 12px, gap 32) + copyright
  (placeholder-grey) in one 32px-padded row; below, the giant ghost
  signature (5% opacity Playfair Black Italic) breaking out to two lines,
  clipped by the page edge.

## Case-study template conventions (from the Figma "Detail Project" frame)

Verified from Figma node `4380:8128` (the Volta Studio case study).

- **Layout width**: max container **1200px** centered, **48px** inner padding
  → 1104px content. Body **text wraps at 672px** (left-aligned, roughly the
  left half), while **images span the full 1104px** content width. This
  asymmetry — narrow text, full-width imagery — is the defining rhythm of the
  page; do not center the text or narrow the images to match it.
- **Top bar**: sticky, `rgba(12,12,10,0.95)` + blur, hairline bottom border,
  56px tall. Three-column grid: "← Back" mono link left; centered mono
  tab-nav of the section anchors (Background / Problem / Design Strategy /
  Solution / Outcome), active tab accent; empty right cell to keep the nav
  truly centered.
- **Header**: kicker "`01 | Category`" (accent mono number, 1px vertical
  separator, muted mono category); Playfair Black title at **96px** / 88px
  line; muted subtitle (≤672px); then the meta grid.
- **Meta grid**: full 1104px width, 4 equal columns, 16px radius,
  `overflow:hidden`. Built with the **1px-gap divider trick** — the grid
  background is `--line` and cells are `--panel`, so the 1px gaps read as
  hairline dividers. Each cell: mono label over Playfair Bold 18px value.
- **Section openers**: accent mono eyebrow (12px, tracking 1.2px) + a 1px
  `--line` rule filling the rest of the row; ~96px top padding per section.
- **Body**: Manrope 14px / 1.8; a leading paragraph may bump to 16px `--fg`.
  Bullet lists use a small **square** accent marker (6px).
- **Sequential content** (Solution steps): "`01 — Title`" Playfair Bold 18px
  headings, each block indented behind a **2px accent left border**, compact
  (title + one description paragraph). **Parallel content** (HMW cards) uses
  `--panel` hairline cards with an accent mono number over a Playfair Bold
  question.
- **Pull-quotes**: Playfair italic ~22px, 2px accent left border.
- **Impact stats**: `--panel` hairline card, Playfair Black number
  (~44px) + mono label.
- **Footer CTA**: on `--panel`, hairline top border. Left: accent mono
  eyebrow + "Let's build something great." (Playfair Black 36px, **solid
  `--fg`** — the Figma does *not* italic-ghost the tail here). Right: "All
  Work" mono link + accent Next Project pill (dark text).
- **Images**: full 1104px content-width, 16px radius (hero ≈2:1, body
  images ≈2.3:1); no separate border needed — the radius + dark fill read
  as framed on the near-black ground.

## Adaptation notes (design → this site's real content)

- **Experience meta line**: the dedicated Experience section (see Components)
  renders the CMS experience entries. Its `Company · Type · Location` meta
  line needs two fields the CMS doesn't have yet — employment **type**
  (Full-time / Internship) and **location**. Either add them to the
  experience schema, or drop the missing segments and show `Company` alone.
  The mockup's type/location values ("Full-time · Jakarta, ID", etc.) are
  reasonable placeholders, not confirmed data.
- **Location tag / contact location**: no location field exists in the CMS
  yet ("Jakarta, ID" in the mockup is unconfirmed) — needs a Settings field
  and the user's confirmation.
- **Contact form**: the current site has no form backend (CTA buttons are
  WhatsApp/mailto links). The form needs a submission strategy (API route on
  Vercel; hidden or degraded on the static export) — scope separately.
- **Resume**: nav pill + About button both reference the existing resume
  download already in the CMS settings.
- **Photography**: hero portrait, About portrait, and the four project card
  photos in the mockups are the Figma design's stock placeholders — real
  photography/screenshots must replace them before launch.

## Recurring implementation traps (carried forward, still true)

- Centering nav with `space-between` only works when side groups are equal
  width — this design genuinely uses `space-between` (logo/links/button),
  which visually off-centers the links; the Figma accepts this, so match it
  rather than "fixing" it.
- The padding shorthand (`padding: X Y`) on an element that also carries a
  container class silently zeroes the container's side padding.
- Measure rendered output (bounding boxes, screenshots) — don't just read
  the CSS and assume.
