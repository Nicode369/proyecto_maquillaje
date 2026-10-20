import { sql } from '../db';
import type { Abono, LineaVentaInput, Venta, VentaCompleta, VentaItem } from './types';

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
      v.credito,
      CASE WHEN v.credito AND NOT v.anulada
           THEN GREATEST(v.total - COALESCE(ab.pagado, 0), 0)
           ELSE 0 END::float8 AS saldo,
      (
        SELECT COUNT(*)::int FROM venta_items i WHERE i.venta_id = v.id
      ) AS num_items
    FROM ventas v
    LEFT JOIN clientes c ON c.id = v.cliente_id
    LEFT JOIN LATERAL (
      SELECT COALESCE(SUM(a.monto), 0)::float8 AS pagado
      FROM abonos a WHERE a.venta_id = v.id
    ) ab ON true
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
      v.credito,
      CASE WHEN v.credito AND NOT v.anulada
           THEN GREATEST(v.total - COALESCE(ab.pagado, 0), 0)
           ELSE 0 END::float8 AS saldo,
      0 AS num_items
    FROM ventas v
    LEFT JOIN clientes c ON c.id = v.cliente_id
    LEFT JOIN LATERAL (
      SELECT COALESCE(SUM(a.monto), 0)::float8 AS pagado
      FROM abonos a WHERE a.venta_id = v.id
    ) ab ON true
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

  const abonos = (await sql`
    SELECT
      id,
      venta_id,
      fecha::text AS fecha,
      monto::float8 AS monto,
      notas,
      created_at::text AS created_at
    FROM abonos
    WHERE venta_id = ${id}
    ORDER BY fecha DESC, created_at DESC`) as unknown as Abono[];

  return { ...venta, items, abonos };
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
      v.credito,
      CASE WHEN v.credito AND NOT v.anulada
           THEN GREATEST(v.total - COALESCE(ab.pagado, 0), 0)
           ELSE 0 END::float8 AS saldo,
      (
        SELECT COUNT(*)::int FROM venta_items i WHERE i.venta_id = v.id
      ) AS num_items
    FROM ventas v
    LEFT JOIN clientes c ON c.id = v.cliente_id
    LEFT JOIN LATERAL (
      SELECT COALESCE(SUM(a.monto), 0)::float8 AS pagado
      FROM abonos a WHERE a.venta_id = v.id
    ) ab ON true
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
  credito: boolean;
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
      INSERT INTO ventas (id, cliente_id, fecha, metodo_pago, descuento, total, notas, credito)
      VALUES (${ventaId}, ${data.clienteId}, ${data.fecha}, ${data.metodoPago}, ${data.descuento}, ${total}, ${data.notas}, ${data.credito})`,
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

export async function reactivarVenta(id: string): Promise<void> {
  const [venta] = (await sql`
    SELECT anulada FROM ventas WHERE id = ${id}`) as unknown as {
    anulada: boolean;
  }[];

  if (!venta) throw new Error('La venta ya no existe.');
  if (!venta.anulada) throw new Error('Esta venta no está anulada.');

  const items = (await sql`
    SELECT producto_id, cantidad, descripcion
    FROM venta_items
    WHERE venta_id = ${id} AND producto_id IS NOT NULL`) as unknown as {
    producto_id: string;
    cantidad: number;
    descripcion: string;
  }[];

  for (const item of items) {
    const [row] = (await sql`
      SELECT stock FROM productos WHERE id = ${item.producto_id} AND activo`) as unknown as {
      stock: number;
    }[];
    if (!row) {
      throw new Error(
        `No se puede reactivar: el producto de "${item.descripcion}" ya no está disponible.`,
      );
    }
    if (row.stock < item.cantidad) {
      throw new Error(
        `No se puede reactivar: solo quedan ${row.stock} de "${item.descripcion}".`,
      );
    }
  }

  await sql.transaction([
    ...items.map(
      (item) => sql`
        UPDATE productos SET stock = stock - ${item.cantidad} WHERE id = ${item.producto_id}`,
    ),
    sql`UPDATE ventas SET anulada = false WHERE id = ${id} AND anulada`,
  ]);
}

export async function registrarAbono(data: {
  ventaId: string;
  fecha: string;
  monto: number;
  notas: string | null;
}): Promise<void> {
  const [venta] = (await sql`
    SELECT
      v.total::float8 AS total,
      v.credito,
      v.anulada,
      COALESCE((
        SELECT SUM(a.monto)::float8 FROM abonos a WHERE a.venta_id = v.id
      ), 0) AS pagado
    FROM ventas v
    WHERE v.id = ${data.ventaId}`) as unknown as {
    total: number;
    credito: boolean;
    anulada: boolean;
    pagado: number;
  }[];

  if (!venta) throw new Error('La venta ya no existe.');
  if (!venta.credito) throw new Error('Esta venta no es a crédito.');
  if (venta.anulada) throw new Error('No se pueden registrar abonos a una venta anulada.');

  const saldo = venta.total - Number(venta.pagado);
  if (data.monto > saldo) {
    throw new Error(
      `El abono supera el saldo pendiente (${saldo > 0 ? saldo : 0}).`,
    );
  }

  await sql`
    INSERT INTO abonos (venta_id, fecha, monto, notas)
    VALUES (${data.ventaId}, ${data.fecha}, ${data.monto}, ${data.notas})`;
}
