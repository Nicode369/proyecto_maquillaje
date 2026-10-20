import { i as opcionesCookie, n as contrasenasIguales, o as DASHBOARD_PASSWORD, r as firmarSesion, t as SESSION_COOKIE } from "./auth_B3YfWjMV.mjs";
import { S as ActionError, t as defineAction } from "./server_DesZPQvd.mjs";
import "./_astro_actions_Dv3GSuet.mjs";
import * as mod from "zod/v4";
//#endregion
//#region src/actions/index.ts
var server = { auth: {
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
} };
//#endregion
export { server };
