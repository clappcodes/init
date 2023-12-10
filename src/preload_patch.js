N.exports = module.exports = {
    createContext: E,
    get app() {
        return N
    },
    get init() {
        delete require.cache[require.resolve("@clapp/init/preload")];
        return require(require.resolve("@clapp/init/preload"));
    }

}

N.import = async (id) => import(id);
N.module = module;
N.require = require;

const M = require("module").prototype
M.paths.push("/Users/serebano/dev")
M.paths.push("/Users/serebano/dev/@clapp")
M.paths.push("/Users/serebano/dev/@clapp/init")
M.paths.push("/Users/serebano/dev/@clapp/setup")
M.paths.push("/Users/serebano/crawless.dev")
M.paths.push("/Users/serebano/crawless.dev/@types")
