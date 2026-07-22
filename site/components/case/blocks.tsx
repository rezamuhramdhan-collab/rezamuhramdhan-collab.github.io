import type { SectionBlock, StepBlock, ListStyle } from "@/content/types";
import { hasLexical } from "@/lib/lexical";
import { RichBody, Rich, Cell, Paras } from "./rich-text";
import { ImageGroup, WithImages } from "./images";

// Presentation for each case-study section block. In v2 the block's heading is
// hoisted out into the section's accent label row (see blockHeading +
// CaseSections), so the bodies here render content only. Step blocks are only
// renderable as a group, so BlockBody takes the union without them.

export type SingleBlock = Exclude<SectionBlock, StepBlock>;

const listClass: Record<ListStyle, string> = {
  bullet: "bullet-list",
  check: "check-list",
  arrow: "dash-list",
};

// The short label shown in a section's accent eyebrow row (or undefined → no
// label row). Step groups use their sectionHeading.
export function blockHeading(block: SectionBlock): string | undefined {
  switch (block.type) {
    case "stepBlock":
      return block.sectionHeading ?? "Solution";
    case "richText":
    case "bulletList":
      return block.heading;
    case "hmwGrid":
    case "twoColumn":
    case "impactCallout":
    case "reflection":
      return block.heading;
    case "image":
      return undefined;
  }
}

export function BlockBody({ block }: { block: SingleBlock }) {
  switch (block.type) {
    case "richText":
      return (
        <WithImages images={block.images} layout={block.imageLayout}>
          {hasLexical(block.content) ? (
            <div className="prose rich">
              <RichBody data={block.content} />
            </div>
          ) : (
            <>
              <div className="prose"><Paras items={block.paragraphs} /></div>
              {block.items && (
                <ul className="dash-list" style={{ marginTop: 20 }}>
                  {block.items.map((item, i) => <li key={i}><Cell item={item} /></li>)}
                </ul>
              )}
              {block.closingParagraphs && (
                <div className="prose" style={{ marginTop: 24 }}><Paras items={block.closingParagraphs} /></div>
              )}
            </>
          )}
        </WithImages>
      );

    case "bulletList":
      return (
        <WithImages images={block.images} layout={block.imageLayout}>
          {block.intro && (
            <div className="prose"><p><Rich text={block.intro} /></p></div>
          )}
          <ul className={listClass[block.style]} style={block.intro ? { marginTop: 20 } : undefined}>
            {block.items.map((item, i) => <li key={i}><Cell item={item} /></li>)}
          </ul>
        </WithImages>
      );

    case "hmwGrid":
      return (
        <div className={`hmw-grid${block.cards.length > 1 ? " multi" : ""}`}>
          {block.cards.map((card, i) => (
            <div key={i} className="hmw-card">
              <span className="hmw-num">{String(i + 1).padStart(2, "0")}</span>
              <div className="hmw-body"><Cell item={card} /></div>
            </div>
          ))}
        </div>
      );

    case "twoColumn":
      return (
        <WithImages images={block.images} layout={block.imageLayout}>
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
          <div className="prose">
            <Paras items={block.paragraphs} />
            <p><strong>{block.learningsTitle}</strong></p>
          </div>
          <ul className="dash-list" style={{ marginTop: 16 }}>
            {block.learnings.map((item, i) => <li key={i}><Cell item={item} /></li>)}
          </ul>
          {block.pullQuote && (
            <p className="pull">
              {block.pullQuote.text} {block.pullQuote.accent && <span className="em">{block.pullQuote.accent}</span>}
            </p>
          )}
        </>
      );

    case "image":
      return <ImageGroup images={block.images} layout={block.imageLayout} />;

    default: {
      // Exhaustiveness guard: adding a SectionBlock member without a renderer
      // is a compile error instead of a silently blank section.
      const exhausted: never = block;
      return exhausted;
    }
  }
}

export function StepGroup({ steps }: { steps: StepBlock[] }) {
  return (
    <div className="steps">
      {steps.map((step, i) => (
        <div key={i} className="step">
          <h3>
            {String(step.stepNumber).padStart(2, "0")} — {step.title}
          </h3>
          {step.description && <p>{step.description}</p>}
          {step.bullets.length > 0 && (
            <ul className="sq-list">
              {step.bullets.map((item, j) => <li key={j}><Cell item={item} /></li>)}
            </ul>
          )}
          {step.images?.length ? <ImageGroup images={step.images} layout={step.imageLayout} /> : null}
        </div>
      ))}
    </div>
  );
}
