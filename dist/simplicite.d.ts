import * as Quill from 'quill';
import Quill__default, { QuillOptions } from 'quill';
import { EventClickArg, DateSelectArg, EventDropArg, Calendar } from '@fullcalendar/core';
import { EventResizeDoneArg } from '@fullcalendar/interaction';
import Chart from 'chart.js/auto';
import L$1, { LatLngTuple } from 'leaflet';
import * as bootstrap from 'bootstrap';
import flatpickr from 'flatpickr';
import { Options, Plugin } from 'flatpickr/dist/types/options';
import { Instance } from 'flatpickr/dist/types/instance';
import moment from 'moment';
import hljs from 'highlight.js';
import { marked } from 'marked';
import { Calendar as Calendar$1 } from '@fullcalendar/core/index.js';
import { Html5Qrcode } from 'html5-qrcode';
import SignaturePad from 'signature_pad';
import { GridStack } from 'gridstack';
import js_beautify from 'js-beautify';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import mermaid from 'mermaid';
import mustache from 'mustache';
import Terminal from 'xterm';
import { ChartConfiguration, InteractionItem, TitleOptions } from 'chart.js';

type GridEditorJson = string[][];
type MenuGridOptions = {
    menuSelector: string;
    menuSelected: (invokedOn: JQuery, target: JQuery) => void;
};
type GridEditorOptions = {
    name?: string;
    initRows?: number;
    initCols?: number;
    text?: {
        BUTTON_ADD_ROW_BEFORE: string;
        BUTTON_ADD_ROW_AFTER: string;
        BUTTON_DEL_ROW: string;
        BUTTON_ADD_COL_BEFORE: string;
        BUTTON_ADD_COL_AFTER: string;
        BUTTON_DEL_COL: string;
    };
    emptyVal?: string;
    initJson?: string | GridEditorJson;
    readonly?: boolean;
    postDataChange?: (data: GridEditorJson) => void;
};
type GridEditorParam = {
    name: string;
    json?: string | GridEditorJson;
    grid: JQuery;
    textarea?: JQuery;
    readonly?: boolean;
    settings?: GridEditorOptions;
};
/**
 * Editable JSON array as HTML table
 * @class
 */
declare class GridEditor {
    contextMenu(ctn: JQuery, settings: MenuGridOptions): JQuery;
    edit(container: JQuery, settings: GridEditorOptions): void;
}

/**
 * Generic JQuery handler for HTML element
 * @type Handler
 */
type JQueryHandler = (this: HTMLElement, event: JQuery.Event, ...params: any) => void;
type PillboxParam = {
    limit: number;
    maxOccurs: number;
    help?: string;
    search: null | ((values: string, cbk: (r: KeyObject) => void) => void);
    display: null | ((item: KeyObject) => string);
    lookup: null | ((add?: (id: string, label: string) => void) => void);
    onAdd: null | ((id: string, fn: (...p: any) => void, data: KeyObject) => void);
    onRemove: null | ((id: string, fn: Callback) => void);
    onCreate: null | ((val: string, fn: (id: string, label: string) => void) => void);
    onOpen: null | ((id: string) => void);
    completion?: any;
    onCreateLabel?: string;
};
/**
 * JQuery SVGGraphicsElement
 */
type JSVG = JQuery<SVGGraphicsElement>;
declare global {
    interface JQueryStatic {
        escapeHTML(c: string): string;
        getSafeHTML(c: string | JQuery): string;
        SVGElement(name: string, attr?: object): JSVG;
        jqplot: any;
    }
    interface JQuery {
        spectrum: (p?: any) => JQuery;
        contextMenuGrid: (settings: MenuGridOptions) => JQuery;
        editableTable: (settings: GridEditorOptions) => JQuery;
        reverse(): JQuery;
        appendText(c: string): JQuery;
        htmlSafe(c: string | JQuery): JQuery;
        appendSafe(c: string | JQuery): JQuery;
        prependSafe(c: string | JQuery): JQuery;
        replaceClass(oldClass: string, newClass?: string): JQuery;
        clickToggle(f1: {
            apply: (arg0: HTMLElement, arg1: IArguments) => void;
        }, f2: {
            apply: (arg0: HTMLElement, arg1: IArguments) => void;
        }): JQuery;
        swipe(handler?: Callback | "remove", options?: {
            duration?: number;
            direction?: string;
            distance?: number;
            margin?: number;
        }): JQuery;
        masonry(options?: JQuery | {
            item?: JQuery;
            columns?: number;
        }): JQuery;
        maxZ(selector?: string, min?: number): JQuery;
        scrollParent(dir?: string): JQuery<HTMLElement | Document>;
        scrollParents(dir?: string): JQuery<HTMLElement | Document>;
        printPreview(params?: {
            width?: string;
            height?: string;
            top: string;
            left: string;
            resizable: string;
            scrollbars?: string;
            status: string;
            title?: string;
        }): JQuery;
        setSelection(selectionStart: number, selectionEnd: number): JQuery;
        setCursorPosition(position: number): JQuery;
        focusEnd(): JQuery;
        getCursorPosition(): number;
        getWordAtPosition(str?: string, i?: number): string;
        replaceWordAtPosition(word: string, str?: string, i?: number): string;
        insertAtCursor(text: string): JQuery;
        pillbox(p: string | {
            limit?: number;
            maxOccurs?: number;
            help?: string;
            search: null | ((values: string, cbk: (r: KeyObject) => void) => void);
            display: null | ((item: KeyObject) => string);
            onAdd: null | ((id: string, fn: (...p: any) => void, data: KeyObject) => void);
            onRemove: null | ((id: string, fn: Callback) => void);
            onCreate: null | ((val: string, fn: Callback) => void);
            onOpen: null | ((id: string) => void);
            lookup: null | ((add?: Callback) => void);
            onCreateLabel?: string;
        }, data?: {
            id: string;
            label: string;
            del?: boolean;
            open?: boolean;
        }[]): JQuery | string[];
        autosize(options?: {
            className?: string;
            id?: string;
            append?: string;
            callback?: (ta: Element) => void;
            resizeDelay?: number;
            placeholder?: boolean;
        }): JQuery;
        draggable(options?: string | {
            handle?: JQuery | string | boolean;
            exclude?: string;
            x?: boolean;
            y?: boolean;
        }): JQuery;
    }
}
declare class JQueryExtension {
    constructor();
}

type TreeNode = {
    id?: string;
    name: string;
    type: number;
    image?: string;
    style?: string;
    layout?: string;
    userkey?: string;
    path?: string;
    row_id?: string;
    object?: string | {
        name: string;
        form?: boolean;
        list?: boolean;
        plus?: boolean;
    };
    item?: RowData;
    old?: RowData;
    diff: 0 | 1 | 2 | 3;
    links?: TreeNodeList[];
    children?: TreeNode[];
    count?: number;
    history?: KeyObject[];
    closed?: {
        [path: string]: boolean;
    };
    objects?: string[];
    showNodeList?: boolean;
};
type TreeNodeList = {
    object: string;
    icon?: string;
    label: string;
    path?: string;
    count: number;
    page: number;
    maxpage: number;
    list: TreeNode[];
    process?: string;
    exturl?: string;
    action?: string;
    meta?: Action;
    field?: string;
    filters?: KeyObject;
    script?: string;
    nolist?: boolean;
};
type TreeParam = {
    inst?: string;
    depth?: number;
    menu?: boolean;
    docked?: boolean;
    open?: boolean;
    work?: JQuery;
    display?: (target: Container, obj: BusinessObject, rowId: string, tv: TreeView, p: KeyObject, cbk: Callback) => void;
    onOpen?: (node: TreeNode, cbk: (item: RowItem) => void) => void;
    onPage?: (parent: string, parentId: string, object: string, page: number, cbk: (r: KeyObject) => void) => void;
    addMenu?: Callback;
    delMenu?: Callback;
};
/**
 * Simplicit&eacute; tree view
 * @class
 */
declare class TreeView {
    app: Session;
    name: string;
    root?: TreeNode;
    private _nodes;
    /**
     * Constructor
     * @param {Session} app Ajax services
     * @param {Object} tv Treeview metadata { id, name, root... }
     */
    constructor(app: Session, tv: object);
    /**
     * Get node definition
     * @param {string} id node id
     * @memberof Simplicite.Ajax.TreeView
     * @function
     */
    getDefinition(id: string): TreeNode;
    /**
     * Node definition of object
     * @param {string} obj object name
     * @memberof Simplicite.Ajax.TreeView
     * @function
     */
    getNode(obj: string): KeyObject | undefined;
}

type FormActions = {
    generic?: boolean;
    form?: Action[] | null;
    formPlus?: Action[] | null;
};
type ShowViewsMode = boolean | "tabs" | "vertical" | "split";
type FormParam = NavParam & {
    title?: string;
    titleMax?: number;
    form?: JQuery;
    help?: AnyContent;
    actions?: FormActions | null;
    formActions?: Action[] | null;
    plusActions?: Action[] | null;
    transitions?: Transition[] | null;
    actionGroups?: ActionGroup[];
    template?: string;
    showViews?: ShowViewsMode;
    viewTab?: string;
    showOptions?: boolean;
    isExtended?: boolean;
    floating?: boolean;
    collapsed?: KeyObject;
    areaColumns?: number;
    readonly?: boolean;
    constraints?: boolean;
    inst?: string;
    copy?: boolean;
    workflow?: boolean;
    msg?: MessageJSON[];
    values?: RowItem | null;
    followLinks?: boolean;
    createLinks?: boolean;
    refButtons?: KeyObject;
    search?: boolean;
    fixedFilters?: KeyObject;
    parent?: ParentObject;
    link?: Link;
    inline?: InlineObject;
    saveBtn?: JQuery;
    activateSaveOnChange?: boolean;
    actionAutoSave?: boolean;
    ignoreCanSaveClose?: true;
    ignoreCanClose?: true;
    ignoreCanSave?: true;
    ignoreCanSaveNew?: true;
    ignoreCanSaveCopy?: true;
    beforeload?: (ctn: Container, o: UIBusinessObject, p: FormParam) => void;
    preload?: (ctn: Container, o: UIBusinessObject, p: FormParam) => void;
    onload?: (ctn: Container, o: UIBusinessObject, p: FormParam) => void;
    display?: (ctn: Container, o: UIBusinessObject, p: FormParam, done: Callback) => void;
    onunload?: (ctn: Container, o: UIBusinessObject, p: FormParam) => void;
    onread?: (ctn: Container, o: UIBusinessObject, p: FormParam, cbk: Callback) => void;
    beforesave?: (ctn: Container, o: UIBusinessObject, index?: string, cbk?: Callback) => void;
    aftersave?: (ctn: Container, o: UIBusinessObject, index?: string, cbk?: Callback) => void;
    onsave?: null | ((ctn: Container, o: UIBusinessObject, cbk?: Callback) => void);
    onsaveclose?: null | ((ctn: Container, o: UIBusinessObject, cbk?: Callback) => void);
    onsavenew?: null | ((ctn: Container, o: UIBusinessObject, cbk?: Callback) => void);
    onsavecopy?: null | ((ctn: Container, o: UIBusinessObject, cbk?: Callback) => void);
    onhelp?: null | ((o: UIBusinessObject) => void);
    onclose?: null | ((ctn: Container, o: UIBusinessObject) => void);
    noRowFound?: (ctn: Container, o: UIBusinessObject, id: string) => void;
    socialShare?: {
        enabled?: boolean;
    };
    onsocial?: (ctn: Container, p: {
        object: string;
        rowId: string;
        embedded?: boolean;
        activity?: boolean;
    }) => void;
    index?: string;
    formTab?: KeyObject;
    parse?: boolean;
    tabNum?: number;
    hasMore?: boolean;
    refb?: KeyObject;
    visView?: number;
};
type TrackerTask = {
    name?: string;
    message?: string;
    error?: string;
    file?: string;
    time?: string;
};
type TrackerData = {
    name: string;
    title?: string;
    start?: string;
    end?: string;
    time?: string;
    tasks?: TrackerTask[];
    depth?: number;
    percent?: number;
    state?: "T";
    minifiable?: boolean;
    minified?: boolean;
    closeable?: boolean;
    stoppable?: boolean;
};
type TrackerCallback = (data: TrackerData) => void;
type TrackerParam = {
    title?: string;
    object?: BusinessObject;
    action?: Action;
    start?: ((cbk: TrackerCallback) => void) | null;
    progress?: (cbk: TrackerCallback) => void;
    stop?: (cbk: TrackerCallback) => void;
    minify?: (cbk: TrackerCallback) => void;
    done?: (log: JQuery, task: (t: TrackerTask) => void, pbar: JQuery) => void;
    bar?: JQuery;
};
/**
 * Object form rendering
 * @class
 */
declare class Form {
    /**
     * Build the object form based on the UI template
     * @param {jQuery} ctn parent container
     * @param {Simplicite.UI.BusinessObject} o object
     * @param {Simplicite.UI.Globals.form} p optional parameters
     * @param {function} cbk optional callback
     * @function
     */
    display(ctn: Container, o: UIBusinessObject, p: FormParam, cbk?: Callback): void;
    /**
     * Display a state-model navbar
     * @param {jQuery} ctn container
     * @param {Object} data navbar data style BREAD/METRO/ARROW + list of states
     * @function
     */
    stateNavbar(ctn: Container, data: KeyObject): void;
    /**
     * Bind scroll to set the floating actions vertical position
     * @param {jQuery} ctn main container
     * @param {jQuery} div form container with a scrollable parent
     * @param {jQuery} bar actions bar to detach
     * @param {jQuery} form optional form to stay inside
     * @param {boolean} left true to float on left (default right)
     * @function
     */
    floatingActions(ctn: Container, div: Container, bar: JQuery, form?: JQuery, left?: boolean): void;
    /** Observe the head width to rebuild the actions bar to fit-content */
    observeHead(actions: JQuery): void;
    /**
     * Display the object usages
     * @param {jQuery} ctn container to populate
     * @param {Array} list list of users { login, firstname, lastname, picture, usageId }
     * @param {string} obj optional object name when ctn is unknown (keepAlive trigger)
     * @param {Object} id  optional row Id (keepAlive trigger)
     * @param {string} action optional action use|close|delete|logout
     * @function
     */
    objectUsage(ctn: Container | null, list?: UsageUser[], obj?: string, id?: string, action?: "use" | "close" | "delete" | "logout"): void;
    /**
     * Object informations
     * @function
     */
    about(o: BusinessObject, id?: string): void;
    /**
     * Confirm action with dialog
     * @param {Object} act Action
     * @param {Simplicite.UI.BusinessObject} o Object
     * @param {function} run Optional confirm callback with actions 'values' and 'cbk(msg)' to send errors
     * @returns Promise(ok, refuse)
     * @function
     */
    confirm(act: Action, o: BusinessObject, run?: (params?: ConfirmRun) => void): Promise<void | KeyObject>;
    /**
     * Open a dialog to track one asynchronous action
     * @param {Object} tk Tracker infos name + state + tasks
     * @param {Object} options
     * @param {string} options.title optional dialog title (default tracker title or name)
     * @param {function} options.start optional function(cbk) to start the tracking (default auto-start)
     * @param {function} options.progress function(cbk) service to get back-end tracking
     * @param {function} options.stop Optional service to request action stop
     * @param {function} options.minify Optional service to toggle/minify popup
     * @param {function} options.done optional function(log,task,pbar) when finished
     * @param {jQuery} options.bar optional actions bar (default = Close button)
     * function
     */
    tracker(tk: TrackerData, options: TrackerParam): JQuery<HTMLElement>;
    /**
     * Build a form based on global form.template
     * @param {Object} params options
     * @param {string} params.icon icon name
     * @param {Object} params.title form title
     * @param {Object} params.content form content
     * @param {Object} params.actions form actions
     * @function
     */
    build(params: {
        icon?: string;
        title: string;
        content?: AnyContent;
        actions?: AnyContent;
    }): JQuery<HTMLElement>;
    /**
     * Call to action in case of ERR_UPDATED
     * @param {boolean} force true to force the timestamp to the DB value and re-save, false to discard changes = reload form
     * @function
     */
    forceChange(ctn: Container, obj: BusinessObject, id: string, force: boolean): void;
    private completion;
}

type SearchPredefParam = {
    list: PredefSearch[];
    usage?: number;
    service: (action: string, def: PredefSearch, cbk: (ps: PredefSearch) => void) => void;
};
type SearchParam = {
    position?: "docked" | "column" | "popup";
    slide?: "right" | "left" | null;
    title?: string;
    help?: string;
    msg?: MessageAny[];
    showIndex?: boolean;
    showSorting?: boolean;
    isExtended?: boolean;
    editPredef?: boolean;
    inst?: string;
    fields?: ObjectField[];
    fixedFilters?: KeyObject;
    filters?: KeyObject;
    groupBy?: boolean;
    toggle?: boolean;
    docked?: boolean;
    refButtonsBy?: KeyObject;
    refButtons?: KeyObject;
    predef?: false | SearchPredefParam;
    beforeload?: (ctn: Container, o: UIBusinessObject, p: SearchParam) => void;
    onload?: (ctn: Container, o: UIBusinessObject, p: SearchParam) => void;
    display?: (ctn: Container, o: UIBusinessObject, p: SearchParam, done: Callback) => void;
    onunload?: (ctn: Container, o: UIBusinessObject, p: SearchParam) => void;
};
/**
 * Object search rendering
 * @class
 */
declare class Search {
    /**
     * Search field
     * @param ctn container
     * @param o business object
     * @param f object field
     * @param filter current filter
     * @param fixedFilter fixed filter
     * @param search handler to launch the search
     * @returns formGroupSearch with required or semireq class
     * @function
     */
    field(ctn: Container, o: BusinessObject, f: ObjectField, filter: string, fixedFilter: string, search?: Callback): JQuery<HTMLElement>;
    /**
     * Build the search form
     * @param {jQuery} ctn parent container
     * @param {Simplicite.UI.BusinessObject} o object
     * @param {Simplicite.UI.Globals.search} p optional parameters
     * @param {function} cbk optional callback
     * @function
     */
    display(ctn: Container, o: UIBusinessObject, p: SearchParam, cbk?: Callback): void;
    /**
     * Remove all UI filters
     * @param {jQuery} form container
     * @param {Simplicite.UI.BusinessObject} o object
     * @param {Array} fields optional fields array to delete foreignUserKey
     * @function
     */
    reset(form: Container, o: BusinessObject, fields?: ObjectField[]): void;
    /**
     * Predefined search selector
     * @param {Simplicite.UI.BusinessObject} o object
     * @param {Object} p search parameters with fields and predef services
     * @param {Object} filters Current form filters
     * @param {function} update callback to update the form with selected search
     * @param {function} close callback to return to form
     * @function
     */
    predef(o: BusinessObject, p: SearchParam, filters: KeyObject, update?: Callback, close?: Callback): JQuery<HTMLElement>;
    /**
     * Sort/Group by columns editor
     * @param {Simplicite.UI.BusinessObject} o object
     * @param {Object} p search parameters
     * @param {function} apply callback to process the sort on list
     * @param {function} close callback to return to form
     * @function
     */
    sortby(o: BusinessObject, p: SearchParam, apply?: Callback, close?: Callback): JQuery<HTMLElement> | undefined;
}

/**
 * Extends Simplicite.Ajax.BusinessObject with front hooks.
 * @class
 */
declare class UIBusinessObject extends BusinessObject {
    ui?: UIEngine;
    /**
     * Front constraints implementation
     * @member
     */
    applyConstraints?: ConstraintFunction;
    /**
     * Bind hook functions in locals with inherited methods
     * @function
     */
    bindHooks(): void;
    /**
     * Call a hook implementation
     * @param {function} method hook
     * @param {Array} params array of parameters to apply
     * @function
     */
    hook(method: any, params: any): any;
    /**
     * Front hook when object is instantiated.
     * Useful to override locals (cloned from Simplicite.UI.Globals) properties before usage.
     * @param _locals UI locals properties (shorthand to this.locals.ui)
     * @function
     */
    onLoad(_locals?: typeof Globals): void;
    /**
     * Front hook before loading form data
     * @param _ctn Form container
     * @param _obj Object (same as this)
     * @param _p Form parameters
     * @function
     */
    beforeLoadForm(_ctn: Container, _obj: UIBusinessObject, _p: FormParam): void;
    /**
     * Front hook when record is not found (default NO_ROW_FOUND alert + list redirection)
     * @param ctn Form container
     * @param obj Object (same as this)
     * @param _rowId Object row ID
     * @function
     */
    noRowFound(ctn: Container, obj: UIBusinessObject, _rowId: string): void;
    /**
     * Front hook before rendering form
     * @param _ctn Form container
     * @param _obj Object (same as this)
     * @param _p Form parameters
     * @function
     */
    preLoadForm(_ctn: Container, _obj: UIBusinessObject, _p: FormParam): void;
    /**
     * Front hook to display the form
     * @param ctn Form container
     * @param obj Object (same as this)
     * @param p Form parameters
     * @param cbk callback when rendered
     * @function
     */
    displayForm(ctn: Container, obj: UIBusinessObject, p: FormParam, cbk: Callback): void;
    /**
     * Front hook when object form is loaded
     * @param _ctn Form container
     * @param _obj Object (same as this)
     * @param _p Form parameters
     * @function
     */
    onLoadForm(_ctn: Container, _obj: UIBusinessObject, _p: FormParam): void;
    /**
     * Front hook when object form is unloaded
     * @param _ctn Form container
     * @param _obj Object (same as this)
     * @param _p Form parameters
     * @function
     */
    onUnloadForm(_ctn: Container, _obj: UIBusinessObject, _p: FormParam): void;
    /**
     * Front hook when object form is read
     * @param _ctn Form container
     * @param _obj Object (same as this)
     * @param _p Form parameters
     * @param cbk callback() must be called to resolve promise
     * @function
     */
    onReadForm(_ctn: Container, _obj: UIBusinessObject, _p: FormParam, cbk?: () => void): void;
    /**
     * Front hook before calling Ajax object.save()
     * @param _ctn Form container
     * @param _obj Object (same as this)
     * @param _index record index (edit list)
     * @param cbk callback(true|false) (must return 'true' to continue or 'false' to stop/reject promise)
     */
    beforeSave(_ctn: Container, _obj: UIBusinessObject, _index?: string, cbk?: (x: boolean) => void): void;
    /**
     * Front hook after calling Ajax object.save()
     * @param _ctn Form container
     * @param _obj Object (same as this)
     * @param _index record index (edit list)
     * @param cbk callback(true|false) (must return 'true' to continue or 'false' to stop/reject promise)
     */
    afterSave(_ctn: Container, _obj: UIBusinessObject, _index?: string, cbk?: (x: boolean) => void): void;
    /**
     * Front hook before loading list data
     * @param _ctn List container
     * @param _obj Object (same as this)
     * @param _p List parameters
     * @function
     */
    beforeLoadList(_ctn: Container, _obj: UIBusinessObject, _p: ListParam): void;
    /**
     * Front hook before rendering list
     * @param _ctn List container
     * @param _obj Object (same as this)
     * @param _p List parameters
     * @function
     */
    preLoadList(_ctn: Container, _obj: UIBusinessObject, _p: ListParam): void;
    /**
     * Front hook to display the list
     * @param ctn List container
     * @param obj Object (same as this)
     * @param p List parameters
     * @param cbk callback when rendered
     * @function
     */
    displayList(ctn: Container, obj: UIBusinessObject, p: ListParam, cbk: Callback): void;
    /**
     * Front hook to display one list record
     * @param ctn List container
     * @param row Row container (tr or div)
     * @param obj Object (same as this)
     * @param id Row ID
     * @param p List parameters
     * @param cbk callback when rendered
     * @function
     */
    displayListRow(ctn: Container, row: Container, obj: UIBusinessObject, id: string, p: ListParam, cbk: Callback): void;
    /**
     * Front hook when a list row is displayed
     * @param _ctn List container
     * @param _obj Object (same as this)
     * @param _id Row ID
     * @param _item Row item
     * @param _row Row container (tr or div)
     * @function
     */
    onLoadListRow(_ctn: Container, _obj: UIBusinessObject, _id: string, _item: RowData, _row: Container): void;
    /**
     * Front hook when a list row is unloaded
     * @param _ctn List container
     * @param _obj Object (same as this)
     * @param _id Row ID
     * @param _item Row item
     * @param _row Row container (tr or div)
     * @function
     */
    onUnloadListRow(_ctn: Container, _obj: UIBusinessObject, _id: string, _item: RowData, _row: Container): void;
    /**
     * Front hook when object list is loaded
     * @param _ctn List container
     * @param _obj Object (same as this)
     * @param _p List parameters
     * @function
     */
    onLoadList(_ctn: Container, _obj: UIBusinessObject, _p: ListParam): void;
    /**
     * Front hook when object list is unloaded
     * @param _ctn List container
     * @param _obj Object (same as this)
     * @param _p List parameters
     * @function
     */
    onUnloadList(_ctn: Container, _obj: UIBusinessObject, _p: ListParam): void;
    /**
     * Front hook before loading search form
     * @param _ctn Search container
     * @param _obj Object (same as this)
     * @param _p Search parameters
     * @function
     */
    beforeLoadSearch(_ctn: Container, _obj: UIBusinessObject, _p: ListParam): void;
    /**
     * Front hook to display the search form
     * @param ctn Search container
     * @param obj Object (same as this)
     * @param p Search parameters
     * @param cbk callback when rendered
     * @function
     */
    displaySearch(ctn: Container, obj: UIBusinessObject, p: SearchParam, cbk: Callback): void;
    /**
     * Front hook when object search is loaded
     * @param _ctn Search container
     * @param _obj Object (same as this)
     * @param _p Search parameters
     * @function
     */
    onLoadSearch(_ctn: Container, _obj: UIBusinessObject, _p: SearchParam): void;
    /**
     * Front hook when object search is unloaded
     * @param _ctn Search container
     * @param _obj Object (same as this)
     * @param _p Search parameters
     * @function
     */
    onUnloadSearch(_ctn: Container, _obj: UIBusinessObject, _p: SearchParam): void;
    /**
     * Front hook before loading summary
     * @param _ctn Form container
     * @param _obj Object (same as this)
     * @param _p Parameters
     * @function
     */
    beforeLoadSummary(_ctn: Container, _obj: UIBusinessObject, _p: SummaryParam): void;
    /**
     * Front hook to display the object summary
     * @param ctn Summary container
     * @param mo Meta object
     * @param obj Object (same as this)
     * @param cbk callback when rendered
     * @function
     */
    displaySummary(ctn: Container, mo: MetaObject, obj: UIBusinessObject, cbk: Callback): void;
    /**
     * Front hook when object summary is loaded
     * @param _ctn Summary container
     * @param _mo Meta object
     * @param _obj Object (same as this)
     * @param _p Parameters
     * @function
     */
    onLoadSummary(_ctn: Container, _mo: MetaObject, _obj: UIBusinessObject, _p: SummaryParam): void;
    /**
     * Front hook before loading calendar
     * @param _ctn container
     * @param _obj Object (same as this)
     * @param _agd Agenda definition
     * @param _p parameters
     * @function
     */
    beforeLoadAgenda(_ctn: Container, _obj: UIBusinessObject, _agd: object, _p: KeyObject): void;
    /**
     * Front hook when calendar is loaded
     * @param _ctn container
     * @param _obj Object (same as this)
     * @param _agd Agenda definition
     * @param _p parameters
     * @function
     */
    onLoadAgenda(_ctn: Container, _obj: UIBusinessObject, _agd: object, _p: KeyObject): void;
    /**
     * Front hook when calendar is unloaded
     * @param _ctn container
     * @param _obj Object (same as this)
     * @param _agd Agenda definition
     * @param _p parameters
     * @function
     */
    onUnloadAgenda(_ctn: Container, _obj: UIBusinessObject, _agd: object, _p: KeyObject): void;
    /**
     * Front hook before loading timesheet
     * @param _ctn container
     * @param _obj Object (same as this)
     * @param _p parameters
     * @function
     */
    beforeLoadTimesheet(_ctn: Container, _obj: UIBusinessObject, _p: KeyObject): void;
    /**
     * Front hook when timesheet is loaded
     * @param _ctn container
     * @param _obj Object (same as this)
     * @param _ts Timesheet definition
     * @function
     */
    onLoadTimesheet(_ctn: Container, _obj: UIBusinessObject, _ts: KeyObject): void;
    /**
     * Front hook when timesheet is unloaded
     * @param _ctn container
     * @param _obj Object (same as this)
     * @param _ts Timesheet definition
     * @function
     */
    onUnloadTimesheet(_ctn: Container, _obj: UIBusinessObject, _ts: KeyObject): void;
}

type ListLayout = "float" | "masonry" | "column";
type ListActions = {
    list?: Action[] | null;
    listPlus?: Action[] | null;
};
type RowActions = {
    row?: Action[] | null;
    rowPlus?: Action[] | null;
};
type Filters = {
    [fieldname: string]: any;
};
type ListRowsActions = ListActions & RowActions & {
    generic?: boolean;
    contextMenu?: Action[];
    contextMenuMultiple?: Action[];
};
type ListEditMode = "upsert" | "rows" | "new";
type ListSearchMode = {
    index?: boolean | "completion";
    column?: boolean | "collapsed";
    dialog?: boolean;
    docked?: boolean;
};
type ListSelection = null | "none" | "all" | "page" | string[];
type ListParam = NavParam & {
    container?: JQuery;
    title?: string;
    context?: number;
    inst?: string;
    embedded?: boolean;
    link?: Link;
    edit?: ListEditMode;
    parent?: ParentObject;
    view?: {
        name: string;
        item: number;
        home?: boolean;
    };
    index?: string;
    step?: string;
    isExtended?: boolean;
    minimized?: boolean;
    minified?: boolean;
    minifiable?: boolean;
    showTotals?: boolean;
    showAreaTitles?: boolean;
    showFilters?: boolean;
    showFixedFilters?: boolean;
    showSearchInlined?: boolean;
    rowActionsRight?: boolean;
    constraints?: boolean;
    listEdit?: boolean;
    addList?: boolean;
    listUpsert?: boolean;
    bulkUpdate?: boolean;
    bulkDelete?: boolean;
    help?: string;
    msg?: MessageAny[];
    msgRow?: MessagesPerRow;
    highlightIds?: string[];
    floating?: boolean;
    sticky?: boolean;
    followLinks?: boolean;
    createLinks?: boolean;
    rowOpenDocs?: boolean;
    selectRows?: boolean;
    selectedIds?: string[];
    search?: null | ListSearchMode;
    indexRequest?: string;
    searchId?: string;
    filters?: Filters;
    fixedFilters?: Filters;
    template?: string;
    layout?: ListLayout;
    areas?: Area[];
    areaCols?: string[][];
    columns?: string[];
    read?: boolean;
    sort?: boolean;
    reorder?: {
        field: string;
        move?: (ids: string[], targetId: string, before?: boolean) => void;
        enabled?: false | "asc" | "desc";
    };
    beforeload?: (ctn: Container, o: UIBusinessObject, p: ListParam) => void;
    preload?: (ctn: Container, o: UIBusinessObject, p: ListParam) => void;
    onload?: (ctn: Container, o: UIBusinessObject, p: ListParam) => void;
    display?: (ctn: Container, o: UIBusinessObject, p: ListParam, done: Callback) => void;
    onunload?: (ctn: Container, o: UIBusinessObject, p: ListParam) => void;
    oncreate?: JQueryHandler | null;
    onopen?: ((ctn: Container, obj: string | UIBusinessObject, rowId: string, p?: KeyObject) => void) | null;
    onSelectRow?: (selection: ListSelection, cbk: (rowIds: string[]) => void) => void;
    onhelp?: (obj: BusinessObject) => void;
    renderTitle?: (o: BusinessObject, f: ObjectField, label: string) => JQuery;
    renderValue?: (o: BusinessObject, f: ObjectField, v: FieldValue) => JQuery;
    onloadrow?: (ctn: Container, obj: UIBusinessObject, id: string, item: RowData, row: Container) => void;
    displayrow?: (ctn: Container, row: JQuery, obj: UIBusinessObject, rowId: string, p: ListParam, done: Callback) => void;
    onunloadrow?: (ctn: Container, obj: UIBusinessObject, id: string, item: RowData, row: Container) => void;
    onsavecell?: (ctnList: Container, o: UIBusinessObject, rowId: string, f: ObjectField, index?: string | null) => Promise<KeyObject>;
    treeSearch?: (id: string, cbk: (children: RowTree[]) => void) => void;
    actions?: ListRowsActions | null;
    actionGroups?: ActionGroup[];
    transitions?: Transition[] | null;
    hasRowActions?: boolean;
    treeDepth?: number;
    treeOff?: boolean;
    level?: number;
    childrenList?: RowTree[];
    childOf?: JQuery;
    lastChild?: boolean;
    childrenCount?: number;
    treeAncestors?: Set<string>;
    listOptions?: ListParam;
    groupBy?: boolean;
    partial?: boolean;
    rows?: RowDataMeta[];
    contextMenuItems?: Action[];
    tableSummary?: string;
};
type SummaryParam = {
    inst?: string;
    parent?: ParentObject;
    icon?: boolean;
    image?: boolean;
    label?: string;
    template?: string;
    userKey?: string | null;
    fields?: ObjectField[] | null;
    actions?: ListRowsActions | null;
    refButtons?: KeyObject;
    onopen?: ((ctn: Container, obj: string | UIBusinessObject, id: string, p?: KeyObject) => void) | null;
    item?: KeyObject;
    maxFields?: number;
    layout?: string;
    beforeload?: (ctn: Container, o: UIBusinessObject, p: SummaryParam) => void;
    display?: (ctn: Container, mo: MetaObject, obj: UIBusinessObject, cbk: Callback) => void;
    onload?: (ctn: Container, mo: MetaObject, o: UIBusinessObject, p: SummaryParam) => void;
};
/**
 * Object list rendering
 * @class
 */
declare class List {
    localGroupBy: KeyObject;
    private static _thId;
    private align;
    toUI(f: ObjectField, v: any): string | string[];
    /**
     * Select list rows handler
     * @param sel 'all' | 'page' | 'none' | <rowid>
     * @function
     */
    selectRow(ctn: Container, o: BusinessObject, sel: string, p: KeyObject): void;
    /**
     * List navigation thru arrow keys
     * @param {jQuery} x list element
     * @param {object} e keydown event
     * @function
     */
    keydown(x: JQuery, e: JQuery.Event): void;
    /**
     * Build the object list
     * @param {jQuery} ctn parent container
     * @param {Simplicite.UI.BusinessObject} o object
     * @param {Simplicite.UI.Globals.list} p optional parameters
     * @function
     */
    display(ctn: Container, o: UIBusinessObject, p: ListParam): Promise<void>;
    private linkPillboxOrder;
    /**
     * Bind scroll to set the sticky header of table
     * @param {jQuery} ctn main container
     * @param {jQuery} div form container with a scrollable parents
     * @param {jQuery} thead table header
     * @function
     */
    stickyHeader(ctn: Container, div: Container, thead: JQuery): void;
    private trTotals;
    private showColAction;
    private rowGroupBy;
    /**
     * Single list row
     * @function
     */
    row(ctn: Container, elt: JQuery, o: UIBusinessObject, rowid: string, p: ListParam): Promise<void>;
    open(ctn: JQuery, el: JQuery, o: UIBusinessObject, p: ListParam): void;
    /**
     * Display a row with a template
     * @param {jQuery} d row container
     * @param {Simplicite.UI.BusinessObject} o object definition
     * @param {string} rowid row ID
     * @param {string} index row index
     * @param {string} tpl template to parse with mapped fields and actions
     * @param {Object} p list/row parameters (row actions)
     * @param {function} bindChange bind change to save a editCell field
     * @param {function} onRowOpen handler to open the row
     * @param {function} cbk callback
     * @function
     */
    rowTemplate(d: Container, o: UIBusinessObject, rowid: string, index: string, tpl: string, p: ListParam, bindChange?: (field: ObjectField) => void, onRowOpen?: null | ((div: JQuery) => void), cbk?: Callback): void;
    /**
     * Display the search bar with a template
     * @param {jQuery} div list container
     * @param {Simplicite.UI.BusinessObject} o object definition
     * @param {string} pos template position
     * @function
     */
    searchTemplate(div: Container, o: UIBusinessObject, tpl: string, pos: Position): void;
    /**
     * Read only content on list
     * @param {Simplicite.UI.BusinessObject} o Object definition
     * @param {string} rowid record row ID
     * @param {Simplicite.Ajax.ObjectField} f Field
     * @param {(string|Object)} v Field value
     * @param {Object} item Optional item of list of values
     * @param {Object} p Optional parameters (followlink, etc.)
     * @param {function} onopen Optional handler on click
     * @param {string} index Optional index of edit-list
     * @function
     */
    renderValue(o: UIBusinessObject, rowid: string, f: ObjectField, v: FieldValue, item?: EnumItem | null, p?: ListParam | null, onopen?: JQueryHandler | null, index?: string | null): string | JQuery;
    /**
     * Object summary
     * @param {jQuery} ctn container
     * @param {Object} mo meta-object data
     * @param {Simplicite.UI.BusinessObject} o optional business object
     * @param {function} cbk optional callback
     * @function
     */
    summary(ctn: Container, mo: MetaObject, o?: UIBusinessObject, cbk?: Callback): this;
    /**
     * Display the export options
     * @function
     */
    exportDialog(obj: BusinessObject, opt: KeyObject, cbk?: (param: KeyObject) => void): this;
    /**
     * Select object(s) dialog
     * @function
     */
    selectDialog(obj: BusinessObject, p: ListParam, cbk: (obj: BusinessObject, ids?: string | string[]) => void): JQuery<HTMLElement>;
    /**
     * reorder = drag and drop (selected) row(s)
     * @param ctn table tbody or templated rows container
     * @param rowid record rowid
     * @param btn grip button to handle
     * @param row tr row to move or div in case of templated row
     * @param p list paremeters
     * @function
     */
    reorder(ctn: Container, rowid: string, btn: JQuery, row: JQuery, p: ListParam): void;
    /**
     * Display a custom context menu for list elements
     * @param {JQuery} ctn list container
     * @param {Object} o Business object
     * @param {string} rowId Row ID
     * @param {Object} p List parameters
     * @param {Object} e Mouse event
     * @param {jQuery} element The element that was right-clicked
     * @function
     */
    showContextMenu(ctn: Container, o: UIBusinessObject, rowId: string | null, p: ListParam, e: JQuery.ContextMenuEvent, element: JQuery): JQuery<HTMLElement> | undefined;
}

type NavAction = null | "add" | "new" | "del" | "none" | "first" | "prev" | "next" | "last";
type NavType = "form" | "list" | "view" | "extern" | "url" | "index" | "placemap" | "crosstab" | "agenda" | "updateAll" | "statusMetrics" | "tray" | "timesheet" | "gantt" | "dashboard" | "editTemplate" | "codeEditor" | "other";
type NavParam = {
    /** to 'add' or start a 'new' nav */
    nav?: NavAction;
    /** show or hide the navigation bar on top */
    showNav?: boolean;
};
type NavFocus = {
    element?: HTMLElement;
    id: string;
    name: string;
    cls: string;
    data: KeyObject;
};
type NavHistItem = {
    label: string;
    object?: string | BusinessObject;
    rowId?: string;
};
type NavItem = NavHistItem & {
    type: NavType;
    field?: string;
    name?: string;
    url?: string;
    view?: string;
    home?: boolean;
    index?: string;
    req?: string;
    scrollTop?: number;
    init?: KeyObject;
    container?: AnyContainer;
    params?: KeyObject;
    focus?: NavFocus;
    callback?: any;
};
/**
 * Navigation controller
 * @class
 */
declare class UINavigator {
    private container?;
    private uniqueId?;
    private _nav;
    private _preventLeave;
    private _restoreFocus;
    private _hist;
    private _timer1?;
    /**
     * Constructor
     * @param {jQuery} ctn Optional container (popup, div...)
     * @param {string} uniqueId Optional navigator Id
     */
    constructor(ctn?: Container, uniqueId?: string);
    /**
     * Navigation history
     * @function
     */
    getItems(): NavItem[];
    /**
     * Navigation element
     * @function
     */
    getItem(i: number): NavItem;
    /**
     * Root element
     * @function
     */
    getRootItem(): NavItem;
    /**
     * Current element
     * @function
     */
    getCurrentItem(): NavItem;
    /**
     * Navigation length
     * @function
     */
    length(): number;
    /**
     * Navigator Id to isolate its object instances
     * @param {string} id Optional value to set the unique id
     * @returns navigator Id
     * @function
     */
    navId(id?: string): string | undefined;
    /**
     * Navigation. Returns the current item.
     * @param action Optional <code>'new'</code>: reinit, <code>'add'</code>: push, <code>'del'</code>: pop, <code>'none' or null</code>: update last label
     * @param item Item to push in navigation <code>\{ container, type, object, rowId, params, callback, url \}</code>
     * <ul>
     * <li>container: navigate location</li>
     * <li>label: item label</li>
     * <li>object: optional business object</li>
     * <li>rowId: optional object row ID to display the form</li>
     * <li>type: optional type form, list, index, placemap, agenda, crosstab...</li>
     * <li>view: optional view</li>
     * <li>home: homepage?</li>
     * <li>params: optional parameters related to list, form...</li>
     * <li>callback: optional callback related to list, form...</li>
     * <li>url: optional specific location to load in container</li>
     * <li>index: index search</li>
     * </ul>
     * @function
     */
    nav(action?: NavAction, item?: NavItem): NavItem;
    /**
     * Returns back in navigation
     * @param n backward iterations (default 1, reload 0)
     * @param params Optional additive parameters (to display messages or to override old parameters)
     * @function
     */
    navBack(n?: number, params?: {
        msg?: MessageAny[];
        msgRow?: MessagesPerRow | null;
        rows?: RowItem[] | null;
        values?: RowItem | null;
        edit?: ListEditMode | null;
        copy?: boolean;
        deleted?: boolean;
        redirect?: string;
    }): this;
    /**
     * Navigate to item. Returns to home if unknown.
     * @param n Navigation item or index, default is the last one
     * @param params Optional additive parameters (to display messages or to override old parameters)
     * @function
     */
    navTo(n?: NavItem | null, params?: KeyObject): this;
    private itemUniqueName;
    /**
     * Reload current navigation and notify js-reload components
     * @function
     */
    reload(): this;
    /**
     * Preserve nav informations (scroll and focus)
     * @param {number} y save the scrollTop + focus of nav container
     * @function
     */
    leave(ctn: Container, y: number): this;
    /**
     * Set whether focus should be restored on navback
     * @param {boolean|"freeze"} b true to restore, false to skip, "freeze" to restore once then revert to true
     * @function
     */
    setRestoreFocus(b: boolean | "freeze" | string): this;
    /**
     * Restore nav informations (scroll and focus)
     * @function
     */
    restore(ctn: Container): this;
    /**
     * Preserve vertical scroll of current nav
     * @param {(boolean|number)} apply apply when true or save the scrollTop of nav container
     * @param {object} n Item with scrollTop property
     * @param {JQuery} ctn Container
     * @function
     */
    vscroll(apply: boolean | number, n: NavItem, ctn?: Container): this;
    /**
     * Preserve page focus.
     * If the previous focus is not found, try to focus the first visible '.js-focusable' in container
     * @param {boolean} apply true to restore focus, false to keep activeElement infos
     */
    focus(apply: boolean | number, n: NavItem, ctn: Container): this;
    /**
     * Extract only simple types parameters to be serializable in JSON and to avoid cyclic object references
     * @param params Parameters
     * @returns Simplified parameters
     */
    static parameters(params?: KeyObject): KeyObject | undefined;
    /**
     * Navigation as serializable JSON array
     * @function
     */
    toJSON(): NavItem[];
    /**
     * Navigation item as serializable JSON object
     * @function
     */
    itemToJSON(item: NavItem): NavItem;
    /**
     * Rebuild the navigation from serialized nav
     * @function
     */
    fromJSON(list: NavItem[], ctn: JQuery): void;
    /**
     * Session history
     * @function
     */
    getHistory(): NavHistItem[];
    /**
     * Load sysparam HISTORY
     * @function
     */
    loadHistory(): this;
    /**
     * Clear sysparam HISTORY
     * @function
     */
    clearHistory(cbk?: Callback): this;
    /**
     * JSON representation
     * @function
     */
    jsonHistory(): {
        object: string | undefined;
        rowId: string | undefined;
        label: string;
    }[];
    /**
     * Save sysparam HISTORY
     * @function
     */
    saveHistory(timer?: boolean): Promise<string>;
    /**
     * Add a history of opened object in main navigation
     * @function
     */
    addHistory(item: NavHistItem): this;
    /**
     * Remove an item from session history and persist the change
     * @param item History item to remove (matched by object name and rowId)
     * @function
     */
    removeHistory(item: Pick<NavHistItem, "object" | "rowId">): this;
    /**
     * Find the index of an item in session history
     * @param item History item to look up (matched by object name and rowId)
     * @returns Zero-based index, or -1 if not found
     * @function
     */
    findHistory(item: Pick<NavHistItem, "object" | "rowId">): number;
    /**
     * Push a new item onto the navigation stack, update browser history and tab options
     * @param item Navigation item to push
     */
    private navPush;
    /**
     * Handle the browser popstate event to restore navigation state
     * @param event Browser PopStateEvent carrying the previously pushed state
     */
    private navPop;
}

type GuideMetadata = {
    name: string;
    label: string;
    type: string;
    object: string;
    launcher?: JQuery;
    launch?: boolean;
    tour: {
        condition: KeyObject;
        options: KeyObject;
        steps: KeyObject[];
        styles?: KeyObject;
        scrollIntoView?: KeyObject;
        tooltip: JQuery;
        overlay?: SVGSVGElement;
        exitToast: KeyObject;
    };
    usage: (name: string, step: string) => void;
};
/**
 * Guide rendering
 * @class
 */
declare class Guide {
    private CLASS_IGNORE;
    /**
     * Helper to generate element selector
     * @function
     */
    selector(el: HTMLElement): string;
    /**
     * Helper to build a tour
     * @param onsave service to save the tour in DB
     * @function
     */
    recorder(onsave?: (p: {
        name: string;
        context: string;
        steps: KeyObject[];
    }, cbk: (id: string) => void) => void): void;
    /**
     * Simple step editor
     * @param el selected element
     * @param ok callback to confirm the new step or 'stop' recording
     * @param cbk callback on editor unload
     * @function
     */
    edit(el: JQuery, ok: (r: any) => void, cbk: JQueryHandler): void;
    /**
     * Player of guides from the target object
     * @param ctn container
     * @param list list of guides
     * @function
     */
    player(ctn: Container, list: GuideMetadata[]): void;
    /**
     * Play the guide
     * @function
     */
    play(ctn: Container, def: GuideMetadata): void;
}

type VIEW_TYPE = {
    LOGIN: "L";
    DATE: "D";
    TIME: "T";
    LOV_CODE: "C";
    SEARCH: "S";
    FILTERS: "F";
    EXTERN: "E";
    IMAGE: "I";
    GRAPH: "G";
    CROSSTAB: "X";
    LINK: "P";
    PRINTTMPL: "Z";
    INDEX: "N";
    NEWS: "W";
    SHORTCUTS: "U";
    TREEVIEW: "V";
    SUBVIEW: "B";
};
type ViewItemType = "L" | // login
"D" | // date
"T" | // time
"C" | // lov code
"S" | // search list
"F" | // filters
"E" | // extern
"I" | // image
"G" | // graph chart
"X" | // crosstab
"P" | // link
"Z" | // print template
"N" | // index search
"W" | // news
"U" | // shortcuts
"V" | // treeview
"B";
type ViewItemContentData = {
    extobject?: string;
    label?: string;
    help?: string;
    fields?: KeyObject;
};
type ViewItemContent = {
    label?: string;
    name?: string;
    src?: string;
    url?: string;
    ext?: string;
    code?: string;
    crosstab?: string;
    search?: string;
    print?: string;
    options?: KeyObject;
    meta?: KeyObject;
    data?: ViewItemContentData;
    object?: string;
    inst?: string;
    field?: string;
    spec?: string;
    filters?: KeyObject;
    vertical?: boolean;
    compact?: boolean;
    period?: boolean;
    id?: string;
    rowId?: string;
    depth?: number;
};
type ViewItem = {
    id?: string;
    pos?: number;
    type?: ViewItemType;
    collapsed?: boolean;
    title?: boolean;
    label?: string;
    content?: string | ViewItemContent;
    div?: Container;
    _tabArea?: number;
    _tabIndex?: number;
};
type ViewParam = {
    /** True on main/domain home view (to get home instance of objects) */
    home?: boolean;
    /** When view has a parent object */
    parent?: BusinessObject;
    /** false to hide the permalink button */
    useCopyLink?: boolean;
    edit?: boolean;
    /** Optional before load callback */
    beforeload?: (ctn: Container, view?: View) => void;
    /** Optional onload callback */
    onload?: (ctn: Container, view?: View) => void;
    /** Optional unload callback */
    onunload?: (ctn: Container, view?: View) => void;
} & NavParam;
/**
 * View
 * @class
 */
declare class View {
    id?: string;
    name: string;
    label: string;
    title?: boolean;
    icon?: string;
    items: ViewItem[];
    cacheable?: boolean;
    visible?: boolean;
    inline?: boolean;
    object?: BusinessObject;
    home: boolean;
    url?: string;
    item?: string;
    guides?: GuideMetadata[];
    ownerId?: string;
    ownerName?: string;
    target?: string;
    reference?: string;
    app: Session;
    ui?: KeyObject;
    uiTemplate?: string | JQuery;
    moved?: boolean;
    div?: Container;
    _tab?: number;
    /**
     * Constructor
     * @param {Session} app Ajax services
     * @param {Object} view Field metadata
     * @param {Session.BusinessObject} obj Optional related business object
     */
    constructor(app: Session, view: KeyObject, obj?: BusinessObject);
    getItem(n: number): ViewItem | undefined;
}

type JobFunction = (resolve: (value?: any) => void, reject?: (reason?: any) => void) => void;
type Job = {
    promise: Promise<KeyObject | void>;
    resolve: (result: KeyObject | void) => void;
    reject: (reason?: any) => void;
};
/**
 * Queue to synchronize executions
 * @class
 */
declare class SyncQueue {
    private queue?;
    private working;
    /** Constructor */
    constructor();
    /**
     * Await ordered functions
     * @param {Array} list Array of function(resolve, reject) to execute asynchronously
     * @param {boolean} stopOnError Stop on first error (default true)?
     * @returns Promise with ordered result array of \{ index, status:'fulfilled' or 'rejected', value or reason \}
     * @memberof Simplicite.SyncQueue
     * @function
     */
    static all(list: JobFunction[], stopOnError?: boolean): Promise<KeyObject>;
    /**
     * Ordered functions
     * @param {Array} list Array of function(resolve, reject) to execute asynchronously within Promises
     * @returns Promise with result array of \{ index, status:'fulfilled' or 'rejected', value or reason \}
     * @memberof Simplicite.SyncQueue
     * @function
     */
    static allSettled(list: JobFunction[]): Promise<KeyObject>;
    /**
     * Enqueue a Promise and starts dequeue
     * @param promise Promise
     * @memberof Simplicite.SyncQueue
     * @returns Promise
     * @function
     */
    enqueue(promise: Promise<KeyObject | void>): Promise<KeyObject | void>;
    /**
     * Ask to stop next queued jobs
     * @function
     */
    stop(): void;
    /**
     * Dequeue while not empty
     * @memberof Simplicite.SyncQueue
     * @function
     */
    dequeue(): void;
}

/**
 * Extends Simplicite.Ajax.BusinessProcess with front hooks.
 * @class
 */
declare class UIBusinessProcess extends BusinessProcess {
}

type ExternalData = {
    fields: KeyObject;
    label?: string;
    help?: string;
};
type ExternalMetadata = {
    object?: string;
    id?: string;
    name: string;
    icon?: string;
    label?: string;
    help?: string;
    url?: string;
    fields?: ObjectField[];
    embedded?: boolean;
    guides?: GuideMetadata[];
    meta?: ObjectMetadata;
};
/**
 * Simplicit&eacute; external object.
 * @class
 */
declare class ExternalObject {
    private _app;
    metadata: ExternalMetadata;
    /**
     * Constructor
     * @param {Session} app Application Simplicite.Ajax instance
     * @param {string} name External object name
     */
    constructor(app: Session, name: string);
    /**
     * Get meta data
     * @return {Promise} Promise of meta data
     * @memberof Simplicite.Ajax.ExternalObject
     * @function
     */
    getMetaData(): Promise<ExternalMetadata>;
    /**
     * Get name
     * @return {string} Name
     * @memberof Simplicite.Ajax.ExternalObject
     * @function
     */
    getName(): string;
    /**
     * Get label (is undefined as long as meta data are not loaded using <code>getMetaData</code>)
     * @return {string} Label
     * @memberof Simplicite.Ajax.ExternalObject
     * @function
     */
    getLabel(): string | undefined;
    /**
     * Get help (is undefined as long as meta data are not loaded using <code>getMetaData</code>)
     * @return {string} Help
     * @memberof Simplicite.Ajax.ExternalObject
     * @function
     */
    getHelp(): string | undefined;
    /**
     * Are metadata loaded ?
     * @memberof Simplicite.Ajax.ExternalObject
     * @function
     */
    isLoaded(): string | undefined;
}

type RenderFunction = (params?: KeyObject, data?: KeyObject) => Promise<void>;
/**
 * Extends Simplicite.Ajax.ExternalObject with front hooks.
 * @class
 */
declare class UIExternalObject extends ExternalObject {
    ctn: Container;
    container: Container;
    obj?: BusinessObject;
    rowid?: string;
    data?: ExternalData;
    /**
     * Constructor with UI context from $ui.loadURL
     * @param {jQuery} ctn external object container (.objext)
     * @param {Object} [obj] optional parent object
     * @param {string} [rowid] optional parent object rowId
     * @param {Object} [data] optional data from view item or external object
     * @param {Object}   [data.fields] optional external object fields and values
     * @param {string}   [data.label]  optional label from item label/translate
     * @param {string}   [data.help]   optional item help from item translate
     */
    constructor(ctn: Container, obj?: BusinessObject, rowid?: string, data?: ExternalData);
    /**
     * Render in container
     * @param {Object} [_params] Optional parameters
     * @param {Object} [_data] Optional data
     */
    render(_params: KeyObject, _data: KeyObject): Promise<void>;
    /**
     * Call service
     * @param {Object|string} [data] Optional data
     * @param {string|Object} [options] can be a content type string, e.g. 'application/json' (or its shorthand 'json')
     *                                  which implies the data will be sent as the body,
     *                                  otherwise may contain custom jQuery.ajax options, e.g. { contentType: '...', ... }
     */
    service(data: KeyObject | string, options: string | KeyObject): Promise<void>;
    /**
     * Get resource URL
     * @param {string} [name] Resource name
     * @param {string} [type] Resource type
     * @function
     */
    getResourceURL(name: string, type: string): string;
    /**
     * Static wrapper to exec render function asynchronously with parameters (thru the $ui.loadURL of external object)
     * @param {Object} conf wrapper config from ResponsiveExternalObject
     * @param {string}   conf.name External object name
     * @param {string}   conf.id External object ID
     * @param {Object}   conf.params render parameters
     * @param {Object}   [conf.data] optional render data
     * @param {string}   [conf.render] optional specific render method (from server-side hook getRenderFunction)
     * @param {jQuery} ctn container of external object
     * @param {Object} object optional context business object
     * @param {string} rowId optional context business row ID
     * @param {Object} options options with data.fields
     * @function
     */
    static exec(conf: {
        name: string;
        id: string;
        url: string;
        params: KeyObject;
        data?: KeyObject;
        render?: string;
    }, ctn: Container, object?: BusinessObject, rowId?: string, options?: {
        data: ExternalData;
    }): Promise<void>;
}

type DialogAction = Omit<Action, "name" | "callback"> & {
    name?: string;
    callback?: AlertCallback;
    click?: AlertCallback;
};
type DialogParam = {
    name?: string;
    title?: AnyContent;
    help?: AnyContent;
    type?: AlertType;
    content?: AnyContent;
    footer?: AnyContent;
    closeable?: boolean;
    focus?: boolean | string;
    fade?: boolean;
    modal?: boolean;
    scrollable?: boolean;
    moveable?: boolean | string;
    nav?: boolean;
    overflow?: boolean;
    width?: string | number;
    fullscreen?: boolean;
    slide?: "right" | "left" | null;
    buttonsHeader?: JQuery | DialogAction[] | null;
    buttons?: JQuery | DialogAction[] | null;
    onload?: JQueryHandler;
    beforeunload?: JQueryHandler;
    unload?: JQueryHandler;
    dontAskAgain?: (action: string) => void;
};
type Tab = {
    title?: string | JQuery;
    tooltip?: string;
    icon?: string;
    content?: AnyContent;
    hidden?: boolean;
    click?: JQueryHandler;
    hide?: JQueryHandler;
    key?: string;
    data?: KeyObject;
};
type Tabs = {
    id: string;
    tabs?: Tab[];
    selected?: number;
    position?: Position;
    vertical?: boolean;
    underline?: boolean;
    cls?: string;
    ondrag?: (li: JQuery) => void;
    ondrop?: (move: {
        li: JQuery;
        from: number;
        to: number;
    }, cbk: (confirm: boolean) => void) => void;
    overflow?: {
        show: string;
        icon?: string;
    };
};
type InputAddon = {
    name: string;
    label: string;
    icon?: string;
    plus?: boolean;
    reset?: boolean;
    edit?: boolean;
    cbk?: Callback;
    callback?: Callback;
    click?: Callback;
};
type DropdownItem = InputAddon;
type AnyAddon = Container | FieldAddon | InputAddon;
type Button = {
    id?: string;
    name?: string;
    icon?: AnyContent | null;
    label?: AnyContent;
    sr?: string | null;
    tooltip?: string;
    size?: ActionSize | null;
    level?: ActionLevel;
    style?: string;
    type?: string;
    disabled?: boolean;
    click?: JQueryHandler;
};
type AlertLevel = "help" | "info" | "success" | "warning" | "danger";
/**
 * Bootstrap V5 Tools
 * @class
 */
declare class Bootstrap5 {
    bootstrap: typeof bootstrap;
    /**
     * Load bootstrap libs
     * @function
     */
    load(cbk?: Callback): Promise<this>;
    /**
     * Home is displayed
     * @function
     */
    ready(): this;
    /**
     * Bootstrap full version (e.g. <code>5.1.3</code>)
     * @function
     */
    getVersion(): string;
    /**
     * Get UI template
     * @function
     */
    getTemplate(d?: {
        template?: string;
    }): JQuery<HTMLElement>;
    /**
     * Init a container with bootstrap elements
     * @param ctn form container
     * @function
     */
    init(ctn: Container): void;
    /**
     * Destroy bootstrap elements
     * @param ctn form container
     * @function
     */
    destroy(ctn: Container): void;
    /**
     * Simple checkbox or radio
     * @param {Object} d Options
     * @param {string} d.id Input id
     * @param {string} d.name Input name
     * @param {string} d.value Hidden value
     * @param {string|jQuery} d.label Label
     * @param {boolean} d.inline Inlined in form?
     * @param {boolean} d.disabled Disabled?
     * @param {boolean} d.readonly Readonly?
     * @param {boolean} d.checked Checked?
     * @param {function} d.change Optional handler
     * @param {string} d.type Type <code>'checkbox'</code> (default) or <code>'radio'</code>
     * @function
     */
    check(d: {
        id?: string;
        name?: string;
        value?: string;
        label?: AnyContent;
        inline?: boolean;
        disabled?: boolean;
        readonly?: boolean;
        checked?: boolean;
        change?: JQueryHandler;
        type?: "checkbox" | "radio";
    }): JQuery<HTMLElement>;
    /**
     * Simple radio
     * @param {Object} d Options
     * @param {string} d.id Input id
     * @param {string} d.name Input name
     * @param {string} d.value Hidden value
     * @param {string} d.label Label
     * @param {boolean} d.inline Inlined in form?
     * @param {boolean} d.disabled Disabled?
     * @param {boolean} d.readonly Readonly?
     * @param {boolean} d.checked Checked?
     * @param {function} d.change Optional handler
     * @param {string} d.type Forced to "radio"
     * @function
     */
    radio(d: {
        id?: string;
        name?: string;
        value?: string;
        label?: AnyContent;
        inline?: boolean;
        disabled?: boolean;
        readonly?: boolean;
        checked?: boolean;
        change?: JQueryHandler;
        type?: "radio";
    }): JQuery<HTMLElement>;
    /**
     * Toogle checked class on an array of checkboxes/radio buttons's parent element
     * @param {JQuery} elts Array of checkboxes/radio buttons
     * @function
     */
    toggleChecked(elts?: JQuery<HTMLInputElement>): void;
    /**
     * Get responsive image (.img-fluid)
     * @param {string} src Source
     * @param {function} onload optional callback
     * @param {function} onerror optional error callback
     * @function
     */
    image(src?: string, onload?: JQueryHandler, onerror?: JQueryHandler): JQuery<HTMLImageElement>;
    /**
     * Link search rendering (for N,N pillbox)
     * @function
     */
    displayLinkSearch(ctn: Container, o: BusinessObject, link: Link, filter: string | null, options?: KeyObject): "" | JQuery<HTMLElement>;
    /**
     * Dialog box
     * @param {Object} params String content or object
     * @param {string}  params.name  Optional name
     * @param {string}  params.title Optional dialog title (rich content)
     * @param {string}  params.help  Contextual help
     * @param {string}  params.type  Optional <code>error|danger|warning|info</code>
     * @param {string|jQuery} params.content Dialog body
     * @param {boolean} params.closeable True to add a close button in header
     * @param {(boolean|string)} params.focus True to focus the primary, success or first button (default true for ENTER key), or a selector element to focus
     * @param {boolean} params.fade      False to remove fade effect (default true)
     * @param {boolean} params.modal     True to disable click outside dialog and ESC keyboard button
     * @param {boolean} params.scrollable Optional scrollable body (default true)
     * @param {boolean|string} params.moveable  True to handle dialog move (handle = header), or a selector of the handle element
     * @param {boolean} params.nav       True to create a new navigation in dialog
     * @param {boolean} params.overflow  True to add scrollbars
     * @param {string}  params.width     Optional width (ex: '600px' or '80%'), forced to 100% on XS device
     * @param {boolean} params.fullscreen Optional fullscreen size
     * @param {string}  params.slide     Optional 'left|right' with swipe event
     * @param {jQuery|Array} params.buttonsHeader Optional header actions
     * @param {jQuery|Array} params.buttons       Optional footer actions [{ name, label, icon, style:'primary|secondary|success|info|danger', callback (or click), close:true|false, disabled:true|false }]
     * @param {jQuery}   params.footer       Optional footer
     * @param {function} params.onload       Optional callback when displayed
     * @param {function} params.beforeunload Optional callback when closing (use preventDefault to cancel)
     * @param {function} params.unload       Optional callback when closed
     * @param {function} params.dontAskAgain Optional 'dont't ask again' callback
     * @function
     */
    dialog(params: string | DialogParam): JQuery<HTMLElement>;
    /**
     * Find a visible dialog
     * @param {string} dlg optional dialog, name or "all", or returns the top level dialog if unset
     * @function
     */
    getDialog(dlg?: string | JQuery): JQuery;
    /**
     * Is the dialog modal (no keyboard ESC and no close button) ?
     * @param {string} dlg optional name or top level dialog if unset
     * @function
     */
    isDialogModal(dlg: string | JQuery): boolean;
    /**
     * Close the dialog box
     * @param {string|jQuery} dlg name or modal, undefined = close the top dialog if unset, "all" = close all
     * @param {function} cbk optional callback when dialog is closed
     * @function
     */
    dialogClose(dlg?: string | JQuery, cbk?: JQueryHandler): JQuery<HTMLElement>;
    /**
     * Icon button
     * @param {Object} p Optional parameters
     * @param {string} p.name Action name
     * @param {string} p.title Icon title
     * @param {string} p.icon Icon name (default <code>'star'</code>)
     * @param {function} p.click Handler on click or Enter
     * @param {boolean} p.right True to pull on right side
     * @function
     */
    spanIcon(p: {
        name?: string;
        title?: string;
        icon?: string;
        click?: JQueryHandler;
        right?: boolean;
    }): JQuery<HTMLElement>;
    /**
     * Icon button
     * @param {Object} p Optional parameters
     * @param {string} p.name Action name
     * @param {string} p.title Icon title
     * @param {string} p.icon Icon name (default <code>'star'</code>)
     * @param {function} p.click Handler on click or Enter
     * @param {boolean} p.right True to pull on right side
     * @function
     */
    buttonIcon(p: {
        name?: string;
        title?: string;
        id?: string;
        icon?: string;
        click?: JQueryHandler;
        right?: boolean;
    }): JQuery<HTMLElement>;
    /**
     * Icon button
     * @param {Object} p Optional parameters
     * @param {string} p.name Action name
     * @param {(string|$)} p.title Title as HTML tooltip
     * @param {string} p.subtitle Optional Subtitle
     * @param {string} p.placement Tooltip placement (default <code>'bottom'</code>)
     * @param {(string|$)} p.icon Icon name
     * @param {boolean}  p.disabled Icon disabled?
     * @param {string}   p.size Optional size (e.g. <code>'xs'</code>, <code>'sm'</code>, <code>'lg'</code>)
     * @param {function} p.click Handler
     * @function
     */
    actionIcon(p: {
        name?: string;
        title?: AnyContent;
        subtitle?: string | null;
        placement?: Position;
        icon?: AnyContent;
        disabled?: boolean;
        size?: string;
        click?: JQueryHandler | null;
    }): JQuery<HTMLElement>;
    /**
     * Flatten grouped menu items with dividers between groups
     * @param items Array of item groups (li)
     * @function
     */
    actionMenuItems(items: (JQuery<HTMLElement>[])[]): JQuery[];
    /**
     * Create a 'plus' button
     * @param items Array of items (li)
     * @param right Align popup to the right of button
     * @param dropUp On top?
     * @function
     */
    actionPlus(items: (JQuery<HTMLElement>[])[], right?: boolean, dropUp?: boolean): JQuery | null;
    /**
     * Create a button
     * @param {Object} p Options
     * @param {string}   p.id       Button optional id
     * @param {string}   p.name     Button name (attribute data-action and class 'btn-')
     * @param {(string|$)} p.icon   Optional icon name (e.g. <code>'fas/search'</code>) or icon
     * @param {(string|$)} p.label  Button label
     * @param {string}   p.tooltip  Optional tooltip
     * @param {string}   p.sr       Optional screen reader only
     * @param {function} p.click    Optional callback
     * @param {string}   p.size     Optional size (e.g. <code>'xs'</code>, <code>'sm'</code>, <code>'lg'</code>, <code>'icon'</code>)
     * @param {string}   p.level    Optional level (e.g. <code>'primary'</code>, <code>'secondary'</code>, <code>'plus'</code>)
     * @param {string}   p.style	Optional additional CSS class(es)
     * @param {string}   p.type     Optional type (e.g. <code>'submit'</code> default, <code>'button'</code>)
     * @param {string}   p.disabled Disabled?
     * @function
     */
    button(p: Button): JQuery;
    /**
     * Button of action
     * @param a Action <code>\{ name, label, level, primary, icon, help, showLabel, toState, custom, enabled, disabled, style, background, size \}</code>
     * @param o Business Object
     * @param rowid Optional row ID
     * @param click Handler
     * @param minified Hide label?
     * @function
     */
    actionButton(a: Action, o: UIBusinessObject, rowid?: string | null, click?: ActionHandler, minified?: boolean): JQuery<HTMLElement>;
    /**
     * Progress bar
     * @param {(string|$)} id Progress div or id
     * @param {number} p value in percent [0..100]
     * @function
     */
    progressBar(id: AnyContent, p?: number): JQuery<HTMLElement>;
    /**
     * Hack to make a drop-down inside responsive table visible
     * @function
     */
    dropdownVisible(p: JQuery, eventOpen?: string, eventClose?: string): {
        onOpen: Callback;
        onClose: Callback;
    };
    /**
     * Simple panel (implemented with card)
     * @param {Object} params Parameters <code>\{ id, title, icon, content, hidden, collapsed, onCollapsed, footer \}</code>
     * @param {string} params.id Panel ID
     * @param {string|jQuery} params.title Optional title or header
     * @param {string} params.icon Optional icon name
     * @param {string|jQuery} params.content Body
     * @param {boolean} params.hidden Hidden?
     * @param {boolean} params.collapsed Collapsed?
     * @param {function} params.onCollapsed Optional collapse handler(body, collapsed)
     * @param {string|jQuery} params.footer Optional footer
     * @function
     */
    panel(params: {
        id?: string;
        title?: AnyContent;
        icon?: string;
        content?: AnyContent;
        hidden?: boolean;
        collapsed?: boolean;
        onCollapsed?: (body: JQuery, collapsed: boolean) => void;
        footer?: AnyContent;
    }): JQuery<HTMLElement>;
    /**
     * card/panel alias
     * @function
     */
    card: (params: {
        id?: string;
        title?: AnyContent;
        icon?: string;
        content?: AnyContent;
        hidden?: boolean;
        collapsed?: boolean;
        onCollapsed?: (body: JQuery, collapsed: boolean) => void;
        footer?: AnyContent;
    }) => JQuery<HTMLElement>;
    /**
     * Manage collapsible panels as accordion
     * @param {Object} ctn Container of panels .collapse
     * @function
     */
    accordion(ctn: JQuery): JQuery<HTMLElement>;
    /**
     * Return a simple help icon with a popover or a dialog when help is too long
     * @param {string} name Button name
     * @param {string} help Text or html
     * @param {string} title Optional title of dialog
     * @param {jQuery} btn Optional button to complete
     * @function
     */
    buttonHelp(name: string, help: string, title?: string, btn?: JQuery): JQuery | undefined;
    /**
     * Simple tabs
     * @param {Object} params Parameters
     * @param {string} params.id Tab ID
     * @param {number} params.selected Selected tab index (default <code>0</code>)
     * @param {Object[]} params.tabs Tabs options <code>\{ title, tooltip, icon, content, hidden, click, key, data \}</code>
     * @param {string}  params.position Tabs position 'top' as default, 'left', 'right' or 'bottom'
     * @param {boolean} params.vertical Vertical tabs (same as position:left) ?
     * @param {boolean} params.underline Underlined tab style
     * @param {string}  params.cls Optional class to add
     * @param {function} params.ondrag Optional handler <code>function(li,cbk)</code> to allow drag
     * @param {function} params.ondrop Optional handler <code>function(\{li, from, to\ }, cbk)</code> to allow drop
     * @param {Object} params.overflow no wrap tabs, overflow hidden tabs in a dropdown, with keys:
     * `show` (bring hidden tab visible at 'first' or 'last' position, always triggers a ui.tab.click) and
     * `icon` (dropdown icon, default simple caret)
     * @function
     */
    tabs(params: Tabs): JQuery;
    /**
     * Add a tab
     * @param {jQuery} t Existing .tabs
     * @param {Tab} tab Tab options
     * @param {string|jQuery} tab.title tab title
     * @param {string|jQuery} tab.content tab content
     * @param {string}   tab.tooltip Optional tooltip
     * @param {string}   tab.icon  optional icon name
     * @param {boolean}  tab.hidden is the tab hidden?
     * @param {function} tab.hide optional handler on bootstrap hide event 'hide.bs.tab'
     * @param {function} tab.click optional handler when tab is shown on bootstrap event 'shown.bs.tab'
     * @param {string}   tab.key optional anchor DOM property 'data-key'
     * @param {Object}   tab.data optional jQuery 'data' to add to anchor
     * @param {boolean} active Activate this tab?
     * @returns tab = li.nav-item + tab-pane
     * @function
     */
    addTab(t: JQuery, tab: Tab, active?: boolean): {
        tab: JQuery<HTMLElement>;
        tabpane: JQuery<HTMLElement>;
    };
    /**
     * Set a tab content
     * @param {jQuery} t Tabs
     * @param {number|string} index Tab index or tab data-key
     * @param {string} content HTML content
     * @function
     */
    setTabContent(t: JQuery, index: number | string, content: AnyContent): void;
    /**
     * Get a tab container
     * @param {jQuery} t Tabs
     * @param {number|string} index Tab index or tab data-key
     * @function
     */
    getTabPane(t: JQuery, index: number | string): JQuery<HTMLElement>;
    /**
     * Get the active tab anchor with data
     * @param {jQuery} t Tabs
     * @function
     */
    getTabActive(t: JQuery): JQuery<HTMLElement>;
    /**
     * Set the active tab anchor
     * @param {jQuery} t Tabs
     * @param {number|string} index Tab index or tab data-key
     * @function
     */
    setTabActive(t: JQuery, index: number | string): void;
    /**
     * Get the tab anchors with data
     * @param {jQuery} t Tabs
     * @param {string} s Optional anchor selector
     * @function
     */
    getTabs(t: JQuery, s?: string): JQuery<HTMLElement>;
    /**
     * Is the tabs empty?
     * @param {jQuery} t Tabs
     * @param {string} s Optional anchor selector
     * @function
     */
    isEmptyTabs(t: JQuery, s?: string): boolean;
    /**
     * Remove a tab
     * @param {jQuery} t Tabs
     * @param {number|string} index Tab index or tab data-key
     * @param {boolean} prev Click on previous (or next) tab if exists
     * @function
     */
    removeTab(t: JQuery, index: number | string, prev?: boolean): void;
    /**
     * Show/Hide empty tabs and ensure to activate a non-empty tab
     * @param {jQuery} t Tabs
     * @param {function} fn Optional function to test if a tab is visible
     * @param {string} cls Class 'hidden' or 'empty' to hide the tab
     * @return True if the tabs is visible = contains something visible
     * @function
     */
    showTabs(t: JQuery, fn?: (tabPane: JQuery) => boolean, cls?: string): boolean;
    /**
     * Show/hide a tab in a tabs and ensure to activate a visible tab
     * @param {jQuery} t Tabs
     * @param {string} id Tab ID
     * @param {boolean} show False to hide the tab
     * @function
     */
    showTab(t: JQuery, id: string, show?: boolean): void;
    /**
     * Focus one element and active/expand tabs/collapsed parents
     * @param {jQuery} el Element to focus
     * @function
     */
    focus(el: JQuery): void;
    /**
     * Add/Replace a badge counter to tab
     * @param tab Tab href or any tab content element
     * @param val Badge value (no badge if null)
     * @function
     */
    tabBadge(tab: JQuery, val: number | string | null): JQuery<HTMLElement> | null;
    /**
     * Simple alert content
     * @param html HTML content
     * @param level Optional <code>help|info|success|warning|danger</code>
     * @function
     */
    alert(html: AnyContent, level?: AlertLevel): JQuery<HTMLElement>;
    /**
     * Simple help
     * @param h Content as safe HTML (any script is ignored)
     * @function
     */
    help(h: AnyContent): JQuery<HTMLElement>;
    /**
     * Simple info
     * @param h Content
     * @function
     */
    success(h: AnyContent): JQuery<HTMLElement>;
    /**
     * Simple info
     * @param h Content
     * @function
     */
    info: (h: AnyContent) => JQuery<HTMLElement>;
    /**
     * Simple warning
     * @param h Content
     * @function
     */
    warning(h: AnyContent): JQuery<HTMLElement>;
    /**
     * Simple error
     * @param h Content
     * @function
     */
    danger(h: AnyContent): JQuery<HTMLElement>;
    /**
     * Simple error
     * @param h Content
     * @function
     */
    error: (h: AnyContent) => JQuery<HTMLElement>;
    /**
     * Inlined message alert
     * @param m String or <code>\{ level, label \}</code>
     * @function
     */
    message(m: MessageAny): JQuery;
    /**
     * Create a dropdown button
     * @param elt Optional left side of button
     * @param btn The button to convert to dropdown
     * @param items List of elements <code>$</code>
     * 				or items <code>\{ name, label, icon, cbk|callback|click, and custom data... \}</code> stored in anchor in <code>data('item')</code>
     * @param right Align popup on right side of button
     * @param dropUp True to drop on the top of button
     * @param caret Display a caret on the right side of button?
     * @param autoclose true(default) | inside | outside | false
     * @function
     */
    dropdown(elt: JQuery | null, btn: JQuery, items?: null | AnyAddon[], right?: boolean, dropUp?: boolean, caret?: boolean, autoclose?: boolean | string): JQuery<HTMLElement>;
    /**
     * Create a dropdown button with a non-list (div) popup container.
     * Like dropdown(), but for content that isn't a set of menu items
     * (e.g. a fieldset of checkboxes, arbitrary form content).
     * @param elt Optional left side of button
     * @param btn The button to convert to dropdown
     * @param content Popup content (appended as-is into a div.dropdown-menu)
     * @param right Align popup on right side of button
     * @param dropUp True to drop on the top of button
     * @param caret Display a caret on the right side of button?
     * @param autoclose true(default) | inside | outside | false
     * @function
     */
    dropdownDiv(elt: JQuery | null, btn: JQuery, content: AnyContent | JQuery[], right?: boolean, dropUp?: boolean, caret?: boolean, autoclose?: boolean | string): JQuery<HTMLElement>;
    /**
     * Create a dropup button
     * @param elt Optional left side of button
     * @param btn Toggle button
     * @param items List of <code>$</code> or action <code>\{ name, label, icon, cbk \}</code>
     * @param right Align popup on right side of button
     * @function
     */
    dropup(elt: JQuery | null, btn: JQuery, items?: null | (Container | DropdownItem)[], right?: boolean): JQuery<HTMLElement>;
    /**
     * Create an input group with prefix and addons actions
     * @param {jQuery} inp Input element
     * @param {Array} addons Optional array of <code>$</code> or actions <code>\{ name, label, icon, plus, cbk \}</code>
     * @param {string|jQuery} prefix Optional prefix
     * @function
     */
    inputGroup(inp: JQuery, addons?: AnyAddon[] | null, prefix?: string | JQuery): JQuery;
    /**
     * Form group of input
     * @param {string} name Group name
     * @param {(string|jQuery)} label Optional label
     * @param {(string|jQuery)} inp Input group
     * @param {Object} msg Optional backend message
     * @param {function} suggestCallback a suggestion callback, sets new value, returns old value
     * @function
     */
    formGroup(name: string, label: AnyContent | null, inp: AnyContent, msg?: MessageJSON, suggestCallback?: (v: string) => string): JQuery;
    /**
     * Form group for search form
     * @param cls Class
     * @param label Text
     * @param inp Input
     * @function
     */
    formGroupSearch(cls: string, label: string, inp?: JQuery | string): JQuery;
    /**
     * Simple form group with boolean, select or text field
     * @param id input id
     * @param label field label
     * @param val field value
     * @param arg true for boolean, array of code/value, 'textarea'
     * @param col optional size from 1 to 12
     * @param addon optional addon
     * @param disabled false to disable input
     * @param multi true for enum multi
     * @function
     */
    simpleFormGroup(id: string, label?: string, val?: string | number | boolean | string[] | null, arg?: true | string | EnumItem[] | 'textarea' | 'div' | null, col?: number, addon?: string | JQuery | null, disabled?: boolean | null, multi?: boolean): JQuery;
    /**
     * Input with attributes
     * @param a Object with attributes
     * @function
     */
    input(a?: KeyObject): JQuery;
    /**
     * Select with options
     * @param a Object with attributes
     * @param o Array of <code>\{ value, label, data \}</code>
     * @function
     */
    select(a?: KeyObject, o?: {
        value: string;
        label: string;
        data: KeyObject;
    }[]): JQuery;
    /**
     * Create a row with columns
     * @param cols Array of columns
     * @function
     */
    row(cols?: AnyContent[]): JQuery;
    /**
     * Simple column
     * @param {string} size Media-width: short syntax 'md-5' or long syntax 'col-lg-4 col-md-8', default 'col-12', 'xs-' is supported
     * @param {(string|jQuery|jQuery[])} content Optional content or array of contents
     * @function
     */
    col(size?: string, content?: string | JQuery | JQuery[]): JQuery;
    /**
     * Simple form
     * @param p Parameters <code>\{ name, inline, content, autocomplete, onsubmit \}</code>
     * @function
     */
    form(p: {
        name?: string;
        inline?: boolean;
        content?: AnyContent;
        autocomplete?: string;
        onsubmit?: string;
    }): JQuery;
    /**
     * Add a tooltip to element
     * @param e Element
     * @param title Text or html
     * @param placement Optional, default 'bottom'
     * @param html HTML Title?
     * @function
     */
    tooltip(e: JQuery, title: AnyContent, placement?: Position, html?: boolean): JQuery<HTMLElement>;
    /**
     * Init all tooltips and popovers
     * @param ctn optional container
     * @function
     */
    initTooltips(ctn?: AnyContainer): this;
    /**
     * Hide all (remaining) tooltips and popovers
     * @param ctn optional container
     * @function
     */
    hideTooltips(ctn?: AnyContainer): this;
}

/**
 * Workflow controller
 * @param {Simplicite.UI.Engine} ui Main UI controller
 * @class
 */
declare class Workflow {
    readonly bpmActivityObject = "BPMActivityFile";
    readonly bpmActivityInst = "list_ajax_BPMActivityFile";
    getUIProcess(process: string | BusinessProcess, cbk?: (wkf: BusinessProcess) => void): this;
    display(ctn: Container, process: string | BusinessProcess | null, action?: ProcessActionType, options?: ProcessParam, cbk?: Callback): this;
    /** Service call */
    service(ctn: Container, wkf: BusinessProcess, action: ProcessActionType, onSuccess: (act?: ActivityFile) => void, onError: (reason: MessageFromBack) => void, params?: {
        road?: boolean;
        object?: string;
        rowId?: string;
        step?: string;
    }): void;
    /** Success : dispatch response */
    success(ctn: Container, wkf: BusinessProcess, resp?: ActivityFile, p?: KeyObject, cbk?: Callback): void;
    /** Error : return to activity with messages */
    error(ctn: Container, wkf: BusinessProcess, err: MessageFromBack, p?: KeyObject, cbk?: Callback): void;
    /** Activities list filtered on process name and step */
    displayList(ctn: Container, wkf: BusinessProcess, options?: KeyObject | null, cbk?: Callback): this;
    /**
     * Display the activity
     * @param ctn Container
     * @param wkf Business process instance
     * @param activity Current activity with metadata
     * @param options Options
     * <ul>
     * <li>showRoad: displays the workflow navbar, default true</li>
     * <li>msg: back-end messages to display</li>
     * <li>workflow: true</li>
     * </ul>
     * @param cbk Optional callback
     */
    displayActivity(ctn: Container, wkf: BusinessProcess, activity: ActivityFile | null, options?: KeyObject, cbk?: (wkf: BusinessProcess, act?: ActivityFile, p?: KeyObject) => void): Promise<this | undefined>;
}

type Agenda = {
    id: string;
    name: string;
    enabled: boolean;
    editable?: boolean;
    display?: string;
    firstDay?: number;
    hiddenDays?: number[];
    workingDays?: number[];
    startTime?: string;
    endTime?: string;
    date: string;
    duration?: string;
    endDate?: string;
    height?: number;
    minTime?: string;
    maxTime?: string;
    slot?: string;
    snap?: string;
    labels?: string[];
    user?: string;
    userField?: string;
    group?: string;
    groupField?: string;
};
type CalendarParam = {
    login?: string;
    group?: string;
    date?: Date;
    locale?: string;
    editable?: (obj: BusinessObject, item: KeyObject) => boolean;
    click?: (arg: EventClickArg) => void;
    select?: (arg: DateSelectArg) => void;
    drop?: (arg: EventDropArg) => void;
    resize?: (arg: EventResizeDoneArg) => void;
    render?: (arg: DateSelectArg) => void;
    title?: (obj: BusinessObject, item: KeyObject) => string;
    column?: (date: string) => void;
    color?: (obj: BusinessObject, item: KeyObject) => void;
    borderColor?: (obj: BusinessObject, item: KeyObject) => void;
    textColor?: (obj: BusinessObject, item: KeyObject) => void;
    classNames?: (obj: BusinessObject, item: KeyObject) => void;
    beforeload?: (ctn: Container, obj: UIBusinessObject, agd: object, p: KeyObject) => void;
    onload?: (ctn: Container, obj: UIBusinessObject, agd: object, p: KeyObject) => void;
    onunload?: (ctn: Container, obj: UIBusinessObject, agd: object, p: KeyObject) => void;
    minTime?: string;
    maxTime?: string;
    slot?: string;
    snap?: string;
    workingDays?: number[];
    startTime?: string;
    endTime?: string;
    height?: number;
};
/**
 * Calendar controller (based on FullCalendar V5)
 * @param {Object} options <code>\{ locale, version \}</code>
 * @class
 */
declare class UICalendar {
    readonly dateFormat = "YYYY-MM-DD HH:mm:ss";
    currentDate: {
        [key: string]: Date;
    };
    currentFilter: {
        [key: string]: string;
    };
    cal?: Calendar;
    options: KeyObject;
    constructor(options: {
        locale?: string;
        version?: number;
    });
    /**
     * Set date
     * @function
     */
    setDate(name: string, date?: Date): void;
    /**
     * Get date
     * @function
     */
    getDate(name: string): Date;
    /**
     * Get filter (user or group field)
     * @function
     */
    setFilter(name: string, filter?: string): void;
    /**
     * Get filter (user or group field)
     * @function
     */
    getFilter(name: string): string;
    /**
     * Generate a light color
     * @function
     */
    hsl(text: string): string;
    /**
     * Display calendar
     * @param {jquery} ctn Container
     * @param {Simplicite.UI.BusinessObject} obj Business object
     * @param {Object} agd Agenda definition
     * @param {Object} params options
     * @param {string}   params.login       optional login filter
     * @param {string}   params.group       optional group filter
     * @param {string}   params.date        current date to show
     * @param {boolean}  params.editable    editable?
     * @param {string}   params.locale      use locale (ex 'fr', 'es')
     * @param {function} params.click       click handler (default open the update form)
     * @param {function} params.select      select date handler (default open the create form)
     * @param {function} params.drop        drop event handler (default update the event start date)
     * @param {function} params.resize      resize event handler (default update the event duration)
     * @param {function} params.title       handler(obj,item) of event title (default based on label fields)
     * @param {function} params.column      handler(date) to override column header (HTML)
     * @param {function} params.color       handler(obj,item) for event background (default grey or hash of selected login|group)
     * @param {function} params.borderColor handler(obj,item) for border color
     * @param {function} params.textColor   handler(obj,item) for text color
     * @param {function} params.classNames  handler(obj,item) to get an array of CSS classes
     * @param {function} params.render      handler to override the render the event
     * @param {string}   params.minTime     default "00:00:00"
     * @param {string}   params.maxTime     default "24:00:00"
     * @param {string}   params.slot        default "00:30:00"
     * @param {string}   params.snap        default "00:05:00"
     * @param {Array}    params.workingDays default [1,2,3,4,5] = monday to friday
     * @param {string}   params.startTime   default "09:00" for business hours
     * @param {string}   params.endTime     default "18:00" for business hours
     * @param {number}   params.height      default 800
     * @param {function} cbk Optional callback
     * @function
     */
    display(ctn: AnyContainer, obj: BusinessObject, agd: Agenda, params?: CalendarParam, cbk?: Callback): Promise<void>;
}

type Place = {
    coord: string;
    label1?: string;
    label2?: string;
    label3?: string;
    address?: string;
};
type Placemap = {
    id: string;
    name: string;
    places: Place[];
    label1?: string;
    label2?: string;
    label3?: string;
    address?: string;
};
type MapSettings = {
    tileLayer: string;
    lat?: number;
    lng?: number;
    zoom?: number;
    attribution?: string;
    maxZoom?: number;
};
/**
 * Place Map renderer
 * @class
 */
declare class UIMap {
    options: MapSettings;
    map?: L.Map;
    map_markers?: L.Marker[];
    /**
     * @param {Object} options Options <code>\{ tileLayer, attribution, maxZoom, lat, lng, zoom \}</code>
     */
    constructor(options: MapSettings);
    getLatLong(coord: string): LatLngTuple;
    /**
     * Init a map in the container
     * @param {jQuery|string} ctn Container
     * @param {Object} [pm] Placemap definition
     * @function
     */
    display(ctn: AnyContainer, pm?: Placemap): string | false | undefined;
    hasBounds(): boolean;
    getLatLngBounds(): L.LatLngBounds | undefined;
    /**
     * Add a marker on map
     * @param {Object} params Parameters
     * @param {String} params.coord coma-separated coordinates
     * @param {function} params.onMove callback function when user moves marker
     * @function
     */
    addSelector(params: {
        coord: string;
        onMove?: (lat: string, lng: string) => void;
    }): boolean;
    /**
     * Add a marker on map
     * @param {Object} params Parameters <code>\{ coord, info, center \}</code>
     * @param {String} params.coord coma-separated coordinates
     * @param {Object} params.info jquery element to show in popup
     * @function
     */
    addMarker(params: {
        coord: string;
        info?: JQuery;
    }): boolean;
    /**
     * Build the marker info
     * @function
     */
    getMarkerInfo(o: BusinessObject, pm: Placemap, place: Place, onOpen: (id: string) => void): JQuery<HTMLElement>;
}

/**
 * Firebase controller
 * @class
 */
declare class Firebase {
    worker: string;
    messaging?: KeyObject;
    constructor();
    /**
     * Firebase service wrapper
     * @param {Object} data service data
     * @param {Object} data.config to init plugin (see FIREBASE_CONFIG)
     * @param {string} data.vapidKey needed for firebase authent
     * @param {string} data.token to refresh the device token of user
     * @param {string} data.body incoming message from app
     * @param {string} data.title optional title
     * @param {string} data.priority optional priority 'high' | 'normal' | 'low'
     * @param {string} data.icon optional icon
     * @param {string} data.message to send a message
     * @param {Object} data.to message recipients {users, groups} or 'all'
     * @param {Object} data.to.users optional array of logins
     * @param {Object} data.to.groups optional array of groups
     * @function
     */
    service(data: KeyObject): void;
    /**
     * Init firebase connection
     * @param {Object} data.config to init plugin (see FIREBASE_CONFIG)
     * @param {string} data.vapidKey needed for firebase authent
     * @function
     */
    init(config: KeyObject, vapidKey: string): this | undefined;
    /**
     * Display a message
     * @param {Object} m message or notification
     * @param {string} m.notification optional embedded message
     * @param {string} m.body message body
     * @param {string} m.title optional title
     * @param {string} m.priority optional priority 'high' | 'normal' | 'low'
     * @param {Object} m.data optional pairs of key-value
     * @param {string} m.data.object optional object name
     * @param {string} m.data.rowId optional object rowId
     * @function
     */
    showMessage(m: KeyObject): void;
    /**
     * Refresh a device token on server-side
     * @param {string} token new token for the user
     * @function
     */
    refreshToken(token: string): void;
    /**
     * Request user permission to be notified
     * @function
     */
    requestPermission(): void;
}

type HSV = {
    h: number;
    s: number;
    v: number;
};
type RGB = {
    r: number;
    g: number;
    b: number;
};
type RGBA = RGB & {
    a?: number;
};
type OKLAB = {
    L: number;
    a: number;
    b: number;
};
type Contrast = {
    bgcolor: RGBA;
    color: RGBA;
    ratio: number;
    error?: string;
};
type CSSColors = {
    name: string;
    list: KeyString[];
};
declare const CSSCOLORS: CSSColors[];
/**
 * Color helpers
 * @class
 */
declare class UIColor {
    /** Type of colors */
    static readonly TYPES: string[];
    /** minimal WCAG level AAA is 4.5 */
    static readonly MIN_CONTRAST = 4.5;
    /** legacy regex for 'rgb(123, 123, 123)' or 'rgba(123, 123, 123, 0.33)'*/
    static readonly rgbaRegex: RegExp;
    /** legacy regex for 'rgb(123, 123, 123)' */
    static readonly rgbRegex: RegExp;
    /** regex for 'rgb(123 123 123)' or 'rgb(123 123 123 / 0.5)' */
    static readonly rgbRegex2: RegExp;
    /** regex for '#RRGGBB' or '#rrggbb' */
    static readonly hexRegex: RegExp;
    /** regex for 'color(srgb 0.17 0.13 0.28 / 0.5)' */
    static readonly srgbRegex: RegExp;
    /** oklab(0.28 -0.07 -0.03 / 0.5) */
    static readonly oklabRegex: RegExp;
    /**
     * Convert color string to #rrggbb
     * @param {string} rgb color
     * @return A color <code>#RRGGBB</code>
     * @function
     */
    rgb2hex(rgb: string): string;
    /**
     * Convert string color to object
     * @param {string} color css color
     * @param {number} alpha optioanl alpha (transparency 0..1)
     * @return object <code>\{r,g,b,a\}</code>
     * @function
     */
    css2rgb(color: string, alpha?: number): RGBA;
    /**
     * Convert color to hexa format
     * @param {RGBA} rgb Color
     * @return Color <code>#RRGGBB</code> or <code>#RRGGBBAA</code>
     * @function
     */
    rgb2css(rgb?: RGBA | null): string;
    /**
     * Convert <code>#RRGGBB</code> to string
     * @param {string} color Color <code>#RRGGBB</code>
     * @param {number} alpha Alpha (transparency)
     * @return string <code>'rgba(r,g,b,a)'</code>
     * @function
     */
    css2rgba(color: string, alpha?: number): string;
    /**
     * Convert <code>\{r,g,b\}</code> to <code>\{h,s,v\}</code>
     * @param {Object} color Color <code>\{r,g,b\}</code>
     * @return {Object} Color <code>\{h,s,v\}</code>
     * @function
     */
    rgb2hsv(color: RGB): HSV;
    /**
     * Convert <code>\{h,s,v\}</code> to <code>\{r,g,b\}</code>
     * @param {Object} hsv Color <code>\{h,s,v\}</code>
     * @return {Object} Color <code>\{r,g,b\}</code>
     * @function
     */
    hsv2rgb(hsv: HSV): RGB;
    /**
     * Calculate the color luminance 0..1
     * @param {(string|Object)} c #RRGGBB or <code>\{r,g,b\}</code>
     * @return {number} luminance
     * @function
     */
    luminance(c: string | RGB): number;
    /**
     * Calculate the contrast ratio between 2 colors
     * @param {(string|Object)} c1 #RRGGBB or <code>\{r,g,b\}</code>
     * @param {(string|Object)} c2 #RRGGBB or <code>\{r,g,b\}</code>
     * @return {number} minimal ratio recommanded by WCAG is 4.5 (or 3 for larger font-sizes)
     * @function
     */
    contrast(c1: string | RGB, c2: string | RGB): number;
    getComputedColors(el: HTMLElement): Partial<Contrast>;
    elementContrast(el: HTMLElement, minRatio?: number): Contrast | undefined;
    contrastedColor(color: string): "black" | "white";
    /**
     * Convert a color to RGB object
     * @param {string} color supported spaces: #RRGGBB, rgb(), color(srgb r g b / x), oklab(L a b / x)
     */
    static convertToRGB(color: string): RGBA | undefined;
    static gamma2Linear(c: number): number;
    static linear2Gamma(c: number): number;
    static sRGB2oklab(color: RGB, linear?: boolean): OKLAB;
    static clamp(value: number, min?: number, max?: number): number;
    static oklab2RGB(oklab: OKLAB, linear?: boolean): RGB;
    static sRGB2RGB(rgb: RGB, linear?: boolean): RGB;
}

type CrosstabAxisType = "C" | "L" | "V";
type CrosstabAxis = {
    field: string;
    name: string;
    label: string;
    order: number;
    caption?: string;
    method: string;
    type: CrosstabAxisType;
    formula?: string;
    dateGroup?: string;
    yaxis?: number;
    hidden?: boolean;
    chart?: string;
    palette?: string;
    f?: ObjectField;
};
type CrosstabMetadata = {
    id: string;
    name: string;
    label: string;
    method?: string;
    methods: EnumItem[];
    dateGroups: EnumItem[];
    subcolor?: string;
    control?: boolean;
    subtotal?: boolean;
    caption?: string;
    precision?: number;
    editable?: boolean;
    chart?: string;
    width?: string;
    height?: string;
    palette?: string;
    columns?: CrosstabAxis[];
    lines?: CrosstabAxis[];
    values?: CrosstabAxis[];
};
type CrosstabParam = {
    zcaption?: string;
    ztable?: boolean;
    ztree?: true;
    zstotal?: boolean;
    zstcolor?: string | null;
    zaxis?: KeyObject[];
    zfilters?: KeyObject;
    zpalette?: string;
    zgraph?: string;
    [key: `zgraph_${string}`]: string;
    zwidth?: string;
    zheight?: string;
    zcontrol?: boolean;
    controlTab?: number;
    search?: (filters: KeyObject) => void;
    apply?: (obj: BusinessObject, ct: CrosstabMetadata, p: CrosstabParam) => void;
    exportData?: (media: string) => void;
    reload?: Callback;
    error?: Callback;
};
type CrosstabNavParam = NavParam & {
    /** Optional instance name */
    inst?: string;
    /** Optional filters to apply */
    filters?: KeyObject;
    /** Optional crosstab options */
    options?: CrosstabParam;
    search?: (filters: KeyObject) => void;
    apply?: (obj: BusinessObject, ct: CrosstabMetadata, p: CrosstabParam) => void;
    exportData?: (media: string) => void;
    reload?: Callback;
    error?: Callback;
};
type CrosstabData = {
    columns: CrosstabNode[];
    lines: CrosstabNode;
};
type CrosstabNode = {
    index: number;
    path: string;
    name: string;
    color?: string;
    bgcolor?: string;
    bgcolors?: (string | null)[];
    values?: any;
    labels?: string[];
    ids?: string[];
    children?: CrosstabNode[];
};
/**
 * Crosstab rendering
 * @class
 */
declare class Crosstab {
    private controlTab;
    /**
     * Display the cross tab
     * @param {jQuery} ctn Container
     * @param {Simplicite.UI.BusinessObject} obj Object
     * @param {Object} ct Crosstab definition
     * @param {Object} data Crosstab data
     * @param {Object} p options { zstotal, zstcolor, zcaption, ztable, zgraph... }
     * @function
     */
    display(ctn: Container, obj: BusinessObject, ct: CrosstabMetadata, data: CrosstabData, p: CrosstabParam, cbk?: Callback): this;
    private axisDragDrop;
}

/**
 * ChartJS controller
 * @class
 */
declare class Charts {
    constructor();
    /**
     * Current palette name
     * @member
     */
    PALETTE: string;
    /**
     * Predefined palettes <code>\{ name:[colors] \}</code>.
     * @constant
     */
    PALETTES: {
        [key: string]: string[];
    };
    BRIGHT_COLOR?: string;
    DARK_COLOR?: string;
    /**
     * Current palette of colors <br />
     * default: <code>app.sysparams.CHART_PALETTE</code> or 'Sea'
     * @member
     */
    COLORS: string[];
    readonly SIZES: (string | number)[][];
    /**
     * Indexed color in palette
     * @param {number} i Index
     * @return color (<code>#RRGGBB</code>)
     * @function
     */
    getColor(i: number): string;
    /**
     * All palette colors
     * @return array of colors (<code>#RRGGBB</code>)
     * @function
     */
    getColors(): string[];
    /**
     * Current palette
     * @return palette = list of colors
     * @function
     */
    getPalette(): string;
    /**
     * Change the current palette
     * @param {string} name Palette name ('Sea', 'Base'...)
     * @function
     */
    setPalette(name: string): void;
    /**
     * Chart JS
     * @param {Container} ctn Container
     * @param {ChartConfiguration} config From chart.js v3 config with options
     * @param {function} click Optional handler <code>function(chart, clickElements, dataset, elementIndex, datasetIndex)</code>
     * @function
     */
    chart(ctn: Container, config: ChartConfiguration, click?: (chart: Chart, clickElements: InteractionItem[], dataset: InteractionItem[], elementIndex: number, datasetIndex: number) => void): Chart | undefined;
    /**
     * Add a title and legend
     * @param {Object} config Chart config
     * @param {Object} title display+text
     * @param {Object} legend display+position
     * @function
     */
    addTitle(config: ChartConfiguration, title: TitleOptions, legend: TitleOptions): void;
    /**
     * Set Stacked option
     * @param {Object} config Chart config
     * @param {boolean} stacked true to stack axis
     * @function
     */
    stacked(config: ChartConfiguration, stacked: boolean): void;
    /**
     * Set the background color of chart
     * @param {Object} config Chart config
     * @param {string} color background color of canvas
     * @function
     */
    backgroundColor(config: ChartConfiguration, color: string): void;
    /**
     * Status count in a PIE
     * @param {jQuery} ctn Container
     * @param {Object} data Pie data
     * @param {Object} p Optional chart.js options
     * @function
     */
    chartStatusPie(ctn: Container, data: KeyObject, p: KeyObject): void;
    /**
     * Status count in a chart line per date
     * @param {jQuery} ctn Container
     * @param {Object} data Line data
     * @param {Object} p Optional chart.js options
     * @function
     */
    chartStatusCount(ctn: Container, data: KeyObject, p: KeyObject): void;
    /**
     * Status duration in a polar/radar/bar charts
     * @param {jQuery} ctn Container
     * @param {Object} d Duration data
     * @param {Object} p Optional chart.js options
     * @function
     */
    chartStatusDuration(ctn: Container, d: KeyObject, p: KeyObject): void;
    /**
     * Asysnc queue chart
     * @param {jQuery} ctn Container
     * @param {Object} hist History data
     * @param {Object} p Options width ans height
     * @function
     */
    chartQueueHistory(ctn: Container, hist: KeyObject, p: KeyObject): void;
    /**
     * Process duration in a bar chart
     * @param {jQuery} ctn Container
     * @param {Object} data Duration data
     * @param {Object} p Optional chart.js options
     * @function
     */
    chartStatusTerminal(ctn: Container, data: KeyObject, p: KeyObject): void;
    /**
     * Chart for crosstab
     * @function
     */
    chartCrosstab(ctn: Container, ct: CrosstabMetadata, data: KeyObject, p?: KeyObject): void;
    /**
     * Format octets size to Kb/Mb/Gb/Tb
     * @param {number} size Size
     * @function
     */
    size(size: string): string | undefined;
    /**
     * Heap chart of browser memory (LOG_UI=yes)
     * @param {jQuery} ctn Container
     * @param {Object} data Lines data <code>[\{d,u,t\},...]</code>
     * @param {Object} p Optional chart.js options
     * @function
     */
    chartHeapSize(ctn: Container, data: KeyObject, p: KeyObject): Chart | undefined;
    /**
     * Steps of front service (LOG_UI=yes)
     * @function
     */
    chartServiceSteps(ctn: Container, data: KeyObject[], p: KeyObject): Chart | undefined;
    /**
     * Times of front service (LOG_UI=yes)
     * @function
     */
    chartServiceTimes(ctn: Container, data: KeyObject, p: KeyObject): Chart | undefined;
    /**
     * Get the brightest color in the current palette
     * @param {boolean} darkest True to get the darkest one
     * @return A color <code>#RRGGBB</code>
     * @function
     */
    getBrightColor(darkest?: boolean): string;
    /**
     * Get the lighten or darken color
     * @param {string} color <code>#RRGGBB</code>
     * @param {number} val -255..255
     * @return A color <code>#RRGGBB</code>
     * @function
     */
    lightenDarkenColor(color: string, val: number): string;
    /**
     * Convert <code>#RRGGBB</code> to object <code>\{r,g,b,a\}</code>
     * @param {string} color Color <code>#RRGGBB</code>
     * @param {number} alpha Alpha (transparency)
     * @return object <code>\{r,g,b,a\}</code>
     * @function
     */
    css2rgb(color: string, alpha?: number): RGBA;
    /**
     * Convert object <code>\{r,g,b\}</code> to <code>#RRGGBB</code>
     * @param {Object} rgb Color <code>\{r,g,b\}</code>
     * @return Color <code>#RRGGBB</code>
     * @function
     */
    rgb2css(rgb: RGB): string;
    /**
     * Convert <code>#RRGGBB</code> to string
     * @param {string} color Color <code>#RRGGBB</code>
     * @param {number} alpha Alpha (transparency)
     * @return string <code>'rgba(r,g,b,a)'</code>
     * @function
     */
    css2rgba(color: string, alpha?: number): string;
    /**
     * Convert <code>\{r,g,b\}</code> to <code>\{h,s,v\}</code>
     * @param {Object} color Color <code>\{r,g,b\}</code>
     * @return {Object} Color <code>\{h,s,v\}</code>
     * @function
     */
    rgb2hsv(color: RGB): HSV;
    /**
     * Convert <code>\{h,s,v\}</code> to <code>\{r,g,b\}</code>
     * @param {Object} hsv Color <code>\{h,s,v\}</code>
     * @return {Object} Color <code>\{r,g,b\}</code>
     * @function
     */
    hsv2rgb(hsv: HSV): RGB;
}

/**
 * WebPush controller
 * @class
 */
declare class WebPush {
    worker: string;
    constructor();
    /** WebPush service */
    service(data: KeyObject): void;
    /** Init webpush connection */
    init(data: KeyObject): this;
    /** request permission to use WebPush API */
    requestPermission(reg: KeyObject, data: KeyObject): void;
    private check;
    private urlB64ToUint8Array;
}

/**
 * OCR tools (using the Tesseract.js lib) **EXPERIMENTAL**
 * @class
 */
declare class OCR {
    readonly tessurl: string;
    doOCR(img: any, lang: string): Promise<any>;
}

/**
 * Web Speech API
 * @class
 */
declare class Speech {
    CMD: KeyObject;
    SpeechRecognition: any;
    voice?: KeyObject;
    readonly VOICES: KeyObject;
    constructor();
    /**
     * Get language ISO
     * @param {string} l language FRA, ENU...
     * @return ISO code (ex fr-FR)
     * @function
     */
    langISO(l: string): string;
    /**
     * New SpeechRecognition if exists
     * @function
     */
    createSpeechRecognition(): any;
    /**
     * Speech recognition
     * @param {Object} el Element input or textarea
     * @param {Object} options Options
     * @param {string}   options.lang Language (ex: FRA, ENU or fr-FR, en-GB...)
     * @param {boolean}  options.continuous   Continuous speaking (sentence)?
     * @param {boolean}  options.autoRestart  Continuous speaking (no timeout after long silence)?
     * @param {boolean}  options.interimResults Get interim results?
     * @param {number}   options.maxAlternatives Max alternatives search
     * @param {boolean}  options.firstCapital First character uppercase in a sentence?
     * @param {boolean}  options.newLine  Accept new line symbol?
     * @param {function} options.onStart  Optional handler when started
     * @param {function} options.onEnd    Optional handler when ended
     * @param {function} options.onError  Optional handler on error
     * @param {function} options.onChange Optional handler to override change event
     * @param {boolean}  options.debug    Optional console info
     * @function
     */
    recognition(el: JQuery, options: KeyObject): void;
    /**
     * Get browser voices
     * @param {Object} ss speechSynthesis
     * @param {function} cbk callback(voices)
     * @function
     */
    getVoices(ss: any, cbk: (voices: KeyObject[]) => void): void;
    /**
     * Find a voice matching language
     * @param {Array} voices supported voices
     * @param {string} lang Language FRA, ENU...
     * @param {string} use  Try to use this voice if supported
     * @function
     */
    getVoice(voices: KeyObject[], lang: string, use: string): KeyObject | undefined;
    /**
     * Speech synthesis (experimental)
     * @param {Object} el Text or input or textarea
     * @param {Object} options Options
     * @param {string}   options.lang    Preferred language FRA, ENU...
     * @param {string}   options.voice   Optional voice name to force if exists
     * @param {string}   options.uri     Service URI, default native
     * @param {string}   options.volume  0 to 1, default 1
     * @param {string}   options.rate    0.1 to 10, default 1
     * @param {string}   options.pitch   0 to 2, default 1
     * @param {function} options.onStart Optional handler when started
     * @param {function} options.onEnd   Optional handler when ended
     * @param {boolean}  options.debug   Optional console info
     * @function
     */
    speak(el: JQuery, options: KeyObject): void;
    /**
     * Start to speech
     * @param {SpeechSynthesisUtterance} msg - Message to read
     * @function
     */
    speakStart(msg: KeyObject): void;
    /**
     * Stop current speech
     * @function
     */
    speakStop(): void;
}

type PaletteName = "Base" | "Pastel" | "Strong" | "Light" | "Bright" | "Mars" | "Sea" | "Berry" | "Fire" | "Choco";
type ToastParam = {
    level?: AlertType;
    content: AnyContent;
    position?: string;
    align?: string;
    duration?: number;
    undo?: boolean;
    pinable?: boolean;
};
type ScratchPadParam = {
    width?: number;
    height?: number;
    title?: string;
    inline?: boolean;
    image: HTMLImageElement | JQuery;
    onload?: (pad: JQuery) => void;
    update: (dataURL: string | null) => void;
};
type CounterParam = {
    /** Object name */
    name: string;
    /** Object instance name */
    instance?: string;
    /** Optional field name to get total (or simple count) */
    field?: string;
    /** Object filters */
    filters?: KeyObject;
    /** Counter label */
    label?: string;
    /** Optional help title */
    help?: string;
    /** Background color (CSS color) */
    bgColor?: string;
    /** Text color (CSS color) */
    textColor?: string;
    /** Predefined background color grey(default)|blue|orange|red|green|purple|violet|yellow|turquoise|brown */
    color?: string;
    /** Icon name */
    icon?: string;
    width?: string | number;
    height?: string | number;
    colSpan?: number;
    onclick?: true | JQueryHandler;
};
type SliderParam = {
    id?: string;
    name?: string;
    label?: string;
    min?: number;
    max?: number;
    step?: number;
    value?: number;
    width?: string;
    height?: string;
    showValue?: boolean;
    onchange?: JQueryHandler;
    oninput?: JQueryHandler;
    disabled?: boolean;
    round?: boolean;
    thin?: boolean;
};
/**
 * Common widgets
 * @class
 */
declare class Widget {
    /**
     * Predefined palettes
     * <ul>
     * <li>Base</li>
     * <li>Pastel</li>
     * <li>Strong</li>
     * <li>Light</li>
     * <li>Bright</li>
     * <li>Mars</li>
     * <li>Sea</li>
     * <li>Berry</li>
     * <li>Fire</li>
     * <li>Choco</li>
     * </ul>
     * @static
     */
    readonly PALETTES: {
        [key: string]: string[];
    };
    /**
     * Build an avatar image
     * @param {Object} data { userId, image (usr_image_id) } or { login, firstname, lastname, picture (full usr_image_id document) }
     * @return .avatar
     * @function
     */
    avatar(data?: UsageUser): JQuery<HTMLElement>;
    /**
     * Create a badge
     * @param {string|number|Object} p value or { name, value }
     * @return div.badge
     * @function
     */
    badge(p?: string | number | {
        name?: string;
        value?: string | number;
    }): JQuery<HTMLElement>;
    /**
     * Wait dialog box
     * @return div.waitdlg
     * @function
     */
    waitdlg(): JQuery<HTMLElement>;
    /**
     * Build a switch button on/off
     * @param {Object} p button parameters
     * @param {string} p.id optional input id
     * @param {string} p.name input name
     * @param {string} p.value input initial value (default "1")
     * @param {function} p.onchange optional 'change' handler
     * @param {boolean} p.checked on/off ?
     * @param {boolean} p.disabled false to disable the switch
     * @param {boolean} p.round round or square?
     * @return label with a checkbox and a slider
     * @function
     */
    switchButton(p: {
        id?: string;
        name?: string;
        value?: string;
        onchange?: JQueryHandler;
        checked?: boolean;
        disabled?: boolean;
        round?: boolean;
    }): JQuery<HTMLElement>;
    /**
     * Build a slider
     * @param {Object} p slider parameters
     * @param {string} p.id input id
     * @param {string} p.name input name
     * @param {number} p.min min value
     * @param {number} p.max max value
     * @param {number} p.step slider step
     * @param {number} p.value slider value
     * @param {string} p.width optional input width
     * @param {string} p.height optional input height
     * @param {boolean} p.showValue insert the value?
     * @param {function} p.onchange optional 'change' handler (on slider release)
     * @param {function} p.oninput optional 'input' handler (on slider move)
     * @param {boolean} p.disabled false to disable the slider
     * @param {boolean} p.round round or square?
     * @param {boolean} p.thin thin input?
     * @return div.slider
     * @function
     */
    slider(p: SliderParam): JQuery<HTMLElement>;
    /**
     * Build a star slider (rate rendering)
     * @param {Object} p slider parameters
     * @param {string} p.name input name
     * @param {number} p.size nb of stars, server values goes from 1 to size (0 = no star checked)
     * @param {number} p.value slider value
     * @param {boolean} p.disabled false to disable the slider
     * @return div.star-slider
     * @function
     */
    starSlider(p: {
        name: string;
        size: number;
        value?: number;
        disabled?: boolean;
    }): JQuery<HTMLElement>;
    /**
     * Build an action control
     * @param {Object} a action metadata
     * @param {BusinessObject} o object
     * @param {string} rowId optional rowId for form/row action
     * @param {function} click click handler
     * @param {boolean} minified true to move the label in a tooltip
     * @return button or li for 'Plus' button
     * @function
     */
    actionItem(a: Action, o: UIBusinessObject, rowId: string | null, click?: ActionHandler, minified?: boolean): JQuery<HTMLElement>;
    /**
     * Convert actions to buttons array
     * @param {BusinessObject} o Business object
     * @param {string} rowId Optional rowId on form/row
     * @param {Object[]} list List of actions as plain buttons
     * @param {Object[]} plus List of actions as 'plus' button
     * @param {Object} options Options
     * @param {boolean} options.alignRight true for right side
     * @param {boolean} options.minified true to move labels in tooltips
     * @param {boolean} options.dropUp true to drop up the 'plus' popup
     * @param {boolean} options.plusFirst true to put the plus button on first position
     * @param {boolean} options.grouped true to group plain buttons per type (print, crosstab, treeview, placemap, associate)
     * @param {Array} options.groups additional action groups with name, icon, label, actions
     * @return jQuery items
     * @function
     */
    actionItems(o: UIBusinessObject, rowId: string | null, list?: Action[] | null, plus?: Action[] | null, options?: {
        alignRight?: boolean;
        minified?: boolean;
        dropUp?: boolean;
        plusFirst?: boolean;
        grouped?: boolean;
        groups?: ActionGroup[];
    }): JQuery[];
    /**
     * Create a searchbar
     * @param {Object} p Options
     * @param {string}   p.id        Input id
     * @param {string}   p.label     Input aria label
     * @param {string}   p.icon      Optional icon
     * @param {function} p.cbk       Optional callback
     * @param {string}   p.events    Input binded events
     * @param {boolean}  p.collapsed Input collapsed
     * @function
     */
    searchBar(p: {
        id: string;
        label: string;
        icon?: string;
        cbk?: JQueryHandler | null;
        events?: string;
        collapsed?: boolean;
    }): JQuery<HTMLElement>;
    /**
     * Action bar
     * @param {jQuery[]} list Array of buttons (plain or plus)
     * @param {boolean} alignRight pull on the right side of container ?
     * @return div.actions
     * @function
     */
    actionBar(list: JQuery[], alignRight?: boolean): "" | JQuery<HTMLElement>;
    /**
     * Convert image to base64 (using a canvas)
     * @param {Object} img DOM image
     * @param {string} mime mime type (ex: image/jpeg)
     * @return string = image BASE64 encoded
     */
    getBase64Image(img: HTMLImageElement, mime: string): string;
    /**
     * Build a breadcrump 'first / ... / last ones'
     * @param {string[]|Object[]} items list of items : string or <code>{ label }</code>
     * @param {number} size size limit
     * @param {function} cbk click handler(index)
     * @return ol.breadcrumb
     * @function
     */
    breadcrump(items: (string | NavItem)[], size: number, cbk?: (index: number) => void): JQuery<HTMLElement>;
    /**
     * Transform a bar with overflow button for invisible items in a dropdown
     * @param {jQuery} ctn horizontal bar container (ul or div, with a limited height) with items (li/a, button or div)
     * @param {Object} options Overflow options
     * @param {string} options.show bring hidden item visible at 'first' or 'last' position when clicked (always trigger a 'ui.bar.click' on bar)
     * @param {string} options.icon icon button (default fas/caret-square-down)
     * @param {boolean} options.count count hidden items in icon (dafault false)
     * @return .bar-overflow + caller must trigger 'ui.resize' when displayed to fit size
     * @function
     */
    barOverflow(ctn: JQuery, options?: {
        show: string;
        icon?: string;
        count?: boolean;
    }): JQuery<HTMLElement>;
    /**
     * Bind a completion to input
     * @param {jQuery} input input or null
     * @param {number} limit max size of results (0 = no limit)
     * @param {function} search search service(cbk)
     * @param {function} select optional callback(data) on picking (click or enter)
     * @param {function} disp optional callback to display a result
     * @param {Object} options options
     * @param {boolean} options.autoselect auto-select the single result on blur or enter (default false)
     * @return input
     * @function
     */
    completion(input: JQuery | null, limit: number, search: (cbk: (rows: KeyObject[]) => void) => void, select?: null | ((data: KeyObject) => void), disp?: null | ((data: KeyObject) => string | JQuery), options?: {
        autoselect?: boolean;
    }): JQuery<HTMLElement>;
    /**
     * Bind a completion to textarea (substitute @login)
     * @param {jQuery} textarea social textarea
     * @function
     */
    completionSocial(textarea: JQuery): JQuery<HTMLElement>;
    /**
     * Pillbox control with completion, deprecated use $.pillbox
     * @function
     * @deprecated 7.0
     */
    pillbox(div: JQuery | null, data: {
        id: string;
        label: string;
        del?: boolean;
        open?: boolean;
    }[], limit: number, maxOccurs: number, search: null | ((values: string, cbk: (r: KeyObject) => void) => void), disp: null | ((item: KeyObject) => string), lookup: null | ((add?: Callback) => void), onAdd: null | ((id: string, fn: (...p: any) => void, data: KeyObject) => void), onRemove: null | ((id: string, fn: Callback) => void), onCreate: null | ((val: string, fn: Callback) => void), onOpen: null | ((id: string) => void)): JQuery<HTMLElement> | string[];
    /**
     * Launch a simple calculator on input
     * @param {(JQuery|string)} inp form input
     * @param {function} cbk callback(result)
     * @return input
     * @function
     */
    calculator(inp: AnyContent, cbk?: (result: number) => void): this;
    /**
     * Theme picker
     * @param themes list of themes (at list 2 themes to open the dialog)
     * @param pick callback with selected theme
     */
    themePicker(themes?: Theme[], pick?: (theme: Theme) => void): void;
    /**
     * Theme palette preview
     * @returns .theme-palette-preview with colors
     */
    palette(palette?: Palette): JQuery<HTMLElement>;
    /**
     * Predefined palette of colors picker
     * @param {Object} p Parameters
     * @param {string}   p.palette optional selected palette
     * @param {function} p.pick optional pick handler(palette)
     * @param {boolean}  p.dropup true to dropup (default dropdown)
     * @param {boolean}  p.inline true to inline the palettes (default display a dropdown button)
     * @param {string}   p.label optional label dropdown button (default: selected palette name)
     * @param {string}   p.icon optional icon of dropdown button
     * @function
     */
    palettePicker(p: {
        palette?: string;
        pick?: (palette: string) => void;
        dropup?: boolean;
        inline?: boolean;
        label?: string;
        icon?: string;
    }): JQuery<HTMLElement>;
    /**
     * Preview image in a dialog
     * @param {Object} p
     * @param {string} p.url image url
     * @param {string} p.alt optional image alt
     * @param {string} p.name optional image name
     * @param {string|number} p.zoom percent or 'fit", fitWidth' or 'fitHeight' to screen
     * @param {function} p.onload optional onload callback
     * @function
     */
    previewImage(p: {
        url: string;
        alt?: string;
        name?: string;
        zoom?: string | number;
        onload?: (img: JQuery) => void;
    }): JQuery<HTMLElement>;
    /**
     * Circular progress bar
     * @param {Object} options { background, color, percent, duration, radius, width }
     * @param {number} options.percent percent value 0..100
     * @param {string} options.background center background color
     * @param {string} options.color  center text color
     * @param {string} options.color1 circle color
     * @param {string} options.color2 circle active color
     * @param {number} options.duration animation duration in ms (default 2000)
     * @param {number} options.radius circle radius in px
     * @param {number} options.width  circle line width in px
     * @param {string|$} options.text optional center content (""=empty, default='n%')
     * @param {string} options.bar    optional bar selector to update value
     * @function
     */
    circularProgressBar(options?: {
        percent?: number;
        background?: string;
        color?: string;
        color1?: string;
        color2?: string;
        duration?: number;
        radius?: number;
        width?: number;
        text?: AnyContent;
        bar?: string | JQuery;
    }): JQuery<HTMLElement>;
    /**
     * POST/UPLOAD dialog
     * @param {Object} e progress event from xhr
     * @param {Object} p Optional parameters
     * @param {string}   p.id dialog Id
     * @param {string}   p.label dialog title
     * @param {number}   p.after timeout in ms before opening the modal dialog (default 3s)
     * @param {function} p.background callback when the dialog in minified as toast (post in background)
     * @function
     */
    postProgress(e: ProgressEvent, p?: {
        id?: string;
        label?: string;
        after?: number;
        background?: Callback;
    }): void;
    private _postProgress;
    /**
     * Toast during the export loading
     * @param {string} title toast title
     * @param {string} filename file name to download
     * @param {string} url url to load
     * @param {Object} p Parameters
     * @param {string} p.async async URL to wait for by polling
     * @param {string} p.abort optional URL to abort
     * @function
     */
    toastLoading(title: string, filename: string, url: string, p?: {
        async?: string;
        abort?: string;
    }): void;
    /**
     * Toast dialog
     * @param {string | Object} params text or an object with optional keys:
     * `level` ('info' default, 'success', 'warning', 'error'='danger'),
     * `content` (content message),
     * `position` ('top' default or 'bottom'),
     * `align` ('left', 'center' default or 'right'),
     * `duration` (animation duration in ms, default 3000, -1 = infinity),
     * `undo` (add a UNDO button?),
     * `pinable` (add a push-pin button?)
     * @function
     */
    toast(params: string | ToastParam): JQuery<HTMLElement>;
    private toastStacks;
    /**
     * Display the news
     * @param {jQuery} ctn container to display articles (null to display an area or a ticker bar)
     * @param {Object[]} list news list from WebNews object or  or <code>\{ id, title, description, date, image \}</code>
     * @param {Object} options optional parameters
     * @param {string}  options.template HTML template with classes to fill <code>.news-title .news-date .news-desc .news-img</code> (default Simplicite.UI.Globals.news.template)
     * @param {boolean} options.popup    true to get only news to display (on logon) in a modal dialog
     * @param {boolean} options.ticker   true to get only news to display on a footer ticker
     * @function
     */
    news(ctn: AnyContainer, list?: News[], options?: {
        template?: string;
        popup?: boolean;
        ticker?: boolean;
    }): void;
    /**
     * Display a ticker bar
     * @param {Object} p Optional parameters
     * @param {string} p.position position selector (default 'body')
     * @param {Array}  p.list list of news <code>\{ id, title, description \}</code>
     * @function
     */
    tickerBar(p?: {
        position?: AnyContainer;
        list?: News[];
    }): void;
    /**
     * Multi-files rendering + upload
     * @param {jQuery} ctn container
     * @param {Array} list list of documents { id, name }
     * @param {Object} p options
     * @param {boolean} p.name     component name
     * @param {Object}  p.object   business object
     * @param {Object}  p.field    doc field with fileAccept: string or array of permitted extensions and MIME types
     * @param {boolean} p.upload   upload files allowed?
     * @param {boolean} p.download download documents?
     * @param {boolean} p.preview  preview documents?
     * @param {boolean} p.remove   remove documents?
     * @param {string} p.show     'list' default or 'boxes'
     * @param {boolean} p.toggle   true to toggle list|boxes
     * @param {boolean} p.min      minimum files (0 = not required)
     * @param {boolean} p.max      total of permitted files (0 = no limit)
     * @function
     */
    docUploader(ctn: JQuery, list: DocumentDB[], p: {
        id: string;
        name: string;
        object: BusinessObject;
        field: ObjectField;
        upload?: boolean;
        download?: boolean;
        preview?: boolean;
        remove?: boolean;
        show?: "list" | "boxes";
        toggle?: boolean;
        min?: number;
        max?: number;
    }): JQuery<HTMLElement>;
    /**
     * Advanced notepad with activities
     * @param {Object} p options
     * @param {string} p.id widget id
     * @param {string} p.name widget name
     * @param {Object} p.data Content <code>{ checks:[{ title, list:[check,text]}], activities:[{ date, author, text }] }</code>
     * @param {boolean} p.readonly Read only or editable by authors
     * @param {boolean} p.popup Allows to open a popup to enlarge contents
     * @param {boolean} p.split split checklists and comments in 2 columns
     * @param {number} p.autosplit minimal width of container to auto-split
     * @param {number|string} p.height Optional max height
     * @param {function} p.change optional <code>callback({act,event})</code> when data has changed
     * @function
     */
    notepad(p: {
        id?: string;
        name?: string;
        data: string | KeyObject;
        readonly?: boolean;
        popup?: boolean;
        split?: boolean;
        autosplit?: number;
        height?: number | string;
        change?: (p: {
            act?: KeyObject;
            item?: KeyObject;
            list?: {
                title: string;
                list: KeyObject[];
            };
            event: string;
        }) => void;
    }): JQuery<HTMLElement>;
    /**
     * Simple dialog to change the user's password
     * @function
     */
    changePwd(): void;
    /**
     * Create a characters counter on input field
     * @param {string|jQuery} input input or textarea
     * @param {Object} p Options
     * @param {number} p.max Max length of input (default 100)
     * @param {string} p.position top or bottom (default bottom)
     * @param {string} p.align left or right (default left)
     * @param {boolean} p.toggle true to show/hide on focus/blur
     * @function
     */
    charCounter(input: AnyContent, p?: {
        max?: number;
        position?: "bottom" | "top";
        align?: "left" | "right";
        toggle?: boolean;
    }): JQuery<HTMLElement>;
    /**
     * Edit a markdown text in a dialog with a preview area
     * @param {string} md Initial value
     * @param {function} cbk Callback with new value
     * @function
     */
    editMarkdown(md: string, cbk?: (md: string) => void): JQuery<HTMLElement>;
    /**
     * Open a dialog to take a picture
     * @param {Object} p
     * @param {string} p.title Dialog title
     * @param {string} p.facingMode video facing mode suggestion (selfie = 'user' or back camera = 'environment', not applicable if device has only one camera)
     * @param {number} p.videoWidth video width (use the media width by default without zoom)
     * @param {number} p.imageWidth result image width (use the media width if unspecified)
     * @param {number} p.imageHeight result image height (same video aspect ratio if unspecified)
     * @returns Promise with data URL 'data:image/png;base64,...'
     * @function
     */
    takePicture(p: {
        title: string;
        facingMode: string;
        videoWidth?: number;
        imageWidth?: number;
        imageHeight?: number;
    }): Promise<string>;
    /**
     * Simple scratch pad
     * @param {Object} p
     * @param {number} p.width result image width (default 800)
     * @param {number} p.height result image height (default 600)
     * @param {string} p.title dialog title
     * @param {boolean} p.inline inline pad
     * @param {(Image|jQuery)} p.image source image
     * @param {function} p.onload callback(pad) when loaded
     * @param {function} p.update callback(dataURL) when signature has changed
     * @function
     */
    scratchPad(p: ScratchPadParam): void;
    /**
     * Take a signature on pad
     * @param {ScratchPadParam} p Options
     * @param {number} p.width result image width (default 400)
     * @param {number} p.height result image height (default 200)
     * @param {string} p.title dialog title
     * @param {boolean} p.inline inline pad
     * @param {(Image|jQuery)} p.image source image
     * @param {function} p.onload callback(pad) when loaded
     * @param {function} p.update callback(dataURL) when signature has changed
     * @function
     */
    takeSignature(p: ScratchPadParam): void;
    /**
     * Scan a QRCode/barcode
     * @param {Object} p
     * @param {number} p.width scanner width (default 350)
     * @param {number} p.height scanner height (default 0)
     * @param {number} p.scanWidth scan zone width (default 250)
     * @param {number} p.scanHeight scan zone height (default 250)
     * @param {number} p.aspectRatio scanner aspect ratio height (default 1.0)
     * @param {string} p.title dialog title
     * @param {boolean} p.applyButton display apply button? defaults to true
     * @param {boolean} p.retryButton display retyr button? defaults to true
     * @param {boolean} p.cancelButton display cancel button? defaults to true
     * @param {string} p.applyLabel apply label
     * @param {string} p.retryLabel retry button title
     * @param {string} p.cancelLabel cancel button title
     * @param {jQuery} p.container container to inline in (no dialog in this case)
     * @param {string} p.id DOM id (got from container if a container is set, defaults to 'scanner')
     * @param {function} p.onload callback(scanner) when loaded
     * @param {function} p.onscan callback(scanner, text) when scan is done
     * @param {function} p.onapply callback(text) when scan is applied (trigger by the apply button)
     * @param {function} p.onretry callback() when scan is resumed (triggered by the retry button)
     * @param {function} p.oncancel callback() when scan is cancelled (triggered by the cancel button)
     * @param {function} p.onclose callback() after closing
     * @function
     */
    scanCode(p: {
        width?: number;
        height?: number;
        scanWidth?: number;
        scanHeight?: number;
        aspectRatio?: number;
        title?: string;
        applyButton?: boolean;
        applyLabel?: string;
        retryButton?: boolean;
        retryLabel?: string;
        cancelButton?: boolean;
        cancelLabel?: string;
        container?: JQuery;
        id?: string;
        onload?: Callback;
        onscan?: (scan: Html5Qrcode | null, value: string) => void;
        onapply?: (text: string) => void;
        onretry?: Callback;
        oncancel?: Callback;
        onclose?: Callback;
    }): void;
    /**
     * Display a contrast helper between 2 colors
     * @param {jQuery} ctn Target container to draw the preview button with colors and contrast value
     * @param {jQuery} color input of color
     * @param {jQuery} bgcolor input of background color
     * @function
     */
    contrastHelper(ctn: JQuery, color: JQuery, bgcolor: JQuery): void;
    /**
     * Display a shortcut
     * @param {jQuery} ctn Target container
     * @param {Object} p Options
     * @param {Shortcut[]} p.shortcuts List of shortcuts, each with `name`, `url`, `target` and `order`
     * @function
     */
    shortcuts(ctn: JQuery, p: {
        shortcuts: Shortcut[];
    }): JQuery<HTMLElement>;
    /**
     * Display a counter
     * @param {jQuery} ctn Target container
     * @param {Object} p Options
     * @param {string} p.name Object name
     * @param {string} [p.instance] Object instance name
     * @param {string} [p.field] Optional field name to get total (or simple count)
     * @param {Object} [p.filters] Object filters
     * @param {string} [p.label] Counter label
     * @param {string} [p.help] Optional help title
     * @param {string} [p.bgColor] Background color (CSS color)
     * @param {string} [p.textColor] Text color (CSS color)
     * @param {string} [p.color] Predefined background color grey(default)|blue|orange|red|green|purple|violet|yellow|turquoise|brown
     * @param {string} [p.icon] Icon name
     * @param {number|string} [p.width] Width (number of pixels or CSS dimension)
     * @param {number|string} [p.height] Height (numbre of pixels or CSS dimension)
     * @param {function} [p.onclick] Click handler
     * @function
     */
    counter(ctn: JQuery, p: CounterParam): JQuery<HTMLElement>;
    /**
     * Display a set of counters
     * @param {jQuery} ctn Target container (if null defauts to container with options.id DOM Id)
     * @param {Object} p Options
     * @param {CounterParam[]} p.objects Objects to display (see CounterParam for per-object properties)
     * @param {string} [p.id] DOM Id (required if no container is passed)
     * @param {number|string} [p.width] Width (number of pixels or CSS dimension)
     * @param {number|string} [p.height] Height (numbre of pixels or CSS dimension)
     * @param {number|string} [p.colSpan] Column span (defaults to max(3, 12 / number of objects)
     * @param {string} [p.rowClasses] Optional CSS row classes (default 'row')
     * @param {string} [p.classes] Optional CSS classes to add
     * @param {function} [p.onclick] Click handler
     * @function
     */
    counters(ctn: JQuery | null, p: {
        id?: string;
        objects: CounterParam[];
        width?: string | number;
        height?: string | number;
        colSpan?: number;
        rowClasses?: string;
        classes?: string;
        onclick?: JQueryHandler;
    }): JQuery<HTMLElement>;
    /**
     * Display a carousel for a business object
     * @param {jQuery} ctn Target container (if null defauts to container with opts.id DOM Id)
     * @param {Object} p Options
     * @param {string} p.name Object name
     * @param {string} [p.instance] Object instance name
     * @param {Object} [p.filters] Object filters
     * @param {Object} p.titleField Object title field
     * @param {Object} [p.subTitleField] Object sub-title field
     * @param {Object} [p.descriptionField] Object description filters
     * @param {Object} [p.imageField] Object image field
     * @param {boolean} [p.imageFieldThumbnail] Object image field as thumbnail ?
     * @param {string} [p.id] DOM Id (required if no container is passed)
     * @param {number|string} [p.width] Width (number of pixels or CSS dimension)
     * @param {number|string} [p.height] Height (numbre of pixels or CSS dimension)
     * @param {string} [p.bgColor] Background color (CSS color))
     * @param {function} [p.onclick] Click handler
     * @function
     */
    carousel(ctn: JQuery, p: {
        name: string;
        instance?: string;
        filters?: KeyObject;
        titleField: string;
        subTitleField?: string;
        descriptionField?: string;
        imageField?: string;
        imageFieldThumbnail?: string;
        id?: string;
        width?: string | number;
        height?: string | number;
        bgColor?: string;
        addon?: AnyContent;
        onclick?: boolean | JQueryHandler;
    }): void;
    /**
     * Display a set of cards for a business object
     * @param {jQuery} ctn Target container (if null defauts to container with opts.id DOM Id)
     * @param {Object} p Options
     * @param {string} p.name Object name
     * @param {string} [p.instance] Object instance name
     * @param {Object} [p.filters] Object filters
     * @param {Object} p.titleField Object title field
     * @param {Object} [p.subTitleField] Object sub-title field
     * @param {Object} [p.descriptionField] Object description filters
     * @param {Object} [p.statusField] Object status filters
     * @param {Object} [p.imageField] Object image field
     * @param {boolean} [p.imageFieldThumbnail] Object image field as thumbnail ?
     * @param {string} [p.id] DOM Id (required if no container is passed)
     * @param {string} [p.rowClasses] Row-level CSS classes
     * @param {string} [p.classes] Row-level additional CSS classes
     * @param {number|string} [p.width] Width (number of pixels or CSS dimension)
     * @param {number|string} [p.height] Height (numbre of pixels or CSS dimension)
     * @param {string} [p.bgColor] Background color (CSS color))
     * @param {string} [p.cardClasses] Card-level additional CSS classes
     * @param {number|string} [p.cardWidth] Card width (number of pixels or CSS dimension)
     * @param {number|string} [p.cardHeight] Card height (numbre of pixels or CSS dimension)
     * @param {number|string} [p.cardImgWidth] Card image width (number of pixels or CSS dimension)
     * @param {number|string} [p.cardImgHeight] Card image height (numbre of pixels or CSS dimension)
     * @param {string} [p.cardBgColor] Card background color (CSS color))
     * @param {function} [p.onclick] Click handler
     * @function
     */
    cards(ctn: JQuery, p: {
        name: string;
        instance?: string;
        filters?: KeyObject;
        titleField: string;
        subTitleField?: string;
        descriptionField?: string;
        statusField?: string;
        imageField?: string;
        imageFieldThumbnail?: string;
        id?: string;
        rowClasses?: string;
        classes?: string;
        width?: string | number;
        height?: string | number;
        bgColor?: string;
        cardClasses?: string;
        cardWidth?: string | number;
        cardHeight?: string | number;
        cardImgWidth?: string | number;
        cardImgHeight?: string | number;
        cardBgColor?: string;
        addon?: AnyContent;
        button?: {
            style?: string;
            onclick?: JQueryHandler;
        };
        onclick?: boolean | JQueryHandler;
    }): void;
    /**
     * Create a context menu
     * @param {jQuery} _element The element that was right-clicked
     * @param {Object} e Mouse event
     * @param {Object[]} items Actions
     * @function
     */
    contextMenu(_element: JQuery, e: JQuery.ContextMenuEvent, items: (DropdownItem | JQuery)[]): JQuery<HTMLElement> | undefined;
}

/**
 * Main menu rendering
 * @class
 */
declare class Menu {
    container?: Container;
    menu?: JQuery;
    _focus?: JQuery;
    statusTimer?: number;
    leftMinified: string;
    menuSettings: MenuSettings;
    /**
     * Main menu
     * @function
     */
    getMenu(): JQuery<HTMLElement>;
    /**
     * Menu (left/top) Settings (either from sys_param or default values)
     * @function
     */
    getMenuSettings(): MenuSettings;
    /**
     * Init menus (left,top)
     * @function
     */
    init(): void;
    private item;
    private itemTop;
    private contextMenu;
    private click;
    /**
     * Init the top menu (horizontal with dropdowns)
     * - Click to open dropdowns
     * - Click to open flyout sub-menus (no hover)
     * - Keyboard navigation support
     * - Flyouts detached to body to avoid clipping
     * @function
     */
    initTopMenu(items: MenuItem[], ms: any): void;
    /**
     * Init the main menu (on left), use the ui.clickMenu handler
     * @function
     */
    initLeftMenu(items: MenuItem[], ms: any): void;
    /**
     * Select one menu item
     * @function
     */
    selectMenu(a: JQuery, menu?: JQuery | null): JQuery;
    /**
     * Focus the last selected item or first item
     * @function
     */
    focus(): void;
    /**
     * hover effect when minified
     * @param {boolean} b false to remove effect
     * @function
     */
    hover(b: boolean): void;
    /**
     * Menu navigation with Arrow keys
     * @function
     */
    keydown(el: HTMLElement, e: JQuery.Event): void;
    /**
     * Accordion effect
     * @function
     */
    accordion(el: JQuery): void;
    /**
     * Is menu minimized on the left side ?
     * @function
     */
    isMenuMin(): boolean | undefined;
    /**
     * Is menu maximized on the left side ?
     * @function
     */
    isMenuMax(): boolean;
    /**
     * Minimize the menu on the left side
     * <ul>
     * <li>displays only domain icons</li>
     * <li>popup the sub-menus over the screen</li>
     * <ul>
     * @function
     */
    menuMin(): void;
    /**
     * Maximize the menu on the left side
     * <ul>
     * <li>displays domain icons and labels</li>
     * <li>accordion sub-menus</li>
     * <ul>
     * @function
     */
    menuMax(): void;
    /**
     * Hide a sub-menu
     * @param {jQuery} m menu item (li element with .sub-menu child)
     * @function
     */
    subMenuMin(m: JQuery): void;
    /**
     * Show a sub-menu
     * @param {jQuery} m menu item (li element with .sub-menu child)
     * @function
     */
    subMenuMax(m: JQuery): void;
    /**
     * Toggle the main menu on the left side
     * @param {Object} e optional event
     * @param {number} sign positive:show, negative:hide
     * @function
     */
    menuToggle(e?: JQuery.Event | KeyboardEvent | null, sign?: number): void;
    /**
     * Start a timer to update enum counters
     * @function
     */
    startRefreshStatus(): void;
    /**
     * Stop the timer to update visible status counters
     * @function
     */
    stopRefreshStatus(): void;
    /**
     * Update the visible enum counter
     * @param {string|jquery} object object name or menu item or sub-menu
     * @param {string} field enum field name
     * @param {string} code enum code
     * @function
     */
    updateStatusBadge(object: string | JQuery, field?: string, code?: string): false | Promise<boolean | JQuery<HTMLElement>> | undefined;
    private badge;
    /**
     * Update all status and enum counters of a given menu
     * @param {jQuery} m sub menu
     * @function
     */
    updateStatusBadges(m: JQuery): void;
    /**
     * Process incoming data from SSE event enumCounters
     * @param {Object} d data
     * @function
     */
    onEnumCounters(d: KeyObject): void;
    treeview(ctn: Container, o: BusinessObject, id: string, tv: TreeNode, p: TreeParam, cbk?: Callback): Window & typeof globalThis;
    updateNotificationBadge(n: KeyObject): void;
    /**
     * Filter menu
     * @function
     */
    filterMenu(): void;
    /**
     * Open a top menu dropdown
     * @function
     */
    openTopDropdown(mi: JQuery): void;
    /**
     * Close a top menu dropdown
     * @function
     */
    closeTopDropdown(mi: JQuery): void;
    /**
     * Close all top menus
     * @function
     */
    closeAllTopMenus(): void;
    /**
     * Open a flyout submenu
     * @function
     */
    openTopFlyout(li: JQuery): void;
    /**
     * Close a flyout menu
     * @function
     */
    closeTopFlyout(li: JQuery): void;
    /**
     * Keyboard navigation for top menu
     * @function
     */
    keydownTopMenu(el: HTMLElement, e: JQuery.Event, openFlyout?: (li: JQuery) => void, closeFlyout?: (li: JQuery) => void, getFlyoutForLi?: (li: JQuery) => JQuery | null): void;
    /**
     * Append flyout to body & position it (no clipping)
     * @function
     */
    positionFlyout(li: JQuery, fm: JQuery): void;
}

/**
 * Board and view rendering
 * @class
 */
declare class Board {
    /**
     * Navigation rendering
     * @param {jQuery} ctn Optional container to find the .nav
     * @param {Simplicite.UI.Navigator} nav Navigator
     * @function
     */
    displayNav(ctn: AnyContainer, nav: UINavigator): this;
    /**
     * Hide navigation
     * @param {jQuery} ctn Optional container to find the .nav
     * @function
     */
    hideNav(ctn: AnyContainer): this;
    /**
     * Display a view of items (i.e. home, plain view or part of form)
     * @param {jQuery} ctn container
     * @param {Object} v view metadata <code>\{ name, visible, template, ...\}</code>
     * @param {Object} p options <code>\{ parent, home, lazy, edit \}</code>
     * @param {function} cbk callback when displayed
     * @function
     */
    display(ctn: Container, v: View, p?: ViewParam, cbk?: Callback): this;
    /**
     * Display user's dashboards
     * @param {jQuery} ctn container
     * @param {Object} data list of user views + perm + groups
     * @param {Object} p options
     * @param {function} cbk callback when displayed
     * @function
     */
    dashboards(ctn: Container, data: KeyObject, p: KeyObject, cbk?: (div: JQuery) => void): void;
    selectedDashboard?: View;
    /**
     * State model charts
     * @param {jQuery} ctn Container
     * @param {Simplicite.UI.BusinessObject} obj Business object
     * @param {Object} data Metrics from service <code>\{ pie, duration, term, count \}</code>
     * @param {Object} params Options { palette, period, fromDate, toDate, show }
     * @param {string} params.palette  palette name in Simplicite.UI.Charts.PALETTE (ex 'sea', 'mars'...)
     * @param {string} params.period   data groupment 1:hour, 2:day, 3:week, 4:month, 5:quarter, 6:semester, 7:year
     * @param {string} params.fromDate search data from this date YYYY-MM-DD
     * @param {string} params.toDate   search data to this date YYYY-MM-DD
     * @param {Object} params.show     Show options
     * @param {boolean} params.show.count    Show the count per status?
     * @param {boolean} params.show.duration Show the duration per status?
     * @param {boolean} params.show.history  Show the status history?
     * @param {boolean} params.show.terminal Show the terminal status per duration?
     * @param {boolean} params.show.palette  Show palette picker?
     * @param {(boolean|string)} params.show.period   true|false or 'read'
     * @param {(boolean|string)} params.show.fromDate true|false or 'read'
     * @param {(boolean|string)} params.show.toDate   true|false or 'read'
     * @function
     */
    statusMetrics(ctn: AnyContainer, obj: BusinessObject, data: KeyObject, params?: KeyObject): this;
    /**
     * Version check
     * @param ctn {jQuery} Target container
     * @param [options] {Object}
     * @param [options.silent] {boolean} Do not display message in case of check error?
     * @param [options.addon] {$|string} Optional addon content
     * @function
     */
    versionCheck(ctn: Container | string, options?: {
        addon?: AnyContent;
        silent?: boolean;
    }): void;
    /**
     * Display the About dialog
     * @function
     */
    about(): this;
    /**
     * System informations rendering
     * @param {jQuery} ctn Container
     * @param {Object} data Informations
     * @param {function} fn action callback
     * @param {boolean} cache Clear cache only or full form
     * @function
     */
    sysinfo(ctn: Container, data: KeyObject, fn: (action: string, param?: string | null) => void, cache?: boolean): this;
    /**
     * Models picker and creation
     * @param {jQuery} ctn Container
     * @param {Object} params options { embedded }
     * @function
     */
    modeler(ctn: Container, params?: KeyObject): Promise<this>;
    /**
     * import/export application with modules
     * @function
     */
    moduleApp(action: string, obj: BusinessObject, service: (p: ModuleAjax, started: TrackerCallback) => void): void;
    /** Delete module rendering */
    moduleDelete(ctn: AnyContainer, module: BusinessObject, service: CallableFunction): this;
    load2048(): void;
    loadChess(): void;
}

type UpdateFormParam = {
    title?: string;
    inst?: string;
    floating?: boolean;
    onsave?: (ctn: Container, o: BusinessObject, cbk?: Callback) => void;
    onclose?: (ctn: Container, o: BusinessObject) => void;
    onload?: (ctn: Container, o: BusinessObject) => void;
    onunload?: (ctn: Container, o: BusinessObject) => void;
} & NavParam;
/**
 * Bulk update rendering
 * @class
 */
declare class Update {
    /**
     * Display the bulk update form
     * @param {jQuery} ctn container
     * @param {Simplicite.Ajax.BuisinessObject} o object
     * @param {Object} p optional parameters
     * @param {function} cbk optional callback
     * @function
     */
    display(ctn: Container, o: BusinessObject, p: UpdateFormParam, cbk?: Callback): this;
}

type SocialStatus = "O" | "C";
type SocialUser = {
    userId: string;
    login: string;
    status: string;
    label: string;
    fullName: string;
};
type SocialPost = {
    id: string;
    datetime: string;
    elapsed: string;
    message?: string;
    level?: string;
    status?: SocialStatus;
    like: boolean;
    count: number;
    likes?: string[];
    target?: string;
    rowId?: string;
    item?: KeyObject;
    author: SocialUser;
};
type SocialParam = {
    title?: string;
    embedded?: boolean;
    activity?: boolean;
    reset?: boolean;
    object?: boolean;
    follow?: {
        requested: string;
        follower: string;
        followed: string;
    };
    audit?: JQueryHandler;
    posted?: number;
    count?: number;
    levels?: {
        info: number;
        warn: number;
        error: number;
        closed: number;
    };
    onlist?: (i: number, activity: boolean, level: string) => void;
    onpost?: (p: {
        id?: string;
        message: string;
        pub?: boolean;
    }) => void;
    ondel?: (id: string) => void;
    onlike?: (id: string, like: boolean) => void;
    onstatus?: (id: string, status: SocialStatus) => void;
    onfollow?: (method: string | null, param: string | null, cbk: (r: KeyObject) => void) => void;
};
/**
 * Social and Follower rendering
 * @class
 */
declare class Social {
    private _socialPage;
    private _socialActivity;
    private _socialLevel;
    /**
     * Display the social posts
     * @param {jQuery} ctn container
     * @param {Object[]} list list of posts (paginated)
     * @param {Object} p optional parameters { onlist, activity }
     * @param {boolean} p.activity true to list the object/public activities, false to hide activities
     * @param {function} p.onlist  search service handler
     * @param {function} p.onpost  post service handler
     * @param {function} p.ondel   delete service handler
     * @param {function} p.onlike  like service handler
     * @param {function} p.onfollow follow service handler
     * @param {number} p.count  total of posts
     * @param {Object} p.levels optional counts per level (info, warn, error)
     * @param {Object} p.object optional parent object
     * @param {string} p.title  Dialog title
     * @param {string} p.audit  List only audit posts
     * @param {string} p.embedded false to open a dialog
     * @param {function} cbk optional callback
     * @function
     */
    display(ctn: Container, list: SocialPost[], p: SocialParam, cbk?: Callback): this;
    /**
     * Follower dialog
     * @param {Object} p optional parameters { onfollow }
     * @param {function} p.onfollow follow service handler
     * @param {function} cbk optional callback
     * @function
     */
    follow(p?: SocialParam, cbk?: Callback): Window & typeof globalThis;
    /**
     * Build a share button
     * @param {Object} config see SOCIAL_SHARE parameter
     * @param {Object} o Optional object
     * @param {Object} params Optional share data, with optional keys:
     * `title` (optional title for email), `text` (optional text content),
     * `url` (URL to share), `image` (optional URL to image for pinterest),
     * `root` (root domain to share)
     * @function
     */
    shareButton(config?: KeyObject, o?: BusinessObject, params?: KeyObject): JQuery<HTMLElement>;
}

type ExternalParam = {
    title?: string;
    help?: string;
    icon?: string;
    html: string;
    metadata?: ExternalMetadata;
    css?: string[];
    js?: string[];
};
/**
 * External object rendering
 * @class
 */
declare class External {
    /**
     * Display the external object
     * @param {jQuery} ctn container
     * @param {Object} p optional parameters { title, icon, html, metadata }
     * @param {function} cbk optional callback
     * @function
     */
    display(ctn: Container, p: ExternalParam, cbk: (div: JQuery) => void): this;
}

type ColorPickerHandler = (color: string, apply?: boolean) => void;
type ColorSet = {
    color: string;
    lighters: string[];
    darkers: string[];
};
type PaletteColors = ColorSet[];
/**
 * Color picker widget (based on https://seballot.github.io/spectrum)
 * @class
 */
declare class ColorPicker {
    ctn: Container;
    input: JQuery;
    callback?: ColorPickerHandler;
    dlg?: JQuery;
    oldColor: string;
    newColor?: string;
    allowEmpty: boolean;
    allowAlpha: boolean;
    onlyRgb: boolean;
    static theme?: string;
    static themeSet?: PaletteColors;
    static themePalettes: KeyHash<JQuery>;
    constructor(ctn: Container, input: JQuery, cbk?: ColorPickerHandler);
    private toString;
    /**
     * Open the color picker
     * @param {boolean} dropdown display as dropdown or dialog box
     * @function
     */
    open(dropdown: boolean): void;
    close(): void;
    palTheme(t: Theme): JQuery<HTMLElement> | undefined;
    listThemes(ctn: JQuery): "" | undefined;
    static buildColorSets(theme: string, pal?: Palette): void;
    private static palPrepare;
}

/**
 * Import data rendering
 * @class
 */
declare class Import {
    readonly XML_SIMPLICITE: string;
    private help;
    /**
     * Import XML interface
     * @param {jQuery} ctn Container
     * @param {Object} data { adapters, help }
     * @param {function} send callback to post data
     * @function
     */
    display(ctn: Container, data: {
        help?: AnyContent;
        adapters?: string[];
        adapter?: string;
    }, send: (data: KeyObject) => void): void;
    /**
     * Import CSV interface
     * @param {jQuery} ctn Container
     * @param {Object} data objects and help
     * @param {function} send callback to post data
     * @function
     */
    displayCSV(ctn: Container, data: {
        help?: AnyContent;
        objects?: string[];
    }, send: (data: KeyObject) => void): void;
}

type MergeParam = {
    /** array of row IDs to merge */
    ids: string[];
};
type MergeSaveParam = MergeParam & {
    /** true to check only (isMergeEnable) */
    check?: boolean;
    /** index per field to preserve */
    item?: object;
    /** indexes per link to preserve */
    links?: object;
    /** optional limited link Ids per link and indexes to preserve */
    linkIds?: object;
    /** indexes per meta-object to preserve */
    metaobj?: object;
};
/**
 * Merge object rendering
 * @class
 */
declare class Merge {
    display(ctn: Container, obj: BusinessObject, items: RowDataMeta[], save?: (p: MergeSaveParam) => void, close?: Callback, cbk?: Callback): void;
}

declare class Bam {
    private ctn;
    private head?;
    private _baseURL;
    private _tab;
    private _metrics;
    private _cols;
    private _log10;
    private _colors;
    private _fdate?;
    private static singleton?;
    /**
     * Render the BAM dashboard.
     * @param {Array} metrics Array of other available metrics {key,label}
     * @param {Object} params begin, end, period
     * @function
     */
    static render(metrics: KeyObject[], params?: KeyObject): void;
    /**
     * Render the BAM dashboard
     * @param {Array} metrics Array of other available metrics {key,label}
     * @param {Object} params begin, end, period
     * @function
     */
    display(metrics: KeyObject[], params?: KeyObject): void;
    displayTab(tab?: number): void;
    reload(): void;
    shift(s: number): void;
    addTab(k: number): void;
    delTab(k: number): void;
    private _getMetric;
    private _call;
    private _onBamActivity;
    private _onBamProcess;
    private _onBamStatus;
    private _onBamMetric;
    private _plotProcessPie;
    private _plotProcessLag;
    private _plotProcessDate;
    private _plotProcessUser;
    private _plotStatusPie;
    private _plotStatusDate;
    private _plotStatusDuration;
    private _plotStatusTerm;
    private _title;
    private _serie;
    private _axis;
    private _logAxis;
    private _dateAxis;
    private _insideLegend;
    private _highlighter;
    private _cursor;
    private _grid;
    private _showTooltip;
    private _hideTooltip;
}

/**
 * ZIP files editor
 * @class
 */
declare class ZIP {
    display(ctn: Container, doc: DocumentDB, zip: JSZip, p?: {
        readonly?: boolean;
    }): void;
}

/**
 * Treeview rendering
 * @class
 */
declare class Tree {
    /**
     * Object treeview rendering
     * @param {jquery} ctn container
     * @param {Object} o business object (where o.item is a tree)
     * @param {string} id row Id
     * @param {Object} tv treeview definition { name }
     * @param {Object} p options
     * @param {function} cbk optional callback
     * @function
     */
    display(ctn: Container, o: BusinessObject, id: string, tv: TreeNode, p: TreeParam, cbk?: Callback): this;
    /**
     * Filter tree
     * @function
     */
    filterTree(): void;
}

type PrefType = "list" | "search" | "action";
type PrefItem = {
    name: string;
    label?: string;
    userkey?: string;
    visible?: boolean;
    fields?: {
        name: string;
        visible: boolean;
        required?: boolean;
        userkey?: boolean;
        label?: string;
    }[];
};
type PrefsParam = {
    list?: PrefItem[];
    search?: PrefItem[];
    actions?: PrefItem[];
    actionLabel?: boolean;
    restore?: Callback;
    save?: (p: PrefsParam, cbk: Callback) => void;
    reload?: Callback;
    close?: Callback;
};
type Bookmark = {
    o: string;
    i?: string;
    b: {
        id: string;
        t: string;
    }[];
};
type Bookmarks = {
    show: string | boolean;
    list?: Bookmark[];
};
type BookmarkParam = {
    show?: string | false;
};
type UserFilterParam = {
    bar: boolean;
};
/**
 * Object preferences rendering
 * @class
 */
declare class Prefs {
    /**
     * Build the object preferences dialog
     * @param {Simplicite.UI.BusinessObject} o object
     * @param {Object} p parameters
     * @param {Object[]} p.list    array of fields
     * @param {Object[]} p.search  array of fields
     * @param {Object[]} p.actions array of actions
     * @param {boolean}  p.actionLabel show/hide the action labels ?
     * @param {function} p.restore restore handler
     * @param {function} p.save    save handler
     * @param {function} p.reload  reload handler
     * @param {function} p.close   close handler
     * @function
     */
    display(o: BusinessObject, p: PrefsParam): this;
    /**
     * Title of user filters
     * @param {(string|jQuery)} ctn optional container (#userfilters if null)
     * @param {Simplicite.UI.BusinessObject} obj UserFilters object
     * @function
     */
    userFiltersTitle(ctn: AnyContainer, obj: BusinessObject): void;
    /**
     * Badge of a user filter
     * @param {jQuery} ctn badges container
     * @param {Object} data <code>\{ dmin, dmax \}</code> or <code>\{ field, value or values \}</code>
     * @param {function} remove optional handler to remove filter (if not required)
     * @param {function} click optional handler on click
     * @function
     */
    userFiltersBadge(ctn: Container, data: KeyObject, remove?: JQueryHandler, click?: JQueryHandler): JQuery<HTMLElement> | null;
    /**
     * Display the dialog of user global filters
     * @param {(string|jquery)} ctn optional container (dialog if null)
     * @param {Simplicite.UI.BusinessObject} obj UserFilters object
     * @param {string} id UserFilters id
     * @param {Object} p options <code>\{ bar \}</code>
     * @function
     */
    userFilters(ctn: AnyContainer | null, obj: UIBusinessObject, id: string, p?: UserFilterParam): this | undefined;
    /**
     * Display the user's bookmarks
     * @param {(string|jquery)} ctn optional container (default popup)
     * @param {Object} bm bookmarks
     * @param {Object} p options show=top|bottom
     * @function
     */
    bookmarks(ctn: AnyContainer, bm: Bookmarks, p: BookmarkParam): void;
}

type TimesheetData = {
    action?: string;
    name: string;
    resId?: string;
    start?: string;
    end?: string;
    data?: KeyObject;
    swap?: boolean;
    today?: boolean;
    showall?: boolean;
    shift?: TimesheetShift;
    gantt?: string;
};
type TimesheetTotal = {
    total: number;
    subtotal: number;
    workload: number;
};
type TimesheetLine = {
    id: string;
    id1: string;
    label1: string;
    id2: string;
    label2: string;
    groupby: number;
    begin: string;
    end: string;
    inputs: {
        [key: string]: string[];
    };
    totals: TimesheetTotal[];
    sfield?: ObjectField;
    status?: string;
};
type TimesheetPeriod = {
    key: string;
    day: string;
    open?: boolean;
    read?: boolean;
};
type TimesheetShift = 1 | -1;
type TimesheetMetadata = {
    ctn: Container;
    id: string;
    name: string;
    type: "D" | "W" | "Y";
    readOnly?: boolean;
    backward?: boolean;
    useSheet?: boolean;
    useChart?: boolean;
    showChart?: boolean;
    swapInput?: boolean;
    showall?: boolean;
    start?: string;
    end?: string;
    today?: boolean;
    shift?: TimesheetShift;
    assign: string;
    object: UIBusinessObject;
    id1?: string;
    obj1?: string;
    field1: string;
    id2?: string;
    obj2?: string;
    field2: string;
    lines: TimesheetLine[];
    status: EnumItem[];
    inputs: ObjectField[];
    periods: TimesheetPeriod[];
    groups: number[];
    chart?: Chart;
    save: (cbk?: Callback) => void;
    close: Callback;
    redraw?: Callback;
    read?: () => KeyObject;
    swap?: Callback;
    showToday?: Callback;
    add?: Callback;
    open?: (obj: string, id: string, form: boolean) => void;
    onshift: (sign: number) => void;
};
type TimesheetParam = {
    ts: TimesheetMetadata;
    msg?: MessageJSON[];
};
type TimesheetOptions = NavParam & {
    beforeload?: (ctn: Container, obj: UIBusinessObject, ts: TimesheetMetadata) => void;
    onload?: (ctn: Container, obj: UIBusinessObject, ts: TimesheetMetadata) => void;
    onunload?: (ctn: Container, obj: UIBusinessObject, ts: TimesheetMetadata) => void;
};
type TimesheetGanttData = {
    period: TimesheetPeriod[];
    meta: KeyObject;
    data: KeyObject;
};
type TimesheetGanttParam = {
    inst?: string;
    start?: string;
    end?: string;
} & NavParam;
/**
 * Timesheet rendering
 * @class
 */
declare class Timesheet {
    display(ctn: Container, obj: BusinessObject, t: TimesheetParam, cbk?: Callback): void;
    /**
     * Read form data
     * field name => assign id => period key: value
     */
    private read;
    /**
     * Bulk transition
     */
    private transition;
    /**
     * Format float
     */
    private format;
    private grid;
    private fixed;
    _colors: KeyString;
    /**
     * Generate a color to resource label
     */
    private color;
    /**
     * Resource chart
     */
    private chart;
    /**
     * Gantt chart
     * @function
     */
    displayGantt(ctn: Container, obj: BusinessObject, tsName: string, data: TimesheetGanttData, upd?: (p: KeyObject, cbk: (err: MessageJSON) => void) => void, cbk?: Callback): void;
}

/**
 * Trays rendering
 * @class
 */
declare class UITray {
    /**
     * Display the trays form
     * @param {jQuery} ctn container
     * @param {jQuery} div optional div.tray to fill
     * @param {Array} trays list of trays with items
     * @param {Object} p optional parameters
     * @param {function} cbk optional callback
     * @function
     */
    display(ctn: Container, div: JQuery, trays: TrayColumn[], p: {
        cls?: string;
        findItem?: (e: JQuery.Event) => JQuery | undefined;
        getItemId?: (item: JQuery) => string;
        getTrayName?: (tray: JQuery) => string;
    }, cbk?: Callback): this;
}

/**
 * UI Action
 * @class
 */
declare class UIAction extends UIComponent {
    /** business object */
    obj: UIBusinessObject;
    /**
     * UI Action
     * @param {jQuery} ctn container
     * @param {BusinessObject} obj object
     * @param {Sim.Model.Action} action Action metadata
     * @class
     */
    constructor(ctn: Container, obj: UIBusinessObject, action: Action);
    /**
     * Bind a 'click' on button
     * @param {function} handler related handler
     * @memberof Simplicite.UI.View.UIAction
     * @function
     */
    click(handler: JQueryHandler): JQuery<HTMLElement> | undefined;
    /**
     * Enable/Disable the action
     * @param {boolean} enabled false to disable
     * @memberof Simplicite.UI.View.UIAction
     * @function
     */
    enable(enabled: boolean): this;
    /**
     * Show/Hide the action
     * @param {boolean} vis visibility ? false to hide
     * @memberof Simplicite.UI.View.UIAction
     * @function
     */
    visible(vis: boolean): this;
}

type AreaParam = {
    parse?: boolean;
    readonly?: boolean | "editcell";
    formActions?: Action[] | null;
    plusActions?: Action[] | null;
    workflow?: boolean;
    isExtended?: boolean;
    index?: string;
    tabNum?: number;
    formTab?: KeyObject;
    saveBtn?: JQuery;
    showViews?: ShowViewsMode;
    visView?: number;
    search?: boolean;
    fixedFilters?: KeyObject;
};
declare class UIArea extends UIComponent {
    obj: UIBusinessObject;
    def: Area;
    body: Container;
    tabs?: Container;
    tab?: Container;
    constructor(ctn: Container, obj: UIBusinessObject, area: Area);
    /**
     * Show/Hide the area
     * @param {boolean} vis visibility ? false to hide
     * @memberof Simplicite.UI.View.UIArea
     * @function
     */
    visible(vis: boolean, slide?: boolean): this;
    /**
     * Render the area
     * @param {Object} options
     * @param {boolean} options.parse
     * @memberof Simplicite.UI.View.UIArea
     * @function
     */
    render(options?: AreaParam): JQuery;
    /**
     * Display a template with components substitution
     * @param {$} d The container to fill
     * @param {string|$} template Optional template to re-apply
     * @param {Object} options Form options
     * @param {boolean}	options.parse Parse the full template
     * @param {boolean}	options.readonly true to insert readonly fields, or "editcell" to edit only editbale fields by cell
     * @param {Array}	options.formActions Main actions
     * @param {Array}	options.plusActions Extended actions
     * @param {boolean}	options.isExtended Extended form?
     * @param {boolean}	options.search in a search area?
     * @param {object}	options.formTab Selected tabs index
     * @param {$} 		options.saveBtn Optional Save button after last ENTER
     * @memberof Simplicite.UI.View.UIArea
     * @function
     */
    display(d: Container, template: string | JQuery | null, options?: AreaParam): void;
    /**
     * Build a field
     * @memberof Simplicite.UI.View.UIArea
     * @function
     */
    field(f: ObjectField, disp: FieldDisplay, p: AreaParam): string | JQuery<HTMLElement> | undefined;
    /**
     * Build a field with ENTER handler
     * @memberof Simplicite.UI.View.UIArea
     * @function
     */
    static formField(ctn: Container, obj: UIBusinessObject, f: ObjectField, disp: FieldDisplay, p?: {
        readonly?: boolean | string;
        index?: string;
        saveBtn?: JQuery;
    }): string | JQuery<HTMLElement> | undefined;
    /**
     * Show/hide tabs/panels containing something visible
     * @param {boolean} slide Slide effect?
     * @memberof Simplicite.UI.View.UIArea
     * @function
     */
    visibleAreas(slide?: boolean): void;
    /**
     * Show/hide a view and parent panels
     * @param {object} el target element
     * @param {object} view optional view
     * @param {boolean} vis show or hide
     * @param {boolean} slide slide effect?
     * @memberof Simplicite.UI.View.UIArea
     * @function
     */
    visibleView(el: HTMLElement, view?: View, vis?: boolean, slide?: boolean): void;
    /**
     * Object Views and Links
     * @param div append links to the container
     * @param p form context
     * @memberof Simplicite.UI.View.UIArea
     * @function
     */
    displayViews(div: JQuery, p: AreaParam): void;
    /**
     * Display a link or view related to object
     * @param {jQuery} div container to fill
     * @param {Object} v view metadata
     * @param {Object} l or 0,n link
     * @param {Object} p optional form context to add a promise
     * @memberof Simplicite.UI.View.UIArea
     * @function
     */
    displayLink(div: JQuery, v: View, l?: Link | null, p?: AreaParam): void;
    /**
     * Add a counter in the tab label
     * @memberof Simplicite.UI.View.UIArea
     * @function
     */
    countRef(v: View, id: string, div: JQuery): void;
}

type ViewFilter = {
    period?: boolean;
    periodFromDate?: string;
    periodToDate?: string;
    meta?: KeyObject;
    filters?: {
        object: string;
        field: string;
        filter: string;
    }[];
    vertical?: boolean;
    compact?: boolean;
};
/**
 * UI View
 * @class
 */
declare class UIView extends UIComponent {
    def: View;
    /**
     * UI View
     * @param {jQuery} ctn container
     * @param {Object} def View metadata
     */
    constructor(ctn: Container, def: View);
    /**
     * Display a view of items in container (i.e. home, plain view or part of form)
     * @param {Object} options options
     * @param {Object} options.parent  parent object when the view belongs to a form
     * @param {boolean} options.home is a home view?
     * @param {boolean} options.lazy load tabs content in lazy mode / on click (default true)
     * @param {boolean} options.edit edit mode for gridstack
     * @function
     */
    render(options: {
        parent?: BusinessObject;
        home?: boolean;
        lazy?: boolean;
        edit?: boolean;
        useCopyLink?: boolean;
    }, cbk?: Callback): JQuery;
    /**
     * Display the view filters
     * @param {jQuery} ctn Container of view
     * @param {jQuery} div Container of filters
     * @param {Object} options Filters definition
     * @param {boolean} options.period Show a date period?
     * @param {string}  options.periodFromDate optional min date filter
     * @param {string}  options.periodToDate optional max date filter
     * @param {Object}  options.meta all meta-data with search fields
     * @param {Array}   options.filters optional list of object/field/filter
     * @param {function} cbk Optional callback
     * @memberof Simplicite.UI.View.UIView
     * @function
     */
    renderFilters(ctn: Container, div: Container, options: ViewFilter, cbk?: Callback): JQuery<HTMLElement>;
    /**
     * Show/Hide the view
     * @param {boolean} vis visibility ? false to hide
     * @param {boolean} slide optional slide effect
     * @memberof Simplicite.UI.View.UIView
     * @function
     */
    visible(vis: boolean, slide?: boolean): this;
    /**
     * Grid stack rendering
     * @param {$} ctn View container
     * @param {Object} el Element .grid-stack
     * @param {boolean} edit true to edit the view
     * @param {Object} options id, edit, cellHeight, float, removable, staticGrid, acceptWidgets...
     * @memberof Simplicite.UI.View.UIView
     * @function
     */
    grid(ctn: Container, el: HTMLElement, edit?: boolean, options?: KeyObject): Promise<void>;
}

/**
 * UI Field Boolean
 * @class
 */
declare class UIFieldBoolean extends UIField {
    /**
     * Get all inputs related to field
     * @param {boolean} checked search only checked input ?
     * @memberof Simplicite.UI.View.UIFieldBoolean
     * @return field UI elements (input, select...)
     * @function
     */
    find(checked: boolean): JQuery;
    /**
     * Get/Set a service value to UI
     * <ul>
     * <li>get: v undefined = return the UI value converted to service</li>
     * <li>set: v is a server value = to be set on UI and field.v</li>
     * </ul>
     * @param {FieldValue} v optional value (service syntax)
     * @return set: itself / get: the UI value converted to service
     * @memberof Simplicite.UI.View.UIFieldBoolean
     * @function
     */
    val(v?: FieldValue): string | boolean | this;
    /**
     * Draw the UI input
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    drawInput(): JQuery;
    /**
     * Draw the search field
     * @param {string} filter Filter
     * @param {Object} options Options
     * @param {boolean} options.searchby Search by field of list header
     * @param {function} options.search search handler
     * @memberof Simplicite.UI.View.UIFieldBoolean
     * @function
     */
    drawSearch(filter: string, options?: KeyObject): JQuery;
}

/**
 * UI Field color
 * - draw a preview area and a color picker based on spectrum
 * - trigger event 'ui.preview.color' on input field to preview the color
 * @class
 */
declare class UIFieldColor extends UIField {
    /**
     * Draw the UI controls
     * @memberof Simplicite.UI.View.UIFieldColor
     * @function
     */
    draw(): JQuery;
}

/**
 * UI Field Date time
 * @class
 */
declare class UIFieldDateTime extends UIField {
    /**
     * Init field components (with flatpickr as date picker)
     * @memberof Simplicite.UI.View.UIFieldDateTime
     * @function
     */
    init(p?: KeyObject): this;
    /**
     * Get the flatpickr instance
     * @memberof Simplicite.UI.View.UIFieldDateTime
     * @function
     */
    getDatePicker(): Instance;
    /**
     * Destroy the flatpickr instance
     * @memberof Simplicite.UI.View.UIFieldDateTime
     * @function
     */
    destroy(p: KeyObject): this;
    /**
     * Draw the UI controls
     * @memberof Simplicite.UI.View.UIFieldDateTime
     * @function
     */
    draw(): JQuery;
    /**
     * Render the search field (with datetime picker)
     * @param {string} filter Filter
     * @param {Object} options Options
     * @param {boolean} options.searchby Search by field of list header
     * @param {function} options.search search handler
     * @memberof Simplicite.UI.View.UIFieldDateTime
     * @function
     */
    renderSearch(filter: string, options?: {
        searchby?: boolean;
        search?: Callback;
    }): JQuery;
    static icon(type: number | string, ariaLabel: string, click: JQueryHandler): JQuery<HTMLElement>;
    /**
     * Convert a server side date 'YYYY-MM-DD HH:MI:SS' to Date
     * @param v A date or datetime or null or a filter %
     * @returns Date or undefined if not a date
     */
    toDate(v?: string | null): Date | undefined;
    /**
     * Manage change event to set min/maxDate
     * @param ctn Container
     * @param dp  Date picker instance
     * @param field Field name to bind onchange
     * @param value Optional date value YYYY-MM-DD HH:MI:SS
     * @param prop  property minDate or maxDate to set to picker
     * @param read  readonly?
     */
    changeDate(ctn: Container, dp: Instance | undefined, field: string, value: string, prop: "minDate" | "maxDate", read: boolean): void;
    /**
     * Date picker parameters (based on flatpickr options)
     * @function
     */
    dpParam(type: number, lang: string, df: string, rdg?: string, autoopen?: string | boolean): Options;
    /**
     * Get a datepicker input-group
     * @param ctn optional container to append the picker (default is the input-group)
     * @param options options
     * @param options.input optional input element (create one if not specified)
     * @param options.type $ui.TYPE_DATE (default) or $ui.TYPE_DATETIME or $ui.TYPE_TIME
     * @param options.rendering optional field rendering
     * @param options.autoopen true to open the picker on click
     * @param options.clear true to add a clear button
     * @returns input group with input and buttons
     * @function
     */
    static datePicker(ctn: Container | null, options?: {
        input?: JQuery;
        type?: number;
        rendering?: string;
        autoopen?: boolean;
        clear?: boolean;
        label?: string;
    }): JQuery<HTMLElement>;
    /**
     * Build datetime picker parameters (based on flatpickr options)
     * @function
     */
    static datePickerParam(type: number, lang: string, dateformat: string, rdg?: string, autoopen?: string | boolean): Options;
    /**
     * Human-readable input format hint for typed date entry
     * @function
     */
    private formatHint;
    private timeHint;
}
/**
 * Add action buttons to flatpickr
 * ```
 * flatpickr('.target-input-element', {
 *     // ...
 *     plugins: [buttonsPlugin({
 *         buttons: [{
 *             icon: "fas/calendar-day"
 *             label: "TODAY",
 *             click: (p: PickerInstance) => p.setDate(new Date())
 *         }],
 *         theme: 'light'
 *     })]
 * })
 * ```
 */
declare function buttonsPlugin(config: {
    buttons?: {
        icon?: string;
        label: string;
        click: (p: Instance) => void;
    }[];
    theme?: string;
}): Plugin;
/**
 * Simple year picker plugin
 * ```
 * flatpickr('.target-input-element', {
 *     // ...
 *     plugins: [yearPlugin({ minYear, maxYear })]
 * })
 * ```
 */
declare function yearPlugin(config?: {
    minYear?: number;
    maxYear?: number;
}): Plugin;
/**
 * Month picker plugin
 * ```
 * flatpickr('.target-input-element', {
 *     // ...
 *     plugins: [monthSelectPlugin({ config })]
 * })
 * ```
 */
type MonthSelectConfig = {
    shorthand: boolean;
    dateFormat: string;
    altFormat: string;
    theme: string;
    _stubbedCurrentMonth?: number;
};

/**
 * UI Field Date
 * @class
 */
declare class UIFieldDate extends UIFieldDateTime {
}

/**
 * UI Field Time
 * @class
 */
declare class UIFieldTime extends UIFieldDateTime {
}

/**
 * UI Field Document
 * @class
 */
declare class UIFieldDocument extends UIField {
    /**
     * Get all inputs related to field
     * @memberof Simplicite.UI.View.UIFieldDocument
     * @return field UI elements (input, select...)
     * @function
     */
    find(_checked: boolean): JQuery;
    /**
     * Get/Set a service value to UI
     * <ul>
     * <li>get: v undefined = return the UI value converted to service</li>
     * <li>set: v is a server value = to be set on UI and field.v</li>
     * </ul>
     * @param {*} v optional value (service syntax)
     * @return set: itself / get: the UI value converted to service
     * @memberof Simplicite.UI.View.UIFieldDocument
     * @function
     */
    val(v?: FieldValue): any;
    /**
     * Draw the UI controls
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    draw(p: KeyObject): JQuery;
}

/**
 * UI Field Image
 * @class
 */
declare class UIFieldImage extends UIFieldDocument {
}

/**
 * UI Field Integer
 * @class
 */
declare class UIFieldInt extends UIField {
    /**
     * Get all inputs related to field
     * @param {boolean} checked search only checked radio in case of stars rendering ?
     * @memberof Simplicite.UI.View.UIFieldInt
     * @return field UI elements (input, select...)
     * @function
     */
    find(checked: boolean): JQuery;
    /**
     * Init field components
     * @memberof Simplicite.UI.View.UIFieldInt
     * @function
     */
    init(p?: KeyObject): this;
    /**
     * Draw the UI controls
     * @memberof Simplicite.UI.View.UIFieldInt
     * @function
     */
    draw(): JQuery<HTMLElement>;
    /**
     * Draw the search field
     * @param {string} filter Filter
     * @param {Object} options Options
     * @param {boolean} options.searchby Search by field of list header
     * @param {function} options.search search handler
     * @memberof Simplicite.UI.View.UIFieldInt
     * @function
     */
    drawSearch(filter: string, options?: KeyObject): JQuery | FieldSearch | FieldSearch[];
}

/**
 * UI Field Float
 * @class
 */
declare class UIFieldFloat extends UIFieldInt {
}

/**
 * UI Field Big decimal
 * @class
 */
declare class UIFieldBigDecimal extends UIFieldInt {
    /**
     * Get/Set a service value to UI
     * <ul>
     * <li>get: v undefined = return the UI value converted to service</li>
     * <li>set: v is a server value = to be set on UI and field.v</li>
     * </ul>
     * @param {*} v optional value (service syntax)
     * @return set: itself / get: the UI value converted to service
     * @memberof Simplicite.UI.View.UIFieldBigDecimal
     * @function
     */
    val(v?: FieldValue): string | number | boolean | this | null;
    /**
     * Init field components
     * @memberof Simplicite.UI.View.UIFieldBigDecimal
     * @function
     */
    init(): this;
}

/**
 * UI Field email
 * @class
 */
declare class UIFieldEmail extends UIField {
    /**
     * Draw the UI controls
     * @memberof Simplicite.UI.View.UIFieldEmail
     * @function
     */
    draw(): JQuery;
}

/**
 * UI Field Enum
 * @class
 */
declare class UIFieldEnum extends UIField {
    /**
     * Get all inputs related to field
     * @param {boolean} checked search only checked input ?
     * @memberof Simplicite.UI.View.UIFieldEnum
     * @return field UI elements (input, select...)
     * @function
     */
    find(checked?: boolean): JQuery;
    /**
     * Get/Set a service value to UI
     * <ul>
     * <li>get: v undefined = return the UI value converted to service</li>
     * <li>set: v is a server value = to be set on UI and field.v</li>
     * </ul>
     * @param {FieldValue} v optional value (service syntax)
     * @return set: itself / get: the UI value converted to service
     * @memberof Simplicite.UI.View.UIFieldEnum
     * @function
     */
    val(v?: FieldValue): string | number | string[] | this | undefined;
    /**
     * Load and redraw the list of values
     * @param {string} lov List of values name
     * @param {function} cbk Optional callback(response)
     * @memberof Simplicite.UI.View.UIFieldEnum
     * @function
     */
    setList(lov: string, cbk: (r: KeyObject) => void): this;
    /**
     * Init field components
     * @memberof Simplicite.UI.View.UIFieldEnum
     * @function
     */
    init(p: KeyObject): this;
    /**
     * Destroy field components
     * @memberof Simplicite.UI.View.UIFieldEnum
     * @function
     */
    destroy(p: KeyObject): this;
    /**
     * Transform radios/checks into columns
     * @param {jQuery} inp Input
     * @param {number} n number of columns
     * @param {boolean} vertical vertical?
     * @memberof Simplicite.UI.View.UIFieldEnum
     * @function
     */
    cols(inp: JQuery, n: number, vertical: boolean): void;
    /**
     * Draw the UI controls
     * @memberof Simplicite.UI.View.UIFieldEnum
     * @function
     */
    draw(): JQuery;
    /**
     * Draw the search field (enum and enum-multi)
     * @param {Array|string} filter Filter codes to display: array of codes or separated by ';' or expression "is null", "is not null", "in ('a','b') or is null"
     * @param {Object} options Options
     * @param {boolean} options.searchby Search by field of list header
     * @param {function} options.search search handler
     * @memberof Simplicite.UI.View.UIFieldEnum
     * @function
     */
    drawSearch(filter?: string | string[], options?: KeyObject): JQuery | FieldSearch | FieldSearch[];
    /**
     * Render the value with item icon / colored tag
     * @param {String} v field value (enum code)
     * @param {Object} item optional item on list / with icon, tag, color, bgcolor, hideLabel (default use definition of field)
     * @returns div.enum
     * @memberof Simplicite.UI.View.UIFieldEnum
     * @function
     */
    renderValue(v: FieldValue, item?: EnumItem): string | JQuery;
}

/**
 * UI Field Enum multiple
 * @class
 */
declare class UIFieldEnumMulti extends UIFieldEnum {
    /**
     * Get all inputs related to field
     * @param {boolean} checked search only checked input ?
     * @memberof Simplicite.UI.View.UIFieldEnumMulti
     * @return field UI elements (input, select...)
     * @function
     */
    find(checked?: boolean): JQuery;
    /**
     * Get/Set a service value to UI
     * <ul>
     * <li>get: v undefined = return the UI value converted to service</li>
     * <li>set: v is a server value = to be set on UI and field.v</li>
     * </ul>
     * @param {(Array|String)} [v] optional value to set (Array of codes, or separated with ';')
     * @return set: itself / get: the UI value converted to service
     * @memberof Simplicite.UI.View.UIFieldEnumMulti
     * @function
     */
    val(v?: FieldValue): string[] | this;
    /**
     * Init field components
     * @memberof Simplicite.UI.View.UIFieldEnumMulti
     * @function
     */
    init(p: KeyObject): this;
    /**
     * Draw the UI controls
     * @memberof Simplicite.UI.View.UIFieldEnumMulti
     * @function
     */
    draw(): JQuery;
    /**
     * Add event handlers for select/unselect all functionality
     * @param {jQuery} inp input element
     * @param {string} rdg rendering mode
     * @memberof Simplicite.UI.View.UIFieldEnumMulti
     * @function
     */
    addSelectAllHandlers(inp: JQuery, rdg?: string): void;
    /**
     * Render the value with item icon / colored tag
     * @param {Array} v field values (enum codes)
     * @returns ul.enum
     * @memberof Simplicite.UI.View.UIFieldEnumMulti
     * @function
     */
    renderValue(v: FieldValue): string | JQuery;
}

/**
 * UI Field geo coords
 * @class
 */
declare class UIFieldGeoCoords extends UIField {
    /**
     * Draw the UI controls
     * @memberof Simplicite.UI.View.UIFieldGeoCoords
     * @function
     */
    draw(): JQuery;
    /**
     * Helper to assist common filter expression
     * @param {Simplicite.Ajax.ObjectField} f object field
     * @param {jQuery} input search input to assist
     * @param {string} type helper type 'number' or 'string'
     * @param {function} onOk optional callback(expression)
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    searchHelper(f: ObjectField, input: JQuery): void;
}

/**
 * UI Field HTML
 * @class
 */
declare class UIFieldHtml extends UIField {
    constructor(ctn: Container, obj: UIBusinessObject | null, f: ObjectField, index?: string);
    /**
     * Get/Set a service value to UI
     * <ul>
     * <li>get: v undefined = return the UI value converted to service</li>
     * <li>set: v is a server value = to be set on UI and field.v</li>
     * </ul>
     * @param {*} v optional value (service syntax)
     * @return set: itself / get: the UI value converted to service
     * @memberof Simplicite.UI.View.UIFieldHtml
     * @function
     */
    val(v?: FieldValue): any;
    /**
     * Init field components
     * @param {Object} p context parameters (form, formTab to focus, inline field of link, parent object, isExtended, hasMore, refb buttons, promises...)
     * @memberof Simplicite.UI.View.UIFieldHtml
     * @function
     */
    init(p: KeyObject): this;
    /**
     * Destroy field components
     * @memberof Simplicite.UI.View.UIFieldHtml
     * @function
     */
    destroy(p?: KeyObject): this;
    /**
     * Draw the UI controls
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    drawInput(): JQuery;
}

/**
 * UI Field ID
 * @class
 */
declare class UIFieldId extends UIField {
    /**
     * Draw the search field
     * @param {string} filter Filter
     * @memberof Simplicite.UI.View.UIFieldId
     * @function
     */
    drawSearch(filter: string, options?: KeyObject): JQuery | FieldSearch | FieldSearch[];
}

/**
 * UI Field Long string
 * @class
 */
declare class UIFieldLongString extends UIField {
    /**
     * Get/Set a service value to UI
     * <ul>
     * <li>get: v undefined = return the UI value converted to service</li>
     * <li>set: v is a server value = to be set on UI and field.v</li>
     * </ul>
     * @param {FieldValue} v optional value (service syntax)
     * @return set: itself / get: the UI value converted to service
     * @memberof Simplicite.UI.View.UIFieldLongString
     * @function
     */
    val(v?: FieldValue): any;
    /**
     * Init field components (ace or grid)
     * @param {Object} p context parameters (form, formTab to focus, inline field of link, parent object, isExtended, hasMore, refb buttons, promises...)
     * @memberof Simplicite.UI.View.UIFieldLongString
     * @function
     */
    init(p: KeyObject): this;
    /**
     * Destroy field components (ace editor)
     * @memberof Simplicite.UI.View.UIFieldLongString
     * @function
     */
    destroy(p: KeyObject): this;
    /**
     * Draw the UI controls
     * @memberof Simplicite.UI.View.UIFieldLongString
     * @function
     */
    draw(): JQuery;
}

/**
 * UI Field Notepad
 * @class
 */
declare class UIFieldNotepad extends UIField {
    /**
     * Get/Set a service value to UI
     * <ul>
     * <li>get: v undefined = return the UI value converted to service</li>
     * <li>set: v is a server value = to be set on UI and field.v</li>
     * </ul>
     * @param {FieldValue} v optional value (service syntax)
     * @return set: itself / get: the UI value converted to service
     * @memberof Simplicite.UI.View.UIFieldNotepad
     * @function
     */
    val(v?: FieldValue): any;
    /**
     * Init field components
     * @memberof Simplicite.UI.View.UIFieldNotepad
     * @function
     */
    init(p: KeyObject): this;
    /**
     * Draw the UI input
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    drawInput(): JQuery;
}

/**
 * UI Field Meta-object
 * @class
 */
declare class UIFieldObject extends UIField {
    /**
     * Get/Set a service value to UI
     * <ul>
     * <li>get: v undefined = return the UI value converted to service</li>
     * <li>set: v is a server value = to be set on UI and field.v</li>
     * </ul>
     * @param {(String|Object)} v optional value "object:row_id" or \{ object, row_id, optional parent \}
     * @return set: itself / get: the UI value converted to service
     * @memberof Simplicite.UI.View.UIFieldObject
     * @function
     */
    val(v?: FieldValue): this | {
        object: string;
        row_id: string;
    } | null;
    /**
     * Draw the UI controls
     * @memberof Simplicite.UI.View.UIFieldObject
     * @function
     */
    draw(): JQuery;
    /**
     * Draw the search field
     * @param {string} filter Filter
     * @param {Object} options Options
     * @param {boolean} options.searchby Search by field of list header
     * @param {function} options.search search handler
     * @memberof Simplicite.UI.View.UIFieldObject
     * @function
     */
    drawSearch(filter: string, options?: KeyObject): JQuery | FieldSearch | FieldSearch[];
}

/**
 * UI Field phone num
 * @class
 */
declare class UIFieldPhoneNum extends UIField {
    /**
     * Draw the UI controls
     * @memberof Simplicite.UI.View.UIFieldPhoneNum
     * @function
     */
    draw(): JQuery;
}

/**
 * UI Field regexp
 * @class
 */
declare class UIFieldRegexp extends UIField {
}

/**
 * UI Field URL
 * @class
 */
declare class UIFieldUrl extends UIField {
    /**
     * Draw the UI controls
     * @memberof Simplicite.UI.View.UIFieldUrl
     * @function
     */
    draw(): JQuery;
}

/**
 * Simplicite Ajax / model classes
 * @memberof Simplicite
 */
declare const Ajax: typeof Session;
/**
 * Simplicite UI / rendering classes
 * @memberof Simplicite
 */
declare const UI: {
    Globals: {
        globals: BackendConstants;
        container: JQuery | null;
        title: string;
        engine: string;
        deeplink: string | undefined;
        resources: LoadPart[] | null;
        ajaxSetup: {
            crossDomain: boolean;
            xhrFields: {
                withCredentials: boolean;
            };
            headers: KeyString;
        };
        context: {
            object: "ObjectExternal" | "ObjectInternal" | null;
            name: string | null;
            rowId: string | null;
        };
        theme: string | null;
        themeBase: ThemeBase | null;
        font: Font | string | null;
        monospaceFont: Font | string | null;
        fontSize: string;
        compact: boolean;
        splitter: SplitterOptions;
        a11y: A11yOptions;
        defaultContentLoad: JQueryHandler | null;
        defaultContentUnload: JQueryHandler | null;
        onload: CallableFunction | null;
        onbeforeunload: CallableFunction | null;
        onunload: CallableFunction | null;
        onlogout: CallableFunction | null;
        useMainParts: boolean;
        useSocial: boolean;
        socialShare: KeyObject | undefined;
        useCopyLink: boolean;
        useUndoRedo: boolean;
        scope: {
            name: string | undefined;
            enabled: boolean;
        };
        shortcuts: boolean;
        slideNav: boolean;
        exports: {
            CSV: {
                enabled: boolean;
                sep: string;
            };
            XLS: {
                enabled: boolean;
            };
            PDF: {
                enabled: boolean;
            };
            ARC: {
                enabled: boolean;
            };
            XML: {
                enabled: boolean;
                inline: boolean;
                timestamp: boolean;
            };
            JSON: {
                enabled: boolean;
                inline: boolean;
                timestamp: boolean;
            };
            YAML: {
                enabled: boolean;
                inline: boolean;
                timestamp: boolean;
            };
            ZIP: {
                enabled: boolean;
            };
        };
        tinymceOptions: {
            plugins: string[];
            toolbar: string;
            menubar: string;
            statusbar: boolean;
            paste_data_images: boolean;
            paste_as_text: boolean;
            browser_spellcheck: boolean;
            contextmenu: boolean;
            selector: string;
            language: string;
            height: number;
        };
        quillOptions: Quill.QuillOptions;
        list: ListParam;
        form: FormParam;
        search: SearchParam;
        summary: SummaryParam;
        agenda: CalendarParam;
        timesheet: TimesheetOptions;
        news: {
            template: string;
        };
    };
    Engine: typeof UIEngine;
    Navigator: typeof UINavigator;
    Util: typeof UIUtil;
    Loader: typeof UILoader;
    Factory: typeof Factory;
    BusinessObject: typeof UIBusinessObject;
    BusinessProcess: typeof UIBusinessProcess;
    ExternalObject: typeof UIExternalObject;
    SyncQueue: typeof SyncQueue;
    Workflow: typeof Workflow;
    Calendar: typeof UICalendar;
    Firebase: typeof Firebase;
    WebPush: typeof WebPush;
    Tray: typeof Tray;
    OCR: typeof OCR;
    Map: typeof UIMap;
    Charts: typeof Charts;
    Guide: typeof Guide;
    Speech: typeof Speech;
    View: {
        Bootstrap5: typeof Bootstrap5;
        Main: typeof UIViewer;
        Widget: typeof Widget;
        Menu: typeof Menu;
        Board: typeof Board;
        List: typeof List;
        Form: typeof Form;
        Search: typeof Search;
        Update: typeof Update;
        Social: typeof Social;
        Color: typeof UIColor;
        ColorPicker: typeof ColorPicker;
        Crosstab: typeof Crosstab;
        External: typeof External;
        Import: typeof Import;
        Merge: typeof Merge;
        Bam: typeof Bam;
        ZIP: typeof ZIP;
        Tree: typeof Tree;
        Prefs: typeof Prefs;
        Timesheet: typeof Timesheet;
        IndexSearch: typeof IndexSearch;
        Tray: typeof UITray;
        Component: typeof UIComponent;
        UIAction: typeof UIAction;
        UIArea: typeof UIArea;
        UIView: typeof UIView;
        UIField: typeof UIField;
        UIFieldBoolean: typeof UIFieldBoolean;
        UIFieldColor: typeof UIFieldColor;
        UIFieldDate: typeof UIFieldDate;
        UIFieldDateTime: typeof UIFieldDateTime;
        UIFieldTime: typeof UIFieldTime;
        UIFieldDocument: typeof UIFieldDocument;
        UIFieldImage: typeof UIFieldImage;
        UIFieldFloat: typeof UIFieldFloat;
        UIFieldInt: typeof UIFieldInt;
        UIFieldBigDecimal: typeof UIFieldBigDecimal;
        UIFieldEmail: typeof UIFieldEmail;
        UIFieldEnum: typeof UIFieldEnum;
        UIFieldEnumMulti: typeof UIFieldEnumMulti;
        UIFieldGeoCoords: typeof UIFieldGeoCoords;
        UIFieldHtml: typeof UIFieldHtml;
        UIFieldId: typeof UIFieldId;
        UIFieldLongString: typeof UIFieldLongString;
        UIFieldNotepad: typeof UIFieldNotepad;
        UIFieldObject: typeof UIFieldObject;
        UIFieldPhoneNum: typeof UIFieldPhoneNum;
        UIFieldRegexp: typeof UIFieldRegexp;
        UIFieldUrl: typeof UIFieldUrl;
    };
    /**
     * Business object class definitions with front hooks
     * @memberof Simplicite.UI
     * @namespace
     */
    BusinessObjects: KeyBusinessObjectHook;
    /**
     * Object hooks: <code>Simplicite.UI.hooks['myObject'] = function(obj, cbk) \{\}</code>
     * @memberof Simplicite.UI
     * @namespace
     */
    hooks: KeyObjectHook;
    /**
     * External object class definitions with front hooks
     * @memberof Simplicite.UI
     * @namespace
     */
    ExternalObjects: KeyExternalObject;
    /**
     * Business process class definitions with front hooks
     * @memberof Simplicite.UI
     * @namespace
     */
    BusinessProcesses: KeyBusinessProcessHook;
    /**
     * Object contraints: <code>Simplicite.UI.constraints['myObject'] = function(ctn, obj, elt, index, context, cbk) \{\}</code>
     * @memberof Simplicite.UI
     * @namespace
     */
    constraints: KeyConstraint;
    /**
     * Predefined colors
     * @memberof Simplicite.UI
     * @constant
     */
    CSSColors: CSSColors[];
    /**
     * Icons meta-data
     * @memberof Simplicite.UI
     * @constant
     */
    icons: IconsMetadata;
};

/**
 * Factory singleton
 * @global
 */
declare const $factory: Factory;
/**
 * Console
 * @global
 */
declare const $console: Console;
/**
 * UI main navigator
 * @global
 */
declare const $nav: UINavigator;
/**
 * Global bootstrap tools
 * @global
 */
declare const $tools: Bootstrap5;
/**
 * UI Viewer
 * @global
 */
declare const $view: UIViewer;
/**
 * UI global singleton
 * @global
 */
declare const $ui: UIEngine;
/**
 * Session singleton
 * @global
 */
declare const $app: Session;
/**
 * Grant singleton
 * @global
 */
declare const $grant: Grant;

declare type Translate = (code: string, plural?: boolean) => string;
declare global {
    interface Window {
        $factory: Factory;
        $app: Session;
        $grant: Grant;
        $ui: UIEngine;
        $view: UIViewer;
        $tools: Bootstrap5;
        $console: Console;
        $root: string;
        $nav: UINavigator;
        $T: Translate;
    }
    var $root: string;
    const $T: Translate;
}

interface SimpliciteInterface {
    Globals: BackendConstants;
    Application: Session;
    Ajax: typeof Ajax;
    UI: typeof UI;
}
declare global {
    interface Window {
        Simplicite: SimpliciteInterface;
    }
}

type DiagramSpringsParam = {
    stiffness: number;
    repulsion: number;
    damping: number;
    remoteness: number;
    gravity: number;
    maxDuration: number;
    callback?: Callback;
    enabled: boolean;
};
/**
 * Springs layout: a force directed graph algorithm
 * @constructor
 */
declare class DiagramSprings {
    model: DiagramModeler;
    desktop?: DiagramDesktop;
    box?: Rect;
    margin: number;
    graph?: Graph;
    layout?: Layout;
    renderer?: Renderer;
    stiffness: number;
    repulsion: number;
    damping: number;
    remoteness: number;
    gravity: number;
    enabled?: boolean;
    constructor(model: DiagramModeler);
    /**
     * Spring stiffness constant F = k * dx
     * @function
     */
    setStiffness(k: number): void;
    setRepulsion(r: number): void;
    setDamping(d: number): void;
    setRemoteness(r: number): void;
    setGravity(g: number): void;
    getData(): {
        "data-layout": string;
        "data-stiffness": number;
        "data-repulsion": number;
        "data-damping": number;
        "data-remoteness": number;
        "data-gravity": number;
        "data-enabled": boolean | undefined;
    };
    readData(svg: JSVG): this;
    /**
     * Prepare the nodes springs
     * @param {(Object|$)} data
     * @param {number} data.stiffness k = Spring stiffness
     * @param {number} data.repulsion Nodes repulsion
     * @param {number} data.damping Spring damping
     * @param {number} data.remoteness Nodes remoteness (zoom)
     * @param {number} data.gravity attraction factor
     * @param {number} data.maxDuration optional max time to execute the placement (in milliseconds)
     * @param {function} data.callback optional callback when all positions are fixed
     * @param {boolean} data.enabled true by default
     * @function
     */
    load(data: DiagramSpringsParam | JSVG): this;
    disable(): this;
    /**
     * Start the nodes placement
     * @function
     */
    start(): this;
    /**
     * Stop the nodes placement
     * @function
     */
    stop(): this;
    /**
     * add node
     * @function
     */
    addNode(node: HTMLElement): SpringNode | undefined;
    /**
     * add nodes
     * @function
     */
    addNodes(nodes?: JQuery): void;
    /**
     * Remove nodes
     * @function
     */
    removeNodes(selectorNodes: string): void;
    /**
     * Add a link between 2 spring nodes
     * @function
     */
    addLink(link: JSVG): SpringEdge | undefined;
    /**
     * Move nodes
     * @function
     */
    move(nodes: JSVG[]): void;
}
declare type SpringNodeData = {
    label?: string;
    mass?: number;
    node?: DiagramNode;
};
declare class SpringNode implements SpringNode {
    id: string;
    data: SpringNodeData;
    point?: Point$1;
    constructor(id: string, data?: SpringNodeData);
}
declare type SpringEdgeData = {
    type?: string;
    length?: number;
};
declare class SpringEdge {
    id: string;
    source: SpringNode;
    target: SpringNode;
    data: SpringEdgeData;
    from?: number;
    to?: number;
    type?: string;
    directed?: boolean;
    spring?: Spring;
    constructor(id: string, source: SpringNode, target: SpringNode, data?: SpringEdgeData);
}
declare class Graph {
    model: DiagramModeler;
    nodes: SpringNode[];
    edges: SpringEdge[];
    nodeSet: {
        [id: string]: SpringNode;
    };
    adjacency: {
        [id1: string]: {
            [id2: string]: SpringEdge[];
        };
    };
    nextNodeId: number;
    nextEdgeId: number;
    eventListeners: Renderer[];
    constructor(model: DiagramModeler);
    addNode(node: SpringNode): SpringNode;
    addNodes(list: string[]): void;
    addEdge(edge: SpringEdge): SpringEdge;
    addEdges(list: string[][]): void;
    newNode(data: SpringNodeData): SpringNode;
    newEdge(source: SpringNode, target: SpringNode, data: SpringEdgeData): SpringEdge;
    loadJSON(json: string | KeyObject): void;
    getEdges(node1: SpringNode, node2: SpringNode): SpringEdge[];
    removeNode(node: SpringNode): void;
    detachNode(node: SpringNode): void;
    removeEdge(edge: SpringEdge): void;
    merge(data: Graph): void;
    filterNodes(fn: (node: SpringNode) => boolean): void;
    filterEdges(fn: (node: SpringEdge) => boolean): void;
    addGraphListener(obj: Renderer): void;
    notify(): void;
}
declare class Point$1 {
    p: Vector;
    m: number;
    v: Vector;
    a: Vector;
    constructor(position: Vector, mass: number);
    applyForce(force: Vector): void;
}
declare class Spring {
    point1: Point$1;
    point2: Point$1;
    length: number;
    k: number;
    constructor(point1: Point$1, point2: Point$1, length: number, k: number);
    distanceToPoint(point: Point$1): number;
}
declare class ForceDirected {
    graph: Graph;
    stiffness: number;
    repulsion: number;
    damping: number;
    remoteness: number;
    gravity: number;
    static Point: typeof Point$1;
    static Spring: typeof Spring;
    constructor(graph: Graph, stiffness: number, repulsion: number, damping: number, remoteness: number, gravity: number);
    point(node: SpringNode): Point$1;
    spring(edge: SpringEdge): Spring;
    eachNode(cbk: (n: SpringNode, p: Point$1) => void): void;
    eachEdge(cbk: (e: SpringEdge, s: Spring) => void): void;
    eachSpring(cbk: (s: Spring) => void): void;
    applyCoulombsLaw(): void;
    applyHookesLaw(): void;
    attractToCentre(p: Point$1): void;
    updatePoint(p: Point$1, dt: number): void;
    totalEnergy(): number;
    _started?: boolean;
    _stop?: boolean;
    _energy: number;
    _count: number;
    _time0: number;
    /**
     * Start simulation if it's not running already.
     * In case it's running then the call is ignored, and none of the callbacks passed is ever executed.
     */
    start(render: Callback, onRenderStart?: Callback, onRenderStop?: Callback): void;
    stop(): void;
    tick(dt: number): void;
    getBound(): Rect;
}
declare class Layout extends ForceDirected {
    static ForceDirected: typeof ForceDirected;
}
declare class Vector {
    x: number;
    y: number;
    constructor(x: number, y: number);
    static random(): Vector;
    add(v: Vector): Vector;
    subtract(v: Vector): Vector;
    multiply(n: number): Vector;
    divide(n: number): Vector;
    magnitude(): number;
    normal(): Vector;
    normalise(): Vector;
}
/**
 * Renderer handles the layout rendering loop
 * @param onRenderStart optional callback function that gets executed whenever rendering starts.
 * @param onRenderStop optional callback function that gets executed whenever rendering stops.
 * @param onRenderFrame optional callback function that gets executed after each frame is rendered.
 */
declare class Renderer {
    layout: Layout;
    clear?: Callback;
    drawNode?: (n: SpringNode, p: Vector) => void;
    drawEdge?: (e: SpringEdge, p1: Vector, p2: Vector) => void;
    onRenderStart?: Callback;
    onRenderStop?: Callback;
    onRenderFrame?: Callback;
    constructor(layout: Layout, clear?: Callback, drawEdge?: Callback, drawNode?: (n: SpringNode, p: Vector) => void, onRenderStart?: Callback, onRenderStop?: Callback, onRenderFrame?: Callback);
    graphChanged(): void;
    /**
     * Starts the simulation of the layout in use.
     *
     * Note that in case the algorithm is still or already running then the layout that's in use
     * might silently ignore the call, and your optional <code>done</code> callback is never executed.
     * At least the built-in ForceDirected layout behaves in this way.
     */
    start(): void;
    stop(): void;
}

type DiagramTreeParam = {
    vertical?: boolean;
    openClose?: boolean;
    rootPosition?: number;
    gapBetweenNodes?: number;
    gapBetweenLevels?: number;
    inspect?: number;
    reverse?: boolean;
};
type DiagramTreeMode = "simple" | "assign" | "release";
type DiagramTreeBound = {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
};
/**
 * Tree singleton
 * @class
 */
declare class DiagramTree {
    DEFAULT_DISTANCE: number;
    ROOT: KeyNumber;
    INSPECT: KeyNumber;
    constructor();
    private static singleton;
    static get(): DiagramTree;
    /**
     * Tree placement from a node
     * @param {Simplicite.Diagram.Node} node node
     * @param {Object} params layout options
     * @param {boolean} params.vertical vertical direction
     * @param {boolean} params.openClose add collapse buttons
     * @param {Object}  params.rootPosition root absolute position {x,y}
     * @param {number}  params.gapBetweenNodes distance between nodes (px)
     * @param {number}  params.gapBetweenLevels distance between tree levels (px)
     * @param {number}  params.inspect links inspection (Simplicite.Diagram.Tree.INSPECT)
     * @param {boolean} params.reverse reverse tree?
     * @param {string} mode 'simple' placement | 'assign' to tree | 'release' from tree
     * @param {boolean} selected select the node
     * @function
     */
    layoutNode(node: DiagramNode, params: DiagramTreeParam, mode: DiagramTreeMode, selected: boolean): void;
    /**
     * Menu
     * @function
     */
    menu(desktop: DiagramDesktop): void;
}
/**
 * TreeLayout
 * @param {Simplicite.Diagram.Desktop} desktop desktop
 * @param {Object} params layout options
 * @class
 */
declare class DiagramTreeLayout {
    DEFAULT_DISTANCE: number;
    tree: DiagramTree;
    desktop: DiagramDesktop;
    root?: DiagramTreeNode;
    levelSizes?: number[];
    bound?: DiagramTreeBound;
    rootPosition: number;
    gapBetweenNodes: number;
    gapBetweenLevels: number;
    inspect: number;
    openClose: boolean;
    vertical: boolean;
    reverse: boolean;
    constructor(desktop: DiagramDesktop, params: DiagramTreeParam);
    /**
     * Set orientation
     * @function
     */
    setOrientation(vertical: boolean): void;
    /**
     * Set root position
     * @function
     */
    setRootPosition(pos: number): void;
    /**
     * Set gap between nodes
     * @function
     */
    setGapBetweenNodes(d: number): void;
    /**
     * Set gap between levels
     * @function
     */
    setGapBetweenLevels(d: number): void;
    /**
     * Set open/close
     * @function
     */
    setOpenClose(b: boolean): void;
    /**
     * Revalidate
     * @function
     */
    revalidate(): void;
    /**
     * Add node
     * @function
     */
    addNode(node: DiagramNode): DiagramTreeNode;
    /**
     * Remove node
     * @function
     */
    removeNode(node: DiagramNode): void;
    /**
     * Remove all
     * @function
     */
    removeAll(): void;
    /**
     * Set root
     * @function
     */
    setRoot(node: DiagramNode, mode: DiagramTreeMode): void;
    /**
     * Open
     * @function
     */
    open(node: DiagramNode, open: boolean): void;
    /**
     * Is open?
     * @function
     */
    isOpen(node: DiagramNode): boolean;
    /**
     * Switch open/close
     * @function
     */
    switchOpenClose(node: DiagramNode): void;
    /**
     * Set parent
     * @function
     */
    setParent(node: DiagramNode, parent: DiagramNode | null, redraw: boolean, root: DiagramNode, assign?: boolean): void;
    /**
     * Get size
     * @function
     */
    getSize(): Size;
    /**
     * Do layout
     * @function
     */
    doLayout(selected?: boolean): void;
    /**
     * Global size
     * @function
     */
    globalSize(node: DiagramNode): void;
    /**
     * Get tree level sizes
     * @function
     */
    getTreeLevelSizes(): number[] | undefined;
    /**
     * Get tree level size
     * @function
     */
    getTreeLevelSize(level: number): number;
    /**
     * Set tree level sizes
     * @function
     */
    setLevelSizes(tn: DiagramTreeNode, level: number): void;
    /**
     * Generate the tree form the parent thru links
     * @function
     */
    layoutNodeBuildTree(parent: DiagramNode, mode: DiagramTreeMode): void;
    /**
     * Insert node
     * @function
     */
    insertNode(child: DiagramNode, parent: DiagramNode, mode: DiagramTreeMode, link: DiagramLink): void;
}
/**
 * TreeNode assigned to node
 * @class
 */
declare class DiagramTreeNode {
    root?: DiagramNode;
    node: DiagramNode;
    key: string;
    children: DiagramTreeNode[];
    parent: DiagramTreeNode | null;
    layout: DiagramTreeLayout;
    assign?: boolean;
    constructor(node: DiagramNode, parent: DiagramTreeNode | null, layout: DiagramTreeLayout);
    /**
     * Is leaf?
     * @function
     */
    isLeaf(): boolean;
    /**
     * Has child?
     * @function
     */
    hasChild(tn: DiagramTreeNode): boolean;
    /**
     * Get tree size
     * @function
     */
    getTreeSize(level: number, subTreeOnly: boolean): Size;
    /**
     * Get angle in [0..2PI[
     * @function
     */
    getAngle(): number;
    /**
     * Add child
     * @function
     */
    addChild(child: DiagramTreeNode): void;
    /**
     * Remove child
     * @function
     */
    removeChild(child: DiagramTreeNode): void;
    /**
     * Open
     * @function
     */
    open(visible: boolean): void;
    /**
     * Is open?
     * @function
     */
    isOpen(): boolean;
    /**
     * Do layout
     * @function
     */
    doLayout(selected: boolean): void;
    /**
     * Do layout hierarchy (recursive)
     * @function
     */
    doLayoutHierarchy(x: number, y: number, level: number, selected?: boolean): void;
    /**
     * Do layout radial (recursive)
     * @function
     */
    doLayoutRadial(cx: number, cy: number, r: number, a1: number, a2: number, selected?: boolean): void;
    /**
     * Move node
     * @function
     */
    moveNode(x: number, y: number): void;
    /**
     * Translate
     * @function
     */
    translate(dx: number, dy: number): void;
    /**
     * Draw button
     * @function
     */
    /**
     * Move
     * @function
     */
    move(): void;
}

/**
 * Nodus = linkable element (node or note)
 * @param {Simplicite.Diagram.Desktop} desktop desk manager
 * @class
 */
declare class DiagramNodus extends DiagramElement {
    object: string;
    id: string;
    links?: DiagramLink[];
    springNode?: SpringNode;
    treeNode?: DiagramTreeNode;
    constructor(desktop: DiagramDesktop);
    /**
     * Add link
     * @function
     * @memberof Simplicite.Diagram.Element
     */
    addLink(link: DiagramLink): void;
    /**
     * Remove link
     * @function
     * @memberof Simplicite.Diagram.Element
     */
    removeLink(link: DiagramLink): void;
    /**
     * Move link
     * @function
     * @memberof Simplicite.Diagram.Element
     */
    moveLinks(dx: number, dy: number): void;
    /**
     * Move pointer during add link
     * @function
     * @memberof Simplicite.Diagram.Element
     */
    moveAddLink(al: DeskElementPos): void;
    /**
     * Create link
     * @function
     * @memberof Simplicite.Diagram.Element
     */
    createLink(al: DeskElementPos): void;
}

type DiagramLinkTemplate = {
    name?: string;
    render?: number;
    type?: number;
    fromObject?: string;
    fromField?: string;
    fromRequired?: boolean;
    fromTemplate?: string;
    fromDisplay?: string;
    toObject?: string;
    toField?: string;
    toTemplate?: string;
    toDisplay?: string;
    link?: string;
    linkFromField?: string;
    linkToField?: string;
    linkRowIdField?: string;
    canChangeShowLabel?: boolean;
    canChangeRender?: boolean;
    canChangeType?: boolean;
    canChangeColor?: boolean;
    canChangeCurved?: boolean;
    canChangeBridge?: boolean;
    canChangeThickness?: boolean;
} & DiagramLinkStyle & DiagramLinkLabel;
type DiagramLinkLabel = {
    label?: string;
    showLabel?: boolean;
};
type DiagramLinkStyle = {
    color?: string;
    thickness?: number;
    curved?: boolean;
    bridge?: boolean;
    dashed?: boolean;
};
type DiagramLinkDef = {
    fromObject?: string;
    fromId?: string;
    toObject?: string;
    toId?: string;
    object?: string;
    id?: string;
    keys?: string | KeyString;
    template?: string | DiagramLinkTemplate;
    from?: DiagramNode;
    to?: DiagramNode;
    RENDER?: KeyObject;
    LINK?: KeyObject;
};
/**
 * Link constructor
 * @param {Simplicite.Diagram.Desktop} desktop Desk manager
 * @param {Object} data Link data <code>\{ object, id, template, points... \}</code>
 * @param {$} [elt] Optional DOM object to synchronize
 * @class
 */
declare class DiagramLink extends DiagramElement {
    RENDER: KeyNumber;
    LINK: KeyNumber;
    object: string;
    id: string;
    keys: KeyString;
    data?: KeyObject;
    from: DiagramNodus;
    fromType?: number;
    fromObject: string;
    fromId: string;
    to: DiagramNodus;
    toType?: number;
    toObject: string;
    toId: string;
    label: string;
    template: DiagramLinkTemplate;
    innerLink: boolean;
    points: Point[];
    masterLine: Line;
    road?: JSVG;
    border?: JSVG;
    border2?: JSVG;
    offset: number;
    offsetMax: number;
    render?: number;
    thickness?: number;
    color?: string;
    curved?: boolean;
    bridge?: boolean;
    dashed?: boolean;
    showLabel?: boolean;
    cls?: string;
    pointer?: JSVG;
    constructor(desktop: DiagramDesktop, data: DiagramLinkDef, elt?: JSVG);
    /**
     * Remove a link
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    remove(): void;
    /**
     * Compare links
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    equals(link: DiagramLink): boolean;
    /**
     * Override position to move points
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    positionPoints(dx: number, dy: number, nb: number | null, from: boolean): Point;
    /**
     * Change link rendering
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    rendering(render?: number, silent?: boolean): number | undefined;
    /**
     * Change extremity
     * @param {boolean} from From direction ?
     * @param {number} type Type of LINK, accept marker syntax
     * @param {boolean} silent no redraw/has changed
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    extremity(from: boolean, type: number | string, silent?: boolean): number | undefined;
    /**
     * Style
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    style(props?: DiagramLinkStyle, silent?: boolean): {
        color: string | undefined;
        thickness: number | undefined;
        curved: boolean | undefined;
        bridge: boolean | undefined;
        dashed: boolean | undefined;
    };
    /**
     * Text
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    text(props?: DiagramLinkLabel, silent?: boolean): {
        showLabel: boolean | undefined;
        label: string;
    };
    /**
     * Draw
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    draw(): void;
    /**
     * Redraw
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    redraw(): void;
    /**
     * Draw label
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    drawLabel(label: string): void;
    /**
     * Path
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    path(lines?: Line[], curved?: boolean, bridge?: boolean): string;
    /**
     * Draw bridge path
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    drawBridge(l: DiagramLink, line: Line, inters: DiagramLink[]): string;
    /**
     * Draw path
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    drawPath(lines: Line[] | undefined): void;
    /**
     * Toggle menu
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    toggleMenu(pos: Point): void;
    /**
     * Update path
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    updatePath(): void;
    /**
     * Leave
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    leave(): void;
    /**
     * Add point
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    addPoint(idx: number, p: Point): void;
    /**
     * Remove added point at index or position
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    removePoint(index: number | null, pos?: Point): void;
    /**
     * Move point
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    movePoint(pt: DeskElementPos, drop?: boolean): void;
    /**
     * Get starting point in node "from"
     * @param {Point} p optional x,y in percent to change relative position into node
     * @param {boolean} prct true to return percents or absolute position
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    pointFrom(p?: Point, prct?: boolean): Point;
    /**
     * Get ending point in node "to"
     * @param {Point} p optional x,y in percent to change relative position into node
     * @param {boolean} prct true to return percents or absolute position
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    pointTo(p?: Point, prct?: boolean): Point;
    /**
     * Broken lines
     * @param {boolean} full true: get lines from internal nodes, false: outgoing points from nodes
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    getLines(full?: boolean): Line[] | undefined;
    /** Build a line between 2 points */
    toLine(a: Point, b: Point): Line;
    /** Build a line between 2 points */
    toLine2(x1: number, y1: number, x2: number, y2: number): Line;
    /** Generate simple free line between 2 vectors */
    getFreeLines(u1: Line, u2: Line): Line[];
    /** Generate broken lines between 2 vectors */
    getAutoLines(u1: Line, u2: Line): Line[];
    /** Top to Bottom lines between 2 nodes */
    getTopBottomLines(n1: DiagramNodus, n2: DiagramNodus): Line[];
    /** Left to Right lines between 2 nodes */
    getLeftRightLines(n1: DiagramNodus, n2: DiagramNodus): Line[];
    /** Vertical to Horizontal lines between 2 nodes */
    getVertHorizLines(n1: DiagramElement, n2: DiagramElement): Line[];
    /** Horizontal to Vertical lines between 2 nodes */
    getHorizVertLines(n1: DiagramElement, n2: DiagramElement): Line[];
    /** Reflexive inner lines */
    getInnerLines(n: DiagramElement): Line[];
    /**
     * Normal Vector from node
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    getOutgoingPoint(n1: DiagramElement, _n2: DiagramElement, direction: number): Line;
    /**
     * Interpolation nearest point to path
     * @function
     * @memberof Simplicite.Diagram.Link
     */
    closestPoint(pathNode: SVGPathElement, point: Point): {
        x: number;
        y: number;
        d: number;
    };
    /** line (p1, p2) => ax + by + c = 0 */
    getStraightLine(l: Line): StraightLine;
    /** Intersection in segments ? */
    getIntersection(line1: Line, line2: Line, d1: StraightLine, d2: StraightLine): Point | undefined;
}

type DiagramNodeStyle = {
    radius?: number;
    color?: string;
    shadow?: boolean;
    shape?: string;
    titlePos?: string;
};
type DiagramNodeContentTemplate = {
    name: string;
    object: string;
    display?: string;
    relParentField?: string;
    refField?: string;
    refRequired?: boolean;
    relation?: string;
    relationRowIdField?: string;
    relContentField?: string;
};
type DiagramNodeTemplate = {
    name?: string;
    object?: string;
    relation?: string;
    refField?: string;
    display?: string;
    icon?: string;
    contents?: {
        [key: string]: DiagramNodeContentTemplate;
    };
    showContent?: boolean;
    collapseContent?: boolean;
    showField?: number;
    collapseField?: boolean;
    resizable?: boolean;
} & DiagramNodeStyle;
type DiagramNodeContentItem = {
    index: number;
    text: string;
    object: string;
    field?: string;
    id: string;
    relId?: string;
    pre?: JSVG[];
    post?: JSVG[];
    cls: string;
};
type DiagramNodeContent = {
    object: string;
    template: string;
    relField?: string;
    relation?: string;
    relParentField?: string;
    items: DiagramNodeContentItem[];
};
type DiagramNodeDef = {
    template: string | DiagramNodeTemplate;
    object: string;
    id: string;
    x: number;
    y: number;
    links?: DiagramLinkDef[];
};
type TitlePosition = "top" | "center" | "bottom";
/**
 * Node constructor
 * @param {Simplicite.Diagram.Desktop} desktop desk manager
 * @param {Object} data Node data { object, id, template, contents... }
 * @param {$} [elt] optional DOM object to synchronize
 * @class
 */
declare class DiagramNode extends DiagramNodus {
    keys: KeyString;
    label: string;
    titlePos?: TitlePosition;
    icon?: string;
    data?: KeyObject;
    olddata?: KeyObject;
    links: DiagramLink[];
    contents: DiagramNodeContent[];
    container?: DiagramContainer;
    border?: JSVG;
    template: DiagramNodeTemplate;
    padding: number;
    radius?: number;
    color?: string;
    shadow?: boolean;
    shape?: string;
    collapseContent?: boolean;
    collapseField?: boolean;
    canAttach?: boolean;
    layout?: DiagramTreeLayout;
    visible?: boolean;
    constructor(desktop: DiagramDesktop, data: Partial<DiagramNodeDef>, elt?: JQuery | JSVG);
    /**
     * Load node with data
     * @function
     * @memberof Simplicite.Diagram.Node
     */
    load(data: DiagramNode, cbk?: (data?: DiagramNode | DiagramContainer) => void): void;
    /**
     * Draw
     * @function
     * @memberof Simplicite.Diagram.Node
     */
    draw(): void;
    /**
     * Set/Get size of node
     * @param {number} w Width
     * @param {number} h Height
     * @function
     * @memberof Simplicite.Diagram.Node
     */
    size(w?: number, h?: number): Size;
    /**
     * Redraw
     * @function
     * @memberof Simplicite.Diagram.Node
     */
    redraw(): void;
    /**
     * Is content visible?
     * @function
     * @memberof Simplicite.Diagram.Node
     */
    isContentVisible(i: number, _content: DiagramNodeContent): boolean | undefined;
    /**
     * Is item visible?
     * @function
     * @memberof Simplicite.Diagram.Node
     */
    isItemVisible(_i: number, _j: number, _content: DiagramNodeContent, _item: DiagramNodeContentItem): boolean;
    /**
     * Draw item
     * @function
     * @memberof Simplicite.Diagram.Node
     */
    drawItem(data: {
        item: DiagramNodeContentItem;
        content: DiagramNodeContent;
        indexContent: number;
        indexItem: number;
        height: number;
        group: JSVG;
    }): any;
    /**
     * Bind
     * @function
     * @memberof Simplicite.Diagram.Node
     */
    bind(r: JSVG, g?: JSVG, data?: KeyObject): void;
    /**
     * Toggle menu
     * @function
     * @memberof Simplicite.Diagram.Node
     */
    toggleMenu(item: DiagramNodeContentItem, pos: Point): void;
    /**
     * Collapse fields
     * @function
     * @memberof Simplicite.Diagram.Node
     */
    collapseFields(b?: boolean, silent?: boolean): boolean | undefined;
    /**
     * Collapse contents
     * @function
     * @memberof Simplicite.Diagram.Node
     */
    collapseContents(b?: boolean, silent?: boolean): boolean | undefined;
    /**
     * Style
     * @function
     * @memberof Simplicite.Diagram.Node
     */
    style(props?: DiagramNodeStyle, silent?: boolean): {
        color: string | undefined;
        radius: number | undefined;
        shadow: boolean | undefined;
        shape: string | undefined;
        titlePos: TitlePosition | undefined;
    };
    /**
     * Remove
     * @function
     * @memberof Simplicite.Diagram.Node
     */
    remove(): void;
    /**
     * Set/get position of element
     * @param {number} x Horizontal coordinate
     * @param {number} y Vertical coordinate
     * @param {boolean} rel Relative?
     * @param {boolean} attach Attach to parent container?
     * @function
     * @memberof Simplicite.Diagram.Node
     */
    position(x?: number, y?: number, rel?: boolean | 0, attach?: boolean): Point;
    /**
     * Attach node to a container
     * @function
     * @memberof Simplicite.Diagram.Node
     */
    attach(silent?: boolean, resize?: boolean): void;
    /**
     * Detach from container
     * @function
     * @memberof Simplicite.Diagram.Node
     */
    detach(silent?: boolean): void;
    /**
     * Set label
     * @param {string} label Label
     * @function
     * @memberof Simplicite.Diagram.Node
     */
    setLabel(label: string): void;
}

type ShapeParam = {
    name: string;
    w?: number;
    h?: number;
    wmin?: number;
    hmin?: number;
    position?: TitlePosition;
    ar?: boolean;
    title?: string;
};
type Shape = {
    w: number;
    h: number;
    ar?: boolean;
    elt: () => JSVG;
    size: (e: JSVG, w: number, h: number) => Size;
    intersect?: () => Point | undefined;
};
type ShapeGroup = {
    name: string;
    list: string[];
};
type ShapeDefs = {
    [shape: string]: Shape;
};
/**
 * Node shape
 * @class
 */
declare class DiagramShape {
    name: string;
    elt: JSVG;
    title?: string;
    position?: TitlePosition;
    text?: JSVG;
    wmin: number;
    hmin: number;
    ar: boolean;
    static defs: ShapeDefs;
    MIN_SIZE: number;
    /**
     * New shape { name, w, h, wmin, hmin, title, position, ar }
     * @constructor
     */
    constructor(p: ShapeParam);
    /** Group of shapes */
    static getGroups(): ShapeGroup[];
    /**
     * Get shape
     * @function
     * @memberof Simplicite.Diagram.Shape
     */
    getShape(): JSVG;
    /**
     * Get title
     * @function
     * @memberof Simplicite.Diagram.Shape
     */
    getTitle(): JSVG | undefined;
    /**
     * Resize shape to fit centered text
     * @function
     * @memberof Simplicite.Diagram.Shape
     */
    fitText(): void;
    /**
     * Set/Get size of element
     * @param {number} w Width
     * @param {number} h Height
     * @function
     * @memberof Simplicite.Diagram.Shape
     */
    size(w: number, h: number): {
        w: number;
        h: number;
    };
    /**
     * To line
     * @function
     * @memberof Simplicite.Diagram.Shape
     */
    private toLine;
    private btwn;
    private line_line_intersect;
    private line_circle_intersect;
    private line_ellipse_intersect;
    private line_path_intersect;
    private line_rect_intersect;
    intersect(n: Point, line: Line): Point | undefined;
    /** Predefined Shapes definition */
    private initShapes;
}

/** Line between 2 points */
type Line = {
    p1: Point;
    p2: Point;
};
/** Line ax + by + c = 0 */
type StraightLine = {
    a: number;
    b: number;
    c: number;
};
type Bound = Rect & {
    x2: number;
    y2: number;
    xc: number;
    yc: number;
};
type Direction = "nw" | "sw" | "se" | "ne" | "n" | "s" | "w" | "e";
/**
 * Default element of diagram
 * @param {Simplicite.Diagram.Desktop} desktop desk manager
 * @class
 */
declare class DiagramElement {
    desktop: DiagramDesktop;
    elt: JQuery<SVGGraphicsElement>;
    elt2?: JQuery<SVGGraphicsElement>;
    x: number;
    y: number;
    w: number;
    h: number;
    resizable: boolean;
    wmin: number;
    hmin: number;
    s?: DiagramShape;
    constructor(desktop: DiagramDesktop);
    /**
     * Mark changed
     * @function
     * @memberof Simplicite.Diagram.Element
     */
    changed(): void;
    /**
     * Draw element
     * @function
     * @memberof Simplicite.Diagram.Element
     */
    draw(): void;
    /**
     * Redraw element
     * @function
     * @memberof Simplicite.Diagram.Element
     */
    redraw(): void;
    /**
     * Set/get position of element
     * @param {number} x Horizontal coordinate
     * @param {number} y Vertical coordinate
     * @param {boolean} rel Relative?
     * @function
     * @memberof Simplicite.Diagram.Element
     */
    position(x?: number, y?: number, rel?: boolean | 0): Point;
    /**
     * Set/Get size of element
     * @param {number} w Width
     * @param {number} h Height
     * @function
     * @memberof Simplicite.Diagram.Element
     */
    size(w?: number, h?: number): Size;
    /**
     * Get bounds
     * @function
     * @memberof Simplicite.Diagram.Element
     */
    bound(): Bound;
    /**
     * Remove element
     * @function
     * @memberof Simplicite.Diagram.Element
     */
    remove(): void;
    /**
     * Select
     * @function
     * @memberof Simplicite.Diagram.Element
     */
    select(sel?: boolean): boolean;
    /**
     * Menu
     * @function
     * @memberof Simplicite.Diagram.Element
     */
    menu(sections: DesktopMenuItem[][], pos?: Point | null, cbk?: (menu: JQuery) => void): void;
    /**
     * Color picker
     * @function
     * @memberof Simplicite.Diagram.Element
     */
    colorPicker(inp: JQuery, menu: JQuery, cbk?: (color: string) => void): void;
    /**
     * Is inside?
     * @param {number} x Horizontal coordinate
     * @param {number} y Vertical coordinate
     * @function
     * @memberof Simplicite.Diagram.Element
     */
    isInside(x: number, y: number): boolean;
    /**
     * Bind resize
     * @function
     * @memberof Simplicite.Diagram.Element
     */
    bindResize(): void;
    /**
     * Resize in direction
     * @function
     * @memberof Simplicite.Diagram.Element
     */
    resize(rn: DeskElementPos, drop?: boolean): void;
    /**
     * Text size
     * @function
     * @memberof Simplicite.Diagram.Element
     */
    textSize(text: string, cls?: string): {
        w: number;
        h: number;
    };
    /**
     * Wrap text
     * @function
     * @memberof Simplicite.Diagram.Element
     */
    wrapText(text: string, width: number, padding: number, el?: JSVG): JSVG;
    /**
     * Get wrapped back as string
     * @function
     * @memberof Simplicite.Diagram.Element
     */
    unwrapText(el: JQuery): string;
}

type DiagramContainerTitleAnchor = "start" | "middle" | "end";
type DiagramContainerStyle = {
    radius?: number;
    color?: string;
    shadow?: boolean;
    vertical?: boolean;
    anchor?: DiagramContainerTitleAnchor;
};
type DiagramContainerTemplate = {
    name?: string;
    object?: string;
    display?: string;
    icon?: string;
    contents?: DiagramNodeTemplate[];
} & DiagramContainerStyle;
type DiagramContainerDef = {
    template?: string;
    object?: string;
    id?: string;
    keys?: string;
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    type?: number;
    title?: string;
    label?: string;
    pool?: number;
    vertical?: boolean;
    shadow?: boolean;
    color?: string;
    radius?: number;
};
/**
 * Container constructor
 * @param {Simplicite.Diagram.Desktop} desktop desk manager
 * @param {Object} data Container data { title, type, template, x, y, w, h... }
 * @param {$} [elt] optional DOM object to synchronize
 * @class
 */
declare class DiagramContainer extends DiagramElement {
    container?: DiagramContainer;
    containers: DiagramContainer[];
    nodes: DiagramNode[];
    object: string;
    id: string;
    keys: KeyString;
    TYPE: KeyNumber;
    data?: KeyObject;
    olddata?: KeyObject;
    contents?: KeyObject[];
    template: DiagramContainerTemplate;
    type: number;
    icon?: string;
    label: string;
    title: string;
    radius: number;
    shadow?: boolean;
    color?: string;
    vertical?: boolean;
    anchor?: string;
    border?: JSVG;
    head?: JSVG;
    t?: JSVG;
    sep?: JSVG;
    pool: number;
    poolMin: number;
    padding: number;
    margin: number;
    canUseShadow: boolean;
    canUseVertical: boolean;
    constructor(desktop: DiagramDesktop, data: DiagramContainerDef | DiagramContainer, elt?: JQuery | JSVG);
    /**
     * Load
     * @function
     * @memberof Simplicite.Diagram.Container
     */
    load(data: DiagramContainer | null, cbk?: Callback): void;
    /**
     * Draw
     * @function
     * @memberof Simplicite.Diagram.Container
     */
    draw(): void;
    /**
     * Set/Get size of container
     * @param {number} w Width
     * @param {number} h Height
     * @function
     * @memberof Simplicite.Diagram.Container
     */
    size(w?: number, h?: number): Size;
    /**
     * Size border
     * @param {number} w Width
     * @param {number} h Height
     * @function
     * @memberof Simplicite.Diagram.Container
     */
    sizeBorder(w: number, h: number): void;
    /**
     * Change the pool position if > 0
     * @function
     * @memberof Simplicite.Diagram.Container
     */
    setPool(pos: number, silent?: boolean): void;
    /**
     * Re-align all pools
     * @function
     * @memberof Simplicite.Diagram.Container
     */
    resizePool(): void;
    /**
     * Bind
     * @function
     * @memberof Simplicite.Diagram.Container
     */
    bind(el: JSVG): void;
    /**
     * Toggle menu
     * @function
     * @memberof Simplicite.Diagram.Container
     */
    toggleMenu(): void;
    /**
     * Style
     * @function
     * @memberof Simplicite.Diagram.Container
     */
    style(props?: DiagramContainerStyle, silent?: boolean): {
        color: string | undefined;
        radius: number;
        shadow: boolean | undefined;
        vertical: boolean | undefined;
    };
    /**
     * Remove
     * @function
     * @memberof Simplicite.Diagram.Container
     */
    remove(cascad?: boolean): void;
    /**
     * Bounded rectangle of all contents
     * @function
     * @memberof Simplicite.Diagram.Container
     */
    contentBound(): {
        x: number;
        y: number;
        w: number;
        h: number;
    } | null;
    /**
     * Set/get position of container
     * @param {number} x Horizontal coordinate
     * @param {number} y Vertical coordinate
     * @param {boolean} rel Relative?
     * @function
     * @memberof Simplicite.Diagram.Container
     */
    position(x?: number, y?: number, rel?: boolean, cascad?: boolean): Point;
    /**
     * Is container inside this container?
     * @function
     * @memberof Simplicite.Diagram.Container
     */
    contains(cont: DiagramContainer): boolean;
    /**
     * Attach
     * @function
     * @memberof Simplicite.Diagram.Container
     */
    attach(x?: DiagramNode | DiagramContainer | null, silent?: boolean, noResize?: boolean): void;
    /**
     * Detach
     * @function
     * @memberof Simplicite.Diagram.Container
     */
    detach(x?: DiagramNode | DiagramContainer, silent?: boolean): void;
}

type DiagramNoteData = {
    id?: string;
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    text?: string;
};
type DiagramNoteStyle = {
    color?: string;
};
/**
 * Note constructor
 * @param {Simplicite.Diagram.Desktop} desktop desk manager
 * @param {Object} data optional { text, x, y, w, h, id }
 * @param {$} [elt] optional DOM object to synchronize
 * @class
 */
declare class DiagramNote extends DiagramNodus {
    id: string;
    color: string;
    text: string;
    padding: number;
    border?: JSVG;
    t?: JSVG;
    constructor(desktop: DiagramDesktop, data: DiagramNoteData, elt?: JQuery | JSVG);
    /**
     * Draw
     * @function
     * @memberof Simplicite.Diagram.Note
     */
    draw(): void;
    /**
     * Set/Get size of note
     * @param {number} w Width
     * @param {number} h Height
     * @function
     * @memberof Simplicite.Diagram.Note
     */
    size(w?: number, h?: number): Size;
    /**
     * Redraw
     * @function
     * @memberof Simplicite.Diagram.Note
     */
    redraw(): void;
    /**
     * Bind
     * @function
     * @memberof Simplicite.Diagram.Note
     */
    bind(r: JSVG, _g?: unknown, _data?: unknown): void;
    /**
     * Toggle menu
     * @function
     * @memberof Simplicite.Diagram.Note
     */
    toggleMenu(): void;
    /**
     * Edit note
     * @function
     * @memberof Simplicite.Diagram.Note
     */
    edit(): void;
    /**
     * Style
     * @function
     * @memberof Simplicite.Diagram.Note
     */
    style(props?: DiagramNoteStyle, silent?: boolean): {
        color: string;
    };
    /**
     * Remove
     * @function
     * @memberof Simplicite.Diagram.Note
     */
    remove(): void;
    /**
     * Set/get position of element
     * @param {number} x Horizontal coordinate
     * @param {number} y Vertical coordinate
     * @param {boolean} rel Relative?
     * @function
     * @memberof Simplicite.Diagram.Note
     */
    position(x?: number, y?: number, rel?: boolean): Point;
}

type DesktopMenuItem = {
    text: string | JQuery;
    icon?: string;
    cbk?: JQueryHandler;
};
type DeskElementPos = {
    origin: Point;
    pos: Point;
    pointer?: JSVG;
    caption?: boolean;
    container?: boolean;
    elt?: DiagramElement;
    dir?: Direction;
    bound?: Bound;
    moved?: boolean;
    link?: DiagramLink;
    from?: DiagramNode | DiagramNote;
    to?: JQuery;
    index?: number;
    points?: Point[];
    pointFrom?: Point;
    pointTo?: Point;
    line?: JSVG;
    valid?: boolean;
};
type DiagramDesktopParam = {
    svg?: string;
    x?: number;
    y?: number;
    zoom?: number;
    grid?: number;
    color?: string;
};
/**
 * Desktop with SVG
 * @param {Object} p options
 * @param {number} p.x Origin position x
 * @param {number} p.y Origin position y
 * @param {number} p.zoom Zoom factor
 * @param {string} p.color Background color
 * @param {number} p.grid Grid size or 0 to hide
 * @class
 */
declare class DiagramDesktop {
    ctn: Container;
    data: Required<DiagramDesktopParam>;
    margin: number;
    model: DiagramModeler;
    options: KeyObject;
    undoRedo: KeyObject;
    pointerMode: number;
    _poolLock?: boolean;
    _move_links?: DiagramLink[];
    changed: boolean;
    isPopup: boolean;
    desktop?: JQuery;
    desk?: JQuery;
    svg?: JQuery<SVGSVGElement>;
    viewport?: JSVG;
    background?: JSVG;
    body?: JSVG;
    containers?: JSVG;
    links?: JSVG;
    nodes?: JSVG;
    foreground?: JSVG;
    palZoom?: JQuery;
    palLayout?: JQuery;
    palModel?: JQuery;
    palDesk?: JQuery;
    palAdd?: JQuery;
    constructor(ctn: Container, model: DiagramModeler, p: DiagramDesktopParam);
    /**
     * Init the desktop with contents, palettes...
     * @param {boolean} sync true to synchronize nodes with DB
     * @param {function} cbk optional callback
     * @function
     */
    init(sync: boolean, cbk?: Callback): void;
    /**
     * Content has changed ?
     * @param {boolean} b optional flag
     * @function
     */
    hasChanged(b?: boolean): boolean;
    /**
     * Get the SVG content as text
     * @param {Object} options
     * @param {boolean} options.clear true to clear dimension, unused image...
     * @param {number}  options.zoom optional scale 1=100%
     * @param {number}  options.grid 0=none
     * @param {boolean} options.xlink false to remove all use[xlink] of SVG 1.2
     * @param {function} cbk callback(svg content)
     * @function
     */
    getContent(options?: {
        clear?: boolean;
        zoom?: number;
        grid?: number;
        xlink?: boolean;
    }, cbk?: (svg: string) => void): void;
    /**
     * Convert to image
     * @param {string} format optional format (png...), default return SVG image
     * @param {number} zoom optional scale
     * @param {function} cbk callback to return the formatted image
     * @function
     */
    getImage(format: string | null, zoom: number, cbk: (img: JQuery<HTMLImageElement> | null) => void): void;
    /**
     * Load image and convert to data URL
     * @param {string} src image source URL
     * @param {string} format base64 format (default png)
     * @param {number} w width:  null=preserve original size | 0=maintain aspect ratio | specified size
     * @param {number} h height: null=preserve original size | 0=maintain aspect ratio | specified size
     * @param {function} cbk callback(dataURL, width, height)
     * @function
     */
    img2base64(src: string, format: string, w: number | null, h: number | null, cbk?: (dataURL: string, width: number, height: number) => void): void;
    getContainers(): JQuery;
    getSelectedContainers(): JQuery;
    /**
     * Search a container in diagram if exists
     * @param {Object} item filter { object, id }
     * @function
     */
    getContainer(item: {
        object?: string;
        id?: string;
    }): JQuery;
    getContainerAt(pos: Point): DiagramContainer | undefined;
    /**
     * Search a node in diagram if exists
     * @param {Object} item filter { object, id }
     * @function
     */
    getNode(item: {
        object?: string;
        id?: string;
    }): JQuery;
    /**
     * Search a note in diagram if exists
     * @param {string} id note id
     * @function
     */
    getNote(id: string): JQuery;
    /**
     * Search a content item in diagram if exists
     * @param {Object} item content { object, id }
     * @function
     */
    getNodeContent(item: {
        object: string;
        id: string;
    }): JQuery;
    /**
     * Search a node with content in diagram if exists
     * @param {Object} item content { object, id }
     * @function
     */
    getNodeWithContent(item: {
        object: string;
        id: string;
    }): JQuery;
    /**
     * Get all nodes in diagram
     * @param {string} selector optional selector
     * @function
     */
    getNodes(selector?: string): JQuery;
    /**
     * Get selected nodes in diagram
     * @param {boolean} notes include notes ?
     * @function
     */
    getSelectedNodes(notes?: boolean): JQuery<HTMLElement> | undefined;
    /**
     * Add a node in diagram
     * @param {Object} data node data
     * @function
     */
    addNode(data: DiagramNodeDef, cbk?: (node: DiagramNode) => void): void;
    /**
     * Apply a function on (selected) nodes
     * @function
     */
    applyToNodes(node?: JQuery | DiagramNode | null, fn?: (node: DiagramNode) => void): void;
    /**
     * Remove node from diagram
     * @param {Object} node Simplicite.Diagram.Node
     * @function
     */
    removeNode(node?: JQuery | DiagramNode): void;
    /**
     * Remove nodes from diagram
     * @param {jQuery} list nodes
     * @function
     */
    removeNodes(list?: JSVG | JQuery): void;
    /**
     * Remove container from diagram
     * @param {Object} ct Simplicite.Diagram.Container
     * @param {boolean} cascad true to remove contents from diagram
     * @function
     */
    removeContainer(ct: DiagramContainer | JQuery, cascad?: boolean): void;
    /**
     * Get all links on desktop
     * @function
     */
    getLinks(): JSVG;
    /**
     * Search a link on desktop
     * @param {Object} data filters { fromObject, fromId, toObject, toId, object, id, keys }
     * @function
     */
    getLink(data?: DiagramLinkDef | DiagramLink): JSVG;
    /**
     * Add a link on desktop
     * @param {Object} data { fromObject, fromId, toObject, toId, object, id }
     * @function
     */
    addLink(data: DiagramLinkDef | DiagramLink): JSVG | undefined;
    /**
     * Remove a link on desktop
     * @function
     */
    removeLink(link: DiagramLink | JSVG): void;
    unselectAll(): void;
    selectAllNodes(b?: boolean): void;
    /**
     * Select a node or a note
     * @param {$} el element
     * @param {boolean} sel true to select
     * @param {boolean} add add to selection or reset
     * @function
     */
    selectNode(el?: JQuery | JSVG, sel?: boolean, add?: boolean): void;
    selectItem(el?: JSVG): void;
    /**
     * Select a container
     * @param {$} el element
     * @param {boolean} sel true to select
     * @param {boolean} add add to selection or reset
     * @function
     */
    selectContainer(el?: JSVG, sel?: boolean, add?: boolean): void;
    /**
     * Brings element to front/back of its layer
     * @param {Object} x Node/Container
     * @param {boolean} front true to bring to front, false to back
     * @function
     */
    bringToLayer(x: DiagramNode | DiagramContainer, front: boolean): void;
    /** Mouse position in desktop (or absolute position) */
    mouseDeskPos(e: JQuery.Event, abs?: boolean): Point;
    /** Mouse position in SVG scale */
    mousePos(e: JQuery.Event): Point;
    /** Convert desk point to SVG scale */
    point2svg(pos: Point): Point;
    /** Convert desk rect to SVG scale */
    rect2svg(rect: Rect): Rect;
    /** Convert SVG point to desk */
    svg2point(pos: Point): Point;
    /** Convert SVG point to desk */
    svg2rect(rect: Rect): Rect;
    private mouseWheel;
    dragPos?: MousePos;
    dragMovePos?: Point;
    lasso?: JSVG;
    movePointPos?: DeskElementPos;
    moveElementPos?: DeskElementPos;
    resizeElementPos?: DeskElementPos;
    addLinkPos?: DeskElementPos;
    private mouseDown;
    private mouseMove;
    private mouseUp;
    private dblClick;
    private drawLasso;
    moveElements(el: DiagramElement | JQuery, x: number, y: number, rel?: boolean): void;
    moveSelectedContainers(x: number, y: number, rel?: boolean): void;
    moveSelectedNodes(x: number, y: number, rel?: boolean): void;
    moveNodes(nodes: DiagramNode | JQuery, x: number, y: number, rel?: boolean): void;
    /**
     * Node/Container magnetism when grid is active
     * @function
     */
    magnetism(node?: JQuery): void;
    private keydown;
    /**
     * Change desktop zoom
     * @param {number} zoom zoom factor
     * @param {number} tx optional translated x origin
     * @param {number} ty optional translated y origin
     * @function
     */
    setZoom(zoom?: number | null, tx?: number, ty?: number): void;
    /**
     * Zoom at position (default center of desk)
     * @function
     */
    zoom(z: number, pos?: Point): void;
    /**
     * Zoom IN
     * @param factor factor in percent (default +5%)
     * @function
     */
    zoomIn(factor?: number): void;
    /**
     * Zoom OUT
     * @param factor factor in percent (default 5%)
     * @function
     */
    zoomOut(factor?: number): void;
    /**
     * Reset zoom to scale 1
     * @function
     */
    zoomReset(): void;
    /**
     * Adjust scale to see all content in x>0 and y>0
     * @param {boolean} origin true to zoom and return to origin
     * @function
     */
    zoomFit(origin?: boolean): void;
    /**
     * Search elements in model
     * @function
     */
    search(): void;
    /**
     * scroll element to view center
     * @param el element to show
     * @param slide true to add a transition effect
     * @function
     */
    scrollIntoView(el: HTMLElement, slide?: boolean): void;
    /**
     * Full size with body elements
     * @function
     */
    getBound(): {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    private buildDef;
    /**
     * Add definition to SVG
     * @function
     */
    addDef(def: JSVG, replace?: boolean): void;
    /**
     * Add base64 icon to defs: inlined image for standalone usage (export to image, svg+xml...)
     * @function
     */
    addDefIcon(icon: string, w: number, h: number, cbk?: (img: JSVG) => void): void;
    /**
     * Remove icon definition
     * @function
     */
    removeDefIcon(icon: string, w: number, h: number): void;
    /**
     * Get defined icon
     * @function
     */
    getDefIcon(icon: string, w: number, h: number): JSVG;
    /**
     * Add base64 image to defs: inlined image for standalone usage (export to image, svg+xml...)
     * @function
     */
    addDefImage(name: string, url: string, w: number, h: number, cls: string, cbk?: (img: JSVG) => void): void;
    /**
     * Convert font icon to PNG definition
     * @function
     */
    addDefImageFont(name: string, icon: string, w: number, h: number, cls: string, cbk?: (img: JSVG) => void): void;
    /**
     * Remove image definition
     * @function
     */
    removeDefImage(name: string, w: number, h: number): void;
    /**
     * Get defined image
     * @function
     */
    getDefImage(name: string, w: number, h: number): JSVG;
    /**
     * Display the grid
     * @param {number} size Grid size (0 or false = hide)
     * @function
     */
    showGrid(size?: number | false): void;
    /**
     * Change background color
     * @function
     */
    setBackgroundColor(c: string): void;
    private chooseBckColor;
    private btn;
    searchButton?: JQuery;
    private palettes;
    editContainer(cont: DiagramContainer | null, pos?: Point): void;
    updateContainer(cont: DiagramContainer | null, data: DiagramContainerDef): DiagramContainer | null;
    addContainer(data: DiagramContainer, cbk?: (cont: DiagramContainer) => void): void;
    /**
     * Add a note in diagram
     * @param {Object} data note data { x,y,w,h,text }
     * @function
     */
    addNote(data: DiagramNoteData): void;
    getCaption(): JQuery<HTMLElement>;
    addCaption(item: DiagramCaption): void;
    removeCaption(): void;
    toggleCaption(x?: number, y?: number): void;
    moveCaption(x: number, y: number, rel?: boolean): void;
    syncCaption(): void;
    getLinkIconName(type: number, useCrowsFeet?: boolean): string;
    /**
     * Popup to ask user to select a link template between nodes
     * @function
     */
    linkTemplatePicker(list: DiagramLinkTemplate[], from: DiagramNode, to: DiagramNode, pos: Point, cbk: (selected: DiagramLinkTemplate, inverse?: boolean) => void): void;
    /**
     * Shape selection
     * @function
     */
    shapePicker(node: DiagramNode, cbk: (title: string | undefined, position?: TitlePosition) => void): void;
    /**
     * Ensure absolute div to be visible on desk
     * @function
     */
    ensureVisible(d: JQuery): void;
    closeMenu(): void;
    moveMenu(): void;
    private deskmenu;
    private palObj;
    private addContainerPos;
    private addNotePos;
    palTree(node: DiagramNode): void;
    private palSprings;
}

/**
 * Caption constructor
 * @param {Simplicite.Diagram.Desktop} desktop desk manager
 * @param {Object} data Model data and { x, y }
 * @class
 */
declare class DiagramCaption extends DiagramElement {
    padding: number;
    border?: JSVG;
    t?: JSVG;
    data: KeyObject;
    constructor(desktop: DiagramDesktop, data: KeyObject);
    /**
     * Draw caption within hook onDrawCaption(caption, display)
     * @function
     * @memberOf Simplicite.Diagram.Caption
     */
    draw(): void;
    /**
     * Display the default caption with model data
     * @function
     * @memberOf Simplicite.Diagram.Caption
     */
    display(): void;
    /**
     * Set/Get size of caption
     * @param {number} w Width
     * @param {number} h Height
     * @function
     * @memberOf Simplicite.Diagram.Caption
     */
    size(w?: number, h?: number): Size;
    /**
     * Bind caption
     * @function
     * @memberOf Simplicite.Diagram.Caption
     */
    bind(el: JSVG): void;
}

/**
 * Print preview / split large images
 * @class
 */
declare class DiagramPrint {
    desktop: DiagramDesktop;
    image?: JQuery<HTMLImageElement>;
    previewPart?: JQuery;
    previewCanvas?: JQuery<HTMLCanvasElement>;
    canvas?: HTMLCanvasElement;
    popup?: JQuery;
    selFormat?: JQuery;
    selOrient?: JQuery;
    inpZoom?: JQuery;
    inpSlider?: JQuery;
    zoom: number;
    format: string;
    landscape: boolean;
    wPage?: number;
    hPage?: number;
    cols: number;
    rows: number;
    FORMAT: KeyObject;
    MARGIN: number;
    DPI: number;
    WIDTH: number;
    HEIGHT: number;
    constructor(desktop: DiagramDesktop);
    /**
     * Open print dialog
     * @funtion
     */
    open(): void;
    private bar;
    private readInput;
    private setZoom;
    private onePage;
    private fitPage;
    private doPreview;
    private toPixels;
    private pageSize;
    private preview;
    private doPrint;
}

type UndoRedoAction = "nm" | // move element(s)
"re" | // resize
"na" | // add node
"nt" | // add note
"ac" | // add container
"nr" | // remove nodes
"tr" | // remove note
"cr" | // remove container
"st" | // style
"lm";
type UndoRedoTarget = DiagramElement | DiagramElement[] | JSVG;
type UndoRedoItem = {
    a: UndoRedoAction;
    t: UndoRedoTarget;
    dx?: number;
    dy?: number;
    style?: DiagramContainerStyle | DiagramNodeStyle;
    bound?: Bound;
    points?: Point[];
    pointFrom?: DiagramElement;
    pointTo?: DiagramElement;
};
declare class DiagramUndoRedo {
    desktop: DiagramDesktop;
    list: UndoRedoItem[];
    index: number;
    max: number;
    lock: boolean;
    constructor(desktop: DiagramDesktop);
    push(data: UndoRedoItem): void;
    pushMoveElement(n: UndoRedoTarget, dx: number, dy: number): void;
    pushResizeElement(rn: DeskElementPos): void;
    pushAddNode(n: DiagramNode): void;
    pushAddNote(n: DiagramNote): void;
    pushAddContainer(c: DiagramContainer): void;
    pushRemoveNodes(l: DiagramNode[]): void;
    pushRemoveNote(n: DiagramNote): void;
    pushRemoveContainer(c: DiagramContainer): void;
    pushElementStyle(n: DiagramElement, s: KeyObject): void;
    pushMoveLink(pt: KeyObject): void;
    private copy;
    private restore;
    private restoreSize;
    private restoreStyle;
    private restoreLink;
    undo(): void;
    redo(): void;
}

/**
 * Websocket to synchronize diagrams
 * @class
 */
declare class DiagramWebsocket {
    engine: DiagramEngine;
    url: string;
    ws?: WebSocket;
    retry: number;
    constructor(engine: DiagramEngine);
    private init;
    private onUpd;
    private onDel;
    start(): void;
    stop(): void;
    send(msg: string | object): void;
    private onMessage;
}

interface diagram {
    /** SVG modelId => Simplicite.Diagram.Modeler */
    models: DiagramModelers;
    /** Opened popups with model */
    windows: DiagramWindows;
    /** Hooks namespace for SVG diagram */
    ModelHooks: KeyObject;
    /** Diagram controller */
    Engine: typeof DiagramEngine;
    /** Model controller */
    Modeler: typeof DiagramModeler;
    /** Desktop to draw one SVG model */
    Desktop: typeof DiagramDesktop;
    /** Common SVG element */
    Element: typeof DiagramElement;
    /** Node renderer */
    Node: typeof DiagramNode;
    /** Container types */
    CONTAINER: KeyNumber;
    /** Container renderer */
    Container: typeof DiagramContainer;
    /** Link rendering */
    LINK_RENDER: KeyNumber;
    /** Link type */
    LINK_TYPE: KeyNumber;
    /** Link renderer */
    Link: typeof DiagramLink;
    /** Caption renderer */
    Caption: typeof DiagramCaption;
    /** Note renderer */
    Note: typeof DiagramNote;
    /** Shape tools */
    Shape: typeof DiagramShape;
    /** Print diagram */
    Print: typeof DiagramPrint;
    /** Springs animation tools */
    Springs: typeof DiagramSprings;
    /** Tree renderer */
    Tree: typeof DiagramTree;
    /** Undo/Redo user actions */
    UndoRedo: typeof DiagramUndoRedo;
    /** Synchronize data thru WS */
    Websocket: typeof DiagramWebsocket;
}
declare const Diagram: diagram;

type Objects = "Adapter" | "Disposition" | "ObjectExternal" | "ObjectInternal" | "BPMProcess" | "Script";
type Modes = "java" | "text" | "html" | "javascript" | "typescript" | "css" | "less" | "xml" | "json" | "yaml" | "sql" | "markdown" | "perl" | "python" | "ruby" | "batchfile" | "powershell";
type Types = "java" | "txt" | "html" | "htm" | "js" | "ts" | "css" | "less" | "xml" | "json" | "yml" | "yaml" | "sql" | "md" | "pl" | "py" | "rb" | "bat" | "ps1";
type Scopes = "adapter" | "disposition" | "extobject" | "object" | "process" | "global";
type Annotation = {
    row: number;
    column: number;
    type: string;
    text: string;
};
type EditorTab = {
    key: string;
    path: string;
    icon: string;
    title: string;
    help?: string;
    sessionId: string;
    object: Objects;
    field: string;
    rowId: string;
    item: KeyObject;
    filename: string;
    mime: string;
    scope: Scopes;
    type: Types;
    mode: Modes | Types;
    editor: any;
    div: JQuery;
    hasChanged?: boolean;
    force?: boolean;
    saveall?: boolean;
    selected?: string;
    lspTimer?: number;
    javadoc?: boolean;
    jsdoc?: boolean;
    unittest?: boolean;
};
/**
 * Code editor rendering
 * @class
 */
declare class CodeEditor {
    private selectedTab?;
    private hasChanged;
    private codeEditor;
    private tab;
    private btnJavaDoc?;
    private btnJsDoc?;
    private btnRunUnitTest?;
    private btnSnippets?;
    private multiSearch?;
    private leftPane?;
    constructor();
    /**
     * Editor services
     * @param {string} service <code>prefs|open|close|save|completion|move|explore|validatets</code>
     * @param {params} params Optional parameters <code>\{ object, inst, rowId, field, scope, type, cls, prefix, force, from, to, explore, javadoc, cls, pkg \}</code>
     * @param {Object} post Optional post data with document
     * @memberof Simplicite.Ajax
     * @function
     */
    service(service: string, params?: KeyObject | null, post?: object): Promise<{
        tab?: EditorTab;
        item?: KeyObject;
        result?: string | object;
    }>;
    private getKey;
    private icon;
    private getTab;
    private getActiveTab;
    private title;
    private clickTab;
    private toggleEmpty;
    /**
     * Display the editor form
     * @param {jQuery} ctn container
     * @param {Object} p optional parameters
     * @param {function} cbk optional callback
     * @function
     */
    display(ctn: Container, p: {
        object?: string | string[];
        row_id?: string | string[];
        field?: string;
    }, cbk?: Callback): void;
    /** Close the editor */
    exit(): void;
    /**
     * Select a tab with lazy loading
     * @function
     */
    select(e: EditorTab): void;
    private toggleDoc;
    private toggleSnippets;
    /**
     * Call to open source in the tab content
     * @function
     */
    open(e: EditorTab): void;
    /**
     * Add a tab from explorer
     * @function
     */
    add(e: Partial<EditorTab>): Promise<void> | undefined;
    /**
     * Close all tabs
     * @function
     */
    closeAll(): void;
    /**
     * Close a tab
     * @function
     */
    close(e: EditorTab, cbk?: Callback): void;
    /**
     * Change event on tab
     * @function
     */
    changed(e: EditorTab, cbk?: Callback): void;
    /**
     * Save all tabs
     * @function
     */
    saveAll(cbk?: Callback, err?: (log: KeyObject) => void): void;
    compiled(r: KeyObject, cbk?: Callback, err?: (log: KeyObject) => void): void;
    private tsTimer;
    applyAnnotations(e: EditorTab, annotations: Annotation[]): void;
    /**
     * Validate Typescript code and set annotations in the editor
     * @param e {EditorTab} Editor tab
     */
    validateTypescript(e: EditorTab): void;
    /**
     * Display compilation result popup if needed
     * @param r result with error and/or warning arrays
     */
    private showCompileResult;
    private getJSErrors;
    /**
     * Write active tab
     * @function
     */
    writeActive(cbk?: Callback): void;
    /**
     * Save active tab
     * @function
     */
    saveActive(cbk?: Callback): void;
    /**
     * Format active tab
     * @function
     */
    formatActive(): void;
    /**
     * Format a source code
     * @param {string} src source code
     * @param {string} type source type js, css, less, html or java
     * @returns Promise resolved with the formatted source
     * @function
     */
    formatSource(src: string, type: string): Promise<string>;
    /**
     * Open active object
     * @function
     */
    openActive(): void;
    /**
     * Compare active tab with DB source
     * @function
     */
    compareActive(cbk?: Callback): void;
    /**
     * Get tab content value
     * @param {Object} e tab definition
     * @funtion
     */
    val(e: EditorTab): any;
    /**
     * Write tab content (only write content as file when applicable, not the save as save which saves the content as source attached to an object)
     * @param {Object} e tab definition
     * @param {function} cbk optional callback
     * @function
     */
    write(e: EditorTab, cbk?: Callback): void;
    /**
     * Save a tab
     * @param {Object} e tab definition
     * @param {function} cbk optional callback
     * @param {Object} log save all context to return errors
     * @function
     */
    save(e: EditorTab, cbk?: Callback, log?: KeyObject): void;
    /**
     * Source explorer
     * @param {jQuery} ctn Container
     * @param {Object} modules list of modules/object/doc [{ id, module, open, items:[{ object, label, field, open, list:[{ id, label, docId }] }] }]
     * @function
     */
    explorer(ctn: Container, modules: KeyObject[]): void;
    /**
     * Filter explorer
     * @function
     */
    filterExplorer(): void;
    /**
     * Activate the Search tab and focus the find input.
     * If already active, just focus the input.
     * @function
     */
    activateSearchTab(seedQuery?: string): void;
    /**
     * Ace editor
     * @param {string} key tab unique key
     * @param {Object} x tab definition and db source item {tab, item}
     * @function
     */
    openAce(key: string, x: {
        tab?: EditorTab;
        item?: KeyObject;
    }): void;
    updateIndicator(_state: string): void;
    /**
     * Compare sources with 2 ACE editors https://github.com/ace-diff/ace-diff
     * @param {Object} left left editor parameters { content, editable, copyLinkEnabled... }
     * @param {Object} right right editor parameters
     * @param {function} save optional callback(src) to apply changes in caller
     * @param {Object} options optional ace-diff options
     * @function
     */
    compare(left: KeyObject, right: KeyObject, save?: (src: string) => void, options?: KeyObject): Promise<void>;
    /**
     * Open the Javadoc URL
     * @function
     */
    javadocActive(): void;
    /**
     * Open the JSDoc URL
     * @function
     */
    jsdocActive(): void;
    /**
     * Run unit test shared code
     * @function
     */
    runUnitTest(item: KeyObject): void;
}

declare class LSP {
    /**
     * Load LSP dependencies and initialize configuration
     */
    static load(): Promise<void>;
    /**
     * Pulse animation for LSP busy indicator
     * @param $el jQuery element to pulse
     */
    static pulse($el: JQuery): void;
    /**
     * Initialize LSP server connection and configuration
     */
    static init(e: any): Promise<void>;
    /**
     * Set up WebSocket event listeners for LSP communication
     */
    static setSocket(path: string): void;
    /**
     * Register a .java editor with the java-language-server
     * @param e editor to be registered
     */
    static registerFile(e: KeyObject): void;
    /**
     * Notify the java-language-server that the watched file changes
     * @param e editor whose file is being watched
     */
    static updateFile(e: KeyObject): void;
}

type ThemeAceEditor = {
    get: () => any;
    set: (v: string) => void;
    close: Callback;
};
type ThemeCompileData = {
    theme: string;
    base: ThemeBase;
    css?: string;
    vars: KeyString;
    parentVars?: KeyString;
    addon: string;
    error?: string;
};
/**
 * Theme editor
 * @class
 */
declare class ThemeEditor {
    private theme;
    constructor(theme: BusinessObject);
    compile(data?: KeyObject, fn?: (r: ThemeCompileData) => void): Promise<void>;
    /**
     * Display the theme editor
     * @function
     */
    display(data: ThemeCompileData): Promise<void>;
    openAce(addon: JQuery, change: JQueryHandler, apply: Callback): ThemeAceEditor;
    private _menu;
    private _form;
    private _list;
    private _bookmarks;
    private _shortcuts;
}

/**
 * Client side monitoring
 * @class
 */
declare class MonitorClient {
    private static inst;
    static open(p?: {
        docked?: boolean;
        tabIndex?: number;
    }, cbk?: Callback): void;
    private body;
    private chart?;
    private div;
    private tabIndex;
    private timer0?;
    private topType;
    private selTime?;
    private heapChart0?;
    private timeChart0?;
    constructor();
    /**
     * Close monitoring
     * @function
     */
    close(): void;
    /**
     * Attach to main page
     * @function
     */
    attach(): void;
    private timer;
    private heapChart;
    private memory;
    private toTimeMs;
    private timeChart;
    private stepsChart;
    private stats;
    /**
     * Displays the monitoring
     * @param {Object} p Options
     * @param {boolean} p.docked dock monitoring on bottom
     * @param {number}  p.tabIndex tab to focus
     * @param {function} cbk Optional callback
     * @function
     */
    display(p?: {
        docked?: boolean;
        tabIndex?: number;
    }, cbk?: Callback): this;
}

declare class MonitorServer {
    private _baseURL;
    private _colors;
    private ctn;
    private _started;
    private _delay;
    private _tab;
    private _log10;
    private _tfilter;
    private _pf?;
    private _cols;
    private _timerDelay?;
    private _timerBar?;
    private _perfService?;
    private _perfTarget?;
    private _perfAction?;
    private _perfSlider;
    constructor();
    private static singleton?;
    /**
     * Render monitoring thru external access
     * <code>Simplicite.UI.View.Monitor.render(...)</code>
     * @function
     */
    static render(params: KeyObject): void;
    display(params: KeyObject): void;
    unload(): void;
    start(): void;
    stop(): void;
    clear(): void;
    clearSQL(): void;
    dumpHeap(): void;
    changeDate(dt: string): void;
    reload(dt?: string, hr?: string, delay?: string): void;
    setPlatform(pf?: string): void;
    displayTab(tab?: number, pf?: string): void;
    displayStack(id: string): void;
    interrupt(id: string): void;
    threadFilter(): void;
    forceGC(): void;
    pageSlider(p: number): void;
    pageClear(): void;
    displayPerfs(s: string, t: string, a: string): void;
    pageTop(top: string): void;
    private _timer;
    private _call;
    private _onTopUser;
    private _onMemory;
    private _onSessionCount;
    private _onHeap;
    private _onCache;
    private _onCPU;
    private _onGC;
    private _onClass;
    private _onDoc;
    private _onDisk;
    private _onJDBC;
    private _onSql;
    private _onPerf;
    private _onPerfPage;
    private _onPerfForm;
    private _onPerfList;
    private _onPerfTop;
    private _onTopSQL;
    private _snapshot;
    private _onGauge;
    private _onThreadCount;
    private _onThread;
    private _onThreadStack;
    private _onAgents;
    private _onCL;
    private _onQueues;
    private _plotSession;
    private _plotHeap;
    private _plotCache;
    private _plotCPU;
    private _plotClass;
    private _plotGC;
    private _plotDoc;
    private _plotDisk;
    private _plotSqlCount;
    private _plotSqlTime;
    private _plotSqlJDBC;
    private _plotPerfPage;
    private _plotTopUser;
    private _plotMemory;
    private _plotGauge;
    private _plotThreadPie;
    private _plotThread;
    private _plotUserAgents;
    private _title;
    private _serie;
    private _axis;
    private _logAxis;
    private _dateAxis;
    private _insideLegend;
    private _highlighter;
    private _cursor;
    private _grid;
}

declare class UIGit {
    private params;
    private ctn?;
    private msg?;
    private format?;
    private exploded?;
    constructor(params?: KeyObject);
    render(div: string): void;
    diff(commit: string, type: string): void;
    private call;
    private diffCommit;
    private diffPrevious;
    private diffCurrent;
    private history;
    private toast;
    /**
     * Display a tree difference
     * @param {(String|jQuery)} ctn Optional container
     * @param {Object} p Options
     * @param {string} p.name   Root object name
     * @param {string} p.id     Root object Id
     * @param {string} p.local  Local name
     * @param {string} p.remote Remote name
     * @param {string} p.uri    Remote URI to push patch
     * @param {string} p.login  Remote login
     * @param {string} p.pwd    Remote pwd
     * @param {(string|function)} p.preview Preview action or service (type, json)
     * @param {(string|function)} p.apply   Apply service (type, xml)
     * @param {Object} data Difference tree
     * @function
     */
    static treeDiff(ctn: Container, p: {
        title?: string;
        type: string;
        local?: string;
        remote?: string;
        reload?: string;
        object: string;
        id: string;
        apply: string | ((p: KeyObject) => void);
        preview: string | ((p: KeyObject) => void);
        patch?: KeyObject[];
        xml?: string;
        uri?: string;
        login?: string;
        pwd?: string;
    }, data: TreeNode): void;
}
/**
 * Git functor
 * @constant
 */
declare const Git: (params?: KeyObject) => UIGit;

/**
 * View item editor
 * @class
 */
declare class UIViewItemEditor extends Simplicite.UI.View.UIView {
    /**
     * Save the edited view
     * @param cbk Callback
     * @function
     */
    save(cbk?: Callback): void;
    /**
     * Edit View item
     * @function
     */
    editItem(area: JQuery, a: ViewItem, tab: number | null, n: number | null, onApply: (data: KeyObject, cbk?: Callback) => void, onRemove: Callback, onDelete: Callback): void;
}

/**
 * Template editor
 * @class
 */
declare class TemplateEditor {
    static render(ctn: AnyContainer, target: TemplateTarget, rowId: string): void;
    object?: UIBusinessObject;
    view?: View;
    metadata?: KeyObject;
    moduleId?: string;
    objectId?: string;
    isBase?: boolean;
    entity?: TemplateEntity;
    isObject?: boolean;
    isView?: boolean;
    isObjectRow?: boolean;
    isObjectSearch?: boolean;
    isGrid?: boolean;
    uiView?: UIViewItemEditor;
    redoLabel?: string;
    undoLabel?: string;
    oInternal?: BusinessObject;
    oExternal?: BusinessObject;
    oLov?: BusinessObject;
    oField?: BusinessObject;
    oFieldList?: BusinessObject;
    oObjField?: BusinessObject;
    oAction?: BusinessObject;
    oView?: BusinessObject;
    oViewItem?: BusinessObject;
    oArea?: BusinessObject;
    edit: JQuery;
    dd?: JQuery;
    origin?: JQuery;
    target?: JQuery;
    timerAutoScroll?: number;
    constructor();
    private closest;
    private xy;
    private xye;
    private element;
    private getType;
    private drag;
    private move;
    private drop;
    private cols;
    private findArea;
    private findTemplate;
    private insertElement;
    private insertRow;
    private insertArea;
    private insertView;
    private insertViewItem;
    private insertStatesNavbar;
    private selectField;
    private insertForeignKey;
    private selectRef;
    private insertExtern;
    private insertAction;
    private moveElement;
    private editElement;
    private editRow;
    /**
     * Edit area or view
     * @param ar area
     * @param tab optional area num (when displayed in a tabs)
     */
    private editArea;
    private editExtern;
    private editStatesNavbar;
    private updateStatesNavbar;
    private loadQuill;
    /**
     * Edit View item
     * @param ar area or view item or string
     * @param tab optional area num (when displayed in a tabs)
     */
    private editViewItem;
    private editField;
    private editList;
    private iconPicker;
    private textPicker;
    private editText;
    private editAction;
    private desk;
    private row2tabs;
    private tabs2row;
    private barMini;
    private barNew;
    private selectTemplate;
    private service;
    private undo;
    private redo;
    private listBases;
    private saveTemplate;
    private saveArea;
    private deleteArea;
    private saveView;
    private saveText;
    private saveList;
    private saveField;
    private saveMultipleFields;
    private saveJoinField;
    private saveMultipleJoinFields;
    private moveField;
    private deleteField;
    private saveAction;
    private deleteAction;
    private saveRef;
    private saveViewItem;
    private deleteViewItem;
    private toHTML;
    private dump;
    save(cbk?: Callback): void;
    private saveDlg;
    private init;
    private redraw;
    private getUIView;
    private grid;
    /**
     * Display the template editor
     */
    display(ctn: Container, t: TemplateEntity, def: BusinessObject, inst: UIBusinessObject | {
        metadata: View;
    }, target: TemplateTarget): Promise<void>;
    private static _iconPickerTarget?;
    /**
     * Icon picker
     * @param {jquery} inp input to set with selected icon
     * @param {boolean} embedded only content or full dialog
     * @param {string} selected optional selected icon
     * @param {function} onSelect optional callback(icon)
     * @function
     */
    static iconPicker(inp: AnyContent, embedded?: boolean, selected?: string, onSelect?: (icon: string, input: JQuery | undefined) => void): JQuery<HTMLElement>;
}

/**
 * View editor for Grid-stack
 * @class
 */
declare class UIViewEditor {
    ctn: Container;
    el?: HTMLElement;
    params: KeyObject;
    grid: any;
    element?: JQuery;
    isAdmin: boolean;
    def: View;
    oView: UIBusinessObject;
    constructor(ctn: Container, view: UIView, el: HTMLElement, params?: KeyObject);
    toolbar(): JQuery<HTMLElement>;
    start(grid: any): void;
    areaBar(a: JQuery): void;
    saveView(e?: JQuery.Event, cbk?: Callback): void;
    redraw(): void;
    hasChanged(b?: boolean): any;
    showView(): void;
    preview(): void;
    close(): void;
    bindMenu(b: boolean): void;
    getHTML(): string;
    service(name: string, data: KeyObject, cbk?: Callback): void;
    editArea(area: JQuery): void;
    removeArea(area: JQuery): void;
    fitHeights(): void;
    fitHeight(area: JQuery): void;
    compact(): void;
    deleteArea(area: JQuery, confirm?: boolean): void;
    addArea(e: KeyObject): void;
}

declare global {
    const Simplicite: SimpliciteInterface;
    const $factory: Factory;
    const $app: Session;
    const $grant: Grant;
    const $ui: UIEngine;
    const $view: UIViewer;
    const $tools: Bootstrap5;
    const $console: Console;
    const $nav: UINavigator;
    var $root: string;
}
interface MakerInterface extends SimpliciteInterface {
    Diagram: typeof Diagram;
    CodeEditor: typeof CodeEditor;
    LSP: typeof LSP;
    UIGit: typeof UIGit;
    Git: typeof Git;
    ThemeEditor: typeof ThemeEditor;
    TemplateEditor: typeof TemplateEditor;
    UIViewEditor: typeof UIViewEditor;
    UIViewItemEditor: typeof UIViewItemEditor;
    MonitorClient: typeof MonitorClient;
    MonitorServer: typeof MonitorServer;
}
declare const SimpliciteMaker: MakerInterface;
declare global {
    interface Window {
        SimpliciteMaker: MakerInterface;
    }
}

declare type ZIPTools = {
    JSZip: typeof JSZip;
    JSZipUtils: typeof JSZipUtils;
};
type LoadPart = {
    url?: string;
    type?: "JS" | "CSS" | "HTML";
    id?: string;
    name?: string;
    encoding?: string;
    target?: string | JQuery;
    silent?: boolean;
    force?: boolean;
    inline?: boolean;
    path?: string;
};
type LoadPartOnload = LoadPart & {
    onload?: (data?: string) => void;
};
/**
 * Factory to load UI components on-the-fly
 * - Never load optional components at UI loading
 * - Fix some issues when importing non ESM bundle
 * @class
 */
declare class Factory {
    private root;
    private dist;
    scripts: KeyBoolean;
    css: KeyBoolean;
    constructor();
    setRoot(root: string): void;
    /**
     * Get the root path of the application (context root)
     * @returns string
     */
    getRootPath(): string;
    /**
     * Get the path to the local distribution in /scripts
     * @returns string
     */
    getDistPath(): string;
    /**
     * Load a HTML/JS/CSS resource in the target selector
     * @param {Object} part Parameters
     * @param {string} part.name resource name
     * @param {string} part.url  or resource URL
     * @param {string} part.type "HTML", "CSS" or "JS" (or URL extension)
     * @param {string} part.target optional selector to append the "HTML" part
     * @param {string} part.silent true for no logging (not found 404)
     * @param {string} part.force ignore the local cache
     * @function
     */
    loadPart(part: string | LoadPart): Promise<void>;
    /**
     * Load HTML/JS/CSS resources
     * @param {Array} list list of parts [{ name, url, type, target }] or urls
     * @param {boolean} ordered ordered loading of each part? true by default
     * @function
     */
    loadParts(list: LoadPart[] | string[], ordered?: boolean): Promise<KeyObject> | Promise<void> | Promise<PromiseSettledResult<void>[]>;
    /**
     * Browser cache per revision
     */
    private addUrlRev;
    /**
     * Load a server CSS
     * @param {Object|string} part Parameters or URL
     * @param {string}   part.url script location
     * @param {boolean}  part.inline true to inline the styles in header (default add a link to the stylesheet)
     * @param {string}   part.silent true for no logging (not found 404)
     * @param {string}   part.force ignore the local cache
     * @param {string}   part.id optional link id (to append to head or replace)
     * @function
     */
    loadCSS(part: string | LoadPart): Promise<void>;
    /**
     * Load a disposition resource and replace [ROOT] tokens
     * @param {Object} p Parameters
     * @param {string} p.url script location
     * @param {string} p.silent true for no logging (not found 404)
     * @function
     */
    loadResource(p: LoadPart): Promise<string>;
    /**
     * Load a server JavaScript
     * @param {Object|string} part minimal parameter { url } or URL
     * @param {string} part.url script location
     * @param {string} part.encoding optional, default 'UTF-8'
     * @param {boolean} part.silent true for no logging (not found 404)
     * @param {string} part.force ignore the local cache
     * @function
     */
    loadScript(part: string | LoadPart): Promise<void>;
    /**
     * Ordered loading of JS/CSS scripts
     * @param {Object[]|string[]} list list of scripts URL (js or css)
     * @function
     */
    loadScripts(list: (string | LoadPart)[]): Promise<KeyObject>;
    /**
     * Ordered loading of HTML/JS/CSS resource(s) in the target selector
     * @param {Object|Array} p Parameters or array of parameters
     * @param {string} p.name resource name
     * @param {string} p.url  or resource URL
     * @param {string} p.type "HTML", "CSS" or "JS" (or URL extension)
     * @param {string} p.target optional selector to append the "HTML" part
     * @param {string} p.silent true for no logging (not found 404)
     * @param {string} p.force ignore the local cache
     * @returns Promise
     * @function
     */
    load(p: LoadPart | LoadPart[] | string[]): Promise<KeyObject> | Promise<void>;
    private part;
    private _bootstrap?;
    private _quill?;
    private _flatpickr?;
    private _moment?;
    private _hljs?;
    private _marked?;
    private _calendar?;
    private _select2?;
    private _qrcode?;
    private _signpad?;
    private _gridstack?;
    private _chartjs?;
    private _leaflet?;
    private _beautify?;
    private _zip?;
    private _mermaid?;
    private _mustache?;
    private _terminal?;
    reset(): void;
    /**
     * Bootstrap loader
     * @function
     */
    Bootstrap(): Promise<typeof bootstrap>;
    /**
     * JQuery loader
     * @function
     */
    JQuery(): Promise<void>;
    /**
     * Quill loader to avoid direct (non ESM) import.
     * @function
     */
    Quill(): Promise<typeof Quill__default>;
    /**
     * Quill constructor (when loaded first)
     * @function
     */
    quill(container: HTMLElement | string, options?: QuillOptions): Quill__default;
    /**
     * Flatpickr loader to avoid direct (non ESM) import.
     * @function
     */
    Flatpickr(): Promise<typeof flatpickr>;
    /**
     * flatpickr constructor (when loaded first)
     * @function
     */
    flatpickr(selector: Node, config?: Options): Instance;
    /**
     * moment loader
     * @function
     */
    Moment(): Promise<typeof moment>;
    moment(inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, language?: string, strict?: boolean): moment.Moment;
    /**
     * Load the select box component (see https://select2.org)
     * @function
     */
    Select2(): Promise<void>;
    /**
     * Load highlight tool
     * @param {object} [options] Options
     * @param {string} [options.styles] Styles (defaults to <code>default</code>)
     * @function
     */
    Highlight(options?: {
        styles?: string;
    }): Promise<typeof hljs>;
    /**
     * Load marked plugin
     * @function
     */
    Marked(): Promise<typeof marked>;
    /**
     * Calendar loading from FULLCALENDAR_LIBS or /scripts/fullcalendar.
     * <code>FULLCALENDAR_VERSION</code> is ignored = forced to 5
     * @function
     */
    Calendar(): Promise<typeof Calendar$1>;
    /**
     * Load HTML QR code plugin
     * @function
     */
    Html5Qrcode(): Promise<typeof Html5Qrcode>;
    /**
     * Load Signature pad plugin
     * @function
     */
    SignaturePad(): Promise<typeof SignaturePad>;
    /**
     * Load GridStack plugin
     * @function
     */
    GridStack(): Promise<typeof GridStack>;
    /**
     * Load Chart JS
     * @param {string} [version] Optional version
     * @function
     */
    ChartJS(version?: string): Promise<typeof Chart>;
    /**
     * Load jqplot for JQuery
     * @function
     */
    JQPlot(): Promise<void>;
    /**
     * Load Leaflet
     * @function
     */
    Leaflet(iconUrl?: string, shadowUrl?: string): Promise<typeof L$1>;
    /**
     * Load JS beautify
     * @function
     */
    Beautify(): Promise<typeof js_beautify>;
    /**
     * Load GZip tools
     * @function
     */
    JSZip(): Promise<ZIPTools>;
    /**
     * Load spectrum Color picker
     * @function
     */
    ColorPicker(): Promise<void>;
    /**
     * Load mermaid tools
     * @function
     */
    Mermaid(): Promise<typeof mermaid>;
    /**
     * Load Mustache template parser
     * @function
     */
    Mustache(): Promise<typeof mustache>;
    /**
     * Load Terminal (XTerm.js)
     * @function
     */
    XTerm(): Promise<typeof Terminal>;
    SwaggerUI(): Promise<any>;
    /**
     * Load Ace editor
     * @function
     */
    AceEditor(): Promise<any>;
    /**
     * Load ace-diff component
     * @function
     */
    AceDiff(): Promise<void>;
    /**
     * Load Typescript libraries
     * @function
     */
    TypeScript(): Promise<any>;
    /**
     * Load simplicite maker bundle: API tester, Modeler, Monitoring, Code editor/LSP, Theme editor...
     * @function
     */
    SimpliciteMaker(): Promise<typeof SimpliciteMaker>;
}

/**
 * Legacy / Compat 6.3 / Deprecated stuff
 * @class
 */
declare class Legacy {
    /**
     * Complete globals in window.Simplicite
     * @function
     */
    compat(win: Window): void;
    /**
     * Common key codes. Event.which and Event.keyCode are deprecated.
     * Handler must now use the string Event.key = "Enter", "Escape", "ArrowUp", "KeyA", "Digit0"...
     * @deprecated
     */
    readonly KEYS: {
        BACKSPACE: number;
        TAB: number;
        ENTER: number;
        SHIFT: number;
        CTRL: number;
        ALT: number;
        PAUSE: number;
        CAPS_LOCK: number;
        ESCAPE: number;
        PAGE_UP: number;
        PAGE_DOWN: number;
        END: number;
        HOME: number;
        LEFT_ARROW: number;
        UP_ARROW: number;
        RIGHT_ARROW: number;
        DOWN_ARROW: number;
        INSERT: number;
        DELETE: number;
    };
    /**
     * Current ajax session (deprecated use getApp)
     * @deprecated
     */
    getAjax(): Session | undefined;
    /**
     * Renamed to setCompletionMinSize
     * @deprecated
     */
    setCompletionSize(size: number): void;
    /**
     * Read the form field into object field (async/file reading)
     * @deprecated
     */
    readField(ctn: AnyContainer, obj?: BusinessObject, f?: ObjectField, index?: string, cbk?: (v: FieldValue) => void): UIEngine;
    /**
     * Load a server JavaScript
     * @deprecated
     */
    loadScript(part: string | LoadPartOnload): UIEngine;
    /**
     * Load a list of JS/CSS scripts (preserve ordering)
     * @deprecated
     */
    loadScripts(list: (string | LoadPart)[], onload: Callback): UIEngine;
    /**
     * Load a server CSS
     * @deprecated
     */
    loadCSS(part: string | LoadPartOnload): UIEngine;
    /**
     * Load a disposition resource and replace [ROOT] tokens
     * @deprecated
     */
    loadResource(p: LoadPartOnload): UIEngine;
    /**
     * Load a HTML/JS/CSS resource(s) in the target selector
     * @deprecated
     */
    load(p: LoadPart | LoadPart[]): Promise<unknown>;
    /**
     * Load a HTML/JS/CSS resource in the target selector
     * @deprecated
     */
    loadPart(part: string | LoadPartOnload): UIEngine;
    /**
     * Load HTML/JS/CSS resources
     * @deprecated
     */
    loadParts(list: LoadPart[] | string[], cbk?: Callback): UIEngine;
    /**
     * Load TinyMCE editor / deprecated / replaced by Quill
     * @deprecated
     */
    loadTinyMCE(cbk?: Callback): UIEngine;
    /**
     * Create the chart.js tool (based on chartjs V4)
     * @deprecated
     */
    loadCharts(cbk?: Callback): UIEngine;
    /**
     * Calendar loading from FULLCALENDAR_LIBS or /scripts/fullcalendar.
     * @deprecated
     */
    loadCalendar(cbk?: Callback): UIEngine;
    /**
     * Load Color picker
     * @deprecated
     */
    loadColorPicker(cbk?: Callback): UIEngine;
    /**
     * Load the workflow tools
     * @deprecated
     */
    loadWorkflow(cbk?: Callback): UIEngine;
    /**
     * Load the tray tools
     * @deprecated
     */
    loadTray(cbk?: Callback): UIEngine;
    /**
     * Load the map tools
     * @deprecated
     */
    loadMap(cbk?: Callback): UIEngine;
    /**
     * Load highlight tool
     * @deprecated
     */
    loadHighlight(cbk?: Callback, options?: {
        styles?: string;
    }): UIEngine;
    /**
     * Load Marked parser (Markdown to HTML)
     * @deprecated
     */
    loadMarked(cbk?: Callback): UIEngine;
    /**
     * Load leaflet maps library
     * @deprecated
     */
    loadLeaflet(cbk?: Callback): UIEngine;
    /**
     * Load the select box component (see https://select2.org)
     * @deprecated
     */
    loadSelectBox(cbk?: Callback): UIEngine;
    /**
     * Grid tool for JSON in a table
     * @deprecated
     */
    loadGridJson(cbk?: Callback): UIEngine;
    /**
     * Gridstack
     * @deprecated
     */
    loadGridStack(cbk?: Callback): UIEngine;
    /**
     * Load jqPlot
     * @deprecated
     */
    loadJqPlot(cbk?: Callback): UIEngine;
    JQPlotFixCanvasManager(): void;
    /**
     * Load Mermaid charting
     * @deprecated
     */
    loadMermaid(cbk?: Callback): UIEngine;
    /**
     * Load Mustache template parser
     * @deprecated
     */
    loadMustache(cbk?: Callback): UIEngine;
    /**
     * Load Terminal (XTerm.js)
     * @deprecated
     */
    loadTerminal(cbk?: (r: KeyObject) => void): UIEngine;
    /**
     * Load ACE editor
     * @deprecated
     */
    loadAceEditor(cbk?: Callback): UIEngine;
}

type Point = {
    x: number;
    y: number;
};
type Size = {
    w: number;
    h: number;
};
type Rect = Point & Size;
type MousePos = Point;
/**
 * UI common tools
 * @class
 */
declare class UIUtil extends Legacy {
    /**
     * Execute a script in a local scope
     * @param {string} script javascript
     * @param {Array} args list of argument names
     * @param {Array} vals list of argument values
     * @param scope optional scope to apply script (default window)
     * @param async asynchronous call (default false)
     * @function
     */
    eval(script: string, args?: string[], vals?: any[], scope?: any, async?: boolean): any;
    /**
     * Random string
     * @param len Length
     * @return Random string of specified length
     * @function
     */
    randomString(len: number): string;
    /**
     * Random DOM ID
     * @return Random unique element id in document
     * @function
     */
    randomDomId(): string;
    /**
     * Unique DOM ID
     * @param {string} id id value
     * @return The id itself if unique in page, otherwise the id with a suffix `id-<max+1>`
     * @function
     */
    uniqueDomId(id: string): string;
    /**
     * Compact a number
     * @param {number} n number
     * @param {number} p toFixed precision digits
     * @returns ex n=37215 p=1 returns 37.2k / n=2398123 p=2 returns 2.40M
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    compactNumber(n?: number, p?: number): string;
    /**
     * Test if the service is lost (call HTTP 0)
     * @function
     */
    isServiceLost(err?: Error | string | MessageFromBack): boolean;
    /**
     * Read a cookie
     * @param {string} name cookie name
     * @function
     */
    readCookie(name: string): string | null | undefined;
    /**
     * Don't ask again a question'
     * @function
     */
    dontAskAgain(p: KeyObject): boolean | ((action: string) => void);
    /**
     * Copy a text to clipboard
     * @param {string} text Text to copy
     * @param {boolean} silent True to hide the toast
     * @function
     */
    copyToClipboard(text: string, silent?: boolean): UIEngine;
    /**
     * Media sizes (XS=576, SM=768, MD=992, LG=1200)
     * mobile | tablet | medium | large
     * @static
     */
    readonly MEDIA_SIZE: {
        XS: number;
        SM: number;
        MD: number;
        LG: number;
    };
    /**
     * Get the media size
     * @param {number} w viewport width
     * @return media size
     */
    mediaSize(w: number): number;
    /** @ignore */
    _mediaSize: number;
    /**
     * Is the media a mobile ?
     * @function
     */
    isMediaMobile(): boolean;
    /**
     * Is the media a tablet ?
     * @function
     */
    isMediaTablet(): boolean;
    /**
     * Is the media a desktop ?
     * @function
     */
    isMediaDesktop(): boolean;
    /**
     * Open one object definition if granted
     * @param {string} name Object name (Field...)
     * @param {string} id Object id
     * @param {boolean} btn true to get only a button access
     * @function
     */
    gotoDefinition(name: string, id: string, btn?: boolean): JQuery<HTMLElement> | null | undefined;
    /**
     * Translate short keys
     * @param {string} keys Ctrl+Shift+Alt+Left...
     * @function
     */
    keysLabel(keys: string, lang?: string): string;
    /**
     * Set visible field messages and returns other/head messages
     * @param {(string[]|Object[])} messages Backend messages <code>code:text#level[#field]</code> (or json object)
     * @param {BusinessObject} obj Optional object to affect message when #field matches
     * @function
     */
    dispatchMessages(messages?: MessageAny[], obj?: BusinessObject): MessageJSON[] | null;
    /**
     * Concat all backend messages
     * @param r response with message or messages
     * @function
     */
    concatMessages(r: string | MessageFromBack): MessageAny[];
    /**
     * Find an action in plain or plus actions
     * @param {BusinessObject} o Object
     * @param {string} name Action name
     * @param {Object[]} list List of actions
     * @param {Object[]} plus List of 'plus' actions
     * @function
     */
    findAction(o: BusinessObject, name: string, list?: Action[] | null, plus?: Action[] | null): Action | null;
    /**
     * Read a form input file
     * @param {Object} file Input file (jQuery, input or file)
     * @param {function} cbk Required callback
     * @param {string} output Base64 (default) | ArrayBuffer | File
     * @param {function} progress Optional progress callback(loaded, total, percent)
     * @param {number} limit optional size limit (Mo) 0:no error or null=MAX_UPLOAD_SIZE
     * @function
     */
    readFile(file: Container | HTMLInputElement | File, cbk: (file: {
        id?: string;
        name: string;
        mime: string;
        content?: string | ArrayBuffer | null;
        file?: File;
    } | null) => void, output?: string, progress?: null | ((loaded: number, total: number, prct: number) => void), limit?: number | null): UIEngine | undefined;
    /**
     * Get icon from the file name
     * @params {string} name File name
     * @params {boolean} regular True to get regular icon or solid
     * @function
     */
    getFileIcon(name: string, regular?: boolean): JQuery<HTMLElement>;
    /**
     * Convert bytes to Image (supports GIF, PNG and JPEG)
     * @param {Array} buffer Image as bytes
     * @param {function} onload Optional callback
     * @return Image
     * @function
     */
    decodeImage(buffer: ArrayBuffer, onload?: ((this: GlobalEventHandlers, ev: Event) => void) | null): HTMLImageElement | null;
    /**
     * Convert SVG string to Image
     * @param data SVG image string (XML)
     * @return Image
     * @function
     */
    decodeSVGImage(data: string, onload?: ((this: GlobalEventHandlers, ev: Event) => void) | null): HTMLImageElement | null;
    /**
     * Get the mouse/touch position <code>\{x,y\}</code> on screen
     * @param {Object} e Mouse or touch event
     * @param {Object} offset Optional offset <code>\{left,top\}</code> to substract
     * @function
     */
    mousePos(e: JQuery.Event, offset?: {
        left: number;
        top: number;
    }): MousePos;
    /**
     * Is UI point into the div?
     * @param pos x,y position
     * @param div rectanglet
     * @function
     */
    isInside(pos: {
        x: number;
        y: number;
    }, div: JQuery): boolean;
    /**
     * Current screen size <code>\{w,h\}</code>
     * @member
     */
    screenSize: {
        w: number;
        h: number;
    };
    _resizing: boolean;
    /**
     * Resize window handler
     * @param {boolean} force True to force a full redraw
     * @function
     */
    resize(force?: boolean): UIEngine;
    /**
     * Append a promise to parameters
     * @param {Object|Array} p context parameters with array of promises
     * @param {(Promise|function)} f a promise or a function(resolve, reject)
     * @function
     */
    addPromise(p: KeyObject, f: Promise<unknown> | ((ok: (x?: any) => void, ko?: (x?: any) => void) => void)): any;
    /**
     * Append a promise to wait for all async images (exclude sized .icon by css)
     * @param {Object|Array} p context parameters with array of promises
     * @param {jQuery} ctn images container
     * @function
     */
    addImagesPromise(p: KeyObject, ctn: Container): void;
    /**
     * Wait for all async images (exclude sized .icon by css)
     * @param {jQuery} ctn images container
     * @returns Promise resolved when all images are loaded or not
     * @function
     */
    waitImagesPromise(ctn: Container): Promise<unknown[]>;
    /**
     * Wait for all promises of parameters
     * @param {Object|Array} p context parameters with array of promises
     * @param {number} timeout optional timeout in ms
     * @returns Promise resolved when all contextual promises are settled and removed
     * @function
     */
    waitPromises(p: KeyObject, timeout?: number): Promise<any>;
    /**
     * Execute a promise with a timeout
     * @param {Promise} p a promise
     * @param {number} timeout optional timeout in ms
     * @param {Object} ex any exception
     * @returns Promise resolved when p is resolved or rejected on timeout
     * @function
     */
    timeoutPromise(p: Promise<unknown>, timeout?: number, ex?: unknown): Promise<unknown>;
    readonly CSS_VAR_PREFIX = "--simplicite-";
    /**
     * Get value of computed CSS variable
     * @param name Variable name (prefixed or not)
     * @param el Element (default applied to body)
     * @returns Variable value
     * @function
     */
    getCSSVariable(name: string, el?: HTMLElement): string;
    /**
     * Set value of CSS variable
     * @param name Variable name (prefixed or not)
     * @param el Element (default applied to body)
     * @param val Value (undefined = remove)
     * @function
     */
    setCSSVariable(name: string, val?: string | undefined, el?: HTMLElement): void;
    getEditorTheme(): any;
    editorOptions?: KeyObject;
    loadOptions(): KeyObject;
}

type DiagramModelerTemplate = {
    id?: string;
    name?: string;
    nodes?: {
        [name: string]: DiagramNodeTemplate;
    };
    containers?: {
        [name: string]: DiagramContainerTemplate;
    };
    links?: {
        [name: string]: DiagramLinkTemplate;
    };
    canUseGrid?: boolean;
    canUseTitle?: boolean;
    canReverseLink?: boolean;
    canUseContainer?: boolean;
    canUseFreeContainer?: boolean;
    canUseNote?: boolean;
    canUseSprings?: boolean;
    canAttachContainer?: boolean;
    canUseTree?: boolean;
    canUseShape?: boolean;
    script?: string;
    canInsertNode?: (template: DiagramNodeTemplate) => boolean;
    canCreateNode?: (template: DiagramNodeTemplate) => boolean;
    canRemoveNode?: (template: DiagramNodeTemplate) => boolean;
    canDeleteNode?: (template: DiagramNodeTemplate) => boolean;
    canFetchNode?: (template: DiagramNodeTemplate) => boolean;
    canInsertContent?: (template: DiagramNodeContentTemplate) => boolean;
    canCreateContent?: (template: DiagramNodeContentTemplate) => boolean;
    canRemoveContainer?: (template: DiagramContainerTemplate) => boolean;
    canDeleteLink?: (template: DiagramLinkTemplate) => boolean;
    canAddLink?: (template: DiagramLinkTemplate) => boolean;
    customDesktopMenu?: () => DesktopMenuItem[];
    customNodeMenu?: (node: DiagramNode, item: DiagramNodeContentItem, pos: Point) => DesktopMenuItem[];
    customLinkMenuAdd?: (from: DiagramNode, to: DiagramNode, palette: JQuery) => void;
};
/**
 *
 * Model controller between Model servlet and desktop/palette/events
 * @class
 */
declare class DiagramModeler {
    modelId: string;
    template: DiagramModelerTemplate;
    root: string;
    baseURL: string;
    hidden?: boolean;
    topui: UIEngine;
    engine: DiagramEngine;
    container?: Container;
    desktop?: DiagramDesktop;
    springs?: DiagramSprings;
    printer?: DiagramPrint;
    saving: boolean;
    constructor(modelId: string, engine: DiagramEngine);
    private getObject;
    /**
     * Open a model
     * @param {Object} ctn container
     * @param {function} cbk optional callback(diagram)
     * @param {Object} p options
     * @param {boolean} p.sync synchronize all nodes with DB?
     * @function
     */
    open(ctn: Container, cbk?: (diagram: DiagramModeler) => void, p?: ModelParam): void;
    listener(): void;
    onMessage(_: KeyObject): void;
    /**
     * Generic hook call if exists in template
     * @param {string} hook hook name defined as a function in template
     * @param {function} cbk optional callback (to be called at the end of hook)
     * @param {Array} params optional parameters
     * @function
     */
    hook(hook: string, cbk?: any, params?: any): any;
    /**
     * Save the model
     * @param {function} cbk optional callback
     * @param {boolean} silent no alert?
     * @function
     */
    save(cbk?: (err?: string) => void, silent?: boolean): void;
    /**
     * Detach diagram from Parent/Popup window
     * @param {boolean} dock true to dock on parent window
     * @function
     */
    detach(dock: boolean): void;
    /**
     * Close the diagram
     * @param {boolean} confirm confirm save when has changed, auto-save if false
     * @function
     */
    close(confirm: boolean): void;
    bindSaveAndQuit(ctn: JQuery): void;
    /**
     * Can close the modeler
     * @param {boolean} confirm confirm save when has changed, auto-save if false
     * @param {function} cbk callback if closeable
     * @function
     */
    canClose(confirm?: boolean, cbk?: Callback): void;
    /**
     * Content has changed ?
     * @param {boolean} b optional flag to set the value
     * @function
     */
    hasChanged(b?: boolean): boolean;
    /**
     * Image dialog with SVG source
     * @function
     */
    imageSVG(): void;
    /**
     * Print preview
     * @function
     */
    print(): void;
    /**
     * Ajax call to retrieve node data
     * @param {Object} n { object, id, template, keys }
     * @param {function} cbk
     * @function
     */
    getNodeData(n: {
        object: string;
        id: string;
        template: string | KeyObject;
        keys?: string | object;
    }, cbk: (node?: DiagramNode | DiagramContainer) => void): void;
    /**
     * Insert nodes
     * @param {Object} list Array of { object, id, template, x, y }
     * @param {function} cbk Optional callback(nodes)
     * @function
     */
    insertNodes(list: KeyObject, cbk?: (nodes: DiagramNode[]) => void): void;
    /**
     * Insert one node or a container
     * @param {Object} item { object, id, template, x, y, keys, container? }
     * @param {function} cbk Optional callback(node)
     * @function
     */
    insertNode(item: {
        object: string;
        id: string;
        template: string | DiagramNodeTemplate;
        x: number;
        y: number;
        keys?: string | object;
        container?: boolean;
    }, cbk?: (node?: DiagramNode | DiagramContainer) => void): void;
    /**
     * Reload element from DB
     * @param {Simplicite.Diagram.Element} node node (or jquery node)
     * @param {function} cbk optional callback
     * @param {boolean} partial only get data without loading UI node
     * @function
     */
    reloadNode(node: DiagramElement | JQuery, cbk?: (data?: DiagramNode | DiagramContainer) => void, partial?: boolean): void;
    /**
     * Reload a container from DB
     * @param {Simplicite.Diagram.Container} ct container (or jquery node)
     * @param {function} cbk optional callback
     * @function
     */
    reloadContainer(ct: DiagramContainer | JQuery, cbk?: Callback): void;
    /**
     * Reload all elements from DB
     * @param {function} cbk optional callback
     * @function
     */
    reload(cbk?: Callback): void;
    /**
     * Select objects and insert them on desktop
     * @param {string} tpl node/container template
     * @param {Point} pos position {x,y}
     * @param {boolean} cont container ? or node
     * @function
     */
    selectObjects(tpl: DiagramNodeTemplate | DiagramContainerTemplate, pos?: Point, cont?: boolean): void;
    /**
     * Launch a node/container creation in UI
     * @param {string} tpl node template
     * @param {Poisition} pos position {x,y}
     * @param {boolean} cont container ? or node
     * @function
     */
    createNode(tpl: DiagramNodeTemplate, pos: Point, cont?: boolean): void;
    /**
     * Delete node from DB + UI
     * @function
     */
    deleteNode(node: DiagramNode, silent?: boolean): void;
    /**
     * Delete link from DB + UI
     * @function
     */
    deleteLink(link: DiagramLink, silent?: boolean): void;
    /**
     * Update fields thru Ajax
     * @function
     */
    upd(obj: string, id: string, fields: {
        field: string;
        value: any;
    }[], cbk?: Callback): void;
    /**
     * Delete object thru Ajax
     * @function
     */
    del(obj: string, id: string, cbk?: Callback): void;
    /**
     * Call action on object form
     * @function
     */
    forceUIAction(obj: string, id: string, action: string): void;
    /**
     * Select content to add in node
     */
    selectNodeContent(node: DiagramNode, c: DiagramNodeContentTemplate): void;
    insertNodeContents(node: DiagramNode, items?: KeyObject[]): void;
    insertNodeContent(node: DiagramNode, item: KeyObject, cbk?: Callback): void;
    createContentLink(n: DiagramNode, t: DiagramNodeContentTemplate, id: string, cbk?: Callback): void;
    addNodeContent(n: DiagramNode, c: DiagramNodeContentTemplate): void;
    /**
     * Fetch related nodes
     * @param {Array} nodes arrays of nodes or data
     * @param {function} cbk Optional callback(nodes)
     * @function
     */
    fetchRelatedNodes(nodes?: DiagramNode[] | JQuery, cbk?: (inserted?: DiagramNode[]) => void): void;
    /**
     * Create a link between 2 nodes (or note to node)
     * @function
     */
    createLink(from: DiagramNodus, to: DiagramNode, t?: DiagramLinkTemplate): JSVG | undefined;
    /**
     * Create a N,N link between 2 internal objects
     * @function
     */
    createLinkMany2Many(from: DiagramNode, to: DiagramNode, cbk?: (node?: DiagramNode | DiagramContainer) => void): void;
    /**
     * Bind events to element
     */
    bind(el: any, b: {
        mouseWheel?: JQueryHandler;
        mouseDown?: JQueryHandler;
        mouseMove?: JQueryHandler;
        mouseUp?: JQueryHandler;
        mouseOut?: JQueryHandler;
        mouseOver?: JQueryHandler;
        mouseLeave?: JQueryHandler;
        contextMenu?: JQueryHandler;
        click?: JQueryHandler;
        dblClick?: JQueryHandler;
    }): void;
    /**
     * Open target or related model form
     * @param {Object} target optional <code>{ object, id }</code>
     * @function
     */
    openForm(target?: {
        object: string;
        id: string;
    } | JSVG): void;
    /**
     * Open workflow on top window
     * @param {string} name workflow name
     * @function
     */
    openWorkflow(name: string): void;
    /**
     * Load the template definition
     * @function
     */
    loadTemplate(cbk?: Callback): void;
    /**
     * Load model
     * @param {function} cbk post load function
     * @function
     */
    loadModel(cbk: (model: string) => void): void;
    /**
     * Get SVG inlined styles
     * @function
     */
    getStyles(): string | undefined;
    /**
     * Get model data
     * @function
     */
    info(cbk: (data: DiagramCaption) => void): void;
    /**
     * Nodes self-placement with Springs layout
     * @param {Object} data false to disable, or the $(svg) or the springs properties
     * @function
     */
    layoutSprings(data: boolean | DiagramSpringsParam | JSVG): void;
}

type DiagramModelers = {
    [modeId: string]: DiagramModeler;
};
type DiagramWindows = {
    [modeId: string]: Window;
};
type ModelParam = {
    docked?: boolean;
    popup?: boolean;
    hidden?: boolean;
    sync?: boolean;
    fetch?: boolean;
    module?: string;
    nodes?: DiagramNode[];
};
/**
 * Diagrams controller
 * @class
 */
declare class DiagramEngine {
    readonly models: DiagramModelers;
    readonly windows: DiagramWindows;
    /** SVG styles */
    styles?: string;
    constructor();
    /**
     * Open a SVG diagram
     * @function
     */
    private openSVG;
    /**
     * Open a diagram
     * @param {string} modelId model row ID
     * @param {Object} options <code>\{ name, docked, hidden, sync \}</code>
     * @param {function} cbk optional callback(model)
     * @function
     */
    open(modelId: string, options?: ModelParam, cbk?: (model: DiagramModeler) => void): void;
    /**
     * Detach diagram from Parent/Popup window
     * @param {string} modelId model row ID
     * @param {boolean} dock true to dock diagram on parent window, false to open a new window
     * @function
     */
    detach(modelId: string, dock: boolean): void;
    /**
     * Save a diagram
     * @param {string} modelId model row ID
     * @param {function} cbk optional callback
     * @function
     */
    save(modelId: string, cbk?: Callback): void;
    /**
     * Close a diagram
     * @param {string} modelId model row ID
     * @param {boolean} confirm false to auto-save
     * @function
     */
    close(modelId: string, confirm?: boolean): void;
    /**
     * Update models with incoming object
     * @function
     */
    update(obj: string | BusinessObject, id: string, action: string): void;
    /**
     * Notify UI events (CRUD on objects)
     * @function
     */
    notify(e: NotifyObject): void;
    /**
     * Helper to create a new SVG business model, user must have access to ModelTemplate (read) and Model (create).
     * @param {string} template Model template name
     * @param {string} name     Model name
     * @param {Object} options  Model options
     * @param {boolean} options.docked true to dock the model on the main page (default new window)
     * @param {boolean} options.hidden true to hide the model in a silent mode
     * @param {Array}   options.nodes  optional array of nodes to insert <code>\{ object, id, template, x, y \}</code>
     * @param {boolean} options.fetch  true to fetch related nodes
     * @param {boolean} options.module Optional module Id or name
     * @param {function} cbk Callback(diagram)
     * @function
     */
    create(template: string, name: string, options: ModelParam, cbk: (diagram: DiagramModeler) => void): void;
    /**
     * Models picker and creation
     * @param {jQuery} ctn Container
     * @param {Object} params options { embedded }
     * @function
     */
    picker(ctn: Container, params?: KeyObject): void;
}

type FeedbackData = {
    browser: {
        userAgent: string;
    };
    user: {
        login: string;
        lang: string;
        email?: string;
        resp: string;
    };
    app: {
        name: string;
        version: string;
    };
    platform: {
        name: string;
        version: string;
        build: string;
        encoding: string;
    };
    server: {
        vendor: string;
        version: string;
        dbdriver: string;
        date: string;
    };
    java: {
        vendor: string;
        version: string;
    };
    os: {
        name: string;
        version: string;
        archi: string;
    };
};
type FeedbackParam = {
    fbk_email: string;
    fbk_type: string;
    fbk_desc: string;
    screen?: string;
};
declare class Feedback {
    readonly WIDTH = 1024;
    private ctn?;
    private dlg?;
    private screen?;
    open(): this;
    ready(): this;
    close(): this;
    send(): this;
    hide(): this;
    crop(): this;
    light(): this;
    mask(): this;
    reset(): this;
    toggle(id?: string): this;
    getMode(): 0 | 1 | 2 | 3;
    showEditButtons(vis: boolean): void;
    drawCanvas(screen?: string): this;
    getContent(): JQuery<HTMLElement>;
}

type SplitPart = {
    content?: Container | string;
    resizable?: boolean;
    height?: string;
    width?: string;
    collapsible?: boolean;
    collapsed?: boolean;
    splitWidth?: string;
    splitHeight?: string;
};
type LoadTargetArea = 'work_tab' | 'work_left' | 'work_right' | 'work_top' | 'work_bottom';
type WorkAreaOptions = {
    id?: number;
    noSplit?: boolean;
};
type WorkTabContextMenu = {
    split?: boolean;
    close?: boolean;
};
type WorkAreaSize = {
    /** optional area width in px or rem (only applies on horizontal split) */
    width?: number | string;
    /** optional area height in px or rem (only applies on vertical split) */
    height?: number | string;
};
type WorkTabInfos = {
    /** required tab label */
    title: string;
    /** unique name to find the tab when requested with unique=true */
    name: string;
    /** unique tab? default true = if a tab with the same name already exists, activate it instead of creating a new one */
    unique?: boolean;
    /** can move the tab, default true */
    draggable?: boolean;
    /** add a close button to tab, default true */
    closeable?: boolean;
    /** optional context menu to split/close */
    contextmenu?: WorkTabContextMenu;
    /** add a .desk with navigation into container */
    navigation?: true | number;
    /** specific external URL from loadURL */
    url?: string;
};
type WorkTabOptions = WorkTabInfos & WorkAreaSize & {
    /** new 'tab' or position: 'left','top','right' or 'bottom' */
    position?: NewTabPosition;
    /** open in top-level area (default true, false = open in caller area) */
    toplevel?: boolean;
};
type WorkTab = WorkTabInfos & WorkAreaSize & {
    id: number;
    nav?: NavItem[];
    active?: boolean;
};
type WorkTabs = {
    tabs: WorkTab[];
};
type WorkAreas = {
    vertical?: true;
    areas: WorkAreaItem[];
};
type WorkAreaItem = {
    content: WorkAreas | WorkTabs;
    id?: number;
    width?: string;
    height?: string;
};
type WorkAreaSettings = WorkTabs | WorkAreas;
/**
 * Tools to split the work area
 * @class
 */
declare class UISplitter {
    private worktabId;
    private navId;
    private defaultWorkArea;
    readonly MIN_SIZE = 300;
    private autoSave;
    private saveTimer;
    private saveKey;
    /**
     * Init splitter #work for media desktop only
     * @param scope current user scope
     * @function
     */
    init(scope?: Scope): void;
    /**
     * Allows UI to be splittable. Preserved in localStorage.
     * @param enable optional to enable/disable
     * @returns true if the UI is splittable
     * @function
     */
    static enabled(enable?: boolean): boolean;
    /**
     * Is splitted mode enabled?
     * @returns true if user is allowed to split work-areas
     * @function
     */
    isEnabled(): boolean;
    /**
     * Scope preference to enable/disable the splitter mode, preserved in localStorage key <code>splitter_\<scope\></code>
     * @param enabled true to enable, false to disable or undefined to get the current preference
     * @returns the current preference or null
     * @function
     */
    static localPreference(scope?: Scope, enabled?: boolean): string | null;
    /**
     * Allows user to switch between 2 modes: mono work-area / multi work-areas
     * @param switchable optional to enable/disable
     * @returns true if the mode is switchable
     */
    static switchable(switchable?: boolean): boolean;
    /**
     * Switch button to change the splitter mode
     * @function
     */
    switchButton(): JQuery<HTMLElement>;
    /**
     * Switch the splitter mode
     * @param enabled optional to force/abandon the splitted mode or toggle the mode by default
     * @param home optional to display the home page after switching mode (default true)
     * @function
     */
    switch(enabled?: boolean, home?: boolean): void;
    /**
     * Switch from single work area to multiple work areas (splitter mode).
     * Creates a first default, non-closeable "home" tab then replaces the legacy #work content.
     * @function
     */
    private singleToMultiple;
    /**
     * Switch from multiple work areas back to single (legacy 6.3) mode.
     * Preserves the first desk and its navigation, resets all id increments,
     * closes all other tabs, then wraps the result in a legacy .split container.
     * @function
     */
    private multipleToSingle;
    /**
     * Load user's parameter SPLITTER and rebuild the UI
     * @param settings optional settings to load instead of user's parameter
     * @returns true if the UI has been rebuilt with saved settings
     * @function
     */
    load(settings?: WorkAreaSettings): boolean;
    /**
     * Rebuild the UI with SPLITTER settings
     * @function
     */
    build(settings: WorkAreaSettings): void;
    /**
     * Save into user's parameter SPLITTER
     * @function
     */
    save(): Promise<void>;
    /**
     * Auto-save request into user's parameter SPLITTER.
     * @function
     */
    saveRequest(): void;
    /**
     * Tree of areas and navigations
     * @function
     */
    jsonTree(): WorkAreaSettings;
    /**
     * Simple request for a new tab or a new split area.
     * @param {WorkTabOptions} options Tab options
     * @param {JQuery} caller The element that triggered the request
     * @returns the new container to display the content (.content or .work-area-content) or null to use default work-area
     * @function
     */
    request(options: WorkTabOptions, caller?: AnyContainer): JQuery | null;
    /**
     * Create a desk with a new navigation including 2 parts: .nav-stack and .content
     * @param {JQuery} ctn container (specific or .work-tab-content)
     * @param {Container} content optional HTML content to display
     * @param {number} navId optional restored nav Id (default incremental)
     * @returns .desk.nav-container
     * @function
     */
    createDeskNavigator(ctn: JQuery, content?: Container | null, navId?: number): JQuery;
    /**
     * Create a work-area with a tabs of desks
     * @param {Object} options Work area options
     * @param {WorkTabOptions} tabOptions optional tab options to create a first tab with a desk
     * @param {JQuery} content optional content to insert in the new area
     * @returns .work-area
     * @function
     */
    createWorkArea(options?: WorkAreaOptions, tabOptions?: WorkTabOptions, content?: JQuery): JQuery<HTMLElement>;
    /**
     * Add a tab to .work-tab
     * @param {JQuery} worktab Optional existing work tabs (default use the first tabs)
     * @param {WorkTabOptions} options Tab options
     * @param {JQuery} content optional content to insert
     * @function
     */
    appendTab(worktab: JQuery | null, options?: WorkTabOptions, content?: JQuery): {
        tab: JQuery<HTMLElement>;
        tabpane: JQuery<HTMLElement>;
    };
    /**
     * Get the work tab content of a tab
     * @param {JQuery} tab tab anchor .nav-link or .nav-item
     * @returns .work-tab-content
     * @function
     */
    getWorkTabContent(tab: JQuery): JQuery | undefined;
    /**
     * Get the desk content of a tab
     * @param {JQuery} el the .nav-link or a container
     * @returns desk .content for rendering if exists (or directly the .work-tab-content when the tab has no navigation)
     * @function
     */
    getDeskContent(el: JQuery): JQuery<HTMLElement>;
    /**
     * Find a tab in all work-areas
     * @param name Optional tab name to find
     * @returns .nav-link if found
     * @function
     */
    findTab(name?: string): JQuery | undefined;
    /**
     * Get a tab of related element
     * @param el any content element inside the .work-tab-pane
     * @returns .nav-link of the related tab if exists
     * @function
     */
    getTabOfElement(el?: AnyContainer): JQuery | undefined;
    /**
     * Get the tab container of element
     * @param el Element inside the .work-tab
     * @returns .work-tab if exists
     * @function
     */
    getWorkTab(el?: AnyContainer): JQuery | undefined;
    /**
     * Get the work-area of element
     * @param el Element inside the .work-area
     * @returns .work-area if exists
     * @function
     */
    getWorkArea(el?: AnyContainer): JQuery | undefined;
    /**
     * Set the options for a work tab
     * @param {JQuery} el tab anchor .nav-link or .nav-item
     * @param {WorkTabOptions} options the options to store in a.data("worktab")
     * @function
     */
    setTabOptions(el?: JQuery, options?: WorkTabOptions): void;
    /**
     * Update the options for a work tab from navigation data
     * @param {JQuery} el Element
     * @param {string} label the label of the navigation item
     * @param {string} name optional (unique) name of the navigation item
     * @param {string} url optional URL of the navigation item
     * @function
     */
    updateTabOptions(el?: AnyContainer, label?: string, name?: string, url?: string): void;
    /**
     * Update the tab label
     * @param el any content element inside the .work-tab-pane (or .nav-link or .nav-item)
     * @param label New label
     * @function
     */
    setTabLabel(el?: AnyContainer, label?: string): void;
    /**
     * Activate a tab
     * @param el any content element inside the .work-tab-pane
     * @function
     */
    activateTab(el: AnyContainer): JQuery | undefined;
    /**
     * Activate the first work-area tab
     * @function
     */
    activateFirstTab(): JQuery | undefined;
    /**
     * Get the first work-area content: #work0 (or default #work if no enabled)
     * @param {boolean} activate activate the first tab to show the content?
     * @function
     */
    getDefaultWorkContent(activate?: boolean): JQuery;
    /**
     * Move a tab in a new work-area
     * @param {JQuery} tab tab .nav-link to move
     * @param {JQuery} workArea target workarea to split
     * @param {string} pos position for the tab content top/left/right/bottom
     * @function
     */
    moveTabToWorkArea(tab: JQuery, workArea: JQuery, pos: Position): void;
    /**
     * Move a tab in other tab
     * @param tab tab .nav-link to move
     * @param targetTab target tab
     * @param pos place the tab on the 'left' or the 'right' of the target tab
     * @function
     */
    moveTabToTab(tab: JQuery, targetTab: JQuery, pos: 'left' | 'right'): void;
    /**
     * Close a tab if can close
     * @param tab .nav-link to close
     * @param checkCanClose check can close the tab content? default true. false = only destroy the content
     * @param activatePrevious activate the previous tab if exists? default true
     * @function
     */
    closeTab(tab: JQuery, checkCanClose?: boolean, activatePrevious?: boolean): Promise<void>;
    /**
     * Remove a content and its tab
     * @param el any content element inside the .work-tab-pane
     * @param checkCanClose check can close the tab content? default true. false = only destroy the content
     * @function
     */
    remove(el: AnyContainer, checkCanClose?: boolean): void;
    /**
     * Close all tabs if can close
     * @param checkCanClose check can close the tab contents?
     * @function
     */
    closeAll(checkCanClose?: boolean): Promise<void>;
    /**
     * Remove a tab of a work-area
     * ZZZ not public: use closeTab to destroy the content first
     * @param tab the .nav-link to remove
     * @param prev click on previous (or next) tab if exists
     * @function
     */
    private removeTab;
    /**
     * Remove a work-area and its children
     * @param workarea .work-area to remove
     * @function
     */
    removeWorkArea(workarea: JQuery): Promise<void>;
    private refreshTimer;
    /**
     * Refresh container when moved/splitted/resized
     * @param ctn container with events ui.resize and ui.zoom
     * @param resize true to force a resizing
     * @function
     */
    refresh(ctn: JQuery, resize?: boolean): void;
    /**
     * Create a .work-area and/or assign a split direction
     * @param {JQuery} workarea optional .work-area to (re)assign (default returns a new one)
     * @param {boolean} vertical optional, true to split vertically, false to split horizontally
     * @param {JQuery[]} children optional list of .work-area to append
     * @returns
     */
    workArea(workarea?: JQuery | null, vertical?: boolean, children?: JQuery[]): JQuery;
    /**
     * Split a work-area
     * @param {jQuery} workarea .work-area to split (default the root one)
     * @param {string} pos insert at position left/right/top/bottom
     * @param {WorkTabOptions} tabOptions tab options
     * @param {JQuery} content optional content to insert in the new area
     * @returns newArea and content
     * @function
     */
    splitWorkArea(workarea: JQuery | null, pos: Position | undefined, tabOptions: WorkTabOptions, content?: JQuery): {
        newArea: JQuery;
        content: JQuery;
    };
    /**
     * Convert a CSS size value to pixels.
     * Supports plain numbers (treated as px), "rem" units (1rem = 16px),
     * and "%" relative to the total #work width.
     * @param value Size as a number (px) or a CSS string ("300px", "20rem", "50%")
     * @returns Equivalent size in pixels
     */
    private toPixel;
    /**
     * Resize a work area (and its next area) in a horizontal split
     * @param {JQuery} workarea workarea to resize
     * @param {number} width width in pixels or in rem (or in % of the #work)
     * @function
     */
    setWidth(workarea: JQuery, width: number | string, store?: boolean): void;
    /**
     * Resize a work area (and its next area) in a vertical split
     * @param {JQuery} workarea workarea to resize
     * @param {number} height height in pixels or in rem (or in % of the #work)
     * @function
     */
    setHeight(workarea: JQuery, height: number | string, store?: boolean): void;
    /**
     * Resize a work area (and its next area) in the split direction
     * @param {JQuery} workarea workarea to resize
     * @param {boolean} horizontal or vertical
     * @param {number} size new size in pixels (fit to parent size if unset)
     * @param {boolean} save save preference?
     * @function
     */
    setSize(workarea: JQuery, horizontal: boolean, size: number, save?: boolean): void;
    /**
     * Resize all work areas to fit 100% of the container
     * @param {JQuery} workarea container
     * @function
     */
    fitSize(workarea: JQuery): void;
    /**
     * Create context menu to request for the new tab position
     * @param el Right clicked element
     * @param e Context menu event
     * @param request callback with requested position
     * @param items optional previous menu items
     */
    contextMenu(el: JQuery, e: JQuery.ContextMenuEvent, request?: (pos: NewTabPosition) => void, items?: (DropdownItem | JQuery)[]): JQuery<HTMLElement> | undefined;
    /**
     * Add a context menu on follow link to open the target in a new tab or side
     * @param title Tab title
     * @param fl FollowLink definition with object and rowId to open the form
     * @param el Caller element to bind the context menu
     */
    followLinkContextMenu(title: string, fl: FollowLink, el: JQuery): void;
    /**
     * Stop event and return mouse position
     * @function
     */
    private xy;
    /**
     * Drag & drop separator to resize sibling areas
     * @function
     */
    private dragSeparator;
    /**
     * Drag & drop tab
     * @function
     */
    private dragTab;
    /**
     * Split the container in 2 parts (any previous split is removed).
     * @param {jQuery} ctnr container
     * @param {string} pos position left|right|top|bottom, default 'top'
     * @param {(object|jQuery)} options optional parameters or content
     * @param {jQuery}  options.content content to add at position
     * @param {boolean} options.resizable can resize content ?
     * @param {string}  options.height optional content height
     * @param {string}  options.width optional content width (in rem, px, %)
     * @param {boolean} options.collapsible can collapse content ?
     * @param {boolean} options.collapsed collapsed by default ?
     * @param {boolean} options.splitWidth optional split width (default 100%, may be "auto" to let the scroll-x to parent element)
     * @param {boolean} options.splitHeight optional split height (default 100%, may be "auto" to let the scroll-y to parent element)
     * @function
     */
    splitPart(ctnr: AnyContainer, pos: Position, options: SplitPart | JQuery): void;
    /**
     * Remove the splitted content
     * @param {jQuery} ctn container with splitted contents
     * @function
     */
    unsplitPart(ctn: string | Container): void;
}

type LoadTarget = 'frame_work' | '_blank' | '_top' | '_popup' | LoadTargetArea;
type LoadParam = NavParam & {
    /** Optional target _blank, _top or _popup */
    target?: LoadTarget;
    width?: string;
    height?: string;
    /** Optional label to display in nav/dialog/download */
    label?: string;
    /** Optional name for the external object */
    name?: string;
    /** Optional object of action */
    object?: string | BusinessObject;
    /** Optional instance of object */
    inst?: string;
    /** Optional object row ID (form/row action) */
    rowId?: string;
    /** Optional object item (form/row action) */
    item?: RowItem | null;
    /** Optional data of external object (extobject, fields) */
    data?: KeyObject;
    /** Optional related action */
    action?: string | Action;
    /** Optional flag to inline content */
    noiframe?: boolean;
    xhr?: XMLHttpRequest;
    /** Optional reader(content-type, attach, filename, blob, defaultReader, cbk) to override default download into container */
    reader?: (contenttype: string, attach: boolean, filename: string, blob: string, defaultReader: (ct: string, _att: boolean, filename: string, res: File) => void, cbk?: Callback) => void;
};
/**
 * UI Loader tool
 * @class
 */
declare class UILoader extends UIUtil {
    /**
     * Common file extension icon
     * @static
     */
    readonly FILE_ICONS: KeyString;
    feedback?: Feedback;
    labelDisconnected?: string;
    readonly nav: UINavigator;
    /**
     * Mime type to file extension
     * @static
     */
    readonly MIME_EXT: KeyString;
    constructor();
    /**
     * When page is loaded: load user rights, menu, texts and engine.<br />
     * Then call the main page service.
     * @param {Globals} options some globals options to override
     * @function
     */
    ready(app: Session, engine: string, options?: Partial<typeof Globals>): Promise<void>;
    /**
     * Set the Ajax APIs
     * @param {Ajax} app Simplicite.Ajax instance
     * @function
     */
    setAjax(app: Session): UIEngine;
    /**
     * Returns the local client Id from local storage.
     * Used to identify the client in session and to change user on server-side in god mode.
     * @function
     */
    clientId(): string;
    /**
     * Open the user session with authtoken
     * @param {Object} params options
     * @param {string} params.scope optional user scope or home view
     * @param {string} params.clientId optional clientId (local storage to change users)
     * @returns Session infos
     * @function
     */
    session(params?: {
        scope?: string;
        clientId?: string;
    }): Promise<KeyObject>;
    /**
     * Default logout: confirm (with text CONFIRM_LOGOUT) and save session before quit
     * @param {Object} params logout parameters
     * @param {boolean} params.confirm true to confirm the logout
     * @param {string}  params.url     optional new location URL
     * @param {string}  params.login   optional user login to switch session
     * @param {string}  params.token   optional user token to switch session
     * @function
     */
    logout(params: {
        confirm?: boolean;
        url?: string;
        login?: string;
        token?: string;
    }): void;
    /**
     * Default quit is a session logout
     * @param {Object} params logout parameters
     * @param {string}  params.url   optional new location URL to change scope
     * @param {string}  params.login optional user login to change user
     * @function
     */
    quit(params?: {
        url?: string;
        login?: string;
    }): UIEngine;
    /**
     * Save the session
     * @function
     */
    saveSession(): Promise<void>;
    /**
     * Load the Rendering engine
     * @param {string} name extended engine name (forced to bootstrap5)
     * @function
     */
    loadEngine(name: string): Promise<void>;
    /**
     * Bind server side events.
     * Custom messages from back-end
     * <code>ServerSideEvent.notify("myCustomEvent", "message", userId)</code>
     * Must be binded on "ui.ready"" with
     * <code>$ui.sse.addEventListener("myCustomEvent", e => e.data ... );</code>
     * @function
     */
    bindEventSource(): boolean;
    /**
     * Websocket handler for partial clear cache
     * @param {Object} d <code>\{ object, name \}</code>
     * @ignore
     */
    private onClearCache;
    /**
     * System clear cache
     * @param {string} action Action <code>cc|dc|gc</code> for server, all sessions or granted user
     * @function
     */
    clearCache(action: string): void;
    /**
     * SSE handler for object usage
     * @param {Object} d <code>\{ object, action, emitter \}</code>
     * @ignore
     */
    private onActionObject;
    /**
     * SSE handler for internal notification
     * @param {Object} n <code>\{ count, message, incoming, userId \}</code>
     * @ignore
     */
    private onNotif;
    /**
     * SSE handler for incoming news
     * @ignore
     */
    private onNews;
    /**
     * Default keydown handler
     * <br>CTRL-S : trigger "ui.key.ctrls" to all "js-ctrl-s" elements
     * <br>ESCAPE : in order of priority close dialog, blur field (remove focus), or back in navigation
     * <br>SHIFT-LEFT/RIGHT : navigation between list items
     * <br>ALT-H : back to the home page
     * <br>ALT-M : focus last visited menu item
     * <br>ALT-W : wide screen = toggle menu
     * <br>ALT-B : open the bookmarks dialog
     * <br>ALT-F : focus the global searchbox
     * <br>ALT-L : focus the first list row
     * <br>ALT-N : focus the next area/panel
     * @param {Object} e Key event
     * @function
     */
    private keydown;
    /**
     * Displays all site parts:
     * <ul>
     * <li>Create main div</li>
     * <li>load only options.resources if specified</li>
     * <li>load part MAIN/HEADER/FOOTER/MENU/WORK when options.useMainParts=true</li>
     * <li>load STYLES + SCRIPT resources of disposition or object</li>
     * </ul>
     * @function
     */
    main(cbk: Callback): Promise<void>;
    /**
     * Load the FOOTER_ADDON if exists
     * @function
     */
    footerAddon(): void;
    /**
     * Change the current CSS theme
     * @param {string} base 'light' or 'dark' reboot
     * @param {string} theme theme name to load (vars + addon styles)
     * @function
     */
    setTheme(base?: ThemeBase, theme?: string): Promise<void>;
    /**
     * Add keys shortcuts to document
     * @param {Object} keys Pair of ('ctrl' | 'shift' | 'alt') + letter or char-code = callback or shortcut definition
     */
    addShortcuts(keys: ShortcutKeys): void;
    /**
     * Open the URL in a new window
     * @param {string} url URL to open
     * @param {string} target Optional, default <code>'_blank'</code>
     * @function
     */
    openURL(url: string, target?: string): void;
    /**
     * Open the url in a separate window with the UI engine
     * @param {string} url URL to load in a new window
     * @param {Object} options Detach options
     * @param {string}  [options.name=detachurl] Optional window name
     * @param {number}  [options.width=1200]  Optional window width in px
     * @param {number}  [options.height=700] Optional window height in px
     * @param {number}  [options.top=0] Optional window top in px
     * @param {number}  [options.left=0] Optional window left in px (default 0)
     * @param {boolean} options.full True to load the main parts (menu, header... default load the URL in div.main without parts)
     * @return new window
     * @function
     */
    detachURL(url: string, options?: {
        name?: string;
        width?: number;
        height?: number;
        top?: number;
        left?: number;
        full?: boolean;
    }): Window | null;
    /**
     * Call periodically to check if the response is completed
     * @param {jQuery} ctn Container to load the URL
     * @param {string} url URL to launch the asynchronous task on server side, and be polled with a check parameter periodically, must respond 202 while the task is not completed
     * @param {Object} params Optional parameters for loadURL
     * @param {function} pgs Optional progress callback(message)
     * @returns Promise when loaded, or catch when stopped
     * @function
     */
    waitForURL(ctn: Container, url: string, params?: LoadParam, pgs?: (msg: string | ArrayBuffer | null) => void): Promise<void>;
    /**
     * Load URL in a container: wrap the URL to specific controllers (list, form...) or call the back-end thru ajax
     * @param {(string|jQuery)} ctn Container to load the URL (default is #work)
     * @param {string} url URL to load
     * @param {LoadParam} options Contextual parameters
     * @param {function} cbk Optional callback when loaded
     * @function
     */
    loadURL(ctn: AnyContainer, url: string, options?: LoadParam | null, cbk?: Callback): this;
    getUIObject(obj: string | BusinessObject, cbk?: (obj: UIBusinessObject) => void, params?: KeyObject): Promise<UIBusinessObject>;
    getUIObject(object: string | BusinessObject, inst?: string | null | ((obj: UIBusinessObject) => void), cbk?: ((obj: UIBusinessObject) => void) | KeyObject, params?: KeyObject): Promise<UIBusinessObject>;
    getNavObject(ctn: AnyContainer, obj: string | BusinessObject, cbk?: (obj: UIBusinessObject) => void, params?: KeyObject): Promise<UIBusinessObject>;
    getNavObject(ctn: AnyContainer, object: string | BusinessObject, inst?: string | null | ((obj: UIBusinessObject) => void), cbk?: ((obj: UIBusinessObject) => void) | KeyObject, params?: KeyObject): Promise<UIBusinessObject>;
    /**
     * Generate the instance name within the component navigator.
     * Returns the common instance name on main navigation, otherwise add a suffix ex: the_ajax_(name)_nav(id)
     * @param {string|jQuery} c Component
     * @param {(string|BusinessObject)} obj Object name or BusinessObject
     * @param {string} inst Optional instance name, default = <code>the_ajax_(name)</code>
     * @function
     */
    getNavInstanceName(c: AnyContainer, obj: string | BusinessObject, inst?: string): string;
    _webpush?: WebPush;
    /**
     * WebPush service
     * @function
     */
    webpush(data: KeyObject): WebPush;
    _firebase?: Firebase;
    /**
     * Firebase service wrapper
     * @param {KeyObject} data Service data, with optional keys:
     * `config` (init web browser to receive notification),
     * `token` (add the device token to FIREBASE_TOKENS on server side),
     * `tap` (incoming notification has been tapped by user?),
     * `body` (optional received message),
     * `title` (optional message title),
     * `from` (optional message origin),
     * `message` (message to send on server-side),
     * `to` (recipients `{ users:[], groups:[] }` or `'all'` users)
     * @function
     */
    firebase(data: KeyObject): Firebase;
    /**
     * Firebase default handler when a message is received thru FCM or worker.
     * @param {Object} m Message or notification, with optional keys:
     * `notification` (optional embedded message with title and body),
     * `body` (message body),
     * `title` (optional title),
     * `priority` (optional priority `'high'|'normal'|'low'`),
     * `data` (optional pairs of key-value, may be present on top of message, e.g. `object` and `rowId`),
     * `tap` (foreground or background),
     * `icon` (optional icon),
     * `color` (optional color)
     * @function
     */
    onMessageReceived(m: KeyObject): void;
    _editor?: KeyObject;
    /**
     * Load local code editor
     * @function
     */
    loadLocalEditor(): Promise<KeyObject>;
    /**
     * Load Simplicite standalone client lib
     * @param {function} cbk optional callback
     * @function
     */
    loadSimpliciteClient(cbk?: Callback): UIEngine;
    /**
     * Load metadata of font icons
     * @param {function} cbk optional callback(meta)
     * @function
     */
    loadFontsMeta(cbk?: (meta: IconsMetadata) => void): UIEngine;
    /**
     * Load the diagram engine
     * @function
     */
    loadDiagramEngine(): Promise<DiagramEngine>;
    private _speech?;
    /**
     * Load the speech engine
     * @function
     */
    loadSpeech(): Speech;
    private _ocr?;
    /**
     * Load the OCR tools
     * @function
     */
    loadOCR(cbk?: CallableFunction): void;
    /**
     * UI monitoring
     * @param {jQuery} ctn Container to monitor
     * @param {Object} params Parameters or action
     * @apram {string} params.action  Action name (get, meta, search, display...) if unset: save and stop monitoring in the container
     * @apram {string} params.service UI service name (displayForm...)
     * @apram {string} params.target  Target name (object, view, process...)
     * @param {boolean} params.ui     Front or Ajax call
     * @function
     */
    monitor(ctn: AnyContainer | null, params?: string | {
        action: string;
        service?: string;
        target?: string;
        ui?: boolean;
    }): UIEngine | undefined;
    /**
     * Loading page with status
     * @function
     */
    splash(status: boolean | string): void;
    /**
     * Top Simplicite window
     * @function
     */
    getTop(): Window & typeof globalThis;
}

type AlertType = "error" | "danger" | "warning" | "info" | "secondary" | "success";
type Position = "top" | "bottom" | "left" | "right";
type AlertCallback = (prompt?: string) => void;
type AlertParam = {
    level?: string;
    modal?: boolean;
    type?: AlertType;
    name?: string;
    title?: AnyContent;
    icon?: string;
    content?: AnyContent;
    okLabel?: string;
    cancelLabel?: string;
    help?: AnyContent;
    onOk?: AlertCallback;
    onCancel?: Callback;
    dontAskAgain?: string;
    moveable?: boolean;
    toast?: boolean;
    pinable?: boolean;
    buttons?: {
        name: string;
        style: string;
        callback?: Callback;
    }[];
    fade?: boolean;
    onload?: JQueryHandler;
    beforeunload?: JQueryHandler;
    unload?: JQueryHandler;
};
type IndexParam = NavParam & {
    /** Optional title */
    title?: string;
    /** Optional object name */
    object?: string;
    /** Optional domain */
    domain?: string;
};
type MapParam = NavParam & {
    /** Optional display mode */
    mode?: string;
    /** Optional object name */
    obj?: string;
    /** Optional instance name */
    inst?: string;
    /** Optional placemap */
    placemap?: string;
    /** Optional coordinates */
    coords?: string;
    /** Optional move handler */
    onMove?: (lat: string, lng: string) => void;
};
type TempPillbox = {
    object: BusinessObject;
    id: string;
    label: string;
    parent: ParentObject;
    childfk: string;
    create: (o: BusinessObject, field: string, pid: string, child: string, id: string) => Promise<KeyObject>;
};
type TempPillboxes = KeyHash<TempPillbox[]>;
type TemplateEntity = "ObjectInternal" | "View";
type TemplateTarget = TemplateEntity | "ObjectInternalRow" | "ObjectInternalSearch";
/**
 * UI Rendering tool
 * @class
 */
declare class UIRender extends UILoader {
    /**
     * Minimal input size to trigger the field completion
     * @ignore
     */
    completionMinSize: number;
    /**
     * Home page
     * @param {(string|jQuery)} ctn Container
     * @param {Object} options Options <code>\{ nav, showNav \}</code>
     * @param {function} cbk Optional callback
     * @function
     */
    displayHome(ctn?: AnyContainer, options?: NavParam | null, cbk?: Callback): void;
    /**
     * Display a view
     * @param {(string|jQuery)} ctn Container
     * @param {(string|Object)} view View definition or name
     * @param {ViewParam} options View options
     * @param {function} cbk Optional callback
     * @function
     */
    displayView(ctn: AnyContainer, view: View | string, options?: ViewParam, cbk?: (ctn?: Container, view?: View) => void): void;
    /**
     * Display the user dashboard
     * @param {(string|jQuery)} ctn Container
     * @param {string} view Optional dashboard name / null = overview
     * @param {Object} options View options
     * @param {function} options.beforeload Optional before load callback
     * @param {function} options.onload Optional onload callback
     * @param {function} options.onunload Optional unload callback
     * @param {function} cbk Optional callback
     * @function
     */
    displayDashboard(ctn: AnyContainer, view?: string | null, options?: {
        beforeload?: Callback;
        onload?: (ctn: Container, view?: View) => void;
        onunload?: (ctn: Container, view?: View) => void;
    }, cbk?: (ctn?: Container, view?: View) => void): void;
    /**
     * Alert dialog box
     * @param {(string|Object)} params Message or object with:
     * @param {string} params.name Optional name
     * @param {string} params.title Optional title, default "ALERT"
     * @param {string} params.type Optional 'error|danger|warning|info'
     * @param {(string|jQuery)} params.content Optional alert body
     * @param {string} params.okLabel Optional "OK" button label, default: <code>'OK'</code>
     * @param {(string|jQuery)} params.help Optional help
     * @param {function} params.onOk Optional callback on "OK" button
     * @param {string} params.dontAskAgain Use the 'dont't ask again' local storage (true=keep user's action or string=forced response), needs a name
     * @param {boolean} params.toast True to display a toast instead a dialog
     * @param {boolean} params.modal True to display a modal dialog
     * @param {boolean} params.moveable True to allow drag&drop
     * @param {Array} params.buttons Optional buttons to replace default OK
     * @function
     */
    alert(params: string | AlertParam): void;
    /**
     * Toast dialog box
     * @param {(string|Object)} params Message or object with:
     * @param {string} params.type Optional <code>error|danger|warning|info</code>
     * @param {(string|jQuery)} params.content Toast body
     * @param {string} params.position Position <code>top|bottom</code>
     * @param {string} params.align Align <code>left|right|center</code>
     * @param {boolean} params.undo Add an undo button?
     * @param {boolean} params.moveable True to allow drag&drop
     * @function
     */
    toast(params: string | {
        type?: AlertType;
        title?: string;
        content?: AnyContent;
        position?: string;
        align?: string;
        duration?: number;
        undo?: boolean;
        moveable?: boolean;
        pinable?: boolean;
        toast?: boolean;
    }): void;
    /**
     * Confirm dialog box
     * @param {(string|Object)} params Message or object with:
     * @param {string} params.name Optional name
     * @param {string} params.title Optional title, default: <code>'CONFIRM'</code>
     * @param {(string|jQuery)} params.content Optional alert body
     * @param {string} params.okLabel Optional "OK" button label, default: <code>'OK'</code>
     * @param {string} params.cancelLabel Optional "CANCEL" button label, default: <code>'CANCEL'</code>
     * @param {(string|jQuery)} params.help Optional help
     * @param {function} params.onOk Optional callback on "OK" button
     * @param {function} params.onCancel Optional callback on "CANCEL" button
     * @param {string} params.dontAskAgain Use the 'dont't ask again' local storage (true=keep user's action or string=forced response), needs a name
     * @param {boolean} params.moveable True to allow drag&drop
     * @function
     */
    confirm(params: string | AlertParam): void;
    /**
     * Prompt dialog box
     * @param {Object} params Message or object with:
     * @param {string} params.name Optional name
     * @param {string} params.title Dialog title
     * @param {(string|jQuery)} params.content Optional alert body
     * @param {string} params.okLabel Optional "OK" button label, default: <code>'OK'</code>
     * @param {string} params.cancelLabel Optional "CANCEL" button label, default: <code>'CANCEL'</code>
     * @param {(string|jQuery)} params.help Optional help
     * @param {function} params.onOk Optional callback(value) on OK button
     * @param {function} params.onCancel Optional callback on Cancel button
     * @param {boolean} params.moveable True to allow drag&drop
     * @param {boolean} params.required Required value
     * @param {string} params.value Input initial value
     * @function
     */
    prompt(params: AlertParam & {
        required?: boolean;
        value?: string;
    }): void;
    /**
     * Yes/No dialog box
     * @param {(string|Object)} params Message or object with:
     * @param {string} params.name Optional name
     * @param {string} params.title Optional title, default "CONFIRM"
     * @param {(string|jQuery)} params.content Optional alert body
     * @param {string} params.yesLabel Optional "YES" button label, default: <code>'YES'</code>
     * @param {string} params.noLabel Optional "NO" button label, default: <code>'NO'</code>
     * @param {(string|jQuery)} params.help Optional help
     * @param {function} params.onYes Optional callback on "YES" button
     * @param {function} params.onNo  Optional callback on "NO" button
     * @param {string} params.dontAskAgain Use the 'dont't ask again' local storage (true=keep user's action or string=forced response), needs a name
     * @param {boolean} params.moveable True to allow drag&drop
     * @function
     */
    yesNo(params: AlertParam & {
        onYes?: Callback;
        onNo?: Callback;
        yesLabel?: string;
        noLabel?: string;
    }): void;
    /**
     * Yes/No/Cancel dialog box
     * @param {(string|Object)} params Message or object with:
     * @param {string} params.name Optional name
     * @param {string} params.title Optional title, default "CONFIRM"
     * @param {(string|jQuery)} params.content Optional alert body
     * @param {string} params.yesLabel Optional "YES" button label, default: <code>'YES'</code>
     * @param {string} params.noLabel Optional "NO" button label, default: <code>'NO'</code>
     * @param {string} params.cancelLabel Optional "CANCEL" button label, default: <code>'CANCEL'</code>
     * @param {(string|jQuery)} params.help Optional help
     * @param {function} params.onYes Optional callback on "YES" button
     * @param {function} params.onNo Optional callback on "NO" button
     * @param {function} params.onCancel Optional callback on "CANCEL" button
     * @param {string} params.dontAskAgain Use the 'dont't ask again' local storage (true=keep user's action or string=forced response), needs a name
     * @param {boolean} params.moveable True to allow drag&drop
     * @function
     */
    yesNoCancel(params: AlertParam & {
        onYes?: Callback;
        onNo?: Callback;
        yesLabel?: string;
        noLabel?: string;
    }): void;
    /**
     * Information dialog box
     * @param {string|jQuery} msg Content
     * @function
     */
    info(msg: AnyContent): void;
    /**
     * Error dialog box
     * @param {string|jQuery} msg Content
     * @function
     */
    error(msg: AnyContent): void;
    /**
     * Warning dialog box
     * @param {string|jQuery} msg Content
     * @function
     */
    warning(msg: AnyContent): void;
    /**
     * Back-end messages in a single dialog
     * @param {Object} msg Array of backend messages per rowId
     * @function
     */
    backendMessages(msg?: MessagesPerRow | MessageAny[] | null): void;
    /**
     * Back-end message(s)
     * @param {(string|Object|Array)} msg Plain text / encoded message <code>(code:text#level)</code> / object <code>\{ code, level, text, label \}</code> / or array of messages
     * @param {boolean} toast True to display a toast instead a dialog box
     * @param {string} title Optional title
     * @function
     */
    backendMessage(msg: MessageAny[] | MessageAny | MessageFromBack | null, toast?: boolean, title?: string): void;
    /**
     * Back-end exception
     * @param {(string|Object|Array)} msg Simple text or <code>\{ level, message or messages \}</code>, or first item of array
     * @function
     */
    backendException(msg: string | string[] | MessageJSON[] | MessageFromBack): void;
    /**
     * Extract errors from messages
     * @param msg list of backend messages
     * @function
     */
    getErrors(msg?: MessageJSON[]): MessageJSON[];
    /**
     * Object title to display.
     * @param {BusinessObject} obj Object with metadata (label, plurallabel, userkey)
     * @param {boolean} userKey True to add the valued user-key
     * @param {boolean} plural True to use the plural label if exists
     * @function
     */
    title(obj: BusinessObject, userKey?: boolean | null, plural?: boolean): string;
    /**
     * Object summary
     * @param {(string|jQuery)} ctn Container
     * @param {(string|BusinessObject)} object Object
     * @param {string} rowId Object row ID
     * @param {Object} options Optional parameters
     * @param {string} options.inst Optional instance name
     * @param {Object} options.parent Optional parent context
     * @param {boolean} options.icon Display the object icon or image thumbnail, default true
     * @param {boolean} options.image Display the object image if any, default true
     * @param {string}  options.label Optional label, default: object label
     * @param {string}  options.userKey Optional user key, default: object user key
     * @param {ObjectField[]} options.fields Optional array of fields to display
     * @param {function} options.onopen Optional handler on open, default: engine.openObject
     * @param {Object[]} options.actions Optional array of row/rowPlus actions, default row actions
     * @param {Object}   options.item Optional object values
     * @param {number}   options.maxFields Optional max fields to display
     * @function
     */
    displaySummary(ctn: AnyContainer, object: string | UIBusinessObject, rowId: string, options?: SummaryParam): Promise<void>;
    /**
     * Search form
     * @param {(string|jQuery)} ctn Parent container
     * @param {(string|BusinessObject)} object Name or Business Object
     * @param {UI.Globals.search} options Options to override Globals
     * @param {function} cbk Optional callback
     * @function
     */
    displaySearch(ctn: AnyContainer, object: string | BusinessObject, options?: SearchParam, cbk?: (obj: UIBusinessObject, p: SearchParam) => void): Promise<void>;
    private copyMsg;
    /**
     * Display a field in the container
     * @param {(string|jQuery)} ctn Target container
     * @param {BusinessObject} obj Business Object
     * @param {(Object|UI.Field)} field Field definition
     * @param {string} index Optional index for edit list
     * @param {string} disp optional display 'full' (default = label+input+help) | 'label' | 'input' | 'preview' | 'value' | 'help'
     * @param {Object} p context parameters (form, formTab to focus, inline field of link, parent object, isExtended, hasMore, refb buttons, promises...)
     * @returns Field with 'ui' initialized
     * @function
     */
    displayField(ctn: AnyContainer, obj: BusinessObject, field: KeyObject | ObjectField, index?: string, disp?: FieldDisplay | null, p?: KeyObject): ObjectField;
    /**
     * Build a list with the object search
     * @param {(string|jQuery)} ctn Target container
     * @param {(string|BusinessObject)} object Name or Business Object
     * @param {UI.Globals.list} options Options to override Globals
     * @param {function} cbk Optional callback
     * @function
     */
    displayList(ctn: AnyContainer, object: string | BusinessObject, options?: ListParam | null, cbk?: (obj?: UIBusinessObject, p?: ListParam) => void): void;
    /**
     * Build a record of list
     * @param {jQuery} ctn Nav container
     * @param {(string|jQuery)} elt row container (tr or div)
     * @param {BusinessObject} object Object
     * @param {string} rowId Object row Id
     * @param {UI.Globals.list} options List options to override global row options
     * @function
     */
    displayRow(ctn: Container, elt: AnyContent, object: BusinessObject, rowId: string, options: ListParam): Promise<void>;
    mergeRowMeta(obj: BusinessObject, p: KeyObject): void;
    /**
     * Crosstab
     * @param {(string|jQuery)} ctn Container
     * @param {(string|BusinessObject)} object Name or Object
     * @param {string} name Crosstab name
     * @param {CrosstabNavParam} options Options <code>\{ inst, filters, options, nav, showNav \}</code>
     * @param {function} cbk Optional callback
     * @function
     */
    displayCrosstab(ctn: AnyContainer, object: string | BusinessObject, name: string, options?: CrosstabNavParam, cbk?: Callback): void;
    /**
     * Index search form
     * @param {(string|jQuery)} ctn Container
     * @param {IndexParam} options Options
     * @param {function} cbk Optional callback
     * @function
     */
    displayIndex(ctn?: AnyContainer, options?: IndexParam | null, cbk?: Callback): void;
    /**
     * Session index
     * @param {(string|jQuery)} ctn Container for result
     * @function
     */
    displayIndexSearchSession(ctn: AnyContainer): void;
    /**
     * Index search in domain
     * @param {jQuery} ctn Container for result
     * @param {string} domain Domain name
     * @param {string} filter Optional filter
     * @param {boolean} all False to limit search to objects updated by the user
     * @param {Object} options Options <code>\{ object, nav, showNav \}</code>
     * @function
     */
    displayIndexSearchDomain(ctn: Container, domain: string, filter?: string, all?: boolean, options?: IndexParam): void;
    /**
     * Index search in documents
     * @param {jQuery} ctn Container for result
     * @param {string} req User request
     * @param {string[]} list Array of objects with documents
     * @param {Object} options Options <code>\{ object, nav, showNav \}</code>
     * @function
     */
    displayIndexSearchDocs(ctn: Container, req: string, list: string[], options?: IndexParam): void;
    /**
     * Index search result
     * @param {(string|jQuery)} ctn Container
     * @param {string} req User request (see Simplicite.Ajax.indexsearch service)
     * @param {Object} options Options <code>\{ object, nav, showNav \}</code>
     * @param {function} cbk Optional callback
     * @function
     */
    displayIndexSearch(ctn: AnyContainer, req: string, options?: IndexParam, cbk?: Callback): void;
    /**
     * Display the user filters: date range and fields
     * @param {(string|jQuery)} ctn Optional container (dialog if null)
     * @param {Object} options Options <code>\{ bar \}</code>
     * @function
     */
    displayUserFilters(ctn: AnyContainer | null, options?: UserFilterParam): Promise<void>;
    /**
     * Display a mentions resource
     * @param {(string|jQuery)} ctn Optional container (dialog if unset)
     * @param {Object} options Options
     * @param {string} options.name HTML content name (default 'MENTIONS')
     * @param {string} options.title Optional dialog title (default name translation)
     * @param {string} options.width Optional dialog width (default 70%)
     * @function
     */
    displayMentions(ctn?: AnyContainer, options?: {
        name?: string;
        title?: string;
        width?: string;
    }): Promise<void>;
    /**
     * Display the bookmarks
     * @param {(string|jQuery)} ctn Optional container
     * @param {Object} options <code>\{show:top|bottom|true|false\}</code> or <code>\{action,object,rowId,element\}</code> to delete/toggle the object bookmark
     * @function
     */
    displayBookmarks(ctn?: AnyContainer, options?: {
        show?: boolean | string;
        action?: string;
        object?: BusinessObject;
        rowId?: string;
        element?: JQuery;
    }): void;
    /**
     * Display a print/publication
     * @param {(string|jQuery)} ctn Optional container (_blank if null)
     * @param {string} name Print name
     * @param {BusinessObject} obj Object
     * @param {string} rowId Optional row ID
     * @param {function} cbk Optional callback
     * @function
     */
    displayPrint(ctn: AnyContainer, name: string, obj: string | BusinessObject, rowId?: string | null, cbk?: Callback): Promise<void>;
    /**
     * Display the export dialog and get exported data
     * @param {jQuery} ctn Container
     * @param {BusinessObject} object Object or name
     * @param {string} rowId Optional row ID to export only one record
     * @function
     */
    displayExport(ctn: AnyContainer, object: BusinessObject, rowId?: string | null): Promise<void>;
    /**
     * Manage import XML thru UI
     * @param {(string|jQuery)} ctn Optional container
     * @param {string} adapter Optional adapter to use
     * @function
     */
    displayImportXML(ctn: AnyContainer, adapter?: string): void;
    /**
     * Manage import CSV thru UI
     * @param {(string|jQuery)} ctn Optional container
     * @function
     */
    displayImportCSV(ctn: AnyContainer): void;
    /**
     * Display a tree view
     * @param {(string|jQuery)} ctn Optional container
     * @param {string|BusinessObject} object Root object
     * @param {string} rowId Row ID of the record
     * @param {string} name Treeview name
     * @param {Object} options Optional parameters <code>\{ inst, depth, display, menu, docked, onOpen, addMenu, delMenu, onPage \}</code>
     * @param {string} options.inst optional instance name (default <code>tree_ajax_[tvname]_[object]</code>)
     * @param {number} options.depth Max deep search (default <code>2</code>)
     * @param {boolean} options.menu Add the tree in main menu (default open in container)
     * @param {boolean} options.docked Open tree in left dock (default open in container)
     * @param {function} options.display Optional to override default menu.treeview renderer
     * @param {function} options.onOpen Optional open node handler <code>function(n,cbk)</code>
     * @param {function} options.addMenu Optional add to menu handler
     * @param {function} options.delMenu Optional remove from menu handler
     * @param {function} options.onPage Optional add page handler
     * @param {function} cbk Optional callback
     * @function
     */
    displayTreeView(ctn: AnyContainer, object: string | BusinessObject, rowId: string, name: string, options?: TreeParam, cbk?: Callback): void;
    /**
     * Object picker: default open a popup to select object(s) (used by pillbox, modeler, associate and merge)
     * @param {(string|jQuery)} ctn Parent container
     * @param {(string|BusinessObject)} object Object name or business object
     * @param {Object} options List additive options <code>\{ context, filters, parent, minified, layout... \}</code>, with optional keys:
     * `selectRows` (true to allow multiple selections),
     * `selectedIds` (optional row Ids to pre-select),
     * `highlightIds` (optional row Ids to highlight, no pre-select, or function)
     * @param {function} cbk Callback(obj, id or array of ids) called on selection
     * @function
     */
    selectObject(ctn: AnyContainer, object: string | BusinessObject, options: KeyObject, cbk: (obj: BusinessObject, id?: string | string[]) => void): Promise<void>;
    /**
     * Display form of inlined link (cardinality 0,1 or 1,1 with inline rendering)
     * @param {(string|jQuery)} ctn Container
     * @param {BusinessObject} o object
     * @param {UI.Globals.list} params Reference data, with optional keys:
     * `inline` (true), `parent` (parent object `{ name, inst, field, rowId, object }`),
     * `link` (link metadata), `title` (optional link title, empty = no title)
     * @function
     */
    displayInlinedForm(ctn: AnyContainer, o: BusinessObject, params: ListParam, cbk?: Callback): void;
    /**
     * Display references in a pillbox control
     * @param {(string|jQuery)} ctn Container
     * @param {BusinessObject} o N,N object
     * @param {Object} params Reference data, with optional keys:
     * `parent` (parent object `{ name, inst, field, rowId, object }`),
     * `link` (link metadata with child name and child foreign-key),
     * `read` (read only?), `title` (optional link title, empty = no title)
     * @function
     */
    displayReferencePillbox(ctn: AnyContainer, o: BusinessObject, params?: ListParam, cbk?: (obj?: UIBusinessObject) => void): Promise<void>;
    /**
     * Display referenced object as panel list, inlined form or pillbox
     * @param {jQuery} ctn Container
     * @param {(string|BusinessObject)} object Referenced object or name
     * @param {UI.Globals.list} p List options + parent object + link metadata, with optional keys:
     * `parent` (parent object `{ name, inst, field, rowId, object }`),
     * `link` (optional link metadata with `{ child, childfk, rendering }`),
     * `embedded` (unset or true to apply rendering of link, false to ignore the rendering and display a list)
     * @function
     */
    displayReferenceList(ctn: Container, object: string | BusinessObject, p: ListParam, cbk?: (obj?: UIBusinessObject) => void): Promise<void>;
    private linkMapFilters;
    /**
     * Object reference picker: default open a popup to select a reference
     * @param {jQuery} ctn Parent container of referenced fields to set
     * @param {BusinessObject} obj Object
     * @param {(string|BusinessObject)} refObject Referenced object name or business object (list popup)
     * @param {(string|ObjectField)} refField Foreign key (or meta object) field to select (name or field)
     * @param {string} index Optional row index (edit list)
     * @param {function} cbk Optional callback (will replace all change events on each field)
     * @param {boolean} userKey Optional to get foreign user-key
     * @function
     */
    selectReference(ctn: Container, obj: UIBusinessObject, refObject: string | BusinessObject, refField: string | ObjectField, index?: string | null, cbk?: Callback, userKey?: boolean): void;
    /**
     * Multiple object references picker : used to search multiple references in a single field
     * @param {jQuery} ctn Parent container of referenced fields to set
     * @param {BusinessObject} obj Object
     * @param {(string|BusinessObject)} refObject Referenced object name or business object (list popup)
     * @param {(string|ObjectField)} refField Foreign key field to select (name or field)
     * @param {function} cbk Optional callback
     * @function
     */
    selectReferences(ctn: Container, obj: BusinessObject, refObject: string | BusinessObject, refField: string | ObjectField, cbk?: Callback): void;
    /**
     * Create an object in a dialog
     * @param {(string|jQuery)} ctn Parent container
     * @param {(string|BusinessObject)} object Object
     * @param {function} cbk Callback with the created object
     * @function
     */
    createObjectDialog(ctn: AnyContainer, object: string | BusinessObject, cbk?: (o: BusinessObject) => void): Promise<void>;
    /**
     * Create an object in a dialog to populate a reference
     * @param {(string|jQuery)} ctn Parent container to populate
     * @param {BusinessObject} obj Object
     * @param {(string|ObjectField)} refField Referenced field or FK itself
     * @param {string} index Optional row index (edit list)
     * @function
     */
    createReference(ctn: AnyContainer, obj: BusinessObject, refField: string | ObjectField, index?: string): void;
    /**
     * Meta-object picker: default open a popup to select a reference
     * @param {(string|jQuery)} ctn Parent container of referenced fields to set
     * @param {BusinessObject} obj Object
     * @param {(string|ObjectField)} field Field of meta-object to select
     * @param {string} index Optional row index (edit list)
     * @function
     */
    selectMetaObject(ctn: AnyContainer, obj: UIBusinessObject, field: string | ObjectField, index?: string): void;
    /**
     * Object datamap picker: default open a popup to select data
     * @param {(string|jQuery)} ctn Parent container of referenced fields to set
     * @param {BusinessObject} obj Object
     * @param {ObjectField} field Mapped field
     * @param {string} index Optional row index (edit list)
     * @param {function} cbk Optional callback to override fields change
     * @param {boolean} reset True to only reset all datamap fields
     * @function
     */
    selectDatamap(ctn: AnyContainer, obj: UIBusinessObject, field: ObjectField, index?: string | null, cbk?: Callback, reset?: boolean): void;
    /**
     * Reset datamap fields
     * @param {(string|jQuery)} ctn Parent container of referenced fields to set
     * @param {BusinessObject} obj Object
     * @param {ObjectField} field Mapped field
     * @param {string} index Optional row index (edit list)
     * @param {function} cbk Optional callback to override fields change
     * @function
     */
    resetDatamap(ctn: AnyContainer, obj: UIBusinessObject, field: ObjectField, index?: string | null, cbk?: Callback): void;
    /**
     * Bulk association between objects
     * @param {(string|jQuery)} ctn Parent container
     * @param {BusinessObject} obj Object from panel instance
     * @param {Object} def Associate definition
     * @param {string} def.parent Parent object name
     * @param {string} def.parentRefField Foreign key field to parent
     * @param {string} def.child Optional child object name (when obj is a N,N relationship)
     * @param {string} def.childRefField Foreign key field to child
     * @function
     */
    displayAssociate(ctn: AnyContainer, obj: BusinessObject, def: Associate): void;
    /**
     * Merge object records into the master one (at least 2 records, and limited to max 5 records)
     * @param {(string|jQuery)} ctn Container
     * @param {BusinessObject} obj Object with merge access
     * @param {Object} options Options <code>\{ ids \}</code>
     * @param {Array} options.ids Optional list of ids to merge (use selected rows if unset)
     * @param {function} cbk Optional callback
     * @function
     */
    displayMerge(ctn: AnyContainer, obj: BusinessObject, options?: MergeParam, cbk?: Callback): void;
    /**
     * Timesheet of object
     * @param {(string|jQuery)} ctn Container
     * @param {string|BusinessObject} object Resource object 1 or 2, or panel instance of assign object
     * @param {String} rowId Optional resource row ID
     * @param {String} tsName Timesheet name
     * @param {Object} options Options
     * @param {function} cbk Optional callback
     * @function
     */
    displayTimesheet(ctn: AnyContainer, object: string | BusinessObject, rowId: string, tsName: string, options?: TimesheetOptions, cbk?: Callback): void;
    /**
     * Gantt diagram based on timesheet data
     * @param {(string|jQuery)} ctn Container
     * @param {string|BusinessObject} object Assignment object
     * @param {String} tsName Timesheet name
     * @param {Object} params Options
     * @param {function} cbk Optional callback
     * @function
     */
    displayGantt(ctn: AnyContainer, object: string | BusinessObject, tsName: string, params?: TimesheetGanttParam, cbk?: Callback): void;
    /**
     * Object help: call the help service and open a dialog
     * @param {BusinessObject} obj Object
     * @function
     */
    displayHelp(obj: BusinessObject): void;
    /**
     * Open object form: default displayForm with nav add
     * @param {(string|jQuery)} ctn Target container
     * @param {(string|BusinessObject)} obj Name or Business Object
     * @param {string} rowId Referenced row ID
     * @param {string} nav 'new' or 'add' (default)
     * @function
     */
    openForm(ctn: AnyContainer, obj: string | BusinessObject, rowId: string, nav?: NavAction): void;
    /**
     * Build a form with the object item
     * @param {(string|jQuery)} ctn Target container
     * @param {(string|BusinessObject)} object Object
     * @param {string} rowId Row ID to get
     * @param {UI.Globals.form} options Options to override globals
     * @param {function} cbk Optional callback(obj, params)
     * @function
     */
    displayForm(ctn: AnyContainer, object: string | BusinessObject, rowId: string, options?: FormParam | null, cbk?: (obj: UIBusinessObject, p: FormParam) => void): void;
    /**
     * Field completion on field
     * @param {(string|jQuery)} ctn Container
     * @param {(string|BusinessObject)} object Object or name
     * @param {(string|ObjectField)} field Field or name
     * @param {string} index Optional row index (edit list)
     * @param {string} req User request
     * @param {function} cbk Callback with search result
     * @param {number} ctx Optional context CONTEXT_SEARCH or UPDATE
     * @function
     */
    displayCompletion(ctn: AnyContainer, object: string | BusinessObject, field: string | ObjectField, index?: string | null, req?: string, cbk?: (p: KeyObject[]) => void, ctx?: number): Promise<void>;
    /**
     * Foreign-key completion
     * @param {jQuery} ctn Container
     * @param {BusinessObject} obj Object
     * @param {ObjectField} field Referenced field
     * @param {string} index Optional index (edit list rowId or action name)
     * @param {function} sel Optional select item callback(item)
     * @param {function} disp Optional display item callback(item, ref)
     * @function
     */
    fkCompletion(ctn: AnyContainer, obj: BusinessObject, field: ObjectField, index?: string, sel?: (item: KeyObject) => void, disp?: (item: KeyObject, ref: BusinessObject) => string | JQuery): Promise<void>;
    /**
     * Datamap completion
     * @param {jQuery} ctn Container
     * @param {BusinessObject} obj Object
     * @param {(string|ObjectField)} fld Referenced field
     * @param {string} index Optional row index (edit list)
     * @param {function} sel Optional select item callback(item)
     * @param {function} disp Optional display item callback(item, ref)
     * @function
     */
    datamapCompletion(ctn: Container, obj: BusinessObject, fld: string | ObjectField, index?: string, sel?: (item: KeyObject) => void, disp?: (item: KeyObject, ref: BusinessObject) => string | JQuery): Promise<void>;
    /**
     * Code editor
     * @param {jQuery} ctn Container
     * @param {Object} options Optional parameters <code>\{ showNav, nav \}</code>
     * @param {function} cbk Optional callback
     * @function
     */
    displayEditor(ctn: AnyContainer, options: NavParam, cbk?: Callback): void;
    /**
     * Displays social posts
     * @param {(string|jQuery)} ctn Container
     * @param {Object} options Social options
     * @param {string}   options.object   Optional object to limit search
     * @param {string}   options.rowId    Optional object ID to limit search
     * @param {boolean}  options.activity True to display object activities
     * @param {function} options.onpost   Social service(item) to upsert post
     * @param {function} options.ondel    Social service(id) to delete post
     * @param {function} options.onlist   Social service(page,act) to search posts
     * @param {function} options.onlike   Social service(id,like) to (un)like a post
     * @param {function} options.onfollow Follow service
     * @param {boolean}  options.follow   Follow?
     * @param {boolean}  options.embedded  Default false = modal dialog
     * @param {function} cbk Optional callback
     * @function
     */
    displaySocial(ctn: AnyContainer, options: {
        object?: string;
        rowId?: string;
        activity?: boolean;
        onpost?: Callback;
        ondel?: Callback;
        onlist?: Callback;
        onlike?: Callback;
        onfollow?: Callback;
        follow?: boolean;
        embedded?: boolean;
    }, cbk?: Callback): Promise<void>;
    displayAuditIssues(ctn: AnyContainer): void;
    /**
     * Display the web news (user needs read access to WebNews)
     * @param {(string|jQuery)} ctn Container (new area if undefined)
     * @param {Object} options Optional parameters
     * @param {Object}  options.filters  Optional filters on WebNews
     * @param {string}  options.template Optional template (default Simplicite.UI.Globals.news.template)
     * @param {boolean} options.popup    true to get only news to display (on logon) in a modal dialog
     * @param {boolean} options.ticker   true to get only news to display on a footer ticker
     * @function
     */
    displayWebNews(ctn: Container | null, options?: {
        filters?: KeyObject;
        template?: string;
        popup?: boolean;
        ticker?: boolean;
    }): void;
    /**
     * Display the application module screen
     * @param {string} action import or export
     * @param {Object} obj application (root module)
     * @function
     */
    displayModuleApp(action: string, obj: BusinessObject): void;
    /**
     * Display the delete module screen
     * @param {(string|jQuery)} ctn Container
     * @param {string} moduleId module row Id
     * @function
     */
    displayModuleDelete(ctn: AnyContainer, moduleId: string): void;
    /**
     * Show server logs thru web-socket. Useful when UI has no console
     * @param {(string|jQuery)} ctn Optional container to split (default is #work)
     * @param {string} action <code>start|stop</code>
     * @param {string} pos Optional position <code>dialog|left|right|top|bottom</code> (default bottom)
     * @function
     */
    displayLogs(ctn: AnyContainer, action: string, pos?: Position | "dialog"): void;
    /**
     * System informations
     * @param {(string|jQuery)} ctn Container
     * @param {Object} p Options <code>\{ action, objdt, cache \}</code>
     * @function
     */
    displaySysInfos(ctn: AnyContainer, p?: {
        action?: string;
        objdt?: string | null;
        cache?: boolean;
    }): void;
    /**
     * Object preferences
     * @param {(string|jQuery)} ctn Container
     * @param {(string|BusinessObject)} object Name or Business Object
     * @function
     */
    displayPreferences(ctn: AnyContainer, object: string | BusinessObject): Promise<void>;
    /**
     * Trays based on a state model
     * @param {(string|jQuery)} ctn Container
     * @param {(string|BusinessObject)} obj Name or Business object
     * @param {string} field Optional enum name (default is the status field)
     * @param {Object} options Optional parameters
     * @param {function} cbk Optional callback
     * @function
     */
    displayTray(ctn: AnyContainer, obj: string | BusinessObject, field?: string, options?: KeyObject, cbk?: Callback): void;
    /**
     * Calendar rendering
     * @param {(string|jQuery)} ctn Container
     * @param {(string|BusinessObject)} object Name or Business object
     * @param {string} agenda Agenda name
     * @param {Object} params Options
     * @param {function} cbk Optional callback
     * @function
     */
    displayCalendar(ctn: AnyContainer, object: string | BusinessObject, agenda: string, params?: KeyObject | null, cbk?: (obj: UIBusinessObject, agd: Agenda, p: KeyObject) => void): void;
    /**
     * Status metrics
     * @param {(string|jQuery)} ctn Container
     * @param {(string|BusinessObject)} object Name or Business object
     * @param {Object} params Options, with optional keys:
     * `fromDate` (from date search YYYY-MM-DD, default 1 week ago or obj.locals.ui.metrics.fromDate),
     * `toDate` (to date search YYYY-MM-DD, default today or obj.locals.ui.metrics.toDate),
     * `period` (group by period: 1=hour, 2=day, 3=week, 4=month, 5=quarter, 6=semester, 7=year / default 2=day or obj.locals.ui.metrics.period),
     * `palette` (palette name, default sysparam CHART_PALETTE or obj.locals.ui.metrics.palette),
     * `show` (options to show/hide elements, all visible by default: `count`, `duration`, `history`, `terminal`, `palette`, `statusColors` as booleans, and `period`/`fromDate`/`toDate` as true|false or 'read')
     * @param {function} cbk Optional callback
     * @function
     */
    displayStatusMetrics(ctn: AnyContainer, object: string | BusinessObject, params?: KeyObject, cbk?: Callback): void;
    /**
     * UI Monitoring
     * @param {Object} p Options
     * @param {boolean} p.docked  Dock monitoring on bottom
     * @param {number}  p.tabIndex Tab to focus
     * @param {function} cbk Optional callback
     * @function
     */
    displayUIMonitoring(p?: {
        docked?: boolean;
        tabIndex?: number;
    }, cbk?: Callback): Promise<void>;
    /**
     * Server Monitoring
     * @param {Object} p Parameters
     * @function
     */
    displayServerMonitoring(p: KeyObject): Promise<void>;
    /**
     * ZIP editor
     * @param {jQuery} ctn Parent container
     * @param {Object} doc Document <code>\{ object, rowId, field, docId, name \}</code>
     * @param {Object} p Options <code>\{ readonly:true|false \}</code>
     * @param {function} cbk Optional callback to get the new ZIP as Base64
     * @function
     */
    zipEditor(ctn: Container, doc: DocumentDB, p?: {
        readonly?: boolean;
    }, cbk?: (zip: string) => void): void;
    /**
     * Workflow wrapper
     * @param {(string|jQuery)} ctn Container
     * @param {(string|Session.BusinessProcess)} wkf Business process or name
     * @param {string} action Action <code>start|abort|lock|unlock|validate|cancel|back|list</code>
     * @param {Object} options Optional activity <code>\{ step \}</code>
     * @param {function} cbk Optional callback
     * @function
     */
    displayWorkflow(ctn: AnyContainer, wkf: string | BusinessProcess | null, action?: ProcessActionType, options?: ProcessParam, cbk?: Callback): void;
    /**
     * Load and display the modeler
     * @param {(string|jQuery)} _ctn Container to append the map to
     * @param {string} modelId Model row ID
     * @param {Object} options Options <code>\{ docked, popup \}</code>
     * @function
     */
    displayModeler(_ctn: AnyContainer, modelId: string, options?: ModelParam): Promise<void>;
    /**
     * Map service.
     * Loads object data to pass to the map renderer.
     * Can be a single object or multi-object
     * @param {(string|jQuery)} ctn Container to append the map to
     * @param {MapParam} params Options
     * @function
     */
    displayMap(ctn: AnyContainer, params: MapParam): void;
    /**
     * User feedback
     * @function
     */
    displayFeedback(): void;
    /**
     * Template editor
     * @param {(string|jQuery)} ctn Container
     * @param {string} target ObjectInternal or View or ObjectInternalRow or ObjectInternalSearch
     * @param {string} rowId Object/view ID
     * @function
     */
    displayTemplate(ctn: AnyContainer, target: TemplateTarget, rowId: string): Promise<void>;
    /**
     * Theme editor
     * @param {String} rowId Theme row Id
     * @param {Object} options Options
     * @function
     */
    displayTheme(rowId: string, options?: KeyObject): Promise<void>;
    /**
     * Color picker
     * @param {(string|jQuery)} ctn Container
     * @param {(string|jQuery)} input Element to receive selected color as <code>#RRGGBB</code>
     * @param {boolean} dropdown Displays as dropdown or dialog box
     * @param {function} cbk Optional callback(color,valid)
     * @function
     */
    displayColorPicker(ctn: AnyContainer, input: AnyContent, dropdown: boolean, cbk?: ColorPickerHandler): void;
    /**
     * Build a form for bulk update
     * @param {(string|jQuery)} ctn Target container
     * @param {(string|BusinessObject)} object Name or BusinessObject
     * @param {Object} options See Globals.form
     * @param {function} cbk Optional callback
     * @function
     */
    displayUpdateForm(ctn: AnyContainer, object: string | BusinessObject, options?: UpdateFormParam, cbk?: (obj: UIBusinessObject, p: UpdateFormParam) => void): void;
    /**
     * User guide/onboarding rendering
     * @param {jQuery} ctn object container
     * @param options Options
     * @param {Array} options.play list of guides to play
     * @param {Object} options.view optional view instance of guide
     * @param {Object} options.object optional business object of guide
     * @param {string} options.context optional context (create or update...)
     * @param {boolean} options.recorder true to display the recorder
     * @function
     */
    displayGuide(ctn: Container, options?: {
        play?: GuideMetadata[];
        view?: View;
        object?: BusinessObject;
        external?: ExternalMetadata;
        context?: string;
        recorder?: boolean;
    }): void;
    /**
     * Play a guide by name, meant to be called from shortcuts as "$ui.playGuide('myguide')"
     * @param {string} name the guide to be played
     */
    playGuide(name: string): Promise<void>;
    /**
     * Display the site map (plan du site) in the work area.
     * @function
     */
    displaySitemap(ctn?: AnyContainer): UIEngine;
}

/**
 * Workflow and activities rendering
 * @class
 */
declare class UIWorkflow {
    /**
     * Build the process road in the container
     * @param {Simplicite.Ajax.BusinessProcess} w workflow instance
     * @function
     */
    road(ctn: Container, w: BusinessProcess, render: RoadRender, isStatic: boolean): JQuery<HTMLElement>;
    /**
     * Build the activity form in the container
     * @param {jQuery} ctn container
     * @param {Simplicite.Ajax.BusinessProcess} w workflow instance
     * @param {Object} af activity file
     * @param {Object} p optional parameters
     * @param {function} cbk optional callback
     * @function
     */
    activity(ctn: Container, w: BusinessProcess, af: ActivityFile, p: ProcessParam, cbk?: Callback): void;
}

/**
 * Accessibility (a11y) mode: disables/adapts the UI (splitter, compact mode,
 * menu trays/metrics...) for a11y compliance. Preference is preserved in
 * localStorage and applied on a full page reload.
 * @class
 */
declare class A11y {
    private static readonly KEY;
    /**
     * Restore a11y mode from local preference into $ui.options.a11y.enabled.
     * Must run before UISplitter.init() and Menu.init(), since both consult
     * A11y.enabled() while building the UI. Called from UIViewer.initMain().
     * @function
     */
    init(): void;
    /**
     * Is a11y mode currently enabled?
     * @function
     */
    isEnabled(): boolean;
    /**
     * Get or set a11y mode. Setting it persists to localStorage.
     * @param enable optional to enable/disable
     * @returns true if a11y mode is enabled
     * @function
     */
    static enabled(enable?: boolean): boolean;
    /**
     * Allows user to toggle a11y mode (config-level switch, distinct from
     * whether it's currently on)
     * @param toggleable optional to enable/disable
     * @returns true if the toggle is available to the user
     * @function
     */
    static toggleable(toggleable?: boolean): boolean;
    /**
     * a11y preference in localStorage. Not scoped: unlike the splitter,
     * a11y is a personal need rather than a device/scope-specific setting.
     * @param enabled true to enable, false to disable or undefined to get the current preference
     * @returns the current preference or null
     * @function
     */
    static localPreference(enabled?: boolean): string | null;
    /**
     * Toggle button for accessibility mode. Toggling forces a full reload,
     * since menu structure and splitter mode are both decided at boot time.
     * @function
     */
    a11yToggle(): JQuery;
}

type NotifyObjectType = "create" | "update" | "delete";
type NotifyObject = {
    type: NotifyObjectType;
    sender: JQuery;
    object: string | BusinessObject;
    rowId: string;
    item?: KeyObject;
};
type Shortcut = {
    name: string;
    url: string;
    label: string;
    tooltip?: string;
    target?: LoadTarget;
    width?: string;
    height?: string;
    keys?: string;
    icon?: string;
    plus?: boolean;
    header?: boolean;
    home?: boolean;
    homeStyle?: "CM" | "CL" | "AB" | "SB";
    sitemap?: boolean | "true" | "false";
};
type ShortcutKeys = {
    [keys: string]: Shortcut | Callback;
};
type ShortcutKey = {
    ctrl: boolean;
    alt: boolean;
    shift: boolean;
    key: string;
    shortcut?: Shortcut;
    cbk?: (shortcut?: Shortcut) => void;
};
/**
 * Main view renderer
 * @class
 */
declare class UIViewer {
    constructor(tools: Bootstrap5);
    tools: Bootstrap5;
    splitter: UISplitter;
    a11y: A11y;
    zip?: ZIP;
    /**
     * Selected tab per view
     * @field
     */
    _viewTab: KeyObject;
    /**
     * Menu renderer
     * @member
     */
    readonly menu: Menu;
    /**
     * Widget renderer
     * @member
     */
    readonly widget: Widget;
    /**
     * Board renderer
     * @member
     */
    readonly board: Board;
    /**
     * List renderer
     * @member
     */
    readonly list: List;
    /**
     * Form renderer
     * @member
     */
    readonly form: Form;
    /**
     * Search renderer
     * @member
     */
    readonly search: Search;
    /**
     * Update renderer
     * @member
     */
    readonly update: Update;
    /**
     * Preferences renderer
     * @member
     */
    readonly prefs: Prefs;
    /**
     * Index search renderer
     * @member
     */
    readonly index: IndexSearch;
    /**
     * Trays renderer
     * @member
     */
    readonly tray: UITray;
    /**
     * Tree renderer
     * @member
     */
    readonly tree: Tree;
    /**
     * Import tool renderer
     * @member
     */
    readonly importXML: Import;
    /**
     * Workflow renderer
     * @member
     */
    readonly wkf: UIWorkflow;
    /**
     * Social renderer
     * @member
     */
    readonly social: Social;
    /**
     * Crosstab renderer
     * @member
     */
    readonly crosstab: Crosstab;
    /**
     * External object renderer
     * @member
     */
    readonly external: External;
    /**
     * Merge object renderer
     * @member
     */
    readonly merge: Merge;
    /**
     * Timesheet object renderer
     * @member
     */
    readonly timesheet: Timesheet;
    /**
     * Color helpers
     * @member
     */
    readonly color: UIColor;
    /**
     * Get a static image (located in root/images/image)
     * @param {string} name image name
     * @function
     */
    image(name: string): JQuery<HTMLElement>;
    /**
     * Set the window "title - page"
     * @param {string} page optional contextual page name
     * @param {string} title title (default $ui.options.title from WINDOW_TITLE)
     * @function
     */
    setWindowTitle(page?: string | null, title?: string | null): void;
    /**
     * Prepare the main page when loaded
     * @param {UI.Globals} p launch parameters merged with Globals
     * @function
     */
    initMain(p: KeyObject): void;
    /**
     * Reload UI data: refresh current page and treeviews
     * @function
     */
    reload(): void;
    /**
     * Focus elmeent
     * @param x 'l'ist, 'm'enu, 'n'ext area, 'f'inder  or element
     * @function
     */
    focus(x: string): void;
    /**
     * Change password
     * @function
     */
    changePassword(): void;
    /**
     * Turn the container to compact mode
     * @param {jQuery} ctn Container
     * @param {boolean} enable optional to enable or disable (default toggle the mode)
     * @return true if compacted
     * @function
     */
    compact(ctn: AnyContainer, enable?: boolean): boolean;
    /**
     * Zoom changes all relative styles based on font-size relative size (rem)
     * @param {number|string} p relative number or absolute string percentage value ('100%' = original size = 1rem = 16px)
     * @function
     */
    zoom(p: number | string): void;
    /**
     * Connect as other login
     * @function
     */
    connectAs(): void;
    /**
     * Init the multi-apps popup
     * @param {jQuery} b Scopes container with apps
     * @param {Object[]} apps Array of granted scope { icon|logo, label, url, home }
     * @function
     */
    setApps(b: JQuery, apps: Scope[]): void;
    /**
     * Displays the shortcuts
     * @param {Object[]} list Array of granted shortcut { name, icon, label, url, target, plus, header, home }
     * @param {jQuery} ctn UI container
     * @param {Object} opt option to display only 'plus', 'header' xor 'home' shortcuts
     * @param {boolean} opt.plus display only 'plus' shortcuts
     * @param {boolean} opt.header display only 'header' shortcuts
     * @param {boolean} opt.home display only 'home' shortcuts as big buttons
     * @param {boolean} opt.reset reset container first?
     * @function
     */
    shortcuts(list: Shortcut[], ctn: Container, opt?: {
        plus?: boolean;
        header?: boolean;
        home?: boolean;
        reset?: boolean;
    }): JQuery | undefined;
    /**
     * Toogle bookmark action (star icon)
     * @param {JQuery} ctn container of bookmark action
     * @param {Object} obj object
     * @param {string} rowid object row id
     * @param {function} cbk optional callback(checked) on ui.bookmark.toggle
     * @function
     */
    bookmarkToggle(ctn: Container, obj: BusinessObject, rowid: string, cbk?: (checked: boolean) => void): void;
    /**
     * Language selector
     * @param {string} dflt Default language if not defined
     * @function
     */
    langPicker(dflt?: string): Promise<string>;
    /**
     * Get simple icon
     * @param {string} icon prefixed icon name: from icon set 'name', from fontawesome solid 'fas/name' or regular 'far/name', bootstrap icon 'bi/name'
     * @param {Object|string|number} options { size, cls, title } | class name | size in px
     * @param {string} options.size  optional icon size (ex: "1rem")
     * @param {string} options.cls   optional icon class name (ex: "icon")
     * @param {string} options.title optional title (default aria-hidden=true)
     * @function
     */
    icon(icon: string, options?: string | number | {
        size?: string;
        cls?: string;
        title?: string;
    }): JQuery;
    /**
     * Markdown to HTML
     * @param {string} v Markdown text
     * @param {function} cbk text or HTML compiled with marked plugin
     * @function
     */
    markdownToHTML(v: string, h: number, cbk?: (html: JQuery) => void): Promise<void>;
    /**
     * Find the first .content element if exists in container (or #work)
     * @param {jQuery} ctn container, null = #work
     * @returns the first .content element in container, or the container itself if not exist
     * @function
     */
    getContent(ctn?: AnyContainer): JQuery;
    /**
     * Checks if element is visible = not empty (without any visible field, action, external object, text or view)
     * @param {jQuery} x Element to test
     * @param {boolean} slide Slide effect?
     * @param {boolean} apply true to show/hide empty element or false to only check the visibility
     * @returns true if visible = contains something to display
     * @function
     */
    isVisible(x: JQuery, slide?: boolean, apply?: boolean): boolean;
    /**
     * Ensure element to be visible in container
     * @param {JQuery} el the element to show (must have a CSS position fixed or absolute)
     * @param {JQuery} ctn optional container (or default #work zone)
     * @function
     */
    ensureVisible(el: JQuery, ctn?: AnyContainer): void;
    /**
     * Replace the content
     * @param {JQuery} ctn  Container
     * @param {string} html Optional HTML content (full page or embedded elements)
     * @param {string} url  Or optional URL to load in iframe .frame-wrapper
     * @param {function} cbk Optional callback
     * @function
     */
    setContent(ctn: Container, html?: string | null, url?: string, cbk?: Callback): void;
    /**
     * Create the dropup panel of FOOTER_ADDON
     * @param {string} html HTML content to display
     * @function
     */
    footerAddon(html: string): void;
    /**
     * Create a new navigation in a work area
     * @function
     */
    createNav(work: JQuery, content: Container): void;
    /**
     * Put a skeleton loader in the container
     * @param {jQuery} ctn container
     * @param {string} type optional type list|form
     * @function
     */
    skeleton(ctn?: Container, type?: string): void;
    /**
     * Split the container in 2 parts (any previous part is removed)
     * @function
     */
    split(ctn: AnyContainer, pos: Position, options: SplitPart): void;
    /**
     * Remove a splitted part
     * @function
     */
    unsplit(ctn: string | Container): void;
    /**
     * Resize event on .js-resizable with ui.resize handler
     * @param {jQuery} ctn optional container to resize (default all page)
     * @param {number} w New viewport width
     * @param {number} h New viewport height
     * @param {boolean} reload true to force a redraw of components
     * @function
     */
    resize(ctn: AnyContainer, w: number, h: number, reload?: boolean): void;
    /**
     * Notification handler
     * @param {Object} e Event { type:create|update|delete, object, rowId, item:when known } sent to '.js-notify' elements with 'ui.notify' handler
     * @function
     */
    notify(e: NotifyObject): void;
    /**
     * UI trigger handler
     * @param {string} target selector (ex js-notify)
     * @param {string} event event name (ex ui-notify)
     * @param {Array} data trigger data
     * @function
     */
    trigger(target: string | JQuery, event: string, data: any[]): void;
    /**
     * Get field definition with UI extension
     * @param {jQuery} ctn Parent container where the field is displayed
     * @param {BusinessObject} obj Business object
     * @param {string|ObjectField} field name or field
     * @param {string} index Optional list index
     * @param {boolean} silent true to ignore message 'unknown field'
     * @return The field with field.ui = component implementation of Simplicite.UI.View.UIField
     * @function
     */
    getField(ctn: AnyContainer, obj?: BusinessObject | null, field?: string | ObjectField, index?: string | null, silent?: boolean): ObjectField;
    /**
     * Get UI extended action
     * @param {jQuery} ctn Container
     * @param {BusinessObject} obj Business object
     * @param {string|Object} action Name or action metadata
     * @param {boolean} silent true to ignore message 'unknown action'
     * @return The action with action.ui = instance of Simplicite.UI.View.UIAction
     * @function
     */
    getAction(ctn: AnyContainer, obj: UIBusinessObject, action: string | Action, silent?: string): Action | undefined;
    /**
     * Get UI extended view
     * @param {jQuery} ctn Container
     * @param {BusinessObject} obj Business object
     * @param {string|Object} view Name or view metadata
     * @param {boolean} silent true to ignore message 'unknown view'
     * @return The view with view.ui = instance of Simplicite.UI.View.UIView
     * @function
     */
    getView(ctn: AnyContainer, obj: BusinessObject | null, view: string | View, silent?: boolean): View | undefined;
    /**
     * Get UI extended area
     * @param {jQuery} ctn Container
     * @param {BusinessObject} obj Business object
     * @param {string|number|Object} area Name or area metadata
     * @param {boolean} silent true to ignore message 'unknown area'
     * @return The area with area.ui = instance of Simplicite.UI.View.UIArea
     * @function
     */
    getArea(ctn: AnyContainer, obj: UIBusinessObject, area: string | number | Area, silent?: boolean): Area | undefined;
    /**
     * Show the loading spinner (widget waitdlg)
     * @param {jQuery} ctn optional container (full body if undefined or #work area if null)
     * <ul>
     * <li>explicit element in page</li>
     * <li>undefined: displayed on "body"</li>
     * <li>null: displayed on #work area</li>
     * </ul>
     * @function
     */
    showLoading(ctn?: AnyContainer): void;
    /**
     * Hide the loading spinner
     * @param {jQuery} ctn optional container
     * @function
     */
    hideLoading(ctn?: AnyContainer): void;
    /**
     * Show a job progression
     * @param {Object} ctn optional container (in a dialog if null)
     * @param {Object} params parameters
     * @param {string} params.name  optional job name (default 'progress')
     * @param {string} params.title optional label
     * @param {boolean} params.circular true for a circular bar
     * @param {function} params.service required service(fn) to get progression
     * @param {number} params.delay   delay of refresh in ms (default 1000)
     * @param {function} params.callback optional callback({percent,message}) during progression
     */
    showProgress(ctn: JQuery | null, params: {
        name?: string;
        title?: string;
        circular?: boolean;
        service: ((fn: (r: KeyObject) => void) => void);
        delay?: number;
        callback?: (p: {
            percent: number;
            message: string;
        }) => void;
    }): void;
    /**
     * ENTER KEY management = focus the next form-group, or call a function on the last input
     * @param {jQuery} ctn container
     * @param {jQuery} fg form-group with a field input
     * @param {function} fn optional function to call after the last input
     * @function
     */
    fieldEnter(ctn: Container, fg: JQuery, fn: Callback): void;
    /**
     * Init Undo/Redo controls
     * @param {jquery} ctn Container
     * @param {boolean|string} use true|false|'keys'
     * @function
     */
    undoredo(ctn: Container, use: boolean | string): void;
    /** Modules filtering for designers */
    moduleChooser(params: KeyObject): JQuery<HTMLElement>;
    private _lostDelay?;
    private _lostTimer?;
    private _lostDlg?;
    /**
     * Popup when service is lost (no internet or server down)
     * @function
     */
    serviceLost(): void;
    private readonly lostSVG;
    private readonly waveSVG;
}

/**
 * UI Component
 * @class
 */
declare class UIComponent {
    /** Component parent container */
    ctn: Container;
    /** Definition */
    def: KeyObject;
    /** Event handlers */
    handlers?: KeyHash<JQueryHandler[]>;
    /** Component element */
    element?: JQuery<HTMLElement>;
    ui: UIEngine;
    view: UIViewer;
    app: Session;
    grant: Grant;
    /**
     * Constructor
     * @param {jQuery} ctn Component container
     * @param {Object} def Component definition
     */
    constructor(ctn: Container, def: any);
    addHandler(event: string, handler: JQueryHandler): this;
    removeHandler(event: string, handler: JQueryHandler): this;
    rebind(target: HTMLElement | JQuery): this;
    /**
     * Bind UI event
     * @param {string} event event name (change, keydown...)
     * @param {function} handler related handler
     * @memberof Simplicite.UI.View.Component
     * @function
     */
    on(event: string, handler: JQueryHandler): this;
    /** compat alias */
    bind(event: string, handler: JQueryHandler): this;
    /**
     * Unbind UI event
     * @param {string} event event name (change, keydown...)
     * @param {function} handler related handler
     * @memberof Simplicite.UI.View.Component
     * @function
     */
    off(event: string, handler: JQueryHandler): this;
    /** compat alias */
    unbind(event: string, handler: JQueryHandler): this;
    /**
     * Bind 'change' event
     * @param {(function|string)} param change handler to set or change context to trigger (ex: from a 'populate')
     * @memberof Simplicite.UI.View.Component
     * @function
     */
    change(param?: string | JQueryHandler): this;
    /**
     * Bind 'keyup' event
     * @param {function} handler related handler
     * @memberof Simplicite.UI.View.Component
     * @function
     */
    keyup(handler?: JQueryHandler): this;
    /**
     * Bind 'focus' event
     * @param {function} handler related handler
     * @memberof Simplicite.UI.View.Component
     * @function
     */
    focus(handler?: JQueryHandler): this;
    /**
     * Bind 'blur' event
     * @param {function} handler related handler
     * @memberof Simplicite.UI.View.Component
     * @function
     */
    blur(handler?: JQueryHandler): this;
    /**
     * Init component when displayed on screen
     * @memberof Simplicite.UI.View.Component
     * @function
     */
    init(_options?: any): this;
    /**
     * Render the component
     * @returns element
     * @memberof Simplicite.UI.View.Component
     * @function
     */
    render(_options: any): JQuery;
    /**
     * Destroy component before closing
     * @memberof Simplicite.UI.View.Component
     * @function
     */
    destroy(_p?: any): this;
}

type FieldAddon = JQuery | Addon;
type FieldSearch = {
    prefix?: JQuery;
    input: JQuery;
    addons?: FieldAddon[] | null;
};
/**
 * UI Field: common behavior for simple textual field.
 * Other types are inherited from this class to specialize the rendering.
 * @class
 */
declare class UIField extends UIComponent {
    /** Optional business object */
    obj: UIBusinessObject | null;
    /** Field definition */
    field: ObjectField;
    def: ObjectField;
    /**
     * Input dom ID: incremental to be unique in page.
     * ZZZ no more used by UI except in related <label for="id">
     */
    id: string;
    /** Input name <field.name>[_id<index>], unique in container */
    name: string;
    /** Related edit-list rowId, action/extobj name... */
    index?: string;
    /** All controls (input/textarea/select) associated to the field rendering */
    input: JQuery<HTMLElement>;
    element: JQuery<HTMLElement>;
    form?: boolean;
    file?: HTMLInputElement;
    /**
     * UI Field: common behavior for textual types
     * @param {jQuery} ctn container
     * @param {Simplicite.UI.BusinessObject} obj Object
     * @param {Simplicite.Ajax.ObjectField} field Field
     * @param {string} index optional edit list index = rowId, or inlined field foreignkey, or confirm action name
     */
    constructor(ctn: Container, obj: UIBusinessObject | null, field: ObjectField, index?: string);
    /**
     * Set the UI field index
     * @param {string} index optional field index: edit list rowId, action name, foreignkey of inlined field, external object...
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    setIndex(index?: string): void;
    /**
     * Get all controls related to field (inputs, select, textarea)
     * - use the "name" because unique in the field container (form, list...)
     * - no more based on unique "id" in page / incremental / non determinist
     * @memberof Simplicite.UI.View.UIField
     * @return field UI elements
     * @function
     */
    find(_checked?: boolean): JQuery;
    /**
     * Get/Set a service value to UI
     * <ul>
     * <li>get: v undefined = return the UI value converted to service</li>
     * <li>set: v is a server value = to be set on UI and field.v</li>
     * </ul>
     * @param {FieldValue} v optional value (service syntax)
     * @return set: itself / get: the UI value converted to service
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    val(v?: FieldValue): any;
    /**
     * Apply a UI function to all referenced fields
     * @param {Simplicite.Ajax.ObjectField} f field
     * @param {string} fn function to apply
     * @param {...*} args function arguments
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    cascad(f: ObjectField, fn: string, ...args: any): void;
    /**
     * Show/Hide UI field
     * @param {(boolean|number)} vis visibility ?
     * <ul>
     * <li>true/false</li>
     * <li>Simplicite.VIS_HIDDEN</li>
     * <li>Simplicite.VIS_BOTH</li>
     * <li>Simplicite.VIS_FORM</li>
     * <li>Simplicite.VIS_LIST</li>
     * </ul>
     * @param {boolean} slide true to add a slide effect
     * @param {number} context optional Simplicite.CONTEXT_*
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    visible(vis: boolean | number, slide?: boolean, context?: number, toRef?: boolean): this;
    /**
     * Enable/Disable UI field
     * @param {(boolean|number)} upd updatable ? true/false or Simplicite.UPD_READ_ONLY|ALWAYS|FORM_ONLY|LIST_ONLY
     * <ul>
     * <li>true/false</li>
     * <li>Simplicite.UPD_READ_ONLY</li>
     * <li>Simplicite.UPD_ALWAYS</li>
     * <li>Simplicite.UPD_FORM_ONLY</li>
     * <li>Simplicite.UPD_LIST_ONLY</li>
     * </ul>
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    updatable(upd: boolean | number): this;
    /**
     * Set required UI field
     * @param {boolean} req is required ?
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    required(req: boolean): this;
    /**
     * Bind 'focus' event or set the focus on field
     * @param {function} handler optional handler
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    focus(handler?: JQueryHandler): this;
    /**
     * Read the form field into object field (async/file reading)
     * @returns Promise
     * @function
     */
    read(): Promise<FieldValue>;
    /**
     * Init field components when displayed on screen
     * @param {Object} _p context parameters (form, formTab to focus, inline field of link, parent object, isExtended, hasMore, refb buttons, promises...)
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    init(_p?: KeyObject): this;
    /**
     * Display the field
     * @param {string} disp optional display 'full' (default = label+input+help) | 'label' | 'input' | 'preview' | 'value' | 'help' | 'image'
     * @param {Object} p context parameters (form, formTab to focus, inline field of link, parent object, isExtended, hasMore, refb buttons, promises...)
     * @returns Rendered control
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    display(disp?: null | FieldDisplay, p?: KeyObject): string | JQuery;
    /**
     * Render the value only
     * @param v field value
     * @returns rendered read-only value, default returns field.displayValue(v,true)
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    renderValue(v: FieldValue, _item?: EnumItem | null): string | JQuery;
    /**
     * Render the object field with label/help and styles
     * @param {Object} options rendering options and context
     * @param {boolean|string} options.showLabel display the label?
     * @param {boolean} options.showHelp display the help?
     * @param {boolean} options.list    context list?
     * @param {JQuery}  options.form    context form?
     * @param {Object}  options.formTab current tabs on form
     * @param {boolean} options.inline  field of inlined link?
     * @param {Object}  options.parent  optional parent object
     * @param {boolean} options.isExtended  extended form?
     * @param {boolean} options.hasMore has more field flag
     * @returns Rendered control
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    render(options?: {
        showLabel?: boolean;
        showHelp?: boolean;
        list?: boolean;
        form?: JQuery;
        formTab?: KeyObject;
        inline?: boolean;
        parent?: ParentObject;
        isExtended?: boolean;
        hasMore?: boolean;
        inputtype?: string;
        inputmode?: string;
    }): JQuery;
    /**
     * Draw the UI controls: input + addon buttons
     * @param {Object} options Options
     * @param {string} options.inputtype HTML input type (defaults to text)
     * @param {string} options.inputmode HTML input mode
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    draw(options?: {
        inputtype?: string;
        inputmode?: string;
    }): JQuery;
    /**
     * Draw the UI input only
     * @param {Object} options Options
     * @param {string} options.inputtype HTML input type (defaults to text)
     * @param {string} options.inputmode HTML input mode
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    drawInput(options?: {
        inputtype?: string;
        inputmode?: string;
    }): JQuery;
    /**
     * Build a form group with input and addon buttons (help, ref picker, datamap...)
     * @param {jQuery} inp Input control
     * @param {Array} addons Optional addons
     * @param {Array} ext Optional extended controls to add beyond the form group
     * @returns .field-container
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    drawGroup(inp: JQuery, addons?: FieldAddon[], ext?: JQuery[]): JQuery;
    /**
     * Redraw the UI field at same place and rebind events
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    redraw(): this;
    /**
     * Render the search field and addon buttons
     * @param {string|Array} filter Filter value
     * @param {Object} options Options
     * @param {function} options.search Search handler
     * @param {boolean} options.searchby Search by field of list header?
     * @param {boolean} options.searchbyfocus set the focus?
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    renderSearch(filter?: FieldFilter | null, options?: {
        search?: Callback;
        searchby?: boolean;
        searchbyfocus?: boolean;
    }): JQuery;
    /**
     * Draw the input of field search
     * @returns Single input or complex <code>\{ prefix, input, addons \}</code> or array <code>[\{ prefix, input, addons \}...]</code>
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    drawSearch(filter: string, options?: KeyObject): JQuery | FieldSearch | FieldSearch[];
    /**
     * Read the search form into object filters
     * @param {jQuery} ctn container with .search-control
     * @param {Simplicite.UI.BusinessObject} o Object to set filters
     * @param {boolean} noRemove True to keep filter with default <code>'%'</code>
     * @memberof Simplicite.UI.View.UIField
     * @function
     * @static
     */
    static readSearch(ctn: Container, o: BusinessObject, noRemove?: boolean): void;
    /**
     * Get the field case style
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    caseStyle(): string;
    /**
     * Reload and redraw all linked lists
     * @param {boolean} all get all linked values when field is empty (case of search)
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    linkedLists(all?: boolean): void;
    /**
     * Helper to assist common filter expression
     * @param {Simplicite.Ajax.ObjectField} f object field
     * @param {jQuery} input search input to assist
     * @param {string} type helper type 'number', 'string' or 'date'
     * @param {function} onOk optional callback(expression)
     * @memberof Simplicite.UI.View.UIField
     * @function
     */
    searchHelper(f: ObjectField, input: JQuery, type: string, onOk: (expr: string) => void): void;
    /**
     * Return a simple clipboard icon, copying the given value to clipboard
     * @param {Container} ctn
     * @param {UIBusinessObject|null} obj
     * @param {ObjectField} field
     * @param {string|undefined} index
     * @param {JQuery} btn Optional button to complete
     * @function
     */
    static buttonClipboard: (ctn: Container, obj: UIBusinessObject | null, field: ObjectField, index: string | undefined, btn?: JQuery) => JQuery<HTMLElement>;
    static clipboard(v: any): void;
}

type FieldValue = null | string | string[] | number | boolean | MetaObject | DocumentDB | DocumentDB[];
type FieldFilter = string | number | boolean | string[];
type FieldDisplay = '' | 'full' | 'label' | 'input' | 'preview' | 'image' | 'value' | 'help';
type FieldCase = "U" | "L" | "C";
type FieldSearchFixed = "read" | "hide";
type FieldLinkMap = {
    target: string;
    host: string;
    value: string;
};
/**
 * Field number format
 * - SC = space as thousand separator, dot as decimal separator
 * - DC = dot as thousand separator, comma as decimal separator
 * - CD = comma as thousand separator, dot as decimal separator
 */
type FieldNumFormat = "SC" | "DC" | "CD";
type FollowLink = {
    object: string;
    rowId: string;
    enabled?: boolean;
};
type CreateLink = {
    object: string;
    enabled?: boolean;
};
/**
 * Simplicit&eacute; field
 * @class
 */
declare class ObjectField {
    app: Session;
    object?: BusinessObject;
    id?: string;
    name: string;
    type: number;
    length: number;
    inheritedFrom?: string;
    column?: string;
    lang: string;
    label: string;
    shortlabel?: string;
    help?: string;
    clipboard?: boolean;
    helplist?: string;
    tooltip?: string;
    placeholder?: string;
    rightToLeft?: boolean;
    case?: FieldCase;
    compliance?: "NA" | "C" | "NC" | "PC" | "NE";
    regexp?: string;
    regexpmsg?: string;
    calcExpr?: string;
    dateformat?: string;
    utc?: string;
    dateUnits?: {
        u: string;
        t: string;
    }[];
    timeUnits?: {
        u: string;
        t: string;
    }[];
    numformat?: FieldNumFormat;
    bigdec?: string;
    metrics?: {
        min?: number;
        max?: number;
        step?: number;
        formWidth?: number;
        formHeight?: number;
        listWidth?: number;
        listHeight?: number;
    };
    yes?: string;
    no?: string;
    modes?: KeyObject;
    fileAccept?: string | string[];
    docmin?: number;
    docmax?: number;
    preview?: boolean;
    defaultValue?: string;
    style?: string;
    icon?: string | null;
    visible?: number;
    visibleDefault?: null;
    updatable: boolean;
    updatableDefault?: number;
    required: boolean;
    requiredDefault?: boolean;
    key: boolean;
    searchReq?: number;
    searchable?: number;
    searchOrder?: number;
    searchFixed?: FieldSearchFixed;
    rendering?: string;
    settings?: KeyObject;
    precision: number;
    editCell: boolean;
    completion: boolean;
    extended: boolean;
    area: number;
    areaId?: string;
    sort?: string;
    extList?: boolean;
    order?: number;
    canGroupBy?: boolean;
    updateAll?: boolean;
    listOfValuesName?: string;
    listOfValues?: EnumItem[];
    listDefaultLabel?: string;
    listOfValueWithAllButtons?: boolean;
    linkedFields?: {
        object: string;
        field: string;
    }[];
    docmulti?: boolean;
    startDate?: string;
    completionAuto?: boolean;
    speechRecognition?: boolean;
    speechSynthesis?: boolean;
    inAction?: Action;
    inExternal?: ExternalObject;
    ref?: boolean;
    refId?: boolean;
    refName?: string;
    refField?: string;
    refObject?: string;
    refUserKey?: string;
    foreignUserKey?: string;
    refMetaObjects?: {
        name: string;
        label: string;
    }[];
    obfId?: string;
    datamap?: number;
    linkDataMap?: FieldLinkMap[];
    createLink?: CreateLink;
    followLink?: FollowLink;
    v: FieldValue;
    oldv: FieldValue;
    m?: MessageAny;
    ui?: UIField;
    moved?: boolean;
    _thId?: string;
    _tran?: string;
    _refInputField?: ObjectField;
    _editor?: KeyObject;
    _ace?: KeyObject;
    _grid?: GridEditorParam;
    periodMax?: number;
    _quillParams?: KeyHash<QuillOptions>;
    /**
     * Constructor
     * @param {Session} app Ajax services
     * @param {Object} field Field metadata
     * @param {Session.BusinessObject} obj Optional related business object
     */
    constructor(app: Session, field: ObjectField, obj?: BusinessObject);
    /**
     * Get label of field type
     * @param {string} type optional type (default this type)
     * @param {boolean} cc optional Camel case (default lower case)
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    typeLabel(type?: number, cc?: boolean): string;
    /**
     * Eval formula when value starts with the equals sign "=3*5+2", ignore syntax error
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    evalCalc(v: string): string;
    /**
     * Convert the date to UI format
     * @param {string} v value YYYY-MM-DD
     * @param {string} df user date format
     * @param {string} r optional rendering Y|M|D|H|I|S
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    dateToUI(v: string, df?: string, r?: string): string;
    /**
     * Convert the time to UI format
     * @param {string} v value HH:MI:SS
     * @param {string} r optional rendering Y|M|D|H|I|S
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    timeToUI(v: string, r?: string): string;
    /**
     * Filter in user language
     * @param {string} flt filter
     * @param {string} dmin optional date min filter
     * @param {string} dmax optional date max filter
     * @param {Object} g grant
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    filterLabel(flt: string, dmin: string, dmax: string, g: Grant): string;
    /**
     * Convert the datetime to UI format
     * @param {string} v value YYYY-MM-DD HH:MI:SS or ISO-8601
     * @param {string} df datetime format DD/MM/YYYY HH:MI:SS or MM/DD/YYYY HH:MI:SS
     * @param {string} r optional rendering Y|M|D|H|I|S
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    datetimeToUI(v: string, df?: string, r?: string): string;
    /**
     * Format a float "1234567.8" => FRA or SC: "1 234 567,80000" - ENU or CD: "1,234,567.80000" - DC: "1.234.567,80000"
     * @param {string|number} v value "1234567.8"
     * @param {string} lang user language (FRA, ENU) or number format (SC, DC, CD)
     * @param {number} prec precision (ex: 5)
     * @param {boolean} num simple number = no thousand separator
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    formatFloat(v: string | number, lang?: string | FieldNumFormat, prec?: number, num?: boolean): string;
    /**
     * Convert UI date to service format YYYY-MM-DD
     * @param {string} v date from UI format
     * @param {string} df user date format
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    toServiceDate(v: string, df?: string): string;
    /**
     * Convert UI time to service format HH:MM:SS
     * @param {string} v time from UI rendering
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    toServiceTime(v: string): string;
    /**
     * Convert service date to ISO-8601 when user has a specific timezone (exclude timestamp fields)
     * @param {string} v datetime YYYY-MM-DD HH:MM:SS
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    tz(v: string): string;
    /**
     * Convert UI datetime to service format YYYY-MM-DD HH:MI:SS (or ISO-8601 with user time zone)
     * @param {string} v datetime from UI format
     * @param {string} df user date format
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    toServiceDatetime(v: string, df?: string): string;
    /**
     * Convert UI float to service format (as string to keep decimal precision)
     * FRA or SC: "1 234 567,80808080808" - ENU or CD: "1,234,567.80808080808" - DC 1.234.567,80808080808 => "1234567.80808080808"
     * @param {string} v UI value
     * @param {string} lang user language (FRA, ENU) or number format (SC, CD, DC)
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    toServiceFloat(v: string, lang?: string): string | null;
    /**
     * Convert the date value to javascript Date
     * @param {string} v service date YYYY-MM-DD or datetime YYYY-MM-DD HH:MI:SS
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    getDate(v: string): Date | null;
    /**
     * Convert javascript Date to value YYYY-MM-DD or YYYY-MM-DD HH:MI:SS when field is a datetime
     * @param {Date} dt Date
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    setDate(dt: Date): string | undefined;
    /**
     * Test if YYYY-MM-DD exists ?
     * @param {String} v date
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    isDate(v: string): boolean;
    /**
     * Test if YYYY-MM-DD HH:MI:SS exists ?
     * @param {String} v datetime
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    isDatetime(v: string): boolean;
    /**
     * Value in user language (enum label, boolean as yes/no, format date integer and float with the rendering)
     * @param {string|number|Object|Array} v Backend value to display in user language (default is current value)
     * @param {boolean} rendering true to apply the rendering
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    displayValue(v?: any, rendering?: boolean): string | string[];
    /**
     * displayValue alias
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    getDisplayValue: (v?: any, rendering?: boolean) => string | string[];
    /**
     * Convert displayed value to service format
     * @param {string} v Front-end value
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    toService(v: string): string | number | boolean | null;
    /**
     * Get or set the service value
     * @param {string} v Optional service value to set
     * @param {boolean} old Copy value into old value?
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    value(v?: FieldValue, old?: boolean): FieldValue;
    /**
     * Get the service value
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    getValue(): FieldValue;
    /**
     * Set the service value
     * @param {string} v Optional service value to set
     * @param {boolean} old Copy value into old value?
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    setValue(v: FieldValue, old?: boolean): void;
    /**
     * Get or set the old service value
     * @param {string} v Optional value to set
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    oldvalue(v?: FieldValue): FieldValue;
    /**
     * Get the service old value
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    getOldValue(): FieldValue;
    /**
     * Set the service old value
     * @param {string} v Optional service value to set
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    setOldValue(v: FieldValue): void;
    /**
     * Get value as percentage value
     * @param {string} v optional value
     * @param {number} t optional type (Simplicite.TYPE_INT, Simplicite.TYPE_FLOAT or Simplicite.TYPE_BIGDECIMAL)
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    percentage(v?: string, t?: number): number;
    /**
     * Compare old and current value
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    hasChanged(): boolean;
    /**
     * UI message to display on field
     * @param {string} msg Optional message to set
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    message(msg?: MessageAny): MessageAny | undefined;
    /**
     * Test if value is empty (or null/undefined, or empty array or not a number)
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    isEmpty(): boolean;
    /**
     * Test if value is true or equals to "1"
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    isTrue(): boolean;
    /**
     * Test if value or multi-enum contains a code
     * @param {string} code list code
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    contains(code: string): boolean;
    /**
     * Test if the field is visible on list
     * @param {Session.BusinessObject} obj optional object to test if foreign-key is also visible
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    isVisibleOnList(obj?: BusinessObject | null): boolean;
    /**
     * Test if the field is visible on form
     * @param {Session.BusinessObject} obj optional object to test if foreign-key is also visible
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    isVisibleOnForm(obj?: BusinessObject | null): boolean;
    /**
     * Test if the field is hidden
     * @param {Session.BusinessObject} obj optional object to test if foreign-key is also visible
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    isHidden(obj?: BusinessObject): boolean;
    /**
     * Test if the field is forbidden
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    isForbidden(): boolean;
    /**
     * Change visibility
     * @param {boolean|number} vis true=both, false=hidden, or Simplicite.VIS_BOTH | VIS_HIDDEN | VIS_FORM | VIS_LIST
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    setVisible(vis: boolean | number): void;
    /**
     * Set the field updatable
     * @param {(boolean|number)} upd updatable ? true/false or Simplicite.UPD_READ_ONLY|ALWAYS|FORM_ONLY|LIST_ONLY
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    setUpdatable(upd: boolean | number): void;
    /**
     * Test if the field is updatable
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    isUpdatable(): boolean;
    /**
     * isUpdatable alias
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    isUpdatableOnForm(): boolean;
    /**
     * isUpdatable alias
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    isUpdatableOnList(): boolean;
    /**
     * @is the field a timestamp (created_by, created_dt, updated_by or updated_dt)
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    isTimestamp(): boolean;
    /**
     * Is a document or image?
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    isFile(): boolean;
    /**
     * Is a document?
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    isDoc(): boolean;
    /**
     * Is an image?
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    isImage(): boolean;
    /**
     * Test if the field is required
     * @param {Session.BusinessObject} obj optional object to test if foreign-key is also required
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    isRequired(obj?: BusinessObject | null): boolean;
    /**
     * Is a functional Id?
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    isFunctId(): boolean;
    /**
     * Is a foreign key? (reference field belonging to object)
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    isForeignKey(): boolean;
    /**
     * Referenced/Belongs to other object?
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    isReferenced(): boolean;
    /**
     * Search the list code of a translated value
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    getCodeFromValue(v: string): string | null;
    /**
     * Get the list item by code (or value)
     * @param {string} c search by code
     * @param {string} v or search by value if c is null
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    getEnumItem(c?: string | null, v?: string | null): EnumItem | undefined;
    /**
     * Field label in user language
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    getDisplay(): string;
    /**
     * Apply a function to all referenced fields
     * @param {Session.BusinessObject} obj Object
     * @param {function} fn function to apply to all referenced fields
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    applyToReferences(obj: BusinessObject, fn: (f: ObjectField) => void): void;
    /**
     * Is the field filtered?
     * @param {string|number|boolean|Array} v optional value to test (default use current object filter)
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    isFiltered(v?: string): boolean;
    /**
     * Is the filter an expression?
     * @param {string} v optional value to test (default use current object filter)
     * @returns {boolean} true if the filter is an expression
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     */
    isFilterExpr(v?: string): boolean;
    /**
     * Convert UI wildcard filter to service LIKE pattern
     * @param {string} s UI filter
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     * @static
     */
    static convertWildcardToService(s: string | null): string;
    /**
     * Convert service LIKE pattern to UI wildcard filter
     * @param {string} s Service filter
     * @memberof Simplicite.Ajax.ObjectField
     * @function
     * @static
     */
    static convertWildcardToUI(s: string | null): string;
}

type ActivityMetadata = {
    id?: string;
    name: string;
    step: string;
    type: string;
    label: string;
    help?: AnyContent;
    tip?: AnyContent;
    template?: string;
    write?: boolean;
};
type ActivityStatus = "R" | "W";
type ActivityFile = {
    pid: string;
    aid: string;
    step: string;
    metadata?: ActivityMetadata;
    readonly?: boolean;
    status: ActivityStatus;
    ownerId: string;
    template?: string;
    url?: string;
    content?: AnyContent;
    info?: string;
    data?: {
        [dataGroupName: string]: {
            [fielName: string]: {
                field: ObjectField;
                values: string[];
            };
        };
    };
    actions: ProcessAction[];
    object?: BusinessObject & {
        meta?: ObjectMetadata;
        inst?: string;
    };
    terminated?: boolean;
    forward?: {
        object?: string;
        row_id?: string;
        url?: string;
    };
};
type RoadRender = "VC" | "VM" | "HC" | "HM";
type ProcessMetadata = {
    id: string;
    name: string;
    label: string;
    steps: {
        [step: string]: ActivityMetadata;
    };
    resources?: KeyObject[];
    screenflow?: boolean;
    roadRender?: RoadRender;
    roadStatic?: boolean;
    orderedSteps?: string[];
};
type ProcessAction = {
    id: string;
    action: ProcessActionType;
    label: string;
    primary?: boolean;
};
type ProcessActionType = "start" | "abort" | "lock" | "unlock" | "validate" | "cancel" | "back" | "open" | "read" | "close" | "list" | "gotopage" | "searchpage";
type ProcessParam = {
    step?: string;
    aid?: string;
    object?: string;
    rowId?: string;
    action?: ProcessActionType;
    showRoad?: boolean;
    msg?: MessageJSON[];
    roadRender?: RoadRender;
    roadStatic?: boolean;
};
/**
 * Simplicit&eacute; business process.
 * <br/>Getting a new business process should use the <code>Simplicite.Ajax.getBusinessProcess()</code> function instead of this constructor
 * @class
 */
declare class BusinessProcess {
    private _app;
    metadata: ProcessMetadata;
    pid?: string | null;
    locals: KeyObject;
    activity?: ActivityFile;
    processRoad?: ActivityFile[];
    historic?: object;
    ui?: UIEngine;
    /**
     * Constructor
     * @param {Session} app Application Simplicite.Ajax instance
     * @param {string} name Business process name
     */
    constructor(app: Session, name: string);
    /**
     * Loads meta data.
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    getMetaData(): Promise<ProcessMetadata>;
    /**
     * Are metadata loaded ?
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    isLoaded(): string;
    /**
     * Gets name from meta data.
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    getName(): string;
    /**
     * Gets label name from meta data.
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    getLabel(): string;
    /**
     * Local parameter in instance
     * @param name Parameter key name
     * @param value Optional value (to get or set)
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    localParameter(name: string, value?: unknown): unknown;
    /**
     * Initialize the local parameters hasChanged and hasChangedFields
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    initChangedFields(): void;
    /**
     * Add a field when has changed
     * @param f field or name
     * @param id optional id (edit list)
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    addChangedField(f: string | ObjectField, id?: string): void;
    /**
     * Remove a field when has not changed
     * @param f field or name
     * @param id optional id (edit list)
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    removeChangedField(f: string | ObjectField, id?: string): void;
    /**
     * Trigger the has changed flag
     * @param v optional to set the hasChanged value (true when the array of hasChangedFields is not empty)
     * @returns the local parameter hasChanged
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    hasChanged(v?: unknown): unknown;
    /**
     * Start a new process (or continue the screenflow)
     * @param {Object} params Optional parameters
     * @param {boolean} params.road true to get the full navigation array, false to get the current activity
     * @param {string} params.object launcher object name
     * @param {string} params.rowId launcher object row Id
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    start(params?: {
        road?: boolean;
        object?: string;
        rowId?: string;
    }): Promise<ActivityFile | undefined>;
    /**
     * Abort the process
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    abort(): Promise<ActivityFile>;
    /**
     * Process road
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    road(): Promise<object | undefined>;
    /**
     * Set data values in the current activity
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    setActivityData(group: string, name: string, values: string[]): void;
    /**
     * Get data values of the current activity
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    getActivityData(group: string, name: string): string[] | null;
    /**
     * Get data values of a road step
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    getData(step: string, group: string, name: string): string[] | null | undefined;
    /**
     * Activity common action
     * @param {string} action lock, unlock, validate, back, cancel, read, open, firstpage, lastpage, nextpage, backpage, gotopage
     * @param {Object} activity Activity data
     * @param {Object} params Optional parameters
     * @param {boolean} params.road true to get the full navigation array, false to get the current activity
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    action(action: string, activity: ActivityFile, params?: {
        road?: boolean;
    }): Promise<ActivityFile | undefined>;
    /**
     * Read the activity with <code>\{ step, aid \}</code>
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    read(activity: ActivityFile, params?: {
        road?: boolean;
    }): Promise<ActivityFile | undefined>;
    /**
     * Read and lock the activity <code>\{ step, aid \}</code>
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    lock(activity: ActivityFile, params?: {
        road?: boolean;
    }): Promise<ActivityFile | undefined>;
    /**
     * Read and unlock the activity <code>\{ step, aid \}</code>
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    unlock(activity: ActivityFile, params?: {
        road?: boolean;
    }): Promise<ActivityFile | undefined>;
    /**
     * Cancel the activity, returns the next activity or the forward parameters
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    cancel(activity: ActivityFile, params?: {
        road?: boolean;
    }): Promise<ActivityFile | undefined>;
    /**
     * Validate the activity with data, returns errors, the next activity or the forward parameters
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    validate(activity: ActivityFile, params?: {
        road?: boolean;
    }): Promise<ActivityFile | undefined>;
    /**
     * Next activity = alias of validate
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    next: (activity: ActivityFile, params?: {
        road?: boolean;
    }) => Promise<ActivityFile | undefined>;
    /**
     * Unlock the activity and read/lock the previous one
     * @memberof Simplicite.Ajax.BusinessProcess
     * @function
     */
    back(activity: ActivityFile, params?: {
        road?: boolean;
    }): Promise<ActivityFile | undefined>;
}

type UsageUser = {
    userId?: string;
    login?: string;
    firstname?: string;
    lastname?: string;
    image?: string;
    picture?: DocumentDB;
    usageId?: string;
};
type Scope = {
    scope: string;
    icon: string;
    logo: string;
    label: string;
    url: string;
    workarea: "1" | "M" | "S";
};
type ActionType = "L" | "F" | "A" | "O" | "I" | "B" | "H";
type ActionLevel = "primary" | "secondary" | "default" | "info" | "success" | "warning" | "danger" | "action" | "transition" | "plus" | "icon" | "extend";
type ActionSize = 'xs' | 'sm' | 'md' | 'lg' | 'icon';
type Action = {
    name: string;
    id?: string;
    type?: ActionType;
    container?: Container;
    label?: string;
    showLabel?: boolean;
    icon?: string;
    help?: string;
    custom?: boolean;
    backend?: boolean;
    enabled?: boolean;
    disabled?: boolean;
    plus?: boolean;
    close?: boolean;
    reloadOnCancel?: boolean;
    primary?: boolean;
    level?: ActionLevel;
    style?: string;
    size?: ActionSize;
    background?: string;
    color?: string;
    enumBackground?: string;
    enumColor?: string;
    formVisible?: boolean;
    listVisible?: boolean;
    listItemVisible?: boolean;
    countRows?: boolean;
    url?: string;
    target?: LoadTarget;
    fields?: ObjectField[];
    params?: KeyObject;
    confirm?: boolean;
    confirmExpr?: string;
    confirmUI?: string;
    transition?: string;
    toState?: string;
    parent?: ParentObject;
    element?: Container;
    object?: BusinessObject;
    rowId?: string | null;
    ui?: UIAction;
    moved?: boolean;
    button?: JQuery;
    callback?: ActionHandler | JQueryHandler;
};
type Transition = Action & {
    enumBackground?: string;
    enumColor?: string;
};
type ActionGroup = {
    name: string;
    icon?: string;
    label: string;
    showLabel?: boolean;
    actions?: string[];
};
type News = {
    id?: string;
    row_id?: string;
    title?: string;
    nws_title?: string;
    description?: string;
    nws_description?: string;
    image?: DocumentDB;
    nws_image?: DocumentDB;
    date?: string;
    nws_date?: string;
};
type NewTabPosition = "tab" | Position;
type MenuParam = {
    item: MenuItem;
    object?: string;
    workflow?: string;
    process?: string;
    bam?: string;
    step?: string;
    tray?: string;
    field?: string;
    code?: string;
    domain?: string;
    view?: string;
    href?: string;
    target?: LoadTarget;
    label?: string;
    newtab?: NewTabPosition;
};
type MenuItem = {
    type: "object" | "statusobject" | "external" | "process" | "workflow" | "domain" | "view";
    name: string;
    label: string;
    icon: string;
    open?: boolean;
    ext?: boolean;
    extended?: boolean;
    create?: boolean;
    url?: string;
    href?: string;
    target?: string;
    width?: number | string;
    height?: number | string;
    field?: string;
    hasHome?: boolean;
    homePage?: string;
    dashboard?: boolean;
    widget?: boolean;
    tray?: boolean;
    items?: SubMenu;
    activities?: ActivityMetadata[];
    states?: EnumItem[];
    trays?: {
        field: string;
        label: string;
    }[];
    lists?: {
        field: string;
        label: string;
        items: EnumItem[];
    }[];
    menu_position?: string;
};
type MainMenu = MenuItem[];
type SubMenu = MenuItem[];
type MenuSettings = {
    top: {
        active: boolean;
    };
    left: {
        active: boolean;
        collapse: "none" | "hidden" | "icons-static" | "icons-expand" | "none";
        style: "standard" | "accordion" | "simple";
        searchable: boolean;
    };
};
/**
 * Generic Action handler
 * @type ActionHandler
 */
type ActionHandler = (action: Action, obj: UIBusinessObject, rowid?: string | null) => void;
/**
 * Generic action handlers binded per action name
 */
type ActionHandlers = {
    enabled: boolean;
    handlers?: ActionHandler[];
};
type GoogleParam = {
    GOOGLE_API_KEY: string;
};
type Palette = {
    name?: string;
    primary?: string;
    secondary?: string;
    base?: string;
    text?: string;
    accent?: string;
};
type Theme = {
    id: string;
    name: string;
    base: 'light' | 'dark';
    palette?: Palette;
};
type DevOptions = {
    jshintESVersion: number;
    javadocLocation: string;
    jsdocLocation: string;
    LSP?: {
        enabled?: boolean;
        isInitialized?: boolean;
        languageClient?: any;
        writeFileDelay: number;
        activeSession: string;
        server: null | {
            url: string;
            module: () => Promise<KeyObject>;
            modes: "java";
            type: "socket";
            socket: WebSocket;
        };
        snippetsEnabled: boolean;
        state: {
            title: "off";
            update: (title: string) => void;
        };
    };
};
/**
 * Simplicit&eacute; user's grant
 * @class
 */
declare class Grant {
    app: Session;
    version?: string;
    sysversion?: string;
    sysversiondate?: string;
    title?: string;
    login: string;
    userid: string;
    email?: string;
    firstname?: string;
    lastname?: string;
    picture?: DocumentDB;
    filterId?: string;
    connectAs?: string;
    changeUser?: boolean;
    changePwd?: boolean;
    apps?: Scope[];
    scopeName?: string;
    scope?: Scope;
    home?: string;
    disposition?: string;
    iconset?: string;
    theme?: Theme;
    themes?: Theme[];
    allThemes?: Theme[];
    a11y?: boolean;
    lang: string;
    langpref?: string;
    langs?: {
        lang: string;
        label: string;
    }[];
    dateformat: string;
    utc?: string;
    usertz?: boolean;
    numformat?: FieldNumFormat;
    font?: string;
    styles?: boolean;
    monitoring?: boolean;
    minrows?: number;
    maxrows?: number;
    objectAbout?: boolean;
    useDocPreview?: boolean;
    htmleditor?: boolean;
    codeEditorThemeLight?: string;
    codeEditorThemeDark?: string;
    shortcutPrefs?: KeyObject;
    menuCollapsed?: boolean;
    libs?: {
        [key: string]: boolean;
    };
    responsibilities?: string[];
    adapters?: KeyObject[];
    objects?: KeyObject;
    shortcuts?: Shortcut[];
    menu?: MainMenu;
    sysparams: KeyObject;
    texts?: KeyObject;
    bookmarks?: Bookmarks;
    dashboard?: object;
    guides?: KeyObject;
    resources?: string;
    google?: GoogleParam;
    dev?: DevOptions;
    /**
     * Constructor
     * @param {Session} app Ajax services
     */
    constructor(app: Session);
    /**
     * Init
     * @param {Object} grant User rights meta-data
     */
    init(grant: KeyObject): void;
    /**
     * Get user ID
     * @function
     */
    getUserID(): string;
    /**
     * Get user login
     * @function
     */
    getLogin(): string;
    /**
     * Get user language
     * @function
     */
    getLang(): string;
    /**
     * Get user email
     * @function
     */
    getEmail(): string;
    /**
     * Get user first name
     * @function
     */
    getFirstName(): string;
    /**
     * Get user last name
     * @function
     */
    getLastName(): string;
    /**
     * Get user full name
     * @function
     */
    getFullName(): string;
    /**
     * Check if user has responsibility on specified group
     * @param {string} group Group name
     * @function
     */
    hasResponsibility(group: string): boolean;
    /**
     * Is user an ADMIN or a DESIGNER ?
     * @function
     */
    isAdmin(): boolean;
    /**
     * Get a session parameter from server-side
     * @param {string} name Parameter name
     * @function
     */
    getParameter(name: string): Promise<string>;
    /**
     * Set a session parameter to server-side
     * @param {string} name Parameter name
     * @param {string} value Parameter value
     * @function
     */
    setParameter(name: string, value: string): Promise<string>;
    /**
     * Get text alias (constraint usage)
     * @param {string} code text code
     * @param {boolean} plural look for the plural label
     * @function
     */
    getText(code: string, plural?: boolean): string;
    /**
     * Get text alias (constraint usage)
     * @param {string} code text code
     * @param {boolean} plural look for the plural label
     * @function
     */
    T(code: string, plural?: boolean): string;
    /**
     * Get object wrapper
     * @param {string} inst instance name
     * @param {string} name object name
     * @function
     */
    getObject(inst: string, name: string): BusinessObject;
    /**
     * Get main object wrapper
     * @param {string} obj object name
     * @function
     */
    getMainObject(obj: string): BusinessObject;
    /**
     * Get home object wrapper
     * @param {string} obj object name
     * @function
     */
    getHomeObject(obj: string): BusinessObject;
    /**
     * Get temporary object wrapper
     * @param {string} obj object name
     * @function
     */
    getTmpObject(obj: string): BusinessObject;
    /**
     * Get panel wrapper
     * @param {string} obj object name
     * @param {string} fk optional foreign-key name
     * @function
     */
    getPanelObject(obj: string, fk: string): BusinessObject;
    /**
     * Get merge wrapper
     * @param {string} obj object name
     * @function
     */
    getMergeObject(obj: string): BusinessObject;
    /**
     * Get merge panel wrapper
     * @param {string} obj object name
     * @param {string} fk optional foreign-key name
     * @function
     */
    getMergePanelObject(obj: string, fk: string): BusinessObject;
    /**
     * Get reference object wrapper
     * @param {string} obj object name
     * @function
     */
    getRefObject(obj: string): BusinessObject;
    /**
     * Get datamap object wrapper
     * @param {string} obj object name
     * @function
     */
    getDataMapObject(obj: string): BusinessObject;
    /**
     * Get object label
     * @param {string|Session.BusinessObject} name object or name
     * @function
     */
    objectLabel(name: string | BusinessObject): string;
    /**
     * JS class for UI usage
     * @param {string} name Object name
     * @function
     */
    getUIObjectClass(name: string): typeof UIBusinessObject;
    /**
     * JS class for UI usage
     * @param {string} name Object name
     * @param {string} js Class script
     * @function
     */
    setUIObjectClass(name: string, js: string): void;
    /**
     * Check access to object
     * @param {string|BusinessObject} name object or name
     * @param {string} prop optional property to check 'c'=create 'u'=update 'd'=delete 'i'=indexable
     * @function
     */
    checkAccess(name: string | BusinessObject, prop?: string): boolean;
    /**
     * Can access/read object
     * @param {string|BusinessObject} name object or name
     * @function
     */
    accessObject(name: string | BusinessObject): boolean;
    /**
     * Add access/read object
     * @param {string|BusinessObject} name object or name
     * @function
     */
    addAccessObject(name: string | BusinessObject): void;
    /**
     * Can create object
     * @param {string|Session.BusinessObject} name object or name
     * @function
     */
    accessCreate(name: string | BusinessObject): boolean;
    /**
     * Can update object
     * @param {string|Session.BusinessObject} name object or name
     * @function
     */
    accessUpdate(name: string | BusinessObject): boolean;
    /**
     * Can delete object
     * @param {string|Session.BusinessObject} name object or name
     * @function
     */
    accessDelete(name: string | BusinessObject): boolean;
    /**
     * Get filtered objects on index search
     * @function
     */
    getIndexFilteredObjects(cbk: (list: string[]) => void): void;
    /**
     * Set filtered objects on index search
     * @function
     */
    setIndexFilteredObjects(list: string[], cbk: Callback): void;
}

declare type TrayActor = {
    login: string;
    firstname?: string;
    lastname?: string;
    avatar?: string;
    picture?: DocumentDB;
};
declare type TrayCard = {
    object: string;
    rowid: string;
    label: string;
    icon: string;
    thumbnail?: string;
    social: number;
    actors: TrayActor[];
};
declare type TrayColumn = {
    name: string;
    title: string;
    actions: Action[];
    object: BusinessObject;
    field?: string;
    status: EnumItem;
    items: TrayCard[];
    page: number;
    maxpage: number;
    count: number;
};
/**
 * Tray controller
 * @class
 */
declare class Tray {
    /**
     * Display a tray based on a state-model
     * @param ctn Container
     * @param obj Business object or name
     * @param options Optional
     * @param cbk Optional callback
     */
    displayStateModel(ctn: Container, obj: BusinessObject, options?: KeyObject, cbk?: Callback): this;
    /**
     * Display a tray based on a enum field
     * @param ctn Container
     * @param object Business object or name
     * @param enumField Optional enum field (default = status field)
     * @param options Optional
     * @param cbk Optional callback
     */
    display(ctn: Container, object: string | BusinessObject, enumField?: string, options?: KeyObject, cbk?: Callback): this;
    /**
     * Manage the drag & drop
     */
    dragDrop(ctn: Container, p: KeyObject): this;
}

type DocumentDB = {
    docId: string;
    id?: string;
    rowId: string;
    rowid?: string;
    field: string;
    object: string;
    name?: string;
    mime?: string;
    content?: string;
    text?: string;
    file?: File;
    deleted?: boolean;
    loading?: boolean;
    src?: string;
    alt?: string;
    newAlt?: string;
    thumbnail?: string;
};
type Area = {
    id?: string;
    area: number;
    name: string;
    icon?: string;
    title?: boolean;
    label?: string;
    visible: boolean;
    uiTemplate?: string;
    fields?: string[];
    compact?: boolean;
    tabsPosition?: string;
    tabsLabel?: boolean;
    ui?: UIArea;
    div?: Container;
    _tab?: number;
    _tabIndex?: number;
};
type Link = {
    object: string;
    field: string;
    childfk?: string;
    child?: string;
    inline?: boolean;
    icon?: string;
    label?: string;
    plurallabel?: string;
    minOccurs?: number;
    maxOccurs?: number;
    order: number;
    rendering?: string;
    reflexiveField?: string;
    reflexiveDepth?: number;
    depth?: number;
    mergeCount?: number;
    _ids?: KeyObject;
};
type RowGroupByKey = {
    refobj: string;
    refid: string;
    label: string;
    value: string;
};
type RowGroupBy = {
    key?: RowGroupByKey[];
    label?: string;
    totals?: KeyNumber;
    count?: number;
};
type RowTree = {
    count?: number;
    nid?: string;
    meta?: ObjectMetadata;
    data?: KeyObject;
    list?: RowTree[];
};
type RowData = KeyHash<FieldValue>;
type RowDataMeta = {
    data: RowData;
    meta: ObjectMetadata;
    _index?: string;
    _toDelete?: boolean;
};
type RowItem = RowData | RowDataMeta | RowTree | RowGroupBy;
type RowPartial = {
    page: number;
    maxpage: number;
    list: RowDataMeta[];
};
type EnumItem = {
    code: string;
    value: string;
    label?: string;
    hideLabel?: boolean;
    disabled?: boolean;
    enabled?: boolean;
    transition?: string;
    icon?: string;
    tag?: boolean;
    bgcolor?: string;
    color?: string;
};
type PrintTemplate = {
    name: string;
    usage: string;
    enabled: boolean;
};
type PrefefSearch = {
    id: string;
    label: string;
    filters: KeyObject;
    pub?: boolean;
};
type Datamap = {
    objectA: string;
    objectB: string;
    maps: {
        type: string;
        inputA: string;
        inputB: string;
    }[];
};
type Associate = {
    parent: string;
    parentRefField: string;
    child?: string;
    childRefField?: string;
};
type TargetObject = {
    object: string;
    inst: string;
    rowId: string;
};
type ParentObject = {
    name: string;
    inst?: string;
    field: string;
    rowId: string;
    object?: BusinessObject;
    values?: KeyObject;
    index?: string;
    container?: JQuery;
};
type MetaObject = {
    object?: string;
    row_id?: string;
    key?: string;
    parent?: ParentObject;
    item?: KeyObject;
    fields?: string[];
    addons?: JQuery[];
    actions?: RowActions | null;
    image?: string;
    placemap?: boolean;
    label?: string;
    userkeylabel?: string;
    count?: number;
    tray?: boolean;
    icon?: string;
    thumbnail?: string;
    onopen?: false | null | ((ctn: AnyContainer, obj: string | BusinessObject, id: string) => void);
};
/** Inlined parameters for documents, thumbnails and meta-object */
type InlineParam = {
    /** Inline documents (`true` or `'images'` for images only or `'infos'` for documents data without content or array of field names) ? */
    inlineDocs?: boolean | "infos" | string[];
    /** Inline image documents thumbnails (true | array of fields) ? */
    inlineThumbs?: boolean | string[];
    /** Inline objects fields items (true|false) ? */
    inlineObjs?: boolean;
};
/** Data of inlined (0,1) or (1,1) link in form */
type InlineObject = {
    object: BusinessObject;
    parent: ParentObject;
    link: Link;
    enabled?: boolean;
    count?: number;
    mandatory?: boolean;
    rowId?: string;
    metadata?: ObjectMetadata;
};
type Resource = {
    type: 'JS' | 'TS' | 'CSS';
    data?: string;
    code: string;
    id: string;
};
/** Front-end public metadata of object */
type ObjectMetadata = {
    name: string;
    instance: string;
    id?: string;
    copyId?: string;
    rowidfield: string;
    icon?: string;
    label?: string;
    plurallabel?: string;
    help?: string;
    longhelp?: string;
    userKey?: string;
    uiTemplate?: string | JQuery;
    uiListTemplate?: string;
    uiSummary?: string;
    defaultView?: string;
    showViews?: ShowViewsMode;
    navbar?: KeyObject;
    useHTML?: boolean;
    useAce?: boolean;
    resources?: Resource[];
    context?: number;
    msg?: MessageJSON[];
    undoredo?: {
        url: string;
    };
    useLock?: boolean;
    usage?: UsageUser[];
    query?: boolean;
    create?: boolean;
    copy?: boolean;
    update?: boolean;
    del?: boolean;
    useForm?: boolean;
    open?: boolean;
    accessNewForm?: boolean;
    accessNewLoop?: boolean;
    social?: {
        popup?: boolean;
        inline?: boolean;
        share?: boolean;
    };
    canSave?: boolean;
    canSaveNew?: boolean;
    canSaveCopy?: boolean;
    canSaveClose?: boolean;
    canClose?: boolean;
    exportTimestamp?: boolean;
    exportMedias?: string[];
    search?: ListSearchMode;
    minrows?: number;
    maxrows?: number;
    predefSearchUsage?: number;
    predefSearch?: PrefefSearch[];
    indexable?: boolean;
    listSortable?: boolean;
    listMinified?: boolean;
    listMinifiable?: ListLayout;
    selectRows?: boolean;
    reorder?: {
        field: string;
        move?: boolean;
        bulk?: boolean;
    };
    canGroupBy?: boolean;
    groupBy?: string[];
    hasMoreList?: boolean;
    uiSearchTemplate?: string;
    uiSearchTemplatePos?: Position;
    formSearchable?: boolean;
    fields: ObjectField[];
    views: View[];
    links: Link[];
    datamaps?: {
        [key: string]: Datamap;
    };
    actions?: Action[];
    actionGroups?: ActionGroup[];
    areas?: Area[];
    listAreas?: boolean;
    target?: TargetObject;
    statusfield?: string;
    transitions?: Transition[];
    crosstabs?: CrosstabMetadata[];
    placemaps?: Placemap[];
    agendas?: Agenda[];
    printtemplates?: PrintTemplate[];
    guides?: GuideMetadata[];
    mergeMaster?: boolean;
    mergeMetaObjects?: MetaObject[];
};
/** Get a record parameters */
type GetParam = InlineParam & {
    /** Init context (one of `Simplicite.Ajax.CONTEXT_CREATE/UPDATE/DELETE/COPY` constants) */
    context?: number;
    /** true to update the metadata in context */
    metadata?: boolean;
    /** Array of field names to retrieve (if absent or undefined, all fields are retrieved) */
    fields?: string[];
    /** Optional field values to set and foreign keys to populate */
    values?: KeyObject;
    /** Optional parent context `{name,inst,field,rowId}` to populate related fields (useful in CONTEXT_CREATE) */
    parent?: ParentObject;
    /** true to get posts count */
    social?: boolean;
    /** true to get social share data */
    share?: boolean;
    /** Optional treeview name to get a tree from this root */
    treeView?: string;
    /** Search depth in tree */
    treeDepth?: number;
    /** true update and get the user's trees history */
    treeHistory?: boolean;
    /** optional tree path */
    treePath?: string;
    /** true to get the user keys */
    userKeys?: boolean;
};
/** Search records parameters */
type SearchAjax = InlineParam & {
    context?: number;
    page?: number;
    metadata?: boolean;
    parent?: ParentObject;
    groupby?: boolean;
    partial?: boolean;
    groupbyfields?: string[];
    history?: boolean;
    totals?: boolean;
    social?: boolean;
    edit?: string;
    view?: {
        name: string;
        item?: number;
        home?: boolean;
    };
    visible?: boolean;
    treeDepth?: number;
    searchId?: string;
};
/** Search param for simple list or records */
type SearchAjaxList = Omit<SearchAjax, "metadata" | "groupby" | "partial" | "treeDepth">;
/** Search param with metadata */
type SearchAjaxMetadata = Omit<SearchAjax, "metadata"> & {
    metadata: true;
};
/** Search param for group-by items */
type SearchAjaxGroupBy = Omit<SearchAjax, "groupby" | "partial"> & {
    groupby: true;
};
/** Search param for partial list of group-by item */
type SearchAjaxPartial = Omit<SearchAjax, "groupby" | "partial"> & {
    groupby: false;
    partial: true;
};
/** Search param for reflexive tree */
type SearchAjaxTree = Omit<SearchAjax, "treeDepth"> & {
    treeDepth: number;
};
type PredefSearch = {
    id?: string;
    name?: string;
    label?: string;
    filters?: KeyObject;
    pub?: boolean;
};
/**
 * Simplicit&eacute; business object.
 * - Getting a new business object should use the {@code Simplicite.Ajax.getBusinessObject()} function instead of this constructor
 * @class
 */
declare class BusinessObject {
    /**
     * Shorthand to {@code Simplicite.Ajax} instance.
     * Kept for backward compatibility, same as global {@code $app} in the application code.
     * @member
     */
    _app: Session;
    /**
     * Current contextual meta data of form, list, row...
     * @member
     */
    metadata: ObjectMetadata;
    /**
     * Current item. Use {@code item["fieldname"]} or {@code item.fieldname} to access to the field value
     * @member
     */
    item: RowItem;
    /**
     * Current item data of action with fields.
     * @member
     */
    itemAction?: KeyObject;
    /**
     * Current search filters. Use {@code filters["fieldname"]} or {@code filters.fieldname} to access to the filter value
     * @member
     */
    filters: Filters;
    /**
     * Current selected row ids in list (for multi-selection).
     * Use {@code selectedIds} array to access to the selected row ids (undefined if no selection, null if all selected, explicitly set with rowIds otherwise).
     * @member
     */
    selectedIds?: string[];
    /**
     * Current search result array of items.
     * @member
     */
    list: RowItem[];
    /**
     * Current search result count.
     * @member
     */
    count: number;
    /**
     * Current search result max page index (for paginated searches).
     * @member
     */
    maxpage: number;
    /**
     * Current search result page index (for paginated searches).
     * @member
     */
    page: number;
    /**
     * Current search result page index (for paginated searches).
     * @member
     */
    pagesize: number;
    /**
     * Social counter(s) from get or search
     * @member
     */
    social?: number | number[];
    /**
     * Count of group-by items (for group-by searches).
     * @member
     */
    countGroupBy?: number;
    /**
     * Store sum/avg/min/max... of the bottom row "Total" per field on list.
     * @member
     */
    totals?: KeyObject;
    /**
     * Crosstab data (if requested with `crosstab=true` in search params).
     * @member
     */
    crosstabdata?: CrosstabData;
    /**
     * Social share data (if requested with `share=true` in get or search params).
     * @member
     */
    share?: KeyObject;
    /**
     * Parent object of child instance
     * @member
     */
    parent?: ParentObject;
    /**
     * Reference field to parent object of child instance
     * @member
     */
    parentRefField?: string;
    /**
     * History of items (for history searches).
     * @member
     */
    hist?: {
        list: KeyObject[][];
        actors: TrayActor[];
    };
    /**
     * Local data get/set thru {@code localParameter(code, value)}
     * (e.g. cloned UI globals, hasChanged flag, hasChangedFields list, etc.)
     * - Public usage in applicaiton and hooks, to preserve some context on client-side.
     * - Used to store contextual data during UI rendering.
     * - Beware, local data are not sent or persisted in the server, use {@code $app.setSysParam(...)} and {@code $app.getSysParam(...)} to send/receive data from server-side.
     * @member
     */
    locals: {
        ui?: typeof Globals;
        hasChanged?: boolean;
        hasChangedFields?: string[];
    };
    /**
     * Contextual cached data during UI rendering
     * (e.g. treeview definitions, prepared metrics, trays built from enum codes, opened nodes, tmppb cache for pillbox, etc.)
     * - Platform internal usage. Do not use it in the application code, use {@code localParameter(code, value)} instead.
     * - It can evolve to become breaking changes in future versions.
     * @member
     */
    context: {
        listMeta?: ObjectMetadata;
        predefSearch?: PredefSearch;
        navParams?: SearchAjax;
        treeviews?: {
            [key: string]: TreeView;
        };
        metrics?: {
            fromDate?: string;
            toDate?: string;
            period?: number;
            palette?: string;
        };
        showDocs?: KeyString;
        trays?: TrayColumn[];
        treeOpened?: KeyBoolean;
        newItem?: KeyObject;
        inlineValues?: KeyObject;
        tmppb?: TempPillboxes;
        toastNoRowFound?: boolean;
    };
    /**
     * Constructor
     * @param {Session} app Application {@code Simplicite.Ajax} instance
     * @param {string} objName Object name
     * @param {string} objInstName Object instance name, optional (default to {@code the_ajax_<object name>})
     */
    constructor(app: Session, objName: string, objInstName?: string);
    /**
     * Gets Id from meta data.
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getId(): string | undefined;
    /**
     * Gets name from meta data.
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getName(): string;
    /**
     * Gets instance name from meta data.
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getInstance(): string;
    /**
     * Gets instance name from meta data (alias to getInstance).
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getInstanceName(): string;
    /**
     * Is main instance?
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    isMainInstance(): boolean;
    /**
     * Is panel instance?
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    isPanelInstance(): boolean;
    /**
     * Is reference selection instance?
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    isRefInstance(): boolean;
    /**
     * Is datamap selection instance?
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    isDataMapInstance(): boolean;
    /**
     * Is home instance?
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    isHomeInstance(): boolean;
    /**
     * Is ajax instance?
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    isAjaxInstance(): boolean;
    /**
     * Is temporary instance?
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    isTmpInstance(): boolean;
    /**
     * Is process instance?
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    isProcessInstance(): boolean;
    /**
     * Are metadata loaded ?
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    isLoaded(): string | undefined;
    /**
     * Gets label from meta data (is undefined as long as meta data are not loaded using {@code getMetaData()}).
     * @param {boolean} plural Get plural label if defined
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getLabel(plural?: boolean): string | undefined;
    /**
     * Gets context help from meta data (is undefined as long as meta data are not loaded using {@code getMetaData()}).

     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getHelp(): string | undefined;
    /**
     * Gets fields array from meta data (is undefined as long as meta data are not loaded using {@code getMetaData()}).
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getFields(): ObjectField[];
    /**
     * Gets an Object Field
     * @param {string|ObjectField} field Field name or metadata
     * @param {Object} data Optional contextual data { value, message }
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getObjectField(field: string | ObjectField, data?: {
        value: string;
        message: string;
    }): ObjectField | undefined;
    /**
     * Gets links array from meta data (is undefined as long as meta data are not loaded using {@code getMetaData()}).
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getLinks(): Link[];
    /**
     * Gets a link definition.
     * @param object Referenced object or name
     * @param field Foreign key field or name
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getLink(object: string | KeyObject, field: string | ObjectField): Link | undefined;
    /**
     * Gets views array from meta data (is undefined as long as meta data are not loaded using {@code getMetaData()}).
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getViews(): View[];
    /**
     * Gets a view definition.
     * @param name View name
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getView(name: string): View | undefined;
    /**
     * Gets field from fields array in meta-data (returns undefined if field is not found).
     * @param name Field name or Field
     * @param id Optional list index/rowId
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getField(name: string | ObjectField, id?: string): ObjectField | undefined;
    /**
     * Gets the field index in object
     * @param name Field name or Field
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getFieldIndex(name: string | ObjectField): number | undefined;
    /**
     * Get field value shorthand
     * @param name Field name or Field
     * @param id Optional list rowId
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getFieldValue(name: string | ObjectField, id?: string): FieldValue | null;
    /**
     * Set field value shorthand
     * @param name Field name or a field
     * @param val Value
     * @param id Optional list rowId
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    setFieldValue(name: string | ObjectField, val: FieldValue, id?: string): void;
    /**
     * Get old field value shorthand
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getFieldOldValue(name: string | ObjectField, id?: string): FieldValue | null;
    /**
     * Set old field value shorthand
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    setFieldOldValue(name: string | ObjectField, val: FieldValue, id?: string): FieldValue;
    /**
     * Get the root field of reference, null when field belongs to object
     * @param field Field or name
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getRootField(field: string | ObjectField): ObjectField | undefined;
    /**
     * Get user-key fields
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getUserKeyFields(): ObjectField[];
    /**
     * Get foreign-key fields
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getForeignKeys(): ObjectField[];
    /**
     * Get URL of first image field
     * @param {Object} item optional item (use field values if unset)
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getImageURL(item?: KeyObject): string | undefined;
    /**
     * Set values (item into fields)
     * @param item values per field name, default: current item
     * @param old true to copy values into old values ?
     * @param id optional list index/rowId
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    setValues(item: RowItem, old?: boolean, id?: string): void;
    /**
     * Gets the current item
     * @param id Optional index/rowId to get data+meta in current list
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getItem(id?: string): RowItem | undefined;
    /**
     * Gets the current item index
     * @param id index/rowId to look in current list
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getItemIndex(id: string): number;
    /**
     * Add item to list
     * @param item list item
     * @param index optional creation index 00 01...
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    addItem(item: RowData, index?: string): void;
    /**
     * Remove item from list
     * @param id index/rowId in current list
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    removeItem(id: string): boolean | undefined;
    /**
     * reset values (item into fields)
     * @param old true to reset old values
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    resetValues(old?: boolean): void;
    /**
     * Get values (fields into item)
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getValues(): RowData;
    /**
     * Get old values
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getOldValues(): RowData;
    /**
     * Gets row Id field name from meta data (is undefined as long as meta data are not loaded using {@code getMetaData()}).
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getRowIdFieldName(): string;
    /**
     * Gets row Id field from meta data (returns undefined if row Id field name is undefined).
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getRowIdField(): ObjectField | undefined;
    /**
     * Gets value from list for specified code (returns undefined if code is not in list).
     * @param list List metadata (typically from a field metadata)
     * @param code Code
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getListValue(list: EnumItem[], code: string): string | undefined;
    /**
     * Store parent object in panel instance {@code { name, inst, field, rowId, object }}
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    setParent(parent: ParentObject): void;
    /**
     * Get parent object
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getParent(): ParentObject | undefined;
    /**
     * Get parent business object of panel instance
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getParentObject(): BusinessObject | null | undefined;
    /**
     * Get foreign key of panel instance
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getParentObjectRefField(): string | null;
    /**
     * Is new record?
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    isNew(): boolean;
    /**
     * Is copied record?
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    isCopied(): string | false | undefined;
    /**
     * Get display label
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getDisplay(): string | undefined;
    /**
     * Is child of?
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    isChildOf(parent: string, ref?: string): boolean | undefined;
    /**
     * Is panel of?
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    isPanelOf(parent: string, ref?: string): boolean | undefined;
    /**
     * Is referenced from?
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    isReferencedFrom(parent: string, ref?: string): boolean | undefined;
    /**
     * Is data-mapped from?
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    isDataMappedFrom(parent: string): boolean | undefined;
    /**
     * Get status field
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getStatusField(): ObjectField | undefined;
    /**
     * Get action definition
     * @param name Action name
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getAction(name: string): Action | undefined;
    /**
     * Get transition definition
     * @param name Transition name
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getTransition(name: string): Transition | undefined;
    /**
     * Get area definition
     * @param n Area position
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getArea(n: number): Area | undefined;
    /**
     * Remove area in metadata if position exists
     * @param n Area position
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    removeArea(n: number): void;
    /**
     * Get field area definition
     * @param n Area name or position
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getFieldArea(n: number | string): Area | undefined;
    /**
     * Get crosstab definition
     * @param name Crosstab name
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getCrosstab(name: string): CrosstabMetadata | undefined;
    /**
     * Alias for getCrosstab
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getPivotTable: (name: string) => CrosstabMetadata | undefined;
    /**
     * Set crosstab definition
     * @param name Crosstab name
     * @param meta Crosstab metadata
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    setCrosstab(name: string, meta: CrosstabMetadata): void;
    /**
     * Alias for setCrosstab
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    setPivotTable: (name: string, meta: CrosstabMetadata) => void;
    /**
     * Get placemap definition
     * @param name Placemap name
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getPlacemap(name: string): Placemap | undefined;
    /**
     * Get agenda definition
     * @param name Agenda name
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getAgenda(name: string): Agenda | undefined;
    /**
     * Get print definition
     * @param name Print template name
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getPrintTemplate(name: string): PrintTemplate | undefined;
    /**
     * Gets list of values field value from code (returns code if not found or not a list of value field)
     * @param field Field
     * @param code Field code
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getValueForCode(field: ObjectField, code: string): string;
    /**
     * Gets current item row Id value (returns undefined if not current item is loaded).
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getRowId(): string;
    /**
     * Sets current item row Id value.
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    setRowId(rowId: string): void;
    /**
     * Checks whether a field is the row ID field.
     * @param f Field meta data
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    isRowIdField(f: ObjectField): boolean;
    /**
     * Checks whether a field is a timestamp field.
     * @param f Field meta data
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    isTimestampField(f: ObjectField): boolean;
    /**
     * Is object filtered ?
     * @param exclude Optional filters to ignore {@code { fieldname: value }}
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    isFiltered(exclude?: KeyObject): boolean;
    /**
     * Reset filters (not orders and groups)
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    resetFilters(): void;
    /**
     * Is object ordered ?
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    isOrdered(): boolean;
    /**
     * Reset orders (not filters)
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    resetOrders(): void;
    /**
     * Reset group by fields
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    resetGroupByFields(): void;
    /**
     * Loads meta data for specified context.
     * Sample promise usage:
     * {@code obj.getMetaData({ context: app.CONTEXT_UPDATE }).then(meta => {
     *   alert("Meta data loaded for update of object " + obj.getName());
     * }); }
     * @param {Object} params Optional parameters
     * @param {number} params.context Context (one of {@code Simplicite.Ajax.CONTEXT_*} constants)
     * @param {string} params.contextParam Context single parameter (agenda name...)
     * @param {Object} params.parent Parent of PANELLIST {@code { name, inst, field, rowId }}
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getMetaData(params?: {
        context?: number;
        contextParam?: string;
        parent?: ParentObject;
    }): Promise<unknown>;
    /**
     * Get crosstab cubes (data)
     * @param {string} name Crosstab name
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getCrosstabCubes(name: string): Promise<unknown>;
    /**
     * Alias for getCrosstabCubes
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getPivotTableData: (name: string) => Promise<unknown>;
    /**
     * Gets a linked list of an enum field
     * @param {string} field Enum field name
     * @param {string} value Selected value(s) separated with ";"
     * @param {string} target Linked field
     * @param {string} lov Current linked list name
     * @param {Object} params Options
     * @param {boolean} params.all Get all linked values when value is empty
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getLinkedList(field: string, value: string, target: string, lov: string, params?: {
        all?: boolean;
    }): Promise<KeyObject>;
    /**
     * Set a new list to field
     * @param {string} field Enum field name
     * @param {string} list List name to load
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    setList(field: string | ObjectField, list: string): Promise<KeyObject>;
    /**
     * Select row(s)
     * @param {string} sel selected = `all`, `page`, `none` or specific row IDs (single or array or semicolon-separated)
     * @param {Object} params {@code { replace: boolean }}
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    selectRow(sel: ListSelection, params?: {
        replace?: boolean;
    }): Promise<string[]>;
    /**
     * Invoke method (unsupported on client side)
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    invokeMethod(): boolean;
    /**
     * Selects and loads an item for designated row ID (if row ID is {@code Simplicite.Ajax.DEFAULT_ROW_ID},
     * a default item for creation is returned with all default values applied).
     * @param {string} rowId Row ID, mandatory (use current item ID if unset)
     * @param {GetParam} params Optional parameters
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    get(rowId: string, params?: GetParam): Promise<KeyObject>;
    /**
     * Same as get function
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    select: (rowId: string, params?: GetParam) => Promise<KeyObject>;
    /**
     * Loads default item for creation (equivalent to a get done on default row ID with the create init context {@code Simplicite.Ajax.CONTEXT_CREATE}).
     * @param {Object} params Optional parameters (same as for get function)
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getForCreate(params: GetParam): Promise<KeyObject>;
    /**
     * Same as getForCreate function
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    selectForCreate: (params: GetParam) => Promise<KeyObject>;
    /**
     * Loads item for designated row ID for update (equivalent to a get done with the update init context {@code Simplicite.Ajax.CONTEXT_UPDATE}).
     * @param {string} rowId Row ID, mandatory
     * @param {Object} params Optional parameters (same as for get function)
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getForUpdate(rowId: string, params?: GetParam): Promise<KeyObject>;
    /**
     * Same as getForUpdate function
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    selectForUpdate: (rowId: string, params?: GetParam) => Promise<KeyObject>;
    /**
     * Loads item for designated row ID for copy (equivalent to a get done with the copy init context {@code Simplicite.Ajax.CONTEXT_COPY}).
     * @param {string} rowId Row ID, mandatory
     * @param {Object} params Optional parameters (same as for get function)
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getForCopy(rowId: string, params: GetParam): Promise<KeyObject>;
    /**
     * Same as getForCopy function
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    selectForCopy: (rowId: string, params: GetParam) => Promise<KeyObject>;
    /**
     * Loads item for designated row ID for delete (equivalent to a get done with the delete init context {@code Simplicite.Ajax.CONTEXT_DELETE}).
     * @param {string} rowId Row ID, mandatory
     * @param {Object} params Optional parameters (same as for get function)
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getForDelete(rowId: string, params: GetParam): Promise<KeyObject>;
    /**
     * Same as getForDelete function
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    selectForDelete: (rowId: string, params: GetParam) => Promise<KeyObject>;
    /**
     * Populate item (e.g. after getForCreate and after having set foreign keys)
     * @param {Object} item Item to be populated, optional (if absent current item is used)
     * @param {GetParam} params Optional parameters
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    populate(item?: KeyObject, params?: GetParam): Promise<KeyObject>;
    /**
     * Reorder rows from reorderable list
     * @param {string} field reorderable field name
     * @param {string} service move or bulk
     * @param {Object} params service parameters
     * @param {string} params.type renum type (S or R, for bulk service)
     * @param {number} params.incr increment (bulk service)
     * @param {Array}  params.ids list of row Ids to reorder (move service)
     * @param {string} params.targetId target row Id (move service)
     * @param {boolean} params.before true to insert before the target (move service)
     * @returns Promise
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    reorder(field: string, service: string, params?: {
        type?: string;
        incr?: number;
        ids?: string[];
        targetId?: string;
        before?: boolean;
    }): Promise<unknown>;
    /**
     * Loads current filters
     * @param {Object} params Optional parameters
     * @param {number} params.context Init context (normally {@code Simplicite.Ajax.CONTEXT_SEARCH} constant), optional
     * @param {boolean} params.reset Reset filters, optional
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getFilters(params?: {
        context?: number;
        reset?: boolean;
    }): Promise<KeyObject>;
    /**
     * Loads current filters for search (equivalent to a getFilters done with the search init context {@code Simplicite.Ajax.CONTEXT_SEARCH}).
     * @param params Optional parameters
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getFiltersForSearch(params?: {
        context?: number;
        reset?: boolean;
    }): Promise<KeyObject>;
    /**
     * Apply user's filters to {@code this.filters}
     * @param {Object} filters Set of filters (ex from a view item), as a map of field name to value. Special keys:
     * `fromDate` (optional date min YYYY-MM-DD applied on the object period or the first date field, excluding timestamp),
     * `toDate` (optional date max YYYY-MM-DD applied on the object period or the first date field, excluding timestamp),
     * or any field name to filter (may not exist in object).
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    applyFilters(filters: KeyObject): void;
    /** Search overload to list data and metadata */
    search(filters: KeyObject | null, params: SearchAjaxMetadata): Promise<RowDataMeta[]>;
    /** Search overload to list group-by items */
    search(filters: KeyObject | null, params: SearchAjaxGroupBy): Promise<RowGroupBy[]>;
    /** Search overload for partial list of group-by item */
    search(filters: KeyObject | null, params: SearchAjaxPartial): Promise<RowPartial>;
    /** Search overload to get a reflexive tree */
    search(filters: KeyObject | null, params: SearchAjaxTree): Promise<RowTree>;
    /** Search to list simple records */
    search(filters?: KeyObject | null, params?: SearchAjaxList): Promise<KeyObject[]>;
    /**
     * Search and loads search result items for list (equivalent to a search done with the list init context {@code Simplicite.Ajax.CONTEXT_LIST})
     * @param {Object} filters Filters to be applied, optional (if absent, current filters are used)
     * @param {Object} params Optional parameters
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    searchForList(filters?: KeyObject, params?: SearchAjax): Promise<KeyObject[]>;
    /**
     * Search and loads search result items for panel list (equivalent to a search done with the list init context {@code Simplicite.Ajax.CONTEXT_PANELLIST})
     * @param {KeyObject} filters Filters to be applied, optional (if absent, current filters are used)
     * @param {SearchAjax} params Optional parameters
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    searchForPanelList(filters?: KeyObject, params?: SearchAjax): Promise<KeyObject[]>;
    /**
     * Gets item in the current list
     * @param i index
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getListItem(i: number): KeyObject | undefined;
    /**
     * Gets the position in current list, -1 if not found
     * @param rowId row Id to find
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getListPos(rowId: string): number;
    /**
     * Count rows with filters and set count and maxpage in object
     * @param {Object} filters Filters to be applied, optional (if absent, current filters are used)
     * @param {Object} params Optional parameters <code>\{ context, parent, view, operations, metadata \}</code>
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getCount(filters?: KeyObject, params?: {
        context?: number;
        parent?: ParentObject;
        view?: {
            name: string;
            item: number;
            home?: boolean;
        };
        operations?: boolean;
        metadata?: boolean;
    }): Promise<KeyObject>;
    /**
     * Search from index and loads search result items
     * @param {string} request Index search request string
     * @param {Object} params Optional parameters
     * @param {boolean|string|Array} params.inlineDocs Inline documents ({@code true} | {@code 'images'} only | {@code 'infos'} without content | array of fields) ?
     * @param {boolean|Array} params.inlineThumbs Inline image documents thumbnails ({@code true | array of fields}) ?
     * @param {boolean} params.inlineObjs Inline objects fields items ({@code true|false}) ?
     * @param {number} params.context optional context
     * @param {Object} params.parent optional parent {@code \{ name, inst, field, rowId \}} to search references
     * @param {Object} params.filters optional linkmap filters to limit search
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    indexsearch(request?: string, params?: {
        context?: number;
        parent?: ParentObject;
        filters?: KeyObject;
    } & InlineParam): Promise<RowDataMeta[]>;
    /**
     * Saves (create or update) and loads an item
     * @param {object} item Item to be saved, optional (if absent current item is used)
     * @param {object} params Optional parameters (see create or update method)
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    save(item?: KeyObject, params?: KeyObject): Promise<KeyObject>;
    /**
     * Creates and loads an item
     * @param {Object} item Item to be created (row ID field of the item must be set to {@code Simplicite.Ajax.DEFAULT_ROW_ID}), optional (if absent current item is used)
     * @param {Object} params Optional parameters
     * @param {boolean|string|Array} params.inlineDocs Inline documents ({@code true} | {@code 'images'} only | {@code 'infos'} without content | array of fields) ?
     * @param {boolean|Array} params.inlineThumbs Inline image documents thumbnails ({@code true} | array of fields) ?
     * @param {boolean} params.inlineObjs Inline objects fields items ({@code true|false}) ?
     * @param {boolean} params.metadata true to update the metadata in context UPDATE when created
     * @param {boolean} params.target true to set target object in metadata if any
     * @param {Object} params.parent optional parent object
     * @param {boolean} params.list true if called from a list
     * @param {function} params.progress Optional progress callback
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    create(item?: KeyObject, params?: {
        metadata?: boolean;
        target?: boolean;
        parent?: ParentObject;
        list?: boolean;
        progress?: ProgressHandler;
    } & InlineParam): Promise<KeyObject>;
    /**
     * Updates and loads an item
     * @param {Object} item Item to be updated, optional (if absent current item is used)
     * @param {Object} params Optional parameters
     * @param {boolean|string|Array} params.inlineDocs Inline documents ({@code true} | {@code 'images'} only | {@code 'infos'} without content | array of fields) ?
     * @param {boolean|Array} params.inlineThumbs Inline image documents thumbnails ({@code true} | array of fields) ?
     * @param {boolean} params.inlineObjs Inline objects fields items ({@code true|false}) ?
     * @param {boolean} params.metadata true to update the metadata
     * @param {boolean} params.target true to set target object in metadata if any
     * @param {boolean} params.list true if called from a list
     * @param {string}  params.edit optional to specify the editable field name
     * @param {boolean} params.timestamp false to bypass timestamp check and update (silent update)
     * @param {boolean} params.social get social posts
     * @param {boolean} params.share get sharing data
     * @param {string}  params.transition optional transition name
     * @param {Object}  params.itemAction optional action parameters of transition
     * @param {function} params.progress Optional progress callback
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    update(item?: KeyObject, params?: {
        metadata?: boolean;
        target?: boolean;
        parent?: ParentObject;
        list?: boolean;
        edit?: string;
        timestamp?: boolean;
        transition?: string;
        itemAction?: KeyObject;
        social?: boolean;
        share?: boolean;
        progress?: ProgressHandler;
    } & InlineParam): Promise<KeyObject>;
    /**
     * Deletes item. Current item is set to undefined
     * @param {Object|string} item optional item to be deleted or rowId (if absent current item is used)
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    del(item?: string | KeyObject, params?: {
        metadata?: boolean;
    }): Promise<KeyObject>;
    /**
     * Same as del function
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    remove: (item?: string | KeyObject, params?: {
        metadata?: boolean;
    }) => Promise<KeyObject>;
    /**
     * Updates all (selected) items
     * @param {Object} item Item with fields to be updated for each selected Ids
     * @param {Object} params Optional parameters
     * @param {string}   params.transition optional transition name
     * @param {function} params.progress Optional progress callback
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    updateAll(item: KeyObject, params?: {
        transition?: string;
        progress?: ProgressHandler;
    }): Promise<KeyObject>;
    /**
     * Deletes all selected items
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    deleteAll(): Promise<KeyObject>;
    /**
     * Service to merge items
     * @param {MergeSaveParam} data merge data
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    merge(data: MergeSaveParam): Promise<KeyObject>;
    /**
     * Timesheet service
     * @param {Object} data timesheet data {@code { action, name, resId, start, end }}
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    timesheet(data: TimesheetData): Promise<KeyObject>;
    /**
     * Preferences service
     * @param {Object} prefs optional preferences to save {@code { list, search, actions }}
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    preferences(prefs?: {
        list?: object;
        search?: object;
        actions?: object;
    }): Promise<KeyObject>;
    /**
     * Gets the long help
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    help(): Promise<KeyObject>;
    /**
     * Loads cross table data for search filters
     * @param {string} ctb Cross table name
     * @param {Object} filters Filters to be applied, optional (if absent, current filters are used)
     * @param {Object} params Optional parameters
     * @param {boolean} params.ztree get lines tree with sums and metadata
     * @param {boolean} params.zstotal get sub-totals ?
     * @param {string} params.zstcolor sub-totals color
     * @param {Object} params.zaxis change axis ordering {@code [{name, order, type, method}]}
     * @param {string} params.zgraph optional graph (or multiple zgraph_name)
     * @param {string} params.zwidth optional graph width
     * @param {string} params.zheight optional graph height
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    crosstab(ctb: string, filters?: KeyObject, params?: CrosstabParam): Promise<CrosstabData>;
    /**
     * Calls an object action and loads action result.
     * @param {string} act Action name
     * @param {Object} params Optional parameters
     * @param {Object}  params.values pairs of field/value
     * @param {boolean} params.metadata true to update the metadata in context UPDATE on form action or LIST on list action
     * @param {boolean} params.init true to initAction only on server side and get Action fields metadata in callback
     * @param {string}  params.transition optional transition name to init its action
     * @param {string}  params.track async tracking of action status|stop|minify
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    action(act: string, params?: {
        values?: KeyObject;
        metadata?: boolean;
        init?: boolean;
        transition?: string;
        track?: string;
    }): Promise<KeyObject | string>;
    /**
     * Calls an object publication and loads publication result
     * @param {string} prt Print template name
     * @param {object} params Optional parameters
     * @param {boolean} params.all Apply template to all items matching current filters (false by default, which means apply template only to current item) ?
     * @param {boolean} params.mailing Apply template individually to all items matching current filter (false by default) ?
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    print(prt: string, params?: {
        all?: boolean;
        mailing?: boolean;
    }): Promise<unknown>;
    /**
     * Calls an object place map and loads places data
     * @param {string} pcm Place map name
     * @param {Object} filters Optional filters to apply (if absent, current filters are used)
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    placemap(pcm: string, filters?: KeyObject): Promise<Placemap>;
    /**
     * Sets (or remove) an object parameter and loads it back
     * @param {string} name Parameter name
     * @param {string} value Parameter value (unset if null)
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    setParameter(name: string, value?: string | null): Promise<unknown>;
    /**
     * Remove an object parameter
     * @param {string} name Parameter name
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    removeParameter(name: string): Promise<unknown>;
    /**
     * Loads an object parameter
     * @param {string} name Parameter name
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    getParameter(name: string): Promise<unknown>;
    /**
     * Local parameter in object instance
     * @param name Parameter key name
     * @param value Optional value (to get or set, null to delete)
     * @returns local value
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    localParameter(name: string, value?: any | null): any;
    /**
     * Remove a local parameter in object instance
     * @param name Parameter key name
     * @returns local value
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    removeLocalParameter(name: string): any;
    /**
     * Initialize the local parameters {@code this.locals.hasChanged} and {@code this.locals.hasChangedFields}
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    initChangedFields(): void;
    /**
     * Add a field when has changed
     * @param f field or name
     * @param id optional id (edit list)
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    addChangedField(f: string | ObjectField, id?: string): void;
    /**
     * Remove a field when has not changed
     * @param f field or name
     * @param id optional id (edit list)
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    removeChangedField(f: string | ObjectField, id?: string): void;
    /**
     * Trigger the has changed flag
     * @param v optional to set the hasChanged value (true when the array of {@code this.locals.hasChangedFields} is not empty)
     * @returns the local parameter {@code this.locals.hasChanged}
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    hasChanged(v?: boolean | string[]): any;
    /**
     * Calls an object completion for specified field and loads action result.
     * @param {string} field Field name
     * @param {string} req Completion request
     * @param {Object} params Optional parameters
     * @param {number} params.max Optional max size, default 15
     * @param {number} params.context Optional context {@code CONTEXT_SEARCH} or {@code CONTEXT_UPDATE}
     * @param {Object} params.values Optional current fields values
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    completion(field: string, req: string, params?: {
        max?: number;
        context?: number;
        values?: KeyObject;
    }): Promise<KeyObject[]>;
    /**
     * Predefined search service (of user's private searches, public searches are protected)
     * @param {string} method {@code "create" | "update" | "delete" | "select"}
     * @param {Object} ps Predefined search to save {@code { id, name, filters }}
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    predefSearch(method: string, ps: PredefSearch): Promise<PredefSearch>;
    /**
     * Associate service
     * @param {Object} def Associate definition
     * @param {string} def.parent Parent object name
     * @param {string} def.parentRefField Foreign key field to parent
     * @param {string} def.child Optional child object name (when obj is a N,N relationship)
     * @param {string} def.childRefField Foreign key field to child
     * @param {string} parentId parent object Id
     * @param {Array}  ids selected Ids to associate to parent
     * @param {Object} item optional item for N,N data
     * @memberof Simplicite.Ajax.BusinessObject
     * @function
     */
    associate(def: {
        parent: string;
        parentRefField: string;
        child?: string;
        childRefField?: string;
    }, parentId: string, ids: string[], item?: KeyObject): Promise<KeyObject>;
}

type IndexMetadata = {
    withDocs: ObjectMetadata[];
};
/**
 * Index search rendering
 * @class
 */
declare class IndexSearch {
    /** current tab */
    private tab;
    /** user request */
    private req;
    /** selected domain */
    private domain;
    private domainFilter?;
    /** selected objects with docs */
    private docs;
    /** index search result */
    readonly searchResult: JQuery<HTMLElement>;
    /** domain search result */
    readonly domResult: JQuery<HTMLElement>;
    /** doc search result */
    readonly docResult: JQuery<HTMLElement>;
    /** session history */
    readonly histResult: JQuery<HTMLElement>;
    button?: JQuery;
    /** Hide the current searches */
    private save;
    /** Init the current searches */
    private init;
    /**
     * Index search form
     * @param {jQuery} ctn container
     * @param {Object} md search metadata
     * @param {Object[]} md.withDocs List of business objects with documents
     * @param {IndexParam} p optional parameters
     * @function
     */
    form(ctn: Container, md?: IndexMetadata, p?: IndexParam): void;
    /**
     * Search result rendering in a grid
     * @param {jQuery} ctn container
     * @param {string} req user request
     * @param {Object[]} result search result
     * @param {Object} p optional parameters
     * @param {string} p.msg TEXT code or message
     * @param {string} p.layout grid layout (masonry, float, inline, article)
     * @function
     */
    result(ctn: Container, req: string, result: KeyObject, p: {
        msg?: string;
        layout?: string;
    }, cbk?: Callback): void;
    /**
     * Filter dialog to pick some objects from user's menu
     * @param {Array} list list of selected objects (all if empty)
     * @param {boolean} indexable true to list indexable objects only
     * @param {function} cbk callback(list) with selected objects
     * @function
     */
    filterDialog(list: string[], indexable: boolean, cbk?: (list?: string[]) => void): void;
    /**
     * Init index search widget
     * @param {jQuery} ctn div.searchbox container
     * @function
     */
    searchBox(ctn: JQuery): void;
    private handleSearchInput;
    /**
     * Handle arrow key navigation in search results
     * @param {JQuery.Event} e The jQuery keyboard event
     * @param {jQuery} $items The result items collection
     * @param {number} currentIndex Optional current item index (for result items navigation)
     * @param {number} cursorPos Optional cursor position in input (for input field navigation)
     * @param {number} textLength Optional text length in input (for input field navigation)
     */
    private handleArrowsNavigation;
}

type SessionGlobals = {
    APPLICATION: string;
    ENCODING: string;
    VERSION: string;
    MINOR_VERSION: string;
    FULL_VERSION: string;
    MAINTENANCE: string;
    MAINTENANCE_END_DATE: string;
    WEBSOCKET_SERVER: string;
    ROOT: string;
    UI_PATH: string;
    UI_ROOT: string;
    API_PATH: string;
    API_ROOT: string;
    ENDPOINT?: string;
    OPENSTREETMAP_GEOCODING_URL?: string;
    URL: string;
    USERID: string;
    AJAX_KEY: string;
    LOGIN: string;
    LANG: string;
    DATE_FORMAT: string;
    DISPOSITION: string;
    HOME_THEME?: string;
};
/**
 * Generic progess handler for XHR call
 * @type Handler
 */
type ProgressHandler = (this: XMLHttpRequestUpload, ev: ProgressEvent<XMLHttpRequestEventTarget>) => void;
type MessageJSON = {
    level?: string;
    label?: string;
    error?: boolean;
    code?: string;
    text?: string;
    field?: string;
    redirect?: string;
    javascript?: string;
    params?: {
        suggest?: string;
    };
    actions?: Action[];
};
/**
 * Plain text message
 * - "message"
 * - "code:text#level#field..."
 * - "javascript: ..."
 * - "redirect: ..."
 */
type MessageText = string;
/** Plain text message "code:text#level#field..." or JSON */
type MessageAny = MessageText | MessageJSON;
/** Messages per rowId on list */
type MessagesPerRow = {
    [rowId: string]: MessageAny[];
};
/** Save list returns per rowId */
type MessageSaveRows = {
    messages?: MessagesPerRow;
    errors?: MessagesPerRow;
};
/** Back-end message(s) */
type MessageFromBack = {
    level?: number | string;
    message?: MessageAny;
    messages?: MessageAny[];
    description?: string;
    details?: string | object;
    status?: number;
};
/** Generic response from server */
type CallResponse = {
    type: string;
    response: any;
    error?: boolean;
};
/** JSON for module service */
type ModuleAjax = {
    row_id?: string;
    del?: string;
    confirm?: boolean;
    application?: string;
    method?: string;
    format?: string;
    exploded?: boolean;
};
/**
 * Simplicit&eacute; application.
 * @example
 * // Using within the generic UI
 * const app = $app;
 * // Using user thru the UI gateway (e.g. within a custom disposition)
 * const app = new Simplicite.Ajax("" or "/myapp" if deployed non root or an absolute base URL);
 * // Using public user thru the public UI gateway (e.g. from a public web site)
 * const app = new Simplicite.Ajax("" or "/myapp" if deployed non root or an absolute base URL, "uipublic");
 * // Using website user thru the API gateway (e.g. form a custom frontend)
 * const app = new Simplicite.Ajax("" or "/myapp" if deployed non root or an absolute base URL, "api", "myuser", "mypassword");
 * @class
 */
declare class Session {
    static Grant: typeof Grant;
    static BusinessObject: typeof BusinessObject;
    static BusinessProcess: typeof BusinessProcess;
    static ExternalObject: typeof ExternalObject;
    static ObjectField: typeof ObjectField;
    static TreeView: typeof TreeView;
    static View: typeof View;
    static SyncQueue: typeof SyncQueue;
    _errorActive: boolean;
    _warningActive: boolean;
    _infoActive: boolean;
    _debugActive: boolean;
    _approot: string;
    _baseURL: string;
    _gateway: string;
    _loginURL?: string;
    _logoutURL?: string;
    _appURL?: string;
    _objURL?: string;
    _pcsURL?: string;
    _extURL?: string;
    _ioURL?: string;
    _documentURL?: string;
    _contentURL?: string;
    _resourceURL?: string;
    _login?: string;
    _password?: string;
    _timeout: number;
    _expired: boolean;
    _clientTabId?: string;
    _businessObjectsCache: KeyObject;
    _businessProcessCache: KeyObject;
    sessionId?: string;
    authToken?: string;
    authTokenExpiryDate?: Date;
    authTokenExpiryIn?: string;
    appinfo: KeyObject;
    version?: string;
    revision?: string;
    ajaxkey?: string;
    grant?: Grant;
    sysparams: KeyObject;
    texts?: KeyString;
    menu?: MainMenu;
    news: KeyObject[];
    indexMetadata?: IndexMetadata;
    views: {
        [key: string]: View;
    };
    /**
     * UI gateway
     * @constant {string}
     */
    readonly GATEWAY_UI: string;
    /**
     * Public UI gateway
     * @constant {string}
     */
    readonly GATEWAY_UI_PUBLIC: string;
    /**
     * API gateway
     * @constant {string}
     */
    readonly GATEWAY_API: string;
    /** @ignore */
    readonly DEFAULT_INSTANCE_PREFIX = "the_ajax_";
    /**
     * Default row ID value (for creation).
     * @constant {string}
     */
    readonly DEFAULT_ROW_ID = "0";
    /**
     * No context.
     * @constant {number}
     */
    readonly CONTEXT_NONE = 0;
    /**
     * Search context.
     * @constant {number}
     */
    readonly CONTEXT_SEARCH = 1;
    /**
     * List context.
     * @constant {number}
     */
    readonly CONTEXT_LIST = 2;
    /**
     * Creation context.
     * @constant {number}
     */
    readonly CONTEXT_CREATE = 3;
    /**
     * Copy context.
     * @constant {number}
     */
    readonly CONTEXT_COPY = 4;
    /**
     * Update context.
     * @constant {number}
     */
    readonly CONTEXT_UPDATE = 5;
    /**
     * Delete context.
     * @constant {number}
     */
    readonly CONTEXT_DELETE = 6;
    /**
     * Cross table context.
     * @constant {number}
     */
    readonly CONTEXT_CROSSTAB = 8;
    /**
     * Publication template context.
     * @constant {number}
     */
    readonly CONTEXT_PRINTTMPL = 9;
    /**
     * Bulk update context.
     * @constant {number}
     */
    readonly CONTEXT_UPDATEALL = 10;
    /**
     * Reference selection context.
     * @constant {number}
     */
    readonly CONTEXT_REFSELECT = 11;
    /**
     * Data mapping selection context.
     * @constant {number}
     */
    readonly CONTEXT_DATAMAPSELECT = 12;
    /**
     * Pre-validate context.
     * @constant {number}
     */
    readonly CONTEXT_PREVALIDATE = 13;
    /**
     * Post validate context.
     * @constant {number}
     */
    readonly CONTEXT_POSTVALIDATE = 14;
    /**
     * State transition context.
     * @constant {number}
     */
    readonly CONTEXT_STATETRANSITION = 15;
    /**
     * Export context.
     * @constant {number}
     */
    readonly CONTEXT_EXPORT = 16;
    /**
     * Import context.
     * @constant {number}
     */
    readonly CONTEXT_IMPORT = 17;
    /**
     * Association context.
     * @constant {number}
     */
    readonly CONTEXT_ASSOCIATE = 18;
    /**
     * Panel list context.
     * @constant {number}
     */
    readonly CONTEXT_PANELLIST = 19;
    /**
     * Action context.
     * @constant {number}
     */
    readonly CONTEXT_ACTION = 20;
    /**
     * Agenda context.
     * @constant {number}
     */
    readonly CONTEXT_AGENDA = 21;
    /**
     * Place map context.
     * @constant {number}
     */
    readonly CONTEXT_PLACEMAP = 22;
    /**
     * Widget context.
     * @constant {number}
     */
    readonly CONTEXT_WIDGET = 23;
    /**
     * Internal ID (foreign key) type.
     * @constant {number}
     */
    readonly TYPE_ID = 0;
    /**
     * Integer type.
     * @constant {number}
     */
    readonly TYPE_INT = 1;
    /**
     * Float type.
     * @constant {number}
     */
    readonly TYPE_FLOAT = 2;
    /**
     * String type.
     * @constant {number}
     */
    readonly TYPE_STRING = 3;
    /**
     * Date type.
     * @constant {number}
     */
    readonly TYPE_DATE = 4;
    /**
     * Date and time type.
     * @constant {number}
     */
    readonly TYPE_DATETIME = 5;
    /**
     * Time type.
     * @constant {number}
     */
    readonly TYPE_TIME = 6;
    /**
     * Single enumerated (list of values) type.
     * @constant {number}
     */
    readonly TYPE_ENUM = 7;
    /**
     * Boolean type.
     * @constant {number}
     */
    readonly TYPE_BOOLEAN = 8;
    /**
     * Password type.
     * @constant {number}
     */
    readonly TYPE_PASSWORD = 9;
    /**
     * URL type.
     * @constant {number}
     */
    readonly TYPE_URL = 10;
    /**
     * HTML content type.
     * @constant {number}
     */
    readonly TYPE_HTML = 11;
    /**
     * Email type.
     * @constant {number}
     */
    readonly TYPE_EMAIL = 12;
    /**
     * Long string (unlimited) type.
     * @constant {number}
     */
    readonly TYPE_LONG_STRING = 13;
    /**
     * Multiple enumerated (list of values) type.
     * @constant {number}
     */
    readonly TYPE_ENUM_MULTI = 14;
    /**
     * Regular expression type.
     * @constant {number}
     */
    readonly TYPE_REGEXP = 15;
    /**
     * Document type
     * @constant {number}
     */
    readonly TYPE_DOC = 17;
    /**
     * External file reference type.
     * @constant {number}
     */
    readonly TYPE_EXTFILE = 19;
    /**
     * Image type.
     * @constant {number}
     */
    readonly TYPE_IMAGE = 20;
    /**
     * Notepad (incremental long text) type.
     * @constant {number}
     */
    readonly TYPE_NOTEPAD = 21;
    /**
     * Phone number type.
     * @constant {number}
     */
    readonly TYPE_PHONENUM = 22;
    /**
     * Color type.
     * @constant {number}
     */
    readonly TYPE_COLOR = 23;
    /**
     * Object type.
     * @constant {number}
     */
    readonly TYPE_OBJECT = 24;
    /**
     * Geo coordinates type.
     * @constant {number}
     */
    readonly TYPE_GEOCOORDS = 25;
    /**
     * Big decimal type.
     * @constant {number}
     */
    readonly TYPE_BIGDECIMAL = 26;
    /**
     * Types labels (indexed by TYPE_* constants)
     * @constant {Array}
     */
    readonly TYPES: string[];
    /**
     * Not visible.
     * @constant {number}
     */
    readonly VIS_HIDDEN = 0;
    /**
     * Not visible (alias to VIS_HIDDEN).
     * @constant {number}
     */
    readonly VIS_NOT = 0;
    /**
     * Visible in lists.
     * @constant {number}
     */
    readonly VIS_LIST = 1;
    /**
     * Visible in forms.
     * @constant {number}
     */
    readonly VIS_FORM = 2;
    /**
     * Visible in lists and forms.
     * @constant {number}
     */
    readonly VIS_BOTH = 3;
    /**
     * Forbidden on UI
     * @constant {number}
     */
    readonly VIS_FORBIDDEN = 4;
    /**
     * Not updatable.
     * @constant {number}
     */
    readonly UPD_READ_ONLY = 0;
    /**
     * Updatable in lists and forms.
     * @constant {number}
     */
    readonly UPD_ALWAYS = 1;
    /**
     * Updatable in forms only.
     * @constant {number}
     */
    readonly UPD_FORM_ONLY = 2;
    /**
     * Updatable in lists only.
     * @constant {number}
     */
    readonly UPD_LIST_ONLY = 3;
    /**
     * Not searchable.
     * @constant {number}
     */
    readonly SEARCH_NONE = 0;
    /**
     * Searchable.
     * @constant {number}
     */
    readonly SEARCH_MONO = 1;
    /**
     * Searchable using check boxes.
     * @constant {number}
     */
    readonly SEARCH_MULTI_CHECK = 2;
    /**
     * Searchable using list box.
     * @constant {number}
     */
    readonly SEARCH_MULTI_LIST = 3;
    /**
     * Searchable using period.
     * @constant {number}
     */
    readonly SEARCH_PERIOD = 4;
    /**
     * Default rendering.
     * @constant {string}
     */
    readonly RENDERING_DEFAULT = "";
    /**
     * Select box rendering (single or multiple select).
     * @constant {string}
     */
    readonly RENDERING_SELECTBOX = "SB";
    /**
     * Rendering horizontal checkbox(es).
     * @constant {string}
     */
    readonly RENDERING_HORIZCHECKBOX = "HCB";
    /**
     * Rendering vertical checkbox(es).
     * @constant {string}
     */
    readonly RENDERING_VERTCHECKBOX = "VCB";
    /**
     * Rendering horizontal radio button(s).
     * @constant {string}
     */
    readonly RENDERING_HORIZRADIOBUTTON = "HRB";
    /**
     * Rendering vertical radio button(s).
     * @constant {string}
     */
    readonly RENDERING_VERTRADIOBUTTON = "VRB";
    /** View item types
     * @constant {Object}
     */
    readonly VIEW_TYPE: {
        LOGIN: string;
        DATE: string;
        TIME: string;
        LOV_CODE: string;
        SEARCH: string;
        FILTERS: string;
        EXTERN: string;
        IMAGE: string;
        GRAPH: string;
        CROSSTAB: string;
        LINK: string;
        PRINTTMPL: string;
        INDEX: string;
        NEWS: string;
        SHORTCUTS: string;
        TREEVIEW: string;
        SUBVIEW: string;
    };
    /**
     * True value
     * @type string
     * @constant {string}
     */
    readonly TRUE: string;
    /**
     * False value
     * @type string
     * @constant {string}
     */
    readonly FALSE: string;
    /**
     * Fatal error value
     * @constant {number}
     */
    readonly ERRLEVEL_FATAL = 1;
    /**
     * Error error value
     * @constant {number}
     */
    readonly ERRLEVEL_ERROR = 2;
    /**
     * Minor error value
     * @constant {number}
     */
    readonly ERRLEVEL_WARNING = 3;
    /**
     * Fatal error value
     * @constant {string}
     */
    readonly LEVEL_FATAL = "F";
    /**
     * Error error value
     * @constant {string}
     */
    readonly LEVEL_ERROR = "E";
    /**
     * Minor error value
     * @constant {string}
     */
    readonly LEVEL_WARNING = "W";
    /** Empty contructor of global $app, will be initialized later */
    constructor();
    /**
     * Initialize Ajax contexts
     * @param approot Application root (either "/&lt;context root&gt;" or an absolute base URL)
     * @param gateway Gateway type to use :
     * <ul>
     * <li>1 or &quot;ui&quot;: Authenticated UI gateway (default)</li>
     * <li>2 or &quot;uipublic&quot; : Public UI gateway</li>
     * <li>4 or &quot;api&quot; : API gateway</li>
     * </ul>
     * @param login User's login (not required for UI gateways)
     * @param password User's password (not required for UI gateways)
     */
    init(approot: string, gateway?: string, login?: string, password?: string): void;
    /**
     * Get type from type label
     * @param name {string} Type label from the <code>TYPES</code> constant)
     * @return {number} Type (one of <code>TYPE_*</code> contants)
     * @memberof Simplicite.Ajax
     * @function
     */
    getType(name: string): number;
    /**
     * Set timeout
     * @param {number} timeout Timeout (seconds)
     * @memberof Simplicite.Ajax
     * @function
     */
    setTimeout(timeout: number): void;
    /**
     * Get timeout
     * @returns {string} Timeout
     * @memberof Simplicite.Ajax
     * @function
     */
    getTimeout(): number;
    /**
     * Is Windows Internet Explorer?
     * @returns True if is Windows Internet Explorer
     * @memberof Simplicite.Ajax
     * @function
     */
    isWinIE(): boolean;
    /**
     * Get Windows Internet Explorer version
     * @returns {number} Version
     * @memberof Simplicite.Ajax
     * @function
     */
    winIEVersion(): number;
    /**
     * Is Firefox?
     * @returns True if is Firefox
     * @memberof Simplicite.Ajax
     * @function
     */
    isFirefox(): boolean;
    /**
     * Is WebKit?
     * @returns True if is WebKit
     * @memberof Simplicite.Ajax
     * @function
     */
    isWebkit(): boolean;
    /**
     * Set gateway and credentials
     * @param {string} gateway Gateway (one of <code>GATEWAY_*</code> constants)
     * @param {string} [login] Login
     * @param {string} [password] Password
     * @memberof Simplicite.Ajax
     * @function
     */
    setGateway(gateway?: number | string, login?: string, password?: string): void;
    /**
     * Get gateway
     * @returns {string} Gateway (one of <code>GATEWAY_*</code> constants)
     * @memberof Simplicite.Ajax
     * @function
     */
    getGateway(): string;
    /**
     * Error handler
     * @param {string|Object} err Error message or error object
     * @param {Error} e Optional catched error
     * @memberof Simplicite.Ajax
     * @function
     */
    error(err: string | MessageFromBack, e?: unknown): void;
    /**
     * Warning handler
     * @param {string} msg Message
     * @param {Error} e Optional catched error
     * @memberof Simplicite.Ajax
     * @function
     */
    warning(msg: string, e?: unknown): void;
    /**
     * Info handler
     * @param {string} msg Message
     * @memberof Simplicite.Ajax
     * @function
     */
    info(msg: string): void;
    /**
     * Debug handler
     * @param {string} msg Message
     * @memberof Simplicite.Ajax
     * @function
     */
    debug(msg: string): void;
    /**
     * Handler when session has expired on server side, by default throws HTTP 401 in console.
     * It can be overridden to return on the logon form in a UI context.
     * @memberof Simplicite.Ajax
     * @function
     */
    onExpiredSession(): void;
    /**
     * JSON message
     * @param {number|string} level
     * @param {string} message
     * @param {string|Object} details
     * @memberof Simplicite.Ajax
     * @function
     */
    getStandardError(level: number | string, message: string, details: string | object): {
        level: string | number;
        message: string;
        details: string | object;
    };
    /**
     * Get the message in error
     * @param {Object} err with message, messages or description
     * @memberof Simplicite.Ajax
     * @function
     */
    getErrorMessage(err: string | MessageFromBack): MessageAny | undefined;
    /**
     * Set default global error handler active or inactive.
     * @param active Active status
     * @memberof Simplicite.Ajax
     * @function
     */
    setErrorHandlerActive(active: boolean): void;
    /**
     * Change default global error handler.
     * @param errorHandler Error handler function
     * @memberof Simplicite.Ajax
     * @function
     */
    setErrorHandler(errorHandler: (m: any, e?: Error) => void): void;
    /**
     * Set default global warning handler active or inactive.
     * @param active Active status
     * @memberof Simplicite.Ajax
     * @function
     */
    setWarningHandlerActive(active: boolean): void;
    /**
     * Change default global warning handler.
     * @param warningHandler Warning handler function
     * @memberof Simplicite.Ajax
     * @function
     */
    setWarningHandler(warningHandler: (m: any, e?: Error) => void): void;
    /**
     * Set default global information handler active or inactive.
     * @param active Active status
     * @memberof Simplicite.Ajax
     * @function
     */
    setInfoHandlerActive(active: boolean): void;
    /**
     * Change default global information handler.
     * @param infoHandler Information handler function
     * @memberof Simplicite.Ajax
     * @function
     */
    setInfoHandler(infoHandler: (m: any) => void): void;
    /**
     * Set default global debug handler active or inactive.
     * @param active Active status
     * @memberof Simplicite.Ajax
     * @function
     */
    setDebugHandlerActive(active: boolean): void;
    /**
     * Change default global debug handler.
     * @param debugHandler Debug handler function
     * @memberof Simplicite.Ajax
     * @function
     */
    setDebugHandler(debugHandler: (m: any) => void): void;
    /**
     * Convert a textual backend message to json { code, text, level, field, label, error }
     * or technical statement { redirect } or { javascript }
     * <ul>
     * <li>code: message code</li>
     * <li>text: optional contextual details</li>
     * <li>level: 'I'nfo, 'W'arning, 'E'rror, 'F'atal</li>
     * <li>field: optional field name of message</li>
     * <li>label: default text to display in user language</li>
     * <li>error: true when level is fatal or error</li>
     * <li>params: optional parameter key/value (suggest)</li>
     * <li>actions: optional call to actions</li>
     * </ul>
     * @param msg formatted backend message JSON or 'code:text#level#field#param:value' or 'redirect:url' or 'javascript:code'
     * @memberof Simplicite.Ajax
     * @function
     */
    messageToJson(msg: MessageAny): MessageJSON;
    /** @ignore */
    _url(url?: string, tokenAsParam?: boolean): string;
    /** @ignore */
    _ajaxkey(key?: string | null): string;
    /**
     * Identify the client tab
     * @param {string} id optional Id to force the value (null to remove)
     * @returns tab unique Id
     * @memberof Simplicite.Ajax
     * @function
     */
    clientTabId(id?: string): string;
    /**
     * Random string
     * @param len Length
     * @return Random string of specified length
     * @memberof Simplicite.Ajax
     * @function
     */
    randomString(len: number): string;
    /**
     * Returns local data URL (e.g. suitable for src of img tags).
     * @param doc Document with mime type and base64 image or thumbnail
     * @param thumb Return document thumbnail?
     * @memberof Simplicite.Ajax
     * @function
     */
    dataURL(doc: {
        mime?: string;
        thumbnail?: string;
        content?: string;
    }, thumb?: boolean): string | undefined;
    documentURL(object: DocumentDB): string;
    documentURL(object: string, field: string, rowId: string, docId?: string, cdisp?: string): string;
    /**
     * Returns image URL.
     * @param {string} object Object name
     * @param {string} field Field name
     * @param {string} rowId Object record row ID
     * @param {string} docId Document ID
     * @param {boolean} thumb Return thumbnail image
     * @memberof Simplicite.Ajax
     * @function
     */
    imageURL(object: string, field: string, rowId: string, docId: string, thumb?: boolean): string;
    /**
     * Returns content URL.
     * @param {string} file Content file name
     * @memberof Simplicite.Ajax
     * @function
     */
    contentURL(file: string): string;
    /**
     * Returns disposition resource URL.
     * @param {string} code Resource code
     * @param {string} type Resource type (IMG=image (default), ICO=Icon, CSS=stylesheet, JS=Javascript, HTML=HTML)
     * @memberof Simplicite.Ajax
     * @function
     */
    dispositionResourceURL(code: string, type: string): string;
    /**
     * Returns resource URL.
     * @param {string} resId Resource ID (e.g. taken from business object or external object resources list in metadata)
     * @memberof Simplicite.Ajax
     * @function
     */
    resourceURL(resId: string): string;
    /**
     * Returns Object resource URL.
     * @param {string} code Resource code
     * @param {string} type Resource type (IMG=image (default), ICO=Icon, CSS=stylesheet, JS=Javascript, HTML=HTML)
     * @param {string} object Object name: ObjectInternal or ObjectExternal (for Disposition use dispositionResourceURL)
     * @param {string} objId Object row ID (not the resource row ID)
     * @memberof Simplicite.Ajax
     * @function
     */
    getResourceURL(code: string, type: string, object?: string, objId?: string, nologs?: boolean): string;
    /**
     * Returns Static resource URL
     * @param path
     * @returns
     */
    getStaticRootResourceURL(path: string): string;
    /**
     * Icon URL
     * @param {string} name Resource icon name
     * @memberof Simplicite.Ajax
     * @function
     */
    getIconURL(name: string): string;
    _deprecated(exception?: string, message?: string, outdated?: boolean): void;
    _deprecCall(arg: unknown): void;
    /**
     * Legacy call parameter URL encoded
     * @ignore
     */
    _callParams(data: KeyObject | null): string;
    /**
     * Call parameter
     * @returns FormData
     * @ignore
     */
    _callFormData(data: KeyObject | null): FormData;
    /** @ignore */
    _callAuth(login: string, password: string): string;
    /** @ignore */
    _credentials(xhr: XMLHttpRequest): void;
    /** @ignore */
    _call(url: string, params: KeyObject | null, callback?: (r: CallResponse) => void, scope?: object, progress?: ProgressHandler): void;
    /** @ignore */
    _callResponse(xhr: XMLHttpRequest, callback?: (r: CallResponse) => void, scope?: object): any;
    /**
     * Internal import service
     * @ignore
     */
    _readLines(url: string, params: KeyObject, maxLines: number, cbk?: null | ((lines: string[]) => void)): void;
    /**
     * Loads application info data.
     * @memberof Simplicite.Ajax
     * @function
     */
    getAppInfo(): Promise<object>;
    /**
     * Loads system info data.
     * @memberof Simplicite.Ajax
     * @function
     */
    getSysInfo(): Promise<object>;
    /**
     * Loads grant data.
     * @param {Object} params Optional parameters
     * @param {boolean} params.inlinePicture Inline picture (false if absent or undefined)
     * @param {boolean} params.web true to load UI stuff
     * @param {boolean} params.texts true to TEXTs
     * @memberof Simplicite.Ajax
     * @function
     */
    getGrant(params?: {
        inlinePicture?: boolean;
        web?: boolean;
        texts?: boolean;
    }): Promise<Grant>;
    /**
     * Set password.
     * @param {string} password Password
     * @memberof Simplicite.Ajax
     * @function
     */
    setPassword(password: string): Promise<object>;
    /**
     * Loads basic user data (login, name, email, picture).
     * @param {string} login User login
     * @param {Object} params Optional parameters
     * @param {boolean} params.inlinePicture Inline picture (false if absent or undefined)
     * @memberof Simplicite.Ajax
     * @function
     */
    getUserInfo(login: string, params?: {
        inlinePicture?: boolean;
    }): Promise<object>;
    /**
     * Change user's language
     * @param {string} lang language code (FRA, ENU...)
     * @param {Object} params Optional parameters
     * @param {boolean} params.pref Update also the preferred language
     * @memberof Simplicite.Ajax
     * @function
     */
    changeLang(lang: string, params?: {
        pref?: boolean;
    }): Promise<boolean>;
    /**
     * Loads menu data.
     * @memberof Simplicite.Ajax
     * @function
     */
    getMenu(): Promise<KeyObject>;
    /**
     * Get alls granted crosstabs
     * @memberof Simplicite.Ajax
     * @function
     */
    getCrosstabs(): Promise<CrosstabMetadata[]>;
    /**
     * Get alls granted external objects
     * @param {boolean} widget only UI widgets?
     * @memberof Simplicite.Ajax
     * @function
     */
    getExternalObjects(widget: boolean): Promise<ExternalMetadata>;
    /**
     * Loads view definition.
     * @param {string} name View name
     * @param {Object} params Optional parameters
     * @param {boolean} params.home Optional for home or panel instance (default true to get home object instances)
     * @memberof Simplicite.Ajax
     * @function
     */
    getView(name: string, params?: {
        home?: boolean;
    }): Promise<View>;
    /**
     * Convert the view definition into View and set the cache
     * @param {string} name View name
     * @param {Object} view View definition
     * @memberof Simplicite.Ajax
     * @function
     */
    setView(name: string, view: KeyObject | View): View;
    /**
     * Treeview services
     * @param {string} name Treeview name
     * @param {Object} params Optional parameters
     * @param {string} params.service metadata (default), page, getmenu, addmenu, delmenu
     * @param {string} params.object optional object name
     * @param {string} params.rowid optional object rowId
     * @param {string} params.child child object of page service
     * @param {number} params.page page number of page service
     * @memberof Simplicite.Ajax
     * @function
     */
    treeview(name: string, params?: {
        service?: string;
        object?: string;
        rowid?: string;
        child?: string;
        page?: number;
    }): Promise<KeyObject[]>;
    /**
     * Loads system parameters.
     * @memberof Simplicite.Ajax
     * @function
     */
    getSysParams(): Promise<object>;
    /**
     * Get system parameter value.
     * @param {string } name System parameter name
     * @param {Object} params Optional parameters
     * @param {boolean} params.force Force read system parameter value from the database?
     * @memberof Simplicite.Ajax
     * @function
     */
    getSysParam(name: string, params?: {
        force?: boolean;
    }): Promise<string>;
    /**
     * Set a user system parameter.
     * @param {string} name Parameter name
     * @param {string} value Parameter value (if undefined parameter is unset)
     * @param {boolean} save Save parameter in user parameters (if undefined parameter is not saved)
     * @memberof Simplicite.Ajax
     * @function
     */
    setSysParam(name: string, value?: string, save?: boolean): Promise<string>;
    /**
     * Loads texts.
     * @memberof Simplicite.Ajax
     * @function
     */
    getTexts(): Promise<object>;
    /**
     * Get a field definition.
     * @param {string} name Field name
     * @memberof Simplicite.Ajax
     * @function
     */
    getField(name: string): Promise<object>;
    /**
     * Get a list of value.
     * @param {string} name List of values name
     * @memberof Simplicite.Ajax
     * @function
     */
    getListOfValues(name: string): Promise<object>;
    /**
     * Get instance of business object.
     * @example
     * // app is a Simplicite.Ajax instance
     * const obj = app.getBusinessObject("MyObject");
     * // other instance of obj
     * const tmp = app.getBusinessObject("MyObject", "tmpObj");
     * @param obj Object name or business object
     * @param inst Optional instance name (default main instance: the_ajax_&lt;object name&gt;)
     * @memberof Simplicite.Ajax
     * @function
     */
    getBusinessObject(obj: string | BusinessObject, inst?: string): UIBusinessObject;
    /**
     * Remove objects from cache
     * @param obj Object name or business object
     * @function
     */
    clearCache(obj: string | BusinessObject): void;
    /**
     * Get a new business process.
     * @example
     * // app is a Simplicite.Ajax instance
     * const pcs = app.getBusinessProcess("MyProcess");
     * @param name Business process name
     * @function
     */
    getBusinessProcess(name: string): BusinessProcess;
    /**
     * Returns true if value is <code>1|true|yes|y</code>
     * @param {string} value parameter value
     * @return {boolean} Is value true?
     * @memberof Simplicite.Ajax
     * @function
     */
    isTrue(value: unknown): boolean;
    /**
     * Returns true if value is <code>0|false|no|n</code>
     * @param {string} value parameter value
     * @return {boolean} Is value false?
     * @memberof Simplicite.Ajax
     * @function
     */
    isFalse(value: unknown): boolean;
    /**
     * Get text value. Same as global <code>$T</code>
     * @param {string} code Text code
     * @param {boolean} plural True to get the plural value if known
     * @return {string} Text value
     * @memberof Simplicite.Ajax
     * @function
     */
    static getText(code: string, plural?: boolean, texts?: KeyString): string;
    /**
     * Get text value.
     * @param {string} code Text code
     * @param {boolean} plural True to get the plural value if known
     * @return {string} Text value
     * @memberof Simplicite.Ajax
     * @function
     */
    getText(code: string, plural?: boolean, texts?: KeyString): string;
    /**
     * Get text value (alias to <code>getText</code>).
     * @param {string} code Text code
     * @param {boolean} plural True to get the plural value if known
     * @return {string} Text value
     * @memberof Simplicite.Ajax
     * @function
     */
    T: (code: string, plural?: boolean, texts?: KeyString) => string;
    /**
     * Loads news.
     * @param {Object} params Optional parameters
     * @param {boolean} params.count Return news count only (false if absent or undefined)
     * @param {boolean} params.inlineImages Inline news image (false if absent or undefined, not taken into account if count is true)
     * @memberof Simplicite.Ajax
     * @function
     */
    getNews(params?: {
        count?: boolean;
        inlineImages?: boolean;
    }): Promise<object>;
    /**
     * Loads external object definition.
     * @param {string} name External object name
     * @memberof Simplicite.Ajax
     * @function
     */
    getExternalObject(name: string): Promise<ExternalMetadata>;
    /**
     * External object URL.
     * @param {string} name Object name
     * @param {Object} params Optional parameters (object or string)
     * @param {boolean} embedded True to get a relative URL, false to get the full http URL (loadURL will create an iframe)
     * @memberof Simplicite.Ajax
     * @function
     */
    getExternalObjectURL(name: string, params?: string | object, embedded?: boolean): string;
    /**
     * Search from index.
     * @param {string} request Index search request string
     * <ul>
     * <li>simple text with wildcards and operators</li>
     * <li>in:domain:xxx[:all] = to get recent objects in a specific domain 'xxx', 'all' or by default those updated by the user</li>
     * <li>in:docs:obj1[;obj2;obj3...] text = to search the text in joined documents of listed objects</li>
     * </ul>
     * @param {Object} params Optional parameters
     * @param {boolean} params.inlineDocs Inline documents (false if absent or undefined, can be a boolean or an array of document fields to inline) ?
     * @param {boolean} params.inlineThumbs Inline image documents thumbnails (false if absent or undefined) ?
     * @param {boolean} params.inlineObjs Inline objects fields items (false if absent or undefined, can be a boolean or an array of object fields to inline) ?
     * @param {boolean} params.metadata gets the search engine metadata <code>{ indexed:[{name,label},...], withDocs:[{name,label},...] }</code>
     * @param {boolean} params.useFilter apply user preference INDEX_OBJ_FILTER to limit search
     * @memberof Simplicite.Ajax
     * @function
     */
    indexsearch(request: string, params?: InlineParam & {
        metadata?: boolean;
        useFilter?: boolean;
    }): Promise<KeyObject[]>;
    /**
     * Bookmark service
     * @param {string} method show, add, delete, toggle
     * @param {Object} params method parameters data or show
     * @memberof Simplicite.Ajax
     * @function
     */
    bookmark(method: string, params?: {
        data?: object;
        show?: boolean | string;
    }): Promise<KeyObject>;
    /**
     * Dashboard service
     * @param {string} method list | delete | rename
     * @param {Object} params method parameters
     * @memberof Simplicite.Ajax
     * @function
     */
    dashboard(method: string, params?: KeyObject): Promise<KeyObject>;
    /**
     * User guide service
     * @param {string} method tour
     * @param {Object} params method parameters
     * @memberof Simplicite.Ajax
     * @function
     */
    guide(method: string, params?: {
        name?: string;
        step?: string;
        usageId?: string;
        tour?: KeyObject;
    }): Promise<KeyObject>;
    /**
     * Social post service.
     * @param {Object} params Optional parameters
     * @param {boolean} params.counters true to get counters without posts
     * @param {string} params.object Optional object name
     * @param {string} params.rowId Optional row ID
     * @param {number} params.page Optional page to search, -1=no search
     * @param {boolean} params.activity true to include activity message
     * @param {string} params.level optional level filter
     * @param {boolean} params.audit to list audit message only
     * @param {boolean} params.del true to delete the post (default the service upsert the post)
     * @param {boolean} params.like Optional true to like, false to unlike
     * @param {string} params.status Optional status to update
     * @param {boolean} params.follow true to get follow counters
     * @param {Object} post optional post to save or delete <code>{ id, userId, message, pub, object, rowId }</code>
     * @memberof Simplicite.Ajax
     * @function
     */
    social(params: {
        counters?: boolean;
        object?: string;
        rowId?: string;
        page?: number;
        activity?: boolean;
        level?: string;
        audit?: boolean;
        auditAction?: string;
        del?: boolean;
        like?: boolean;
        status?: string;
        follow?: boolean;
    }, post?: object): Promise<KeyObject>;
    /**
     * Social follow service.
     * @param {Object} params parameters
     * @param {string} params.method follow|unfollow|accept|deny|search
     * @param {string} params.param related userId or search request
     * @param {string} params.object optional User object to use
     * @param {boolean} params.all optional to search all authors or not
     * @memberof Simplicite.Ajax
     * @function
     */
    follow(params?: {
        method: string | null;
        param?: string | null;
        object?: string;
        all?: boolean;
    }): Promise<KeyObject>;
    /**
     * Firebase service to send mobile notification
     * @param {Object} data Parameters
     * @param {string} data.title Optional title
     * @param {string} data.message Message body
     * @param {Object} data.to <code>\{users, groups\}</code> list of logins or groups, or <code>'all'</code> to notify all users
     * @param {string} data.token Optional refresh device token
     * @param {string} data.oldtoken Optional previous token to remove
     * @memberof Simplicite.Ajax
     * @function
     */
    firebase(data: {
        title?: string;
        message?: string;
        to?: object;
        token?: string;
        oldtoken?: string;
    }): Promise<object>;
    /**
    TODO
    */
    webpush(data: object): Promise<object>;
    /**
     * Syntax service: will return an object with the results
     * @param {Object} data parameters
     * @param {string} data.type type of syntax service: field
     * @param {string} data.objectid object id for field name
     * @param {Object} data.value value to validate or transform
     * @memberof Simplicite.Ajax
     * @function
     */
    syntax(data: {
        type: string;
        objectid: string;
        value: any;
        refobjectid?: string;
    }): Promise<KeyObject>;
    /**
     * Palette service
     * @memberof Simplicite.Ajax
     * @function
     */
    palette(): Promise<Palette[]>;
    /**
     * Module services
     * @param {Object} params parameters
     * @param {string} params.row_id Module row ID
     * @param {string} params.del Deletion action <code>start|status</code>
     * @param {boolean} params.confirm Confirm deletion?</li>
     * @param {string} params.application or Application name
     * @param {string} params.method import, export, status
     * @param {string} params.format export to xml or json
     * @param {boolean} params.exploded exploded files in export?
     * @memberof Simplicite.Ajax
     * @function
     */
    module(params: ModuleAjax): Promise<KeyObject>;
    /**
     * Session init (retrieves server side session identifier and auth token).
     * @param {string} authToken Auth token to (re)use (in case of persistent tokens)
     * @param {Object} params Optional parameters
     * @param {string}  params.scope Optional session scope
     * @param {string}  params.clientId Optional client Id
     * @memberof Simplicite.Ajax
     * @function
     */
    session(authToken: string, params?: {
        scope?: string;
        clientId?: string;
    }): Promise<KeyObject>;
    /**
     * Login (same as session()).
     * @param {string} authToken Auth token to (re)use (in case of persistent tokens)
     * @param {Object} params Optional parameters
     * @param {string} params.scope Optional session scope
     * @memberof Simplicite.Ajax
     * @function
     */
    login: (authToken: string, params?: {
        scope?: string;
        clientId?: string;
    }) => Promise<KeyObject>;
    /**
     * Logout (in case of a persistent token it is deleted)
     * @memberof Simplicite.Ajax
     * @function
     */
    logout(): Promise<object>;
    /**
     * Monitoring service
     * @param {(string|Object)} m Monitoring service or plain JSON object to store
     * @param {Object} params Optional parameters <code>\{ session \}</code>
     * @param {function} cbk Optional callback for response
     * @memberof Simplicite.Ajax
     * @function
     */
    monitor(m: string | object, params?: object, cbk?: (r: KeyObject[]) => void): void;
    /**
     * Parse a date value into a Javascript Date
     * @param {string} v Date value (<code>YYYY-MM-DD</code>)
     * @return {Date} Javascript date
     * @memberof Simplicite.Ajax
     * @function
     */
    parseDateValue(v: string): Date;
    /**
     * Parse a date time value into a Javascript Date
     * @param {string} v Date time value (<code>YYYY-MM-DD HH:mm:ss</code>)
     * @return {Date} Javascript date
     * @memberof Simplicite.Ajax
     * @function
     */
    parseDateTimeValue(v: string): Date;
    /**
     * Parse a Javascript Date into a date value
     * @param {Date} d Javascript date
     * @return {string} Date value (<code>YYYY-MM-DD</code>)
     * @memberof Simplicite.Ajax
     * @function
     */
    toDateValue(d: Date): string;
    /**
     * Parse a Javascript Date into a time value
     * @param {Date} d Javascript date
     * @return {string} Time value (<code>HH:mm:ss</code>)
     * @memberof Simplicite.Ajax
     * @function
     */
    toTimeValue(d: Date): string;
    /**
     * Parse a Javascript Date into a date time value
     * @param {Date} d Javascript date
     * @return {string} Date time value (<code>YYYY-MM-DD HH-mm-ss</code>)
     * @memberof Simplicite.Ajax
     * @function
     */
    toDateTimeValue(d: Date): string;
    /**
     * Encode a string to base64
     * @param {string} s Input string
     * @return {string} Base64-encoded string
     * @memberof Simplicite.Ajax
     * @function
     */
    base64Encode(s: string): string;
    /**
     * Encode an array buffer (such as got from a local file read) to to base64
     * @param {Array} b Array buffer
     * @return {string} Base64-encoded string
     * @memberof Simplicite.Ajax
     * @function
     */
    base64EncodeArrayBuffer(b: ArrayBuffer): string;
    /**
     * Decode a base64 string to string
     * @param {string} s Base64-encoded string
     * @return {string} Decoded string
     * @memberof Simplicite.Ajax
     * @function
     */
    base64Decode(s: string): string;
    /**
     * Checks if a value is empty
     * @param x Value
     * @memberof Simplicite.Ajax
     * @function
     */
    isEmpty(x: unknown): boolean;
}

/**
 * Websocket tools used by responsive UI
 * @class
 */
declare class EventWebSocket {
    ws?: WebSocket;
    url?: string;
    handlers: KeyObject;
    started: boolean;
    toBind: {
        type: string;
        handler: (msg: KeyObject) => void;
    }[];
    retry: number;
    constructor();
    /**
     * Binds a handler for specified event type
     * @param type Event type (log, notification, object...)
     * @param handler Handler function
     */
    bind(type: string, handler: (msg: KeyObject) => void): void;
    unbind(type: string, handler: (msg: KeyObject) => void): void;
    /**
     * Restart websocket and rebind all handlers when the service has been closed.
     * (invalidated old HTTPSession on server side, but UI is still alive with the user-token/cookie)
     */
    rebind(): void;
    getReason(code: number): string;
    /**
     * Starts event websocket
     */
    start(uri?: string, cbk?: Callback): void;
    init(cbk?: Callback): void;
    /**
     * Stops event websocket
     */
    stop(): void;
    /**
     * Sends message to event websocket
     */
    send(msg: string): void;
    onStart(cbk?: Callback): void;
}

/**
 * Generic DOM container as JQuery object
 * @type Container
 */
type Container = JQuery<HTMLElement>;
/**
 * Generic DOM container as JQuery object or selector
 * @type AnyContainer
 */
type AnyContainer = JQuery<HTMLElement> | string | null;
/**
 * Generic DOM content as JQuery element or string
 * @type AnyContent
 */
type AnyContent = JQuery<HTMLElement> | string;
/**
 * Addon action
 */
type Addon = {
    name: string;
    label?: string;
    icon?: string;
    plus?: boolean;
    cbk: Callback;
};
/**
 * Data to confirm one action to run
 */
type ConfirmRun = {
    values?: KeyObject;
    cbk?: (msg?: MessageJSON) => void;
};
/**
 * Can close paremeters
 */
type EventCloseParam = {
    hasChanged?: () => boolean;
    save?: (saved: Callback) => void;
    confirm: boolean;
    cls?: string;
    context?: string;
};
/**
 * Main UI Controller with abstract view to display components.
 * <ul>
 * <li>Controller implements the UI logic with interactions between components (list, form, menu...) and the data (ajax).
 * <li>It does not contain UI drawing and must load the view service to display controls.
 * <li>Each View engine implements the UI interfaces (without data access) and interacts with the controller (to access to data).
 * </ul>
 * @class
 */
declare class UIEngine extends UIRender {
    /**
     * User rights
     * @member
     */
    grant?: Grant;
    /**
     * Ajax session
     * @member
     */
    app?: Session;
    /**
     * View: main renderer
     * @member
     */
    view: UIViewer;
    /**
     * Global options: merge of the launch parameters with Simplicite.UI.Globals
     * @member
     */
    options: typeof Globals;
    menu?: MainMenu;
    menuTop?: MainMenu;
    menuRight?: MainMenu;
    ews?: EventWebSocket;
    sse?: EventSource;
    map?: UIMap;
    calendar?: UICalendar;
    guide?: Guide;
    workflow?: Workflow;
    charts?: Charts;
    diagram?: DiagramEngine;
    _keepAliveTimer?: number;
    _waitingAjax?: boolean;
    licensed?: boolean;
    objectsquota?: string;
    _assist?: KeyObject;
    constructor(Viewer: UIViewer);
    /**
     * Current ajax session
     * @return Simplicite.Ajax instance
     * @function
     */
    getApp(): Session | undefined;
    /**
     * Set ajax session
     * @function
     */
    setApp(app: Session): void;
    /**
     * Set user rights
     * @function
     */
    setGrant(g: Grant): void;
    /**
     * Get user rights
     * @function
     */
    getGrant(): Grant;
    /**
     * Convert selector to jQuery container (default #work or #work0.content)
     * @function
     */
    $ctn(c?: AnyContainer): JQuery;
    /**
     * Get container navigator, default returns the main navigation of #work area
     * @param {string|jQuery} c Component or selector
     * @return Simplicite.UI.Navigator instance
     * @function
     */
    getNav(c?: AnyContainer): UINavigator;
    /**
     * Find the closest container with a navigator
     * @param {string|jQuery} c component
     * @function
     */
    getNavContainer(c: AnyContainer): JQuery<HTMLElement>;
    /**
     * Change user's language on server side and reload the page
     * @param {string} lang Language FRA, ENU...
     * @param {boolean} pref true to update also the preferred language
     * @function
     */
    changeLang(lang: string, pref?: boolean): void;
    /**
     * Keep the session alive during data updates (used by form and edit list)
     * and refresh object usage by other people
     * @param {boolean} enable true to start the timer, false to stop
     * @param {string} obj optional object name to get usage
     * @param {string} id optional rowId
     * @function
     */
    keepAlive(enable: boolean, obj?: string, id?: string): void;
    /**
     * All logins from local storage
     * @function
     */
    getLocalLogins(): any;
    /**
     * Add the connected login to local storage
     * @param {Object} g grant
     * @function
     */
    addLocalLogin(g: Grant): void;
    /**
     * Remove a login from local storage
     * @param {string} login remove all logins if null
     * @function
     */
    removeLocalLogin(login: string): void;
    /**
     * Shortcut handler
     * @param shortcut definition <code>\{ name, url, target, label, width, height \}</code>
     * @function
     */
    clickShortcut(shortcut?: Shortcut): void;
    /**
     * Main menu handler
     * @param {MenuParam} data Menu data
     * @param {MenuItem} data.item Original menu item
     * @param {string} data.label Displayed label
     * @param {string} data.object Optional object name
     * @param {string} data.field Optional enum field
     * @param {string} data.code Optional enum filter (or status)
     * @param {string} data.workflow Optional screenflow name
     * @param {string} data.process Optional process name
     * @param {string} data.step Optional step filter
     * @param {string} data.bam Optional object name for metrics view
     * @param {string} data.tray Optional object name for trays view
     * @param {string} data.domain Optional domain home
     * @param {string} data.view Optional view name
     * @param {string} data.href Optional external object URL
     * @param {string} data.target Optional href target
     * @param {string} data.newtab Optional to open a new navigation 'tab' or 'side'
     * @function
     */
    clickMenu(data: MenuParam): void;
    private _bindedActions;
    /**
     * Bind one UI action with implementation
     * @param {string} name action name
     * @param {function} fn handler
     * @function
     */
    bind(name: string, fn: ActionHandler): void;
    /**
     * Enable action binding
     * @param {string} name Action name
     * @param {boolean} enable True to activate / false to disable binding
     * @function
     */
    bindEnabled(name: string, enable: boolean): boolean;
    /**
     * Unbind one UI action
     * @param {string} name Action name
     * @function
     */
    unbind(name: string): void;
    /**
     * Is UI action binded and enabled ?
     * @param {string} name Action name
     * @return True if the action is enabled
     * @function
     */
    isBinded(name: string): boolean;
    /**
     * Is action binded ?
     * @param {Object} a Action metadata
     * @return True if the action is binded
     * @function
     */
    isActionBinded(a: Action): boolean;
    /**
     * Execute one action
     * @param {Object} a Action metadata
     * @param {BusinessObject} obj Business object
     * @param {string} rowId Optional object row ID on form/row
     * @function
     */
    doAction(a: Action, obj: BusinessObject, rowId?: string | null): void;
    /**
     * Init and confirm one action
     * @param {Object} a Action metadata
     * @param {BusinessObject} obj Business object
     * @param {string} rowId Optional object row ID on form/row
     * @param {function} run Optional callback to execute the confirmed action
     * @param {function} cancel Optional callback to cancel the action
     * @function
     */
    initConfirmAction(a: Action, obj: BusinessObject, rowId?: string | null, run?: (params?: ConfirmRun) => void, cancel?: (_: unknown) => void): void;
    /**
     * Execute a custom/backend action (object.action call) after saving the form
     * @param {Object} a Action metadata
     * @param {BusinessObject} obj Business object
     * @param {string} rowId Optional object row ID on form/row
     * @param {Object} values Optional confirm field values
     * @param {function} cbk Optional callback(msg)
     * @function
     */
    doActionCustom(a: Action, obj: BusinessObject, rowId?: string | null, values?: KeyObject, cbk?: (msg: MessageJSON) => void): void;
    /**
     * Wrap a backend URL action to front
     * @param {Object} a Action metadata
     * @param {BusinessObject} obj Business object
     * @param {string} rowId Optional object row ID on form/row
     * @function
     */
    doActionURL(a: Action, obj: BusinessObject, rowId?: string | null): void;
    /** Wrap "open model" actions */
    doActionModel(a: Action, obj: BusinessObject, rowId?: string): void;
    /**
     * Execute a generic/UI action (all binded implementations)
     * @param {Object} a Action metadata
     * @param {BusinessObject} obj Business object
     * @param {string} rowId Optional object row ID on form/row
     * @function
     */
    doActionGeneric(a: Action, obj: BusinessObject, rowId?: string | null): void;
    /**
     * Bind generic actions (create, copy, delete...)
     * @function
     */
    bindGenericActions(): void;
    /**
     * Gets the field extended with the UIField interface
     * @param {(string|jQuery)} ctn Container
     * @param {BusinessObject} obj Object
     * @param {(string|ObjectField)} field Object field or name
     * @param {string} index Optional for multiple inputs of the same field (edit list)
     * @param {boolean} silent No trace when field is unknown
     * @function
     */
    getUIField(ctn: AnyContainer, obj: BusinessObject | null, field: string | ObjectField, index?: string | null, silent?: boolean): ObjectField;
    /**
     * Gets the action with UIAction interface
     * @param {(string|jQuery)} ctn Container
     * @param {BusinessObject} obj Object
     * @param {Object} action Action metadata or name
     * @function
     */
    getUIAction(ctn: AnyContainer, obj: UIBusinessObject, action: Action | string): Action | undefined;
    /**
     * Gets the area with UIArea interface
     * @param {(string|jQuery)} ctn Container
     * @param {BusinessObject} obj Object
     * @param {Object} area Area metadata or name or position
     * @function
     */
    getUIArea(ctn: AnyContainer, obj: UIBusinessObject, area: Area | string | number): Area | undefined;
    /**
     * Gets the view with UIView interface
     * @param {(string|jQuery)} ctn Container
     * @param {BusinessObject} obj Optional object
     * @param {Object} view View metadata or name
     * @function
     */
    getUIView(ctn: AnyContainer, obj: BusinessObject | null, view: View | string): View | undefined;
    /**
     * Count rows with context and filters
     * @param {(string|jQuery)} ctn Container
     * @param {(string|BusinessObject)} obj Name or Business Object
     * @param {UI.Globals.list} options Options to override Globals
     * @param {function} cbk Optional callback(obj) to read obj.count
     * @function
     */
    countList(ctn: AnyContainer, obj: string | BusinessObject, options?: ListParam, cbk?: (obj: UIBusinessObject) => void): void;
    /**
     * Open handler (on a list row or summary): default switch to open object form, reference, doc or image
     * @param {(string|jQuery)} ctn Container
     * @param {BusinessObject|string} obj Target object or name
     * @param {string} rowId Target row ID
     * @param {Object} params Optional parameters
     * @param {BusinessObject} params.object Source object
     * @param {string} params.inst    Instance name
     * @param {string} params.rowId   Source row ID
     * @param {string} params.ref     Reference object name
     * @param {string} params.refId   With the reference row ID
     * @param {string} params.field   Or the doc/image field name
     * @param {string} params.docId   With the document ID
     * @param {string} params.imageId Or the image ID
     * @param {boolean} params.preview Preview document?
     * @function
     */
    openObject(ctn: AnyContainer, obj: string | BusinessObject, rowId: string, params?: {
        object?: BusinessObject;
        inst?: string;
        rowId?: string;
        ref?: string;
        refId?: string;
        field?: string;
        docId?: string;
        imageId?: string;
        imageAlt?: string;
        preview?: boolean;
    }): void;
    /**
     * Count references of a parent object in PANELLIST context
     * @param {UBusinessObject|string} obj Target object or name
     * @param {Object} parent Specify the parent object and the foreign-key <code>\{ name, inst, field, rowId \}</code>
     * @param {function} cbk Callback(obj, count)
     * @function
     */
    countReference(obj: string | BusinessObject, parent: ParentObject, cbk: (obj: BusinessObject, count: number) => void): void;
    /**
     * Populate the referenced fields
     * @param {(string|jQuery)} ctn Container
     * @param {BusinessObject} obj Object
     * @param {(string|Object)} refField Foreign key field
     * @param {string} refId Reference row ID, or null to reset referenced fields
     * @param {string} index Optional row index (edit list)
     * @param {function} cbk Optional callback
     * @param {boolean} noChange Optional to bypass change events on each fields
     * @param {boolean} userKey Optional to get foreign user-key
     * @function
     */
    populateReference(ctn: AnyContainer, obj: BusinessObject, refField: string | ObjectField, refId: string | null, index?: string | null, cbk?: Callback, noChange?: boolean, userKey?: boolean): void;
    /**
     * Populate the referenced fields of action or external object
     * @param {(string|jQuery)} ctn Container
     * @param {BusinessObject} obj Object
     * @param {(string|Object)} refField Foreign key field
     * @param {string} refId Reference row ID, or null to reset referenced fields
     * @param {Object} def Action or External object with fields
     * @param {function} cbk Optional callback
     * @function
     */
    populateFields(ctn: AnyContainer, obj: BusinessObject, refField: string | ObjectField, refId: string | null, def: Action | ExternalObject, cbk?: Callback): void;
    /**
     * Click on a document: open the document
     * @param {Object} doc Document data
     * @param {string} doc.object Object name
     * @param {string} doc.field Document field name
     * @param {string} doc.rowId Row ID
     * @param {string} doc.docId Document ID
     * @param {string} doc.name Document name
     * @function
     */
    clickDocument(doc: DocumentDB): void;
    /**
     * Preview a document: default open a dialog with the preview
     * @param {Object} doc Document data
     * @param {string}   doc.object Object name
     * @param {string}   doc.field Document field name
     * @param {string}   doc.rowId Row ID
     * @param {string}   doc.docId Document ID
     * @param {string}   doc.name optional document name
     * @param {Object} options Options
     * @param {jQuery}   options.container Optional container to fill
     * @param {boolean}  options.embedded Embedded or dialog
     * @param {function} options.onload Optional callback when loaded
     * @function
     */
    previewDocument(doc: DocumentDB, options?: boolean | {
        container: Container;
        embedded?: boolean;
        onload?: Callback;
    }): any;
    /**
     * Click on image: default open a dialog with the image
     * @param {Object} doc Image data
     * @param {string} doc.object Object name
     * @param {string} doc.field Document field name
     * @param {string} doc.rowId Row ID
     * @param {string} doc.rowid (rowId alias)
     * @param {string} doc.docId Image ID
     * @param {string} doc.id (docId alias)
     * @param {string} doc.name Optional image name
     * @param {string} doc.alt Optional image alt
     * @param {function} onload optional callback when loaded
     * @function
     */
    clickImage(doc: DocumentDB, onload?: (img: JQuery) => void): void;
    /**
     * Undo/Redo service
     * @param {(string|jQuery)} ctn Target container
     * @param {string} action Undo|redo
     * @param {number} num Number of iterations (default 1)
     * @param {string} url Optional URL to reload after server call (else use response url)
     * @function
     */
    undoRedo(ctn: AnyContainer, action: string, num?: number, url?: string): void;
    /**
     * Prepare content handlers
     * @param {jQuery} ctn Container
     * @param {function} onload Optional load handler
     * @param {function} onunload Optional unload handler
     * @function
     */
    contentLoaded(ctn: AnyContainer, onload?: Callback, onunload?: JQueryHandler): void;
    /**
     * Force to close a content and destroy components
     * @param {jQuery} ctn Container
     * @param {function} cbk Callback when done
     * @function
     */
    contentClose(ctn: Container, cbk?: Callback): void;
    /**
     * Unload the container = destroy embedded components (editors...)
     * @param {jQuery} ctn Container
     * @param {function} cbk Callback when done
     * @function
     */
    contentUnload(ctn: AnyContainer, cbk?: Callback): void;
    /**
     * Checks if the content can close
     * @param {jQuery} ctn Container
     * @param {function} cbk Callback if the content can close
     * @function
     */
    canCloseContent(ctn?: AnyContainer, cbk?: Callback): void;
    /**
     * Attach change event to fields
     * <ul>
     * <li>set the hasChanged on object</li>
     * <li>apply related constraints</li>
     * <li>exclude elements with class <code>js-ignore-haschanged</code></li>
     * </ul>
     * @param {jQuery} ctn Container of inputs, selects and textareas
     * @param {BusinessObject|BusinessProcess} obj Object or Process
     * @param {string|JQuery} selector Optional selector (default: input, select and textarea)
     * @function
     */
    bindChange(ctn: Container, obj: BusinessObject | BusinessProcess | null, selector?: string | JQuery): void;
    /**
     * Apply constraints
     * @param {jQuery} ctn Container
     * @param {BusinessObject} obj Object
     * @param {object} elt     Optional DOM element (input, select, textarea) with data {field, index}
     * @param {string} index   Optional editlist line index (row Id or creation index 00 01...)
     * @param {number} context Optional context (default Simplicite.CONTEXT_UPDATE)
     * @function
     */
    applyConstraints(ctn: AnyContainer, obj: UIBusinessObject, elt?: Element | null, index?: string | null, context?: number): Promise<void>;
    /**
     * Manage the save and close when container has changed
     * @param {jQuery} ctn Container
     * @param {EventCloseParam} p Options
     * @function
     */
    bindEventClose(ctn: JQuery, p: EventCloseParam): void;
    /**
     * Manage the save and close when fields have changed
     * @param {jQuery} ctn Container
     * @param {BusinessObject} obj Object
     * @param {function} save Save handler
     * @function
     */
    bindSaveAndQuit(ctn: AnyContainer, obj: BusinessObject, save: (saved: Callback) => void): void;
    /**
     * Reload the linked lists of an enum field
     * @param {(string|jQuery)} ctn Container
     * @param {BusinessObject} obj Object
     * @param {ObjectField} field Enum field
     * @param {string|Array} code Selected value(s)
     * @param {string} index Edit list index
     * @param {function} cbk Callback <code>function(target)</code> to rebuild each target field with the new listOfValues
     * @param {boolean} all Get all values when code is empty (case of a search field)
     * @function
     */
    linkedLists(ctn: AnyContainer, obj: BusinessObject, field: ObjectField, code?: string | string[], index?: string, cbk?: (f: ObjectField) => void, all?: boolean): void;
    /**
     * Completion minimum size to trigger the search
     * @param {number} size Positive number (0 = disable)
     * @function
     */
    setCompletionMinSize(size: number): void;
    /**
     * Follow service wrapper
     * @param {string} method Method name
     * @param {string} param Method param
     * @param {function} cbk Optional callback
     * @function
     */
    onFollow(method: string | null, param: string | null, cbk: (r: KeyObject) => void): void;
    /**
     * Read all form fields into object fields (async/file reading)
     * @param {(string|jQuery)} ctn Container to find fields
     * @param {BusinessObject} obj Business object
     * @param {string} index Optional index (list edit)
     * @return Promise
     * @function
     */
    readForm(ctn: AnyContainer, obj: BusinessObject, index?: string | null): Promise<void>;
    /**
     * Save the object form
     * @param {jQuery} ctn Container
     * @param {BusinessObject} obj Business object
     * @param {Object} params Optional parameters (parent)
     * @returns Promise with messages or catch errors
     * @function
     */
    saveForm(ctn: Container, obj: UIBusinessObject, params?: {
        parent?: ParentObject;
    }): Promise<MessageAny[] | null>;
    /**
     * Save the object list
     * @param {jQuery} ctn List container
     * @param {BusinessObject} obj Business object
     * @param {Object} params Optional parameters (parent, edit)
     * @returns Promise with optional results <code>\{ messages, errors \}</code>
     * @function
     */
    saveList(ctn: Container, obj: UIBusinessObject, params?: {
        parent?: ParentObject;
        edit?: string;
    }): Promise<MessageSaveRows>;
    /**
     * Get changed values from UI to fields (with hook form.beforesave)
     * @param {jQuery} ctn Container
     * @param {BusinessObject} obj Business object
     * @param {string} index Optional index/row ID in list or fk name of inlined 0,1 object
     * @returns promise resolved with updated values
     * @function
     */
    readValues(ctn: Container, obj: UIBusinessObject, index?: string | null): Promise<KeyObject>;
    /**
     * Save the object after reading UI values
     * @param {jQuery} ctn Container
     * @param {BusinessObject} obj Business object
     * @param {string} index Optional index/row ID in list or fk name of inlined 0,1 object
     * @param {Object} params Optional parameters (parent, inline)
     * @return Promise with messages or errors
     * @function
     */
    saveObject(ctn: Container, obj: UIBusinessObject, index?: string | null, params?: {
        parent?: ParentObject;
        inline?: InlineObject;
        copy?: boolean;
    }): Promise<MessageJSON[] | undefined>;
    /**
     * Save one object field
     * @param {AnyContainer} ctn Container
     * @param {BusinessObject} obj Business object
     * @param {String} rowId Record Id to update
     * @param {ObjectField} field Field definition
     * @param {String} index Row index on list
     * @return Promise
     * @function
     */
    saveField(ctn: Container, obj: BusinessObject, rowId: string, field: ObjectField, index?: string | null): Promise<KeyObject>;
    /**
     * Close the object form: default going back in navigation
     * @param {AnyContainer} ctn Container
     * @function
     */
    closeForm(ctn?: AnyContainer): void;
    /**
     * Reload the object form: default reload navigation
     * @param {AnyContainer} ctn Container
     * @function
     */
    reloadForm(ctn?: AnyContainer): void;
    /**
     * Speech recognition
     * @param {Container} el Element input or textarea
     * @param {KeyObject} options Options, with optional keys:
     * `lang` (language, ex: FRA, ENU or fr-FR, en-GB...),
     * `continuous` (continuous speaking, sentence?),
     * `autoRestart` (continuous speaking, no timeout after long silence?),
     * `interimResults` (get interim results?),
     * `maxAlternatives` (max alternatives search),
     * `firstCapital` (first character uppercase in a sentence?),
     * `newLine` (accept new line symbol?),
     * `onStart`/`onEnd`/`onError` (optional handlers),
     * `onChange` (optional handler to override change event),
     * `debug` (optional console info)
     * @function
     */
    speechRecognition(el: Container, options: KeyObject): void;
    /**
     * Speech synthesis
     * @param {Object} el Text or input or textarea
     * @param {KeyObject} options Options, with optional keys:
     * `lang` (preferred language FRA, ENU...),
     * `voice` (optional voice name to force if exists),
     * `uri` (service URI, default native),
     * `volume` (0 to 1, default 1),
     * `rate` (0.1 to 10, default 1),
     * `pitch` (0 to 2, default 1),
     * `onStart`/`onEnd` (optional handlers),
     * `debug` (optional console info)
     * @function
     */
    speechSynthesis(el: Container, options: KeyObject): void;
}

/**
 * Async function
 */
declare const AsyncFunction: Function;
/**
 * Simple callback function without parameter
 */
type Callback = () => void;
/**
 * Generic type to implement any JSON object based on pairs of <code>{ string:typed value }</code>
 */
type KeyHash<Type1> = {
    [__key: string]: Type1;
};
/**
 * Hash key to get any object (as a javascript object)
 */
type KeyObject = KeyHash<any>;
/**
 * Hash key to get a number
 */
type KeyNumber = KeyHash<number>;
/**
 * Hash key to get a string
 */
type KeyString = KeyHash<string>;
/**
 * Hash key to get a string array
 */
type KeyStrings = KeyHash<string[]>;
/**
 * Hash key to get a boolean
 */
type KeyBoolean = KeyHash<boolean>;
/**
 * Constraint implementation as function with contextual parameters
 */
type ConstraintFunction = (ctn: Container, obj: UIBusinessObject, field?: ObjectField, id?: string | null, context?: number, cbk?: Callback) => void;
/**
 * Hash of constraint implementation per object name
 */
type KeyConstraint = KeyHash<ConstraintFunction>;
/**
 * UI object hook implementation as a function
 */
type ObjectHookFunction = (obj: UIBusinessObject, cbk: Callback) => void;
/**
 * Hash of hook function per object name
 */
type KeyObjectHook = KeyHash<ObjectHookFunction>;
/**
 * Hash of hook class per object name
 */
type KeyBusinessObjectHook = KeyHash<typeof UIBusinessObject>;
/**
 * Hash of hook class per process name
 */
type KeyBusinessProcessHook = KeyHash<typeof UIBusinessProcess>;
/**
 * Hash of external object class per name
 */
type KeyExternalObject = KeyHash<typeof UIExternalObject>;
/**
 * Base theme names
 */
type ThemeBase = "light" | "dark";
/**
 * LOV_COLOR
 */
declare const SimpliciteColors: string[];
/**
 * Icons metadata
 */
type IconsMetadata = {
    Solid: string[];
    Regular: string[];
    meta: KeyHash<{
        l: string;
        u: string;
        t: string[];
    }>;
    Bootstrap: {
        i: string;
        u: number;
        t: string[];
    }[];
};
/**
 * Back-end constants set on ready
 */
type BackendConstants = {
    URL: string;
    ROOT: string;
    APPLICATION: string;
    API_ROOT: string;
    UI_ROOT: string;
    UI_PATH: string;
    WEBSOCKET_SERVER: boolean;
    FULL_VERSION: string;
    VERSION: string;
    MINOR_VERSION: string;
    ENCODING: string;
};
type Font = {
    name: string;
    url: string;
};
type SplitterOptions = {
    enabled?: boolean;
    switchable?: boolean;
    save?: boolean | "auto";
};
type A11yOptions = {
    enabled?: boolean;
    toggle?: boolean;
    save?: boolean | "auto";
};
/**
 * UI globals options (shorthand $ui.options or Simplicite.UI.Globals).
 * Each UI object gets a copy in obj.locals.ui to override the default behaviors.
 * @namespace
 */
declare const Globals: {
    /**
     * @prop {object} globals backend global parameters (VERSION, URL...)
     * @memberof Simplicite.UI.Globals
     * @static
     */
    globals: BackendConstants;
    /**
     * @prop {string} container UI container, default body if null
     * @memberof Simplicite.UI.Globals
     * @static
     */
    container: JQuery | null;
    /**
     * @prop {string} title Window title from param WINDOW_TITLE
     * @memberof Simplicite.UI.Globals
     * @static
     */
    title: string;
    /**
     * @prop {string} engine Viewer engine name (Bootstap5)
     * @memberof Simplicite.UI.Globals
     * @static
     */
    engine: string;
    /**
     * @prop {string} deeplink temporary deeplink to access a specific page
     * @memberof Simplicite.UI.Globals
     * @static
     */
    deeplink: string | undefined;
    /**
     * @prop {Object[]} resources Use specified resources or generic ones if null (MAIN, HEADER, FOOTER, MENU, WORK)
     * @prop {string} resources.name Resource name like MAIN, HEADER, FOOTER, MENU, WORK
     * @prop {string} resources.type Resource type HTML, CSS, JS
     * @prop {string} resources.target Optional target for HTML type
     * @memberof Simplicite.UI.Globals
     * @static
     */
    resources: LoadPart[] | null;
    /**
     * @prop {Object} ajaxSetup Ajax default setup
     * @prop {string} ajaxSetup.crossDomain True to use CORS request
     * @prop {Object} ajaxSetup.xhrFields Optional xhr fields
     * @prop {Object} ajaxSetup.xhrFields.withCredentials Credential to use the session cookie (default true)
     * @memberof Simplicite.UI.Globals
     * @static
     */
    ajaxSetup: {
        crossDomain: boolean;
        xhrFields: {
            withCredentials: boolean;
        };
        headers: KeyString;
    };
    /**
     * @prop {Object} context Engine context: none, disposition or object
     * @prop {string} context.object <code>'ObjectExternal'</code> or <code>'ObjectInternal'</code> (null means <code>'Disposition'</code>)
     * @prop {string} context.name Related (external) object name
     * @prop {string} context.rowId Related object row ID
     * @memberof Simplicite.UI.Globals
     * @static
     */
    context: {
        object: "ObjectExternal" | "ObjectInternal" | null;
        name: string | null;
        rowId: string | null;
    };
    /**
     * @prop {string} theme Theme name from Home page
     * @memberof Simplicite.UI.Globals
     * @static
     */
    theme: string | null;
    /**
     * @prop {string} themeBase Theme base name <code>'dark'</code>, <code>'light'</code>
     * @memberof Simplicite.UI.Globals
     * @static
     */
    themeBase: ThemeBase | null;
    /**
     * @prop {string} font Optional font to use (a string assume to be a google font)
     * @memberof Simplicite.UI.Globals
     * @static
     */
    font: Font | string | null;
    /**
     * @prop {string} monospaceFont Optional monospace font to use (a string assume to be a google font)
     * @memberof Simplicite.UI.Globals
     * @static
     */
    monospaceFont: Font | string | null;
    /**
     * @prop {string} fontSize Set the font-size zoom factor (100% = default size)
     * @memberof Simplicite.UI.Globals
     * @static
     */
    fontSize: string;
    /**
     * @prop {boolean} compact Compact the UI to limit padding sizes?
     * @memberof Simplicite.UI.Globals
     * @static
     */
    compact: boolean;
    /**
     * @prop {Object} splitter use splitter to manage several work areas
     * @memberof Simplicite.UI.Globals
     * @static
     */
    splitter: SplitterOptions;
    /**
     * @prop {Object} a11y use a11y to disable and adapt interfaces
     * @memberof Simplicite.UI.Globals
     * @static
     */
    a11y: A11yOptions;
    /**
     * @prop {function} defaultContentLoad Optional handler when a content is loaded
     * @memberof Simplicite.UI.Globals
     * @static
     */
    defaultContentLoad: JQueryHandler | null;
    /**
     * @prop {function} defaultContentUnload Optional handler when a content is unloaded
     * @memberof Simplicite.UI.Globals
     * @static
     */
    defaultContentUnload: JQueryHandler | null;
    /**
     * @prop {function} onload Optional page loaded (called before the ready callback)
     * @memberof Simplicite.UI.Globals
     * @static
     */
    onload: CallableFunction | null;
    /**
     * @prop {function} onbeforeunload Optional page beforeunload
     * @memberof Simplicite.UI.Globals
     * @static
     */
    onbeforeunload: CallableFunction | null;
    /**
     * @prop {function} onunload Optional page unload
     * @memberof Simplicite.UI.Globals
     * @static
     */
    onunload: CallableFunction | null;
    /**
     * @prop {function} onlogout Optional logout handler, default call $ui.logout({ confirm: true })
     * @memberof Simplicite.UI.Globals
     * @static
     */
    onlogout: CallableFunction | null;
    /**
     * @prop {boolean} useMainParts Use the standard main site with context parts (MAIN, MENU, WORK, HEADER, FOOTER) ? (default true)
     * @memberof Simplicite.UI.Globals
     * @static
     */
    useMainParts: boolean;
    /**
     * @prop {boolean} useSocial Use social posts (default true)
     * @memberof Simplicite.UI.Globals
     * @static
     */
    useSocial: boolean;
    /**
     * @prop {Object} socialShare Based on <code>SOCIAL_SHARE</code> parameter if not set
     * @memberof Simplicite.UI.Globals
     * @static
     */
    socialShare: KeyObject | undefined;
    /**
     * @prop {boolean} useCopyLink Allows to copy deeplink to objects (default true)
     * @memberof Simplicite.UI.Globals
     * @static
     */
    useCopyLink: boolean;
    /**
     * @prop {Object} undoredo True: see controls in header, false: disable feature or 'keys' to use CTRL-Z/Y only and hide controls
     * @memberof Simplicite.UI.Globals
     * @static
     */
    useUndoRedo: boolean;
    /**
     * @prop {Object} scope Multi-apps configuration
     * @prop {string} scope.name Optional requested scope name
     * @prop {(boolean|Object[])} scope.enabled Defaults to true
     * <ul>
     * <li>true : all granted scopes</li>
     * <li>false : no multi-apps access</li>
     * <li>or array of specific scopes <code>\{home, url, icon|logo, label, help\}</code></li>
     * </ul>
     * @memberof Simplicite.UI.Globals
     * @static
     */
    scope: {
        name: string | undefined;
        enabled: boolean;
    };
    /**
     * @prop {(boolean|Object[])} shortcuts Display the shortcuts ?
     * <ul>
     * <li>true : all granted shortcuts</li>
     * <li>false : no shortcuts access</li>
     * <li>or array of specific shortcuts <code>\{name, label, url, target, icon\}</code></li>
     * </ul>
     * @memberof Simplicite.UI.Globals
     * @static
     */
    shortcuts: boolean;
    /**
     * @prop {boolean} slideNav Slide screen on push|pull navigation ? (default false)
     * @memberof Simplicite.UI.Globals
     * @static
     */
    slideNav: boolean;
    /**
     * @prop {Object} exports Export configuration, all are <code>\{ enabled:true \}</code> by default
     * @prop {Object} exports.CSV CVS export with default sep:';'
     * @prop {Object} exports.XLS Excel export
     * @prop {Object} exports.PDF PDF export
     * @prop {Object} exports.ARC Archive ZIP
     * @prop {Object} exports.XML XML Simplicite (reserved to ADMIN) with default inline:true, timestamp:false
     * @prop {Object} exports.JSON JSON Simplicite (reserved to ADMIN)
     * @prop {Object} exports.YAML YAML Simplicite (reserved to ADMIN)
     * @prop {Object} exports.ZIP ZIP Simplicite (reserved to ADMIN)
     * @memberof Simplicite.UI.Globals
     * @static
     */
    exports: {
        CSV: {
            enabled: boolean;
            sep: string;
        };
        XLS: {
            enabled: boolean;
        };
        PDF: {
            enabled: boolean;
        };
        ARC: {
            enabled: boolean;
        };
        XML: {
            enabled: boolean;
            inline: boolean;
            timestamp: boolean;
        };
        JSON: {
            enabled: boolean;
            inline: boolean;
            timestamp: boolean;
        };
        YAML: {
            enabled: boolean;
            inline: boolean;
            timestamp: boolean;
        };
        ZIP: {
            enabled: boolean;
        };
    };
    /**
     * @prop {Object} tinymce default tinymce options
     * @memberof Simplicite.UI.Globals
     * @static
     * @deprecated
     */
    tinymceOptions: {
        plugins: string[];
        toolbar: string;
        menubar: string;
        statusbar: boolean;
        paste_data_images: boolean;
        paste_as_text: boolean;
        browser_spellcheck: boolean;
        contextmenu: boolean;
        selector: string;
        language: string;
        height: number;
    };
    /**
     * @prop {Object} quillOptions Quill option for HTML editor (will be upscaled by code)
     * @memberof Simplicite.UI.Globals
     * @static
     */
    quillOptions: QuillOptions;
    /**
     * Global object list options
     * @memberof Simplicite.UI.Globals
     */
    list: ListParam;
    /**
     * Global object form options
     * @memberof Simplicite.UI.Globals
     */
    form: FormParam;
    /**
     * Global object search options
     * @memberof Simplicite.UI.Globals
     */
    search: SearchParam;
    /**
     * Global object summary options
     * @memberof Simplicite.UI.Globals
     */
    summary: SummaryParam;
    /**
     * Global agenda/calendar options
     * @memberof Simplicite.UI.Globals
     */
    agenda: CalendarParam;
    /**
     * Global timesheet options
     * @memberof Simplicite.UI.Globals
     */
    timesheet: TimesheetOptions;
    /**
     * Global News options
     * @memberof Simplicite.UI.Globals
     */
    news: {
        /**
         * @prop {string} template Default template to display a news
         * @memberof Simplicite.UI.Globals.news
         * @static
         */
        template: string;
    };
};

declare global {
    interface String {
        equals(v: string): boolean;
        equalsIgnoreCase(v: string): boolean;
        ltrim(): string;
        rtrim(): string;
        lpad(n: number, s: string): string;
        rpad(n: number, s: string): string;
        parseInt(): number;
        hashCode(): number;
        ligthenDarken(amt: number): string;
    }
}
declare class StringExtension {
    constructor();
}

var Simplicite$1 = Simplicite;

export { $app, $console, $factory, $grant, $nav, $tools, $ui, $view, Ajax, AsyncFunction, Bam, Board, Bootstrap5, BusinessObject, BusinessProcess, CSSCOLORS, Charts, ColorPicker, Crosstab, EventWebSocket, External, ExternalObject, Factory, Feedback, Form, Globals, Grant, GridEditor, Guide, Import, IndexSearch, JQueryExtension, List, Menu, Merge, OCR, ObjectField, Prefs, Search, Session, SimpliciteColors, Social, StringExtension, SyncQueue, Timesheet, Tray, TreeView, UI, UIAction, UIArea, UIBusinessObject, UIBusinessProcess, UICalendar, UIColor, UIComponent, UIEngine, UIExternalObject, UIField, UIFieldDateTime, UILoader, UIMap, UINavigator, UIRender, UISplitter, UITray, UIUtil, UIView, UIViewer, UIWorkflow, Update, View, WebPush, Widget, Workflow, ZIP, buttonsPlugin, Simplicite$1 as default, yearPlugin };
export type { A11yOptions, Action, ActionGroup, ActionHandler, ActionHandlers, ActionLevel, ActionSize, ActionType, ActivityFile, ActivityMetadata, ActivityStatus, Addon, Agenda, AlertCallback, AlertLevel, AlertParam, AlertType, AnyAddon, AnyContainer, AnyContent, Area, AreaParam, Associate, BackendConstants, Bookmark, BookmarkParam, Bookmarks, Button, CSSColors, CalendarParam, CallResponse, Callback, ColorPickerHandler, ColorSet, ConfirmRun, ConstraintFunction, Container, Contrast, CounterParam, CreateLink, CrosstabAxis, CrosstabAxisType, CrosstabData, CrosstabMetadata, CrosstabNavParam, CrosstabNode, CrosstabParam, Datamap, DevOptions, DialogAction, DialogParam, DocumentDB, DropdownItem, EnumItem, EventCloseParam, ExternalData, ExternalMetadata, ExternalParam, FeedbackData, FeedbackParam, FieldAddon, FieldCase, FieldDisplay, FieldFilter, FieldLinkMap, FieldNumFormat, FieldSearch, FieldSearchFixed, FieldValue, Filters, FollowLink, Font, FormActions, FormParam, GetParam, GoogleParam, GridEditorJson, GridEditorOptions, GridEditorParam, GuideMetadata, HSV, IconsMetadata, IndexMetadata, IndexParam, InlineObject, InlineParam, InputAddon, JQueryHandler, JSVG, Job, JobFunction, KeyBoolean, KeyBusinessObjectHook, KeyBusinessProcessHook, KeyConstraint, KeyExternalObject, KeyHash, KeyNumber, KeyObject, KeyObjectHook, KeyString, KeyStrings, Link, ListActions, ListEditMode, ListLayout, ListParam, ListRowsActions, ListSearchMode, ListSelection, LoadParam, LoadPart, LoadPartOnload, LoadTarget, LoadTargetArea, MainMenu, MapParam, MapSettings, MenuGridOptions, MenuItem, MenuParam, MenuSettings, MergeParam, MergeSaveParam, MessageAny, MessageFromBack, MessageJSON, MessageSaveRows, MessageText, MessagesPerRow, MetaObject, ModuleAjax, MonthSelectConfig, MousePos, NavAction, NavFocus, NavHistItem, NavItem, NavParam, NavType, NewTabPosition, News, NotifyObject, NotifyObjectType, OKLAB, ObjectHookFunction, ObjectMetadata, Palette, PaletteColors, PaletteName, ParentObject, PillboxParam, Place, Placemap, Point, Position, PredefSearch, PrefItem, PrefType, PrefefSearch, PrefsParam, PrintTemplate, ProcessAction, ProcessActionType, ProcessMetadata, ProcessParam, ProgressHandler, RGB, RGBA, Rect, RenderFunction, Resource, RoadRender, RowActions, RowData, RowDataMeta, RowGroupBy, RowGroupByKey, RowItem, RowPartial, RowTree, Scope, ScratchPadParam, SearchAjax, SearchAjaxGroupBy, SearchAjaxList, SearchAjaxMetadata, SearchAjaxPartial, SearchAjaxTree, SearchParam, SearchPredefParam, SessionGlobals, Shortcut, ShortcutKey, ShortcutKeys, ShowViewsMode, SimpliciteInterface, Size, SliderParam, SocialParam, SocialPost, SocialStatus, SocialUser, SplitPart, SplitterOptions, SubMenu, SummaryParam, Tab, Tabs, TargetObject, TempPillbox, TempPillboxes, TemplateEntity, TemplateTarget, Theme, ThemeBase, TimesheetData, TimesheetGanttData, TimesheetGanttParam, TimesheetLine, TimesheetMetadata, TimesheetOptions, TimesheetParam, TimesheetPeriod, TimesheetShift, TimesheetTotal, ToastParam, TrackerCallback, TrackerData, TrackerParam, TrackerTask, Transition, TrayActor, TrayCard, TrayColumn, TreeNode, TreeNodeList, TreeParam, UpdateFormParam, UsageUser, UserFilterParam, VIEW_TYPE, ViewFilter, ViewItem, ViewItemContent, ViewItemContentData, ViewItemType, ViewParam, WorkAreaOptions, WorkAreaSize, WorkTabContextMenu, WorkTabInfos, WorkTabOptions };
