import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteFooter } from "@/components/shared";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getSiteSettings } from "@/lib/data";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "Reza Ramdhan — Product Designer",
    description:
      "I craft beautiful, user-centered digital experiences that solve real problems. Specializing in product design, design systems, and brand identity.",
    icons: settings.favicon ? { icon: settings.favicon.src } : undefined,
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <SiteFooter settings={settings} />
        <ScrollReveal />
      </body>
    </html>
  );
}
