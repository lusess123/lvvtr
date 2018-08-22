import * as React from "react";
import classNames from 'classnames';

export class PortWidget extends React.Component<any,any> {
    constructor(props) {
        super(props);
        this.state = {
            selected: false
        };
    }

    render() {
        var {port} = this.props;
        var name = port.name
            , joinAble = port.joinAble
            , node = port.getParent();

        return (
            <div
                onMouseEnter={() => {
                    this.setState({selected: true});
                }}
                onMouseLeave={() => {
                    this.setState({selected: false});
                }}
                className={classNames({
                    "port": true
                    , "selected": this.state.selected
                    , "joinable": joinAble
                })}
                data-name={name}
                id={"port" + port.id}
                data-nodeid={node.getID()}
            />
        );
    }
}

