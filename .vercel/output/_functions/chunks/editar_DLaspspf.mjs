import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_CIT0iznN.mjs";
import { T as isInputError } from "./server_BEVzeFh0.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
import { n as $$DashboardLayout, t as $$PageHeader } from "./PageHeader_3aUZLUo6.mjs";
import { t as actions } from "./_astro_actions_Dafzj-nN.mjs";
import { a as getCliente } from "./clientes_DmH0mKyw.mjs";
import { t as $$Button } from "./Button_DJ9kh447.mjs";
import { t as $$Input } from "./Input_BqhAvSAl.mjs";
import { t as $$Textarea } from "./Textarea_Dk0Vx8FR.mjs";
//#region src/pages/clientas/[id]/editar.astro
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
	const cliente = id ? await getCliente(id) : null;
	if (!cliente) return new Response("Clienta no encontrada", { status: 404 });
	const resultado = Astro.getActionResult(actions.clientes.actualizar);
	if (resultado && !resultado.error) return Astro.redirect(`/clientas/${cliente.id}`);
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
	const valor = (campo, guardado) => typeof previos[campo] === "string" ? previos[campo] : guardado ?? "";
	return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, {
		"title": "Editar clienta",
		"active": "clientas"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHeader", $$PageHeader, {
		"title": "Editar clienta",
		"description": `Actualiza la ficha de ${cliente.nombre}`
	})}${maybeRenderHead($$result)}<form method="POST"${addAttribute(actions.clientes.actualizar, "action")} class="mt-6 max-w-xl space-y-4"><input type="hidden" name="id"${addAttribute(cliente.id, "value")}>${errorGenerico && renderTemplate`<div class="rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">${errorGenerico}</div>`}${renderComponent($$result, "Input", $$Input, {
		"name": "nombre",
		"label": "Nombre completo",
		"placeholder": "Ej: María González",
		"required": true,
		"autocomplete": "name",
		"value": valor("nombre", cliente.nombre),
		"error": campos.nombre?.[0]
	})}<div class="grid gap-4 sm:grid-cols-2">${renderComponent($$result, "Input", $$Input, {
		"name": "telefono",
		"label": "Teléfono",
		"type": "tel",
		"placeholder": "Ej: 300 123 4567",
		"autocomplete": "tel",
		"value": valor("telefono", cliente.telefono),
		"error": campos.telefono?.[0]
	})}${renderComponent($$result, "Input", $$Input, {
		"name": "email",
		"label": "Correo",
		"type": "email",
		"placeholder": "Ej: maria@correo.com",
		"autocomplete": "email",
		"value": valor("email", cliente.email),
		"error": campos.email?.[0]
	})}</div>${renderComponent($$result, "Textarea", $$Textarea, {
		"name": "notas",
		"label": "Notas",
		"placeholder": "Referencias de tono, alergias, preferencias…",
		"rows": 4,
		"value": valor("notas", cliente.notas),
		"error": campos.notas?.[0]
	})}<div class="flex gap-2 border-t border-hairline pt-4">${renderComponent($$result, "Button", $$Button, { "type": "submit" }, { "default": ($$result) => renderTemplate`Guardar cambios` })}${renderComponent($$result, "Button", $$Button, {
		"variant": "outline",
		"href": `/clientas/${cliente.id}`
	}, { "default": ($$result) => renderTemplate`Cancelar` })}</div></form>` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/clientas/[id]/editar.astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/clientas/[id]/editar.astro";
var $$url = "/clientas/[id]/editar";
//#endregion
//#region \0virtual:astro:page:src/pages/clientas/[id]/editar@_@astro
var page = () => editar_exports;
//#endregion
export { page };
