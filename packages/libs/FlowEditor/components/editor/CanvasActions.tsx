import {NodeModel} from "../scheme/NodeModel";
import {PortModel} from "../scheme/PortModel";
import {LinkModel} from "../scheme/LinkModel";
import {PointModel} from "../scheme/PointModel";

export class BaseAction {
    mouseX;
    mouseY;
    ms;

    mouseX2;
    mouseY2;
    
    amountX;
    amountY;

    moved;
   

    constructor(mouseX, mouseY) {
        this.mouseX = mouseX;
        this.mouseY = mouseY;
        this.ms = new Date().getTime();
    }
}

// 左键：拖动（框选）
export class SelectingAction extends BaseAction {
    constructor(mouseX, mouseY) {
        super(mouseX, mouseY);
        this.mouseX2 = mouseX;
        this.mouseY2 = mouseY;
    }

    getBoxDimensions() {
        return {
            left: this.mouseX2 > this.mouseX ? this.mouseX : this.mouseX2,
            top: this.mouseY2 > this.mouseY ? this.mouseY : this.mouseY2,
            width: Math.abs(this.mouseX2 - this.mouseX),
            height: Math.abs(this.mouseY2 - this.mouseY),
            right: this.mouseX2 < this.mouseX ? this.mouseX : this.mouseX2,
            bottom: this.mouseY2 < this.mouseY ? this.mouseY : this.mouseY2
        };
    }

    containsElement(x, y, graphModel) {
        var z = graphModel.getZoomLevel() / 100.0;
        var dimensions = this.getBoxDimensions();
        var pad = 40 * z;// 目前以NODE左上角，适当扩大一下框选范围，NODE节点大小60PX（动态获取）
        return (
            x * z + graphModel.getOffsetX() > (dimensions.left - pad)
            && x * z + graphModel.getOffsetX() < (dimensions.right + pad)
            && y * z + graphModel.getOffsetY() > (dimensions.top - pad)
            && y * z + graphModel.getOffsetY() < (dimensions.bottom + pad)
        );
    }
}

// 左键：元素上：拖动（节点 、连线）
export class MoveItemsAction extends BaseAction {
    initialOffsetX;
    initialOffsetY;
    selectionModels;
    amountX;
    amountY;
    constructor(mouseX, mouseY, graphEngine) {
        super(mouseX, mouseY);
        this.moved = false;
        graphEngine.enableRepaintEntities(graphEngine.getGraphModel().getSelectedItems());
        var selectedItems = graphEngine.getGraphModel().getSelectedItems();
        //dont allow items which are locked to move
        selectedItems = selectedItems.filter(function (item) {
            return !graphEngine.isModelLocked(item);
        });
        this.selectionModels = selectedItems.map(function (item) {
            return {
                model: item,
                initialX: item.x,
                initialY: item.y
            };
        });
    }
}

// 右键：空白区：拖动
export class MoveCanvasAction extends BaseAction {
    initialOffsetX;
    initialOffsetY;
    constructor(mouseX, mouseY, graphModel) {
        super(mouseX, mouseY);
        this.initialOffsetX = graphModel.getOffsetX();
        this.initialOffsetY = graphModel.getOffsetY();
    }
}

// 左键｜右键：元素上｜空白区：单击（单选、取消选中、右键菜单）
export class ClickAction extends BaseAction {
    isRightClick;
    constructor(mouseX, mouseY, isRightClick) {
        super(mouseX, mouseY);
        this.isRightClick = isRightClick;// true 右键单击，false 左键单击
    }
}

function splitStr(str) {
    return str.trim().split(/\s+/g);
}

// todo 处理双击，"恶意"点击（防止误操作） \ 接管其它正常操作，如鼠标滑过、鼠标滚轮

export class GraphActionsManager {
    options;
    graphEngine;
    element;
    handlers;
    keyPressing;
    _session;


    constructor(element, graphEngine, options) {
        this.options = Object.assign({}, options || {});
        this.graphEngine = graphEngine;
        this.element = element;
        this.handlers = {};
        this.keyPressing = {};
    }

    onDocumentMouseDown = event => {
        if (event.shiftKey) {
            this.keyPressing.shiftKey = true;
        }
        console.log("onDocumentMouseDown");
    };

    onMouseDown = event => {
        var startElement = this.graphEngine.getMouseElement(event);
        this._session = {
            isRightButton: event.button == 2
            , isLeftButton: event.button == 0
            , startElement: startElement// maybe null , piru move canvas element
            , startEvent: event
        };
        console.log("onMouseDown");
    };

