import { t as sql } from "./db_DwG4jB1T.mjs";
//#region src/lib/queries/productos.ts
async function listProductos(filtro = {}) {
	const { q, categoria, stockBajo, inactivos } = filtro;
	return await sql`
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
    ORDER BY nombre ASC`;
}
async function getProducto(id) {
	return (await sql`
    SELECT
      id, nombre, marca, categoria, stock, stock_minimo,
      precio_compra::float8 AS precio_compra,
      precio_venta::float8 AS precio_venta,
      activo,
      created_at::text AS created_at
    FROM productos
    WHERE id = ${id}`)[0] ?? null;
}
async function listCategorias() {
	return (await sql`
    SELECT DISTINCT categoria FROM productos ORDER BY categoria ASC`).map((r) => r.categoria);
}
async function countStockBajo() {
	const [row] = await sql`
    SELECT COUNT(*)::int AS n FROM productos
    WHERE activo AND stock <= stock_minimo`;
	return row.n;
}
async function createProducto(data) {
	const [row] = await sql`
    INSERT INTO productos (nombre, marca, categoria, stock, stock_minimo, precio_compra, precio_venta)
    VALUES (
      ${data.nombre},
      ${data.marca || null},
      ${data.categoria},
      ${data.stock},
      ${data.stock_minimo},
      ${data.precio_compra},
      ${data.precio_venta}
    )
    RETURNING id`;
	return row.id;
}
async function updateProducto(id, data) {
	await sql`
    UPDATE productos
    SET nombre = ${data.nombre},
        marca = ${data.marca || null},
        categoria = ${data.categoria},
        stock = ${data.stock},
        stock_minimo = ${data.stock_minimo},
        precio_compra = ${data.precio_compra},
        precio_venta = ${data.precio_venta},
        activo = ${data.activo}
    WHERE id = ${id}`;
}
async function deleteProducto(id) {
	const [row] = await sql`
    SELECT COUNT(*)::int AS n FROM venta_items WHERE producto_id = ${id}`;
	if (row.n > 0) {
		await sql`UPDATE productos SET activo = false WHERE id = ${id}`;
		return false;
	}
	await sql`DELETE FROM productos WHERE id = ${id}`;
	return true;
}
//#endregion
export { listCategorias as a, getProducto as i, createProducto as n, listProductos as o, deleteProducto as r, updateProducto as s, countStockBajo as t };
