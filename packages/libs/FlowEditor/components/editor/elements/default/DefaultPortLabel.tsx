import * as React from "react";
import  {PortWidget} from './PortWidget';

export class DefaultPortLabel extends React.Component<any,any> {
    render() {
        var port = this.props.port;
        var portWidget = <PortWidget port={port} />;
        var desc = port.label;

        return (
            <div className={(port.in ? "in" : "out") + "-port"} title={desc}>
                {portWidget}
            </div>
        );
    }
}
