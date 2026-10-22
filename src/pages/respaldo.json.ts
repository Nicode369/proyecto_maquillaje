import type { APIRoute } from 'astro';
import { sql } from '../lib/db';
import { hoyISO } from '../lib/format';

export const GET: APIRoute = async () => {
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

  return new Response(JSON.stringify(respaldo, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="respaldo-valeria-${hoyISO()}.json"`,
      'Cache-Control': 'no-store',
    },
  });
};
