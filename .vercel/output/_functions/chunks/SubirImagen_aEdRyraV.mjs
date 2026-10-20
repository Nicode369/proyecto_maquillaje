import { A as renderTemplate, N as addAttribute, j as maybeRenderHead, x as spreadAttributes } from "./sequence_CIT0iznN.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
import { u as renderScript } from "./PageHeader_DRqm_oFd.mjs";
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
//#region src/components/SubirImagen.astro
createAstro("https://astro.build");
var $$SubirImagen = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$SubirImagen;
	const { valor = null, error, class: className = "" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["space-y-2", className], "class:list")} data-uploader><span class="block text-[13px] font-medium text-ink">Foto del producto</span><div class="flex items-start gap-4"><div class="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-dashed border-ink/25 bg-surface" data-preview-contenedor><img${addAttribute(valor ?? void 0, "src")} alt="" class="h-full w-full object-cover" data-preview${addAttribute(!valor, "hidden")}><img src="/logo.svg" alt=""${addAttribute(["h-9 w-9 opacity-60", valor && "hidden"], "class:list")} data-placeholder aria-hidden="true"></div><div class="min-w-0 space-y-2"><label class="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-wine/40 bg-surface px-4 text-[13px] font-medium text-wine transition-colors hover:border-wine/60 hover:bg-wine-soft">Elegir foto<input type="file" accept="image/*" capture="environment" class="sr-only" data-archivo></label><p class="text-xs text-ink-muted">JPG, PNG o WebP · se recorta a 800 px</p><p><button type="button" class="text-xs text-ink-muted underline-offset-2 transition-colors hover:text-wine hover:underline" data-quitar${addAttribute(!valor, "hidden")}>Quitar foto</button></p><p class="text-xs text-danger" data-aviso hidden></p>${error && renderTemplate`<p class="text-xs text-danger">${error}</p>`}</div></div><input type="hidden" name="imagen"${addAttribute(valor ?? "", "value")} data-oculto></div>${renderScript($$result, "/home/nicode/Proyectos/proyecto_maquillaje/src/components/SubirImagen.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/components/SubirImagen.astro", void 0);
//#endregion
export { $$Checkbox as n, $$SubirImagen as t };
