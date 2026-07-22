// Single source of truth for registry keys shared by the CMS schema
// (payload.config.ts select options) and the code registries (icons.tsx,
// thumbs.ts, content/types.ts unions). Adding a key here makes the compiler
// demand the matching icon/art everywhere else. Keep this module JSX-free so
// payload.config.ts can import it.

export const buttonIconKeys = ["arrow", "whatsapp", "email"] as const;
export type ButtonIconKey = (typeof buttonIconKeys)[number];
