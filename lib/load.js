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
var import_hmr = __toESM(require("@clapp/hmr"));
clapp._index_load = self._load_index = (self._load_index || 0) + 1;
clapp.reloadMainScript = () => clapp.utils.reloadScript(CLAPP.SCRIPT_SRC, false, "module");
(0, import_hmr.default)(
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
