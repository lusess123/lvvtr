import * as React from "react";
import * as _ from "lodash";
import classNames from 'classnames';

class NodeWidget extends React.Component<any> {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return this.props.graphEngine.canEntityRepaint(this.props.node);
    }

    render() {
        var {node} = this.props;
        var joinAble = node.joinAble;
        return (
            <div
                data-nodeid={node.id}
                id={"node" + node.id}
                className={classNames({
                    "node": true
                    , "selected": node.isSelected()
                    , "joinable": joinAble
                })}
                style={{
                    top: node.y,
                    left: node.x
                }}
            >
                {this.props.children}
            </div>
        );
    }
}

export class NodeLayer extends React.Component<any> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate() {
        this.props.graphEngine.nodesRendered = true;
    }

    render() {
        var graphModel = this.props.graphEngine.getGraphModel();
        return (
            <div
                className="node-view"
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
                {_.map(graphModel.getNodes(), node => {
                    return React.createElement(
                        NodeWidget,
                        {
                            graphEngine: this.props.graphEngine,
                            key: node.id,
                            node: node
                        },
                        this.props.graphEngine.generateWidgetForNode(node, this.props)
                    );
                })}
            </div>
        );
    }
}
