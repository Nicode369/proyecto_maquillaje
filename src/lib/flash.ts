import type { AstroCookies } from 'astro';

export type FlashTipo = 'success' | 'error' | 'warning' | 'info';

export interface FlashMensaje {
  tipo: FlashTipo;
  texto: string;
}

const COOKIE = 'maquillaje_flash';

export function ponerFlash(cookies: AstroCookies, mensaje: FlashMensaje) {
  cookies.set(COOKIE, JSON.stringify(mensaje), {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60,
  });
}

export function leerFlash(cookies: AstroCookies): FlashMensaje | null {
  const bruto = cookies.get(COOKIE)?.value;
  if (!bruto) return null;
  try {
    const m = JSON.parse(bruto);
    if (m && typeof m.tipo === 'string' && typeof m.texto === 'string') {
      return m as FlashMensaje;
    }
  } catch {
    return null;
  }
  return null;
}

export function borrarFlash(cookies: AstroCookies) {
  cookies.delete(COOKIE, { path: '/' });
}
