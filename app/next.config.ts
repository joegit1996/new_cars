import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.bankboubyan.com" },
      { protocol: "https", hostname: "moteryapp.com" },
      { protocol: "https", hostname: "bmw.scene7.com" },
      { protocol: "https", hostname: "files.alialghanimsons.com.kw" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
};

export default nextConfig;
