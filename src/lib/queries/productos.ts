import { sql } from '../db';
import type { Producto } from './types';

export interface FiltroProductos {
  q?: string;
  categoria?: string;
  stockBajo?: boolean;
  inactivos?: boolean;
  limit?: number;
  offset?: number;
}

export async function listProductos(filtro: FiltroProductos = {}): Promise<Producto[]> {
  const { q, categoria, stockBajo, inactivos, limit, offset } = filtro;
  const rows = await sql`
    SELECT
      id,
      nombre,
      marca,
      categoria,
      stock,
      stock_minimo,
      precio_compra::float8 AS precio_compra,
      precio_venta::float8 AS precio_venta,
      activo,
      imagen,
      created_at::text AS created_at
    FROM productos
    WHERE (${inactivos ?? false} OR activo)
      AND (${categoria ?? null}::text IS NULL OR categoria = ${categoria ?? null})
      AND (${stockBajo ?? false} = false OR stock <= stock_minimo)
      AND (
        ${q ?? null}::text IS NULL
        OR nombre ILIKE '%' || ${q ?? null} || '%'
        OR marca ILIKE '%' || ${q ?? null} || '%'
      )
    ORDER BY nombre ASC, id ASC
    LIMIT ${limit ?? 1_000_000}
    OFFSET ${offset ?? 0}`;
  return rows as unknown as Producto[];
}

export async function contarProductos(filtro: FiltroProductos = {}): Promise<number> {
  const { q, categoria, stockBajo, inactivos } = filtro;
  const [row] = await sql`
    SELECT COUNT(*)::int AS n
    FROM productos
    WHERE (${inactivos ?? false} OR activo)
      AND (${categoria ?? null}::text IS NULL OR categoria = ${categoria ?? null})
      AND (${stockBajo ?? false} = false OR stock <= stock_minimo)
      AND (
        ${q ?? null}::text IS NULL
        OR nombre ILIKE '%' || ${q ?? null} || '%'
        OR marca ILIKE '%' || ${q ?? null} || '%'
      )`;
  return row.n;
}

export async function getProducto(id: string): Promise<Producto | null> {
  const rows = await sql`
    SELECT
      id, nombre, marca, categoria, stock, stock_minimo,
      precio_compra::float8 AS precio_compra,
      precio_venta::float8 AS precio_venta,
      activo,
      imagen,
      created_at::text AS created_at
    FROM productos
    WHERE id = ${id}`;
  return (rows[0] as unknown as Producto | undefined) ?? null;
}

export async function listCategorias(): Promise<string[]> {
  const rows = await sql`
    SELECT DISTINCT categoria FROM productos ORDER BY categoria ASC`;
  return rows.map((r) => r.categoria);
}

export async function countStockBajo(): Promise<number> {
  const [row] = await sql`
    SELECT COUNT(*)::int AS n FROM productos
    WHERE activo AND stock <= stock_minimo`;
  return row.n;
}

export interface ResumenStock {
  unidades: number;
  invertido: number;
  ganancia: number;
}

export async function resumenStockActivo(): Promise<ResumenStock> {
  const [row] = await sql`
    SELECT
      COALESCE(SUM(stock), 0)::int AS unidades,
      COALESCE(SUM(stock * precio_compra), 0)::float8 AS invertido,
      COALESCE(SUM(stock * (precio_venta - precio_compra)), 0)::float8 AS ganancia
    FROM productos
    WHERE activo`;
  return row as unknown as ResumenStock;
}

export async function createProducto(data: {
  nombre: string;
  marca?: string | null;
  categoria: string;
  stock: number;
  stock_minimo: number;
  precio_compra: number;
  precio_venta: number;
  imagen?: string | null;
}): Promise<string> {
  const [row] = await sql`
    INSERT INTO productos (nombre, marca, categoria, stock, stock_minimo, precio_compra, precio_venta, imagen)
    VALUES (
      ${data.nombre},
      ${data.marca || null},
      ${data.categoria},
      ${data.stock},
      ${data.stock_minimo},
      ${data.precio_compra},
      ${data.precio_venta},
      ${data.imagen || null}
    )
    RETURNING id`;
  return row.id;
}

export async function updateProducto(
  id: string,
  data: {
    nombre: string;
    marca?: string | null;
    categoria: string;
    stock: number;
    stock_minimo: number;
    precio_compra: number;
    precio_venta: number;
    activo: boolean;
    imagen?: string | null;
  },
): Promise<void> {
  await sql`
    UPDATE productos
    SET nombre = ${data.nombre},
        marca = ${data.marca || null},
        categoria = ${data.categoria},
        stock = ${data.stock},
        stock_minimo = ${data.stock_minimo},
        precio_compra = ${data.precio_compra},
        precio_venta = ${data.precio_venta},
        activo = ${data.activo},
        imagen = ${data.imagen || null}
    WHERE id = ${id}`;
}

export async function ajustarStock(id: string, delta: number): Promise<number> {
  const [row] = await sql`
    UPDATE productos
    SET stock = GREATEST(stock + ${delta}, 0)
    WHERE id = ${id}
    RETURNING stock`;
  return row.stock;
}

export async function deleteProducto(id: string): Promise<boolean> {
  const [row] = await sql`
    SELECT COUNT(*)::int AS n FROM venta_items WHERE producto_id = ${id}`;
  if (row.n > 0) {
    await sql`UPDATE productos SET activo = false WHERE id = ${id}`;
    return false;
  }
  await sql`DELETE FROM productos WHERE id = ${id}`;
  return true;
}

export interface ProductoVenta {
  id: string;
  nombre: string;
  marca: string | null;
  categoria: string;
  stock: number;
  precio_venta: number;
}

export async function listProductosParaVenta(): Promise<ProductoVenta[]> {
  const rows = await sql`
    SELECT id, nombre, marca, categoria, stock, precio_venta::float8 AS precio_venta
    FROM productos
    WHERE activo
    ORDER BY nombre ASC`;
  return rows as unknown as ProductoVenta[];
}
