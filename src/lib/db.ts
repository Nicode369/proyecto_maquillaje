import { neon } from '@neondatabase/serverless';
import { NEON_DATABASE_URL } from 'astro:env/server';

type ClienteNeon = ReturnType<typeof crearCliente>;

function crearCliente(): ReturnType<typeof neon> {
  return neon(NEON_DATABASE_URL as string);
}

function sinBaseDeDatos(): never {
  throw new Error(
    'Falta NEON_DATABASE_URL. Copia .env.example a .env, configura la URL de Neon y reinicia el servidor.',
  );
}

export const sql = (NEON_DATABASE_URL
  ? crearCliente()
  : sinBaseDeDatos) as ClienteNeon;
