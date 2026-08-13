import type { ServiceCard } from "./types";

// "What I Do" collection — full CRUD + reorder (PRD §4.2). Rendered as the
// four-cell Approach strip (components/home/sections.tsx). Copy follows the v3
// prototype (prototypes/v3-landing.html §Approach); the third cell keeps the
// original Strategy card instead of the prototype's "Prototypes in code".

export const services: ServiceCard[] = [
  {
    id: "discovery",
    title: "Discovery that bites",
    icon: "search",
    description:
      "Interviews, diary studies, and ride-alongs that surface the constraint nobody wrote in the brief.",
    tags: ["Research", "Prototyping", "Usability Testing", "UI Design"],
    order: 1,
  },
  {
    id: "systems",
    title: "Systems, not screens",
    icon: "layers",
    description:
      "Tokens, components, and documentation that survive three roadmaps and two rebrands.",
    tags: [],
    order: 2,
  },
  {
    id: "strategy",
    title: "Strategy",
    icon: "compass",
    description:
      "Guiding product vision through user research, competitive analysis, and strategic design thinking.",
    tags: [],
    order: 3,
  },
  {
    id: "measured",
    title: "Measured after launch",
    icon: "chart",
    description:
      "Instrumented flows and honest retros. If it did not move a number, I say so out loud.",
    tags: [],
    order: 4,
  },
];
