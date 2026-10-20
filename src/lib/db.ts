import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from 'astro:env/server';

function crearCliente() {
  return neon<false, false>(DATABASE_URL as string);
}

type ClienteNeon = ReturnType<typeof crearCliente>;

function sinBaseDeDatos(): never {
  throw new Error(
    'Falta DATABASE_URL. Ejecuta `neon env pull` para traer las variables de Neon y reinicia el servidor.',
  );
}

export const sql = (DATABASE_URL
  ? crearCliente()
  : sinBaseDeDatos) as ClienteNeon;
