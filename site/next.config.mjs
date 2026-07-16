import { withPayload } from "@payloadcms/next/withPayload";

// STATIC_EXPORT=1 produces the static build for GitHub Pages (the Payload
// admin routes are removed by CI before this build — Pages can't run them).

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.STATIC_EXPORT ? { output: "export" } : {}),
  images: {
    // The static Pages export has no image optimizer — it gets the original
    // files. The Vercel deployment (the canonical site) serves resized,
    // modern-format variants via /_next/image.
    unoptimized: Boolean(process.env.STATIC_EXPORT),
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default withPayload(nextConfig);
