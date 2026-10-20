import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, j as maybeRenderHead, w as renderComponent } from "./sequence_DxXwX9gt.mjs";
import { n as createComponent } from "./compiler_Ij6EkFK0.mjs";
import { n as $$DashboardLayout, t as $$PageHeader } from "./PageHeader_iP2MHsvI.mjs";
import { t as $$Card } from "./Card_8fk1xYlF.mjs";
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
