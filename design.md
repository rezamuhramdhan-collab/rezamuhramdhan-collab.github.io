# Design Language — Reza Ramdhan Portfolio

Visual analysis of the portfolio landing page. Use this as the source of truth
when building or extending pages so everything stays on-system.

---

## 1. Color Palette

A restrained, high-contrast neutral system with a single vivid blue accent.

### Core colors

| Role | Approx. value | Usage |
|---|---|---|
| Background (base) | `#FFFFFF` | Hero, project grid, footer CTA |
| Background (alt section) | `#F7F8FA` | "What I Do", Experience band — subtle zebra rhythm between sections |
| Ink / primary text | `#0E1116` (near-black) | Headlines, body copy, dark buttons |
| Secondary text | `#6B7280` (cool gray) | Subheads, card meta, descriptions, footer legalese |
| Accent blue | `#2563EB` – `#3B82F6` | Highlighted words in headlines ("Product Designer.", "great", "love to use"), icon tiles, links, timeline dots |
| Success green | `#22C55E` | "Available for new projects" status dot |
| Card surface | `#FFFFFF` with `#E5E7EB` hairline border | Project cards, service cards, chips |

### Rules observed

- **One accent only.** Blue is the sole brand hue; it never competes with a second accent. Green appears only as a tiny semantic status indicator.
- **Accent-as-emphasis.** Blue is used inside black headlines to color one emotional word or phrase, not entire headings.
- **Dark-on-light inversion for primary CTAs.** Primary buttons are near-black pills with white text; secondary buttons are white/outlined. Blue is *not* used for buttons — it's reserved for text emphasis and icons.
- **Imagery carries the saturation.** Project thumbnails (purple app UI, warm wood, greenery) provide color richness against the neutral chrome.

---

## 2. Typography

Modern grotesque sans-serif throughout (Inter / Plus Jakarta Sans family feel). One typeface, strong weight contrast.

### Scale & styles

| Level | Style | Example |
|---|---|---|
| Display / hero | ~64–80px, ExtraBold (700–800), tight tracking, ~1.1 line-height | "Hi, I'm Reza Ramdhan" |
| Section heading | ~40–48px, Bold | "Featured Work", "Let's build something great" |
| Statement heading | ~36–40px, Bold, multi-line with colored phrase | "I design products that people love to use." |
| Card title | ~18–20px, SemiBold | "Bank Saqu Homepage Revamp" |
| Body / lede | ~15–16px, Regular, gray, relaxed 1.6 line-height | Hero intro paragraph |
| Eyebrow / meta | ~11–12px, Medium, **UPPERCASE**, letter-spaced | "PRODUCT DESIGN", "UI/UX DESIGN" + year |
| Nav / UI | ~13–14px, Medium | "Work Services About Contact" |

### Rules observed

- **Weight does the hierarchy work**, not typeface changes — ExtraBold display vs. Regular gray body.
- **Uppercase micro-labels** with wide tracking tag every card (category left, year right).
- **Sentence-case headlines ending in a period** ("Product Designer.") give a confident, editorial voice.
- Timeline entries: bold role name, blue linked company name, small gray description.

---

## 3. Spacing & Layout

Generous, grid-disciplined, card-based.

- **Container:** centered max-width (~1140–1200px) with wide side margins.
- **Section rhythm:** very large vertical padding between sections (~120–160px), alternating white / light-gray backgrounds to segment content without dividers.
- **Grid:** 2-column project grid with consistent ~24–32px gutters; 3-column grid for service cards; 2-column split (heading left, timeline right) in the experience section.
- **Cards:** ~16px corner radius, hairline border, image bleeding to card edges on top, ~20–24px inner padding for the text block below.
- **Buttons & chips:** fully rounded pills, ~14–16px vertical / 24–28px horizontal padding; small icon-only social buttons as bordered circles/squares (~40px).
- **Hero:** asymmetric split — text column left (~55%), rounded-corner portrait card right with a floating identity chip overlapping its bottom edge.
- **Micro-spacing:** tight, consistent 8px-base stacking (status chip → headline → role → paragraph → buttons → socials).

---

## 4. Aesthetic Feel

**Clean, confident, Swiss-influenced minimalism with a friendly product-design polish.**

- **Whitespace-first:** density is low; every element breathes. Hierarchy comes from scale and weight, not decoration.
- **Card-and-pill vocabulary:** everything interactive or grouped lives in a rounded container — cards, pill buttons, status chips, floating name tag. Softness (radii) balances the stark black/white contrast.
- **Editorial confidence:** huge statement typography, periods at the end of headlines, first-person voice ("I design products that people love to use").
- **Trust-signaling structure:** availability badge, dated project meta, linked employer timeline — the layout reads like a credible, hireable professional rather than an art piece.
- **Restraint as brand:** no gradients on chrome, no shadows beyond subtle card lift, no ornamental graphics. The work imagery is the only "loud" element, which keeps attention on the portfolio pieces.

### One-line summary

> Minimalist black-on-white portfolio with a single electric-blue accent, extra-bold grotesque display type, uppercase micro-labels, pill-shaped controls, and a spacious card grid — professional, modern, and quietly confident.
