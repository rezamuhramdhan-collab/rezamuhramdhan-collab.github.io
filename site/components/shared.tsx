import Link from "next/link";
import Image from "next/image";
import type { ButtonItem, SiteSettings } from "@/content/types";
import { buttonIcons } from "./icons";

export function Btn({ button, small }: { button: ButtonItem; small?: boolean }) {
  const Icon = button.icon ? buttonIcons[button.icon] : null;
  const className = `btn btn-${button.variant}${small ? " btn-sm" : ""}`;
  const external = button.href.startsWith("http");
  return (
    <a
      className={className}
      href={button.href}
      download={button.download || undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
    >
      {button.icon === "arrow" ? (
        <>
          {button.label}
          {Icon && <Icon />}
        </>
      ) : (
        <>
          {Icon && <Icon />}
          {button.label}
        </>
      )}
    </a>
  );
}

export function HomeNav({ settings }: { settings: SiteSettings }) {
  const { logoText, logoImage, navLinks, ctaButton } = settings;
  return (
    <nav>
      <div className="container nav-inner">
        <Link className="logo" href="/" aria-label={logoText}>
          {logoImage ? (
            // Through next/image so the optimizer serves a tiny variant sized to
            // the 32px-tall display (sizes hint) instead of the full upload.
            // The plain <img> fallback covers uploads missing intrinsic dims,
            // which next/image needs to reserve space.
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
              <img className="logo-img" src={logoImage.src} alt={logoImage.alt || logoText} />
            )
          ) : (
            logoText
          )}
        </Link>
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href}>{link.label}</Link>
          ))}
        </div>
        <Btn button={ctaButton} small />
      </div>
    </nav>
  );
}

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const { footerText, footerLinks } = settings;
  return (
    <footer>
      <div className="container footer-inner">
        <span>{footerText}</span>
        <span className="footer-links">
          {footerLinks.map((link, i) => (
            <span key={link.label} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {i > 0 && <span>·</span>}
              <a href={link.href}>{link.label}</a>
            </span>
          ))}
        </span>
      </div>
    </footer>
  );
}
