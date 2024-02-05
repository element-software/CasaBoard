/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "build",
  trailingSlash: true,
  output: "export",
  basePath: `/local/${process.env.VITE_FOLDER_NAME || "dashboard"}`,
  images: {
    unoptimized: true,
  }
};

module.exports = nextConfig;
