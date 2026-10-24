const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const copCompactFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  notation: 'compact',
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
});

const ZONA = 'America/Bogota';

const longDateFormatter = new Intl.DateTimeFormat('es-CO', {
  timeZone: ZONA,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('es-CO', {
  timeZone: ZONA,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const monthNameFormatter = new Intl.DateTimeFormat('es-CO', {
  timeZone: ZONA,
  month: 'long',
  year: 'numeric',
});

export function formatCOP(amount: number): string {
  return copFormatter.format(Math.round(amount));
}

/**
 * Cifra abreviada para tarjetas estrechas: $1,2 M en vez de $1.234.567.
 * Por debajo del millón conserva el valor completo.
 */
export function formatCOPCompacto(amount: number): string {
  const valor = Math.round(amount);
  return Math.abs(valor) >= 1_000_000 ? copCompactFormatter.format(valor) : formatCOP(valor);
}

export function formatFechaLarga(date: Date | string): string {
  return longDateFormatter.format(toDate(date));
}

export function formatFechaCorta(date: Date | string): string {
  return shortDateFormatter.format(toDate(date));
}

export function formatHora(date: Date | string | null | undefined): string {
  if (!date) return '';
  // `ventas.hora_registro` es `time`: Postgres lo entrega como "HH:MM:SS" o
  // "HH:MM:SS.ffffff" (con microsegundos).
  if (typeof date === 'string') {
    const hora = date.match(/^(\d{1,2}):(\d{2})(?::\d{2}(?:\.\d+)?)?$/);
    if (hora) {
      const h24 = Number(hora[1]);
      const h12 = h24 % 12 || 12;
      return `${h12}:${hora[2]} ${h24 < 12 ? 'a. m.' : 'p. m.'}`;
    }
  }
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('es-CO', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Bogota',
  }).format(d);
}

export function formatFechaHora(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return `${formatFechaCorta(d)} ${formatHora(d)}`;
}

export function formatMes(date: Date | string): string {
  return monthNameFormatter.format(toDate(date));
}

export function formatMesCorto(date: Date | string): string {
  return new Intl.DateTimeFormat('es-CO', { month: 'short', timeZone: ZONA })
    .format(toDate(date))
    .replace('.', '');
}

/**
 * Fecha de hoy en Colombia (YYYY-MM-DD), independiente de la zona horaria
 * del servidor. En Vercel el proceso corre en UTC y por la noche ya sería
 * el día siguiente.
 */
export function hoyISO(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/** Mes actual en Colombia (YYYY-MM). */
export function mesISO(date: Date | string = new Date()): string {
  const d = date instanceof Date ? date : toDate(date);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA,
    year: 'numeric',
    month: '2-digit',
  }).format(d);
}

export function parseISODate(value: string): Date {
  return new Date(`${value}T12:00:00`);
}

export function capitalizarNombre(nombre: string): string {
  return nombre
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/(^|[\s'-])(\p{L})/gu, (_, sep: string, letra: string) => sep + letra.toUpperCase());
}

function toDate(value: Date | string): Date {
  if (value instanceof Date) return value;
  return parseISODate(value);
}
