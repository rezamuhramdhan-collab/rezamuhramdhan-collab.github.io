"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project } from "@/content/types";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "../icons";
import { ProjectCard } from "./ProjectCard";

// Featured Work grid with client-side pagination: 4 projects per page,
// controls appear only when there are more. Client-side because the site also
// ships as a static export — there's no server to render ?page= variants.

const PAGE_SIZE = 4;

export function FeaturedWork({ projects }: { projects: Project[] }) {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(projects.length / PAGE_SIZE);
  const visible = projects.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

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
        {visible.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={page * PAGE_SIZE + i}
          />
        ))}
      </div>
      {pageCount > 1 && (
        <nav className="work-pagination" aria-label="Featured work pages">
          <button
            type="button"
            className="page-btn"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Previous projects"
          >
            <ArrowLeft />
          </button>
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              type="button"
              key={i}
              className={`page-btn page-num${i === page ? " active" : ""}`}
              onClick={() => setPage(i)}
              aria-current={i === page ? "page" : undefined}
              aria-label={`Page ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            className="page-btn"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={page === pageCount - 1}
            aria-label="Next projects"
          >
            <ArrowRight />
          </button>
        </nav>
      )}
    </section>
  );
}
