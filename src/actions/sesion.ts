import { ActionError } from 'astro:actions';
import { SESSION_COOKIE, verificarSesion } from '../lib/auth';

interface ContextoSesion {
  cookies: { get(name: string): { value?: string } | undefined };
}

export async function exigirSesion(context: ContextoSesion): Promise<void> {
  const token = context.cookies.get(SESSION_COOKIE)?.value;
  if (!(await verificarSesion(token))) {
    throw new ActionError({ code: 'UNAUTHORIZED', message: 'Sesión no válida.' });
  }
}
