import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_CIT0iznN.mjs";
import { T as isInputError } from "./server_GhWkWhLC.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
import { n as $$DashboardLayout, t as $$PageHeader } from "./PageHeader_DzCWMCOK.mjs";
import { t as actions } from "./_astro_actions_CfFJi6_D.mjs";
import { t as $$Button } from "./Button_C8T8wdfZ.mjs";
import { t as $$Input } from "./Input_BqhAvSAl.mjs";
import { n as $$Checkbox, t as $$SubirImagen } from "./SubirImagen_0DICA6px.mjs";
//#region src/pages/productos/nuevo.astro
var nuevo_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Nuevo,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Nuevo = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Nuevo;
	const resultado = Astro.getActionResult(actions.productos.crear);
	if (resultado && !resultado.error) return Astro.redirect("/productos");
	const err = resultado?.error;
	const campos = isInputError(err) ? err.fields : {};
	const errorGenerico = err && !isInputError(err) ? err.message : null;
	return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, {
		"title": "Nuevo producto",
		"active": "productos"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHeader", $$PageHeader, {
		"title": "Nuevo producto",
		"description": "Registra nombre, precios y stock inicial"
	})}${maybeRenderHead($$result)}<form method="POST"${addAttribute(actions.productos.crear, "action")} class="mt-6 max-w-2xl space-y-4">${errorGenerico && renderTemplate`<div class="rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">${errorGenerico}</div>`}<div class="grid gap-4 sm:grid-cols-2">${renderComponent($$result, "Input", $$Input, {
		"name": "nombre",
		"label": "Nombre del producto",
		"placeholder": "Ej: Base líquida Master Matte",
		"required": true,
		"error": campos.nombre?.[0]
	})}${renderComponent($$result, "Input", $$Input, {
		"name": "marca",
		"label": "Marca",
		"placeholder": "Ej: Argenis",
		"error": campos.marca?.[0]
	})}</div><div class="grid gap-4 sm:grid-cols-3">${renderComponent($$result, "Input", $$Input, {
		"name": "categoria",
		"label": "Categoría",
		"placeholder": "Ej: Rostro",
		"required": true,
		"error": campos.categoria?.[0]
	})}${renderComponent($$result, "Input", $$Input, {
		"name": "stock",
		"label": "Stock inicial",
		"type": "number",
		"min": "0",
		"step": "1",
		"value": "0",
		"required": true,
		"error": campos.stock?.[0]
	})}${renderComponent($$result, "Input", $$Input, {
		"name": "stock_minimo",
		"label": "Stock mínimo",
		"type": "number",
		"min": "0",
		"step": "1",
		"value": "3",
		"required": true,
		"error": campos.stock_minimo?.[0]
	})}</div><div class="grid gap-4 sm:grid-cols-2">${renderComponent($$result, "Input", $$Input, {
		"name": "precio_compra",
		"label": "Precio de compra (COP)",
		"type": "number",
		"min": "0",
		"step": "100",
		"placeholder": "Ej: 32000",
		"required": true,
		"error": campos.precio_compra?.[0]
	})}${renderComponent($$result, "Input", $$Input, {
		"name": "precio_venta",
		"label": "Precio de venta (COP)",
		"type": "number",
		"min": "0",
		"step": "100",
		"placeholder": "Ej: 58000",
		"required": true,
		"error": campos.precio_venta?.[0]
	})}</div>${renderComponent($$result, "SubirImagen", $$SubirImagen, { "error": campos.imagen?.[0] })}${renderComponent($$result, "Checkbox", $$Checkbox, {
		"name": "activo",
		"label": "Producto activo",
		"hint": "Los productos inactivos no aparecen al registrar ventas.",
		"checked": true
	})}<div class="flex gap-2 border-t border-hairline pt-4">${renderComponent($$result, "Button", $$Button, { "type": "submit" }, { "default": ($$result) => renderTemplate`Guardar producto` })}${renderComponent($$result, "Button", $$Button, {
		"variant": "outline",
		"href": "/productos"
	}, { "default": ($$result) => renderTemplate`Cancelar` })}</div></form>` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/productos/nuevo.astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/productos/nuevo.astro";
var $$url = "/productos/nuevo";
//#endregion
//#region \0virtual:astro:page:src/pages/productos/nuevo@_@astro
var page = () => nuevo_exports;
//#endregion
export { page };
