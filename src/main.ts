globalThis.CLAPP = globalThis.CLAPP || { SCRIPT_SRC: __filename };

module.paths.push("/Users/serebano/dev");
module.paths.push("/Users/serebano/dev/@clapp");
module.paths.push("/Users/serebano/dev/@clapp/init");
module.paths.push("/Users/serebano/dev/@clapp/init/node_modules");

module.paths.push("/Users/serebano/dev/@clapp/setup");
module.paths.push("/Users/serebano/crawless.dev");
module.paths.push("/Users/serebano/crawless.dev/@types");

module.paths = module.paths.filter(function (value, index, self) {
	return self.indexOf(value) === index;
});

// module.children = module.children.filter(function (child, index, self) {
// 	if (child.filename.endsWith("/load.js")) {
// 		delete require.cache[child.filename];
// 		return false;
// 	}
// 	return true;
// });

require("@clapp/init/load")(12, CLAPP);
