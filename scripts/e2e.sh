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
grep -q "Sesión iniciada" $D/home.html && pass "login → aviso de sesión iniciada" || fail "login → sin aviso de sesión iniciada"
grep -q "Chart\|chart" $D/home.html && pass "gráfica Chart.js presente" || warn "gráfica ausente en HTML (canvas puede existir sin texto)"
for r in clientas productos ventas gastos; do
  c=$(curl -s -b $J -o $D/$r.html -w "%{http_code}" "$BASE/$r")
  [ "$c" = "200" ] && pass "/$r → 200" || fail "/$r → $c"
done
c=$(curl -s -b $J -o $D/ayuda.html -w "%{http_code}" "$BASE/ayuda")
if [ "$c" = "200" ] && grep -q "Registrar una venta" $D/ayuda.html; then pass "/ayuda → 200 con guía"; else fail "/ayuda → $c"; fi
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

# --- Reactivar → stock vuelve a 5 y sale de "anulada" ---
c=$(curl -s -b $J -o /dev/null -w "%{http_code}" -X POST "$BASE/ventas/$VID?_action=ventas.reactivar" \
  -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "id=$VID")
case $c in 200|302) pass "ventas.reactivar → $c";; *) fail "ventas.reactivar → $c";; esac
curl -s -b $J -o $D/venta.html "$BASE/ventas/$VID"
grep -qi "anulada" $D/venta.html && fail "venta sigue anulada tras reactivar" || pass "venta ya no está anulada"
curl -s -b $J -o $D/prod-editar.html "$BASE/productos/$PID/editar"
S=$(stock); [ "$S" = "5" ] && pass "stock re-descontado 7 → 5" || fail "stock esperaba 5, obtuve $S"

# --- Reactivar sobre venta no anulada → bloqueado ---
c=$(curl -s -b $J -o $D/reactivar-again.txt -w "%{http_code}" -X POST "$BASE/ventas/$VID?_action=ventas.reactivar" \
  -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "id=$VID")
grep -qi "no está anulada" $D/reactivar-again.txt && pass "reactivar venta activa → bloqueado" || fail "reactivar venta activa no bloqueado ($c)"

# --- Dejar $VID anulada de nuevo (el resto del e2e asume esa venta sin contar) ---
curl -s -b $J -o /dev/null -w "%{http_code}" -X POST "$BASE/ventas/$VID?_action=ventas.anular" \
  -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "id=$VID" > /dev/null

# --- Venta a crédito + abonos (fingerprint limpio: fecha/40000/Efectivo) ---
c=$(curl -s -b $J -o $D/crear-vc.txt -w "%{http_code}" -X POST "$BASE/ventas/nueva?_action=ventas.crear" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "fecha=$FECHA" --data-urlencode "cliente_id=$CID" --data-urlencode "metodo_pago=Efectivo" \
  --data-urlencode "descuento=0" --data-urlencode "notas=" --data-urlencode "credito=on" \
  --data-urlencode "items_json=[{\"producto_id\":\"$PID\",\"descripcion\":\"E2E Producto Temp · MarcaX\",\"cantidad\":2,\"precio_unitario\":20000}]")
case $c in 200|302) pass "ventas.crear crédito → $c";; *) fail "ventas.crear crédito → $c $(head -c 200 $D/crear-vc.txt)";; esac
VID2=$(curl -s -b $J "$BASE/ventas?q=E2E" | grep -oE '/ventas/[0-9a-f-]{36}' | head -1 | sed 's#/ventas/##')
[ -n "$VID2" ] && pass "venta a crédito visible (por clienta)" || fail "venta a crédito no aparece"
curl -s -b $J -o $D/venta-credito.html "$BASE/ventas/$VID2"
if grep -q "A crédito" $D/venta-credito.html && grep -q "Debe" $D/venta-credito.html; then
  pass "detalle: badges A crédito + Debe"
else
  fail "detalle sin badges de crédito"
fi
# Línea base de KPIs antes del abono (para comparar por diferencia: así el
# check no depende de que la BD esté vacía).
curl -s -b $J -o $D/home-antes-abono.html "$BASE/"
c=$(curl -s -b $J -o $D/abono.txt -w "%{http_code}" -X POST "$BASE/ventas/$VID2?_action=ventas.registrarAbono" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "venta_id=$VID2" --data-urlencode "fecha=$FECHA" --data-urlencode "monto=15000" --data-urlencode "notas=pago parcial e2e")
case $c in 200|302) pass "registrarAbono 15000 → $c";; *) fail "registrarAbono → $c $(head -c 200 $D/abono.txt)";; esac
curl -s -b $J -o $D/venta-credito.html "$BASE/ventas/$VID2"
grep -q "25.000" $D/venta-credito.html && pass "saldo tras abono = 25.000" || fail "saldo 25.000 no visible"
grep -q "Abonado" $D/venta-credito.html && pass "desglose Abonado presente en detalle" || fail "fila Abonado ausente"
curl -s -b $J -o $D/home-ingresos.html "$BASE/"
python3 -c "
import re
def kpis(ruta):
    h=open(ruta).read()
    out={}
    for m in re.finditer(r'uppercase\"[^>]*>([^<]+)</p>\s*<p class=\"display-number[^\"]*\"[^>]*>([^<]+)<', h):
        out[m.group(1)]=m.group(2).replace(chr(160),' ')
    return out
