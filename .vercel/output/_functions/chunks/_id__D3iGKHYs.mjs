import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, D as renderSlot, N as addAttribute, T as Fragment, j as maybeRenderHead, w as renderComponent } from "./sequence_DxXwX9gt.mjs";
import { T as isInputError } from "./server_UmxkaEb9.mjs";
import { n as createComponent, t as createAstro } from "./compiler_Ij6EkFK0.mjs";
import { i as formatFechaCorta, n as $$DashboardLayout, r as formatCOP, t as $$PageHeader } from "./PageHeader_iP2MHsvI.mjs";
import { t as actions } from "./_astro_actions_B_qDQafb.mjs";
import { a as getCliente, c as sql } from "./clientes_fbSkGmRO.mjs";
import { n as Trash, r as Pencil, t as $$EmptyState } from "./EmptyState_D_zndXjN.mjs";
import { t as $$Button } from "./Button_0TjvdLdx.mjs";
import { t as $$Card } from "./Card_8fk1xYlF.mjs";
//#region src/components/ui/Badge.astro
createAstro("https://astro.build");
var $$Badge = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Badge;
	const { tone = "neutral", class: className = "" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<span${addAttribute([
		"inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap",
		{
			neutral: "bg-ink/6 text-ink-muted",
			success: "bg-sage/10 text-sage",
			warning: "bg-ochre/10 text-ochre",
			danger: "bg-danger/10 text-danger",
			wine: "bg-wine-soft text-wine"
		}[tone],
		className
	], "class:list")}>${renderSlot($$result, $$slots["default"])}</span>`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/components/ui/Badge.astro", void 0);
//#endregion
//#region src/lib/queries/ventas.ts
async function listVentasDeCliente(clienteId) {
	return await sql`
    SELECT
      v.id,
      v.cliente_id,
      c.nombre AS cliente_nombre,
      v.fecha::text AS fecha,
      v.metodo_pago,
      v.descuento::float8 AS descuento,
      v.total::float8 AS total,
      v.notas,
      v.anulada,
      (
        SELECT COUNT(*)::int FROM venta_items i WHERE i.venta_id = v.id
      ) AS num_items
    FROM ventas v
    LEFT JOIN clientes c ON c.id = v.cliente_id
    WHERE v.cliente_id = ${clienteId}
    ORDER BY v.fecha DESC, v.created_at DESC`;
}
//#endregion
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
      ` })}</form>` })}${errorEliminar && renderTemplate`<div class="mt-4 rounded border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">${errorEliminar}</div>`}<div class="mt-6 grid grid-cols-1 divide-y divide-hairline rounded-md border border-hairline bg-surface sm:grid-cols-3 sm:divide-x sm:divide-y-0"><div class="p-5"><p class="text-xs tracking-wide text-ink-muted uppercase">Compras</p><p class="display-number mt-1 text-2xl text-ink">${cliente.total_compras}</p></div><div class="p-5"><p class="text-xs tracking-wide text-ink-muted uppercase">Gasto acumulado</p><p class="display-number mt-1 text-2xl text-wine">${formatCOP(cliente.gasto_acumulado)}</p></div><div class="p-5"><p class="text-xs tracking-wide text-ink-muted uppercase">Última compra</p><p class="display-number mt-1 text-2xl text-ink">${cliente.ultima_compra ? formatFechaCorta(cliente.ultima_compra) : "—"}</p></div></div>${cliente.notas && renderTemplate`${renderComponent($$result, "Card", $$Card, { "class": "mt-4" }, { "default": ($$result) => renderTemplate`<p class="text-xs tracking-wide text-ink-muted uppercase">Notas</p><p class="mt-1.5 text-sm whitespace-pre-wrap text-ink">${cliente.notas}</p>` })}`}${cliente.email && renderTemplate`<p class="mt-3 text-xs text-ink-muted">Cliente desde el ${formatFechaCorta(cliente.created_at)} · ${cliente.email}</p>`}<h2 class="mt-8 border-b border-hairline pb-2 font-display text-lg text-ink" style="font-variation-settings: 'opsz' 40;">Historial de compras</h2><div class="mt-4 overflow-hidden rounded-md border border-hairline bg-surface">${historial.length === 0 && renderTemplate`${renderComponent($$result, "EmptyState", $$EmptyState, {
		"title": "Sin compras registradas",
		"description": "Cuando registres una venta con esta clienta, aparecerá aquí."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Button", $$Button, { "href": "/ventas/nueva" }, { "default": ($$result) => renderTemplate`Registrar venta` })}` })}`}${historial.length > 0 && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<table class="data-table hidden md:table"><thead><tr><th scope="col">Fecha</th><th scope="col" class="text-right">Ítems</th><th scope="col">Método</th><th scope="col" class="text-right">Total</th><th scope="col">Estado</th></tr></thead><tbody>${historial.map((v) => renderTemplate`<tr><td><a${addAttribute(`/ventas/${v.id}`, "href")} class="font-medium text-ink hover:text-wine">${formatFechaCorta(v.fecha)}</a></td><td class="text-right num">${v.num_items}</td><td class="text-ink-muted">${metodos[v.metodo_pago] ?? v.metodo_pago}</td><td class="text-right num font-display">${formatCOP(v.total)}</td><td>${v.anulada ? renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "tone": "danger" }, { "default": ($$result) => renderTemplate`Anulada` })}` : renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "tone": "success" }, { "default": ($$result) => renderTemplate`Validada` })}`}</td></tr>`)}</tbody></table><ul class="divide-y divide-hairline md:hidden">${historial.map((v) => renderTemplate`<li><a${addAttribute(`/ventas/${v.id}`, "href")} class="flex items-center gap-3 p-4"><div class="min-w-0 flex-1"><p class="font-medium text-ink">${formatFechaCorta(v.fecha)}</p><p class="text-xs text-ink-muted">${v.num_items} ${v.num_items === 1 ? "producto" : "productos"} ·${" "}${metodos[v.metodo_pago] ?? v.metodo_pago}</p></div><div class="text-right"><p class="num font-display text-sm">${formatCOP(v.total)}</p><p class="mt-0.5">${v.anulada ? renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "tone": "danger" }, { "default": ($$result) => renderTemplate`Anulada` })}` : renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "tone": "success" }, { "default": ($$result) => renderTemplate`Validada` })}`}</p></div></a></li>`)}</ul>` })}`}</div>` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/clientas/[id].astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/clientas/[id].astro";
var $$url = "/clientas/[id]";
//#endregion
//#region \0virtual:astro:page:src/pages/clientas/[id]@_@astro
var page = () => _id__exports;
//#endregion
export { page };
