import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, N as addAttribute, j as maybeRenderHead, w as renderComponent } from "./sequence_CIT0iznN.mjs";
import { n as createComponent, t as createAstro } from "./compiler_D5p6FHCN.mjs";
import { i as renderScript, n as $$DashboardLayout, r as createLucideIcon, t as $$PageHeader } from "./PageHeader_vdNxn5rr.mjs";
import { t as sql } from "./db_BRoxtVEw.mjs";
import { a as formatMes, n as formatCOP, r as formatFechaCorta, s as mesISO } from "./format_C9vTb3rb.mjs";
import { t as $$Card } from "./Card_ASULwIyD.mjs";
import { t as $$Button } from "./Button_C8T8wdfZ.mjs";
import { t as $$Badge } from "./Badge_DYdURA09.mjs";
import { t as $$EmptyState } from "./EmptyState_s9NtGM7p.mjs";
//#region node_modules/@lucide/astro/src/icons/trending-down.ts
/**
* @component @name TrendingDown
* @description Lucide SVG icon component, renders SVG Element with children.
*
* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgMTdoNnYtNiIgLz4KICA8cGF0aCBkPSJtMjIgMTctOC41LTguNS01IDVMMiA3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/trending-down
* @see https://lucide.dev/guide/packages/lucide-astro - Documentation
*
* @param {import('../types').IconProps} props - Lucide icons props and any valid SVG attribute
* @returns {any} Astro Component
* 
*/
var TrendingDown = createLucideIcon({
	"name": "trending-down",
	"size": 24,
	"node": [["path", { "d": "M16 17h6v-6" }], ["path", { "d": "m22 17-8.5-8.5-5 5L2 7" }]]
});
//#endregion
//#region node_modules/@lucide/astro/src/icons/trending-up.ts
/**
* @component @name TrendingUp
* @description Lucide SVG icon component, renders SVG Element with children.
*
* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgN2g2djYiIC8+CiAgPHBhdGggZD0ibTIyIDctOC41IDguNS01LTVMMiAxNyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/trending-up
* @see https://lucide.dev/guide/packages/lucide-astro - Documentation
*
* @param {import('../types').IconProps} props - Lucide icons props and any valid SVG attribute
* @returns {any} Astro Component
* 
*/
var TrendingUp = createLucideIcon({
	"name": "trending-up",
	"size": 24,
	"node": [["path", { "d": "M16 7h6v6" }], ["path", { "d": "m22 7-8.5 8.5-5-5L2 17" }]]
});
//#endregion
//#region src/lib/queries/reportes.ts
function mesAnterior(mes) {
	const [anio, m] = mes.split("-").map(Number);
	const d = new Date(anio, m - 2, 1);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
async function kpisMes(mes) {
	const prev = mesAnterior(mes);
	const [actualRows, anteriorRows, gastosRows, gastosPrevRows] = await Promise.all([
		sql`
      SELECT
        (SELECT COUNT(*)::int FROM ventas
          WHERE NOT anulada AND to_char(fecha, 'YYYY-MM') = ${mes}) AS n,
        (
          SELECT COALESCE(SUM(v.total), 0)::float8
          FROM ventas v
          WHERE NOT v.anulada AND NOT v.credito AND to_char(v.fecha, 'YYYY-MM') = ${mes}
        ) +
        (
          SELECT COALESCE(SUM(a.monto), 0)::float8
          FROM abonos a
          INNER JOIN ventas v ON v.id = a.venta_id AND NOT v.anulada
          WHERE to_char(a.fecha, 'YYYY-MM') = ${mes}
        ) AS total`,
		sql`
      SELECT
        (SELECT COUNT(*)::int FROM ventas
          WHERE NOT anulada AND to_char(fecha, 'YYYY-MM') = ${prev}) AS n,
        (
          SELECT COALESCE(SUM(v.total), 0)::float8
          FROM ventas v
          WHERE NOT v.anulada AND NOT v.credito AND to_char(v.fecha, 'YYYY-MM') = ${prev}
        ) +
        (
          SELECT COALESCE(SUM(a.monto), 0)::float8
          FROM abonos a
          INNER JOIN ventas v ON v.id = a.venta_id AND NOT v.anulada
          WHERE to_char(a.fecha, 'YYYY-MM') = ${prev}
        ) AS total`,
		sql`
      SELECT COALESCE(SUM(monto), 0)::float8 AS total
      FROM gastos
      WHERE to_char(fecha, 'YYYY-MM') = ${mes}`,
		sql`
      SELECT COALESCE(SUM(monto), 0)::float8 AS total
      FROM gastos
      WHERE to_char(fecha, 'YYYY-MM') = ${prev}`
	]);
	const actual = actualRows[0];
	const anterior = anteriorRows[0];
	const gastosRow = gastosRows[0];
	const gastosPrev = gastosPrevRows[0];
	const ingresos = Number(actual.total);
	const gastos = Number(gastosRow.total);
	const nVentas = actual.n;
	return {
		ingresos,
		gastos,
		ganancia: ingresos - gastos,
		nVentas,
		ticketPromedio: nVentas > 0 ? ingresos / nVentas : 0,
		prevIngresos: Number(anterior.total),
		prevGastos: Number(gastosPrev.total),
		prevNVentas: anterior.n
	};
}
async function serieMensual(nMeses = 6) {
	const desde = /* @__PURE__ */ new Date();
	desde.setMonth(desde.getMonth() - (nMeses - 1));
	const desdeISO = `${desde.getFullYear()}-${String(desde.getMonth() + 1).padStart(2, "0")}-01`;
	const [ingresosRows, gastosRows] = await Promise.all([sql`
      SELECT mes, COALESCE(SUM(monto), 0)::float8 AS ingresos
      FROM (
        SELECT to_char(v.fecha, 'YYYY-MM') AS mes, v.total AS monto
        FROM ventas v
        WHERE NOT v.anulada AND NOT v.credito AND v.fecha >= ${desdeISO}
        UNION ALL
        SELECT to_char(a.fecha, 'YYYY-MM') AS mes, a.monto
        FROM abonos a
        INNER JOIN ventas v ON v.id = a.venta_id AND NOT v.anulada
        WHERE a.fecha >= ${desdeISO}
      ) cobros
      GROUP BY mes
      ORDER BY mes`, sql`
      SELECT to_char(fecha, 'YYYY-MM') AS mes, COALESCE(SUM(monto), 0)::float8 AS gastos
      FROM gastos
      WHERE fecha >= ${desdeISO}
      GROUP BY 1
      ORDER BY 1`]);
	const ingresosMap = new Map(ingresosRows.map((r) => [r.mes, Number(r.ingresos)]));
	const gastosMap = new Map(gastosRows.map((r) => [r.mes, Number(r.gastos)]));
	const serie = [];
	const cursor = new Date(desde);
	for (let i = 0; i < nMeses; i++) {
		const clave = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
		serie.push({
			mes: clave,
			ingresos: ingresosMap.get(clave) ?? 0,
			gastos: gastosMap.get(clave) ?? 0
		});
		cursor.setMonth(cursor.getMonth() + 1);
	}
	return serie;
}
async function stockBajo() {
	return await sql`
    SELECT id, nombre, marca, stock, stock_minimo
    FROM productos
    WHERE activo AND stock <= stock_minimo
    ORDER BY stock ASC
    LIMIT 6`;
}
async function ultimasVentas(limit = 5) {
	return await sql`
    SELECT
      v.id,
      v.fecha::text AS fecha,
      c.nombre AS cliente_nombre,
      v.total::float8 AS total,
      v.anulada
    FROM ventas v
    LEFT JOIN clientes c ON c.id = v.cliente_id
    ORDER BY v.fecha DESC, v.created_at DESC
    LIMIT ${limit}`;
}
async function topClientes(limit = 5) {
	return await sql`
    SELECT
      c.id,
      c.nombre,
      COUNT(v.id)::int AS compras,
      COALESCE(SUM(v.total), 0)::float8 AS gasto
    FROM clientes c
    INNER JOIN ventas v ON v.cliente_id = c.id AND NOT v.anulada
    GROUP BY c.id
    ORDER BY gasto DESC, compras DESC
    LIMIT ${limit}`;
}
async function topProductos(limit = 5) {
	return await sql`
    SELECT
      p.id,
      p.nombre,
      SUM(i.cantidad)::int AS unidades,
      COALESCE(SUM(i.subtotal), 0)::float8 AS ingresos
    FROM venta_items i
    INNER JOIN ventas v ON v.id = i.venta_id AND NOT v.anulada
    INNER JOIN productos p ON p.id = i.producto_id
    GROUP BY p.id
    ORDER BY unidades DESC, ingresos DESC
    LIMIT ${limit}`;
}
async function porCobrar() {
	const [row] = await sql`
    SELECT COALESCE(
      SUM(GREATEST(v.total - COALESCE(ab.pagado, 0), 0)), 0
    )::float8 AS total
    FROM ventas v
    LEFT JOIN LATERAL (
      SELECT COALESCE(SUM(a.monto), 0)::float8 AS pagado
      FROM abonos a WHERE a.venta_id = v.id
    ) ab ON true
    WHERE v.credito AND NOT v.anulada`;
	return Number(row.total);
}
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
createAstro("https://astro.build");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const mes = Astro.url.searchParams.get("mes")?.trim() || mesISO();
	const [kpis, serie, bajoStock, topsC, topsP, recientes, cobrar] = await Promise.all([
		kpisMes(mes),
		serieMensual(6),
		stockBajo(),
		topClientes(5),
		topProductos(5),
		ultimasVentas(5),
		porCobrar()
	]);
	function delta(actual, anterior) {
		if (anterior === 0) return {
			pct: null,
			texto: actual > 0 ? "nuevo" : "sin cambio"
		};
		const pct = Math.round((actual - anterior) / anterior * 100);
		return {
			pct,
			texto: `${pct > 0 ? "+" : ""}${pct}% vs mes anterior`
		};
	}
	const dGanancia = delta(kpis.ganancia, kpis.prevIngresos - kpis.prevGastos);
	const dIngresos = delta(kpis.ingresos, kpis.prevIngresos);
	const dGastos = delta(kpis.gastos, kpis.prevGastos);
	const dVentas = delta(kpis.nVentas, kpis.prevNVentas);
	const datosGrafica = {
		etiquetas: serie.map((p) => formatMes(`${p.mes}-01`).slice(0, 3)),
		ingresos: serie.map((p) => p.ingresos),
		gastos: serie.map((p) => p.gastos)
	};
	function tonoDelta(valor) {
		if (valor.pct === null || valor.pct === 0) return "text-ink-muted";
		return valor.pct > 0 === valor.buenSube ? "text-sage" : "text-danger";
	}
	const deltas = [
		{
			label: "Ganancia",
			valor: kpis.ganancia,
			d: dGanancia,
			buenSube: true,
			hero: true
		},
		{
			label: "Ingresos",
			valor: kpis.ingresos,
			d: dIngresos,
			buenSube: true
		},
		{
			label: "Gastos",
			valor: kpis.gastos,
			d: dGastos,
			buenSube: false
		}
	];
	return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, {
		"title": "Resumen",
		"active": "resumen"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "PageHeader", $$PageHeader, {
		"title": "Resumen",
		"description": formatMes(`${mes}-01`)
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<form method="GET" action="/" class="flex items-center gap-2"><input type="month" name="mes"${addAttribute(mes, "value")} aria-label="Mes a consultar" class="h-9.5 rounded-lg border border-ink/15 bg-surface px-3 text-sm text-ink focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/15">${renderComponent($$result, "Button", $$Button, {
		"variant": "outline",
		"type": "submit"
	}, { "default": ($$result) => renderTemplate`Ver` })}</form>` })}<div class="mt-6 grid grid-cols-1 divide-y divide-hairline overflow-hidden rounded-xl border border-hairline bg-surface sm:grid-cols-2 lg:grid-cols-7 lg:divide-x lg:divide-y-0">${deltas.map(({ label, valor, d, buenSube, hero }) => renderTemplate`<div${addAttribute(["p-5", hero && "lg:col-span-2"], "class:list")}><p class="text-xs tracking-wide text-ink-muted uppercase">${label}</p><p${addAttribute(["display-number mt-1", hero ? "text-[32px] text-wine" : "text-2xl text-ink"], "class:list")}>${formatCOP(valor)}</p><p${addAttribute(["mt-1 flex items-center gap-1 text-[12px]", tonoDelta({
		...d,
		buenSube
	})], "class:list")}>${d.pct !== null && d.pct !== 0 && (d.pct > 0 ? renderTemplate`${renderComponent($$result, "TrendingUp", TrendingUp, { "size": 12 })}` : renderTemplate`${renderComponent($$result, "TrendingDown", TrendingDown, { "size": 12 })}`)}${d.texto}</p></div>`)}<div class="p-5"><p class="text-xs tracking-wide text-ink-muted uppercase">Ventas</p><p class="display-number mt-1 text-2xl text-ink">${kpis.nVentas}</p><p${addAttribute(["mt-1 flex items-center gap-1 text-[12px]", tonoDelta({
		...dVentas,
		buenSube: true
	})], "class:list")}>${dVentas.pct !== null && dVentas.pct !== 0 && (dVentas.pct > 0 ? renderTemplate`${renderComponent($$result, "TrendingUp", TrendingUp, { "size": 12 })}` : renderTemplate`${renderComponent($$result, "TrendingDown", TrendingDown, { "size": 12 })}`)}${dVentas.texto}</p></div><div class="p-5"><p class="text-xs tracking-wide text-ink-muted uppercase">Ticket promedio</p><p class="display-number mt-1 text-2xl text-ink">${formatCOP(kpis.ticketPromedio)}</p><p class="mt-1 text-[12px] text-ink-muted">por venta</p></div><div class="p-5"><p class="text-xs tracking-wide text-ink-muted uppercase">Por cobrar</p><p${addAttribute(["display-number mt-1 text-2xl", cobrar > 0 ? "text-ochre" : "text-ink"], "class:list")}>${formatCOP(cobrar)}</p><p class="mt-1 text-[12px] text-ink-muted">total fiado · todas las ventas a crédito</p></div></div><div class="mt-6 grid gap-6 lg:grid-cols-3">${renderComponent($$result, "Card", $$Card, { "class": "lg:col-span-2" }, { "default": ($$result) => renderTemplate`<div class="flex items-baseline justify-between"><h2 class="font-display text-lg text-ink" style="font-variation-settings: 'opsz' 40;">Ingresos y gastos</h2><div class="flex items-center gap-4 text-[12px] text-ink-muted"><span class="flex items-center gap-1.5"><span class="inline-block h-2 w-2 rounded-full bg-wine"></span>Ingresos</span><span class="flex items-center gap-1.5"><span class="inline-block h-2 w-2 rounded-full bg-espresso"></span>Gastos</span></div></div><div class="relative mt-4 h-64"><canvas id="grafica-mes"${addAttribute(JSON.stringify(datosGrafica), "data-datos")} aria-label="Gráfica de ingresos y gastos de los últimos 6 meses" role="img"></canvas></div>` })}${renderComponent($$result, "Card", $$Card, { "class": "flex flex-col" }, { "default": ($$result) => renderTemplate`<h2 class="font-display text-lg text-ink" style="font-variation-settings: 'opsz' 40;">Stock bajo</h2>${bajoStock.length === 0 ? renderTemplate`<p class="mt-3 text-sm text-ink-muted">Todo el inventario está por encima del mínimo.</p>` : renderTemplate`<ul class="mt-3 divide-y divide-hairline">${bajoStock.map((p) => renderTemplate`<li class="flex items-center justify-between gap-2 py-2.5"><div class="min-w-0"><p class="truncate text-sm font-medium text-ink">${p.nombre}</p><p class="truncate text-xs text-ink-muted">${p.marca ?? "Sin marca"}</p></div>${renderComponent($$result, "Badge", $$Badge, { "tone": p.stock === 0 ? "danger" : "warning" }, { "default": ($$result) => renderTemplate`${p.stock === 0 ? "Agotado" : `${p.stock} und.`}` })}</li>`)}</ul>`}<a href="/productos?stock=bajo" class="mt-auto pt-3 text-[13px] text-wine hover:underline">Ver inventario →</a>` })}</div><div class="mt-6 grid gap-6 lg:grid-cols-2">${renderComponent($$result, "Card", $$Card, {}, { "default": ($$result) => renderTemplate`<h2 class="font-display text-lg text-ink" style="font-variation-settings: 'opsz' 40;">Mejores clientas</h2>${topsC.length === 0 ? renderTemplate`<p class="mt-3 text-sm text-ink-muted">Aún no hay ventas registradas.</p>` : renderTemplate`<ul class="mt-3 divide-y divide-hairline">${topsC.map((c) => renderTemplate`<li class="flex items-center justify-between gap-3 py-2.5"><a${addAttribute(`/clientas/${c.id}`, "href")} class="min-w-0 hover:text-wine"><p class="truncate text-sm font-medium text-ink">${c.nombre}</p><p class="text-xs text-ink-muted">${c.compras} ${c.compras === 1 ? "compra" : "compras"}</p></a><p class="num font-display text-sm">${formatCOP(c.gasto)}</p></li>`)}</ul>`}` })}${renderComponent($$result, "Card", $$Card, {}, { "default": ($$result) => renderTemplate`<h2 class="font-display text-lg text-ink" style="font-variation-settings: 'opsz' 40;">Productos más vendidos</h2>${topsP.length === 0 ? renderTemplate`<p class="mt-3 text-sm text-ink-muted">Aún no hay ventas registradas.</p>` : renderTemplate`<ul class="mt-3 divide-y divide-hairline">${topsP.map((p) => renderTemplate`<li class="flex items-center justify-between gap-3 py-2.5"><div class="min-w-0"><p class="truncate text-sm font-medium text-ink">${p.nombre}</p><p class="text-xs text-ink-muted">${p.unidades} ${p.unidades === 1 ? "unidad" : "unidades"}</p></div><p class="num font-display text-sm">${formatCOP(p.ingresos)}</p></li>`)}</ul>`}` })}</div><h2 class="mt-10 border-b border-hairline pb-2 font-display text-lg text-ink" style="font-variation-settings: 'opsz' 40;">Últimas ventas</h2>${recientes.length === 0 ? renderTemplate`<div class="mt-4 overflow-hidden rounded-xl border border-hairline bg-surface">${renderComponent($$result, "EmptyState", $$EmptyState, {
		"title": "Sin ventas todavía",
		"description": "Cuando registres tu primera venta aparecerá aquí."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Button", $$Button, { "href": "/ventas/nueva" }, { "default": ($$result) => renderTemplate`Registrar venta` })}` })}</div>` : renderTemplate`<div class="mt-4 overflow-hidden rounded-xl border border-hairline bg-surface"><ul class="divide-y divide-hairline">${recientes.map((v) => renderTemplate`<li><a${addAttribute(`/ventas/${v.id}`, "href")} class="flex items-center gap-4 p-4 hover:bg-wine/3"><div class="min-w-0 flex-1"><p class="truncate text-sm font-medium text-ink">${v.cliente_nombre ?? "Sin clienta"}</p><p class="text-xs text-ink-muted">${formatFechaCorta(v.fecha)}</p></div>${v.anulada && renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "tone": "danger" }, { "default": ($$result) => renderTemplate`Anulada` })}`}<p class="num font-display text-sm">${formatCOP(v.total)}</p></a></li>`)}</ul></div>`}` })}${renderScript($$result, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/index.astro", void 0);
var $$file = "/home/nicode/Proyectos/proyecto_maquillaje/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
