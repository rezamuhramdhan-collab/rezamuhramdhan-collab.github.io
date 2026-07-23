import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/types";
import { ArrowUpRight, PhotoIcon } from "../icons";

function ProjectThumbnail({ project }: { project: Project }) {
  if (!project.thumbnail) {
    return (
      <div className="img-placeholder">
        <PhotoIcon />
      </div>
    );
  }

  return (
    <Image
      src={project.thumbnail}
      alt=""
      fill
      sizes="(max-width: 820px) 100vw, 560px"
      style={{ objectFit: "cover" }}
    />
  );
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link className="project-card" href={`/work/${project.slug}`} data-reveal>
      <div className="project-photo">
        <ProjectThumbnail project={project} />
        <span className="project-num">{String(index + 1).padStart(2, "0")}</span>
        <span className="project-open" aria-hidden="true">
          <ArrowUpRight />
        </span>
      </div>
      <div className="project-caption">
        <div>
          <h3>{project.title}</h3>
          <div className="project-cat">{project.category}</div>
        </div>
        <span className="project-year">{project.year}</span>
      </div>
    </Link>
  );
}
