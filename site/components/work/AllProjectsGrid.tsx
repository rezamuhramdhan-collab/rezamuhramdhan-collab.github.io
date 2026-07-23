"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/content/types";
import { ProjectCard } from "@/components/home/ProjectCard";

const ALL = "All";

export function AllProjectsGrid({ projects }: { projects: Project[] }) {
  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(projects.map((project) => project.category)))],
    [projects],
  );
  const [activeCategory, setActiveCategory] = useState(ALL);

  const visibleProjects = projects
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => activeCategory === ALL || project.category === activeCategory);

  return (
    <>
      <div className="project-filters" aria-label="Filter projects by category">
        {categories.map((category) => {
          const active = category === activeCategory;
          return (
            <button
              className={`project-filter${active ? " active" : ""}`}
              type="button"
              key={category}
              aria-pressed={active}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          );
        })}
      </div>
      <div className="all-projects-grid" aria-live="polite">
        {visibleProjects.map(({ project, index }) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </>
  );
}
