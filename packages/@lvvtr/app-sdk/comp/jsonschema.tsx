import * as React from "react";

import Form from "react-jsonschema-form";


class FieldTpl extends React.Component<any,any> {
    constructor(props, context) {
        super(props, context)
        this.state = {
          IsNoExpand: !(this.props.idSchema.$id == "root" )
        };
        this._click = this._click.bind(this);
      }
    render(){
        const _p :any = {
          ...this.props,
          ...{IsNoExpand:this.state.IsNoExpand},
          ...{onclick:this._click}
        } ;
       console.log(_p);
        return ObjectFieldTemplate(_p);
    }

    _click(){
     // alert();
        this.setState({
          IsNoExpand : !this.state.IsNoExpand
        });
    }
}

function ObjectFieldTemplate({ TitleField, properties, title, description,IsNoExpand ,onclick }) {
    return (
      <div className=" ivu-card ivu-card-bordered" >
       <a onClick={()=>{onclick();}}><div className="ivu-card-head"> {title}</div></a>
       <div className="ivu-card-extra"><a    ><i style={{fontSize:"2rem"}} className={"ivu-icon ivu-icon-arrow-"+ (IsNoExpand?"left-b":"down-b")}></i></a></div>
        <div className={" ivu-card-body "+(IsNoExpand?"hide":"")}>
          {properties.map((prop,index) => (
            <div
              key={prop.content.key}>
              {prop.content}
            </div>
          ))}
        </div>
        {description}
      </div>
    );
  }
  


  export default  (props)=>{ 

      const _p = {...props,...{ObjectFieldTemplate:FieldTpl} }; 
      return <Form  {..._p}   /> 
    };