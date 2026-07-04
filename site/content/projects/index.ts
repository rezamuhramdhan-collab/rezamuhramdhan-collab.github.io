import type { Project } from "../types";
import { bankSaquHomepageRevamp } from "./bank-saqu-homepage-revamp";
import { mobileBankingApp } from "./mobile-banking-app";
import { saasPlatformRedesign } from "./saas-platform-redesign";
import { designSystem } from "./design-system";
import { mobileBankingHomepageRedesign } from "./mobile-banking-homepage-redesign";

const projects: Project[] = [
  bankSaquHomepageRevamp,
  mobileBankingApp,
  saasPlatformRedesign,
  designSystem,
  mobileBankingHomepageRedesign,
];

// Read path (PRD §6). These are the only functions pages call — when the
// backend moves to a CMS or database, only this module changes.

export function getPublishedProjects(): Project[] {
  return projects
    .filter((p) => p.status === "published")
    .sort((a, b) => a.order - b.order);
}

export function getFeaturedProjects(): Project[] {
  return getPublishedProjects().filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

// Related-project link: explicit nextProjectSlug wins, else next by order.
export function getNextProject(current: Project): Project | undefined {
  if (current.nextProjectSlug) return getProjectBySlug(current.nextProjectSlug);
  const published = getPublishedProjects();
  const idx = published.findIndex((p) => p.slug === current.slug);
  if (idx === -1) return undefined;
  return published[(idx + 1) % published.length];
}
