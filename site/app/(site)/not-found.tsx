import Link from "next/link";

export default function NotFound() {
  return (
    <section className="case-cta">
      <div className="container">
        <h2>
          Page <span style={{ color: "var(--accent)" }}>not found</span>
        </h2>
        <p>The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.</p>
        <Link className="btn btn-dark" href="/" style={{ marginTop: 34 }}>
          Back to Home
        </Link>
      </div>
    </section>
  );
}
