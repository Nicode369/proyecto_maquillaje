# Memoria — estado actual del proyecto

> Última actualización: 2026-10-24 — incidente de producción/demo resuelto,
> entornos separados y `.env.local` eliminado del historial (queda rotar las
> credenciales demo). Ver "Incidente 2026-10-24" y "Pulido 2026-10-24".

## Incidente 2026-10-24 (producción y demo caídos)

- **Síntoma**: `/` y `/ventas` devolvían 500; el resto de páginas respondía 200.
  El login de producción mostraba "Entrar al demo" (acceso sin contraseña).
- **Causa 1**: el commit `dd5b2e2` agregó `ventas.hora_registro` al esquema y a
  las consultas, pero la migración no se aplicó a las bases. Las consultas
  fallaban con `column v.hora_registro does not exist`.
- **Causa 2**: tras el debug del modo demo, el commit `63468e2` dejó
  `src/lib/demo.ts` con `ES_DEMO = true` fijo; los "reverts" posteriores no lo
  restauraron. Producción quedó abierta (login demo) y con banner/botón de demo.
- **Fix**: se aplicó `ALTER TABLE ventas ADD COLUMN IF NOT EXISTS hora_registro time`
  a producción y demo; se restauró la detección por `DEMO_MODE` (con respaldo
  `DEMO_RESET_DATABASE_URL`), se quitó el debug (`console.log`, barra visible y
  `/api/debug-demo`) y `DEMO_MODE` volvió a `default: false`.
- **Hora de venta**: `createVenta` guarda `(now() AT TIME ZONE 'America/Bogota')::time`
  y `formatHora` acepta `HH:MM:SS` y `HH:MM:SS.ffffff` (Postgres devuelve
  microsegundos). `hoyISO()` y `mesISO()` calculan la fecha/mes en
  `America/Bogota`, no en la zona del servidor (Vercel/UTC).
- **Seguridad (2026-10-24)**: `.env.local` estaba *trackeado* en el repo público
  con la URL/contraseña de la base demo y el secreto de sesión demo. Se sacó del
  índice, se agregó a `.gitignore` y **se eliminó de todo el historial** con
  `git filter-branch` + force-push (respaldo local en
  `/tmp/opencode/repo-before-filter.bundle`, fuera del repo). Verificado:
  `git log --all -- .env.local` queda vacío y el secreto ya no aparece en ningún
  commit. Como el secreto estuvo público, se **rotó** la contraseña del rol demo
  en Neon y el `SESSION_SECRET` demo (actualizados en `.env.demo`); también se
  actualizaron las variables del proyecto demo de Vercel y se redeployó. El demo
  volvió a funcionar (34 ventas de ejemplo). Las credenciales de producción
  **no** estuvieron expuestas.

### Pulido 2026-10-24 (post-incidente)

- **Hora en 12 h** con `a. m.` / `p. m.`; `hora_registro` guarda hora de Colombia.
  El formateo acepta microsegundos y `hoyISO()`/`mesISO()` usan `America/Bogota`
  para que Vercel (UTC) no adelante el día ni el mes.
- **Filtros en vivo y sin botón**: en ventas, productos y clientas el texto oculta
  filas/tarjetas al instante (sin acentos ni mayúsculas); Enter busca en el servidor
  (todas las páginas). Mes, categoría, clienta y stock se aplican solos al cambiar.
  Se quitó el botón “Filtrar” de ventas, productos, clientas y gastos.
- **Banner y botón “Restaurar demo” visibles**: el fondo decorativo fijo de
  `main` (contexto de apilamiento con `isolate`) los tapaba; se les dio
  `relative z-10`. Solo aparecen en el proyecto demo.
- **Descripción de venta**: al cambiar de producto, la descripción automática
  se reemplaza por la etiqueta del nuevo producto; si se escribió una
  descripción propia, se conserva.
- **Paginación de productos (24/página)**: `contarProductos()` + `LIMIT/OFFSET`
  en `listProductos()`; el conteo, los filtros (`q`, `categoria`, `stock`,
  `inactivos`) y la página se preservan en los enlaces. Cambiar un filtro vuelve
  a la página 1. Se muestra `Mostrando X–Y de Z`; las imágenes de producto usan
  `loading="lazy"` y `decoding="async"`. El texto filtra la página al instante y
  Enter busca en todas (aviso cuando hay más de 24).
- **Buscador de productos en “Nueva venta”**: se reemplazó el `<select>` por un
  combobox con búsqueda sin acentos por nombre, marca o categoría. Muestra hasta
  50 resultados (con aviso si hay más), navegación con flechas/Enter/Escape,
  opción “Servicio personalizado” y botón para quitar. El ID viaja en un input
  oculto; descripción, precio y aviso de stock siguen a la selección. El total
  solo suma líneas con descripción y cantidad ≥ 1; al pasar a servicio se limpia
  el precio.
- **Entornos separados**: `.env` (producción/local real, `npm run dev`) y
  `.env.demo` (demo, `npm run dev:demo` → `astro dev --mode demo`). Plantillas
  versionadas `.env.example` y `.env.demo.example`; `.env.local` queda solo para
  overrides de la máquina y fuera de git.

## Entrega

- **DB en 0/0/0/0/0** (TRUNCATE de las 5 tablas, 2026-10-20). La amiga empieza vacía:
  primero crear productos (con imagen), luego clientas y ventas.
- Verificado con DB vacía: las 6 páginas devuelven 200 con sus EmptyStates y KPIs en `$ 0`;
  login/logout intactos; check 0/0/0 y build Complete.
- **Contraseña**: la de entrega ya se cambió en Vercel. Ojo: `.env` local todavía tiene
  `juanmartin`; sincronizarlo si se quiere probar el login local con la nueva.

