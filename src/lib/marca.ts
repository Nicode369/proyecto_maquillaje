import { BRAND_NAME } from 'astro:env/server';

export function getMarca(): { nombre: string; resto: string; ultima: string } {
  const nombre = (BRAND_NAME || 'J&M Beauty').trim() || 'J&M Beauty';
  const partes = nombre.split(/\s+/).filter(Boolean);
  if (partes.length === 1) {
    return { nombre, resto: '', ultima: partes[0] };
  }
  const ultima = partes.pop()!;
  const resto = partes.join(' ');
  return { nombre, resto, ultima };
}
