export interface ProductoExistenteImport {
  id: string;
  nombre: string;
  stock: number;
  precio_compra: number;
  precio_venta: number;
  activo: boolean;
}

export interface FilaImportada {
  nombre: string;
  cantidad: number;
  costo: number;
  venta: number;
  marca: string | null;
  categoria: string;
}

export interface FilaAnalizada extends FilaImportada {
  fila: number;
  estado: 'nuevo' | 'existe';
  existente?: ProductoExistenteImport;
  advertencias: string[];
  error?: string;
}

export interface TotalesImportacion {
  filas: number;
  unidades: number;
  invertido: number;
  venta: number;
  ganancia: number;
}

export interface ErrorImportacion {
  fila: number;
  mensaje: string;
}

export interface ResultadoImportacion {
  filas: FilaAnalizada[];
  errores: ErrorImportacion[];
  totales: TotalesImportacion;
  bloqueado: boolean;
}

export interface DatosImportacion {
  existentes: ProductoExistenteImport[];
  categorias: string[];
}

interface Columnas {
  nombre: number;
  cantidad: number;
  costo: number;
  venta: number;
  marca: number;
  categoria: number;
}

const MAX_FILAS = 500;

export function normalizarNombre(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizarCelda(texto: string): string {
  return normalizarNombre(texto.replace(/[^\p{L}\p{N}\s]/gu, ' '));
}

function contarSeparador(linea: string, separador: string): number {
  if (separador === '\t' || separador === '|') {
    return linea.split(separador).length - 1;
  }
  let total = 0;
  let enComillas = false;
  for (let i = 0; i < linea.length; i++) {
    const caracter = linea[i];
    if (caracter === '"') {
      if (enComillas && linea[i + 1] === '"') {
        i++;
      } else {
        enComillas = !enComillas;
      }
    } else if (caracter === separador && !enComillas) {
      total++;
    }
  }
  return total;
}

function elegirSeparador(lineas: string[]): string {
  const muestra = lineas.slice(0, 8);
  let elegido = '\t';
  let maximo = 0;
  for (const separador of ['\t', '|', ';', ',']) {
    const total = muestra.reduce((suma, linea) => suma + contarSeparador(linea, separador), 0);
    if (total > maximo) {
      maximo = total;
      elegido = separador;
    }
  }
  return elegido;
}

function dividirLinea(linea: string, separador: string): string[] {
  let texto = linea.trim();
  if (separador === '|') {
    texto = texto.replace(/^\|/, '').replace(/\|$/, '');
  }
  if (separador === '\t' || separador === '|') {
    return texto.split(separador).map((celda) => celda.trim());
  }
  const celdas: string[] = [];
  let actual = '';
  let enComillas = false;
  for (let i = 0; i < texto.length; i++) {
    const caracter = texto[i];
    if (caracter === '"') {
      if (enComillas && texto[i + 1] === '"') {
        actual += '"';
        i++;
      } else {
        enComillas = !enComillas;
      }
    } else if (caracter === separador && !enComillas) {
      celdas.push(actual);
      actual = '';
    } else {
      actual += caracter;
    }
  }
  celdas.push(actual);
  return celdas.map((celda) => celda.trim());
}

function mapearCabecera(celdas: string[]): Columnas | null {
  const normalizadas = celdas.map(normalizarCelda);
  const columnas: Columnas = {
    nombre: -1,
    cantidad: -1,
    costo: -1,
    venta: -1,
    marca: -1,
    categoria: -1,
  };

  normalizadas.forEach((valor, indice) => {
    if (columnas.nombre < 0 && (valor === 'producto' || valor === 'nombre' || valor.includes('producto'))) {
      columnas.nombre = indice;
    } else if (
      columnas.cantidad < 0 &&
      (valor.startsWith('cant') || valor.includes('unidad') || valor === 'qty')
    ) {
      columnas.cantidad = indice;
    } else if (columnas.costo < 0 && (valor.includes('compra') || valor.includes('costo'))) {
      columnas.costo = indice;
    } else if (columnas.venta < 0 && valor.includes('venta')) {
      columnas.venta = indice;
    } else if (columnas.marca < 0 && valor.includes('marca')) {
      columnas.marca = indice;
    } else if (columnas.categoria < 0 && valor.includes('categoria')) {
      columnas.categoria = indice;
    }
  });

  if (columnas.nombre < 0 || columnas.cantidad < 0 || columnas.costo < 0 || columnas.venta < 0) {
    return null;
  }
  return columnas;
}

function esLineaSeparadora(linea: string): boolean {
  return /^[\s:|-]+$/.test(linea);
}

export function parsearNumero(texto: string): number | null {
  let limpio = texto
    .trim()
    .replace(/[$\s\u00a0]/g, '')
    .replace(/COP/gi, '');
  if (!limpio) return null;

  const tienePunto = limpio.includes('.');
  const tieneComa = limpio.includes(',');

  if (tienePunto && tieneComa) {
    if (limpio.lastIndexOf(',') > limpio.lastIndexOf('.')) {
      limpio = limpio.replace(/\./g, '').replace(',', '.');
    } else {
      limpio = limpio.replace(/,/g, '');
    }
  } else if (tieneComa) {
    const partes = limpio.split(',');
    if (partes.length > 2 || (partes[1]?.length === 3 && partes[0].length <= 3)) {
      limpio = limpio.replace(/,/g, '');
    } else {
      limpio = limpio.replace(',', '.');
    }
  } else if (tienePunto) {
    const partes = limpio.split('.');
    if (partes.length > 2 || (partes[1]?.length === 3 && partes[0].length <= 3)) {
      limpio = limpio.replace(/\./g, '');
    }
  }

  const numero = Number(limpio);
  return Number.isFinite(numero) ? numero : null;
}

function parsearEntero(texto: string): number | null {
  const numero = parsearNumero(texto);
  return numero !== null && Number.isInteger(numero) ? numero : null;
}

function limpiarMarca(texto: string): string | null {
  const marca = texto.trim();
  if (!marca) return null;
  const normalizada = normalizarNombre(marca);
  if (
    normalizada === 'no identificada' ||
    normalizada === 'sin marca' ||
    normalizada === 'ninguna' ||
    normalizada === 'n a' ||
    normalizada === 'na' ||
    normalizada === '-'
  ) {
    return null;
  }
  return marca;
}

function canonizarCategoria(texto: string, categorias: string[]): string {
  const categoria = texto.trim();
  if (!categoria) return 'Maquillaje';
  const normalizada = normalizarNombre(categoria);
  const existente = categorias.find((item) => normalizarNombre(item) === normalizada);
  return existente ?? categoria.slice(0, 40);
}

export function parsearLista(texto: string, datos: DatosImportacion): ResultadoImportacion {
  const totalesVacios: TotalesImportacion = {
    filas: 0,
    unidades: 0,
    invertido: 0,
    venta: 0,
    ganancia: 0,
  };

  const lineas = texto
    .replace(/\r\n?/g, '\n')
    .replace(/^\uFEFF/, '')
    .split('\n')
    .map((linea) => linea.trim())
    .filter((linea) => linea && !linea.startsWith('```'));

  if (lineas.length === 0) {
    return {
      filas: [],
      errores: [{ fila: 0, mensaje: 'Pega una lista para analizar.' }],
      totales: totalesVacios,
      bloqueado: true,
    };
  }

  const separador = elegirSeparador(lineas);
  let columnas: Columnas | null = null;
  let inicio = 0;

  for (let i = 0; i < Math.min(lineas.length, 6); i++) {
    const candidatas = mapearCabecera(dividirLinea(lineas[i], separador));
    if (candidatas) {
      columnas = candidatas;
      inicio = i + 1;
      break;
    }
  }

  if (!columnas) {
    const primera = dividirLinea(lineas[0], separador);
    const conNumero = primera.length >= 7 && /^\d+$/.test(primera[0]?.replace(/[^\d]/g, '') ?? '');
    const offset = conNumero ? 1 : 0;
    columnas = {
      nombre: offset,
      cantidad: offset + 1,
      costo: offset + 2,
      venta: offset + 3,
      marca: offset + 4,
      categoria: offset + 5,
    };
    inicio = 0;
  }

  const lineasDatos = lineas
    .slice(inicio)
    .filter((linea) => !esLineaSeparadora(linea))
    .filter((linea) => dividirLinea(linea, separador).length >= 2);

  if (lineasDatos.length === 0) {
    return {
      filas: [],
      errores: [{ fila: 0, mensaje: 'No se encontraron filas de productos en la lista.' }],
      totales: totalesVacios,
      bloqueado: true,
    };
  }

  if (lineasDatos.length > MAX_FILAS) {
    return {
      filas: [],
      errores: [{ fila: 0, mensaje: `La lista supera el máximo de ${MAX_FILAS} filas.` }],
      totales: totalesVacios,
      bloqueado: true,
    };
  }

  const existentesPorNombre = new Map<string, ProductoExistenteImport>();
  const conteoExistentes = new Map<string, number>();

  for (const producto of datos.existentes) {
    const clave = normalizarNombre(producto.nombre);
    conteoExistentes.set(clave, (conteoExistentes.get(clave) ?? 0) + 1);
    const previo = existentesPorNombre.get(clave);
    if (!previo || (!previo.activo && producto.activo)) {
      existentesPorNombre.set(clave, producto);
    }
  }

  const errores: ErrorImportacion[] = [];
  const filas: FilaAnalizada[] = [];
  const vistos = new Set<string>();
  let filasValidas = 0;
  let unidades = 0;
  let invertido = 0;
  let ventaTotal = 0;

  lineasDatos.forEach((linea, indice) => {
    const celdas = dividirLinea(linea, separador);
    if (celdas.every((celda) => !celda)) return;

    const fila = indice + 1;
    const nombre = (celdas[columnas.nombre] ?? '').trim();
    const cantidadTexto = (celdas[columnas.cantidad] ?? '').trim();
    const costoTexto = (celdas[columnas.costo] ?? '').trim();
    const ventaTexto = (celdas[columnas.venta] ?? '').trim();
    const marcaTexto = columnas.marca >= 0 ? (celdas[columnas.marca] ?? '').trim() : '';
    const categoriaTexto = columnas.categoria >= 0 ? (celdas[columnas.categoria] ?? '').trim() : '';
    const advertencias: string[] = [];
    const problemas: string[] = [];

    if (!nombre) {
      problemas.push('Falta el nombre.');
    } else if (nombre.length < 2 || nombre.length > 120) {
      problemas.push('El nombre debe tener entre 2 y 120 caracteres.');
    }

    const cantidad = parsearEntero(cantidadTexto);
    if (cantidad === null || cantidad < 1 || cantidad > 9999) {
      problemas.push('La cantidad debe ser un entero entre 1 y 9999.');
    }

    const costo = parsearNumero(costoTexto);
    if (costo === null || costo < 0) {
      problemas.push('El costo de compra debe ser un número mayor o igual a 0.');
    }

    const venta = parsearNumero(ventaTexto);
    if (venta === null || venta < 0) {
      problemas.push('El precio de venta debe ser un número mayor o igual a 0.');
    }

    const marca = limpiarMarca(marcaTexto);
    if (marca && marca.length > 80) {
      problemas.push('La marca supera los 80 caracteres.');
    }

    if (categoriaTexto.length > 40) {
      problemas.push('La categoría supera los 40 caracteres.');
    }

    if (costo !== null && venta !== null && venta < costo) {
      advertencias.push('La venta es menor que el costo.');
    }
    if (costo === 0) advertencias.push('Costo en 0.');
    if (venta === 0) advertencias.push('Precio de venta en 0.');

    const clave = nombre ? normalizarNombre(nombre) : '';
    if (clave) {
      if (vistos.has(clave)) {
        problemas.push('Nombre repetido en la lista.');
      } else {
        vistos.add(clave);
      }
    }

    const existente = clave ? existentesPorNombre.get(clave) : undefined;
    if (existente && (conteoExistentes.get(clave) ?? 0) > 1) {
      advertencias.push('Hay varios productos con ese nombre; se actualizará el activo.');
    }

    const error = problemas.join(' ');
    if (error) errores.push({ fila, mensaje: error });

    const filaAnalizada: FilaAnalizada = {
      fila,
      nombre: nombre || '(sin nombre)',
      cantidad: cantidad ?? 0,
      costo: costo ?? 0,
      venta: venta ?? 0,
      marca,
      categoria: canonizarCategoria(categoriaTexto, datos.categorias ?? []),
      estado: existente ? 'existe' : 'nuevo',
      existente,
      advertencias,
      error: error || undefined,
    };

    filas.push(filaAnalizada);

    if (!error) {
      filasValidas++;
      unidades += cantidad as number;
      invertido += (cantidad as number) * (costo as number);
      ventaTotal += (cantidad as number) * (venta as number);
    }
  });

  return {
    filas,
    errores,
    totales: {
      filas: filasValidas,
      unidades,
      invertido,
      venta: ventaTotal,
      ganancia: ventaTotal - invertido,
    },
    bloqueado: errores.length > 0 || filasValidas === 0,
  };
}
