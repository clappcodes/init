import path from "node:path";

module.paths.push("/Users/serebano/dev");
module.paths.push("/Users/serebano/dev/@clapp");
module.paths.push("/Users/serebano/dev/@clapp/init");
module.paths.push("/Users/serebano/dev/@clapp/setup");
module.paths.push("/Users/serebano/crawless.dev");
module.paths.push("/Users/serebano/crawless.dev/@types");

globalThis.clapp = globalThis.clapp || {
	path,
	module,
	require,
	__dirname,
	__filename,
};

// @ts-ignore
clapp._index_main = self._load_index = (self._load_index || 0) + 1;

// Load
require("@clapp/init/load")(module, require, __dirname, __filename);
