import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteFooter } from "@/components/shared";
import { getSiteSettings } from "@/lib/data";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Reza Ramdhan — Product Designer",
  description:
    "I craft beautiful, user-centered digital experiences that solve real problems. Specializing in product design, design systems, and brand identity.",
};

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}
