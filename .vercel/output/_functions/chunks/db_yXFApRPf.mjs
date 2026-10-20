import { n as NEON_DATABASE_URL } from "./server_dIuM2HpK.mjs";
import { neon } from "@neondatabase/serverless";
//#region src/lib/db.ts
function crearCliente() {
	return neon(NEON_DATABASE_URL);
}
function sinBaseDeDatos() {
	throw new Error("Falta NEON_DATABASE_URL. Copia .env.example a .env, configura la URL de Neon y reinicia el servidor.");
}
var sql = NEON_DATABASE_URL ? crearCliente() : sinBaseDeDatos;
//#endregion
export { sql as t };
