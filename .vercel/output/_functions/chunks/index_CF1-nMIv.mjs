import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, j as maybeRenderHead, w as renderComponent } from "./sequence_CIT0iznN.mjs";
import { n as createComponent } from "./compiler_D5p6FHCN.mjs";
import { n as $$DashboardLayout, t as $$PageHeader } from "./PageHeader_BRSlfRBK.mjs";
import { t as $$Card } from "./Card_bgah6ivS.mjs";
//#region src/pages/gastos/index.astro
var gastos_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, {
		"title": "Gastos",
		"active": "gastos"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHeader", $$PageHeader, {
		"title": "Gastos",
		"description": "Salidas y costos del negocio"
	})}${renderComponent($$result, "Card", $$Card, { "class": "mt-6" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<p class="text-sm text-ink-muted">Módulo de gastos (próxima fase).</p>` })}` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/gastos/index.astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/gastos/index.astro";
var $$url = "/gastos";
//#endregion
//#region \0virtual:astro:page:src/pages/gastos/index@_@astro
var page = () => gastos_exports;
//#endregion
export { page };
