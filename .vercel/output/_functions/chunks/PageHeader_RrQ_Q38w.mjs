import { A as renderTemplate, D as renderSlot, F as createRenderInstruction, N as addAttribute, j as maybeRenderHead, w as renderComponent, x as spreadAttributes } from "./sequence_CIT0iznN.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
import { t as actions } from "./_astro_actions_BzY1ztXX.mjs";
import { n as $$BaseLayout } from "./Button_CtbRWa0R.mjs";
//#region node_modules/astro/dist/runtime/server/render/script.js
/**
* Relies on the `renderScript: true` compiler option
* @experimental
*/
async function renderScript(result, id) {
	const inlined = result.inlinedScripts.get(id);
	let content = "";
	if (inlined != null) {
		if (inlined) content = `<script type="module">${inlined}<\/script>`;
	} else {
		const resolved = await result.resolve(id);
		content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
	}
	return createRenderInstruction({
		type: "script",
		id,
		content
	});
}
//#endregion
//#region node_modules/@lucide/astro/src/utils/defaultAttributes.ts
var defaultAttributes = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
};
//#endregion
//#region node_modules/@lucide/astro/src/utils/mergeClasses.ts
/**
* Merges classes into a single string
*
* @param {array} classes
* @returns {string} A string of classes
*/
var mergeClasses = (...classes) => classes.filter((className, index, array) => {
	return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
//#endregion
//#region node_modules/@lucide/astro/src/utils/buildLucideIconNode.ts
function isDefined(value) {
	return value !== null && value !== void 0;
}
/**
* Creates a Lucide icon node (an svgson-like format) from a Lucide icon object.
*
* @param icon The icon to build.
* @param params Additional build parameters.
*/
function buildLucideIconNode(icon, params = {}) {
	const attributeNames = params.attributeNames ?? {};
	const getAttributeName = (attributeName) => attributeNames[attributeName] ?? attributeName;
	const viewBoxWidth = icon.size ?? icon.width ?? defaultAttributes["width"];
	const viewBoxHeight = icon.size ?? icon.height ?? defaultAttributes["height"];
	const aliasClassNames = icon.aliases?.filter((alias) => typeof alias === "string" && alias.trim() !== "").map((alias) => `lucide-${alias}`) ?? [];
	const iconClassNames = [...icon.name ? [`lucide-${icon.name}`] : [], ...aliasClassNames];
	const classNamesFromClassName = params.className?.split(" ").filter(Boolean) ?? [];
	const className = params.includeDefaultClasses === false ? mergeClasses(...classNamesFromClassName) : mergeClasses("lucide", ...iconClassNames, ...classNamesFromClassName);
	const calculatedStrokeWidth = params.absoluteStrokeWidth ? Number(params.strokeWidth ?? defaultAttributes["stroke-width"]) * Number(icon.size ?? icon.width ?? defaultAttributes["width"]) / Number(params.size ?? params.width ?? defaultAttributes["width"]) : params.strokeWidth ?? defaultAttributes["stroke-width"];
	return [
		"svg",
		{
			...Object.entries(defaultAttributes).reduce((attrs, [attrName, value]) => {
				attrs[getAttributeName(attrName)] = value;
				return attrs;
			}, {}),
			..."color" in params && params.color && { [getAttributeName("stroke")]: params.color },
			..."size" in params && isDefined(params.size) && {
				[getAttributeName("width")]: params.size,
				[getAttributeName("height")]: params.size
			},
			..."width" in params && isDefined(params.width) && { [getAttributeName("width")]: params.width },
			..."height" in params && isDefined(params.height) && { [getAttributeName("height")]: params.height },
			[getAttributeName("stroke-width")]: calculatedStrokeWidth,
			...className && { [getAttributeName("class")]: className },
			[getAttributeName("viewBox")]: `0 0 ${viewBoxWidth} ${viewBoxHeight}`,
			...params.hasA11yProp === false ? { [getAttributeName("aria-hidden")]: "true" } : {},
			..."attributes" in params && params.attributes
		},
		icon.node.map((child) => {
			const [name, attrs, children] = child;
			const nextAttrs = params.nonScalingStroke ? {
				[getAttributeName("vector-effect")]: "non-scaling-stroke",
				...attrs
			} : attrs;
			return children ? [
				name,
				nextAttrs,
				children
			] : [name, nextAttrs];
		})
	];
}
//#endregion
//#region node_modules/@lucide/astro/src/utils/hasA11yProp.ts
/**
* Check if a component has an accessibility prop
*
* @param {object} props
* @returns {boolean} Whether the component has an accessibility prop
*/
var hasA11yProp = (props) => {
	for (const prop in props) if (prop.startsWith("aria-") || prop === "role" || prop === "title") return true;
	return false;
};
//#endregion
//#region node_modules/@lucide/astro/src/Icon.astro
createAstro("https://astro.build");
var $$Icon = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Icon;
	const { color = "currentColor", size = 24, width, height, "stroke-width": strokeWidth = 2, absoluteStrokeWidth = false, nonScalingStroke = false, iconNode = [], icon = {
		node: iconNode,
		aliases: [],
		size: 24
	}, class: className, ...rest } = Astro.props;
	const [, builtIconAttributes, builtIconNode = []] = buildLucideIconNode(icon, {
		color,
		width: width ?? size,
		height: height ?? size,
		strokeWidth,
		absoluteStrokeWidth,
		nonScalingStroke,
		className,
		hasA11yProp: hasA11yProp(rest)
	});
	const iconAttributes = {
		...builtIconAttributes,
		...rest
	};
	return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(iconAttributes)}>${builtIconNode.map(([Tag, attrs]) => renderTemplate`${renderComponent($$result, "Tag", Tag, { ...attrs })}`)}${renderSlot($$result, $$slots["default"])}</svg>`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/node_modules/@lucide/astro/src/Icon.astro", void 0);
//#endregion
//#region node_modules/@lucide/astro/src/createLucideIcon.ts
function createLucideIcon(iconOrIconName, iconNode = [], aliases = []) {
	const icon = typeof iconOrIconName === "string" ? {
		name: iconOrIconName,
		node: iconNode,
		aliases
	} : iconOrIconName;
	return createComponent(($$result, $$props, $$slots) => {
		const { class: className, ...restProps } = $$props;
		return renderTemplate`${renderComponent($$result, "Icon", $$Icon, {
			class: className,
			icon,
			...restProps
		}, { default: () => renderTemplate`${renderSlot($$result, $$slots["default"])}` })}`;
	}, void 0, "none");
}
//#endregion
//#region node_modules/@lucide/astro/src/icons/layout-dashboard.ts
/**
* @component @name LayoutDashboard
* @description Lucide SVG icon component, renders SVG Element with children.
*
* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI5IiB4PSIzIiB5PSIzIiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSIxNCIgeT0iMyIgcng9IjEiIC8+CiAgPHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iOSIgeD0iMTQiIHk9IjEyIiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSIzIiB5PSIxNiIgcng9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/layout-dashboard
* @see https://lucide.dev/guide/packages/lucide-astro - Documentation
*
* @param {import('../types').IconProps} props - Lucide icons props and any valid SVG attribute
* @returns {any} Astro Component
* 
*/
var LayoutDashboard = createLucideIcon({
	"name": "layout-dashboard",
	"size": 24,
	"node": [
		["rect", {
			"width": "7",
			"height": "9",
			"x": "3",
			"y": "3",
			"rx": "1"
		}],
		["rect", {
			"width": "7",
			"height": "5",
			"x": "14",
			"y": "3",
			"rx": "1"
		}],
		["rect", {
			"width": "7",
			"height": "9",
			"x": "14",
			"y": "12",
			"rx": "1"
		}],
		["rect", {
			"width": "7",
			"height": "5",
			"x": "3",
			"y": "16",
			"rx": "1"
		}]
	]
});
//#endregion
//#region node_modules/@lucide/astro/src/icons/log-out.ts
/**
* @component @name LogOut
* @description Lucide SVG icon component, renders SVG Element with children.
*
* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTYgMTcgNS01LTUtNSIgLz4KICA8cGF0aCBkPSJNMjEgMTJIOSIgLz4KICA8cGF0aCBkPSJNOSAyMUg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/log-out
* @see https://lucide.dev/guide/packages/lucide-astro - Documentation
*
* @param {import('../types').IconProps} props - Lucide icons props and any valid SVG attribute
* @returns {any} Astro Component
* 
*/
var LogOut = createLucideIcon({
	"name": "log-out",
	"size": 24,
	"node": [
		["path", { "d": "m16 17 5-5-5-5" }],
		["path", { "d": "M21 12H9" }],
		["path", { "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }]
	]
});
//#endregion
//#region node_modules/@lucide/astro/src/icons/package.ts
/**
* @component @name Package
* @description Lucide SVG icon component, renders SVG Element with children.
*
* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEgMjEuNzNhMiAyIDAgMCAwIDIgMGw3LTRBMiAyIDAgMCAwIDIxIDE2VjhhMiAyIDAgMCAwLTEtMS43M2wtNy00YTIgMiAwIDAgMC0yIDBsLTcgNEEyIDIgMCAwIDAgMyA4djhhMiAyIDAgMCAwIDEgMS43M3oiIC8+CiAgPHBhdGggZD0iTTEyIDIyVjEyIiAvPgogIDxwb2x5bGluZSBwb2ludHM9IjMuMjkgNyAxMiAxMiAyMC43MSA3IiAvPgogIDxwYXRoIGQ9Im03LjUgNC4yNyA5IDUuMTUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/package
* @see https://lucide.dev/guide/packages/lucide-astro - Documentation
*
* @param {import('../types').IconProps} props - Lucide icons props and any valid SVG attribute
* @returns {any} Astro Component
* 
*/
var Package = createLucideIcon({
	"name": "package",
	"size": 24,
	"node": [
		["path", { "d": "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" }],
		["path", { "d": "M12 22V12" }],
		["polyline", { "points": "3.29 7 12 12 20.71 7" }],
		["path", { "d": "m7.5 4.27 9 5.15" }]
	]
});
//#endregion
//#region node_modules/@lucide/astro/src/icons/shopping-bag.ts
/**
* @component @name ShoppingBag
* @description Lucide SVG icon component, renders SVG Element with children.
*
* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgMTBhNCA0IDAgMCAxLTggMCIgLz4KICA8cGF0aCBkPSJNMy4xMDMgNi4wMzRoMTcuNzk0IiAvPgogIDxwYXRoIGQ9Ik0zLjQgNS40NjdhMiAyIDAgMCAwLS40IDEuMlYyMGEyIDIgMCAwIDAgMiAyaDE0YTIgMiAwIDAgMCAyLTJWNi42NjdhMiAyIDAgMCAwLS40LTEuMmwtMi0yLjY2N0EyIDIgMCAwIDAgMTcgMkg3YTIgMiAwIDAgMC0xLjYuOHoiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/shopping-bag
* @see https://lucide.dev/guide/packages/lucide-astro - Documentation
*
* @param {import('../types').IconProps} props - Lucide icons props and any valid SVG attribute
* @returns {any} Astro Component
* 
*/
var ShoppingBag = createLucideIcon({
	"name": "shopping-bag",
	"size": 24,
	"node": [
		["path", { "d": "M16 10a4 4 0 0 1-8 0" }],
		["path", { "d": "M3.103 6.034h17.794" }],
		["path", { "d": "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" }]
	]
});
//#endregion
//#region node_modules/@lucide/astro/src/icons/users.ts
/**
* @component @name Users
* @description Lucide SVG icon component, renders SVG Element with children.
*
* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgMjF2LTJhNCA0IDAgMCAwLTQtNEg2YTQgNCAwIDAgMC00IDR2MiIgLz4KICA8cGF0aCBkPSJNMTYgMy4xMjhhNCA0IDAgMCAxIDAgNy43NDQiIC8+CiAgPHBhdGggZD0iTTIyIDIxdi0yYTQgNCAwIDAgMC0zLTMuODciIC8+CiAgPGNpcmNsZSBjeD0iOSIgY3k9IjciIHI9IjQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/users
* @see https://lucide.dev/guide/packages/lucide-astro - Documentation
*
* @param {import('../types').IconProps} props - Lucide icons props and any valid SVG attribute
* @returns {any} Astro Component
* 
*/
var Users = createLucideIcon({
	"name": "users",
	"size": 24,
	"node": [
		["path", { "d": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
		["path", { "d": "M16 3.128a4 4 0 0 1 0 7.744" }],
		["path", { "d": "M22 21v-2a4 4 0 0 0-3-3.87" }],
		["circle", {
			"cx": "9",
			"cy": "7",
			"r": "4"
		}]
	]
});
//#endregion
//#region node_modules/@lucide/astro/src/icons/wallet.ts
/**
* @component @name Wallet
* @description Lucide SVG icon component, renders SVG Element with children.
*
* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTkgN1Y0YTEgMSAwIDAgMC0xLTFINWEyIDIgMCAwIDAgMCA0aDE1YTEgMSAwIDAgMSAxIDF2NGgtM2EyIDIgMCAwIDAgMCA0aDNhMSAxIDAgMCAwIDEtMXYtMmExIDEgMCAwIDAtMS0xIiAvPgogIDxwYXRoIGQ9Ik0zIDV2MTRhMiAyIDAgMCAwIDIgMmgxNWExIDEgMCAwIDAgMS0xdi00IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/wallet
* @see https://lucide.dev/guide/packages/lucide-astro - Documentation
*
* @param {import('../types').IconProps} props - Lucide icons props and any valid SVG attribute
* @returns {any} Astro Component
* 
*/
var Wallet = createLucideIcon({
	"name": "wallet",
	"size": 24,
	"node": [["path", { "d": "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" }], ["path", { "d": "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" }]]
});
//#endregion
//#region src/components/Sidebar.astro
createAstro("https://astro.build");
var $$Sidebar = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Sidebar;
	const { active } = Astro.props;
	const items = [
		{
			key: "resumen",
			href: "/",
			label: "Resumen",
			icon: LayoutDashboard
		},
		{
			key: "ventas",
			href: "/ventas",
			label: "Ventas",
			icon: ShoppingBag
		},
		{
			key: "productos",
			href: "/productos",
			label: "Productos",
			icon: Package
		},
		{
			key: "gastos",
			href: "/gastos",
			label: "Gastos",
			icon: Wallet
		},
		{
			key: "clientas",
			href: "/clientas",
			label: "Clientas",
			icon: Users
		}
	];
	return renderTemplate`${maybeRenderHead($$result)}<aside id="sidebar" data-open="false" class="fixed inset-y-0 left-0 z-40 flex w-64 -translate-x-full flex-col bg-espresso transition-transform duration-200 ease-out data-[open=true]:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shrink-0"><div class="border-b border-white/10 px-5 pb-4 pt-6"><a href="/" class="block"><p class="font-display text-[22px] leading-none text-[#F7F3EE]" style="font-variation-settings: 'opsz' 100;">Panel</p><p class="mt-1.5 text-xs text-espresso-muted">Maquillaje</p></a></div><nav class="flex-1 overflow-y-auto px-3 py-4" aria-label="Secciones del panel">${items.map(({ key, href, label, icon: Icon }) => renderTemplate`<a${addAttribute(href, "href")}${addAttribute(active === key ? "page" : void 0, "aria-current")}${addAttribute(["group mb-0.5 flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors", active === key ? "bg-white/10 text-white" : "text-espresso-muted hover:bg-white/5 hover:text-white"], "class:list")}>${renderComponent($$result, "Icon", Icon, {
		"size": 17,
		"class:list": ["shrink-0 transition-colors", active === key ? "text-rose" : "text-espresso-muted group-hover:text-white"]
	})}${label}${active === key && renderTemplate`<span class="ml-auto h-1.5 w-1.5 rounded-full bg-rose" aria-hidden="true"></span>`}</a>`)}</nav><div class="border-t border-white/10 p-3"><form method="POST"${addAttribute(actions.auth.logout, "action")}><button type="submit" class="flex w-full items-center gap-3 rounded px-3 py-2 text-sm text-espresso-muted transition-colors hover:bg-white/5 hover:text-white">${renderComponent($$result, "LogOut", LogOut, {
		"size": 17,
		"class": "shrink-0"
	})}Cerrar sesión</button></form></div></aside><div id="sidebar-backdrop" data-open="false" class="pointer-events-none fixed inset-0 z-30 bg-ink/40 opacity-0 transition-opacity duration-200 lg:hidden data-[open=true]:pointer-events-auto data-[open=true]:opacity-100" aria-hidden="true"></div>${renderScript($$result, "/home/nicode/Proyectos/proyecto_maquillaje/src/components/Sidebar.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/components/Sidebar.astro", void 0);
//#endregion
//#region src/lib/format.ts
var copFormatter = new Intl.NumberFormat("es-CO", {
	style: "currency",
	currency: "COP",
	maximumFractionDigits: 0
});
var longDateFormatter = new Intl.DateTimeFormat("es-CO", {
	weekday: "long",
	day: "numeric",
	month: "long",
	year: "numeric"
});
var shortDateFormatter = new Intl.DateTimeFormat("es-CO", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric"
});
var monthNameFormatter = new Intl.DateTimeFormat("es-CO", {
	month: "long",
	year: "numeric"
});
function formatCOP(amount) {
	return copFormatter.format(Math.round(amount));
}
function formatFechaLarga(date) {
	return longDateFormatter.format(toDate(date));
}
function formatFechaCorta(date) {
	return shortDateFormatter.format(toDate(date));
}
function formatMes(date) {
	return monthNameFormatter.format(toDate(date));
}
function hoyISO() {
	const now = /* @__PURE__ */ new Date();
	const offset = now.getTimezoneOffset();
	return (/* @__PURE__ */ new Date(now.getTime() - offset * 6e4)).toISOString().slice(0, 10);
}
function mesISO(date = /* @__PURE__ */ new Date()) {
	return toDate(date).toISOString().slice(0, 7);
}
function parseISODate(value) {
	return /* @__PURE__ */ new Date(`${value}T12:00:00`);
}
function toDate(value) {
	if (value instanceof Date) return value;
	return parseISODate(value);
}
//#endregion
//#region src/layouts/DashboardLayout.astro
createAstro("https://astro.build");
var $$DashboardLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$DashboardLayout;
	const { title, active } = Astro.props;
	const fecha = formatFechaLarga(hoyISO());
	const fechaCapitalizada = fecha.charAt(0).toUpperCase() + fecha.slice(1);
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${title} · Panel` }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="min-h-screen lg:flex">${renderComponent($$result, "Sidebar", $$Sidebar, { "active": active })}<div class="flex min-w-0 flex-1 flex-col"><header class="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-hairline bg-paper/90 px-4 backdrop-blur sm:px-6 lg:px-8"><button type="button" id="menu-toggle" class="-ml-1 flex h-9 w-9 items-center justify-center rounded text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink lg:hidden" aria-controls="sidebar" aria-expanded="false" aria-label="Abrir menú de navegación"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"></path></svg></button><p class="text-[13px] font-medium text-ink">${title}</p><p class="ml-auto hidden text-[13px] text-ink-muted sm:block">${fechaCapitalizada}</p></header><main class="mx-auto w-full max-w-[1120px] flex-1 px-4 py-7 sm:px-6 lg:px-8 lg:py-9">${renderSlot($$result, $$slots["default"])}</main></div></div>` })}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/layouts/DashboardLayout.astro", void 0);
//#endregion
//#region src/components/ui/PageHeader.astro
createAstro("https://astro.build");
var $$PageHeader = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PageHeader;
	const { title, description, class: className = "" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<header${addAttribute(["border-b border-hairline pb-5", className], "class:list")}><div class="flex flex-wrap items-end justify-between gap-4"><div class="space-y-1"><h1 class="display-number text-[28px] leading-tight text-ink" style="font-variation-settings: 'opsz' 90;">${title}</h1>${description && renderTemplate`<p class="text-sm text-ink-muted">${description}</p>`}</div><div class="flex items-center gap-2">${renderSlot($$result, $$slots["default"])}</div></div></header>`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/components/ui/PageHeader.astro", void 0);
//#endregion
export { formatFechaLarga as a, mesISO as c, formatFechaCorta as i, createLucideIcon as l, $$DashboardLayout as n, formatMes as o, formatCOP as r, hoyISO as s, $$PageHeader as t, renderScript as u };
