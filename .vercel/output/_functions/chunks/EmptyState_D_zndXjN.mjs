import { A as renderTemplate, D as renderSlot, N as addAttribute, j as maybeRenderHead } from "./sequence_DxXwX9gt.mjs";
import { n as createComponent, t as createAstro } from "./compiler_Ij6EkFK0.mjs";
import { o as createLucideIcon } from "./PageHeader_iP2MHsvI.mjs";
//#region node_modules/@lucide/astro/src/icons/pencil.ts
/**
* @component @name Pencil
* @description Lucide SVG icon component, renders SVG Element with children.
*
* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEuMTc0IDYuODEyYTEgMSAwIDAgMC0zLjk4Ni0zLjk4N0wzLjg0MiAxNi4xNzRhMiAyIDAgMCAwLS41LjgzbC0xLjMyMSA0LjM1MmEuNS41IDAgMCAwIC42MjMuNjIybDQuMzUzLTEuMzJhMiAyIDAgMCAwIC44My0uNDk3eiIgLz4KICA8cGF0aCBkPSJtMTUgNSA0IDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/pencil
* @see https://lucide.dev/guide/packages/lucide-astro - Documentation
*
* @param {import('../types').IconProps} props - Lucide icons props and any valid SVG attribute
* @returns {any} Astro Component
* 
*/
var Pencil = createLucideIcon({
	"name": "pencil",
	"size": 24,
	"node": [["path", { "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" }], ["path", { "d": "m15 5 4 4" }]]
});
//#endregion
//#region node_modules/@lucide/astro/src/icons/trash.ts
/**
* @component @name Trash
* @description Lucide SVG icon component, renders SVG Element with children.
*
* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTF2NiIgLz4KICA8cGF0aCBkPSJNMTQgMTF2NiIgLz4KICA8cGF0aCBkPSJNMTkgNnYxNGEyIDIgMCAwIDEtMiAySDdhMiAyIDAgMCAxLTItMlY2IiAvPgogIDxwYXRoIGQ9Ik0zIDZoMTgiIC8+CiAgPHBhdGggZD0iTTggNlY0YTIgMiAwIDAgMSAyLTJoNGEyIDIgMCAwIDEgMiAydjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/trash
* @see https://lucide.dev/guide/packages/lucide-astro - Documentation
*
* @param {import('../types').IconProps} props - Lucide icons props and any valid SVG attribute
* @returns {any} Astro Component
* 
*/
var Trash = createLucideIcon({
	"name": "trash",
	"size": 24,
	"node": [
		["path", { "d": "M10 11v6" }],
		["path", { "d": "M14 11v6" }],
		["path", { "d": "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }],
		["path", { "d": "M3 6h18" }],
		["path", { "d": "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]
	],
	"aliases": ["trash-2"]
});
//#endregion
//#region src/components/ui/EmptyState.astro
createAstro("https://astro.build");
var $$EmptyState = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$EmptyState;
	const { title, description, class: className = "" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["flex flex-col items-center gap-3 px-6 py-14 text-center", className], "class:list")}><div class="text-rose">${renderSlot($$result, $$slots["icon"])}</div><div class="space-y-1"><p class="font-display text-lg font-medium text-ink" style="font-variation-settings: 'opsz' 40;">${title}</p>${description && renderTemplate`<p class="mx-auto max-w-sm text-sm text-ink-muted">${description}</p>`}</div>${renderSlot($$result, $$slots["default"])}</div>`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/components/ui/EmptyState.astro", void 0);
//#endregion
export { Trash as n, Pencil as r, $$EmptyState as t };
