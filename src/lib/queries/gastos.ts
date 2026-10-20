import { sql } from '../db';
import type { Gasto } from './types';

export interface FiltroGastos {
  mes?: string;
  categoria?: string;
  limit?: number;
}

export async function listGastos(filtro: FiltroGastos = {}): Promise<Gasto[]> {
  const { mes, categoria, limit } = filtro;
  const rows = await sql`
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
  return rows as unknown as Gasto[];
}

export async function totalGastos(filtro: FiltroGastos = {}): Promise<number> {
  const { mes, categoria } = filtro;
  const [row] = await sql`
    SELECT COALESCE(SUM(monto), 0)::float8 AS total
    FROM gastos
    WHERE (${mes ?? null}::text IS NULL OR to_char(fecha, 'YYYY-MM') = ${mes ?? null})
      AND (${categoria ?? null}::text IS NULL OR categoria = ${categoria ?? null})`;
  return Number(row.total);
}

export async function listCategoriasGasto(): Promise<string[]> {
  const rows = await sql`
    SELECT DISTINCT categoria FROM gastos ORDER BY categoria ASC`;
  return rows.map((r) => r.categoria);
}

export async function getGasto(id: string): Promise<Gasto | null> {
  const rows = await sql`
    SELECT id, fecha::text AS fecha, categoria, descripcion, monto::float8 AS monto
    FROM gastos
    WHERE id = ${id}`;
  return (rows[0] as unknown as Gasto | undefined) ?? null;
}

export async function createGasto(data: {
  fecha: string;
  categoria: string;
  descripcion: string;
  monto: number;
}): Promise<string> {
  const [row] = await sql`
    INSERT INTO gastos (fecha, categoria, descripcion, monto)
    VALUES (${data.fecha}, ${data.categoria}, ${data.descripcion}, ${data.monto})
    RETURNING id`;
  return row.id;
}

export async function updateGasto(
  id: string,
  data: {
    fecha: string;
    categoria: string;
    descripcion: string;
    monto: number;
  },
): Promise<void> {
  await sql`
    UPDATE gastos
    SET fecha = ${data.fecha},
        categoria = ${data.categoria},
        descripcion = ${data.descripcion},
        monto = ${data.monto}
    WHERE id = ${id}`;
}

export async function deleteGasto(id: string): Promise<void> {
  await sql`DELETE FROM gastos WHERE id = ${id}`;
}
