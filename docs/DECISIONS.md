# Decisiones técnicas y de diseño (con su por qué)

Para no re-descubrir por qué el código es así. Stack/convenciones básicas en `AGENTS.md`.

## Base de datos y conexión

- **App usa el pooler** (`DATABASE_URL` vía `astro:env/server` en `src/lib/db.ts`).
  El host **directo** (`DATABASE_URL_UNPOOLED`) dio timeout (ETIMEDOUT) una vez →
  para scripts de limpieza/consulta usar **también el pooler**.
- Scripts (`db:init`/`db:seed`) usan `DATABASE_URL_UNPOOLED ?? DATABASE_URL`; requieren
  `source .env` en el shell (Node no carga `.env` solo).
- `gastos` **no tiene columna `activo`** (soft-delete solo en `productos`).
- `::float8`/`::int`/`::text` en todo SQL (Neon devuelve strings sin cast).
- `sql.transaction` solo en `createVenta` (venta + items + stock en un solo paso).

## Crédito y abonos (ventas fiadas)

- `ventas.credito boolean` + tabla `abonos (venta_id FK CASCADE, fecha, monto>0, notas)`.
- **El saldo nunca se almacena**: se calcula en cada query
  (`GREATEST(total − SUM(abonos), 0)` vía LEFT JOIN LATERAL) — sin desincronización
  y la escala es minúscula.
- **Reglas de negocio**: a crédito exige clienta (deuda anónima no tiene sentido);
  anular una venta con abonos queda **bloqueada** (hubo plata real de por medio);
  `registrarAbono` valida `monto ≤ saldo` en el servidor.
- **Anular vs borrar** (2026-10-20): NO hay borrado físico de ventas. "Anular" marca
  `anulada=true` (restaura stock, sale de KPIs) y deja constancia en el historial;
  "Reactivar" deshace la anulación (re-descuenta stock con guard de disponibilidad).
  Motivo: panel contable → trazabilidad > borrado irreversible; un botón de borrar
  junto a anular confunde a la usuaria.
- **Ingresos = caja** (corregido 2026-10-20): el KPI Ingresos y la serie mensual suman
  **solo lo cobrado**: ventas de contado (total, en su fecha) **+ cada abono** (en la
  fecha del abono). Una venta fiada NO suma ingreso al crearse; suma cuando cobra.
  Antes el total fiado inflaba el mes de la venta y los abonos no sumaban nunca.
- UI: badge `wine` "Crédito · debe $X" en listas, "Debe" en clientas, celda
  "Por cobrar" (total global, sin filtro de mes) en la tira de KPIs de la home,
  y desglose Total → Abonado → Saldo en el tfoot del detalle.

## Rate limit y security headers

- **Rate limit por IP en DB** (`login_attempts(ip, ts)`), no in-memory: en serverless
  (Vercel) la memoria no sobrevive entre invocaciones ni entre instancias. Máx.
  5 intentos fallidos / 15 min; al acertar se limpia la IP; INSERT purga filas >1h.
- IP desde `x-forwarded-for` (primer hop) con fallback a `clientAddress`.
- **Security headers** en el middleware vía wrapper `conSeguridad()` (también en
  redirects): `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`. **Sin CSP**: rompería los
  scripts inline de Chart.js.

## Auth y logout

- Cookie `panel_session`: `httpOnly`, `sameSite=lax`, `path=/`, 14 días; HMAC-SHA256
  con `SESSION_SECRET` (`src/lib/auth.ts`). `secure` solo en PROD.
- `src/actions/sesion.ts` → `exigirSesion()` es el guard para handlers de actions
  (lanza `ActionError UNAUTHORIZED`); el middleware protege las rutas de página.
- **Logout = endpoint de página `POST /logout`** (`src/pages/logout.astro`), NO una action.
  Motivos (Astro 7.4.1):
  1. Las actions **no pueden devolver `Response`/redirect** → `AstroActionError` (500).
  2. `getActionResult` + `Astro.redirect` en el frontmatter de un **layout** falla con
     `ResponseSentError` (el stream de respuesta ya arrancó) → 200 "muerto" en el navegador.
  3. El form HTML estándar (`method=POST action=/logout`) funciona con y sin JS.
