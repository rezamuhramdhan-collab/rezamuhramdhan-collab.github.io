# SOLID Architecture in the Code Development Process

*An in-depth research reference — principles, history, practical application, trade-offs, and modern relevance.*

---

## 1. Executive Summary

SOLID is a set of five design principles for writing software that can **absorb change without decaying**. It is not a framework, a pattern catalogue, or an architecture in itself — it is a theory of *dependency management*: how modules should depend on each other so that a change in one place does not ripple destructively through the system.

The five principles in one line each:

| Principle | Statement | The problem it attacks |
|---|---|---|
| **S** — Single Responsibility | A module should have one, and only one, reason to change | Unrelated concerns tangled in one place, so every change risks breaking something else |
| **O** — Open–Closed | Open for extension, closed for modification | Adding a feature forces edits to existing, tested code |
| **L** — Liskov Substitution | Subtypes must be substitutable for their base types | Polymorphism that lies — code that breaks when handed a "valid" subtype |
| **I** — Interface Segregation | Clients should not depend on methods they don't use | Fat interfaces that couple clients to things they never call |
| **D** — Dependency Inversion | Depend on abstractions, not concretions | High-level policy chained to low-level detail (databases, APIs, frameworks) |

The unifying idea: **stable things should not depend on volatile things.** Business rules change for business reasons; databases, UIs, and third-party services change for technical reasons. SOLID gives you the tools to keep those change-axes decoupled.

---

## 2. Origins and History

SOLID did not appear fully formed. It is a synthesis of two decades of prior work, packaged by Robert C. Martin ("Uncle Bob") and named by someone else entirely.

- **1972 — David Parnas, "On the Criteria To Be Used in Decomposing Systems into Modules."** The intellectual ancestor. Parnas argued that modules should be decomposed around *design decisions likely to change* (information hiding), not around steps in a flowchart. SRP and OCP are direct descendants of this idea.
- **1988 — Bertrand Meyer, *Object-Oriented Software Construction*.** Introduced the **Open–Closed Principle**. Meyer's original mechanism was implementation inheritance: you extend a class rather than edit it.
- **1987/1994 — Barbara Liskov.** Her 1987 OOPSLA keynote "Data Abstraction and Hierarchy" posed the substitutability question; the 1994 paper with Jeannette Wing, *A Behavioral Notion of Subtyping*, formalized it. This became the **Liskov Substitution Principle**.
- **1995–2000 — Robert C. Martin.** Through articles in *C++ Report* and consulting work (ISP famously grew out of untangling Xerox printer software), Martin developed and named SRP, OCP (recast around polymorphism rather than inheritance), LSP, ISP, and DIP. He collected them in his 2000 paper **"Design Principles and Design Patterns,"** written to combat what he called *software rot* — rigidity, fragility, immobility, and viscosity in aging codebases.
- **~2004 — Michael Feathers** (author of *Working Effectively with Legacy Code*) noticed the five principles could be rearranged into the acronym **SOLID**. The name stuck and did as much for the principles' spread as their content did.
- **2017 — Martin's *Clean Architecture*** restated the principles for a new generation and clarified long-standing misreadings — most importantly reframing SRP around *actors* (see §3.1).

Worth internalizing: the principles were born in a **statically typed, class-based OO world** (C++, then Java) at a time when recompiling and redeploying a monolith was expensive. Part of the modern debate (§7) is about how much of that context still applies.

---

## 3. The Five Principles In Depth

Each section below gives the canonical definition, what it actually means (including the common misreading), the smells that signal a violation, a before/after TypeScript example, and how the principle shows up in modern React/Next.js-style development.

### 3.1 Single Responsibility Principle (SRP)

> "A class should have only one reason to change." — later refined by Martin to: "A module should be responsible to one, and only one, **actor**."

