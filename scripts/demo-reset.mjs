// Restaura el demo: aplica el esquema, trunca las tablas y vuelve a sembrar
// datos ficticios en una sola transacción.
//
// Uso local:
//   DEMO_RESET_DATABASE_URL="postgresql://..." node scripts/demo-reset.mjs --confirm
//
// DESTRUCTIVO: borra todos los datos de la base indicada. Nunca apuntes esta
// variable a la base de producción.
import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';
import { sembrarDemo } from '../src/lib/seed/demo.ts';

const url = process.env.DEMO_RESET_DATABASE_URL;
if (!url) {
  console.error(
    'Falta DEMO_RESET_DATABASE_URL. Configúrala solo para el entorno demo (no uses DATABASE_URL de producción).',
  );
  process.exit(1);
}

if (!process.argv.includes('--confirm')) {
  console.error(
    'Este comando borra y vuelve a sembrar la base demo.\n' +
      'Vuelve a ejecutarlo con --confirm si es la base correcta.',
  );
  process.exit(1);
}

let destino;
try {
  destino = new URL(url);
} catch {
  console.error('DEMO_RESET_DATABASE_URL no es una URL válida.');
  process.exit(1);
}

console.log(`Destino: ${destino.host}${destino.pathname}`);
console.log('Restaurando demo…');

const sql = neon(url);

const schema = readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8');
const sentencias = schema
  .split('\n')
  .filter((line) => !line.trim().startsWith('--'))
  .join('\n')
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean);

for (const sentencia of sentencias) {
  await sql.query(sentencia, []);
}

const resumen = await sembrarDemo(sql, { truncar: true });

console.log(
  `✔ Demo restaurado: ${resumen.clientas} clientas, ${resumen.productos} productos, ` +
    `${resumen.ventas} ventas (${resumen.ventasCredito} a crédito), ` +
    `${resumen.abonos} abonos, ${resumen.gastos} gastos.`,
);
