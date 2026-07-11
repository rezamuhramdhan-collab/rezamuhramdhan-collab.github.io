import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

// Generated at build time on both deployments; URLs always point at the
// canonical (Vercel) domain so either copy hands crawlers the same map.
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjects();
  const newest = projects
    .map((p) => p.updatedAt)
    .filter((d): d is string => Boolean(d))
    .sort()
    .pop();

  return [
    {
      url: SITE_URL,
      lastModified: newest ? new Date(newest) : undefined,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects.map((project) => ({
      url: `${SITE_URL}/work/${project.slug}`,
      lastModified: project.updatedAt ? new Date(project.updatedAt) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
