/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://dev.api.swiftprotocol.zone/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
