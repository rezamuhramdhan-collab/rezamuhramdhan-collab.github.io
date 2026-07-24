import Link from "next/link";
import Image from "next/image";
import type { ButtonItem, SiteSettings } from "@/content/types";
import { buttonIcons } from "./icons";
import { StickyNavShell } from "./StickyNavShell";

// Pill button. `variant` maps the CMS value onto the two v2 looks:
// dark → solid accent fill; outline → light (paper) fill. `small` is the
// compact nav pill. The trailing arrow follows the label (design convention).
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
          // Show just the initials as the wordmark when it's a text logo.
          initials(logoText)
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

// "Reza Ramdhan" → "RR" (first + last initial), italicising the second letter
// to echo the display type's solid/italic pairing. Single word → first letter.
function initials(text: string) {
  const parts = text.trim().split(/\s+/);
  if (parts.length < 2) return parts[0]?.[0]?.toUpperCase() ?? text;
  return (
    <>
      {parts[0][0].toUpperCase()}
      <span className="it">{parts[parts.length - 1][0].toUpperCase()}</span>
    </>
  );
}

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const { footerText, footerLinks, logoText } = settings;
  return (
    <footer className="site-footer">
      <div className="footer-row">
        <div className="flinks">
          {footerLinks.map((link) => (
            <a key={link.label} href={link.href}>{link.label}</a>
          ))}
        </div>
        <span className="copy">{footerText}</span>
      </div>
      <div className="ghost-sign" aria-hidden="true">{logoText}</div>
    </footer>
  );
}
