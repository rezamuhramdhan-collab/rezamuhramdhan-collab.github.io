import { withPayload } from "@payloadcms/next/withPayload";

// STATIC_EXPORT=1 produces the static build for GitHub Pages (the Payload
// admin routes are removed by CI before this build — Pages can't run them).

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.STATIC_EXPORT ? { output: "export" } : {}),
  experimental: {
    // The global stylesheet is only ~7 KiB. Inlining it removes the extra
    // render-blocking request and its critical network dependency.
    inlineCss: true,
  },
  images: {
    // The static Pages export has no image optimizer — it gets the original
    // files. The Vercel deployment (the canonical site) serves resized,
    // modern-format variants via /_next/image.
    unoptimized: Boolean(process.env.STATIC_EXPORT),
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      // Next's client entry always includes compatibility polyfills for APIs
      // already available in the modern browsers this portfolio supports.
      // Replacing that side-effect-only module removes the legacy-JS payload.
      config.resolve.alias["../build/polyfills/polyfill-module"] = false;
    }
    return config;
  },
};

const payloadConfig = withPayload(nextConfig);
const payloadHeaders = payloadConfig.headers;
const colorSchemeHint = "Sec-CH-Prefers-Color-Scheme";

// Payload enables a critical color-scheme client hint for every route. Chrome
// then repeats the first public-page request to attach that hint, which
// Lighthouse reports as a redirect and a duplicate critical dependency. The
// portfolio has a fixed dark theme, so scope those headers to the CMS instead.
payloadConfig.headers = async () => {
  const rules = typeof payloadHeaders === "function" ? await payloadHeaders() : [];
  const publicRules = rules.map((rule) => ({
    ...rule,
    headers: (rule.headers ?? []).filter(
      ({ key, value }) =>
        !(
          ["accept-ch", "critical-ch", "vary"].includes(key.toLowerCase()) &&
          value === colorSchemeHint
        ),
    ),
  }));

  return [
    ...publicRules,
    {
      source: "/admin/:path*",
      headers: [
        { key: "Accept-CH", value: colorSchemeHint },
        { key: "Vary", value: colorSchemeHint },
        { key: "Critical-CH", value: colorSchemeHint },
      ],
    },
  ];
};

export default payloadConfig;
