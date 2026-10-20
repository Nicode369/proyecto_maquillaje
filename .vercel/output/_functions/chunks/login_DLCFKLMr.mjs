import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as maybeRenderHead, E as renderSlot, M as addAttribute, k as renderTemplate, w as renderComponent, x as spreadAttributes } from "./sequence_vYO_GrXQ.mjs";
import { T as isInputError } from "./server_DesZPQvd.mjs";
import { n as createComponent, t as createAstro } from "./compiler_DTgN-O7B.mjs";
import { t as actions } from "./_astro_actions_Dv3GSuet.mjs";
import { t as $$BaseLayout } from "./BaseLayout_B8mKUvCS.mjs";
//#region src/layouts/AuthLayout.astro
createAstro("https://astro.build");
var $$AuthLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$AuthLayout;
	const { title = "Iniciar sesión" } = Astro.props;
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${title} · Panel` }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="min-h-screen lg:grid lg:grid-cols-[1.05fr_1fr]"><section class="relative hidden overflow-hidden bg-espresso px-12 py-14 lg:flex lg:flex-col"><div><p class="font-display text-[34px] leading-none text-[#F7F3EE]" style="font-variation-settings: 'opsz' 144;">Panel</p><p class="mt-2 text-sm text-espresso-muted">Maquillaje</p></div><div class="mt-auto max-w-md"><div class="h-px w-14 bg-rose/50"></div><p class="mt-6 font-display text-[26px] leading-snug text-[#F7F3EE]/90" style="font-variation-settings: 'opsz' 90;">Ventas, inventario y gastos de tu emprendimiento en un solo lugar.</p><p class="mt-4 text-sm text-espresso-muted">Ingresos del mes, stock de productos y fichas de tus clientas, siempre a la mano.</p></div><div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-rose/25"></div><div class="pointer-events-none absolute -right-10 top-40 h-40 w-40 rounded-full border border-white/10"></div></section><main class="flex min-h-screen items-center justify-center px-6 py-12"><div class="w-full max-w-[380px]"><div class="mb-8 lg:hidden"><p class="font-display text-[30px] leading-none text-ink" style="font-variation-settings: 'opsz' 144;">Panel</p><p class="mt-2 text-sm text-ink-muted">Maquillaje</p></div>${renderSlot($$result, $$slots["default"])}</div></main></div>` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/layouts/AuthLayout.astro", void 0);
//#endregion
//#region src/components/ui/Button.astro
createAstro("https://astro.build");
var $$Button = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Button;
	const { variant = "primary", size = "md", class: className = "", href, type = "button", disabled = false, ...rest } = Astro.props;
	const classes = `inline-flex items-center justify-center gap-2 rounded font-medium whitespace-nowrap transition-colors disabled:opacity-50 disabled:pointer-events-none ${{
		primary: "bg-wine text-white hover:bg-wine-hover",
		outline: "border border-ink/15 bg-surface text-ink hover:border-ink/35",
		ghost: "text-ink-muted hover:text-ink hover:bg-ink/5",
		danger: "bg-danger text-white hover:bg-danger/90"
	}[variant]} ${{
		sm: "h-8 px-2.5 text-[13px]",
		md: "h-9.5 px-4 text-sm"
	}[size]} ${className}`;
	return renderTemplate`${href ? renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(href, "href")}${addAttribute(classes, "class")}${spreadAttributes(rest)}>${renderSlot($$result, $$slots["default"])}</a>` : renderTemplate`<button${addAttribute(type, "type")}${addAttribute(classes, "class")}${addAttribute(disabled, "disabled")}${spreadAttributes(rest)}>${renderSlot($$result, $$slots["default"])}</button>`}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/components/ui/Button.astro", void 0);
//#endregion
//#region src/components/ui/Input.astro
createAstro("https://astro.build");
var $$Input = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Input;
	const { name, label, type = "text", placeholder, value, error, required = false, class: className = "", ...rest } = Astro.props;
	const inputId = name;
	const describedBy = error ? `${name}-error` : void 0;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["space-y-1.5", className], "class:list")}>${label && renderTemplate`<label${addAttribute(inputId, "for")} class="block text-[13px] font-medium text-ink">${label}</label>`}<input${addAttribute(inputId, "id")}${addAttribute(name, "name")}${addAttribute(type, "type")}${addAttribute(placeholder, "placeholder")}${addAttribute(value, "value")}${addAttribute(required, "required")}${addAttribute(error ? "true" : void 0, "aria-invalid")}${addAttribute(describedBy, "aria-describedby")}${addAttribute([
		"h-9.5 w-full rounded border bg-surface px-3 text-sm text-ink",
		"placeholder:text-ink-muted/60 transition-colors",
		"focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/15",
		error ? "border-danger" : "border-ink/15"
	], "class:list")}${spreadAttributes(rest)}>${error && renderTemplate`<p${addAttribute(describedBy, "id")} class="text-[13px] text-danger">${error}</p>`}</div>`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/components/ui/Input.astro", void 0);
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
	return renderTemplate`${renderComponent($$result, "AuthLayout", $$AuthLayout, {}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<form method="POST"${addAttribute(actions.auth.login, "action")} class="space-y-5"><div class="space-y-1.5"><h1 class="display-number text-[26px] leading-tight text-ink" style="font-variation-settings: 'opsz' 90;">Bienvenida de nuevo</h1><p class="text-sm text-ink-muted">Escribe tu contraseña para entrar al panel.</p></div>${errorGeneral && renderTemplate`<p role="alert" class="rounded border border-danger/30 bg-danger/5 px-3 py-2 text-[13px] text-danger">${errorGeneral}</p>`}${renderComponent($$result, "Input", $$Input, {
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
