import { n as createComponent, r as __exportAll, t as createAstro } from "./compiler_B0MireoY.mjs";
import { d as maybeRenderHead, f as renderHead, i as renderComponent, p as addAttribute, s as renderSlot, u as renderTemplate } from "./server_CqCnuaT5.mjs";
//#region src/layouts/BaseLayout.astro
createAstro("https://astro.build");
var $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BaseLayout;
	const { title, description = "Panel de control" } = Astro.props;
	return renderTemplate`<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description"${addAttribute(description, "content")}><meta name="generator"${addAttribute(Astro.generator, "content")}><link rel="icon" href="/favicon.svg" type="image/svg+xml"><title>${title}</title>${renderHead($$result)}</head><body>${renderSlot($$result, $$slots["default"])}</body></html>`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/layouts/BaseLayout.astro", void 0);
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Panel · Maquillaje" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main class="mx-auto max-w-3xl px-6 py-20"><p class="text-sm text-ink-muted">Fase 1</p><h1 class="display-number mt-2 text-4xl text-ink">Panel de control</h1><p class="mt-3 max-w-md text-ink-muted">Base del proyecto lista. Sigue las fases del plan: base de datos, login, ventas, productos, gastos y clientas.</p></main>` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/index.astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
