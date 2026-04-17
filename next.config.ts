import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: '/am',
        destination: '/',
        permanent: true, // 301 redirect to tell Google to update its index
      },
      // You can also catch trailing slashes or subpaths if needed, but '/am' covers the main issue
    ];
  },
};

export default nextConfig;
