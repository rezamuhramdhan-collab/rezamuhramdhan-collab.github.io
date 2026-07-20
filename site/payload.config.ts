import path from "path";
import { fileURLToPath } from "url";
import { buildConfig, type Field, type Block } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { seed } from "./lib/seed";
import { hasLexical } from "./lib/lexical";
import {
  serviceIconKeys,
  buttonIconKeys,
  socialPlatformKeys,
  thumbnailKeys,
} from "./content/registry";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------- Reusable field groups ----------

// Each item has a legacy plain-text field plus a rich-text editor. The editor
// wins when used; the plain field is hidden once the editor has content or when
// there's no legacy text. (Editor is defined last so the DB change stays purely
// additive — a column reorder would force a fragile SQLite table rebuild.)
const textArray = (
  name: string,
  opts: { label?: string; required?: boolean; admin?: Record<string, unknown> } = {},
): Field => ({
  name,
  type: "array",
  label: opts.label,
  fields: [
    {
      name: "text",
      type: "textarea",
      admin: {
        description: "Plain text — used if the editor below is empty",
        condition: (_: unknown, s: { text?: string; content?: unknown }) =>
          Boolean(s?.text) && !hasLexical(s?.content),
      },
    },
    { name: "content", type: "richText" },
  ],
  ...(opts.required ? { minRows: 1 } : {}),
  ...(opts.admin ? { admin: opts.admin } : {}),
});

const linkFields: Field[] = [
  { name: "label", type: "text", required: true },
  { name: "href", type: "text", required: true },
];

const buttonFields: Field[] = [
  ...linkFields,
  {
    name: "file",
    type: "upload",
    relationTo: "media",
    admin: {
      description: "Optional file (e.g. résumé PDF). Overrides the link URL when set.",
    },
  },
  {
    name: "variant",
    type: "select",
    options: ["dark", "outline"],
    defaultValue: "dark",
    required: true,
  },
  { name: "icon", type: "select", options: [...buttonIconKeys] },
  { name: "download", type: "checkbox", defaultValue: false },
];

// Image slot: uploaded media wins; otherwise the neutral placeholder renders
// while showPlaceholder is on (case studies stay presentable without assets).
// With `requireImage`, publishing demands an upload or the placeholder.
const imageSlot = (name = "image", opts: { requireImage?: boolean } = {}): Field => ({
  name,
  type: "group",
  fields: [
    {
      name: "media",
      type: "upload",
      relationTo: "media",
      ...(opts.requireImage
        ? {
            validate: (value: unknown, { siblingData }: { siblingData?: { showPlaceholder?: boolean } }) =>
              Boolean(value || siblingData?.showPlaceholder) ||
              "Upload an image (or keep the placeholder enabled)",
          }
        : {}),
    },
    { name: "alt", type: "text" },
    { name: "caption", type: "text" },
    { name: "showPlaceholder", type: "checkbox", defaultValue: true },
  ],
});

const anchorField: Field = {
  name: "anchor",
  type: "text",
  admin: { description: "Optional section anchor (used by the case-study tab nav)" },
};

// URL-safe slug: lowercase, hyphens, no leading/trailing dashes.
const slugify = (value: string): string =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Multi-image slot: add/remove/reorder any number of images per section.
const imagesField: Field = {
  name: "images",
  type: "array",
  fields: [
    { name: "media", type: "upload", relationTo: "media" },
    { name: "alt", type: "text" },
    { name: "caption", type: "text" },
    { name: "showPlaceholder", type: "checkbox", defaultValue: true },
  ],
};

const imageLayoutField: Field = {
  name: "imageLayout",
  type: "select",
  options: ["full", "left", "right", "grid"],
  defaultValue: "full",
  admin: {
    description:
      "full = stacked full-width · left/right = beside the text · grid = two-up",
  },
};

// ---------- Case study section blocks (PRD §4.3) ----------

