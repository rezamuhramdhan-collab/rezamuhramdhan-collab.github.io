import Link from "next/link";
import Image from "next/image";
import type { ButtonItem, SiteSettings } from "@/content/types";
import { buttonIcons } from "./icons";
import { StickyNavShell } from "./StickyNavShell";
import { MobileNav } from "./MobileNav";
import { DesktopNav } from "./DesktopNav";

// Existing CMS variants retain their actions; the journey theme supplies the
// primary red and secondary glass treatments.
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
  // A logoText that is already an abbreviation ("RR") belongs in the tile on its
  // own — pairing it with its own first letter would read "R RR".
  const isMonogramText = !logoImage && !/\s/.test(logoText) && logoText.trim().length <= 3;
  return (
    <StickyNavShell>
      {/* Wordmark = dark tile + name. The tile carries the uploaded logo when
          there is one, otherwise the initial. Keeping the tile dark matters:
          logos drawn for the v2 dark theme are near-white and would vanish on
          the v3 paper chip. */}
      <Link className="nav-mark" href="/" aria-label={logoText}>
        <svg className="nav-star" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M16 1v30M1 16h30M5.4 5.4l21.2 21.2M26.6 5.4 5.4 26.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="16" cy="16" r="2" fill="currentColor" />
        </svg>
        <span className="nav-monogram" aria-hidden={logoImage ? undefined : "true"}>
          {logoImage ? (
            logoImage.width && logoImage.height ? (
              <Image
                className="logo-img"
                src={logoImage.src}
                alt={logoImage.alt || logoText}
                width={logoImage.width}
                height={logoImage.height}
                sizes="32px"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="logo-img" src={logoImage.src} alt={logoImage.alt || logoText} width={28} height={28} />
            )
          ) : isMonogramText ? (
            logoText.trim().toUpperCase()
          ) : (
            logoText.trim()[0]?.toUpperCase() ?? ""
          )}
        </span>
        {!isMonogramText && logoText}
      </Link>
      <DesktopNav links={navLinks} />
      <div className="nav-cta">
        <Btn button={ctaButton} small />
      </div>
      <MobileNav links={navLinks} cta={ctaButton} />
    </StickyNavShell>
  );
}

// The quiet final scene preserves the copyright and every CMS footer link.
export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const { footerText, footerLinks } = settings;
  return (
    <footer className="site-footer">
      <div className="px">
        <div className="footer-story"><p className="chapter-label">After the story</p><p>Some paths cross for a reason.</p><span>Thank you for following mine.</span></div>
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
