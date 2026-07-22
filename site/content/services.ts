import type { ServiceCard } from "./types";

// "What I Do" collection — full CRUD + reorder (PRD §4.2)

export const services: ServiceCard[] = [
  {
    id: "product-design",
    title: "Product Design",
    description:
      "Creating intuitive and engaging user experiences that delight users and drive business results.",
    tags: ["Research", "Prototyping", "Usability Testing", "UI Design"],
    order: 1,
  },
  {
    id: "design-systems",
    title: "Design Systems",
    description:
      "Building scalable component libraries and design tokens for consistent, efficient product development.",
    tags: [],
    order: 2,
  },
  {
    id: "strategy",
    title: "Strategy",
    description:
      "Guiding product vision through user research, competitive analysis, and strategic design thinking.",
    tags: [],
    order: 3,
  },
];
