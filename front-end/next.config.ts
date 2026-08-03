import type { NextConfig } from "next";

const API_TARGET = process.env.API_PROXY_TARGET || 'http://localhost:8000'

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_APP_DOMAIN || '**',
        pathname: '/storage/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  httpAgentOptions: {
    keepAlive: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_TARGET}/api/:path*`,
      },
      {
        source: '/sanctum/:path*',
        destination: `${API_TARGET}/sanctum/:path*`,
      },
      {
        source: '/storage/:path*',
        destination: `${API_TARGET}/storage/:path*`,
      },
      {
        source: '/broadcasting/:path*',
        destination: `${API_TARGET}/broadcasting/:path*`,
      },
    ]
  },
};

export default nextConfig;
