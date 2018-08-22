import * as React from "react";
import classNames from 'classnames';

export class DefaultLinkWidget extends React.Component<any,any> {
    static defaultProps = {
        color: "black",
        width: 3,
        link: null,
        engine: null,
        graphEngine: null
    };

    refPaths:any ;
    refLabel:any;

    constructor(props) {
        super(props);
        this.state = {
            selected: false // hover 选中
        };
        this.findPathAndRelativePositionToRenderLabel = this.findPathAndRelativePositionToRenderLabel.bind(this);
        this.calculateLabelPosition = this.calculateLabelPosition.bind(this);
    }

    findPathAndRelativePositionToRenderLabel() {
        // an array to hold all path lengths, making sure we hit the DOM only once to fetch this information
        const lengths = this.refPaths.map(path => path.getTotalLength());

        // calculate the point where we want to display the label
        let labelPosition = lengths.reduce((previousValue, currentValue) => previousValue + currentValue, 0) / 2;

        // find the path where the label will be rendered and calculate the relative position
        let pathIndex = 0;
        while (pathIndex < this.refPaths.length) {
            if (labelPosition - lengths[pathIndex] < 0) {
                return {
                    path: this.refPaths[pathIndex],
                    position: labelPosition
                };
            }

            // keep searching
            labelPosition -= lengths[pathIndex];
            pathIndex++;
        }
    }

    calculateLabelPosition() {
        if (!this.refLabel) {
            // no label? nothing to do here
            return;
        }

        const {path, position} = this.findPathAndRelativePositionToRenderLabel();

        const labelDimensions = {
            width: this.refLabel.offsetWidth,
            height: this.refLabel.offsetHeight
        };

        const pathCentre = path.getPointAtLength(position);

        const labelCoordinates = {
            x: pathCentre.x - labelDimensions.width / 2,
            y: pathCentre.y - labelDimensions.height / 2
        };

        this.refLabel.setAttribute("style", `transform: translate(${labelCoordinates.x}px, ${labelCoordinates.y}px);`);
    }

    componentDidUpdate() {
        window.requestAnimationFrame(this.calculateLabelPosition);
    }

    componentDidMount() {
        window.requestAnimationFrame(this.calculateLabelPosition);
    }

    generateCurvePath(firstPoint, lastPoint) {
        var sourceX = firstPoint.x;
        var sourceY = firstPoint.y;
        var targetX = lastPoint.x;
        var targetY = lastPoint.y;
        var nodeSize = 100;
        var CURVE = nodeSize;

        // Organic / curved edge
        var c1X, c1Y, c2X, c2Y;
        if (targetX - 5 < sourceX) {
            var curveFactor = (sourceX - targetX) * CURVE / 200;
            if (Math.abs(targetY - sourceY) < nodeSize / 2) {
                // Loopback
                c1X = sourceX + curveFactor;
                c1Y = sourceY - curveFactor;
                c2X = targetX - curveFactor;
                c2Y = targetY - curveFactor;
            } else {
                // Stick out some
                c1X = sourceX + curveFactor;
                c1Y = sourceY + (targetY > sourceY ? curveFactor : -curveFactor);
                c2X = targetX - curveFactor;
                c2Y = targetY + (targetY > sourceY ? -curveFactor : curveFactor);
            }
        } else {
            // Controls halfway between
            c1X = sourceX + (targetX - sourceX) / 2;
            c1Y = sourceY;
            c2X = c1X;
            c2Y = targetY;
        }

        return ["M", sourceX, sourceY, "C", c1X, c1Y, c2X, c2Y, targetX, targetY].join(" ");
    }

    generateLink(extraProps, id) {
        var props = this.props;
        var {link} = props;
        var Bottom = (
            <path
                className={classNames({
                    "selected": this.state.selected || link.isSelected()
                })}
                markerEnd={"url(#markerArrow)" }
                strokeWidth={props.width}
                stroke={props.color}
                ref={path => path && this.refPaths.push(path)}
                {...extraProps}
            />
        );

        var Top = (
            <path
                strokeLinecap="round"
                data-linkid={this.props.link.getID()}
                stroke={props.color}
                strokeOpacity={this.state.selected ? 0.15 : 0}
                strokeWidth={20}
                onMouseLeave={() => {
                    this.setState({selected: false});
                }}
                onMouseEnter={() => {
                    if (link.isSelectedAble()) {
                        this.setState({selected: true});
                    }
                }}
                {...extraProps}
            />
        );

        return (
            <g key={"link-" + id}>
                {Bottom}
                {Top}
            </g>
        );
    }

    generateLabel() {
        const canvas = this.props.graphEngine.canvas;
        return (
            <foreignObject className="link-label" width={canvas.offsetWidth} height={canvas.offsetHeight}>
                <div ref={label => (this.refLabel = label)}>{this.props.link.label}</div>
            </foreignObject>
        );
    }

    render() {
        var link = this.props.link;
        var points = link.points;
        var paths = [];
        var model = this.props.graphEngine.getGraphModel();
        var pointLeft = link.getFirstPoint();
        var pointRight = link.getLastPoint();

        var d = this.generateCurvePath(pointLeft, pointRight);
        paths.push(
            this.generateLink(
                {
                    d: d
                },
                "0"
            )
        );

        // ensure we have the right references when a redraw occurs
        this.refLabel = null;
        this.refPaths = [];

        return (
            <g>
                {paths}
                {this.props.link.label && this.generateLabel()}
            </g>
        );
    }
}
