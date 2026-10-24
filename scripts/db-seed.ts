import { neon } from '@neondatabase/serverless';
import { sembrarDemo } from '../src/lib/seed/demo.ts';

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  console.error(
    'Falta DATABASE_URL. Ejecuta `neon env pull` y luego: node --env-file-if-exists=.env scripts/db-seed.ts',
  );
  process.exit(1);
}

const sql = neon(url);
const resumen = await sembrarDemo(sql);

console.log(
  `✔ Seed aplicado: ${resumen.clientas} clientas, ${resumen.productos} productos, ` +
    `${resumen.ventas} ventas (${resumen.ventasCredito} a crédito), ` +
    `${resumen.abonos} abonos, ${resumen.gastos} gastos.`,
);
