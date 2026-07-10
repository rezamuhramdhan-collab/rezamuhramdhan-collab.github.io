import { randomBytes, pbkdf2Sync, createCipheriv } from "crypto";
import type { ProjectLockBox } from "@/content/types";

// Build-time encryption for password-locked case studies. The browser-side
// counterpart (components/case/ProjectLock.tsx) decrypts with Web Crypto, so
// the parameters must stay WebCrypto-compatible: PBKDF2-SHA256 key derivation
// and AES-256-GCM with the auth tag appended to the ciphertext.

const ITERATIONS = 310_000;

export function encryptSections(sectionsJson: string, password: string): ProjectLockBox {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = pbkdf2Sync(password, salt, ITERATIONS, 32, "sha256");
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const data = Buffer.concat([cipher.update(sectionsJson, "utf8"), cipher.final(), cipher.getAuthTag()]);
  return {
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    data: data.toString("base64"),
    iterations: ITERATIONS,
  };
}
