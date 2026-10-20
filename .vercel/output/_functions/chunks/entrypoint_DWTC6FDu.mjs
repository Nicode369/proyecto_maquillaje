import { t as DASHBOARD_PASSWORD } from "./server_DO_fYqGA.mjs";
import { S as ActionError, t as defineAction } from "./server_UmxkaEb9.mjs";
import { a as verificarSesion, i as opcionesCookie, n as contrasenasIguales, r as firmarSesion, t as SESSION_COOKIE } from "./auth_BbIa3d98.mjs";
import "./_astro_actions_B_qDQafb.mjs";
import { a as getCliente, i as deleteCliente, r as createCliente, s as updateCliente } from "./clientes_fbSkGmRO.mjs";
import * as mod from "zod/v4";
//#region src/actions/auth.ts
var auth = {
	login: defineAction({
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
	}),
	logout: defineAction({
		accept: "form",
		handler: async (_input, context) => {
			context.cookies.delete(SESSION_COOKIE, { path: "/" });
			return { ok: true };
		}
	})
};
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
function limpiar(data) {
	return {
		nombre: data.nombre,
		telefono: data.telefono?.trim() || null,
		email: data.email?.trim() || null,
		notas: data.notas?.trim() || null
	};
}
//#endregion
//#region src/actions/index.ts
var server = {
	auth,
	clientes: {
		crear: defineAction({
			accept: "form",
			input: esquemaCliente,
			handler: async (input, context) => {
				await exigirSesion(context);
				return { id: await createCliente(limpiar(input)) };
			}
		}),
		actualizar: defineAction({
			accept: "form",
			input: esquemaCliente.extend({ id: mod.uuid("Identificador no válido") }),
			handler: async (input, context) => {
				await exigirSesion(context);
				if (!await getCliente(input.id)) throw new Error("La clienta ya no existe.");
				await updateCliente(input.id, limpiar(input));
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
	}
};
//#endregion
export { server };
