# Panel de control — Maquillaje

Dashboard privado en español (Colombia, moneda COP) para el emprendimiento de maquillaje
de una amiga. Solo el panel (sin web pública).

## Stack (versiones exactas, no cambiar)

- **Astro 7** con `output: 'server'` + adaptador `@astrojs/vercel`
- **Tailwind CSS 4** vía plugin `@tailwindcss/vite` (NO usar `@astrojs/tailwind`, está deprecado)
- **Neon Postgres** con `@neondatabase/serverless` — SQL crudo en `src/lib/queries/`, sin ORM
- **Astro Actions** (`accept: 'form'` + `astro/zod`) para todo CRUD; patrón PRG
- **Auth**: cookie `httpOnly` firmada con HMAC-SHA256 (`SESSION_SECRET`); el middleware
  protege todas las rutas salvo `/login`
- **Chart.js** solo en la home; iconos con `@lucide/astro`; tipografías con fontsource
  (Fraunces Variable display + Inter Variable UI)
- Sin frameworks de UI (React/Vue). JS vanilla en `<script>` solo donde haga falta

## Convenciones

- UI 100% en español; moneda COP con `src/lib/format.ts` (Intl es-CO, sin decimales)
- Fechas: `type="date"` en YYYY-MM-DD; mostrar en es-CO
- Env vars declaradas en `astro.config.mjs` (astro:env) y leídas desde `astro:env/server`:
  `DATABASE_URL` (pooled), `SESSION_SECRET`, `DASHBOARD_PASSWORD` — las de Neon las escribe
  `neon env pull` en `.env` (`DATABASE_URL_UNPOOLED` y `NEON_BRANCH` son del CLI)
- Ventas `anulada = true` se excluyen de KPIs; anular restaura stock
- Mobile-first: tablas se convierten en tarjetas en móvil; sidebar colapsa en drawer
- Dirección visual: papel `#fbf3f4`, tinta `#2a1b20`, acento granate `#bd3f66`,
  botones rosa `#ee8db1` con texto tinta, navbar blush `#f3c9d9` (sidebar + topbar);
  hairlines en vez de sombras; cifras en Fraunces — **paleta completa en `docs/DECISIONS.md`**

## Estructura

```
src/
├── layouts/            BaseLayout (shell HTML), DashboardLayout (sidebar+topbar)
├── pages/              login, index (resumen), ventas/, productos/, gastos/, clientas/
├── actions/            auth, clientes, productos, ventas, gastos (+ index que re-exporta)
├── components/ui/      Button, Card, Badge, Input, Select, Textarea, EmptyState, PageHeader
├── lib/                db.ts (Neon), auth.ts (HMAC), format.ts, queries/
├── styles/global.css   Tailwind v4 con tokens @theme
db/                     schema.sql, seed
scripts/                db-init.ts, db-seed.ts
```

## Base de datos

Tablas: `clientes`, `productos`, `ventas`, `venta_items`, `gastos` (ver `db/schema.sql`).

## Memoria del proyecto

Evita re-escanear el repo — leer bajo demanda:

- `docs/MEMORIA.md` — estado actual, pendientes y estado real de la DB
- `docs/DECISIONS.md` — decisiones técnicas/diseño con su "por qué" (logout, conexión, paleta, git)
- `docs/MAPA.md` — qué hace cada archivo (localizar sin glob/grep)
- `docs/VERIFICACION.md` — workflow de verificación, e2e, limpieza y fallas conocidas

## Comandos

- `npm run dev` (o `astro dev --background`)
- **Verificar siempre al terminar**: `npm run astro check && npm run build`
- `bash scripts/e2e.sh` (e2e; requiere dev server; funciona con DB vacía) ·
  `node scripts/clean-e2e.mjs` (limpieza de residuos E2E)
- `npm run db:init` / `npm run db:seed` (requieren `.env` con `DATABASE_URL`; usan la directa)
- Neon CLI: `neon env pull` (refresca `.env`), `neon deploy` (aplica `neon.ts`), `neon status`

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.
