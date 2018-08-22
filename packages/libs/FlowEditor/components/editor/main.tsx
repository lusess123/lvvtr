import * as React from "react";
import * as _ from "lodash";
import {NodeModel} from "../scheme/NodeModel";
import {PortModel} from "../scheme/PortModel";
import {PointModel} from "../scheme/PointModel";

import {MoveCanvasAction, MoveItemsAction, SelectingAction, GraphActionsManager} from "./CanvasActions";
import {LinkLayer} from "./elements/LinkLayer";
import {NodeLayer} from "./elements/NodeLayer";
import ContextMenu from './ContextMenu';
import { LinkErrorMsg} from './Constants';

export class GraphEdit extends React.Component<any,any> {
    static defaultProps = {
        graphEngine: null,
        allowCanvasTranslation: true,
        allowCanvasZoom: true,
        inverseZoom: true,
        deleteKeys: [46, 8]
    };
    _perfForceUpdate;
    _graphActionsManager;
    _joined;
    onMouseOver;

    constructor(props) {
        super(props);
        this.state = {
            action: null,
            wasMoved: false,
            renderedNodes: false,
            windowListener: null,
            graphEngineListener: null,
            showContextMenu: false,
            contextMenuPos: {
                x: 0
                , y: 0
            },
            showSubFolderMenu: false
        };

        this._perfForceUpdate = _.debounce(this.forceUpdate, 10).bind(this);// 减少调用次数的优化,但是又不能失帧
    }

    /*----- lifecircle start ----*/

    componentWillReceiveProps(nextProps) {
        if (this.props.graphEngine !== nextProps.graphEngine) {
            this.props.graphEngine.removeListener(this.state.graphEngineListener);
            const graphEngineListener = nextProps.graphEngine.addListener({
                repaintCanvas: () => this.forceUpdate()
            });
            this.setState({graphEngineListener});
        }
    }

    componentWillUpdate(nextProps) {
        if (this.props.graphEngine.graphModel.id !== nextProps.graphEngine.graphModel.id) {
            this.setState({renderedNodes: false});
            nextProps.graphEngine.graphModel.rendered = true;
        }
        if (!nextProps.graphEngine.graphModel.rendered) {
            this.setState({renderedNodes: false});
            nextProps.graphEngine.graphModel.rendered = true;
        }
    }

    componentDidUpdate() {
        if (!this.state.renderedNodes) {
            this.setState({
                renderedNodes: true
            });
        }
    }

    componentDidMount() {
        //add a keyboard listener
        var {graphEngine} = this.props;
        this.setState({
            renderedNodes: true,
            graphEngineListener: graphEngine.addListener({
                repaintCanvas: () => {
                    this.forceUpdate();
                }
            })
        });
        this._graphActionsManager = new GraphActionsManager(graphEngine.canvas, graphEngine, {
            beforeNewLink: this.beforeNewLink
        });
        // this._graphActionsManager.on("debug", function ([event, data]) {
        //     console.info("debug", event, data);
        // });
        this._graphActionsManager.on("contextmenu", this.onContextMenu);
        this._graphActionsManager.on("canvasclick", this.onCanvasClick);
        this._graphActionsManager.on("itemclick", this.onItemClick);
        this._graphActionsManager.on("movestart", this.onMoveStart);
        this._graphActionsManager.on("move", this.onMove);
        this._graphActionsManager.on("moveend", this.onMoveEnd);
        this._graphActionsManager.start();
        // window.addEventListener("keyup", this.onKeyUp, false);
    }

    componentWillUnmount() {
        this._graphActionsManager && this._graphActionsManager.destroy();
        delete this._graphActionsManager;

        // window.removeEventListener("keyup", this.onKeyUp);
        if (this.props.graphEngine) {
            this.props.graphEngine.removeListener(this.state.graphEngineListener);
            this.props.graphEngine.canvas && this.props.graphEngine.canvas.addEventListener("mouseover", this.onMouseOver);
            this.props.graphEngine.setCanvas(null);
        }
    }

