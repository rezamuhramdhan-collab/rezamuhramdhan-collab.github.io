import type { ExperienceEntry } from "./types";

// Experience collection — full CRUD + reorder (PRD §4.2)

export const experience: ExperienceEntry[] = [
  {
    id: "bank-saqu",
    period: "2022 – Present",
    role: "Product Designer",
    company: "Bank Saqu",
    companyLink: "#",
    description: "Leading design initiatives for banking products and digital experiences.",
    order: 1,
    isCurrent: true,
  },
  {
    id: "bri",
    period: "2021 – 2022",
    role: "Product Designer",
    company: "PT Bank Rakyat Indonesia",
    companyLink: "#",
    description: "Designed core features for banking services and customer experiences.",
    order: 2,
    isCurrent: false,
  },
  {
    id: "waste4change",
    period: "2020 – 2020",
    role: "Product Development – Internship",
    company: "Waste4Change",
    companyLink: "#",
    description: "Contributed to product development and user experience improvements.",
    order: 3,
    isCurrent: false,
  },
];
