export module clapp.foo {
	export var x = 4;
}
export module cx {
	declare class AppState {
		static db: {};
		static app: {};
		static account: {
			projects: [
				{
					workflows: [
						{
							tasks: [
								{
									__proto__: { update: () => any };
								}
							];
						}
					];
				}
			];
		};
		static load(): Promise<void>;
		static reset(): Promise<void>;
		static codeEditorInstance: {};
	}
	/**
	 * Extracts react data from dom element
	 * @param el Source element to extract from
	 * @returns React data extracted from source element
	 *  such as: fiber, props, container
	 */
	export function getReactData(el: Element) {
		type Key = "fiber" | "props" | "container";
		type Data = {
			[K in Key]: any;
		};

		const keys: string[] = Object.getOwnPropertyNames(el);

		const getReactKeys = (): string[] =>
			keys.filter((prop) => prop.startsWith("__react"));
		const cleanKey = (key: string): Key =>
			key.replace(`$${keyId}`, "").replace("__react", "").toLowerCase() as Key;

		const reactKeys = getReactKeys();
		if (!reactKeys[0]) return undefined;

		const keyId: string = reactKeys[0].split("$").pop() as string;
		const keysMap = reactKeys.map(
			(key: string) => [key, cleanKey(key)] as [string, Key]
		);

		const data: Data = Object.create(null);
		for (const [oKey, nKey] of keysMap) {
			data[nKey] = el[oKey];
		}
		return data;
	}

	export function getRootReactData() {
		const rootElement = document.querySelector("#root");
		if (!rootElement) throw new Error(`Element "#root" is null`);
		return getReactData(rootElement);
	}

	export function getAppState() {
		const data = getRootReactData();
		if (!data) return;

		const { container } = data;

		return container.child.memoizedProps.appstate;
	}

	export function getTaskProto() {
		if (cx.appstate && cx.appstate.account) {
			let __proto__;
			cx.appstate.account.projects.some((project) => {
				return project.workflows.some((workflow) => {
					return workflow.tasks.some((task) => {
						return (__proto__ = Object.getPrototypeOf(task));
					});
				});
			});
			return __proto__;
		}
	}

	const defineGet = (prop: string, getter: () => any) => {
		return Object.defineProperty(cx, prop, {
			get: getter,
			enumerable: true,
			configurable: true,
		});
	};

	export let appstate: typeof AppState;
	export let task_proto: any;

	defineGet("appstate", getAppState);
	defineGet("task_proto", getTaskProto);
	defineGet("monaco", () => cx.appstate.codeEditorInstance || cx.editor.monaco);
}

export module cx {
	export class Editor {
		#tasks = Object.create(null);

		// .crw-preview-tabs__panes
		selectorTabsPaneAll = ".crw-preview-tabs__panes .crw-preview-pane";
		selectorTabsPaneActive =
			".crw-preview-tabs__panes .crw-preview-pane--active";
		selectorTabsPaneModified =
			".crw-preview-tabs__panes .crw-preview-pane--modified";

		// .crw-preview-tabs__content
		selectorTabsContentAll = `.crw-preview-tabs__content .crw-preview-tabs__tab`;
		selectorTabsContentActive = `.crw-preview-tabs__content .crw-preview-tabs__tab--active`;

		selectorMonacoContainer = `${this.selectorTabsContentActive} .react-monaco-editor-container`;
		selectorMonacoEditor: string = `${this.selectorTabsContentActive} .crw-code-editor`;

		$ = (selector: string) => document.querySelector(selector);
		$$ = (selector: string) => [...document.querySelectorAll(selector)];

		get monacoStateNode() {
			return this.getData(this.$(this.selectorMonacoEditor))?.props.children
				._owner.stateNode;
		}

		get monaco() {
			return this.monacoStateNode?.monaco;
		}

		get instance() {
			return this.monacoStateNode?.editor;
		}

		get task() {
			return this.activeTask;
		}

		get tasks() {
			return this.#tasks;
		}

		set tasks(value) {
			this.#tasks = value;
		}

