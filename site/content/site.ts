import type { SiteSettings, Hero, About, CtaSection } from "./types";

// ---------- Singletons (PRD §4.1) ----------

export const siteSettings: SiteSettings = {
  logoText: "RR",
  navLinks: [
    { label: "Work", href: "/#work" },
    { label: "Services", href: "/#services" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
  ctaButton: {
    label: "Download Resume",
    href: "/resume.pdf",
    variant: "dark",
    download: true,
  },
  footerText: "© 2026 Reza Ramdhan. All rights reserved.",
  footerLinks: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
  backLink: { label: "Back to Home", href: "/" },
  ctaFooter: {
    headline: "Interested in working together?",
    subtext: "Let's discuss your next project",
    button: { label: "Back to Home", href: "/#contact", variant: "dark" },
  },
};

export const hero: Hero = {
  greeting: "Hi, I'm Reza Ramdhan",
  roleHighlight: "Product Designer.",
  bio: "I craft beautiful, user-centered digital experiences that solve real problems. Specializing in product design, design systems, and brand identity.",
  primaryCta: { label: "View My Work", href: "/#work", variant: "dark", icon: "arrow" },
  secondaryCta: { label: "Let's Talk", href: "/#contact", variant: "outline" },
  socialLinks: [
    { platform: "linkedin", href: "https://www.linkedin.com/in/rezamramdhan/", label: "LinkedIn" },
    { platform: "instagram", href: "https://www.instagram.com/rezamrmdhn/", label: "Instagram" },
    { platform: "email", href: "mailto:rezamramdhan@gmail.com", label: "Email" },
  ],
  profileCard: {
    name: "Reza Ramdhan",
    subtitle: "Product Designer at Figma",
    avatarInitial: "R",
  },
};

export const about: About = {
  headline: "I design products that people",
  headlineAccent: "love to use.",
  paragraphs: [
    "With over {years} years of experience in product design, I've had the privilege of working with some of the most innovative companies in tech.",
    "My approach combines strategic thinking with meticulous attention to detail, ensuring every design decision is both beautiful and purposeful.",
  ],
  yearsExperience: 6,
};

export const cta: CtaSection = {
  headline: "Let's build something",
  headlineAccent: "great",
  subtext:
    "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
  buttons: [
    { label: "WhatsApp Me", href: "#", variant: "dark", icon: "whatsapp" },
    { label: "Send Email", href: "mailto:rezamramdhan@gmail.com", variant: "outline", icon: "email" },
  ],
};
