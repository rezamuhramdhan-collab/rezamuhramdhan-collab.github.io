import type { Project, RichItem, SectionBlock, StepBlock } from "@/content/types";
import { hasLexical, lexicalToLines } from "./lexical";

type SingleBlock = Exclude<SectionBlock, StepBlock>;
export type CaseGroup = (
  | { kind: "single"; block: SingleBlock }
  | { kind: "steps"; steps: StepBlock[] }
) & { id: string; label: string };

export function sectionHeading(block: SectionBlock): string | undefined {
  if (block.type === "stepBlock") return block.sectionHeading || "Design decisions";
  if (block.type === "image") return undefined;
  return block.heading;
}

// Shared by the contents list and body so generated links always resolve.
// An authored anchor starts a new group, even within consecutive steps.
export function groupCaseSections(sections: SectionBlock[]): CaseGroup[] {
  const groups: CaseGroup[] = [];
  const used = new Set(sections.map((section) => section.anchor).filter(Boolean));
  const seen = new Set<string>();
  for (const [index, block] of sections.entries()) {
    const previous = groups.at(-1);
    if (block.type === "stepBlock" && previous?.kind === "steps" && !block.anchor && !block.sectionHeading) {
      previous.steps.push(block);
      continue;
    }
    const label = sectionHeading(block) || (block.type === "image" ? "Project images" : "Project details");
    const stem = block.anchor || label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `section-${index + 1}`;
    let id = stem;
    let suffix = 2;
    while (seen.has(id) || (id !== block.anchor && used.has(id))) id = `${stem}-${suffix++}`;
    seen.add(id);
    groups.push(block.type === "stepBlock"
      ? { kind: "steps", steps: [block], id, label }
      : { kind: "single", block, id, label });
  }
  return groups;
}

function plain(item: RichItem | undefined): string {
  const text = typeof item === "string" ? item : item?.content && hasLexical(item.content)
    ? lexicalToLines(item.content).join(" ") : item?.text || "";
  return text.replace(/\*\*/g, "").trim();
}

function excerpt(text: string): string {
  return text.length > 250 ? `${text.slice(0, 247).replace(/\s+\S*$/, "")}…` : text;
}

export function storyHighlights(project: Project): { label: string; text: string; id: string }[] {
  if (project.lock) return [];
  const groups = groupCaseSections(project.sections);
  const highlights: { label: string; text: string; id: string }[] = [];
  for (const group of groups) {
    if (group.kind === "steps") {
      if (!highlights.some((item) => item.label === "Design response")) {
        const first = group.steps[0];
        highlights.push({ label: "Design response", text: excerpt(first.description || first.title), id: group.id });
      }
      continue;
    }
    const block = group.block;
    if (/problem|challenge/i.test(`${group.id} ${group.label}`) && !highlights.some((item) => item.label === "Challenge")) {
      const text = block.type === "bulletList" ? plain(block.items[0]) || block.intro || ""
        : block.type === "richText" ? (hasLexical(block.content) ? lexicalToLines(block.content)[0] || "" : plain(block.paragraphs[0])) : "";
      if (text) highlights.push({ label: "Challenge", text: excerpt(text), id: group.id });
    }
    if (block.type === "impactCallout" && !highlights.some((item) => item.label === "Reported outcome")) {
      const text = plain(block.items[0]);
      if (text) highlights.push({ label: "Reported outcome", text: excerpt(text), id: group.id });
    }
  }
  const order = ["Challenge", "Design response", "Reported outcome"];
  return highlights.sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label));
}
