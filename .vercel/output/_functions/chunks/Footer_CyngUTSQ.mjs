import { A as renderTemplate, D as renderSlot, M as renderHead, N as addAttribute, j as maybeRenderHead } from "./sequence_CIT0iznN.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
//#region src/layouts/BaseLayout.astro
createAstro("https://astro.build");
var $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BaseLayout;
	const { title, description = "Panel de control" } = Astro.props;
	return renderTemplate`<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="description"${addAttribute(description, "content")}><meta name="generator"${addAttribute(Astro.generator, "content")}><link rel="icon" href="/favicon.svg" type="image/svg+xml"><title>${title}</title>${renderHead($$result)}</head><body>${renderSlot($$result, $$slots["default"])}</body></html>`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/layouts/BaseLayout.astro", void 0);
//#endregion
//#region src/components/Valeria.astro
createAstro("https://astro.build");
var $$Valeria = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Valeria;
	const { variant = "sidebar", class: className = "" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<span${addAttribute(["inline-flex items-center gap-2.5", className], "class:list")}><img src="/logo.svg" alt=""${addAttribute(["shrink-0", variant === "sidebar" ? "h-6 w-6" : "h-9 w-9"], "class:list")} aria-hidden="true"><span${addAttribute(["font-display italic leading-none text-ink"], "class:list")} style="font-variation-settings: 'opsz' 144, 'wght' 560, 'SOFT' 40, 'WONK' 1;">Valeria <span class="text-wine">Eslava</span></span></span>`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/components/Valeria.astro", void 0);
//#endregion
//#region src/components/Footer.astro
createAstro("https://astro.build");
var $$Footer = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Footer;
	const { class: className = "" } = Astro.props;
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	return renderTemplate`${maybeRenderHead($$result)}<footer${addAttribute(className, "class")}><p class="text-center text-xs text-ink-muted">© ${year} · Desarrollado por Nicode</p></footer>`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/components/Footer.astro", void 0);
//#endregion
export { $$Valeria as n, $$BaseLayout as r, $$Footer as t };
