import Image from "next/image";
import type { Hero as HeroData, About, ServiceCard, ExperienceEntry } from "@/content/types";
import { Btn } from "../shared";
import { PhotoIcon } from "../icons";
import { RichBody } from "../case/rich-text";
import { ServiceAccordion } from "./ServiceAccordion";

// Full-bleed portrait band with a bottom gradient; eyebrow + "Portfolio — YYYY"
// tag on one row, the two-line solid/ghost name, then bio + View Work pill.
// The nav (HomeNav) is rendered separately and overlays this as a fixed header.
export function Hero({ hero }: { hero: HeroData }) {
  const hasPhoto = hero.portrait && hero.portrait.src !== "placeholder";
  return (
    <header className="hero" id="top">
      <div className="hero-photo">
        {hasPhoto && (
          <Image
            src={hero.portrait!.src}
            alt={hero.portrait!.alt || `${hero.firstName ?? ""} ${hero.lastName ?? ""}`.trim()}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 20%" }}
          />
        )}
      </div>
      <div className="hero-content">
        <div className="hero-eyebrow-row">
          {hero.eyebrow && <span className="eyebrow">{hero.eyebrow}</span>}
          {hero.portfolioTag && <span className="hero-tag">{hero.portfolioTag}</span>}
        </div>
        <h1 className="hero-name">
          {hero.firstName}
          {hero.lastName && <span className="ghost">{hero.lastName}</span>}
        </h1>
        <div className="hero-sub">
          {hero.bio && <p className="hero-bio">{hero.bio}</p>}
          <Btn button={hero.primaryCta} />
        </div>
      </div>
    </header>
  );
}

// Numbered service rows with an independently expandable client-side detail.
export function Services({ services }: { services: ServiceCard[] }) {
  return (
    <section className="section px" id="services">
      <div className="services-grid">
        <div className="services-intro" data-reveal>
          <span className="eyebrow">What I Offer</span>
          <h2>
            Service<span className="accent-s">s</span>
          </h2>
          <p>I specialize in transforming complex problems into simple, beautiful solutions.</p>
        </div>
        <ServiceAccordion services={services} />
      </div>
    </section>
  );
}

// One-third intro / two-thirds right-aligned role list (design.md geometry).
// Each role: title + Company · Type · Location meta line, accent date, and a
// grey round-dot bullet list from the rich `content` (or newline-split text).
export function Experience({ experience }: { experience: ExperienceEntry[] }) {
  return (
    <section className="section px" id="experience">
      <div className="exp-grid">
        <div className="exp-intro" data-reveal>
          <span className="eyebrow">Career</span>
          <h2>Experience</h2>
          <p>
            5+ years across fintech and digital banking — designing and shipping onboarding,
            lending, and design-system work that moves real product metrics.
          </p>
        </div>
        <div className="exp-list">
          {experience.map((entry) => (
            <div className="exp-item" key={entry.id} data-reveal>
              <div className="exp-head">
                <div className="exp-role">
                  <h3>{entry.role}</h3>
                  <div className="exp-meta">
                    <span className="company">{entry.company}</span>
                    {entry.employmentType && (
                      <>
                        <span className="div" />
                        <span className="tag">{entry.employmentType}</span>
                      </>
                    )}
                    {entry.location && (
                      <>
                        <span className="div" />
                        <span className="tag">{entry.location}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className="exp-date">{entry.period}</span>
              </div>
              <ExperienceBullets entry={entry} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceBullets({ entry }: { entry: ExperienceEntry }) {
  if (entry.content) {
    return (
      <div className="exp-bullets rich">
        <RichBody data={entry.content} />
      </div>
    );
  }
  const bullets = entry.description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (!bullets.length) return null;
  return (
    <ul className="exp-bullets">
      {bullets.map((line, i) => (
        <li key={i}>
          <span className="dot" />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}

// Portrait with an accent location tag + copy, skills grid, and résumé button.
export function AboutSection({ about }: { about: About }) {
  const hasPhoto = about.image && about.image.src !== "placeholder";
  return (
    <section className="section about px" id="about">
      <div className="about-grid">
        <div className="about-photo" data-reveal>
          {hasPhoto ? (
            <Image
              src={about.image!.src}
              alt={about.image!.alt || "Portrait"}
              width={about.image!.width ?? 600}
              height={about.image!.height ?? 640}
              sizes="(max-width: 900px) 100vw, 600px"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div className="img-placeholder"><PhotoIcon /></div>
          )}
          {about.locationTag && <span className="about-tag">{about.locationTag}</span>}
        </div>
        <div className="about-body" data-reveal>
          <span className="eyebrow">Who I Am</span>
          <h2>{about.headline}</h2>
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {about.skills.length > 0 && (
            <ul className="skills">
              {about.skills.map((skill) => (
                <li key={skill}>
                  <span className="dot" />
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          )}
          {about.resumeButton && <Btn button={about.resumeButton} />}
        </div>
      </div>
    </section>
  );
}
