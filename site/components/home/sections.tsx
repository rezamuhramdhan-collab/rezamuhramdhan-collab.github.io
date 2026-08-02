import Image from "next/image";
import type {
  Hero as HeroData,
  About,
  ServiceCard,
  ExperienceEntry,
  HeroSocialLink,
} from "@/content/types";
import { lexicalToLines } from "@/lib/lexical";
import { Btn } from "../shared";
import {
  PhotoIcon,
  WireframeStack,
  ArrowRight,
  LinkedInIcon,
  InstagramIcon,
  EmailIcon,
  WhatsAppIcon,
  LinkIcon,
  approachIcons,
  serviceIcons,
} from "../icons";

const APPROACH_CELL_COUNT = 4;

// Two columns: the display name, bio, CTA and social row on the left; the
// isometric wireframe illustration on the right. v2's full-bleed portrait band
// has no equivalent in v3 — the hero sits on plain paper.
export function Hero({ hero }: { hero: HeroData }) {
  const socialLinks = hero.socialLinks;
  return (
    <header className="px hero" id="top">
      <div className="hero-grid">
        <div>
          <h1 className="display hero-name">
            {hero.firstName}
            {hero.lastName && (
              <>
                <br />
                {hero.lastName}
              </>
            )}
          </h1>
          {hero.bio && <p className="hero-bio">{hero.bio}</p>}
          <div className="hero-actions">
            <Btn button={hero.primaryCta} />
            {hero.secondaryCta && (
              <a className="btn btn-light" href={hero.secondaryCta.href}>
                {hero.secondaryCta.label}
                <ArrowRight />
              </a>
            )}
          </div>
          {socialLinks.length > 0 && (
            <div className="hero-socials">
              {socialLinks.slice(0, 3).map((social) => (
                <SocialButton key={social.label} social={social} />
              ))}
            </div>
          )}
        </div>
        <div className="hero-visual">
          <WireframeStack />
        </div>
      </div>
    </header>
  );
}

const SOCIAL_ICONS: Array<[RegExp, typeof LinkedInIcon]> = [
  [/linked/i, LinkedInIcon],
  [/insta/i, InstagramIcon],
  [/whats|wa\.me/i, WhatsAppIcon],
  [/mail|^mailto:/i, EmailIcon],
];

function SocialButton({ social }: { social: HeroSocialLink }) {
  const haystack = `${social.platform ?? ""} ${social.label} ${social.href}`;
  const Icon = SOCIAL_ICONS.find(([pattern]) => pattern.test(haystack))?.[1] ?? LinkIcon;
  const external = social.href.startsWith("http");
  return (
    <a
      href={social.href}
      aria-label={social.label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
    >
      <Icon />
    </a>
  );
}

// Four-up strip on one hairline card. Replaces v2's expandable service rows —
// the CMS `services` entries supply the title and description; the icons are
// assigned by position (no icon field exists yet).
export function Approach({ services }: { services: ServiceCard[] }) {
  const cells = services.slice(0, APPROACH_CELL_COUNT);
  if (!cells.length) return null;
  return (
    // id stays "services": the CMS nav links point at /#services.
    <section className="px section flush" id="services">
      {/* The design shows four cells; the grid follows however many the CMS
          actually has, so three entries fill the card evenly rather than
          leaving a dead fourth column. */}
      {/* Set as a custom property, not grid-template-columns directly — an
          inline track list would outrank the responsive media queries. */}
      <div
        className="approach"
        style={{ "--approach-cols": cells.length } as React.CSSProperties}
      >
        {cells.map((service, index) => {
          const Icon = service.icon
            ? serviceIcons[service.icon]
            : approachIcons[index % approachIcons.length];
          return (
            <div className="approach-cell" key={service.id} data-reveal>
              <span className="approach-icon">
                <Icon />
              </span>
              <h3 className="semi">{service.title}</h3>
              <p>{service.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Divided rows: mono date range on the left, role · company + description right.
export function Experience({ experience }: { experience: ExperienceEntry[] }) {
  return (
    <section className="px section" id="experience">
      <div className="sec-head" data-reveal>
        <h2 className="display">Experience</h2>
      </div>
      <ul className="exp-list">
        {experience.map((entry) => (
          <li className="exp-row" key={entry.id} data-reveal>
            <div className="exp-when mono">{entry.period}</div>
            <div>
              <h3 className="exp-role semi">
                {entry.role} <span className="company">· {entry.company}</span>
              </h3>
              {summaryLine(entry) && <p className="exp-desc">{summaryLine(entry)}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// v2 rendered the whole bullet list; v3's row is a single line of prose. Most
// CMS entries store their text in the rich `content` field and leave the legacy
// `description` empty, so fall back to the first line of the rich content —
// without it the rows render with no copy at all.
function summaryLine(entry: ExperienceEntry): string | undefined {
  const fromPlain = entry.description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)[0];
  return fromPlain ?? lexicalToLines(entry.content)[0];
}

// Portrait + definition list on the left, heading and copy on the right.
// The first paragraph gets the ink-90 lead treatment.
export function AboutSection({ about }: { about: About }) {
  const hasPhoto = about.image && about.image.src !== "placeholder";
  return (
    <section className="px section" id="about">
      <div className="sec-head" data-reveal>
        <h2 className="display">{about.headline}</h2>
      </div>
      <div className="about-grid">
        <div data-reveal>
          <div className="about-photo">
            {hasPhoto ? (
              <Image
                src={about.image!.src}
                alt={about.image!.alt || "Portrait"}
                width={about.image!.width ?? 600}
                height={about.image!.height ?? 640}
                sizes="(max-width: 1100px) 100vw, 389px"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div className="img-placeholder">
                <PhotoIcon />
              </div>
            )}
          </div>
        </div>
        <div className="about-body" data-reveal>
          {about.subheading && <h3 className="display h-about">{about.subheading}</h3>}
          {about.paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          {/* Fact list closes the copy column — two across, between hairlines.
              It sits under the text, not under the portrait. */}
          {(about.locationTag || about.skills.length > 0) && (
            <dl className="about-facts">
              {about.locationTag && (
                <div>
                  <dt className="mono">Based in</dt>
                  <dd>{about.locationTag}</dd>
                </div>
              )}
              {about.skills.length > 0 && (
                <div>
                  <dt className="mono">Tools</dt>
                  <dd>{about.skills.join(", ")}</dd>
                </div>
              )}
            </dl>
          )}
          {about.resumeButton?.label && <Btn button={about.resumeButton} />}
        </div>
      </div>
    </section>
  );
}
