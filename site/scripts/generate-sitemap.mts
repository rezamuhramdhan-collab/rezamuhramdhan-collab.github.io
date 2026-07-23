// Writes public/sitemap.xml at build time (wired via the prebuild script).
// A plain static file instead of a Next metadata route: Search Console's
// sitemap parser repeatedly failed to read the route version, whose responses
// carry Next-specific headers (Vary: RSC..., content-disposition) — a static
// file serves with boring headers everywhere (Vercel and the Pages export).
process.env.SKIP_SEED = "1";

import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getPublishedProjects } from "../lib/data";
import { SITE_URL } from "../lib/seo";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const projects = await getPublishedProjects();
const newest = projects
  .map((p) => p.updatedAt)
  .filter((d): d is string => Boolean(d))
  .sort()
  .pop();

const entry = (loc: string, lastmod: string | undefined, priority: string) =>
  [
    "<url>",
    `<loc>${loc}</loc>`,
    ...(lastmod ? [`<lastmod>${lastmod}</lastmod>`] : []),
    "<changefreq>monthly</changefreq>",
    `<priority>${priority}</priority>`,
    "</url>",
  ].join("\n");

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  entry(SITE_URL, newest, "1"),
  entry(`${SITE_URL}/work`, newest, "0.9"),
  ...projects.map((p) => entry(`${SITE_URL}/work/${p.slug}`, p.updatedAt, "0.8")),
  "</urlset>",
  "",
].join("\n");

writeFileSync(path.resolve(dirname, "../public/sitemap.xml"), xml);
console.log(`sitemap.xml written — ${projects.length + 2} URLs`);
process.exit(0);
