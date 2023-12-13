export declare namespace clapp.foo {
    var x: number;
}
export declare namespace cx {
    class AppState {
        static db: {};
        static app: {};
        static account: {
            projects: [
                {
                    workflows: [
                        {
                            tasks: [
                                {
                                    __proto__: {
                                        update: () => any;
                                    };
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
    export function getReactData(el: Element): {
        fiber: any;
        props: any;
        container: any;
    };
    export function getRootReactData(): {
        fiber: any;
        props: any;
        container: any;
    };
    export function getAppState(): any;
    export function getTaskProto(): any;
    export let appstate: typeof AppState;
    export let task_proto: any;
    export {};
}
export declare namespace cx {
    class Editor {
        #private;
        selectorTabsPaneAll: string;
        selectorTabsPaneActive: string;
        selectorTabsPaneModified: string;
        selectorTabsContentAll: string;
        selectorTabsContentActive: string;
        selectorMonacoContainer: string;
        selectorMonacoEditor: string;
        $: (selector: string) => Element;
        $$: (selector: string) => Element[];
        get monacoStateNode(): any;
        get monaco(): any;
        get instance(): any;
        get task(): any;
        get tasks(): any;
        set tasks(value: any);
        getData(el: Element | null): {
            readonly keyId: string;
            readonly props: any;
            readonly fiber: any;
        };
        getTask(el: Element | null): any;
        get activeTask(): any;
        get activeEditor(): Element;
    }
    const editor: Editor;
}
export declare namespace cx.api {
    let _componentDidMount: any;
    let thisTask: any;
    let thisWorkflow: any;
    let dtsMap: any;
    let dtsIndex: any;
    function initDTS(workflow: any): Promise<void>;
    const defaults: any;
    const getJS: (model: any) => Promise<any>;
    const getDTS: (model: any) => Promise<any>;
    const getEmitOutput: (model: any) => Promise<any>;
    const getModel: (task: any) => any;
    function createModel(task: any): any;
    function addExtraDTS(model: any): Promise<{
        uri: any;
        _lib: any;
        _model: any;
    }>;
    function addDTS(task: any): Promise<{
        uri: any;
        _lib: any;
        _model: any;
    }>;
    var task_update: any;
    var task_fetch: any;
    var task_run: any;
    function getWFIndexDTS(workflow: any): {
        code: string;
        uri: any;
    };
    function updateCompilerOptions(options: any): void;
    const getDomNode: (editor: any) => any;
    const getValue: (model: any) => any;
    const setValue: (model: any, text: string) => any;
    const getActiveModel: () => any;
    const getActiveTask: () => any;
    function modelToTs(task: any): Promise<any>;
}
//# sourceMappingURL=patch.d.ts.map