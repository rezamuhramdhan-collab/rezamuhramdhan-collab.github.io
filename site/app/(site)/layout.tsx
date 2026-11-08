import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { HomeNav, SiteFooter } from "@/components/shared";
import { JourneyEffects } from "@/components/JourneyEffects";
import { getSiteSettings, getHero } from "@/lib/data";
import { SITE_URL, IS_SECONDARY_DEPLOY } from "@/lib/seo";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";
import "../journey.css";

// The cinematic serif voice follows the owner's anime reference; sans-serif
// body text and locally hosted fonts keep the long case studies readable.
const playfair = localFont({
  src: "../fonts/playfair.woff2",
  weight: "400 900",
  variable: "--font-playfair",
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
const GOOGLE_TAG_ID = "G-9P2MJ72NW3";

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
    <html lang="en" className={`${playfair.variable} ${instrumentSans.variable} ${dmMono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <HomeNav settings={settings} />
        {children}
        <SiteFooter settings={settings} />
        <JourneyEffects />
        <SpeedInsights />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-tag" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_TAG_ID}');`}
        </Script>
      </body>
    </html>
  );
}
