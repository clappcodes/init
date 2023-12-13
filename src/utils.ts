import path from "node:path";
import fs from "node:fs";
import { Console } from "node:console";

export { Console, fs, path };

export function reloadScript(
	FILE_URL: string,
	async = false,
	type = "text/javascript"
) {
	if (typeof window === "undefined") {
		return;
	}
	return new Promise((resolve, reject) => {
		try {
			const scriptEle = document.createElement("script");
			scriptEle.type = type;
			scriptEle.async = async;
			scriptEle.src = FILE_URL + "?z=" + Math.random().toString(36).slice(2);

			const removedSripts = removeScripts(FILE_URL);

			scriptEle.addEventListener("load", (_ev) => {
				resolve({ status: true, src: scriptEle.src, removedSripts });
			});

			scriptEle.addEventListener("error", (_ev) => {
				reject({
					status: false,
					message: `Load failed ${FILE_URL}`,
				});
			});

			document.head.appendChild(scriptEle);
		} catch (error) {
			reject(error);
		}
	});
}

export function removeScripts(file) {
	const scripts = [...document.getElementsByTagName("script")].filter((el) =>
		el.src.includes(file)
	);
	return scripts.map((el) => {
		el.remove();
		return el.src;
	});
}

export function reloadModule(id, prop) {
	const get = () => {
		const resolved = self.require.resolve(id);
		delete self.require.cache[resolved];
		self.module.children = self.module.children.filter(
			(m) => m.filename !== resolved
		);

		return self.require(id);
	};

	if (prop) {
		Object.defineProperty(self, prop, {
			get,
			enumerable: true,
			configurable: true,
		});
	}
	return get();
}

export const purgeRequireCache = (buildPath: string, dir = false) => {
	if (dir) buildPath = path.resolve(buildPath, "../");
	console.warn("[purgeRequireCache][root]", buildPath);
	for (let key in require.cache) {
		if (key.startsWith(buildPath) && !key.includes("/node_modules/")) {
			delete require.cache[key];
			console.log("	-", key.replace(buildPath, "."));
		}
	}
};

export const makeModule = (o, id, filename, getter) => {
	const t = new o(id, null);
	(t.id = id),
		(t.loaded = !0),
		(t.filename = filename),
		Object.defineProperty(t, "exports", {
			get: getter, // () => require("./lib/main.js"),
		}),
		(o._cache[filename] = t);

	if (!o._resolveFilename._patched) {
		const l = o._resolveFilename;
		const c = new Set([id]);
		o._resolveFilename = function (e, t, n, r) {
			return c.has(e) ? e : l(e, t, n, r);
		};
		o._resolveFilename._patched = true;
	}
};

export function createConsole(logPath: string) {
	if (!fs.existsSync("/Users/serebano/crawless.dev/.logs/"))
		fs.mkdirSync("/Users/serebano/crawless.dev/.logs/");

	const output = fs.createWriteStream(
		"/Users/serebano/crawless.dev/.logs/stdout.log"
	);
	const errorOutput = fs.createWriteStream(
		"/Users/serebano/crawless.dev/.logs/stderr.log"
	);
	// Custom simple logger
	return new Console({
		stdout: output,
		stderr: errorOutput,
		colorMode: true,
	});
}

export const createRequire = (module, path) =>
	module.createRequire(require.resolve(path));

export function defineGetter(
	obj: object,
	prop: string,
	getter: () => any
): object {
	return Object.defineProperty(obj, prop, {
		get: getter,
		set: (val: () => any) => {
			return defineGetter(obj, prop, val);
		},
		enumerable: true,
		configurable: true,
	});
}

export function symlink(srcPath: string, destPath: string) {
	if (!fs.existsSync(srcPath)) {
		throw new Error(`Source path not found at: ${srcPath}`);
	}
	if (!fs.existsSync(destPath)) {
		fs.mkdirSync(destPath, { recursive: true });
	}
	const srcName = path.parse(srcPath).name;
	const linkPath = path.resolve(destPath, srcName);

	if (!fs.existsSync(linkPath)) {
		fs.symlinkSync(srcPath, linkPath, "dir");
	}
	const isDirectory = fs.statSync(linkPath).isDirectory();

	return { srcPath, linkPath, isDirectory };
}
