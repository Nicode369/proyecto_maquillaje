import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, T as Fragment, j as maybeRenderHead, w as renderComponent } from "./sequence_CIT0iznN.mjs";
import { T as isInputError } from "./server_BEVzeFh0.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
import { c as mesISO, i as formatFechaCorta, n as $$DashboardLayout, r as formatCOP, t as $$PageHeader } from "./PageHeader_3aUZLUo6.mjs";
import { t as actions } from "./_astro_actions_Dafzj-nN.mjs";
import { n as countClientesNuevasEsteMes, o as listClientes, t as countClientes } from "./clientes_DmH0mKyw.mjs";
import { t as $$Button } from "./Button_DJ9kh447.mjs";
import { n as Pencil, t as Trash } from "./trash_Bcyx3V6J.mjs";
import { n as Search, r as Plus, t as $$LimpiarFiltros } from "./LimpiarFiltros_CivpslyM.mjs";
import { t as $$Input } from "./Input_BqhAvSAl.mjs";
import { t as $$EmptyState } from "./EmptyState_s9NtGM7p.mjs";
//#region src/pages/clientas/index.astro
var clientas_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const q = Astro.url.searchParams.get("q")?.trim() || void 0;
	const eliminar = Astro.getActionResult(actions.clientes.eliminar);
	if (eliminar && !eliminar.error) return Astro.redirect(`/clientas${q ? `?q=${encodeURIComponent(q)}` : ""}`);
	const [lista, total, nuevas] = await Promise.all([
		listClientes(q),
		countClientes(),
		countClientesNuevasEsteMes(mesISO())
	]);
	const hayBusqueda = Boolean(q);
	const errorEliminar = eliminar?.error && !isInputError(eliminar.error) ? eliminar.error.message : null;
	const mensajeConfirmar = "¿Eliminar esta clienta? Esta acción no se puede deshacer.";
	return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, {
		"title": "Clientas",
		"active": "clientas"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHeader", $$PageHeader, {
		"title": "Clientas",
		"description": `${total} ${total === 1 ? "registrada" : "registradas"} · ${nuevas} ${nuevas === 1 ? "nueva" : "nuevas"} este mes`
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Button", $$Button, { "href": "/clientas/nueva" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Plus", Plus, { "size": 15 })} Nueva clienta` })}` })}${maybeRenderHead($$result)}<form method="GET" action="/clientas" class="mt-6 flex max-w-md gap-2">${renderComponent($$result, "Input", $$Input, {
		"name": "q",
		"type": "search",
		"label": "Buscar",
		"placeholder": "Por nombre, teléfono o correo",
		"value": q ?? "",
		"class": "flex-1"
	})}${renderComponent($$result, "Button", $$Button, {
		"variant": "outline",
		"type": "submit",
		"class": "mt-5.5 shrink-0"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Search", Search, { "size": 15 })} Buscar
    ` })}</form>${hayBusqueda && renderTemplate`${renderComponent($$result, "LimpiarFiltros", $$LimpiarFiltros, {
		"href": "/clientas",
		"class": "mt-3"
	})}`}${errorEliminar && renderTemplate`<div class="mt-4 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">${errorEliminar}</div>`}<div class="mt-6 overflow-hidden rounded-xl border border-hairline bg-surface">${lista.length === 0 && renderTemplate`${renderComponent($$result, "EmptyState", $$EmptyState, {
		"title": hayBusqueda ? "Sin resultados" : "Aún no hay clientas",
		"description": hayBusqueda ? `No encontramos clientas que coincidan con «${q}».` : "Registra a tus clientas para llevar su historial de compras."
	}, { "default": ($$result) => renderTemplate`${hayBusqueda ? renderTemplate`${renderComponent($$result, "Button", $$Button, {
		"variant": "outline",
		"href": "/clientas"
	}, { "default": ($$result) => renderTemplate`
              Ver todas
            ` })}` : renderTemplate`${renderComponent($$result, "Button", $$Button, { "href": "/clientas/nueva" }, { "default": ($$result) => renderTemplate`Registrar clienta` })}`}` })}`}${lista.length > 0 && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<table class="data-table hidden md:table"><thead><tr><th scope="col">Nombre</th><th scope="col">Teléfono</th><th scope="col" class="text-right">Compras</th><th scope="col" class="text-right">Gasto acumulado</th><th scope="col">Última compra</th><th scope="col"><span class="sr-only">Acciones</span></th></tr></thead><tbody>${lista.map((c) => renderTemplate`<tr><td><a${addAttribute(`/clientas/${c.id}`, "href")} class="font-medium text-ink hover:text-wine">${c.nombre}</a>${c.email && renderTemplate`<p class="mt-0.5 text-xs text-ink-muted">${c.email}</p>`}</td><td class="text-ink-muted">${c.telefono ?? "—"}</td><td class="text-right num">${c.total_compras}</td><td class="text-right num font-display">${formatCOP(c.gasto_acumulado)}</td><td class="text-ink-muted">${c.ultima_compra ? formatFechaCorta(c.ultima_compra) : "—"}</td><td><div class="flex justify-end gap-1">${renderComponent($$result, "Button", $$Button, {
		"variant": "ghost",
		"size": "sm",
		"href": `/clientas/${c.id}/editar`,
		"aria-label": `Editar a ${c.nombre}`
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Pencil", Pencil, { "size": 14 })}` })}<form method="POST"${addAttribute(actions.clientes.eliminar, "action")}><input type="hidden" name="id"${addAttribute(c.id, "value")}>${renderComponent($$result, "Button", $$Button, {
		"variant": "ghost",
		"size": "sm",
		"type": "submit",
		"class": "text-danger hover:bg-danger/10 hover:text-danger",
		"aria-label": `Eliminar a ${c.nombre}`,
		"onclick": `return confirm('${mensajeConfirmar}')`
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Trash", Trash, { "size": 14 })}` })}</form></div></td></tr>`)}</tbody></table><ul class="divide-y divide-hairline md:hidden">${lista.map((c) => renderTemplate`<li class="flex items-start gap-3 p-4"><a${addAttribute(`/clientas/${c.id}`, "href")} class="min-w-0 flex-1 hover:text-wine"><p class="truncate font-medium text-ink">${c.nombre}</p><p class="truncate text-xs text-ink-muted">${c.telefono ?? "Sin teléfono"}${c.email ? ` · ${c.email}` : ""}</p><p class="mt-1 text-xs text-ink-muted">Última compra:${" "}${c.ultima_compra ? formatFechaCorta(c.ultima_compra) : "—"}</p></a><div class="flex shrink-0 flex-col items-end gap-1"><p class="num font-display text-sm">${formatCOP(c.gasto_acumulado)}</p><p class="text-xs text-ink-muted">${c.total_compras}${" "}${c.total_compras === 1 ? "compra" : "compras"}</p><div class="mt-1 flex gap-1">${renderComponent($$result, "Button", $$Button, {
		"variant": "ghost",
		"size": "sm",
		"href": `/clientas/${c.id}/editar`,
		"aria-label": `Editar a ${c.nombre}`
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Pencil", Pencil, { "size": 14 })}` })}<form method="POST"${addAttribute(actions.clientes.eliminar, "action")}><input type="hidden" name="id"${addAttribute(c.id, "value")}>${renderComponent($$result, "Button", $$Button, {
		"variant": "ghost",
		"size": "sm",
		"type": "submit",
		"class": "text-danger hover:bg-danger/10 hover:text-danger",
		"aria-label": `Eliminar a ${c.nombre}`,
		"onclick": `return confirm('${mensajeConfirmar}')`
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Trash", Trash, { "size": 14 })}` })}</form></div></div></li>`)}</ul>` })}`}</div>${lista.length > 0 && renderTemplate`<p class="mt-3 text-xs text-ink-muted">Mostrando ${lista.length} de ${total}${hayBusqueda ? " · búsqueda activa" : ""}</p>`}` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/clientas/index.astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/clientas/index.astro";
var $$url = "/clientas";
//#endregion
//#region \0virtual:astro:page:src/pages/clientas/index@_@astro
var page = () => clientas_exports;
//#endregion
export { page };