const blocks: Block[] = [
  {
    slug: "richText",
    fields: [
      anchorField,
      { name: "heading", type: "text" },
      {
        name: "content",
        type: "richText",
        admin: { description: "Formatted text — bold, italic, headings, lists, links" },
      },
      // Legacy plain-text fields — used only when the editor above is empty.
      textArray("paragraphs", {
        label: "Paragraphs (legacy — used if the editor above is empty)",
        admin: { condition: (_: unknown, s: { content?: unknown }) => !hasLexical(s?.content) },
      }),
      textArray("items", {
        label: "Arrow list (legacy)",
        admin: { condition: (_: unknown, s: { content?: unknown }) => !hasLexical(s?.content) },
      }),
      textArray("closingParagraphs", {
        label: "Closing paragraphs (legacy)",
        admin: { condition: (_: unknown, s: { content?: unknown }) => !hasLexical(s?.content) },
      }),
      imagesField,
      imageLayoutField,
    ],
  },
  {
    slug: "bulletList",
    fields: [
      anchorField,
      { name: "heading", type: "text" },
      { name: "intro", type: "textarea" },
      {
        name: "style",
        type: "select",
        options: ["bullet", "check", "arrow"],
        defaultValue: "arrow",
        required: true,
      },
      textArray("items", { required: true }),
      imagesField,
      imageLayoutField,
    ],
  },
  {
    slug: "hmwGrid",
    fields: [
      anchorField,
      { name: "heading", type: "text", defaultValue: "How Might We", required: true },
      textArray("cards", { required: true }),
    ],
  },
  {
    slug: "stepBlock",
    fields: [
      anchorField,
      {
        name: "sectionHeading",
        type: "text",
        admin: { description: "Heading for the step group (set on the first step only)" },
      },
      { name: "stepNumber", type: "number", required: true },
      { name: "title", type: "text", required: true },
      { name: "description", type: "textarea" },
      textArray("bullets"),
      imagesField,
      imageLayoutField,
    ],
  },
  {
    slug: "twoColumn",
    fields: [
      anchorField,
      { name: "heading", type: "text", required: true },
      { name: "leftTitle", type: "text", required: true },
      textArray("leftItems", { required: true }),
      { name: "rightTitle", type: "text", required: true },
      textArray("rightItems", { required: true }),
      imagesField,
      imageLayoutField,
    ],
  },
  {
    slug: "impactCallout",
    fields: [
      anchorField,
      { name: "heading", type: "text", required: true },
      textArray("items", { required: true }),
      { name: "calloutTitle", type: "text", required: true },
      textArray("calloutItems", { required: true }),
    ],
  },
  {
    slug: "reflection",
    fields: [
      anchorField,
      { name: "heading", type: "text", required: true },
      textArray("paragraphs", { required: true }),
      { name: "learningsTitle", type: "text", defaultValue: "Key learnings:" },
      textArray("learnings", { required: true }),
      { name: "pullQuoteText", type: "text" },
      { name: "pullQuoteAccent", type: "text" },
    ],
  },
  {
    slug: "image",
    labels: { singular: "Image Gallery", plural: "Image Galleries" },
    fields: [
      anchorField,
      imagesField,
      {
        name: "imageLayout",
        type: "select",
        options: ["full", "grid", "grid3"],
        defaultValue: "full",
        admin: { description: "full = stacked full-width · grid = 2 columns · grid3 = 3 columns" },
      },
    ],
  },
];

// ---------- Revalidation (publish → live without redeploy, PRD §6) ----------

const revalidateSite = () => {
  // Deferred import: next/cache isn't available during CLI/seed contexts.
  import("next/cache")
    .then(({ revalidatePath }) => {
      revalidatePath("/", "layout");
    })
    .catch(() => {});
};

const publicRead = { read: () => true };

// ---------- Config ----------

