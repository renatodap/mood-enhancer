import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable apostrophe escaping rule
    ignoreDuringBuilds: false,
  },
  /* config options here */
};

export default nextConfig;
