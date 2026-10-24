# Decisiones técnicas y de diseño (con su por qué)

Para no re-descubrir por qué el código es así. Stack/convenciones básicas en `AGENTS.md`.

## Base de datos y conexión

- **App usa el pooler** (`DATABASE_URL` vía `astro:env/server` en `src/lib/db.ts`).
  El host **directo** (`DATABASE_URL_UNPOOLED`) dio timeout (ETIMEDOUT) una vez →
  para scripts de limpieza/consulta usar **también el pooler**.
- Scripts (`db:init`/`db:seed`/respaldo/restauración) usan
  `DATABASE_URL_UNPOOLED ?? DATABASE_URL`; los npm scripts cargan `.env` con
  `node --env-file-if-exists=.env`.
- `gastos` **no tiene columna `activo`** (soft-delete solo en `productos`).
- `::float8`/`::int`/`::text` en todo SQL (Neon devuelve strings sin cast).
- `sql.transaction` solo en `createVenta` (venta + items + stock en un solo paso).

## Entornos (.env y .env.demo)

- **Separados por archivo y por modo**, no con `.env.local`:
  - `.env` → producción / local con datos reales (`npm run dev`).
  - `.env.demo` → demo (base ficticia + `DEMO_MODE=true`; `npm run dev:demo`,
    que ejecuta `astro dev --mode demo`).
  - En Vercel cada proyecto tiene sus propias variables; `DEMO_MODE` y
    `DEMO_RESET_DATABASE_URL` **solo** en el proyecto demo.
- `.env.local` es solo para overrides de la máquina y está ignorado por git;
  **nunca** se usa para alternar demo/producción (antes lo hacía y provocó el
  incidente del secreto expuesto).
- Plantillas versionadas: `.env.example` (producción) y `.env.demo.example`
  (demo). Los archivos reales nunca se commitean.

## Integridad de datos y errores

- **Stock atómico**: `productos.stock` tiene `CHECK (stock >= 0)`. La venta descuenta
  sin `WHERE stock >= cantidad`; si otra venta dejó el stock corto, el CHECK aborta
  **toda** la transacción (antes la venta se guardaba y el `UPDATE` no descontaba nada).
  La violación del CHECK se traduce a **409** con mensaje claro (probado con dos ventas
  simultáneas: una 302, otra 409 y stock correcto).
- **Anular/reactivar en una sola sentencia**: CTE que actualiza la venta y, solo si
  cambió de estado (`NOT anulada` / `anulada`), ajusta el stock con `RETURNING`.
  Un doble click ya no restaura/descuenta dos veces.
- **Abonos sin sobrepago**: `pg_advisory_xact_lock(hashtext(venta_id))` serializa los
  abonos de una misma venta y el `INSERT ... SELECT` revalida el saldo dentro de la
  transacción. Antes la validación quedaba fuera del INSERT (carrera con doble submit).
- **Fechas**: `src/lib/fechas.ts` valida que la fecha exista en el calendario
  (`2026-02-31` ya no llega a Postgres como error 500).
- **Errores de negocio con su HTTP**: `src/lib/errores.ts` (`fallo()`) lanza
  `ActionError` → 400 datos inválidos, 404 no existe, 409 conflicto (stock, saldo,
  venta anulada). El 500 queda solo para fallos reales del servidor.

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

## Respaldo y exportación

- **JSON completo** (`/respaldo.json` + `scripts/db-backup.mjs`): incluye clientes,
  productos con imágenes base64, ventas, ítems, abonos y gastos; `version: 1` para poder
  validar el formato al restaurar. No incluye `login_attempts` (efímera).
- **Restaurar es destructivo**: `db-restore.mjs` exige `--reemplazar`, valida versión y
  columnas, hace `TRUNCATE ... RESTART IDENTITY CASCADE` + INSERTs en una sola
  transacción (orden por FKs). Sin `pg_dump` disponible, el JSON es la copia portable.
- **CSV** (`/exportar/[tabla]`): allowlist explícita; separador `;` y BOM UTF-8 para
  Excel en español; CRLF; celdas con `"`/`;`/salto de línea entre comillas; prefijo `'`
  si empiezan con `= + - @` para evitar inyección de fórmulas. En ventas, "Abonado" es
  `total − saldo` solo si es crédito, y "Saldo" 0 si es de contado.
- **Privacidad**: ambos endpoints viven detrás del middleware; no se enlazan desde
  fuera del panel. Los respaldos locales van a `backups/` (ignorado por git).
- **Límite de Vercel**: el JSON con muchas imágenes base64 puede acercarse al tamaño
  máximo de respuesta de una función; por eso `db:backup` (local) sigue siendo la copia
  robusta y `/respaldo.json` el atajo desde el navegador.

## Listas largas y guardas

- **Paginación de 50** en ventas y gastos: el `COUNT(*)` se hace con los mismos filtros
  y el `LIMIT/OFFSET` reemplaza el tope fijo anterior (200/300). La página se clampea
  al total real para que `?pagina=999` no muestre una lista vacía. El header usa el
  total real, no `lista.length`.
- **Productos: 24 por página** (no 50): cada fila/tarjeta lleva imagen y datos de
  margen; 24 mantiene el peso y el scroll razonables. `contarProductos()` usa los
  mismos filtros que `listProductos()`; los enlaces preservan `q`, `categoria`,
  `stock`, `inactivos` y `pagina`; cambiar un filtro no manda `pagina` y vuelve a 1.
  Las imágenes de producto llevan `loading="lazy"` y `decoding="async"`.
