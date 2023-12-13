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
var import_node_path = __toESM(require("node:path"));
var import_package = __toESM(require("../package.json"));
(0, import_hmr.default)(
  module,
  async (e) => {
    globalThis.clapp = require("@clapp/init/api");
    console.log(
      `%c[HMR][${import_package.default.name}][${clapp._index}] %c${e.event} %c[${e.watcher.options.cwd}] ${e.filePath || ""}`,
      "color: #bada55",
      "color: Orange; font-weight:bold",
      "color: DodgerBlue"
    );
    if (e.moduleTree)
      e.moduleTree.map(
        (f, i) => console.log(
          `	* %c[${i}] %c${f}`,
          "color: DodgerBlue",
          "font-weight:normal"
        )
      );
    if (e.event === "init") {
      console.log("options", e.watcher.options);
    }
    if (e.event === "change") {
      if (e.moduleId === __filename || e.moduleId === CLAPP.SCRIPT_SRC) {
        console.clear();
        console.warn("[HMR]", "Reloading > ", e.moduleId);
        await e.watcher.close();
        delete import_hmr.default.watchers[e.moduleId];
        await clapp.reload(e.options.cwd);
      }
    }
  },
  {
    cwd: import_node_path.default.resolve(__dirname, "../../"),
    watch: ["**/lib/**/*.js", "**/*.json"]
    // followSymlinks: false,
  }
);
module.exports = function load(...args) {
};
