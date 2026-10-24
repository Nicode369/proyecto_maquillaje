import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { neon } from '@neondatabase/serverless';
import { DEMO_RESET_DATABASE_URL } from 'astro:env/server';
import { ES_DEMO } from '../lib/demo';
import { exigirSesion } from './sesion';
import { sembrarDemo } from '../lib/seed/demo';
import { ponerFlash } from '../lib/flash';

export const demo = {
  restaurar: defineAction({
    accept: 'form',
    input: z.object({}),
    handler: async (_input, context) => {
      if (!ES_DEMO) {
        throw new ActionError({ code: 'NOT_FOUND', message: 'No disponible.' });
      }

      await exigirSesion(context);

      if (!DEMO_RESET_DATABASE_URL) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Falta configurar DEMO_RESET_DATABASE_URL en el servidor del demo.',
        });
      }

      try {
        const sql = neon(DEMO_RESET_DATABASE_URL);
        const resumen = await sembrarDemo(sql, { truncar: true });

        ponerFlash(context.cookies, {
          tipo: 'success',
          texto:
            `Demo restaurado: ${resumen.ventas} ventas, ` +
            `${resumen.abonos} abonos y ${resumen.clientas} clientas.`,
        });

        return { ok: true, ...resumen };
      } catch (error) {
        console.error('No se pudo restaurar el demo:', error);
        ponerFlash(context.cookies, {
          tipo: 'error',
          texto: 'No se pudo restaurar el demo. Intenta de nuevo en unos segundos.',
        });
        return { ok: false };
      }
    },
  }),
};
