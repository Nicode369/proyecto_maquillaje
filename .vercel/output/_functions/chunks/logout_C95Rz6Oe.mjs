import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
import { t as SESSION_COOKIE } from "./auth_Cowi-BmK.mjs";
//#region src/pages/logout.astro
var logout_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Logout,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Logout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Logout;
	Astro.cookies.delete(SESSION_COOKIE, { path: "/" });
	return Astro.redirect("/login");
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/logout.astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/logout.astro";
var $$url = "/logout";
//#endregion
//#region \0virtual:astro:page:src/pages/logout@_@astro
var page = () => logout_exports;
//#endregion
export { page };
