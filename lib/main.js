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
module.paths.push("/Users/serebano/dev");
module.paths.push("/Users/serebano/dev/@clapp");
module.paths.push("/Users/serebano/dev/@clapp/init");
module.paths.push("/Users/serebano/dev/@clapp/setup");
module.paths.push("/Users/serebano/crawless.dev");
module.paths.push("/Users/serebano/crawless.dev/@types");
globalThis.clapp = globalThis.clapp || {
  path: import_node_path.default,
  module,
  require,
  __dirname,
  __filename
};
clapp._index_main = self._load_index = (self._load_index || 0) + 1;
require("@clapp/init/load")(module, require, __dirname, __filename);
