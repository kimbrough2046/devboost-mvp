/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,  // Helps catch potential issues in React
  swcMinify: true,        // Uses SWC compiler for better performance
  experimental: {
    serverActions: true,  // Enables Next.js server actions for better API handling
  },
};

export default nextConfig;
