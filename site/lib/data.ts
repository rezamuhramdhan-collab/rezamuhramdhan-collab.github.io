import { getPayload } from "payload";
import config from "@payload-config";
import type {
  SiteSettings,
  Hero,
  About,
  CtaSection,
  ServiceCard,
  ExperienceEntry,
  Project,
  SectionBlock,
  ImageRef,
} from "@/content/types";

// Read path over the Payload local API. Components keep consuming the
// original content types; only this module knows about CMS document shapes.

/* eslint-disable @typescript-eslint/no-explicit-any */

const payloadClient = () => getPayload({ config });

const fromTextArray = (rows?: { text: string }[] | null): string[] =>
  (rows ?? []).map((row) => row.text);

function fromImageSlot(slot: any): ImageRef | undefined {
  if (!slot) return undefined;
  if (slot.media && typeof slot.media === "object" && slot.media.url) {
    return { src: slot.media.url, alt: slot.alt ?? slot.media.alt ?? "", caption: slot.caption ?? undefined };
  }
  if (slot.showPlaceholder) {
    return { src: "placeholder", alt: slot.alt ?? "", caption: slot.caption ?? undefined };
  }
  return undefined;
}

function fromImages(rows: any[] | null | undefined): ImageRef[] | undefined {
  const images = (rows ?? [])
    .map(fromImageSlot)
    .filter((img): img is ImageRef => Boolean(img));
  return images.length ? images : undefined;
}

function fromBlock(block: any): SectionBlock {
  const base = {
    anchor: block.anchor ?? undefined,
    images: fromImages(block.images),
    imageLayout: block.imageLayout ?? "full",
  };
  switch (block.blockType) {
    case "richText":
      return {
        ...base,
        type: "richText",
        heading: block.heading ?? undefined,
        paragraphs: fromTextArray(block.paragraphs),
        items: block.items?.length ? fromTextArray(block.items) : undefined,
        closingParagraphs: block.closingParagraphs?.length
          ? fromTextArray(block.closingParagraphs)
          : undefined,
      };
    case "bulletList":
      return {
        ...base,
        type: "bulletList",
        heading: block.heading ?? undefined,
        intro: block.intro ?? undefined,
        style: block.style,
        items: fromTextArray(block.items),
      };
    case "hmwGrid":
      return { ...base, type: "hmwGrid", heading: block.heading, cards: fromTextArray(block.cards) };
    case "stepBlock":
      return {
        ...base,
        type: "stepBlock",
        sectionHeading: block.sectionHeading ?? undefined,
        stepNumber: block.stepNumber,
        title: block.title,
        description: block.description ?? undefined,
        bullets: fromTextArray(block.bullets),
      };
    case "twoColumn":
      return {
        ...base,
        type: "twoColumn",
        heading: block.heading,
        leftTitle: block.leftTitle,
        leftItems: fromTextArray(block.leftItems),
        rightTitle: block.rightTitle,
        rightItems: fromTextArray(block.rightItems),
      };
    case "impactCallout":
      return {
        ...base,
        type: "impactCallout",
        heading: block.heading,
        items: fromTextArray(block.items),
        calloutTitle: block.calloutTitle,
        calloutItems: fromTextArray(block.calloutItems),
      };
    case "reflection":
      return {
        ...base,
        type: "reflection",
        heading: block.heading,
        paragraphs: fromTextArray(block.paragraphs),
        learningsTitle: block.learningsTitle ?? "Key learnings:",
        learnings: fromTextArray(block.learnings),
        pullQuote: block.pullQuoteText
          ? { text: block.pullQuoteText, accent: block.pullQuoteAccent ?? "" }
          : undefined,
      };
    default:
      return {
        ...base,
        type: "image",
        images: base.images ?? [{ src: "placeholder", alt: "" }],
      };
  }
}