**What it actually means.** SRP is the most misquoted principle in the set. It does *not* mean "a function should do one thing" (that's a separate, lower-level heuristic about function composition). SRP is about **people and reasons for change**: if the finance team, the ops team, and the marketing team can each demand a change to the same module, that module has three responsibilities and will become a merge-conflict battleground where a change for one actor breaks behavior another actor relies on.

**Smells that signal a violation:**
- A file that changes in almost every pull request, regardless of feature.
- Commit messages on one file spanning unrelated domains ("fix invoice rounding + update email template").
- A class/module whose methods use disjoint subsets of its fields — two responsibilities sharing a roof.

**Before — one module, three actors:**

```ts
// employee.ts — HR, finance, and the DBA all have a reason to change this file
class Employee {
  constructor(public name: string, public hours: number[], public rate: number) {}

  calculatePay(): number {
    // finance owns this rule
    return this.regularHours() * this.rate + this.overtimeHours() * this.rate * 1.5;
  }

  reportHours(): string {
    // HR/ops owns this format — but it calls the same regularHours() finance uses.
    // A finance-driven tweak to regularHours() silently corrupts HR's report.
    return `${this.name}: ${this.regularHours()}h`;
  }

  save(): void {
    // the persistence schema belongs to a third actor entirely
    db.run(`UPDATE employees SET rate = ${this.rate} WHERE name = '${this.name}'`);
  }

  private regularHours(): number {
    return this.hours.reduce((a, b) => a + Math.min(b, 8), 0);
  }
  private overtimeHours(): number {
    return this.hours.reduce((a, b) => a + Math.max(b - 8, 0), 0);
  }
}
```

**After — data separated from the policies that serve each actor:**

```ts
// employee.ts — plain data, stable
interface Employee {
  name: string;
  hours: number[];
  rate: number;
}

// payroll.ts — answers to finance
function calculatePay(e: Employee): number { /* ... */ }

// hour-report.ts — answers to HR, with its own hour-counting rules
function reportHours(e: Employee): string { /* ... */ }

// employee-repository.ts — answers to the data team
function saveEmployee(e: Employee): Promise<void> { /* ... */ }
```

Now finance can change payroll math without touching — or even seeing — HR's report.

**In React/Next.js work:** SRP is the argument for separating *data fetching* (server components, route handlers, CMS queries) from *presentation* (client components) from *business rules* (plain functions in `lib/`). A component that fetches, transforms, formats, and renders has as many reasons to change as it has jobs; hooks and server/client component boundaries are the modern seams for splitting them.

### 3.2 Open–Closed Principle (OCP)

> "Software entities (classes, modules, functions) should be open for extension, but closed for modification." — Meyer, 1988

**What it actually means.** You should be able to add new behavior by *adding code*, not by *editing existing, working code*. Meyer's original mechanism was inheritance; Martin's reformulation — the one that matters today — is **polymorphism against a stable abstraction**: define an interface, and let new cases arrive as new implementations rather than new branches in a growing `switch`.

**The honest caveat:** no design is closed against every change. You choose *which axis of change* to close against, based on which changes you actually expect. Closing against changes that never come is pure abstraction tax (see §7).

**Smell:** the *shotgun `switch`* — the same `switch (kind)` repeated across the codebase, each new variant requiring you to find and edit every copy.

**Before — every new block type edits this function:**

```ts
function renderBlock(block: Block): string {
  switch (block.type) {
    case "richText": return renderRichText(block);
    case "image":    return renderImage(block);
    case "gallery":  return renderGallery(block);
    // adding "video" means editing this file — and every sibling switch
    default: throw new Error(`Unknown block: ${block.type}`);
  }
}
```

**After — new block types register themselves; this module never changes again:**

```ts
type BlockRenderer = (block: Block) => string;

const renderers = new Map<string, BlockRenderer>();

export function registerBlock(type: string, render: BlockRenderer): void {
  renderers.set(type, render);
}

export function renderBlock(block: Block): string {
  const render = renderers.get(block.type);
  if (!render) throw new Error(`Unknown block: ${block.type}`);
  return render(block);
}

// video-block.ts — a pure addition
registerBlock("video", (block) => `<video src="${block.src}"></video>`);
```

**In React/Next.js work:** OCP is everywhere under other names:
- **Component maps** — `const blockComponents = { richText: RichText, image: ImageBlock }` keyed by CMS block type, exactly the pattern above.
- **Composition and `children`/slot props** — a `Card` that accepts arbitrary children is closed (you never edit `Card`) yet open (any content can extend it).
- **Plugin architectures** — Payload CMS's blocks and plugins, Next.js middleware chains, Lexical editor nodes: all are OCP mechanisms where the host is closed and extensions are additive.

### 3.3 Liskov Substitution Principle (LSP)

> If S is a subtype of T, then objects of type T may be replaced with objects of type S without altering the correctness of the program. — Liskov & Wing, 1994 (paraphrased)

**What it actually means.** Subtyping is a **behavioral contract**, not just a matching method signature. A subtype must honor everything callers of the base type are entitled to assume:

- **Preconditions may not be strengthened** — the subtype can't demand more than the base did.
- **Postconditions may not be weakened** — the subtype can't deliver less than the base promised.
- **Invariants must be preserved** — properties that were always true of the base stay true.

The canonical illustration is Rectangle/Square: mathematically a square *is a* rectangle, but a `Square` that overrides `setWidth` to also change its height breaks every caller who assumed `setWidth` leaves height alone. **"Is-a" in the domain does not imply "is-a" in the type system** — substitutability is about behavior, not taxonomy.

**Smells:**
- Overridden methods that throw `NotImplementedError` — the loudest possible LSP violation.
- `instanceof` / type-tag checks on a polymorphic value: callers no longer trust the abstraction.
- Subclasses that silently narrow accepted inputs or return degraded results.

**Before — a subtype that lies:**

```ts
interface Storage {
  read(key: string): Promise<string | null>;
  write(key: string, value: string): Promise<void>;
}

class ReadOnlySnapshot implements Storage {
  async read(key: string) { /* ... */ return null; }
  async write(): Promise<void> {
    throw new Error("read-only!"); // every generic Storage consumer is now a landmine
  }
}
```

**After — model the actual capabilities, so the type system tells the truth:**

```ts
interface ReadableStorage {
  read(key: string): Promise<string | null>;
}
interface WritableStorage extends ReadableStorage {
  write(key: string, value: string): Promise<void>;
}

class ReadOnlySnapshot implements ReadableStorage { /* read only — honestly */ }
class DiskStorage implements WritableStorage { /* both */ }

// functions now declare what they truly need:
async function warmCache(source: ReadableStorage) { /* can't even attempt a write */ }
```

Note that the fix *was* Interface Segregation — the principles interlock (§4).

**In React/TypeScript work:** LSP governs anything polymorphic — component props, hook contracts, structural types. If `NavLink` claims to accept all `<a>` props but crashes on `target="_blank"`, it violates LSP against the anchor contract. TypeScript checks *signatures* structurally but cannot check *behavior*; LSP is the discipline that fills that gap, and behavioral tests written against the interface (run against every implementation) are how you enforce it.

### 3.4 Interface Segregation Principle (ISP)

> "Clients should not be forced to depend upon interfaces that they do not use." — Martin

**What it actually means.** Many small, client-shaped interfaces beat one fat, implementation-shaped interface. When a client depends on a fat interface, it is coupled to methods it never calls: changes to those methods force recompilation/retesting/redeployment of innocent clients, and implementing the interface forces stubs for irrelevant methods (which then violate LSP — see above).

The principle came from real pain: Martin's Xerox consulting, where a single giant `Job` class served stapling, printing, and faxing, so a change for the stapler rippled into the fax code.

**Smells:**
- Interfaces with implementations full of `throw new Error("not supported")`.
- A "god" interface (`UserService` with 30 methods) that every consumer imports for one or two calls.
- Test mocks that must stub a dozen methods to test a function that uses one.

**Before / After in TypeScript:**

```ts
// Before: everyone depends on everything
interface CmsClient {
  getPage(slug: string): Promise<Page>;
  getPosts(): Promise<Post[]>;
  createPost(draft: Draft): Promise<Post>;
  uploadMedia(file: Blob): Promise<Media>;
  purgeCache(): Promise<void>;
}

// After: role interfaces, shaped by what each consumer needs
interface PageReader { getPage(slug: string): Promise<Page>; }
interface PostReader { getPosts(): Promise<Post[]>; }
interface PostAuthor { createPost(draft: Draft): Promise<Post>; }

// the rendering layer needs only this — and its test mock is one method:
async function renderPage(cms: PageReader, slug: string) { /* ... */ }

// one concrete client can still implement all roles:
class PayloadClient implements PageReader, PostReader, PostAuthor { /* ... */ }
```

TypeScript makes ISP unusually cheap: `Pick<CmsClient, "getPage">`, structural typing, and inline object types let you carve a narrow view of a fat type without ceremony.

**In React work:** ISP is the case against prop-drilling entire objects. A component that renders an author's name and avatar should take `{ name, avatarUrl }`, not the whole `User` — otherwise every `User` schema change re-renders and re-tests components that only ever read two fields. Narrow props are segregated interfaces.

### 3.5 Dependency Inversion Principle (DIP)

> "High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions." — Martin

**What it actually means.** In a naïve layered system, source-code dependencies point *downward*: business logic imports the database module, which imports the driver. DIP says to **invert** those arrows at the boundaries: the business logic *defines an interface* describing what it needs; the low-level module *implements* that interface. The high-level policy owns the abstraction; the detail plugs into it.

The "inversion" is that **the flow of control and the direction of source dependency point opposite ways**: at runtime, the policy calls into the database adapter, but at compile time, the adapter depends on the policy's interface — not the other way around. This is the single most important idea behind Hexagonal/Ports-and-Adapters and Clean Architecture (§8): *the domain sits at the center and knows nothing about the outside world*.

DIP is a principle; **Dependency Injection** is one mechanism for following it (passing implementations in via constructor/parameters/context rather than importing them). You can do DI without DIP (injecting concrete classes) and DIP without a DI framework (a function parameter is dependency injection).

**Before — policy chained to detail:**

```ts
// publish-post.ts — high-level policy importing low-level details directly
import { payloadDb } from "./payload-db";
import { resendClient } from "./resend";

export async function publishPost(postId: string) {
  const post = await payloadDb.posts.update(postId, { status: "published" });
  await resendClient.send({ to: post.subscribers, subject: post.title });
  // untestable without a real DB and a real email API;
  // swapping either vendor means editing business logic
}
```

**After — policy defines the ports; details are plugged in:**

```ts
// publish-post.ts — pure policy, zero imports of infrastructure
export interface PostStore {
  markPublished(postId: string): Promise<{ title: string; subscribers: string[] }>;
}
export interface Notifier {
  notify(recipients: string[], subject: string): Promise<void>;
}

export async function publishPost(postId: string, store: PostStore, notifier: Notifier) {
  const post = await store.markPublished(postId);
  await notifier.notify(post.subscribers, post.title);
}

// composition root (e.g. the route handler) wires details to ports:
// publishPost(id, payloadPostStore, resendNotifier)
// tests wire fakes:      publishPost(id, inMemoryStore, spyNotifier)
```

**In React/Next.js work:** DIP is the principle behind **props and context over hard imports**. A component that imports a singleton API client is welded to it; a component that receives data (or a fetcher) via props/context can be rendered in Storybook, tested with fixtures, and reused against a different backend. Next.js server components push this further: fetch at the boundary (the route), pass plain data inward — the render tree stays pure and detail-free.

---

## 4. How the Principles Interact

SOLID is more system than checklist — the principles reinforce and depend on each other:

- **DIP is the mechanism; OCP is the goal.** You can only "extend without modifying" if there's an abstraction to extend against — and DIP is what puts that abstraction in the right place (owned by the policy, implemented by the details).
- **LSP is what makes OCP safe.** Extension-by-polymorphism only works if every new implementation honors the contract. An LSP-violating extension turns OCP's plug-in point into a trap.
- **ISP keeps DIP's abstractions honest.** Invert dependencies onto a fat interface and you've just moved the coupling; segregated, client-shaped interfaces make the inverted abstractions cheap to implement and mock.
- **SRP draws the module boundaries the others operate across.** Deciding *what counts as one module* (one actor's concerns) determines where interfaces, extension points, and inversion boundaries belong at all.

A practical composite: **the plugin architecture.** SRP separates host from extensions; the host is closed (OCP) behind small ports (ISP) that it owns (DIP), and plugins are trustworthy because they honor the contract (LSP).

---

## 5. SOLID in the Development Process

Principles matter only where they change day-to-day decisions. Where SOLID earns its keep:

**In code review.** SOLID gives reviewers *vocabulary for coupling problems* that otherwise come out as vague discomfort. "This switch will need editing for every new type — can we use the component map instead?" is actionable; "this feels messy" is not. The smells in §3 are reviewable signals.

**As refactoring triggers, not upfront design.** The pragmatic modern stance is to apply SOLID *reactively*: write the simple, direct version first, and refactor toward a principle **when change actually arrives** — the second `switch` branch added in a week, the second actor demanding changes to one file, the test that needs a real database. Speculative SOLID (interfaces with one implementation, extension points nobody extends) is how codebases drown in indirection. Sandi Metz's line applies: *"duplication is far cheaper than the wrong abstraction."*

**In testing.** DIP is the single biggest lever for testability — code that receives its dependencies can receive fakes. ISP keeps those fakes small. And a useful inverse signal: **if code is painful to test, it's usually violating SOLID** — hard-to-construct objects signal DIP violations, giant mock setups signal ISP violations, tests breaking for unrelated features signal SRP violations. Pain in tests is design feedback.

**At team scale.** SRP-by-actor maps directly onto code ownership and Conway's law: modules aligned to one team/actor merge cleanly; shared "utils" that every team edits become conflict magnets. OCP-style plugin points are how platform teams let product teams ship without cross-team PRs.

**When *not* to reach for it.** Prototypes, scripts, genuinely stable code, and small codebases where a grep-and-edit costs five minutes. SOLID's payoff is proportional to (rate of change × number of people × lifespan); when those are low, so is the payoff.

---

## 6. SOLID Beyond Classes: Functional and Modern Contexts

The principles were stated in class-based OO terms, but the underlying ideas translate — often getting *simpler*:

- **SRP →** small modules/functions grouped by actor; in FP the default unit is already small.
- **OCP →** higher-order functions and data-driven dispatch (the renderer map in §3.2 *is* OCP with a `Map`).
- **LSP →** honoring contracts of function signatures; parametricity and total functions make many violations inexpressible.
- **ISP →** narrow parameter types; TypeScript's structural typing gives you this nearly for free.
- **DIP →** functions taking their effects/collaborators as parameters — partial application is dependency injection.

In other words: a functional codebase doesn't escape SOLID's problems; it often satisfies the principles by default, which is itself evidence the principles identified something real.

---

## 7. Trade-offs and Criticisms

An honest reference has to include the case against.

**The abstraction tax.** Every interface, indirection, and plugin point has a cost: more files, harder navigation ("where does this actually *run*?"), harder onboarding. SOLID applied maximally produces the parody enterprise codebase — `AbstractFactoryProviderImpl` — where finding the code that does the work takes longer than changing it would have.

**Wrong predictions are expensive.** OCP requires guessing the axis of change. Guess wrong and you carry the abstraction's cost *and* still pay for modification when the real change arrives on a different axis.

**Dan North's critique and CUPID (2021).** The most prominent modern challenge. North's argument is partly against the individual principles (he finds SRP's "seams" often artificial, and much of SOLID reducible to "write simple code") but mostly against **principles as a genre**: rules create binary compliance thinking, where you either satisfy the principle or you don't. He proposes *properties* instead — qualities code has more or less of, giving a direction of travel rather than a pass/fail. His CUPID properties: **Composable** (small surface area, minimal dependencies), **Unix philosophy** (does one thing well — outside-in, unlike SRP's inside-out framing), **Predictable** (behaves as expected, deterministic, observable), **Idiomatic** (reads like the language and team conventions), **Domain-based** (structure mirrors the business domain, not technical layers).

A fair reading: CUPID is less a refutation than a **reframing for a different failure mode**. SOLID was written against big balls of mud; CUPID is written against over-engineered "SOLID-compliant" lasagna. Both are aiming at the same target — code that's cheap to change.

**Context drift.** Some of SOLID's original pressure has eased: deployment is no longer monolithic recompilation, languages have gotten more expressive (structural typing, first-class functions), and microservices/serverless move many coupling questions from class design to service boundaries. The *principles' logic* survives the move — SRP-by-actor is exactly how you should slice services — but the class-and-interface examples in older texts can read as period pieces.

**The pragmatic synthesis** most senior engineers land on: treat SOLID as a **diagnostic vocabulary and a set of refactoring directions**, not construction rules. Violations are *hypotheses* that code will be expensive to change — confirmed or refuted by whether change actually hurts. Apply the principle when the pain is real; resist when it's speculative.

---

## 8. Beyond SOLID: The Wider Principle Landscape

Where SOLID sits among its neighbors:

- **DRY / KISS / YAGNI** — the counterweights. YAGNI in particular is the direct tension partner of OCP/DIP: don't build the extension point until you need it. Healthy design practice is SOLID and YAGNI arguing productively.
- **GRASP** (Craig Larman, *Applying UML and Patterns*) — nine responsibility-assignment patterns (Information Expert, Creator, Controller, Low Coupling, High Cohesion…). Where SOLID says what good structure looks like, GRASP helps decide *which object gets which job*. High Cohesion/Low Coupling are SRP/DIP by older names.
- **CUPID** (Dan North, 2021) — see §7; properties over principles.
- **Hexagonal / Ports-and-Adapters (Cockburn) and Clean Architecture (Martin)** — SOLID scaled from classes to systems. The Dependency Rule ("source dependencies point only inward, toward policy") is DIP applied globally; ports are ISP-shaped interfaces; adapters are OCP extension points. If SOLID is grammar, these are essays written in it.
- **Package/component principles** (also Martin): REP, CCP, CRP for cohesion and ADP, SDP, SAP for coupling — the less famous sequel that applies the same thinking to deployable units. CCP ("gather into components the classes that change for the same reasons") is literally SRP for packages.

---

## 9. References and Further Reading

**Primary sources**
- Robert C. Martin, *Design Principles and Design Patterns* (2000) — the paper that assembled the five principles.
- Robert C. Martin, *Agile Software Development: Principles, Patterns, and Practices* (2002) and *Clean Architecture* (2017) — the book-length treatments; the latter contains the actor-based SRP reformulation.
- Bertrand Meyer, *Object-Oriented Software Construction* (1988) — origin of the Open–Closed Principle.
- Barbara Liskov & Jeannette Wing, *A Behavioral Notion of Subtyping* (ACM TOPLAS, 1994) — the formal basis of LSP.
- David Parnas, *On the Criteria To Be Used in Decomposing Systems into Modules* (CACM, 1972) — the ancestor of the whole family.

**History and overviews**
- [SOLID — Wikipedia](https://en.wikipedia.org/wiki/SOLID) — canonical definitions and history, including Michael Feathers' coining of the acronym (~2004).
- [The Five Principles for SOLID Software Design — Architect in Slippers](https://swarch.blog/the-five-principles-for-solid-software-design/)

**Critique and alternatives**
- [Dan North, "CUPID — for joyful coding"](https://dannorth.net/blog/cupid-for-joyful-coding/) — the properties-over-principles argument.
- [CUPID vs. SOLID — Mozaic Works](https://mozaicworks.com/blog/cupid-vs-solid) and [Be more CUPID, be less SOLID — Nogginbox](https://www.nogginbox.co.uk/blog/cupid) — commentary on the debate.
- [SOLID, CUPID, GRASP — Boldare](https://www.boldare.com/blog/solid-cupid-grasp-principles-object-oriented-design/) — comparison across principle families.
- Sandi Metz, *99 Bottles of OOP* and the talk "All the Little Things" — the "duplication is cheaper than the wrong abstraction" school.

---

*Document generated July 2026 as a general engineering reference for this repository.*
