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

const longDateFormatter = new Intl.DateTimeFormat('es-CO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const monthNameFormatter = new Intl.DateTimeFormat('es-CO', {
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
  // `ventas.hora_registro` es `time`: Postgres lo entrega como "HH:MM:SS".
  if (typeof date === 'string') {
    const hora = date.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (hora) return `${hora[1].padStart(2, '0')}:${hora[2]}`;
  }
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
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
  return new Intl.DateTimeFormat('es-CO', { month: 'short' })
    .format(toDate(date))
    .replace('.', '');
}

export function hoyISO(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function mesISO(date: Date | string = new Date()): string {
  return toDate(date).toISOString().slice(0, 7);
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
