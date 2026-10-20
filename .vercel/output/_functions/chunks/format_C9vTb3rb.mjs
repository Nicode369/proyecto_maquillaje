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
function capitalizarNombre(nombre) {
	return nombre.trim().replace(/\s+/g, " ").replace(/(^|[\s'-])(\p{L})/gu, (_, sep, letra) => sep + letra.toUpperCase());
}
function toDate(value) {
	if (value instanceof Date) return value;
	return parseISODate(value);
}
//#endregion
export { formatMes as a, formatFechaLarga as i, formatCOP as n, hoyISO as o, formatFechaCorta as r, mesISO as s, capitalizarNombre as t };
