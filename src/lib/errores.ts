import { ActionError } from 'astro:actions';

type Codigo = 'BAD_REQUEST' | 'CONFLICT' | 'NOT_FOUND';

/**
 * Error de negocio con estado HTTP correcto (400/404/409) en vez de 500.
 * El mensaje se muestra tal cual en el Alert del formulario.
 */
export function fallo(mensaje: string, codigo: Codigo = 'CONFLICT'): never {
  throw new ActionError({ code: codigo, message: mensaje });
}
