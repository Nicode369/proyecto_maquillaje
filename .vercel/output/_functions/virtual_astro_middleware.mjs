import { Et as defineMiddleware, t as sequence } from "./chunks/sequence_CIT0iznN.mjs";
import { a as verificarSesion } from "./chunks/auth_Cowi-BmK.mjs";
//#region src/middleware.ts
var RUTAS_PUBLICAS = /* @__PURE__ */ new Set([
	"/login",
	"/favicon.svg",
	"/robots.txt"
]);
function conSeguridad(res) {
	res.headers.set("X-Frame-Options", "DENY");
	res.headers.set("X-Content-Type-Options", "nosniff");
	res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	return res;
}
var onRequest$1 = defineMiddleware(async (context, next) => {
	const ruta = context.url.pathname.replace(/\/+$/, "") || "/";
	if (RUTAS_PUBLICAS.has(ruta)) {
		if (ruta === "/login" && await verificarSesion(context.cookies.get("panel_session")?.value)) return conSeguridad(context.redirect("/"));
		return conSeguridad(await next());
	}
	if (!await verificarSesion(context.cookies.get("panel_session")?.value)) return conSeguridad(context.redirect("/login"));
	return conSeguridad(await next());
});
//#endregion
//#region \0virtual:astro:middleware
var onRequest = sequence(onRequest$1);
//#endregion
export { onRequest };
