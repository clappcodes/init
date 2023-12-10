import path from "node:path";
import hmr from "@clapp/hmr";

// @ts-ignore
clapp._index_load = self._load_index = (self._load_index || 0) + 1;
// const modRoot = path.resolve(module.path, "../");

clapp.reloadMainScript = () =>
	clapp.utils.reloadScript(CLAPP.SCRIPT_SRC, false, "module");

hmr(
	async (e) => {
		console.log(`[HMR]`, e);
		if (e.moduleId === __filename) {
			console.clear();
			console.warn("[HMR]", "Reloading main script");
			await e.watcher.close();
			await clapp.reloadMainScript();
			return;
		}
		clapp.utils = require("@clapp/init/utils");
		clapp.api = require("@clapp/init/foo");
	},
	{
		// watchDir: "../lib",
		// debug: true,
	},
	module
);

module.exports = function load(main_module, main_require) {
	console.log("loading all necesary modules");
};
