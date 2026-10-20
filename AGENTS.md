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
  `NEON_DATABASE_URL`, `SESSION_SECRET`, `DASHBOARD_PASSWORD`
- Ventas `anulada = true` se excluyen de KPIs; anular restaura stock
- Mobile-first: tablas se convierten en tarjetas en móvil; sidebar colapsa en drawer
- Dirección visual editorial: papel crema `#F7F3EE`, tinta `#221719`, acento granate
  `#7A2233`, sidebar espresso `#261A1D`; hairlines en vez de sombras; cifras en Fraunces

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

## Comandos

- `npm run dev` (o `astro dev --background`)
- **Verificar siempre al terminar**: `npm run astro check && npm run build`
- `npm run db:init` / `npm run db:seed` (requieren `.env` con `NEON_DATABASE_URL`)

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.