		getData(el: Element | null) {
			if (!el) return null;
			return {
				get keyId(): string {
					const keys: Array<any> = Object.getOwnPropertyNames(el);
					return keys
						.find((prop) => prop.startsWith("__react"))
						.split("$")
						.pop();
				},
				get props() {
					return (el as any)[`__reactProps$${this.keyId}`];
				},
				get fiber() {
					return (el as any)[`__reactFiber$${this.keyId}`];
				},
			};
		}

		getTask(el: Element | null) {
			const task = this.getData(el)?.props?.model;
			if (task.type !== "task") return;
			const path = task?.pathString;

			if (!Object.hasOwn(this.tasks, path)) {
				Object.defineProperty(this.tasks, path, {
					get: () => task,
					enumerable: true,
				});
			}

			return this.tasks[path];
		}

		get activeTask() {
			return this.getTask(this.$(this.selectorTabsPaneActive));
		}

		get activeEditor() {
			return this.$(this.selectorMonacoContainer);
		}
	}

	export const editor = new Editor();
}

export module cx.api {
	const isJSLang = false;

	const monaco = cx.editor.monaco;
	const editorCompProto = Object.getPrototypeOf(cx.editor.monacoStateNode);
	export let _componentDidMount: any =
		cx.api._componentDidMount || editorCompProto.componentDidMount;

	export let thisTask: any;
	export let thisWorkflow: any;
	export let dtsMap: any;
	export let dtsIndex: any;

	export async function initDTS(workflow: any) {
		const paths: string[] = workflow.tasks.map(
			(task: any): string => task.pathString
		);

		console.log("[initDTS]", paths);

		dtsIndex = await addExtraDTS(getWFIndexDTS(workflow));

		workflow.__dtsIndex = dtsIndex.uri.toString();
		console.info("[DTS Index]", workflow.__dtsIndex);

		dtsMap = await Promise.all(workflow.tasks.map(addDTS));

		workflow.__dtsTasks = dtsMap.map((res: any) => res.uri.toString());
	}

	editorCompProto.componentDidMount = function CDM(...args: any[]) {
		const { task } = this.props;
		const { workflow } = task;

		thisTask = task;
		thisWorkflow = workflow;

		/** temp disable buggy methods */
		this.stringifyTaskType = () => {};
		this.getMarkers = () => {};

		const __uri = this.fileUri.toString();
		console.log("editorDidMount", __uri);

		if (!workflow.__dts || workflow.__lastPath !== workflow.pathString) {
			workflow.__dts = true;
			task.__lastPath = task.pathString;
			workflow.__lastPath = workflow.pathString;

			initDTS(workflow);
		}

		return cx.api._componentDidMount.call(this, ...args);
	};
	console.log("[editorCompProto.componentDidMount] patched");

	const getWorker = isJSLang
		? monaco.languages.typescript.getJavaScriptWorker
		: monaco.languages.typescript.getTypeScriptWorker;

	export const defaults = isJSLang
		? monaco.languages.typescript.javascriptDefaults
		: monaco.languages.typescript.typescriptDefaults;

	export const getJS = async (model: any) => {
		if (isJSLang) return model.getValue();
		const result = await getEmitOutput(model);
		const firstJS = result.outputFiles.find(
			(o: any) => o.name.endsWith(".js") || o.name.endsWith(".jsx")
		);
		return (firstJS && firstJS.text) || "";
	};

	export const getDTS = async (model: any) => {
		const result = await getEmitOutput(model);
		return result.outputFiles.find((o: any) => o.name.endsWith(".d.ts")).text;
	};

	export const getEmitOutput = async (model: any) => {
		const client = await getWorkerProcess(model);
		return await client.getEmitOutput(model.uri.toString());
	};

	const getWorkerProcess = async (model: any) => {
		const worker = await getWorker();
		return await worker(model.uri);
	};

	export const getModel = (task: any) => {
		const filePath = task?.taskPathString
			? `${task.workflow.name}/${task.taskPathString}`
			: Date.now();
		const uri = monaco.Uri.parse(`file:///${filePath}.ts`);
		return monaco.editor.getModel(uri);
	};

	export function createModel(task: any) {
		const filePath = task?.taskPathString
			? `${task.workflow.name}/${task.taskPathString}`
			: Date.now();
		const uri = monaco.Uri.parse(`file:///${filePath}.ts`);

		const value = task.code;
		const uModel = monaco.editor.getModel(uri);
		if (uModel) {
			console.log("[createModel] exists:", uModel.uri.toString());
			uModel.setValue(value);
			return uModel;
		}

		const nModel = monaco.editor.createModel(value, "typescript", uri);
		console.log("[createModel] created:", nModel.uri.toString());
		return nModel;
	}

