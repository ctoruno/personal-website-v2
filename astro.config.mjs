// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.carlos-toruno.com',
  adapter: node({ mode: 'standalone' }),
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      // Light-text theme on dark ink; background is overridden to
      // --color-ink in global.css (handoff §8).
      theme: 'vesper',
      // `r` is not in Shiki's default bundle — register it explicitly,
      // along with the other languages the posts use.
      langs: ['r', 'python', 'bash', 'yaml'],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
