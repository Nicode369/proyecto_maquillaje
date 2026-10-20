import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_CIT0iznN.mjs";
import { T as isInputError } from "./server_CKb0d5Fl.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
import { n as $$DashboardLayout, t as $$PageHeader } from "./PageHeader_BK87cCvx.mjs";
import { t as actions } from "./_astro_actions_jD2YKBGI.mjs";
import { t as $$Button } from "./Button_C8T8wdfZ.mjs";
import { t as $$Input } from "./Input_BqhAvSAl.mjs";
import { t as $$Textarea } from "./Textarea_Dk0Vx8FR.mjs";
//#region src/pages/clientas/nueva.astro
var nueva_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Nueva,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Nueva = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Nueva;
	const resultado = Astro.getActionResult(actions.clientes.crear);
	if (resultado && !resultado.error) return Astro.redirect("/clientas");
	const err = resultado?.error;
	const campos = isInputError(err) ? err.fields : {};
	const errorGenerico = err && !isInputError(err) ? err.message : null;
	return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, {
		"title": "Nueva clienta",
		"active": "clientas"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHeader", $$PageHeader, {
		"title": "Nueva clienta",
		"description": "Registra sus datos de contacto para llevar su historial"
	})}${maybeRenderHead($$result)}<form method="POST"${addAttribute(actions.clientes.crear, "action")} class="mt-6 max-w-xl space-y-4">${errorGenerico && renderTemplate`<div class="rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">${errorGenerico}</div>`}${renderComponent($$result, "Input", $$Input, {
		"name": "nombre",
		"label": "Nombre completo",
		"placeholder": "Ej: María González",
		"required": true,
		"autocomplete": "name",
		"error": campos.nombre?.[0]
	})}<div class="grid gap-4 sm:grid-cols-2">${renderComponent($$result, "Input", $$Input, {
		"name": "telefono",
		"label": "Teléfono",
		"type": "tel",
		"placeholder": "Ej: 300 123 4567",
		"autocomplete": "tel",
		"error": campos.telefono?.[0]
	})}${renderComponent($$result, "Input", $$Input, {
		"name": "email",
		"label": "Correo",
		"type": "email",
		"placeholder": "Ej: maria@correo.com",
		"autocomplete": "email",
		"error": campos.email?.[0]
	})}</div>${renderComponent($$result, "Textarea", $$Textarea, {
		"name": "notas",
		"label": "Notas",
		"placeholder": "Referencias de tono, alergias, preferencias…",
		"rows": 4,
		"error": campos.notas?.[0]
	})}<div class="flex gap-2 border-t border-hairline pt-4">${renderComponent($$result, "Button", $$Button, { "type": "submit" }, { "default": ($$result) => renderTemplate`Guardar clienta` })}${renderComponent($$result, "Button", $$Button, {
		"variant": "outline",
		"href": "/clientas"
	}, { "default": ($$result) => renderTemplate`Cancelar` })}</div></form>` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/clientas/nueva.astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/clientas/nueva.astro";
var $$url = "/clientas/nueva";
//#endregion
//#region \0virtual:astro:page:src/pages/clientas/nueva@_@astro
var page = () => nueva_exports;
//#endregion
export { page };
