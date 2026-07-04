import type { Project } from "../types";

export const mobileBankingApp: Project = {
  id: "mobile-banking-app",
  slug: "mobile-banking-app",
  title: "Mobile Banking App",
  category: "UI/UX Design",
  year: "2025",
  thumbnail: "banking-app",
  featured: true,
  order: 2,

  summary:
    "Designing an end-to-end mobile banking experience that turns raw account data into insights people can actually act on — one thought at a time.",
  metaGrid: [
    { label: "Role", value: "UI/UX Designer" },
    { label: "Scope", value: "End-to-end app design" },
    { label: "Platform", value: "iOS & Android" },
    { label: "Timeline", value: "4 months" },
  ],
  heroImage: { src: "placeholder", alt: "Mobile banking app hero" },

  sections: [
    {
      type: "richText",
      anchor: "overview",
      heading: "Overview",
      paragraphs: [
        "Most banking apps are transactional by nature: they show numbers, but leave interpretation entirely to the user. Balances rise and fall without explanation, and spending patterns stay invisible until problems appear.",
        "This project set out to design a mobile banking app where insight is a first-class feature — surfacing what changed, why it changed, and what to do next, without turning the app into a dashboard only analysts could love.",
        "**The core challenge:** deliver meaningful financial insight inside everyday banking flows, without slowing down the transactions people open the app to complete.",
      ],
    },
    {
      type: "bulletList",
      anchor: "problem",
      heading: "Problem Statement",
      intro: "Research with existing banking app users surfaced a consistent set of frustrations:",
      style: "arrow",
      items: [
        "Users saw their balance but couldn't explain why it changed week to week",
        "Spending categories were either missing or too generic to be useful",
        "Insights, where they existed, lived in a separate tab users never visited",
        "Notifications were noisy and transactional, not informative",
        "Users juggled a second budgeting app because the bank's own app told them nothing",
      ],
    },
    {
      type: "hmwGrid",
      heading: "How Might We",
      cards: [
        "How might we surface spending insights inside the flows users already visit daily?",
        "How might we explain balance changes in plain language rather than raw numbers?",
        "How might we make insights glanceable so they inform without interrupting?",
        "How might we build trust so users act on the app's recommendations?",
      ],
    },
    {
      type: "bulletList",
      heading: "Goals",
      style: "check",
      items: [
        "Integrate insights into the primary banking flows, not a separate tab",
        "Keep core transactions (transfer, pay, top-up) as fast as before",
        "Translate financial data into plain, actionable language",
        "Design a visual system for insights that scales across account types",
      ],
    },
    {
      type: "richText",
      heading: "Design Strategy",
      paragraphs: [
        "We anchored the design on a single principle: one thought at a time. Rather than presenting a wall of charts, the app delivers one clear, contextual insight at each decision point.",
        "**Our approach was to:**",
      ],
      items: [
        "Attach insights to moments — after a transaction, at month end, before a large payment",
        "Write insights as sentences first, charts second",
        "Limit each screen to a single primary insight to protect focus",
        "Let users drill down when curious, never force depth on them",
      ],
    },
    {
      type: "stepBlock",
      anchor: "solution",
      sectionHeading: "Solution",
      stepNumber: 1,
      title: "Insight-Led Home Screen",
      description: "The home screen leads with one headline insight above the balance — what changed and why.",
      bullets: [
        "Gives users an immediate answer to \"how am I doing?\"",
        "Keeps transfer and pay actions one tap away",
      ],
      image: { src: "placeholder", alt: "Insight-led home screen" },
    },
    {
      type: "stepBlock",
      stepNumber: 2,
      title: "Contextual Transaction Stories",
      description:
        "Each transaction expands into context: category trend, merchant history, and impact on the monthly budget.",
      bullets: [
        "Turns a line item into an explanation",
        "Reduces \"what was this charge?\" support queries",
      ],
      image: { src: "placeholder", alt: "Transaction detail with context" },
    },
    {
      type: "stepBlock",
      stepNumber: 3,
      title: "Glanceable Spending Digest",
      description:
        "A weekly digest summarizes spending in three short statements with a single supporting chart.",
      bullets: ["Digestible in under ten seconds", "Replaces the abandoned analytics tab"],
      image: { src: "placeholder", alt: "Weekly spending digest" },
    },
    {
      type: "stepBlock",
      stepNumber: 4,
      title: "Quiet, Useful Notifications",
      description:
        "Notifications were redesigned around usefulness thresholds — only insights that warrant action get pushed.",
      bullets: [
        "Fewer, better notifications rebuilt user trust",
        "Every push deep-links to its full context",
      ],
      image: { src: "placeholder", alt: "Notification design" },
    },
    {
      type: "twoColumn",
      heading: "Validation & Iteration",
      leftTitle: "Usability testing revealed:",
      leftItems: [
        "Users trusted insights more when the underlying data was one tap away",
        "Sentence-first insights outperformed chart-first layouts in comprehension",
        "Too many insights per session felt like nagging",
      ],
      rightTitle: "Based on this:",
      rightItems: [
        "Added a \"see the numbers\" expander to every insight",
        "Standardized the sentence-first insight pattern app-wide",
        "Capped insights at one per screen, three per session",
      ],
      image: { src: "placeholder", alt: "Iterated designs" },
    },
    {
      type: "impactCallout",
      anchor: "results",
      heading: "Impact & Results",
      items: [
        "Users could explain their own spending patterns after one week of use",
        "Core transaction speed preserved — no added steps to transfer or pay",
        "Weekly digest became the most revisited screen after home",
        "Notification opt-out rate dropped significantly in testing",
      ],
      calloutTitle: "Business Benefits",
      calloutItems: [
        "Higher session frequency driven by the weekly digest",
        "Reduced support load around unexplained charges",
        "A reusable insight pattern for future product lines",
      ],
    },
    {
      type: "reflection",
      heading: "Reflection",
      paragraphs: [
        "This project proved that insight is a writing problem as much as a design problem — the best chart loses to one honest sentence.",
      ],
      learningsTitle: "Key learnings:",
      learnings: [
        "Context beats dashboards: insights belong where decisions happen",
        "Restraint builds trust — fewer insights were consistently rated more valuable",
        "Plain language is a design material, not an afterthought",
      ],
      pullQuote: {
        text: "People don't want more data about their money — they want",
        accent: "one clear thought at the right time.",
      },
    },
  ],

  status: "published",
};
