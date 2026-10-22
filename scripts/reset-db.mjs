// Vacía por completo las tablas de la app (deja la BD como en la entrega:
// sin clientas, productos, ventas, gastos ni abonos).
// Uso (desde la raíz del proyecto):
//   export DATABASE_URL=$(grep "^DATABASE_URL=" .env | cut -d= -f2- | tr -d "\"\n")
//   node scripts/reset-db.mjs
// Usa el pooler (DATABASE_URL); el host directo de Neon dio timeout en el pasado.
//
// DESTRUCTIVO: borra todos los datos, incluidos los reales.
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const [antes] = await sql`
  SELECT (SELECT count(*)::int FROM clientes) AS cl,
         (SELECT count(*)::int FROM productos) AS pr,
         (SELECT count(*)::int FROM ventas) AS ve,
         (SELECT count(*)::int FROM venta_items) AS vi,
         (SELECT count(*)::int FROM gastos) AS ga,
         (SELECT count(*)::int FROM abonos) AS ab,
         (SELECT count(*)::int FROM login_attempts) AS la`;
console.log('antes:  ', antes);

await sql`TRUNCATE TABLE venta_items, ventas, abonos, gastos, productos, clientes, login_attempts RESTART IDENTITY CASCADE`;

const [despues] = await sql`
  SELECT (SELECT count(*)::int FROM clientes) AS cl,
         (SELECT count(*)::int FROM productos) AS pr,
         (SELECT count(*)::int FROM ventas) AS ve,
         (SELECT count(*)::int FROM venta_items) AS vi,
         (SELECT count(*)::int FROM gastos) AS ga,
         (SELECT count(*)::int FROM abonos) AS ab,
         (SELECT count(*)::int FROM login_attempts) AS la`;
console.log('despues:', despues);
