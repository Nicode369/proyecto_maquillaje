import { DEMO_MODE, DEMO_RESET_DATABASE_URL } from 'astro:env/server';

/**
 * El modo demo oculta el formulario de contraseña y permite entrar con un
 * botón. Solo debe activarse en el proyecto desplegado como demo.
 *
 * Se activa con `DEMO_MODE=true` o, como respaldo, cuando el proyecto tiene
 * configurada la base de reseteo del demo (`DEMO_RESET_DATABASE_URL`), que
 * nunca debe existir en producción.
 */
function esVerdadero(valor: unknown): boolean {
  if (valor === true || valor === 1) return true;
  if (typeof valor === 'string') {
    const normalizado = valor.trim().toLowerCase();
    return (
      normalizado === 'true' || normalizado === '1' || normalizado === 'yes' || normalizado === 'on'
    );
  }
  return false;
}

export const ES_DEMO = esVerdadero(DEMO_MODE) || Boolean(DEMO_RESET_DATABASE_URL);
