import * as React from "react";
import * as _ from "lodash";
import {DefaultPortLabel} from './DefaultPortLabel';


export class DefaultNodeWidget extends React.Component<any> {

    constructor(props) {
        super(props);
    }

    generatePort(port) {
        return <DefaultPortLabel port={port} key={port.id}/>;
    }

    onDblClick = (e) => {
        this.props.onNodeDbClick && this.props.onNodeDbClick(e);
    };

    showStatus(status) {
        if (status === "running") {
            return <i className="running"></i>
        }else if (status === "finished") {
            return <i className="icon_single-box-2"></i>
        }else if (status === "failed") {
            return <i className="icon_shut-down"></i>
        }
    }

    render() {
        let {node} = this.props;
        let status = node.status;
        return (
            <div className="basic-node"
                 title={node.statusDetail}
                 style={{background: node.color}}
                 onDoubleClick={this.onDblClick}
            >
                { status &&
                    <div className="status">
                    { this.showStatus(status) }
                    </div>
                }
                <div className="icon "><i className={node.icon}/></div>

                <div className="text" title={node.description}>
                    <div className="name">{node.title}</div>
                </div>

                <div className="ports">
                    <div className="in">{_.map(node.getInPorts(), this.generatePort.bind(this))}</div>
                    <div className="out">{_.map(node.getOutPorts(), this.generatePort.bind(this))}</div>
                </div>
            </div>
        );
    }
}
