import type { SectionBlock, StepBlock } from "@/content/types";
import { BlockBody, StepGroup, blockHeading, type SingleBlock } from "./blocks";

// Section grouping + the accent-label section shell for a case study body.
// Shared by the server-rendered page (unlocked) and ProjectLock's client-side
// render after decryption (locked). Consecutive stepBlocks share one section.

type SectionGroup =
  | { kind: "single"; block: SingleBlock; anchor?: string; label?: string }
  | { kind: "steps"; steps: StepBlock[]; anchor?: string; label?: string };

function groupSections(sections: SectionBlock[]): SectionGroup[] {
  const groups: SectionGroup[] = [];
  for (const block of sections) {
    const last = groups[groups.length - 1];
    if (block.type === "stepBlock") {
      if (last?.kind === "steps") {
        last.steps.push(block);
      } else {
        groups.push({ kind: "steps", steps: [block], anchor: block.anchor, label: blockHeading(block) });
      }
    } else {
      groups.push({ kind: "single", block, anchor: block.anchor, label: blockHeading(block) });
    }
  }
  return groups;
}

export function CaseSections({ sections }: { sections: SectionBlock[] }) {
  const groups = groupSections(sections);
  return (
    <>
      {groups.map((group, i) => (
        <section key={i} className="sec" id={group.anchor} data-reveal>
          {group.label && (
            <div className="sec-label-row">
              <span className="eyebrow">{group.label}</span>
              <div className="rule" />
            </div>
          )}
          {group.kind === "steps" ? (
            <StepGroup steps={group.steps} />
          ) : (
            <BlockBody block={group.block} />
          )}
        </section>
      ))}
    </>
  );
}
