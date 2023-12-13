
module.exports = {
    mkContext: E,
    mkLog: (t) => h.default.get(T, t || S),
    get app() {
        return N
    },
    get preload() {
        delete require.cache[require.resolve("@clapp/init/preload")];
        return require(require.resolve("@clapp/init/preload"));
    },
    get id() {
        return b
    },
    get params() {
        return t
    }
}

// N.module = module;
// N.require = require;
// init preload
try {
    require(require.resolve("@clapp/init/preload")).run(t, N, module, require)
} catch (e) {
    N.preloadError = e
}