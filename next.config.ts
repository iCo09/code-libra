import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.leetcode.com",
      },
      {
        protocol: "https",
        hostname: "leetcode.com",
      },
    ],
  },

};

export default nextConfig;
