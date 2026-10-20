import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, T as Fragment, j as maybeRenderHead, w as renderComponent } from "./sequence_CIT0iznN.mjs";
import { T as isInputError } from "./server_3at7jTLn.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
import { c as createLucideIcon, n as $$DashboardLayout, r as formatCOP, t as $$PageHeader } from "./PageHeader_C1KzfuB3.mjs";
import { t as actions } from "./_astro_actions_BMSwLB6E.mjs";
import { a as listCategorias, o as listProductos, t as countStockBajo } from "./productos_uqc73N35.mjs";
import { n as Pencil, t as Trash } from "./trash_DD_sBBhI.mjs";
import { n as Plus, t as Search } from "./search_BYe3CUWH.mjs";
import { t as $$Button } from "./Button_Dg178JBz.mjs";
import { t as $$Input } from "./Input_gzsjanpf.mjs";
import { t as $$Badge } from "./Badge_SraFlFXP.mjs";
import { t as $$EmptyState } from "./EmptyState_s9NtGM7p.mjs";
//#region node_modules/@lucide/astro/src/icons/triangle-alert.ts
/**
* @component @name TriangleAlert
* @description Lucide SVG icon component, renders SVG Element with children.
*
* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMjEuNzMgMTgtOC0xNGEyIDIgMCAwIDAtMy40OCAwbC04IDE0QTIgMiAwIDAgMCA0IDIxaDE2YTIgMiAwIDAgMCAxLjczLTMiIC8+CiAgPHBhdGggZD0iTTEyIDl2NCIgLz4KICA8cGF0aCBkPSJNMTIgMTdoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/triangle-alert
* @see https://lucide.dev/guide/packages/lucide-astro - Documentation
*
* @param {import('../types').IconProps} props - Lucide icons props and any valid SVG attribute
* @returns {any} Astro Component
* 
*/
var TriangleAlert = createLucideIcon({
	"name": "triangle-alert",
	"size": 24,
	"node": [
		["path", { "d": "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }],
		["path", { "d": "M12 9v4" }],
		["path", { "d": "M12 17h.01" }]
	],
	"aliases": ["alert-triangle"]
});
//#endregion
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
	const [lista, categorias, totalStockBajo] = await Promise.all([
		listProductos({
			q,
			categoria,
			stockBajo: soloStockBajo,
			inactivos: verInactivos
		}),
		listCategorias(),
		countStockBajo()
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
	}, { "default": ($$result) => renderTemplate`${totalStockBajo > 0 && renderTemplate`${maybeRenderHead($$result)}<a href="/productos?stock=bajo" class="inline-flex items-center gap-1.5 rounded bg-ochre/10 px-2.5 py-1 text-[13px] font-medium text-ochre">${renderComponent($$result, "TriangleAlert", TriangleAlert, { "size": 14 })}${totalStockBajo} bajo stock</a>`}${renderComponent($$result, "Button", $$Button, { "href": "/productos/nuevo" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Plus", Plus, { "size": 15 })} Nuevo producto` })}` })}<form method="GET" action="/productos" class="mt-6 flex flex-wrap items-end gap-3">${renderComponent($$result, "Input", $$Input, {
		"name": "q",
		"label": "Buscar",
		"type": "search",
		"placeholder": "Por nombre o marca",
		"value": q ?? "",
		"class": "w-full max-w-xs"
	})}<label class="space-y-1.5"><span class="block text-[13px] font-medium text-ink">Categoría</span><select name="categoria" class="h-9.5 w-40 rounded border border-ink/15 bg-surface px-2.5 text-sm text-ink focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/15"><option value="">Todas</option>${categorias.map((c) => renderTemplate`<option${addAttribute(c, "value")}${addAttribute(c === categoria, "selected")}>${c}</option>`)}</select></label>${renderComponent($$result, "Button", $$Button, {
		"variant": "outline",
		"type": "submit",
		"class": "shrink-0"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Search", Search, { "size": 15 })} Filtrar
    ` })}<label class="flex h-9.5 cursor-pointer items-center gap-2 text-sm text-ink"><input type="checkbox" name="stock" value="bajo"${addAttribute(soloStockBajo, "checked")} class="size-4 accent-wine">Solo stock bajo</label><label class="flex h-9.5 cursor-pointer items-center gap-2 text-sm text-ink"><input type="checkbox" name="inactivos" value="1"${addAttribute(verInactivos, "checked")} class="size-4 accent-wine">Ver inactivos</label></form>${errorEliminar && renderTemplate`<div class="mt-4 rounded border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">${errorEliminar}</div>`}${aviso && renderTemplate`<div class="mt-4 rounded border border-ochre/30 bg-ochre/5 px-4 py-3 text-sm text-ochre" role="alert">${aviso}</div>`}<div class="mt-6 overflow-hidden rounded-md border border-hairline bg-surface">${lista.length === 0 && renderTemplate`${renderComponent($$result, "EmptyState", $$EmptyState, {
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
		return renderTemplate`<tr${addAttribute(p.activo ? "" : "opacity-55", "class")}><td><a${addAttribute(`/productos/${p.id}/editar`, "href")} class="font-medium text-ink hover:text-wine">${p.nombre}</a><p class="mt-0.5 text-xs text-ink-muted">${p.marca ?? "Sin marca"}</p></td><td>${renderComponent($$result, "Badge", $$Badge, { "tone": "neutral" }, { "default": ($$result) => renderTemplate`${p.categoria}` })}${!p.activo && renderTemplate`${renderComponent($$result, "Badge", $$Badge, {
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
	})}</tbody></table><ul class="divide-y divide-hairline md:hidden">${lista.map((p) => renderTemplate`<li class="flex items-start gap-3 p-4"><a${addAttribute(`/productos/${p.id}/editar`, "href")} class="min-w-0 flex-1 hover:text-wine"><p class="truncate font-medium text-ink">${p.nombre}</p><p class="truncate text-xs text-ink-muted">${p.marca ?? "Sin marca"} · ${p.categoria}</p><p class="mt-1 text-xs"><span${addAttribute(["num font-display text-sm", p.stock <= p.stock_minimo ? "text-danger" : "text-ink"], "class:list")}>${p.stock}</span>${" "}<span class="text-ink-muted">en stock</span></p></a><div class="flex shrink-0 flex-col items-end gap-1"><p class="num font-display text-sm">${formatCOP(p.precio_venta)}</p>${!p.activo && renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "tone": "danger" }, { "default": ($$result) => renderTemplate`Inactivo` })}`}<div class="mt-1 flex gap-1">${renderComponent($$result, "Button", $$Button, {
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
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Trash", Trash, { "size": 14 })}` })}</form></div></div></li>`)}</ul>` })}`}</div>${hayFiltro && renderTemplate`<p class="mt-3 text-xs text-ink-muted"><a href="/productos" class="hover:text-wine">Limpiar filtros</a></p>`}` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/productos/index.astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/productos/index.astro";
var $$url = "/productos";
//#endregion
//#region \0virtual:astro:page:src/pages/productos/index@_@astro
var page = () => productos_exports;
//#endregion
export { page };
