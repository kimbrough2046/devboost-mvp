/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: false, // Fix: This must be an object, not a boolean
  },
};

export default nextConfig;
