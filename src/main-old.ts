import path from "node:path";
module.paths.push("/Users/serebano/dev");
module.paths.push("/Users/serebano/dev/@clapp");
module.paths.push("/Users/serebano/dev/@clapp/init");
module.paths.push("/Users/serebano/dev/@clapp/setup");
module.paths.push("/Users/serebano/crawless.dev");
module.paths.push("/Users/serebano/crawless.dev/@types");

import hmr from "@clapp/hmr";
import * as utils from "@clapp/init/utils";

utils.defineGetter(globalThis, "api1", () => require("@clapp/init/api"));

let api2: typeof import("@clapp/init/api") = require("@clapp/init/api");

utils.defineGetter(globalThis, "api2", () => api2);

hmr(async () => {
	console.log("Reloading app...");
	({ default: api2 } = await import("@clapp/init/api"));
});

const wfRootPath = "/Users/serebano/crawless.dev";

const esBuildModuleId = require.resolve("@clapp/setup/esbuild", {
	paths: [CLAPP.SCRIPT_SRC],
});
const loadModuleId = require.resolve("../load", { paths: [CLAPP.SCRIPT_SRC] });

const lib = {
	get clapp() {
		return require(loadModuleId);
	},
	get wf() {
		return require("@playground/vscode");
	},
	esbuild: require(esBuildModuleId),
};

module.exports = lib;
Object.defineProperties(self, Object.getOwnPropertyDescriptors(lib));

// Object.defineProperty(self, "clapp", {
// 	get: () => require(loadModuleId),
// 	configurable: true,
// 	enumerable: true,
// });

function _kill() {
	const pid = Number(localStorage.getItem("esbuild.pid"));
	if (pid) {
		try {
			console.warn("!orphan esbuild pid", pid, process.kill(pid, 1));
		} catch (e) {
			console.error("!orphan esbuild err", e);
		}
	}
}

if (!lib.esbuild._init) {
	lib.esbuild._init = 1;
	_kill();
	delete lib.esbuild._events;

	lib.esbuild.on("serve", function (data) {
		console.log("[serve]", data);
	});

	lib.esbuild.on("start", function (data) {
		console.log("!!stdart", data.pid);
		// localStorage.setItem("esbuild.pid", data.pid);
	});

	lib.esbuild.on("added", function (data) {
		// console.log("!added", data);
		data.forEach((e) => {
			// clapp.utils.purgeRequireCache(e.path);
			// const m = require(e.path);
			console.log("!!added-file", e.path);
		});
	});
	function rmParentCache(m, a = []) {
		if (m) {
			delete require.cache[m.id];
			a.push(m.id);
			if (m.parent) return rmParentCache(m.parent, a);
			else return a;
		}
	}
	lib.esbuild.on("change", async function (data: [{ path: string }]) {
		data.forEach(async (e) => {
			// clapp.utils.purgeRequireCache(e.path);
			// const m = require(e.path);
			console.log("!changed", e.path);
			const ci = rmParentCache(require.cache[e.path]);
			console.log("!cleared1", ci);
			// delete require.cache[e.path];
			if (e.path === loadModuleId) {
				// @ts-ignore
				// self.clapp = require(loadModuleId);
				console.log("!loadModuleId changed", lib.clapp.index);
			}
			if (e.path === CLAPP.SCRIPT_SRC) {
				console.log("SELF CHANGEDs!! reloading script!!22");
				// clapp.utils.purgeRequireCache(e.path);
				_kill();
				delete lib.esbuild._init;
				delete lib.esbuild._events;
				const res = await lib.clapp.utils.reloadScript(
					CLAPP.SCRIPT_SRC,
					false,
					"module"
				);
				console.log("res", res);
			}
		});
	});

	lib.esbuild.on("restart", function (data) {
		console.log("!restart", data);
		// const ci = rmParentCache(require.cache[esBuildModuleId]);
		// console.log("!cleared", ci);
		// @ts-ignore
		lib.esbuild = self.esbuils = require(esBuildModuleId);
	});

	lib.esbuild.on("close", function (data) {
		console.log("!close", data);
		localStorage.removeItem("esbuild.pid");
	});

	// wfRootPath
	const esb = lib.esbuild.run(path.resolve(wfRootPath, "@playground/vscode"), [
		"--watch",
	]);

	// const esb = lib.esbuild.run(lib.clapp.modRoot, ["--watch"]);

	localStorage.setItem("esbuild.pid", esb.pid);

	console.log("loadModule.pathsd", lib.clapp.modRoot, esb.pid);
}
