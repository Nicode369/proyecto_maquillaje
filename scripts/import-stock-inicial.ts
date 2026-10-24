import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  console.error('Falta DATABASE_URL. Ejecuta `neon env pull` y luego: node --env-file-if-exists=.env scripts/import-stock-inicial.ts');
  process.exit(1);
}

const sql = neon(url);

function limpiarNombre(nombre: string) {
  let n = nombre.trim();
  // Quita códigos numéricos/EANs al inicio seguidos de "-" 
  n = n.replace(/^\d+\s*-\s*/, '');
  // Quita códigos numéricos cortos al inicio seguidos de espacio
  n = n.replace(/^\d+\s+/, '');
  return n.trim();
}

const items = [
  { nombre: 'Espejo Bolsa Flor Con Llavero 26577', cantidad: 4, costo: 8500, venta: 15000 },
  { nombre: 'Lip Plumper Melu Cherry', cantidad: 1, costo: 14000, venta: 22500 },
  { nombre: 'Espuma Facial Vitamina C Bioaqua B1575', cantidad: 1, costo: 8000, venta: 14000 },
  { nombre: 'Lip Gloss Birthday Bomb 6181', cantidad: 1, costo: 3000, venta: 6000 },
  { nombre: 'Sombra Time Hunter 7997', cantidad: 1, costo: 12000, venta: 19000 },
  { nombre: 'Sombra Billetera Hadas Mocallure 1802', cantidad: 1, costo: 11000, venta: 17500 },
  { nombre: 'Encrespador Mocallure FF177', cantidad: 2, costo: 2500, venta: 5000 },
  { nombre: 'Lápiz Delineador Con Sacapuntas Samy T24 Palo De Rosa', cantidad: 1, costo: 2900, venta: 6000 },
  { nombre: 'Gel De Ducha Corporal Caramel Crush x 300ml Purpure', cantidad: 1, costo: 18500, venta: 29500 },
  { nombre: 'Iluminador Líquido En Agua Engol', cantidad: 3, costo: 6600, venta: 11500 },
  { nombre: 'Lip Gloss Choco Bomb 6177', cantidad: 2, costo: 3600, venta: 6500 },
  { nombre: 'Delineador Líquido Escarchado Yabadian Y654', cantidad: 1, costo: 5000, venta: 9000 },
  { nombre: 'Kit De Brocha Kabuki x 12 26302', cantidad: 1, costo: 15000, venta: 24000 },
  { nombre: 'Sombra 56 Tonos Fuertes Dolce Bella - 8397', cantidad: 1, costo: 58800, venta: 88000 },
  { nombre: 'Lip Plumper Melu Cocoa', cantidad: 2, costo: 14000, venta: 22500 },
  { nombre: 'Labial Colorissimo Vogue Magenta', cantidad: 1, costo: 9500, venta: 16500 },
  { nombre: 'Labial Colorissimo Vogue Dulce Frambuesa', cantidad: 1, costo: 9500, venta: 16500 },
  { nombre: 'Pestañina Maxi Volumen Borgona Prosa', cantidad: 1, costo: 12500, venta: 20000 },
  { nombre: 'Lip Balm Miel Bioaqua BQY00845', cantidad: 1, costo: 2500, venta: 5000 },
  { nombre: 'Pestañina Profesional Silicon Cafe Prosa - 12826', cantidad: 1, costo: 12500, venta: 20000 },
  { nombre: 'Beauty Blender Huevo Mocallure FF174', cantidad: 1, costo: 1600, venta: 3000 },
  { nombre: 'Mantequilla Corporal Sandia Lluvia De Estrellas', cantidad: 2, costo: 25500, venta: 38000 },
  { nombre: 'Crema Para Manos x 30gr Chocolate Cake Bioaqua BQY84200', cantidad: 1, costo: 3000, venta: 6000 },
  { nombre: 'Sombra Individual Paraiso Atenea Boreal - 9822', cantidad: 1, costo: 12600, venta: 20000 },
  { nombre: 'Rubor Economico Engol RB800-E - 12202', cantidad: 4, costo: 3500, venta: 6000 },
  { nombre: 'Crema Para Manos X 30Gr Arroz Bioaqua 15206 - 15280', cantidad: 1, costo: 2000, venta: 4000 },
  { nombre: 'Crema Para Manos x 30gr Vainilla Cream Bioaqua BQY84781', cantidad: 1, costo: 3000, venta: 6000 },
  { nombre: 'Sombra Mousse Dolce Bella - T010: T02 - 11926', cantidad: 2, costo: 11500, venta: 18500 },
  { nombre: 'Sombra Mousse Dolce Bella - T010: T04 - 11926', cantidad: 2, costo: 11500, venta: 18500 },
  { nombre: 'Crema Para Manos x 30gr Donut Cheese Bioaqua BQY84781', cantidad: 2, costo: 3000, venta: 6000 },
  { nombre: 'Lip Gloss Espiral Chocolate CR-G32', cantidad: 2, costo: 4000, venta: 7000 },
  { nombre: 'Labial Liquido Mate Hudamoji LG157', cantidad: 3, costo: 3000, venta: 6000 },
  { nombre: 'Lip Balm Llavero Baolishi B0789', cantidad: 2, costo: 7200, venta: 12500 },
  { nombre: 'Fijador de Maquillaje Lula - 12904', cantidad: 2, costo: 10800, venta: 17500 },
  { nombre: 'Primer Engol 454 - 9019', cantidad: 1, costo: 15000, venta: 24000 },
  { nombre: 'Primer De Maquillaje Engol Lpp-50 - 13541', cantidad: 1, costo: 9000, venta: 16000 },
  { nombre: 'Balsamo Para Cejas Engol Bqc405 - 12199', cantidad: 1, costo: 9600, venta: 17000 },
  { nombre: '7709236041278 - SPLASH HELLO KITTY', cantidad: 1, costo: 24700, venta: 37000 },
  { nombre: '7709236041261 - MANTEQUILLA HELLO KITTY', cantidad: 1, costo: 23600, venta: 35500 },
  { nombre: '7709236006222 - TINTA PARA LABIOS HELLO KITTY', cantidad: 2, costo: 20400, venta: 30500 },
  { nombre: '7262355906434 - GEL DE CEJAS ALICIA', cantidad: 2, costo: 15000, venta: 24000 },
  { nombre: '7262255916863 - PESTAÑINA GLITTER GATO', cantidad: 1, costo: 19000, venta: 30500 },
  { nombre: '7262155926892 - PESTAÑINA VIOLETA ALICIA', cantidad: 1, costo: 19000, venta: 30500 },
  { nombre: '7262055937127 - PESTAÑINA ROJA CONEJO', cantidad: 1, costo: 19000, venta: 30500 },
  { nombre: '7501734411405 - ACEITE 4 EN UNO PROSA', cantidad: 2, costo: 15000, venta: 24000 },
  { nombre: '7501734403052 - Pestañina Prosa Gris Clara', cantidad: 1, costo: 13800, venta: 22000 },
  { nombre: '7501734403130 - PESTAÑINA PROSA GRIS OSCURO', cantidad: 1, costo: 13800, venta: 22000 },
  { nombre: '7501734403038 - Pestañina Prosa Morada', cantidad: 1, costo: 13800, venta: 22000 },
  { nombre: '75017344030789 - Pestañina Prosa Negra', cantidad: 1, costo: 13800, venta: 22000 },
  { nombre: '7501734403147 - Pestañina Prosa Fucsia', cantidad: 1, costo: 13800, venta: 22000 },
  { nombre: '7501734403116 - Pestañina Prosa A Prueba de Agua CAFE', cantidad: 1, costo: 13800, venta: 22000 },
  { nombre: '75017344030567 - PESTAÑINA PROSA BORGOÑA', cantidad: 1, costo: 13800, venta: 22000 },
  { nombre: '7501734403123 - PESTAÑINA PROSA ZUL', cantidad: 1, costo: 13800, venta: 22000 },
  { nombre: '6974482525389 - CORECTOR BLOOMSHELL JUMBO 02', cantidad: 1, costo: 25000, venta: 37500 },
  { nombre: '6974482525488 - CORRECTOR BOMSHELL TONO 03', cantidad: 1, costo: 17500, venta: 28000 },
  { nombre: '6974482525464 - CORRECTOR BLOMSHELL TONO 01', cantidad: 1, costo: 17500, venta: 28000 },
  { nombre: '6976082023814 - MASCARILLA EN VELO MUÑECOS', cantidad: 4, costo: 1400, venta: 3000 },
  { nombre: '20 - MASCARILLA EN VELO', cantidad: 5, costo: 1000, venta: 2000 },
  { nombre: 'KIT TRULY NORMAL', cantidad: 2, costo: 30000, venta: 50000 },
  { nombre: 'KIT TRULY BOM BOM BUM', cantidad: 1, costo: 30000, venta: 50000 },
  { nombre: 'ILUMINADOR MOCMALLURE', cantidad: 2, costo: 8000, venta: 12000 },
  { nombre: 'SHIMMER SPRAY BEATIFUL ONE', cantidad: 2, costo: 10000, venta: 12000 },
  { nombre: 'FIJADOR DE CEJAS', cantidad: 1, costo: 22000, venta: 27000 },
];

