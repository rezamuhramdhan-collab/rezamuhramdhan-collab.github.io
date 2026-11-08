"use client";

import { plusJakarta } from "@/lib/fonts";
import "./globals.css";
import "./journey.css";

// Independent of CMS availability and the normal public layout.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return <html lang="en" data-atmosphere="paused" className={plusJakarta.variable}>
    <head><title>Connection paused | Reza Ramdhan</title><meta name="robots" content="noindex" /></head>
    <body>
      <nav className="site-nav" aria-label="Recovery navigation"><div className="px nav-inner"><a className="nav-mark" href="/">Reza Ramdhan</a></div></nav>
      <main className="px page-state" id="main-content"><div className="state-comet" aria-hidden="true" /><p className="chapter-label">A pause in the journey</p><h1>Let’s pick up the thread.</h1><p>The site couldn’t finish loading. Please try again, or return home when the connection is ready.</p><button type="button" className="btn btn-accent" onClick={reset}>Try loading again</button> <a className="btn btn-light" href="/">Return home</a></main>
      <footer className="site-footer"><div className="px footer-story"><p>We can find our way back.</p></div></footer>
    </body>
  </html>;
}
