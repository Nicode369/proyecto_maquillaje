import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as maybeRenderHead, k as renderTemplate, w as renderComponent } from "./sequence_vYO_GrXQ.mjs";
import { n as createComponent } from "./compiler_DTgN-O7B.mjs";
import { n as $$PageHeader, r as $$DashboardLayout, t as $$Card } from "./Card_C-aqIWa9.mjs";
//#region src/pages/productos/index.astro
var productos_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, {
		"title": "Productos",
		"active": "productos"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHeader", $$PageHeader, {
		"title": "Productos",
		"description": "Inventario y precios"
	})}${renderComponent($$result, "Card", $$Card, { "class": "mt-6" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<p class="text-sm text-ink-muted">Módulo de productos (próxima fase).</p>` })}` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/productos/index.astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/productos/index.astro";
var $$url = "/productos";
//#endregion
//#region \0virtual:astro:page:src/pages/productos/index@_@astro
var page = () => productos_exports;
//#endregion
export { page };
