import {Toolkit} from "../../utils/Toolkit";
import * as _ from "lodash"

export class BaseEntity {
    listeners;
    id;
    locked;
    
    constructor(id?) {
        this.listeners = {};
        this.id = id || Toolkit.UID();
        this.locked = false
    }

    getID() {
        return this.id
    }

    doClone(lookupTable, clone) {
        if (lookupTable === void 0) {
            lookupTable = {}
        }
    }

    clone(lookupTable) {
        if (lookupTable === void 0) {
            lookupTable = {}
        }
        // try and use an existing clone first
        if (lookupTable[this.id]) {
            return lookupTable[this.id]
        }
        var clone = _.clone(this);
        clone.id = Toolkit.UID();
        clone.clearListeners();
        lookupTable[this.id] = clone;
        this.doClone(lookupTable, clone);
        return clone
    }

    deSerialize(data) {
        this.id = data.id
    }

    serialize() {
        return {
            id: this.id
        }
    }

    iterateListeners(cb) {
        var event = {
            id: Toolkit.UID(),
            firing: true,
            entity: this,
            stopPropagation: function () {
                event.firing = false
            }
        };
        for (var i in this.listeners) {
            // propagation stopped
            if (!event.firing) {
                return
            }
            cb(this.listeners[i], event)
        }
    }

    removeListener(listener) {
        if (this.listeners[listener]) {
            delete this.listeners[listener];
            return true
        }
        return false
    }

    addListener(listener) {
        var uid = Toolkit.UID();
        this.listeners[uid] = listener;
        return uid
    }

    clearListeners() {
        this.listeners = {}
    }

    isLocked() {
        return this.locked
    }

    setLocked(locked) {
        if (locked === void 0) {
            locked = true
        }
        this.locked = locked;
        this.iterateListeners(function (listener, event) {
            if (listener.lockChanged) {
                listener.lockChanged(_.assign({}, event, {locked: locked}))
            }
        })
    }
}
