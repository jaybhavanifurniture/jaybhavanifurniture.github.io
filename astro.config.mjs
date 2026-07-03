import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://jaybhavanifurniture.github.io',
  output: 'static',

  integrations: [
    sitemap(),
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
