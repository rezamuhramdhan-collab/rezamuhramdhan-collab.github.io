import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Crawling stays allowed on both deployments — the secondary (Pages) copy
// relies on per-page noindex + cross-domain canonicals, which crawlers can
// only see if they're allowed to fetch the pages. Admin/API are excluded
// (those routes only exist on Vercel).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
