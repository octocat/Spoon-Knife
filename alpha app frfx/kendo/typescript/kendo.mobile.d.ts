// Type definitions for Kendo UI

declare module kendo {
    function bind(selector: string, viewModel: any, namespace?: any): void;
    function bind(element: JQuery, viewModel: any, namespace?: any): void;
    function bind(element: Element, viewModel: any, namespace?: any): void;
    function culture(value: string): void;
    function culture(): {
        name: string;
        calendar: {
            AM: string[];
            PM: string[];
            days: {
                names: string[];
                namesAbbr: string[];
                namesShort: string[];
                firstDay: number;
            };
            months: {
                names: string[];
                namesAbbr: string[];
            };
            patterns: {
                D: string;
                F: string;
                G: string;
                M: string;
                T: string;
                Y: string;
                d: string;
                g: string;
                m: string;
                s: string;
                t: string;
                u: string;
                y: string;
            };
            twoDigitYearMax: number;
        };
        calendars: {
            standard: {
                AM: string[];
                PM: string[];
                days: {
                    names: string[];
                    namesAbbr: string[];
                    namesShort: string[];
                    firstDay: number;
                };
                months: {
                    names: string[];
                    namesAbbr: string[];
                };
                patterns: {
                    D: string;
                    F: string;
                    G: string;
                    M: string;
                    T: string;
                    Y: string;
                    d: string;
                    g: string;
                    m: string;
                    s: string;
                    t: string;
                    u: string;
                    y: string;
                };
                twoDigitYearMax: number;
            };
        };
        numberFormat: {
            currency: {
                decimals: number;
                groupSize: number[];
                pattern: string[];
                symbol: string;
            };
            decimals: number;
            groupSize: number[];
            pattern: string[];
            percent: {
                decimals: number;
                groupSize: number[];
                pattern: string[];
                symbol: string;
            };
        };
    };

    var cultures: {[culture:string] : {
        name?: string;
        calendar?: {
            AM: string[];
            PM: string[];
            days: {
                names: string[];
                namesAbbr: string[];
                namesShort: string[];
                firstDay: number;
            };
            months: {
                names: string[];
                namesAbbr: string[];
            };
            patterns: {
                D: string;
                F: string;
                G: string;
                M: string;
                T: string;
                Y: string;
                d: string;
                g: string;
                m: string;
                s: string;
                t: string;
                u: string;
                y: string;
            };
            twoDigitYearMax: number;
        };
        calendars?: {
            standard: {
                AM: string[];
                PM: string[];
                days: {
                    names: string[];
                    namesAbbr: string[];
                    namesShort: string[];
                    firstDay: number;
                };
                months: {
                    names: string[];
                    namesAbbr: string[];
                };
                patterns: {
                    D: string;
                    F: string;
                    G: string;
                    M: string;
                    T: string;
                    Y: string;
                    d: string;
                    g: string;
                    m: string;
                    s: string;
                    t: string;
                    u: string;
                    y: string;
                };
                twoDigitYearMax: number;
            };
        };
        numberFormat?: {
            currency: {
                decimals: number;
                groupSize: number[];
                pattern: string[];
                symbol: string;
            };
            decimals: number;
            groupSize: number[];
            pattern: string[];
            percent: {
                decimals: number;
                groupSize: number[];
                pattern: string[];
                symbol: string;
            };
        };
    }};

    function destroy(selector: string): void;
    function destroy(element: Element): void;
    function destroy(element: JQuery): void;
    function format(format: string, ...values: any[]): string;

    function fx(selector: string): effects.Element;
    function fx(element: Element): effects.Element;
    function fx(element: JQuery): effects.Element;

    function htmlEncode(value: string): string;
    function init(selector: string, ...namespaces: any[]): void;
    function init(element: JQuery, ...namespaces: any[]): void;
    function init(element: Element, ...namespaces: any[]): void;
    function observable(data: any): kendo.data.ObservableObject;
    function observableHierarchy(array: any[]): kendo.data.ObservableArray;
    function parseDate(value: any, format?: string, culture?: string): Date;
    function parseFloat(value: any, culture?: string): number;
    function parseInt(value: any, culture?: string): number;
    function render(template:(data: any) => string, data: any[]): string;
    function resize(selector: string): void;
    function resize(element: JQuery): void;
    function resize(element: Element): void;
    function stringify(value: Object): string;
    function template(template: string, options?: TemplateOptions): (data: any) => string;
    function touchScroller(selector: string): void;
    function touchScroller(element: Element): void;
    function touchScroller(element: JQuery): void;
    function toString(value: number, format: string): string;
    function toString(value: Date, format: string): string;
    function unbind(selector: string): void;
    function unbind(element: JQuery): void;
    function unbind(element: Element): void;
    function guid(): string;
    function widgetInstance(element: JQuery, suite: typeof kendo.ui): kendo.ui.Widget;
    function widgetInstance(element: JQuery, suite: typeof kendo.mobile.ui): kendo.ui.Widget;


    var ns: string;

    var keys: {
        INSERT: number;
        DELETE: number;
        BACKSPACE: number;
        TAB: number;
        ENTER: number;
        ESC: number;
        LEFT: number;
        UP: number;
        RIGHT: number;
        DOWN: number;
        END: number;
        HOME: number;
        SPACEBAR: number;
        PAGEUP: number;
        PAGEDOWN: number;
        F2: number;
        F10: number;
        F12: number;
    }

    var support: {
        touch: boolean;
        pointers: boolean;
        scrollbar(): number;
        hasHW3D: boolean;
        hasNativeScrolling: boolean;
        devicePixelRatio: number;
        placeHolder: boolean;
        zoomLevel: number;
        mobileOS: {
            device: string;
            tablet: any;
            browser: string;
            name: string;
            majorVersion: string;
            minorVersion: string;
            flatVersion: number;
            appMode: boolean;
        };
        browser: {
            msie: boolean;
            webkit: boolean;
            safari: boolean;
            opera: boolean;
            version: string;
        };
    }

    interface TemplateOptions {
        paramName?: string;
        useWithBlock?: boolean;
    }

    class Class {
        static fn: Class;
        static extend(prototype: Object): Class;
    }

    class Observable extends Class {
        static fn: Observable;
        static extend(prototype: Object): Observable;

        bind(eventName: string, handler: Function): Observable;
        one(eventName: string, handler: Function): Observable;
        trigger(eventName: string, e?: any): boolean;
        unbind(eventName: string, handler?: any): Observable;
    }

    interface ViewOptions {
        tagName?: string;
        wrap?: boolean;
        model?: Object;
        init?: (e: ViewEvent) => void;
        show?: (e: ViewEvent) => void;
        hide?: (e: ViewEvent) => void;
    }

    interface ViewEvent {
        sender: View;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    class View extends Observable {
        constructor(element: Element, options?: ViewOptions);
        constructor(element: string, options?: ViewOptions);
        init(element: Element, options?: ViewOptions): void;
        init(element: string, options?: ViewOptions): void;
        render(container?: any): JQuery;
        destroy(): void;
        element: JQuery;
        content: any;
        tagName: string;
        model: Object;
    }

    class Layout extends View {
        showIn(selector: string, view: View): void;
        regions: { [selector: string]: View; };
    }

    class History extends Observable {
        start(options: Object): void;
        stop(): void;
        current: string;
        root: string;
        change(callback: Function): void;
        navigate(location: string, silent?: boolean): void;
    }

    var history: History;

    interface RouterOptions {
        init?: (e: RouterEvent) => void;
        routeMissing?: (e: RouterEvent) => void;
        change?: (e: RouterEvent) => void;
    }

    interface RouterEvent {
        sender: Router;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
        url: string;
    }

    class Route extends Class {
        route: RegExp;
        callback(url: string): void;
        worksWith(url: string): void;
    }

    class Router extends Observable {
        constructor(options?: RouterOptions);
        init(options?: RouterOptions): void;
        start(): void;
        destroy(): void;
        route(route: string, callback: Function): void;
        navigate(location: string, silent?: boolean): void;
        routes: Route[];
    }

}

declare module kendo.effects {
    interface Element {
        expand(direction: string): effects.Expand;
        expandHorizontal(): effects.Expand;
        expandVertical(): effects.Expand;
        fade(direction: string): effects.Fade;
        fadeIn(): effects.Fade;
        fadeOut(): effects.Fade;
        flip(axis: string, face: JQuery, back: JQuery): effects.Flip;
        flipHorizontal(face: JQuery, back: JQuery): effects.Flip;
        flipVertical(face: JQuery, back: JQuery): effects.Flip;
        pageturn(axis: string, face: JQuery, back: JQuery): effects.PageTurn;
        pageturnHorizontal(face: JQuery, back: JQuery): effects.PageTurn;
        pageturnVertical(face: JQuery, back: JQuery): effects.PageTurn;
        slideIn(direction: string): effects.SlideIn;
        slideInDown(): effects.SlideIn;
        slideInLeft(): effects.SlideIn;
        slideInRight(): effects.SlideIn;
        slideInUp(): effects.SlideIn;
        tile(direction: string, previous: JQuery): effects.Tile;
        tileDown(previous: JQuery): effects.Tile;
        tileLeft(previous: JQuery): effects.Tile;
        tileRight(previous: JQuery): effects.Tile;
        tileUp(previous: JQuery): effects.Tile;
        transfer(target: JQuery): effects.Transfer;
        zoom(direction: string): effects.Zoom;
        zoomIn(): effects.Zoom;
        zoomOut(): effects.Zoom;
    }

    interface Effect {
        play(): JQueryPromise<any>;
        reverse(): JQueryPromise<any>;
        duration(value: number): Effect;
        add(effect: Effect): Effect;
        stop(): Effect;
    }

    interface Expand extends Effect {
        duration(value: number): Expand;
        direction(value: string): Expand;
        stop(): Expand;
        add(effect: Effect): Expand;
    }

    interface Fade extends Effect {
        duration(value: number): Fade;
        direction(value: string): Fade;
        stop(): Fade;
        add(effect: Effect): Fade;
        startValue(value: number): Fade;
        endValue(value: number): Fade;
    }

    interface Flip extends Effect {
        duration(value: number): Flip;
        direction(value: string): Flip;
        stop(): Flip;
        add(effect: Effect): Flip;
    }

    interface PageTurn extends Effect {
        duration(value: number): PageTurn;
        direction(value: string): PageTurn;
        stop(): PageTurn;
        add(effect: Effect): PageTurn;
    }

    interface SlideIn extends Effect {
        duration(value: number): SlideIn;
        direction(value: string): SlideIn;
        stop(): SlideIn;
        add(effect: Effect): SlideIn;
    }

    interface Tile extends Effect {
        duration(value: number): Tile;
        direction(value: string): Tile;
        stop(): Tile;
        add(effect: Effect): Tile;
    }

    interface Transfer extends Effect {
        duration(value: number): Transfer;
        stop(): Transfer;
        add(effect: Effect): Transfer;
    }

    interface Zoom extends Effect {
        duration(value: number): Zoom;
        direction(value: string): Zoom;
        stop(): Zoom;
        add(effect: Effect): Zoom;
        startValue(value: number): Zoom;
        endValue(value: number): Zoom;
    }
}

declare module kendo.data {
    interface ObservableObjectEvent {
        sender?: ObservableObject;
        field?: string;
    }

    interface ObservableObjectSetEvent extends ObservableObjectEvent {
        value?: any;
        preventDefault?: Function;
    }


