import type { ServiceCard } from "./types";

// "What I Do" collection — full CRUD + reorder (PRD §4.2)

export const services: ServiceCard[] = [
  {
    id: "product-design",
    icon: "pen",
    title: "Product Design",
    description:
      "Creating intuitive and engaging user experiences that delight users and drive business results.",
    order: 1,
  },
  {
    id: "design-systems",
    icon: "grid",
    title: "Design Systems",
    description:
      "Building scalable component libraries and design tokens for consistent, efficient product development.",
    order: 2,
  },
  {
    id: "strategy",
    icon: "bulb",
    title: "Strategy",
    description:
      "Guiding product vision through user research, competitive analysis, and strategic design thinking.",
    order: 3,
  },
];
