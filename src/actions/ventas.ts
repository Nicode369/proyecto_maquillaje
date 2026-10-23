import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { exigirSesion } from './sesion';
import { fechaISO } from './campos';
import { fallo } from '../lib/errores';
import { listClientes } from '../lib/queries/clientes';
import {
  anularVenta,
  createVenta,
  getVenta,
  reactivarVenta,
  registrarAbono,
} from '../lib/queries/ventas';

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
  fecha: fechaISO,
  cliente_id: z.uuid('Clienta no válida').nullable(),
  metodo_pago: z.string().trim().min(1, 'Elige un método de pago').max(30),
  descuento: z.coerce
    .number({ message: 'El descuento debe ser un número' })
    .min(0, 'El descuento no puede ser negativo'),
  notas: z.string().trim().max(500).nullable(),
  credito: z.coerce.boolean().optional().default(false),
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

      if (input.credito && !input.cliente_id) {
        fallo(
          'Si la venta es a crédito, elige la clienta que queda pendiente.',
          'BAD_REQUEST',
        );
      }

      if (input.cliente_id) {
        const clientas = await listClientes();
        if (!clientas.some((c) => c.id === input.cliente_id)) {
          fallo('La clienta seleccionada ya no existe.', 'NOT_FOUND');
        }
      }

      const id = await createVenta({
        fecha: input.fecha,
        clienteId: input.cliente_id,
        metodoPago: input.metodo_pago,
        descuento: input.descuento,
        notas: input.notas,
        credito: input.credito,
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
      if (!venta) fallo('La venta ya no existe.', 'NOT_FOUND');
      if (venta.anulada) fallo('Esta venta ya está anulada.', 'CONFLICT');
      if (venta.abonos.length > 0) {
        fallo(
          'Esta venta tiene abonos registrados y no se puede anular. Si el pago se anuló por error, ajusta los abonos desde el detalle de la venta.',
          'CONFLICT',
        );
      }
      await anularVenta(input.id);
      return { ok: true };
    },
  }),

  reactivar: defineAction({
    accept: 'form',
    input: z.object({ id: z.uuid('Identificador no válido') }),
    handler: async (input, context) => {
      await exigirSesion(context);
      const venta = await getVenta(input.id);
      if (!venta) fallo('La venta ya no existe.', 'NOT_FOUND');
      if (!venta.anulada) fallo('Esta venta no está anulada.', 'CONFLICT');
      await reactivarVenta(input.id);
      return { ok: true };
    },
  }),

  registrarAbono: defineAction({
    accept: 'form',
    input: z.object({
      venta_id: z.uuid('Identificador no válido'),
      fecha: fechaISO,
      monto: z.coerce
        .number({ message: 'El monto debe ser un número' })
        .min(0.01, 'El monto debe ser mayor a cero'),
      notas: z.string().trim().max(300).nullable(),
    }),
    handler: async (input, context) => {
      await exigirSesion(context);
      await registrarAbono({
        ventaId: input.venta_id,
        fecha: input.fecha,
        monto: input.monto,
        notas: input.notas,
      });
      return { ok: true };
    },
  }),
};
