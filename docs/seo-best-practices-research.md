# SEO Best Practices for Search Visibility

*An in-depth research reference — how search ranking works in the AI era, the practices that actually move visibility, what to skip, and how it applies to this portfolio. Researched July 2026.*

---

## 1. Executive Summary

SEO in 2026 is no longer a bag of keyword tricks — it is the discipline of being **the most credible, fastest, most extractable answer** to the questions your audience asks. Three shifts define the current landscape:

1. **AI answers sit on top of classic ranking.** Google's AI Overviews and AI Mode are built on the same index and ranking systems as the ten blue links; pages cited in AI answers come overwhelmingly from top organic results. Google's official guidance is blunt: optimizing for AI search *is* SEO — same fundamentals, same signals.
2. **Quality is evaluated sitewide and continuously.** The Helpful Content system was folded into core ranking (March 2024); thin or unoriginal content now drags down the whole domain, not just the page it lives on.
3. **Experience is measurable.** Core Web Vitals (LCP, INP, CLS) are field-measured page-experience signals. They rarely outrank relevance, but at equal relevance they tip the scale — and they directly affect whether visitors stay.

The stack, in order of impact: **content people actually want → technical crawlability → intent-matched on-page structure → performance → structured data → authority (links & mentions)**. Everything else is commentary.

---

## 2. How Search Works Now

### 2.1 The classic pipeline

Google's pipeline is still **crawl → index → rank**. Ranking blends hundreds of signals, the heavyweight ones being relevance to query intent, content quality/originality, page experience, and link-based authority. Two structural facts matter for strategy:

- **Mobile-first indexing**: Google evaluates the mobile rendering of your page. A desktop-perfect site with broken mobile layout ranks on its mobile brokenness.
- **The 75th-percentile rule**: Core Web Vitals use *field data* (real Chrome users, via CrUX) at the 75th percentile — your slowest common experience, not your fastest lab run.

### 2.2 The AI layer (AI Overviews, AI Mode, chat assistants)

Generative answers use **retrieval-augmented generation**: the model retrieves indexed pages, then composes an answer citing a handful of sources. Consequences:

- **You must rank to be cited.** Studies consistently show AI Overview citations drawing from top organic results. There is no separate "AI index" to optimize for.
- **Zero-click grows** (~69% of searches by 2026, up from ~56% in 2024). Being *cited as the source* increasingly is the win condition — brand visibility inside the answer, plus the smaller-but-higher-intent clicks that follow.
- **Google explicitly disavows GEO folklore**: no `llms.txt`, no "chunking" content into fragments, no AI-specific writing style, no schema markup requirement for AI visibility. Their guide's checklist is: unique first-hand content, technical crawlability, semantic HTML, good media, and monitoring via Search Console's generative-AI performance report.

The strategic read: **"answer-shaped" content wins in both layers** — a clear question addressed by a direct, self-contained answer near the top, followed by depth. That's not a new AI tactic; it's what featured snippets rewarded for a decade.

### 2.3 E-E-A-T: the quality lens

**Experience, Expertise, Authoritativeness, Trustworthiness** — the criteria in Google's quality-rater guidelines. It is not a direct algorithmic score; it is the *target* Google's ranking systems are trained to approximate. Practically:

- **Experience** (added 2022) is the differentiator AI content can't fake: first-person evidence you actually did the thing — real screenshots, real metrics, real decisions and trade-offs.
- **Authorship matters**: identifiable authors with bios, credentials, and consistent identity across the web.
- **Trust signals**: HTTPS, working contact routes, honest claims, no dark patterns.

For a portfolio, E-E-A-T is almost the whole game: a case study documenting *your* process with *your* numbers is precisely the "first-hand experience" Google says stands out — commodity listicles are what got devalued.

---

## 3. The Practice Areas, In Priority Order

### 3.1 Content: match intent, demonstrate experience

- **One page, one intent.** Classify the query you want (informational / navigational / transactional / commercial-investigation) and shape the page for it. Ranking mismatches are usually intent mismatches.
- **Answer first, depth second.** Lead with a direct, extractable answer (2–4 sentences); expand below. Serves skimmers, featured snippets, and AI citation alike.
- **Original beats comprehensive.** Unique data, first-hand process, opinionated synthesis. Google's systems specifically reward "information gain" over restatement.
- **Freshness where it matters**: update pages whose subject moves (and show a visible updated date); stable evergreen content doesn't need cosmetic re-dating.
- **Sitewide hygiene**: prune or noindex thin, duplicative, or stale pages — sitewide quality classification means dead weight is a tax on everything else.

