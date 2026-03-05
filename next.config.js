/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    return [
      {
        source: '/ads.txt',
        destination: '/api/ads-txt',
      },
      {
        source: '/api/cities/:path*',
        destination: `${apiUrl}/api/cities/:path*`,
      },
      {
        source: '/api/search',
        destination: `${apiUrl}/api/search`,
      },
      {
        source: '/api/countries',
        destination: `${apiUrl}/api/countries`,
      },
      {
        source: '/api/states/:path*',
        destination: `${apiUrl}/api/states/:path*`,
      },
      {
        source: '/api/nearby',
        destination: `${apiUrl}/api/nearby`,
      },
      {
        source: '/api/timezone/:path*',
        destination: `${apiUrl}/api/timezone/:path*`,
      },
    ];
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
};

module.exports = nextConfig;
