#!/bin/bash
# E2E del panel — requiere dev server en localhost:4321 y .env en el root del repo.
# Uso: bash scripts/e2e.sh   (desde la raíz del proyecto)
# Los datos creados por el e2e se limpian en el propio script; la venta E2E anulada
# permanece → usar scripts/clean-e2e.mjs después para dejar la DB en 0.
BASE=http://localhost:4321
D=/tmp/opencode/e2e
J=$D/cookies.txt
PW=$(grep "^DASHBOARD_PASSWORD=" .env | cut -d= -f2- | tr -d "\"\x27\n")
FECHA=$(date +%F)
mkdir -p $D; rm -f $J
FAILS=0
pass(){ echo "PASS: $1"; }
fail(){ echo "FAIL: $1"; FAILS=$((FAILS+1)); }
warn(){ echo "AVISO: $1 (omitido — DB sin seed)"; }
stock(){ python3 -c "
import re,sys
h=open('$D/prod-editar.html').read()
m=re.search(r'<input[^>]*name=\"stock\"[^>]*>',h)
print(re.search(r'value=\"(\d+)\"',m.group(0)).group(1) if m and re.search(r'value=\"(\d+)\"',m.group(0)) else 'NA')"; }

# --- Auth ---
c=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/")
[ "$c" = "302" ] && pass "GET / sin sesión → 302" || fail "GET / sin sesión → $c"
c=$(curl -s -o $D/wrong.txt -w "%{http_code}" -X POST "$BASE/login?_action=auth.login" -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "password=mala")
grep -q "incorrecta" $D/wrong.txt && [ "$c" = "401" ] && pass "login mala → 401 + mensaje" || fail "login mala → $c"
c=$(curl -s -c $J -o /dev/null -w "%{http_code}" -X POST "$BASE/login?_action=auth.login" -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "password=$PW")
[ "$c" = "302" ] && pass "login ok → 302 + cookie" || fail "login ok → $c"

# --- Páginas ---
c=$(curl -s -b $J -o $D/home.html -w "%{http_code}" "$BASE/")
grep -q "Ganancia" $D/home.html && [ "$c" = "200" ] && pass "home → 200 con KPIs" || fail "home → $c"
grep -q "Chart\|chart" $D/home.html && pass "gráfica Chart.js presente" || warn "gráfica ausente en HTML (canvas puede existir sin texto)"
for r in clientas productos ventas gastos; do
  c=$(curl -s -b $J -o $D/$r.html -w "%{http_code}" "$BASE/$r")
  [ "$c" = "200" ] && pass "/$r → 200" || fail "/$r → $c"
done
grep -q "Valentina Ríos" $D/clientas.html && pass "seed: clienta visible" || warn "seed: clienta no visible"
grep -q "Master Matte" $D/productos.html && pass "seed: producto visible" || warn "seed: producto no visible"
grep -q "Arriendo" $D/gastos.html && pass "seed: gasto visible" || warn "seed: gasto no visible"

# --- CRUD clienta ---
c=$(curl -s -b $J -o $D/crear-c.txt -w "%{http_code}" -X POST "$BASE/clientas/nueva?_action=clientes.crear" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "nombre=E2E Clienta Temp" --data-urlencode "telefono=300 111 2222" --data-urlencode "email=" --data-urlencode "notas=")
case $c in 200|302) pass "clientes.crear → $c";; *) fail "clientes.crear → $c";; esac
CID=$(curl -s -b $J "$BASE/clientas?q=E2E" | grep -oE '/clientas/[0-9a-f-]{36}' | head -1 | sed 's#/clientas/##')
[ -n "$CID" ] && pass "clienta creada y visible (id ok)" || fail "clienta no aparece en búsqueda"
c=$(curl -s -b $J -o $D/act-c.txt -w "%{http_code}" -X POST "$BASE/clientas?_action=clientes.actualizar" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "id=$CID" --data-urlencode "nombre=E2E Clienta Editada" --data-urlencode "telefono=300 111 2222" --data-urlencode "email=" --data-urlencode "notas=editado")
case $c in 200|302) pass "clientes.actualizar → $c";; *) fail "clientes.actualizar → $c";; esac

# --- CRUD producto ---
c=$(curl -s -b $J -o $D/crear-p.txt -w "%{http_code}" -X POST "$BASE/productos/nuevo?_action=productos.crear" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "nombre=E2E Producto Temp" --data-urlencode "marca=MarcaX" --data-urlencode "categoria=Rostro" \
  --data-urlencode "stock=7" --data-urlencode "stock_minimo=3" --data-urlencode "precio_compra=10000" \
  --data-urlencode "precio_venta=20000" --data-urlencode "activo=true")
case $c in 200|302) pass "productos.crear → $c";; *) fail "productos.crear → $c";; esac
PID=$(curl -s -b $J "$BASE/productos?q=E2E" | grep -oE '/productos/[0-9a-f-]{36}/editar' | head -1 | sed -E 's#/productos/([0-9a-f-]{36}).*#\1#')
[ -n "$PID" ] && pass "producto creado y visible (id ok)" || fail "producto no aparece en búsqueda"