- El e2e exige `302|303` con `Location: /login` (antes aceptaba 200 = falso pass).

## Paleta (tokens `@theme` en `src/styles/global.css`)

| token | hex | uso |
|---|---|---|
| paper | `#fbf3f4` | fondo de contenido |
| surface | `#fff9fa` | cards/tablas |
| ink | `#2a1b20` | texto principal |
| ink-muted | `#7a5f66` | texto secundario sobre claro |
| hairline | `rgba(42,27,32,0.12)` | bordes finos sobre paper/surface |
| wine | `#bd3f66` | acento primario: links, foco, texto activo, hairlines sobre blush |
| wine-soft | `#fce8ee` | fondos suaves, selección |
| pink / pink-hover | `#ee8db1` / `#ea7fa4` | relleno de botones primarios **con texto ink** (7:1) |
| rose | `#e8a2b8` | pétalos, toques suaves |
| blush | `#f3c9d9` | **sidebar + topbar** (navbar rosada, decisión del usuario) |
| espresso | `#4c2e3d` | panel izquierdo del login desktop (único bloque oscuro) |
| espresso-muted | `#cdb4be` | texto sobre espresso |
| gold / sage / ochre / danger | `#a67c00` / `#3e6b4f` / `#a1650f` / `#9e2b25` | badges de stock/estado |

Reglas de contraste sobre blush (`#f3c9d9`): texto inactivo `ink/70` (~5:1), secundario
`ink/75` (~5.3:1), item activo `bg-white/75 text-wine` (~4.7:1), hairlines `border-wine/15`.

Otras reglas de diseño:
- Botones primarios = rosa con **texto tinta** (nunca texto blanco sobre rosa claro).
- Hairlines en vez de sombras fuertes; radii: Button `rounded-full`, Card/contenedores `rounded-xl`,
  Input/Select `rounded-lg`, Badge `rounded-full`.
- Sin gradientes en tipografía; iconos solo lucide o SVG propio; ornamentación = flor de marca.

## Marca y tipografía

- `Valeria.astro`: variante `sidebar` (logo h-6) y `auth` (logo h-9); nombre tinta + "Eslava" granate.
- Estilo del wordmark: Fraunces itálico con
  `font-variation-settings: 'opsz' 144, 'wght' 560, 'SOFT' 40, 'WONK' 1`.
- Títulos de página: `${título} · Valeria Eslava` (en `BaseLayout`/layouts).

## Login mobile

- `AuthLayout`: `main` con `flex-col` (¡row rompía el footer!), `min-h-dvh` (no `screen`),
  safe-area con `env(safe-area-inset-bottom)` + `viewport-fit=cover`.
- Capa de fondo: gradiente `.fondo-polvo` **sobre `main`** (visible también en desktop);
  pétalos solo mobile (`lg:hidden`) con keyframe
  `deriva` (custom props `--dur/--delay/--dy/--dr/--r0`), entrada `.entrada` 450ms.
  `prefers-reduced-motion` global + explícito en el componente.
- Textos sobre el gradiente (footer y "Maquillaje" mobile) en `ink/75` — `ink-muted`
  cae a 4.2:1 sobre `#f6d3e0` (detector).
- El watermark del login se **quitó** (detector: raster invisible = "compliance token");
  la identidad desktop la carga el panel espresso.

## Imagen de productos

- Columna `productos.imagen text` (base64 data-URL en Postgres; validate
  `data:image/(jpeg|jpg|png|webp);base64,` máx ~1.4MB en zod → error 400.
- Resize client-side en canvas: máx 800px, JPEG calidad 0.82 (`SubirImagen.astro`).
- El input **no** lleva `capture`: sin ese atributo el selector nativo del
  sistema ofrece cámara **y** galería (iOS: Cámara / Biblioteca / Buscar;
  Android: Cámara / Galería / Archivos). Con `capture` se saltaba la galería.
  `accept="image/*"` a propósito: restringir los tipos puede hacer que Android
  deje de ofrecer la cámara en el selector.

## Git

- `.env` **jamás** se hace stage (verificar con grep antes de cada commit).
- `.vercel/output` está trackeado por convención → commit aparte ("Actualiza artefactos de build Vercel").
- Autor: `git -c user.name="nicode" -c user.email="nicode@users.noreply.github.com" commit …`.
