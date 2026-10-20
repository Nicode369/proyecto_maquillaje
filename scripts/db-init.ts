import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  console.error(
    'Falta DATABASE_URL. Ejecuta `neon env pull` y luego: node --env-file-if-exists=.env scripts/db-init.ts',
  );
  process.exit(1);
}

const sql = neon(url);

const raw = readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8');
const statements = raw
  .split('\n')
  .filter((line) => !line.trim().startsWith('--'))
  .join('\n')
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement, []);
}

console.log(`✔ Esquema aplicado (${statements.length} sentencias).`);
