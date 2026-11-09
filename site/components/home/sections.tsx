import Image from "next/image";
import Link from "next/link";
import type {
  Hero as HeroData,
  About,
  ServiceCard,
  ExperienceEntry,
  HeroSocialLink,
} from "@/content/types";
import { lexicalToLines } from "@/lib/lexical";
import { Btn } from "../shared";
import { Chapter, ChapterEnd } from "../Chapter";
import { ArrivalComet } from "../JourneyEffects";
import {
  LinkedInIcon,
  InstagramIcon,
  EmailIcon,
  WhatsAppIcon,
  LinkIcon,
} from "../icons";

// Original sky artwork establishes the owner's anime-inspired direction.
// A navy overlay gives text a predictable contrast independently of the clouds.
export function Hero({ hero }: { hero: HeroData }) {
  const socialLinks = hero.socialLinks;
  return (
    <header className="hero" id="top">
      <svg className="twilight-landscape" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs><linearGradient id="landscape-sky" x2="0" y2="1"><stop stopColor="#293958"/><stop offset=".6" stopColor="#64617b"/><stop offset="1" stopColor="#b18487"/></linearGradient><linearGradient id="landscape-water" x2="0" y2="1"><stop stopColor="#8d839c"/><stop offset="1" stopColor="#142133"/></linearGradient></defs>
        <path fill="url(#landscape-sky)" d="M0 0h1440v900H0z"/>
        {[90,220,345,490,660,780,940,1090,1240,1360].map((x,i)=><circle key={x} cx={x} cy={80+(i*67)%290} r={i%3===0?1.5:1} fill="#f6e2dc" opacity=".55"/>)}
        <path d="M0 590 160 515 290 580 420 520 590 610 760 555 900 600 1080 510 1220 550 1350 490 1440 530V900H0Z" fill="#687088"/>
        <path d="M0 650 180 590 330 655 510 605 690 675 880 615 1030 650 1210 590 1440 650V900H0Z" fill="#3d506c"/>
        <path d="M0 760Q350 640 720 685T1440 710V900H0Z" fill="url(#landscape-water)"/>
        <g fill="#273b57">{Array.from({length:28},(_,i)=><g key={i}><rect x={790+i*23} y={650-(i*31)%100} width="17" height={130+(i*31)%100}/>{[0,1,2,3].map(j=><rect key={j} x={794+i*23} y={660-(i*31)%100+j*19} width="3" height="5" fill="#d9b7a4" opacity=".6"/>)}</g>)}</g>
        <path d="M0 700Q210 730 410 900H0Z M1440 765Q1230 745 1040 900H1440Z" fill="#142133"/>
        <path d="M0 830Q320 760 650 900H0Z" fill="#10192c"/>
      </svg>
      <div className="hero-shade" aria-hidden="true" />
      <div className="world-city" aria-hidden="true" /><div className="world-nature" aria-hidden="true" />
      <div className="world-thread" aria-hidden="true" /><ArrivalComet />
      <div className="px hero-content">
      <Chapter number="01" title="Two worlds" />
      <div className="hero-intro"><span>{[hero.firstName, hero.lastName].filter(Boolean).join(" ")}</span></div>
      <div className="hero-grid">
        <div>
          <h1 className="display hero-name">
            <span>Design brings </span><em>us closer.</em>
          </h1>
        </div>
        <div className="hero-context">
          {hero.bio && <p className="hero-bio">{hero.bio}</p>}
          <div className="hero-actions">
            <Btn button={hero.primaryCta} />
            {hero.secondaryCta && (
              <a className="btn btn-light" href={hero.secondaryCta.href}>
                {hero.secondaryCta.label}
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
      </div>
      <div className="hero-bottom"><a href="#work">Every connection leaves a story.</a><span aria-hidden="true">↓</span></div>
      </div>
    </header>
  );
}

const SOCIAL_ICONS: Record<NonNullable<HeroSocialLink["platform"]>, typeof LinkedInIcon> = {
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  whatsapp: WhatsAppIcon,
  email: EmailIcon,
};

const LEGACY_SOCIAL_ICONS: Array<[RegExp, typeof LinkedInIcon]> = [
  [/linked/i, LinkedInIcon],
  [/insta/i, InstagramIcon],
  [/whats|wa\.me/i, WhatsAppIcon],
  [/mail|^mailto:/i, EmailIcon],
];

function SocialButton({ social }: { social: HeroSocialLink }) {
  // The explicit CMS type wins even when an editor keeps the old label or URL.
  // Label/URL matching remains as a fallback for entries created before the
  // platform field was introduced.
  const legacyHaystack = `${social.label} ${social.href}`;
  const Icon = social.platform
    ? SOCIAL_ICONS[social.platform]
    : LEGACY_SOCIAL_ICONS.find(([pattern]) => pattern.test(legacyHaystack))?.[1] ?? LinkIcon;
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

// The existing services become steps along the search, without adding or
// truncating offerings from the CMS.
export function Approach({ services }: { services: ServiceCard[] }) {
  const cells = services;
  return (
    // id stays "services": the CMS nav links point at /#services.
    <section className="section story-section story-search" id="services" data-story-chapter>
      <div className="px">
      <Chapter number="03" title="The search" />
      <div className="sec-head"><h2 className="display"><span>A way through </span><em>the unknown.</em></h2><p className="section-note">How I work. Following the question until a clear direction appears.</p></div>
      <div className="approach">
        {cells.map((service, index) => {
          return (
            <div className="approach-cell" key={service.id} data-reveal>
              <span className="approach-number mono">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="semi">{service.title}</h3>
              <p>{service.description}</p>
            </div>
          );
        })}
      </div>
      {!cells.length && <p className="empty-state">This path is still being mapped. Service details will appear here when added.</p>}
      <ChapterEnd>Each step leaves something worth carrying forward.</ChapterEnd>
      </div>
    </section>
  );
}

// Divided rows: mono date range on the left, role · company + description right.
export function Experience({ experience }: { experience: ExperienceEntry[] }) {
  return (
    <section className="section story-section story-experience" id="experience" data-story-chapter>
      <div className="px">
      <Chapter number="Interlude" title="Along the way" />
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
              <ExperienceBullets entry={entry} />
            </div>
          </li>
        ))}
      </ul>
      {!experience.length && <p className="empty-state">The next chapter is still being written. Experience details will appear here when added.</p>}
      <ChapterEnd>The work is remembered. Here is the person behind it.</ChapterEnd>
      </div>
    </section>
  );
}

