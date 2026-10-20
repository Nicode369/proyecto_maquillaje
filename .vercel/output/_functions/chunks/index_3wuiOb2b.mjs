import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as maybeRenderHead, k as renderTemplate, w as renderComponent } from "./sequence_vYO_GrXQ.mjs";
import { n as createComponent } from "./compiler_DTgN-O7B.mjs";
import { n as $$PageHeader, r as $$DashboardLayout, t as $$Card } from "./Card_C-aqIWa9.mjs";
//#region src/pages/ventas/index.astro
var ventas_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, {
		"title": "Ventas",
		"active": "ventas"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHeader", $$PageHeader, {
		"title": "Ventas",
		"description": "Historial e ingresos del negocio"
	})}${renderComponent($$result, "Card", $$Card, { "class": "mt-6" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<p class="text-sm text-ink-muted">Módulo de ventas (próxima fase).</p>` })}` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/ventas/index.astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/ventas/index.astro";
var $$url = "/ventas";
//#endregion
//#region \0virtual:astro:page:src/pages/ventas/index@_@astro
var page = () => ventas_exports;
//#endregion
export { page };
