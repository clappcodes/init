function createConsole() {
	const fs = require("fs");
	const { Console } = require("console");

	if (!fs.existsSync("/Users/serebano/crawless.dev/.logs/"))
		fs.mkdirSync("/Users/serebano/crawless.dev/.logs/");

	const output = fs.createWriteStream(
		"/Users/serebano/crawless.dev/.logs/stdout.log"
	);
	const errorOutput = fs.createWriteStream(
		"/Users/serebano/crawless.dev/.logs/stderr.log"
	);
	// Custom simple logger
	return new Console({
		stdout: output,
		stderr: errorOutput,
		colorMode: true,
	});
}

globalThis.console = createConsole();

console.log("Oh my heavens! We have console!");

module.paths.push("/Users/serebano/dev");
module.paths.push("/Users/serebano/dev/@clapp");
module.paths.push("/Users/serebano/dev/@clapp/init");
module.paths.push("/Users/serebano/dev/@clapp/setup");
module.paths.push("/Users/serebano/crawless.dev");
module.paths.push("/Users/serebano/crawless.dev/@types");

console.dir(module);
