// Limpia residuos del e2e (datos E2E%) y reporta los counts de las 5 tablas.
// Uso (desde la raíz del proyecto):
//   export DATABASE_URL=$(grep "^DATABASE_URL=" .env | cut -d= -f2- | tr -d "\"\n")
//   node scripts/clean-e2e.mjs
// Usa el pooler (DATABASE_URL); el host directo de Neon dio timeout en el pasado.
import { neon } from '@neondatabase/serverless';

const hoy = new Date().toISOString().slice(0, 10);
const sql = neon(process.env.DATABASE_URL);

const [v] = await sql`SELECT count(*)::int AS n FROM ventas WHERE fecha = ${hoy} AND total = 40000 AND metodo_pago = 'Efectivo'`;
const [p] = await sql`SELECT count(*)::int AS n FROM productos WHERE nombre = 'E2E Producto Temp'`;
const [c] = await sql`SELECT count(*)::int AS n FROM clientes WHERE nombre LIKE 'E2E%'`;
const [g] = await sql`SELECT count(*)::int AS n FROM gastos WHERE descripcion = 'E2E Gasto Temp'`;
console.log('residuo:', { ventasE2E: v.n, productoE2E: p.n, clientaE2E: c.n, gastoE2E: g.n });

await sql`DELETE FROM venta_items WHERE venta_id IN (SELECT id FROM ventas WHERE fecha = ${hoy} AND total = 40000 AND metodo_pago = 'Efectivo')`;
await sql`DELETE FROM ventas WHERE fecha = ${hoy} AND total = 40000 AND metodo_pago = 'Efectivo'`;
await sql`DELETE FROM productos WHERE nombre = 'E2E Producto Temp'`;
await sql`DELETE FROM clientes WHERE nombre LIKE 'E2E%'`;
await sql`DELETE FROM gastos WHERE descripcion = 'E2E Gasto Temp'`;

const [t] = await sql`SELECT (SELECT count(*)::int FROM clientes) AS cl, (SELECT count(*)::int FROM productos) AS pr, (SELECT count(*)::int FROM ventas) AS ve, (SELECT count(*)::int FROM venta_items) AS vi, (SELECT count(*)::int FROM gastos) AS ga`;
console.log('estado final (clientas/productos/ventas/items/gastos):', t);
