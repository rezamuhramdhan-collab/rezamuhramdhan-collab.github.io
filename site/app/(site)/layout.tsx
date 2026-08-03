import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/shared";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getSiteSettings, getHero } from "@/lib/data";
import { SITE_URL, IS_SECONDARY_DEPLOY } from "@/lib/seo";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";

// Paper Swiss type system (v3 — see docs/desain.md):
// Archivo — display face, SemiBold only: h1, section headings, project titles.
// Instrument Sans — body and UI: copy, nav, buttons, card and role titles.
// DM Mono — every small caps label: years, tags, date ranges, form labels.
// Both sans faces are variable; the design pins the width axis to default.
const archivo = localFont({
  src: "../fonts/archivo.woff2",
  weight: "100 900",
  variable: "--font-archivo",
  display: "swap",
});
const instrumentSans = localFont({
  src: "../fonts/instrumentsans.woff2",
  weight: "400 700",
  variable: "--font-instrument",
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
    <html lang="en" className={`${archivo.variable} ${instrumentSans.variable} ${dmMono.variable}`}>
      <body>
        {children}
        <SiteFooter settings={settings} />
        <ScrollReveal />
        <SpeedInsights />
      </body>
    </html>
  );
}
