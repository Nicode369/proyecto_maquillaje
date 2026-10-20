# Memoria — estado actual del proyecto

> Última actualización: 2026-10-20 — **DB vacía, lista para entrega**.

## Entrega

- **DB en 0/0/0/0/0** (TRUNCATE de las 5 tablas, 2026-10-20). La amiga empieza vacía:
  primero crear productos (con imagen), luego clientas y ventas.
- Verificado con DB vacía: las 6 páginas devuelven 200 con sus EmptyStates y KPIs en `$ 0`;
  login/logout intactos; check 0/0 y build Complete.
- **Antes de entregar**: cambiar `DASHBOARD_PASSWORD` (hoy `juanmartin`) en `.env` **y**
  en las env vars de Vercel (`DATABASE_URL`, `SESSION_SECRET`, `DASHBOARD_PASSWORD`).

## Hecho y verificado

- **Fases 1–8 completas**: CRUD de ventas, productos, gastos y clientas; resumen con
  Chart.js; auth HMAC; filtros con PRG; tablas→tarjetas en móvil.
- **Neon operativo** (pooler en la app; host directo dio timeout — ver `DECISIONS.md`).
- **Rediseño femenino**: paleta blush/vino (tokens en `src/styles/global.css`), marca
  "Valeria Eslava" (wordmark + `public/logo.svg`).
- **Navbar blush**: sidebar + topbar `#f3c9d9`; copyright sobre el separador; logout fiable
  vía `POST /logout`.
- **Login mobile**: `flex-col` + `min-h-dvh` + safe-area; fondo "polvo de blush" animado
  (gradiente + 5 pétalos), solo mobile; reduced-motion respetado.
- **Imagen de producto**: resize canvas 800px JPEG, base64 en `productos.imagen`, preview
  y "Quitar".
- **Herramientas versionadas**: `scripts/e2e.sh` (~30 checks; los de seed son **avisos**,
  no fallos, para funcionar con DB vacía) y `scripts/clean-e2e.mjs` (limpieza de residuos,
  fecha dinámica).

## Histórico de la DB (antes del wipe para entrega)

10 clientas · 15 productos · 34 ventas · 65 items · 11 gastos
(faltaban 4 gastos del seed — probable borrado real; ya no aplica: la DB quedó vacía a propósito).

## Pendientes (propuestos, esperando decisión del usuario — opcionales)

1. Hairline derecho en el sidebar (`border-r border-wine/15`) para definir blush↔paper.
2. Flor de marca pequeña en el topbar móvil junto al título.
3. Gradiente blush **estático** en la columna derecha del login desktop.

## Últimas verificaciones (con DB vacía)

- `astro check`: 0/0 · `build`: Complete.
- Smoke: `/`, `/clientas`, `/productos`, `/ventas`, `/gastos` → 200 + EmptyStates;
  KPIs en `$ 0`; logout → `302 /login`.
- e2e en DB vacía: los checks de seed emiten AVISO (no FAIL); el CRUD crea y limpia sus datos.
