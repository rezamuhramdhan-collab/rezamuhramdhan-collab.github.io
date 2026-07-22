// One-time backfill for the v2 "Editorial Dark" redesign. The redesign added
// CMS fields (hero name split, contact block, per-role employment type +
// location, About skills, service tags) that are empty on an already-populated
// database. This idempotently sets them to Reza's real values so the live site
// renders complete right after deploy. Safe to run more than once.
//
//   NODE_ENV=production DATABASE_URI=postgres://... PAYLOAD_SECRET=... \
//     npx tsx scripts/backfill-v2.mts
//
// Omit DATABASE_URI to target the local payload.db (dev verification).

process.env.SKIP_SEED = "1";
import { getPayload } from "payload";
import config from "@payload-config";
import { siteSettings, hero, about, contact } from "../content/site";
import { experience } from "../content/experience";
import { services } from "../content/services";

const payload = await getPayload({ config });

// --- Site settings: v2 structural content (nav gains Experience, wordmark,
// footer links, résumé pill). Preserves any uploaded logoImage/favicon by
// only setting these specific fields. ---
await payload.updateGlobal({
  slug: "site-settings",
  data: {
    logoText: siteSettings.logoText,
    navLinks: siteSettings.navLinks,
    footerText: siteSettings.footerText,
    footerLinks: siteSettings.footerLinks,
    ctaButton: siteSettings.ctaButton,
    backLink: siteSettings.backLink,
    ctaFooter: siteSettings.ctaFooter,
  } as never,
});
console.log("site-settings: nav (with Experience) / footer / wordmark / résumé set");

// --- Hero primary CTA → "View Work" (leaves the user's bio + portrait). ---
await payload.updateGlobal({ slug: "hero", data: { primaryCta: hero.primaryCta } as never });
console.log("hero: primary CTA set");

// --- Hero: fill the new name/eyebrow/tag fields (leave bio/CTA/portrait) ---
await payload.updateGlobal({
  slug: "hero",
  data: {
    eyebrow: hero.eyebrow,
    firstName: hero.firstName,
    lastName: hero.lastName,
    portfolioTag: hero.portfolioTag,
  } as never,
});
console.log("hero: name/eyebrow/tag set");

// --- About: skills grid, location tag, resume button, heading ---
await payload.updateGlobal({
  slug: "about",
  data: {
    headline: about.headline,
    skills: about.skills.map((text) => ({ text })),
    locationTag: about.locationTag,
    resumeButton: about.resumeButton,
  } as never,
});
console.log(`about: ${about.skills.length} skills + location tag set`);

// --- Contact: the whole new global (replaces the old CTA section) ---
await payload.updateGlobal({ slug: "contact", data: contact as never });
console.log("contact: email/location/availability/socials set");

// --- Experience: add employment type + location, matched by company name ---
const { docs: expDocs } = await payload.find({ collection: "experience", limit: 100 });
for (const fixture of experience) {
  const match = expDocs.find((d) => d.company === fixture.company);
  if (!match) {
    console.log(`experience: no live entry for "${fixture.company}" — skipped`);
    continue;
  }
  await payload.update({
    collection: "experience",
    id: match.id,
    data: { employmentType: fixture.employmentType, location: fixture.location } as never,
  });
  console.log(`experience: ${fixture.company} → ${fixture.employmentType} · ${fixture.location}`);
}

// --- Services: attach the tag pills, matched by title ---
const { docs: svcDocs } = await payload.find({ collection: "services", limit: 100 });
for (const fixture of services) {
  if (!fixture.tags.length) continue;
  const match = svcDocs.find((d) => d.title === fixture.title);
  if (!match) continue;
  await payload.update({
    collection: "services",
    id: match.id,
    data: { tags: fixture.tags.map((text) => ({ text })) } as never,
  });
  console.log(`services: ${fixture.title} → ${fixture.tags.length} tags`);
}

console.log("Backfill complete.");
process.exit(0);
