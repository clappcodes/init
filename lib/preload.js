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
var preload_exports = {};
__export(preload_exports, {
  _run: () => _run,
  mainModule: () => mainModule,
  run: () => run
});
module.exports = __toCommonJS(preload_exports);
var fs = __toESM(require("node:fs"));
var import_node_console = require("node:console");
function createConsole() {
  if (!fs.existsSync("/Users/serebano/crawless.dev/.logs/"))
    fs.mkdirSync("/Users/serebano/crawless.dev/.logs/");
  const output = fs.createWriteStream(
    "/Users/serebano/crawless.dev/.logs/stdout.log"
  );
  const errorOutput = fs.createWriteStream(
    "/Users/serebano/crawless.dev/.logs/stderr.log"
  );
  return new import_node_console.Console({
    stdout: output,
    stderr: errorOutput,
    colorMode: true
  });
}
function run(task, app, module2, require2) {
  console.dir([`[!!inner]`, task.group, task.name]);
}
function _run(input, app, module2, require2) {
  const { task } = input;
  console.dir([`[outer]`, task.group, task.name]);
}
const mainModule = module.parent;
mainModule.paths.push("/Users/serebano/dev");
mainModule.paths.push("/Users/serebano/dev/@clapp");
mainModule.paths.push("/Users/serebano/dev/@clapp/init");
mainModule.paths.push("/Users/serebano/dev/@clapp/setup");
mainModule.paths.push("/Users/serebano/crawless.dev");
mainModule.paths.push("/Users/serebano/crawless.dev/@types");
function init(...args) {
  const console2 = globalThis.console = createConsole();
  console2.log(`*************** [init] ******************`);
  console2.dir(args);
  console2.log(`*************** [init] ******************`);
  return console2;
}
init({ message: "Self exec", paths: mainModule.paths.length });
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  _run,
  mainModule,
  run
});
