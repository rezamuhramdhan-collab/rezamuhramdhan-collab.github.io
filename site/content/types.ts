// Unified data model — PRD §4.
// Singletons (one record, edit-only) and collections (full CRUD + reorder).
// Phase 1 stores records as typed TS modules; the same shapes map 1:1 onto a
// CMS schema (Sanity/Payload) or SQL tables when the backend is chosen.

import type { ButtonIconKey, ServiceIconKey, SocialPlatformKey } from "./registry";

// ---------- Shared ----------

export interface LinkItem {
  label: string;
  href: string;
}

export interface ButtonItem extends LinkItem {
  variant: "dark" | "outline";
  icon?: ButtonIconKey;
  download?: boolean;
}

export interface SocialLink {
  label: string;
  href: string;
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
  eyebrow?: string; // not rendered in v3 — feeds JSON-LD jobTitle (lib/seo.ts)
  firstName?: string; // first line of the display name
  lastName?: string; // second line of the display name
  portfolioTag?: string; // deprecated (v2 hero photo overlay)
  bio: string;
  primaryCta: ButtonItem;
  secondaryCta?: ButtonItem; // ghost button beside it (e.g. "How I work")
  socialLinks: HeroSocialLink[]; // icon buttons under the CTAs
  portrait?: ImageRef; // not rendered in v3 — used as the OG/Twitter image
}

export interface HeroSocialLink extends SocialLink {
  platform?: SocialPlatformKey;
}

export interface About {
  headline: string; // section heading
  subheading?: string; // large display line beside the portrait
  paragraphs: string[];
  image?: ImageRef; // portrait beside the copy
  skills: string[]; // two-column dotted grid
  locationTag?: string; // accent tag over the portrait (e.g. "Jakarta, ID")
  resumeButton?: ButtonItem;
}

export interface ContactSection {
  eyebrow?: string;
  headline: string; // solid line (e.g. "Start a")
  headlineGhost?: string; // ghosted line (e.g. "Project")
  email?: string;
  location?: string;
  availability?: string;
  socialLinks: SocialLink[];
}

// ---------- Collections ----------

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon?: ServiceIconKey; // Approach strip icon tile; positional fallback if unset
  tags: string[]; // deprecated (v2 accordion detail)
  order: number;
}

export interface ExperienceEntry {
  id: string;
  period: string;
  role: string;
  company: string;
  companyLink: string;
  employmentType?: string; // Company · Type · Location meta line
  location?: string;
  description: string; // legacy plain text — used when content is absent
  content?: unknown; // Lexical editor state; wins over description when present
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

// A list entry: a plain string (seed content) or an object carrying an optional
// rich-text editor state plus its legacy plain text (from the CMS). The renderer
// normalizes both.
export type RichItem = string | { text?: string; content?: unknown };

export interface RichTextBlock extends SectionImages {
  type: "richText";
  anchor?: string;
  heading?: string;
  content?: unknown; // Lexical editor state; when present, replaces the legacy fields below
  paragraphs: RichItem[]; // "**bold**" spans render as ink-colored strong text (legacy)
  items?: RichItem[]; // optional arrow list between paragraph groups (legacy)
  closingParagraphs?: RichItem[]; // (legacy)
}

export interface BulletListBlock extends SectionImages {
  type: "bulletList";
  anchor?: string;
  heading?: string;
  intro?: string;
  items: RichItem[];
  style: ListStyle;
}

export interface HmwGridBlock {
  type: "hmwGrid";
  anchor?: string;
  heading: string;
  cards: RichItem[]; // numbered by position
}

export interface StepBlock extends SectionImages {
  type: "stepBlock";
  anchor?: string;
  sectionHeading?: string; // h2 for the group; consecutive stepBlocks share one section
  stepNumber: number;
  title: string;
  description?: string;
  bullets: RichItem[];
}

export interface TwoColumnBlock extends SectionImages {
  type: "twoColumn";
  anchor?: string;
  heading: string;
  leftTitle: string;
  leftItems: RichItem[];
  rightTitle: string;
  rightItems: RichItem[];
}

export interface ImpactCalloutBlock {
  type: "impactCallout";
  anchor?: string;
  heading: string;
  items: RichItem[];
  calloutTitle: string;
  calloutItems: RichItem[];
}

export interface ReflectionBlock {
  type: "reflection";
  anchor?: string;
  heading: string;
  paragraphs: RichItem[];
  learningsTitle: string;
  learnings: RichItem[];
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
  // Intrinsic dimensions from the media library — reserves layout space (CLS)
  // and lets next/image generate sized variants.
  width?: number;
  height?: number;
}

// ---------- Project (★ core) ----------

export interface MetaPair {
  label: string;
  value: string;
}

// Encrypted sections of a password-locked project: AES-256-GCM ciphertext
// (auth tag appended), key derived from the password via PBKDF2-SHA256.
// Produced at build time (lib/lock.ts), decrypted in the browser (ProjectLock).
export interface ProjectLockBox {
  salt: string; // base64
  iv: string; // base64
  data: string; // base64 ciphertext + GCM auth tag
  iterations: number;
}

export interface Project {
  // Card fields (homepage grid)
  id: string;
  slug: string;
  title: string;
  category: string;
  year: string;
  tags?: string[]; // pills on the work-list row (data layer always yields an array)
  thumbnail: string; // uploaded thumbnail URL, or "" to show the neutral placeholder
  featured: boolean;
  order: number;

  // Detail header
  summary: string;
  metaGrid: MetaPair[];
  heroImage: ImageRef;

  // Detail body. For locked projects, sections is empty and lock carries the
  // encrypted payload instead — the raw content never reaches the page.
  sections: SectionBlock[];
  lock?: ProjectLockBox;

  // Meta
  status: "draft" | "published";
  nextProjectSlug?: string;
  updatedAt?: string; // ISO timestamp from the CMS — sitemap lastmod / JSON-LD
}
