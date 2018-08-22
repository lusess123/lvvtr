import * as React from "react";
import {AbstractFactory} from "./AbstractFactory";
import {DefaultNodeWidget} from "./default/DefaultNodeWidget";

export class NodeFactory extends AbstractFactory {
    constructor() {
        super("default");
    }

    generateReactWidget(graphEngine, node, props) {
        return React.createElement(DefaultNodeWidget, {
            node: node,
            graphEngine: graphEngine,
            ...props
        });
    }
}