// Each achievement is its own bullet. Entries keep their text either as
// newline-separated plain text (`description`) or as rich `content`; both are
// flattened to one line per bullet.
function ExperienceBullets({ entry }: { entry: ExperienceEntry }) {
  const fromPlain = entry.description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const lines = (fromPlain.length ? fromPlain : lexicalToLines(entry.content))
    // Strip any authored numbering ("1. ", "2) ") so it doesn't double up with
    // the rendered marker.
    .map((line) => line.replace(/^\d+[.)]\s*/, "").trim())
    .filter(Boolean);
  if (!lines.length) return null;
  return (
    <ul className="exp-bullets">
      {lines.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
  );
}

// Portrait + definition list on the left, heading and copy on the right.
// The first paragraph gets the ink-90 lead treatment.
export function AboutSection({ about }: { about: About }) {
  const hasPhoto = about.image && about.image.src !== "placeholder";
  return (
    <section className="section story-section story-about" id="about" data-story-chapter>
      <div className="px">
      <Chapter number="01" title="The person behind the work" />
      <div className="sec-head" data-reveal>
        <div><h2 className="display"><span>Between people </span><em>and possibility.</em></h2></div>
      </div>
      <div className={`about-grid${hasPhoto ? "" : " without-photo"}`}>
        {hasPhoto && <div data-reveal>
          <div className="about-photo">
              <Image
                src={about.image!.src}
                alt={about.image!.alt || "Portrait"}
                width={about.image!.width ?? 600}
                height={about.image!.height ?? 640}
                sizes="(max-width: 1100px) 100vw, 389px"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
          </div>
        </div>}
        <div className="about-body" data-reveal>
          <p className="personal-note">I care about the moment a complicated task begins to make sense.</p>
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
        </div>
      </div>
      <ChapterEnd>Every shared story carries a few voices with it.</ChapterEnd>
      </div>
    </section>
  );
}

export function TwilightMeeting() {
  return <section className="section story-section story-twilight" id="reflections" data-story-chapter>
    <div className="px twilight-inner" data-reveal>
      <Chapter number="05" title="Twilight meeting" />
      <h2 className="display"><span>Some stories arrive </span><em>through other people.</em></h2>
      <div className="reflection-empty"><span className="memory-mark" aria-hidden="true">“</span><p>There is room here for their words.</p><p>Approved reflections from collaborators will appear here when added. For now, the case studies share the work in detail.</p><Link className="btn btn-light" href="/work">Read the case studies</Link></div>
      <ChapterEnd>Until our paths cross, a message can close the distance.</ChapterEnd>
    </div>
  </section>;
}
