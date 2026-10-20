import { A as renderTemplate, D as renderSlot, N as addAttribute, j as maybeRenderHead } from "./sequence_CIT0iznN.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
//#region src/components/ui/EmptyState.astro
createAstro("https://astro.build");
var $$EmptyState = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$EmptyState;
	const { title, description, class: className = "" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["flex flex-col items-center gap-3 px-6 py-14 text-center", className], "class:list")}><div class="text-rose">${renderSlot($$result, $$slots["icon"])}</div><div class="space-y-1"><p class="font-display text-lg font-medium text-ink" style="font-variation-settings: 'opsz' 40;">${title}</p>${description && renderTemplate`<p class="mx-auto max-w-sm text-sm text-ink-muted">${description}</p>`}</div>${renderSlot($$result, $$slots["default"])}</div>`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/components/ui/EmptyState.astro", void 0);
//#endregion
export { $$EmptyState as t };
