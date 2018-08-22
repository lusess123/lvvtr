import * as _ from "lodash";

import {BaseEntity} from "../scheme/BaseEntity";
import {NodeModel} from "../scheme/NodeModel";
import {PointModel} from "../scheme/PointModel";
import {GraphModel} from "../scheme/GraphModel";
import {Toolkit} from '../../utils/Toolkit';

import {LinkFactory} from "./elements/LinkFactory";
import {NodeFactory} from "./elements/NodeFactory";

import {LinkErrorType, LinkErrorMsg} from './Constants';

export class GraphEngine extends BaseEntity {
    graphModel;
    nodeFactory;
    linkFactory;
    canvas;
    paintableWidgets;
    nodesRendered;
    linksThatHaveInitiallyRendered;

    constructor() {
        super();
        this.graphModel = new GraphModel();
        this.nodeFactory = new NodeFactory();
        this.linkFactory = new LinkFactory();
        this.canvas = null;
        this.paintableWidgets = null;
        this.linksThatHaveInitiallyRendered = {};
    }

    repaintCanvas() {
        this.iterateListeners(function (listener) {
            listener.repaintCanvas && listener.repaintCanvas();
        });
    }

    clearRepaintEntities() {
        this.paintableWidgets = null;
    }

    enableRepaintEntities(entities) {
        var _this = this;
        this.paintableWidgets = {};
        entities.forEach(function (entity) {
            //if a node is requested to repaint, add all of its links
            if (entity instanceof NodeModel) {
                _.forEach(entity.getPorts(), function (port) {
                    _.forEach(port.getLinks(), function (link) {
                        _this.paintableWidgets[link.getID()] = true;
                    });
                });
            }
            if (entity instanceof PointModel) {
                _this.paintableWidgets[entity.getLink().getID()] = true;
            }
            _this.paintableWidgets[entity.getID()] = true;
        });
    }

    /**
     * Checks to see if a model is locked by running through
     * its parents to see if they are locked first
     */
    isModelLocked(model) {
        //always check the graph model
        if (this.graphModel.isLocked()) {
            return true;
        }
        return model.isLocked();
    }

    recalculatePortsVisually() {
        this.nodesRendered = false;
        this.linksThatHaveInitiallyRendered = {};
    }

    setNodeLinksReRender(nodeModel) {
        var ports = nodeModel && nodeModel.ports;
        for (var portModelName in ports) {
            var links = ports[portModelName].links;
            for (var linkModelName in links) {
                delete this.linksThatHaveInitiallyRendered[links[linkModelName].id];
            }
        }
    }

    canEntityRepaint(baseModel) {
        //no rules applied, allow repaint
        if (this.paintableWidgets === null) {
            return true;
        }
        return this.paintableWidgets[baseModel.getID()] !== undefined;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }

    setGraphModel(model) {
        this.graphModel = model;
        this.recalculatePortsVisually();
    }

    getGraphModel() {
        return this.graphModel;
    }

    generateWidgetForLink(link) {
        return this.linkFactory.generateReactWidget(this, link);
    }

    generateWidgetForNode(node, props) {
        return this.nodeFactory.generateReactWidget(this, node, props);
    }

    getRelativeMousePoint(event) {
        var point = this.getRelativePoint(event.clientX, event.clientY);
        return {
            x: (point.x - this.graphModel.getOffsetX()) / (this.graphModel.getZoomLevel() / 100.0),
            y: (point.y - this.graphModel.getOffsetY()) / (this.graphModel.getZoomLevel() / 100.0)
        };
    }

    getRelativePoint(x, y) {
        var canvasRect = this.canvas.getBoundingClientRect();
        return {x: x - canvasRect.left, y: y - canvasRect.top};
    }

    getNodePortElement(port) {
        var selector = this.canvas.querySelector('.port[data-name="' + port.getName() + '"][data-nodeid="' + port.getParent().getID() + '"]');
        if (selector === null) {
            throw new Error("Cannot find Node Port element with nodeID: [" + port.getParent().getID() + "] and name: [" + port.getName() + "]");
        }
        return selector;
    }

    getPortCenter(port) {
        var sourceElement = this.getNodePortElement(port);
        var sourceRect = sourceElement.getBoundingClientRect();
        var rel = this.getRelativePoint(sourceRect.left, sourceRect.top);
        return {
            x: sourceElement.offsetWidth / 2 + (rel.x - this.graphModel.getOffsetX()) / (this.graphModel.getZoomLevel() / 100.0),
            y: sourceElement.offsetHeight / 2 + (rel.y - this.graphModel.getOffsetY()) / (this.graphModel.getZoomLevel() / 100.0)
        };
    }

    /**
     * Gets a model and element under the mouse cursor
     */
    getMouseElement(event) {
        var target = event.target;
        var graphModel = this.graphModel;
        var element;

        //is it a port
        element = Toolkit.closest(target, ".port[data-name]");
        if (element) {
            var nodeElement = Toolkit.closest(target, ".node[data-nodeid]");
            return {
                model: graphModel
                    .getNode(nodeElement.getAttribute("data-nodeid"))
                    .getPort(element.getAttribute("data-name")),
                element: element
            };
        }

        //look for a link
        element = Toolkit.closest(target, "[data-linkid]");
        if (element) {
            return {
                model: graphModel.getLink(element.getAttribute("data-linkid")),
                element: element
            };
        }

        //look for a node
        element = Toolkit.closest(target, ".node[data-nodeid]");
        if (element) {
            return {
                model: graphModel.getNode(element.getAttribute("data-nodeid")),
                element: element
            };
        }

        return null;
    }

    zoomToFit() {
        var xFactor = this.canvas.clientWidth / this.canvas.scrollWidth;
        var yFactor = this.canvas.clientHeight / this.canvas.scrollHeight;
        var zoomFactor = xFactor < yFactor ? xFactor : yFactor;
        this.graphModel.setZoomLevel(this.graphModel.getZoomLevel() * zoomFactor + 0.1);
        this.graphModel.setOffset(0, 0);
        this.repaintCanvas();
    }

    // 不能自相连？
    checkPortLinkable(sourcePort, targetPort) {
        if (!sourcePort) {
            return LinkErrorType.Gentle;
        }
        if (sourcePort.in) {
            return LinkErrorType.FromInPort;
        }
        var isOnlySource = (targetPort == null);// 只通过起始点source判断是否可以开始新连线
        if (isOnlySource) {
            if (sourcePort.in) {
                return LinkErrorType.FromInPort;
            }
        } else {

           // console.log(targetPort.parentNode);


           

               

            if (sourcePort.parentNode == targetPort.parentNode) {// 不能自相连
                return LinkErrorType.SelfNode;
            }

            if (sourcePort.in == targetPort.in) {// 输出不能对输出
                return LinkErrorType.PortType;
            }

            let sourceLinks = sourcePort.links
                , targetLinks = targetPort.links;

            for (var linkid in sourceLinks) {// 已经连接过
                if (targetLinks[linkid]) {
                    return LinkErrorType.LinkExist;
                }
            }
            console.log(targetPort.parentNode);
            function ol (obj){
                return  Object.keys(obj).map((key)=>{return obj[key];});
             }
             //const _list = [];
             //  _list.
            
             const _points :any[] = targetPort.parentNode.ports;
              const _to = ol( _points).filter(a=>{
                const _links = ol(a.links);
                return   a.in &&  _links.length == 0    
            
             }).length ;
             return  _to;

            // if (Object.keys(targetPort.links).length) {// 目前不支持
            //     return false;
            // }

        }
        return true;
    }
}
