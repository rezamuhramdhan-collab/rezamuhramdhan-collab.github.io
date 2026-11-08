# Case-study layout: the editorial journey

Owner refinement: remove the repeated short line ornaments beside labels and
transition copy, and omit the entire project-brief excerpt section. The cover
now leads directly into chapter navigation and the complete authored story.
The initial brief-link checks below are historical verification of the earlier
revision, not controls in the refined layout. Homepage project previews remain.

Refinement QA: strict TypeScript and the production build pass. Browser checks
confirm the case brief is absent, all nine authored chapters remain, and the
cover leads directly to the chapter reader. The final chapter link still selects
Reflection correctly. Homepage chapter-label and transition ornaments are gone;
the project index uses the same simplified label. At 375px the case-study page
has no horizontal overflow. No console warnings or errors appeared during the
fresh production-preview checks. No CMS or project content was modified.

This revision changes the detail-page composition while keeping the established
sky palette, red thread, Plus Jakarta Sans and punctuation preference.
ENERGY 2 / RHYTHM 3 / MOTION 1 for the case-study pages.

The design read is an editorial project story for hiring teams and collaborators:
a navy cover establishes the project, a pale reading canvas carries the evidence,
and a quiet red index connects the chapters. Existing imagery supplies the visual
evidence; no new images, statistics, testimonials or project claims are invented.

- A wide opening pairs the actual project title and summary with a compact
  metadata ledger. Available cover media gets a full-width presentation.
- The project brief offers source-backed challenge, decision and outcome
  excerpts. Missing excerpt types are omitted rather than fabricated.
- A horizontal chapter bar replaces the side contents list. It follows reading
  position and brings the current link into view without moving the page.
- Numbered headings sit beside the narrative on desktop, then stack above it
  on mobile. Plain reading surfaces replace repeated glass cards.
- Existing image galleries, decision steps, results and reflections keep their
  authored order, anchors, dimensions, captions and text.
- A full-width link names the actual next project. A separate contact action
  leads to the existing form. Original fallback CTA behavior remains available.
- Password-gated stories use the same editorial reader after successful unlock.
  The password, encryption and plaintext-protection logic is unchanged.

## QA and anti-slop delivery gate

Scope: changed case-study components and their existing shared interactions.
The earlier site-wide verification remains in verification.md. This is an
implementation check, not a claim of independent WCAG certification.

- R-02 PASS: the five checked case pages contain no displayed em dashes.
- R-03 PASS: all five local case routes fit 375px with no page overflow; the
  reading layout was also inspected at 840px and 1280px. Chapters stack on phone.
- R-17 PASS: project claims and outcomes come from existing CMS content.
- R-18 PASS: no testimonial or person was added.
- R-23 PASS: no new visual asset or destination was invented; the chapter bar
  reuses the existing authored sections and IDs.
- R-24 PASS: all nine chapter targets on the checked story exist; all five
  fixture routes report zero missing chapter anchors.
- R-25 PASS: text pairs calculated at 13.18:1 for ink on paper, 7.28:1 for body
  on paper, 6.87:1 for red on paper, 7.19:1 for the active tab, 6.89:1 for
  captions, and 5.29:1 for explicit image placeholders. Opening text pairs
  tested against a conservative dark surface exceed 7:1.
- R-26 PASS: every changed link is native and has a real target. The nine
  chapter links, three brief links, next story, contact, All Work, Back and
  Back to top were clicked and their destination recorded below.
- R-27 PASS: the existing empty-story explanation, arrival treatment, recovery
  pages, password feedback and protected state remain present.
- R-28 PASS: no FAQ was introduced.
- R-32 PASS: Enter activates chapter links; Tab reaches Back to top; Enter
  returns to the cover. Light and dark regions have explicit focus colors.
- R-33 PASS: the layout is implemented in source components and scoped CSS;
  no runtime rewriting, injected patch script or external styling tool is used.
- R-34 PASS: no theme toggle was added. Both the dark opening and light reader
  were inspected at the supported viewport sizes.
- R-35 PASS: nine tests, strict TypeScript and the production server build pass;
  the built app was used for the recorded click-through. No console warnings
  or errors were observed in these browser checks.
- R-36 PASS: no security, compliance or unmeasured performance claim was added.
- R-37 PASS: the existing owner-approved Your Name atmosphere, red-thread
  identity and Plus Jakarta Sans remain the direction for this new layout.
- R-38 PASS: project facts are existing data; missing media retains an explicit
  placeholder and absent cover media is omitted.
- R-39 PASS: links, headings, definition lists, figures and forms keep native
  semantics. Active chapter uses aria-current. Existing motion controls and
  reduced-motion rules remain; chapter auto-scroll becomes instant when paused.
