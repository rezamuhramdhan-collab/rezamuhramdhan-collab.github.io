import { getPayload } from "payload";
import config from "@payload-config";
import { hasLexical } from "./lexical";
import { encryptSections } from "./lock";
import type { Project as ProjectDoc, Media } from "@/payload-types";
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
  ImageLayout,
} from "@/content/types";

// Read path over the Payload local API. Components keep consuming the
// original content types; only this module knows about CMS document shapes,
// and those shapes come from the generated payload-types.ts so schema drift
// is a compile error here rather than a runtime surprise.

const payloadClient = () => getPayload({ config });

// ---------- Generated-shape aliases (the CMS side of the boundary) ----------

type SectionBlockDoc = NonNullable<ProjectDoc["sections"]>[number];
type ImageRowsDoc = Extract<SectionBlockDoc, { blockType: "image" }>["images"];

// Upload relations stay ids unless populated (depth >= 1 resolves them).
type UploadRef = (number | null) | Media | undefined;

interface ImageSlotDoc {
  media?: UploadRef;
  alt?: string | null;
  caption?: string | null;
  showPlaceholder?: boolean | null;
}

const fromTextArray = (rows?: { text?: string | null }[] | null): string[] =>
  (rows ?? []).map((row) => row.text ?? "");

// Each list item carries an optional rich-text editor state plus legacy text.
const fromRichArray = (rows?: { text?: string | null; content?: unknown }[] | null) =>
  (rows ?? []).map((row) => ({
    text: row.text ?? "",
    content: hasLexical(row.content) ? row.content : undefined,
  }));

function fromImageSlot(slot: ImageSlotDoc | null | undefined): ImageRef | undefined {
  if (!slot) return undefined;
  if (slot.media && typeof slot.media === "object" && slot.media.url) {
    return {
      src: slot.media.url,
      alt: slot.alt ?? slot.media.alt ?? "",
      caption: slot.caption ?? undefined,
      width: slot.media.width ?? undefined,
      height: slot.media.height ?? undefined,
    };
  }
  if (slot.showPlaceholder) {
    return { src: "placeholder", alt: slot.alt ?? "", caption: slot.caption ?? undefined };
  }
  return undefined;
}

function fromImages(rows: ImageRowsDoc): ImageRef[] | undefined {
  const images = (rows ?? [])
    .map(fromImageSlot)
    .filter((img): img is ImageRef => Boolean(img));
  return images.length ? images : undefined;
}

// Fields shared by blocks that carry images / only an anchor.
const mediaBase = (block: {
  anchor?: string | null;
  images?: ImageRowsDoc;
  imageLayout?: ImageLayout | null;
}) => ({
  anchor: block.anchor ?? undefined,
  images: fromImages(block.images),
  imageLayout: block.imageLayout ?? ("full" as const),
});

const anchorBase = (block: { anchor?: string | null }) => ({
  anchor: block.anchor ?? undefined,
});

function fromBlock(block: SectionBlockDoc): SectionBlock {
  switch (block.blockType) {
    case "richText":
      return {
        ...mediaBase(block),
        type: "richText",
        heading: block.heading ?? undefined,
        content: block.content ?? undefined,
        paragraphs: fromRichArray(block.paragraphs),
        items: block.items?.length ? fromRichArray(block.items) : undefined,
        closingParagraphs: block.closingParagraphs?.length
          ? fromRichArray(block.closingParagraphs)
          : undefined,
      };
    case "bulletList":
      return {
        ...mediaBase(block),
        type: "bulletList",
        heading: block.heading ?? undefined,
        intro: block.intro ?? undefined,
        style: block.style,
        items: fromRichArray(block.items),
      };
    case "hmwGrid":
      return { ...anchorBase(block), type: "hmwGrid", heading: block.heading, cards: fromRichArray(block.cards) };
    case "stepBlock":
      return {
        ...mediaBase(block),
        type: "stepBlock",
        sectionHeading: block.sectionHeading ?? undefined,
        stepNumber: block.stepNumber,
        title: block.title,
        description: block.description ?? undefined,
        bullets: fromRichArray(block.bullets),
      };
    case "twoColumn":
      return {
        ...mediaBase(block),
        type: "twoColumn",
        heading: block.heading,
        leftTitle: block.leftTitle,
        leftItems: fromRichArray(block.leftItems),
        rightTitle: block.rightTitle,
        rightItems: fromRichArray(block.rightItems),
      };
    case "impactCallout":
      return {
        ...anchorBase(block),
        type: "impactCallout",
        heading: block.heading,
        items: fromRichArray(block.items),
        calloutTitle: block.calloutTitle,
        calloutItems: fromRichArray(block.calloutItems),
      };
    case "reflection":
      return {
        ...anchorBase(block),
        type: "reflection",
        heading: block.heading,
        paragraphs: fromRichArray(block.paragraphs),
        learningsTitle: block.learningsTitle ?? "Key learnings:",
        learnings: fromRichArray(block.learnings),
        pullQuote: block.pullQuoteText
          ? { text: block.pullQuoteText, accent: block.pullQuoteAccent ?? "" }
          : undefined,
      };
    case "image": {
      const base = mediaBase(block);
      return { ...base, type: "image", images: base.images ?? [{ src: "placeholder", alt: "" }] };
    }
    default: {
      // Exhaustiveness guard: a new CMS block type is a compile error here,
      // and runtime schema drift fails loudly instead of silently rendering
      // an empty placeholder image.
      const exhausted: never = block;
      throw new Error(`Unknown section block type: ${JSON.stringify(exhausted)}`);
    }
  }
}