async function main() {
  console.log(`Importando ${items.length} productos con precios de venta sugeridos...`);

  for (const it of items) {
    const nombreLimpio = limpiarNombre(it.nombre);
    const precioCompra = it.costo;
    const precioVenta = it.venta;

    const exists = await sql`
      SELECT id FROM productos WHERE lower(trim(nombre)) = lower(trim(${nombreLimpio})) LIMIT 1
    `;

    if (exists.length > 0) {
      await sql`
        UPDATE productos
        SET stock = stock + ${it.cantidad},
            precio_compra = CASE WHEN precio_compra = 0 THEN ${precioCompra} ELSE precio_compra END,
            precio_venta   = ${precioVenta},
            activo = true
        WHERE id = ${exists[0].id}
      `;
      console.log(`↻ Actualizado: ${nombreLimpio} (+${it.cantidad}) | compra=$${precioCompra} | venta=$${precioVenta}`);
      continue;
    }

    await sql`
      INSERT INTO productos (nombre, marca, categoria, stock, stock_minimo, precio_compra, precio_venta, activo)
      VALUES (${nombreLimpio}, null, 'Maquillaje', ${it.cantidad}, 3, ${precioCompra}, ${precioVenta}, true)
    `;
    console.log(`+ Creado: ${nombreLimpio} | stock=${it.cantidad} | compra=$${precioCompra} | venta=$${precioVenta}`);
  }

  console.log('Listo. Inventario inicial cargado.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
