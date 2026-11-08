"use client";
export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return <main className="px page-state" id="main-content"><div className="state-comet" aria-hidden="true" /><p className="chapter-label">A pause in the journey</p><h1>The connection slipped.</h1><p>This page couldn’t load. Please try again, or follow the thread back home.</p><button className="btn btn-accent" onClick={reset}>Try this page again</button> <a className="btn btn-light" href="/">Return home</a></main>;
}
