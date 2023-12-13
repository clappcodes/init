// @clapp/init v1.0.2
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_node_path = __toESM(require("node:path"));
var import_hmr = __toESM(require("@clapp/hmr"));
var utils = __toESM(require("@clapp/init/utils"));
module.paths.push("/Users/serebano/dev");
module.paths.push("/Users/serebano/dev/@clapp");
module.paths.push("/Users/serebano/dev/@clapp/init");
module.paths.push("/Users/serebano/dev/@clapp/setup");
module.paths.push("/Users/serebano/crawless.dev");
module.paths.push("/Users/serebano/crawless.dev/@types");
utils.defineGetter(globalThis, "api1", () => require("@clapp/init/api"));
let api2 = require("@clapp/init/api");
utils.defineGetter(globalThis, "api2", () => api2);
(0, import_hmr.default)(async () => {
  console.log("Reloading app...");
  ({ default: api2 } = await import("../lib/cx"));
});
const wfRootPath = "/Users/serebano/crawless.dev";
const esBuildModuleId = require.resolve("@clapp/setup/esbuild", {
  paths: [CLAPP.SCRIPT_SRC]
});
const loadModuleId = require.resolve("../load", { paths: [CLAPP.SCRIPT_SRC] });
const lib = {
  get clapp() {
    return require(loadModuleId);
  },
  get wf() {
    return require("@playground/vscode");
  },
  esbuild: require(esBuildModuleId)
};
module.exports = lib;
Object.defineProperties(self, Object.getOwnPropertyDescriptors(lib));
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
  let rmParentCache = function(m, a = []) {
    if (m) {
      delete require.cache[m.id];
      a.push(m.id);
      if (m.parent)
        return rmParentCache(m.parent, a);
      else
        return a;
    }
  };
  lib.esbuild._init = 1;
  _kill();
  delete lib.esbuild._events;
  lib.esbuild.on("serve", function(data) {
    console.log("[serve]", data);
  });
  lib.esbuild.on("start", function(data) {
    console.log("!!stdart", data.pid);
  });
  lib.esbuild.on("added", function(data) {
    data.forEach((e) => {
      console.log("!!added-file", e.path);
    });
  });
  lib.esbuild.on("change", async function(data) {
    data.forEach(async (e) => {
      console.log("!changed", e.path);
      const ci = rmParentCache(require.cache[e.path]);
      console.log("!cleared1", ci);
      if (e.path === loadModuleId) {
        console.log("!loadModuleId changed", lib.clapp.index);
      }
      if (e.path === CLAPP.SCRIPT_SRC) {
        console.log("SELF CHANGEDs!! reloading script!!22");
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
  lib.esbuild.on("restart", function(data) {
    console.log("!restart", data);
    lib.esbuild = self.esbuils = require(esBuildModuleId);
  });
  lib.esbuild.on("close", function(data) {
    console.log("!close", data);
    localStorage.removeItem("esbuild.pid");
  });
  const esb = lib.esbuild.run(import_node_path.default.resolve(wfRootPath, "@playground/vscode"), [
    "--watch"
  ]);
  localStorage.setItem("esbuild.pid", esb.pid);
  console.log("loadModule.pathsd", lib.clapp.modRoot, esb.pid);
}
