import type { Payload } from "payload";
import type { Project, SectionBlock, ImageRef } from "@/content/types";
import { siteSettings, hero, about, cta } from "@/content/site";
import { services } from "@/content/services";
import { experience } from "@/content/experience";
import { getPublishedProjects } from "@/content/projects";

// One-time migration (PRD Phase 1 → 3): if the database is empty, load it
// from the static content modules. After seeding, the database is the source
// of truth and the content files are only a fixture.

const toTextArray = (items?: string[]) => (items ?? []).map((text) => ({ text }));

const toImageSlot = (image?: ImageRef) =>
  image
    ? { alt: image.alt, caption: image.caption ?? null, showPlaceholder: true }
    : { showPlaceholder: false };

function toBlock(section: SectionBlock): Record<string, unknown> {
  switch (section.type) {
    case "richText":
      return {
        blockType: "richText",
        anchor: section.anchor,
        heading: section.heading,
        paragraphs: toTextArray(section.paragraphs),
        items: toTextArray(section.items),
        closingParagraphs: toTextArray(section.closingParagraphs),
      };
    case "bulletList":
      return {
        blockType: "bulletList",
        anchor: section.anchor,
        heading: section.heading,
        intro: section.intro,
        style: section.style,
        items: toTextArray(section.items),
      };
    case "hmwGrid":
      return {
        blockType: "hmwGrid",
        anchor: section.anchor,
        heading: section.heading,
        cards: toTextArray(section.cards),
      };
    case "stepBlock":
      return {
        blockType: "stepBlock",
        anchor: section.anchor,
        sectionHeading: section.sectionHeading,
        stepNumber: section.stepNumber,
        title: section.title,
        description: section.description,
        bullets: toTextArray(section.bullets),
        image: toImageSlot(section.image),
      };
    case "twoColumn":
      return {
        blockType: "twoColumn",
        anchor: section.anchor,
        heading: section.heading,
        leftTitle: section.leftTitle,
        leftItems: toTextArray(section.leftItems),
        rightTitle: section.rightTitle,
        rightItems: toTextArray(section.rightItems),
        image: toImageSlot(section.image),
      };
    case "impactCallout":
      return {
        blockType: "impactCallout",
        anchor: section.anchor,
        heading: section.heading,
        items: toTextArray(section.items),
        calloutTitle: section.calloutTitle,
        calloutItems: toTextArray(section.calloutItems),
      };
    case "reflection":
      return {
        blockType: "reflection",
        anchor: section.anchor,
        heading: section.heading,
        paragraphs: toTextArray(section.paragraphs),
        learningsTitle: section.learningsTitle,
        learnings: toTextArray(section.learnings),
        pullQuoteText: section.pullQuote?.text,
        pullQuoteAccent: section.pullQuote?.accent,
      };
    case "image":
      return {
        blockType: "image",
        anchor: section.anchor,
        image: toImageSlot(section.image),
      };
  }
}

function toProjectDoc(project: Project) {
  return {
    title: project.title,
    slug: project.slug,
    category: project.category,
    year: project.year,
    thumbnail: { placeholderKey: project.thumbnail },
    featured: project.featured,
    summary: project.summary,
    metaGrid: project.metaGrid,
    heroImage: toImageSlot(project.heroImage),
    sections: project.sections.map(toBlock),
    nextProjectSlug: project.nextProjectSlug,
    _status: "published" as const,
  };
}

export async function seed(payload: Payload): Promise<void> {
  const { totalDocs } = await payload.count({ collection: "projects" });
  if (totalDocs > 0) return;

  payload.logger.info("Seeding database from content modules…");

  await payload.updateGlobal({ slug: "site-settings", data: siteSettings as never });
  await payload.updateGlobal({
    slug: "hero",
    data: { ...hero, portrait: { showPlaceholder: true } } as never,
  });
  await payload.updateGlobal({
    slug: "about",
    data: { ...about, paragraphs: toTextArray(about.paragraphs) } as never,
  });
  await payload.updateGlobal({ slug: "cta", data: cta as never });

  for (const service of [...services].sort((a, b) => a.order - b.order)) {
    await payload.create({
      collection: "services",
      data: {
        icon: service.icon,
        title: service.title,
        description: service.description,
      } as never,
    });
  }

  for (const entry of [...experience].sort((a, b) => a.order - b.order)) {
    await payload.create({
      collection: "experience",
      data: {
        period: entry.period,
        role: entry.role,
        company: entry.company,
        companyLink: entry.companyLink,
        description: entry.description,
        isCurrent: entry.isCurrent,
      } as never,
    });
  }

  for (const project of getPublishedProjects()) {
    await payload.create({
      collection: "projects",
      draft: false,
      data: toProjectDoc(project) as never,
    });
  }

  payload.logger.info("Seed complete.");
}
