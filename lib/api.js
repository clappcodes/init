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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var api_exports = {};
__export(api_exports, {
  _index: () => _index,
  _value: () => _value,
  hmr: () => import_hmr.default,
  reload: () => reload,
  utils: () => utils
});
module.exports = __toCommonJS(api_exports);
var utils = __toESM(require("./utils"));
var import_hmr = __toESM(require("@clapp/hmr"));
__reExport(api_exports, require("./foo"), module.exports);
const _index = globalThis._load_index = (globalThis._load_index || 0) + 1;
const _value = 113595;
const reload = async (cacheRootPath = __dirname) => {
  const ids = Object.keys(import_hmr.default.watchers);
  console.warn(`[HMR] Close active watchers`, ids.length);
  for (const id of ids) {
    await import_hmr.default.watchers[id].close();
    console.log(`	** ${id} [${import_hmr.default.watchers[id].closed}]`);
    delete import_hmr.default.watchers[id];
  }
  utils.purgeRequireCache(cacheRootPath);
  if (typeof window === "undefined") {
    require(globalThis.CLAPP.SCRIPT_SRC);
  } else {
    utils.reloadScript(CLAPP.SCRIPT_SRC, false, "module");
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  _index,
  _value,
  hmr,
  reload,
  utils,
  ...require("./foo")
});
