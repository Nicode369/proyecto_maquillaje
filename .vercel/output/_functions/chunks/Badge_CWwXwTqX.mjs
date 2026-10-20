import { A as renderTemplate, D as renderSlot, N as addAttribute, j as maybeRenderHead } from "./sequence_DxXwX9gt.mjs";
import { n as createComponent, t as createAstro } from "./compiler_Ij6EkFK0.mjs";
//#region src/components/ui/Badge.astro
createAstro("https://astro.build");
var $$Badge = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Badge;
	const { tone = "neutral", class: className = "" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<span${addAttribute([
		"inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap",
		{
			neutral: "bg-ink/6 text-ink-muted",
			success: "bg-sage/10 text-sage",
			warning: "bg-ochre/10 text-ochre",
			danger: "bg-danger/10 text-danger",
			wine: "bg-wine-soft text-wine"
		}[tone],
		className
	], "class:list")}>${renderSlot($$result, $$slots["default"])}</span>`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/components/ui/Badge.astro", void 0);
//#endregion
export { $$Badge as t };
