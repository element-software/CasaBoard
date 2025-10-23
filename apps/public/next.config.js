/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "casaboard.dev",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
      },
    ],
  },
};

export default nextConfig;
