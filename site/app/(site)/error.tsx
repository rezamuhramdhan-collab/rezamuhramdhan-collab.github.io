"use client";

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="case-cta">
      <div className="container">
        <h2>
          Something went <span style={{ color: "var(--accent)" }}>wrong</span>
        </h2>
        <p>An unexpected error occurred while loading this page.</p>
        <button className="btn btn-dark" onClick={reset} style={{ marginTop: 34 }}>
          Try Again
        </button>
      </div>
    </section>
  );
}
