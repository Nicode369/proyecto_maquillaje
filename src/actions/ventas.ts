import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { exigirSesion } from './sesion';
import { listClientes } from '../lib/queries/clientes';
import { anularVenta, createVenta, getVenta } from '../lib/queries/ventas';

const esquemaLinea = z.object({
  producto_id: z.uuid().nullable(),
  descripcion: z.string().trim().min(1, 'Describe el producto o servicio').max(200),
  cantidad: z.coerce
    .number({ message: 'La cantidad debe ser un número' })
    .int('La cantidad debe ser un número entero')
    .min(1, 'La cantidad mínima es 1'),
  precio_unitario: z.coerce
    .number({ message: 'El precio debe ser un número' })
    .min(0, 'El precio no puede ser negativo'),
});

const esquemaVenta = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha no válida'),
  cliente_id: z.uuid('Clienta no válida').nullable(),
  metodo_pago: z.string().trim().min(1, 'Elige un método de pago').max(30),
  descuento: z.coerce
    .number({ message: 'El descuento debe ser un número' })
    .min(0, 'El descuento no puede ser negativo'),
  notas: z.string().trim().max(500).nullable(),
  items_json: z
    .string()
    .transform((texto, ctx) => {
      try {
        return JSON.parse(texto) as unknown;
      } catch {
        ctx.addIssue({ code: 'custom', message: 'Error en los productos de la venta' });
        return z.NEVER;
      }
    })
    .pipe(
      z
        .array(esquemaLinea)
        .min(1, 'Agrega al menos un producto o servicio')
        .max(30),
    ),
});

export const ventas = {
  crear: defineAction({
    accept: 'form',
    input: esquemaVenta,
    handler: async (input, context) => {
      await exigirSesion(context);

      if (input.cliente_id) {
        const clientas = await listClientes();
        if (!clientas.some((c) => c.id === input.cliente_id)) {
          throw new Error('La clienta seleccionada ya no existe.');
        }
      }

      const id = await createVenta({
        fecha: input.fecha,
        clienteId: input.cliente_id,
        metodoPago: input.metodo_pago,
        descuento: input.descuento,
        notas: input.notas,
        items: input.items_json.map((linea) => ({
          productoId: linea.producto_id,
          descripcion: linea.descripcion,
          cantidad: linea.cantidad,
          precioUnitario: linea.precio_unitario,
        })),
      });

      return { id };
    },
  }),

  anular: defineAction({
    accept: 'form',
    input: z.object({ id: z.uuid('Identificador no válido') }),
    handler: async (input, context) => {
      await exigirSesion(context);
      const venta = await getVenta(input.id);
      if (!venta) {
        throw new Error('La venta ya no existe.');
      }
      if (venta.anulada) {
        throw new Error('Esta venta ya está anulada.');
      }
      await anularVenta(input.id);
      return { ok: true };
    },
  }),
};
