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

// Blocks may declare a legacy single `image` or the newer `images` array.
const toImages = (section: { image?: ImageRef; images?: ImageRef[] }) =>
  (section.images ?? (section.image ? [section.image] : [])).map(toImageSlot);

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
        images: toImages(section),
        imageLayout: section.imageLayout ?? "full",
      };
    case "bulletList":
      return {
        blockType: "bulletList",
        anchor: section.anchor,
        heading: section.heading,
        intro: section.intro,
        style: section.style,
        items: toTextArray(section.items),
        images: toImages(section),
        imageLayout: section.imageLayout ?? "full",
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
        images: toImages(section),
        imageLayout: section.imageLayout ?? "full",
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
        images: toImages(section),
        imageLayout: section.imageLayout ?? "full",
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
        images: toImages(section),
        imageLayout: section.imageLayout ?? "full",
      };
  }
}

function toProjectDoc(project: Project, categoryId: number | string) {
  const metaValue = (label: string) =>
    project.metaGrid.find((pair) => pair.label.toLowerCase() === label)?.value ?? "";
  return {
    title: project.title,
    slug: project.slug,
    category: categoryId,
    year: project.year,
    thumbnail: { placeholderKey: project.thumbnail },
    featured: project.featured,
    summary: project.summary,
    meta: {
      role: metaValue("role"),
      scope: metaValue("scope"),
      platform: metaValue("platform"),
      timeline: metaValue("timeline"),
    },
    heroImage: toImageSlot(project.heroImage),
    sections: project.sections.map(toBlock),
    nextProjectSlug: project.nextProjectSlug,
    _status: "published" as const,
  };
}

// Creates categories + projects only (idempotent-ish: skips if projects exist).
// Reused by the standalone projects migration so schema changes don't require
// wiping user-edited globals/media.
export async function seedProjects(payload: Payload): Promise<void> {
  const categoryIds = new Map<string, number | string>();
  for (const name of [...new Set(getPublishedProjects().map((p) => p.category))]) {
    const existing = await payload.find({
      collection: "categories",
      where: { name: { equals: name } },
      limit: 1,
    });
    const id =
      existing.docs[0]?.id ??
      ((await payload.create({ collection: "categories", data: { name } as never })) as { id: number | string })
        .id;
    categoryIds.set(name, id);
  }
  for (const project of getPublishedProjects()) {
    await payload.create({
      collection: "projects",
      draft: false,
      data: toProjectDoc(project, categoryIds.get(project.category)!) as never,
    });
  }
}

export async function seed(payload: Payload): Promise<void> {
  if (process.env.SKIP_SEED) return; // schema-push boots (migrations) skip seeding
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

  await seedProjects(payload);

  // Dev convenience only: a default local admin so a fresh local database
  // is immediately usable. Never runs in production builds.
  if (process.env.NODE_ENV !== "production") {
    const { totalDocs: userCount } = await payload.count({ collection: "users" });
    if (userCount === 0) {
      await payload.create({
        collection: "users",
        data: { email: "reza@gmail.com", password: "admin123" } as never,
      });
      payload.logger.info("Seeded dev admin user: reza@gmail.com / admin123");
    }
  }

  payload.logger.info("Seed complete.");
}
