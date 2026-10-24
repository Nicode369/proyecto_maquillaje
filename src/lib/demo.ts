import { DEMO_MODE } from 'astro:env/server';

/**
 * El modo demo oculta el formulario de contraseña y permite entrar con un
 * botón. Solo debe activarse en el proyecto desplegado como demo.
 */
export const ES_DEMO =
  DEMO_MODE === true ||
  String(DEMO_MODE).toLowerCase() === 'true' ||
  String(DEMO_MODE) === '1';

