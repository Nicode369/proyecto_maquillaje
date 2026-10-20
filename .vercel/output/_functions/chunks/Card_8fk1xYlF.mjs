import { A as renderTemplate, D as renderSlot, N as addAttribute, j as maybeRenderHead } from "./sequence_DxXwX9gt.mjs";
import { n as createComponent, t as createAstro } from "./compiler_Ij6EkFK0.mjs";
//#region src/components/ui/Card.astro
createAstro("https://astro.build");
var $$Card = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Card;
	const { class: className = "", padded = true } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute([
		"rounded-md border border-hairline bg-surface",
		padded && "p-5",
		className
	], "class:list")}>${renderSlot($$result, $$slots["default"])}</div>`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/components/ui/Card.astro", void 0);
//#endregion
export { $$Card as t };
