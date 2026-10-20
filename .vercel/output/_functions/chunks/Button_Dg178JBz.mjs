import { A as renderTemplate, D as renderSlot, N as addAttribute, j as maybeRenderHead, x as spreadAttributes } from "./sequence_CIT0iznN.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
//#region src/components/ui/Button.astro
createAstro("https://astro.build");
var $$Button = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Button;
	const { variant = "primary", size = "md", class: className = "", href, type = "button", disabled = false, ...rest } = Astro.props;
	const classes = `inline-flex items-center justify-center gap-2 rounded font-medium whitespace-nowrap transition-colors disabled:opacity-50 disabled:pointer-events-none ${{
		primary: "bg-wine text-white hover:bg-wine-hover",
		outline: "border border-ink/15 bg-surface text-ink hover:border-ink/35",
		ghost: "text-ink-muted hover:text-ink hover:bg-ink/5",
		danger: "bg-danger text-white hover:bg-danger/90"
	}[variant]} ${{
		sm: "h-8 px-2.5 text-[13px]",
		md: "h-9.5 px-4 text-sm"
	}[size]} ${className}`;
	return renderTemplate`${href ? renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(href, "href")}${addAttribute(classes, "class")}${spreadAttributes(rest)}>${renderSlot($$result, $$slots["default"])}</a>` : renderTemplate`<button${addAttribute(type, "type")}${addAttribute(classes, "class")}${addAttribute(disabled, "disabled")}${spreadAttributes(rest)}>${renderSlot($$result, $$slots["default"])}</button>`}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/components/ui/Button.astro", void 0);
//#endregion
export { $$Button as t };
