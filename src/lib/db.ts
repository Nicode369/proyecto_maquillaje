import { neon } from '@neondatabase/serverless';
import { NEON_DATABASE_URL } from 'astro:env/server';

if (!NEON_DATABASE_URL) {
  throw new Error(
    'Falta NEON_DATABASE_URL. Copia .env.example a .env y configúralo.',
  );
}

export const sql = neon(NEON_DATABASE_URL);
