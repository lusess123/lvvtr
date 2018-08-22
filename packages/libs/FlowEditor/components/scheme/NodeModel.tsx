import * as _ from "lodash";
import {BaseModel} from "./BaseModel";

class NodeModelBase extends BaseModel {
    x;
    y;
    extras;
    ports;

    constructor(nodeType, id) {
        super(nodeType, id);
        this.x = 0;
        this.y = 0;
        this.extras = {};
        this.ports = {};
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }


    // getSelectedEntities() {
    //     super.getSelectedEntities();
    // }

    deSerialize(ob) {
        super.deSerialize(ob);
        this.x = ob.x;
        this.y = ob.y;
        this.extras = ob.extras;
    }

    serialize() {
        return _.merge(super.serialize(), {
            x: this.x,
            y: this.y,
            extras: this.extras,
            ports: _.map(this.ports, port => {
                return port.serialize();
            })
        });
    }

    doClone(lookupTable = {}, clone) {
        // also clone the ports
        clone.ports = {};
        _.values(this.ports).forEach(port => {
            clone.addPort(port.clone(lookupTable));
        });
    }

    remove() {
        super.remove();
        for (var i in this.ports) {
            _.forEach(this.ports[i].getLinks(), link => {
                link.remove();
            });
        }
    }

    getPortFromID(id) {
        for (var i in this.ports) {
            if (this.ports[i].id === id) {
                return this.ports[i];
            }
        }
        return null;
    }

    getPort(name) {
        return this.ports[name];
    }

    getPorts() {
        return this.ports;
    }

    removePort(port) {
        //clear the parent node reference
        if (this.ports[port.name]) {
            this.ports[port.name].setParentNode(null);
            delete this.ports[port.name];
        }
    }

    addPort(port) {
        port.setParentNode(this);
        this.ports[port.name] = port;
        return port;
    }
}

//------

const defaultValues = {
    title: "未命名"
    , bkClass: ""
    , color: "rgb(0,192,255)"
    , icon: ""
    , description: ""
    , status: null
    , statusDetail: null
    , argument: {args:[]}
    , subtype:""
    , widgetId:""
};

export class NodeModel extends NodeModelBase {
    title;
    bkClass;
    color;
    status;
    statusDetail;
    icon;
    description;
    info;
    argument;
    subtype;
    widgetId;
    joinAble;

    constructor(values) {
        values = Object.assign({}, defaultValues, values);
        super(values.type, values.id);
        this.title = values.title;
        this.bkClass = values.bkClass;
        this.color = values.color;
        this.status = values.status;
        this.statusDetail = values.statusDetail
        this.icon = values.icon;
        this.description = values.description;
        this.info = values.info;
        this.argument = values.argument;
        this.subtype = values.subtype;
        this.widgetId = values.widgetId;
    }

    setJoinAble(able) {
        this.joinAble = able;
    }

    setStatus(status) {
        this.status = status;
    }

    setStatusDetail(statusDetail) {
        this.statusDetail = statusDetail;
    }

    isJoinAble() {
        return this.joinAble;
    }

    deSerialize(object) {
        super.deSerialize(object);
        this.title = object.title;
        this.bkClass = object.bkClass;
        this.color = object.color;
        this.status = object.status;
        this.statusDetail = object.statusDetail;
        this.icon = object.icon;
        this.description = object.description;
        this.argument = object.argument;
        this.subtype = object.subtype;
        this.widgetId = object.widgetId;
    }

    serialize() {
        return _.merge(super.serialize(), {
            title: this.title
            , bkClass: this.bkClass
            , color: this.color
            , status: this.status
            , statusDetail: this.statusDetail
            , icon: this.icon
            , description: this.description
            , subtype: this.subtype
            , widgetId: this.widgetId
            , argument: this.argument
        });
    }

    setArgument(key, value) {
        let index = -1;
        this.argument.args.map((item,i)=>{
            if (item.key === key) {
                index = i;
                return;
            }
        })
        if (index>=0) {
            this.argument.args[index].value = value;
        }
    }

    getInPorts() {
        return _.filter(this.ports, portModel => {
            return portModel.in;
        });
    }

    getOutPorts() {
        return _.filter(this.ports, portModel => {
            return !portModel.in;
        });
    }
}
