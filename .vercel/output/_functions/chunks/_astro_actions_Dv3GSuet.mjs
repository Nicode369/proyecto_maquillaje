import { bt as fetchStateSymbol, jt as ActionCalledFromServerError, pn as AstroError } from "./sequence_vYO_GrXQ.mjs";
import { C as createActionsProxy, i as getAction, w as createGetActionPath } from "./server_DesZPQvd.mjs";
createGetActionPath({
	baseUrl: "/",
	shouldAppendTrailingSlash: true
});
var actions = createActionsProxy({ handleAction: async (param, path, context) => {
	const state = context ? Reflect.get(context, fetchStateSymbol) : void 0;
	if (!state) throw new AstroError(ActionCalledFromServerError);
	const action = await getAction(state.manifest, path);
	if (!action) throw new Error(`Action not found: ${path}`);
	return action.bind(context)(param);
} });
//#endregion
export { actions as t };
