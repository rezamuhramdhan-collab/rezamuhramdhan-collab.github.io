import Link from "next/link";
import type { Project, SectionBlock, StepBlock, SiteSettings } from "@/content/types";
import { Btn } from "../shared";
import { ArrowLeft, ArrowRight as ArrowRightSmall } from "../icons";
import { Placeholder } from "./images";
import { BlockBody, StepGroup, type SingleBlock } from "./blocks";

// Case-study page assembly: section grouping, tab nav, header, and shell.
// Block presentation lives in blocks.tsx / images.tsx / rich-text.tsx.

// ---------- Section grouping ----------
// Consecutive stepBlocks share one page section (e.g. "Solution").
// Backgrounds alternate white / alt per section group.

type SectionGroup =
  | { kind: "single"; block: SingleBlock; anchor?: string }
  | { kind: "steps"; steps: StepBlock[]; anchor?: string };

function groupSections(sections: SectionBlock[]): SectionGroup[] {
  const groups: SectionGroup[] = [];
  for (const block of sections) {
    const last = groups[groups.length - 1];
    if (block.type === "stepBlock") {
      if (last?.kind === "steps") {
        last.steps.push(block);
      } else {
        groups.push({ kind: "steps", steps: [block], anchor: block.anchor });
      }
    } else {
      groups.push({ kind: "single", block, anchor: block.anchor });
    }
  }
  return groups;
}

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
  const groups = groupSections(project.sections);
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
        <Placeholder image={project.heroImage} tall />
      </div>

      {groups.map((group, i) => (
        <section
          key={i}
          className={`case-section${i % 2 === 1 ? " alt" : ""}`}
          id={group.anchor}
        >
          <div className="container" data-reveal>
            {group.kind === "steps" ? (
              <StepGroup steps={group.steps} />
            ) : (
              <BlockBody block={group.block} />
            )}
          </div>
        </section>
      ))}

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
