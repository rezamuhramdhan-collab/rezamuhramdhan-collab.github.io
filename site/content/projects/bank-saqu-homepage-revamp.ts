import type { Project } from "../types";

export const bankSaquHomepageRevamp: Project = {
  id: "bank-saqu-homepage-revamp",
  slug: "bank-saqu-homepage-revamp",
  title: "Bank Saqu Homepage Revamp",
  category: "Product Design",
  year: "2026",
  thumbnail: "bank-saqu",
  featured: true,
  order: 1,

  summary:
    "Redesigning the homepage of a digital bank so users can discover products, access key actions, and understand their finances with confidence and clarity.",
  metaGrid: [
    { label: "Role", value: "Product Designer" },
    { label: "Scope", value: "Full redesign" },
    { label: "Platform", value: "Mobile" },
    { label: "Timeline", value: "3 months" },
  ],
  heroImage: { src: "placeholder", alt: "Bank Saqu homepage redesign hero" },

  sections: [
    {
      type: "richText",
      anchor: "overview",
      heading: "Overview",
      paragraphs: [
        "As Bank Saqu expanded its product offerings, the homepage became increasingly complex and harder to navigate.",
        "Multiple features, including promotions, maintenance updates, and partnerships, were presented without clear separation or hierarchy. As a result, users struggled to quickly understand available products and locate what they needed.",
        "**This led to a key problem:** the homepage was no longer acting as a clear entry point, but instead felt cluttered and overwhelming.",
        "Our goal was to simplify the homepage experience by improving structure, clarity, and discoverability, while also creating a scalable foundation for future product expansion.",
      ],
    },
    {
      type: "bulletList",
      anchor: "problem",
      heading: "Problem Statement",
      intro:
        "As Bank Saqu expanded its product ecosystem, the homepage became increasingly complex and difficult to navigate. Users struggled to:",
      style: "arrow",
      items: [
        "Discover relevant features and promotions due to lack of clear structure and dedicated sections",
        "Understand product offerings because of unclear naming and insufficient contextual information",
        "Differentiate between key functionalities (e.g. transactions, rewards, investments)",
        "Access important information such as maintenance updates and account details efficiently",
        "Redundant elements and excessive steps increased friction in feature discovery",
        "Critical information was often buried or overshadowed by less relevant content",
      ],
    },
    {
      type: "hmwGrid",
      heading: "How Might We",
      cards: [
        "How might we improve feature and promotion discoverability based on user needs and intent?",
        "How might we make maintenance and important system information more visible without overwhelming users?",
        "How might we simplify navigation so users can access key features faster and more intuitively?",
        "How might we help users better understand product structures, balances, and account information?",
      ],
    },
    {
      type: "bulletList",
      heading: "Goals",
      style: "check",
      items: [
        "Improve product and feature discoverability across the homepage",
        "Reduce friction in accessing key actions and information",
        "Enhance clarity of system information (e.g. maintenance, errors)",
        "Create a scalable and structured layout to support future product growth",
      ],
    },
    {
      type: "richText",
      heading: "Design Strategy",
      paragraphs: [
        "Instead of reducing the number of features, we focused on reducing perceived complexity — the primary driver of user drop-off.",
        "**Our approach was to:**",
      ],
      items: [
        "Break down information into manageable, step-by-step flows",
        "Minimize visual and cognitive load to reduce user fatigue",
        "Guide users with clear hierarchy and contextual support at critical moments",
      ],
      closingParagraphs: [
        "We prioritized perception over reduction, recognizing that users abandon flows not because of length alone, but because of how heavy the experience feels.",
      ],
    },
    {
      type: "stepBlock",
      anchor: "solution",
      sectionHeading: "Solution",
      stepNumber: 1,
      title: "Prioritizing Core Actions",
      description: "Moved key actions (balance, transfer, pay) to the most prominent area.",
      bullets: [
        "Reduces time to complete primary tasks",
        "Aligns with user intent: daily transactions first",
      ],
      image: { src: "placeholder", alt: "Core actions placement" },
    },
    {
      type: "stepBlock",
      stepNumber: 2,
      title: "Improving Information Hierarchy",
      description: "Reorganized homepage into clear sections:",
      bullets: [
        "Primary actions (top)",
        "Services / products",
        "Contextual information (news, maintenance)",
        "Promotions",
      ],
      image: { src: "placeholder", alt: "Information hierarchy" },
    },
    {
      type: "stepBlock",
      stepNumber: 3,
      title: "Contextual Information System",
      description: "Introduced contextual banners:",
      bullets: [
        "Maintenance info shown only when relevant",
        "News triggered based on user state — prevents unnecessary noise and keeps users informed without overload",
      ],
      image: { src: "placeholder", alt: "Contextual banners" },
    },
    {
      type: "stepBlock",
      stepNumber: 4,
      title: "Highlighting Promotions Strategically",
      description: "Placed promo section in a visible but non-disruptive position.",
      bullets: ["Increases engagement", "Avoids interfering with primary tasks"],
      image: { src: "placeholder", alt: "Promotions placement" },
    },
    {
      type: "stepBlock",
      stepNumber: 5,
      title: "Balance Clarity Improvement",
      description: "Displayed only usable balance for transactions.",
      bullets: ["Reduces confusion", "Improves decision-making speed"],
      image: { src: "placeholder", alt: "Balance clarity" },
    },
    {
      type: "twoColumn",
      heading: "Validation & Iteration",
      leftTitle: "Usability testing revealed:",
      leftItems: [
        "Users expect key actions (transfer/pay) to be immediately visible",
        "Account number visibility is critical and highly appreciated",
        "Promotions are more effective when surfaced directly on the homepage",
      ],
      rightTitle: "Based on this:",
      rightItems: [
        "Moved key actions to top",
        "Displayed account number prominently",
        "Increased visibility of promo section",
      ],
      image: { src: "placeholder", alt: "Iterated homepage design" },
    },
    {
      type: "impactCallout",
      anchor: "results",
      heading: "Impact & Results",
      items: [
        "Improved feature discoverability through better hierarchy",
        "Reduced user friction in completing primary tasks",
        "Faster access to key actions (transfer, pay)",
        "Increased user clarity and confidence",
      ],
      calloutTitle: "Business Benefits",
      calloutItems: [
        "Higher engagement with key features",
        "Increased visibility of promotions",
        "Stronger foundation for future product expansion",
      ],
    },
    {
      type: "reflection",
      heading: "Reflection",
      paragraphs: [
        "This project reinforced that homepage design is not about showcasing all features, but about prioritizing the right ones.",
      ],
      learningsTitle: "Key learnings:",
      learnings: [
        "Users are task-driven, not exploration-driven",
        "Strong hierarchy is more important than adding features",
        "Balancing business needs (promos) and user needs (actions) is critical",
      ],
      pullQuote: {
        text: "A successful homepage doesn't show everything — it helps users do",
        accent: "the right thing, faster.",
      },
    },
  ],

  status: "published",
};
