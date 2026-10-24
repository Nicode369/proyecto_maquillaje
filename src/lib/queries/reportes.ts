import { sql } from '../db';
import { mesISO } from '../format';

function mesAnterior(mes: string): string {
  const [anio, m] = mes.split('-').map(Number);
  const d = new Date(anio, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export interface Kpis {
  ingresos: number;
  gastos: number;
  ganancia: number;
  nVentas: number;
  ticketPromedio: number;
  prevIngresos: number;
  prevGastos: number;
  prevNVentas: number;
}

export async function kpisMes(mes: string): Promise<Kpis> {
  const prev = mesAnterior(mes);

  const [actualRows, anteriorRows, gastosRows, gastosPrevRows] = await Promise.all([
    sql`
      SELECT
        (SELECT COUNT(*)::int FROM ventas
          WHERE NOT anulada AND to_char(fecha, 'YYYY-MM') = ${mes}) AS n,
        (
          SELECT COALESCE(SUM(v.total), 0)::float8
          FROM ventas v
          WHERE NOT v.anulada AND NOT v.credito AND to_char(v.fecha, 'YYYY-MM') = ${mes}
        ) +
        (
          SELECT COALESCE(SUM(a.monto), 0)::float8
          FROM abonos a
          INNER JOIN ventas v ON v.id = a.venta_id AND NOT v.anulada
          WHERE to_char(a.fecha, 'YYYY-MM') = ${mes}
        ) AS total`,
    sql`
      SELECT
        (SELECT COUNT(*)::int FROM ventas
          WHERE NOT anulada AND to_char(fecha, 'YYYY-MM') = ${prev}) AS n,
        (
          SELECT COALESCE(SUM(v.total), 0)::float8
          FROM ventas v
          WHERE NOT v.anulada AND NOT v.credito AND to_char(v.fecha, 'YYYY-MM') = ${prev}
        ) +
        (
          SELECT COALESCE(SUM(a.monto), 0)::float8
          FROM abonos a
          INNER JOIN ventas v ON v.id = a.venta_id AND NOT v.anulada
          WHERE to_char(a.fecha, 'YYYY-MM') = ${prev}
        ) AS total`,
    sql`
      SELECT COALESCE(SUM(monto), 0)::float8 AS total
      FROM gastos
      WHERE to_char(fecha, 'YYYY-MM') = ${mes}`,
    sql`
      SELECT COALESCE(SUM(monto), 0)::float8 AS total
      FROM gastos
      WHERE to_char(fecha, 'YYYY-MM') = ${prev}`,
  ]);

  const actual = actualRows[0];
  const anterior = anteriorRows[0];
  const gastosRow = gastosRows[0];
  const gastosPrev = gastosPrevRows[0];

  const ingresos = Number(actual.total);
  const gastos = Number(gastosRow.total);
  const nVentas = actual.n;

  return {
    ingresos,
    gastos,
    ganancia: ingresos - gastos,
    nVentas,
    ticketPromedio: nVentas > 0 ? ingresos / nVentas : 0,
    prevIngresos: Number(anterior.total),
    prevGastos: Number(gastosPrev.total),
    prevNVentas: anterior.n,
  };
}

export interface PuntoSerie {
  mes: string;
  ingresos: number;
  gastos: number;
}

export async function serieMensual(nMeses = 6): Promise<PuntoSerie[]> {
  // El mes actual debe ser el de Colombia, no el del servidor (Vercel/UTC).
  const [anioActual, mesActual] = mesISO().split('-').map(Number);
  const desde = new Date(anioActual, mesActual - 1 - (nMeses - 1), 1);
  const desdeISO = `${desde.getFullYear()}-${String(desde.getMonth() + 1).padStart(2, '0')}-01`;

  const [ingresosRows, gastosRows] = await Promise.all([
    sql`
      SELECT mes, COALESCE(SUM(monto), 0)::float8 AS ingresos
      FROM (
        SELECT to_char(v.fecha, 'YYYY-MM') AS mes, v.total AS monto
        FROM ventas v
        WHERE NOT v.anulada AND NOT v.credito AND v.fecha >= ${desdeISO}
        UNION ALL
        SELECT to_char(a.fecha, 'YYYY-MM') AS mes, a.monto
        FROM abonos a
        INNER JOIN ventas v ON v.id = a.venta_id AND NOT v.anulada
        WHERE a.fecha >= ${desdeISO}
      ) cobros
      GROUP BY mes
      ORDER BY mes`,
    sql`
      SELECT to_char(fecha, 'YYYY-MM') AS mes, COALESCE(SUM(monto), 0)::float8 AS gastos
      FROM gastos
      WHERE fecha >= ${desdeISO}
      GROUP BY 1
      ORDER BY 1`,
  ]);

  const ingresosMap = new Map(ingresosRows.map((r) => [r.mes, Number(r.ingresos)]));
  const gastosMap = new Map(gastosRows.map((r) => [r.mes, Number(r.gastos)]));

  const serie: PuntoSerie[] = [];
  const cursor = new Date(desde);
  for (let i = 0; i < nMeses; i++) {
    const clave = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
    serie.push({
      mes: clave,
      ingresos: ingresosMap.get(clave) ?? 0,
      gastos: gastosMap.get(clave) ?? 0,
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return serie;
}

export interface AlertaStock {
  id: string;
  nombre: string;
  marca: string | null;
  stock: number;
  stock_minimo: number;
}

export async function stockBajo(): Promise<AlertaStock[]> {
  const rows = await sql`
    SELECT id, nombre, marca, stock, stock_minimo
    FROM productos
    WHERE activo AND stock <= stock_minimo
    ORDER BY stock ASC
    LIMIT 6`;
  return rows as unknown as AlertaStock[];
}

export interface VentaReciente {
  id: string;
  fecha: string;
  hora_registro: string | null;
  created_at: string | null;
  cliente_nombre: string | null;
  total: number;
  anulada: boolean;
}

export async function ultimasVentas(limit = 5): Promise<VentaReciente[]> {
  const rows = await sql`
    SELECT
      v.id,
      v.fecha::text AS fecha,
      v.hora_registro::text AS hora_registro,
      v.created_at::text AS created_at,
      c.nombre AS cliente_nombre,
      v.total::float8 AS total,
      v.anulada
    FROM ventas v
    LEFT JOIN clientes c ON c.id = v.cliente_id
    ORDER BY v.fecha DESC, v.created_at DESC
    LIMIT ${limit}`;
  return rows as unknown as VentaReciente[];
}

export interface TopCliente {
  id: string;
  nombre: string;
  compras: number;
  gasto: number;
}

export async function topClientes(limit = 5): Promise<TopCliente[]> {
  const rows = await sql`
    SELECT
      c.id,
      c.nombre,
      COUNT(v.id)::int AS compras,
      COALESCE(SUM(v.total), 0)::float8 AS gasto
    FROM clientes c
    INNER JOIN ventas v ON v.cliente_id = c.id AND NOT v.anulada
    GROUP BY c.id
    ORDER BY gasto DESC, compras DESC
    LIMIT ${limit}`;
  return rows as unknown as TopCliente[];
}

export interface TopProducto {
  id: string;
  nombre: string;
  unidades: number;
  ingresos: number;
}export async function topProductos(limit = 5): Promise<TopProducto[]> {
  const rows = await sql`
    SELECT
      p.id,
      p.nombre,
      SUM(i.cantidad)::int AS unidades,
      COALESCE(SUM(i.subtotal), 0)::float8 AS ingresos
    FROM venta_items i
    INNER JOIN ventas v ON v.id = i.venta_id AND NOT v.anulada
    INNER JOIN productos p ON p.id = i.producto_id
    GROUP BY p.id
    ORDER BY unidades DESC, ingresos DESC
    LIMIT ${limit}`;
  return rows as unknown as TopProducto[];
}

export interface FiadoResumen {
  total: number;
  ventas: number;
}

/** Total fiado pendiente y cuántas ventas a crédito aún tienen saldo. */
export async function porCobrar(): Promise<FiadoResumen> {
  const [row] = await sql`
    SELECT
      COALESCE(SUM(GREATEST(v.total - COALESCE(ab.pagado, 0), 0)), 0)::float8 AS total,
      COUNT(*) FILTER (
        WHERE GREATEST(v.total - COALESCE(ab.pagado, 0), 0) > 0
      )::int AS ventas
    FROM ventas v
    LEFT JOIN LATERAL (
      SELECT COALESCE(SUM(a.monto), 0)::float8 AS pagado
      FROM abonos a WHERE a.venta_id = v.id
    ) ab ON true
    WHERE v.credito AND NOT v.anulada`;
  return { total: Number(row.total), ventas: row.ventas };
}
