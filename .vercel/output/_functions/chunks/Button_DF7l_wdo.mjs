import { A as renderTemplate, D as renderSlot, M as renderHead, N as addAttribute, j as maybeRenderHead, x as spreadAttributes } from "./sequence_CIT0iznN.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
//#region src/layouts/BaseLayout.astro
createAstro("https://astro.build");
var $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BaseLayout;
	const { title, description = "Panel de control" } = Astro.props;
	return renderTemplate`<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description"${addAttribute(description, "content")}><meta name="generator"${addAttribute(Astro.generator, "content")}><link rel="icon" href="/favicon.svg" type="image/svg+xml"><title>${title}</title>${renderHead($$result)}</head><body>${renderSlot($$result, $$slots["default"])}</body></html>`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/layouts/BaseLayout.astro", void 0);
//#endregion
//#region src/components/Valeria.astro
createAstro("https://astro.build");
var $$Valeria = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Valeria;
	const { variant = "sidebar", class: className = "" } = Astro.props;
	const tono = variant === "sidebar" ? {
		nombre: "text-paper",
		apellido: "text-rose"
	} : {
		nombre: "text-ink",
		apellido: "text-wine"
	};
	return renderTemplate`${maybeRenderHead($$result)}<span${addAttribute(["inline-flex items-center gap-2.5", className], "class:list")}><img src="/logo.svg" alt=""${addAttribute(["shrink-0", variant === "sidebar" ? "h-6 w-6" : "h-9 w-9"], "class:list")} aria-hidden="true"><span${addAttribute(["font-display italic leading-none", tono.nombre], "class:list")} style="font-variation-settings: 'opsz' 144, 'wght' 560, 'SOFT' 40, 'WONK' 1;">Valeria <span${addAttribute(tono.apellido, "class")}>Eslava</span></span></span>`;
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
//#region src/components/ui/Button.astro
createAstro("https://astro.build");
var $$Button = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Button;
	const { variant = "primary", size = "md", class: className = "", href, type = "button", disabled = false, ...rest } = Astro.props;
	const classes = `inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors disabled:opacity-50 disabled:pointer-events-none ${{
		primary: "bg-pink text-ink hover:bg-pink-hover",
		outline: "border border-ink/15 bg-surface text-ink hover:border-ink/35",
		ghost: "text-ink-muted hover:text-ink hover:bg-ink/5",
		danger: "bg-danger text-white hover:bg-danger/90"
	}[variant]} ${{
		sm: "h-8 px-2.5 text-[13px]",
		md: "h-9.5 px-4 text-sm",
		lg: "h-11 px-6 text-[15px]"
	}[size]} ${className}`;
	return renderTemplate`${href ? renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(href, "href")}${addAttribute(classes, "class")}${spreadAttributes(rest)}>${renderSlot($$result, $$slots["default"])}</a>` : renderTemplate`<button${addAttribute(type, "type")}${addAttribute(classes, "class")}${addAttribute(disabled, "disabled")}${spreadAttributes(rest)}>${renderSlot($$result, $$slots["default"])}</button>`}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/components/ui/Button.astro", void 0);
//#endregion
export { $$BaseLayout as i, $$Footer as n, $$Valeria as r, $$Button as t };
