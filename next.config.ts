import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the full Next.js runtime enabled for server-side authentication,
  // protected admin routes, and server-only integrations on Vercel.
  trailingSlash: true,
};

export default nextConfig;
