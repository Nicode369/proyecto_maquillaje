import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, T as Fragment, j as maybeRenderHead, w as renderComponent } from "./sequence_CIT0iznN.mjs";
import { T as isInputError } from "./server_CLYhxG4G.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
import { n as $$DashboardLayout, t as $$PageHeader } from "./PageHeader_fSLQL0Sl.mjs";
import { t as actions } from "./_astro_actions_Cm4RM71H.mjs";
import { n as formatCOP } from "./format_C9vTb3rb.mjs";
import { a as listCategorias, c as resumenStockActivo, o as listProductos, t as countStockBajo } from "./productos_DJAPQyIZ.mjs";
import { n as Pencil, t as Trash } from "./trash_BPTZ09tt.mjs";
import { n as Search, r as Plus, t as $$LimpiarFiltros } from "./LimpiarFiltros_zC7gHufP.mjs";
import { t as TriangleAlert } from "./triangle-alert_DKZMLWaA.mjs";
import { t as $$Button } from "./Button_C8T8wdfZ.mjs";
import { t as $$Input } from "./Input_BqhAvSAl.mjs";
import { t as $$Badge } from "./Badge_DYdURA09.mjs";
import { t as $$EmptyState } from "./EmptyState_s9NtGM7p.mjs";
//#region src/pages/productos/index.astro
var productos_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const q = Astro.url.searchParams.get("q")?.trim() || void 0;
	const categoria = Astro.url.searchParams.get("categoria")?.trim() || void 0;
	const soloStockBajo = Astro.url.searchParams.get("stock") === "bajo";
	const verInactivos = Astro.url.searchParams.get("inactivos") === "1";
	const eliminar = Astro.getActionResult(actions.productos.eliminar);
	if (eliminar && !eliminar.error) {
		const params = new URLSearchParams();
		if (q) params.set("q", q);
		if (categoria) params.set("categoria", categoria);
		if (eliminar.data.teniaVentas) params.set("aviso", `«${eliminar.data.nombre}» tiene ventas asociadas: se desactivó en su lugar.`);
		const qs = params.toString();
		return Astro.redirect(`/productos${qs ? `?${qs}` : ""}`);
	}
	const [lista, categorias, totalStockBajo, stock] = await Promise.all([
		listProductos({
			q,
			categoria,
			stockBajo: soloStockBajo,
			inactivos: verInactivos
		}),
		listCategorias(),
		countStockBajo(),
		resumenStockActivo()
	]);
	const hayFiltro = Boolean(q || categoria || soloStockBajo);
	const errDel = eliminar?.error;
	const errorEliminar = errDel && !isInputError(errDel) ? errDel.message : null;
	const mensajeConfirmar = "¿Eliminar este producto? Si tiene ventas asociadas se desactivará en su lugar.";
	const aviso = Astro.url.searchParams.get("aviso");
	return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, {
		"title": "Productos",
		"active": "productos"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHeader", $$PageHeader, {
		"title": "Productos",
		"description": `${lista.length} en catálogo${totalStockBajo > 0 ? ` · ${totalStockBajo} con stock bajo` : ""}`
	}, { "default": ($$result) => renderTemplate`${totalStockBajo > 0 && renderTemplate`${maybeRenderHead($$result)}<a href="/productos?stock=bajo" class="inline-flex items-center gap-1.5 rounded-full bg-ochre/10 px-2.5 py-1 text-[13px] font-medium text-ochre">${renderComponent($$result, "TriangleAlert", TriangleAlert, { "size": 14 })}${totalStockBajo} bajo stock</a>`}${renderComponent($$result, "Button", $$Button, { "href": "/productos/nuevo" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Plus", Plus, { "size": 15 })} Nuevo producto` })}` })}<div class="mt-6 grid grid-cols-1 divide-y divide-hairline overflow-hidden rounded-xl border border-hairline bg-surface sm:grid-cols-3 sm:divide-x sm:divide-y-0"><div class="p-5"><p class="text-xs tracking-wide text-ink-muted uppercase">Unidades en stock</p><p class="display-number mt-1 text-2xl text-ink">${stock.unidades}</p><p class="mt-1 text-[12px] text-ink-muted">en ${totalStockBajo > 0 ? `${totalStockBajo} con stock bajo` : "catálogo activo"}</p></div><div class="p-5"><p class="text-xs tracking-wide text-ink-muted uppercase">Invertido en mercancía</p><p class="display-number mt-1 text-2xl text-ink">${formatCOP(stock.invertido)}</p><p class="mt-1 text-[12px] text-ink-muted">a precio de compra</p></div><div class="p-5"><p class="text-xs tracking-wide text-ink-muted uppercase">Ganancia potencial</p><p class="display-number mt-1 text-2xl text-wine">${formatCOP(stock.ganancia)}</p><p class="mt-1 text-[12px] text-ink-muted">si vendes todo el stock</p></div></div><form method="GET" action="/productos" class="mt-6 flex flex-wrap items-end gap-3">${renderComponent($$result, "Input", $$Input, {
		"name": "q",
		"label": "Buscar",
		"type": "search",
		"placeholder": "Por nombre o marca",
		"value": q ?? "",
		"class": "w-full max-w-xs"
	})}<label class="space-y-1.5"><span class="block text-[13px] font-medium text-ink">Categoría</span><select name="categoria" class="h-9.5 w-40 rounded-lg border border-ink/15 bg-surface px-2.5 text-sm text-ink focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/15"><option value="">Todas</option>${categorias.map((c) => renderTemplate`<option${addAttribute(c, "value")}${addAttribute(c === categoria, "selected")}>${c}</option>`)}</select></label>${renderComponent($$result, "Button", $$Button, {
		"variant": "outline",
		"type": "submit",
		"class": "shrink-0"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Search", Search, { "size": 15 })} Filtrar
    ` })}<label class="flex h-9.5 cursor-pointer items-center gap-2 text-sm text-ink"><input type="checkbox" name="stock" value="bajo"${addAttribute(soloStockBajo, "checked")} class="size-4 accent-wine">Solo stock bajo</label><label class="flex h-9.5 cursor-pointer items-center gap-2 text-sm text-ink"><input type="checkbox" name="inactivos" value="1"${addAttribute(verInactivos, "checked")} class="size-4 accent-wine">Ver inactivos</label></form>${errorEliminar && renderTemplate`<div class="mt-4 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">${errorEliminar}</div>`}${aviso && renderTemplate`<div class="mt-4 rounded-lg border border-ochre/30 bg-ochre/5 px-4 py-3 text-sm text-ochre" role="alert">${aviso}</div>`}<div class="mt-6 overflow-hidden rounded-xl border border-hairline bg-surface">${lista.length === 0 && renderTemplate`${renderComponent($$result, "EmptyState", $$EmptyState, {
		"title": hayFiltro ? "Sin resultados" : "Aún no hay productos",
		"description": hayFiltro ? "Prueba con otros filtros o registra un producto nuevo." : "Registra tu inventario con precios de compra y venta."
	}, { "default": ($$result) => renderTemplate`${hayFiltro ? renderTemplate`${renderComponent($$result, "Button", $$Button, {
		"variant": "outline",
		"href": "/productos"
	}, { "default": ($$result) => renderTemplate`
              Ver todos
            ` })}` : renderTemplate`${renderComponent($$result, "Button", $$Button, { "href": "/productos/nuevo" }, { "default": ($$result) => renderTemplate`Registrar producto` })}`}` })}`}${lista.length > 0 && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<table class="data-table hidden md:table"><thead><tr><th scope="col">Producto</th><th scope="col">Categoría</th><th scope="col" class="text-right">Stock</th><th scope="col" class="text-right">Compra</th><th scope="col" class="text-right">Venta</th><th scope="col" class="text-right">Margen</th><th scope="col"><span class="sr-only">Acciones</span></th></tr></thead><tbody>${lista.map((p) => {
		const margen = p.precio_venta - p.precio_compra;
		const margenPct = p.precio_compra > 0 ? Math.round(margen / p.precio_compra * 100) : null;
		return renderTemplate`<tr${addAttribute(p.activo ? "" : "opacity-55", "class")}><td><div class="flex items-center gap-3">${p.imagen ? renderTemplate`<img${addAttribute(p.imagen, "src")} alt="" class="h-11 w-11 shrink-0 rounded-lg border border-hairline object-cover">` : renderTemplate`<span class="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-wine-soft" aria-hidden="true"><img src="/logo.svg" alt="" class="h-6 w-6 opacity-70"></span>`}<div class="min-w-0"><a${addAttribute(`/productos/${p.id}/editar`, "href")} class="font-medium text-ink hover:text-wine">${p.nombre}</a><p class="mt-0.5 text-xs text-ink-muted">${p.marca ?? "Sin marca"}</p></div></div></td><td>${renderComponent($$result, "Badge", $$Badge, { "tone": "neutral" }, { "default": ($$result) => renderTemplate`${p.categoria}` })}${!p.activo && renderTemplate`${renderComponent($$result, "Badge", $$Badge, {
			"tone": "danger",
			"class": "ml-1"
		}, { "default": ($$result) => renderTemplate`
                          Inactivo
                        ` })}`}</td><td class="text-right"><span${addAttribute(["num font-display", p.stock <= p.stock_minimo ? "text-danger" : "text-ink"], "class:list")}>${p.stock}</span>${p.stock <= p.stock_minimo && renderTemplate`<p class="text-[11px] text-ochre">mín. ${p.stock_minimo}</p>`}</td><td class="text-right num text-ink-muted">${formatCOP(p.precio_compra)}</td><td class="text-right num font-display">${formatCOP(p.precio_venta)}</td><td class="text-right"><span class="num text-sage">+${formatCOP(margen)}</span>${margenPct !== null && renderTemplate`<p class="text-[11px] text-ink-muted">${margenPct}%</p>`}</td><td><div class="flex justify-end gap-1">${renderComponent($$result, "Button", $$Button, {
			"variant": "ghost",
			"size": "sm",
			"href": `/productos/${p.id}/editar`,
			"aria-label": `Editar ${p.nombre}`
		}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Pencil", Pencil, { "size": 14 })}` })}<form method="POST"${addAttribute(actions.productos.eliminar, "action")}><input type="hidden" name="id"${addAttribute(p.id, "value")}>${renderComponent($$result, "Button", $$Button, {
			"variant": "ghost",
			"size": "sm",
			"type": "submit",
			"class": "text-danger hover:bg-danger/10 hover:text-danger",
			"aria-label": `Eliminar ${p.nombre}`,
			"onclick": `return confirm('${mensajeConfirmar}')`
		}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Trash", Trash, { "size": 14 })}` })}</form></div></td></tr>`;
	})}</tbody></table><ul class="divide-y divide-hairline md:hidden">${lista.map((p) => renderTemplate`<li class="flex items-start gap-3 p-4">${p.imagen ? renderTemplate`<img${addAttribute(p.imagen, "src")} alt="" class="h-12 w-12 shrink-0 rounded-lg border border-hairline object-cover">` : renderTemplate`<span class="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-wine-soft" aria-hidden="true"><img src="/logo.svg" alt="" class="h-7 w-7 opacity-70"></span>`}<a${addAttribute(`/productos/${p.id}/editar`, "href")} class="min-w-0 flex-1 hover:text-wine"><p class="truncate font-medium text-ink">${p.nombre}</p><p class="truncate text-xs text-ink-muted">${p.marca ?? "Sin marca"} · ${p.categoria}</p><p class="mt-1 text-xs"><span${addAttribute(["num font-display text-sm", p.stock <= p.stock_minimo ? "text-danger" : "text-ink"], "class:list")}>${p.stock}</span>${" "}<span class="text-ink-muted">en stock</span></p></a><div class="flex shrink-0 flex-col items-end gap-1"><p class="num font-display text-sm">${formatCOP(p.precio_venta)}</p>${!p.activo && renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "tone": "danger" }, { "default": ($$result) => renderTemplate`Inactivo` })}`}<div class="mt-1 flex gap-1">${renderComponent($$result, "Button", $$Button, {
		"variant": "ghost",
		"size": "sm",
		"href": `/productos/${p.id}/editar`,
		"aria-label": `Editar ${p.nombre}`
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Pencil", Pencil, { "size": 14 })}` })}<form method="POST"${addAttribute(actions.productos.eliminar, "action")}><input type="hidden" name="id"${addAttribute(p.id, "value")}>${renderComponent($$result, "Button", $$Button, {
		"variant": "ghost",
		"size": "sm",
		"type": "submit",
		"class": "text-danger hover:bg-danger/10 hover:text-danger",
		"aria-label": `Eliminar ${p.nombre}`,
		"onclick": `return confirm('${mensajeConfirmar}')`
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Trash", Trash, { "size": 14 })}` })}</form></div></div></li>`)}</ul>` })}`}</div>${hayFiltro && renderTemplate`${renderComponent($$result, "LimpiarFiltros", $$LimpiarFiltros, {
		"href": "/productos",
		"class": "mt-3"
	})}`}` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/productos/index.astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/productos/index.astro";
var $$url = "/productos";
//#endregion
//#region \0virtual:astro:page:src/pages/productos/index@_@astro
var page = () => productos_exports;
//#endregion
export { page };
