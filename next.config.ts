import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Comment out static export for now due to complex dynamic routes
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
