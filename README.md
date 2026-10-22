# Panel de control — Maquillaje

Dashboard privado en español para gestionar el emprendimiento de maquillaje de una
amiga: ventas, productos, clientas, gastos y un resumen con indicadores. Es **solo el
panel** (no hay web pública) y toda la interfaz y las cifras están en español de
Colombia, con la moneda en **COP**.

## Stack

- **Astro 7** con `output: 'server'` + adaptador `@astrojs/vercel`
- **Tailwind CSS 4** vía plugin `@tailwindcss/vite`
- **Neon Postgres** con `@neondatabase/serverless` — SQL crudo en `src/lib/queries/`, sin ORM
- **Astro Actions** (`accept: 'form'` + `astro/zod`) para todo el CRUD, con patrón PRG
- **Auth** por cookie `httpOnly` firmada con HMAC-SHA256; el middleware protege
  todas las rutas salvo `/login`
- **Chart.js** en el resumen; iconos con `@lucide/astro`; tipografías con fontsource
  (Fraunces Variable para display, Inter Variable para UI)
- Sin frameworks de UI (React/Vue): JS vanilla en `<script>` solo donde hace falta

## Requisitos

- **Node ≥ 22.22**
- Una base de datos **Neon Postgres** (o cualquier Postgres) y sus cadenas de conexión
- CLI de Neon (`neon env pull`) y/o Vercel, opcionales pero recomendados

## Puesta en marcha

```sh
npm install
```

Crea el archivo `.env` a partir de `.env.example`. Las variables de Neon las puedes
traer con `neon env pull`, o escribirlas a mano:

```sh
DATABASE_URL="postgresql://…-pooler.region.aws.neon.tech/neondb?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://….region.aws.neon.tech/neondb?sslmode=require"
DASHBOARD_PASSWORD="tu-contraseña"
SESSION_SECRET="$(openssl rand -hex 32)"
```

La app usa la URL **pooled** (`DATABASE_URL`); la directa (`DATABASE_URL_UNPOOLED`) es
para los scripts de base de datos.

Crea el esquema y, si quieres datos de ejemplo:

```sh
npm run db:init     # crea las tablas (db/schema.sql)
npm run db:seed     # datos de ejemplo — NO correr sobre datos reales
npm run db:reset    # vacía todas las tablas (deja la BD como en la entrega)
```

> ⚠️ `db:seed` **borra e inserta** datos de demostración. En una base que ya tiene
> información real, **no lo ejecutes**. `db:reset` también es destructivo: borra
> todo, incluidos los datos reales.

Levanta el servidor:

```sh
npm run dev         # http://localhost:4321
```

Entra con la contraseña definida en `DASHBOARD_PASSWORD`.

## Scripts

| Comando            | Acción                                                  |
| :----------------- | :------------------------------------------------------ |
| `npm run dev`      | Servidor de desarrollo en `localhost:4321`              |
| `npm run build`    | Build de producción para Vercel                         |
| `npm run preview`  | Previsualiza el build en local                          |
| `npm run check`    | `astro check` (tipos y diagnósticos)                    |
| `npm run db:init`  | Crea el esquema en la base (`db/schema.sql`)            |
| `npm run db:seed`  | Inserta datos de ejemplo (**destructivo**)              |
| `npm run db:reset` | Vacía todas las tablas (**destructivo**)                |
| `npm run db:clean-e2e` | Borra solo los datos que crea el e2e              |

## Estructura

```
src/
├── layouts/            BaseLayout (shell HTML), DashboardLayout (sidebar + topbar), AuthLayout
├── pages/              login, logout, index (resumen), ventas/, productos/, gastos/, clientas/, ayuda
├── actions/            auth, clientes, productos, ventas, gastos (+ index que re-exporta)
├── components/ui/      Button, Card, Badge, Input, Select, Textarea, EmptyState, PageHeader
├── lib/                db.ts (Neon), auth.ts (HMAC), format.ts (COP/es-CO), queries/
├── middleware.ts       Protección de rutas + cabeceras de seguridad
└── styles/global.css   Tailwind v4 con tokens @theme

db/                     schema.sql + seed
scripts/                db-init.ts, db-seed.ts, reset-db.mjs, e2e.sh, clean-e2e.mjs
docs/                   memoria, decisiones, mapa y verificación
```

## Funcionalidad

- **Ventas**: de contado o **a crédito** (fiadas) con registro de **abonos**. El saldo
  de una venta fiada se calcula siempre en las consultas, nunca se almacena.
- **Productos**: CRUD con imagen (redimensionada a JPEG y guardada en la base).
- **Clientas**: ficha con su historial de compras y cuánto debe.
- **Gastos**: CRUD por categoría.
- **Resumen**: KPIs del mes y gráfica con Chart.js.
- **Ayuda**: guía paso a paso dentro del panel (`/ayuda`).

Dos reglas de negocio importantes:

- **Ingresos = caja**: el indicador "Ingresos" suma solo lo **cobrado** — ventas de
  contado más los abonos recibidos. Una venta fiada no suma ingreso hasta que se cobra;
  "Por cobrar" muestra el saldo pendiente global.
- **Anular ≠ borrar**: una venta anulada queda registrada en el historial y restaura el
  stock, pero no se elimina. Se puede **reactivar** si fue un error. No hay borrado físico.

## Verificación

```sh
npm run check && npm run build
```

End-to-end (requiere el dev server en `localhost:4321` y un `.env` válido; funciona con
la base vacía):

```sh
npm run dev            # en otra terminal
bash scripts/e2e.sh
npm run db:clean-e2e   # limpia los residuos del e2e (no toca datos reales)
```

## Despliegue en Vercel

El adaptador `@astrojs/vercel` genera la salida que Vercel consume.

1. Importa el repositorio en Vercel (framework **Astro**, build `npm run build`).
2. Define las variables de entorno en el proyecto de Vercel:
   `DATABASE_URL`, `SESSION_SECRET` y `DASHBOARD_PASSWORD`.
3. Despliega. Antes de entregar, **cambia `DASHBOARD_PASSWORD`** por una contraseña
   segura y genera un `SESSION_SECRET` aleatorio.

## Documentación interna

- `AGENTS.md` — stack, convenciones y comandos del proyecto
- `docs/MEMORIA.md` — estado actual, pendientes y estado real de la base
- `docs/DECISIONS.md` — decisiones técnicas y de diseño con su porqué
- `docs/MAPA.md` — qué hace cada archivo
- `docs/VERIFICACION.md` — flujo de verificación, e2e y fallas conocidas
