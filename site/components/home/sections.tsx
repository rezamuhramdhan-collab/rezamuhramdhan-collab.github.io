import Link from "next/link";
import type {
  Hero as HeroData,
  About,
  CtaSection as CtaData,
  ServiceCard,
  ExperienceEntry,
  Project,
} from "@/content/types";
import { Btn } from "../shared";
import { serviceIcons, socialIcons, ArrowRight } from "../icons";
import { thumbnailSvg, portraitSvg } from "../thumbs";
import { RichBody } from "../case/rich-text";

export function Hero({ hero }: { hero: HeroData }) {
  return (
    <header className="hero">
      <div className="container hero-inner">
        <div>
          <h1>
            {hero.greeting}
            <span className="role">{hero.roleHighlight}</span>
          </h1>
          <p>{hero.bio}</p>
          <div className="hero-actions">
            <Btn button={hero.primaryCta} />
            <Btn button={hero.secondaryCta} />
          </div>
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
                </a>
              );
            })}
          </div>
        </div>
        <div className="hero-portrait">
          {hero.portrait && hero.portrait.src !== "placeholder" ? (
            <div className="portrait-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.portrait.src}
                alt={hero.portrait.alt}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ) : (
            <div className="portrait-card" dangerouslySetInnerHTML={{ __html: portraitSvg }} />
          )}
          <div className="identity-chip">
            <span className="avatar">{hero.profileCard.avatarInitial}</span>
            <span>
              <span className="name">{hero.profileCard.name}</span>
              <br />
              <span className="title">{hero.profileCard.subtitle}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function Thumb({ value }: { value: string }) {
  const svg = thumbnailSvg(value);
  if (svg) return <div dangerouslySetInnerHTML={{ __html: svg }} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
}

export function FeaturedWork({ projects }: { projects: Project[] }) {
  return (
    <section className="work" id="work">
      <div className="container">
        <h2 className="section-heading" data-reveal>Featured Work</h2>
        <p className="section-sub" data-reveal>A selection of projects I&rsquo;m proud of</p>
        <div className="work-grid">
          {projects.map((project) => (
            <Link key={project.id} className="project-card" href={`/work/${project.slug}`} data-reveal>
              <div className="project-thumb">
                <Thumb value={project.thumbnail} />
                <div className="thumb-overlay">
                  View Case Study
                  <ArrowRight />
                </div>
              </div>
              <div className="project-body">
                <div className="project-meta">
                  <span>{project.category}</span>
                  <span>{project.year}</span>
                </div>
                <div className="project-title">{project.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
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
