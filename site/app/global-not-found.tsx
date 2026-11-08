import type { Metadata } from "next";
import SiteLayout from "./(site)/layout";
import NotFound from "./(site)/not-found";

export const metadata: Metadata = {
  title: "Page not found | Reza Ramdhan",
  robots: { index: false, follow: true },
};

// Global fallback bypasses routing/layout selection; reuse the full public
// document so unmatched URLs get the same fonts, navigation and recovery UI.
export default function GlobalNotFound() {
  return <SiteLayout><NotFound /></SiteLayout>;
}