    /*----- lifecircle end ----*/


    /*----- event handler start ----*/

    // 按键操作
    onKeyUp = event => {
        if (this.props.deleteKeys.indexOf(event.keyCode) !== -1) {
            _.forEach(this.props.graphEngine.getGraphModel().getSelectedItems(), element => {
                element.remove();
            });
            this.forceUpdate();
        }
    };

    _closeContextMenuIfVisible() {
        this.state.showContextMenu && this.setState({//  contextmenu may showing , hide it
            showContextMenu: false,
            showSubFolderMenu: false
        });
    }

    // 拖拽流

    beforeNewLink = (startElement, event) => {
        var graphEngine = this.props.graphEngine;
        var graphModel = graphEngine.getGraphModel();
        let relative = graphEngine.getRelativeMousePoint(event);
        let sourcePort = startElement.model;
        let link = sourcePort.createLinkModel();
        link.setSelectedAble(false);
        link.getFirstPoint().updateLocation(relative);
        link.getLastPoint().updateLocation(relative);

        graphModel.clearSelection();
        link.getLastPoint().setSelected(true);
        graphModel.addLink(link);

        let nodeModel = sourcePort.parentNode;
        this._joined = {};
        for (var nodeId in graphModel.nodes) {
            let node = graphModel.nodes[nodeId];
            if (nodeModel != node) {
                let ports = node.ports;
                for (var portId in ports) {
                    let portModel = ports[portId];
                    const _dd = graphEngine.checkPortLinkable(sourcePort, portModel);
                    console.log(_dd + "   "+(_dd === true) );
                    if (_dd === true) {
                        portModel.setJoinAble(true);
                        node.setJoinAble(true);
                        this._joined[node.id] = node;
                        this._joined[portModel.id] = portModel;
                    }
                }
            }
        }

        return link;
    };

    beforeCloseLink = (startElement, endElement) => {// 尝试建立连接
        var graphEngine = this.props.graphEngine;
        let link = startElement && startElement.model && startElement.model.getLink();
        var canlink = graphEngine.checkPortLinkable(link && link.sourcePort, endElement.model);
        var linkConnected = false;
        if (canlink === true) {
            if (link.getSourcePort() != endElement.model) {
                if (link.getTargetPort() == null) {
                    link.setTargetPort(endElement.model);
                }
                linkConnected = true;
            }
            link.setSelectedAble(true);// 绘制完成，设为true
            delete graphEngine.linksThatHaveInitiallyRendered[link.id];
        } else {
            this.props.onNewLinkError && this.props.onNewLinkError(LinkErrorMsg[canlink])
        }
        return linkConnected;
    };

    onMoveStart = ({action, event, startElement}) => {// 鼠标按下，设置选中以及状态初始化
        if (event.button == 2) {// 右键菜单
            return;
        } else {
            this.state.showContextMenu && this.setState({//  contextmenu may showing , hide it
                showContextMenu: false
            });
            this._closeContextMenuIfVisible();
        }

        var graphEngine = this.props.graphEngine;
        var graphModel = graphEngine.getGraphModel();

        this.setState({wasMoved: true, action});

        graphEngine.clearRepaintEntities();

        this.forceUpdate();
    };

    onMove = ({action, event, startElement}) => {
        var graphEngine = this.props.graphEngine;
        var graphModel = graphEngine.getGraphModel();
        if (action instanceof MoveItemsAction) { // 拖动元素（点、端口）
            let {amountX, amountY} = action;
            let amountZoom = graphModel.getZoomLevel() / 100;
            _.forEach(action.selectionModels, startElement => {
                if (startElement.model instanceof NodeModel) {// 拖动节点
                    startElement.model.x = graphModel.getGridPosition(startElement.initialX + amountX / amountZoom);
                    startElement.model.y = graphModel.getGridPosition(startElement.initialY + amountY / amountZoom);
                    graphEngine.setNodeLinksReRender(startElement.model);
                } else if (startElement.model instanceof PointModel) {// 拖动端口
                    console.log("拖动端口");
                   // alert("拖动端口");
                    startElement.model.x = startElement.initialX + graphModel.getGridPosition(amountX / amountZoom);
                    startElement.model.y = startElement.initialY + graphModel.getGridPosition(amountY / amountZoom);
                }
            });
        } else if (action instanceof MoveCanvasAction) { // 拖动画布
            //translate the actual canvas
            if (this.props.allowCanvasTranslation) {
                graphModel.setOffset(action.amountX, action.amountY);
            }
        }
        this._perfForceUpdate();
    };

