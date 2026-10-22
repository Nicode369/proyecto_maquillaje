# Memoria — estado actual del proyecto

> Última actualización: 2026-10-22 — OG, toast de login, respaldo/exportación, recibo,
> paginación y guardas de stock/clientas; DB vacía.

## Entrega

- **DB en 0/0/0/0/0** (TRUNCATE de las 5 tablas, 2026-10-20). La amiga empieza vacía:
  primero crear productos (con imagen), luego clientas y ventas.
- Verificado con DB vacía: las 6 páginas devuelven 200 con sus EmptyStates y KPIs en `$ 0`;
  login/logout intactos; check 0/0/0 y build Complete.
- **Antes de entregar**: cambiar `DASHBOARD_PASSWORD` (hoy `juanmartin`) en `.env` **y**
  en las env vars de Vercel (`DATABASE_URL`, `SESSION_SECRET`, `DASHBOARD_PASSWORD`).

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
- **Paginación**: 50 por página en ventas y gastos con conteo real y filtros preservados.
- **Recibo imprimible**: `/ventas/recibo/[id]` con `@media print` y botón en el detalle.
- **Guardas**: no se elimina una clienta con saldo pendiente; badge de stock bajo en el
  sidebar desde `countStockBajo()`.

## Últimas verificaciones (2026-10-22)

- `astro check`: 0/0/0 · `build`: Complete.
- Smoke con sesión: login 302; `/ventas`, `/gastos`, `/clientas`, `/respaldo` 200;
  `/respaldo.json` 200 JSON; los 5 CSV 200; tabla inválida y recibo inexistente 404.
- `npm run db:backup` y `db:restore --reemplazar` probados con DB vacía (0 filas).
- e2e completo previo: **38 PASS / 0 FALLOS** (2026-10-20).
- DB tras pruebas: 0/0/0/0/0.

## Pendientes (propuestos, esperando decisión — opcionales)

1. **Cambiar `DASHBOARD_PASSWORD`** de entrega (`juanmartin`) en `.env` y Vercel.
2. **Editar/eliminar abonos** (hoy solo se registran; corregir un abono requiere SQL).
3. Futuro: imágenes a Vercel Blob (el base64 infla la DB y el JSON de respaldo),
   `robots.txt`/`noindex`, multi-usuario, PWA offline, CI.
