import { t as sql } from "./db_yXFApRPf.mjs";
//#region src/lib/queries/gastos.ts
async function listGastos(filtro = {}) {
	const { mes, categoria, limit } = filtro;
	return await sql`
    SELECT
      id,
      fecha::text AS fecha,
      categoria,
      descripcion,
      monto::float8 AS monto
    FROM gastos
    WHERE (${mes ?? null}::text IS NULL OR to_char(fecha, 'YYYY-MM') = ${mes ?? null})
      AND (${categoria ?? null}::text IS NULL OR categoria = ${categoria ?? null})
    ORDER BY fecha DESC, created_at DESC
    LIMIT ${limit ?? 300}`;
}
async function totalGastos(filtro = {}) {
	const { mes, categoria } = filtro;
	const [row] = await sql`
    SELECT COALESCE(SUM(monto), 0)::float8 AS total
    FROM gastos
    WHERE (${mes ?? null}::text IS NULL OR to_char(fecha, 'YYYY-MM') = ${mes ?? null})
      AND (${categoria ?? null}::text IS NULL OR categoria = ${categoria ?? null})`;
	return Number(row.total);
}
async function listCategoriasGasto() {
	return (await sql`
    SELECT DISTINCT categoria FROM gastos ORDER BY categoria ASC`).map((r) => r.categoria);
}
async function getGasto(id) {
	return (await sql`
    SELECT id, fecha::text AS fecha, categoria, descripcion, monto::float8 AS monto
    FROM gastos
    WHERE id = ${id}`)[0] ?? null;
}
async function createGasto(data) {
	const [row] = await sql`
    INSERT INTO gastos (fecha, categoria, descripcion, monto)
    VALUES (${data.fecha}, ${data.categoria}, ${data.descripcion}, ${data.monto})
    RETURNING id`;
	return row.id;
}
async function updateGasto(id, data) {
	await sql`
    UPDATE gastos
    SET fecha = ${data.fecha},
        categoria = ${data.categoria},
        descripcion = ${data.descripcion},
        monto = ${data.monto}
    WHERE id = ${id}`;
}
async function deleteGasto(id) {
	await sql`DELETE FROM gastos WHERE id = ${id}`;
}
//#endregion
export { listGastos as a, listCategoriasGasto as i, deleteGasto as n, totalGastos as o, getGasto as r, updateGasto as s, createGasto as t };
