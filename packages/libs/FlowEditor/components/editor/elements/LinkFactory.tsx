import * as React from "react";
import {AbstractFactory} from "./AbstractFactory";
import {DefaultLinkWidget} from "./default/DefaultLinkWidget";

export class LinkFactory extends AbstractFactory {
    constructor() {
        super("default");
    }

    generateReactWidget(graphEngine, link) {
        return React.createElement(DefaultLinkWidget, {
            link: link
            , graphEngine: graphEngine
        });
    }
}
