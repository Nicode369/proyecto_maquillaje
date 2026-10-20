import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, D as renderSlot, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_CIT0iznN.mjs";
import { T as isInputError } from "./server_B7MgxuTj.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
import { t as actions } from "./_astro_actions_D7uQ0srh.mjs";
import { i as $$BaseLayout, n as $$Footer, r as $$Valeria, t as $$Button } from "./Button_BwnZMZQS.mjs";
import { t as $$Input } from "./Input_DrAWvrMZ.mjs";
//#region src/layouts/AuthLayout.astro
createAstro("https://astro.build");
var $$AuthLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$AuthLayout;
	const { title = "Iniciar sesión" } = Astro.props;
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${title} · Valeria Eslava` }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="min-h-screen lg:grid lg:grid-cols-[1.05fr_1fr]"><section class="relative hidden overflow-hidden bg-espresso px-12 py-14 lg:flex lg:flex-col"><div>${renderComponent($$result, "Valeria", $$Valeria, {
		"variant": "auth",
		"class": "text-[34px]"
	})}<p class="mt-2 text-sm text-espresso-muted">Maquillaje</p></div><div class="mt-auto max-w-md"><div class="h-px w-14 bg-rose/50"></div><p class="mt-6 font-display text-[26px] leading-snug text-paper/90" style="font-variation-settings: 'opsz' 90;">Ventas, inventario y gastos de tu emprendimiento en un solo lugar.</p><p class="mt-4 text-sm text-espresso-muted">Ingresos del mes, stock de productos y fichas de tus clientas, siempre a la mano.</p></div><div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-rose/25"></div><div class="pointer-events-none absolute -right-10 top-40 h-40 w-40 rounded-full border border-white/10"></div></section><main class="flex min-h-screen items-center justify-center px-6 py-12"><div class="w-full max-w-[380px]"><div class="mb-8 lg:hidden">${renderComponent($$result, "Valeria", $$Valeria, {
		"variant": "auth",
		"class": "text-[30px]"
	})}<p class="mt-2 text-sm text-ink-muted">Maquillaje</p></div>${renderSlot($$result, $$slots["default"])}</div>${renderComponent($$result, "Footer", $$Footer, { "class": "mt-10" })}</main></div>` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/layouts/AuthLayout.astro", void 0);
//#endregion
//#region src/pages/login.astro
var login_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Login,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Login = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Login;
	const resultado = Astro.getActionResult(actions.auth.login);
	if (resultado && !resultado.error) return Astro.redirect("/");
	const erroresCampos = isInputError(resultado?.error) ? resultado.error.fields : {};
	const errorGeneral = resultado?.error && !isInputError(resultado.error) ? resultado.error.message : null;
	return renderTemplate`${renderComponent($$result, "AuthLayout", $$AuthLayout, {}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<form method="POST"${addAttribute(actions.auth.login, "action")} class="space-y-5"><div class="space-y-1.5"><h1 class="display-number text-[26px] leading-tight text-ink" style="font-variation-settings: 'opsz' 90;">Bienvenida de nuevo</h1><p class="text-sm text-ink-muted">Escribe tu contraseña para entrar al panel.</p></div>${errorGeneral && renderTemplate`<p role="alert" class="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-[13px] text-danger">${errorGeneral}</p>`}${renderComponent($$result, "Input", $$Input, {
		"name": "password",
		"label": "Contraseña",
		"type": "password",
		"autocomplete": "current-password",
		"placeholder": "••••••••",
		"error": erroresCampos.password?.[0],
		"autofocus": true
	})}${renderComponent($$result, "Button", $$Button, {
		"type": "submit",
		"class": "w-full"
	}, { "default": ($$result) => renderTemplate`Entrar al panel` })}</form>` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/login.astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/login.astro";
var $$url = "/login";
//#endregion
//#region \0virtual:astro:page:src/pages/login@_@astro
var page = () => login_exports;
//#endregion
export { page };
