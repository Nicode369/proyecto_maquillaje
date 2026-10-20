import { A as renderTemplate, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_CIT0iznN.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
import { l as createLucideIcon } from "./PageHeader_DRqm_oFd.mjs";
//#region node_modules/@lucide/astro/src/icons/plus.ts
/**
* @component @name Plus
* @description Lucide SVG icon component, renders SVG Element with children.
*
* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAxMmgxNCIgLz4KICA8cGF0aCBkPSJNMTIgNXYxNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/plus
* @see https://lucide.dev/guide/packages/lucide-astro - Documentation
*
* @param {import('../types').IconProps} props - Lucide icons props and any valid SVG attribute
* @returns {any} Astro Component
* 
*/
var Plus = createLucideIcon({
	"name": "plus",
	"size": 24,
	"node": [["path", { "d": "M5 12h14" }], ["path", { "d": "M12 5v14" }]]
});
//#endregion
//#region node_modules/@lucide/astro/src/icons/search.ts
/**
* @component @name Search
* @description Lucide SVG icon component, renders SVG Element with children.
*
* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMjEgMjEtNC4zNC00LjM0IiAvPgogIDxjaXJjbGUgY3g9IjExIiBjeT0iMTEiIHI9IjgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/search
* @see https://lucide.dev/guide/packages/lucide-astro - Documentation
*
* @param {import('../types').IconProps} props - Lucide icons props and any valid SVG attribute
* @returns {any} Astro Component
* 
*/
var Search = createLucideIcon({
	"name": "search",
	"size": 24,
	"node": [["path", { "d": "m21 21-4.34-4.34" }], ["circle", {
		"cx": "11",
		"cy": "11",
		"r": "8"
	}]]
});
//#endregion
//#region node_modules/@lucide/astro/src/icons/x.ts
/**
* @component @name X
* @description Lucide SVG icon component, renders SVG Element with children.
*
* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggNiA2IDE4IiAvPgogIDxwYXRoIGQ9Im02IDYgMTIgMTIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/x
* @see https://lucide.dev/guide/packages/lucide-astro - Documentation
*
* @param {import('../types').IconProps} props - Lucide icons props and any valid SVG attribute
* @returns {any} Astro Component
* 
*/
var X = createLucideIcon({
	"name": "x",
	"size": 24,
	"node": [["path", { "d": "M18 6 6 18" }], ["path", { "d": "m6 6 12 12" }]]
});
//#endregion
//#region src/components/LimpiarFiltros.astro
createAstro("https://astro.build");
var $$LimpiarFiltros = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$LimpiarFiltros;
	const { href, class: className = "" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(href, "href")}${addAttribute(["inline-flex items-center gap-1.5 rounded-full border border-wine/40 bg-surface px-3 py-1.5 text-xs font-medium text-wine transition-colors hover:border-wine/60 hover:bg-wine-soft", className], "class:list")}>${renderComponent($$result, "X", X, { "size": 14 })}Limpiar filtros</a>`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/components/LimpiarFiltros.astro", void 0);
//#endregion
export { Search as n, Plus as r, $$LimpiarFiltros as t };
