import Link from "next/link";
import type { Project } from "@/content/types";
import { ArrowRight } from "../icons";
import { ProjectCard } from "./ProjectCard";

const FEATURED_PROJECT_COUNT = 4;

export function FeaturedWork({ projects }: { projects: Project[] }) {
  const featuredProjects = projects.slice(0, FEATURED_PROJECT_COUNT);

  return (
    <section className="section first px" id="work">
      <div className="sec-head" data-reveal>
        <h2 className="display">Selected projects</h2>
        <Link className="sec-link" href="/work">
          See all projects
          <ArrowRight />
        </Link>
      </div>
      <ul className="work-list">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </ul>
    </section>
  );
}