	export async function addExtraDTS(model: any) {
		let dts = model.code || (await getDTS(model));
		let uri = monaco.Uri.parse(
			`${model.uri}`.replace(".d.ts", ".ts").replace(".ts", ".d.ts")
		);

		defaults.addExtraLib(dts, uri);

		let _model = monaco.editor.getModel(uri);
		if (_model) {
			_model.setValue(dts);
		} else {
			_model = monaco.editor.createModel(dts, "typescript", uri);
		}
		const _lib = defaults._extraLibs[uri];

		return { uri, _lib, _model };
	}

	export async function addDTS(task: any) {
		let model = getModel(task) || createModel(task);
		try {
			const res = await addExtraDTS(model);
			if (model._attachedEditorCount === 0) model.dispose();
			console.info("[DTS Task]", res.uri + "", res._lib.version);
			return res;
		} catch (message_1) {
			console.error(message_1);
		}
	}

	export var task_update: any = cx.api.task_update || cx.task_proto.update;

	if (cx.api.task_update && !cx.task_proto.update.__patched) {
		cx.task_proto.update = function cx_update(...args: any[]) {
			addDTS(this);
			return api.task_update.call(this, ...args);
		};
		cx.task_proto.update.__patched = true;
		console.log("[task.__proto__.update] patched");
	}

	export var task_fetch: any = cx.api.task_fetch || cx.task_proto.fetch;

	if (task_fetch && !cx.task_proto.fetch.__patched) {
		cx.task_proto.fetch = async function cx_fetch(...args: any[]) {
			const res = await task_fetch.call(this, ...args);
			return res;
		};
		cx.task_proto.fetch.__patched = true;
		console.log("[task.__proto__.fetch] patched");
	}

	export var task_run: any = cx.api.task_run || cx.task_proto.run;

	if (cx.api.task_run && !cx.task_proto.run.__patched) {
		cx.task_proto.run = function cx_run(...args: any[]) {
			const code = this.code;
			this.code = `
			// module loader
			;((file) => {
				if (typeof module !== 'undefined' && !module.force) return module;
				const f = new XMLHttpRequest(); f.open("GET", file, false);
				try { f.send(null); return f.status === 200 ? eval(\`new (\${f.responseText})\`) : null
				} catch (e) { throw (e) }
			  })("http://localhost:1212/crawless/module.js");
			  // original code
			  ${code}
			`;
			console.log("!!!!!!task_run", this.code, this.transpiledCode);

			return api.task_run.call(this, ...args);
		};
		cx.task_proto.run.__patched = true;
		console.log("[task.__proto__.run] patched");
	}

	export function getWFIndexDTS(workflow: any) {
		const absTypes = workflow.tasks.map((task: any) => {
			return `"${task.workflow.name}/${task.taskPathString}": typeof import("${task.workflow.name}/${task.taskPathString}");`;
		});
		const relTypes = workflow.tasks.map((task: any) => {
			return `"${task.taskPathString}": TasksMap["${task.workflow.name}/${task.taskPathString}"]`;
		});
		const code = [
			`declare interface TasksMap {`,
			"\t" + absTypes.join("\n\t"),
			`}`,
			`// relative`,
			`declare interface TasksMap {`,
			"\t" + relTypes.join("\n\t"),
			`}`,
		].join("\n");
		const uri = monaco.Uri.parse(`file:///${workflow.name}/global.d.ts`);
		return { code, uri };
	}

	export function updateCompilerOptions(options: any) {
		defaults.setCompilerOptions({
			...defaults.getCompilerOptions(),
			...defaultCompilerOptions(),
			...options,
		});
	}

