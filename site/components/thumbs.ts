// Placeholder project thumbnails, keyed by Project.thumbnail.
// Raw SVG markup (rendered via dangerouslySetInnerHTML) so the placeholder art
// stays byte-identical to the static site. Swapping a project to a real image
// is a data change: point Project.thumbnail at an uploaded asset instead.

import type { ThumbnailKey } from "@/content/registry";

// A key listed in content/registry.ts without art here is a compile error.
export const thumbnails: Record<ThumbnailKey, string> = {
  "bank-saqu": `<svg viewBox="0 0 560 368" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#3A3D44"/><stop offset="1" stop-color="#181A1F"/>
      </linearGradient>
    </defs>
    <rect width="560" height="368" fill="url(#g1)"/>
    <rect x="200" y="60" width="150" height="290" rx="26" fill="#0E1116" transform="rotate(-14 275 205)"/>
    <rect x="210" y="70" width="130" height="270" rx="18" fill="#F4F5F7" transform="rotate(-14 275 205)"/>
    <rect x="252" y="82" width="44" height="8" rx="4" fill="#0E1116" transform="rotate(-14 275 205)"/>
  </svg>`,

  "banking-app": `<svg viewBox="0 0 560 368" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#8B6B45"/><stop offset="1" stop-color="#5C4630"/>
      </linearGradient>
      <linearGradient id="g2s" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#6D28D9"/><stop offset="1" stop-color="#8B5CF6"/>
      </linearGradient>
    </defs>
    <rect width="560" height="368" fill="url(#g2)"/>
    <path d="M0 330 Q80 260 40 368 Z" fill="#3E5C34"/>
    <rect x="180" y="30" width="200" height="380" rx="30" fill="#111" transform="rotate(9 280 220)"/>
    <rect x="190" y="42" width="180" height="356" rx="22" fill="url(#g2s)" transform="rotate(9 280 220)"/>
    <text x="286" y="120" font-family="Inter, sans-serif" font-size="22" font-weight="700" fill="#fff" text-anchor="middle" transform="rotate(9 280 220)">Unveiling Insights,</text>
    <text x="286" y="148" font-family="Inter, sans-serif" font-size="22" font-weight="700" fill="#fff" text-anchor="middle" transform="rotate(9 280 220)">One Thought at a Time</text>
    <rect x="236" y="180" width="104" height="26" rx="13" fill="rgba(255,255,255,0.25)" transform="rotate(9 280 220)"/>
    <circle cx="240" cy="260" r="18" fill="#F3D6C2" transform="rotate(9 280 220)"/>
    <circle cx="288" cy="260" r="18" fill="#D8B48F" transform="rotate(9 280 220)"/>
    <circle cx="336" cy="260" r="18" fill="#B98A62" transform="rotate(9 280 220)"/>
  </svg>`,

  "saas-wireframes": `<svg viewBox="0 0 560 368" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <rect width="560" height="368" fill="#EDEDEA"/>
    <g stroke="#8A8A85" stroke-width="1.5" fill="#FAFAF8">
      <rect x="18" y="18" width="120" height="150" rx="4"/>
      <rect x="152" y="18" width="120" height="150" rx="4"/>
      <rect x="286" y="18" width="120" height="150" rx="4"/>
      <rect x="420" y="18" width="120" height="150" rx="4"/>
      <rect x="18" y="184" width="120" height="150" rx="4"/>
      <rect x="152" y="184" width="120" height="150" rx="4"/>
      <rect x="286" y="184" width="120" height="150" rx="4"/>
      <rect x="420" y="184" width="120" height="150" rx="4"/>
    </g>
    <g stroke="#A9A9A4" stroke-width="1.2" fill="none">
      <rect x="30" y="32" width="96" height="34" rx="2"/><line x1="30" y1="84" x2="126" y2="84"/><line x1="30" y1="96" x2="110" y2="96"/><line x1="30" y1="108" x2="118" y2="108"/>
      <circle cx="212" cy="56" r="18"/><line x1="164" y1="92" x2="260" y2="92"/><line x1="164" y1="104" x2="244" y2="104"/>
      <rect x="298" y="32" width="42" height="42" rx="2"/><rect x="352" y="32" width="42" height="42" rx="2"/><line x1="298" y1="92" x2="394" y2="92"/>
      <rect x="432" y="32" width="96" height="18" rx="9"/><rect x="432" y="58" width="96" height="18" rx="9"/><line x1="432" y1="96" x2="528" y2="96"/>
      <rect x="30" y="198" width="96" height="34" rx="2"/><line x1="30" y1="250" x2="126" y2="250"/><line x1="30" y1="262" x2="112" y2="262"/>
      <circle cx="212" cy="222" r="18"/><line x1="164" y1="258" x2="260" y2="258"/><line x1="164" y1="270" x2="248" y2="270"/>
      <rect x="298" y="198" width="96" height="50" rx="2"/><line x1="298" y1="266" x2="394" y2="266"/>
      <rect x="432" y="198" width="42" height="42" rx="2"/><rect x="486" y="198" width="42" height="42" rx="2"/><line x1="432" y1="258" x2="528" y2="258"/>
    </g>
  </svg>`,

  "design-system": `<svg viewBox="0 0 560 368" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="g4" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#23262C"/><stop offset="1" stop-color="#101216"/>
      </linearGradient>
    </defs>
    <rect width="560" height="368" fill="url(#g4)"/>
    <rect x="60" y="50" width="300" height="200" rx="8" fill="#15181D" stroke="#3A3F47" stroke-width="2"/>
    <g fill="#2E3440">
      <rect x="76" y="66" width="130" height="168"/>
    </g>
    <g fill="#4C566A">
      <rect x="84" y="76" width="114" height="8" rx="2"/><rect x="84" y="92" width="90" height="8" rx="2"/><rect x="84" y="108" width="104" height="8" rx="2"/>
    </g>
    <rect x="216" y="66" width="128" height="80" fill="#1F3D2B"/>
    <rect x="224" y="74" width="50" height="30" fill="#34D399" opacity=".7"/>
    <rect x="282" y="74" width="52" height="30" fill="#F59E0B" opacity=".6"/>
    <rect x="224" y="112" width="110" height="26" fill="#EF4444" opacity=".45"/>
    <rect x="216" y="154" width="128" height="80" fill="#252A32"/>
    <g fill="#5E81AC"><rect x="224" y="162" width="112" height="6" rx="2"/><rect x="224" y="174" width="88" height="6" rx="2"/><rect x="224" y="186" width="100" height="6" rx="2"/></g>
    <rect x="380" y="90" width="130" height="180" rx="8" fill="#15181D" stroke="#3A3F47" stroke-width="2"/>
    <g fill="#88C0D0"><rect x="392" y="104" width="106" height="8" rx="2"/><rect x="392" y="120" width="80" height="8" rx="2"/><rect x="392" y="136" width="96" height="8" rx="2"/></g>
    <rect x="140" y="278" width="280" height="14" rx="4" fill="#2E333B"/>
  </svg>`,

  "banking-homepage": `<svg viewBox="0 0 560 368" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="g5" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#7C5A3C"/><stop offset="1" stop-color="#4E3A26"/>
      </linearGradient>
      <linearGradient id="g5s" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#5B21B6"/><stop offset="1" stop-color="#7C3AED"/>
      </linearGradient>
    </defs>
    <rect width="560" height="368" fill="url(#g5)"/>
    <rect x="170" y="20" width="210" height="400" rx="32" fill="#111" transform="rotate(-7 275 220)"/>
    <rect x="181" y="32" width="188" height="376" rx="24" fill="url(#g5s)" transform="rotate(-7 275 220)"/>
    <text x="278" y="116" font-family="Inter, sans-serif" font-size="23" font-weight="700" fill="#fff" text-anchor="middle" transform="rotate(-7 275 220)">Unveiling Insights,</text>
    <text x="278" y="146" font-family="Inter, sans-serif" font-size="23" font-weight="700" fill="#fff" text-anchor="middle" transform="rotate(-7 275 220)">One Thought at a Time</text>
    <rect x="226" y="176" width="110" height="28" rx="14" fill="rgba(255,255,255,0.25)" transform="rotate(-7 275 220)"/>
    <circle cx="230" cy="262" r="19" fill="#F3D6C2" transform="rotate(-7 275 220)"/>
    <circle cx="280" cy="262" r="19" fill="#D8B48F" transform="rotate(-7 275 220)"/>
    <circle cx="330" cy="262" r="19" fill="#B98A62" transform="rotate(-7 275 220)"/>
  </svg>`,
};

// Project.thumbnail holds either a registry key or an uploaded-media URL;
// this resolves the key case without widening the record above.
export function thumbnailSvg(value: string): string | undefined {
  return (thumbnails as Record<string, string | undefined>)[value];
}

// Hero portrait placeholder silhouette
export const portraitSvg = `<svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg">
  <circle cx="150" cy="110" r="58" fill="#C9CCD2"/>
  <path d="M150 180c-62 0-104 44-104 140h208c0-96-42-140-104-140z" fill="#C9CCD2"/>
  <path d="M150 52c-30 0-52 24-52 56 0 8 24-18 52-18s52 26 52 18c0-32-22-56-52-56z" fill="#B01E3C"/>
</svg>`;
