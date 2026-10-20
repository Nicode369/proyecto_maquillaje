import { SESSION_SECRET } from 'astro:env/server';

export const SESSION_COOKIE = 'panel_session';

const DURACION_MS = 14 * 24 * 60 * 60 * 1000;

function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const byte of bytes) bin += String.fromCharCode(byte);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function claveHmac(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export async function firmarSesion(): Promise<string> {
  const cuerpo = toBase64Url(
    new TextEncoder().encode(JSON.stringify({ exp: Date.now() + DURACION_MS })),
  );
  const firma = await crypto.subtle.sign(
    'HMAC',
    await claveHmac(),
    new TextEncoder().encode(cuerpo),
  );
  return `${cuerpo}.${toBase64Url(new Uint8Array(firma))}`;
}

export async function verificarSesion(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [cuerpo, firma] = token.split('.');
  if (!cuerpo || !firma) return false;
  try {
    const valido = await crypto.subtle.verify(
      'HMAC',
      await claveHmac(),
      fromBase64Url(firma),
      new TextEncoder().encode(cuerpo),
    );
    if (!valido) return false;
    const payload = JSON.parse(
      new TextDecoder().decode(fromBase64Url(cuerpo)),
    ) as { exp?: number };
    return typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function opcionesCookie() {
  return {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: DURACION_MS / 1000,
  };
}

export function contrasenasIguales(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const ba = encoder.encode(a);
  const bb = encoder.encode(b);
  if (ba.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ba.length; i++) diff |= ba[i] ^ bb[i];
  return diff === 0;
}
