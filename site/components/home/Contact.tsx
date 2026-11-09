"use client";

import { useState } from "react";
import type { ContactSection, ServiceCard } from "@/content/types";
import { Chapter, ChapterEnd } from "../Chapter";

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
  const [composed, setComposed] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.email) return;
    const subject = `Project enquiry${service ? `: ${service}` : ""}${name ? ` from ${name}` : ""}`;
    const lines: string[] = [];
    if (name) lines.push(`Name: ${name}`);
    if (email) lines.push(`Email: ${email}`);
    if (service) lines.push(`Service: ${service}`);
    lines.push("", message);
    const body = lines.join("\n");
    setComposed(true);
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  const headline = [contact.headline, contact.headlineGhost].filter(Boolean).join(" ");

  return (
    <section className="section story-section story-contact" id="contact" data-story-chapter>
      <div className="px">
      <Chapter number="06" title="Remembering your name" />
      <div className="contact-card">
        <div className="contact-letterhead"><span className="letter-thread" aria-hidden="true" /><p className="section-context">{headline}</p><h2 className="display"><span>Let’s find </span><em>a shared direction.</em></h2></div>
        <p className="contact-note">Tell me your name and what you have in mind. This form prepares a draft in your email app, ready for you to review and send.</p>
        {contact.email ? <>
        <a className="btn contact-direct" href={`mailto:${contact.email}`}>Let’s make something <span aria-hidden="true">↗</span></a>
        <p className="contact-email"><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
        <details className="contact-compose"><summary>Write a message</summary>
        <form className="contact-form" onSubmit={submit}>
          <div className="form-grid">
            <div className="field">
              <label className="mono" htmlFor="c-name">Name</label>
              <input id="c-name" name="name" autoComplete="name" required type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label className="mono" htmlFor="c-email">Email</label>
              <input id="c-email" name="email" autoComplete="email" required type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
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
              <textarea id="c-message" name="message" required placeholder="Tell me about your project" value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
          </div>
          <div className="form-submit">
            <button className="btn-submit" type="submit">
              Compose email
            </button>
            {contact.email && (
              <p className="form-alt">
                Or write to <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </p>
            )}
            <p className="form-status" role="status">{composed ? "Your words are ready for the next part of the journey. Your email app should open with a draft. Review and send it there, or use the email link above." : ""}</p>
          </div>
        </form>
        </details>
        </> : <p className="contact-note">Contact details will be available soon.</p>}
      </div>
      <ChapterEnd>Somewhere between an idea and a message, a new story begins.</ChapterEnd>
      </div>
    </section>
  );
}
