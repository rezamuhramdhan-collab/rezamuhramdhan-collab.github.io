import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/types";
import { storyHighlights } from "@/lib/case-story";

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const role = project.metaGrid.find((pair) => pair.label.toLowerCase() === "role");
  const scope = project.metaGrid.find((pair) => pair.label.toLowerCase() === "scope");
  const highlights = storyHighlights(project);
  return (
    <li className="comet-fragment" data-reveal>
      <Link className={`project-row${project.thumbnail ? " has-image" : ""}`} href={`/work/${project.slug}`}>
        <span className="project-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <div className="project-body">
          <div className="project-meta"><span>{project.category}</span><span>{project.year}</span>{project.lock && <span>Protected case study</span>}</div>
          <h3 className="display">{project.title}</h3>
          <div className={`project-story-stage${highlights.length ? " has-story" : ""}`}>
            {project.summary && <p className="project-summary">{project.summary}</p>}
            {highlights.length > 0 && <dl className="fragment-story">{highlights.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.text}</dd></div>)}</dl>}
          </div>
          {(role || scope) && <dl className="project-facts">
            {role && <div><dt>My role</dt><dd>{role.value}</dd></div>}
            {scope && <div><dt>Scope</dt><dd>{scope.value}</dd></div>}
          </dl>}
          <span className="project-read">Read {project.lock ? "protected " : ""}case study <span aria-hidden="true">↗</span></span>
        </div>
        {project.thumbnail && <div className="project-photo">
          <Image src={project.thumbnail} alt="" fill sizes="(max-width: 760px) 100vw, 440px" style={{ objectFit: "cover" }} />
        </div>}
      </Link>
    </li>
  );
}
