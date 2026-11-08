import Link from "next/link";
import type { Project, SiteSettings } from "@/content/types";
import { ArrowBack, ArrowUpRight } from "../icons";
import { Btn } from "../shared";
import { CaseImage } from "./images";
import { CaseSections } from "./sections";
import { ProjectLock } from "./ProjectLock";

export function CaseStudy({ project, settings, nextProject }: {
  project: Project;
  settings: SiteSettings;
  nextProject?: Project;
}) {
  const { ctaFooter, backLink } = settings;
  const hasCover = project.heroImage.src && project.heroImage.src !== "placeholder";

  return (
    <main className="case case-editorial" id="main-content">
      <div className="case-opening">
        <div className="frame">
          <div className="case-breadcrumb">
            <Link className="back-link" href={backLink.href}><ArrowBack />{backLink.label}</Link>
          </div>
          <header className="case-header" id="case-top">
            <div className="case-cover-copy">
              <h1>{project.title}</h1>
              <p className="subtitle">{project.summary}</p>
            </div>
            {project.metaGrid.length > 0 && <dl className="case-facts">
              {project.metaGrid.map((pair) => <div key={pair.label}><dt>{pair.label}</dt><dd>{pair.value}</dd></div>)}
            </dl>}
          </header>
          {hasCover && <div className="case-cover-media"><CaseImage image={project.heroImage} hero priority /></div>}
          <div className="case-cover-end"><span>First, the question. Then, the choices.</span><span aria-hidden="true">↓</span></div>
        </div>
      </div>

      <div className="case-paper">
        <div className="frame">
          {project.lock
            ? <div className="lock-wrap"><ProjectLock slug={project.slug} lock={project.lock} /></div>
            : <CaseSections sections={project.sections} />}
        </div>
      </div>

      <section className="case-ending" aria-labelledby="case-ending-title">
        <div className="frame">
          {nextProject && <Link className="case-next" href={`/work/${nextProject.slug}`}>
            <span className="case-next-label">The next story<span>{nextProject.category}</span></span>
            <span className="case-next-title">{nextProject.title}</span><ArrowUpRight />
          </Link>}
          <div className="case-contact">
            <div><p className="chapter-label">{ctaFooter.headline}</p><h2 id="case-ending-title">{ctaFooter.subtext}</h2></div>
            <div className="case-ending-actions"><Link className="all-work" href="/#work"><ArrowBack />All Work</Link>{nextProject ? <Link className="btn btn-accent" href="/#contact">Talk about a project</Link> : <Btn button={ctaFooter.button} />}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
