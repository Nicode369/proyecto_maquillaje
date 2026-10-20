import { neon } from '@neondatabase/serverless';
import { NEON_DATABASE_URL } from 'astro:env/server';

function crearCliente() {
  return neon<false, false>(NEON_DATABASE_URL as string);
}

type ClienteNeon = ReturnType<typeof crearCliente>;

function sinBaseDeDatos(): never {
  throw new Error(
    'Falta NEON_DATABASE_URL. Copia .env.example a .env, configura la URL de Neon y reinicia el servidor.',
  );
}

export const sql = (NEON_DATABASE_URL
  ? crearCliente()
  : sinBaseDeDatos) as ClienteNeon;
