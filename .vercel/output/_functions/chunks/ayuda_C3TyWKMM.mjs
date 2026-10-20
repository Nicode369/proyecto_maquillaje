import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, j as maybeRenderHead, w as renderComponent } from "./sequence_CIT0iznN.mjs";
import { n as createComponent } from "./compiler_D5p6FHCN.mjs";
import { n as $$DashboardLayout, t as $$PageHeader } from "./PageHeader_BK87cCvx.mjs";
import { t as $$Card } from "./Card_B-sRX80l.mjs";
//#region src/pages/ayuda.astro
var ayuda_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Ayuda,
	file: () => $$file,
	url: () => $$url
});
var $$Ayuda = createComponent(($$result, $$props, $$slots) => {
	const secciones = [
		{
			titulo: "Para empezar (primeros pasos)",
			pasos: [
				"1. Productos: registra primero todo lo que vendes (nombre, precios, stock y foto). Sin productos no puedes registrar ventas.",
				"2. Clientas: crea las fichas de tus clientas con su teléfono; son las que comprarán y podrían quedar a crédito.",
				"3. Primera venta: ya con productos y clientas, registra tu primera venta para que el resumen empiece a mostrar números.",
				"4. Gastos: cada vez que compres insumos o pagues un gasto del negocio, regístralo el mismo día.",
				"5. Crédito: si fías, marca la venta como \"a crédito\" y registra cada abono cuando te paguen.",
				"A partir de ahí, entra cada día al Resumen: verás ingresos, gastos, ganancia, stock bajo y lo que te deben."
			]
		},
		{
			titulo: "Resumen (pantalla principal)",
			pasos: [
				"Muestra los números del mes elegido: ganancia, ingresos, gastos, ventas y ticket promedio (promedio por venta).",
				"«Por cobrar» es el total que las clientas te deben por ventas a crédito.",
				"Si un producto está por debajo del stock mínimo aparece en «Stock bajo» — es hora de reponer.",
				"Cambia el mes con el selector de arriba a la derecha."
			]
		},
		{
			titulo: "Registrar una venta",
			pasos: [
				"Ve a Ventas → Nueva venta.",
				"Elige la fecha, la clienta (opcional) y el método de pago.",
				"Agrega productos del catálogo o escribe servicios personalizados (ej: aplicación de cejas).",
				"Puedes aplicar un descuento y dejar notas.",
				"Guarda: el stock de los productos se descuenta automáticamente."
			]
		},
		{
			titulo: "Venta a crédito (fiada) y abonos",
			pasos: [
				"Al crear la venta, marca «Venta a crédito (fiada)». En ese caso es obligatorio elegir la clienta.",
				"El saldo pendiente aparece en la lista de ventas, en la ficha de la clienta y en «Por cobrar» del resumen.",
				"Para registrar un pago parcial o total: abre la venta → sección Abonos → pon monto, fecha y notas.",
				"Una venta con abonos no se puede anular; primero revisa los pagos registrados."
			]
		},
		{
			titulo: "Productos",
			pasos: [
				"Ve a Productos → Nuevo producto: nombre, marca, precios de compra y venta, stock.",
				"Sube una foto del producto: se recorta automáticamente para que se vea bien en el listado.",
				"«Stock mínimo» es el nivel de alerta: cuando el stock llegue a ese número, el producto aparecerá en «Stock bajo».",
				"Los productos que ya no vendes se pueden desactivar en vez de borrarlos."
			]
		},
		{
			titulo: "Clientas",
			pasos: [
				"Registra a cada clienta con su teléfono y correo (opcional).",
				"En su ficha ves el historial de compras, el gasto acumulado y lo que debe.",
				"Para editar o eliminar, usa los botones de la lista o de la ficha."
			]
		},
		{
			titulo: "Gastos",
			pasos: ["Registra aquí todo lo que gastas: insumos, arriendo, transporte, publicidad…", "Los gastos del mes restan en la ganancia del resumen."]
		},
		{
			titulo: "Ventas anuladas",
			pasos: ["Si registraste una venta por error, ábrela y usa «Anular venta».", "El stock de los productos se restaura automáticamente y la venta deja de contar en los reportes."]
		},
		{
			titulo: "Tu cuenta",
			pasos: ["Cierra sesión con el botón del final del menú lateral, sobre todo si usas el panel en un celular prestado."]
		}
	];
	return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, {
		"title": "Ayuda",
		"active": "ayuda"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHeader", $$PageHeader, {
		"title": "Ayuda",
		"description": "Cómo usar el panel, paso a paso"
	})}${maybeRenderHead($$result)}<div class="mt-6 grid max-w-4xl gap-4">${secciones.map((s) => renderTemplate`${renderComponent($$result, "CardUi", $$Card, {}, { "default": ($$result) => renderTemplate`<h2 class="font-display text-lg text-ink" style="font-variation-settings: 'opsz' 40;">${s.titulo}</h2><ol class="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-ink/85">${s.pasos.map((p) => renderTemplate`<li>${p}</li>`)}</ol>` })}`)}</div>` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/ayuda.astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/ayuda.astro";
var $$url = "/ayuda";
//#endregion
//#region \0virtual:astro:page:src/pages/ayuda@_@astro
var page = () => ayuda_exports;
//#endregion
export { page };
