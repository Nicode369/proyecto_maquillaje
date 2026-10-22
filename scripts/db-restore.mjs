import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

const archivo = process.argv[2];
const reemplazar = process.argv.includes('--reemplazar');

if (!archivo) {
  console.error('Uso: npm run db:restore backups/respaldo.json --reemplazar');
  process.exit(1);
}

if (!reemplazar) {
  console.error(
    'Restaurar reemplaza TODOS los datos actuales. Repite el comando con --reemplazar.',
  );
  process.exit(1);
}

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  console.error('Falta DATABASE_URL. Ejecuta `neon env pull` y reintenta.');
  process.exit(1);
}

const respaldo = JSON.parse(readFileSync(archivo, 'utf8'));
if (respaldo?.version !== 1 || !respaldo?.tablas) {
  console.error('El archivo no tiene el formato de respaldo esperado (versión 1).');
  process.exit(1);
}

const columnas = {
  clientes: ['id', 'nombre', 'telefono', 'email', 'notas', 'created_at'],
  productos: [
    'id',
    'nombre',
    'marca',
    'categoria',
    'stock',
    'stock_minimo',
    'precio_compra',
    'precio_venta',
    'activo',
    'imagen',
    'created_at',
  ],
  ventas: [
    'id',
    'cliente_id',
    'fecha',
    'metodo_pago',
    'descuento',
    'total',
    'notas',
    'anulada',
    'credito',
    'created_at',
  ],
  venta_items: [
    'id',
    'venta_id',
    'producto_id',
    'descripcion',
    'cantidad',
    'precio_unitario',
    'subtotal',
  ],
  abonos: ['id', 'venta_id', 'fecha', 'monto', 'notas', 'created_at'],
  gastos: ['id', 'fecha', 'categoria', 'descripcion', 'monto', 'created_at'],
};

const orden = ['clientes', 'productos', 'ventas', 'venta_items', 'abonos', 'gastos'];
const sql = neon(url);

const consultas = [
  sql.query(
    'TRUNCATE TABLE venta_items, abonos, ventas, gastos, productos, clientes, login_attempts RESTART IDENTITY CASCADE',
    [],
  ),
];

const resumen = {};
for (const tabla of orden) {
  const filas = respaldo.tablas[tabla];
  if (!Array.isArray(filas)) {
    console.error(`Falta la tabla "${tabla}" en el respaldo.`);
    process.exit(1);
  }
  const cols = columnas[tabla];
  resumen[tabla] = filas.length;
  for (const fila of filas) {
    const marcadores = cols.map((_, i) => `$${i + 1}`).join(', ');
    consultas.push(
      sql.query(
        `INSERT INTO ${tabla} (${cols.join(', ')}) VALUES (${marcadores})`,
        cols.map((col) => fila[col] ?? null),
      ),
    );
  }
}

await sql.transaction(consultas);
console.log(`Respaldo restaurado desde ${archivo}`);
console.log(resumen);
