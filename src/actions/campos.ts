import { z } from 'astro/zod';
import { esFechaISO } from '../lib/fechas';

/** Fecha YYYY-MM-DD que además existe en el calendario. */
export const fechaISO = z
  .string()
  .trim()
  .refine(esFechaISO, 'Fecha no válida');
