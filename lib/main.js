// @clapp/init v1.0.2
globalThis.CLAPP = globalThis.CLAPP || { SCRIPT_SRC: __filename };
module.paths.push("/Users/serebano/dev");
module.paths.push("/Users/serebano/dev/@clapp");
module.paths.push("/Users/serebano/dev/@clapp/init");
module.paths.push("/Users/serebano/dev/@clapp/init/node_modules");
module.paths.push("/Users/serebano/dev/@clapp/setup");
module.paths.push("/Users/serebano/crawless.dev");
module.paths.push("/Users/serebano/crawless.dev/@types");
module.paths = module.paths.filter(function(value, index, self) {
  return self.indexOf(value) === index;
});
require("@clapp/init/load")(12, CLAPP);
