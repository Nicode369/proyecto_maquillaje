import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { DASHBOARD_PASSWORD } from 'astro:env/server';
import {
  SESSION_COOKIE,
  contrasenasIguales,
  firmarSesion,
  opcionesCookie,
} from '../lib/auth';

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
      if (!contrasenasIguales(input.password, DASHBOARD_PASSWORD)) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Contraseña incorrecta.',
        });
      }
      context.cookies.set(SESSION_COOKIE, await firmarSesion(), opcionesCookie());
      return { ok: true };
    },
  }),
};
