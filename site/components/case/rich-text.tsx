import Image from "next/image";
import type { RichItem } from "@/content/types";
import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import { hasLexical } from "@/lib/lexical";

// Rich-text rendering for case-study content: the Lexical editor state when
// present, with legacy plain-text ("**bold**") fallbacks.

// Editor-inserted uploads: images styled to the design system, honoring the
// editor's align control (left/center/right); non-image files become links.
const richConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: ({ node }) => {
    const media = node.value as {
      url?: string;
      alt?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filename?: string;
    } | null;
    if (!media?.url) return null;
    if (media.mimeType && !media.mimeType.startsWith("image/")) {
      return (
        <a href={media.url} target="_blank" rel="noopener">
          {media.filename ?? media.url}
        </a>
      );
    }
    return (
      <figure className={`rich-img align-${node.format || "center"}`}>
        {media.width && media.height ? (
          <Image
            src={media.url}
            alt={media.alt ?? ""}
            width={media.width}
            height={media.height}
            sizes="(max-width: 1160px) 100vw, 1080px"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={media.url} alt={media.alt ?? ""} />
        )}
      </figure>
    );
  },
});

export function RichBody({ data }: { data: unknown }) {
  return <RichText data={data as never} converters={richConverters} />;
}

// Renders "**bold**" spans as ink-colored <strong> (see .prose p strong).
export function Rich({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
    </>
  );
}

// Normalizes a list entry to one shape. The plain-string variant only exists
// in the seed fixtures (content/projects); everything read from the CMS is
// already { text, content? } (see fromRichArray in lib/data.ts).
function toRow(item: RichItem): { text: string; content?: unknown } {
  return typeof item === "string" ? { text: item } : { text: item.text ?? "", content: item.content };
}

// A list entry: rich content rendered inline when present, else the legacy
// plain text with **bold** support.
//
// The wrapper must be a <div>, not a <span>: Payload's <RichText> always
// emits its own block-level wrapper (a <div class="payload-richtext">)
// around whatever it renders, even a single plain paragraph. A <span> can
// only contain phrasing content, so <span><div>...</div></span> is invalid
// HTML — the browser silently re-parents the <div> out from under the span,
// which then mismatches what React expects and trips a hydration error. See
// .rich-inline's CSS for how the result is still made to read as inline.
export function Cell({ item }: { item: RichItem }) {
  const row = toRow(item);
  if (hasLexical(row.content)) {
    return <div className="rich-inline"><RichBody data={row.content} /></div>;
  }
  return <Rich text={row.text} />;
}

// Paragraphs (richText legacy / reflection): each entry as its own block.
export function Paras({ items }: { items: RichItem[] }) {
  return (
    <>
      {items.map((item, i) => {
        const row = toRow(item);
        return hasLexical(row.content) ? (
          <RichBody key={i} data={row.content} />
        ) : (
          <p key={i}>
            <Rich text={row.text} />
          </p>
        );
      })}
    </>
  );
}
