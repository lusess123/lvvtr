import * as _ from "lodash";
import {BaseEntity} from "./BaseEntity";

export class BaseModel extends BaseEntity {
    type;
    selected;
    selectedAble;

    constructor(type = "default", id?) {
        super(id);
        this.type = type;
        this.selected = false;
        this.selectedAble = true;
    }

    getSelectedEntities() {
        if (this.isSelected()) {
            return [this];
        }
        return [];
    }

    deSerialize(ob) {
        super.deSerialize(ob);
        var selectedAble = ob.selectedAble;
        if (selectedAble == undefined) {
            selectedAble = this.selectedAble;
        }
        this.type = ob.type;
        this.selected = ob.selected;
        this.selectedAble = selectedAble;
    }

    serialize() {
        return _.merge(super.serialize(), {
            type: this.type,
            selectedAble: this.selectedAble,
            selected: this.selected
        });
    }

    getType() {
        return this.type;
    }

    getID() {
        return this.id;
    }

    isSelected() {
        return this.selected;
    }

    isSelectedAble() {
        return this.selectedAble;
    }

    setSelectedAble(able = true) {
        this.selectedAble = able;
        if (able === false) {
            this.selected = false;
        }
    }

    setSelected(selected = true) {
        if (!this.isSelectedAble()) {
            return;
        }
        this.selected = selected;
        this.iterateListeners((listener, event) => {
            if (listener.selectionChanged) {
                listener.selectionChanged({...event, isSelected: selected});
            }
        });
    }

    remove() {
        this.iterateListeners((listener, event) => {
            if (listener.entityRemoved) {
                listener.entityRemoved(event);
            }
        });
    }
}
