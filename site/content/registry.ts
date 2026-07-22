// Single source of truth for registry keys shared by the CMS schema
// (payload.config.ts select options) and the code registries (icons.tsx,
// thumbs.ts, content/types.ts unions). Adding a key here makes the compiler
// demand the matching icon/art everywhere else. Keep this module JSX-free so
// payload.config.ts can import it.

export const buttonIconKeys = ["arrow", "whatsapp", "email"] as const;
export type ButtonIconKey = (typeof buttonIconKeys)[number];

// Retained only as select options for deprecated, admin-hidden v1 fields kept
// in the schema so the Supabase schema push stays purely additive (removing
// their columns would make drizzle push prompt "created or renamed?" and hang
// in CI). The v2 UI does not use these. See payload.config.ts "Deprecated".
export const serviceIconKeys = ["pen", "grid", "bulb"] as const;
export const socialPlatformKeys = ["linkedin", "instagram", "email"] as const;
export const thumbnailKeys = [
  "bank-saqu",
  "banking-app",
  "saas-wireframes",
  "design-system",
  "banking-homepage",
] as const;
