import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@eduavatar/db", "@eduavatar/types", "@eduavatar/config"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "models.readyplayer.me" },
      { protocol: "https", hostname: "*.amazonaws.com" },
    ],
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: "canvas" }];
    return config;
  },
};

export default nextConfig;
