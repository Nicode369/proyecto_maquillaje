import { defineMiddleware } from 'astro:middleware';
import { SESSION_COOKIE, verificarSesion } from './lib/auth';

const RUTAS_PUBLICAS = new Set(['/login', '/favicon.svg', '/robots.txt']);

export const onRequest = defineMiddleware(async (context, next) => {
  const ruta = context.url.pathname.replace(/\/+$/, '') || '/';

  if (RUTAS_PUBLICAS.has(ruta)) {
    if (ruta === '/login' && (await verificarSesion(context.cookies.get(SESSION_COOKIE)?.value))) {
      return context.redirect('/');
    }
    return next();
  }

  const autenticado = await verificarSesion(context.cookies.get(SESSION_COOKIE)?.value);
  if (!autenticado) {
    return context.redirect('/login');
  }

  return next();
});
