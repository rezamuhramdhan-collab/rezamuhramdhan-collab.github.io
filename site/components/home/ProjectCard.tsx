import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/types";
import { ArrowInCircle, PhotoIcon } from "../icons";

const VISUAL_THUMBNAILS: Record<string, string> = {
  // The system case study gets a native Paper Swiss thumbnail instead of the
  // legacy CMS mockup treatment, so the card previews the work's actual visual language.
  "bank-saqu-design-system": "/work/design-systemqu/thumbnail.svg",
};

function ProjectThumbnail({ project }: { project: Project }) {
  const thumbnail = VISUAL_THUMBNAILS[project.slug] ?? project.thumbnail;

  if (!thumbnail) {
    return (
      <div className="img-placeholder">
        <PhotoIcon />
      </div>
    );
  }

  return (
    <Image
      src={thumbnail}
      alt=""
      fill
      sizes="(max-width: 760px) 100vw, 280px"
      style={{ objectFit: "cover" }}
    />
  );
}

// One row of the work list: 280px thumbnail, then title + year, the category
// meta line, the summary, and a footer band. v2's numbered hover-card is gone.
export function ProjectCard({ project }: { project: Project }) {
  return (
    <li data-reveal>
      <Link className="project-row" href={`/work/${project.slug}`}>
        <div className="project-photo">
          <ProjectThumbnail project={project} />
        </div>
        <div className="project-body">
          <div>
            <div className="project-title-row">
              <h3 className="display">{project.title}</h3>
              <span className="mono">{project.year}</span>
            </div>
            <p className="project-cat">{project.category}</p>
            {project.summary && <p className="project-summary">{project.summary}</p>}
          </div>
          <div className="project-foot">
            {(project.tags ?? []).length > 0 && (
              <div className="project-tags">
                {(project.tags ?? []).slice(0, 3).map((tag) => (
                  <span className="mono" key={tag}>{tag}</span>
                ))}
              </div>
            )}
            <span className="project-read">
              Read case study
              <ArrowInCircle />
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}
