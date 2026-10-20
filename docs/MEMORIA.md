# Memoria — estado actual del proyecto

> Última actualización: 2026-10-20 — crédito/abonos, guía, hardening y pulido implementados; DB vacía.

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
  calculado en queries, sección de abonos en el detalle, badges "Debe" en ventas y
  clientas, KPI "Por cobrar" en la home, anulación bloqueada si hay abonos.
- **Guía de uso**: `/ayuda` con 8 tarjetas paso a paso + ítem en el sidebar.
- **Hardening**: rate limit de login (5 intentos/15 min por IP, tabla `login_attempts`)
  + security headers (`X-Frame-Options`, `nosniff`, `Referrer-Policy`) en el middleware.
- **Pulido**: hairline del sidebar, flor en topbar móvil, gradiente del login también en
  desktop, contrastes `ink/75` sobre el gradiente.
- **Herramientas versionadas**: `scripts/e2e.sh` (~40 checks; seed = avisos) y
  `scripts/clean-e2e.mjs` (fecha dinámica; abonos por CASCADE).

## Últimas verificaciones (2026-10-20)

- `astro check`: 0/0/0 · `build`: Complete.
- e2e completo: **38 PASS / 0 FALLOS** (incluye crédito, abonos, saldo 25.000,
  anulación bloqueada, rate limit 429, /ayuda).
- Detector impeccable: `src public` 0 findings; login móvil solo el
  `clipped-overflow-container` **conocido/justificado** (panel decorativo).
- DB tras e2e: limpiada a 0/0/0/0/0 con `scripts/clean-e2e.mjs`.

## Pendientes (propuestos, esperando decisión — opcionales)

1. **Exportar CSV** de ventas/gastos para el contador (no implementado).
2. **Recibo imprimible de venta** (`@media print`).
3. **Badge de stock bajo** en el sidebar (la query `stockBajo()` ya existe).
4. Futuro: imágenes a Vercel Blob (el base64 infla la DB), multi-usuario, PWA offline.
