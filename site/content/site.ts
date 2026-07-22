import type { SiteSettings, Hero, About, ContactSection } from "./types";

// ---------- Singletons (PRD §4.1) ----------

export const siteSettings: SiteSettings = {
  logoText: "Reza Ramdhan",
  navLinks: [
    { label: "Work", href: "/#work" },
    { label: "Services", href: "/#services" },
    { label: "Experience", href: "/#experience" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
  ctaButton: {
    label: "Resume",
    href: "/resume.pdf",
    variant: "dark",
    download: true,
    icon: "arrow",
  },
  footerText: "© 2026 Reza Ramdhan",
  footerLinks: [
    { label: "Work", href: "/#work" },
    { label: "Services", href: "/#services" },
    { label: "Experience", href: "/#experience" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
  backLink: { label: "Back", href: "/" },
  ctaFooter: {
    headline: "Interested in working together?",
    subtext: "Let's build something great.",
    button: { label: "Next Project", href: "/#work", variant: "dark", icon: "arrow" },
  },
};

export const hero: Hero = {
  eyebrow: "Product Designer",
  firstName: "Reza",
  lastName: "Ramdhan",
  portfolioTag: "Portfolio — 2026",
  bio: "Product Designer with 5+ years of experience in fintech and digital banking, specializing in solving complex user problems and contributing to product strategy.",
  primaryCta: { label: "View Work", href: "/#work", variant: "dark", icon: "arrow" },
};

export const about: About = {
  headline: "About",
  paragraphs: [
    "With over 5 years of experience in product design, I create user-centered solutions that balance business goals, technical constraints, and seamless user experiences.",
    "From discovery to delivery, I work closely with cross-functional teams to design intuitive products that solve real problems and drive measurable impact.",
  ],
  skills: [
    "Product Design",
    "Design Systems",
    "User Research",
    "Usability Testing",
    "Product Strategy",
    "Fintech & Banking",
  ],
  locationTag: "Jakarta, ID",
  resumeButton: {
    label: "Download Resume",
    href: "/resume.pdf",
    variant: "outline",
    download: true,
    icon: "arrow",
  },
};

export const contact: ContactSection = {
  eyebrow: "Get In Touch",
  headline: "Start a",
  headlineGhost: "Project",
  email: "rezamuhramdhan@gmail.com",
  location: "Jakarta, Indonesia (UTC+7)",
  availability: "Open for new projects",
  socialLinks: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/rezamramdhan/" },
    { label: "Instagram", href: "https://www.instagram.com/rezamrmdhn/" },
    { label: "WhatsApp", href: "https://wa.me/" },
  ],
};
