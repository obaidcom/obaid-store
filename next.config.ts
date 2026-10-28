import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages serves this repository under /obaid-store.
  // Static export is required because GitHub Pages does not run a Next.js server.
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === "production" ? "/obaid-store" : "",
};

export default nextConfig;
