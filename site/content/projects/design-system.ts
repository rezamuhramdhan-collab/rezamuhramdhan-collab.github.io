import type { Project } from "../types";

export const designSystem: Project = {
  id: "design-system",
  slug: "design-system",
  title: "Design System",
  category: "System Design",
  year: "2025",
  thumbnail: "design-system",
  featured: true,
  order: 4,

  summary:
    "Building a token-based design system that lets four product teams ship consistent interfaces across web and mobile — without a design review bottleneck.",
  metaGrid: [
    { label: "Role", value: "Design Systems Designer" },
    { label: "Scope", value: "Tokens, components, docs" },
    { label: "Platform", value: "Web & Mobile" },
    { label: "Timeline", value: "6 months" },
  ],
  heroImage: { src: "placeholder", alt: "Design system hero" },

  sections: [
    {
      type: "richText",
      anchor: "overview",
      heading: "Overview",
      paragraphs: [
        "Four product teams were shipping into the same product family with four diverging visual languages. Every squad maintained its own button, its own modal, and its own opinion about spacing — and every inconsistency eventually became a support ticket or a design-review debate.",
        "An audit found 23 button variants, 14 shades of the primary color, and no shared source of truth between design files and code.",
        "**The mission:** build a design system that teams adopt because it makes them faster — not because a mandate forces them to.",
      ],
    },
    {
      type: "bulletList",
      anchor: "problem",
      heading: "Problem Statement",
      intro: "The audit and team interviews surfaced structural problems behind the visual drift:",
      style: "arrow",
      items: [
        "No shared tokens — colors, spacing, and type were hard-coded per team",
        "Design files and shipped code disagreed, so neither could be trusted",
        "Accessibility fixes were re-solved (or missed) team by team",
        "Simple UI changes required touching every product separately",
        "New designers and engineers had no canonical reference to learn from",
      ],
    },
    {
      type: "hmwGrid",
      heading: "How Might We",
      cards: [
        "How might we define one source of truth that both design files and code consume?",
        "How might we make adopting the system faster than building custom UI?",
        "How might we bake accessibility into components so it can't be skipped?",
        "How might we govern contributions so the system evolves without fragmenting again?",
      ],
    },
    {
      type: "bulletList",
      heading: "Goals",
      style: "check",
      items: [
        "Establish a token architecture shared by design tools and code",
        "Ship a core component library covering 80% of everyday UI needs",
        "Meet WCAG AA by default in every component",
        "Stand up documentation and governance that outlive the initial build",
      ],
    },
    {
      type: "richText",
      heading: "Design Strategy",
      paragraphs: [
        "We built the system inside real product work rather than beside it: every component was extracted from a live screen a team was actually shipping, so the library never drifted into theory.",
        "**Our approach was to:**",
      ],
      items: [
        "Start with tokens — name the decisions before drawing the components",
        "Extract components from the highest-traffic screens first",
        "Pilot with one friendly team, then scale to the other three",
        "Treat documentation as part of the component, not a follow-up task",
      ],
    },
    {
      type: "stepBlock",
      anchor: "solution",
      sectionHeading: "Solution",
      stepNumber: 1,
      title: "Token Foundation",
      description:
        "Defined a three-tier token architecture — primitives, semantic roles, and component tokens — published to both Figma variables and code.",
      bullets: [
        "One rename propagates everywhere",
        "Theming (including dark mode) became a token swap, not a redesign",
      ],
      image: { src: "placeholder", alt: "Token architecture" },
    },
    {
      type: "stepBlock",
      stepNumber: 2,
      title: "Core Component Library",
      description:
        "Shipped 42 components across forms, navigation, feedback, and data display — each with states, sizes, and platform variants.",
      bullets: [
        "Covers the 80% of UI teams rebuild most often",
        "23 button variants consolidated into one component with props",
      ],
      image: { src: "placeholder", alt: "Component library" },
    },
    {
      type: "stepBlock",
      stepNumber: 3,
      title: "Accessibility by Default",
      description:
        "Contrast, focus states, hit areas, and screen-reader behavior were built into components and verified in CI.",
      bullets: [
        "AA compliance without per-team effort",
        "Accessibility regressions fail the build, not the audit",
      ],
      image: { src: "placeholder", alt: "Accessibility checks" },
    },
    {
      type: "stepBlock",
      stepNumber: 4,
      title: "Documentation & Governance",
      description:
        "Every component ships with usage guidance, do/don't examples, and code snippets; a lightweight contribution process lets teams propose additions.",
      bullets: [
        "New joiners onboard from one canonical reference",
        "The system grows through contributions, not forks",
      ],
      image: { src: "placeholder", alt: "Documentation site" },
    },
    {
      type: "twoColumn",
      heading: "Validation & Iteration",
      leftTitle: "The pilot rollout revealed:",
      leftItems: [
        "Teams bypassed components that lacked a variant they needed",
        "Docs were read far more inside Figma than on the docs site",
        "Strict governance early on discouraged contributions",
      ],
      rightTitle: "Based on this:",
      rightItems: [
        "Added an escape-hatch pattern and a fast-track variant request flow",
        "Embedded usage guidance directly into component descriptions",
        "Simplified contribution to a proposal-and-pair model",
      ],
      image: { src: "placeholder", alt: "System iteration" },
    },
    {
      type: "impactCallout",
      anchor: "results",
      heading: "Impact & Results",
      items: [
        "All four teams shipping on shared tokens and components",
        "UI build time for standard screens cut roughly in half",
        "AA contrast and focus compliance across the component library",
        "Design-code drift eliminated for systemized components",
      ],
      calloutTitle: "Business Benefits",
      calloutItems: [
        "Faster delivery across every product team",
        "Consistent brand experience across web and mobile",
        "Lower rework and support cost from UI inconsistencies",
      ],
    },
    {
      type: "reflection",
      heading: "Reflection",
      paragraphs: [
        "A design system is a product whose users are teams — and it lives or dies on adoption, not completeness.",
      ],
      learningsTitle: "Key learnings:",
      learnings: [
        "Tokens before components: naming decisions is the real system",
        "Adoption follows speed — make the right way the fast way",
        "Escape hatches prevent forks better than rules do",
      ],
      pullQuote: {
        text: "The best design system isn't the most complete one — it's the one teams",
        accent: "reach for by default.",
      },
    },
  ],

  status: "published",
};
