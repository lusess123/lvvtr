import * as React from "react";
import * as _ from "lodash";

class LinkWidget extends React.Component<any,any> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate() {
        return this.props.graphEngine.canEntityRepaint(this.props.link);
    }

    render() {
        return this.props.children;
    }
}

export class LinkLayer extends React.Component<any> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        var graphEngine = this.props.graphEngine;
        var graphModel = this.props.graphEngine.getGraphModel();
        return (
            <svg
                style={{
                    transform: "translate(" +
                    graphModel.getOffsetX() +
                    "px," +
                    graphModel.getOffsetY() +
                    "px) scale(" +
                    graphModel.getZoomLevel() / 100.0 +
                    ")",
                    width: "100%",
                    height: "100%"
                }}
            >
                <defs
                    dangerouslySetInnerHTML={// react 14 尚不支持orient等属性
                        {
                            __html: [
                                "<marker id='markerArrow' orient='auto' markerWidth='6' markerHeight='6' refx='2' refy='3'>"
                                , " <path d='M0,0 L3,3 L0,6 Z'/>"
                                , "</marker>"
                            ].join("")
                        }
                    }
                >
                </defs>
                {//only perform these actions when we have a graph
                    this.props.graphEngine.canvas &&
                    _.map(graphModel.getLinks(), link => {
                        if (this.props.graphEngine.nodesRendered &&
                            !graphEngine.linksThatHaveInitiallyRendered[link.id]) {
                            if (link.sourcePort !== null) {
                                try {
                                    link.getFirstPoint().updateLocation(
                                        this.props.graphEngine.getPortCenter(link.sourcePort)
                                    );
                                    graphEngine.linksThatHaveInitiallyRendered[link.id] = true;
                                } catch (ex) {
                                }
                            }

                            if (link.targetPort !== null) {
                                try {
                                    link.getLastPoint().updateLocation(
                                        this.props.graphEngine.getPortCenter(link.targetPort)
                                    );
                                    graphEngine.linksThatHaveInitiallyRendered[link.id] = true;
                                } catch (ex) {
                                }
                            }
                        }

                        //generate links
                        var generatedLink = this.props.graphEngine.generateWidgetForLink(link);
                        if (!generatedLink) {
                            console.log("no link generated for type: " + link.getType());
                            return null;
                        }

                        return (
                            <LinkWidget key={link.getID()} link={link} graphEngine={this.props.graphEngine}>
                                {React.cloneElement(generatedLink, {})}
                            </LinkWidget>
                        );
                    })}
            </svg>
        );
    }
}
