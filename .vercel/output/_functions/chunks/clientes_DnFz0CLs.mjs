import { t as sql } from "./db_DwG4jB1T.mjs";
//#region src/lib/queries/clientes.ts
async function listClientes(q) {
	return await sql`
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
      ), 0) AS gasto_acumulado
    FROM clientes c
    WHERE ${q ?? null}::text IS NULL
       OR c.nombre ILIKE '%' || ${q ?? null} || '%'
       OR c.telefono ILIKE '%' || ${q ?? null} || '%'
       OR c.email ILIKE '%' || ${q ?? null} || '%'
    ORDER BY c.nombre ASC`;
}
async function getCliente(id) {
	return (await sql`
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
      ), 0) AS gasto_acumulado
    FROM clientes c
    WHERE c.id = ${id}`)[0] ?? null;
}
async function countClientes() {
	const [row] = await sql`SELECT COUNT(*)::int AS n FROM clientes`;
	return row.n;
}
async function countClientesNuevasEsteMes(mes) {
	const [row] = await sql`
    SELECT COUNT(*)::int AS n FROM clientes
    WHERE to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM') = ${mes}`;
	return row.n;
}
async function createCliente(data) {
	const [row] = await sql`
    INSERT INTO clientes (nombre, telefono, email, notas)
    VALUES (${data.nombre}, ${data.telefono || null}, ${data.email || null}, ${data.notas || null})
    RETURNING id`;
	return row.id;
}
async function updateCliente(id, data) {
	await sql`
    UPDATE clientes
    SET nombre = ${data.nombre},
        telefono = ${data.telefono || null},
        email = ${data.email || null},
        notas = ${data.notas || null}
    WHERE id = ${id}`;
}
async function deleteCliente(id) {
	await sql`DELETE FROM clientes WHERE id = ${id}`;
}
//#endregion
export { getCliente as a, deleteCliente as i, countClientesNuevasEsteMes as n, listClientes as o, createCliente as r, updateCliente as s, countClientes as t };
