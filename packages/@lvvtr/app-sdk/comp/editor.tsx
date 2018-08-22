import Card from './Drag'
import React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Editor from 'floweditor/components/graphEditWrapper'
import {GraphEngine} from "floweditor/components/editor";
import   './style.scss'
import data from './data.json'
import { Scrollbars } from 'react-custom-scrollbars';


class Container extends React.Component<any,any> {
    // var engine = new GraphEngine();

    constructor(p,c){
        super(p,c);
        const engine = new GraphEngine();
        this.state = {
            engine
        };
    }
    render(){
      //  alert(JSON.stringify( styles));
      //alert(JSON.stringify(data));
        return   <div className="container">

        <h1>123</h1>
        <div style={{height:500,position:"relative",overflow:"scroll"}}>
           
        <Scrollbars autoHide={false} style={{height:1600}}>
        <div className={"graphContainer"}>
        <Editor  graphEngine={this.state.engine}  />
        </div>
        </Scrollbars>
        </div>
        </div>
    }

    componentDidMount(){
        this.state.engine.graphModel.deSerializeGraph(data);
        this.state.engine.repaintCanvas();
    }
}



export default DragDropContext(HTML5Backend)(Container);