### 3.2 Technical: be trivially crawlable

- **Crawl access**: sane `robots.txt`, one canonical URL per page (`rel=canonical`), no accidental `noindex`, clean internal 301s (no chains), custom 404s that return 404.
- **XML sitemap** listing canonical URLs with real `lastmod`, referenced from robots.txt and submitted in Search Console.
- **Rendering**: server-render or statically generate content HTML. Google executes JavaScript, but rendering is deferred and imperfect — and most non-Google AI crawlers *don't execute JS at all*. Static HTML is the safest substrate for both layers. (Client-side-only content — like content revealed after a password gate — is invisible to crawlers by design; that's a feature for locked case studies.)
- **Semantic HTML**: one `<h1>`, hierarchical `<h2>/<h3>`, `<main>/<nav>/<article>`, descriptive link text ("view the design-system case study", never "click here"). This is also what extraction systems parse.
- **HTTPS everywhere, no mixed content.**
- **Internal linking**: every page reachable within ~3 clicks; contextual links with descriptive anchors distribute authority and define topical structure. Orphan pages effectively don't exist.

### 3.3 On-page: the metadata layer

- **`<title>`**: unique per page, ~50–60 chars, primary topic first, brand last (`Design System at Bank Saqu — Reza Ramdhan`). Still one of the strongest on-page signals.
- **Meta description**: ~150–160 chars; not a ranking factor, but it is your SERP ad copy — write it for click-through, or Google rewrites it for you.
- **URLs**: short, lowercase, hyphenated, human-readable, stable. (`/work/design-system` — already right.)
- **Headings that state the point**, not clever labels: extraction systems and skimmers read them as the outline of your argument.
- **Images**: descriptive `alt` (accessibility + image search), descriptive filenames, explicit `width`/`height` (CLS), modern formats (WebP/AVIF), `loading="lazy"` below the fold *only* — never on the LCP image.
- **Open Graph / Twitter cards**: don't affect ranking, but control how links unfurl on LinkedIn/X/Slack — which for a portfolio is where most sharing happens.

### 3.4 Performance: Core Web Vitals

| Metric | Good (p75) | What it measures | Typical fixes |
|---|---|---|---|
| **LCP** | ≤ 2.5 s | Largest content paint | Preload hero image/font, CDN, no lazy-load on LCP element, server response < 800 ms |
| **INP** | ≤ 200 ms | Worst interaction latency (replaced FID, Mar 2024) | Less/deferred JS, break long tasks, avoid hydration jank |
| **CLS** | ≤ 0.1 | Layout shift | Dimensions on images/embeds, reserve space, `font-display: swap` with fallback metrics |

Field data (CrUX / Search Console) is the truth; Lighthouse is the lab diagnostic. CWV is a tiebreaker signal, not a dominance signal — but slow pages also lose the humans that all the other signals depend on.

### 3.5 Structured data: label what things are

