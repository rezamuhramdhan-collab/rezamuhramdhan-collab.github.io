import type { SectionBlock } from "@/content/types";
import { groupCaseSections } from "@/lib/case-story";
import { BlockBody, StepGroup, blockHeading } from "./blocks";

// The same reading layout appears after a protected story is unlocked.
export function CaseSections({ sections }: { sections: SectionBlock[] }) {
  const groups = groupCaseSections(sections);
  if (!groups.length) {
    return <p className="empty-state">This story is still taking shape. The full case study will appear here when it is ready.</p>;
  }
  return (
    <div className="case-reading">
      <div className="case-chapters">
        {groups.map((group, index) => {
          const kind = group.kind === "steps" ? "steps" : group.block.type;
          const hasHeading = group.kind === "steps" || blockHeading(group.block);
          return (
            <section key={group.id} className={`sec sec--${kind}`} id={group.id}>
              {hasHeading && (
                <div className="sec-label-row">
                  <span className="chapter-number mono" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <h2>{group.label}</h2>
                </div>
              )}
              <div className="chapter-body">
                {group.kind === "steps" ? <StepGroup steps={group.steps} /> : <BlockBody block={group.block} />}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
