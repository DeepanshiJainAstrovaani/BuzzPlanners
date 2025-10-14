import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // Temporarily disabled for development
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
