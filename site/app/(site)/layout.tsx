import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/shared";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getSiteSettings, getHero } from "@/lib/data";
import { SITE_URL, IS_SECONDARY_DEPLOY } from "@/lib/seo";
import "../globals.css";

// Editorial-dark type system (see docs/design.md):
// Playfair Display — display face for the hero name, section headings, card
// and role titles (has a distinct italic used for the "ghost" second voice).
// DM Mono — all small labels: eyebrows, numbers, dates, meta, footer links.
// Manrope — body/UI text, buttons, nav links (variable weight 200–800).
const playfair = localFont({
  src: [
    { path: "../fonts/playfair.woff2", weight: "300 900", style: "normal" },
    { path: "../fonts/playfair-italic.woff2", weight: "400 900", style: "italic" },
  ],
  variable: "--font-playfair",
  display: "swap",
});
const dmMono = localFont({
  src: [
    { path: "../fonts/dmmono-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/dmmono-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-dmmono",
  display: "swap",
});
const manrope = localFont({
  src: "../fonts/manrope.woff2",
  weight: "200 800",
  variable: "--font-manrope",
  display: "swap",
});

const SITE_TITLE = "Reza Ramdhan — Product Designer";
const SITE_DESCRIPTION =
  "I craft beautiful, user-centered digital experiences that solve real problems. Specializing in product design, design systems, and brand identity.";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, hero] = await Promise.all([getSiteSettings(), getHero()]);
  const portrait =
    hero.portrait && hero.portrait.src !== "placeholder" ? hero.portrait.src : undefined;
  return {
    // All relative URLs below (canonical, OG) resolve against the canonical
    // domain — on the secondary Pages copy this yields cross-domain
    // canonicals back to the primary.
    metadataBase: new URL(SITE_URL),
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    alternates: { canonical: "/" },
    // The static Pages export is a copy: crawlable but not indexed.
    robots: IS_SECONDARY_DEPLOY ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      siteName: SITE_TITLE,
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      url: "/",
      ...(portrait ? { images: [portrait] } : {}),
    },
    twitter: {
      card: portrait ? "summary_large_image" : "summary",
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
    },
    icons: settings.favicon ? { icon: settings.favicon.src } : undefined,
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <html lang="en" className={`${playfair.variable} ${dmMono.variable} ${manrope.variable}`}>
      <body>
        {children}
        <SiteFooter settings={settings} />
        <ScrollReveal />
      </body>
    </html>
  );
}
