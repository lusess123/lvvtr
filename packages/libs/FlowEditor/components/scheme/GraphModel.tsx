import * as _ from "lodash";

import {BaseEntity} from "./BaseEntity";
import {LinkModel} from "./LinkModel";
import {NodeModel} from "./NodeModel";
import {PortModel} from "./PortModel";

export class GraphModel extends BaseEntity {

    links;
    nodes;
    offsetX;
    offsetY;
    zoom;
    gridSize;
    rendered;

    constructor() {
        super();

        this.links = {};
        this.nodes = {};

        this.offsetX = 0;
        this.offsetY = 0;
        this.zoom = 100;
        this.gridSize = 0;

        this.rendered = false;
    }

    setGridSize(size = 0) {
        this.gridSize = size;
        this.iterateListeners((listener, event) => {
            listener.gridUpdated && listener.gridUpdated({
                ...event,
                size: size
            });
        });
    }

    getGridPosition(pos) {
        if (this.gridSize === 0) {
            return pos;
        }
        return this.gridSize * Math.floor((pos + this.gridSize / 2) / this.gridSize);
    }

    deSerializeGraph(object) {
        this.deSerialize(object);
        this.offsetX = object.offsetX;
        this.offsetY = object.offsetY;
        this.zoom = object.zoom;
        this.gridSize = object.gridSize;

        //deserialize nodes
        _.forEach(object.nodes, (node) => {
            let nodeOb = new NodeModel({});
            nodeOb.deSerialize(node);
            //deserialize ports
            _.forEach(node.ports, (port) => {
                let portOb = new PortModel();
                portOb.deSerialize(port);
                nodeOb.addPort(portOb);
            });
            this.addNode(nodeOb);
        });

        _.forEach(object.links, (link) => {
            let linkOb = new LinkModel();
            linkOb.deSerialize(link);

            if (link.target) {
                linkOb.setTargetPort(this.getNode(link.target).getPortFromID(link.targetPort));
            }

            if (link.source) {
                linkOb.setSourcePort(this.getNode(link.source).getPortFromID(link.sourcePort));
            }

            this.addLink(linkOb);
        });
    }

    serializeGraph() {
        return _.merge(this.serialize(), {
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            zoom: this.zoom,
            gridSize: this.gridSize,
            links: _.map(this.links, link => {
                return link.serialize();
            }),
            nodes: _.map(this.nodes, link => {
                return link.serialize();
            })
        });
    }

    clearSelection(ignore = null) {
        _.forEach(this.getSelectedItems(), element => {
            if (ignore && ignore.getID() === element.getID()) {
                return;
            }
            element.setSelected(false); //TODO dont fire the listener
        });
    }

    getSelectedItems(...filters) {
        if (!Array.isArray(filters)) {
            filters = [filters];
        }
        var items = [];

        // run through nodes
        items = items.concat(_.flatMap(this.nodes, node => {
            return node.getSelectedEntities();
        }));

        // find all the links
        items = items.concat(_.flatMap(this.links, link => {
            return link.getSelectedEntities();
        }));

        //find all points
        items = items.concat(_.flatMap(this.links, link => {
            return _.flatMap(link.points, point => {
                return point.getSelectedEntities();
            });
        }));

        items = _.uniq(items);

        if (filters.length > 0) {
            items = _.filter(_.uniq(items), (item) => {
                if (_.includes(filters, "node") && item instanceof NodeModel) {
                    return true;
                }
                if (_.includes(filters, "link") && item instanceof LinkModel) {
                    return true;
                }
                if (_.includes(filters, "port") && item instanceof PortModel) {
                    return true;
                }
                return false;
            });
        }

        return items;
    }

    setZoomLevel(zoom) {
        this.zoom = zoom;

        this.iterateListeners((listener, event) => {
            listener.zoomUpdated && listener.zoomUpdated({
                ...event,
                zoom: zoom
            });
        });
    }

    setOffset(offsetX, offsetY) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.iterateListeners((listener, event) => {
            listener.offsetUpdated && listener.offsetUpdated({
                ...event,
                offsetX: offsetX,
                offsetY: offsetY
            });
        });
    }

    setOffsetX(offsetX) {
        this.offsetX = offsetX;
        this.iterateListeners((listener, event) => {
            listener.offsetUpdated && listener.offsetUpdated({
                ...event,
                offsetX: offsetX,
                offsetY: this.offsetY
            });
        });
    }

    setOffsetY(offsetY) {
        this.offsetY = offsetY;
        this.iterateListeners((listener, event) => {
            listener.offsetUpdated && listener.offsetUpdated({
                ...event,
                offsetX: this.offsetX,
                offsetY: this.offsetY
            });
        });
    }

    getOffsetY() {
        return this.offsetY;
    }

    getOffsetX() {
        return this.offsetX;
    }

    getZoomLevel() {
        return this.zoom;
    }

    getNode(node) {
        if (node instanceof NodeModel) {
            return node;
        }
        if (!this.nodes[node]) {
            return null;
        }
        return this.nodes[node];
    }

    getLink(link) {
        if (link instanceof LinkModel) {
            return link;
        }
        if (!this.links[link]) {
            return null;
        }
        return this.links[link];
    }

    addLink(link) {
        link.addListener({
            entityRemoved: () => {
                this.removeLink(link);
            }
        });
        this.links[link.getID()] = link;

        this.iterateListeners((listener, event) => {
            listener.linksUpdated && listener.linksUpdated({
                ...event,
                link: link,
                isCreated: true
            });
        });
        return link;
    }

    addNode(node) {
        node.addListener({
            entityRemoved: () => {
                this.removeNode(node);
            }
        });
        this.nodes[node.getID()] = node;
        this.iterateListeners((listener, event) => {
            listener.nodesUpdated && listener.nodesUpdated({
                ...event,
                node: node,
                isCreated: true
            });
        });
        return node;
    }

    removeLink(link) {
        link = this.getLink(link);
        link.sourcePort && delete link.sourcePort.parentNode.ports[link.sourcePort.name].links[link.getID()];
        link.targetPort && delete link.targetPort.parentNode.ports[link.targetPort.name].links[link.getID()];
        delete this.links[link.getID()];
        this.iterateListeners((listener, event) => {
            listener.linksUpdated && listener.linksUpdated({
                ...event,
                link: link,
                isCreated: false
            });
        });
    }

    removeNode(node) {
        node = this.getNode(node);

        for (let key in node.ports) {
            let links = node.ports[key].links;
            for (let link in links) {
                this.removeLink(links[link]);
            }
        }

        delete this.nodes[node.getID()];
        this.iterateListeners((listener, event) => {
            listener.nodesUpdated && listener.nodesUpdated({
                ...event,
                node: node,
                isCreated: false
            });
        });
    }

    getLinks() {
        return this.links;
    }

    getNodes() {
        return this.nodes;
    }
}
