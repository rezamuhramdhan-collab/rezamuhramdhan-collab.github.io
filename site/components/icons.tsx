// Small UI icons. Stroke-style, sized by parent containers.

import type { ComponentType } from "react";
import type { ButtonIconKey, ServiceIconKey } from "@/content/registry";

// Diagonal "go" arrow used on pill buttons and section links (↗).
export function ArrowUpRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M17 7H8M17 7V16" />
    </svg>
  );
}

export function ArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function ArrowBack() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

export function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

export function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

// Arrow inside a hairline circle — the "read more" affordance and the hero's
// secondary (ghost) button.
export function ArrowInCircle() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="9.2" />
      <path d="M6.6 11.9 13 5.6M7.9 5.6H13v5.1" />
    </svg>
  );
}

export function LinkedInIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M3.4 5.9h2.2V13H3.4V5.9Zm1.1-3.4a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM7.3 5.9h2.1v1h0a2.3 2.3 0 0 1 2.1-1.1c2.2 0 2.6 1.4 2.6 3.3V13h-2.2V9.5c0-.8 0-1.9-1.2-1.9s-1.3.9-1.3 1.8V13H7.3V5.9Z" />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.2" y="2.2" width="11.6" height="11.6" rx="3.4" />
      <circle cx="8" cy="8" r="2.9" />
      <circle cx="11.4" cy="4.6" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Generic fallback for a social network we have no mark for.
export function LinkIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.8 9.2a2.6 2.6 0 0 0 3.9.3l2-2a2.6 2.6 0 0 0-3.7-3.7l-1.1 1.1" />
      <path d="M9.2 6.8a2.6 2.6 0 0 0-3.9-.3l-2 2a2.6 2.6 0 0 0 3.7 3.7l1.1-1.1" />
    </svg>
  );
}

// Approach-strip icons. The CMS `services` entries carry no icon field, so
// these are assigned by position — see docs/desain.md adaptation notes.
export function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <circle cx="7" cy="7" r="4.6" />
      <path d="m10.4 10.4 3.2 3.2" />
    </svg>
  );
}

export function LayersIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1.8 14.4 5 8 8.2 1.6 5 8 1.8Z" />
      <path d="m1.6 8 6.4 3.2L14.4 8" />
      <path d="m1.6 11 6.4 3.2L14.4 11" />
    </svg>
  );
}

export function CodeIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5.4 5-3.2 3 3.2 3M10.6 5l3.2 3-3.2 3" />
    </svg>
  );
}

export function ChartIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="M2.4 13.6h11.2M4.6 13.6V8.4M8 13.6V3.6M11.4 13.6v-3.4" />
    </svg>
  );
}

// Keys come from content/registry.ts; the Record type makes a key added there
// a compile error here until its icon exists.
export const serviceIcons: Record<ServiceIconKey, ComponentType> = {
  search: SearchIcon,
  layers: LayersIcon,
  code: CodeIcon,
  chart: ChartIcon,
  // v1 keys still present on existing rows — mapped to their closest v3 mark.
  pen: SearchIcon,
  grid: LayersIcon,
  bulb: ChartIcon,
};

// Positional fallback for services with no icon set yet.
export const approachIcons = [SearchIcon, LayersIcon, CodeIcon, ChartIcon];

// The hero's isometric layer stack: a hairline grid behind four stacked
// isometric planes that grow toward the base, joined by dashed risers.
// Geometry transcribed from the Paper source (artboard 1-0, node 1O-0); the
// grid is a <pattern> rather than the 42 individual strokes the export emits.
// True isometric — every plane and content line keeps a sqrt(3):1 run/rise.
type Plane = {
  x: number;
  y: number;
  w: number; // half-width
  h: number; // half-height
  gradient?: boolean; // one plane fades out instead of a flat tint
  risers?: boolean; // dashed verticals down to the plane below
  lines: Array<{ x: number; y: number; len: number; drop: number; lead?: boolean }>;
};

