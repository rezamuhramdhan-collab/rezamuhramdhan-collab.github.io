// Unified data model — PRD §4.
// Singletons (one record, edit-only) and collections (full CRUD + reorder).
// Phase 1 stores records as typed TS modules; the same shapes map 1:1 onto a
// CMS schema (Sanity/Payload) or SQL tables when the backend is chosen.

// ---------- Shared ----------

export interface LinkItem {
  label: string;
  href: string;
}

export interface ButtonItem extends LinkItem {
  variant: "dark" | "outline";
  icon?: "arrow" | "whatsapp" | "email";
  download?: boolean;
}

export interface SocialLink {
  platform: "linkedin" | "instagram" | "email";
  href: string;
  label: string;
}

// ---------- Singletons ----------

export interface SiteSettings {
  logoText: string;
  logoImage?: ImageRef; // replaces the text logo when set
  favicon?: ImageRef; // browser tab icon
  navLinks: LinkItem[];
  ctaButton: ButtonItem;
  footerText: string;
  footerLinks: LinkItem[];
  // Case-study defaults (overridable per project)
  backLink: LinkItem;
  ctaFooter: { headline: string; subtext: string; button: ButtonItem };
}

export interface Hero {
  greeting: string;
  roleHighlight: string;
  bio: string;
  primaryCta: ButtonItem;
  secondaryCta: ButtonItem;
  socialLinks: SocialLink[];
  portrait?: ImageRef; // uploaded photo; built-in silhouette when placeholder
  profileCard: { name: string; subtitle: string; avatarInitial: string };
}

export interface About {
  headline: string;
  headlineAccent: string; // rendered in accent blue inside the headline
  paragraphs: string[];
  yearsExperience: number; // drives "over N years" copy
}

export interface CtaSection {
  headline: string;
  headlineAccent: string;
  subtext: string;
  buttons: ButtonItem[];
}

// ---------- Collections ----------

export interface ServiceCard {
  id: string;
  icon: "pen" | "grid" | "bulb";
  title: string;
  description: string;
  order: number;
}

export interface ExperienceEntry {
  id: string;
  period: string;
  role: string;
  company: string;
  companyLink: string;
  description: string;
  order: number;
  isCurrent: boolean;
}

// ---------- Case study section blocks (PRD §4.3) ----------

export type ListStyle = "bullet" | "check" | "arrow";

// Where a section's images sit relative to its text.
// "grid3" applies to the standalone gallery block only.
export type ImageLayout = "full" | "left" | "right" | "grid" | "grid3";

// Shared by content blocks that can carry images.
// `image` is the legacy single slot (still accepted in seed content);
// the renderer and CMS work with `images` + `imageLayout`.
export interface SectionImages {
  image?: ImageRef;
  images?: ImageRef[];
  imageLayout?: ImageLayout;
}

export interface RichTextBlock extends SectionImages {
  type: "richText";
  anchor?: string;
  heading?: string;
  paragraphs: string[]; // "**bold**" spans render as ink-colored strong text
  items?: string[]; // optional arrow list between paragraph groups
  closingParagraphs?: string[];
}

export interface BulletListBlock extends SectionImages {
  type: "bulletList";
  anchor?: string;
  heading?: string;
  intro?: string;
  items: string[];
  style: ListStyle;
}

export interface HmwGridBlock {
  type: "hmwGrid";
  anchor?: string;
  heading: string;
  cards: string[]; // numbered by position
}

export interface StepBlock extends SectionImages {
  type: "stepBlock";
  anchor?: string;
  sectionHeading?: string; // h2 for the group; consecutive stepBlocks share one section
  stepNumber: number;
  title: string;
  description?: string;
  bullets: string[];
}

export interface TwoColumnBlock extends SectionImages {
  type: "twoColumn";
  anchor?: string;
  heading: string;
  leftTitle: string;
  leftItems: string[];
  rightTitle: string;
  rightItems: string[];
}

export interface ImpactCalloutBlock {
  type: "impactCallout";
  anchor?: string;
  heading: string;
  items: string[];
  calloutTitle: string;
  calloutItems: string[];
}

export interface ReflectionBlock {
  type: "reflection";
  anchor?: string;
  heading: string;
  paragraphs: string[];
  learningsTitle: string;
  learnings: string[];
  pullQuote?: { text: string; accent: string };
}

export interface ImageBlock extends SectionImages {
  type: "image";
  anchor?: string;
}

export type SectionBlock =
  | RichTextBlock
  | BulletListBlock
  | HmwGridBlock
  | StepBlock
  | TwoColumnBlock
  | ImpactCalloutBlock
  | ReflectionBlock
  | ImageBlock;

// "placeholder" renders the neutral device placeholder until real assets exist.
export interface ImageRef {
  src: "placeholder" | string;
  alt: string;
  caption?: string;
}

// ---------- Project (★ core) ----------

export interface MetaPair {
  label: string;
  value: string;
}

export interface Project {
  // Card fields (homepage grid)
  id: string;
  slug: string;
  title: string;
  category: string;
  year: string;
  thumbnail: string; // key into the thumbnail registry (svg placeholders for now)
  featured: boolean;
  order: number;

  // Detail header
  summary: string;
  metaGrid: MetaPair[];
  heroImage: ImageRef;

  // Detail body
  sections: SectionBlock[];

  // Meta
  status: "draft" | "published";
  nextProjectSlug?: string;
}
