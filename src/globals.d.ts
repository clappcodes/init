export declare interface clapp {
	path: typeof import("node:path");
	module: NodeModule;
	require: NodeRequire;
	__dirname: string;
	__filename: string;
	_index_main?: number;
	_index_load?: number;
	reloadMainScript?: () => Promise<unknown>;
	utils?: typeof import("@clapp/init/utils");
	api?: typeof import("@clapp/init/api");
}

export declare interface CLAPP {
	SCRIPT_SRC: string;
	appName: string;
	appPath: string;
	modName: string;
	modFile: string;
	devPath: string;
	resPath: string;
}

declare global {
	export var CLAPP: CLAPP;
	export var clapp: clapp;
}

// export interface globalThis {
// 	clapp: clapp;
// }

export {};
