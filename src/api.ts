import path from "node:path";
import * as utils from "./utils";
import hmr from "@clapp/hmr";
// import * as vscmod from "@playground/vscode";

// @ts-ignore
export const _index = (globalThis._load_index =
	(globalThis._load_index || 0) + 1);

export const _value = 113595;

export const reload = async (cacheRootPath: string = __dirname) => {
	const ids = Object.keys(hmr.watchers);
	console.warn(`[HMR] Close active watchers`, ids.length);
	for (const id of ids) {
		await hmr.watchers[id].close();
		// @ts-ignore
		console.log(`	** ${id} [${hmr.watchers[id].closed}]`);
		delete hmr.watchers[id];
	}
	utils.purgeRequireCache(cacheRootPath);
	if (typeof window === "undefined") {
		require(globalThis.CLAPP.SCRIPT_SRC);
	} else {
		utils.reloadScript(CLAPP.SCRIPT_SRC, false, "module");
	}
};

export { utils, hmr };

export * from "./foo";

// const res = utils.symlink(
// 	`/Users/serebano/crawless.dev/@playground/vscode`,
// 	`/Users/serebano/dev/@clapp/workflows/playground`
// );
// console.log(`Symlink`, res);
