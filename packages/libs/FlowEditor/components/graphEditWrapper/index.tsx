import * as React from "react";

import {DragItemType} from '../registry/DragItemType';
import {DropTarget} from 'react-dnd';
import {GraphEdit} from "../editor";

const dropTargetContract = {
    canDrop(props, monitor) {
        // You can disallow drop based on props or item
        return true;
    }

    , drop(props, monitor, component) {
        if (monitor.didDrop()) {
            return;
        }
        props.onDrop && props.onDrop(monitor, props);
    }
};

// Specifies which props to inject into your drop component.
function collect(connect, monitor) {
    let item = monitor.getItem();
    let isMe = monitor.getItemType() == DragItemType;

    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDropTarget: connect.dropTarget(),
        // transfer dragging item data
        // draggingItem: monitor.getItem(),
        // You can ask the monitor about the current drag state:
        isOver: monitor.isOver() && isMe,
        //https://github.com/gaearon/react-dnd/issues/365
        isDragging: !!(monitor.getItem()) && isMe,
        isOverCurrent: monitor.isOver({shallow: true}),
        canDrop: monitor.canDrop(),
        didDrop: monitor.didDrop(),
        itemType: monitor.getItemType(),
        dropResult: monitor.getDropResult()
    }
}

class GraphEditWrapper extends React.Component<any> {

    render() {
        const {isDragging, isOver, connectDropTarget} = this.props;
        return connectDropTarget(<div>
            <GraphEdit {...this.props}/>
        </div>);
    }

}

 export default  DropTarget(DragItemType, dropTargetContract, collect)(GraphEditWrapper);
