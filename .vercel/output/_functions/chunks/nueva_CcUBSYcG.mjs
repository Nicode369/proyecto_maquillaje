import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, D as renderSlot, N as addAttribute, P as defineScriptVars, j as maybeRenderHead, w as renderComponent, x as spreadAttributes } from "./sequence_CIT0iznN.mjs";
import { T as isInputError } from "./server_B8ZlCX6a.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
import { n as $$DashboardLayout, s as hoyISO, t as $$PageHeader } from "./PageHeader_BK87cCvx.mjs";
import { t as actions } from "./_astro_actions_DfrBmID5.mjs";
import { o as listClientes } from "./clientes_BmetyF5T.mjs";
import { s as listProductosParaVenta } from "./productos_DJAPQyIZ.mjs";
import { t as $$Button } from "./Button_C8T8wdfZ.mjs";
import { t as $$Input } from "./Input_BqhAvSAl.mjs";
import { t as $$Textarea } from "./Textarea_Dk0Vx8FR.mjs";
//#region src/components/ui/Select.astro
createAstro("https://astro.build");
var $$Select = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Select;
	const { name, label, error, required = false, placeholder, class: className = "", ...rest } = Astro.props;
	const selectId = name;
	const describedBy = error ? `${name}-error` : void 0;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["space-y-1.5", className], "class:list")}>${label && renderTemplate`<label${addAttribute(selectId, "for")} class="block text-[13px] font-medium text-ink">${label}</label>`}<select${addAttribute(selectId, "id")}${addAttribute(name, "name")}${addAttribute(required, "required")}${addAttribute(error ? "true" : void 0, "aria-invalid")}${addAttribute(describedBy, "aria-describedby")}${addAttribute([
		"h-9.5 w-full rounded-lg border bg-surface px-3 text-sm text-ink",
		"transition-colors focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/15",
		error ? "border-danger" : "border-ink/15"
	], "class:list")}${spreadAttributes(rest)}>${placeholder && renderTemplate`<option value="">${placeholder}</option>`}${renderSlot($$result, $$slots["default"])}</select>${error && renderTemplate`<p${addAttribute(describedBy, "id")} class="text-[13px] text-danger">${error}</p>`}</div>`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/components/ui/Select.astro", void 0);
//#endregion
//#region src/pages/ventas/nueva.astro
var nueva_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Nueva,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Nueva = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Nueva;
	const resultado = Astro.getActionResult(actions.ventas.crear);
	if (resultado && !resultado.error) return Astro.redirect(`/ventas/${resultado.data.id}`);
	const [clientas, productos] = await Promise.all([listClientes(), listProductosParaVenta()]);
	const err = resultado?.error;
	const campos = isInputError(err) ? err.fields : {};
	const errorGenerico = err && !isInputError(err) ? err.message : null;
	const catalogo = productos.map((p) => ({
		id: p.id,
		nombre: p.nombre,
		marca: p.marca,
		stock: p.stock,
		precio: Number(p.precio_venta),
		etiqueta: `${p.nombre}${p.marca ? ` · ${p.marca}` : ""}`
	}));
	const metodos = [
		"Efectivo",
		"Nequi",
		"Daviplata",
		"Bancolombia",
		"Transferencia",
		"Tarjeta"
	];
	return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, {
		"title": "Nueva venta",
		"active": "ventas"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHeader", $$PageHeader, {
		"title": "Nueva venta",
		"description": "Registra los productos, el método de pago y el total"
	})}${maybeRenderHead($$result)}<form method="POST"${addAttribute(actions.ventas.crear, "action")} class="mt-6 max-w-3xl space-y-6" id="form-venta">${errorGenerico && renderTemplate`<div class="rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">${errorGenerico}</div>`}<div class="grid gap-4 sm:grid-cols-3">${renderComponent($$result, "Input", $$Input, {
		"name": "fecha",
		"label": "Fecha",
		"type": "date",
		"required": true,
		"value": hoyISO(),
		"error": campos.fecha?.[0]
	})}${renderComponent($$result, "Select", $$Select, {
		"name": "cliente_id",
		"label": "Clienta (opcional)",
		"placeholder": "Sin clienta",
		"error": campos.cliente_id?.[0]
	}, { "default": ($$result) => renderTemplate`${clientas.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}>${c.nombre}</option>`)}` })}${renderComponent($$result, "Select", $$Select, {
		"name": "metodo_pago",
		"label": "Método de pago",
		"required": true,
		"error": campos.metodo_pago?.[0]
	}, { "default": ($$result) => renderTemplate`${metodos.map((m) => renderTemplate`<option${addAttribute(m, "value")}>${m}</option>`)}` })}</div><label class="flex items-start gap-3 rounded-xl border border-hairline bg-surface px-4 py-3"><input type="checkbox" name="credito" class="mt-0.5 h-4 w-4 shrink-0 accent-wine"><span class="text-sm text-ink">Venta a crédito (fiada)<span class="block text-[13px] text-ink-muted">El saldo queda pendiente en la clienta; registra los abonos desde el detalle de la venta. Requiere elegir clienta.</span></span></label><div><div class="flex items-center justify-between border-b border-hairline pb-2"><h2 class="font-display text-lg text-ink" style="font-variation-settings: 'opsz' 40;">Productos y servicios</h2><div class="flex gap-2">${renderComponent($$result, "Button", $$Button, {
		"variant": "outline",
		"size": "sm",
		"type": "button",
		"id": "btn-servicio"
	}, { "default": ($$result) => renderTemplate`
            + Servicio
          ` })}${renderComponent($$result, "Button", $$Button, {
		"variant": "outline",
		"size": "sm",
		"type": "button",
		"id": "btn-linea"
	}, { "default": ($$result) => renderTemplate`
            + Producto
          ` })}</div></div><div id="lineas" class="mt-4 space-y-4"></div><p id="error-items" class="mt-3 hidden rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">Agrega al menos un producto o servicio.</p></div><input type="hidden" name="items_json" id="items_json" value="[]"><div class="grid gap-4 sm:grid-cols-2">${renderComponent($$result, "Input", $$Input, {
		"name": "descuento",
		"label": "Descuento (COP)",
		"type": "number",
		"min": "0",
		"step": "100",
		"value": "0",
		"required": true,
		"error": campos.descuento?.[0]
	})}${renderComponent($$result, "Textarea", $$Textarea, {
		"name": "notas",
		"label": "Notas",
		"placeholder": "Observaciones de la venta…",
		"rows": 2,
		"error": campos.notas?.[0]
	})}</div><div class="flex items-center justify-between rounded-xl border border-hairline bg-surface px-5 py-4"><span class="text-sm text-ink-muted">Total</span><span class="display-number text-2xl text-wine" id="total-display" style="font-variation-settings: 'opsz' 90;">$ 0</span></div><div class="flex gap-2 border-t border-hairline pt-4">${renderComponent($$result, "Button", $$Button, {
		"type": "submit",
		"id": "btn-guardar"
	}, { "default": ($$result) => renderTemplate`Guardar venta` })}${renderComponent($$result, "Button", $$Button, {
		"variant": "outline",
		"href": "/ventas"
	}, { "default": ($$result) => renderTemplate`Cancelar` })}</div></form>` })}<script>(function(){${defineScriptVars({ catalogo })}
  const contenedor = document.getElementById('lineas');
  const inputItems = document.getElementById('items_json');
  const inputDescuento = document.querySelector('input[name="descuento"]');
  const totalDisplay = document.getElementById('total-display');
  const errorItems = document.getElementById('error-items');
  const form = document.getElementById('form-venta');

  let contador = 0;

  const fmt = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });

  function crearLinea(productoId = '', descripcion = '', cantidad = 1, precio = '') {
    contador++;
    const idx = contador;
    const div = document.createElement('div');
    div.className =
      'linea rounded-xl border border-hairline bg-surface p-4 space-y-3';
    div.dataset.idx = String(idx);

    const opciones = catalogo
      .map(
        (p) =>
          \`<option value="\${p.id}" data-precio="\${p.precio}" data-stock="\${p.stock}" data-etiqueta="\${p.etiqueta}" \${p.id === productoId ? 'selected' : ''}>\${p.etiqueta} — \${fmt.format(p.precio)} (\${p.stock} und.)</option>\`,
      )
      .join('');

    div.innerHTML = \`
      <div class="grid gap-3 sm:grid-cols-12 items-start">
        <div class="sm:col-span-5 space-y-1.5">
          <label class="block text-[13px] font-medium text-ink">Producto</label>
          <select class="sel-producto h-9.5 w-full rounded-lg border border-ink/15 bg-surface px-3 text-sm text-ink focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/15">
            <option value="" data-precio="" data-stock="" data-etiqueta="">— Servicio personalizado —</option>
            \${opciones}
          </select>
        </div>
        <div class="sm:col-span-4 space-y-1.5">
          <label class="block text-[13px] font-medium text-ink">Descripción</label>
          <input type="text" class="inp-desc h-9.5 w-full rounded-lg border border-ink/15 bg-surface px-3 text-sm text-ink focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/15" placeholder="Ej: Aplicación de cejas" maxlength="200" value="\${descripcion}" />
        </div>
        <div class="sm:col-span-1 space-y-1.5">
          <label class="block text-[13px] font-medium text-ink">Cant.</label>
          <input type="number" class="inp-cant h-9.5 w-full rounded-lg border border-ink/15 bg-surface px-2 text-sm text-ink text-right focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/15" min="1" step="1" value="\${cantidad}" />
        </div>
        <div class="sm:col-span-2 space-y-1.5 relative">
          <label class="block text-[13px] font-medium text-ink">Precio</label>
          <input type="number" class="inp-precio h-9.5 w-full rounded-lg border border-ink/15 bg-surface px-2 pr-7 text-sm text-ink text-right focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/15" min="0" step="100" value="\${precio}" />
          <span class="pointer-events-none absolute right-2 bottom-2.5 text-xs text-ink-muted">$</span>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <p class="stock-aviso text-[13px] hidden text-ochre"></p>
        <div class="flex items-center gap-3 ml-auto">
          <span class="subtotal text-sm text-ink-muted num"></span>
          <button type="button" class="btn-quitar text-[13px] text-danger hover:underline">Quitar</button>
        </div>
      </div>
    \`;

    const sel = div.querySelector('.sel-producto');
    const inpDesc = div.querySelector('.inp-desc');
    const inpCant = div.querySelector('.inp-cant');
    const inpPrecio = div.querySelector('.inp-precio');
    const aviso = div.querySelector('.stock-aviso');
    const subtotalEl = div.querySelector('.subtotal');

    function actualizarStockAviso() {
      const opt = sel.selectedOptions[0];
      const stock = Number(opt?.dataset.stock ?? NaN);
      const cant = Number(inpCant.value || 0);
      if (Number.isFinite(stock) && cant > stock) {
        aviso.textContent = \`Solo hay \${stock} en stock\`;
        aviso.classList.remove('hidden');
      } else {
        aviso.classList.add('hidden');
      }
    }

    function actualizarSubtotal() {
      const cant = Number(inpCant.value || 0);
      const precio = Number(inpPrecio.value || 0);
      subtotalEl.textContent = fmt.format(cant * precio);
      recalcularTotal();
    }

    sel.addEventListener('change', () => {
      const opt = sel.selectedOptions[0];
      const precio = opt?.dataset.precio;
      const etiqueta = opt?.dataset.etiqueta;
      if (precio) {
        inpPrecio.value = precio;
        if (!inpDesc.value.trim()) inpDesc.value = etiqueta ?? '';
      }
      actualizarStockAviso();
      actualizarSubtotal();
    });

    inpCant.addEventListener('input', () => {
      actualizarStockAviso();
      actualizarSubtotal();
    });
    inpPrecio.addEventListener('input', actualizarSubtotal);
    inpDesc.addEventListener('input', actualizarSubtotal);

    div.querySelector('.btn-quitar').addEventListener('click', () => {
      div.remove();
      recalcularTotal();
    });

    contenedor.appendChild(div);
    actualizarSubtotal();
    if (productoId) {
      sel.value = productoId;
      sel.dispatchEvent(new Event('change'));
    }
    return div;
  }

  function recalcularTotal() {
    let subtotal = 0;
    for (const linea of contenedor.querySelectorAll('.linea')) {
      const cant = Number(linea.querySelector('.inp-cant').value || 0);
      const precio = Number(linea.querySelector('.inp-precio').value || 0);
      subtotal += cant * precio;
    }
    const descuento = Number(inputDescuento.value || 0);
    const total = Math.max(subtotal - descuento, 0);
    totalDisplay.textContent = fmt.format(total);

    const lineas = [];
    for (const linea of contenedor.querySelectorAll('.linea')) {
      const sel = linea.querySelector('.sel-producto');
      const opt = sel.selectedOptions[0];
      const productoId = opt?.value || null;
      const descripcion = linea.querySelector('.inp-desc').value.trim();
      const cantidad = Number(linea.querySelector('.inp-cant').value || 0);
      const precio = Number(linea.querySelector('.inp-precio').value || 0);
      if (descripcion && cantidad >= 1) {
        lineas.push({ producto_id: productoId, descripcion, cantidad, precio_unitario: precio });
      }
    }
    inputItems.value = JSON.stringify(lineas);
  }

  document.getElementById('btn-linea').addEventListener('click', () => {
    errorItems.classList.add('hidden');
    crearLinea();
  });
  document.getElementById('btn-servicio').addEventListener('click', () => {
    errorItems.classList.add('hidden');
    const div = crearLinea();
    div.querySelector('.inp-desc').focus();
  });
  inputDescuento.addEventListener('input', recalcularTotal);

  form.addEventListener('submit', (e) => {
    recalcularTotal();
    let lineas = [];
    try {
      lineas = JSON.parse(inputItems.value);
    } catch {
      lineas = [];
    }
    if (lineas.length === 0) {
      e.preventDefault();
      errorItems.classList.remove('hidden');
      return;
    }
    for (const linea of lineas) {
      if (!linea.descripcion || linea.cantidad < 1) {
        e.preventDefault();
        errorItems.textContent = 'Revisa la descripción y cantidad de cada línea.';
        errorItems.classList.remove('hidden');
        return;
      }
    }
  });

  // línea inicial
  if (catalogo.length > 0) {
    crearLinea(catalogo[0].id, '', 1, String(catalogo[0].precio));
  } else {
    crearLinea();
  }
})();<\/script>`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/ventas/nueva.astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/ventas/nueva.astro";
var $$url = "/ventas/nueva";
//#endregion
//#region \0virtual:astro:page:src/pages/ventas/nueva@_@astro
var page = () => nueva_exports;
//#endregion
export { page };
