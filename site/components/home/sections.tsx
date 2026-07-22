import Image from "next/image";
import type {
  Hero as HeroData,
  About,
  CtaSection as CtaData,
  ServiceCard,
  ExperienceEntry,
} from "@/content/types";
import { Btn } from "../shared";
import { serviceIcons, socialIcons, ArrowDown } from "../icons";
import { RichBody } from "../case/rich-text";

// Full-bleed photo band: headline + primary CTA pinned to the bottom corners
// as an overlay, bio/socials folded into the same block. `hero.secondaryCta`
// ("Let's Talk") renders in the nav instead — see HomeNav in shared.tsx.
// `hero.profileCard` is no longer rendered by this layout (the portrait now
// fills the whole band rather than sitting in a separate card); the field
// stays in the schema and CMS for a future use, per design.md.
export function Hero({ hero }: { hero: HeroData }) {
  return (
    <header className="hero">
      {hero.portrait && hero.portrait.src !== "placeholder" && (
        <Image
          className="hero-bg"
          src={hero.portrait.src}
          alt={hero.portrait.alt}
          fill
          sizes="100vw"
          priority
          style={{ objectFit: "cover" }}
        />
      )}
      <div className="container hero-inner">
        <div>
          <p className="eyebrow hero-eyebrow">{hero.greeting}</p>
          <h1>{hero.roleHighlight}</h1>
          <p className="hero-bio">{hero.bio}</p>
          <div className="hero-secondary">
            <div className="socials">
              {hero.socialLinks.map((social, i) => {
                const Icon = socialIcons[social.platform];
                const external = social.href.startsWith("http");
                return (
                  <a
                    key={`${social.platform}-${i}`}
                    className="social-btn"
                    href={social.href}
                    aria-label={social.label}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener" : undefined}
                  >
                    <Icon />
                    {social.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <a className="hero-discover" href={hero.primaryCta.href}>
          {hero.primaryCta.label}
          <span className="arrow-chip" aria-hidden="true"><ArrowDown /></span>
        </a>
      </div>
    </header>
  );
}

export function Services({ services }: { services: ServiceCard[] }) {
  return (
    <section className="section-alt" id="services">
      <div className="container">
        <div className="services-header" data-reveal>
          <h2 className="section-heading">What I Do</h2>
          <p className="section-sub">
            I specialize in transforming complex problems into simple, beautiful solutions
          </p>
        </div>
        <div className="services-grid">
          {services.map((card) => {
            const Icon = serviceIcons[card.icon];
            return (
              <div key={card.id} className="service-card" data-reveal>
                <div className="service-icon"><Icon /></div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function AboutExperience({
  about,
  experience,
}: {
  about: About;
  experience: ExperienceEntry[];
}) {
  return (
    <section className="section-alt" id="about">
      <div className="container exp-inner">
        <div className="exp-statement" data-reveal>
          <h2>
            {about.headline} <span className="love">{about.headlineAccent}</span>
          </h2>
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p.replace("{years}", String(about.yearsExperience))}</p>
          ))}
        </div>
        <div className="exp-timeline">
          <h3 data-reveal>Experience</h3>
          <ul className="timeline">
            {experience.map((entry) => (
              <li key={entry.id} data-reveal>
                <div className="period">{entry.period}</div>
                <div className="role">{entry.role}</div>
                <a className="company" href={entry.companyLink}>{entry.company}</a>
                {entry.content ? (
                  <div className="desc rich"><RichBody data={entry.content} /></div>
                ) : (
                  <div className="desc">{entry.description}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function CtaSection({ cta }: { cta: CtaData }) {
  return (
    <section className="cta" id="contact">
      <div className="container">
        <h2 data-reveal>
          {cta.headline} <span className="great">{cta.headlineAccent}</span>
        </h2>
        <p data-reveal>{cta.subtext}</p>
        <div className="cta-actions" data-reveal>
          {cta.buttons.map((button) => (
            <Btn key={button.label} button={button} />
          ))}
        </div>
      </div>
    </section>
  );
}
