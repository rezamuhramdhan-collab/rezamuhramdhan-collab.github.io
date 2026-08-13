// Point the nav Resume button at the download mark and strip the arrow from the
// hero's primary CTA. The hero's secondary CTA drew its arrow in the component,
// not from data, so removing it needed no database change.
//
//   # inspect only — prints what would change, writes nothing
//   DATABASE_URI=postgres://... PAYLOAD_SECRET=... npx tsx scripts/update-cta-icons.mts
//
//   # apply
//   DATABASE_URI=postgres://... PAYLOAD_SECRET=... npx tsx scripts/update-cta-icons.mts --apply
//
// Idempotent: each icon is written only when it differs. Groups are written back
// whole (spread over the current value) because a partial group update would
// blank the sibling fields.

process.env.SKIP_SEED = "1";

const APPLY = process.argv.includes("--apply");

if (!process.env.DATABASE_URI) {
  console.error("DATABASE_URI is required — refusing to guess a target database.");
  process.exit(1);
}

const { getPayload } = await import("payload");
const { default: config } = await import("@payload-config");

const payload = await getPayload({ config });

type Button = { label?: string; icon?: string | null } & Record<string, unknown>;

const changes: string[] = [];

// ---------- site-settings.ctaButton ----------
const settings = (await payload.findGlobal({ slug: "site-settings" })) as { ctaButton?: Button };
const cta = settings.ctaButton;
let settingsPatch: Record<string, unknown> | null = null;

if (!cta) {
  console.error("site-settings has no ctaButton — nothing to point at the download mark.");
} else if (cta.icon !== "download") {
  changes.push(
    `site-settings.ctaButton.icon ("${cta.label}")\n    ${JSON.stringify(cta.icon ?? null)} -> "download"`,
  );
  settingsPatch = { ctaButton: { ...cta, icon: "download" } };
}

// ---------- hero.primaryCta ----------
const hero = (await payload.findGlobal({ slug: "hero" })) as {
  primaryCta?: Button;
  secondaryCta?: Button;
};
const primary = hero.primaryCta;
let heroPatch: Record<string, unknown> | null = null;

if (primary && primary.icon) {
  changes.push(
    `hero.primaryCta.icon ("${primary.label}")\n    ${JSON.stringify(primary.icon)} -> null`,
  );
  heroPatch = { primaryCta: { ...primary, icon: null } };
}

// The secondary CTA's icon field is unused by the renderer, but leaving a value
// there is misleading, so clear it in the same pass when one is set.
const secondary = hero.secondaryCta;
if (secondary && secondary.icon) {
  changes.push(
    `hero.secondaryCta.icon ("${secondary.label}")\n    ${JSON.stringify(secondary.icon)} -> null`,
  );
  heroPatch = { ...(heroPatch ?? {}), secondaryCta: { ...secondary, icon: null } };
}

if (!changes.length) {
  console.log("Nothing to change — the CTA icons already match.");
  process.exit(0);
}

console.log(`\n${APPLY ? "Applying" : "Would apply"} ${changes.length} change(s):\n`);
for (const c of changes) console.log(`  ${c}`);

if (!APPLY) {
  console.log("\nDry run — nothing written. Re-run with --apply to commit these.");
  process.exit(0);
}

if (settingsPatch) {
  await payload.updateGlobal({ slug: "site-settings", data: settingsPatch as never });
}
if (heroPatch) {
  await payload.updateGlobal({ slug: "hero", data: heroPatch as never });
}

console.log("\nDone. Rebuild Pages and redeploy Vercel to publish the change.");
process.exit(0);
