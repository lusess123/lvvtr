import * as _ from "lodash";
import {BaseModel} from "./BaseModel";

export class PointModel extends BaseModel {
   
    x;
    y;
    link;
    constructor(link, points) {
        super();
        this.x = points.x;
        this.y = points.y;
        this.link = link;
    }

    isConnectedToPort() {
        return this.link.getPortForPoint(this) !== null;
    }

    getSelectedEntities() {
        if (super.isSelected()) {
            return [this];
        }
        return [];
    }

    deSerialize(ob) {
        super.deSerialize(ob);
        this.x = ob.x;
        this.y = ob.y;
    }

    serialize() {
        return _.merge(super.serialize(), {
            x: this.x,
            y: this.y
        });
    }

    updateLocation(points) {
        this.x = points.x;
        this.y = points.y;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getLink() {
        return this.link;
    }

    isLocked() {
        return super.isLocked() || this.getLink().isLocked();
    }
}
