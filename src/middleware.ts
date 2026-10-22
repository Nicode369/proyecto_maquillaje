import { defineMiddleware } from 'astro:middleware';
import { SESSION_COOKIE, verificarSesion } from './lib/auth';

const RUTAS_PUBLICAS = new Set([
  '/login',
  '/favicon.svg',
  '/favicon.ico',
  '/og-image.jpg',
  '/robots.txt',
]);

function conSeguridad(res: Response): Response {
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const ruta = context.url.pathname.replace(/\/+$/, '') || '/';

  if (RUTAS_PUBLICAS.has(ruta)) {
    if (ruta === '/login' && (await verificarSesion(context.cookies.get(SESSION_COOKIE)?.value))) {
      return conSeguridad(context.redirect('/'));
    }
    return conSeguridad(await next());
  }

  const autenticado = await verificarSesion(context.cookies.get(SESSION_COOKIE)?.value);
  if (!autenticado) {
    return conSeguridad(context.redirect('/login'));
  }

  return conSeguridad(await next());
});
