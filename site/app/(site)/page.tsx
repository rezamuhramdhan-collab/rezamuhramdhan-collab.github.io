import { HomeNav } from "@/components/shared";
import { Hero, Approach, Experience, AboutSection } from "@/components/home/sections";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Contact } from "@/components/home/Contact";
import {
  getSiteSettings,
  getHero,
  getAbout,
  getContact,
  getServices,
  getExperience,
  getFeaturedProjects,
} from "@/lib/data";
import { personJsonLd, websiteJsonLd, jsonLdString } from "@/lib/seo";

// Homepage — every section renders from the CMS data layer.

export default async function HomePage() {
  const [settings, hero, about, contact, services, experience, projects] = await Promise.all([
    getSiteSettings(),
    getHero(),
    getAbout(),
    getContact(),
    getServices(),
    getExperience(),
    getFeaturedProjects(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(personJsonLd(hero, contact.socialLinks)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(websiteJsonLd(hero)) }}
      />
      <HomeNav settings={settings} />
      {/* v3 section order (docs/desain.md): the Approach strip sits directly
          under the hero, ahead of the work list. */}
      <Hero hero={hero} />
      <Approach services={services} />
      <FeaturedWork projects={projects} />
      <Experience experience={experience} />
      <AboutSection about={about} />
      <Contact contact={contact} services={services} />
    </>
  );
}
