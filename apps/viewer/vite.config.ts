import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");

/**
 * Thin shims so transitive UI imports of Next APIs do not break the Vite build.
 * The static viewer never uses these modules directly.
 */
function nextShimPlugin() {
  const linkShim = path.resolve(__dirname, "src/shims/next-link.tsx");
  const navShim = path.resolve(__dirname, "src/shims/next-navigation.ts");
  const imageShim = path.resolve(__dirname, "src/shims/next-image.tsx");

  return {
    name: "casaboard-next-shim",
    enforce: "pre" as const,
    resolveId(id: string) {
      if (id === "next/link") return linkShim;
      if (id === "next/navigation") return navShim;
      if (id === "next/image") return imageShim;
      return null;
    },
  };
}

export default defineConfig({
  plugins: [nextShimPlugin(), react(), tailwindcss()],
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
      output: {
        entryFileNames: "assets/viewer.js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: (info) => {
          if (info.name && info.name.endsWith(".css")) {
            return "assets/viewer.css";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
  resolve: {
    alias: [
      {
        find: /^@repo\/lib(?:\/.*)?$/,
        replacement: path.resolve(__dirname, "src/shims/repo-lib.ts"),
      },
      {
        find: "@repo/ui",
        replacement: path.resolve(repoRoot, "packages/ui"),
      },
      {
        find: "@repo/ha",
        replacement: path.resolve(repoRoot, "packages/ha"),
      },
      {
        find: "@repo/types",
        replacement: path.resolve(repoRoot, "packages/types"),
      },
      {
        find: "@repo/hooks",
        replacement: path.resolve(repoRoot, "packages/hooks"),
      },
      {
        find: "@repo/utils",
        replacement: path.resolve(repoRoot, "packages/utils"),
      },
      {
        find: "@repo/config",
        replacement: path.resolve(repoRoot, "packages/config"),
      },
    ],
  },
  server: {
    port: 5173,
  },
});
