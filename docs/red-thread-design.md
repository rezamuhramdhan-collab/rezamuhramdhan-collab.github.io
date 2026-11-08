# A journey between two worlds

Implementation: the existing Next.js App Router, React, CSS, and Payload CMS.
This is a redesign of the existing portfolio, not a separate template or a new
publishing platform. No film stills, characters, logos, or copied compositions.

## 1. Short audit and preservation contract

The original site has a strong content foundation: five published case studies,
structured services, experience, a biography, contact details, and editable CMS
records. Its original muted gray text, small reading sizes, compressed project
rows, decorative wireframe, and weak chapter navigation made that material harder
to understand. The first sky treatment established atmosphere mainly in the hero;
the rest of the site needed the same narrative and visual care.

Kept:

- Homepage, `/work`, and every `/work/[slug]` project route.
- Existing case study titles, summaries, authored blocks, roles, scope, years,
  outcomes, media relationships, experience, services, biography, and contacts.
- CMS data access, schema, publication status, project ordering, password
  encryption/decryption, next-project links, and category filtering.
- Contact's real mailto behavior. The interface prepares a draft; the visitor
  sends it in their email application. It never claims delivery.
- The existing metadata generator, title and description, canonical behavior,
  Open Graph/Twitter configuration, JSON-LD, robots, sitemap generation,
  analytics configuration, and GitHub Pages/Vercel deployment paths.
- Existing navigation destinations, download destinations from the CMS, and
  social links. Framing and microcopy change; real facts do not.

No testimonials existed. The owner explicitly selected an honest empty chapter,
so there are no fabricated quotations, identities, avatars, or endorsements.
Production CMS records were not edited. Local fixtures support verification.

## 2. Story map

| Existing section | Chapter and emotional beat | Scene | Framing and transition |
| --- | --- | --- | --- |
| Hero | 01: Two worlds / separation | Original painted sky, geometric city silhouette, countryside ridge; a red thread divides and connects them | “Design brings us closer.” Name, role, original bio and actions remain. Ends with “Every connection starts with a person.” |
| About | 02: The thread / connection | Cloud-white daylight; a looping red thread crosses toward the biography | “Between people and possibility.” Personal framing surrounds the original first-person facts. Ends with “A thought becomes a sketch. A sketch becomes a story.” |
| Selected work | 03: Fragments of the comet / discovery | Dusk violet, staggered translucent fragments, restrained luminous borders | “Small decisions. Lasting connections.” Existing problem, design response, and reported outcome appear on hover or keyboard focus. Touch users can read them directly. Ends with “Behind every finished screen, there was a search.” |
| Services / approach | 04: The search / persistence | A vertical red path through night, dawn, and morning | “A way through the unknown.” The actual services provide the steps; all CMS entries are supported. Ends with “Each step leaves something worth carrying forward.” |
| Experience | Interlude: Along the way / remembering | A quiet cobalt chapter and a readable career timeline | Original roles, companies, dates, and achievements remain. Ends with “The work is remembered. So are the people beside it.” |
| Testimonials | 05: Twilight meeting / openness | Amber light and violet; an empty memory panel | “Some stories arrive through other people.” Clearly says approved collaborator reflections have not been added. Links to real case studies. Ends with a bridge to contact. |
| Contact | 06: Remembering your name / invitation | Navy and warm violet, a glass letter, a tied red thread | “Let’s find a shared direction.” Original contact headline remains as context. Friendly, explicit draft-email instructions. Ends with “Somewhere between an idea and a message, a new story begins.” |
| Footer | After the story / quiet closure | A sparse original CSS starfield | “Some paths cross for a reason. Thank you for following mine.” Original copyright and links remain. |

### The journey beyond the homepage

- Project index: “Fragments of the comet,” original project titles and filters,
  the same fragment cards, then a quiet invitation to continue.
- Case studies: “A fragment, remembered,” original project identity, existing
  summary and metadata, linked short-version excerpts, numbered chapters,
  persistent contents, original galleries and next-project controls.
- Protected stories: the same dark sky and glass card, a visible password label,
  clear error feedback, and the existing local decryption behavior.
