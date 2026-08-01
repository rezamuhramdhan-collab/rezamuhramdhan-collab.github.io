// Single source of truth for registry keys shared by the CMS schema
// (payload.config.ts select options) and the code registries (icons.tsx,
// thumbs.ts, content/types.ts unions). Adding a key here makes the compiler
// demand the matching icon/art everywhere else. Keep this module JSX-free so
// payload.config.ts can import it.

export const buttonIconKeys = ["arrow", "whatsapp", "email"] as const;
export type ButtonIconKey = (typeof buttonIconKeys)[number];

// v3 revived `services.icon` and `hero.socialLinks` — the Approach strip gives
// every service an icon tile, and the hero has its own social row. New keys are
// appended; the v1 keys stay so existing rows keep resolving (and so the enum
// change is purely additive — see the note below).
export const serviceIconKeys = [
  "search",
  "layers",
  "code",
  "chart",
  // v1 keys, retained so existing rows still resolve.
  "pen",
  "grid",
  "bulb",
] as const;
export type ServiceIconKey = (typeof serviceIconKeys)[number];

export const socialPlatformKeys = ["linkedin", "instagram", "whatsapp", "email"] as const;
export type SocialPlatformKey = (typeof socialPlatformKeys)[number];

// Retained only as select options for deprecated, admin-hidden v1 fields kept
// in the schema so the Supabase schema push stays purely additive (removing
// their columns would make drizzle push prompt "created or renamed?" and hang
// in CI). See payload.config.ts "Deprecated".
export const thumbnailKeys = [
  "bank-saqu",
  "banking-app",
  "saas-wireframes",
  "design-system",
  "banking-homepage",
] as const;
