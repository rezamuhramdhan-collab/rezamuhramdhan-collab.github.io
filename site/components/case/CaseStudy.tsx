import Link from "next/link";
import type {
  Project,
  SectionBlock,
  StepBlock,
  ImageRef,
  ImageLayout,
  ListStyle,
  RichItem,
  SiteSettings,
} from "@/content/types";
import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import { hasLexical } from "@/lib/lexical";

// Editor-inserted uploads: images styled to the design system, honoring the
// editor's align control (left/center/right); non-image files become links.
const richConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: ({ node }) => {
    const media = node.value as {
      url?: string;
      alt?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filename?: string;
    } | null;
    if (!media?.url) return null;
    if (media.mimeType && !media.mimeType.startsWith("image/")) {
      return (
        <a href={media.url} target="_blank" rel="noopener">
          {media.filename ?? media.url}
        </a>
      );
    }
    return (
      <figure className={`rich-img align-${node.format || "center"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={media.url} alt={media.alt ?? ""} width={media.width} height={media.height} />
      </figure>
    );
  },
});

function RichBody({ data }: { data: unknown }) {
  return <RichText data={data as never} converters={richConverters} />;
}
import { Btn } from "../shared";
import { ArrowLeft, ArrowRight as ArrowRightSmall } from "../icons";

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

// A list entry (string or {text, content}): rich content rendered inline, else
// the legacy plain text with **bold** support.
function Cell({ item }: { item: RichItem }) {
  if (typeof item !== "string" && hasLexical(item.content)) {
    return <span className="rich-inline"><RichBody data={item.content} /></span>;
  }
  return <Rich text={typeof item === "string" ? item : item.text ?? ""} />;
}

// Paragraphs (richText legacy / reflection): each entry as its own block.
function Paras({ items }: { items: RichItem[] }) {
  return (
    <>
      {items.map((item, i) =>
        typeof item !== "string" && hasLexical(item.content) ? (
          <RichBody key={i} data={item.content} />
        ) : (
          <p key={i}>
            <Rich text={typeof item === "string" ? item : item.text ?? ""} />
          </p>
        ),
      )}
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

// Renders a section's images in the chosen layout (full stack or grid).
function ImageGroup({ images, layout }: { images?: ImageRef[]; layout?: ImageLayout }) {
  if (!images?.length) return null;
  if (layout === "grid" || layout === "grid3") {
    return (
      <div className={`img-grid${layout === "grid3" ? " cols-3" : ""}`}>
        {images.map((image, i) => (
          <Placeholder key={i} image={image} />
        ))}
      </div>
    );
  }
  return (
    <div className="img-stack">
      {images.map((image, i) => (
        <Placeholder key={i} image={image} />
      ))}
    </div>
  );
}

// Wraps a block's text content with its images per the chosen layout:
// left/right put images beside the text; everything else stacks them after.
function WithImages({
  images,
  layout,
  children,
}: {
  images?: ImageRef[];
  layout?: ImageLayout;
  children: React.ReactNode;
}) {
  if (!images?.length) return <>{children}</>;
  if (layout === "left" || layout === "right") {
    return (
      <div className={`media-split${layout === "right" ? " flip" : ""}`}>
        <div className="split-media">
          <ImageGroup images={images} layout="full" />
        </div>
        <div className="split-body">{children}</div>
      </div>
    );
  }
  return (
    <>
      {children}
      <ImageGroup images={images} layout={layout} />
    </>
  );
}

// ---------- Block renderers ----------

function BlockBody({ block }: { block: SectionBlock }) {
  switch (block.type) {
    case "richText":
      return (
        <WithImages images={block.images} layout={block.imageLayout}>
          {block.heading && <h2>{block.heading}</h2>}
          {hasLexical(block.content) ? (
            <div className="prose rich">
              <RichBody data={block.content} />
            </div>
          ) : (
            <>
              <div className="prose"><Paras items={block.paragraphs} /></div>
              {block.items && (
                <ul className="dash-list block-gap">
                  {block.items.map((item, i) => <li key={i}><Cell item={item} /></li>)}
                </ul>
              )}
              {block.closingParagraphs && (
                <div className="prose block-gap-lg"><Paras items={block.closingParagraphs} /></div>
              )}
            </>
          )}
        </WithImages>
      );

    case "bulletList":
      return (
        <WithImages images={block.images} layout={block.imageLayout}>
          {block.heading && <h2>{block.heading}</h2>}
          {block.intro && (
            <div className="prose"><p><Rich text={block.intro} /></p></div>
          )}
          <ul className={`${listClass[block.style]}${block.intro ? " block-gap-lg" : ""}`}>
            {block.items.map((item, i) => <li key={i}><Cell item={item} /></li>)}
          </ul>
        </WithImages>
      );

    case "hmwGrid":
      return (
        <>
          <h2>{block.heading}</h2>
          <div className="hmw-grid">
            {block.cards.map((card, i) => (
              <div key={i} className="hmw-card">
                <span className="hmw-num">{i + 1}</span>
                <p><Cell item={card} /></p>
              </div>
            ))}
          </div>
        </>
      );

    case "twoColumn":
      return (
        <WithImages images={block.images} layout={block.imageLayout}>
          <h2>{block.heading}</h2>
          <div className="two-col">
            <div>
              <h4>{block.leftTitle}</h4>
              <ul className="dash-list">
                {block.leftItems.map((item, i) => <li key={i}><Cell item={item} /></li>)}
              </ul>
            </div>
            <div>
              <h4>{block.rightTitle}</h4>
              <ul className="dash-list">
                {block.rightItems.map((item, i) => <li key={i}><Cell item={item} /></li>)}
              </ul>
            </div>
          </div>
        </WithImages>
      );

    case "impactCallout":
      return (
        <>
          <h2>{block.heading}</h2>
          <ul className="check-list">
            {block.items.map((item, i) => <li key={i}><Cell item={item} /></li>)}
          </ul>
          <div className="benefits-card">
            <h4>{block.calloutTitle}</h4>
            <ul className="dash-list">
              {block.calloutItems.map((item, i) => <li key={i}><Cell item={item} /></li>)}
            </ul>
          </div>
        </>
      );

    case "reflection":
      return (
        <>
          <h2>{block.heading}</h2>
          <div className="prose">
            <Paras items={block.paragraphs} />
            <p><strong>{block.learningsTitle}</strong></p>
          </div>
          <ul className="dash-list block-gap">
            {block.learnings.map((item, i) => <li key={i}><Cell item={item} /></li>)}
          </ul>
          {block.pullQuote && (
            <p className="pull-quote">
              {block.pullQuote.text} <span className="em">{block.pullQuote.accent}</span>
            </p>
          )}
        </>
      );

    case "image":
      return <ImageGroup images={block.images} layout={block.imageLayout} />;

    case "stepBlock":
      return null; // rendered via StepGroup
  }
}

function StepGroup({ steps }: { steps: StepBlock[] }) {
  return (
    <>
      <h2>{steps[0].sectionHeading ?? "Solution"}</h2>
      {steps.map((step, i) => (
        <div key={i} className="solution-item">
          <WithImages images={step.images} layout={step.imageLayout}>
            <h3>{step.stepNumber}. {step.title}</h3>
            {step.description && <p className="step-desc">{step.description}</p>}
            <ul className="dash-list">
              {step.bullets.map((item, i) => <li key={i}><Cell item={item} /></li>)}
            </ul>
          </WithImages>
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

export function CaseStudy({
  project,
  settings,
  nextProject,
}: {
  project: Project;
  settings: SiteSettings;
  nextProject?: Project;
}) {
  const groups = groupSections(project.sections);
  const { ctaFooter } = settings;

  return (
    <>
      <CaseNav sections={project.sections} backLink={settings.backLink} />

      <header className="case-header">
        <div className="container">
          <h1>{project.title}</h1>
          <p className="lede">{project.summary}</p>
          {project.metaGrid.length > 0 && (
            <div className="meta-grid">
              {project.metaGrid.map((pair) => (
                <div key={pair.label} className="meta-cell">
                  <div className="meta-label">{pair.label}</div>
                  <div className="meta-value">{pair.value}</div>
                </div>
              ))}
            </div>
          )}
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
          <div className="container" data-reveal>
            {group.kind === "steps" ? (
              <StepGroup steps={group.steps} />
            ) : (
              <BlockBody block={group.block} />
            )}
          </div>
        </section>
      ))}

      <section className="case-cta">
        <div className="container" data-reveal>
          <h2>{ctaFooter.headline}</h2>
          <p>{ctaFooter.subtext}</p>
          <div className="cta-row">
            <Btn button={ctaFooter.button} />
            {nextProject && (
              <Link className="btn btn-outline" href={`/work/${nextProject.slug}`}>
                Next Project: {nextProject.title}
                <ArrowRightSmall />
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