    onMoveEnd = ({action, event, startElement, endElement}) => {
        for (var id in this._joined) {
            this._joined[id].setJoinAble(false);
        }

        if (!action) {
            return;
        }
        var graphEngine = this.props.graphEngine;
        var graphModel = graphEngine.getGraphModel();
        var selectionModels = action.selectionModels;

        if (action instanceof SelectingAction) {// 框选
            graphModel.clearSelection();
            _.forEach(graphModel.getNodes(), node => {
                if (action.containsElement(node.x, node.y, graphModel)) {
                    node.setSelected(true);
                }
            });
        }
        else if (action instanceof MoveItemsAction) {// 拖动
            let linkConnected = false;
            _.forEach(selectionModels, selectElement => {
                // 拖动节点
                if (selectElement.model instanceof NodeModel) {
                    graphEngine.setNodeLinksReRender(selectElement.model);
                }

                // 连接的是端点
                if (!(selectElement.model instanceof PointModel)) {
                    return;
                }

                if (endElement && endElement.model instanceof PortModel) {// 新建连线
                    if (this.beforeCloseLink(selectElement, endElement)) {
                        linkConnected = true;
                    }
                }

            });

            // 删除未建立连接or不符合要求的连线
            if (!linkConnected) {
                _.forEach(selectionModels, selectElement => {
                    //only care about points connecting to things
                    if (!(selectElement.model instanceof PointModel)) {
                        return;
                    }

                    var link = selectElement.model.getLink();
                    if (!link.getTargetPort()) {
                        link.remove();
                    }
                });
            }
            graphEngine.clearRepaintEntities();
        }
        else {
            graphEngine.clearRepaintEntities();
        }
        this.stopFiringAction();
        this.forceUpdate();
    };

    // 右键菜单
    onContextMenu = ({action, event, element}) => {
        if (element) {
            this.setState({
                showContextMenu: true,
                clickModel:element && element.model,
                contextMenuPos: {
                    x: action.amountX
                    , y: action.amountY
                }
            });
        }
        this.props.onContextMenu && this.props.onContextMenu({action, event, element});
    };

    // 点击事件
    onCanvasClick = ({action, event, element}) => {
        if (this.state.showContextMenu) {// 如果当前正在显示右键菜单，则阻止click事件
            this._closeContextMenuIfVisible();
            return;
        }
        var graphEngine = this.props.graphEngine;
        var graphModel = graphEngine.getGraphModel();
        graphModel.clearSelection();
        this.props.onCanvasClick && this.props.onCanvasClick({action, event, element});
        this.forceUpdate();
    };

    onItemClick = ({action, event, element}) => {
        if (this.state.showContextMenu) {// 如果当前正在显示右键菜单，则阻止click事件
            this._closeContextMenuIfVisible();
            return;
        }
        this.props.onItemClick && this.props.onItemClick({action, event, element});
        this.forceUpdate();
    };