- 404: a lost comet, “We just missed each other,” and explicit home/work links.
- Error: “The connection slipped,” a clear explanation, retry, and home link.
- Arrival: a finite drawing thread and comet flare on route entry. Keep route
  resolution outside Suspense so unknown project URLs preserve HTTP 404.
- Empty: a short scene-specific sentence followed by the actual missing-data
  explanation and an available next action.
- Draft feedback: warm copy that distinguishes composing from sending.
- Payload workspace: the same blue-toned palette and serif headings, while its
  native controls, theme switching, validation, and editorial functions remain.

## 3. Design system

Design read: an atmospheric personal portfolio for collaborators and hiring
teams, using two worlds, a connecting red thread, and a day/night narrative.
ENERGY 3 / RHYTHM 3 / MOTION 3.

The owner's explicit brief authorizes glass, scene gradients, glow, a starfield,
and multiple atmospheric colors. Each technique has a purpose below; these are
recorded session choices under anti-slop R-37, not unexamined defaults.

### Color tokens

| Token | Value | Role |
| --- | --- | --- |
| `--night` | `#080f29` | Reading ground and final starfield |
| `--ultramarine` | `#111f4c` | Deep sky identity |
| `--cobalt` | `#244a88` | Distance and morning transition |
| `--violet` | `#392b59` | Dusk sky |
| `--magenta` | `#653956` | Twilight atmosphere |
| `--amber` | `#edc39d` | Golden-hour detail, not body text on white |
| `--thread` | `#ff8e9b` | Thin signature line, focus and progress |
| `--thread-strong` | `#a62646` | Primary action fill with white text |
| `--ink` | `#f8f5ff` | Text on dark scenes |
| `--muted` | `#c5d0e8` | Opaque secondary text on dark scenes |
| `--glass` | `rgba(13,24,53,.92)` | Predictable reading surface over atmosphere |
| Daylight ink / secondary | `#172b4c` / `#435672` | Biography text on light clouds |

Scene colors are atmospheric. Text uses controlled opaque surfaces or
high-opacity scrims; it does not depend on the brightness of a painted cloud.

### Typography, space, radius and light

| System | Tokens / treatment | Why |
| --- | --- | --- |
| Display | Locally hosted Playfair; regular weight; `--type-hero: clamp(52px,6.6vw,92px)` and `--type-title: clamp(36px,4.5vw,62px)` | A cinematic, human voice with a visible contrast to body copy |
| Body | Locally hosted Instrument Sans, normally 17–18px, generous line height | Long case studies remain comfortable to read |
| Metadata | DM Mono only for small chapter indices and dates | Wayfinding, not a terminal aesthetic |
| Spacing | 8 / 16 / 24 / 40 / 72px; chapter separation `clamp(80px,9vw,136px)` | Short distances connect an argument; larger ones mark scene changes |
| Reading measure | Maximum 720px, with responsive inner panels | Keeps long lines from tiring the reader |
| Radius | 8px controls, 22px fragments, 30px letter panel; smaller on mobile | Distinguishes controls from content and scenes |
| Inner light | `inset 0 1px 0 rgba(227,236,255,.13)` | Suggests glass without adding blur to every card |
| Thread glow | `0 0 18px rgba(255,142,155,.25)` | Gives the narrative line a luminous identity |
| Motion | 180ms controls; 850ms arrival; 26s gentle cloud drift | Quick feedback, soft scene change, slow background atmosphere |

### Component contracts

