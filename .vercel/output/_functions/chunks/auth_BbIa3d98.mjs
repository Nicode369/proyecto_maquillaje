import { r as SESSION_SECRET } from "./server_DO_fYqGA.mjs";
//#region src/lib/auth.ts
var SESSION_COOKIE = "panel_session";
var DURACION_MS = 12096e5;
function toBase64Url(bytes) {
	let bin = "";
	for (const byte of bytes) bin += String.fromCharCode(byte);
	return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromBase64Url(value) {
	const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
	const bin = atob(base64);
	const bytes = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
	return bytes;
}
async function claveHmac() {
	return crypto.subtle.importKey("raw", new TextEncoder().encode(SESSION_SECRET), {
		name: "HMAC",
		hash: "SHA-256"
	}, false, ["sign", "verify"]);
}
async function firmarSesion() {
	const cuerpo = toBase64Url(new TextEncoder().encode(JSON.stringify({ exp: Date.now() + DURACION_MS })));
	const firma = await crypto.subtle.sign("HMAC", await claveHmac(), new TextEncoder().encode(cuerpo));
	return `${cuerpo}.${toBase64Url(new Uint8Array(firma))}`;
}
async function verificarSesion(token) {
	if (!token) return false;
	const [cuerpo, firma] = token.split(".");
	if (!cuerpo || !firma) return false;
	try {
		if (!await crypto.subtle.verify("HMAC", await claveHmac(), fromBase64Url(firma), new TextEncoder().encode(cuerpo))) return false;
		const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(cuerpo)));
		return typeof payload.exp === "number" && payload.exp > Date.now();
	} catch {
		return false;
	}
}
function opcionesCookie() {
	return {
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		path: "/",
		maxAge: DURACION_MS / 1e3
	};
}
function contrasenasIguales(a, b) {
	const encoder = new TextEncoder();
	const ba = encoder.encode(a);
	const bb = encoder.encode(b);
	if (ba.length !== bb.length) return false;
	let diff = 0;
	for (let i = 0; i < ba.length; i++) diff |= ba[i] ^ bb[i];
	return diff === 0;
}
//#endregion
export { verificarSesion as a, opcionesCookie as i, contrasenasIguales as n, firmarSesion as r, SESSION_COOKIE as t };
