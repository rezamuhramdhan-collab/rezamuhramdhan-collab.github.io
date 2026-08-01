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

// Flatten a Lexical editor state to one plain-text line per block (paragraphs
// and list items). v3's Experience row is a single line of prose where v2
// rendered the whole rich bullet list, so the caller takes the first line.
export function lexicalToLines(content: unknown): string[] {
  const root = (content as { root?: { children?: unknown[] } })?.root;
  if (!Array.isArray(root?.children)) return [];

  const textOf = (node: unknown): string => {
    const n = node as { text?: string; children?: unknown[] };
    if (typeof n.text === "string") return n.text;
    return Array.isArray(n.children) ? n.children.map(textOf).join("") : "";
  };

  const lines: string[] = [];
  const walk = (nodes: unknown[]) => {
    for (const raw of nodes) {
      const node = raw as { type?: string; children?: unknown[] };
      // Lists hold their items as children — recurse so each item is its own line.
      if (node.type === "list" && Array.isArray(node.children)) {
        walk(node.children);
        continue;
      }
      const text = textOf(node).trim();
      if (text) lines.push(text);
    }
  };
  walk(root.children);
  return lines;
}
