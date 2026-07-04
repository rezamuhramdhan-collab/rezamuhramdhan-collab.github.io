import path from "path";
import { fileURLToPath } from "url";
import { buildConfig, type Field, type Block } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { seed } from "./lib/seed";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------- Reusable field groups ----------

const textArray = (name: string, opts: { label?: string; required?: boolean } = {}): Field => ({
  name,
  type: "array",
  label: opts.label,
  fields: [{ name: "text", type: "textarea", required: true }],
  ...(opts.required ? { minRows: 1 } : {}),
});

const linkFields: Field[] = [
  { name: "label", type: "text", required: true },
  { name: "href", type: "text", required: true },
];

const buttonFields: Field[] = [
  ...linkFields,
  {
    name: "variant",
    type: "select",
    options: ["dark", "outline"],
    defaultValue: "dark",
    required: true,
  },
  { name: "icon", type: "select", options: ["arrow", "whatsapp", "email"] },
  { name: "download", type: "checkbox", defaultValue: false },
];

// Image slot: uploaded media wins; otherwise the neutral placeholder renders
// while showPlaceholder is on (case studies stay presentable without assets).
const imageSlot = (name = "image"): Field => ({
  name,
  type: "group",
  fields: [
    { name: "media", type: "upload", relationTo: "media" },
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

// ---------- Case study section blocks (PRD §4.3) ----------

const blocks: Block[] = [
  {
    slug: "richText",
    fields: [
      anchorField,
      { name: "heading", type: "text" },
      textArray("paragraphs", { required: true }),
      textArray("items", { label: "Arrow list (optional)" }),
      textArray("closingParagraphs", { label: "Closing paragraphs (optional)" }),
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
      imageSlot(),
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
      imageSlot(),
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
    fields: [anchorField, imageSlot()],
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

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "dev-secret-change-me",
  db: sqliteAdapter({
    client: {
      // Hosted (Turso/libSQL) when DATABASE_URI is set; local file otherwise.
      url: process.env.DATABASE_URI || `file:${path.resolve(dirname, "payload.db")}`,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  }),
  editor: lexicalEditor(),
  admin: { user: "users" },
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },

  // Uploads persist to Vercel Blob when the token is present (hosted);
  // locally they fall back to the media/ directory on disk.
  plugins: process.env.BLOB_READ_WRITE_TOKEN
    ? [
        vercelBlobStorage({
          collections: { media: true },
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
          options: ["pen", "grid", "bulb"],
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
        { name: "description", type: "textarea" },
        { name: "isCurrent", type: "checkbox", defaultValue: false },
      ],
    },
    {
      slug: "projects",
      access: publicRead,
      orderable: true,
      versions: { drafts: true },
      admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "category", "year", "featured", "_status"],
      },
      hooks: { afterChange: [revalidateSite], afterDelete: [revalidateSite] },
      fields: [
        // Card fields (homepage grid)
        { name: "title", type: "text", required: true },
        { name: "slug", type: "text", required: true, unique: true, index: true },
        { name: "category", type: "text", required: true },
        { name: "year", type: "text", required: true },
        {
          name: "thumbnail",
          type: "group",
          fields: [
            { name: "media", type: "upload", relationTo: "media" },
            {
              name: "placeholderKey",
              type: "select",
              options: ["bank-saqu", "banking-app", "saas-wireframes", "design-system", "banking-homepage"],
              admin: { description: "Built-in placeholder art used until media is uploaded" },
            },
          ],
        },
        { name: "featured", type: "checkbox", defaultValue: true },

        // Detail header
        { name: "summary", type: "textarea", required: true },
        {
          name: "metaGrid",
          type: "array",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "value", type: "text", required: true },
          ],
        },
        imageSlot("heroImage"),

        // Detail body — ordered, typed section blocks
        { name: "sections", type: "blocks", blocks },

        // Meta
        { name: "nextProjectSlug", type: "text" },
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
              options: ["linkedin", "instagram", "email"],
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
