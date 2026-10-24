import type { APIRoute } from 'astro';
import { ES_DEMO } from '../lib/demo';
import { DEMO_MODE } from 'astro:env/server';

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify(
      {
        ES_DEMO,
        DEMO_MODE,
        proc: process.env.DEMO_MODE ?? null,
        envKeys: Object.keys(process.env).filter((k) => k.includes('DEMO')),
      },
      null,
      2,
    ),
    {
      headers: { 'content-type': 'application/json; charset=utf-8' },
    },
  );
};