- **Buscador de productos en “Nueva venta”**: un `<select>` nativo con decenas de
  opciones es difícil de recorrer; se reemplazó por un combobox que filtra en el
  cliente por nombre, marca o categoría (sin acentos), muestra máx. 50 resultados y
  navega con flechas/Enter/Escape. El ID se guarda en un input oculto; la opción
  “Servicio personalizado” limpia el producto y el precio. Es suficiente para el
  catálogo actual (decenas/cientos); si crece a miles, mover la búsqueda a un
  endpoint del servidor. El total solo suma líneas con descripción y cantidad ≥ 1,
  para que coincida con `items_json`.
- **Ventas anuladas cuentan para paginar** (son historial visible), pero no para el
  monto facturado (`totalesVentas` las excluye); el header muestra ambos datos.
- **Clientas con deuda no se eliminan**: el guard vive en la action (autoridad) y la UI
  oculta el botón mostrando el saldo; el mensaje usa `formatCOP`. La FK de ventas es
  `ON DELETE SET NULL`, así que sin el guard se perdería la asociación histórica.
- **Stock bajo**: `countStockBajo()` (activos con `stock <= stock_minimo`) se consulta
  en `DashboardLayout` y se pasa al `Sidebar`; el badge se oculta si es 0.

## Rate limit y security headers

- **Rate limit por IP en DB** (`login_attempts(ip, ts)`), no in-memory: en serverless
  (Vercel) la memoria no sobrevive entre invocaciones ni entre instancias. Máx.
  5 intentos fallidos / 15 min; al acertar se limpia la IP; INSERT purga filas >1h.
- IP desde `x-forwarded-for` (primer hop) con fallback a `clientAddress`.
- **Security headers** en el middleware vía wrapper `conSeguridad()` (también en
  redirects): `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin` y `X-Robots-Tag: noindex, nofollow`.
  **Sin CSP**: rompería los scripts inline de Chart.js.
- **Panel fuera de buscadores**: `public/robots.txt` con `Disallow: /` + el header
  `X-Robots-Tag` en todas las respuestas (el header es la garantía real; el archivo
  solo evita el rastreo). `/robots.txt` está en `RUTAS_PUBLICAS` y tiene que existir.

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
- **Wordmark sobre fondo oscuro**: `tono="claro"` (paper + rose). Sobre espresso da
  10.9:1 y 5.8:1; la variante tinta daba 1.38:1 y Lighthouse la marcaba como
  inaccesible. El `tono` por defecto sigue siendo tinta para sidebar y login móvil.

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

## Avisos y notificaciones

- **Mensajes de error de formularios/listados**: componente `Alert.astro`
  (variantes `danger|success|warning|info`, icono lucide, `compact` para
  espacios chicos). Reemplaza los bloques `role="alert"` repetidos. El cuerpo
  usa el color de la variante (danger/sage/ochre; info en tinta).
- **Confirmaciones destructivas**: `ConfirmDialog.astro`, un único `<dialog>`
  nativo montado en `DashboardLayout`. Los botones llevan `data-confirm`
  (mensaje), `data-confirm-titulo`, `data-confirm-ok` y opcional
  `data-confirm-peligro="false"` (botón rosa en vez de rojo). El script
  delegado en `document` previene el submit, abre el modal y, al aceptar,
  hace `form.requestSubmit()`. Nunca más `confirm()` nativo.
- **Éxitos post-redirect (PRG)**: cookie flash `maquillaje_flash` (httpOnly,
  SameSite=Lax, 60 s) con `{tipo, texto}` en JSON; se escribe con
  `ponerFlash(Astro.cookies, …)` justo antes de `Astro.redirect` y
  `DashboardLayout` la lee con `leerFlash`, pinta un `Toast` flotante y la
  borra. Evita `?aviso=` en la URL (el de productos se migró a flash).
- **Toast**: aparece debajo del topbar (`top-14`), borde `wine/90` para
  combinar con `ConfirmDialog`. Tres capas decorativas puramente CSS:
  barrido de brillo interior una sola vez (0.9 s), luz que recorre el borde
  con `conic-gradient` + máscara de anillo en bucle de 3 s (`@supports`
  desactiva el efecto si no hay `mask-composite`), y barra de vida de 4.5 s
  que se pausa/reinicia con el hover en sincronía con el autocierre.
  `prefers-reduced-motion` desactiva las tres capas. El `ConfirmDialog`
  comparte el borde luminoso en bucle y el barrido al abrir (sin barra de
  vida: no se autocierra).
- Cualquier confirmación nueva: usar `data-confirm*`, no `onclick`.
- Cualquier error nuevo: usar `<Alert>`, no repetir clases a mano.

## Git

- **Ningún `.env` real se hace stage** (verificar con
  `git diff --cached --name-only | grep -E '^\.env'`; solo se permiten
  `.env.example` y `.env.demo.example`).
- `.vercel/` está en `.gitignore` (se regenera en cada deploy); no se commitea.
- Autor: `git -c user.name="nicode" -c user.email="nicode@users.noreply.github.com" commit …`.
- **Historial**: `.env.local` estuvo expuesto en el repo público. Se reescribió el
  historial con `git filter-branch --index-filter 'git rm --cached --ignore-unmatch
  .env.local' --prune-empty -- --all` y force-push. Como el secreto ya había sido
  público, además se **rotó** la contraseña del rol demo y el `SESSION_SECRET`
  demo (pendiente actualizar el proyecto demo de Vercel).