if (!process.env.PAYLOAD_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("PAYLOAD_SECRET is required in production");
}

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "dev-secret-change-me",
  // Hosted (Supabase Postgres) when DATABASE_URI is a postgres:// URI; local
  // SQLite file otherwise. The libsql branch also still accepts a legacy
  // Turso URL + DATABASE_AUTH_TOKEN so the export half of the Supabase
  // migration (scripts/export-content.mts) can read the old database.
  db: process.env.DATABASE_URI?.startsWith("postgres")
    ? postgresAdapter({
        pool: { connectionString: process.env.DATABASE_URI },
      })
    : sqliteAdapter({
        client: {
          url: process.env.DATABASE_URI || `file:${path.resolve(dirname, "payload.db")}`,
          authToken: process.env.DATABASE_AUTH_TOKEN,
        },
      }),
  editor: lexicalEditor(),
  admin: { user: "users" },
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },

  // Uploads persist to Vercel Blob when the token is present (hosted);
  // locally they fall back to the media/ directory on disk.
  // disablePayloadAccessControl: media is public-read, and it makes doc URLs
  // point directly at the blob CDN — required for the static Pages build,
  // where the /api/media/file/... proxy route doesn't exist.
  plugins: process.env.BLOB_READ_WRITE_TOKEN
    ? [
        vercelBlobStorage({
          collections: { media: { disablePayloadAccessControl: true } },
          token: process.env.BLOB_READ_WRITE_TOKEN,
        }),
      ]
    : [],

  collections: [
    {
      slug: "users",
      auth: true,
      admin: { useAsTitle: "email" },
      fields: [],
    },
    {
      slug: "media",
      access: publicRead,
      upload: { staticDir: path.resolve(dirname, "media") },
      fields: [{ name: "alt", type: "text" }],
    },
    {
      slug: "categories",
      labels: { singular: "Category", plural: "Categories" },
      access: publicRead,
      admin: { useAsTitle: "name" },
      hooks: { afterChange: [revalidateSite], afterDelete: [revalidateSite] },
      fields: [{ name: "name", type: "text", required: true, unique: true }],
    },
    {
      slug: "services",
      labels: { singular: "Service", plural: "What I Do" },
      access: publicRead,
      orderable: true,
      admin: { useAsTitle: "title" },
      hooks: { afterChange: [revalidateSite], afterDelete: [revalidateSite] },
      fields: [
        {
          name: "icon",
          type: "select",
          options: [...serviceIconKeys],
          defaultValue: "pen",
          required: true,
        },
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
      ],
    },
    {
      slug: "experience",
      labels: { singular: "Experience Entry", plural: "Experience" },
      access: publicRead,
      orderable: true,
      admin: { useAsTitle: "role" },
      hooks: { afterChange: [revalidateSite], afterDelete: [revalidateSite] },
      fields: [
        { name: "period", type: "text", required: true },
        { name: "role", type: "text", required: true },
        { name: "company", type: "text", required: true },
        { name: "companyLink", type: "text", defaultValue: "#" },
        // Legacy plain text — used only while the editor below is empty
        // (same convention as textArray / the richText block).
        {
          name: "description",
          type: "textarea",
          admin: {
            description: "Plain text — used if the editor below is empty",
            condition: (data: { description?: string; content?: unknown }) =>
              Boolean(data?.description) && !hasLexical(data?.content),
          },
        },
        {
          name: "content",
          type: "richText",
          label: "Description (rich text)",
          admin: { description: "Formatted description — bold, italic, links, lists" },
        },
        { name: "isCurrent", type: "checkbox", defaultValue: false },
      ],
    },
    {
      slug: "projects",
      // Anonymous API readers only see published docs; drafts require auth.
      access: {
        read: ({ req }) => (req.user ? true : { _status: { equals: "published" } }),
      },
      orderable: true,
      versions: { drafts: true },
      admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "category", "year", "featured", "position", "_status"],
      },
      hooks: { afterChange: [revalidateSite], afterDelete: [revalidateSite] },
      fields: [
        {
          // Layout-only tabs (no name = no data shape change).
          type: "tabs",
          tabs: [
            {
              label: "Required Info",
              description:
                "Everything mandatory in one place — fill this tab and the project is publishable.",
              fields: [
                { name: "title", type: "text", required: true },
                {
                  name: "slug",
                  type: "text",
                  required: true,
                  unique: true,
                  index: true,
                  admin: {
                    description:
                      "URL path (/work/<slug>) — auto-formatted from the title if left empty",
                  },
                  hooks: {
                    beforeValidate: [
                      ({ value, data }) => slugify(String(value || data?.title || "")),
                    ],
                  },
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "category",
                      type: "relationship",
                      relationTo: "categories",
                      required: true,
                      admin: {
                        width: "50%",
                        description: "Pick a category or create a new one from here",
                      },
                    },
                    { name: "year", type: "text", required: true, admin: { width: "50%" } },
                  ],
                },
                { name: "summary", type: "textarea", required: true },
                {
                  name: "meta",
                  label: "Project Details",
                  type: "group",
                  fields: [
                    {
                      type: "row",
                      fields: [
                        { name: "role", type: "text", required: true, admin: { width: "50%" } },
                        { name: "scope", type: "text", required: true, admin: { width: "50%" } },
                      ],
                    },
                    {
                      type: "row",
                      fields: [
                        { name: "platform", type: "text", required: true, admin: { width: "50%" } },
                        { name: "timeline", type: "text", required: true, admin: { width: "50%" } },
                      ],
                    },
                  ],
                },
                {
                  name: "thumbnail",
                  label: "Thumbnail (homepage card)",
                  type: "group",
                  fields: [
                    {
                      name: "media",
                      type: "upload",
                      relationTo: "media",
                      validate: (
                        value: unknown,
                        { siblingData }: { siblingData?: { placeholderKey?: string } },
                      ) =>
                        Boolean(value || siblingData?.placeholderKey) ||
                        "Upload a thumbnail image (or pick a placeholder)",
                    },
                    {
                      name: "placeholderKey",
                      type: "select",
                      options: [...thumbnailKeys],
                      admin: { description: "Built-in placeholder art used until media is uploaded" },
                    },
                  ],
                },
                imageSlot("heroImage", { requireImage: true }),
              ],
            },
            {
              label: "Case Study Sections",
              description: "The detail page body — add, reorder, and lay out sections freely",
              fields: [
                {
                  name: "sections",
                  type: "blocks",
                  blocks,
                  // Locked projects: anonymous API readers never see the raw
                  // sections (the site serves them encrypted; see lib/data.ts).
                  access: {
                    read: ({ req, doc }) => Boolean(req.user) || !doc?.locked,
                  },
                },
              ],
            },
            {
              label: "Settings",
              fields: [
                {
                  name: "featured",
                  type: "checkbox",
                  defaultValue: true,
                  admin: { description: "Show on the homepage Featured Work grid" },
                },
                {
                  name: "position",
                  type: "number",
                  min: 1,
                  admin: {
                    description:
                      "Position in the Featured Work grid (1 = first). Projects without a number come after, in list drag order.",
                  },
                },
                {
                  name: "nextProjectSlug",
                  type: "text",
                  admin: { description: "Related-project link (auto-picks the next one if empty)" },
                },
                {
                  name: "locked",
                  type: "checkbox",
                  defaultValue: false,
                  admin: {
                    description:
                      "Password-protect this case study — visitors must enter the password to read the sections",
                  },
                },
                {
                  name: "password",
                  type: "text",
                  // Never exposed to anonymous API readers; the build reads it
                  // via the local API (overrideAccess) to encrypt the sections.
                  access: { read: ({ req }) => Boolean(req.user) },
                  validate: (
                    value: unknown,
                    { siblingData }: { siblingData?: { locked?: boolean } },
                  ) =>
                    !siblingData?.locked || Boolean(value) || "Set a password (or turn off the lock)",
                  admin: {
                    condition: (data: { locked?: boolean }) => Boolean(data?.locked),
                    description: "The password visitors must enter",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  globals: [
    {
      slug: "site-settings",
      access: publicRead,
      hooks: { afterChange: [revalidateSite] },
      fields: [
        { name: "logoText", type: "text", required: true },
        {
          name: "logoImage",
          type: "upload",
          relationTo: "media",
          admin: { description: "Replaces the text logo in the header when set" },
        },
        {
          name: "favicon",
          type: "upload",
          relationTo: "media",
          admin: { description: "Browser tab icon (PNG/SVG/ICO, ideally square)" },
        },
        { name: "navLinks", type: "array", fields: linkFields },
        { name: "ctaButton", type: "group", fields: buttonFields },
        { name: "footerText", type: "text" },
        { name: "footerLinks", type: "array", fields: linkFields },
        { name: "backLink", type: "group", fields: linkFields },
        {
          name: "ctaFooter",
          type: "group",
          fields: [
            { name: "headline", type: "text" },
            { name: "subtext", type: "text" },
            { name: "button", type: "group", fields: buttonFields },
          ],
        },
      ],
    },
    {
      slug: "hero",
      access: publicRead,
      hooks: { afterChange: [revalidateSite] },
      fields: [
        { name: "greeting", type: "text", required: true },
        { name: "roleHighlight", type: "text", required: true },
        { name: "bio", type: "textarea" },
        { name: "primaryCta", type: "group", fields: buttonFields },
        { name: "secondaryCta", type: "group", fields: buttonFields },
        {
          name: "socialLinks",
          type: "array",
          fields: [
            {
              name: "platform",
              type: "select",
              options: [...socialPlatformKeys],
              required: true,
            },
            { name: "href", type: "text", required: true },
            { name: "label", type: "text", required: true },
          ],
        },
        imageSlot("portrait"),
        {
          name: "profileCard",
          type: "group",
          fields: [
            { name: "name", type: "text" },
            { name: "subtitle", type: "text" },
            { name: "avatarInitial", type: "text" },
          ],
        },
      ],
    },
    {
      slug: "about",
      access: publicRead,
      hooks: { afterChange: [revalidateSite] },
      fields: [
        { name: "headline", type: "text", required: true },
        { name: "headlineAccent", type: "text" },
        textArray("paragraphs"),
        {
          name: "yearsExperience",
          type: "number",
          admin: { description: "Replaces {years} in paragraphs" },
        },
      ],
    },
    {
      slug: "cta",
      access: publicRead,
      hooks: { afterChange: [revalidateSite] },
      fields: [
        { name: "headline", type: "text", required: true },
        { name: "headlineAccent", type: "text" },
        { name: "subtext", type: "textarea" },
        { name: "buttons", type: "array", fields: buttonFields },
      ],
    },
  ],

  onInit: seed,
});
