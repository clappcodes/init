export declare function reloadScript(FILE_URL: string, async?: boolean, type?: string): Promise<unknown>;
export declare function removeScripts(file: any): string[];
export declare function reloadModule(id: any, prop: any): any;
export declare const purgeRequireCache: (buildPath: string, dir?: boolean) => void;
export declare const makeModule: (o: any, id: any, filename: any, getter: any) => void;
export declare function createConsole(): Console;
export declare const createRequire: (module: any, path: any) => any;
export declare function defineGetter(obj: object, prop: string, getter: () => any): object;
//# sourceMappingURL=utils.d.ts.map