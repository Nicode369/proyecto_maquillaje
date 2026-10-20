import { A as renderTemplate, N as addAttribute, j as maybeRenderHead, x as spreadAttributes } from "./sequence_DxXwX9gt.mjs";
import { n as createComponent, t as createAstro } from "./compiler_Ij6EkFK0.mjs";
//#region src/components/ui/Checkbox.astro
createAstro("https://astro.build");
var $$Checkbox = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Checkbox;
	const { name, label, checked = false, value = "true", error, hint, ...rest } = Astro.props;
	const inputId = name;
	const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : void 0;
	return renderTemplate`${maybeRenderHead($$result)}<div class="space-y-1.5"><label${addAttribute(inputId, "for")} class="flex cursor-pointer items-start gap-2.5 text-sm text-ink"><input${addAttribute(inputId, "id")}${addAttribute(name, "name")} type="checkbox"${addAttribute(value, "value")}${addAttribute(checked, "checked")}${addAttribute(error ? "true" : void 0, "aria-invalid")}${addAttribute(describedBy, "aria-describedby")} class="mt-0.5 size-4 shrink-0 accent-wine"${spreadAttributes(rest)}><span>${label}${hint && renderTemplate`<span${addAttribute(`${name}-hint`, "id")} class="mt-0.5 block text-[13px] text-ink-muted">${hint}</span>`}</span></label>${error && renderTemplate`<p${addAttribute(`${name}-error`, "id")} class="text-[13px] text-danger">${error}</p>`}</div>`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/components/ui/Checkbox.astro", void 0);
//#endregion
export { $$Checkbox as t };
