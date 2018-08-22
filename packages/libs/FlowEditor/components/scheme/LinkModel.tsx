import * as _ from "lodash";
import {BaseModel} from "./BaseModel";
import {PointModel} from "./PointModel";

export class LinkModel extends BaseModel {
    points;
    extras;
    sourcePort;
    targetPort;
    label;
    getPoints(){

    }

    constructor(linkType = "default", id?) {
        super(linkType, id);
        this.points = [new PointModel(this, {x: 0, y: 0}), new PointModel(this, {x: 0, y: 0})];// 目前只支持起始点和结束点，后期可扩展修改支持
        this.extras = {};
        this.sourcePort = null;
        this.targetPort = null;
        this.label = null;
    }

    deSerialize(ob) {
        super.deSerialize(ob);
        this.extras = ob.extras;
        this.points = _.map(ob.points, (point) => {
            var p = new PointModel(this, {x: point.x, y: point.y});
            p.deSerialize(point);
            return p;
        });
        this.label = ob.label || null;
    }

    serialize() {
        return _.merge(super.serialize(), {
            source: this.sourcePort ? this.sourcePort.getParent().id : null,
            sourcePort: this.sourcePort ? this.sourcePort.id : null,
            target: this.targetPort ? this.targetPort.getParent().id : null,
            targetPort: this.targetPort ? this.targetPort.id : null,
            points: _.map(this.points, point => {
                return point.serialize();
            }),
            extras: this.extras,
            label: this.label || undefined
        });
    }

    doClone(lookupTable = {}, clone) {
        clone.setPoints(
            _.map(this.getPoints(), (point) => {
                return point.clone(lookupTable);
            })
        );
        if (this.sourcePort) {
            clone.setSourcePort(this.sourcePort.clone(lookupTable));
        }
        if (this.targetPort) {
            clone.setTargetPort(this.targetPort.clone(lookupTable));
        }
    }

    remove() {
        if (this.sourcePort) {
            this.sourcePort.removeLink(this);
        }
        if (this.targetPort) {
            this.targetPort.removeLink(this);
        }
        super.remove();
    }

    isLastPoint(point) {
        var index = this.getPointIndex(point);
        return index === this.points.length - 1;
    }

    getPointIndex(point) {
        return this.points.indexOf(point);
    }

    getPointModel(id) {
        for (var i = 0; i < this.points.length; i++) {
            if (this.points[i].id === id) {
                return this.points[i];
            }
        }
        return null;
    }

    getPortForPoint(point) {
        if (this.sourcePort !== null && this.getFirstPoint().getID() === point.getID()) {
            return this.sourcePort;
        }
        if (this.targetPort !== null && this.getLastPoint().getID() === point.getID()) {
            return this.targetPort;
        }
        return null;
    }

    getPointForPort(port) {
        if (this.sourcePort !== null && this.sourcePort.getID() === port.getID()) {
            return this.getFirstPoint();
        }
        if (this.targetPort !== null && this.targetPort.getID() === port.getID()) {
            return this.getLastPoint();
        }
        return null;
    }

    getFirstPoint() {
        return this.points[0];
    }

    getLastPoint() {
        return this.points[this.points.length - 1];
    }

    setSourcePort(port) {
        port.addLink(this);
        this.sourcePort = port;
        this.iterateListeners((listener, event) => {
            listener.sourcePortChanged && listener.sourcePortChanged({...event, port: port});
        });
    }

    getSourcePort() {
        return this.sourcePort;
    }

    getTargetPort() {
        return this.targetPort;
    }

    setTargetPort(port) {
        port.addLink(this);
        this.targetPort = port;
        this.iterateListeners((listener, event) => {
            listener.targetPortChanged && listener.targetPortChanged({...event, port: port});
        });
    }

    getLabel() {
        return this.label;
    }

    setLabel(label) {
        this.label = label;
    }

}
