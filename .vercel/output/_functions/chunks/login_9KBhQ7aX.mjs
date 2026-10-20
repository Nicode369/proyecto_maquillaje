import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, D as renderSlot, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_CIT0iznN.mjs";
import { T as isInputError } from "./server_DlWbROmn.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
import { t as actions } from "./_astro_actions_D_xV788m.mjs";
import { n as $$Valeria, r as $$BaseLayout, t as $$Footer } from "./Footer_C0WlN6hP.mjs";
import { t as $$Button } from "./Button_C8T8wdfZ.mjs";
import { t as $$Input } from "./Input_BqhAvSAl.mjs";
//#region src/layouts/AuthLayout.astro
createAstro("https://astro.build");
var $$AuthLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$AuthLayout;
	const { title = "Iniciar sesión" } = Astro.props;
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": `${title} · Valeria Eslava`,
		"data-astro-cid-s6yg6tnz": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="min-h-dvh lg:grid lg:grid-cols-[1.05fr_1fr]" data-astro-cid-s6yg6tnz><section class="relative hidden overflow-hidden bg-espresso px-12 py-14 lg:flex lg:flex-col" data-astro-cid-s6yg6tnz><div data-astro-cid-s6yg6tnz>${renderComponent($$result, "Valeria", $$Valeria, {
		"variant": "auth",
		"class": "text-[34px]",
		"data-astro-cid-s6yg6tnz": true
	})}<p class="mt-2 text-sm text-espresso-muted" data-astro-cid-s6yg6tnz>Maquillaje</p></div><div class="mt-auto max-w-md" data-astro-cid-s6yg6tnz><div class="h-px w-14 bg-rose/50" data-astro-cid-s6yg6tnz></div><p class="mt-6 font-display text-[26px] leading-snug text-paper/90" style="font-variation-settings: 'opsz' 90;" data-astro-cid-s6yg6tnz>Ventas, inventario y gastos de tu emprendimiento en un solo lugar.</p><p class="mt-4 text-sm text-espresso-muted" data-astro-cid-s6yg6tnz>Ingresos del mes, stock de productos y fichas de tus clientas, siempre a la mano.</p></div><img src="/logo.svg" alt="" aria-hidden="true" class="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 opacity-15" data-astro-cid-s6yg6tnz><div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-rose/25" data-astro-cid-s6yg6tnz></div><div class="pointer-events-none absolute -right-10 top-40 h-40 w-40 rounded-full border border-white/10" data-astro-cid-s6yg6tnz></div></section><main class="fondo-polvo relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 pt-10 pb-[max(2.5rem,calc(env(safe-area-inset-bottom)_+_1rem))] sm:px-6 sm:pt-12 sm:pb-12" data-astro-cid-s6yg6tnz><div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden lg:hidden" data-astro-cid-s6yg6tnz><svg class="petalo absolute top-[9%] left-[8%] h-9 w-9 fill-rose opacity-30" viewBox="0 0 24 24" aria-hidden="true" style="--dur: 11s; --delay: 0s; --dy: -16px; --dr: 9deg; --r0: 12deg" data-astro-cid-s6yg6tnz><path d="M12 2c3.4 4 6.5 7.8 6.5 11.5a6.5 6.5 0 1 1-13 0C5.5 9.8 8.6 6 12 2Z" data-astro-cid-s6yg6tnz></path></svg><svg class="petalo absolute top-[20%] right-[10%] h-7 w-7 fill-pink opacity-25 blur-[1.5px]" viewBox="0 0 24 24" aria-hidden="true" style="--dur: 13s; --delay: 1.2s; --dy: -12px; --dr: -11deg; --r0: -18deg" data-astro-cid-s6yg6tnz><path d="M12 2c3.4 4 6.5 7.8 6.5 11.5a6.5 6.5 0 1 1-13 0C5.5 9.8 8.6 6 12 2Z" data-astro-cid-s6yg6tnz></path></svg><svg class="petalo absolute bottom-[22%] left-[12%] h-6 w-6 fill-wine opacity-15" viewBox="0 0 24 24" aria-hidden="true" style="--dur: 15s; --delay: 0.6s; --dy: -14px; --dr: 8deg; --r0: 35deg" data-astro-cid-s6yg6tnz><path d="M12 2c3.4 4 6.5 7.8 6.5 11.5a6.5 6.5 0 1 1-13 0C5.5 9.8 8.6 6 12 2Z" data-astro-cid-s6yg6tnz></path></svg><svg class="petalo absolute right-[16%] bottom-[10%] h-11 w-11 fill-rose opacity-25" viewBox="0 0 24 24" aria-hidden="true" style="--dur: 16s; --delay: 2s; --dy: -10px; --dr: -7deg; --r0: 24deg" data-astro-cid-s6yg6tnz><path d="M12 2c3.4 4 6.5 7.8 6.5 11.5a6.5 6.5 0 1 1-13 0C5.5 9.8 8.6 6 12 2Z" data-astro-cid-s6yg6tnz></path></svg><svg class="petalo absolute right-[6%] bottom-[34%] h-5 w-5 fill-pink opacity-20 blur-[1.5px]" viewBox="0 0 24 24" aria-hidden="true" style="--dur: 9s; --delay: 1.6s; --dy: -15px; --dr: 12deg; --r0: -8deg" data-astro-cid-s6yg6tnz><path d="M12 2c3.4 4 6.5 7.8 6.5 11.5a6.5 6.5 0 1 1-13 0C5.5 9.8 8.6 6 12 2Z" data-astro-cid-s6yg6tnz></path></svg></div><div class="entrada w-full max-w-[380px]" data-astro-cid-s6yg6tnz><div class="mb-7 text-center lg:hidden" data-astro-cid-s6yg6tnz>${renderComponent($$result, "Valeria", $$Valeria, {
		"variant": "auth",
		"class": "justify-center text-[30px]",
		"data-astro-cid-s6yg6tnz": true
	})}<p class="mt-2 text-sm text-ink/75" data-astro-cid-s6yg6tnz>Maquillaje</p></div>${renderSlot($$result, $$slots["default"])}</div>${renderComponent($$result, "Footer", $$Footer, {
		"class": "mt-10 [&_p]:text-ink/75",
		"data-astro-cid-s6yg6tnz": true
	})}</main></div>` })}`;
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
	return renderTemplate`${renderComponent($$result, "AuthLayout", $$AuthLayout, {}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="rounded-xl border border-hairline bg-surface px-5 py-7 shadow-[0_1px_3px_rgba(42,27,32,0.06)] sm:px-7"><form method="POST"${addAttribute(actions.auth.login, "action")} class="space-y-5"><div class="space-y-1.5"><h1 class="display-number text-[26px] leading-tight text-ink" style="font-variation-settings: 'opsz' 90;">Bienvenida de nuevo</h1><p class="text-sm text-ink-muted">Escribe tu contraseña para entrar al panel.</p><div class="mt-3 h-px w-14 bg-rose"></div></div>${errorGeneral && renderTemplate`<p role="alert" class="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-[13px] text-danger">${errorGeneral}</p>`}${renderComponent($$result, "Input", $$Input, {
		"name": "password",
		"label": "Contraseña",
		"type": "password",
		"size": "lg",
		"autocomplete": "current-password",
		"placeholder": "••••••••",
		"error": erroresCampos.password?.[0],
		"autofocus": true
	})}${renderComponent($$result, "Button", $$Button, {
		"type": "submit",
		"size": "lg",
		"class": "w-full"
	}, { "default": ($$result) => renderTemplate`Entrar al panel` })}</form></div>` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/login.astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/login.astro";
var $$url = "/login";
//#endregion
//#region \0virtual:astro:page:src/pages/login@_@astro
var page = () => login_exports;
//#endregion
export { page };