    onMouseMove = event => {
       
        console.log("---onMouseMove");
        if (!this._session) {
            return;
        }
       // debugger;

        var {isRightButton, isLeftButton, startEvent, isMoved, action, startElement} = this._session;
        var graphEngine = this.graphEngine;
        var graphModel = graphEngine.getGraphModel();

        if (action == null) {// 初始状态
            var deltaX = event.clientX - startEvent.clientX
                , deltaY = event.clientY - startEvent.clientY;
            isMoved = Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5;
            if (isMoved) {// buffer后开始拖动
                if (isRightButton) {
                    action = new MoveCanvasAction(event.clientX, event.clientY, graphModel)
                }
                else if (isLeftButton) {
                    if (startElement) {// 拖动元素
                        
                        if (startElement.model instanceof PortModel) {// maybe 新建连线
                            console.log("onMouseMove - PortModel");
                            if (this.options.beforeNewLink && this.options.beforeNewLink(startElement, event)) {
                                action = new MoveItemsAction(event.clientX, event.clientY, graphEngine)
                            }
                        } else if (startElement.model instanceof NodeModel) {// 从节点开始
                            console.log("onMouseMove - NodeModel");
                            graphModel.clearSelection();
                            startElement.model.setSelected(true);
                            action = new MoveItemsAction(event.clientX, event.clientY, graphEngine)
                        } else {// 拖动其它
                            // nothing to do
                        }
                    }
                    else { // 框选
                        let relative = graphEngine.getRelativePoint(event.clientX, event.clientY);
                        action = new SelectingAction(relative.x, relative.y)
                    }
                }
            }
            if (action) {
                this._emit("movestart", {action, event, startElement: startElement});
            }

        }
        else {// 运动状态
            if (action instanceof SelectingAction) {// 框选
                var relative = graphEngine.getRelativePoint(event.clientX, event.clientY);
                action.mouseX2 = relative.x;
                action.mouseY2 = relative.y;
            }
            else if (action instanceof MoveItemsAction) { // 拖动元素（点、线、端口）
                let amountX = event.clientX - action.mouseX;
                let amountY = event.clientY - action.mouseY;
                action.amountX = amountX;
                action.amountY = amountY;
            }
            else if (action instanceof MoveCanvasAction) { // 拖动画布
                let amountX = action.initialOffsetX + (event.clientX - action.mouseX);
                let amountY = action.initialOffsetY + (event.clientY - action.mouseY);
                action.amountX = amountX;
                action.amountY = amountY;
            } else {
                return; // stop continue
            }
            this._emit("move", {action, event, startElement: startElement});
        }

        Object.assign(this._session, {
            isMoved
            , action
        })
    };

    onDocumentMouseUp = event => {
        var shiftKeyPressing = this.keyPressing.shiftKey;
        if (event.shiftKey) {
            this.keyPressing.shiftKey = false;
        }

        if (!this._session) {
            return;
        }

        let graphEngine = this.graphEngine;
        let endElement = graphEngine.getMouseElement(event);
        var graphModel = graphEngine.getGraphModel();

        try {
            var {isRightButton, isLeftButton, startEvent, isMoved, action, startElement} = this._session;
            if (isMoved && action) {
                this._emit("moveend", {action, event, startElement, endElement});
            }
            else if (!action) {
                var isClickEmpty = !(endElement && (endElement.model instanceof NodeModel || endElement.model instanceof LinkModel));

                // 点击元素操作，自带选中逻辑
                if (!isClickEmpty) {
                    if (!endElement.model.isSelected()) {
                        if (!shiftKeyPressing) {
                            graphModel.clearSelection();
                        }
                        endElement.model.setSelected(true);
                    }
                }

                action = new ClickAction(event.clientX, event.clientY, isRightButton);
                if (isRightButton) {
                    let rect = this.element.getBoundingClientRect();
                    let amountX = event.clientX - rect.x;
                    let amountY = event.clientY - rect.y;
                    action.amountX = amountX;
                    action.amountY = amountY;
                    this._emit("contextmenu", {action, event, element: endElement});
                } else {
                    this._emit(isClickEmpty ? "canvasclick" : "itemclick", {action, event, element: endElement});
                }
            }
            else {
                // nothing to do
            }
        }
        catch (e) {
            console.error(e);
        }
        finally {
            delete this._session;// @note important
        }
    };

    _bindDomEvent() {
        document.addEventListener("mousedown", this.onDocumentMouseDown);
        this.element.addEventListener("dblclick", this.onDblClick);
        this.element.addEventListener("mousedown", this.onMouseDown);
        this.element.addEventListener("mousemove", this.onMouseMove);
        document.addEventListener("mouseup", this.onDocumentMouseUp);
        this.element.addEventListener("contextmenu", this.onContextMenu);
    }

    onContextMenu = (event) => {
        event.preventDefault();
    };

    onDblClick = (event) => {
        event.preventDefault();
    };

    _offDomEvent() {
        document.removeEventListener("mousedown", this.onDocumentMouseDown);
        this.element.removeEventListener("dblclick", this.onDblClick);
        this.element.removeEventListener("mousedown", this.onMouseDown);
        this.element.removeEventListener("mousemove", this.onMouseMove);
        document.removeEventListener("mouseup", this.onDocumentMouseUp);
        this.element.removeEventListener("contextmenu", this.onContextMenu);
    }

    start() {
        this._bindDomEvent();
    }

    stop() {
        this._offDomEvent();
    }

    on(events, handler) {
        if (events === undefined) {
            return;
        }
        if (handler === undefined) {
            return;
        }

        let {handlers} = this;
        splitStr(events).forEach((event) => {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    }

    off(events, handler) {
        if (events === undefined) {
            return;
        }
        let {handlers} = this;
        splitStr(events).forEach((event) => {
            if (!handler) {
                delete handlers[event];// 删除所有
            } else {
                handlers[event] && handlers[event].splice(handlers[event].indexOf(handler), 1);// 删除指定
            }
        });
        return this;
    }

    _emit(event, data) {
        // if (event !== "debug") {
        //     this._emit("debug", [event, data])
        // }

        // no handlers, so skip it all
        let handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;

        let i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    }

    destroy() {
        this.stop();
        this.handlers = {};
        this.element = null;
        this.graphEngine = null;
    }
}