## Hecho y verificado

- **Fases 1–8 completas**: CRUD de ventas, productos, gastos y clientas; resumen con
  Chart.js; auth HMAC; filtros con PRG; tablas→tarjetas en móvil.
- **Neon operativo** (pooler en la app; host directo dio timeout — ver `DECISIONS.md`).
- **Rediseño femenino**: paleta blush/vino (tokens en `src/styles/global.css`), marca
  "Valeria Eslava" (wordmark + `public/logo.svg`), navbar blush, login mobile con
  gradiente + pétalos.
- **Imagen de producto**: resize canvas 800px JPEG, base64 en `productos.imagen`.
- **Ventas a crédito y abonos** (2026-10-20): checkbox "fiada" (exige clienta), saldo
  calculado en queries, sección de abonos en el detalle (desglose Total → Abonado → Saldo),
  badges "Debe" en ventas y clientas, KPI "Por cobrar" en la home, anulación bloqueada
  si hay abonos. **Ingresos = caja**: solo ventas de contado + abonos recibidos
  (el total fiado no infla el ingreso; corrige el "monto de ingreso en los abonos").
- **Guía de uso**: `/ayuda` con 8 tarjetas paso a paso + ítem en el sidebar.
- **Hardening**: rate limit de login (5 intentos/15 min por IP, tabla `login_attempts`)
  + security headers (`X-Frame-Options`, `nosniff`, `Referrer-Policy`) en el middleware.
- **Pulido**: hairline del sidebar, flor en topbar móvil, gradiente del login también en
  desktop, contrastes `ink/75` sobre el gradiente.
- **Herramientas versionadas**: `scripts/e2e.sh` (~40 checks; seed = avisos) y
  `scripts/clean-e2e.mjs` (fecha dinámica; abonos por CASCADE).
- **Open Graph** (2026-10-22): `public/og-image.jpg` 1200×630, metadatos OG/Twitter en
  `BaseLayout`, `site` en `astro.config.mjs`, `/og-image.jpg` público en middleware.
  Verificado en producción (WhatsApp/redes).
- **Toast de login**: el aviso "Sesión iniciada" usa el flash existente y aparece en la
  home tras autenticarse.
- **Respaldo y exportación** (2026-10-22): `/respaldo` con JSON completo y CSVs por
  módulo; `npm run db:backup` / `db:restore` (restaurar exige `--reemplazar`).
  `backups/` está en `.gitignore`.
- **Paginación**: 50 por página en ventas y gastos; 24 por página en productos
  (tarjetas con imagen), con conteo real, filtros y página preservados.
- **Recibo imprimible**: `/ventas/recibo/[id]` con `@media print` y botón en el detalle.
- **Guardas**: no se elimina una clienta con saldo pendiente; badge de stock bajo en el
  sidebar desde `countStockBajo()`.
- **Integridad** (2026-10-22): stock con `CHECK (stock >= 0)` y descuento atómico;
  anular/reactivar con CTE (sin doble ajuste); abonos serializados por venta
  (`pg_advisory_xact_lock` + INSERT condicional); fechas de calendario validadas;
  errores de negocio con 400/404/409 (`src/lib/errores.ts`); índices nuevos
  (`login_attempts`, `abonos.fecha`, `venta_items.producto_id`, `gastos.categoria`).
- **Pulido de entrega** (2026-10-22): wordmark del login desktop con `tono="claro"`
  (paper + rose sobre espresso; Lighthouse a11y **100**), `robots.txt` + `X-Robots-Tag:
  noindex, nofollow` en todas las respuestas, y e2e actualizado a la guarda de clientas
  (con saldo → bloqueado; sin deuda → se elimina). Respaldo/restauración probados con
  datos reales de prueba (2 ventas, 1 abono, 1 clienta, 1 producto).

## Últimas verificaciones (2026-10-22)

- `astro check`: 0/0/0 · `build`: Complete.
- Smoke con sesión: login 302; `/ventas`, `/gastos`, `/clientas`, `/respaldo` 200;
  `/respaldo.json` 200 JSON; los 5 CSV 200; tabla inválida y recibo inexistente 404.
- `npm run db:backup` y `db:restore --reemplazar` probados dos veces: con DB vacía y
  con datos (restaura conteos, totales y abonos sin pérdida).
- e2e completo: **0 fallos** (2026-10-22; incluye stock/abonos, fecha imposible → 400,
  abono excesivo → 409, anular con abonos bloqueado y guarda de clientas con saldo).
- DB tras pruebas: 0/0/0/0/0/0 (incluye `login_attempts` vacía).

## Verificación 2026-10-24 (paginación y buscador)

- `astro check`: 0/0/0 · `build`: Complete.
- Con la base de producción local (63 productos): página 1 → 24, página 2 → 24,
  página 3 → 15; `pagina=99` se ajusta a la última; `categoria=Maquillaje`
  conserva el filtro y la paginación.
- Demo: combobox con 15 productos; búsqueda por nombre/marca/categoría, selección
  con teclado, limpiar, servicio, aviso de stock y total sincronizado.
- e2e: 45/47; los 2 fallos son del login demo (no pide contraseña ni aplica el
  rate limit de 5 intentos), no de la paginación ni del buscador.

## Pendientes (propuestos, esperando decisión — opcionales)

1. **Sincronizar `DASHBOARD_PASSWORD` local**: Vercel ya tiene la nueva, `.env` no.
2. **Abonos editables**: editar/eliminar un abono (hoy solo se registran) y costo
   congelado en `venta_items` para ganancia real.
3. Futuro: imágenes a Vercel Blob + thumbnails, migraciones, CI, backups automáticos,
   multi-usuario, PWA offline.
