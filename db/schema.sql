CREATE TABLE IF NOT EXISTS clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  telefono text,
  email text,
  notas text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS productos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  marca text,
  categoria text NOT NULL DEFAULT 'Maquillaje',
  stock integer NOT NULL DEFAULT 0,
  stock_minimo integer NOT NULL DEFAULT 3,
  precio_compra numeric(12,2) NOT NULL DEFAULT 0,
  precio_venta numeric(12,2) NOT NULL DEFAULT 0,
  activo boolean NOT NULL DEFAULT true,
  imagen text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ventas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid REFERENCES clientes(id) ON DELETE SET NULL,
  fecha date NOT NULL DEFAULT CURRENT_DATE,
  metodo_pago text NOT NULL DEFAULT 'Efectivo',
  descuento numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  notas text,
  anulada boolean NOT NULL DEFAULT false,
  credito boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS venta_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venta_id uuid NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  producto_id uuid REFERENCES productos(id) ON DELETE SET NULL,
  descripcion text NOT NULL,
  cantidad integer NOT NULL CHECK (cantidad > 0),
  precio_unitario numeric(12,2) NOT NULL,
  subtotal numeric(12,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS abonos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venta_id uuid NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  fecha date NOT NULL DEFAULT CURRENT_DATE,
  monto numeric(12,2) NOT NULL CHECK (monto > 0),
  notas text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS login_attempts (
  ip text NOT NULL,
  ts timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gastos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha date NOT NULL DEFAULT CURRENT_DATE,
  categoria text NOT NULL,
  descripcion text NOT NULL,
  monto numeric(12,2) NOT NULL CHECK (monto >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas (fecha);
CREATE INDEX IF NOT EXISTS idx_ventas_cliente ON ventas (cliente_id);
CREATE INDEX IF NOT EXISTS idx_venta_items_venta ON venta_items (venta_id);
CREATE INDEX IF NOT EXISTS idx_venta_items_producto ON venta_items (producto_id);
CREATE INDEX IF NOT EXISTS idx_gastos_fecha ON gastos (fecha);
CREATE INDEX IF NOT EXISTS idx_gastos_categoria ON gastos (categoria);
CREATE INDEX IF NOT EXISTS idx_abonos_venta ON abonos (venta_id);
CREATE INDEX IF NOT EXISTS idx_abonos_fecha ON abonos (fecha);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_ts ON login_attempts (ip, ts);

ALTER TABLE productos ADD COLUMN IF NOT EXISTS imagen text;
ALTER TABLE ventas ADD COLUMN IF NOT EXISTS credito boolean NOT NULL DEFAULT false;

-- Integridad: el stock nunca puede quedar negativo. La venta/reactivación
-- descuenta sin guard y este CHECK aborta toda la transacción si falta stock.
ALTER TABLE productos DROP CONSTRAINT IF EXISTS productos_stock_no_negativo;
ALTER TABLE productos ADD CONSTRAINT productos_stock_no_negativo CHECK (stock >= 0);

ALTER TABLE productos DROP CONSTRAINT IF EXISTS productos_montos_no_negativos;
ALTER TABLE productos ADD CONSTRAINT productos_montos_no_negativos
  CHECK (stock_minimo >= 0 AND precio_compra >= 0 AND precio_venta >= 0);

ALTER TABLE ventas DROP CONSTRAINT IF EXISTS ventas_montos_no_negativos;
ALTER TABLE ventas ADD CONSTRAINT ventas_montos_no_negativos
  CHECK (descuento >= 0 AND total >= 0);

ALTER TABLE venta_items DROP CONSTRAINT IF EXISTS venta_items_subtotal_no_negativo;
ALTER TABLE venta_items ADD CONSTRAINT venta_items_subtotal_no_negativo
  CHECK (subtotal >= 0);
