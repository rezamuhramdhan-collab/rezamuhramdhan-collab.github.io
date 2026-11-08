import Link from "next/link";
export default function NotFound() {
  return <main className="px page-state" id="main-content"><div className="state-comet" aria-hidden="true" /><p className="chapter-label">404 / A missed crossing</p><h1>We just missed each other.</h1><p>This page may have moved, but the thread still leads home.</p><Link className="btn btn-accent" href="/">Follow the thread home</Link> <Link className="btn btn-light" href="/work">Find a case study</Link></main>;
}
