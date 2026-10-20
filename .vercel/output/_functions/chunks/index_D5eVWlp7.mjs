import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, T as Fragment, j as maybeRenderHead, w as renderComponent } from "./sequence_CIT0iznN.mjs";
import { T as isInputError } from "./server_BCn8yymk.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
import { i as formatFechaCorta, n as $$DashboardLayout, r as formatCOP, t as $$PageHeader } from "./PageHeader_BK87cCvx.mjs";
import { t as actions } from "./_astro_actions_D8QXn43k.mjs";
import { a as listGastos, i as listCategoriasGasto, o as totalGastos } from "./gastos_uFnzIew9.mjs";
import { n as Pencil, t as Trash } from "./trash_DIyLjot_.mjs";
import { n as Search, r as Plus, t as $$LimpiarFiltros } from "./LimpiarFiltros_D0J1IAex.mjs";
import { t as $$Button } from "./Button_C8T8wdfZ.mjs";
import { t as $$Input } from "./Input_BqhAvSAl.mjs";
import { t as $$Badge } from "./Badge_DYdURA09.mjs";
import { t as $$EmptyState } from "./EmptyState_s9NtGM7p.mjs";
//#region src/pages/gastos/index.astro
var gastos_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const mes = Astro.url.searchParams.get("mes")?.trim() || void 0;
	const categoria = Astro.url.searchParams.get("categoria")?.trim() || void 0;
	const eliminar = Astro.getActionResult(actions.gastos.eliminar);
	if (eliminar && !eliminar.error) {
		const params = new URLSearchParams();
		if (mes) params.set("mes", mes);
		if (categoria) params.set("categoria", categoria);
		const qs = params.toString();
		return Astro.redirect(`/gastos${qs ? `?${qs}` : ""}`);
	}
	const [lista, categorias, total] = await Promise.all([
		listGastos({
			mes,
			categoria
		}),
		listCategoriasGasto(),
		totalGastos({
			mes,
			categoria
		})
	]);
	const hayFiltro = Boolean(mes || categoria);
	const errDel = eliminar?.error;
	const errorEliminar = errDel && !isInputError(errDel) ? errDel.message : null;
	const mensajeConfirmar = "¿Eliminar este gasto? Esta acción no se puede deshacer.";
	const tonos = {
		Alquiler: "wine",
		Insumos: "neutral",
		Transporte: "neutral",
		Servicios: "neutral",
		Publicidad: "warning",
		Domicilio: "neutral"
	};
	return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, {
		"title": "Gastos",
		"active": "gastos"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHeader", $$PageHeader, {
		"title": "Gastos",
		"description": `${lista.length} ${lista.length === 1 ? "registro" : "registros"}${hayFiltro ? "" : " en total"} · ${formatCOP(total)}`
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Button", $$Button, { "href": "/gastos/nuevo" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Plus", Plus, { "size": 15 })} Nuevo gasto` })}` })}${maybeRenderHead($$result)}<form method="GET" action="/gastos" class="mt-6 flex flex-wrap items-end gap-3">${renderComponent($$result, "Input", $$Input, {
		"name": "mes",
		"label": "Mes",
		"type": "month",
		"value": mes ?? "",
		"class": "w-44"
	})}<label class="space-y-1.5"><span class="block text-[13px] font-medium text-ink">Categoría</span><select name="categoria" class="h-9.5 w-44 rounded-lg border border-ink/15 bg-surface px-2.5 text-sm text-ink focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/15"><option value="">Todas</option>${categorias.map((c) => renderTemplate`<option${addAttribute(c, "value")}${addAttribute(c === categoria, "selected")}>${c}</option>`)}</select></label>${renderComponent($$result, "Button", $$Button, {
		"variant": "outline",
		"type": "submit",
		"class": "shrink-0"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Search", Search, { "size": 15 })} Filtrar
    ` })}</form>${errorEliminar && renderTemplate`<div class="mt-4 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">${errorEliminar}</div>`}<div class="mt-6 overflow-hidden rounded-xl border border-hairline bg-surface">${lista.length === 0 && renderTemplate`${renderComponent($$result, "EmptyState", $$EmptyState, {
		"title": hayFiltro ? "Sin resultados" : "Aún no hay gastos",
		"description": hayFiltro ? "Prueba con otros filtros o registra un gasto nuevo." : "Registra tus gastos operativos para conocer tu ganancia real."
	}, { "default": ($$result) => renderTemplate`${hayFiltro ? renderTemplate`${renderComponent($$result, "Button", $$Button, {
		"variant": "outline",
		"href": "/gastos"
	}, { "default": ($$result) => renderTemplate`
              Ver todos
            ` })}` : renderTemplate`${renderComponent($$result, "Button", $$Button, { "href": "/gastos/nuevo" }, { "default": ($$result) => renderTemplate`Registrar gasto` })}`}` })}`}${lista.length > 0 && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<table class="data-table hidden md:table"><thead><tr><th scope="col">Fecha</th><th scope="col">Categoría</th><th scope="col">Descripción</th><th scope="col" class="text-right">Monto</th><th scope="col"><span class="sr-only">Acciones</span></th></tr></thead><tbody>${lista.map((g) => renderTemplate`<tr><td class="text-ink-muted">${formatFechaCorta(g.fecha)}</td><td>${renderComponent($$result, "Badge", $$Badge, { "tone": tonos[g.categoria] ?? "neutral" }, { "default": ($$result) => renderTemplate`${g.categoria}` })}</td><td class="text-ink">${g.descripcion}</td><td class="text-right num font-display">${formatCOP(g.monto)}</td><td><div class="flex justify-end gap-1">${renderComponent($$result, "Button", $$Button, {
		"variant": "ghost",
		"size": "sm",
		"href": `/gastos/${g.id}/editar`,
		"aria-label": "Editar gasto"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Pencil", Pencil, { "size": 14 })}` })}<form method="POST"${addAttribute(actions.gastos.eliminar, "action")}><input type="hidden" name="id"${addAttribute(g.id, "value")}>${renderComponent($$result, "Button", $$Button, {
		"variant": "ghost",
		"size": "sm",
		"type": "submit",
		"class": "text-danger hover:bg-danger/10 hover:text-danger",
		"aria-label": "Eliminar gasto",
		"onclick": `return confirm('${mensajeConfirmar}')`
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Trash", Trash, { "size": 14 })}` })}</form></div></td></tr>`)}</tbody></table><ul class="divide-y divide-hairline md:hidden">${lista.map((g) => renderTemplate`<li class="flex items-start gap-3 p-4"><div class="min-w-0 flex-1"><p class="truncate font-medium text-ink">${g.descripcion}</p><p class="mt-0.5 text-xs text-ink-muted">${formatFechaCorta(g.fecha)} · ${g.categoria}</p></div><div class="flex shrink-0 items-center gap-2"><p class="num font-display text-sm">${formatCOP(g.monto)}</p><div class="flex gap-1">${renderComponent($$result, "Button", $$Button, {
		"variant": "ghost",
		"size": "sm",
		"href": `/gastos/${g.id}/editar`,
		"aria-label": "Editar gasto"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Pencil", Pencil, { "size": 14 })}` })}<form method="POST"${addAttribute(actions.gastos.eliminar, "action")}><input type="hidden" name="id"${addAttribute(g.id, "value")}>${renderComponent($$result, "Button", $$Button, {
		"variant": "ghost",
		"size": "sm",
		"type": "submit",
		"class": "text-danger hover:bg-danger/10 hover:text-danger",
		"aria-label": "Eliminar gasto",
		"onclick": `return confirm('${mensajeConfirmar}')`
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Trash", Trash, { "size": 14 })}` })}</form></div></div></li>`)}</ul>` })}`}</div><div class="mt-4 flex flex-wrap items-center justify-between gap-3">${hayFiltro && renderTemplate`${renderComponent($$result, "LimpiarFiltros", $$LimpiarFiltros, { "href": "/gastos" })}`}<p class="text-xs text-ink-muted sm:ml-auto">Total: <span class="num font-display text-sm text-ink">${formatCOP(total)}</span></p></div>` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/gastos/index.astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/gastos/index.astro";
var $$url = "/gastos";
//#endregion
//#region \0virtual:astro:page:src/pages/gastos/index@_@astro
var page = () => gastos_exports;
//#endregion
export { page };
