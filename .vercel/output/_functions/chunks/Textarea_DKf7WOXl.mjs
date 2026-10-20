import { A as renderTemplate, N as addAttribute, j as maybeRenderHead, x as spreadAttributes } from "./sequence_CIT0iznN.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
//#region src/components/ui/Textarea.astro
createAstro("https://astro.build");
var $$Textarea = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Textarea;
	const { name, label, placeholder, value, error, required = false, rows = 3, class: className = "", ...rest } = Astro.props;
	const inputId = name;
	const describedBy = error ? `${name}-error` : void 0;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["space-y-1.5", className], "class:list")}>${label && renderTemplate`<label${addAttribute(inputId, "for")} class="block text-[13px] font-medium text-ink">${label}</label>`}<textarea${addAttribute(inputId, "id")}${addAttribute(name, "name")}${addAttribute(placeholder, "placeholder")}${addAttribute(rows, "rows")}${addAttribute(required, "required")}${addAttribute(error ? "true" : void 0, "aria-invalid")}${addAttribute(describedBy, "aria-describedby")}${addAttribute([
		"w-full rounded border bg-surface px-3 py-2 text-sm text-ink",
		"placeholder:text-ink-muted/60 transition-colors resize-y",
		"focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/15",
		error ? "border-danger" : "border-ink/15"
	], "class:list")}${spreadAttributes(rest)}>${value}</textarea>${error && renderTemplate`<p${addAttribute(describedBy, "id")} class="text-[13px] text-danger">${error}</p>`}</div>`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/components/ui/Textarea.astro", void 0);
//#endregion
export { $$Textarea as t };
