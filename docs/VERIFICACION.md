# Verificación — workflow exacto

Secuencia que se usa al terminar cualquier tarea de código/UI.

## 1. Servidor dev

```
npx astro dev --background     # arrancar
npx astro dev status           # estado
npx astro dev logs             # logs (incluye console.log del render)
npx astro dev stop
```

El dev corre en `http://localhost:4321` y hace hot-reload de `src/`.

## 2. Chequeo estándar (siempre al terminar)

```
npm run astro check            # 0 errores / 0 warnings esperados
npm run build                  # "Build Complete!"
```

## 3. E2E (requiere dev server; se corre desde el root del repo)

```
bash scripts/e2e.sh
```

- Lee `DASHBOARD_PASSWORD` de `.env` del cwd (no hardcodear).
- **Funciona con DB vacía**: los 3 checks de seed (`Valentina Ríos`, `Master Matte`,
  `Arriendo`) y el de la gráfica emiten **AVISO**, no FAIL, si no hay datos.
- El check de KPIs compara **por diferencia** (línea base antes del abono → después),
  así que no falla aunque la base ya tenga datos reales.
- Errores de negocio esperados: abono mayor al saldo → **409**, anular venta con
  abonos → **409**, clienta con saldo → **409**, fecha imposible (`2026-02-31`) → **400**
  (nunca 500). Si aparece un 500, revisar `astro dev logs`.
- Si un cambio en `src/lib/` no se refleja, reiniciar el dev server (`astro dev stop` +
  `astro dev --background`): el hot-reload puede dejar módulos cacheados.
- El logout exige `302|303` con `Location: /login`.
- Deja residuo: la venta E2E (anulada) permanece → correr el paso 4.

## 4. Limpieza de residuos E2E

```
npm run db:clean-e2e
```

- Borra **solo** lo que crea el e2e: ventas ligadas al producto `E2E Producto Temp`
  (items y abonos caen en CASCADE), ese producto, clientas `E2E%` y gastos `E2E%`.
- **No toca datos reales**: las ventas se localizan por el producto E2E, no por
  monto o fecha (una venta real de $40.000 en efectivo no se borra).
- Reporta los counts de las 6 tablas al final.

Para vaciar la base por completo (destructivo, deja la BD como en la entrega):

```
npm run db:reset
```

## 4.1 Respaldo y exportaciones

Con el dev server arriba y sesión iniciada:

```
npm run db:backup                    # crea backups/respaldo-*.json (gitignored)
npm run db:restore -- backups/…json --reemplazar   # solo con autorización: es destructivo
```

- `/respaldo` debe mostrar las dos tarjetas y descargar el JSON.
- `/exportar/ventas`, `gastos`, `abonos`, `clientas`, `productos` deben responder
  `200 text/csv; charset=utf-8`; una tabla inventada debe dar 404.
- Verificar que el CSV abra bien en Excel (BOM + `;`) y que los filtros de la lista
  se conserven en el enlace de exportación.

## 5. Detector de diseño (impeccable)

```
# fuentes (estático):
/home/nicode/.config/opencode/skills/impeccable/scripts/impeccable detect --json src public

# login en viewport móvil (requiere dev server):
/home/nicode/.config/opencode/skills/impeccable/scripts/impeccable detect --viewport 390x844 http://localhost:4321/login
```

- Hallazgo **conocido/justificado** en el login: `clipped-overflow-container` del panel
  espresso — decoración pura que desborda a propósito (quitar `overflow-hidden` rompería
  el layout). No "arreglar".
- Regla de raíz aprendida: `buried-raster` se resuelve subiendo opacidad visible
  (>~0.15) o **quitando** el raster invisible, no escondiendo el hallazgo.

## 6. Smoke con curl (HTML servido)

```
PW=$(grep "^DASHBOARD_PASSWORD=" .env | cut -d= -f2- | tr -d "\"\x27\n")
curl -s -c /tmp/c.txt -o /dev/null -w "%{http_code}\n" -X POST "http://localhost:4321/login?_action=auth.login" \
  -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "password=$PW"   # 302
curl -s -b /tmp/c.txt http://localhost:4321/ -o /tmp/home.html                            # 200
for u in /ventas /gastos /clientas /respaldo /respaldo.json /exportar/ventas \
         /exportar/gastos /exportar/abonos /exportar/clientas /exportar/productos; do
  curl -s -b /tmp/c.txt -o /dev/null -w "$u %{http_code} %{content_type}\n" "http://localhost:4321$u"
done
```

- `?pagina=999` en ventas/gastos debe seguir devolviendo 200 (clampea a la última).
- `/ventas/recibo/<uuid inexistente>` debe dar 404; con una venta real debe renderizar
  el comprobante y `window.print()` debe abrir el diálogo.
- `/robots.txt` debe dar 200 con `Disallow: /`, y cualquier respuesta debe llevar
  `X-Robots-Tag: noindex, nofollow`.
- Eliminar una clienta con saldo debe devolver **409** con el mensaje "saldo pendiente";
  una clienta sin deuda sí se elimina. El e2e cubre ambos casos.

⚠️ El login de actions es `POST /login?_action=auth.login` (a `/login`, NO a `/` —
a `/` el middleware redirige sin setear cookie).

## 7. Avisos (Alert / Toast / ConfirmDialog)

- `Alert`: los errores de actions deben renderizar `<Alert variant="danger">`; los
  formularios muestran el campo en rojo y el aviso general arriba del form.
- `ConfirmDialog`: click en cualquier `[data-confirm]` (Eliminar/Anular/Reactivar) debe
  abrir el `<dialog>` con el título y mensaje correctos; Cancelar/Esc no envía el form;
  Confirmar hace el submit real.
- `Toast`: tras crear/editar/eliminar un redirect debe mostrar el aviso flotante
  (`[data-toast]`), autocerarse a los ~4.5 s y desaparecer con la X. Probar en móvil
  (390x844) y escritorio.

## 8. Commit

```
git status --short
git add src/ docs/ scripts/ public/ package.json .gitignore   # solo fuentes (nunca .env ni backups/)
grep -E "^\.env$" <(git diff --cached --name-only) && echo PELIGRO   # verificar
git -c user.name="nicode" -c user.email="nicode@users.noreply.github.com" commit -q -m "…"
```

`.vercel/` y `backups/` están ignorados: Vercel se regenera en cada deploy y los
respaldos son datos privados. No stagear `Toast.astro`/`ConfirmDialog.astro` si sus
cambios vienen de una tarea ajena.

## Estado de la DB (2026-10-22)

**Vacía (0/0/0/0/0/0)** a propósito. No hay seed de fábrica: `scripts/db-seed.ts` existe
como utilidad de desarrollo pero **no se corre** sin confirmar (duplicaría datos si la
amiga ya cargó los suyos).
