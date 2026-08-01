"use client";

import { useState } from "react";
import type { ContactSection, ServiceCard } from "@/content/types";
import { ArrowRight } from "../icons";

// The closing ink card: headline + four-field form. The form composes an email
// to `contact.email` (mailto:) — there is still no backend, so this works on
// both the Vercel site and the static Pages mirror. Requires JS to build the
// mailto link; without it the fields are still visible and the "Or write to"
// line below the button is a live mailto fallback.
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

  const headline = [contact.headline, contact.headlineGhost].filter(Boolean).join(" ");

  return (
    <section className="section px" id="contact">
      <div className="contact-card">
        <h2 className="display">{headline}</h2>
        <form className="contact-form" onSubmit={submit}>
          <div className="form-grid">
            <div className="field">
              <label className="mono" htmlFor="c-name">Name</label>
              <input id="c-name" type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label className="mono" htmlFor="c-email">Email</label>
              <input id="c-email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field wide">
              <label className="mono" htmlFor="c-service">Service</label>
              <div className="select-wrap">
                <select
                  id="c-service"
                  className={service ? "has-value" : undefined}
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field wide">
              <label className="mono" htmlFor="c-message">Message</label>
              <textarea id="c-message" placeholder="Tell me about your project" value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
          </div>
          <div className="form-submit">
            <button className="btn-submit" type="submit">
              Send message
              <ArrowRight />
            </button>
            {contact.email && (
              <p className="form-alt">
                Or write to <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
