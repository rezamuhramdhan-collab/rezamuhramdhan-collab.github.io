import type { ExperienceEntry } from "./types";

// Experience collection — full CRUD + reorder (PRD §4.2)
//
// `description` holds one achievement per line; the homepage renders each line
// as its own bullet. Copy mirrors the LinkedIn profile so the two stay in sync.

export const experience: ExperienceEntry[] = [
  {
    id: "bank-saqu",
    period: "2022 — Present",
    role: "Product Designer",
    company: "Bank Saqu",
    companyLink: "#",
    employmentType: "Full-time",
    location: "Jakarta, ID",
    description: [
      "Led end-to-end redesign of onboarding and KYC journeys, reducing funnel drop-off by ~15% and improving completion rate by ~10%",
      "Re-architected the homepage into a modular, widget-based system, enabling scalable personalization across 4+ product lines",
      "Redesigned credit limit and repayment UX, including reminders and overdue communication, improving repayment clarity and reducing related support inquiries by ~10%",
      "Shaped BNPL and cash loan flows end-to-end, translating business requirements and user insights into scalable solutions that improved completion rate by ~12% and loan activation by ~8%",
      "Built and scaled a multi-squad design system adopted by 5+ teams, improving UI consistency and cutting design-to-dev handoff time by ~20%",
      "Partnered with Product Managers, Engineers, and Compliance to align user needs, business goals, and regulatory requirements across every release",
    ].join("\n"),
    order: 1,
    isCurrent: true,
  },
  {
    id: "bri",
    period: "2021 — 2022",
    role: "Product Designer",
    company: "PT Bank Rakyat Indonesia",
    companyLink: "#",
    employmentType: "Contract",
    location: "Jakarta, ID",
    description: [
      "Worked closely with Product Managers and stakeholders to define feature scope and align design solutions with market needs and business strategy",
      "Designed user flows, wireframes, and high-fidelity UI for key banking features, including onboarding, dashboard, and transactions",
      "Collaborated with the UX Research team to conduct usability testing and translate findings into actionable product improvements",
      "Balanced usability, compliance requirements, and scalability in delivering consistent and high-quality product experiences",
      "Participated in cross-functional discussions to improve product decisions and overall user experience quality",
    ].join("\n"),
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
    description: [
      "Assisted in prioritizing product requirements and aligning development timelines with business expectations",
      "Participated in the product development lifecycle from ideation to execution, gaining exposure to early-stage product decisions",
    ].join("\n"),
    order: 3,
    isCurrent: false,
  },
];
