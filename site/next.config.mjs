import { withPayload } from "@payloadcms/next/withPayload";

// STATIC_EXPORT=1 produces the static build for GitHub Pages (the Payload
// admin routes are removed by CI before this build — Pages can't run them).

/** @type {import('next').NextConfig} */
const nextConfig = process.env.STATIC_EXPORT ? { output: "export" } : {};

export default withPayload(nextConfig);