def num(v):
    return int(re.sub(r'[^0-9]','', v))
a=kpis('$D/home-antes-abono.html'); d=kpis('$D/home-ingresos.html')
# el abono suma 15.000 a ingresos (la fiada no suma hasta cobrarse) y
# descuenta 15.000 de lo que queda por cobrar
ok_ing = num(d['Ingresos']) - num(a['Ingresos']) == 15000
ok_cob = num(d['Por cobrar']) - num(a['Por cobrar']) == -15000
print('   ingresos %s -> %s | por cobrar %s -> %s' % (a.get('Ingresos'), d.get('Ingresos'), a.get('Por cobrar'), d.get('Por cobrar')), file=__import__('sys').stderr)
raise SystemExit(0 if ok_ing and ok_cob else 1)" \
  && pass "ingresos +15.000 (solo abono) y por cobrar +25.000" || fail "KPIs de ingresos/por cobrar no reflejan el cobro del abono"
c=$(curl -s -b $J -o /dev/null -w "%{http_code}" -X POST "$BASE/ventas/$VID2?_action=ventas.registrarAbono" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "venta_id=$VID2" --data-urlencode "fecha=$FECHA" --data-urlencode "monto=999999" --data-urlencode "notas=")
[ "$c" = "409" ] && pass "abono mayor al saldo → 409" || fail "abono excesivo → $c (esperado 409)"
c=$(curl -s -b $J -o $D/anular-credito.txt -w "%{http_code}" -X POST "$BASE/ventas/$VID2?_action=ventas.anular" \
  -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "id=$VID2")
grep -qi "abonos" $D/anular-credito.txt && pass "anular con abonos → bloqueada" || fail "anular con abonos no bloqueada ($c)"
c=$(curl -s -b $J -o $D/eliminar-credito.txt -w "%{http_code}" -X POST "$BASE/ventas/$VID2?_action=ventas.eliminar" \
  -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "id=$VID2")
grep -qi "abonos" $D/eliminar-credito.txt && pass "eliminar con abonos → bloqueada" || fail "eliminar con abonos no bloqueada ($c)"

# --- Eliminar venta (borrado físico) → stock restaurado y 404 ---
c=$(curl -s -b $J -o $D/crear-vd.txt -w "%{http_code}" -X POST "$BASE/ventas/nueva?_action=ventas.crear" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "fecha=$FECHA" --data-urlencode "cliente_id=" --data-urlencode "metodo_pago=Efectivo" \
  --data-urlencode "descuento=0" --data-urlencode "notas=" \
  --data-urlencode "items_json=[{\"producto_id\":\"$PID\",\"descripcion\":\"E2E Producto Temp · MarcaX\",\"cantidad\":1,\"precio_unitario\":20000}]")
case $c in 200|302) pass "ventas.crear (para eliminar) → $c";; *) fail "ventas.crear (para eliminar) → $c";; esac
VID3=$(curl -s -b $J "$BASE/ventas" | grep -oE '/ventas/[0-9a-f-]{36}' | head -1 | sed 's#/ventas/##')
curl -s -b $J -o $D/prod-editar.html "$BASE/productos/$PID/editar"
S=$(stock); [ "$S" = "4" ] && pass "stock descontado 5 → 4" || fail "stock esperaba 4, obtuve $S"
c=$(curl -s -b $J -o /dev/null -w "%{http_code}" -X POST "$BASE/ventas/$VID3?_action=ventas.eliminar" \
  -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "id=$VID3")
case $c in 200|302) pass "ventas.eliminar → $c";; *) fail "ventas.eliminar → $c";; esac
curl -s -b $J -o $D/prod-editar.html "$BASE/productos/$PID/editar"
S=$(stock); [ "$S" = "5" ] && pass "stock restaurado 4 → 5" || fail "stock esperaba 5, obtuve $S"
c=$(curl -s -b $J -o /dev/null -w "%{http_code}" "$BASE/ventas/$VID3")
[ "$c" = "404" ] && pass "venta eliminada → detalle 404" || fail "detalle de venta eliminada → $c (esperado 404)"

