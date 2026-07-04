import type { Project } from "../types";

export const mobileBankingHomepageRedesign: Project = {
  id: "mobile-banking-homepage-redesign",
  slug: "mobile-banking-homepage-redesign",
  title: "Mobile Banking App Homepage Redesign",
  category: "UI/UX Design",
  year: "2025",
  thumbnail: "banking-homepage",
  featured: true,
  order: 5,

  summary:
    "Rethinking the first screen of a mobile banking app so the daily essentials — balance, transfer, pay — are instant, and everything else knows its place.",
  metaGrid: [
    { label: "Role", value: "UI/UX Designer" },
    { label: "Scope", value: "Homepage redesign" },
    { label: "Platform", value: "iOS & Android" },
    { label: "Timeline", value: "2 months" },
  ],
  heroImage: { src: "placeholder", alt: "Banking homepage redesign hero" },

  sections: [
    {
      type: "richText",
      anchor: "overview",
      heading: "Overview",
      paragraphs: [
        "The app's homepage had become a negotiation table: every product team wanted a slot, and over time the screen accumulated banners, shortcuts, and cards until the essentials were crowded out.",
        "Analytics told a blunt story — over 80% of sessions were for three tasks (check balance, transfer, pay), yet those tasks shared the screen with a dozen competing modules.",
        "**The brief:** redesign the homepage around what users actually do, while giving growth and product teams a fair, structured way to reach users.",
      ],
    },
    {
      type: "bulletList",
      anchor: "problem",
      heading: "Problem Statement",
      intro: "Session recordings, analytics, and user interviews pointed to the same failures:",
      style: "arrow",
      items: [
        "The three most common tasks required scrolling past promotional content",
        "Balance was displayed ambiguously — users couldn't tell spendable from total",
        "Every module shouted equally, so nothing had priority",
        "Promotions were ignored precisely because they were everywhere",
        "Each new feature launch made the screen — and the problem — bigger",
      ],
    },
    {
      type: "hmwGrid",
      heading: "How Might We",
      cards: [
        "How might we make the top three tasks reachable without any scrolling?",
        "How might we present balance so users instantly know what they can spend?",
        "How might we give promotions a home that earns attention instead of demanding it?",
        "How might we define rules so future features extend the layout instead of eroding it?",
      ],
    },
    {
      type: "bulletList",
      heading: "Goals",
      style: "check",
      items: [
        "Put balance, transfer, and pay above the fold for every user",
        "Make spendable balance unambiguous at a glance",
        "Consolidate promotions into one high-quality, rotating slot",
        "Establish placement rules that survive future feature launches",
      ],
    },
    {
      type: "richText",
      heading: "Design Strategy",
      paragraphs: [
        "We designed from usage data outward: the screen's hierarchy mirrors task frequency, not organizational priority.",
        "**Our approach was to:**",
      ],
      items: [
        "Rank every homepage module by real task frequency and revenue impact",
        "Give the top tasks a fixed, untouchable zone",
        "Design one promotional surface with strict content standards",
        "Write layout governance so the hierarchy outlives this redesign",
      ],
    },
    {
      type: "stepBlock",
      anchor: "solution",
      sectionHeading: "Solution",
      stepNumber: 1,
      title: "Fixed Action Zone",
      description:
        "Balance, transfer, and pay live in a fixed zone at the top of the screen — no module can displace them.",
      bullets: ["Zero scrolling for 80% of sessions", "Predictable placement builds muscle memory"],
      image: { src: "placeholder", alt: "Fixed action zone" },
    },
    {
      type: "stepBlock",
      stepNumber: 2,
      title: "Spendable-First Balance",
      description:
        "The balance card leads with spendable balance; holds and totals sit one tap behind it.",
      bullets: [
        "Answers the real question: \"how much can I use?\"",
        "Detail on demand, never in the way",
      ],
      image: { src: "placeholder", alt: "Spendable-first balance card" },
    },
    {
      type: "stepBlock",
      stepNumber: 3,
      title: "Single Promotional Stage",
      description:
        "All promotions consolidated into one card slot with rotation rules and mandatory relevance targeting.",
      bullets: [
        "One well-placed promo outperforms five scattered banners",
        "Teams compete on relevance, not screen real estate",
      ],
      image: { src: "placeholder", alt: "Promotional stage" },
    },
    {
      type: "stepBlock",
      stepNumber: 4,
      title: "Layout Governance Rules",
      description:
        "Documented placement criteria: what qualifies for the homepage, where it can appear, and what it must displace to enter.",
      bullets: [
        "Future launches extend the layout instead of eroding it",
        "Design debates resolved by rules, not seniority",
      ],
      image: { src: "placeholder", alt: "Governance documentation" },
    },
    {
      type: "twoColumn",
      heading: "Validation & Iteration",
      leftTitle: "Usability testing revealed:",
      leftItems: [
        "Users found the fixed action zone immediately, with no learning curve",
        "Some users initially thought spendable balance was their total",
        "The single promo slot got more taps than any previous banner",
      ],
      rightTitle: "Based on this:",
      rightItems: [
        "Kept the action zone unchanged through every iteration",
        "Added a one-line label clarifying spendable vs. total",
        "Formalized the promo relevance rules before launch",
      ],
      image: { src: "placeholder", alt: "Iterated homepage" },
    },
    {
      type: "impactCallout",
      anchor: "results",
      heading: "Impact & Results",
      items: [
        "Primary tasks completed without scrolling in nearly all sessions",
        "Balance-related confusion queries dropped after the spendable-first card",
        "Promotion engagement rose despite fewer promotional surfaces",
        "Two feature launches since shipped within the governance rules",
      ],
      calloutTitle: "Business Benefits",
      calloutItems: [
        "Higher promo conversion from a single, relevant slot",
        "Reduced support volume around balance confusion",
        "A homepage that scales with the roadmap instead of fighting it",
      ],
    },
    {
      type: "reflection",
      heading: "Reflection",
      paragraphs: [
        "The redesign's most durable deliverable wasn't the screen — it was the rules that keep the screen honest.",
      ],
      learningsTitle: "Key learnings:",
      learnings: [
        "Usage data is the strongest argument in any stakeholder negotiation",
        "Scarcity makes promotions more valuable, not less",
        "A layout without governance is a layout on borrowed time",
      ],
      pullQuote: {
        text: "A homepage isn't a billboard — it's a front door, and front doors work best when they",
        accent: "open straight to where you're going.",
      },
    },
  ],

  status: "published",
};
