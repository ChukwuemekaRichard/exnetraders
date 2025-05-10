/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['coin-images.coingecko.com'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  experimental: {
    turbo: {
      loaders: {}, // empty config (safe default)
    },
  },
};

export default nextConfig;
