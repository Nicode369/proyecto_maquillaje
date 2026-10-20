const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
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

export function formatFechaLarga(date: Date | string): string {
  return longDateFormatter.format(toDate(date));
}

export function formatFechaCorta(date: Date | string): string {
  return shortDateFormatter.format(toDate(date));
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

function toDate(value: Date | string): Date {
  if (value instanceof Date) return value;
  return parseISODate(value);
}
