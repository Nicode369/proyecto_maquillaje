import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, T as Fragment, j as maybeRenderHead, w as renderComponent } from "./sequence_CIT0iznN.mjs";
import { T as isInputError } from "./server_DO4QvJjv.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
import { i as formatFechaCorta, n as $$DashboardLayout, r as formatCOP, t as $$PageHeader } from "./PageHeader_CuIUt3x8.mjs";
import { t as actions } from "./_astro_actions_BkdmSfAd.mjs";
import { a as getCliente } from "./clientes_BmetyF5T.mjs";
import { a as listVentasDeCliente } from "./ventas_CdaSwVoC.mjs";
import { n as Pencil, t as Trash } from "./trash_CZlWnqSa.mjs";
import { t as $$Card } from "./Card_ASULwIyD.mjs";
import { t as $$Button } from "./Button_C8T8wdfZ.mjs";
import { t as $$Badge } from "./Badge_DYdURA09.mjs";
import { t as $$EmptyState } from "./EmptyState_s9NtGM7p.mjs";
//#region src/pages/clientas/[id].astro
var _id__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Id,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Id = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Id;
	const { id } = Astro.params;
	const cliente = id ? await getCliente(id) : null;
	if (!cliente) return new Response("Clienta no encontrada", { status: 404 });
	const eliminar = Astro.getActionResult(actions.clientes.eliminar);
	if (eliminar && !eliminar.error) return Astro.redirect("/clientas");
	const historial = await listVentasDeCliente(cliente.id);
	const errorEliminar = eliminar?.error && !isInputError(eliminar.error) ? eliminar.error.message : null;
	const mensajeConfirmar = cliente.total_compras > 0 ? `¿Eliminar a ${cliente.nombre}? Sus ${cliente.total_compras} ${cliente.total_compras === 1 ? "venta quedará" : "ventas quedarán"} sin clienta asignada.` : "¿Eliminar esta clienta? Esta acción no se puede deshacer.";
	const contacto = [cliente.telefono, cliente.email].filter(Boolean).join(" · ");
	const metodos = {
		efectivo: "Efectivo",
		nequi: "Nequi",
		daviplata: "Daviplata",
		transferencia: "Transferencia",
		tarjeta: "Tarjeta"
	};
	return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, {
		"title": cliente.nombre,
		"active": "clientas"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHeader", $$PageHeader, {
		"title": cliente.nombre,
		"description": contacto || "Sin datos de contacto"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Button", $$Button, {
		"variant": "outline",
		"href": `/clientas/${cliente.id}/editar`
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Pencil", Pencil, { "size": 15 })} Editar
    ` })}${maybeRenderHead($$result)}<form method="POST"${addAttribute(actions.clientes.eliminar, "action")}><input type="hidden" name="id"${addAttribute(cliente.id, "value")}>${renderComponent($$result, "Button", $$Button, {
		"variant": "ghost",
		"type": "submit",
		"class": "text-danger hover:bg-danger/10 hover:text-danger",
		"onclick": `return confirm('${mensajeConfirmar}')`
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Trash", Trash, { "size": 15 })} Eliminar
      ` })}</form>` })}${errorEliminar && renderTemplate`<div class="mt-4 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">${errorEliminar}</div>`}<div class="mt-6 grid grid-cols-1 divide-y divide-hairline rounded-xl border border-hairline bg-surface sm:grid-cols-4 sm:divide-x sm:divide-y-0"><div class="p-5"><p class="text-xs tracking-wide text-ink-muted uppercase">Compras</p><p class="display-number mt-1 text-2xl text-ink">${cliente.total_compras}</p></div><div class="p-5"><p class="text-xs tracking-wide text-ink-muted uppercase">Gasto acumulado</p><p class="display-number mt-1 text-2xl text-wine">${formatCOP(cliente.gasto_acumulado)}</p></div><div class="p-5"><p class="text-xs tracking-wide text-ink-muted uppercase">Debe</p><p${addAttribute(["display-number mt-1 text-2xl", cliente.saldo > 0 ? "text-ochre" : "text-ink"], "class:list")}>${cliente.saldo > 0 ? formatCOP(cliente.saldo) : "$ 0"}</p></div><div class="p-5"><p class="text-xs tracking-wide text-ink-muted uppercase">Última compra</p><p class="display-number mt-1 text-2xl text-ink">${cliente.ultima_compra ? formatFechaCorta(cliente.ultima_compra) : "—"}</p></div></div>${cliente.notas && renderTemplate`${renderComponent($$result, "Card", $$Card, { "class": "mt-4" }, { "default": ($$result) => renderTemplate`<p class="text-xs tracking-wide text-ink-muted uppercase">Notas</p><p class="mt-1.5 text-sm whitespace-pre-wrap text-ink">${cliente.notas}</p>` })}`}${cliente.email && renderTemplate`<p class="mt-3 text-xs text-ink-muted">Cliente desde el ${formatFechaCorta(cliente.created_at)} · ${cliente.email}</p>`}<h2 class="mt-8 border-b border-hairline pb-2 font-display text-lg text-ink" style="font-variation-settings: 'opsz' 40;">Historial de compras</h2><div class="mt-4 overflow-hidden rounded-xl border border-hairline bg-surface">${historial.length === 0 && renderTemplate`${renderComponent($$result, "EmptyState", $$EmptyState, {
		"title": "Sin compras registradas",
		"description": "Cuando registres una venta con esta clienta, aparecerá aquí."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Button", $$Button, { "href": "/ventas/nueva" }, { "default": ($$result) => renderTemplate`Registrar venta` })}` })}`}${historial.length > 0 && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<table class="data-table hidden md:table"><thead><tr><th scope="col">Fecha</th><th scope="col" class="text-right">Ítems</th><th scope="col">Método</th><th scope="col" class="text-right">Total</th><th scope="col">Estado</th></tr></thead><tbody>${historial.map((v) => renderTemplate`<tr><td><a${addAttribute(`/ventas/${v.id}`, "href")} class="font-medium text-ink hover:text-wine">${formatFechaCorta(v.fecha)}</a></td><td class="text-right num">${v.num_items}</td><td class="text-ink-muted">${metodos[v.metodo_pago] ?? v.metodo_pago}</td><td class="text-right num font-display">${formatCOP(v.total)}</td><td>${v.anulada ? renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "tone": "danger" }, { "default": ($$result) => renderTemplate`Anulada` })}` : v.credito ? renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "tone": "wine" }, { "default": ($$result) => renderTemplate`${v.saldo > 0 ? `Debe ${formatCOP(v.saldo)}` : "Crédito · pagada"}` })}` : renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "tone": "success" }, { "default": ($$result) => renderTemplate`Validada` })}`}</td></tr>`)}</tbody></table><ul class="divide-y divide-hairline md:hidden">${historial.map((v) => renderTemplate`<li><a${addAttribute(`/ventas/${v.id}`, "href")} class="flex items-center gap-3 p-4"><div class="min-w-0 flex-1"><p class="font-medium text-ink">${formatFechaCorta(v.fecha)}</p><p class="text-xs text-ink-muted">${v.num_items} ${v.num_items === 1 ? "producto" : "productos"} ·${" "}${metodos[v.metodo_pago] ?? v.metodo_pago}</p></div><div class="text-right"><p class="num font-display text-sm">${formatCOP(v.total)}</p><p class="mt-0.5">${v.anulada ? renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "tone": "danger" }, { "default": ($$result) => renderTemplate`Anulada` })}` : v.credito ? renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "tone": "wine" }, { "default": ($$result) => renderTemplate`${v.saldo > 0 ? `Debe ${formatCOP(v.saldo)}` : "Crédito · pagada"}` })}` : renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "tone": "success" }, { "default": ($$result) => renderTemplate`Validada` })}`}</p></div></a></li>`)}</ul>` })}`}</div>` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/clientas/[id].astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/clientas/[id].astro";
var $$url = "/clientas/[id]";
//#endregion
//#region \0virtual:astro:page:src/pages/clientas/[id]@_@astro
var page = () => _id__exports;
//#endregion
export { page };
