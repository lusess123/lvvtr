import React, { PureComponent } from 'react'
import './style.scss'
import classNames from 'classnames';
import Wrapper from './wrapper'

import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import * as _ from "lodash";
import shallowequal from 'shallowequal'
import gridsass from "antd-grid-sass/index.scss"
console.log(gridsass);
import Immutable from 'immutable';

const closest = (element, selector) => {
    return element.closest(selector); //todo import closest
}

const getNodeElement = (target, ids) => {
    return closest(target, ids);
}

export class ContainerDetail extends React.Component<any,
    any> {
    _perfForceUpdate;

    constructor(p, c) {
        super(p, c);

        const pos = p.pos.toJS();

        this.state = {
            pos:pos.map(node=>{
                return  {...node}
            }),
            start: pos.map(node=>{
                return  {...node}
            }),
            model: {
                zoom: 100,
                OffsetX: 0,
                OffsetY: 0
                
            },
            mid:this.props.mid
        }

        this.onMouseDown = this
            .onMouseDown
            .bind(this);
        this.onMouseMove = this
            .onMouseMove
            .bind(this);
        this.onDocumentMouseUp = this
            .onDocumentMouseUp
            .bind(this);
        this.onWheel = this
            .onWheel
            .bind(this);
        this._perfForceUpdate = _
            .debounce(this.forceUpdate, 10)
            .bind(this); // 减少调用次数的优化,但是又不能失帧
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // console.log();
        if( JSON.stringify(nextProps.pos.toJS()) != JSON.stringify(prevState.start)){
            const _pos = nextProps.pos.toJS();
            return {
                pos:_pos.map(node=>{
                    return  {...node}
                }),
                start: prevState.pos.map(node=>{
                    return  {...node}
                }),
                mid:nextProps.mid
            }
        }else 
        return null;
        
    }

    onMouseDown(event) {
        // debugger;
        const _node = getNodeElement(event.target, ".node[data-nodeid]");
        if (_node) {
            //alert(_node.getAttribute("data-nodeid"));
            this._session = {
                isRightButton: event.button == 2,
                isLeftButton: event.button == 0,
                startElement: _node,
                startEvent: event,
                id:_node.getAttribute("data-nodeid")
            };
        }
        else {
            const _editor = getNodeElement(event.target, ".sophon-workflow-editor");
            if(_editor){
                this._session = {
                    isRightButton: event.button == 2,
                    isLeftButton: event.button == 0,
                   // startElement: _node,
                    isEditor:true,
                    startEvent: event
                };
            }
        }
        console.log(this._session);
    }
    _session;

    onDocumentMouseDown(event) { }
    onMouseMove(event) {
        let isMoved = false;
        let _newAction;
        if (this._session) {
            // debugger;
            const { action, startEvent, startElement } = this._session;

            if (action == null) { // 初始状态
                let deltaX = event.clientX - startEvent.clientX;
                let deltaY = event.clientY - startEvent.clientY;
                // isMoved = Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5; if (startElement) {
                // // 拖动元素
                _newAction = {
                    mouseX: event.clientX,
                    mouseY: event.clientY
                };
                // }
            } else {
                let amountX = event.clientX - action.mouseX;
                let amountY = event.clientY - action.mouseY;

                _newAction = action;
                _newAction.amountX = amountX;
                _newAction.amountY = amountY;
                _newAction.mouseX = event.clientX;
                _newAction.mouseY = event.clientY;
            }

            this._session = {
                ...this._session,
                ...{
                    isMoved,
                    action: _newAction
                }
            };
           
            if (_newAction && (_newAction.amountX || _newAction.amountY) ) {
               // this.state.pos.X = this.state.pos.X + _newAction.amountX;
              //  this.state.pos.Y = this.state.pos.Y + _newAction.amountY;
              if(!this._session.isEditor){
              this.state.pos[this._session.id] = {
                  X:this.state.pos[this._session.id].X + _newAction.amountX,
                  Y:this.state.pos[this._session.id].Y + _newAction.amountY
              }
            }else{
                this.state.model.OffsetX = this.state.model.OffsetX + _newAction.amountX;
                this.state.model.OffsetY = this.state.model.OffsetY + _newAction.amountY;
            }
                this._perfForceUpdate();
                //this.forceUpdate();

            }
        }

    }

    onDocumentMouseUp(event) {
        if (this._session) {
            const _id = this._session.id;
            this._session = undefined;
            this
                .props
                .setPos({ X: this.state.pos[_id].X, Y: this.state.pos[_id].Y ,id:_id});
        }
    }
    onWheel(event) {
        event.preventDefault();
        event.stopPropagation();

        const oldZoomFactor = this.state.model.zoom / 100;
        let scrollDelta = -event.deltaY;
        scrollDelta /= 60;
        if (this.state.model.zoom + scrollDelta > 10) {
            this.state.model.zoom = (this.state.model.zoom + scrollDelta);
        }
        const zoomFactor = this.state.model.zoom / 100;
        console.log("当前元素：");
        console.log( event.currentTarget);
        const boundingRect = event
            .currentTarget
            .getBoundingClientRect();
        console.log(boundingRect);
        const clientWidth = boundingRect.width;
        const clientHeight = boundingRect.height;
        // compute difference between rect before and after scroll
        const widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor;
        const heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor;
        // compute mouse coords relative to canvas
        const clientX = event.clientX - boundingRect.left;
        const clientY = event.clientY - boundingRect.top;

        // compute width and height increment factor
        const xFactor = (clientX - this.state.model.OffsetX) / oldZoomFactor / clientWidth;
        const yFactor = (clientY - this.state.model.OffsetY) / oldZoomFactor / clientHeight;

        this.state.model.OffsetX = this.state.model.OffsetX - widthDiff * xFactor;
        this.state.model.OffsetY = this.state.model.OffsetY - heightDiff * yFactor;

        this.forceUpdate();

    }

    renderEditor(setelm,k =1,height=500) {
        const NodeReact = Ediotr;
        return <div
            className={"graphContainer"}
            style={{
                height: height,
                position: "relative",
                overflow: "scroll"
            }}>
            <div
                className={"sophon-workflow-editor"}
                onWheel={(e)=>{if( k == 1){this.onWheel(e)}}}
                ref={ref => {
                    if (ref) {
                        if (setelm) {
                            setelm(ref);
                        }
                    }
                }}>
                <div
                    className="node-view"
                    style={{
                        transform: `translate(${this.state.model.OffsetX*k}px,${this.state.model.OffsetY*k}px) scale(${this.state.model.zoom / 100.0*k}) `,
                        width: "100%",
                        height: "100%",
                        border:"1px solid red"
                    }}>

                    
                    {
                        this.state.pos.map((node,index)=>{
                        return <NodeReact X={node.X} Y={node.Y}  key={index}  name={index} />;
                    })}


                    

                    {/* <div style={{
                         left:this.state.mid.XY.beginX-15,
                         top:this.state.mid.XY.beginY-15,
                         background:"blue",
                         width:this.state.mid.XY.endX - this.state.mid.XY.beginX+110,
                         height:this.state.mid.XY.endY - this.state.mid.XY.beginY+110 ,
                         position: "relative",
                         opacity:0.3
                     }}></div> */}
                   

                </div>
            </div>
            <div style={{position:"absolute",top:400,left:258,background:"green",width:142,height:100, opacity:0.7}}>
            {this.renderMiniEditor((elm) => { this.Elm1 = elm },142/(this.state.mid.XY.endX-this.state.mid.XY.beginX),100)}
            </div>
        </div>
    }

    renderMiniEditor(setelm,k =1,height=500) {
        const NodeReact = Ediotr;
        return <div
            className={"graphContainer"}
            style={{
                width:(this.state.mid.XY.endX - this.state.mid.XY.beginX+110)*k,
                height:100 ,
                position: "relative",
                overflow: "scroll",
                border:"1px solid "
            }}>
            <div
                className={"sophon-workflow-editor"}
                style={{cursor:"default"}}
                onWheel={(e)=>{if( k == 1){this.onWheel(e)}}}
                ref={ref => {
                    if (ref) {
                        if (setelm) {
                            setelm(ref);
                        }
                    }
                }}>
                <div
                    className="node-view"
                    style={{
                        transform: `translate(0px,0px) scale(${k}) `,
                       
                        border:"1px solid "
                    }}>
                    {
                        this.state.pos.map((node,index)=>{
                        return <NodeReact X={node.X-this.state.mid.XY.beginX} Y={node.Y-this.state.mid.XY.beginY}  key={index}  name={index}  />;
                    })}
                   
                     
                </div>
            </div>
        </div>
    }

    render() {


        return <div className="container">
        
           <div className="ak-row">
               <div className="ak-col-20">
            {this.renderEditor((elm) => { this.Elm = elm; })}
            </div>
            <div className="ak-col-1"></div>
            <div className="ak-col-3">
           
            </div>
            </div>


        </div>;
    }

    Elm = null;
    Elm1 = null;
    componentDidMount() {
        // console.log("Elm"); console.log(this.Elm);
        if (this.Elm) {
            document.addEventListener("mousedown", this.onDocumentMouseDown);
            // this.element.addEventListener("dblclick", this.onDblClick);
            this
                .Elm
                .addEventListener("mousedown", this.onMouseDown);
            this
                .Elm
                .addEventListener("mousemove", this.onMouseMove);

            document.addEventListener("mouseup", this.onDocumentMouseUp);
            // this.element.addEventListener("contextmenu", this.onContextMenu);
        }
        if (this.Elm1) {
           // document.addEventListener("mousedown", this.onDocumentMouseDown);
            // this.element.addEventListener("dblclick", this.onDblClick);
            this
                .Elm1
                .addEventListener("click", (event)=>{
                    event.preventDefault();
                    event.stopPropagation();

                    const boundingRect = event
                    .currentTarget
                    .getBoundingClientRect();

                    const clientX = event.clientX - boundingRect.left;
                    const clientY = event.clientY - boundingRect.top;

                    this.state.model.OffsetX =  clientX*10;
                    this.state.model.OffsetY =  clientY*10;
            
                    this.forceUpdate();

                });
            // this
            //     .Elm1
            //     .addEventListener("mousemove", this.onMouseMove);

            // document.addEventListener("mouseup", this.onDocumentMouseUp);
            // this.element.addEventListener("contextmenu", this.onContextMenu);
        }
    }
}

class Ediotr extends React.Component<any> {
    nodebase() {
        return <div
            className="basic-node"
            style={{
                background: this.props.color?this.props.color:"red"
            }}>

            <div className="status"></div>

            <div className="icon ">
                <i className="icon_data-manage"></i>
            </div>

            <div className="text">
                <div className="name">节点标题</div>
            </div>

            <div className="ports">
                <div className="in"></div>
                <div className="out"></div>
            </div>
        </div>
    }

    node() {
        return <div
            data-nodeid={this.props.name}
            id={"node"+this.props.name}
            className={classNames({ "node": true, "selected": true, "joinable": true })}
            style={{
                
                top: this.props.Y?this.props.Y:0,
                left: this.props.X?this.props.X:0
            }}>

            {this.nodebase()}

        </div>;

    }

    render() {
        return this.node();
    }

}

export default DragDropContext(HTML5Backend)(ContainerDetail);