import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Set by the GitHub Pages workflow ("/rise-academy"); empty locally so `npm run dev` stays at "/".
  basePath: process.env.PAGES_BASE_PATH,
  env: { BASE_PATH: process.env.PAGES_BASE_PATH ?? "" }, // for media files in public/, see asset() in lib/site.ts
  // Pages are written as admin/index.html, so both /admin and /admin/ open on GitHub Pages.
  trailingSlash: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
