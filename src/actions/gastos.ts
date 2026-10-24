import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { exigirSesion } from './sesion';
import { fechaISO } from './campos';
import { fallo } from '../lib/errores';
import {
  createGasto,
  deleteGasto,
  getGasto,
  updateGasto,
} from '../lib/queries/gastos';

const esquemaGasto = z.object({
  fecha: fechaISO,
  categoria: z.string().trim().min(1, 'Elige una categoría').max(40),
  descripcion: z
    .string()
    .trim()
    .min(3, 'Describe el gasto (mínimo 3 caracteres)')
    .max(200),
  monto: z.preprocess(
    (val) => {
      if (val === null || val === undefined) return val;
      if (typeof val === 'number') return val;
      if (typeof val !== 'string') return val;
      const s = val.trim();
      if (s === '') return s;
      // Reemplazar espacios
      const sinEsp = s.replace(/\s+/g, '');
      // Si contiene coma como decimal (es-CO)
      if (sinEsp.includes(',')) {
        const sinMiles = sinEsp.replace(/\./g, '');
        const conPunto = sinMiles.replace(',', '.');
        return conPunto;
      }
      // Sin coma: tratar puntos como separadores de miles
      const soloDigitosOPunto = sinEsp.replace(/\./g, '');
      return soloDigitosOPunto;
    },
    z
      .string({ message: 'El monto debe ser un número válido' })
      .refine((s) => /^\d+(\.\d+)?$/.test(s), 'El monto debe ser un número válido')
      .transform((s) => parseFloat(s))
      .refine((n) => !Number.isNaN(n) && Number.isFinite(n), 'El monto debe ser un número válido')
      .refine((n) => n >= 1, 'El monto debe ser mayor a cero'),
  ),
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
      if (!existente) fallo('El gasto ya no existe.', 'NOT_FOUND');
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
