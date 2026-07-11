import type { Hero, Project } from "@/content/types";

// SEO foundation (see docs/seo-best-practices-research.md §5).
// The Vercel deployment is the canonical home; the GitHub Pages static
// export is a secondary copy whose pages carry noindex + a cross-domain
// canonical pointing here, so search consolidates onto one URL per page.

export const SITE_URL = "https://rezadesign.vercel.app";

// True for the GitHub Pages build (set by CI); the Vercel build never sets it.
export const IS_SECONDARY_DEPLOY = Boolean(process.env.STATIC_EXPORT);

const httpOnly = (url?: string) => (url && url.startsWith("http") ? url : undefined);

// ---------- JSON-LD builders ----------

export function personJsonLd(hero: Hero) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: hero.profileCard.name,
    jobTitle: hero.profileCard.subtitle,
    url: SITE_URL,
    sameAs: hero.socialLinks.map((s) => httpOnly(s.href)).filter(Boolean),
  };
}

export function websiteJsonLd(hero: Hero) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${hero.profileCard.name} — Portfolio`,
    url: SITE_URL,
    author: { "@type": "Person", name: hero.profileCard.name },
  };
}

export function caseStudyJsonLd(project: Project, authorName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${SITE_URL}/work/${project.slug}`,
    ...(httpOnly(project.heroImage.src) ? { image: project.heroImage.src } : {}),
    ...(project.updatedAt ? { dateModified: project.updatedAt } : {}),
    author: { "@type": "Person", name: authorName, url: SITE_URL },
  };
}

// Renders a JSON-LD object for embedding in a <script> tag.
export function jsonLdString(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
