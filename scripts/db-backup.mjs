import { mkdirSync, writeFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  console.error(
    'Falta DATABASE_URL. Ejecuta `neon env pull` y luego: npm run db:backup',
  );
  process.exit(1);
}

const sql = neon(url);

const [clientes, productos, ventas, ventaItems, abonos, gastos] = await Promise.all([
  sql`SELECT * FROM clientes ORDER BY created_at ASC, id ASC`,
  sql`SELECT * FROM productos ORDER BY created_at ASC, id ASC`,
  sql`SELECT * FROM ventas ORDER BY created_at ASC, id ASC`,
  sql`SELECT * FROM venta_items ORDER BY id ASC`,
  sql`SELECT * FROM abonos ORDER BY created_at ASC, id ASC`,
  sql`SELECT * FROM gastos ORDER BY created_at ASC, id ASC`,
]);

const respaldo = {
  version: 1,
  exportado_en: new Date().toISOString(),
  tablas: {
    clientes,
    productos,
    ventas,
    venta_items: ventaItems,
    abonos,
    gastos,
  },
};

const marca = new Date().toISOString().replace(/[:.]/g, '-');
const directorio = 'backups';
mkdirSync(directorio, { recursive: true });
const archivo = `${directorio}/respaldo-${marca}.json`;
writeFileSync(archivo, `${JSON.stringify(respaldo, null, 2)}\n`, 'utf8');

console.log(`Respaldo guardado en ${archivo}`);
console.log({
  clientes: clientes.length,
  productos: productos.length,
  ventas: ventas.length,
  venta_items: ventaItems.length,
  abonos: abonos.length,
  gastos: gastos.length,
});
