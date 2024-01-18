/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "build",
  trailingSlash: true,
  output: "export",
  basePath: "/local/ha-nextjs-dashboard",
};

module.exports = nextConfig;
