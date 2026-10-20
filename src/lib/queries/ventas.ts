import { sql } from '../db';
import type { LineaVentaInput, Venta, VentaCompleta, VentaItem } from './types';

export interface FiltroVentas {
  mes?: string;
  clienteId?: string;
  q?: string;
  limit?: number;
}

interface FilaVenta extends Omit<Venta, 'num_items'> {
  num_items: number;
}

function condicionMes(mes?: string) {
  return mes ?? null;
}

export async function listVentas(filtro: FiltroVentas = {}): Promise<Venta[]> {
  const { mes, clienteId, q, limit } = filtro;
  const rows = await sql`
    SELECT
      v.id,
      v.cliente_id,
      c.nombre AS cliente_nombre,
      v.fecha::text AS fecha,
      v.metodo_pago,
      v.descuento::float8 AS descuento,
      v.total::float8 AS total,
      v.notas,
      v.anulada,
      (
        SELECT COUNT(*)::int FROM venta_items i WHERE i.venta_id = v.id
      ) AS num_items
    FROM ventas v
    LEFT JOIN clientes c ON c.id = v.cliente_id
    WHERE (${condicionMes(mes)}::text IS NULL OR to_char(v.fecha, 'YYYY-MM') = ${condicionMes(mes)})
      AND (${clienteId ?? null}::uuid IS NULL OR v.cliente_id = ${clienteId ?? null})
      AND (
        ${q ?? null}::text IS NULL
        OR c.nombre ILIKE '%' || ${q ?? null} || '%'
        OR v.id::text ILIKE '%' || ${q ?? null} || '%'
      )
    ORDER BY v.fecha DESC, v.created_at DESC
    LIMIT ${limit ?? 200}`;
  return rows as unknown as FilaVenta[];
}

export async function totalesVentas(filtro: FiltroVentas = {}): Promise<{
  n: number;
  total: number;
}> {
  const { mes, clienteId, q } = filtro;
  const [row] = await sql`
    SELECT COUNT(*)::int AS n, COALESCE(SUM(v.total), 0)::float8 AS total
    FROM ventas v
    LEFT JOIN clientes c ON c.id = v.cliente_id
    WHERE NOT v.anulada
      AND (${condicionMes(mes)}::text IS NULL OR to_char(v.fecha, 'YYYY-MM') = ${condicionMes(mes)})
      AND (${clienteId ?? null}::uuid IS NULL OR v.cliente_id = ${clienteId ?? null})
      AND (
        ${q ?? null}::text IS NULL
        OR c.nombre ILIKE '%' || ${q ?? null} || '%'
        OR v.id::text ILIKE '%' || ${q ?? null} || '%'
      )`;
  return { n: row.n, total: Number(row.total) };
}

export async function getVenta(id: string): Promise<VentaCompleta | null> {
  const rows = await sql`
    SELECT
      v.id,
      v.cliente_id,
      c.nombre AS cliente_nombre,
      v.fecha::text AS fecha,
      v.metodo_pago,
      v.descuento::float8 AS descuento,
      v.total::float8 AS total,
      v.notas,
      v.anulada,
      0 AS num_items
    FROM ventas v
    LEFT JOIN clientes c ON c.id = v.cliente_id
    WHERE v.id = ${id}`;
  const venta = rows[0] as unknown as Venta | undefined;
  if (!venta) return null;

  const items = (await sql`
    SELECT
      id,
      producto_id,
      descripcion,
      cantidad,
      precio_unitario::float8 AS precio_unitario,
      subtotal::float8 AS subtotal
    FROM venta_items
    WHERE venta_id = ${id}
    ORDER BY descripcion ASC`) as unknown as VentaItem[];

  return { ...venta, items };
}

export async function listVentasDeCliente(clienteId: string): Promise<Venta[]> {
  const rows = await sql`
    SELECT
      v.id,
      v.cliente_id,
      c.nombre AS cliente_nombre,
      v.fecha::text AS fecha,
      v.metodo_pago,
      v.descuento::float8 AS descuento,
      v.total::float8 AS total,
      v.notas,
      v.anulada,
      (
        SELECT COUNT(*)::int FROM venta_items i WHERE i.venta_id = v.id
      ) AS num_items
    FROM ventas v
    LEFT JOIN clientes c ON c.id = v.cliente_id
    WHERE v.cliente_id = ${clienteId}
    ORDER BY v.fecha DESC, v.created_at DESC`;
  return rows as unknown as FilaVenta[];
}

export async function createVenta(data: {
  fecha: string;
  clienteId: string | null;
  metodoPago: string;
  descuento: number;
  notas: string | null;
  items: LineaVentaInput[];
}): Promise<string> {
  if (data.items.length === 0) {
    throw new Error('La venta necesita al menos un producto o servicio.');
  }

  for (const item of data.items) {
    if (item.cantidad < 1) {
      throw new Error(`Cantidad inválida en "${item.descripcion}".`);
    }
    if (item.productoId) {
      const [row] = await sql`
        SELECT stock FROM productos WHERE id = ${item.productoId} AND activo`;
      if (!row) throw new Error(`El producto de "${item.descripcion}" ya no está disponible.`);
      if (row.stock < item.cantidad) {
        throw new Error(
          `Stock insuficiente: solo quedan ${row.stock} de "${item.descripcion}".`,
        );
      }
    }
  }

  const subtotal = data.items.reduce((sum, it) => sum + it.cantidad * it.precioUnitario, 0);
  const total = subtotal - data.descuento;
  if (total < 0) throw new Error('El descuento supera el subtotal de la venta.');

  const ventaId = crypto.randomUUID();

  const statementList = [
    sql`
      INSERT INTO ventas (id, cliente_id, fecha, metodo_pago, descuento, total, notas)
      VALUES (${ventaId}, ${data.clienteId}, ${data.fecha}, ${data.metodoPago}, ${data.descuento}, ${total}, ${data.notas})`,
    ...data.items.map(
      (item) => sql`
        INSERT INTO venta_items (venta_id, producto_id, descripcion, cantidad, precio_unitario, subtotal)
        VALUES (
          ${ventaId},
          ${item.productoId},
          ${item.descripcion},
          ${item.cantidad},
          ${item.precioUnitario},
          ${item.cantidad * item.precioUnitario}
        )`,
    ),
    ...data.items
      .filter((item) => item.productoId)
      .map(
        (item) => sql`
          UPDATE productos
          SET stock = stock - ${item.cantidad}
          WHERE id = ${item.productoId} AND stock >= ${item.cantidad}`,
      ),
  ];

  await sql.transaction(statementList);
  return ventaId;
}

export async function anularVenta(id: string): Promise<void> {
  const items = (await sql`
    SELECT producto_id, cantidad
    FROM venta_items
    WHERE venta_id = ${id} AND producto_id IS NOT NULL`) as unknown as {
    producto_id: string;
    cantidad: number;
  }[];

  await sql.transaction([
    ...items.map(
      (item) => sql`
        UPDATE productos SET stock = stock + ${item.cantidad} WHERE id = ${item.producto_id}`,
    ),
    sql`UPDATE ventas SET anulada = true WHERE id = ${id} AND NOT anulada`,
  ]);
}
