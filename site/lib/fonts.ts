import localFont from "next/font/local";

export const plusJakarta = localFont({
  src: [
    { path: "../public/fonts/plus-jakarta-sans.woff2", weight: "200 800", style: "normal" },
    { path: "../public/fonts/plus-jakarta-sans-italic.woff2", weight: "200 800", style: "italic" },
  ],
  variable: "--font-jakarta",
  display: "swap",
});
