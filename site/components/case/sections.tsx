import type { SectionBlock } from "@/content/types";
import { groupCaseSections } from "@/lib/case-story";
import { BlockBody, StepGroup, blockHeading } from "./blocks";
import { CaseNav } from "./CaseNav";

// Also used after decryption: protected content and its contents list appear
// together only after a successful unlock.
export function CaseSections({ sections }: { sections: SectionBlock[] }) {
  const groups = groupCaseSections(sections);
  if (!groups.length) return <p className="empty-state">This story is still taking shape. The full case study will appear here when it is ready.</p>;
  return (
    <div className="case-reading">
      <aside className="case-contents">
        <span className="mono">In this case study</span>
        <CaseNav items={groups.map(({ id, label }) => ({ id, label }))} />
        <a className="contents-top" href="#case-top">Back to top</a>
      </aside>
      <div className="case-chapters">
        {groups.map((group, index) => (
          <section key={group.id} className="sec" id={group.id}>
            {(group.kind === "steps" || blockHeading(group.block)) && (
              <div className="sec-label-row">
                <span className="chapter-number mono" aria-hidden="true">Chapter {String(index + 1).padStart(2, "0")}</span>
                <h2>{group.label}</h2>
              </div>
            )}
            {group.kind === "steps" ? <StepGroup steps={group.steps} /> : <BlockBody block={group.block} />}
          </section>
        ))}
      </div>
    </div>
  );
}
