import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { exigirSesion } from './sesion';
import {
  createGasto,
  deleteGasto,
  getGasto,
  updateGasto,
} from '../lib/queries/gastos';

const esquemaGasto = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha no válida'),
  categoria: z.string().trim().min(1, 'Elige una categoría').max(40),
  descripcion: z
    .string()
    .trim()
    .min(3, 'Describe el gasto (mínimo 3 caracteres)')
    .max(200),
  monto: z.coerce
    .number({ message: 'El monto debe ser un número' })
    .min(1, 'El monto debe ser mayor a cero'),
});

export const gastos = {
  crear: defineAction({
    accept: 'form',
    input: esquemaGasto,
    handler: async (input, context) => {
      await exigirSesion(context);
      const id = await createGasto(input);
      return { id };
    },
  }),

  actualizar: defineAction({
    accept: 'form',
    input: esquemaGasto.extend({ id: z.uuid('Identificador no válido') }),
    handler: async (input, context) => {
      await exigirSesion(context);
      const existente = await getGasto(input.id);
      if (!existente) {
        throw new Error('El gasto ya no existe.');
      }
      await updateGasto(input.id, input);
      return { id: input.id };
    },
  }),

  eliminar: defineAction({
    accept: 'form',
    input: z.object({ id: z.uuid('Identificador no válido') }),
    handler: async (input, context) => {
      await exigirSesion(context);
      const existente = await getGasto(input.id);
      if (!existente) return { ok: true };
      await deleteGasto(input.id);
      return { ok: true };
    },
  }),
};
