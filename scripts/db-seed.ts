import { neon } from '@neondatabase/serverless';

const url = process.env.NEON_DATABASE_URL;
if (!url) {
  console.error('Falta NEON_DATABASE_URL. Ejecuta: node --env-file=.env scripts/db-seed.ts');
  process.exit(1);
}

const sql = neon(url);

function fechaHace(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

let seed = 42;
function rand(max: number): number {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed % max;
}

const clientas = [
  { nombre: 'Valentina Ríos', telefono: '310 456 7890', email: 'valentina.rios@correo.com' },
  { nombre: 'Camila Ortíz', telefono: '312 223 4455', email: 'camila.ortiz@correo.com' },
  { nombre: 'Daniela Fuentes', telefono: '300 887 1122', email: null },
  { nombre: 'Laura Betancur', telefono: '315 909 3344', email: 'laura.betancur@correo.com' },
  { nombre: 'Mariana Ocampo', telefono: '318 445 6677', email: null },
  { nombre: 'Sofía Herrera', telefono: '311 556 7788', email: 'sofia.herrera@correo.com' },
  { nombre: 'Andrea Quintero', telefono: '313 667 8899', email: null },
  { nombre: 'Paula Escobar', telefono: '301 778 9900', email: 'paula.escobar@correo.com' },
  { nombre: 'Juliana Mesa', telefono: '317 889 0011', email: null },
  { nombre: 'Carolina Vargas', telefono: '314 990 1122', email: 'carolina.vargas@correo.com' },
];

const productos = [
  { nombre: 'Base líquida Master Matte', marca: 'Argenis', categoria: 'Rostro', stock: 14, min: 4, pc: 32000, pv: 58000 },
  { nombre: 'Polvo compacto sedoso', marca: 'Kléoss', categoria: 'Rostro', stock: 9, min: 4, pc: 21000, pv: 39000 },
  { nombre: 'Corrector iluminador', marca: 'Argenis', categoria: 'Rostro', stock: 3, min: 4, pc: 18000, pv: 34000 },
  { nombre: 'Paleta de sombras tierra', marca: 'Kléoss', categoria: 'Ojos', stock: 7, min: 3, pc: 38000, pv: 72000 },
  { nombre: 'Delineador líquido intenso', marca: 'Vogue', categoria: 'Ojos', stock: 22, min: 6, pc: 12000, pv: 24000 },
  { nombre: 'Máscara de pestañas volumen', marca: 'Vogue', categoria: 'Ojos', stock: 5, min: 6, pc: 15000, pv: 29000 },
  { nombre: 'Rubor en crema duradero', marca: 'Kléoss', categoria: 'Mejillas', stock: 11, min: 4, pc: 16000, pv: 32000 },
  { nombre: 'Brillo labial hidratante', marca: 'Vogue', categoria: 'Labios', stock: 18, min: 5, pc: 9000, pv: 19000 },
  { nombre: 'Labial mate larga duración', marca: 'Argenis', categoria: 'Labios', stock: 2, min: 5, pc: 14000, pv: 28000 },
  { nombre: 'Preparador de piel luminoso', marca: 'Kléoss', categoria: 'Rostro', stock: 8, min: 3, pc: 26000, pv: 49000 },
  { nombre: 'Iluminador líquido dorado', marca: 'Argenis', categoria: 'Rostro', stock: 6, min: 3, pc: 19000, pv: 36000 },
  { nombre: 'Cera de cejas fijadora', marca: 'Vogue', categoria: 'Ojos', stock: 13, min: 4, pc: 8000, pv: 17000 },
  { nombre: 'Esponja de maquillaje', marca: 'Sin marca', categoria: 'Accesorios', stock: 25, min: 8, pc: 4000, pv: 9000 },
  { nombre: 'Brocha de contour', marca: 'Sin marca', categoria: 'Accesorios', stock: 0, min: 3, pc: 11000, pv: 22000 },
  { nombre: 'Setting spray fijador', marca: 'Kléoss', categoria: 'Rostro', stock: 4, min: 4, pc: 20000, pv: 38000 },
];

const metodos = ['Efectivo', 'Bancolombia', 'Nequi', 'Daviplata', 'Transferencia'];

const gastosBase = [
  { categoria: 'Alquiler', descripcion: 'Arriendo del espacio de trabajo', monto: 480000 },
  { categoria: 'Insumos', descripcion: 'Reposición de bases y correctores', monto: 310000 },
  { categoria: 'Transporte', descripcion: 'Ruta y domicilios a clientas', monto: 85000 },
  { categoria: 'Servicios', descripcion: 'Internet y servicios públicos', monto: 120000 },
  { categoria: 'Publicidad', descripcion: 'Promoción en redes sociales', monto: 90000 },
  { categoria: 'Insumos', descripcion: 'Aceites, desmaquillantes y alcohol', monto: 67000 },
  { categoria: 'Domicilio', descripcion: 'Empaque y bolsas personalizadas', monto: 54000 },
  { categoria: 'Insumos', descripcion: 'Compra de paletas y labiales', monto: 275000 },
  { categoria: 'Servicios', descripcion: 'Cuenta de agua del local', monto: 43000 },
  { categoria: 'Transporte', descripcion: 'Taxi a domicilio de clienta', monto: 18000 },
  { categoria: 'Publicidad', descripcion: 'Diseño de catálogo', monto: 110000 },
  { categoria: 'Domicilio', descripcion: 'Servientrega pedidos', monto: 62000 },
  { categoria: 'Insumos', descripcion: 'Toallitas y remove maquillaje', monto: 39000 },
  { categoria: 'Alquiler', descripcion: 'Arriendo del espacio de trabajo', monto: 480000 },
  { categoria: 'Servicios', descripcion: 'Recarga celular y datos', monto: 35000 },
];

const clienteRows = await Promise.all(
  clientas.map(
    (c) => sql`INSERT INTO clientes (nombre, telefono, email)
      VALUES (${c.nombre}, ${c.telefono}, ${c.email}) RETURNING id`,
  ),
);

const productoRows: { id: string; nombre: string; marca: string; precio: number }[] = [];
for (const p of productos) {
  const [row] = await sql`
    INSERT INTO productos (nombre, marca, categoria, stock, stock_minimo, precio_compra, precio_venta)
    VALUES (${p.nombre}, ${p.marca}, ${p.categoria}, ${p.stock}, ${p.min}, ${p.pc}, ${p.pv})
    RETURNING id, nombre, marca, precio_venta AS precio`;
  productoRows.push({
    id: row.id,
    nombre: row.nombre,
    marca: row.marca,
    precio: Number(row.precio),
  });
}

let ventasCreadas = 0;
for (let i = 0; i < 34; i++) {
  const hace = rand(118) + 2;
  const fecha = fechaHace(hace);
  const conCliente = rand(10) < 7;
  const clienteId = conCliente ? clienteRows[rand(clienteRows.length)][0].id : null;
  const numItems = 1 + rand(3);
  const usados = new Set<number>();

  const items: { productoId: string; descripcion: string; cantidad: number; precio: number }[] = [];
  while (items.length < numItems) {
    const idx = rand(productoRows.length);
    if (usados.has(idx)) continue;
    usados.add(idx);
    const p = productoRows[idx];
    items.push({
      productoId: p.id,
      descripcion: `${p.nombre}${p.marca !== 'Sin marca' ? ` · ${p.marca}` : ''}`,
      cantidad: 1 + rand(2),
      precio: p.precio,
    });
  }

  const subtotal = items.reduce((sum, it) => sum + it.cantidad * it.precio, 0);
  const conDescuento = rand(5) === 0;
  const descuento = conDescuento ? Math.round((subtotal * 0.1) / 1000) * 1000 : 0;
  const total = subtotal - descuento;

  const [venta] = await sql`
    INSERT INTO ventas (cliente_id, fecha, metodo_pago, descuento, total)
    VALUES (${clienteId}, ${fecha}, ${metodos[rand(metodos.length)]}, ${descuento}, ${total})
    RETURNING id`;
  ventasCreadas++;

  await Promise.all(
    items.map(
      (it) => sql`
        INSERT INTO venta_items (venta_id, producto_id, descripcion, cantidad, precio_unitario, subtotal)
        VALUES (${venta.id}, ${it.productoId}, ${it.descripcion}, ${it.cantidad}, ${it.precio}, ${it.cantidad * it.precio})`,
    ),
  );
}

for (const g of gastosBase) {
  const hace = rand(115) + 2;
  await sql`
    INSERT INTO gastos (fecha, categoria, descripcion, monto)
    VALUES (${fechaHace(hace)}, ${g.categoria}, ${g.descripcion}, ${g.monto})`;
}

console.log(
  `✔ Seed aplicado: ${clientas.length} clientas, ${productos.length} productos, ${ventasCreadas} ventas, ${gastosBase.length} gastos.`,
);
