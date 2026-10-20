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
- El logout exige `302|303` con `Location: /login`.
- Deja residuo: la venta E2E (anulada) permanece → correr el paso 4.

## 4. Limpieza de residuos E2E

```
export DATABASE_URL=$(grep "^DATABASE_URL=" .env | cut -d= -f2- | tr -d "\"\n")
unset DATABASE_URL_UNPOOLED          # el directo dio timeout; usar solo el pooler
node scripts/clean-e2e.mjs
```

- Usa fecha dinámica (`new Date()`); borra solo filas `E2E%`.
- Reporta los counts de las 5 tablas al final.

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
```

⚠️ El login de actions es `POST /login?_action=auth.login` (a `/login`, NO a `/` —
a `/` el middleware redirige sin setear cookie).

## 7. Commit

```
git status --short
git add src/ docs/ scripts/ AGENTS.md       # solo fuentes (nunca .env)
grep -E "^\.env$" <(git diff --cached --name-only) && echo PELIGRO   # verificar
git -c user.name="nicode" -c user.email="nicode@users.noreply.github.com" commit -q -m "…"
git add -A && git … commit -q -m "Actualiza artefactos de build Vercel"   # .vercel va trackeado
```

Convención: **dos commits** — fuente primero, artefactos `.vercel` aparte.

## Estado de la DB (2026-10-20, entrega)

**Vacía (0/0/0/0/0)** a propósito. No hay seed de fábrica: `scripts/db-seed.ts` existe
como utilidad de desarrollo pero **no se corre** sin confirmar (duplicaría datos si la
amiga ya cargó los suyos).
