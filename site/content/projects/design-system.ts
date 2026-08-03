import type { Project } from "../types";

export const designSystem: Project = {
  id: "design-system",
  slug: "bank-saqu-design-system",
  title: "Design SystemQu — Bank Saqu",
  category: "Design Systems",
  year: "2026",
  thumbnail: "design-system",
  featured: true,
  order: 4,

  summary:
    "Creating a scalable mobile design system for Bank Saqu, then auditing it honestly to turn a strong token and component foundation into a system teams can trust, implement, and evolve.",
  metaGrid: [
    { label: "Role", value: "Product Designer" },
    { label: "Scope", value: "Foundations, components, accessibility, governance" },
    { label: "Platform", value: "Figma · Mobile" },
    { label: "Timeline", value: "6 months" },
  ],
  heroImage: {
    src: "/work/design-systemqu/hero.png",
    alt: "Design SystemQu foundations and mobile component states",
  },

  sections: [
    {
      type: "richText",
      anchor: "overview",
      heading: "Overview",
      paragraphs: [
        "Bank Saqu teams repeatedly rebuilt the same foundations and UI components whenever a product entered a new phase. The result was duplicated effort, small visual differences, and decisions that lived in individual files instead of a shared system.",
        "I created Design SystemQu to establish a reusable mobile foundation: variables, typography, icons, and core components that could support real product work without forcing every team to start from zero.",
        "A later system audit showed an important truth: the technical foundation was ahead of the operating model. The layered tokens and primary masters were strong, while naming, accessibility assurance, documentation, and governance still needed focused work.",
        "**The case study therefore tells both sides of the work:** what I built, what the evidence says today, and how I would take the system from a developing library to a dependable product.",
      ],
    },
    {
      type: "bulletList",
      anchor: "challenge",
      heading: "The Challenge",
      intro:
        "The challenge was not simply to draw a component library. It was to create a shared language that could remain useful as products, teams, and implementation needs changed.",
      style: "arrow",
      items: [
        "Repeated setup work meant designers rebuilt familiar patterns instead of improving the product",
        "Component variations were created for local needs without a consistent public API",
        "Design decisions were difficult for engineering to map because token names had no platform code syntax",
        "Accessibility behavior and interactive hit regions were not documented consistently",
        "Documentation and ownership had to mature alongside the visual library—not after it",
      ],
    },
    {
      type: "hmwGrid",
      heading: "Design Questions",
      cards: [
        "How might we make the shared system faster to use than rebuilding locally?",
        "How might we connect every design decision to a clear semantic role?",
        "How might we make component behavior predictable for both designers and engineers?",
        "How might we expose gaps early enough to improve the system without slowing product delivery?",
      ],
    },
    {
      type: "bulletList",
      heading: "Principles",
      style: "check",
      items: [
        "Build foundations before inventory: define the decisions components should consume",
        "Use real product patterns as the source material for shared components",
        "Separate visual hierarchy, interaction state, content, and value in component APIs",
        "Treat accessibility, documentation, and governance as part of the component definition",
      ],
    },
    {
      type: "stepBlock",
      anchor: "system",
      sectionHeading: "Building the System",
      stepNumber: 1,
      title: "Audit the existing product language",
      description:
        "I started by inventorying foundations and repeated mobile patterns across Bank Saqu. The review covered typography, color, iconography, navigation, form controls, feedback, and high-use interaction patterns.",
      bullets: [
        "Grouped repeated decisions before turning them into reusable assets",
        "Used the audit to distinguish a true shared pattern from a one-off product solution",
        "Created a baseline that could be evaluated again as the system matured",
      ],
    },
    {
      type: "stepBlock",
      stepNumber: 2,
      title: "Create a layered token foundation",
      description:
        "Design SystemQu uses a raw-to-alias-to-semantic structure so components consume meaning instead of literal values. The current file contains 301 variables across eight collections.",
      bullets: [
        "Raw tokens hold base values; aliases organize reusable roles; semantic tokens express product intent",
        "Color, type, radius, elevation, and grid decisions can evolve without redrawing every component",
        "The audit recommendation is to refine this architecture with explicit scopes, modes, and platform code syntax—not replace it",
      ],
      images: [
        {
          src: "/work/design-systemqu/token-architecture.svg",
          alt: "Three-tier Design SystemQu token architecture from raw values to aliases and semantic roles",
          caption:
            "Architecture reconstructed from the Design SystemQu audit: foundation values flow through aliases into semantic roles consumed by components. A direct Figma Variables capture should replace this diagram when the source collection view is available.",
        },
      ],
    },
    {
      type: "stepBlock",
      stepNumber: 3,
      title: "Design component APIs, not just variants",
      description:
        "Core components were built with Auto Layout, shared text styles, and variable bindings. Textfield became the strongest broad reference because it exposes content, configuration, size, helper visibility, and validation states.",
      bullets: [
        "Sampled Button, Textfield, Top Navbar, and Checkbox masters use bound colors with no hardcoded color values",
        "The audit exposed where variant axes still mixed hierarchy with state—for example, Button used one property for Primary, Secondary, Tertiary, and Disabled",
        "The next API pass separates hierarchy, state, size, content, and value into predictable properties",
      ],
      images: [
        {
          src: "/work/design-systemqu/figma-component-properties.png",
          alt: "Figma component properties for Textfield and Button beside a textfield state matrix",
          caption:
            "Direct Figma evidence: component properties expose type, hierarchy, state, icons, helper text, and editable content while the state matrix verifies default, focused, error, and disabled behavior.",
        },
      ],
      imageLayout: "full",
    },
    {
      type: "stepBlock",
      stepNumber: 4,
      title: "Make accessibility a system decision",
      description:
        "I reviewed contrast, touch targets, state communication, and interaction guidance at the component level so teams would not need to rediscover the same requirements in every flow.",
      bullets: [
        "The Search audit identified a 1.53:1 default placeholder contrast—below the 4.5:1 requirement for normal text",
        "Search and Textfield provide comfortable mobile target sizes; small controls still need explicit hit-region guidance",
        "Focus-visible, pressed, loading, validation, screen-reader naming, reduced motion, and high-contrast behavior belong in the component contract",
      ],
      images: [
        {
          src: "/work/design-systemqu/search.png",
          alt: "Design SystemQu search field states reviewed for placeholder contrast",
        },
        {
          src: "/work/design-systemqu/checkbox.png",
          alt: "Design SystemQu checkbox selected, indeterminate, unselected, and disabled states",
        },
      ],
      imageLayout: "grid",
    },
    {
      type: "stepBlock",
      stepNumber: 5,
      title: "Design the operating model",
      description:
        "A usable library also needs guidance, ownership, releases, and a contribution path. The current system has documentation templates and a changelog structure, but most published guidance still needs editorial completion.",
      bullets: [
        "Define purpose, usage, content rules, accessibility expectations, and implementation ownership for every component",
        "Create a lightweight proposal, review, release, and deprecation flow",
        "Connect design changes to engineering references so teams can see parity and release status",
      ],
      images: [
        {
          src: "/work/design-systemqu/bottomsheet.png",
          alt: "Design SystemQu bottom sheet default, scrolled, and full-size configurations",
        },
      ],
    },
    {
      type: "twoColumn",
      anchor: "evidence",
      heading: "System Health Check",
      leftTitle: "Evidence of a strong foundation",
      leftItems: [
        "301 variables organized across eight collections",
        "Coherent raw, alias, and semantic token layers",
        "Extensive Auto Layout adoption and consistent text-style consumption",
        "Strong color-token coverage in sampled primary masters",
        "Textfield and Checkbox provide useful API reference patterns",
      ],
      rightTitle: "Evidence the system must mature",
      rightItems: [
        "Generic mode names and unrestricted color scopes",
        "No platform code syntax across the current variables",
        "Inconsistent property semantics in several high-use components",
        "Accessibility gaps in Search contrast and interaction-state guidance",
        "Seven of eight sampled component sets lack complete descriptions",
      ],
    },
    {
      type: "impactCallout",
      heading: "What the Work Achieved",
      items: [
        "Established one reusable foundation for core Bank Saqu mobile patterns",
        "Converted visual values into a layered semantic token system",
        "Created component masters that are substantially more consistent and tokenized than the documentation around them",
        "Produced an evidence-based maturity baseline—approximately 2.5 out of 5—for prioritizing the next phase",
      ],
      calloutTitle: "Why this matters",
      calloutItems: [
        "The team can preserve what is technically sound instead of rebuilding the library",
        "Accessibility and API issues are visible before the component inventory expands",
        "The roadmap is tied to observable completion criteria, not a vague goal of adding more components",
      ],
    },
    {
      type: "twoColumn",
      anchor: "roadmap",
      heading: "Prioritized Roadmap",
      leftTitle: "First: protect product quality",
      leftItems: [
        "Fix Search placeholder contrast and document interactive hit regions",
        "Correct high-impact naming errors and duplicate assets",
        "Refactor Button, Toggle, Search, and Top Navbar property axes",
        "Separate hierarchy, state, content, value, and configuration",
      ],
      rightTitle: "Then: make adoption sustainable",
      rightItems: [
        "Add meaningful modes, variable scopes, and web/Android/iOS code syntax",
        "Split the icon mega-set and improve controlled discovery",
        "Complete usage, accessibility, ownership, changelog, and deprecation guidance",
        "Measure readiness through design-code mapping and safe independent usage",
      ],
    },
    {
      type: "reflection",
      heading: "Reflection",
      paragraphs: [
        "This work changed how I evaluate design systems. A large component count can look impressive, but maturity is better measured by how confidently another person can choose, implement, and extend the right asset without tribal knowledge.",
      ],
      learningsTitle: "What I would carry forward:",
      learnings: [
        "Preserve a sound token architecture and improve its governance before expanding it",
        "Component quality includes the public API, not only the visual master",
        "Accessibility evidence should be recorded at the same time the component is designed",
        "Documentation is part of the product experience for internal users",
      ],
      pullQuote: {
        text: "A design system is ready to scale when teams can make the right decision",
        accent: "without relying on tribal knowledge.",
      },
    },
  ],

  status: "published",
};
