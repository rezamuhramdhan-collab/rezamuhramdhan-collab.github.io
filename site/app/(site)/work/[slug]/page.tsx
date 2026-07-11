import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import {
  getPublishedProjects,
  getProjectBySlug,
  getNextProject,
  getSiteSettings,
  getHero,
} from "@/lib/data";
import { CaseStudy } from "@/components/case/CaseStudy";
import { caseStudyJsonLd, jsonLdString } from "@/lib/seo";

// Case study route: /work/[slug] (PRD §6). Published projects are statically
// generated; new ones render on demand so admin-created projects go live
// without a redeploy. Under STATIC_EXPORT there is no server: only generated
// params exist as files and draft mode is unavailable.

const isStaticExport = Boolean(process.env.STATIC_EXPORT);

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  const title = `${project.title} — Reza Ramdhan`;
  const heroImage = project.heroImage.src.startsWith("http") ? project.heroImage.src : undefined;
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title,
      description: project.summary,
      url: `/work/${project.slug}`,
      ...(heroImage ? { images: [heroImage] } : {}),
    },
    twitter: {
      card: heroImage ? "summary_large_image" : "summary",
      title,
      description: project.summary,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let isDraftMode = false;
  if (!isStaticExport) {
    isDraftMode = (await draftMode()).isEnabled;
  }
  const project = await getProjectBySlug(slug, isDraftMode);

  if (!project || (project.status === "draft" && !isDraftMode)) {
    notFound();
  }

  const [settings, nextProject, hero] = await Promise.all([
    getSiteSettings(),
    getNextProject(project),
    getHero(),
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(caseStudyJsonLd(project, hero.profileCard.name)),
        }}
      />
      <CaseStudy project={project} settings={settings} nextProject={nextProject} />
    </>
  );
}
