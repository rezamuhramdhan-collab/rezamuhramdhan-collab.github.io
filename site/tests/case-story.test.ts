import test from "node:test";
import assert from "node:assert/strict";
import { groupCaseSections, storyHighlights } from "../lib/case-story";
import { getPublishedProjects } from "../content/projects";
import type { SectionBlock, Project } from "../content/types";

const projects = getPublishedProjects();

test("grouping preserves every authored block in order without mutating content", () => {
  for (const project of projects) {
    const original = structuredClone(project.sections);
    const groups = groupCaseSections(project.sections);
    assert.deepEqual(groups.flatMap<SectionBlock>((group) => group.kind === "steps" ? group.steps : [group.block]), original);
    assert.deepEqual(project.sections, original);
    assert.equal(new Set(groups.map((group) => group.id)).size, groups.length);
    for (const block of project.sections.filter((block) => block.anchor)) {
      assert.ok(groups.some((group) => group.id === block.anchor));
    }
  }
});

test("generated IDs avoid reserved authored anchors and duplicate headings", () => {
  const sections: SectionBlock[] = [
    { type: "richText", heading: "Overview", paragraphs: [] },
    { type: "richText", anchor: "overview", heading: "Overview", paragraphs: [] },
    { type: "richText", heading: "Overview", paragraphs: [] },
    { type: "richText", anchor: "overview-2", heading: "Details", paragraphs: [] },
  ];
  assert.deepEqual(groupCaseSections(sections).map((group) => group.id), ["overview-3", "overview", "overview-4", "overview-2"]);
});

test("an authored anchor inside consecutive decisions keeps its destination", () => {
  const sections: SectionBlock[] = [
    { type: "stepBlock", stepNumber: 1, title: "First", bullets: [] },
    { type: "stepBlock", stepNumber: 2, title: "Second", bullets: [] },
    { type: "stepBlock", anchor: "validation", stepNumber: 3, title: "Third", bullets: [] },
  ];
  const groups = groupCaseSections(sections);
  assert.equal(groups.length, 2);
  assert.equal(groups[0].kind === "steps" && groups[0].steps.length, 2);
  assert.equal(groups[1].id, "validation");
});

test("every excerpt links to an existing chapter and uses existing source text", () => {
  for (const project of projects) {
    const ids = groupCaseSections(project.sections).map((group) => group.id);
    for (const highlight of storyHighlights(project)) {
      assert.ok(ids.includes(highlight.id));
      assert.ok(highlight.text.length <= 250);
      assert.ok(JSON.stringify(project.sections).replace(/\*\*/g, "").includes(highlight.text.replace(/…$/, "")));
    }
  }
});

test("protected and empty stories expose no summary excerpts", () => {
  const project: Project = { ...projects[0], lock: { salt: "", iv: "", data: "", iterations: 1 } };
  assert.deepEqual(storyHighlights(project), []);
  assert.deepEqual(storyHighlights({ ...projects[0], sections: [] }), []);
  assert.deepEqual(groupCaseSections([]), []);
});

test("rich CMS content wins over stale plain text in challenge excerpts", () => {
  const project: Project = { ...projects[0], sections: [{ type: "richText", anchor: "problem", heading: "Problem", paragraphs: ["Old copy"], content: { root: { children: [{ type: "paragraph", children: [{ text: "The current challenge." }] }] } } }] };
  assert.equal(storyHighlights(project)[0].text, "The current challenge.");
});
