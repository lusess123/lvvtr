
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';

import styles from './table.scss';
import SingleTr from "./singleTr";

class Table extends Component {
    constructor(props) {
        super(props);
    }
    judgeWidthSetting(headData){
        for(let i = 0; i < headData.length; i++ ){
            if(headData[i].style && headData[i].style.width){
                if(typeof(headData[i].style.width) == 'number' || (typeof(headData[i].style.width) == 'string' && headData[i].style.width.indexOf('%') == -1))
                return true;
            }
        }
        return false;
    }
    render() {
        let tableData = this.props.tableData || [];
        let headData = this.props.headData || [];
        let fixedLayout = this.judgeWidthSetting(headData);
        let style = fixedLayout ? {tableLayout: 'fixed'} : null;
        let tableType = this.props.tableType || 1;
        return (
            <table className={styles.tableStyle} style={style}>
                  <thead className={styles.headStyle}>
                      <SingleTr rowData={headData} isHead={true} rowIndex={0} {...this.props} />
                  </thead>
                  <tbody>
                      {
                          tableData.map((item, index)=> {
                              if(tableType == 2){
                                 return React.cloneElement(item, {key: index});
                              }else {
                                 return (<SingleTr rowData={item.rowData} row={item} rowIndex={index} {...this.props} key={index}/>);
                              }
                          })
                      }
                  </tbody>
            </table>
        )
    }
}
module.exports = Table;
