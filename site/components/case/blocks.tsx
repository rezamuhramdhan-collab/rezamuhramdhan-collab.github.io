import type { SectionBlock, StepBlock, ListStyle } from "@/content/types";
import { hasLexical } from "@/lib/lexical";
import { RichBody, Rich, Cell, Paras } from "./rich-text";
import { ImageGroup, WithImages } from "./images";

// Presentation for each case-study section block. Step blocks are only
// renderable as a group (see groupSections in CaseStudy.tsx), so BlockBody
// takes the union without them.

export type SingleBlock = Exclude<SectionBlock, StepBlock>;

const listClass: Record<ListStyle, string> = {
  bullet: "bullet-list",
  check: "check-list",
  arrow: "dash-list",
};

export function BlockBody({ block }: { block: SingleBlock }) {
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