function fromProjectDoc(doc: ProjectDoc, index: number): Project {
  const thumbMedia = doc.thumbnail?.media;
  const sections = (doc.sections ?? []).map(fromBlock);
  // Locked projects ship only ciphertext; the raw sections never leave here.
  const locked = Boolean(doc.locked && doc.password);
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
    sections: locked ? [] : sections,
    lock: locked ? encryptSections(JSON.stringify(sections), doc.password!) : undefined,
    status: doc._status === "draft" ? "draft" : "published",
    nextProjectSlug: doc.nextProjectSlug ?? undefined,
    updatedAt: doc.updatedAt,
  };
}

// ---------- Globals ----------

function fromUpload(media: UploadRef): ImageRef | undefined {
  return media && typeof media === "object" && media.url
    ? {
        src: media.url,
        alt: media.alt ?? "",
        width: media.width ?? undefined,
        height: media.height ?? undefined,
      }
    : undefined;
}

// A button's destination can be a typed link or an uploaded file; the file wins.
function resolveButton<B extends { href?: string | null; file?: UploadRef }>(b: B | null | undefined) {
  if (!b) return b;
  const fileUrl = b.file && typeof b.file === "object" ? b.file.url : undefined;
  return { ...b, href: fileUrl || b.href || "#" };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const payload = await payloadClient();
  const doc = await payload.findGlobal({ slug: "site-settings", depth: 1 });
  return {
    ...doc,
    logoImage: fromUpload(doc.logoImage),
    favicon: fromUpload(doc.favicon),
    navLinks: doc.navLinks ?? [],
    footerLinks: doc.footerLinks ?? [],
    ctaButton: resolveButton(doc.ctaButton),
    ctaFooter: doc.ctaFooter
      ? { ...doc.ctaFooter, button: resolveButton(doc.ctaFooter.button) }
      : doc.ctaFooter,
  } as SiteSettings;
}

export async function getHero(): Promise<Hero> {
  const payload = await payloadClient();
  const doc = await payload.findGlobal({ slug: "hero", depth: 1 });
  return {
    ...doc,
    portrait: fromImageSlot(doc.portrait),
    socialLinks: doc.socialLinks ?? [],
    primaryCta: resolveButton(doc.primaryCta),
    secondaryCta: resolveButton(doc.secondaryCta),
  } as Hero;
}

export async function getAbout(): Promise<About> {
  const payload = await payloadClient();
  const doc = await payload.findGlobal({ slug: "about" });
  return { ...doc, paragraphs: fromTextArray(doc.paragraphs) } as About;
}

export async function getCta(): Promise<CtaSection> {
  const payload = await payloadClient();
  const doc = await payload.findGlobal({ slug: "cta", depth: 1 });
  return { ...doc, buttons: (doc.buttons ?? []).map((button) => resolveButton(button)) } as CtaSection;
}

// ---------- Collections ----------

export async function getServices(): Promise<ServiceCard[]> {
  const payload = await payloadClient();
  const { docs } = await payload.find({ collection: "services", sort: "_order", limit: 100 });
  return docs.map((doc, i) => ({
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
  return docs.map((doc, i) => ({
    id: String(doc.id),
    period: doc.period,
    role: doc.role,
    company: doc.company,
    companyLink: doc.companyLink ?? "#",
    description: doc.description ?? "",
    content: hasLexical(doc.content) ? doc.content : undefined,
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