const PLANES: Plane[] = [
  {
    x: 8.019, y: 67.568, w: 273.063, h: 157.658,
    lines: [
      { x: 59.279, y: 34.234, len: 220, drop: 127.027, lead: true },
      { x: 132.072, y: 76.306, len: 220.09, drop: 127.027 },
      { x: 204.955, y: 118.288, len: 220, drop: 127.027 },
    ],
  },
  {
    x: 47.028, y: 34.234, w: 234.054, h: 135.135, gradient: true, risers: true,
    lines: [
      { x: 59.279, y: 34.234, len: 180.991, drop: 104.505, lead: true },
      { x: 104.144, y: 60.18, len: 180.991, drop: 104.505 },
      { x: 149.009, y: 86.036, len: 180.991, drop: 104.505 },
      { x: 193.874, y: 111.982, len: 180.991, drop: 104.505 },
    ],
  },
  {
    x: 90.721, y: 3.604, w: 190.361, h: 109.91, risers: true,
    lines: [
      { x: 59.279, y: 34.234, len: 137.297, drop: 79.279, lead: true },
      { x: 104.505, y: 60.36, len: 137.388, drop: 79.279 },
      { x: 149.82, y: 86.487, len: 137.297, drop: 79.279 },
    ],
  },
  {
    x: 143.785, y: -21.622, w: 137.297, h: 79.279, risers: true,
    lines: [
      { x: 59.279, y: 34.234, len: 84.234, drop: 48.649, lead: true },
      { x: 100.631, y: 58.108, len: 84.234, drop: 48.649 },
    ],
  },
];

const RISER = 55.856;

export function WireframeStack() {
  return (
    <svg viewBox="0 0 562.16 468.47" fill="none" aria-hidden="true">
      <defs>
        <pattern id="wf-grid" width="27.027" height="27.027" patternUnits="userSpaceOnUse" x="10.811">
          <path d="M27.027 0H0V27.027" stroke="rgb(17 17 17 / 7%)" strokeWidth="0.541" />
        </pattern>
        <linearGradient id="wf-fade" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(17,17,17,0.05)" />
          <stop offset="1" stopColor="rgba(17,17,17,0)" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="562.16" height="468.47" fill="url(#wf-grid)" />
      {/* Painted base-first so the smaller upper planes sit in front. */}
      {PLANES.map((p, i) => {
        const d = `M${p.w} 0 L${p.w * 2} ${p.h} L${p.w} ${p.h * 2} L0 ${p.h} Z`;
        return (
          <g key={i} transform={`translate(${p.x} ${p.y})`}>
            <path d={d} fill={p.gradient ? "url(#wf-fade)" : "rgb(251 251 250 / 55%)"} />
            <path d={d} fill="none" stroke="rgb(17 17 17 / 50%)" strokeWidth="0.901" />
            {p.lines.map((l, j) => (
              <path
                key={j}
                d={`M${l.x + l.len} ${l.y} L${l.x} ${l.y + l.drop}`}
                stroke={l.lead ? "rgb(17 17 17 / 40%)" : "rgb(17 17 17 / 16%)"}
                strokeWidth={l.lead ? 1.441 : 0.811}
              />
            ))}
            {p.risers &&
              [[p.w, 0], [p.w * 2, p.h], [p.w, p.h * 2], [0, p.h]].map(([x, y], j) => (
                <path
                  key={`r${j}`}
                  d={`M${x} ${y} L${x} ${y + RISER}`}
                  stroke="rgb(17 17 17 / 20%)"
                  strokeWidth="0.721"
                  strokeDasharray="2.703 3.604"
                />
              ))}
          </g>
        );
      })}
    </svg>
  );
}

// Neutral placeholder shown in image slots with no uploaded media.
export function PhotoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

// Keys come from content/registry.ts; the Record type makes a key added there
// a compile error here until its icon exists (and vice versa).
export const buttonIcons: Record<ButtonIconKey, ComponentType> = {
  // v3 buttons take a plain right arrow. The diagonal ArrowUpRight is now used
  // only inside the circled "read case study" mark and on case-study links.
  arrow: ArrowRight,
  whatsapp: WhatsAppIcon,
  email: EmailIcon,
};
