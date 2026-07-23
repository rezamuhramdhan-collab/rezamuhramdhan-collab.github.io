import type { Metadata } from "next";
import Link from "next/link";
import { AllProjectsGrid } from "@/components/work/AllProjectsGrid";
import { ArrowBack, ArrowRight } from "@/components/icons";
import { getPublishedProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "All Projects — Reza Ramdhan",
  description:
    "Explore Reza Ramdhan's product design, UI/UX, and design-system case studies.",
  alternates: { canonical: "/work" },
};

export default async function AllProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <main className="all-projects-page">
      <header className="topbar all-projects-topbar">
        <div className="topbar-inner">
          <Link className="back-link" href="/">
            <ArrowBack />
            Back
          </Link>
          <span className="all-projects-top-title">All Projects</span>
          <span aria-hidden="true" />
        </div>
      </header>

      <section className="all-projects-content">
        <span className="eyebrow">Selected Work</span>
        <div className="all-projects-heading">
          <h1>Projects</h1>
          <p>
            A selection of product design and digital banking work from 2019 to present.
          </p>
        </div>
        <AllProjectsGrid projects={projects} />
      </section>

      <section className="all-projects-cta">
        <div className="all-projects-cta-inner">
          <div>
            <span className="eyebrow">Get In Touch</span>
            <h2>Interested in working together?</h2>
          </div>
          <Link className="btn btn-accent small all-projects-home" href="/">
            Back to Home
            <ArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
}
