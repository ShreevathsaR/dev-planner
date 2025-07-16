import type { NextConfig } from "next";

const nextConfig: NextConfig = {

    transpilePackages: [
        '@dev-planner/trpc',
        '@dev-planner/schema',
        '@dev-planner/prisma',
        '@dev-planner/email',
    ],
    experimental:{
        externalDir: true,
    }
};

export default nextConfig;
