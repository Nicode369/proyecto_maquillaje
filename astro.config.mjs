// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.SITE_URL || 'https://proyecto-maquillaje.vercel.app',
  output: 'server',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      DATABASE_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      SESSION_SECRET: envField.string({ context: 'server', access: 'secret' }),
      DASHBOARD_PASSWORD: envField.string({ context: 'server', access: 'secret' }),
      BRAND_NAME: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
        default: 'Valeria Eslava',
      }),
      DEMO_MODE: envField.boolean({
        context: 'server',
        access: 'secret',
        optional: true,
        default: false,
      }),
      DEMO_RESET_DATABASE_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      SITE_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },
});