    class Binding extends Observable {
        source: any;
        parents: any[];
        path: string;
        dependencies: { [path: string]: boolean; };
        observable: boolean;
        constructor(parents: any[], path: string);
        change(e: Object): void;
        start(source: kendo.Observable): void;
        stop(source: kendo.Observable): void;
        get (): any;
        set (value: any): void;
        destroy(): void;
    }

    class EventBinding extends Binding {
        get (): void;
    }

    class TemplateBinding extends Binding {
        constructor(source: kendo.Observable, path: string, template: Function);
        render(value: Object): string;
    }

    module binders { }

    interface Bindings {
        [key: string]: Binding;
    }

    class Binder extends Class {
        static fn: Binder;
        static extend(prototype: Object): Binder;

        element: any;
        bindings: Bindings;
        constructor(element: any, bindings: Bindings, options?: BinderOptions);
        init(element: any, bindings: Bindings, options?: BinderOptions): void;
        bind(binding: Binding, attribute: string): void;
        destroy(): void;
        refresh(): void;
        refresh(attribute: string): void;
        options: BinderOptions;
    }

    interface BinderOptions {
    }

    class ObservableObject extends Observable{
        constructor(value?: any);
        init(value?: any): void;
        get(name: string): any;
        parent(): ObservableObject;
        set(name: string, value: any): void;
        toJSON(): Object;
        uid: string;
    }

    class Model extends ObservableObject {
        idField: string;
        _defaultId: any;
        fields: DataSourceSchemaModelFields;
        defaults: {
            [field: string]: any;
        };
        constructor(data?: any);
        init(data?: any):void;
        dirty: boolean;
        id: any;
        editable(field: string): boolean;
        isNew(): boolean;
        static idField: string;
        static fields: DataSourceSchemaModelFields;
        static define(options: DataSourceSchemaModelWithFieldsObject): typeof Model;
        static define(options: DataSourceSchemaModelWithFieldsArray): typeof Model;
    }

    class SchedulerEvent extends Model {
        constructor(data?: any);
        init(data?: any): void;

        description: string;
        end: Date;
        endTimezone: string;
        isAllDay: boolean;
        id: any;
        start: Date;
        startTimezone: string;
        recurrenceId: any;
        recurrenceRule: string;
        recurrenceException: string;
        static idField: string;
        static fields: DataSourceSchemaModelFields;
        static define(options: DataSourceSchemaModelWithFieldsObject): typeof SchedulerEvent;
        static define(options: DataSourceSchemaModelWithFieldsArray): typeof SchedulerEvent;
    }

    class Node extends Model {
        children: HierarchicalDataSource;

        append(model: any): void;
        level(): number;
        load(id: any): void;
        loaded(value: boolean): void;
        loaded(): boolean;
        parentNode(): Node;
    }

    class SchedulerDataSource extends DataSource {
        add(model: Object): kendo.data.SchedulerEvent;
        add(model: kendo.data.SchedulerEvent): kendo.data.SchedulerEvent;
        at(index: number): kendo.data.SchedulerEvent;
        cancelChanges(model?: kendo.data.SchedulerEvent): void;
        get(id: any): kendo.data.SchedulerEvent;
        getByUid(uid: string): kendo.data.SchedulerEvent;
        indexOf(value: kendo.data.SchedulerEvent): number;
        insert(index: number, model: kendo.data.SchedulerEvent): kendo.data.SchedulerEvent;
        insert(index: number, model: Object): kendo.data.SchedulerEvent;
        remove(model: kendo.data.SchedulerEvent): void;
    }

    class HierarchicalDataSource extends DataSource {
        constructor(options?: HierarchicalDataSourceOptions);
        init(options?: HierarchicalDataSourceOptions): void;
    }

    interface HierarchicalDataSourceOptions extends DataSourceOptions {
        schema?: HierarchicalDataSourceSchema;
    }


    interface HierarchicalDataSourceSchema extends DataSourceSchemaWithOptionsModel {
        model?: HierarchicalDataSourceSchemaModel;
    }

    interface HierarchicalDataSourceSchemaModel extends DataSourceSchemaModel {
        hasChildren?: any;
        children?: any;
    }

    interface DataSourceTransport {
        parameterMap?(data: DataSourceTransportParameterMapData, type: string): any;
    }

    interface DataSourceParameterMapDataAggregate {
        field?: string;
        aggregate?: string;
    }

    interface DataSourceParameterMapDataGroup {
        aggregate?: DataSourceParameterMapDataAggregate[];
        field?: string;
        dir?: string;
    }

    interface DataSourceParameterMapDataFilter {
        field?: string;
        filters?: DataSourceParameterMapDataFilter[];
        logic?: string;
        operator?: string;
        value?: any;
    }

    interface DataSourceParameterMapDataSort {
        field?: string;
        dir?: string;
    }

    interface DataSourceTransportParameterMapData {
        aggregate?: DataSourceParameterMapDataAggregate[];
        group?: DataSourceParameterMapDataGroup[];
        filter?: DataSourceParameterMapDataFilter;
        models?: Model[];
        page?: number;
        pageSize?: number;
        skip?: number;
        sort?: DataSourceParameterMapDataSort[];
        take?: number;
    }

    interface DataSourceSchema {
        model?: any;
    }

    interface DataSourceSchemaWithOptionsModel extends DataSourceSchema {
        model?: DataSourceSchemaModel;
    }

    interface DataSourceSchemaWithConstructorModel extends DataSourceSchema {
        model?:  typeof Model;
    }

    interface DataSourceSchemaModel {
        id?: string;
        fields?: any;
    }

    interface DataSourceSchemaModelWithFieldsArray extends DataSourceSchemaModel {
        fields?: DataSourceSchemaModelField[];
    }

    interface DataSourceSchemaModelWithFieldsObject extends DataSourceSchemaModel {
        fields?: DataSourceSchemaModelFields;
    }

    interface DataSourceSchemaModelFields {
        [index: string]: DataSourceSchemaModelField;
    }

    interface DataSourceSchemaModelField {
        field?: string;
        from?: string;
        defaultValue?: any;
        editable?: boolean;
        nullable?: boolean;
        parse?: Function;
        type?: string;
        validation?: DataSourceSchemaModelFieldValidation;
    }

    interface DataSourceSchemaModelFieldValidation {
        required?: boolean;
        min?: any;
        max?: any;
    }

    class ObservableArray extends Observable {
        constructor(array?: any[]);
        init(array?: any[]): void;
        length: number;
        join(separator: string): string;
        parent(): ObservableObject;
        pop(): ObservableObject;
        push(...items: any[]): number;
        slice(begin: number, end?: number): any[];
        splice(start: number): any[];
        splice(start: number, deleteCount: number, ...items: any[]): any[];
        shift(): any;
        toJSON(): any[];
        unshift(...items: any[]): number;
        wrapAll(source: Object, target: Object): any;
        wrap(object: Object, parent: Object): any;
        indexOf(item: any): number;
        forEach(callback: (item: Object, index: number, source: ObservableArray) => void ): void;
        map(callback: (item: Object, index: number, source: ObservableArray) => any): any[];
        filter(callback: (item: Object, index: number, source: ObservableArray) => boolean): any[];
        find(callback: (item: Object, index: number, source: ObservableArray) => boolean): any;
        every(callback: (item: Object, index: number, source: ObservableArray) => boolean): boolean;
        some(callback: (item: Object, index: number, source: ObservableArray) => boolean): boolean;
        remove(item: Object): void;
    }

    interface ObservableArrayEvent {
        field?: string;
        action?: string;
        index?: number;
        items?: kendo.data.Model[];
    }

    class DataSource extends Observable{
        constructor(options?: DataSourceOptions);
        init(options?: DataSourceOptions): void;
        static create(options?: DataSourceOptions): DataSource;
        options: DataSourceOptions;
        add(model: Object): kendo.data.Model;
        add(model: kendo.data.Model): kendo.data.Model;
        aggregate(val?: any): any;
        aggregates(): any;
        at(index: number): kendo.data.ObservableObject;
        cancelChanges(model?: kendo.data.Model): void;
        data(): kendo.data.ObservableArray;
        data(value: any): void;
        fetch(callback?: Function): void;
        filter(filters: DataSourceFilterItem): void;
        filter(filters: DataSourceFilterItem[]): void;
        filter(filters: DataSourceFilters): void;
        filter(): DataSourceFilters;
        get(id: any): kendo.data.Model;
        getByUid(uid: string): kendo.data.Model;
        group(groups: any): void;
        group(): any;
        hasChanges(): boolean;
        indexOf(value: kendo.data.ObservableObject): number;
        insert(index: number, model: kendo.data.Model): kendo.data.Model;
        insert(index: number, model: Object): kendo.data.Model;
        page(): number;
        page(page: number): void;
        pageSize(): number;
        pageSize(size: number): void;
        query(options?: any): void;
        read(data?: any): void;
        remove(model: kendo.data.Model): void;
        sort(sort: DataSourceSortItem): void;
        sort(sort: DataSourceSortItem[]): void;
        sort(): DataSourceSortItem[];
        sync(): void;
        total(): number;
        totalPages(): number;
        view(): kendo.data.ObservableArray;
    }

    interface DataSourceAggregateItem {
        field?: string;
        aggregate?: string;
    }

    interface DataSourceFilter {
    }

    interface DataSourceFilterItem extends DataSourceFilter {
        operator?: string;
        field?: string;
        value?: any;
    }

    interface DataSourceFilters extends DataSourceFilter {
        logic?: string;
        filters?: DataSourceFilter[];
    }

    interface DataSourceGroupItemAggregate {
        field?: string;
        aggregate?: string;
    }

    interface DataSourceGroupItem {
        field?: string;
        dir?: string;
        aggregates?: DataSourceGroupItemAggregate[];
    }

    interface DataSourceSchema {
        aggregates?: any;
        data?: any;
        errors?: any;
        groups?: any;
        parse?: Function;
        total?: any;
        type?: string;
    }

    interface DataSourceSortItem {
        field?: string;
        dir?: string;
    }

