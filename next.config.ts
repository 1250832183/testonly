import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  // Uncomment the following if you want to proxy API requests through Next.js
  // async rewrites() {
  //   const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.answer-ai.com/api/v1'
  //   return [
  //     {
  //       source: '/api/v1/:path*',
  //       destination: apiUrl + '/:path*',
  //     }
  //   ]
  // }
};

export default nextConfig;
