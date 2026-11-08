import Link from "next/link";
import type { Project, SiteSettings } from "@/content/types";
import { ArrowBack, ArrowUpRight } from "../icons";
import { CaseImage } from "./images";
import { CaseSections } from "./sections";
import { ProjectLock } from "./ProjectLock";
import { storyHighlights } from "@/lib/case-story";

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
  const highlights = storyHighlights(project);

  return (
    <main className="case" id="main-content">
      <div className="topbar">
        <div className="topbar-inner">
          <Link className="back-link" href={backLink.href}>
            <ArrowBack />
            {backLink.label}
          </Link>
          <span className="topbar-project">{project.title}</span>
          <Link className="topbar-contact" href="/#contact">Let’s talk</Link>
        </div>
      </div>

      <div className="frame">
        <header className="case-header" id="case-top">
          <p className="chapter-label"><span>A fragment, remembered</span><span className="chapter-thread" aria-hidden="true" /><span>Case study</span></p>
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
          <p className="case-story-note">First, the question. Then, the choices that followed.</p>
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
        {project.heroImage.src && project.heroImage.src !== "placeholder" && <CaseImage image={project.heroImage} hero priority />}

        {highlights.length > 0 && <section className="case-brief" aria-labelledby="brief-title">
          <div className="brief-heading"><span className="mono">The short version</span><h2 id="brief-title">At a glance</h2><p>Excerpts from the case study. Follow a link for the full context.</p></div>
          <dl className="brief-points">{highlights.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.text}<a href={`#${item.id}`}>Read the {item.label === "Reported outcome" ? "results" : item.label === "Design response" ? "decisions" : "challenge"}</a></dd></div>)}</dl>
        </section>}

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
            <p className="chapter-label">The thread continues</p>
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
    </main>
  );
}
