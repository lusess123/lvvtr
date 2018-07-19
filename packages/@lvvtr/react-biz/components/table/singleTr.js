
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import ReactDOM from 'react-dom';
import styles from './table.scss';
import TableSort from './tableSort';
class SingleTr extends Component {
    constructor(props) {
        super(props);
        [
          'renderContent',
          'judgeWidthStyle',
        ].forEach(fn => this[fn] = this[fn].bind(this));
    }
    renderContent(item, index){
        let _itemContent = item.content;
        if(!_itemContent && _itemContent != 0){
            _itemContent = '';
        }
        
        //let hasSort =  this.props.hasSort;
        let isHead = this.props.isHead;
        let hasSort = item.hasSort;
        return (
           <div>
               { typeof(_itemContent) == 'string' || 'number' && typeof(_itemContent) != 'object' ? ( !isHead ? <div className={styles.textWrap}>{_itemContent}</div> : <div className={styles.headTextWrap}>{_itemContent}</div> ) : React.cloneElement(item.content)}
               { hasSort && isHead ? <div className={styles.sortWrap}><TableSort {...this.props} colIndex={index}/></div> : null}
           </div>
        )
    }
    tdClick(tdClick, row, col, event){
        if(tdClick){
            tdClick(row, col, event);
        }
    }
    rowClick(rowClick, rowIndex, event){
        let {isHead} = this.props;
        let type = isHead ? 'headClick' : 'bodyClick';
        if(rowClick){
           rowClick(type, rowIndex, event);
        }
    }
    judgeWidthStyle(headData, tableData) {
        if(!headData){
            headData = [];
        }
        for(let i = 0; i < headData.length; i ++){
            if(headData[i].style && headData[i].style.width){
                return true;
            }
        }
        return false;
    }
    render() {
        let {rowData, rowClick, tdClick, rowIndex, isHead, headTdClick, headData, row, styleData} = this.props;
        let hasSetHeadWidth = this.judgeWidthStyle(headData);
        //headData
        let style = {};
        if(row && row.style){
           style = row.style;
        }
        let _tdClick = isHead ? headTdClick : tdClick;

        if(!rowData){
            rowData = [];
        }
        let width = rowData.length ? 100 / rowData.length + "%" : "100%";
        return (
            <tr style={style}  onClick={this.rowClick.bind(this, rowClick, rowIndex)}>
                {
                    rowData.map((item, index)=>{
                        let style = {};
                        let _tdStyle = item.style || {};
                        if(rowIndex == 0 ){
                            if(isHead){
                                if(item.style){
                                    style = Object.assign({}, {width: width}, item.style);
                                }else {
                                    style = {width: width};
                                }
                            }else {
                                if(styleData && styleData[index] && styleData[index].style){
                                style = Object.assign({}, {width: width}, styleData[index].style, _tdStyle);
                                }else {
                                    style = Object.assign({}, {width: width}, _tdStyle);
                                }
                            }
                        }else {
                            if(styleData && styleData[index] && styleData[index].style){
                                style = Object.assign({}, {width: width}, styleData[index].style, _tdStyle);
                            }else {
                                style = Object.assign({}, {width: width}, _tdStyle);
                            }
                        }
                        if(isHead){style = Object.assign({}, style, {position: 'relative'}); }
                        return (
                            <td key={index} style={style} onClick={this.tdClick.bind(this, item.tdClick || _tdClick, rowIndex, index) }  className={styles.tdStyle}>
                                {
                                    this.renderContent(item, index)
                                }
                            </td>
                        )
                    })
                }
            </tr>
        )
    }
}
module.exports = SingleTr;
