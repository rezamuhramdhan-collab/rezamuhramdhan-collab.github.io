import Link from "next/link";
import type { Project, SiteSettings } from "@/content/types";
import { Btn } from "../shared";
import { ArrowLeft, ArrowRight as ArrowRightSmall } from "../icons";
import { Placeholder } from "./images";
import { CaseSections } from "./sections";
import { ProjectLock } from "./ProjectLock";

// Case-study page assembly: tab nav, header, and shell. Section grouping and
// block presentation live in sections.tsx / blocks.tsx / images.tsx /
// rich-text.tsx; password-locked projects render through ProjectLock.

// ---------- Case study page ----------

export function CaseNav({
  anchors,
  backLink,
}: {
  anchors: string[];
  backLink: SiteSettings["backLink"];
}) {
  return (
    <nav>
      <div className="container nav-inner">
        <Link className="back-link" href={backLink.href}>
          <ArrowLeft />
          {backLink.label}
        </Link>
        <div className="nav-links">
          {anchors.map((anchor) => (
            <a key={anchor} href={`#${anchor}`} style={{ textTransform: "capitalize" }}>
              {anchor}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export function CaseStudy({
  project,
  settings,
  nextProject,
}: {
  project: Project;
  settings: SiteSettings;
  nextProject?: Project;
}) {
  const { ctaFooter } = settings;
  // Tab nav auto-derived from anchored blocks (PRD §6)
  const anchors = project.sections
    .map((s) => s.anchor)
    .filter((anchor): anchor is string => Boolean(anchor));

  return (
    <>
      <CaseNav anchors={anchors} backLink={settings.backLink} />

      <header className="case-header">
        <div className="container">
          <h1>{project.title}</h1>
          <p className="lede">{project.summary}</p>
          {project.metaGrid.length > 0 && (
            <div className="meta-grid">
              {project.metaGrid.map((pair) => (
                <div key={pair.label} className="meta-cell">
                  <div className="meta-label">{pair.label}</div>
                  <div className="meta-value">{pair.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="container">
        {/* Above the fold — the LCP element on case pages */}
        <Placeholder image={project.heroImage} tall priority />
      </div>

      {project.lock ? (
        <ProjectLock slug={project.slug} lock={project.lock} />
      ) : (
        <CaseSections sections={project.sections} />
      )}

      <section className="case-cta">
        <div className="container" data-reveal>
          <h2>{ctaFooter.headline}</h2>
          <p>{ctaFooter.subtext}</p>
          <div className="cta-row">
            <Btn button={ctaFooter.button} />
            {nextProject && (
              <Link className="btn btn-outline" href={`/work/${nextProject.slug}`}>
                Next Project: {nextProject.title}
                <ArrowRightSmall />
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
