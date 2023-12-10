// @clapp/init v1.0.2
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var api_exports = {};
__export(api_exports, {
  clapp: () => clapp,
  cx: () => cx
});
module.exports = __toCommonJS(api_exports);
var clapp;
((clapp2) => {
  let foo;
  ((foo2) => {
    foo2.x = 4;
  })(foo = clapp2.foo || (clapp2.foo = {}));
})(clapp || (clapp = {}));
var cx;
((cx2) => {
  function getReactData(el) {
    const keys = Object.getOwnPropertyNames(el);
    const getReactKeys = () => keys.filter((prop) => prop.startsWith("__react"));
    const cleanKey = (key) => key.replace(`$${keyId}`, "").replace("__react", "").toLowerCase();
    const reactKeys = getReactKeys();
    if (!reactKeys[0])
      return void 0;
    const keyId = reactKeys[0].split("$").pop();
    const keysMap = reactKeys.map(
      (key) => [key, cleanKey(key)]
    );
    const data = /* @__PURE__ */ Object.create(null);
    for (const [oKey, nKey] of keysMap) {
      data[nKey] = el[oKey];
    }
    return data;
  }
  cx2.getReactData = getReactData;
  function getRootReactData() {
    const rootElement = document.querySelector("#root");
    if (!rootElement)
      throw new Error(`Element "#root" is null`);
    return getReactData(rootElement);
  }
  cx2.getRootReactData = getRootReactData;
  function getAppState() {
    const data = getRootReactData();
    if (!data)
      return;
    const { container } = data;
    return container.child.memoizedProps.appstate;
  }
  cx2.getAppState = getAppState;
  function getTaskProto() {
    if (cx2.appstate && cx2.appstate.account) {
      let __proto__;
      cx2.appstate.account.projects.some((project) => {
        return project.workflows.some((workflow) => {
          return workflow.tasks.some((task) => {
            return __proto__ = Object.getPrototypeOf(task);
          });
        });
      });
      return __proto__;
    }
  }
  cx2.getTaskProto = getTaskProto;
  const defineGet = (prop, getter) => {
    return Object.defineProperty(cx2, prop, {
      get: getter,
      enumerable: true,
      configurable: true
    });
  };
  defineGet("appstate", getAppState);
  defineGet("task_proto", getTaskProto);
  defineGet("monaco", () => cx2.appstate.codeEditorInstance || cx2.editor.monaco);
})(cx || (cx = {}));
((cx2) => {
  class Editor {
    #tasks = /* @__PURE__ */ Object.create(null);
    // .crw-preview-tabs__panes
    selectorTabsPaneAll = ".crw-preview-tabs__panes .crw-preview-pane";
    selectorTabsPaneActive = ".crw-preview-tabs__panes .crw-preview-pane--active";
    selectorTabsPaneModified = ".crw-preview-tabs__panes .crw-preview-pane--modified";
    // .crw-preview-tabs__content
    selectorTabsContentAll = `.crw-preview-tabs__content .crw-preview-tabs__tab`;
    selectorTabsContentActive = `.crw-preview-tabs__content .crw-preview-tabs__tab--active`;
    selectorMonacoContainer = `${this.selectorTabsContentActive} .react-monaco-editor-container`;
    selectorMonacoEditor = `${this.selectorTabsContentActive} .crw-code-editor`;
    $ = (selector) => document.querySelector(selector);
    $$ = (selector) => [...document.querySelectorAll(selector)];
    get monacoStateNode() {
      return this.getData(this.$(this.selectorMonacoEditor))?.props.children._owner.stateNode;
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
    getData(el) {
      if (!el)
        return null;
      return {
        get keyId() {
          const keys = Object.getOwnPropertyNames(el);
          return keys.find((prop) => prop.startsWith("__react")).split("$").pop();
        },
        get props() {
          return el[`__reactProps$${this.keyId}`];
        },
        get fiber() {
          return el[`__reactFiber$${this.keyId}`];
        }
      };
    }
    getTask(el) {
      const task = this.getData(el)?.props?.model;
      if (task.type !== "task")
        return;
      const path = task?.pathString;
      if (!Object.hasOwn(this.tasks, path)) {
        Object.defineProperty(this.tasks, path, {
          get: () => task,
          enumerable: true
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
  cx2.Editor = Editor;
  cx2.editor = new Editor();
})(cx || (cx = {}));
((cx2) => {
  let api;
  ((api2) => {
    const isJSLang = false;
    const monaco = cx2.editor.monaco;
    const editorCompProto = Object.getPrototypeOf(cx2.editor.monacoStateNode);
    api2._componentDidMount = cx2.api._componentDidMount || editorCompProto.componentDidMount;
    async function initDTS(workflow) {
      const paths = workflow.tasks.map(
        (task) => task.pathString
      );
      console.log("[initDTS]", paths);
      api2.dtsIndex = await addExtraDTS(getWFIndexDTS(workflow));
      workflow.__dtsIndex = api2.dtsIndex.uri.toString();
      console.info("[DTS Index]", workflow.__dtsIndex);
      api2.dtsMap = await Promise.all(workflow.tasks.map(addDTS));
      workflow.__dtsTasks = api2.dtsMap.map((res) => res.uri.toString());
    }
    api2.initDTS = initDTS;
    editorCompProto.componentDidMount = function CDM(...args) {
      const { task } = this.props;
      const { workflow } = task;
      api2.thisTask = task;
      api2.thisWorkflow = workflow;
      this.stringifyTaskType = () => {
      };
      this.getMarkers = () => {
      };
      const __uri = this.fileUri.toString();
      console.log("editorDidMount", __uri);
      if (!workflow.__dts || workflow.__lastPath !== workflow.pathString) {
        workflow.__dts = true;
        task.__lastPath = task.pathString;
        workflow.__lastPath = workflow.pathString;
        initDTS(workflow);
      }
      return cx2.api._componentDidMount.call(this, ...args);
    };
    console.log("[editorCompProto.componentDidMount] patched");
    const getWorker = isJSLang ? monaco.languages.typescript.getJavaScriptWorker : monaco.languages.typescript.getTypeScriptWorker;
    api2.defaults = isJSLang ? monaco.languages.typescript.javascriptDefaults : monaco.languages.typescript.typescriptDefaults;
    api2.getJS = async (model) => {
      if (isJSLang)
        return model.getValue();
      const result = await (0, api2.getEmitOutput)(model);
      const firstJS = result.outputFiles.find(
        (o) => o.name.endsWith(".js") || o.name.endsWith(".jsx")
      );
      return firstJS && firstJS.text || "";
    };
    api2.getDTS = async (model) => {
      const result = await (0, api2.getEmitOutput)(model);
      return result.outputFiles.find((o) => o.name.endsWith(".d.ts")).text;
    };
    api2.getEmitOutput = async (model) => {
      const client = await getWorkerProcess(model);
      return await client.getEmitOutput(model.uri.toString());
    };
    const getWorkerProcess = async (model) => {
      const worker = await getWorker();
      return await worker(model.uri);
    };
    api2.getModel = (task) => {
      const filePath = task?.taskPathString ? `${task.workflow.name}/${task.taskPathString}` : Date.now();
      const uri = monaco.Uri.parse(`file:///${filePath}.ts`);
      return monaco.editor.getModel(uri);
    };
    function createModel(task) {
      const filePath = task?.taskPathString ? `${task.workflow.name}/${task.taskPathString}` : Date.now();
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
    api2.createModel = createModel;
    async function addExtraDTS(model) {
      let dts = model.code || await (0, api2.getDTS)(model);
      let uri = monaco.Uri.parse(
        `${model.uri}`.replace(".d.ts", ".ts").replace(".ts", ".d.ts")
      );
      api2.defaults.addExtraLib(dts, uri);
      let _model = monaco.editor.getModel(uri);
      if (_model) {
        _model.setValue(dts);
      } else {
        _model = monaco.editor.createModel(dts, "typescript", uri);
      }
      const _lib = api2.defaults._extraLibs[uri];
      return { uri, _lib, _model };
    }
    api2.addExtraDTS = addExtraDTS;
    async function addDTS(task) {
      let model = (0, api2.getModel)(task) || createModel(task);
      try {
        const res = await addExtraDTS(model);
        if (model._attachedEditorCount === 0)
          model.dispose();
        console.info("[DTS Task]", res.uri + "", res._lib.version);
        return res;
      } catch (message_1) {
        console.error(message_1);
      }
    }
    api2.addDTS = addDTS;
    api2.task_update = cx2.api.task_update || cx2.task_proto.update;
    if (cx2.api.task_update && !cx2.task_proto.update.__patched) {
      cx2.task_proto.update = function cx_update(...args) {
        addDTS(this);
        return api2.task_update.call(this, ...args);
      };
      cx2.task_proto.update.__patched = true;
      console.log("[task.__proto__.update] patched");
    }
    api2.task_fetch = cx2.api.task_fetch || cx2.task_proto.fetch;
    if (api2.task_fetch && !cx2.task_proto.fetch.__patched) {
      cx2.task_proto.fetch = async function cx_fetch(...args) {
        const res = await api2.task_fetch.call(this, ...args);
        return res;
      };
      cx2.task_proto.fetch.__patched = true;
      console.log("[task.__proto__.fetch] patched");
    }
    api2.task_run = cx2.api.task_run || cx2.task_proto.run;
    if (cx2.api.task_run && !cx2.task_proto.run.__patched) {
      cx2.task_proto.run = function cx_run(...args) {
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
        return api2.task_run.call(this, ...args);
      };
      cx2.task_proto.run.__patched = true;
      console.log("[task.__proto__.run] patched");
    }
    function getWFIndexDTS(workflow) {
      const absTypes = workflow.tasks.map((task) => {
        return `"${task.workflow.name}/${task.taskPathString}": typeof import("${task.workflow.name}/${task.taskPathString}");`;
      });
      const relTypes = workflow.tasks.map((task) => {
        return `"${task.taskPathString}": TasksMap["${task.workflow.name}/${task.taskPathString}"]`;
      });
      const code = [
        `declare interface TasksMap {`,
        "	" + absTypes.join("\n	"),
        `}`,
        `// relative`,
        `declare interface TasksMap {`,
        "	" + relTypes.join("\n	"),
        `}`
      ].join("\n");
      const uri = monaco.Uri.parse(`file:///${workflow.name}/global.d.ts`);
      return { code, uri };
    }
    api2.getWFIndexDTS = getWFIndexDTS;
    function updateCompilerOptions(options) {
      api2.defaults.setCompilerOptions({
        ...api2.defaults.getCompilerOptions(),
        ...defaultCompilerOptions(),
        ...options
      });
    }
    api2.updateCompilerOptions = updateCompilerOptions;
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
        module: monaco.languages.typescript.ModuleKind.CommonJS
      };
    }
    api2.getDomNode = (editor) => editor.getDomNode();
    api2.getValue = (model) => model.getValue();
    api2.setValue = (model, text) => model.setValue(text);
    api2.getActiveModel = () => cx2.editor.instance.getModel();
    api2.getActiveTask = () => cx2.editor.task;
    async function modelToTs(task) {
      const path = task.pathString;
      const uri = monaco.Uri.file(`${path}.ts`);
      const value = task.code;
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
    api2.modelToTs = modelToTs;
  })(api = cx2.api || (cx2.api = {}));
})(cx || (cx = {}));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  clapp,
  cx
});
