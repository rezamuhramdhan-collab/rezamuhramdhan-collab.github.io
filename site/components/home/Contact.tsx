"use client";

import { useState } from "react";
import type { ContactSection, ServiceCard } from "@/content/types";
import { ArrowUpRight } from "../icons";

// "Start a Project" — contact info column + a form that composes an email to
// the address in `contact.email` (mailto:). No backend needed, so it works on
// both the Vercel site and the static Pages mirror. Requires JS to build the
// mailto link; without JS the fields are still visible and the email address
// above is a live mailto link.
export function Contact({
  contact,
  services,
}: {
  contact: ContactSection;
  services: ServiceCard[];
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.email) return;
    const subject = `Project enquiry${service ? ` — ${service}` : ""}${name ? ` from ${name}` : ""}`;
    const lines: string[] = [];
    if (name) lines.push(`Name: ${name}`);
    if (email) lines.push(`Email: ${email}`);
    if (service) lines.push(`Service: ${service}`);
    lines.push("", message);
    const body = lines.join("\n");
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="section contact px" id="contact">
      {contact.eyebrow && <span className="eyebrow">{contact.eyebrow}</span>}
      <h2>
        {contact.headline}
        {contact.headlineGhost && <span className="ghost">{contact.headlineGhost}</span>}
      </h2>
      <div className="contact-grid">
        <div className="contact-info">
          {contact.email && (
            <div className="c-item">
              <span className="c-label">Email</span>
              <a className="c-value" href={`mailto:${contact.email}`}>
                {contact.email}
                <ArrowUpRight />
              </a>
            </div>
          )}
          {contact.location && (
            <div className="c-item">
              <span className="c-label">Location</span>
              <div className="c-value">{contact.location}</div>
            </div>
          )}
          {contact.availability && (
            <div className="c-item">
              <span className="c-label">Availability</span>
              <div className="c-value">{contact.availability}</div>
            </div>
          )}
          {contact.socialLinks.length > 0 && (
            <div className="c-socials">
              {contact.socialLinks.map((social) => {
                const external = social.href.startsWith("http");
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener" : undefined}
                  >
                    {social.label}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <form className="contact-form" onSubmit={submit}>
          <div className="form-row">
            <div className="field">
              <label htmlFor="c-name">Name</label>
              <input id="c-name" type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="c-email">Email</label>
              <input id="c-email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="c-service">Service</label>
            <select id="c-service" value={service} onChange={(e) => setService(e.target.value)}>
              <option value="">Select a service</option>
              {services.map((s) => (
                <option key={s.id} value={s.title}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="c-message">Message</label>
            <textarea id="c-message" placeholder="Tell me about your project..." value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <div className="form-submit">
            <button className="btn btn-accent" type="submit">
              Send Message
              <ArrowUpRight />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
