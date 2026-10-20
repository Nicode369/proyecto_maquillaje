import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_CIT0iznN.mjs";
import { T as isInputError } from "./server_q5TVdO0i.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
import { n as $$DashboardLayout, t as $$PageHeader } from "./PageHeader_Guces94u.mjs";
import { t as actions } from "./_astro_actions_laG6TyeL.mjs";
import { i as getProducto } from "./productos_DJAPQyIZ.mjs";
import { t as $$Button } from "./Button_CpE-guga.mjs";
import { t as TriangleAlert } from "./triangle-alert_8-iQegYG.mjs";
import { t as $$Input } from "./Input_BqhAvSAl.mjs";
import { n as $$Checkbox, t as $$SubirImagen } from "./SubirImagen_FzGuIuNK.mjs";
//#region src/pages/productos/[id]/editar.astro
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
	const producto = id ? await getProducto(id) : null;
	if (!producto) return new Response("Producto no encontrado", { status: 404 });
	const resultado = Astro.getActionResult(actions.productos.actualizar);
	if (resultado && !resultado.error) return Astro.redirect("/productos");
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
	const activoPrevio = Astro.request.method === "POST" ? previos.activo === "true" : producto.activo;
	const imagenPrevia = Astro.request.method === "POST" && typeof previos.imagen === "string" ? previos.imagen : producto.imagen ?? "";
	return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, {
		"title": "Editar producto",
		"active": "productos"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHeader", $$PageHeader, {
		"title": "Editar producto",
		"description": `Actualiza la ficha de ${producto.nombre}`
	})}${maybeRenderHead($$result)}<form method="POST"${addAttribute(actions.productos.actualizar, "action")} class="mt-6 max-w-2xl space-y-4"><input type="hidden" name="id"${addAttribute(producto.id, "value")}>${errorGenerico && renderTemplate`<div class="rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">${errorGenerico}</div>`}<div class="grid gap-4 sm:grid-cols-2">${renderComponent($$result, "Input", $$Input, {
		"name": "nombre",
		"label": "Nombre del producto",
		"placeholder": "Ej: Base líquida Master Matte",
		"required": true,
		"value": valor("nombre", producto.nombre),
		"error": campos.nombre?.[0]
	})}${renderComponent($$result, "Input", $$Input, {
		"name": "marca",
		"label": "Marca",
		"placeholder": "Ej: Argenis",
		"value": valor("marca", producto.marca ?? ""),
		"error": campos.marca?.[0]
	})}</div><div class="grid gap-4 sm:grid-cols-3">${renderComponent($$result, "Input", $$Input, {
		"name": "categoria",
		"label": "Categoría",
		"placeholder": "Ej: Rostro",
		"required": true,
		"value": valor("categoria", producto.categoria),
		"error": campos.categoria?.[0]
	})}${renderComponent($$result, "Input", $$Input, {
		"name": "stock",
		"label": "Stock actual",
		"type": "number",
		"min": "0",
		"step": "1",
		"required": true,
		"value": valor("stock", producto.stock),
		"error": campos.stock?.[0]
	})}${renderComponent($$result, "Input", $$Input, {
		"name": "stock_minimo",
		"label": "Stock mínimo",
		"type": "number",
		"min": "0",
		"step": "1",
		"required": true,
		"value": valor("stock_minimo", producto.stock_minimo),
		"error": campos.stock_minimo?.[0]
	})}</div><div class="grid gap-4 sm:grid-cols-2">${renderComponent($$result, "Input", $$Input, {
		"name": "precio_compra",
		"label": "Precio de compra (COP)",
		"type": "number",
		"min": "0",
		"step": "100",
		"required": true,
		"value": valor("precio_compra", producto.precio_compra),
		"error": campos.precio_compra?.[0]
	})}${renderComponent($$result, "Input", $$Input, {
		"name": "precio_venta",
		"label": "Precio de venta (COP)",
		"type": "number",
		"min": "0",
		"step": "100",
		"required": true,
		"value": valor("precio_venta", producto.precio_venta),
		"error": campos.precio_venta?.[0]
	})}</div>${renderComponent($$result, "SubirImagen", $$SubirImagen, {
		"valor": imagenPrevia,
		"error": campos.imagen?.[0]
	})}${renderComponent($$result, "Checkbox", $$Checkbox, {
		"name": "activo",
		"label": "Producto activo",
		"hint": "Los productos inactivos no aparecen al registrar ventas.",
		"checked": activoPrevio
	})}${producto.stock <= producto.stock_minimo && renderTemplate`<p class="flex items-start gap-2 rounded-lg border border-ochre/30 bg-ochre/5 px-4 py-3 text-sm text-ochre">${renderComponent($$result, "TriangleAlert", TriangleAlert, {
		"size": 16,
		"class": "mt-0.5 shrink-0"
	})}<span>Este producto tiene stock bajo (${producto.stock} unidades, mínimo${" "}${producto.stock_minimo}).</span></p>`}<div class="flex gap-2 border-t border-hairline pt-4">${renderComponent($$result, "Button", $$Button, { "type": "submit" }, { "default": ($$result) => renderTemplate`Guardar cambios` })}${renderComponent($$result, "Button", $$Button, {
		"variant": "outline",
		"href": "/productos"
	}, { "default": ($$result) => renderTemplate`Cancelar` })}</div></form>` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/productos/[id]/editar.astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/productos/[id]/editar.astro";
var $$url = "/productos/[id]/editar";
//#endregion
//#region \0virtual:astro:page:src/pages/productos/[id]/editar@_@astro
var page = () => editar_exports;
//#endregion
export { page };
