import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_CIT0iznN.mjs";
import { T as isInputError } from "./server_Chmut7OB.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
import { n as $$DashboardLayout, t as $$PageHeader } from "./PageHeader_DRqm_oFd.mjs";
import { t as actions } from "./_astro_actions_D4kehWx-.mjs";
import { i as listCategoriasGasto, r as getGasto } from "./gastos_uFnzIew9.mjs";
import { t as $$Button } from "./Button_C8T8wdfZ.mjs";
import { t as $$Input } from "./Input_BqhAvSAl.mjs";
import { t as $$Textarea } from "./Textarea_Dk0Vx8FR.mjs";
//#region src/pages/gastos/[id]/editar.astro
var editar_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Editar,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Editar = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Editar;
	const { id } = Astro.params;
	const gasto = id ? await getGasto(id) : null;
	if (!gasto) return new Response("Gasto no encontrado", { status: 404 });
	const resultado = Astro.getActionResult(actions.gastos.actualizar);
	if (resultado && !resultado.error) return Astro.redirect("/gastos");
	const categorias = await listCategoriasGasto();
	const err = resultado?.error;
	const campos = isInputError(err) ? err.fields : {};
	const errorGenerico = err && !isInputError(err) ? err.message : null;
	let previos = {};
	if (Astro.request.method === "POST") try {
		const form = await Astro.request.formData();
		previos = Object.fromEntries(form.entries());
	} catch {
		previos = {};
	}
	const valor = (campo, guardado) => typeof previos[campo] === "string" ? previos[campo] : String(guardado);
	return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, {
		"title": "Editar gasto",
		"active": "gastos"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHeader", $$PageHeader, {
		"title": "Editar gasto",
		"description": `Actualiza el registro del ${gasto.descripcion.slice(0, 40)}`
	})}${maybeRenderHead($$result)}<form method="POST"${addAttribute(actions.gastos.actualizar, "action")} class="mt-6 max-w-xl space-y-4"><input type="hidden" name="id"${addAttribute(gasto.id, "value")}>${errorGenerico && renderTemplate`<div class="rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">${errorGenerico}</div>`}<div class="grid gap-4 sm:grid-cols-2">${renderComponent($$result, "Input", $$Input, {
		"name": "fecha",
		"label": "Fecha",
		"type": "date",
		"required": true,
		"value": valor("fecha", gasto.fecha),
		"error": campos.fecha?.[0]
	})}<div class="space-y-1.5"><label for="categoria" class="block text-[13px] font-medium text-ink">Categoría</label><input id="categoria" name="categoria" list="categorias-gasto" required placeholder="Ej: Insumos"${addAttribute(valor("categoria", gasto.categoria), "value")} class="h-9.5 w-full rounded-lg border border-ink/15 bg-surface px-3 text-sm text-ink placeholder:text-ink-muted/60 focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/15"${addAttribute(campos.categoria ? "true" : void 0, "aria-invalid")}${addAttribute(campos.categoria ? "categoria-error" : void 0, "aria-describedby")}><datalist id="categorias-gasto">${categorias.map((c) => renderTemplate`<option${addAttribute(c, "value")}></option>`)}</datalist>${campos.categoria && renderTemplate`<p id="categoria-error" class="text-[13px] text-danger">${campos.categoria[0]}</p>`}</div></div>${renderComponent($$result, "Textarea", $$Textarea, {
		"name": "descripcion",
		"label": "Descripción",
		"placeholder": "Ej: Compra de paletas y labiales",
		"rows": 2,
		"required": true,
		"value": valor("descripcion", gasto.descripcion),
		"error": campos.descripcion?.[0]
	})}${renderComponent($$result, "Input", $$Input, {
		"name": "monto",
		"label": "Monto (COP)",
		"type": "number",
		"min": "1",
		"step": "100",
		"required": true,
		"value": valor("monto", gasto.monto),
		"error": campos.monto?.[0]
	})}<div class="flex gap-2 border-t border-hairline pt-4">${renderComponent($$result, "Button", $$Button, { "type": "submit" }, { "default": ($$result) => renderTemplate`Guardar cambios` })}${renderComponent($$result, "Button", $$Button, {
		"variant": "outline",
		"href": "/gastos"
	}, { "default": ($$result) => renderTemplate`Cancelar` })}</div></form>` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/gastos/[id]/editar.astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/gastos/[id]/editar.astro";
var $$url = "/gastos/[id]/editar";
//#endregion
//#region \0virtual:astro:page:src/pages/gastos/[id]/editar@_@astro
var page = () => editar_exports;
//#endregion
export { page };
