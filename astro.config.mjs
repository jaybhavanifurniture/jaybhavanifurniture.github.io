import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://jaybhavanifurniture.github.io',
  output: 'static',

  image: {
    domains: ['images.unsplash.com'],
  },

  integrations: [
    sitemap(),
    react(),
    icon({
      include: {
        tabler: ['*'],
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
