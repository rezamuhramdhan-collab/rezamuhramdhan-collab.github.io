import Link from "next/link";
import Image from "next/image";
import type { ButtonItem, SiteSettings } from "@/content/types";
import { buttonIcons } from "./icons";
import { StickyNavShell } from "./StickyNavShell";

// 6px-radius button. `variant` maps the CMS value onto the two v3 looks:
// dark → solid ink fill; outline → hairline on paper. `small` is the compact
// nav button. The trailing arrow follows the label (design convention).
export function Btn({ button, small }: { button: ButtonItem; small?: boolean }) {
  const Icon = button.icon ? buttonIcons[button.icon] : null;
  const look = button.variant === "outline" ? "btn-light" : "btn-accent";
  const external = button.href.startsWith("http");
  return (
    <a
      className={`btn ${look}${small ? " small" : ""}`}
      href={button.href}
      download={button.download || undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
    >
      {button.label}
      {Icon && <Icon />}
    </a>
  );
}

export function HomeNav({ settings }: { settings: SiteSettings }) {
  const { logoText, logoImage, navLinks, ctaButton } = settings;
  return (
    <StickyNavShell>
      <Link className="nav-mark" href="/" aria-label={logoText}>
        {logoImage ? (
          logoImage.width && logoImage.height ? (
            <Image
              className="logo-img"
              src={logoImage.src}
              alt={logoImage.alt || logoText}
              width={logoImage.width}
              height={logoImage.height}
              sizes="120px"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="logo-img" src={logoImage.src} alt={logoImage.alt || logoText} />
          )
        ) : (
          // Monogram tile + full wordmark, sitting inside the filled chip.
          <>
            <span className="nav-monogram" aria-hidden="true">
              {logoText.trim()[0]?.toUpperCase() ?? ""}
            </span>
            {logoText}
          </>
        )}
      </Link>
      <div className="nav-links">
        {navLinks.map((link) => (
          <Link key={link.label} href={link.href}>{link.label}</Link>
        ))}
      </div>
      <div className="nav-cta">
        <Btn button={ctaButton} small />
      </div>
    </StickyNavShell>
  );
}

// Two mono lines, copyright left and links right. v2's giant ghost signature
// was part of the display-italic "second voice" pattern, which v3 doesn't have.
export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const { footerText, footerLinks } = settings;
  return (
    <footer className="site-footer">
      <div className="px">
        <div className="footer-row">
          <span className="mono">{footerText}</span>
          <div className="flinks mono">
            {footerLinks.map((link) => (
              <a key={link.label} href={link.href}>{link.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
