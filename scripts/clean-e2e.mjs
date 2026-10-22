// Limpia residuos del e2e (datos E2E%) y reporta los counts de las 5 tablas.
// Uso (desde la raíz del proyecto):
//   export DATABASE_URL=$(grep "^DATABASE_URL=" .env | cut -d= -f2- | tr -d "\"\n")
//   node scripts/clean-e2e.mjs
// Usa el pooler (DATABASE_URL); el host directo de Neon dio timeout en el pasado.
//
// Solo borra lo que el e2e crea (producto "E2E Producto Temp" y sus ventas,
// clientas/gastos con nombre E2E%). NUNCA toca datos reales: las ventas se
// localizan por el producto E2E, no por monto/fecha (una venta real de
// $40.000 en efectivo no debe borrarse).
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const [v] = await sql`
  SELECT count(DISTINCT vi.venta_id)::int AS n
  FROM venta_items vi
  JOIN productos p ON p.id = vi.producto_id
  WHERE p.nombre = 'E2E Producto Temp'`;
const [p] = await sql`SELECT count(*)::int AS n FROM productos WHERE nombre = 'E2E Producto Temp'`;
const [c] = await sql`SELECT count(*)::int AS n FROM clientes WHERE nombre LIKE 'E2E%'`;
const [g] = await sql`SELECT count(*)::int AS n FROM gastos WHERE descripcion = 'E2E Gasto Temp'`;
console.log('residuo:', { ventasE2E: v.n, productoE2E: p.n, clientaE2E: c.n, gastoE2E: g.n });

// Las ventas primero: sus venta_items y abonos caen en CASCADE. Si se
// borraran los items antes, la subquery ya no encontraría las ventas.
await sql`
  DELETE FROM ventas WHERE id IN (
    SELECT vi.venta_id FROM venta_items vi
    JOIN productos p ON p.id = vi.producto_id
    WHERE p.nombre = 'E2E Producto Temp')`;
await sql`DELETE FROM productos WHERE nombre = 'E2E Producto Temp'`;
await sql`DELETE FROM clientes WHERE nombre LIKE 'E2E%'`;
await sql`DELETE FROM gastos WHERE descripcion = 'E2E Gasto Temp'`;

const [t] = await sql`SELECT (SELECT count(*)::int FROM clientes) AS cl, (SELECT count(*)::int FROM productos) AS pr, (SELECT count(*)::int FROM ventas) AS ve, (SELECT count(*)::int FROM venta_items) AS vi, (SELECT count(*)::int FROM gastos) AS ga, (SELECT count(*)::int FROM abonos) AS ab`;
console.log('estado final (clientas/productos/ventas/items/gastos/abonos):', t);
