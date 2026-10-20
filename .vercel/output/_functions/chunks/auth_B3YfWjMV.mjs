import { At as setOnSetGetEnv, Dt as createInvalidVariablesError, Ot as getEnv$1 } from "./sequence_vYO_GrXQ.mjs";
//#region node_modules/astro/dist/env/validators.js
function getEnvFieldType(options) {
	const optional = options.optional ? options.default !== void 0 ? false : true : false;
	let type;
	if (options.type === "enum") type = options.values.map((v) => `'${v}'`).join(" | ");
	else type = options.type;
	return `${type}${optional ? " | undefined" : ""}`;
}
var stringValidator = ({ max, min, length, url, includes, startsWith, endsWith }) => (input) => {
	if (typeof input !== "string") return {
		ok: false,
		errors: ["type"]
	};
	const errors = [];
	if (max !== void 0 && !(input.length <= max)) errors.push("max");
	if (min !== void 0 && !(input.length >= min)) errors.push("min");
	if (length !== void 0 && !(input.length === length)) errors.push("length");
	if (url !== void 0 && !URL.canParse(input)) errors.push("url");
	if (includes !== void 0 && !input.includes(includes)) errors.push("includes");
	if (startsWith !== void 0 && !input.startsWith(startsWith)) errors.push("startsWith");
	if (endsWith !== void 0 && !input.endsWith(endsWith)) errors.push("endsWith");
	if (errors.length > 0) return {
		ok: false,
		errors
	};
	return {
		ok: true,
		value: input
	};
};
var numberValidator = ({ gt, min, lt, max, int }) => (input) => {
	const num = Number.parseFloat(input ?? "");
	if (isNaN(num)) return {
		ok: false,
		errors: ["type"]
	};
	const errors = [];
	if (gt !== void 0 && !(num > gt)) errors.push("gt");
	if (min !== void 0 && !(num >= min)) errors.push("min");
	if (lt !== void 0 && !(num < lt)) errors.push("lt");
	if (max !== void 0 && !(num <= max)) errors.push("max");
	if (int !== void 0) {
		const isInt = Number.isInteger(num);
		if (!(int ? isInt : !isInt)) errors.push("int");
	}
	if (errors.length > 0) return {
		ok: false,
		errors
	};
	return {
		ok: true,
		value: num
	};
};
var booleanValidator = (input) => {
	const bool = input === "true" ? true : input === "false" ? false : void 0;
	if (typeof bool !== "boolean") return {
		ok: false,
		errors: ["type"]
	};
	return {
		ok: true,
		value: bool
	};
};
var enumValidator = ({ values }) => (input) => {
	if (!(typeof input === "string" ? values.includes(input) : false)) return {
		ok: false,
		errors: ["type"]
	};
	return {
		ok: true,
		value: input
	};
};
function selectValidator(options) {
	switch (options.type) {
		case "string": return stringValidator(options);
		case "number": return numberValidator(options);
		case "boolean": return booleanValidator;
		case "enum": return enumValidator(options);
	}
}
function validateEnvVariable(value, options) {
	const isOptional = options.optional || options.default !== void 0;
	if (isOptional && value === void 0) return {
		ok: true,
		value: options.default
	};
	if (!isOptional && value === void 0) return {
		ok: false,
		errors: ["missing"]
	};
	return selectValidator(options)(value);
}
//#endregion
//#region \0virtual:astro:env/internal
var schema = {
	"NEON_DATABASE_URL": {
		"context": "server",
		"access": "secret",
		"optional": true,
		"type": "string"
	},
	"SESSION_SECRET": {
		"context": "server",
		"access": "secret",
		"type": "string"
	},
	"DASHBOARD_PASSWORD": {
		"context": "server",
		"access": "secret",
		"type": "string"
	}
};
//#endregion
//#region \0astro:env/server
/** @returns {string} */
var getEnv = (key) => {
	return getEnv$1(key);
};
var _internalGetSecret = (key) => {
	const rawVariable = getEnv(key);
	const variable = rawVariable === "" ? void 0 : rawVariable;
	const options = schema[key];
	const result = validateEnvVariable(variable, options);
	if (result.ok) return result.value;
	const type = getEnvFieldType(options);
	throw createInvalidVariablesError(key, type, result);
};
setOnSetGetEnv(() => {
	NEON_DATABASE_URL = _internalGetSecret("NEON_DATABASE_URL");
	SESSION_SECRET = _internalGetSecret("SESSION_SECRET");
	DASHBOARD_PASSWORD = _internalGetSecret("DASHBOARD_PASSWORD");
});
var NEON_DATABASE_URL = _internalGetSecret("NEON_DATABASE_URL");
var SESSION_SECRET = _internalGetSecret("SESSION_SECRET");
var DASHBOARD_PASSWORD = _internalGetSecret("DASHBOARD_PASSWORD");
//#endregion
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
export { verificarSesion as a, opcionesCookie as i, contrasenasIguales as n, DASHBOARD_PASSWORD as o, firmarSesion as r, SESSION_COOKIE as t };