| Component | Visual behavior | Function and accessibility |
| --- | --- | --- |
| Global navigation | Frosted midnight bar; measured red underline slides to active link | Existing CMS destinations, active section tracking, visible focus; appears on all public pages |
| Mobile menu | Full-screen twilight, large staggered serif links | Modal semantics, first focus on Close, Tab trap, Escape dismissal, body scroll lock, focus return |
| Primary button | Strong red fill, luminous edge, small hover flare | Real navigation or button action; 44px+ target; readable white text |
| Secondary button | Subtle glass with a defined border | Real destination, clear hover, keyboard focus |
| Fragment card | Rounded translucent dusk panel, painterly top edge; title and real project metadata | Full card opens its original route; source excerpts reveal on hover/focus and remain available to touch users |
| Process step | Glass reading panel on a vertical red thread | Existing service content, no invented process claims |
| Form | A letter-like panel, underlined fields, red focus glow | Visible labels, native required/email validation, existing service choices, honest mailto feedback |
| Case chapter | Navy reading panel with chapter index | Existing block renderers, captions and images, semantic headings, valid generated/authored anchors |
| Protected chapter | Glass password panel | Existing encryption, busy state, visible label, accessible error; contents appear after successful decryption |
| Loader | One finite red-thread drawing and end flare | Decorative route arrival; hidden under reduced motion |
| 404 / error / empty | Same sky, thread and serif language | Explicit cause and useful recovery action, not poetry alone |
| Footer | Quiet sparse starfield, sign-off, original links | All destinations work; star opacity animation is pausable |
| Motion control | Small persistent “Pause atmosphere” / “Resume atmosphere” control | Pauses scenery without freezing menu text or route content; preference persists locally |
| Reading progress | Thin red thread at the top edge | Real scroll progress, labeled progressbar, no cursor replacement |

### Motion and performance

The comet falls continuously in a 4.2-second loop, with a bright head and a
cyan/pink tail. There is no replay button. The atmosphere pause control and
reduced-motion settings stop the animation. Cloud drift and subtle
star opacity are continuous only while atmosphere is enabled. Reduced motion
removes the comet, transition flare, blur reveals, drift, and staggered arrivals.
A persistent pause control also stops scenery and immediately exposes readable
content; navigating while paused cannot freeze a page or menu half-transparent.

Original scenery is a single approximately 212 KiB WebP, reused faintly where
appropriate. City, countryside ridge, red thread, loader and stars are CSS shapes.
No animation library, cursor-trail canvas, new font service, or film artwork is
added. The optional cursor trail is omitted to protect input clarity and cost.
The hero reserves space; images retain dimensions or an aspect-ratio container.

## 4. Implementation map

- `site/app/globals.css`: existing structural primitives.
- `site/app/journey.css`: active scene tokens, components, states, and motion.
- `site/app/(site)/layout.tsx`: shared navigation, footer, motion and progress.
- `site/app/(site)/template.tsx`: route-arrival crossfade and flare.
- `site/components/JourneyEffects.tsx`: reduced motion, pause, progress,
  intersection reveals, continuously looping comet.
- `site/components/DesktopNav.tsx`: active location and sliding thread.
- `site/components/MobileNav.tsx`: full-screen accessible navigation.
- `site/components/Chapter.tsx`: reusable narrative labels and closing lines.
- `site/components/home/*`: the complete homepage story, original content.
- `site/components/work/*`: category filtering and source-backed fragments.
- `site/components/case/*`: every case study, gallery, lock and reading state.
- `site/app/(site)/template.tsx`, `error.tsx`, `not-found.tsx`: arrival and recovery states.
- `site/app/global-not-found.tsx`: the same recovery scene for completely
  unmatched URLs, with an actual 404 and noindex response.
- `site/app/global-error.tsx`: an independent, static recovery document if the
  normal layout or CMS cannot load.
- `site/app/(payload)/custom.scss`: non-invasive editing-workspace palette.

## 5. Changelog and rationale

- Moved About immediately after the hero to establish a person before projects.
- Added six chapter markers and connective closing lines to give scrolling an arc.
- Applied the atmosphere to shared navigation, project index, all case studies,
  form, footer, and route/data states, rather than confining it to a hero image.
- Preserved Experience as an interlude instead of deleting real career history.
- Used existing services as process steps, without inventing new offerings.
- Added source-backed hover/focus excerpts to help readers see problem,
  response, and reported outcome before opening a case study.
- Added a truthful empty twilight chapter because testimonials were absent.
- Kept all existing factual records, SEO generation and backend behavior.
- Added global motion controls and corrected paused finite animations so menus
  and route arrivals always finish in a readable state.
- Kept reduced motion, keyboard access, real progress, native form validation,
  encryption, and responsive reading as functional parts of the visual system.

Verification results and remaining limits are recorded separately in
`verification.md`. No live deployment is implied by a local preview.
