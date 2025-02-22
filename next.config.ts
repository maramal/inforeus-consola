import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    crossOrigin: 'anonymous',
    images: {
        domains: ['storage.cloud.google.com']
    },
};

export default nextConfig;
