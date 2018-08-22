import * as _ from "lodash";
import {BaseModel} from "./BaseModel";
import {LinkModel} from "./LinkModel";

class PortModelBase extends BaseModel {

    name;
    links;
    parentNode;

    constructor(name, type, id) {
        super(type, id);
        this.name = name;
        this.links = {};
        this.parentNode = null;
    }

    deSerialize(ob) {
        super.deSerialize(ob);
        if (ob.name) {
            this.name = ob.name;
        }else {
            this.name = ob.in ? 'in'+ ob.idx : 'out'+ ob.idx;
        }
    }

    serialize() {
        return _.merge(super.serialize(), {
            name: this.name,
            parentNode: this.parentNode.id,
            links: _.map(this.links, link => {
                return link.id;
            })
        });
    }

    doClone(lookupTable = {}, clone) {
        clone.links = {};
        clone.parentNode = this.parentNode.clone(lookupTable);
    }

    getName() {
        return this.name;
    }

    getParent() {
        return this.parentNode;
    }

    setParentNode(node) {
        this.parentNode = node;
    }

    removeLink(link) {
        delete this.links[link.getID()];
    }

    addLink(link) {
        this.links[link.getID()] = link;
    }

    getLinks() {
        return this.links;
    }

    createLinkModel() {
        var linkModel = new LinkModel();
        linkModel.setSourcePort(this);
        return linkModel;
    }

    isLocked() {
        return super.isLocked() || this.getParent().isLocked();
    }
}

//------

export class PortModel extends PortModelBase {
   in ;
   idx;
   label;
   joinAble;

    constructor(isInput?, name?, label?, idx?, type?, id?) {
        super(name, type, id);
        this.in = isInput;
        this.idx = idx;
        this.label = label || name;
    }

    setJoinAble(able) {
        this.joinAble = able;
    }

    isJoinAble() {
        return this.joinAble;
    }

    deSerialize(object) {
        super.deSerialize(object);
        this.in = object.in;
        this.label = object.label;
        this.idx = object.idx;
    }

    serialize() {
        return _.merge(super.serialize(), {
            in: this.in,
            label: this.label,
            idx:this.idx
        });
    }
}
