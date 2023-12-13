import * as fs from "node:fs";
import { Console } from "node:console";

function createConsole() {
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

// onTaskRun

export function run(
	task: object,
	app: object,
	module: NodeModule,
	require: NodeRequire
) {
	// console.log(`\n\n`, `---------------- [onTaskRun] ----------------`);
	// @ts-ignore
	console.dir([`[!!inner]`, task.group, task.name]);
	// console.log(`---------------- [onTaskRun] ----------------`, "\n\n");
}

export function _run(
	input: object,
	app: object,
	module: NodeModule,
	require: NodeRequire
) {
	// @ts-ignore
	const { task } = input;
	// console.log(`\n\n`, `---------------- [!!onTaskRun Outer] ----------------`);
	// @ts-ignore
	console.dir([`[outer]`, task.group, task.name]);
	// console.log(`---------------- [!!onTaskRun Outer] ----------------`, "\n\n");
}

export const mainModule = module.parent;

mainModule.paths.push("/Users/serebano/dev");
mainModule.paths.push("/Users/serebano/dev/@clapp");
mainModule.paths.push("/Users/serebano/dev/@clapp/init");
mainModule.paths.push("/Users/serebano/dev/@clapp/setup");
mainModule.paths.push("/Users/serebano/crawless.dev");
mainModule.paths.push("/Users/serebano/crawless.dev/@types");

function init(...args: any) {
	const console = (globalThis.console = createConsole());

	console.log(`*************** [init] ******************`);
	console.dir(args);
	console.log(`*************** [init] ******************`);

	return console;
}

init({ message: "Self exec", paths: mainModule.paths.length });