JSON-LD (Google's preferred format) makes entities machine-legible and unlocks rich results. It is **not** required for AI visibility (Google says so directly), but it strengthens entity understanding and eligibility for enhanced SERP features. Relevant types for a portfolio:

- `Person` (site owner: name, jobTitle, sameAs → LinkedIn/Instagram) — anchors your entity identity
- `WebSite` + `BreadcrumbList` — site structure
- `CreativeWork` / `Article` per case study (author → your `Person`, datePublished, image)

Validate with Google's Rich Results Test; invalid markup is worse than none.

### 3.6 Authority: links and mentions, earned not bought

Backlinks remain a core authority signal, but the bar moved from volume to **relevance and editorial legitimacy**. For an individual portfolio, realistic levers:

- Publishing case studies/write-ups that design communities link to (the content *is* the link bait)
- Speaking, podcasts, design-award galleries, community showcases (Dribbble/Behance profiles linking home)
- Consistent name + URL across profiles (entity reconciliation feeds E-E-A-T and AI-era brand retrieval)
- What to skip: link buying, exchange schemes, comment spam — spam-policy territory with real demotion risk.

### 3.7 Measure: close the loop

- **Google Search Console** (non-negotiable): index coverage, queries/impressions/CTR, CWV field data, and the generative-AI performance report for AI-feature visibility.
- **Bing Webmaster Tools**: cheap to set up; Bing's index feeds several AI assistants.
- Watch **impressions before clicks** — in a zero-click world, rising impressions with flat clicks can still mean growing answer-citation visibility.

---

## 4. What *Not* To Do (current myth list)

Straight from Google's 2026 AI-optimization guidance plus spam policy:

- ❌ `llms.txt` or other special "AI files" — ignored by Google Search
- ❌ Chunking pages into fragments "for RAG" — systems extract from long pages fine
- ❌ Rewriting copy "for AI" — semantic systems handle natural language
- ❌ Buying mentions/links or manufacturing citations — spam policy violation
- ❌ Keyword stuffing, doorway pages, scaled AI-generated filler — the exact target of recent core updates
- ❌ Chasing schema types you don't genuinely qualify for
- ❌ Treating lab Lighthouse scores as the goal instead of field data

---

## 5. Applied: This Portfolio (Next.js static export + Payload)

An honest audit of where this site stands against the above, ordered by impact:

**Already strong**
- Statically generated HTML for all public content (ideal substrate — crawlers and non-JS AI bots see everything)
- Clean, stable, human-readable URLs (`/work/<slug>`)
- Per-project `<title>` + description via `generateMetadata`; project summaries make natural meta descriptions
- HTTPS on both deployments; images on a CDN with `width`/`height` from the media library
- Case studies are first-person experience with real process and metrics — textbook E-E-A-T "Experience"

**Gaps worth closing** (roughly in order)
1. **No `sitemap.xml` / `robots.txt`** — App Router makes these one-file additions (`app/sitemap.ts`, `app/robots.ts`, both static-export compatible).
2. **Duplicate-content risk across the two domains**: the same site lives at `rezamuhramdhan-collab.github.io` and `rezadesign.vercel.app` with no canonical pointing at the primary. Pick the primary domain and emit `rel=canonical` (Metadata API `alternates.canonical`) on every page; consider `noindex` on the secondary.
3. **No Open Graph / Twitter card images** — case-study links currently unfurl bare on LinkedIn, the highest-value channel for a designer. `opengraph-image` per project (hero image) is a small lift.
4. **No structured data** — add `Person` (homepage) and `CreativeWork` (case studies) JSON-LD.
5. **Homepage title/description are hardcoded** in the layout rather than CMS-driven; fine today, worth wiring to Site Settings when convenient.
6. **Not registered in Search Console** (as far as the repo shows) — without it there's no field CWV data, no index diagnostics, no AI-visibility report.
7. **Locked case studies**: encrypted sections are invisible to crawlers (correct — that's the point), but the *public* header/summary of locked projects should carry enough substance to rank the page shell on its own.

---

## 6. References

**Primary sources**
- [Google: Optimizing for AI features on Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) — the official word on GEO/AEO, and the myth list in §4
- Google Search Central: SEO Starter Guide, Helpful-content guidance, Spam policies
- [web.dev — Core Web Vitals](https://web.dev/vitals/) (LCP/INP/CLS definitions and thresholds)

**Current-landscape analysis (2026)**
- [Search Engine Journal — Google's AI guide calls AEO/GEO "still SEO"](https://www.searchenginejournal.com/googles-new-ai-search-guide-calls-aeo-and-geo-still-seo/575026/)
- [Search Engine Land — Mastering generative engine optimization in 2026](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142)
- [LLMrefs — GEO: 2026 guide to AI search visibility](https://llmrefs.com/generative-engine-optimization)
- [Analytify — Most important Google ranking factors 2026](https://analytify.io/google-ranking-factors/)
- [ALM Corp — Core Web Vitals 2026](https://almcorp.com/blog/core-web-vitals-2026-technical-seo-guide/)
- [Evergreen Media — SEO trends 2026: the AI era](https://www.evergreen.media/en/guide/seo-this-year/)

---

*Companion documents: [solid-architecture-research.md](./solid-architecture-research.md), [solid-code-audit.md](./solid-code-audit.md). The §5 gap list is implementation-ready if/when SEO work is scheduled.*
