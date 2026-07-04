import Link from "next/link";
import type {
  Project,
  SectionBlock,
  StepBlock,
  ImageRef,
  ListStyle,
  SiteSettings,
} from "@/content/types";
import { Btn } from "../shared";
import { ArrowLeft } from "../icons";

// ---------- Text helpers ----------

// Renders "**bold**" spans as ink-colored <strong> (see .prose p strong).
function Rich({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
    </>
  );
}

const listClass: Record<ListStyle, string> = {
  bullet: "bullet-list",
  check: "check-list",
  arrow: "dash-list",
};

function Placeholder({ image, tall, className }: { image: ImageRef; tall?: boolean; className?: string }) {
  if (image.src === "placeholder") {
    return (
      <div className={className}>
        <div className={`case-img${tall ? " tall" : ""}`} role="img" aria-label={image.alt}>
          <div className="device" />
        </div>
        {image.caption && <p className="img-caption">{image.caption}</p>}
      </div>
    );
  }
  return (
    <div className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.src} alt={image.alt} style={{ borderRadius: 20, width: "100%" }} />
      {image.caption && <p className="img-caption">{image.caption}</p>}
    </div>
  );
}

// ---------- Block renderers ----------

function BlockBody({ block }: { block: SectionBlock }) {
  switch (block.type) {
    case "richText":
      return (
        <>
          {block.heading && <h2>{block.heading}</h2>}
          <div className="prose">
            {block.paragraphs.map((p, i) => (
              <p key={i}><Rich text={p} /></p>
            ))}
          </div>
          {block.items && (
            <ul className="dash-list block-gap">
              {block.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          )}
          {block.closingParagraphs && (
            <div className="prose block-gap-lg">
              {block.closingParagraphs.map((p, i) => (
                <p key={i}><Rich text={p} /></p>
              ))}
            </div>
          )}
        </>
      );

    case "bulletList":
      return (
        <>
          {block.heading && <h2>{block.heading}</h2>}
          {block.intro && (
            <div className="prose">
              <p><Rich text={block.intro} /></p>
            </div>
          )}
          <ul className={`${listClass[block.style]}${block.intro ? " block-gap-lg" : ""}`}>
            {block.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </>
      );

    case "hmwGrid":
      return (
        <>
          <h2>{block.heading}</h2>
          <div className="hmw-grid">
            {block.cards.map((card, i) => (
              <div key={card} className="hmw-card">
                <span className="hmw-num">{i + 1}</span>
                <p>{card}</p>
              </div>
            ))}
          </div>
        </>
      );

    case "twoColumn":
      return (
        <>
          <h2>{block.heading}</h2>
          <div className="two-col">
            <div>
              <h4>{block.leftTitle}</h4>
              <ul className="dash-list">
                {block.leftItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h4>{block.rightTitle}</h4>
              <ul className="dash-list">
                {block.rightItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
          {block.image && <Placeholder image={block.image} className="two-col-img" />}
        </>
      );

    case "impactCallout":
      return (
        <>
          <h2>{block.heading}</h2>
          <ul className="check-list">
            {block.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <div className="benefits-card">
            <h4>{block.calloutTitle}</h4>
            <ul className="dash-list">
              {block.calloutItems.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </>
      );

    case "reflection":
      return (
        <>
          <h2>{block.heading}</h2>
          <div className="prose">
            {block.paragraphs.map((p, i) => (
              <p key={i}><Rich text={p} /></p>
            ))}
            <p><strong>{block.learningsTitle}</strong></p>
          </div>
          <ul className="dash-list block-gap">
            {block.learnings.map((item) => <li key={item}>{item}</li>)}
          </ul>
          {block.pullQuote && (
            <p className="pull-quote">
              {block.pullQuote.text} <span className="em">{block.pullQuote.accent}</span>
            </p>
          )}
        </>
      );

    case "image":
      return <Placeholder image={block.image} />;

    case "stepBlock":
      return null; // rendered via StepGroup
  }
}

function StepGroup({ steps }: { steps: StepBlock[] }) {
  return (
    <>
      <h2>{steps[0].sectionHeading ?? "Solution"}</h2>
      {steps.map((step) => (
        <div key={step.stepNumber} className="solution-item">
          <h3>{step.stepNumber}. {step.title}</h3>
          {step.description && <p>{step.description}</p>}
          <ul className="dash-list">
            {step.bullets.map((item) => <li key={item}>{item}</li>)}
          </ul>
          {step.image && <Placeholder image={step.image} />}
        </div>
      ))}
    </>
  );
}

// ---------- Section grouping ----------
// Consecutive stepBlocks share one page section (e.g. "Solution").
// Backgrounds alternate white / alt per section group.

type SectionGroup =
  | { kind: "single"; block: SectionBlock; anchor?: string }
  | { kind: "steps"; steps: StepBlock[]; anchor?: string };

function groupSections(sections: SectionBlock[]): SectionGroup[] {
  const groups: SectionGroup[] = [];
  for (const block of sections) {
    const last = groups[groups.length - 1];
    if (block.type === "stepBlock") {
      if (last?.kind === "steps") {
        last.steps.push(block);
      } else {
        groups.push({ kind: "steps", steps: [block], anchor: block.anchor });
      }
    } else {
      groups.push({ kind: "single", block, anchor: block.anchor });
    }
  }
  return groups;
}

// ---------- Case study page ----------

export function CaseNav({
  sections,
  backLink,
}: {
  sections: SectionBlock[];
  backLink: SiteSettings["backLink"];
}) {
  // Tab nav auto-derived from anchored blocks (PRD §6)
  const anchors = sections
    .filter((s) => s.anchor)
    .map((s) => ({
      anchor: s.anchor as string,
      label:
        "heading" in s && s.heading
          ? s.heading.split(" ")[0].replace("&", "")
          : (s.anchor as string),
    }));
  return (
    <nav>
      <div className="container nav-inner">
        <Link className="back-link" href={backLink.href}>
          <ArrowLeft />
          {backLink.label}
        </Link>
        <div className="nav-links">
          {anchors.map((a) => (
            <a key={a.anchor} href={`#${a.anchor}`} style={{ textTransform: "capitalize" }}>
              {a.anchor}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export function CaseStudy({ project, settings }: { project: Project; settings: SiteSettings }) {
  const groups = groupSections(project.sections);
  const { ctaFooter } = settings;

  return (
    <>
      <CaseNav sections={project.sections} backLink={settings.backLink} />

      <header className="case-header">
        <div className="container">
          <h1>{project.title}</h1>
          <p className="lede">{project.summary}</p>
          <div className="meta-grid">
            {project.metaGrid.map((pair) => (
              <div key={pair.label} className="meta-cell">
                <div className="meta-label">{pair.label}</div>
                <div className="meta-value">{pair.value}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="container">
        <Placeholder image={project.heroImage} tall />
      </div>

      {groups.map((group, i) => (
        <section
          key={i}
          className={`case-section${i % 2 === 1 ? " alt" : ""}`}
          id={group.anchor}
        >
          <div className="container">
            {group.kind === "steps" ? (
              <StepGroup steps={group.steps} />
            ) : (
              <BlockBody block={group.block} />
            )}
          </div>
        </section>
      ))}

      <section className="case-cta">
        <div className="container">
          <h2>{ctaFooter.headline}</h2>
          <p>{ctaFooter.subtext}</p>
          <Btn button={ctaFooter.button} />
        </div>
      </section>
    </>
  );
}
