export interface Cliente {
  id: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
  notas: string | null;
  created_at: string;
}

export interface ClienteResumen extends Cliente {
  ultima_compra: string | null;
  total_compras: number;
  gasto_acumulado: number;
}

export interface Producto {
  id: string;
  nombre: string;
  marca: string | null;
  categoria: string;
  stock: number;
  stock_minimo: number;
  precio_compra: number;
  precio_venta: number;
  activo: boolean;
  created_at: string;
}

export interface Venta {
  id: string;
  cliente_id: string | null;
  cliente_nombre: string | null;
  fecha: string;
  metodo_pago: string;
  descuento: number;
  total: number;
  notas: string | null;
  anulada: boolean;
  num_items: number;
}

export interface VentaItem {
  id: string;
  producto_id: string | null;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface VentaCompleta extends Venta {
  items: VentaItem[];
}

export interface Gasto {
  id: string;
  fecha: string;
  categoria: string;
  descripcion: string;
  monto: number;
}

export interface LineaVentaInput {
  productoId: string | null;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
}
