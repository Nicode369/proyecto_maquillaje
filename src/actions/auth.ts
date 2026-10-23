import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { DASHBOARD_PASSWORD } from 'astro:env/server';
import { ES_DEMO } from '../lib/demo';
import {
  SESSION_COOKIE,
  contrasenasIguales,
  firmarSesion,
  opcionesCookie,
} from '../lib/auth';
import { sql } from '../lib/db';

const MAX_INTENTOS = 5;
const VENTANA_MS = 15 * 60 * 1000;
const LIMPIEZA_MS = 60 * 60 * 1000;

function ipDeRequest(request: Request, clientAddress: string | undefined): string {
  const encabezado = request.headers.get('x-forwarded-for');
  if (encabezado) return encabezado.split(',')[0].trim();
  return clientAddress || 'desconocida';
}

export const auth = {
  login: defineAction({
    accept: 'form',
    input: z.object({
      password: z.string().min(1, 'Escribe tu contraseña'),
    }),
    handler: async (input, context) => {
      if (!DASHBOARD_PASSWORD) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Falta configurar DASHBOARD_PASSWORD en el servidor.',
        });
      }

      const ip = ipDeRequest(context.request, context.clientAddress);
      const desde = new Date(Date.now() - VENTANA_MS).toISOString();
      const [intentos] = (await sql`
        SELECT COUNT(*)::int AS n
        FROM login_attempts
        WHERE ip = ${ip} AND ts > ${desde}`) as unknown as { n: number }[];

      if (intentos.n >= MAX_INTENTOS) {
        throw new ActionError({
          code: 'TOO_MANY_REQUESTS',
          message:
            'Demasiados intentos fallidos. Espera unos minutos antes de intentar de nuevo.',
        });
      }

      if (!contrasenasIguales(input.password, DASHBOARD_PASSWORD)) {
        await sql`
          DELETE FROM login_attempts
          WHERE ts < ${new Date(Date.now() - LIMPIEZA_MS).toISOString()}`;
        await sql`INSERT INTO login_attempts (ip) VALUES (${ip})`;
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Contraseña incorrecta.',
        });
      }

      await sql`DELETE FROM login_attempts WHERE ip = ${ip}`;
      context.cookies.set(SESSION_COOKIE, await firmarSesion(), opcionesCookie());
      return { ok: true };
    },
  }),

  entrarDemo: defineAction({
    accept: 'form',
    input: z.object({}),
    handler: async (_input, context) => {
      if (!ES_DEMO) {
        throw new ActionError({
          code: 'NOT_FOUND',
          message: 'No disponible.',
        });
      }

      context.cookies.set(SESSION_COOKIE, await firmarSesion(), opcionesCookie());
      return { ok: true };
    },
  }),
};