    interface DataSourceTransportCreate {
        cache?: boolean;
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface DataSourceTransportDestroy {
        cache?: boolean;
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface DataSourceTransportRead {
        cache?: boolean;
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface DataSourceTransportUpdate {
        cache?: boolean;
        contentType?: string;
        data?: any;
        dataType?: string;
        type?: string;
        url?: any;
    }

    interface DataSourceTransport {
        create?: any;
        destroy?: any;
        read?: any;
        update?: any;
    }

    interface DataSourceTransportWithObjectOperations extends DataSourceTransport {
        create?: DataSourceTransportCreate;
        destroy?: DataSourceTransportDestroy;
        read?: DataSourceTransportRead;
        update?: DataSourceTransportUpdate;
    }

    interface DataSourceTransportWithFunctionOperations extends DataSourceTransport {
        create?: (options: DataSourceTransportOptions) => void;
        destroy?: (options: DataSourceTransportOptions) => void;
        read?: (options: DataSourceTransportReadOptions) => void;
        update?: (options: DataSourceTransportOptions) => void;
    }

    interface DataSourceTransportOptions {
        success: (data?: any) => void;
        error: (error?: any) => void;
        data: any;
    }

    interface DataSourceTransportReadOptionsData {
        sort?: DataSourceSortItem[];
        filter?: DataSourceFilters;
        take?: number;
        skip?: number;
    }

    interface DataSourceTransportReadOptions extends DataSourceTransportOptions {
        data: DataSourceTransportReadOptionsData;
    }

    interface DataSourceTransportBatchOptionsData {
        models: any[];
    }

    interface DataSourceTransportBatchOptions extends DataSourceTransportOptions {
        data: DataSourceTransportBatchOptionsData;
    }

    interface DataSourceOptions {
        aggregate?: DataSourceAggregateItem[];
        autoSync?: boolean;
        batch?: boolean;
        data?: any;
        filter?: any;
        group?: DataSourceGroupItem[];
        page?: number;
        pageSize?: number;
        schema?: DataSourceSchema;
        serverAggregates?: boolean;
        serverFiltering?: boolean;
        serverGrouping?: boolean;
        serverPaging?: boolean;
        serverSorting?: boolean;
        sort?: any;
        transport?: DataSourceTransport;
        type?: string;
        change? (e: DataSourceChangeEvent): void;
        error?(e: DataSourceErrorEvent): void;
        sync?(e: DataSourceEvent): void;
        requestStart?(e: DataSourceRequestStartEvent): void;
        requestEnd?(e: DataSourceRequestEndEvent): void;
    }

    interface DataSourceEvent {
        sender?: DataSource;
    }

    interface DataSourceItemOrGroup {
    }

    interface DataSourceGroup extends DataSourceItemOrGroup {
        aggregates: any[];
        field: string;
        hasSubgroups: boolean;
        items: DataSourceItemOrGroup[];
        value: any;
    }

    interface DataSourceChangeEvent extends DataSourceEvent {
        field?: string;
        value?: Model;
        action?: string;
        index?: number;
        items?: DataSourceItemOrGroup[];
        node?: any;
    }

    interface DataSourceErrorEvent extends DataSourceEvent {
        xhr: JQueryXHR;
        status: string;
        errorThrown: any;
        errors?: any;
    }

    interface DataSourceRequestStartEvent extends DataSourceEvent {
    }

    interface DataSourceRequestEndEvent extends DataSourceEvent {
        response?: any;
        type?: string;
    }
}

declare module kendo.data.transports {
    var odata : DataSourceTransport;
}

declare module kendo.ui {
    function progress(container: JQuery, toggle: boolean): void;

    class Widget extends Observable {
        static fn: Widget;
        static extend(prototype: Object): Widget;

        constructor(element: Element, options?: Object);
        constructor(element: JQuery, options?: Object);
        constructor(selector: String, options?: Object);
        init(element: Element, options?: Object): void;
        init(element: JQuery, options?: Object): void;
        init(selector: String, options?: Object): void;
        destroy(): void;
        element: JQuery;
        setOptions(options: Object): void;
        resize(force?: boolean): void;
    }

    function plugin(widget: typeof kendo.ui.Widget, register?: typeof kendo.ui, prefix?: String): void;
    function plugin(widget: any, register?: typeof kendo.ui, prefix?: String): void;
    function plugin(widget: typeof kendo.ui.Widget, register?: typeof kendo.mobile.ui, prefix?: String): void;
    function plugin(widget: any, register?: typeof kendo.mobile.ui, prefix?: String): void;

    class Draggable extends kendo.ui.Widget{
        element: JQuery;
        currentTarget: JQuery;
        constructor(element: Element, options?: DraggableOptions);
        options: DraggableOptions;
    }

    interface DraggableEvent extends JQueryEventObject {
        sender?: Draggable;
    }

    class DropTarget extends kendo.ui.Widget{
        element: JQuery;
        constructor(element: Element, options?: DropTargetOptions);
        options: DropTargetOptions;
        static destroyGroup(groupName: string): void;
    }

    interface DropTargetOptions {
        group?: string;
        dragenter?(e: DropTargetDragenterEvent): void;
        dragleave?(e: DropTargetDragleaveEvent): void;
        drop?(e: DropTargetDropEvent): void;
    }

    interface DropTargetEvent extends JQueryEventObject {
        sender?: DropTarget;
    }

    interface DropTargetDragenterEvent extends DropTargetEvent {
        draggable?: kendo.ui.Draggable;
    }

    interface DropTargetDragleaveEvent extends DropTargetEvent {
        draggable?: kendo.ui.Draggable;
    }

    interface DropTargetDropEvent extends DropTargetEvent {
        draggable?: kendo.ui.Draggable;
    }

    class DropTargetArea extends kendo.ui.Widget{
        element: JQuery;
        constructor(element: Element, options?: DropTargetAreaOptions);
        options: DropTargetAreaOptions;
    }

    interface DropTargetAreaOptions {
        group?: string;
        filter?: string;
        dragenter?(e: DropTargetAreaDragenterEvent): void;
        dragleave?(e: DropTargetAreaDragleaveEvent): void;
        drop?(e: DropTargetAreaDropEvent): void;
    }

    interface DropTargetAreaEvent extends JQueryEventObject {
        sender: DropTargetArea;
    }

    interface DropTargetAreaDragenterEvent extends DropTargetAreaEvent {
        draggable?: JQuery;
    }

    interface DropTargetAreaDragleaveEvent extends DropTargetAreaEvent {
        draggable?: JQuery;
    }

    interface DropTargetAreaDropEvent extends DropTargetAreaEvent {
        draggable?: kendo.ui.Draggable;
        dropTarget?: JQuery;
    }

    interface DraggableOptions {
        axis?: string;
        cursorOffset?: any;
        distance?: number;
        group?: string;
        hint?: Function;
        drag?(e: DraggableEvent): void;
        dragcancel?(e: DraggableEvent): void;
        dragend?(e: DraggableEvent): void;
        dragstart?(e: DraggableEvent): void;
    }

    interface GridColumnEditorOptions {
        field?: string;
        format?: string;
        model?: kendo.data.Model;
        values?: any[];
    }

    interface GridColumn {
        editor?(container: JQuery, options: GridColumnEditorOptions): void;
    }
}

declare module kendo.mobile {
    function init(selector: string): void;
    function init(element: JQuery): void;
    function init(element: Element): void;

    class Application extends Observable {
        constructor(element?: any, options?: ApplicationOptions);
        init(element?: any, options?: ApplicationOptions): void;
        options: ApplicationOptions;
        hideLoading(): void;
        navigate(url: string, transition?: string): void;
        scroller(): kendo.mobile.ui.Scroller;
        showLoading(): void;
        view(): kendo.mobile.ui.View;
    }

    interface ApplicationOptions {
        hideAddressBar?: boolean;
        updateDocumentTitle?: boolean;
        initial?: string;
        layout?: string;
        loading?: string;
        platform?: string;
        serverNavigation?: boolean;
        transition?: string;
    }

    interface ApplicationEvent {
        sender: Application;
    }
}

declare module kendo.mobile.ui {

    class Widget extends kendo.ui.Widget {
    }

    interface TouchAxis {
        location?: number;
        startLocation?: number;
        client?: number;
        delta?: number;
        velocity?: number;
    }

    interface TouchEventOptions {
        target?: JQuery;
        x?: TouchAxis;
        y?: TouchAxis;
    }

    interface Point {
        x?: number;
        y?: number;
    }
}
declare module kendo {
    class Color extends Observable {
        options: ColorOptions;
        /**
        Computes the relative luminance between two colors.
        @method
        @returns The relative luminance.
        */
        diff(): number;
        /**
        Compares two color objects for equality.
        @method
        @returns returns true if the two colors are the same. Otherwise, false
        */
        equals(): boolean;
    }

    interface ColorOptions {
        name?: string;
    }

    interface ColorEvent {
        sender: Color;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


}
declare module kendo.mobile.ui {
    class ActionSheet extends kendo.mobile.ui.Widget {
        static fn: ActionSheet;
        static extend(proto: Object): ActionSheet;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ActionSheetOptions);
        options: ActionSheetOptions;
        /**
        Close the ActionSheet.
        @method
        */
        close(): void;
        /**
        Prepares the ActionSheet for safe removal from DOM. Detaches all event handlers and removes jQuery.data attributes to avoid memory leaks. Calls destroy method of any child Kendo widgets.
        @method
        */
        destroy(): void;
        /**
        Open the ActionSheet.
        @method
        @param target - (optional) The target element of the ActionSheet, available in the callback methods.Notice The target element is mandatory on tablets, as the ActionSheet widget positions itself relative to opening element when a tablet is detected.
        @param context - (optional) The context of the ActionSheet, available in the callback methods.
        */
        open(target: JQuery, context: any): void;
    }

    interface ActionSheetPopup {
        /**
        The direction to which the popup will expand, relative to the target that opened it.
        @member {any}
        */
        direction?: any;
        /**
        The height of the popup in pixels.
        @member {any}
        */
        height?: any;
        /**
        The width of the popup in pixels.
        @member {any}
        */
        width?: any;
    }

    interface ActionSheetOptions {
        name?: string;
        /**
        The text of the cancel button.
        @member {string}
        */
        cancel?: string;
        /**
        The popup configuration options (tablet only).
        @member {ActionSheetPopup}
        */
        popup?: ActionSheetPopup;
        /**
        By default, the actionsheet opens as a full screen dialog on a phone device or as a popover if a tablet is detected. Setting the type to "phone" or "tablet" will force the looks of the widget regardless of the device.
        @member {string}
        */
        type?: string;
        /**
        Fires when the ActionSheet is closed.
        */
        close?(e: ActionSheetEvent): void;
        /**
        Fires when the ActionSheet is opened.
        */
        open?(e: ActionSheetOpenEvent): void;
    }

    interface ActionSheetEvent {
        sender: ActionSheet;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ActionSheetOpenEvent extends ActionSheetEvent {
        /**
        The invocation target of the ActionSheet.
        @member {JQuery}
        */
        target?: JQuery;
        /**
        The defined ActionSheet context.
        @member {JQuery}
        */
        context?: JQuery;
    }


    class BackButton extends kendo.mobile.ui.Widget {
        static fn: BackButton;
        static extend(proto: Object): BackButton;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: BackButtonOptions);
        options: BackButtonOptions;
        /**
        Prepares the BackButton for safe removal from DOM. Detaches all event handlers and removes jQuery.data attributes to avoid memory leaks. Calls destroy method of any child Kendo widgets.
        @method
        */
        destroy(): void;
    }

    interface BackButtonOptions {
        name?: string;
        /**
        Fires when the user taps the button.
        */
        click?(e: BackButtonClickEvent): void;
    }

    interface BackButtonEvent {
        sender: BackButton;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface BackButtonClickEvent extends BackButtonEvent {
        /**
        The clicked DOM element
        @member {JQuery}
        */
        target?: JQuery;
        /**
        The button DOM element
        @member {JQuery}
        */
        button?: JQuery;
    }


    class Button extends kendo.mobile.ui.Widget {
        static fn: Button;
        static extend(proto: Object): Button;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ButtonOptions);
        options: ButtonOptions;
        /**
        Introduced in Q1 2013 SP Sets a badge on the Button with the specified value. If invoked without parameters, returns the current badge value. Set the value to false to remove the badge.
        @method
        @param value - The target value to be set or false to be removed.
        @returns the badge value if invoked without parameters, otherwise the Button object.
        */
        badge(value: string): string;
        /**
        Introduced in Q1 2013 SP Sets a badge on the Button with the specified value. If invoked without parameters, returns the current badge value. Set the value to false to remove the badge.
        @method
        @param value - The target value to be set or false to be removed.
        @returns the badge value if invoked without parameters, otherwise the Button object.
        */
        badge(value: boolean): string;
        /**
        Prepares the Button for safe removal from DOM. Detaches all event handlers and removes jQuery.data attributes to avoid memory leaks. Calls destroy method of any child Kendo widgets.
        @method
        */
        destroy(): void;
        /**
        Changes the enabled state of the widget.
        @method
        @param enable - Whether to enable or disable the widget.
        */
        enable(enable: boolean): void;
    }

    interface ButtonOptions {
        name?: string;
        /**
        The badge of the button.
        @member {string}
        */
        badge?: string;
        /**
        If set to false the widget will be disabled and will not allow the user to click it. The widget is enabled by default.
        @member {boolean}
        */
        enable?: boolean;
        /**
        The icon of the button. It can be either one of the built-in icons, or a custom one.
        @member {string}
        */
        icon?: string;
        /**
        Fires when the user taps the button.
        */
        click?(e: ButtonClickEvent): void;
    }

    interface ButtonEvent {
        sender: Button;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ButtonClickEvent extends ButtonEvent {
        /**
        The clicked DOM element
        @member {JQuery}
        */
        target?: JQuery;
        /**
        The button DOM element
        @member {JQuery}
        */
        button?: JQuery;
    }


    class ButtonGroup extends kendo.mobile.ui.Widget {
        static fn: ButtonGroup;
        static extend(proto: Object): ButtonGroup;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ButtonGroupOptions);
        options: ButtonGroupOptions;
        /**
        Introduced in Q1 2013 SP Sets a badge on one of the ButtonGroup buttons with the specified value. If invoked without parameters, returns the button's current badge value. Set the value to false to remove the badge.
        @method
        @param button - The target button specified either as a jQuery selector/object or as an button index.
        @param value - The target value to be set or false to be removed.
        @returns the badge value if invoked without parameters, otherwise the ButtonGroup object.
        */
        badge(button: string, value: string): string;
        /**
        Introduced in Q1 2013 SP Sets a badge on one of the ButtonGroup buttons with the specified value. If invoked without parameters, returns the button's current badge value. Set the value to false to remove the badge.
        @method
        @param button - The target button specified either as a jQuery selector/object or as an button index.
        @param value - The target value to be set or false to be removed.
        @returns the badge value if invoked without parameters, otherwise the ButtonGroup object.
        */
        badge(button: string, value: boolean): string;
        /**
        Introduced in Q1 2013 SP Sets a badge on one of the ButtonGroup buttons with the specified value. If invoked without parameters, returns the button's current badge value. Set the value to false to remove the badge.
        @method
        @param button - The target button specified either as a jQuery selector/object or as an button index.
        @param value - The target value to be set or false to be removed.
        @returns the badge value if invoked without parameters, otherwise the ButtonGroup object.
        */
        badge(button: number, value: string): string;
        /**
        Introduced in Q1 2013 SP Sets a badge on one of the ButtonGroup buttons with the specified value. If invoked without parameters, returns the button's current badge value. Set the value to false to remove the badge.
        @method
        @param button - The target button specified either as a jQuery selector/object or as an button index.
        @param value - The target value to be set or false to be removed.
        @returns the badge value if invoked without parameters, otherwise the ButtonGroup object.
        */
        badge(button: number, value: boolean): string;
        /**
        Get the currently selected Button.
        @method
        @returns the jQuery object representing the currently selected button.
        */
        current(): JQuery;
        /**
        Prepares the ButtonGroup for safe removal from DOM. Detaches all event handlers and removes jQuery.data attributes to avoid memory leaks. Calls destroy method of any child Kendo widgets.
        @method
        */
        destroy(): void;
        /**
        Select a Button.
        @method
        @param li - LI element or index of the Button.
        */
        select(li: JQuery): void;
        /**
        Select a Button.
        @method
        @param li - LI element or index of the Button.
        */
        select(li: number): void;
    }

    interface ButtonGroupOptions {
        name?: string;
        /**
        Defines the initially selected Button (zero based index).
        @member {number}
        */
        index?: number;
        /**
        Sets the DOM event used to select the button. Accepts "up" as an alias for touchend, mouseup and MSPointerUp vendor specific events.By default, buttons are selected immediately after the user presses the button (on touchstart or mousedown or MSPointerDown, depending on the mobile device).
However, if the widget is placed in a scrollable view, the user may accidentally press the button when scrolling. In such cases, it is recommended to set this option to "up".
        @member {string}
        */
        selectOn?: string;
        /**
        Fires when a Button is selected.
        */
        select?(e: ButtonGroupSelectEvent): void;
    }

    interface ButtonGroupEvent {
        sender: ButtonGroup;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ButtonGroupSelectEvent extends ButtonGroupEvent {
        /**
        The index of the selected button
        @member {number}
        */
        index?: number;
    }


    class DetailButton extends kendo.mobile.ui.Widget {
        static fn: DetailButton;
        static extend(proto: Object): DetailButton;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: DetailButtonOptions);
        options: DetailButtonOptions;
        /**
        Prepares the DetailButton for safe removal from DOM. Detaches all event handlers and removes jQuery.data attributes to avoid memory leaks. Calls destroy method of any child Kendo widgets.
        @method
        */
        destroy(): void;
    }

    interface DetailButtonOptions {
        name?: string;
        /**
        Fires when the user taps the button.
        */
        click?(e: DetailButtonClickEvent): void;
    }

    interface DetailButtonEvent {
        sender: DetailButton;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface DetailButtonClickEvent extends DetailButtonEvent {
        /**
        The clicked DOM element
        @member {JQuery}
        */
        target?: JQuery;
        /**
        The button DOM element
        @member {JQuery}
        */
        button?: JQuery;
    }


    class Drawer extends kendo.mobile.ui.Widget {
        static fn: Drawer;
        static extend(proto: Object): Drawer;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: DrawerOptions);
        options: DrawerOptions;
        /**
        Prepares the Drawer for safe removal from DOM. Detaches all event handlers and removes jQuery.data attributes to avoid memory leaks. Calls destroy method of any child Kendo widgets.
        @method
        */
        destroy(): void;
        /**
        Hide the Drawer
        @method
        */
        hide(): void;
        /**
        Show the Drawer
        @method
        */
        show(): void;
    }

    interface DrawerOptions {
        name?: string;
        /**
        Specifies the content element to shift when the drawer appears. Required if the drawer is used outside of a mobile application.
        @member {JQuery}
        */
        container?: JQuery;
        /**
        The position of the drawer. Can be left (default) or right.
        @member {string}
        */
        position?: string;
        /**
        If set to false, swiping the view will not activate the drawer. In this case, the drawer will only be open by a designated button
        @member {boolean}
        */
        swipeToOpen?: boolean;
        /**
        The text to display in the Navbar title (if present).
        @member {string}
        */
        title?: string;
        /**
        A list of the view ids on which the drawer will appear. If omitted, the drawer will work on any view in the application.
        @member {any}
        */
        views?: any;
        /**
        Fires before the mobile Drawer is revealed. The event can be prevented by calling the preventDefault method of the event parameter.
        */
        beforeShow?(e: DrawerEvent): void;
        /**
        Fired when the mobile Drawer is closed by the user.
        */
        hide?(e: DrawerHideEvent): void;
        /**
        Fired when the mobile Drawer and its child widgets are initialized.
        */
        init?(e: DrawerInitEvent): void;
        /**
        Fires when the Drawer is shown.
        */
        show?(e: DrawerShowEvent): void;
    }

    interface DrawerEvent {
        sender: Drawer;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface DrawerHideEvent extends DrawerEvent {
    }

    interface DrawerInitEvent extends DrawerEvent {
    }

    interface DrawerShowEvent extends DrawerEvent {
    }


    class Layout extends kendo.mobile.ui.Widget {
        static fn: Layout;
        static extend(proto: Object): Layout;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: LayoutOptions);
        options: LayoutOptions;
    }

    interface LayoutOptions {
        name?: string;
        /**
        The id of the layout. Required
        @member {string}
        */
        id?: string;
        /**
        The specific platform this layout targets. By default, layouts are displayed
on all platforms.
        @member {string}
        */
        platform?: string;
        /**
        Fires when a mobile View using the layout becomes hidden.
        */
        hide?(e: LayoutHideEvent): void;
        /**
        Fires after a mobile Layout and its child widgets is initialized.
        */
        init?(e: LayoutInitEvent): void;
        /**
        Fires when a mobile View using the layout becomes visible.
        */
        show?(e: LayoutShowEvent): void;
    }

    interface LayoutEvent {
        sender: Layout;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface LayoutHideEvent extends LayoutEvent {
        /**
        The mobile layout instance
        @member {JQuery}
        */
        layout?: JQuery;
        /**
        The mobile view instance
        @member {JQuery}
        */
        view?: JQuery;
    }

    interface LayoutInitEvent extends LayoutEvent {
        /**
        The mobile layout instance
        @member {JQuery}
        */
        layout?: JQuery;
    }

    interface LayoutShowEvent extends LayoutEvent {
        /**
        The mobile layout instance
        @member {JQuery}
        */
        layout?: JQuery;
        /**
        The mobile view instance
        @member {JQuery}
        */
        view?: JQuery;
    }


    class ListView extends kendo.mobile.ui.Widget {
        static fn: ListView;
        static extend(proto: Object): ListView;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ListViewOptions);
        options: ListViewOptions;
        dataSource: kendo.data.DataSource;
        /**
        Appends new items generated by rendering the given data items with the listview template to the bottom of the listview.
        @method
        @param dataItems - 
        */
        append(dataItems: any): void;
        /**
        Prepends new items generated by rendering the given data items with the listview template to the top of the listview.
        @method
        @param dataItems - 
        */
        prepend(dataItems: any): void;
        /**
        Replaces the contents of the listview with the passed rendered data items.
        @method
        @param dataItems - 
        */
        replace(dataItems: any): void;
        /**
        Removes the listview items which are rendered with the passed data items.
        @method
        @param dataItems - 
        */
        remove(dataItems: any): void;
        /**
        Re-renders the given listview item with the new dataItem provided. In order for the method to work as expected, the data items should be of type kendo.data.Model.
        @method
        @param item - The listview item to update
        @param dataItem - The new dataItem
        */
        setDataItem(item: JQuery, dataItem: kendo.data.Model): void;
        /**
        Prepares the ListView for safe removal from DOM. Detaches all event handlers and removes jQuery.data attributes to avoid memory leaks. Calls destroy method of any child Kendo widgets.
        @method
        */
        destroy(): void;
        /**
        Get the listview DOM element items
        @method
        @returns The listview DOM element items
        */
        items(): JQuery;
        /**
        Repaints the listview (works only in databound mode).
        @method
        */
        refresh(): void;
        /**
        Sets the DataSource of an existing ListView and rebinds it.
        @method
        @param dataSource - 
        */
        setDataSource(dataSource: kendo.data.DataSource): void;
    }

    interface ListViewFilterable {
        /**
        Placeholder text for search input.
        @member {string}
        */
        placeholder?: string;
        /**
        Indicates whether filtering should be performed on every key up event or when the user press the Search button of the device keyboard.
        @member {boolean}
        */
        autoFilter?: boolean;
        /**
        Specifies the field which will be used in the filter expression. The default field value is undefined which is usefull when the list view is bound to a list of primitive types.
If this is not case the field must be defined.
        @member {string}
        */
        field?: string;
        /**
        Specifies whether the filter expression must be case sensitive or not.
        @member {boolean}
        */
        ignoreCase?: boolean;
        /**
        Specifies the comparison operator used in the filter expression. The operator must be one of the available DataSource filter operators.
        @member {string}
        */
        operator?: string;
    }

    interface ListViewOptions {
        name?: string;
        /**
        Used in combination with pullToRefresh. If set to true, newly loaded data will be appended on top when refreshing. Notice: not applicable if ListView is in a virtual mode.
        @member {boolean}
        */
        appendOnRefresh?: boolean;
        /**
        Indicates whether the listview will call read on the DataSource initially. If set to false, the listview will be bound after the DataSource instance fetch method is called.
        @member {boolean}
        */
        autoBind?: boolean;
        /**
        Instance of DataSource or the data that the mobile ListView will be bound to.
        @member {any}
        */
        dataSource?: any;
        /**
        If set to true, the listview gets the next page of data when the user scrolls near the bottom of the view.
        @member {boolean}
        */
        endlessScroll?: boolean;
        /**
        If set to true, the group headers will persist their position when the user scrolls through the listview.
Applicable only when the type is set to group, or when binding to grouped DataSource.Notice: fixed headers are not supported in virtual mode.
        @member {boolean}
        */
        fixedHeaders?: boolean;
        /**
        The header item template (applicable when the type is set to group).
        @member {any}
        */
        headerTemplate?: any;
        /**
        If set to true, a button is rendered at the bottom of the listview. Tapping it fetches and displays the items from the next page of the DataSource.
        @member {boolean}
        */
        loadMore?: boolean;
        /**
        The text of the rendered load-more button (applies only if loadMore is set to true).
        @member {string}
        */
        loadMoreText?: string;
        /**
        If set to true, the listview will reload its data when the user pulls the view over the top limit.
        @member {boolean}
        */
        pullToRefresh?: boolean;
        /**
        A callback function used when the 'pullToRefresh' option is enabled. The result of the function will be send as additional parameters to the DataSource's next method.Notice: When the listview is in a virtual mode, the pull to refresh action removes the previously loaded items in the listview (instead of appending new records at the top).
Previously loaded pages in the DataSource are also discarded.
        @member {Function}
        */
        pullParameters?: Function;
        /**
        The style of the widget. Can be either empty string(""), or inset.
        @member {string}
        */
        style?: string;
        /**
        The item template.
        @member {any}
        */
        template?: any;
        /**
        The type of the control. Can be either flat (default) or group. Determined automatically in databound mode.
        @member {string}
        */
        type?: string;
        /**
        Indicates whether the filter input must be visible or not.
        @member {ListViewFilterable}
        */
        filterable?: ListViewFilterable;
        /**
        Fires when item is tapped.
        */
        click?(e: ListViewClickEvent): void;
        /**
        Fires when the ListView has received data from the DataSource.
        */
        dataBound?(e: ListViewEvent): void;
        /**
        Fires when the ListView is about to be rendered.
        */
        dataBinding?(e: ListViewEvent): void;
        /**
        Fires when a new item is added to the listview (usually in virtual mode).
        */
        itemChange?(e: ListViewEvent): void;
    }

    interface ListViewEvent {
        sender: ListView;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ListViewClickEvent extends ListViewEvent {
        /**
        The selected list item.
        @member {JQuery}
        */
        item?: JQuery;
        /**
        The tapped DOM element.
        @member {JQuery}
        */
        target?: JQuery;
        /**
        The corresponding dataItem associated with the item (available in databound mode only).
Note: The dataItem must be from a non-primitive type (Object).
        @member {any}
        */
        dataItem?: any;
        /**
        The tapped Kendo mobile Button (if present).
        @member {kendo.mobile.ui.Button}
        */
        button?: kendo.mobile.ui.Button;
    }


    class Loader extends kendo.mobile.ui.Widget {
        static fn: Loader;
        static extend(proto: Object): Loader;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: LoaderOptions);
        options: LoaderOptions;
        /**
        Hide the loading animation.
        @method
        */
        hide(): void;
        /**
        Show the loading animation.
        @method
        */
        show(): void;
    }

    interface LoaderOptions {
        name?: string;
    }

    interface LoaderEvent {
        sender: Loader;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class ModalView extends kendo.mobile.ui.Widget {
        static fn: ModalView;
        static extend(proto: Object): ModalView;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ModalViewOptions);
        options: ModalViewOptions;
        /**
        Close the ModalView
        @method
        */
        close(): void;
        /**
        Prepares the ModalView for safe removal from DOM. Detaches all event handlers and removes jQuery.data attributes to avoid memory leaks. Calls destroy method of any child Kendo widgets.
        @method
        */
        destroy(): void;
        /**
        Open the ModalView
        @method
        @param target - (optional) The target of the ModalView
        */
        open(target: JQuery): void;
    }

    interface ModalViewOptions {
        name?: string;
        /**
        The height of the ModalView container in pixels. If not set, the element style is used.
        @member {number}
        */
        height?: number;
        /**
        When set to false, the ModalView will close when the user taps outside of its element.
        @member {boolean}
        */
        modal?: boolean;
        /**
        The width of the ModalView container in pixels. If not set, the element style is used.
        @member {number}
        */
        width?: number;
        /**
        Fired when the mobile ModalView is closed by the user.
        */
        close?(e: ModalViewCloseEvent): void;
        /**
        Fired when the mobile ModalView and its child widgets are initialized.
        */
        init?(e: ModalViewInitEvent): void;
        /**
        Fires when the ModalView is shown.
        */
        open?(e: ModalViewOpenEvent): void;
    }

    interface ModalViewEvent {
        sender: ModalView;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ModalViewCloseEvent extends ModalViewEvent {
    }

    interface ModalViewInitEvent extends ModalViewEvent {
    }

    interface ModalViewOpenEvent extends ModalViewEvent {
        /**
        The invocation target of the ModalView.
        @member {JQuery}
        */
        target?: JQuery;
    }


    class NavBar extends kendo.mobile.ui.Widget {
        static fn: NavBar;
        static extend(proto: Object): NavBar;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: NavBarOptions);
        options: NavBarOptions;
        /**
        Prepares the NavBar for safe removal from DOM. Detaches all event handlers and removes jQuery.data attributes to avoid memory leaks. Calls destroy method of any child Kendo widgets.
        @method
        */
        destroy(): void;
        /**
        Update the title element text. The title element is specified by setting the role data attribute to view-title.
        @method
        @param value - The text of title
        */
        title(value: string): void;
    }

    interface NavBarOptions {
        name?: string;
    }

    interface NavBarEvent {
        sender: NavBar;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }


    class Pane extends kendo.mobile.ui.Widget {
        static fn: Pane;
        static extend(proto: Object): Pane;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: PaneOptions);
        options: PaneOptions;
        /**
        Prepares the Pane for safe removal from DOM. Detaches all event handlers and removes jQuery.data attributes to avoid memory leaks. Calls destroy method of any child Kendo widgets.
        @method
        */
        destroy(): void;
        /**
        Hide the loading animation.
        @method
        */
        hideLoading(): void;
        /**
        Navigate the local or remote view.
        @method
        @param url - The id or URL of the view.
        @param transition - The transition to apply when navigating. See View Transitions for more information.
        */
        navigate(url: string, transition: string): void;
        /**
        Navigate to local or to remote view. The view will replace the current one in the history stack.
        @method
        @param url - The id or URL of the view.
        @param transition - The transition to apply when navigating. See View Transitions for more information.
        */
        replace(url: string, transition: string): void;
        /**
        
        @method
        */
        Example(): void;
        /**
        Show the loading animation.
        @method
        */
        showLoading(): void;
        /**
        Get a reference to the current view.
        @method
        @returns the view instance.
        */
        view(): kendo.mobile.ui.View;
    }

    interface PaneOptions {
        name?: string;
        /**
        Applicable when the pane is inside a SplitView. If set to true, the pane will be hidden when the device is in portrait position. The expandPanes SplitView method displays the hidden panes.The id of the initial mobile View to display.
        @member {boolean}
        */
        collapsible?: boolean;
        /**
        The id of the initial mobile View to display.
        @member {string}
        */
        initial?: string;
        /**
        The id of the default Pane Layout.
        @member {string}
        */
        layout?: string;
        /**
        The text displayed in the loading popup. Setting this value to false will disable the loading popup.
        @member {string}
        */
        loading?: string;
        /**
        Sets the pane width in pixels when the device is in portrait position.
        @member {number}
        */
        portraitWidth?: number;
        /**
        The default View transition.
        @member {string}
        */
        transition?: string;
        /**
        Triggered when pane navigates to a view.
        */
        navigate?(e: PaneNavigateEvent): void;
        /**
        Triggered after the pane displays a view.
        */
        viewShow?(e: PaneViewShowEvent): void;
    }

    interface PaneEvent {
        sender: Pane;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface PaneNavigateEvent extends PaneEvent {
        /**
        The URL of the view
        @member {JQuery}
        */
        url?: JQuery;
    }

    interface PaneViewShowEvent extends PaneEvent {
        /**
        The displayed view
        @member {kendo.mobile.ui.View}
        */
        view?: kendo.mobile.ui.View;
    }


    class PopOver extends kendo.mobile.ui.Widget {
        static fn: PopOver;
        static extend(proto: Object): PopOver;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: PopOverOptions);
        options: PopOverOptions;
        /**
        Close the popover.
        @method
        */
        close(): void;
        /**
        Prepares the PopOver for safe removal from DOM. Detaches all event handlers and removes jQuery.data attributes to avoid memory leaks. Calls destroy method of any child Kendo widgets.
        @method
        */
        destroy(): void;
        /**
        Open the PopOver.
        @method
        @param target - The target of the Popover, to which the visual arrow will point to. This parameter is required for a tablet OS.
        */
        open(target: JQuery): void;
    }

    interface PopOverPane {
        /**
        The id of the initial mobile View to display.
        @member {string}
        */
        initial?: string;
        /**
        The id of the default Pane Layout.
        @member {string}
        */
        layout?: string;
        /**
        The text displayed in the loading popup. Setting this value to false will disable the loading popup.
        @member {string}
        */
        loading?: string;
        /**
        The default View transition.
        @member {string}
        */
        transition?: string;
    }

    interface PopOverPopup {
        /**
        The height of the popup in pixels.
        @member {any}
        */
        height?: any;
        /**
        The width of the popup in pixels.
        @member {any}
        */
        width?: any;
    }

    interface PopOverOptions {
        name?: string;
        /**
        The pane configuration options.
        @member {PopOverPane}
        */
        pane?: PopOverPane;
        /**
        The popup configuration options.
        @member {PopOverPopup}
        */
        popup?: PopOverPopup;
        /**
        Fires when popover is closed.
        */
        close?(e: PopOverCloseEvent): void;
        /**
        Fires when popover is opened.
        */
        open?(e: PopOverOpenEvent): void;
    }

    interface PopOverEvent {
        sender: PopOver;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface PopOverCloseEvent extends PopOverEvent {
    }

    interface PopOverOpenEvent extends PopOverEvent {
        /**
        The DOM element, which triggered the popover opening.
        @member {JQuery}
        */
        target?: JQuery;
    }


    class ScrollView extends kendo.mobile.ui.Widget {
        static fn: ScrollView;
        static extend(proto: Object): ScrollView;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ScrollViewOptions);
        options: ScrollViewOptions;
        dataSource: kendo.data.DataSource;
        /**
        Update the ScrollView HTML content.
        @method
        @param content - The new ScrollView content.
        */
        content(content: string): void;
        /**
        Update the ScrollView HTML content.
        @method
        @param content - The new ScrollView content.
        */
        content(content: JQuery): void;
        /**
        Prepares the ScrollView for safe removal from DOM. Detaches all event handlers and removes jQuery.data attributes to avoid memory leaks. Calls destroy method of any child Kendo widgets.
        @method
        */
        destroy(): void;
        /**
        Switches to the next page with animation.
        @method
        */
        next(): void;
        /**
        Switches to the previous page with animation.
        @method
        */
        prev(): void;
        /**
        Redraw the mobile ScrollView pager. Called automatically on device orientation change event.
        @method
        */
        refresh(): void;
        /**
        Scroll to the given page. Pages are zero-based indexed.
        @method
        @param page - The page to scroll to.
        @param instant - If set to true, the ScrollView will jump instantly to the given page without any animation effects.
        */
        scrollTo(page: number, instant: boolean): void;
        /**
        Sets the DataSource of an existing ScrollView and rebinds it.
        @method
        @param dataSource - 
        */
        setDataSource(dataSource: kendo.data.DataSource): void;
    }

    interface ScrollViewOptions {
        name?: string;
        /**
        If set to false the widget will not bind to the DataSource during initialization. In this case data binding will occur when the change event of the data source is fired. By default the widget will bind to the DataSource specified in the configuration.Applicable only in data bound mode.
        @member {boolean}
        */
        autoBind?: boolean;
        /**
        The velocity threshold after which a swipe will result in a bounce effect.
        @member {number}
        */
        bounceVelocityThreshold?: number;
        /**
        The height of the ScrollView content. Supports 100% if the ScrollView is embedded in a stretched view and the ScrollView element is an immediate child of the view element.
        @member {any}
        */
        contentHeight?: any;
        /**
        Instance of DataSource that the mobile ScrollView will be bound to. If DataSource is set, the widget will operate in data bound mode.
        @member {any}
        */
        dataSource?: any;
        /**
        The milliseconds that take the ScrollView to snap to the current page after released.
        @member {number}
        */
        duration?: number;
        /**
        The template which is used to render the pages without content. By default the ScrollView renders a blank page.Applicable only in data bound mode.
        @member {string}
        */
        emptyTemplate?: string;
        /**
        If set to true the ScrollView will display a pager. By default pager is enabled.
        @member {boolean}
        */
        enablePager?: boolean;
        /**
        Determines how many data items will be passed to the page template.Applicable only in data bound mode.
        @member {number}
        */
        itemsPerPage?: number;
        /**
        The initial page to display.
        @member {number}
        */
        page?: number;
        /**
        Multiplier applied to the snap amount of the ScrollView. By default, the widget scrolls to the next screen when swipe. If the pageSize property is set to 0.5, the ScrollView will scroll by half of the widget width.Not applicable in data bound mode.
        @member {number}
        */
        pageSize?: number;
        /**
        The template which is used to render the content of pages. By default the ScrollView renders a div element for every page.Applicable only in data bound mode.
        @member {string}
        */
        template?: string;
        /**
        The velocity threshold after which a swipe will navigate to the next page (as opposed to snapping back to the current page).
        @member {number}
        */
        velocityThreshold?: number;
        /**
        Fires before the widget page is changed. The change can be prevented by calling the preventDefault method of the event parameter, in which case the widget will snap back to the current page.
        */
        changing?(e: ScrollViewChangingEvent): void;
        /**
        Fires when the widget page is changed.
        */
        change?(e: ScrollViewChangeEvent): void;
        /**
        Fires when widget refreshes
        */
        refresh?(e: ScrollViewRefreshEvent): void;
    }

    interface ScrollViewEvent {
        sender: ScrollView;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ScrollViewChangingEvent extends ScrollViewEvent {
        /**
        The current page (zero based index)
        @member {number}
        */
        currentPage?: number;
        /**
        The page about to be displayed (zero based index)
        @member {number}
        */
        nextPage?: number;
    }

    interface ScrollViewChangeEvent extends ScrollViewEvent {
        /**
        The current page (zero based index)
        @member {number}
        */
        page?: number;
        /**
        The page element. Available only in data bound mode. Parameter will be undefined in standard mode.
        @member {JQuery}
        */
        element?: JQuery;
        /**
        The data collection. Available only in data bound mode. Parameter will be undefined in standard mode.
        @member {any}
        */
        data?: any;
    }

    interface ScrollViewRefreshEvent extends ScrollViewEvent {
        /**
        The number of pages
        @member {number}
        */
        pageCount?: number;
        /**
        The current page number (zero based index)
        @member {number}
        */
        page?: number;
    }


    class Scroller extends kendo.mobile.ui.Widget {
        static fn: Scroller;
        static extend(proto: Object): Scroller;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ScrollerOptions);
        options: ScrollerOptions;
        /**
        Scrolls the scroll container to the specified location with animation. The arguments should be negative numbers.
        @method
        @param x - The horizontal offset in pixels to scroll to.
        @param y - The vertical offset in pixels to scroll to.
        */
        animatedScrollTo(x: number, y: number): void;
        /**
        Prepares the Scroller for safe removal from DOM. Detaches all event handlers and removes jQuery.data attributes to avoid memory leaks. Calls destroy method of any child Kendo widgets.
        @method
        */
        destroy(): void;
        /**
        Disables the scrolling of the element.
        @method
        */
        disable(): void;
        /**
        Enables the scrolling of the element after it has been disabled by calling disable.
        @method
        */
        enable(): void;
        /**
        Returns the viewport height of the scrollable element.
        @method
        @returns the viewport height in pixels.
        */
        height(): number;
        /**
        Indicate that the pull event is handled (i.e. data from the server has been retrieved).
        @method
        */
        pullHandled(): void;
        /**
        Scrolls the container to the top.
        @method
        */
        reset(): void;
        /**
        Returns the height in pixels of the scroller content.
        @method
        */
        scrollHeight(): void;
        /**
        Scrolls the container to the specified location. The arguments should be negative numbers.
        @method
        @param x - The horizontal offset in pixels to scroll to.
        @param y - The vertical offset in pixels to scroll to.
        */
        scrollTo(x: number, y: number): void;
        /**
        Returns the width in pixels of the scroller content.
        @method
        */
        scrollWidth(): void;
        /**
        Zooms the scroller out to the minimum zoom level possible.
        @method
        */
        zoomOut(): void;
    }

    interface ScrollerOptions {
        name?: string;
        /**
        If set to true, the user can zoom in/out the contents of the widget using the pinch/zoom gesture.
        @member {boolean}
        */
        zoom?: boolean;
        /**
        Weather or not to allow out of bounds dragging and easing.
        @member {boolean}
        */
        elastic?: boolean;
        /**
        The threshold below which a releasing the scroller will trigger the pull event.
Has effect only when the pullToRefresh option is set to true.
        @member {number}
        */
        pullOffset?: number;
        /**
        The message template displayed when the user pulls the scroller.
Has effect only when the pullToRefresh option is set to true.
        @member {string}
        */
        pullTemplate?: string;
        /**
        If set to true, the scroller will display a hint when the user pulls the container beyond its top limit.
If a pull beyond the specified pullOffset occurs, a pull event will be triggered.
        @member {boolean}
        */
        pullToRefresh?: boolean;
        /**
        The message template displayed during the refresh.
Has effect only when the pullToRefresh option is set to true.
        @member {string}
        */
        refreshTemplate?: string;
        /**
        The message template displayed when the user pulls the scroller below the pullOffset, indicating that pullToRefresh will occur.
Has effect only when the pullToRefresh option is set to true.
        @member {string}
        */
        releaseTemplate?: string;
        /**
        If set to true, the scroller will use the native scrolling available in the current platform. This should help with form issues on some platforms (namely Android and WP8).
Native scrolling is only enabled on platforms that support it: iOS > 4, Android > 2, WP8. BlackBerry devices do support it, but the native scroller is flaky.
        @member {boolean}
        */
        useNative?: boolean;
        /**
        Fires when the pull option is set to true, and the user pulls the scrolling container beyond the specified pullThreshold.
        */
        pull?(e: ScrollerEvent): void;
        /**
        Fires when the scroller dimensions change (e.g. orientation change or resize)
        */
        resize?(e: ScrollerEvent): void;
        /**
        Fires when the user scrolls through the content.
        */
        scroll?(e: ScrollerScrollEvent): void;
    }

    interface ScrollerEvent {
        sender: Scroller;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ScrollerScrollEvent extends ScrollerEvent {
        /**
        The number of pixels that are hidden from view above the scrollable area.
        @member {number}
        */
        scrollTop?: number;
        /**
        The number of pixels that are hidden from view to the left of the scrollable area.
        @member {number}
        */
        scrollLeft?: number;
    }


    class SplitView extends kendo.mobile.ui.Widget {
        static fn: SplitView;
        static extend(proto: Object): SplitView;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: SplitViewOptions);
        options: SplitViewOptions;
        /**
        Prepares the SplitView for safe removal from DOM. Detaches all event handlers and removes jQuery.data attributes to avoid memory leaks. Calls destroy method of any child Kendo widgets.
        @method
        */
        destroy(): void;
        /**
        Displays the collapsible panes; has effect only when the device is in portrait orientation.
        @method
        */
        expandPanes(): void;
        /**
        Collapses back the collapsible panes (displayed previously with expandPanes); has effect only when the device is in portrait orientation.
        @method
        */
        collapsePanes(): void;
    }

    interface SplitViewOptions {
        name?: string;
        /**
        Defines the SplitView style - horizontal or vertical.
        @member {string}
        */
        style?: string;
        /**
        Fires after the mobile SplitView and its child widgets are initialized.
        */
        init?(e: SplitViewInitEvent): void;
        /**
        Fires when the mobile SplitView becomes visible.
        */
        show?(e: SplitViewShowEvent): void;
    }

    interface SplitViewEvent {
        sender: SplitView;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface SplitViewInitEvent extends SplitViewEvent {
        /**
        The mobile SplitView instance
        @member {JQuery}
        */
        view?: JQuery;
    }

    interface SplitViewShowEvent extends SplitViewEvent {
        /**
        The mobile SplitView instance
        @member {JQuery}
        */
        view?: JQuery;
    }


    class Switch extends kendo.mobile.ui.Widget {
        static fn: Switch;
        static extend(proto: Object): Switch;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: SwitchOptions);
        options: SwitchOptions;
        /**
        Get/Set the checked state of the widget.
        @method
        @returns The checked state of the widget.
        */
        check(): boolean;
        /**
        Get/Set the checked state of the widget.
        @method
        @param check - Whether to turn the widget on or off.
        */
        check(check: boolean): void;
        /**
        Prepares the Switch for safe removal from DOM. Detaches all event handlers and removes jQuery.data attributes to avoid memory leaks. Calls destroy method of any child Kendo widgets.
        @method
        */
        destroy(): void;
        /**
        Changes the enabled state of the widget.
        @method
        @param enable - Whether to enable or disable the widget.
        */
        enable(enable: boolean): void;
        /**
        Forces the Switch to recalculate its dimensions. Useful when major changes in the interface happen dynamically, like for instance changing the skin.
        @method
        */
        refresh(): void;
        /**
        Toggle the checked state of the widget.
        @method
        */
        toggle(): void;
    }

    interface SwitchOptions {
        name?: string;
        /**
        The checked state of the widget.
        @member {boolean}
        */
        checked?: boolean;
        /**
        If set to false the widget will be disabled and will not allow the user to change its checked state. The widget is enabled by default.
        @member {boolean}
        */
        enable?: boolean;
        /**
        The OFF label.
        @member {string}
        */
        offLabel?: string;
        /**
        The ON label.
        @member {string}
        */
        onLabel?: string;
        /**
        Fires when the state of the widget changes
        */
        change?(e: SwitchChangeEvent): void;
    }

    interface SwitchEvent {
        sender: Switch;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface SwitchChangeEvent extends SwitchEvent {
        /**
        The checked state of the widget.
        @member {any}
        */
        checked?: any;
    }


    class TabStrip extends kendo.mobile.ui.Widget {
        static fn: TabStrip;
        static extend(proto: Object): TabStrip;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: TabStripOptions);
        options: TabStripOptions;
        /**
        Introduced in Q1 2013 SP Sets a badge on one of the tabs with the specified value. If invoked without second parameter, returns the tab's current badge value. Set the value to false to remove the badge.
        @method
        @param tab - The target tab specified either as a jQuery selector/object or as an item index.
        @param value - The target value to be set or false to be removed.
        @returns Returns the badge value if invoked without parameters, otherwise returns the TabStrip object.
        */
        badge(tab: string, value: string): string;
        /**
        Introduced in Q1 2013 SP Sets a badge on one of the tabs with the specified value. If invoked without second parameter, returns the tab's current badge value. Set the value to false to remove the badge.
        @method
        @param tab - The target tab specified either as a jQuery selector/object or as an item index.
        @param value - The target value to be set or false to be removed.
        @returns Returns the badge value if invoked without parameters, otherwise returns the TabStrip object.
        */
        badge(tab: string, value: boolean): string;
        /**
        Introduced in Q1 2013 SP Sets a badge on one of the tabs with the specified value. If invoked without second parameter, returns the tab's current badge value. Set the value to false to remove the badge.
        @method
        @param tab - The target tab specified either as a jQuery selector/object or as an item index.
        @param value - The target value to be set or false to be removed.
        @returns Returns the badge value if invoked without parameters, otherwise returns the TabStrip object.
        */
        badge(tab: number, value: string): string;
        /**
        Introduced in Q1 2013 SP Sets a badge on one of the tabs with the specified value. If invoked without second parameter, returns the tab's current badge value. Set the value to false to remove the badge.
        @method
        @param tab - The target tab specified either as a jQuery selector/object or as an item index.
        @param value - The target value to be set or false to be removed.
        @returns Returns the badge value if invoked without parameters, otherwise returns the TabStrip object.
        */
        badge(tab: number, value: boolean): string;
        /**
        Get the currently selected tab DOM element.
        @method
        @returns the currently selected tab DOM element.
        */
        currentItem(): JQuery;
        /**
        Prepares the TabStrip for safe removal from DOM. Detaches all event handlers and removes jQuery.data attributes to avoid memory leaks. Calls destroy method of any child Kendo widgets.
        @method
        */
        destroy(): void;
        /**
        Set the mobile TabStrip active tab to the tab with the specified URL. This method doesn't change the current View. To change the View, use Application's navigate method instead.
        @method
        @param url - The URL or zero based index of the tab.
        */
        switchTo(url: string): void;
        /**
        Set the mobile TabStrip active tab to the tab with the specified URL. This method doesn't change the current View. To change the View, use Application's navigate method instead.
        @method
        @param url - The URL or zero based index of the tab.
        */
        switchTo(url: number): void;
        /**
        Set the mobile TabStrip active tab to the tab with the specified full URL. This method doesn't change the current View. To change the View, use Application's navigate method instead.
        @method
        @param url - The URL of the tab.
        */
        switchByFullUrl(url: string): void;
        /**
        Clear the currently selected tab.
        @method
        */
        clear(): void;
    }

    interface TabStripOptions {
        name?: string;
        /**
        The index of the initially selected tab.
        @member {number}
        */
        selectedIndex?: number;
        /**
        Fires when tab is selected.
        */
        select?(e: TabStripSelectEvent): void;
    }

    interface TabStripEvent {
        sender: TabStrip;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface TabStripSelectEvent extends TabStripEvent {
        /**
        The selected tab
        @member {JQuery}
        */
        item?: JQuery;
    }


    class View extends kendo.mobile.ui.Widget {
        static fn: View;
        static extend(proto: Object): View;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ViewOptions);
        options: ViewOptions;
        /**
        Retrieves the current content holder of the View - this is the content element if the View is stretched or the scroll container otherwise.
        @method
        */
        contentElement(): void;
        /**
        Prepares the View for safe removal from DOM. Detaches all event handlers and removes jQuery.data attributes to avoid memory leaks. Calls destroy method of any child Kendo widgets.
        @method
        */
        destroy(): void;
        /**
        Enables or disables the user interaction with the view and its contents.
        @method
        @param enable - Omitting the parameter or passing true enables the view. Passing false disables the view.
        */
        enable(enable: boolean): void;
    }

    interface ViewOptions {
        name?: string;
        /**
        The MVVM model to bind to. If a string is passed, The view will try to resolve a reference to the view model variable in the global scope.
        @member {string}
        */
        model?: string;
        /**
        Applicable to remote views only. If set to true, the remote view contents will be reloaded from the server (using Ajax) each time the view is navigated to.
        @member {boolean}
        */
        reload?: boolean;
        /**
        If set to true, the view will stretch its child contents to occupy the entire view, while disabling kinetic scrolling.
Useful if the view contains an image or a map.
        @member {boolean}
        */
        stretch?: boolean;
        /**
        The text to display in the NavBar title (if present) and the browser title.
        @member {string}
        */
        title?: string;
        /**
        If set to true, the view will use the native scrolling available in the current platform. This should help with form issues on some platforms (namely Android and WP8).
Native scrolling is only enabled on platforms that support it: iOS > 5+, Android > 3+, WP8. BlackBerry devices do support it, but the native scroller is flaky.
        @member {boolean}
        */
        useNativeScrolling?: boolean;
        /**
        If set to true, the user can zoom in/out the contents of the view using the pinch/zoom gesture.
        @member {boolean}
        */
        zoom?: boolean;
        /**
        Fires after the mobile View becomes visible. If the view is displayed with transition, the event is triggered after the transition is complete.
        */
        afterShow?(e: ViewAfterShowEvent): void;
        /**
        Fires before the mobile View becomes hidden.
        */
        beforeHide?(e: ViewBeforeHideEvent): void;
        /**
        Fires before the mobile View becomes visible. The event can be prevented by calling the preventDefault method of the event parameter, in case a redirection should happen.
        */
        beforeShow?(e: ViewBeforeShowEvent): void;
        /**
        Fires when the mobile View becomes hidden.
        */
        hide?(e: ViewHideEvent): void;
        /**
        Fires after the mobile View and its child widgets are initialized.
        */
        init?(e: ViewInitEvent): void;
        /**
        Fires when the mobile View becomes visible.
        */
        show?(e: ViewShowEvent): void;
    }

    interface ViewEvent {
        sender: View;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ViewAfterShowEvent extends ViewEvent {
        /**
        The mobile view instance
        @member {kendo.mobile.ui.View}
        */
        view?: kendo.mobile.ui.View;
    }

    interface ViewBeforeHideEvent extends ViewEvent {
        /**
        The mobile view instance
        @member {kendo.mobile.ui.View}
        */
        view?: kendo.mobile.ui.View;
    }

    interface ViewBeforeShowEvent extends ViewEvent {
        /**
        The mobile view instance
        @member {kendo.mobile.ui.View}
        */
        view?: kendo.mobile.ui.View;
    }

    interface ViewHideEvent extends ViewEvent {
        /**
        The mobile view instance
        @member {kendo.mobile.ui.View}
        */
        view?: kendo.mobile.ui.View;
    }

    interface ViewInitEvent extends ViewEvent {
        /**
        The mobile view instance
        @member {kendo.mobile.ui.View}
        */
        view?: kendo.mobile.ui.View;
    }

    interface ViewShowEvent extends ViewEvent {
        /**
        The mobile view instance.
        @member {kendo.mobile.ui.View}
        */
        view?: kendo.mobile.ui.View;
    }


}
declare module kendo.ui {
    class Touch extends kendo.ui.Widget {
        static fn: Touch;
        static extend(proto: Object): Touch;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: TouchOptions);
        options: TouchOptions;
        /**
        Cancels the current touch event sequence. Calling cancel in a touchstart or dragmove will disable subsequent move or tap/end/hold event handlers from being called.
        @method
        */
        cancel(): void;
        /**
        Prepares the Touch for safe removal from DOM. Detaches all event handlers and removes jQuery.data attributes to avoid memory leaks. Calls destroy method of any child Kendo widgets.
        @method
        */
        destroy(): void;
    }

    interface TouchOptions {
        name?: string;
        /**
        jQuery selector that specifies child elements that are touchable if a widget is attached to a container.
        @member {string}
        */
        filter?: string;
        /**
        If specified, the user drags will be tracked within the surface boundaries.
This option is useful if the widget is instantiated on small DOM elements like buttons, or thin list items.
        @member {JQuery}
        */
        surface?: JQuery;
        /**
        If set to true, the widget will capture and trigger the gesturestart, gesturechange, and gestureend events when the user touches the element with two fingers.
        @member {boolean}
        */
        multiTouch?: boolean;
        /**
        If set to true, the Touch widget will recognize horizontal swipes and trigger the swipe event.Notice: if the enableSwipe option is set to true, the dragstart, drag and dragend events will not be triggered.
        @member {boolean}
        */
        enableSwipe?: boolean;
        /**
        The minimum horizontal distance in pixels the user should swipe before the swipe event is triggered.
        @member {number}
        */
        minXDelta?: number;
        /**
        The maximum vertical deviation in pixels of the swipe event. Swipes with higher deviation are discarded.
        @member {number}
        */
        maxYDelta?: number;
        /**
        The maximum amount of time in milliseconds the swipe event can last. Slower swipes are discarded.
        @member {number}
        */
        maxDuration?: number;
        /**
        The timeout in milliseconds before the hold event is fired.Notice: the hold event will be triggered after the time passes, not after the user lifts his/hers finger.
        @member {number}
        */
        minHold?: number;
        /**
        The maximum period (in milliseconds) between two consecutive taps which will trigger the doubletap event.
        @member {number}
        */
        doubleTapTimeout?: number;
        /**
        Fires when the user presses the element.
        */
        touchstart?(e: TouchTouchstartEvent): void;
        /**
        Fires when the user starts dragging the element.
        */
        dragstart?(e: TouchDragstartEvent): void;
        /**
        Fires each time the user drags (within the element boundaries).
        */
        drag?(e: TouchDragEvent): void;
        /**
        Fires when the user lifts his/hers finger, or drags outside of the element boundaries.
        */
        dragend?(e: TouchDragendEvent): void;
        /**
        Fires when the user taps on the element. A touch sequence is considered a tap if the user does not perform dragging.
        */
        tap?(e: TouchTapEvent): void;
        /**
        Fires when the user quickly taps twice on the element.
        */
        doubletap?(e: TouchDoubletapEvent): void;
        /**
        Fires when the user presses and holds  his/hers finger on the element for a minimum amount of time.The minimum amount can be configured through the minHold configuration option.
        */
        hold?(e: TouchHoldEvent): void;
        /**
        Fires when the user performs a horizontal swipe on the element.For this event to be triggered, the enableSwipe configuration option should be set to true.
        */
        swipe?(e: TouchSwipeEvent): void;
        /**
        Fires when the user presses the element with two fingers (or presses with a second finger while a first finger is still touching the element).
        */
        gesturestart?(e: TouchGesturestartEvent): void;
        /**
        Fires when the user moves a finger while multiple fingers are touching the element.
        */
        gesturechange?(e: TouchGesturechangeEvent): void;
        /**
        Fires when the user lifts the second finger from the element.
Notice: After the last finger is moved, the dragend event is fired.
        */
        gestureend?(e: TouchGestureendEvent): void;
    }

    interface TouchEvent {
        sender: Touch;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface TouchTouchstartEvent extends TouchEvent {
        /**
        The touch event instance
        @member {kendo.mobile.ui.TouchEventOptions}
        */
        touch?: kendo.mobile.ui.TouchEventOptions;
        /**
        The jQuery event which triggered the touch event.
        @member {JQueryEventObject}
        */
        event?: JQueryEventObject;
    }

    interface TouchDragstartEvent extends TouchEvent {
        /**
        The touch event instance
        @member {kendo.mobile.ui.TouchEventOptions}
        */
        touch?: kendo.mobile.ui.TouchEventOptions;
        /**
        The jQuery event which triggered the touch event.
        @member {JQueryEventObject}
        */
        event?: JQueryEventObject;
    }

    interface TouchDragEvent extends TouchEvent {
        /**
        The touch event instance
        @member {kendo.mobile.ui.TouchEventOptions}
        */
        touch?: kendo.mobile.ui.TouchEventOptions;
        /**
        The jQuery event which triggered the touch event.
        @member {JQueryEventObject}
        */
        event?: JQueryEventObject;
    }

    interface TouchDragendEvent extends TouchEvent {
        /**
        The touch event instance
        @member {kendo.mobile.ui.TouchEventOptions}
        */
        touch?: kendo.mobile.ui.TouchEventOptions;
        /**
        The jQuery event which triggered the touch event.
        @member {JQueryEventObject}
        */
        event?: JQueryEventObject;
    }

    interface TouchTapEvent extends TouchEvent {
        /**
        The touch event instance
        @member {kendo.mobile.ui.TouchEventOptions}
        */
        touch?: kendo.mobile.ui.TouchEventOptions;
        /**
        The jQuery event which triggered the touch event.
        @member {JQueryEventObject}
        */
        event?: JQueryEventObject;
    }

    interface TouchDoubletapEvent extends TouchEvent {
        /**
        The touch event instance
        @member {kendo.mobile.ui.TouchEventOptions}
        */
        touch?: kendo.mobile.ui.TouchEventOptions;
        /**
        The jQuery event which triggered the touch event.
        @member {JQueryEventObject}
        */
        event?: JQueryEventObject;
    }

    interface TouchHoldEvent extends TouchEvent {
        /**
        The touch event instance
        @member {kendo.mobile.ui.TouchEventOptions}
        */
        touch?: kendo.mobile.ui.TouchEventOptions;
        /**
        The jQuery event which triggered the touch event.
        @member {JQueryEventObject}
        */
        event?: JQueryEventObject;
    }

    interface TouchSwipeEvent extends TouchEvent {
        /**
        The touch event instance
        @member {kendo.mobile.ui.TouchEventOptions}
        */
        touch?: kendo.mobile.ui.TouchEventOptions;
        /**
        The jQuery event which triggered the touch event.
        @member {JQueryEventObject}
        */
        event?: JQueryEventObject;
    }

    interface TouchGesturestartEvent extends TouchEvent {
        /**
        An array containing the active touches.
        @member {any}
        */
        touches?: any;
        /**
        The jQuery event which triggered the touch event.
        @member {JQueryEventObject}
        */
        event?: JQueryEventObject;
        /**
        The distance (in pixels) between the two touches.
        @member {number}
        */
        distance?: number;
        /**
        The center point between the two touches. The point has two properties, x and y, which contain the x and the y coordinate, respectively.
        @member {kendo.mobile.ui.Point}
        */
        center?: kendo.mobile.ui.Point;
    }

    interface TouchGesturechangeEvent extends TouchEvent {
        /**
        An array containing the active touches.
        @member {any}
        */
        touches?: any;
        /**
        The jQuery event which triggered the touch event.
        @member {JQueryEventObject}
        */
        event?: JQueryEventObject;
        /**
        The distance (in pixels) between the two touches
        @member {number}
        */
        distance?: number;
        /**
        The center point between the two touches. The point has two properties, x and y, which contain the x and the y coordinate, respectively.
        @member {kendo.mobile.ui.Point}
        */
        center?: kendo.mobile.ui.Point;
    }

    interface TouchGestureendEvent extends TouchEvent {
        /**
        An array containing the active touches
        @member {any}
        */
        touches?: any;
        /**
        The jQuery event which triggered the touch event.
        @member {JQueryEventObject}
        */
        event?: JQueryEventObject;
        /**
        The distance (in pixels) between the two touches
        @member {number}
        */
        distance?: number;
        /**
        The center point between the two touches. The point has two properties, x and y, which contain the x and the y coordinate, respectively.
        @member {kendo.mobile.ui.Point}
        */
        center?: kendo.mobile.ui.Point;
    }


    class Validator extends kendo.ui.Widget {
        static fn: Validator;
        static extend(proto: Object): Validator;

        element: JQuery;
        wrapper: JQuery;
        constructor(element: Element, options?: ValidatorOptions);
        options: ValidatorOptions;
        /**
        Get the error messages if any.
        @method
        @returns Messages for the failed validation rules.
        */
        errors(): any;
        /**
        Hides the validation messages.
        @method
        */
        hideMessages(): void;
        /**
        Validates the input element(s) against the declared validation rules.
        @method
        @returns true if all validation rules passed successfully.Note that if a HTML form element is set as validation container, the form submits will be automatically prevented if validation fails.
        */
        validate(): boolean;
        /**
        Validates the input element against the declared validation rules.
        @method
        @param input - Input element to be validated.
        @returns true if all validation rules passed successfully.
        */
        validateInput(input: Element): boolean;
        /**
        Validates the input element against the declared validation rules.
        @method
        @param input - Input element to be validated.
        @returns true if all validation rules passed successfully.
        */
        validateInput(input: JQuery): boolean;
    }

    interface ValidatorOptions {
        name?: string;
        /**
        The template which renders the validation message.
        @member {string}
        */
        errorTemplate?: string;
        /**
        Set of messages (either strings or functions) which will be shown when given validation rule fails.
By setting already existing key the appropriate built-in message will be overridden.
        @member {any}
        */
        messages?: any;
        /**
        Set of custom validation rules. Those rules will extend the built-in ones.
        @member {any}
        */
        rules?: any;
        /**
        Determines if validation will be triggered when element loses focus. Default value is true.
        @member {boolean}
        */
        validateOnBlur?: boolean;
        /**
        Fired when validation completes.The event handler function context (available via the this keyword) will be set to the data source instance.
        */
        validate?(e: ValidatorValidateEvent): void;
    }

    interface ValidatorEvent {
        sender: Validator;
        isDefaultPrevented(): boolean;
        preventDefault: Function;
    }

    interface ValidatorValidateEvent extends ValidatorEvent {
    }


}

interface HTMLElement {
    kendoBindingTarget: kendo.data.Binding;
}

interface JQueryXHR {
}

interface JQueryEventObject {
}

interface JQueryPromise<T> {
}

interface JQuery {

    kendoDraggable(): JQuery;
    kendoDraggable(options: kendo.ui.DraggableOptions): JQuery;

    kendoDropTarget(): JQuery;
    kendoDropTarget(options: kendo.ui.DropTargetOptions): JQuery;

    kendoDropTargetArea(): JQuery;
    kendoDropTargetArea(options: kendo.ui.DropTargetAreaOptions): JQuery;

    data(key: any): any;

    kendoMobileActionSheet(): JQuery;
    kendoMobileActionSheet(options: kendo.mobile.ui.ActionSheetOptions): JQuery;
    data(key: "kendoMobileActionSheet") : kendo.mobile.ui.ActionSheet;

    kendoMobileBackButton(): JQuery;
    kendoMobileBackButton(options: kendo.mobile.ui.BackButtonOptions): JQuery;
    data(key: "kendoMobileBackButton") : kendo.mobile.ui.BackButton;

    kendoMobileButton(): JQuery;
    kendoMobileButton(options: kendo.mobile.ui.ButtonOptions): JQuery;
    data(key: "kendoMobileButton") : kendo.mobile.ui.Button;

    kendoMobileButtonGroup(): JQuery;
    kendoMobileButtonGroup(options: kendo.mobile.ui.ButtonGroupOptions): JQuery;
    data(key: "kendoMobileButtonGroup") : kendo.mobile.ui.ButtonGroup;

    kendoMobileDetailButton(): JQuery;
    kendoMobileDetailButton(options: kendo.mobile.ui.DetailButtonOptions): JQuery;
    data(key: "kendoMobileDetailButton") : kendo.mobile.ui.DetailButton;

    kendoMobileDrawer(): JQuery;
    kendoMobileDrawer(options: kendo.mobile.ui.DrawerOptions): JQuery;
    data(key: "kendoMobileDrawer") : kendo.mobile.ui.Drawer;

    kendoMobileLayout(): JQuery;
    kendoMobileLayout(options: kendo.mobile.ui.LayoutOptions): JQuery;
    data(key: "kendoMobileLayout") : kendo.mobile.ui.Layout;

    kendoMobileListView(): JQuery;
    kendoMobileListView(options: kendo.mobile.ui.ListViewOptions): JQuery;
    data(key: "kendoMobileListView") : kendo.mobile.ui.ListView;

    kendoMobileLoader(): JQuery;
    kendoMobileLoader(options: kendo.mobile.ui.LoaderOptions): JQuery;
    data(key: "kendoMobileLoader") : kendo.mobile.ui.Loader;

    kendoMobileModalView(): JQuery;
    kendoMobileModalView(options: kendo.mobile.ui.ModalViewOptions): JQuery;
    data(key: "kendoMobileModalView") : kendo.mobile.ui.ModalView;

    kendoMobileNavBar(): JQuery;
    kendoMobileNavBar(options: kendo.mobile.ui.NavBarOptions): JQuery;
    data(key: "kendoMobileNavBar") : kendo.mobile.ui.NavBar;

    kendoMobilePane(): JQuery;
    kendoMobilePane(options: kendo.mobile.ui.PaneOptions): JQuery;
    data(key: "kendoMobilePane") : kendo.mobile.ui.Pane;

    kendoMobilePopOver(): JQuery;
    kendoMobilePopOver(options: kendo.mobile.ui.PopOverOptions): JQuery;
    data(key: "kendoMobilePopOver") : kendo.mobile.ui.PopOver;

    kendoMobileScrollView(): JQuery;
    kendoMobileScrollView(options: kendo.mobile.ui.ScrollViewOptions): JQuery;
    data(key: "kendoMobileScrollView") : kendo.mobile.ui.ScrollView;

    kendoMobileScroller(): JQuery;
    kendoMobileScroller(options: kendo.mobile.ui.ScrollerOptions): JQuery;
    data(key: "kendoMobileScroller") : kendo.mobile.ui.Scroller;

    kendoMobileSplitView(): JQuery;
    kendoMobileSplitView(options: kendo.mobile.ui.SplitViewOptions): JQuery;
    data(key: "kendoMobileSplitView") : kendo.mobile.ui.SplitView;

    kendoMobileSwitch(): JQuery;
    kendoMobileSwitch(options: kendo.mobile.ui.SwitchOptions): JQuery;
    data(key: "kendoMobileSwitch") : kendo.mobile.ui.Switch;

    kendoMobileTabStrip(): JQuery;
    kendoMobileTabStrip(options: kendo.mobile.ui.TabStripOptions): JQuery;
    data(key: "kendoMobileTabStrip") : kendo.mobile.ui.TabStrip;

    kendoMobileView(): JQuery;
    kendoMobileView(options: kendo.mobile.ui.ViewOptions): JQuery;
    data(key: "kendoMobileView") : kendo.mobile.ui.View;

    kendoTouch(): JQuery;
    kendoTouch(options: kendo.ui.TouchOptions): JQuery;
    data(key: "kendoTouch") : kendo.ui.Touch;

    kendoValidator(): JQuery;
    kendoValidator(options: kendo.ui.ValidatorOptions): JQuery;
    data(key: "kendoValidator") : kendo.ui.Validator;

}
