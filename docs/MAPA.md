# Mapa de archivos

Una línea por archivo para localizar todo sin escanear el repo.

```
src/
├── middleware.ts            Protege todas las rutas salvo /login (verifica cookie de sesión)
├── env.d.ts                 Tipos de ambiente (astro:env)
│
├── layouts/
│   ├── BaseLayout.astro     Shell HTML: fonts (Fraunces+Inter), viewport, favicon, título con sufijo
│   ├── DashboardLayout.astro Shell del panel: Sidebar + topbar blush + main + Footer (sin lógica de logout)
│   └── AuthLayout.astro     Login: panel espresso desktop + capa blush móvil (gradiente/pétalos) + footer
│
├── pages/
│   ├── index.astro          Resumen: KPIs + Chart.js (ingresos/gastos 6 meses) + últimas ventas
│   ├── login.astro          Form de contraseña (botón/input size lg)
│   ├── logout.astro         POST → borra cookie → 302 /login (endpoint, NO action; ver DECISIONS)
│   ├── ventas/              index (filtros+tabla), nueva, [id] (detalle)
│   ├── productos/           index (KPIs stock + miniaturas + filtros), nuevo, [id]/editar
│   ├── gastos/              index, nuevo, [id]/editar
│   └── clientas/            index, nueva, [id], [id]/editar
│
├── actions/
│   ├── index.ts             Exporta `server` = { auth, clientes, gastos, productos, ventas }
│   ├── auth.ts              Solo login (logout NO es action → pages/logout.astro)
│   ├── sesion.ts            exigirSesion(): guard de actions (ActionError UNAUTHORIZED)
│   ├── clientes.ts          crear/actualizar/eliminar (soft… no: eliminación dura)
│   ├── productos.ts         CRUD + campo `imagen` (zod data-URL) + limpiar()
│   ├── ventas.ts            crear (transacción) + anular (restaura stock)
│   └── gastos.ts            CRUD de gastos
│
├── components/
│   ├── Sidebar.astro        Nav drawer blush: items, copyright (sobre separador), form POST /logout, script drawer (inert)
│   ├── Valeria.astro        Wordmark Fraunces itálico + logo; variantes sidebar/auth
│   ├── Footer.astro         © año · Desarrollado por Nicode (dashboard y login)
│   ├── LimpiarFiltros.astro Píldora con X para borrar filtros (ventas/gastos/productos/clientas)
│   ├── SubirImagen.astro    Input file + resize canvas 800px + preview + quitar
│   └── ui/                  Button (rounded-full, size sm|md|lg), Input (size md|lg), Select, Textarea,
│                            Checkbox, Card (rounded-xl), Badge (rounded-full), PageHeader, EmptyState
│
├── lib/
│   ├── db.ts                Cliente Neon (pooler, astro:env/server)
│   ├── auth.ts              firmarSesion/verificarSesion (HMAC), opcionesCookie, SESSION_COOKIE
│   ├── format.ts            COP (Intl es-CO sin decimales), fechas es-CO
│   └── queries/             SQL crudo, uno por módulo:
│       ├── types.ts         Tipos de filas
│       ├── clientes.ts      CRUD + búsqueda
│       ├── productos.ts     CRUD + resumenStockActivo() + búsquedas (incluye imagen)
│       ├── ventas.ts        Lista/filtros + detalle + KPIs (excluye anuladas)
│       ├── gastos.ts        CRUD + filtros + totales por mes
│       └── reportes.ts      Datos de la home (KPIs, serie de la gráfica)
│
└── styles/
    └── global.css           Tailwind v4: tokens @theme (paleta completa), data-table,
                             display-number, reduced-motion, scrollbars

db/
├── schema.sql               CREATE TABLEs + ALTER (productos.imagen)
scripts/
├── db-init.ts               Aplica schema.sql (requiere .env + source)
├── db-seed.ts               Inserta datos de prueba (⚠️ no corre sin confirmar: duplicaría datos)
├── e2e.sh                   Suite e2e (~30 checks) — bash scripts/e2e.sh desde el root; seed como avisos
└── clean-e2e.mjs            Limpia residuos E2E% y reporta counts — requiere DATABASE_URL exportado (pooler)
```

Assets: `public/logo.svg` (flor con degradado), `public/favicon.svg`.
