import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, T as Fragment, j as maybeRenderHead, w as renderComponent } from "./sequence_CIT0iznN.mjs";
import { T as isInputError } from "./server_C9TuG6g2.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
import { i as formatFechaCorta, n as $$DashboardLayout, r as formatCOP, t as $$PageHeader } from "./PageHeader_3yQ1ZTGz.mjs";
import { t as actions } from "./_astro_actions_DoCWdtvR.mjs";
import { o as listClientes } from "./clientes_BmetyF5T.mjs";
import { i as listVentas, s as totalesVentas } from "./ventas_CdaSwVoC.mjs";
import { n as Search, r as Plus, t as $$LimpiarFiltros } from "./LimpiarFiltros_nWV-b444.mjs";
import { t as $$Button } from "./Button_C8T8wdfZ.mjs";
import { t as $$Input } from "./Input_BqhAvSAl.mjs";
import { t as $$Badge } from "./Badge_DYdURA09.mjs";
import { t as $$EmptyState } from "./EmptyState_s9NtGM7p.mjs";
//#region src/pages/ventas/index.astro
var ventas_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const mes = Astro.url.searchParams.get("mes")?.trim() || void 0;
	const clienteId = Astro.url.searchParams.get("cliente")?.trim() || void 0;
	const q = Astro.url.searchParams.get("q")?.trim() || void 0;
	const anular = Astro.getActionResult(actions.ventas.anular);
	if (anular && !anular.error) {
		const params = new URLSearchParams();
		if (mes) params.set("mes", mes);
		if (clienteId) params.set("cliente", clienteId);
		if (q) params.set("q", q);
		const qs = params.toString();
		return Astro.redirect(`/ventas${qs ? `?${qs}` : ""}`);
	}
	const [lista, totales, clientas] = await Promise.all([
		listVentas({
			mes,
			clienteId,
			q
		}),
		totalesVentas({
			mes,
			clienteId,
			q
		}),
		listClientes()
	]);
	const hayFiltro = Boolean(mes || clienteId || q);
	const errAnular = anular?.error;
	const errorAnular = errAnular && !isInputError(errAnular) ? errAnular.message : null;
	const metodos = {
		efectivo: "Efectivo",
		nequi: "Nequi",
		daviplata: "Daviplata",
		bancolombia: "Bancolombia",
		transferencia: "Transferencia",
		tarjeta: "Tarjeta"
	};
	return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, {
		"title": "Ventas",
		"active": "ventas"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHeader", $$PageHeader, {
		"title": "Ventas",
		"description": `${totales.n} ${totales.n === 1 ? "venta" : "ventas"} · ${formatCOP(totales.total)} en total`
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Button", $$Button, { "href": "/ventas/nueva" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Plus", Plus, { "size": 15 })} Nueva venta` })}` })}${maybeRenderHead($$result)}<form method="GET" action="/ventas" class="mt-6 flex flex-wrap items-end gap-3">${renderComponent($$result, "Input", $$Input, {
		"name": "mes",
		"label": "Mes",
		"type": "month",
		"value": mes ?? "",
		"class": "w-44"
	})}<label class="space-y-1.5"><span class="block text-[13px] font-medium text-ink">Clienta</span><select name="cliente" class="h-9.5 w-48 rounded-lg border border-ink/15 bg-surface px-2.5 text-sm text-ink focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/15"><option value="">Todas</option>${clientas.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === clienteId, "selected")}>${c.nombre}</option>`)}</select></label>${renderComponent($$result, "Input", $$Input, {
		"name": "q",
		"label": "Buscar",
		"type": "search",
		"placeholder": "Por clienta o ID",
		"value": q ?? "",
		"class": "w-52"
	})}${renderComponent($$result, "Button", $$Button, {
		"variant": "outline",
		"type": "submit",
		"class": "shrink-0"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Search", Search, { "size": 15 })} Filtrar
    ` })}</form>${errorAnular && renderTemplate`<div class="mt-4 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">${errorAnular}</div>`}<div class="mt-6 overflow-hidden rounded-xl border border-hairline bg-surface">${lista.length === 0 && renderTemplate`${renderComponent($$result, "EmptyState", $$EmptyState, {
		"title": hayFiltro ? "Sin resultados" : "Aún no hay ventas",
		"description": hayFiltro ? "Prueba con otros filtros o registra una venta nueva." : "Registra tu primera venta para empezar a ver reportes."
	}, { "default": ($$result) => renderTemplate`${hayFiltro ? renderTemplate`${renderComponent($$result, "Button", $$Button, {
		"variant": "outline",
		"href": "/ventas"
	}, { "default": ($$result) => renderTemplate`
              Ver todas
            ` })}` : renderTemplate`${renderComponent($$result, "Button", $$Button, { "href": "/ventas/nueva" }, { "default": ($$result) => renderTemplate`Registrar venta` })}`}` })}`}${lista.length > 0 && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<table class="data-table hidden md:table"><thead><tr><th scope="col">Fecha</th><th scope="col">Clienta</th><th scope="col">Método</th><th scope="col" class="text-right">Ítems</th><th scope="col" class="text-right">Descuento</th><th scope="col" class="text-right">Total</th><th scope="col">Estado</th><th scope="col"><span class="sr-only">Detalles</span></th></tr></thead><tbody>${lista.map((v) => renderTemplate`<tr${addAttribute(v.anulada ? "opacity-55" : "", "class")}><td class="text-ink-muted">${formatFechaCorta(v.fecha)}</td><td class="font-medium text-ink">${v.cliente_nombre ?? renderTemplate`<span class="text-ink-muted">Sin clienta</span>`}</td><td class="text-ink-muted">${metodos[v.metodo_pago.toLowerCase()] ?? v.metodo_pago}</td><td class="text-right num">${v.num_items}</td><td class="text-right num text-ink-muted">${v.descuento > 0 ? `−${formatCOP(v.descuento)}` : "—"}</td><td class="text-right num font-display">${formatCOP(v.total)}</td><td>${v.anulada ? renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "tone": "danger" }, { "default": ($$result) => renderTemplate`Anulada` })}` : v.credito ? renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "tone": "wine" }, { "default": ($$result) => renderTemplate`${v.saldo > 0 ? `Crédito · debe ${formatCOP(v.saldo)}` : "Crédito · pagada"}` })}` : renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "tone": "success" }, { "default": ($$result) => renderTemplate`Validada` })}`}</td><td>${renderComponent($$result, "Button", $$Button, {
		"variant": "ghost",
		"size": "sm",
		"href": `/ventas/${v.id}`,
		"aria-label": "Ver detalle"
	}, { "default": ($$result) => renderTemplate`
                      Ver
                    ` })}</td></tr>`)}</tbody></table><ul class="divide-y divide-hairline md:hidden">${lista.map((v) => renderTemplate`<li><a${addAttribute(`/ventas/${v.id}`, "href")} class="block p-4"><div class="flex items-start gap-3"><div class="min-w-0 flex-1"><p class="font-medium text-ink">${v.cliente_nombre ?? "Sin clienta"}</p><p class="text-xs text-ink-muted">${formatFechaCorta(v.fecha)} ·${" "}${metodos[v.metodo_pago.toLowerCase()] ?? v.metodo_pago}</p></div><div class="text-right"><p class="num font-display text-sm">${formatCOP(v.total)}</p><p class="mt-0.5">${v.anulada ? renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "tone": "danger" }, { "default": ($$result) => renderTemplate`Anulada` })}` : v.credito ? renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "tone": "wine" }, { "default": ($$result) => renderTemplate`${v.saldo > 0 ? `Debe ${formatCOP(v.saldo)}` : "Crédito · pagada"}` })}` : renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "tone": "success" }, { "default": ($$result) => renderTemplate`Validada` })}`}</p></div></div></a></li>`)}</ul>` })}`}</div>${hayFiltro && renderTemplate`${renderComponent($$result, "LimpiarFiltros", $$LimpiarFiltros, {
		"href": "/ventas",
		"class": "mt-3"
	})}`}` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/ventas/index.astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/ventas/index.astro";
var $$url = "/ventas";
//#endregion
//#region \0virtual:astro:page:src/pages/ventas/index@_@astro
var page = () => ventas_exports;
//#endregion
export { page };
