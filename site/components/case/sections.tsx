import type { SectionBlock, StepBlock } from "@/content/types";
import { BlockBody, StepGroup, type SingleBlock } from "./blocks";

// Section grouping + page-section shells for a case study body. Shared by the
// server-rendered page (unlocked projects) and ProjectLock's client-side
// render after decryption (locked projects).

// Consecutive stepBlocks share one page section (e.g. "Solution").
// Backgrounds alternate white / alt per section group.
type SectionGroup =
  | { kind: "single"; block: SingleBlock; anchor?: string }
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

export function CaseSections({ sections }: { sections: SectionBlock[] }) {
  const groups = groupSections(sections);
  return (
    <>
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
    </>
  );
}