function fromProjectDoc(doc: any, index: number): Project {
  const thumbMedia = doc.thumbnail?.media;
  return {
    id: String(doc.id),
    slug: doc.slug,
    title: doc.title,
    category:
      typeof doc.category === "object" && doc.category ? doc.category.name : String(doc.category ?? ""),
    year: doc.year,
    thumbnail:
      thumbMedia && typeof thumbMedia === "object" && thumbMedia.url
        ? thumbMedia.url
        : doc.thumbnail?.placeholderKey ?? "",
    featured: Boolean(doc.featured),
    order: index + 1,
    summary: doc.summary,
    metaGrid: [
      { label: "Role", value: doc.meta?.role },
      { label: "Scope", value: doc.meta?.scope },
      { label: "Platform", value: doc.meta?.platform },
      { label: "Timeline", value: doc.meta?.timeline },
    ].filter((pair): pair is { label: string; value: string } => Boolean(pair.value)),
    heroImage: fromImageSlot(doc.heroImage) ?? { src: "placeholder", alt: doc.title },
    sections: (doc.sections ?? []).map(fromBlock),
    status: doc._status === "draft" ? "draft" : "published",
    nextProjectSlug: doc.nextProjectSlug ?? undefined,
  };
}

// ---------- Globals ----------

function fromUpload(media: any): ImageRef | undefined {
  return media && typeof media === "object" && media.url
    ? { src: media.url, alt: media.alt ?? "" }
    : undefined;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const payload = await payloadClient();
  const doc: any = await payload.findGlobal({ slug: "site-settings", depth: 1 });
  return {
    ...doc,
    logoImage: fromUpload(doc.logoImage),
    favicon: fromUpload(doc.favicon),
    navLinks: doc.navLinks ?? [],
    footerLinks: doc.footerLinks ?? [],
  } as SiteSettings;
}

export async function getHero(): Promise<Hero> {
  const payload = await payloadClient();
  const doc: any = await payload.findGlobal({ slug: "hero", depth: 1 });
  return {
    ...doc,
    portrait: fromImageSlot(doc.portrait),
    socialLinks: doc.socialLinks ?? [],
  } as Hero;
}

export async function getAbout(): Promise<About> {
  const payload = await payloadClient();
  const doc: any = await payload.findGlobal({ slug: "about" });
  return { ...doc, paragraphs: fromTextArray(doc.paragraphs) } as About;
}

export async function getCta(): Promise<CtaSection> {
  const payload = await payloadClient();
  const doc: any = await payload.findGlobal({ slug: "cta" });
  return { ...doc, buttons: doc.buttons ?? [] } as CtaSection;
}

// ---------- Collections ----------

export async function getServices(): Promise<ServiceCard[]> {
  const payload = await payloadClient();
  const { docs } = await payload.find({ collection: "services", sort: "_order", limit: 100 });
  return docs.map((doc: any, i: number) => ({
    id: String(doc.id),
    icon: doc.icon,
    title: doc.title,
    description: doc.description,
    order: i + 1,
  }));
}

export async function getExperience(): Promise<ExperienceEntry[]> {
  const payload = await payloadClient();
  const { docs } = await payload.find({ collection: "experience", sort: "_order", limit: 100 });
  return docs.map((doc: any, i: number) => ({
    id: String(doc.id),
    period: doc.period,
    role: doc.role,
    company: doc.company,
    companyLink: doc.companyLink ?? "#",
    description: doc.description ?? "",
    order: i + 1,
    isCurrent: Boolean(doc.isCurrent),
  }));
}

export async function getPublishedProjects(): Promise<Project[]> {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "projects",
    where: { _status: { equals: "published" } },
    sort: "_order",
    depth: 1,
    limit: 100,
  });
  return docs.map(fromProjectDoc);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return (await getPublishedProjects()).filter((p) => p.featured);
}

// Related-project link: explicit nextProjectSlug wins, else next published by order.
export async function getNextProject(current: Project): Promise<Project | undefined> {
  if (current.nextProjectSlug) {
    const explicit = await getProjectBySlug(current.nextProjectSlug);
    if (explicit && explicit.status === "published") return explicit;
  }
  const published = await getPublishedProjects();
  if (published.length < 2) return undefined;
  const idx = published.findIndex((p) => p.slug === current.slug);
  return published[(idx + 1) % published.length];
}

export async function getProjectBySlug(slug: string, draft = false): Promise<Project | undefined> {
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "projects",
    where: { slug: { equals: slug } },
    draft,
    depth: 1,
    limit: 1,
  });
  return docs[0] ? fromProjectDoc(docs[0], 0) : undefined;
}
