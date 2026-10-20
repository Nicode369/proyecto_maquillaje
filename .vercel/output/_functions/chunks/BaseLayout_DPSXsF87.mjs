import { A as renderTemplate, D as renderSlot, M as renderHead, N as addAttribute } from "./sequence_DxXwX9gt.mjs";
import { n as createComponent, t as createAstro } from "./compiler_Ij6EkFK0.mjs";
//#region src/layouts/BaseLayout.astro
createAstro("https://astro.build");
var $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BaseLayout;
	const { title, description = "Panel de control" } = Astro.props;
	return renderTemplate`<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description"${addAttribute(description, "content")}><meta name="generator"${addAttribute(Astro.generator, "content")}><link rel="icon" href="/favicon.svg" type="image/svg+xml"><title>${title}</title>${renderHead($$result)}</head><body>${renderSlot($$result, $$slots["default"])}</body></html>`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/layouts/BaseLayout.astro", void 0);
//#endregion
export { $$BaseLayout as t };
