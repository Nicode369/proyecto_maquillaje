# Mapa de archivos

Una línea por archivo para localizar todo sin escanear el repo.

```
src/
├── middleware.ts            Protege todas las rutas salvo /login + security headers (conSeguridad)
├── env.d.ts                 Tipos de ambiente (astro:env)
│
├── layouts/
│   ├── BaseLayout.astro     Shell HTML: fonts (Fraunces+Inter), viewport, favicon, título con sufijo
│   ├── DashboardLayout.astro Shell del panel: Sidebar + topbar blush + main + Footer (sin lógica de logout)
│   └── AuthLayout.astro     Login: panel espresso desktop + capa blush móvil (gradiente/pétalos) + footer
│
├── pages/
│   ├── index.astro          Resumen: KPIs (con Por cobrar) + Chart.js + tops + stock bajo
│   ├── login.astro          Form de contraseña (botón/input size lg)
│   ├── logout.astro         POST → borra cookie → 302 /login (endpoint, NO action; ver DECISIONS)
│   ├── ayuda.astro          Guía de uso en español (8 tarjetas paso a paso)
│   ├── ventas/              index (filtros+tabla+badges crédito), nueva (checkbox crédito), [id] (detalle + abonos)
│   ├── productos/           index (KPIs stock + miniaturas + filtros), nuevo, [id]/editar
│   ├── gastos/              index, nuevo, [id]/editar
│   └── clientas/            index (columna Debe), nueva, [id] (tarjeta Debe), [id]/editar
│
├── actions/
│   ├── index.ts             Exporta `server` = { auth, clientes, gastos, productos, ventas }
│   ├── auth.ts              Login con rate limit por IP (login_attempts, 5/15 min; ver DECISIONS)
│   ├── sesion.ts            exigirSesion(): guard de actions (ActionError UNAUTHORIZED)
│   ├── clientes.ts          crear/actualizar/eliminar (eliminación dura)
│   ├── productos.ts         CRUD + campo `imagen` (zod data-URL) + limpiar()
│   ├── ventas.ts            crear (transacción, credito) + anular (guard abonos) + reactivar + registrarAbono
│   └── gastos.ts            CRUD de gastos
│
├── components/
│   ├── Sidebar.astro        Nav drawer blush: items, copyright (sobre separador), form POST /logout, script drawer (inert)
│   ├── Valeria.astro        Wordmark Fraunces itálico + logo; variantes sidebar/auth
│   ├── Footer.astro         © año · Desarrollado por Nicode (dashboard y login)
│   ├── LimpiarFiltros.astro Píldora con X para borrar filtros (ventas/gastos/productos/clientas)
│   ├── SubirImagen.astro    Input file (cámara o galería) + resize canvas 800px + preview + quitar
│   ├── ConfirmDialog.astro  <dialog> de confirmación (data-confirm / titulo / ok / peligro) + script delegado
│   └── ui/                  Button (rounded-full, size sm|md|lg), Input (size md|lg), Select, Textarea,
│                            Checkbox, Card (rounded-xl), Badge (rounded-full), PageHeader, EmptyState,
│                            Alert (variantes danger|success|warning|info, iconos lucide, compact),
│                            Toast (aviso flotante con autocierre, lee flash)
│
├── lib/
│   ├── db.ts                Cliente Neon (pooler, astro:env/server)
│   ├── auth.ts              firmarSesion/verificarSesion (HMAC), opcionesCookie, SESSION_COOKIE
│   ├── flash.ts             Mensajes flash post-redirect (cookie httpOnly 60s) + leerFlash/borrarFlash
│   ├── format.ts            COP (Intl es-CO sin decimales), fechas es-CO
│   └── queries/             SQL crudo, uno por módulo:
│       ├── types.ts         Tipos de filas (+Abono; Venta con credito/saldo; ClienteResumen con saldo)
│       ├── clientes.ts      CRUD + búsqueda + saldo pendiente por clienta
│       ├── productos.ts     CRUD + resumenStockActivo() + búsquedas (incluye imagen)
│       ├── ventas.ts        Lista/filtros + detalle (items+abonos) + saldo calculado + create/anular/reactivar/registrarAbono
│       ├── gastos.ts        CRUD + filtros + totales por mes
│       └── reportes.ts      Datos de la home (KPIs, serie, stock bajo, tops, porCobrar)
│
└── styles/
    └── global.css           Tailwind v4: tokens @theme (paleta completa), data-table,
                             display-number, reduced-motion, scrollbars

db/
├── schema.sql               CREATE TABLEs (7: +abonos, login_attempts) + ALTER (productos.imagen, ventas.credito)
scripts/
├── db-init.ts               Aplica schema.sql (requiere .env + source)
├── db-seed.ts               Inserta datos de prueba (⚠️ no corre sin confirmar: duplicaría datos)
├── e2e.sh                   Suite e2e (~40 checks incl. crédito/abonos y rate limit) — bash scripts/e2e.sh
└── clean-e2e.mjs            Limpia residuos E2E% (abonos por CASCADE) y reporta counts — requiere DATABASE_URL (pooler)
```

Assets: `public/logo.svg` (flor con degradado), `public/favicon.svg`.
