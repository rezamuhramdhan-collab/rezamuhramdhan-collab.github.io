import type { ReactNode } from "react";

// The server-rendered shell remains visible without JavaScript. Active-location
// and mobile-dialog behavior live in the small client navigation components.
export function StickyNavShell({ children }: { children: ReactNode }) {
  return (
    <nav className="site-nav">
      <div className="px nav-inner">{children}</div>
    </nav>
  );
}
