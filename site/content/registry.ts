// Single source of truth for registry keys shared by the CMS schema
// (payload.config.ts select options) and the code registries (icons.tsx,
// thumbs.ts, content/types.ts unions). Adding a key here makes the compiler
// demand the matching icon/art everywhere else. Keep this module JSX-free so
// payload.config.ts can import it.

export const serviceIconKeys = ["pen", "grid", "bulb"] as const;
export type ServiceIconKey = (typeof serviceIconKeys)[number];

export const buttonIconKeys = ["arrow", "whatsapp", "email"] as const;
export type ButtonIconKey = (typeof buttonIconKeys)[number];

export const socialPlatformKeys = ["linkedin", "instagram", "email"] as const;
export type SocialPlatformKey = (typeof socialPlatformKeys)[number];

export const thumbnailKeys = [
  "bank-saqu",
  "banking-app",
  "saas-wireframes",
  "design-system",
  "banking-homepage",
] as const;
export type ThumbnailKey = (typeof thumbnailKeys)[number];
