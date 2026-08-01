import type { ReactNode } from "react";

// v3: the header is sticky and always carries its translucent paper ground and
// hairline, so there is no scrolled/unscrolled state to track — this no longer
// needs to be a client component.
export function StickyNavShell({ children }: { children: ReactNode }) {
  return (
    <nav className="site-nav">
      <div className="px nav-inner">{children}</div>
    </nav>
  );
}
