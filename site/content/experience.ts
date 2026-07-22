import type { ExperienceEntry } from "./types";

// Experience collection — full CRUD + reorder (PRD §4.2)

export const experience: ExperienceEntry[] = [
  {
    id: "bank-saqu",
    period: "2022 — Present",
    role: "Product Designer",
    company: "Bank Saqu",
    companyLink: "#",
    employmentType: "Full-time",
    location: "Jakarta, ID",
    description:
      "Led end-to-end redesign of onboarding and KYC journeys, reducing early drop-off and improving completion rate by ~12%\nRe-architected the homepage into a modular, widget-based system enabling scalable personalization across 4+ product lines\nBuilt and scaled a multi-squad design system adopted by 5+ teams, cutting design-to-dev handoff time by ~20%",
    order: 1,
    isCurrent: true,
  },
  {
    id: "bri",
    period: "2021 — 2022",
    role: "Product Designer",
    company: "PT Bank Rakyat Indonesia",
    companyLink: "#",
    employmentType: "Full-time",
    location: "Jakarta, ID",
    description:
      "Designed user flows, wireframes, and high-fidelity UI for key banking features including onboarding, dashboard, and transactions\nCollaborated with the UX Research team on usability testing, translating findings into actionable product improvements\nBalanced usability, compliance requirements, and scalability across every release",
    order: 2,
    isCurrent: false,
  },
  {
    id: "waste4change",
    period: "2020",
    role: "Product Development — Internship",
    company: "Waste4Change",
    companyLink: "#",
    employmentType: "Internship",
    location: "Bekasi, ID",
    description:
      "Assisted in prioritizing product requirements and aligning development timelines with business expectations\nParticipated in the product development lifecycle from ideation to execution, gaining exposure to early-stage product decisions",
    order: 3,
    isCurrent: false,
  },
];