# --- CRUD gasto ---
c=$(curl -s -b $J -o $D/crear-g.txt -w "%{http_code}" -X POST "$BASE/gastos/nuevo?_action=gastos.crear" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "fecha=$FECHA" --data-urlencode "categoria=Insumos" --data-urlencode "descripcion=E2E Gasto Temp" --data-urlencode "monto=55000")
case $c in 200|302) pass "gastos.crear → $c";; *) fail "gastos.crear → $c";; esac
# Fecha imposible: el formato es correcto pero el día no existe → 400, no 500.
c=$(curl -s -b $J -o $D/gasto-fecha.txt -w "%{http_code}" -X POST "$BASE/gastos/nuevo?_action=gastos.crear" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "fecha=2026-02-31" --data-urlencode "categoria=Insumos" --data-urlencode "descripcion=E2E Fecha Imposible" --data-urlencode "monto=1000")
[ "$c" = "400" ] && pass "gasto con fecha imposible → 400" || fail "fecha imposible → $c (esperado 400)"
GID=$(curl -s -b $J "$BASE/gastos?q=E2E" | grep -oE '/gastos/[0-9a-f-]{36}/editar' | head -1 | sed -E 's#/gastos/([0-9a-f-]{36}).*#\1#')
[ -n "$GID" ] && pass "gasto creado y visible" || { GID=$(curl -s -b $J "$BASE/gastos" | grep -oE '/gastos/[0-9a-f-]{36}/editar' | head -1 | sed -E 's#/gastos/([0-9a-f-]{36}).*#\1#'); [ -n "$GID" ] && pass "gasto creado (sin q)" || fail "gasto no aparece"; }

# --- Limpieza ---
c=$(curl -s -b $J -o /dev/null -w "%{http_code}" -X POST "$BASE/gastos?_action=gastos.eliminar" -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "id=$GID")
case $c in 200|302) pass "gastos.eliminar → $c";; *) fail "gastos.eliminar → $c";; esac
c=$(curl -s -b $J -o /dev/null -w "%{http_code}" -X POST "$BASE/productos?_action=productos.eliminar" -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "id=$PID")
case $c in 200|302) pass "productos.eliminar → $c";; *) fail "productos.eliminar → $c";; esac
# --- Guarda: clienta con saldo pendiente no se elimina ---
c=$(curl -s -b $J -o $D/eliminar-c.txt -w "%{http_code}" -X POST "$BASE/clientas?_action=clientes.eliminar" -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "id=$CID")
if grep -qi "saldo pendiente" $D/eliminar-c.txt; then
  case $c in 4??|5??) pass "clientes.eliminar con saldo → bloqueado ($c)";; *) fail "clientes.eliminar con saldo → $c sin bloqueo";; esac
else
  fail "clientes.eliminar con saldo no mostró el motivo ($c)"
fi

# --- Clienta sin deuda sí se elimina ---
curl -s -b $J -o /dev/null -w "%{http_code}" -X POST "$BASE/clientas/nueva?_action=clientes.crear" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "nombre=E2E Clienta Borrar" --data-urlencode "telefono=" --data-urlencode "email=" --data-urlencode "notas=" > /dev/null
CID2=$(curl -s -b $J "$BASE/clientas?q=E2E" | grep -oE '/clientas/[0-9a-f-]{36}' | sed 's#/clientas/##' | sort -u | grep -v "^$CID$" | head -1)
if [ -n "$CID2" ]; then
  c=$(curl -s -b $J -o /dev/null -w "%{http_code}" -X POST "$BASE/clientas?_action=clientes.eliminar" -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "id=$CID2")
  case $c in 200|302) pass "clientes.eliminar sin deuda → $c";; *) fail "clientes.eliminar sin deuda → $c";; esac
else
  fail "no se encontró la clienta sin deuda para borrar"
fi

# --- Logout ---
out=$(curl -s -b $J -c $J -o /dev/null -w "%{http_code} %{redirect_url}" -X POST "$BASE/logout" -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "x=1")
code=${out%% *}; loc=${out#* }
case $code in
  302|303) [[ "$loc" == */login ]] && pass "logout → $code a /login" || fail "logout → $code pero Location=$loc";;
  *) fail "logout → $out (esperado 302|303 a /login)";;
esac
c=$(curl -s -b $J -o /dev/null -w "%{http_code}" "$BASE/")
[ "$c" = "302" ] && pass "tras logout / → 302 login" || fail "tras logout / → $c"

# --- Rate limit de login (IP falsa única por corrida) ---
FAKEIP="203.0.113.$((RANDOM % 250 + 1))"
for i in 1 2 3 4 5; do
  c=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/login?_action=auth.login" \
    -H "X-Forwarded-For: $FAKEIP" -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "password=mala")
done
[ "$c" = "401" ] && pass "5 intentos fallidos (IP falsa) → 401" || fail "5º intento fallido → $c (esperado 401)"
c=$(curl -s -o $D/ratelimit.txt -w "%{http_code}" -X POST "$BASE/login?_action=auth.login" \
  -H "X-Forwarded-For: $FAKEIP" -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "password=mala")
grep -qi "Demasiados" $D/ratelimit.txt && [ "$c" = "429" ] && pass "6º intento → 429 rate limit" || fail "6º intento → $c (esperado 429)"

echo "=============================="
echo "FALLOS: $FAILS"
[ $FAILS -eq 0 ]
