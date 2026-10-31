import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel should run the Next.js App Router normally. Static export was
  // causing nested routes such as /profile to resolve to the 404 page.
  images: { unoptimized: true },
};

export default nextConfig;
