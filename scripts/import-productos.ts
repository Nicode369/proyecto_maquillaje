import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  console.error(
    'Falta DATABASE_URL. Ejecuta `neon env pull` y luego: npm run db:import-productos',
  );
  process.exit(1);
}

const sql = neon(url);
const aplicar = process.argv.includes('--aplicar');
const STOCK_MINIMO = 1;

interface Item {
  nombre: string;
  cantidad: number;
  costo: number;
  venta: number;
  marca: string | null;
  categoria: string;
}

const items: Item[] = [
  { nombre: 'Balacas desmaquillantes - ref. 2', cantidad: 2, costo: 8000, venta: 15000, marca: null, categoria: 'Accesorios' },
  { nombre: 'Brochas', cantidad: 2, costo: 3500, venta: 7000, marca: null, categoria: 'Accesorios' },
  { nombre: 'Kit de brochas', cantidad: 2, costo: 5000, venta: 10000, marca: null, categoria: 'Accesorios' },
  { nombre: 'Kit de bombas x 12', cantidad: 1, costo: 7500, venta: 15000, marca: null, categoria: 'Accesorios' },
  { nombre: 'Brocha para base', cantidad: 1, costo: 6000, venta: 12000, marca: null, categoria: 'Accesorios' },
  { nombre: 'Paletas de sombras - ref. 1', cantidad: 2, costo: 6000, venta: 12000, marca: null, categoria: 'Maquillaje' },
  { nombre: 'Paletas de sombras - ref. 2', cantidad: 2, costo: 8000, venta: 15000, marca: null, categoria: 'Maquillaje' },
  { nombre: 'Wax stick', cantidad: 3, costo: 6000, venta: 12000, marca: null, categoria: 'Cabello' },
  { nombre: 'Paleta de sombras', cantidad: 1, costo: 4500, venta: 9000, marca: null, categoria: 'Maquillaje' },
  { nombre: 'Mascarillas', cantidad: 5, costo: 1000, venta: 3000, marca: null, categoria: 'Cuidado facial' },
  { nombre: 'Bálsamos labiales', cantidad: 4, costo: 3000, venta: 6000, marca: null, categoria: 'Maquillaje' },
  { nombre: 'Pestañinas transparentes', cantidad: 3, costo: 4000, venta: 8000, marca: null, categoria: 'Maquillaje' },
  { nombre: 'Mascarillas - presentación x 10', cantidad: 10, costo: 1000, venta: 2500, marca: null, categoria: 'Cuidado facial' },
  { nombre: 'Iluminadores', cantidad: 3, costo: 7000, venta: 14000, marca: null, categoria: 'Maquillaje' },
  { nombre: 'Polvos Engol', cantidad: 4, costo: 4500, venta: 9000, marca: 'Engol', categoria: 'Maquillaje' },
  { nombre: 'Polvos de hada', cantidad: 3, costo: 4000, venta: 8000, marca: null, categoria: 'Maquillaje' },
  { nombre: 'Delineadores', cantidad: 4, costo: 7000, venta: 14000, marca: null, categoria: 'Maquillaje' },
  { nombre: 'Rubores en barra', cantidad: 3, costo: 5000, venta: 10000, marca: null, categoria: 'Maquillaje' },
  { nombre: 'Rubores stick', cantidad: 3, costo: 3500, venta: 8000, marca: null, categoria: 'Maquillaje' },
  { nombre: 'Gloss glitter', cantidad: 4, costo: 3000, venta: 6000, marca: null, categoria: 'Maquillaje' },
  { nombre: 'Fijador Karité', cantidad: 2, costo: 6000, venta: 12000, marca: 'Karité', categoria: 'Maquillaje' },
  { nombre: 'Pestañinas', cantidad: 3, costo: 5500, venta: 11000, marca: null, categoria: 'Maquillaje' },
  { nombre: 'Gloss', cantidad: 22, costo: 3000, venta: 6000, marca: null, categoria: 'Maquillaje' },
  { nombre: 'Correctores Engol', cantidad: 3, costo: 4500, venta: 9000, marca: 'Engol', categoria: 'Maquillaje' },
  { nombre: 'Primer Karité', cantidad: 1, costo: 12000, venta: 20000, marca: 'Karité', categoria: 'Maquillaje' },
  { nombre: 'Primer para poros', cantidad: 1, costo: 8000, venta: 15000, marca: null, categoria: 'Maquillaje' },
  { nombre: 'Libro de sombras', cantidad: 1, costo: 48000, venta: 58000, marca: null, categoria: 'Maquillaje' },
  { nombre: 'Libro de sombras kit', cantidad: 1, costo: 48000, venta: 58000, marca: null, categoria: 'Maquillaje' },
  { nombre: 'Bases BB', cantidad: 3, costo: 4500, venta: 9000, marca: null, categoria: 'Maquillaje' },
  { nombre: 'Kit Bioaqua', cantidad: 1, costo: 35000, venta: 50000, marca: 'Bioaqua', categoria: 'Cuidado facial' },
  { nombre: 'Pestañinas - renglón adicional', cantidad: 2, costo: 5500, venta: 11000, marca: null, categoria: 'Maquillaje' },
  { nombre: 'Cepillo', cantidad: 1, costo: 20000, venta: 35000, marca: null, categoria: 'Accesorios' },
  { nombre: 'Planchitas', cantidad: 1, costo: 15000, venta: 25000, marca: null, categoria: 'Cabello' },
  { nombre: 'Sweet Drama', cantidad: 1, costo: 120000, venta: 155000, marca: null, categoria: 'Maquillaje' },
];