    // 鼠标滚轮－放大缩小
    onWheel = event => {
        var graphEngine = this.props.graphEngine;
        var graphModel = graphEngine.getGraphModel();

        if (this.props.allowCanvasZoom) {
            event.preventDefault();
            event.stopPropagation();
            const oldZoomFactor = graphModel.getZoomLevel() / 100;
            let scrollDelta = this.props.inverseZoom ? -event.deltaY : event.deltaY;
            //check if it is pinch gesture
            if (event.ctrlKey && scrollDelta % 1 !== 0) {
                /*Chrome and Firefox sends wheel event with deltaY that
                 have fractional part, also `ctrlKey` prop of the event is true
                 though ctrl isn't pressed
                 */
                scrollDelta /= 3;
            } else {
                scrollDelta /= 60;
            }
            if (graphModel.getZoomLevel() + scrollDelta > 10) {
                graphModel.setZoomLevel(graphModel.getZoomLevel() + scrollDelta);
            }

            const zoomFactor = graphModel.getZoomLevel() / 100;

            const boundingRect = event.currentTarget.getBoundingClientRect();
            const clientWidth = boundingRect.width;
            const clientHeight = boundingRect.height;
            // compute difference between rect before and after scroll
            const widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor;
            const heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor;
            // compute mouse coords relative to canvas
            const clientX = event.clientX - boundingRect.left;
            const clientY = event.clientY - boundingRect.top;

            // compute width and height increment factor
            const xFactor = (clientX - graphModel.getOffsetX()) / oldZoomFactor / clientWidth;
            const yFactor = (clientY - graphModel.getOffsetY()) / oldZoomFactor / clientHeight;

            graphModel.setOffset(
                graphModel.getOffsetX() - widthDiff * xFactor,
                graphModel.getOffsetY() - heightDiff * yFactor
            );

            graphEngine.enableRepaintEntities([]);
            this.forceUpdate();
        }
    };


    /*----- event handler end ----*/

    setCursorAllowd(el, allowed = false) {
        var _old = el._old || "";
        el._old = el.style.cursor;
        el.style.cursor = allowed ? _old : "not-allowed";
    }

    stopFiringAction() {
        this.setState({action: null});
    }

    startFiringAction(action) {
        var setState = true;
        if (setState) {
            this.setState({action: action});
        }
    }

    renderSelectionBox() {
        let dimensions = this.state.action.getBoxDimensions();
        return (
            <div
                className="selector"
                style={{
                    top: dimensions.top,
                    left: dimensions.left,
                    width: dimensions.width,
                    height: dimensions.height
                }}
            />
        );
    }

    handlerContextMenuAction = (event) => {
        var el = event.target;
        var role = el.getAttribute("data-role");
        if (role != 'ExportToDir') {
            this.setState({
                showContextMenu: false,
                showSubFolderMenu: false
            });
        } else {
            this.setState({showContextMenu: true, showSubFolderMenu: true})
        }
        this.props.handlerContextMenuAction && this.props.handlerContextMenuAction(event);
    };

    renderEmptyTip() {
        return <div className="sophon-workflow-editor-emptytip">
            <i className="icon_add-circle"/>
            请从左侧拖入控件
        </div>
    }

    render() {
        var {showContextMenu, contextMenuPos, showSubFolderMenu, clickModel} = this.state;
        var graphEngine = this.props.graphEngine;
        var graphModel = graphEngine.getGraphModel();
        var nodes = graphModel.getNodes();
        var nodeCount = nodes && Object.keys(nodes).length;

        return (
            <div
                ref={ref => {
                    if (ref) {
                        this.props.graphEngine.setCanvas(ref);
                    }
                }}
                className={"sophon-workflow-editor"}
                onWheel={this.onWheel}
            >
                {this.state.renderedNodes && ( <LinkLayer graphEngine={graphEngine}/> )}
                <NodeLayer {...this.props} graphEngine={graphEngine}/>
                <ContextMenu
                    isShow={showContextMenu}
                    pos={contextMenuPos}
                    clickModel={clickModel}
                    graphEngine={graphEngine}
                    handlerContextMenuAction={this.handlerContextMenuAction}
                    showSubFolderMenu={showSubFolderMenu}
                />
                {this.state.action instanceof SelectingAction && this.renderSelectionBox()}
                {!nodeCount && this.renderEmptyTip()}
            </div>
        );
    }
}