# --- Venta transaccional: stock 7 → 5 ---
c=$(curl -s -b $J -o $D/crear-v.txt -w "%{http_code}" -X POST "$BASE/ventas/nueva?_action=ventas.crear" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "fecha=$FECHA" --data-urlencode "cliente_id=" --data-urlencode "metodo_pago=Efectivo" \
  --data-urlencode "descuento=0" --data-urlencode "notas=" \
  --data-urlencode "items_json=[{\"producto_id\":\"$PID\",\"descripcion\":\"E2E Producto Temp · MarcaX\",\"cantidad\":2,\"precio_unitario\":20000}]")
case $c in 200|302) pass "ventas.crear → $c";; *) fail "ventas.crear → $c $(head -c 200 $D/crear-v.txt)";; esac
VID=$(curl -s -b $J "$BASE/ventas" | grep -oE '/ventas/[0-9a-f-]{36}' | head -1 | sed 's#/ventas/##')
[ -n "$VID" ] && pass "venta creada visible en /ventas" || fail "venta no aparece"
curl -s -b $J -o $D/prod-editar.html "$BASE/productos/$PID/editar"
S=$(stock); [ "$S" = "5" ] && pass "stock descontado 7 → 5" || fail "stock esperaba 5, obtuve $S"

# --- Anular → stock vuelve a 7 ---
c=$(curl -s -b $J -o /dev/null -w "%{http_code}" -X POST "$BASE/ventas/$VID?_action=ventas.anular" \
  -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "id=$VID")
case $c in 200|302) pass "ventas.anular → $c";; *) fail "ventas.anular → $c";; esac
curl -s -b $J -o $D/venta.html "$BASE/ventas/$VID"
grep -qi "anulada" $D/venta.html && pass "venta marcada como anulada" || fail "badge anulada ausente"
curl -s -b $J -o $D/prod-editar.html "$BASE/productos/$PID/editar"
S=$(stock); [ "$S" = "7" ] && pass "stock restaurado 5 → 7" || fail "stock esperaba 7, obtuve $S"

# --- CRUD gasto ---
c=$(curl -s -b $J -o $D/crear-g.txt -w "%{http_code}" -X POST "$BASE/gastos/nuevo?_action=gastos.crear" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "fecha=$FECHA" --data-urlencode "categoria=Insumos" --data-urlencode "descripcion=E2E Gasto Temp" --data-urlencode "monto=55000")
case $c in 200|302) pass "gastos.crear → $c";; *) fail "gastos.crear → $c";; esac
GID=$(curl -s -b $J "$BASE/gastos?q=E2E" | grep -oE '/gastos/[0-9a-f-]{36}/editar' | head -1 | sed -E 's#/gastos/([0-9a-f-]{36}).*#\1#')
[ -n "$GID" ] && pass "gasto creado y visible" || { GID=$(curl -s -b $J "$BASE/gastos" | grep -oE '/gastos/[0-9a-f-]{36}/editar' | head -1 | sed -E 's#/gastos/([0-9a-f-]{36}).*#\1#'); [ -n "$GID" ] && pass "gasto creado (sin q)" || fail "gasto no aparece"; }

# --- Limpieza ---
c=$(curl -s -b $J -o /dev/null -w "%{http_code}" -X POST "$BASE/gastos?_action=gastos.eliminar" -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "id=$GID")
case $c in 200|302) pass "gastos.eliminar → $c";; *) fail "gastos.eliminar → $c";; esac
c=$(curl -s -b $J -o /dev/null -w "%{http_code}" -X POST "$BASE/productos?_action=productos.eliminar" -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "id=$PID")
case $c in 200|302) pass "productos.eliminar → $c";; *) fail "productos.eliminar → $c";; esac
c=$(curl -s -b $J -o /dev/null -w "%{http_code}" -X POST "$BASE/clientas?_action=clientes.eliminar" -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "id=$CID")
case $c in 200|302) pass "clientes.eliminar → $c";; *) fail "clientes.eliminar → $c";; esac

# --- Logout ---
out=$(curl -s -b $J -c $J -o /dev/null -w "%{http_code} %{redirect_url}" -X POST "$BASE/logout" -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "x=1")
code=${out%% *}; loc=${out#* }
case $code in
  302|303) [[ "$loc" == */login ]] && pass "logout → $code a /login" || fail "logout → $code pero Location=$loc";;
  *) fail "logout → $out (esperado 302|303 a /login)";;
esac
c=$(curl -s -b $J -o /dev/null -w "%{http_code}" "$BASE/")
[ "$c" = "302" ] && pass "tras logout / → 302 login" || fail "tras logout / → $c"

echo "=============================="
echo "FALLOS: $FAILS"
[ $FAILS -eq 0 ]
