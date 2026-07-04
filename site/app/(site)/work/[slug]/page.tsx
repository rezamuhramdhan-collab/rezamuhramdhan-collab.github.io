import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getPublishedProjects, getProjectBySlug, getSiteSettings } from "@/lib/data";
import { CaseStudy } from "@/components/case/CaseStudy";

// Case study route: /work/[slug] (PRD §6). Published projects are statically
// generated; drafts render only via Next draft mode (preview).

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
  return {
    title: `${project.title} — Reza Ramdhan`,
    description: project.summary,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { isEnabled: isDraftMode } = await draftMode();
  const project = await getProjectBySlug(slug, isDraftMode);

  if (!project || (project.status === "draft" && !isDraftMode)) {
    notFound();
  }

  const settings = await getSiteSettings();
  return <CaseStudy project={project} settings={settings} />;
}
