import { DEMO_MODE } from 'astro:env/server';

/**
 * El modo demo oculta el formulario de contraseña y permite entrar con un
 * botón. Solo debe activarse en el proyecto desplegado como demo.
 */
const fromProcess =
  typeof process !== 'undefined' ? process.env.DEMO_MODE : undefined;

function esVerdadero(valor: unknown): boolean {
  if (valor === true || valor === 1) return true;
  if (typeof valor === 'string') {
    const normalizado = valor.trim().toLowerCase();
    return normalizado === 'true' || normalizado === '1' || normalizado === 'yes' || normalizado === 'on';
  }
  return false;
}

export const ES_DEMO = esVerdadero(DEMO_MODE) || esVerdadero(fromProcess);

