"use client";

import { useEffect, useState } from "react";
import type { ProjectLockBox, SectionBlock } from "@/content/types";
import { CaseSections } from "./sections";

// Client-side gate for password-locked case studies. The page ships only the
// AES-256-GCM ciphertext (see lib/lock.ts); the correct password derives the
// key (PBKDF2-SHA256) and decrypts locally — a wrong password fails the GCM
// auth check, so there is nothing to compare against or leak.

const fromB64 = (value: string) => Uint8Array.from(atob(value), (c) => c.charCodeAt(0));

async function decryptSections(lock: ProjectLockBox, password: string): Promise<SectionBlock[]> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: fromB64(lock.salt), iterations: lock.iterations, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64(lock.iv) }, key, fromB64(lock.data));
  return JSON.parse(new TextDecoder().decode(plain)) as SectionBlock[];
}

export function ProjectLock({ slug, lock }: { slug: string; lock: ProjectLockBox }) {
  const [sections, setSections] = useState<SectionBlock[] | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const tryUnlock = async (candidate: string, remember: boolean) => {
    if (!candidate) return;
    setBusy(true);
    setError(false);
    try {
      const decrypted = await decryptSections(lock, candidate);
      if (remember) sessionStorage.setItem(`project-lock:${slug}`, candidate);
      setSections(decrypted);
    } catch {
      setError(remember); // silent for the auto-unlock attempt
    }
    setBusy(false);
  };

  // Re-unlock without prompting if this session already entered the password.
  useEffect(() => {
    const saved = sessionStorage.getItem(`project-lock:${slug}`);
    if (saved) void tryUnlock(saved, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (sections) return <CaseSections sections={sections} />;

  return (
    <form
      className="lock-card"
      onSubmit={(e) => {
        e.preventDefault();
        void tryUnlock(password, true);
      }}
    >
      <span className="lock-icon" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </span>
      <h2>This case study is protected</h2>
      <p>Enter the password to view the full project details.</p>
      <input
        className="lock-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        aria-label="Project password"
        autoComplete="off"
      />
      {error && <p className="lock-error">That password isn&rsquo;t right — please try again.</p>}
      <button className="btn btn-accent" type="submit" disabled={busy || !password}>
        {busy ? "Unlocking…" : "Unlock"}
      </button>
    </form>
  );
}
