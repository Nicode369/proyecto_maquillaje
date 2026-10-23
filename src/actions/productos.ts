import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { exigirSesion } from './sesion';
import { fallo } from '../lib/errores';
import {
  createProducto,
  deleteProducto,
  getProducto,
  updateProducto,
} from '../lib/queries/productos';

const esquemaProducto = z.object({
  nombre: z.string().trim().min(2, 'Escribe el nombre del producto').max(120),
  marca: z.string().trim().max(80).nullable().optional(),
  categoria: z.string().trim().min(1, 'Elige una categoría').max(40),
  stock: z.coerce
    .number({ message: 'El stock debe ser un número' })
    .int('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo'),
  stock_minimo: z.coerce
    .number({ message: 'El mínimo debe ser un número' })
    .int('El mínimo debe ser un número entero')
    .min(0, 'El mínimo no puede ser negativo'),
  precio_compra: z.coerce
    .number({ message: 'El precio de compra debe ser un número' })
    .min(0, 'El precio no puede ser negativo'),
  precio_venta: z.coerce
    .number({ message: 'El precio de venta debe ser un número' })
    .min(0, 'El precio no puede ser negativo'),
  imagen: z
    .string()
    .max(1_400_000, 'La imagen es demasiado grande')
    .refine(
      (v) => v === '' || /^data:image\/(jpeg|jpg|png|webp);base64,/.test(v),
      'Formato de imagen no válido',
    )
    .nullable()
    .optional(),
  activo: z.boolean(),
});

function limpiar(data: z.infer<typeof esquemaProducto>) {
  return {
    nombre: data.nombre,
    marca: data.marca?.trim() || null,
    categoria: data.categoria,
    stock: data.stock,
    stock_minimo: data.stock_minimo,
    precio_compra: data.precio_compra,
    precio_venta: data.precio_venta,
    activo: data.activo,
    imagen: data.imagen || null,
  };
}

export const productos = {
  crear: defineAction({
    accept: 'form',
    input: esquemaProducto,
    handler: async (input, context) => {
      await exigirSesion(context);
      const id = await createProducto(limpiar(input));
      return { id };
    },
  }),

  actualizar: defineAction({
    accept: 'form',
    input: esquemaProducto.extend({ id: z.uuid('Identificador no válido') }),
    handler: async (input, context) => {
      await exigirSesion(context);
      const existente = await getProducto(input.id);
      if (!existente) fallo('El producto ya no existe.', 'NOT_FOUND');
      await updateProducto(input.id, limpiar(input));
      return { id: input.id };
    },
  }),

  eliminar: defineAction({
    accept: 'form',
    input: z.object({ id: z.uuid('Identificador no válido') }),
    handler: async (input, context) => {
      await exigirSesion(context);
      const existente = await getProducto(input.id);
      if (!existente) return { eliminado: true, teniaVentas: false, nombre: '' };
      const eliminado = await deleteProducto(input.id);
      return { eliminado, teniaVentas: !eliminado, nombre: existente.nombre };
    },
  }),
};
