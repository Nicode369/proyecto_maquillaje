import { Tt as defineMiddleware, t as sequence } from "./chunks/sequence_DxXwX9gt.mjs";
import { a as verificarSesion } from "./chunks/auth_BbIa3d98.mjs";
//#region src/middleware.ts
var RUTAS_PUBLICAS = /* @__PURE__ */ new Set([
	"/login",
	"/favicon.svg",
	"/robots.txt"
]);
var onRequest$1 = defineMiddleware(async (context, next) => {
	const ruta = context.url.pathname.replace(/\/+$/, "") || "/";
	if (RUTAS_PUBLICAS.has(ruta)) {
		if (ruta === "/login" && await verificarSesion(context.cookies.get("panel_session")?.value)) return context.redirect("/");
		return next();
	}
	if (!await verificarSesion(context.cookies.get("panel_session")?.value)) return context.redirect("/login");
	return next();
});
//#endregion
//#region \0virtual:astro:middleware
var onRequest = sequence(onRequest$1);
//#endregion
export { onRequest };
