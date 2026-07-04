import type { Project } from "../types";

export const saasPlatformRedesign: Project = {
  id: "saas-platform-redesign",
  slug: "saas-platform-redesign",
  title: "SaaS Platform Redesign",
  category: "Product Design",
  year: "2025",
  thumbnail: "saas-wireframes",
  featured: true,
  order: 3,

  summary:
    "Restructuring a fast-growing B2B platform whose interface had grown feature by feature — into a coherent product that new users can learn and power users can fly through.",
  metaGrid: [
    { label: "Role", value: "Product Designer" },
    { label: "Scope", value: "Platform redesign" },
    { label: "Platform", value: "Web" },
    { label: "Timeline", value: "5 months" },
  ],
  heroImage: { src: "placeholder", alt: "SaaS platform redesign hero" },

  sections: [
    {
      type: "richText",
      anchor: "overview",
      heading: "Overview",
      paragraphs: [
        "After three years of rapid feature development, the platform's interface reflected its release history rather than its users' mental model. Related tools lived in unrelated menus, and every team had added its own patterns for tables, filters, and forms.",
        "Churn analysis pointed at onboarding: trial users who didn't reach their first meaningful outcome within two sessions rarely converted.",
        "**The mandate:** redesign the platform's structure and core workflows without freezing feature development — and without alienating the power users who had memorized the old layout.",
      ],
    },
    {
      type: "bulletList",
      anchor: "problem",
      heading: "Problem Statement",
      intro: "Interviews with trial users, long-time customers, and support staff converged on the same issues:",
      style: "arrow",
      items: [
        "Navigation mirrored internal team structure, not user workflows",
        "New users couldn't find the path from signup to first result",
        "The same concept had different names in different modules",
        "Tables, filters, and forms behaved differently across the product",
        "Power users relied on bookmarks because navigation couldn't be trusted",
      ],
    },
    {
      type: "hmwGrid",
      heading: "How Might We",
      cards: [
        "How might we reorganize navigation around user workflows instead of internal team boundaries?",
        "How might we get trial users to their first meaningful outcome within one session?",
        "How might we unify interaction patterns without pausing feature development?",
        "How might we migrate power users without breaking the muscle memory they depend on?",
      ],
    },
    {
      type: "bulletList",
      heading: "Goals",
      style: "check",
      items: [
        "Rebuild the information architecture around jobs, not modules",
        "Cut time-to-first-outcome for trial users",
        "Standardize core patterns — tables, filters, forms, empty states",
        "Ship incrementally so the redesign never blocks the roadmap",
      ],
    },
    {
      type: "richText",
      heading: "Design Strategy",
      paragraphs: [
        "We treated the redesign as re-architecture, not repainting. Visual refresh came last; structure and consistency came first.",
        "**Our approach was to:**",
      ],
      items: [
        "Run a card-sorting study to derive the navigation from user mental models",
        "Define one canonical pattern for each recurring interaction before touching screens",
        "Redesign the highest-traffic workflow first as the reference implementation",
        "Roll out per-module behind a toggle, with the old layout one click away",
      ],
    },
    {
      type: "stepBlock",
      anchor: "solution",
      sectionHeading: "Solution",
      stepNumber: 1,
      title: "Workflow-Based Navigation",
      description:
        "Replaced the module menu with five workflow areas derived from the card-sort, plus a global search that understands old terminology.",
      bullets: [
        "Users locate features by what they're trying to do",
        "Search bridges the vocabulary gap during migration",
      ],
      image: { src: "placeholder", alt: "Workflow-based navigation" },
    },
    {
      type: "stepBlock",
      stepNumber: 2,
      title: "Guided First-Run Path",
      description:
        "Designed a setup path that walks trial users to their first real result using their own data, not sample content.",
      bullets: [
        "First outcome now reachable in a single session",
        "Progress is resumable, never modal-locked",
      ],
      image: { src: "placeholder", alt: "Guided first-run experience" },
    },
    {
      type: "stepBlock",
      stepNumber: 3,
      title: "Unified Pattern Library",
      description:
        "Consolidated eleven table variants and seven filter patterns into one of each, documented and componentized for every team.",
      bullets: [
        "Consistent behavior across every module",
        "Teams ship faster by assembling, not reinventing",
      ],
      image: { src: "placeholder", alt: "Unified pattern library" },
    },
    {
      type: "stepBlock",
      stepNumber: 4,
      title: "Power-User Continuity",
      description:
        "Preserved every deep link, added keyboard shortcuts, and shipped a \"where did it go?\" map from old paths to new ones.",
      bullets: [
        "Bookmarks and muscle memory keep working",
        "Shortcuts made the new layout faster than the old one",
      ],
      image: { src: "placeholder", alt: "Migration support features" },
    },
    {
      type: "twoColumn",
      heading: "Validation & Iteration",
      leftTitle: "Usability testing revealed:",
      leftItems: [
        "New navigation labels tested well with new users but confused veterans",
        "The guided path was skipped by users who arrived with a specific goal",
        "Unified tables surfaced feature gaps some teams had papered over",
      ],
      rightTitle: "Based on this:",
      rightItems: [
        "Added legacy-term aliases to search and the migration map",
        "Made the guided path dismissible with a persistent re-entry point",
        "Closed the gaps in the canonical table before rollout",
      ],
      image: { src: "placeholder", alt: "Iterated platform designs" },
    },
    {
      type: "impactCallout",
      anchor: "results",
      heading: "Impact & Results",
      items: [
        "Trial users reach their first outcome in one session instead of three",
        "Navigation-related support tickets dropped sharply after rollout",
        "Power users adopted the new layout without a churn spike",
        "New features now ship on shared patterns by default",
      ],
      calloutTitle: "Business Benefits",
      calloutItems: [
        "Improved trial-to-paid conversion via faster first outcomes",
        "Lower support cost from consistent, predictable UI",
        "Faster feature delivery on the unified pattern library",
      ],
    },
    {
      type: "reflection",
      heading: "Reflection",
      paragraphs: [
        "The hardest part of this redesign wasn't the new design — it was earning the trust of users who were productive in the old one.",
      ],
      learningsTitle: "Key learnings:",
      learnings: [
        "Information architecture is the redesign; visuals are the finish",
        "Migration paths deserve as much design effort as the destination",
        "Canonical patterns multiply every team's output, not just design's",
      ],
      pullQuote: {
        text: "A redesign succeeds when existing users feel it was built",
        accent: "for them, not at them.",
      },
    },
  ],

  status: "published",
};
