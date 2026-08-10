import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://dethanev.app",
  output: "static",
  compressHTML: true,
  build: {
    inlineStylesheets: "always",
  },
  integrations: [mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    shikiConfig: {
      theme: "vesper",
      wrap: true,
    },
  },
});