	function defaultCompilerOptions(useJavaScript = true) {
		return {
			strict: true,

			noImplicitAny: true,
			strictNullChecks: !useJavaScript,
			strictFunctionTypes: true,
			strictPropertyInitialization: true,
			strictBindCallApply: true,
			noImplicitThis: true,
			noImplicitReturns: true,
			noUncheckedIndexedAccess: false,
			// 3.7 off, 3.8 on I think
			useDefineForClassFields: false,
			alwaysStrict: false,
			allowUnreachableCode: false,
			allowUnusedLabels: false,

			downlevelIteration: false,
			noEmitHelpers: false,
			noLib: false,
			noStrictGenericChecks: false,
			noUnusedLocals: false,
			noUnusedParameters: false,

			esModuleInterop: true,
			preserveConstEnums: false,
			removeComments: false,
			skipLibCheck: false,

			checkJs: useJavaScript,
			allowJs: useJavaScript,

			declaration: true,
			declarationMap: true,
			inlineSourceMap: true,
			inlineSources: true,

			pretty: true,

			importHelpers: false,

			experimentalDecorators: true,
			emitDecoratorMetadata: true,
			moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,

			target: monaco.languages.typescript.ScriptTarget.ESNext,
			jsx: monaco.languages.typescript.JsxEmit.React,
			module: monaco.languages.typescript.ModuleKind.CommonJS,
		};
	}

	export const getDomNode = (editor: any) => editor.getDomNode();
	export const getValue = (model: any) => model.getValue();
	export const setValue = (model: any, text: string) => model.setValue(text);
	export const getActiveModel = () => cx.editor.instance.getModel();
	export const getActiveTask = () => cx.editor.task;

	export async function modelToTs(task: any) {
		const path = task.pathString;
		const uri = monaco.Uri.file(`${path}.ts`);
		// const namespace = getNS(task);
		const value = task.code; //moduleCode(task.code, namespace);

		const uModel = monaco.editor.getModel(uri);
		if (uModel) {
			console.debug("[taskToTs] Model exists:", uModel.uri);
			uModel.setValue(value);
			return uModel;
		}

		const nModel = monaco.editor.createModel(value, "typescript", uri);
		console.debug("[taskToTs] Model created:", nModel.uri);
		return nModel;
	}

	// function moduleCode(code: string, namespace: string) {
	// 	const lines = code.trim().split("\n");
	// 	if (lines[0].includes("module ")) lines.shift() && lines.pop();

	// 	return [`export module ${namespace} {`, ...lines, `}`].join("\n");
	// }

	// function getTaskNS(task: any, root?: any) {
	// 	const parts = task.pathString.split("/");
	// 	if (task.name === "main") parts.pop();
	// 	if (root) parts.unshift(root);
	// 	return parts.join(".");
	// }

	// export async function modelToTs(task: any) {
	// 	const path = task.pathString;
	// 	const uri = monaco.Uri.file(`${path}.ts`);
	// 	const namespace = getTaskNS(task);
	// 	const value = moduleCode(task.code, namespace);

	// 	const uModel = monaco.editor.getModel(uri);
	// 	if (uModel) {
	// 		console.debug("[taskToTs] Model exists:", uModel.uri);
	// 		uModel.setValue(value);
	// 		return uModel;
	// 	}

	// 	const nModel = monaco.editor.createModel(value, "typescript", uri);
	// 	console.debug("[taskToTs] Model created:", nModel.uri);
	// 	return nModel;
	// }

	// export async function setEditorModel(editor: any, model: any) {
	// 	const cModel = editor.getModel();

	// 	if (cModel && cModel !== model) {
	// 		console.warn(
	// 			`[setEditorModel] Model dispose: ${cModel.uri} != ${model.uri}`
	// 		);
	// 		cModel.dispose();
	// 	}

	// 	editor.setModel(model);
	// 	await editor.getAction("editor.action.formatDocument").run();

	// 	return editor;
	// }
}

// api = Api(cx);

// if (!isNaN(cx.task.name)) cx.task.name = `task${cx.task.name}`;

// api.updateCompilerOptions()
// await api.js2tsModel();

// const noop = () => undefined;
// const proxy = () => new Proxy(noop, handler);
// const handler = { get: proxy, apply: noop };
// app = proxy();

// const func = Function(cx.task.workflow.project.name, await api.getRunnableJS())
// func()

// const res = await api.getEmitResult()
// for (let file of res.outputFiles) {
//     console.log('file', 'file://'+file.name)
//     //await cx.writeModule(file.name, file.text)
// }
