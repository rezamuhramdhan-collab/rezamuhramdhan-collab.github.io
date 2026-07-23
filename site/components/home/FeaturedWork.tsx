import Link from "next/link";
import type { Project } from "@/content/types";
import { ArrowUpRight } from "../icons";
import { ProjectCard } from "./ProjectCard";

const FEATURED_PROJECT_COUNT = 4;

export function FeaturedWork({ projects }: { projects: Project[] }) {
  const featuredProjects = projects.slice(0, FEATURED_PROJECT_COUNT);

  return (
    <section className="section first px" id="work">
      <div className="sec-head" data-reveal>
        <div>
          <span className="eyebrow">Selected Projects</span>
          <h2>Work</h2>
        </div>
        <Link className="sec-link" href="/work">
          All Projects
          <ArrowUpRight />
        </Link>
      </div>
      <div className="work-grid">
        {featuredProjects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
