// Populate the fields the v3 "Paper Swiss" redesign introduced, for a database
// whose content predates it. Without this the hero renders with no social row
// and no secondary CTA, because those fields exist in the schema but are empty.
//
//   # inspect only — prints what would change, writes nothing
//   DATABASE_URI=postgres://... PAYLOAD_SECRET=... npx tsx scripts/fill-v3-fields.mts
//
//   # apply
//   DATABASE_URI=postgres://... PAYLOAD_SECRET=... npx tsx scripts/fill-v3-fields.mts --apply
//
// Idempotent and non-destructive: every field is written only when it is
// currently empty, so re-running is a no-op and nothing you have edited in the
// admin is ever overwritten. Run `scripts/push-schema.mts` first — `about.subheading`
// is a new column and will not exist until the schema is pushed.

process.env.SKIP_SEED = "1";

const APPLY = process.argv.includes("--apply");

if (!process.env.DATABASE_URI) {
  console.error("DATABASE_URI is required — refusing to guess a target database.");
  process.exit(1);
}

const { getPayload } = await import("payload");
const { default: config } = await import("@payload-config");

const payload = await getPayload({ config });

const isBlank = (v: unknown) => v === null || v === undefined || v === "";

type Change = { path: string; from: unknown; to: unknown };
const changes: Change[] = [];
const warnings: string[] = [];
const note = (path: string, from: unknown, to: unknown) => changes.push({ path, from, to });

// ---------- hero ----------
const hero = await payload.findGlobal({ slug: "hero" });
const heroPatch: Record<string, unknown> = {};

// Ghost button beside the primary CTA. Points at the Approach strip, whose
// section id stays "services" because the CMS nav links target /#services.
if (isBlank(hero.secondaryCta?.label)) {
  heroPatch.secondaryCta = { label: "How I work", href: "/#services", variant: "outline" };
  note("hero.secondaryCta", hero.secondaryCta?.label ?? null, "How I work");
}

// Icon buttons under the CTAs. Seeded from the contact section's social links
// so the two stay consistent; `platform` picks the icon.
if (!hero.socialLinks?.length) {
  const contact = await payload.findGlobal({ slug: "contact" });
  const platformOf = (label: string, href: string) => {
    const s = `${label} ${href}`.toLowerCase();
    if (s.includes("linked")) return "linkedin";
    if (s.includes("insta")) return "instagram";
    if (s.includes("whats") || s.includes("wa.me")) return "whatsapp";
    if (s.includes("mail")) return "email";
    return undefined;
  };
  const links = (contact.socialLinks ?? [])
    .filter((s: { label?: string | null; href?: string | null }) => s.label && s.href)
    .slice(0, 3)
    .map((s: { label?: string | null; href?: string | null }) => ({
      label: s.label!,
      href: s.href!,
      platform: platformOf(s.label!, s.href!),
    }));
  if (links.length) {
    heroPatch.socialLinks = links;
    note("hero.socialLinks", "(empty)", links.map((l) => l.platform ?? l.label).join(", "));
  } else {
    warnings.push(
      "hero.socialLinks is empty and contact.socialLinks has nothing to copy from — " +
        "the hero will render without its social row. Add them in the admin (Hero → Social Links).",
    );
  }
}

// ---------- about ----------
const about = await payload.findGlobal({ slug: "about" });
const aboutPatch: Record<string, unknown> = {};

// The large display line beside the portrait. v1 split one sentence across
// `headline` + `headlineAccent`; if that legacy pair is still present, reuse it
// rather than inventing copy.
if (isBlank((about as { subheading?: string }).subheading)) {
  const legacy = [about.headline, (about as { headlineAccent?: string }).headlineAccent]
    .filter((x) => x && x !== "About")
    .join(" ")
    .trim();
  if (legacy) {
    aboutPatch.subheading = legacy;
    note("about.subheading", "(empty)", legacy);
    if (about.headline !== "About") {
      aboutPatch.headline = "About";
      note("about.headline", about.headline, "About (the long line moves to subheading)");
    }
  }
}

// ---------- services ----------
// Icon tile per Approach cell. Assigned by position, matching the code's own
// fallback order, so the rendered result is identical either way.
const ICONS = ["search", "layers", "code", "chart"] as const;
const { docs: services } = await payload.find({ collection: "services", sort: "_order", limit: 100 });
const servicePatches: Array<{ id: string | number; icon: string; title: string }> = [];
services.forEach((doc: { id: string | number; title: string; icon?: string | null }, i: number) => {
  if (isBlank(doc.icon)) {
    const icon = ICONS[i % ICONS.length];
    servicePatches.push({ id: doc.id, icon, title: doc.title });
    note(`services["${doc.title}"].icon`, null, icon);
  }
});

// ---------- report / apply ----------
const reportWarnings = () => {
  for (const w of warnings) console.warn(`\n  ! ${w}`);
};

if (!changes.length) {
  console.log("Nothing to fill — every v3 field already has a value.");
  reportWarnings();
  process.exit(0);
}

console.log(`\n${APPLY ? "Applying" : "Would apply"} ${changes.length} change(s):\n`);
for (const c of changes) console.log(`  ${c.path}\n    ${JSON.stringify(c.from)} -> ${JSON.stringify(c.to)}`);

reportWarnings();

if (!APPLY) {
  console.log("\nDry run — nothing written. Re-run with --apply to commit these.");
  process.exit(0);
}

if (Object.keys(heroPatch).length) {
  await payload.updateGlobal({ slug: "hero", data: heroPatch });
}
if (Object.keys(aboutPatch).length) {
  await payload.updateGlobal({ slug: "about", data: aboutPatch });
}
for (const s of servicePatches) {
  await payload.update({ collection: "services", id: s.id, data: { icon: s.icon } });
}

console.log("\nDone. Rebuild Pages (or re-run the deploy workflow) to publish the change.");
process.exit(0);
