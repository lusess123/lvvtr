import * as React from "react";
import {ComponentType} from "react"

import Form from "react-jsonschema-form";

export interface Props {
  name: string;
}

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

const aaaa = <A,B>(a:A,b:B)=>{
  return 123;
}

aaaa(1,2);


export const withDefaultProps = <
  P extends object,
  DP extends Partial<P> = Partial<P>
>(
  defaultProps: DP,
  Cmp: ComponentType<P>,
) => {
  // 提取出必须的属性
  type RequiredProps = Omit<P, keyof DP>;
  // 重新创建我们的属性定义，通过一个相交类型，将所有的原始属性标记成可选的，必选的属性标记成可选的
  type Props = Partial<DP> & Required<RequiredProps>;

  Cmp.defaultProps = defaultProps;

  // 返回重新的定义的属性类型组件，通过将原始组件的类型检查关闭，然后再设置正确的属性类型
  return (Cmp ) as ComponentType<Props>;
};

export class Greet extends React.Component<Props> {
  render() {
      const { name } = this.props;
      return <>
      <div>Hello ${name.toUpperCase()}!</div>
      </>;
  }
  static defaultProps = { name: "world"};
}

// Type-checks! No type assertions needed!
const Greet1 = withDefaultProps({name: "world"},Greet);
let el = <Greet1  />







class GenericComponent<P> extends React.Component<P> {
  internalProp: P;
}

type Props1 = { a: number; b: string; };

const x = <GenericComponent<Props1> a={10} b="hi"/>; // OK


class AA extends React.Component<P,P> {


  render (){
    return <div>{this.props.children}</div>;
  }

  fff(){
    this.setState({name:"222"});
    this.setState((prestate,p)=>{
       return  {
         name :p.name,
         Title:p.Title
       }
    });
  }
}

class FieldTpl extends React.Component < any,
any > {
  constructor(props, context) {
    super(props, context)
    this.state = {
      IsNoExpand: !(this.props.idSchema.$id == "root")
    };
    this._click = this
      ._click
      .bind(this);

      this.setState((prestate,p)=>{
        return prestate;
      });


  }
  render() {
    const _p : any = {
      ...this.props,
      ...{
        IsNoExpand: this.state.IsNoExpand
      },
      ...{
        onclick: this._click
      }
    };
    console.log(_p);
    return ObjectFieldTemplate(_p);
  }

  _click() {
    // alert();
    this.setState({
      IsNoExpand: !this.state.IsNoExpand
    });
  }
}

function ObjectFieldTemplate({
  TitleField,
  properties,
  title,
  description,
  IsNoExpand,
  onclick
}) {
  return (
    <div className=" ivu-card ivu-card-bordered">
      <a onClick={() => {
        onclick();
      }}>
        <div className="ivu-card-head">
          {title}</div>
      </a>
      <div className="ivu-card-extra">
        <a >
          <i
            style={{
            fontSize: "2rem"
          }}
            className={"ivu-icon ivu-icon-arrow-" + (IsNoExpand
            ? "left-b"
            : "down-b")}></i>
        </a>
      </div>
      <div className={" ivu-card-body " + (IsNoExpand
        ? "hide"
        : "")}>
        {properties.map((prop, index) => (
          <div key={prop.content.key}>
            {prop.content}
          </div>
        ))}
      </div>
      {description}
    </div>
  );
}

export default(props) => {

  const _p = {
    ...props,
    ...{
      ObjectFieldTemplate: FieldTpl
    }
  };
  return <Form {..._p}/>
};

const fff = ({name}) => {
  return <div>{name}</div>
}
type P = {
  name: string;
  Title: number;
}
const vv1 = (p:P)=>{
  return <div>{p.name}</div>
}
const vvv : React.SFC<P> = (p) => {
  return <div>{p.name}</div>
}


