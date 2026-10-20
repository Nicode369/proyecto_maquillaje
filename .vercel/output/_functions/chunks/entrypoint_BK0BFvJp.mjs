import { t as DASHBOARD_PASSWORD } from "./server_DcDs3kpP.mjs";
import { S as ActionError, t as defineAction } from "./server_q5TVdO0i.mjs";
import { a as verificarSesion, i as opcionesCookie, n as contrasenasIguales, r as firmarSesion, t as SESSION_COOKIE } from "./auth_Cowi-BmK.mjs";
import "./_astro_actions_laG6TyeL.mjs";
import { a as getCliente, i as deleteCliente, o as listClientes, r as createCliente, s as updateCliente } from "./clientes_DmH0mKyw.mjs";
import { n as deleteGasto, r as getGasto, s as updateGasto, t as createGasto } from "./gastos_uFnzIew9.mjs";
import { i as getProducto, l as updateProducto, n as createProducto, r as deleteProducto } from "./productos_DJAPQyIZ.mjs";
import { n as createVenta, r as getVenta, t as anularVenta } from "./ventas_BBpED52g.mjs";
import * as mod from "zod/v4";
//#region src/actions/auth.ts
var auth = { login: defineAction({
	accept: "form",
	input: mod.object({ password: mod.string().min(1, "Escribe tu contraseña") }),
	handler: async (input, context) => {
		if (!DASHBOARD_PASSWORD) throw new ActionError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Falta configurar DASHBOARD_PASSWORD en el servidor."
		});
		if (!contrasenasIguales(input.password, DASHBOARD_PASSWORD)) throw new ActionError({
			code: "UNAUTHORIZED",
			message: "Contraseña incorrecta."
		});
		context.cookies.set(SESSION_COOKIE, await firmarSesion(), opcionesCookie());
		return { ok: true };
	}
}) };
//#endregion
//#region src/actions/sesion.ts
async function exigirSesion(context) {
	const token = context.cookies.get(SESSION_COOKIE)?.value;
	if (!await verificarSesion(token)) throw new ActionError({
		code: "UNAUTHORIZED",
		message: "Sesión no válida."
	});
}
//#endregion
//#region src/actions/clientes.ts
var esquemaCliente = mod.object({
	nombre: mod.string().trim().min(2, "Escribe el nombre de la clienta").max(120),
	telefono: mod.string().trim().max(30).nullable().optional(),
	email: mod.string().trim().max(120).refine((valor) => valor === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor), "Escribe un correo válido").nullable().optional(),
	notas: mod.string().trim().max(2e3).nullable().optional()
});
function limpiar$1(data) {
	return {
		nombre: data.nombre,
		telefono: data.telefono?.trim() || null,
		email: data.email?.trim() || null,
		notas: data.notas?.trim() || null
	};
}
var clientes = {
	crear: defineAction({
		accept: "form",
		input: esquemaCliente,
		handler: async (input, context) => {
			await exigirSesion(context);
			return { id: await createCliente(limpiar$1(input)) };
		}
	}),
	actualizar: defineAction({
		accept: "form",
		input: esquemaCliente.extend({ id: mod.uuid("Identificador no válido") }),
		handler: async (input, context) => {
			await exigirSesion(context);
			if (!await getCliente(input.id)) throw new Error("La clienta ya no existe.");
			await updateCliente(input.id, limpiar$1(input));
			return { id: input.id };
		}
	}),
	eliminar: defineAction({
		accept: "form",
		input: mod.object({ id: mod.uuid("Identificador no válido") }),
		handler: async (input, context) => {
			await exigirSesion(context);
			if (!await getCliente(input.id)) return { ok: true };
			await deleteCliente(input.id);
			return { ok: true };
		}
	})
};
//#endregion
//#region src/actions/gastos.ts
var esquemaGasto = mod.object({
	fecha: mod.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha no válida"),
	categoria: mod.string().trim().min(1, "Elige una categoría").max(40),
	descripcion: mod.string().trim().min(3, "Describe el gasto (mínimo 3 caracteres)").max(200),
	monto: mod.coerce.number({ message: "El monto debe ser un número" }).min(1, "El monto debe ser mayor a cero")
});
var gastos = {
	crear: defineAction({
		accept: "form",
		input: esquemaGasto,
		handler: async (input, context) => {
			await exigirSesion(context);
			return { id: await createGasto(input) };
		}
	}),
	actualizar: defineAction({
		accept: "form",
		input: esquemaGasto.extend({ id: mod.uuid("Identificador no válido") }),
		handler: async (input, context) => {
			await exigirSesion(context);
			if (!await getGasto(input.id)) throw new Error("El gasto ya no existe.");
			await updateGasto(input.id, input);
			return { id: input.id };
		}
	}),
	eliminar: defineAction({
		accept: "form",
		input: mod.object({ id: mod.uuid("Identificador no válido") }),
		handler: async (input, context) => {
			await exigirSesion(context);
			if (!await getGasto(input.id)) return { ok: true };
			await deleteGasto(input.id);
			return { ok: true };
		}
	})
};
//#endregion
//#region src/actions/productos.ts
var esquemaProducto = mod.object({
	nombre: mod.string().trim().min(2, "Escribe el nombre del producto").max(120),
	marca: mod.string().trim().max(80).nullable().optional(),
	categoria: mod.string().trim().min(1, "Elige una categoría").max(40),
	stock: mod.coerce.number({ message: "El stock debe ser un número" }).int("El stock debe ser un número entero").min(0, "El stock no puede ser negativo"),
	stock_minimo: mod.coerce.number({ message: "El mínimo debe ser un número" }).int("El mínimo debe ser un número entero").min(0, "El mínimo no puede ser negativo"),
	precio_compra: mod.coerce.number({ message: "El precio de compra debe ser un número" }).min(0, "El precio no puede ser negativo"),
	precio_venta: mod.coerce.number({ message: "El precio de venta debe ser un número" }).min(0, "El precio no puede ser negativo"),
	imagen: mod.string().max(14e5, "La imagen es demasiado grande").refine((v) => v === "" || /^data:image\/(jpeg|jpg|png|webp);base64,/.test(v), "Formato de imagen no válido").nullable().optional(),
	activo: mod.boolean()
});
function limpiar(data) {
	return {
		nombre: data.nombre,
		marca: data.marca?.trim() || null,
		categoria: data.categoria,
		stock: data.stock,
		stock_minimo: data.stock_minimo,
		precio_compra: data.precio_compra,
		precio_venta: data.precio_venta,
		activo: data.activo,
		imagen: data.imagen || null
	};
}
var productos = {
	crear: defineAction({
		accept: "form",
		input: esquemaProducto,
		handler: async (input, context) => {
			await exigirSesion(context);
			return { id: await createProducto(limpiar(input)) };
		}
	}),
	actualizar: defineAction({
		accept: "form",
		input: esquemaProducto.extend({ id: mod.uuid("Identificador no válido") }),
		handler: async (input, context) => {
			await exigirSesion(context);
			if (!await getProducto(input.id)) throw new Error("El producto ya no existe.");
			await updateProducto(input.id, limpiar(input));
			return { id: input.id };
		}
	}),
	eliminar: defineAction({
		accept: "form",
		input: mod.object({ id: mod.uuid("Identificador no válido") }),
		handler: async (input, context) => {
			await exigirSesion(context);
			const existente = await getProducto(input.id);
			if (!existente) return {
				eliminado: true,
				teniaVentas: false,
				nombre: ""
			};
			const eliminado = await deleteProducto(input.id);
			return {
				eliminado,
				teniaVentas: !eliminado,
				nombre: existente.nombre
			};
		}
	})
};
//#endregion
//#region src/actions/ventas.ts
var esquemaLinea = mod.object({
	producto_id: mod.uuid().nullable(),
	descripcion: mod.string().trim().min(1, "Describe el producto o servicio").max(200),
	cantidad: mod.coerce.number({ message: "La cantidad debe ser un número" }).int("La cantidad debe ser un número entero").min(1, "La cantidad mínima es 1"),
	precio_unitario: mod.coerce.number({ message: "El precio debe ser un número" }).min(0, "El precio no puede ser negativo")
});
var esquemaVenta = mod.object({
	fecha: mod.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha no válida"),
	cliente_id: mod.uuid("Clienta no válida").nullable(),
	metodo_pago: mod.string().trim().min(1, "Elige un método de pago").max(30),
	descuento: mod.coerce.number({ message: "El descuento debe ser un número" }).min(0, "El descuento no puede ser negativo"),
	notas: mod.string().trim().max(500).nullable(),
	items_json: mod.string().transform((texto, ctx) => {
		try {
			return JSON.parse(texto);
		} catch {
			ctx.addIssue({
				code: "custom",
				message: "Error en los productos de la venta"
			});
			return mod.NEVER;
		}
	}).pipe(mod.array(esquemaLinea).min(1, "Agrega al menos un producto o servicio").max(30))
});
//#endregion
//#region src/actions/index.ts
var server = {
	auth,
	clientes,
	gastos,
	productos,
	ventas: {
		crear: defineAction({
			accept: "form",
			input: esquemaVenta,
			handler: async (input, context) => {
				await exigirSesion(context);
				if (input.cliente_id) {
					if (!(await listClientes()).some((c) => c.id === input.cliente_id)) throw new Error("La clienta seleccionada ya no existe.");
				}
				return { id: await createVenta({
					fecha: input.fecha,
					clienteId: input.cliente_id,
					metodoPago: input.metodo_pago,
					descuento: input.descuento,
					notas: input.notas,
					items: input.items_json.map((linea) => ({
						productoId: linea.producto_id,
						descripcion: linea.descripcion,
						cantidad: linea.cantidad,
						precioUnitario: linea.precio_unitario
					}))
				}) };
			}
		}),
		anular: defineAction({
			accept: "form",
			input: mod.object({ id: mod.uuid("Identificador no válido") }),
			handler: async (input, context) => {
				await exigirSesion(context);
				const venta = await getVenta(input.id);
				if (!venta) throw new Error("La venta ya no existe.");
				if (venta.anulada) throw new Error("Esta venta ya está anulada.");
				await anularVenta(input.id);
				return { ok: true };
			}
		})
	}
};
//#endregion
export { server };
