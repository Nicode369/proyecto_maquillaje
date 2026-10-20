// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      NEON_DATABASE_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      SESSION_SECRET: envField.string({ context: 'server', access: 'secret' }),
      DASHBOARD_PASSWORD: envField.string({ context: 'server', access: 'secret' }),
    },
  },
});
