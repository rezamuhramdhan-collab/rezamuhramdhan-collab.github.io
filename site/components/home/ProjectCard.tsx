import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/types";
import { ArrowInCircle } from "../icons";

function PaperThumbnail({ project }: { project: Project }) {
  const category = project.category.toLowerCase();
  const isSystem = category.includes("system");
  const isWeb = category.includes("ui") || category.includes("website");
  const label = project.category.toUpperCase();

  return (
    <svg className="paper-thumb" viewBox="0 0 1120 700" aria-hidden="true" focusable="false">
      <rect width="1120" height="700" fill="#f4f4f2" />
      <path d="M48 112h1024M48 598h1024" stroke="#dededa" />
      <text x="48" y="62" fill="#8b8b85" fontFamily="monospace" fontSize="16" letterSpacing="3">
        {label} / {project.year}
      </text>

      {isSystem ? (
        <>
          <text x="48" y="184" fill="#111" fontFamily="Arial, sans-serif" fontSize="54" fontWeight="700" letterSpacing="-2">
            Shared language
          </text>
          <text x="48" y="220" fill="#8b8b85" fontFamily="Arial, sans-serif" fontSize="18">
            foundations → roles → components
          </text>
          {[
            { x: 48, index: "01", title: "Foundations", fill: "#fbfbfa" },
            { x: 410, index: "02", title: "Semantic roles", fill: "#fbfbfa" },
          ].map((card) => (
            <g key={card.index} transform={`translate(${card.x} 292)`}>
              <rect width="300" height="224" rx="12" fill={card.fill} stroke="#dededa" />
              <text x="24" y="36" fill="#8b8b85" fontFamily="monospace" fontSize="14" letterSpacing="2">
                {card.index}
              </text>
              <text x="24" y="78" fill="#111" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="700">
                {card.title}
              </text>
              <rect x="24" y="106" width="252" height="18" rx="9" fill="#111" />
              <rect x="24" y="140" width="190" height="18" rx="9" fill="#e9e9e6" />
              <rect x="24" y="174" width="224" height="18" rx="9" fill="#e9e9e6" />
            </g>
          ))}
          <path d="M748 404h54" stroke="#111" strokeWidth="2" />
          <path d="m794 396 10 8-10 8" fill="none" stroke="#111" strokeWidth="2" />
          <g transform="translate(838 292)">
            <rect width="234" height="224" rx="12" fill="#111" />
            <text x="22" y="36" fill="#8b8b85" fontFamily="monospace" fontSize="14" letterSpacing="2">03 / UI</text>
            <rect x="22" y="82" width="190" height="34" rx="6" fill="#fbfbfa" />
            <rect x="22" y="132" width="122" height="34" rx="17" fill="#fbfbfa" />
            <rect x="156" y="132" width="56" height="34" rx="17" fill="#8b8b85" />
            <rect x="22" y="184" width="190" height="1" fill="#8b8b85" />
          </g>
        </>
      ) : isWeb ? (
        <>
          <text x="48" y="184" fill="#111" fontFamily="Arial, sans-serif" fontSize="54" fontWeight="700" letterSpacing="-2">
            Clearer by design
          </text>
          <g transform="translate(48 292)">
            <rect width="1024" height="224" rx="12" fill="#fbfbfa" stroke="#dededa" />
            <rect x="24" y="24" width="976" height="28" rx="6" fill="#e9e9e6" />
            <circle cx="44" cy="38" r="5" fill="#8b8b85" />
            <circle cx="62" cy="38" r="5" fill="#8b8b85" />
            <circle cx="80" cy="38" r="5" fill="#8b8b85" />
            <rect x="24" y="82" width="440" height="110" rx="8" fill="#111" />
            <rect x="488" y="82" width="238" height="18" rx="9" fill="#111" />
            <rect x="488" y="116" width="366" height="12" rx="6" fill="#e9e9e6" />
            <rect x="488" y="142" width="310" height="12" rx="6" fill="#e9e9e6" />
            <rect x="878" y="82" width="122" height="54" rx="27" fill="#111" />
            <rect x="878" y="154" width="122" height="38" rx="19" fill="#e9e9e6" />
          </g>
        </>
      ) : (
        <>
          <text x="48" y="184" fill="#111" fontFamily="Arial, sans-serif" fontSize="54" fontWeight="700" letterSpacing="-2">
            Reduce the friction
          </text>
          <g transform="translate(48 284)">
            {[0, 1, 2].map((index) => (
              <g key={index} transform={`translate(${index * 324} 0)`}>
                <rect width="276" height="232" rx="24" fill="#111" />
                <rect x="14" y="14" width="248" height="204" rx="16" fill="#fbfbfa" />
                <rect x="32" y="36" width="112" height="12" rx="6" fill="#111" />
                <rect x="32" y="68" width="212" height="48" rx="8" fill="#e9e9e6" />
                <rect x="32" y="132" width="180" height="12" rx="6" fill="#111" />
                <rect x="32" y="160" width="150" height="12" rx="6" fill="#e9e9e6" />
                <rect x="32" y="186" width="98" height="18" rx="9" fill="#111" />
              </g>
            ))}
          </g>
        </>
      )}
    </svg>
  );
}

function ProjectThumbnail({ project }: { project: Project }) {
  if (project.thumbnail) {
    return (
      <div className="real-paper-thumb">
        <div className="real-paper-thumb-meta">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>
        <div className="real-paper-thumb-image">
          <Image
            src={project.thumbnail}
            alt=""
            fill
            sizes="(max-width: 760px) 100vw, 248px"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="real-paper-thumb-rule" />
      </div>
    );
  }

  return <PaperThumbnail project={project} />;
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
