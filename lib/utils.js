// @clapp/init v1.0.2
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var utils_exports = {};
__export(utils_exports, {
  Console: () => import_node_console.Console,
  createConsole: () => createConsole,
  createRequire: () => createRequire,
  defineGetter: () => defineGetter,
  fs: () => import_node_fs.default,
  makeModule: () => makeModule,
  path: () => import_node_path.default,
  purgeRequireCache: () => purgeRequireCache,
  reloadModule: () => reloadModule,
  reloadScript: () => reloadScript,
  removeScripts: () => removeScripts,
  symlink: () => symlink
});
module.exports = __toCommonJS(utils_exports);
var import_node_path = __toESM(require("node:path"));
var import_node_fs = __toESM(require("node:fs"));
var import_node_console = require("node:console");
function reloadScript(FILE_URL, async = false, type = "text/javascript") {
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
          message: `Load failed ${FILE_URL}`
        });
      });
      document.head.appendChild(scriptEle);
    } catch (error) {
      reject(error);
    }
  });
}
function removeScripts(file) {
  const scripts = [...document.getElementsByTagName("script")].filter(
    (el) => el.src.includes(file)
  );
  return scripts.map((el) => {
    el.remove();
    return el.src;
  });
}
function reloadModule(id, prop) {
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
      configurable: true
    });
  }
  return get();
}
const purgeRequireCache = (buildPath, dir = false) => {
  if (dir)
    buildPath = import_node_path.default.resolve(buildPath, "../");
  console.warn("[purgeRequireCache][root]", buildPath);
  for (let key in require.cache) {
    if (key.startsWith(buildPath) && !key.includes("/node_modules/")) {
      delete require.cache[key];
      console.log("	-", key.replace(buildPath, "."));
    }
  }
};
const makeModule = (o, id, filename, getter) => {
  const t = new o(id, null);
  t.id = id, t.loaded = true, t.filename = filename, Object.defineProperty(t, "exports", {
    get: getter
    // () => require("./lib/main.js"),
  }), o._cache[filename] = t;
  if (!o._resolveFilename._patched) {
    const l = o._resolveFilename;
    const c = /* @__PURE__ */ new Set([id]);
    o._resolveFilename = function(e, t2, n, r) {
      return c.has(e) ? e : l(e, t2, n, r);
    };
    o._resolveFilename._patched = true;
  }
};
function createConsole(logPath) {
  if (!import_node_fs.default.existsSync("/Users/serebano/crawless.dev/.logs/"))
    import_node_fs.default.mkdirSync("/Users/serebano/crawless.dev/.logs/");
  const output = import_node_fs.default.createWriteStream(
    "/Users/serebano/crawless.dev/.logs/stdout.log"
  );
  const errorOutput = import_node_fs.default.createWriteStream(
    "/Users/serebano/crawless.dev/.logs/stderr.log"
  );
  return new import_node_console.Console({
    stdout: output,
    stderr: errorOutput,
    colorMode: true
  });
}
const createRequire = (module2, path2) => module2.createRequire(require.resolve(path2));
function defineGetter(obj, prop, getter) {
  return Object.defineProperty(obj, prop, {
    get: getter,
    set: (val) => {
      return defineGetter(obj, prop, val);
    },
    enumerable: true,
    configurable: true
  });
}
function symlink(srcPath, destPath) {
  if (!import_node_fs.default.existsSync(srcPath)) {
    throw new Error(`Source path not found at: ${srcPath}`);
  }
  if (!import_node_fs.default.existsSync(destPath)) {
    import_node_fs.default.mkdirSync(destPath, { recursive: true });
  }
  const srcName = import_node_path.default.parse(srcPath).name;
  const linkPath = import_node_path.default.resolve(destPath, srcName);
  if (!import_node_fs.default.existsSync(linkPath)) {
    import_node_fs.default.symlinkSync(srcPath, linkPath, "dir");
  }
  const isDirectory = import_node_fs.default.statSync(linkPath).isDirectory();
  return { srcPath, linkPath, isDirectory };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Console,
  createConsole,
  createRequire,
  defineGetter,
  fs,
  makeModule,
  path,
  purgeRequireCache,
  reloadModule,
  reloadScript,
  removeScripts,
  symlink
});
