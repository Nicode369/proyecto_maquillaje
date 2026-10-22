import type { APIRoute } from 'astro';
import { crearCSV } from '../../lib/csv';
import { hoyISO } from '../../lib/format';
import { listClientes } from '../../lib/queries/clientes';
import { listGastos } from '../../lib/queries/gastos';
import { listProductos } from '../../lib/queries/productos';
import { listAbonosExport, listVentas } from '../../lib/queries/ventas';

const SIN_LIMITE = 1_000_000;

export const GET: APIRoute = async ({ params, url }) => {
  const tabla = params.tabla ?? '';
  const mes = url.searchParams.get('mes')?.trim() || undefined;
  const categoria = url.searchParams.get('categoria')?.trim() || undefined;
  const clienteId = url.searchParams.get('cliente')?.trim() || undefined;
  const q = url.searchParams.get('q')?.trim() || undefined;

  let contenido: string;

  if (tabla === 'ventas') {
    const filas = await listVentas({ mes, clienteId, q, limit: SIN_LIMITE });
    contenido = crearCSV(
      [
        'ID',
        'Fecha',
        'Clienta',
        'Método de pago',
        'Ítems',
        'Descuento',
        'Total',
        'Crédito',
        'Abonado',
        'Saldo',
        'Estado',
        'Notas',
      ],
      filas.map((v) => [
        v.id,
        v.fecha,
        v.cliente_nombre ?? '',
        v.metodo_pago,
        v.num_items,
        v.descuento,
        v.total,
        v.credito ? 'Sí' : 'No',
        v.credito ? Math.max(v.total - v.saldo, 0) : v.total,
        v.credito ? v.saldo : 0,
        v.anulada
          ? 'Anulada'
          : v.credito
            ? v.saldo > 0
              ? 'Crédito pendiente'
              : 'Crédito pagada'
            : 'Contado',
        v.notas ?? '',
      ]),
    );
  } else if (tabla === 'gastos') {
    const filas = await listGastos({ mes, categoria, limit: SIN_LIMITE });
    contenido = crearCSV(
      ['ID', 'Fecha', 'Categoría', 'Descripción', 'Monto'],
      filas.map((g) => [g.id, g.fecha, g.categoria, g.descripcion, g.monto]),
    );
  } else if (tabla === 'abonos') {
    const filas = await listAbonosExport({ mes, clienteId });
    contenido = crearCSV(
      [
        'ID',
        'Fecha abono',
        'Venta ID',
        'Fecha venta',
        'Clienta',
        'Total venta',
        'Abono',
        'Notas',
      ],
      filas.map((a) => [
        a.id,
        a.fecha,
        a.venta_id,
        a.venta_fecha,
        a.cliente_nombre ?? '',
        a.venta_total,
        a.monto,
        a.notas ?? '',
      ]),
    );
  } else if (tabla === 'clientas') {
    const filas = await listClientes(q);
    contenido = crearCSV(
      [
        'ID',
        'Nombre',
        'Teléfono',
        'Correo',
        'Compras',
        'Gasto acumulado',
        'Debe',
        'Última compra',
        'Notas',
        'Registrada',
      ],
      filas.map((c) => [
        c.id,
        c.nombre,
        c.telefono ?? '',
        c.email ?? '',
        c.total_compras,
        c.gasto_acumulado,
        c.saldo,
        c.ultima_compra ?? '',
        c.notas ?? '',
        c.created_at,
      ]),
    );
  } else if (tabla === 'productos') {
    const filas = await listProductos({ inactivos: true });
    contenido = crearCSV(
      [
        'ID',
        'Nombre',
        'Marca',
        'Categoría',
        'Stock',
        'Stock mínimo',
        'Precio compra',
        'Precio venta',
        'Activo',
        'Tiene imagen',
        'Creado',
      ],
      filas.map((p) => [
        p.id,
        p.nombre,
        p.marca ?? '',
        p.categoria,
        p.stock,
        p.stock_minimo,
        p.precio_compra,
        p.precio_venta,
        p.activo ? 'Sí' : 'No',
        p.imagen ? 'Sí' : 'No',
        p.created_at,
      ]),
    );
  } else {
    return new Response('Exportación no encontrada', { status: 404 });
  }

  const sufijo = mes ? `-${mes}` : '';
  const archivo = `${tabla}${sufijo}-${hoyISO()}.csv`;

  return new Response(contenido, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${archivo}"`,
      'Cache-Control': 'no-store',
    },
  });
};
