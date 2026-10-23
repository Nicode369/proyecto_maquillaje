import { sql } from '../db';
import { fallo } from '../errores';
import { formatCOP } from '../format';
import type { Abono, LineaVentaInput, Venta, VentaCompleta, VentaItem } from './types';

export interface FiltroVentas {
  mes?: string;
  clienteId?: string;
  q?: string;
  limit?: number;
  offset?: number;
}

interface FilaVenta extends Omit<Venta, 'num_items'> {
  num_items: number;
}

function condicionMes(mes?: string) {
  return mes ?? null;
}

export async function listVentas(filtro: FiltroVentas = {}): Promise<Venta[]> {
  const { mes, clienteId, q, limit, offset } = filtro;
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
    LIMIT ${limit ?? 200}
    OFFSET ${offset ?? 0}`;
  return rows as unknown as FilaVenta[];
}

export async function contarVentas(filtro: FiltroVentas = {}): Promise<number> {
  const { mes, clienteId, q } = filtro;
  const [row] = await sql`
    SELECT COUNT(*)::int AS n
    FROM ventas v
    LEFT JOIN clientes c ON c.id = v.cliente_id
    WHERE (${condicionMes(mes)}::text IS NULL OR to_char(v.fecha, 'YYYY-MM') = ${condicionMes(mes)})
      AND (${clienteId ?? null}::uuid IS NULL OR v.cliente_id = ${clienteId ?? null})
      AND (
        ${q ?? null}::text IS NULL
        OR c.nombre ILIKE '%' || ${q ?? null} || '%'
        OR v.id::text ILIKE '%' || ${q ?? null} || '%'
      )`;
  return row.n;
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

/** true si el CHECK de stock abortó la transacción (venta concurrente). */
function esStockInsuficiente(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'constraint' in error &&
    (error as { constraint?: unknown }).constraint === 'productos_stock_no_negativo'
  );
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
    fallo('La venta necesita al menos un producto o servicio.', 'BAD_REQUEST');
  }

  for (const item of data.items) {
    if (item.cantidad < 1) {
      fallo(`Cantidad inválida en "${item.descripcion}".`, 'BAD_REQUEST');
    }
    if (item.productoId) {
      const [row] = await sql`
        SELECT stock FROM productos WHERE id = ${item.productoId} AND activo`;
      if (!row) fallo(`El producto de "${item.descripcion}" ya no está disponible.`, 'NOT_FOUND');
      if (row.stock < item.cantidad) {
        fallo(
          `Stock insuficiente: solo quedan ${row.stock} de "${item.descripcion}".`,
          'CONFLICT',
        );
      }
    }
  }

  const subtotal = data.items.reduce((sum, it) => sum + it.cantidad * it.precioUnitario, 0);
  const total = subtotal - data.descuento;
  if (total < 0) fallo('El descuento supera el subtotal de la venta.', 'BAD_REQUEST');

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
        // Sin guard `stock >= cantidad`: si dos ventas compiten, el CHECK
        // `productos_stock_no_negativo` aborta la transacción completa.
        (item) => sql`
          UPDATE productos
          SET stock = stock - ${item.cantidad}
          WHERE id = ${item.productoId}`,
      ),
  ];

  try {
    await sql.transaction(statementList);
  } catch (error) {
    if (esStockInsuficiente(error)) {
      fallo(
        'Stock insuficiente: otra venta acaba de usar esas unidades. Revisa el inventario.',
        'CONFLICT',
      );
    }
    throw error;
  }
  return ventaId;
}

export async function anularVenta(id: string): Promise<void> {
  // Una sola sentencia: el stock solo se restaura si la venta realmente
  // pasa de activa a anulada (evita doble restauración por doble click).
  await sql`
    WITH anulada AS (
      UPDATE ventas
      SET anulada = true
      WHERE id = ${id} AND NOT anulada
      RETURNING id
    )
    UPDATE productos p
    SET stock = stock + i.cantidad
    FROM venta_items i
    INNER JOIN anulada a ON a.id = i.venta_id
    WHERE p.id = i.producto_id`;
}

export async function reactivarVenta(id: string): Promise<void> {
  const [venta] = (await sql`
    SELECT anulada FROM ventas WHERE id = ${id}`) as unknown as {
    anulada: boolean;
  }[];

  if (!venta) fallo('La venta ya no existe.', 'NOT_FOUND');
  if (!venta.anulada) fallo('Esta venta no está anulada.', 'CONFLICT');

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
      fallo(
        `No se puede reactivar: el producto de "${item.descripcion}" ya no está disponible.`,
        'CONFLICT',
      );
    }
    if (row.stock < item.cantidad) {
      fallo(
        `No se puede reactivar: solo quedan ${row.stock} de "${item.descripcion}".`,
        'CONFLICT',
      );
    }
  }

  // Igual que anular: el stock se descuenta solo si la venta pasa de anulada
  // a activa. El CHECK de stock no negativo aborta todo si falta inventario.
  try {
    await sql`
      WITH reactivada AS (
        UPDATE ventas
        SET anulada = false
        WHERE id = ${id} AND anulada
        RETURNING id
      )
      UPDATE productos p
      SET stock = stock - i.cantidad
      FROM venta_items i
      INNER JOIN reactivada r ON r.id = i.venta_id
      WHERE p.id = i.producto_id`;
  } catch (error) {
    if (esStockInsuficiente(error)) {
      fallo(
        'No se puede reactivar: el stock cambió y ya no alcanza para esta venta.',
        'CONFLICT',
      );
    }
    throw error;
  }
}

export interface AbonoExport {
  id: string;
  fecha: string;
  venta_id: string;
  venta_fecha: string;
  cliente_nombre: string | null;
  venta_total: number;
  monto: number;
  notas: string | null;
}

export async function listAbonosExport(
  filtro: { mes?: string; clienteId?: string } = {},
): Promise<AbonoExport[]> {
  const { mes, clienteId } = filtro;
  const rows = await sql`
    SELECT
      a.id,
      a.fecha::text AS fecha,
      a.venta_id,
      v.fecha::text AS venta_fecha,
      c.nombre AS cliente_nombre,
      v.total::float8 AS venta_total,
      a.monto::float8 AS monto,
      a.notas
    FROM abonos a
    INNER JOIN ventas v ON v.id = a.venta_id
    LEFT JOIN clientes c ON c.id = v.cliente_id
    WHERE (${mes ?? null}::text IS NULL OR to_char(a.fecha, 'YYYY-MM') = ${mes ?? null})
      AND (${clienteId ?? null}::uuid IS NULL OR v.cliente_id = ${clienteId ?? null})
    ORDER BY a.fecha DESC, a.created_at DESC`;
  return rows as unknown as AbonoExport[];
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

  if (!venta) fallo('La venta ya no existe.', 'NOT_FOUND');
  if (!venta.credito) fallo('Esta venta no es a crédito.', 'BAD_REQUEST');
  if (venta.anulada) {
    fallo('No se pueden registrar abonos a una venta anulada.', 'CONFLICT');
  }

  const saldo = venta.total - Number(venta.pagado);
  if (data.monto > saldo) {
    fallo(
      `El abono supera el saldo pendiente (${formatCOP(Math.max(saldo, 0))}).`,
      'CONFLICT',
    );
  }

  // El lock por venta serializa abonos simultáneos y el INSERT condicional
  // vuelve a validar el saldo dentro de la misma transacción.
  const resultados = await sql.transaction([
    sql`SELECT pg_advisory_xact_lock(hashtext(${data.ventaId}))`,
    sql`
      INSERT INTO abonos (venta_id, fecha, monto, notas)
      SELECT ${data.ventaId}, ${data.fecha}, ${data.monto}, ${data.notas}
      WHERE ${data.monto} <= (
        SELECT v.total - COALESCE(
          (SELECT SUM(a.monto) FROM abonos a WHERE a.venta_id = v.id),
          0
        )
        FROM ventas v
        WHERE v.id = ${data.ventaId} AND v.credito AND NOT v.anulada
      )
      RETURNING id`,
  ]);

  const insertados = resultados[1] as unknown as { id: string }[];
  if (insertados.length === 0) {
    const [actual] = (await sql`
      SELECT v.total::float8 AS total,
             COALESCE((SELECT SUM(a.monto)::float8 FROM abonos a WHERE a.venta_id = v.id), 0) AS pagado
      FROM ventas v WHERE v.id = ${data.ventaId}`) as unknown as {
      total: number;
      pagado: number;
    }[];
    const restante = actual ? Math.max(actual.total - Number(actual.pagado), 0) : 0;
    fallo(
      `El abono supera el saldo pendiente (${formatCOP(restante)}).`,
      'CONFLICT',
    );
  }
}
