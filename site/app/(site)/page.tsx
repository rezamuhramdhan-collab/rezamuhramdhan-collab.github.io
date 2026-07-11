import { HomeNav } from "@/components/shared";
import {
  Hero,
  FeaturedWork,
  Services,
  AboutExperience,
  CtaSection,
} from "@/components/home/sections";
import {
  getSiteSettings,
  getHero,
  getAbout,
  getCta,
  getServices,
  getExperience,
  getFeaturedProjects,
} from "@/lib/data";
import { personJsonLd, websiteJsonLd, jsonLdString } from "@/lib/seo";

// Homepage — every section renders from the CMS data layer (PRD §6).

export default async function HomePage() {
  const [settings, hero, about, cta, services, experience, projects] = await Promise.all([
    getSiteSettings(),
    getHero(),
    getAbout(),
    getCta(),
    getServices(),
    getExperience(),
    getFeaturedProjects(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(personJsonLd(hero)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(websiteJsonLd(hero)) }}
      />
      <HomeNav settings={settings} />
      <Hero hero={hero} />
      <FeaturedWork projects={projects} />
      <Services services={services} />
      <AboutExperience about={about} experience={experience} />
      <CtaSection cta={cta} />
    </>
  );
}
