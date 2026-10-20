import { At as getEnv$1, Mt as setOnSetGetEnv, kt as createInvalidVariablesError } from "./sequence_CIT0iznN.mjs";
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
	"DATABASE_URL": {
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
	DATABASE_URL = _internalGetSecret("DATABASE_URL");
	SESSION_SECRET = _internalGetSecret("SESSION_SECRET");
	DASHBOARD_PASSWORD = _internalGetSecret("DASHBOARD_PASSWORD");
});
var DATABASE_URL = _internalGetSecret("DATABASE_URL");
var SESSION_SECRET = _internalGetSecret("SESSION_SECRET");
var DASHBOARD_PASSWORD = _internalGetSecret("DASHBOARD_PASSWORD");
//#endregion
export { DATABASE_URL as n, SESSION_SECRET as r, DASHBOARD_PASSWORD as t };
