import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_CIT0iznN.mjs";
import { T as isInputError } from "./server_gH9IudIp.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
import { a as formatFechaLarga, l as createLucideIcon, n as $$DashboardLayout, r as formatCOP, t as $$PageHeader } from "./PageHeader_BuM2ijBn.mjs";
import { t as actions } from "./_astro_actions_Bb_80P29.mjs";
import { r as getVenta } from "./ventas_BBpED52g.mjs";
import { t as $$Button } from "./Button_Dm_iL_zf.mjs";
import { t as $$Badge } from "./Badge_DYdURA09.mjs";
import { t as $$Card } from "./Card_B-sRX80l.mjs";
//#region node_modules/@lucide/astro/src/icons/arrow-left.ts
/**
* @component @name ArrowLeft
* @description Lucide SVG icon component, renders SVG Element with children.
*
* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTIgMTktNy03IDctNyIgLz4KICA8cGF0aCBkPSJNMTkgMTJINSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/arrow-left
* @see https://lucide.dev/guide/packages/lucide-astro - Documentation
*
* @param {import('../types').IconProps} props - Lucide icons props and any valid SVG attribute
* @returns {any} Astro Component
* 
*/
var ArrowLeft = createLucideIcon({
	"name": "arrow-left",
	"size": 24,
	"node": [["path", { "d": "m12 19-7-7 7-7" }], ["path", { "d": "M19 12H5" }]]
});
//#endregion
//#region node_modules/@lucide/astro/src/icons/ban.ts
/**
* @component @name Ban
* @description Lucide SVG icon component, renders SVG Element with children.
*
* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNNC45MjkgNC45MjkgMTkuMDcgMTkuMDcxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/ban
* @see https://lucide.dev/guide/packages/lucide-astro - Documentation
*
* @param {import('../types').IconProps} props - Lucide icons props and any valid SVG attribute
* @returns {any} Astro Component
* 
*/
var Ban = createLucideIcon({
	"name": "ban",
	"size": 24,
	"node": [["circle", {
		"cx": "12",
		"cy": "12",
		"r": "10"
	}], ["path", { "d": "M4.929 4.929 19.07 19.071" }]]
});
//#endregion
//#region src/pages/ventas/[id].astro
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
	const venta = id ? await getVenta(id) : null;
	if (!venta) return new Response("Venta no encontrada", { status: 404 });
	const anular = Astro.getActionResult(actions.ventas.anular);
	if (anular && !anular.error) return Astro.redirect(`/ventas/${venta.id}`);
	const errorAnular = anular?.error && !isInputError(anular.error) ? anular.error.message : null;
	const metodos = {
		efectivo: "Efectivo",
		nequi: "Nequi",
		daviplata: "Daviplata",
		bancolombia: "Bancolombia",
		transferencia: "Transferencia",
		tarjeta: "Tarjeta"
	};
	const subtotal = venta.items.reduce((sum, it) => sum + it.subtotal, 0);
	const mensajeAnular = "¿Anular esta venta? El stock de los productos se restaurará.";
	return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, {
		"title": `Venta · ${formatCOP(venta.total)}`,
		"active": "ventas"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHeader", $$PageHeader, {
		"title": formatCOP(venta.total),
		"description": `${formatFechaLarga(venta.fecha)} · ${venta.cliente_nombre ?? "Sin clienta asignada"}`
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Button", $$Button, {
		"variant": "outline",
		"href": "/ventas"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "ArrowLeft", ArrowLeft, { "size": 15 })} Volver
    ` })}${!venta.anulada && renderTemplate`${maybeRenderHead($$result)}<form method="POST"${addAttribute(actions.ventas.anular, "action")}><input type="hidden" name="id"${addAttribute(venta.id, "value")}>${renderComponent($$result, "Button", $$Button, {
		"variant": "ghost",
		"type": "submit",
		"class": "text-danger hover:bg-danger/10 hover:text-danger",
		"onclick": `return confirm('${mensajeAnular}')`
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Ban", Ban, { "size": 15 })} Anular venta
          ` })}</form>`}` })}${errorAnular && renderTemplate`<div class="mt-4 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">${errorAnular}</div>`}<div class="mt-6 grid gap-4 sm:grid-cols-3">${renderComponent($$result, "Card", $$Card, {}, { "default": ($$result) => renderTemplate`<p class="text-xs tracking-wide text-ink-muted uppercase">Estado</p><div class="mt-2">${venta.anulada ? renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "tone": "danger" }, { "default": ($$result) => renderTemplate`Anulada` })}` : renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "tone": "success" }, { "default": ($$result) => renderTemplate`Validada` })}`}</div>` })}${renderComponent($$result, "Card", $$Card, {}, { "default": ($$result) => renderTemplate`<p class="text-xs tracking-wide text-ink-muted uppercase">Método de pago</p><p class="mt-1.5 font-display text-lg text-ink">${metodos[venta.metodo_pago.toLowerCase()] ?? venta.metodo_pago}</p>` })}${renderComponent($$result, "Card", $$Card, {}, { "default": ($$result) => renderTemplate`<p class="text-xs tracking-wide text-ink-muted uppercase">Descuento</p><p class="mt-1.5 font-display text-lg text-ink">${venta.descuento > 0 ? `−${formatCOP(venta.descuento)}` : "Sin descuento"}</p>` })}</div>${venta.notas && renderTemplate`${renderComponent($$result, "Card", $$Card, { "class": "mt-4" }, { "default": ($$result) => renderTemplate`<p class="text-xs tracking-wide text-ink-muted uppercase">Notas</p><p class="mt-1.5 text-sm whitespace-pre-wrap text-ink">${venta.notas}</p>` })}`}<h2 class="mt-8 border-b border-hairline pb-2 font-display text-lg text-ink" style="font-variation-settings: 'opsz' 40;">Productos y servicios</h2><div class="mt-4 overflow-hidden rounded-xl border border-hairline bg-surface"><table class="data-table"><thead><tr><th scope="col">Descripción</th><th scope="col" class="text-right">Cant.</th><th scope="col" class="text-right">Precio unit.</th><th scope="col" class="text-right">Subtotal</th></tr></thead><tbody>${venta.items.map((it) => renderTemplate`<tr><td class="text-ink">${it.descripcion}</td><td class="text-right num">${it.cantidad}</td><td class="text-right num text-ink-muted">${formatCOP(it.precio_unitario)}</td><td class="text-right num font-display">${formatCOP(it.subtotal)}</td></tr>`)}</tbody><tfoot><tr class="border-t border-hairline"><td colspan="3" class="text-right text-sm text-ink-muted">Subtotal</td><td class="text-right num">${formatCOP(subtotal)}</td></tr>${venta.descuento > 0 && renderTemplate`<tr><td colspan="3" class="text-right text-sm text-ink-muted">Descuento</td><td class="text-right num text-danger">−${formatCOP(venta.descuento)}</td></tr>`}<tr class="border-t border-hairline bg-ink/3"><td colspan="3" class="text-right font-display text-base font-medium">Total</td><td class="text-right num font-display text-lg font-medium text-wine">${formatCOP(venta.total)}</td></tr></tfoot></table></div>` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/ventas/[id].astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/ventas/[id].astro";
var $$url = "/ventas/[id]";
//#endregion
//#region \0virtual:astro:page:src/pages/ventas/[id]@_@astro
var page = () => _id__exports;
//#endregion
export { page };