- R-40 PASS: intrinsic media dimensions, high-priority cover loading, responsive
  image sizes and lazy body media remain. No animation library or dependency
  was added, and no Core Web Vitals score is claimed.
- R-01 PASS: the cover's sky gradient connects the site identity to the story;
  the uniform light reader deliberately protects long-form contrast.
- R-04 PASS: existing back and directional arrows indicate navigation.
- R-06 PASS: the owner's Plus Jakarta Sans supplies every typography token;
  small labels identify chapter and project metadata rather than decoration.
- R-07 PASS: no decorative grid, graph paper or dot pattern was introduced.
- R-08 PASS: arrows identify source excerpts, returning to work and the next
  story; the contact action is plain text.
- R-09 PASS: no promotional badge or duplicate headline capsule was added.
- R-10 PASS: reading chapters use opaque paper; the shared frosted site nav
  remains the established navigational layer.
- R-12 PASS: reading chapters and metadata have no large drop shadows.
- R-13 PASS: no glow was added to chapters, index links or result rows.
- R-14 PASS: authored block types retain distinct presentations; there is no
  repeated feature-card grid.
- R-19 PASS: only the existing route arrival and small navigation feedback
  remain; reading content does not float or animate on every scroll.
- R-22 PASS: no generic illustration was added.
- Liveliness PASS: the explicit dials match the wide cover, compact brief,
  margin headings, varied authored blocks and large next-story ending.
- Focal point PASS: project title, chapter heading and next-project title
  provide the focal point in their respective reading regions.
- Whitespace PASS: the margin column separates wayfinding from evidence;
  section rules and spacing mark authored chapter boundaries.
- Accent PASS: restrained red identifies the thread, index and active chapter.
- Identity PASS: dusk cover, red thread, pale daylight reader and quiet night
  ending continue the original atmosphere without film reproductions.
- Design read PASS: the rationale and audience are stated above the source map.
- C-1 PASS: each major composition choice has a reading or wayfinding purpose.
- C-2 PASS: the changed controls have verified destinations and visible feedback.
- C-3 PASS: chapters come from content rather than a fixed template count.
- C-4 PASS: long titles and all five fixture layouts were checked on phone;
  the protected reader was checked after correct and incorrect passwords.
- C-5 PASS: no new outcome, person, quotation or measurement was fabricated.
- R-05 PASS: a broad cover, excerpt band, margin chapters, galleries and next
  project create varied rhythm rather than identical cards.
- R-11 PASS: image corners, rectangular navigation and existing buttons have
  different radii for their different purposes.
- R-15 PASS: the changed primary action says Talk about a project; the next
  action names the actual project.
- R-16 PASS: no marketing buzzword was introduced in new framing.
- R-20 PASS: this is a project narrative shaped by the owner's banking work,
  existing sky identity and authored decisions.
- R-21 PASS: the owner-requested night cover opens onto a light reading canvas;
  no unrelated theme setting was introduced.
- R-29 PASS: navy, paper, blue-gray text and restrained red use scoped tokens.
- R-30 PASS: the composition follows the owner's narrative brief and content,
  rather than reproducing another product interface.
- R-31 PASS: layout, type, color, spacing, imagery and motion purposes are
  written above and represented directly in the source.

## Recorded interactions

- Overview through Reflection: all nine links resolve to their existing hash
  and matching active chapter; no overflow was observed while jumping.
- Read the challenge: #problem; Read the decisions: #solution; Read the results:
  #results. Chapter content remains below the sticky bars.
- Last chapter on phone: #reflection remains fully visible in the horizontal
  chapter bar after automatic scrolling.
- Back to top: #case-top. Keyboard Enter also activates the return.
- Next story: /work/mobile-banking-app renders its actual title.
- Talk about a project: /#contact renders the existing name/email form.
- All Work: /#work. Back: / with the homepage heading.
- Temporary local protected fixture: server HTML contains the password gate
  without the authored story paragraph. Incorrect password shows the error;
  correct password reveals nine chapters and nine navigation links on the light
  canvas without overflow. Fixture and helper script were removed afterward.

## Source map

The final GitHub Pages static export also passed after the navigation fixes.
CMS routes were restored after the export. No content, mapper, schema, canonical
URL or case-study route file changed in this revision.

- site/components/case/CaseStudy.tsx: opening, excerpt brief and next-story ending.
- site/components/case/sections.tsx: margin headings and shared protected reader.
- site/components/case/CaseNav.tsx: position tracking and horizontal visibility.
- site/components/case/images.tsx: responsive wide cover sizes.
- site/app/case-study.css: scoped layout, reading palette and breakpoints.
