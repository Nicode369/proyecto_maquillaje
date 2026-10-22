import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { exigirSesion } from './sesion';
import { capitalizarNombre, formatCOP } from '../lib/format';
import {
  createCliente,
  deleteCliente,
  getCliente,
  updateCliente,
} from '../lib/queries/clientes';

const esquemaCliente = z.object({
  nombre: z.string().trim().min(2, 'Escribe el nombre de la clienta').max(120),
  telefono: z.string().trim().max(30).nullable().optional(),
  email: z
    .string()
    .trim()
    .max(120)
    .refine(
      (valor) => valor === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor),
      'Escribe un correo válido',
    )
    .nullable()
    .optional(),
  notas: z.string().trim().max(2000).nullable().optional(),
});

function limpiar(data: {
  nombre: string;
  telefono?: string | null;
  email?: string | null;
  notas?: string | null;
}) {
  return {
    nombre: capitalizarNombre(data.nombre),
    telefono: data.telefono?.trim() || null,
    email: data.email?.trim() || null,
    notas: data.notas?.trim() || null,
  };
}

export const clientes = {
  crear: defineAction({
    accept: 'form',
    input: esquemaCliente,
    handler: async (input, context) => {
      await exigirSesion(context);
      const id = await createCliente(limpiar(input));
      return { id };
    },
  }),

  actualizar: defineAction({
    accept: 'form',
    input: esquemaCliente.extend({ id: z.uuid('Identificador no válido') }),
    handler: async (input, context) => {
      await exigirSesion(context);
      const existente = await getCliente(input.id);
      if (!existente) {
        throw new Error('La clienta ya no existe.');
      }
      await updateCliente(input.id, limpiar(input));
      return { id: input.id };
    },
  }),

  eliminar: defineAction({
    accept: 'form',
    input: z.object({ id: z.uuid('Identificador no válido') }),
    handler: async (input, context) => {
      await exigirSesion(context);
      const existente = await getCliente(input.id);
      if (!existente) return { ok: true };
      if (existente.saldo > 0) {
        throw new Error(
          `No se puede eliminar a ${existente.nombre}: tiene un saldo pendiente de ${formatCOP(existente.saldo)}. Registra el abono antes de eliminarla.`,
        );
      }
      await deleteCliente(input.id);
      return { ok: true };
    },
  }),
};
