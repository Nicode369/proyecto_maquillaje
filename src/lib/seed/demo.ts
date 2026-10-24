import type { NeonQueryFunction, NeonQueryPromise } from '@neondatabase/serverless';

type Sql = NeonQueryFunction<false, false>;
type Consulta = NeonQueryPromise<false, false>;

export interface ResumenSeed {
  clientas: number;
  productos: number;
  ventas: number;
  ventasCredito: number;
  abonos: number;
  gastos: number;
}

const CLIENTAS = [
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

const PRODUCTOS = [
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

const METODOS = ['Efectivo', 'Bancolombia', 'Nequi', 'Daviplata', 'Transferencia'];

const GASTOS = [
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

function fechaHace(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

/**
 * IDs deterministas para que la demo sea idéntica en cada reset. Si el seed
 * se ejecuta dos veces sin truncar, las claves primarias chocan en vez de
 * duplicar datos silenciosamente.
 */
function uuid(prefijo: number, n: number): string {
  return `${prefijo.toString(16).padStart(8, '0')}-0000-4000-8000-${String(n).padStart(12, '0')}`;
}

function insertar(
  sql: Sql,
  tabla: string,
  columnas: string[],
  filas: Record<string, unknown>[],
): Consulta | null {
  if (filas.length === 0) return null;

  const parametros: unknown[] = [];
  const valores = filas.map((fila) => {
    const marcadores = columnas.map((columna) => `$${parametros.push(fila[columna])}`);
    return `(${marcadores.join(', ')})`;
  });

  return sql.query(
    `INSERT INTO ${tabla} (${columnas.join(', ')}) VALUES ${valores.join(', ')}`,
    parametros,
  );
}

/**
 * Siembra los datos ficticios del demo. Con `truncar: true` el borrado y la
 * inserción van en la misma transacción: si algo falla, la demo anterior queda
 * intacta. No importa `astro:env` para poder reutilizarlo desde scripts.
 */
export async function sembrarDemo(
  sql: Sql,
  opciones: { truncar?: boolean } = {},
): Promise<ResumenSeed> {
  let seed = 42;
  function rand(max: number): number {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed % max;
  }

  const clientes = CLIENTAS.map((c, i) => ({ id: uuid(1, i + 1), ...c }));
  const productos = PRODUCTOS.map((p, i) => ({ id: uuid(2, i + 1), ...p }));
  const disponible = new Map(productos.map((p) => [p.id, p.stock]));

  const ventas: Record<string, unknown>[] = [];
  const items: Record<string, unknown>[] = [];
  const abonos: Record<string, unknown>[] = [];
  let itemN = 0;
  let abonoN = 0;
  let ventasCredito = 0;

  for (let i = 0; i < 34; i++) {
    const hace = rand(118) + 2;
    const fecha = fechaHace(hace);
    const conCliente = rand(10) < 7;
    const clienteId = conCliente ? clientes[rand(clientes.length)].id : null;
    const credito = conCliente && rand(10) < 3;
    const numItems = 1 + rand(3);
    const ventaId = uuid(3, i + 1);

    const elegidos: {
      productoId: string;
      descripcion: string;
      cantidad: number;
      precio: number;
    }[] = [];

    for (let intento = 0; intento < 60 && elegidos.length < numItems; intento++) {
      const p = productos[rand(productos.length)];
      if (elegidos.some((it) => it.productoId === p.id)) continue;

      const quedan = disponible.get(p.id) ?? 0;
      if (quedan < 1) continue;

      const cantidad = Math.min(1 + rand(2), quedan);
      disponible.set(p.id, quedan - cantidad);
      elegidos.push({
        productoId: p.id,
        descripcion: `${p.nombre}${p.marca !== 'Sin marca' ? ` · ${p.marca}` : ''}`,
        cantidad,
        precio: p.pv,
      });
    }

    // La reserva de stock debería alcanzar siempre; este respaldo evita una
    // venta vacía si una combinación aleatoria agota los productos elegidos.
    if (elegidos.length === 0) {
      const p = productos.find((prod) => (disponible.get(prod.id) ?? 0) > 0);
      if (!p) break;
      disponible.set(p.id, (disponible.get(p.id) ?? 1) - 1);
      elegidos.push({
        productoId: p.id,
        descripcion: `${p.nombre}${p.marca !== 'Sin marca' ? ` · ${p.marca}` : ''}`,
        cantidad: 1,
        precio: p.pv,
      });
    }

    const subtotal = elegidos.reduce((sum, it) => sum + it.cantidad * it.precio, 0);
    const descuento = rand(5) === 0 ? Math.round((subtotal * 0.1) / 1000) * 1000 : 0;
    const total = subtotal - descuento;

    ventas.push({
      id: ventaId,
      cliente_id: clienteId,
      fecha,
      metodo_pago: METODOS[rand(METODOS.length)],
      descuento,
      total,
      credito,
    });

    for (const it of elegidos) {
      items.push({
        id: uuid(4, ++itemN),
        venta_id: ventaId,
        producto_id: it.productoId,
        descripcion: it.descripcion,
        cantidad: it.cantidad,
        precio_unitario: it.precio,
        subtotal: it.cantidad * it.precio,
      });
    }

    if (credito) {
      ventasCredito++;
      const porcentaje = 0.3 + rand(4) * 0.1;
      const redondeado = Math.round((total * porcentaje) / 1000) * 1000;
      const monto = Math.min(
        Math.max(1000, redondeado),
        Math.floor((total - 1000) / 1000) * 1000,
      );
      const diasAbono = Math.max(
        hace - 1 - rand(Math.min(20, Math.max(hace - 1, 1))),
        0,
      );

      if (monto > 0) {
        abonos.push({
          id: uuid(5, ++abonoN),
          venta_id: ventaId,
          fecha: fechaHace(diasAbono),
          monto,
          notas: 'Abono parcial',
        });
      }
    }
  }

  const gastos = GASTOS.map((g, i) => ({
    id: uuid(6, i + 1),
    fecha: fechaHace(rand(115) + 2),
    categoria: g.categoria,
    descripcion: g.descripcion,
    monto: g.monto,
  }));

  const consultas: Consulta[] = [];

  if (opciones.truncar) {
    consultas.push(
      sql.query(
        'TRUNCATE TABLE venta_items, ventas, abonos, gastos, productos, clientes, login_attempts RESTART IDENTITY CASCADE',
        [],
      ),
    );
  }

  const consultasTablas = [
    insertar(sql, 'clientes', ['id', 'nombre', 'telefono', 'email'], clientes),
    insertar(
      sql,
      'productos',
      [
        'id',
        'nombre',
        'marca',
        'categoria',
        'stock',
        'stock_minimo',
        'precio_compra',
        'precio_venta',
      ],
      productos.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        marca: p.marca,
        categoria: p.categoria,
        stock: disponible.get(p.id) ?? 0,
        stock_minimo: p.min,
        precio_compra: p.pc,
        precio_venta: p.pv,
      })),
    ),
    insertar(
      sql,
      'ventas',
      ['id', 'cliente_id', 'fecha', 'metodo_pago', 'descuento', 'total', 'credito'],
      ventas,
    ),
    insertar(
      sql,
      'venta_items',
      [
        'id',
        'venta_id',
        'producto_id',
        'descripcion',
        'cantidad',
        'precio_unitario',
        'subtotal',
      ],
      items,
    ),
    insertar(sql, 'abonos', ['id', 'venta_id', 'fecha', 'monto', 'notas'], abonos),
    insertar(sql, 'gastos', ['id', 'fecha', 'categoria', 'descripcion', 'monto'], gastos),
  ];

  for (const consulta of consultasTablas) {
    if (consulta) consultas.push(consulta);
  }

  await sql.transaction(consultas);

  return {
    clientas: clientes.length,
    productos: productos.length,
    ventas: ventas.length,
    ventasCredito,
    abonos: abonos.length,
    gastos: gastos.length,
  };
}