function normalizar(nombre: string): string {
  return nombre.trim().toLowerCase().replace(/\s+/g, ' ');
}

function validar(): void {
  const claves = new Set<string>();
  for (const it of items) {
    const clave = normalizar(it.nombre);
    if (!clave) throw new Error(`Nombre vacío en la fila: ${JSON.stringify(it)}`);
    if (claves.has(clave)) throw new Error(`Nombre repetido en la lista: «${it.nombre}»`);
    claves.add(clave);
    if (!Number.isInteger(it.cantidad) || it.cantidad <= 0) {
      throw new Error(`Cantidad inválida en «${it.nombre}»: ${it.cantidad}`);
    }
    if (!Number.isFinite(it.costo) || it.costo < 0) {
      throw new Error(`Costo inválido en «${it.nombre}»: ${it.costo}`);
    }
    if (!Number.isFinite(it.venta) || it.venta < 0) {
      throw new Error(`Venta inválida en «${it.nombre}»: ${it.venta}`);
    }
    if (it.venta < it.costo) {
      console.warn(`⚠ «${it.nombre}»: venta (${it.venta}) menor que costo (${it.costo}).`);
    }
  }
}

interface ProductoExistente {
  id: string;
  nombre: string;
  stock: number;
  stock_minimo: number;
  precio_compra: number;
  precio_venta: number;
  activo: boolean;
}

const formatoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

async function main(): Promise<void> {
  validar();

  const existentes = (await sql`
    SELECT id, nombre, stock, stock_minimo,
           precio_compra::float8 AS precio_compra,
           precio_venta::float8 AS precio_venta,
           activo
    FROM productos
    ORDER BY activo DESC, created_at ASC`) as unknown as ProductoExistente[];

  const porNombre = new Map<string, ProductoExistente>();
  const duplicados = new Map<string, ProductoExistente[]>();
  for (const p of existentes) {
    const clave = normalizar(p.nombre);
    const previos = duplicados.get(clave) ?? [];
    previos.push(p);
    duplicados.set(clave, previos);
    if (!porNombre.has(clave)) porNombre.set(clave, p);
  }

  const aInsertar: Item[] = [];
  const aSumar: { item: Item; existente: ProductoExistente }[] = [];

  for (const it of items) {
    const existente = porNombre.get(normalizar(it.nombre));
    if (existente) {
      aSumar.push({ item: it, existente });
    } else {
      aInsertar.push(it);
    }
  }

  const totalUnidades = items.reduce((n, it) => n + it.cantidad, 0);
  const totalInvertido = items.reduce((n, it) => n + it.cantidad * it.costo, 0);
  const totalVenta = items.reduce((n, it) => n + it.cantidad * it.venta, 0);

  console.log(
    `${aplicar ? 'APLICANDO' : 'DRY-RUN'} · ${items.length} filas · ${totalUnidades} unidades`,
  );
  console.log(
    `Inversión ${formatoCOP.format(totalInvertido)} · venta potencial ${formatoCOP.format(totalVenta)}`,
  );
  console.log(`Nuevos: ${aInsertar.length} · coincidencias para sumar: ${aSumar.length}\n`);

  for (const it of aInsertar) {
    console.log(
      `[NUEVO] ${it.nombre} | ${it.marca ?? 'sin marca'} | ${it.categoria} | +${it.cantidad} | ${formatoCOP.format(it.costo)} → ${formatoCOP.format(it.venta)}`,
    );
  }

  for (const { item, existente } of aSumar) {
    const coincidencias = duplicados.get(normalizar(item.nombre)) ?? [];
    const aviso = coincidencias.length > 1 ? ` (⚠ ${coincidencias.length} productos con ese nombre)` : '';
    console.log(
      `[SUMA] ${item.nombre}${aviso} | stock ${existente.stock} → ${existente.stock + item.cantidad} | ${formatoCOP.format(existente.precio_venta)} → ${formatoCOP.format(item.venta)} | mínimo ${existente.stock_minimo} → ${STOCK_MINIMO}`,
    );
  }

  if (!aplicar) {
    console.log('\nSin cambios. Ejecuta con --aplicar para escribir en la base de datos.');
    return;
  }

  if (aInsertar.length === 0 && aSumar.length === 0) {
    console.log('\nNada por hacer.');
    return;
  }

  const consultas = [];

  for (const it of aInsertar) {
    consultas.push(sql`
      INSERT INTO productos (nombre, marca, categoria, stock, stock_minimo, precio_compra, precio_venta, activo)
      VALUES (${it.nombre}, ${it.marca}, ${it.categoria}, ${it.cantidad}, ${STOCK_MINIMO}, ${it.costo}, ${it.venta}, true)`);
  }

  for (const { item, existente } of aSumar) {
    consultas.push(sql`
      UPDATE productos
      SET stock = stock + ${item.cantidad},
          stock_minimo = ${STOCK_MINIMO},
          precio_venta = ${item.venta},
          precio_compra = CASE WHEN precio_compra = 0 THEN ${item.costo} ELSE precio_compra END,
          activo = true
      WHERE id = ${existente.id}`);
  }

  await sql.transaction(consultas);
  console.log(`\nListo: ${aInsertar.length} creados, ${aSumar.length} actualizados.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
