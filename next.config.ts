import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://103.103.20.102/api/:path*", // backend HTTP
      },
    ];
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '103.103.20.102',
        port: '',
        pathname: '/files/public/**',
      },
    ],
  },

  eslint: {
    // Warning: this allows production builds to succeed even if there are ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
