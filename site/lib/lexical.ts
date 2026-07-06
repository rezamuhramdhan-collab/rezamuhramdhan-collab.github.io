// True when a Lexical editor state actually contains text (not just an empty
// paragraph). Used to decide whether to render rich content or fall back to
// the legacy plain-text fields.
export function hasLexical(content: unknown): boolean {
  const root = (content as { root?: { children?: unknown[] } })?.root;
  if (!Array.isArray(root?.children)) return false;
  const walk = (nodes: unknown[]): boolean =>
    nodes.some((n) => {
      const node = n as { text?: string; children?: unknown[] };
      if (typeof node.text === "string" && node.text.trim() !== "") return true;
      return Array.isArray(node.children) ? walk(node.children) : false;
    });
  return walk(root.children);
}
