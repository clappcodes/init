import hmr from "@clapp/hmr";
import path from "node:path";
import pkg from "../package.json";

hmr(
	module,
	async (e) => {
		globalThis.clapp = require("@clapp/init/api");

		console.log(
			`%c[HMR][${pkg.name}][${clapp._index}] %c${e.event} %c[${
				e.watcher.options.cwd
			}] ${e.filePath || ""}`,

			"color: #bada55",
			"color: Orange; font-weight:bold",
			"color: DodgerBlue"
		);

		if (e.moduleTree)
			e.moduleTree.map((f, i) =>
				console.log(
					`	* %c[${i}] %c${f}`,
					"color: DodgerBlue",
					"font-weight:normal"
				)
			);

		if (e.event === "init") {
			console.log("options", e.watcher.options);
		}
		// console.dir(e);

		if (e.event === "change") {
			// console.log("watched", e.watcher.getWatched());

			if (e.moduleId === __filename || e.moduleId === CLAPP.SCRIPT_SRC) {
				console.clear();
				// console.dir(e.watcher);
				console.warn("[HMR]", "Reloading > ", e.moduleId);
				await e.watcher.close();
				delete hmr.watchers[e.moduleId];
				await clapp.reload(e.options.cwd);
			}
		}
	},
	{
		cwd: path.resolve(__dirname, "../../"),
		watch: ["**/lib/**/*.js", "**/*.json"],
		// followSymlinks: false,
	}
);

export = function load(...args: any[]) {
	// console.log("load", ...args);
};
