export type ValorCSV = string | number | boolean | null | undefined;

function celda(valor: ValorCSV): string {
  if (valor === null || valor === undefined) return '';

  let texto = String(valor);

  if (typeof valor === 'string' && /^[=+\-@\t\r]/.test(texto)) {
    texto = `'${texto}`;
  }

  if (/[";\r\n]/.test(texto)) {
    texto = `"${texto.replace(/"/g, '""')}"`;
  }

  return texto;
}

export function crearCSV(encabezados: string[], filas: ValorCSV[][]): string {
  const lineas = [encabezados, ...filas].map((fila) => fila.map(celda).join(';'));
  return `\uFEFF${lineas.join('\r\n')}\r\n`;
}
