import { n as DATABASE_URL } from "./server_DcDs3kpP.mjs";
import { neon } from "@neondatabase/serverless";
//#region src/lib/db.ts
function crearCliente() {
	return neon(DATABASE_URL);
}
function sinBaseDeDatos() {
	throw new Error("Falta DATABASE_URL. Ejecuta `neon env pull` para traer las variables de Neon y reinicia el servidor.");
}
var sql = DATABASE_URL ? crearCliente() : sinBaseDeDatos;
//#endregion
export { sql as t };
