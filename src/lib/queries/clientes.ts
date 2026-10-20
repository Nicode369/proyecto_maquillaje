import { sql } from '../db';
import type { ClienteResumen } from './types';

export async function listClientes(q?: string): Promise<ClienteResumen[]> {
  const rows = await sql`
    SELECT
      c.id,
      c.nombre,
      c.telefono,
      c.email,
      c.notas,
      c.created_at::text AS created_at,
      (
        SELECT MAX(v.fecha)::text
        FROM ventas v
        WHERE v.cliente_id = c.id AND NOT v.anulada
      ) AS ultima_compra,
      COALESCE((
        SELECT COUNT(*)::int
        FROM ventas v
        WHERE v.cliente_id = c.id AND NOT v.anulada
      ), 0) AS total_compras,
      COALESCE((
        SELECT SUM(v.total)::float8
        FROM ventas v
        WHERE v.cliente_id = c.id AND NOT v.anulada
      ), 0) AS gasto_acumulado,
      COALESCE((
        SELECT SUM(GREATEST(v.total - COALESCE(ab.pagado, 0), 0))::float8
        FROM ventas v
        LEFT JOIN LATERAL (
          SELECT COALESCE(SUM(a.monto), 0)::float8 AS pagado
          FROM abonos a WHERE a.venta_id = v.id
        ) ab ON true
        WHERE v.cliente_id = c.id AND v.credito AND NOT v.anulada
      ), 0) AS saldo
    FROM clientes c
    WHERE ${q ?? null}::text IS NULL
       OR c.nombre ILIKE '%' || ${q ?? null} || '%'
       OR c.telefono ILIKE '%' || ${q ?? null} || '%'
       OR c.email ILIKE '%' || ${q ?? null} || '%'
    ORDER BY c.nombre ASC`;
  return rows as unknown as ClienteResumen[];
}

export async function getCliente(id: string): Promise<ClienteResumen | null> {
  const rows = await sql`
    SELECT
      c.id,
      c.nombre,
      c.telefono,
      c.email,
      c.notas,
      c.created_at::text AS created_at,
      (
        SELECT MAX(v.fecha)::text
        FROM ventas v
        WHERE v.cliente_id = c.id AND NOT v.anulada
      ) AS ultima_compra,
      COALESCE((
        SELECT COUNT(*)::int
        FROM ventas v
        WHERE v.cliente_id = c.id AND NOT v.anulada
      ), 0) AS total_compras,
      COALESCE((
        SELECT SUM(v.total)::float8
        FROM ventas v
        WHERE v.cliente_id = c.id AND NOT v.anulada
      ), 0) AS gasto_acumulado,
      COALESCE((
        SELECT SUM(GREATEST(v.total - COALESCE(ab.pagado, 0), 0))::float8
        FROM ventas v
        LEFT JOIN LATERAL (
          SELECT COALESCE(SUM(a.monto), 0)::float8 AS pagado
          FROM abonos a WHERE a.venta_id = v.id
        ) ab ON true
        WHERE v.cliente_id = c.id AND v.credito AND NOT v.anulada
      ), 0) AS saldo
    FROM clientes c
    WHERE c.id = ${id}`;
  return (rows[0] as unknown as ClienteResumen | undefined) ?? null;
}

export async function countClientes(): Promise<number> {
  const [row] = await sql`SELECT COUNT(*)::int AS n FROM clientes`;
  return row.n;
}

export async function countClientesNuevasEsteMes(mes: string): Promise<number> {
  const [row] = await sql`
    SELECT COUNT(*)::int AS n FROM clientes
    WHERE to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM') = ${mes}`;
  return row.n;
}

export async function createCliente(data: {
  nombre: string;
  telefono?: string | null;
  email?: string | null;
  notas?: string | null;
}): Promise<string> {
  const [row] = await sql`
    INSERT INTO clientes (nombre, telefono, email, notas)
    VALUES (${data.nombre}, ${data.telefono || null}, ${data.email || null}, ${data.notas || null})
    RETURNING id`;
  return row.id;
}

export async function updateCliente(
  id: string,
  data: {
    nombre: string;
    telefono?: string | null;
    email?: string | null;
    notas?: string | null;
  },
): Promise<void> {
  await sql`
    UPDATE clientes
    SET nombre = ${data.nombre},
        telefono = ${data.telefono || null},
        email = ${data.email || null},
        notas = ${data.notas || null}
    WHERE id = ${id}`;
}

export async function deleteCliente(id: string): Promise<void> {
  await sql`DELETE FROM clientes WHERE id = ${id}`;
}

export async function clienteTieneVentas(id: string): Promise<boolean> {
  const [row] = await sql`
    SELECT COUNT(*)::int AS n FROM ventas WHERE cliente_id = ${id}`;
  return row.n > 0;
}
