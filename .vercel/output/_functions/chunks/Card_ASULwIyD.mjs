import { A as renderTemplate, D as renderSlot, N as addAttribute, j as maybeRenderHead } from "./sequence_CIT0iznN.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
//#region src/components/ui/Card.astro
createAstro("https://astro.build");
var $$Card = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Card;
	const { class: className = "", padded = true } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute([
		"rounded-xl border border-hairline bg-white shadow-[0_1px_2px_rgba(42,27,32,0.04)] transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(42,27,32,0.06)]",
		padded && "p-5",
		className
	], "class:list")}>${renderSlot($$result, $$slots["default"])}</div>`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/components/ui/Card.astro", void 0);
//#endregion
export { $$Card as t };
