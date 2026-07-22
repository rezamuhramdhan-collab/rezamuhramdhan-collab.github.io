import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/shared";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getSiteSettings, getHero } from "@/lib/data";
import { SITE_URL, IS_SECONDARY_DEPLOY } from "@/lib/seo";
import "../globals.css";

// Anton: display face for headlines, the footer wordmark, and card titles —
// always used uppercase. Archivo: body/UI text, variable weight 100–900.
const anton = localFont({
  src: "../fonts/anton.woff2",
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});
const archivo = localFont({
  src: "../fonts/archivo.woff2",
  weight: "100 900",
  variable: "--font-archivo",
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
    <html lang="en" className={`${anton.variable} ${archivo.variable}`}>
      <body>
        {children}
        <SiteFooter settings={settings} />
        <ScrollReveal />
      </body>
    </html>
  );
}
