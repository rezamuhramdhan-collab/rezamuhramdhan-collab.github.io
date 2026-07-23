import Link from "next/link";
import type { Project, SiteSettings } from "@/content/types";
import { ArrowBack, ArrowUpRight } from "../icons";
import { CaseImage } from "./images";
import { CaseSections } from "./sections";
import { ProjectLock } from "./ProjectLock";
import { CaseNav } from "./CaseNav";

// Case-study page assembly (v2): sticky tab-nav, kicker header, meta grid, and
// footer CTA. Section grouping / block presentation live in sections.tsx,
// blocks.tsx, images.tsx, rich-text.tsx; locked projects render via ProjectLock.

export function CaseStudy({
  project,
  settings,
  nextProject,
  caseNumber,
}: {
  project: Project;
  settings: SiteSettings;
  nextProject?: Project;
  caseNumber?: number;
}) {
  const { ctaFooter, backLink } = settings;
  const anchors = project.sections
    .map((s) => s.anchor)
    .filter((anchor): anchor is string => Boolean(anchor));

  return (
    <div className="case">
      <div className="topbar">
        <div className="topbar-inner">
          <Link className="back-link" href={backLink.href}>
            <ArrowBack />
            {backLink.label}
          </Link>
          <CaseNav anchors={anchors} />
          <span />
        </div>
      </div>

      <div className="frame">
        <header className="case-header">
          <div className="kicker">
            {caseNumber != null && (
              <>
                <span className="num">{String(caseNumber).padStart(2, "0")}</span>
                <span className="sep" />
              </>
            )}
            {project.category && <span className="cat">{project.category}</span>}
          </div>
          <h1>{project.title}</h1>
          <p className="subtitle">{project.summary}</p>
          {project.metaGrid.length > 0 && (
            <div className="meta-grid">
              {project.metaGrid.map((pair) => (
                <div key={pair.label} className="cell">
                  <div className="m-label">{pair.label}</div>
                  <div className="m-value">{pair.value}</div>
                </div>
              ))}
            </div>
          )}
        </header>

        {/* Above the fold — the LCP element on case pages */}
        <CaseImage image={project.heroImage} hero priority />

        {project.lock ? (
          <div className="lock-wrap">
            <ProjectLock slug={project.slug} lock={project.lock} />
          </div>
        ) : (
          <CaseSections sections={project.sections} />
        )}
      </div>

      <div className="foot-cta">
        <div className="foot-cta-inner">
          <div>
            <span className="eyebrow">{ctaFooter.headline}</span>
            <h2>{ctaFooter.subtext}</h2>
          </div>
          <div className="links">
            <Link className="all-work" href="/#work">
              <ArrowBack />
              All Work
            </Link>
            <Link
              className="btn btn-accent"
              href={nextProject ? `/work/${nextProject.slug}` : ctaFooter.button.href}
            >
              {nextProject ? "Next Project" : ctaFooter.button.label}
              <ArrowUpRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
