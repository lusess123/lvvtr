import React, {Component} from 'react';
import PComponent from './../../components/common/pcomponent'
import PForm from './../../components/form'

export default class UpdateBiz extends PComponent {

    constructor(props){
         super(props);
         this.state = {
            FormColumns :this._getColumns(this.props)
         } ;
    }

    _getColumns({ListColumns}) {
        return ListColumns.filter((col)=>{
            if(col.Option && col.Option.ShowPage){
                if(col.Option.ShowPage.indexOf(this.props.BizStyle)>=0)
                  return true ;
                  else 
                  return false ;
        }
        return true ;
        })
           
            .map(col => {
                const _coltype = col.Option.ColType;
                return {
                    label: col.title,
                    col: _coltype == "daterange"
                        ? 16
                        : 16,
                    name: col.key,
                    coltype: _coltype,
                    regname: col.Option
                        ? col.Option.RegName
                        : ""
                };
            })
    }


    pRender(){
        return <PForm Data={this.props.Data}
        HasSubmit
        FormItems={this.state.FormColumns}
        onSubmitClick={this.props.onSubmitClick}
        DataSet={this.props.DataSet}
        SubmitText={this.props.BizStyle == "Insert"?"提交":"保存"} />
    }
}

