import Link from "next/link";
import type { Project } from "@/content/types";
import { ProjectCard } from "./ProjectCard";
import { Chapter, ChapterEnd } from "../Chapter";

const FEATURED_PROJECT_COUNT = 4;

export function FeaturedWork({ projects }: { projects: Project[] }) {
  const featuredProjects = projects.slice(0, FEATURED_PROJECT_COUNT);

  return (
    <section className="section story-section story-work" id="work" data-story-chapter>
      <div className="px">
      <Chapter number="02" title="Fragments of the comet" />
      <div className="sec-head work-heading" data-reveal>
        <div className="work-heading-copy">
          <p className="section-context">Selected work</p>
          <h2 className="display"><span>Small decisions.</span><em>Lasting connections.</em></h2>
          <p className="work-intro">The problem, the decisions, and what changed. Read the story behind each project.</p>
        </div>
        <Link className="sec-link" href="/work">See all projects</Link>
      </div>
      {featuredProjects.length ? <ul className="work-list">
        {featuredProjects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </ul> : <p className="empty-state">These fragments are still finding their place. Case studies will appear here when published.</p>}
      <ChapterEnd>Behind every finished screen, there was a search.</ChapterEnd>
      </div>
    </section>
  );
}
