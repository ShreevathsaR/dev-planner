import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@dev-planner/trpc",
    "@dev-planner/schema",
    "@dev-planner/prisma",
    "@dev-planner/email",
  ],
  experimental: {
    externalDir: true,
  },
  images: {
    domains: ["lh3.googleusercontent.com", "api.dicebear.com"],
  },
};

export default nextConfig;
