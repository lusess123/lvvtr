import React, {Component} from 'react';
import PComponent from '../common/pcomponent'
import Table from '../table'
import get from 'lodash/get';
import Checkbox from './../../components/checkbox'
import Search from '../table/search';


export default class RcTable extends PComponent {

    static defaultProps = {
        // return {
        columns: [],
        dataSource: []
        //rowSelection:{onChange,getCheckboxProps} }
    }

    constructor(props) {
        super(props);
        this.state =  { HeadData : this.setHeadData(this.props)};
        //this.
        this.state = {
            HeadData: this.state.HeadData,
            TableData: this.setTableData(this.props)
        };
    }

    setHeadData({columns, rowSelection}) {
        let _res;

        const _heads = columns.map((col) => {
            return {
              //  ...col,
                ...{
                content: col.title,
                style:{...col.style, ...{
                    width: col.width
                }},
                key: col.key,
                render: col.render,
                tdStyle:col.tdStyle
            }}
        })

        if (rowSelection) {
            _res = [
                {
                    content: <label><Checkbox/>&nbsp;</label>,
                    style: {
                        width: 62
                    },
                    render: ({index}) => {
                        return <label><Checkbox/>&nbsp;{index + 1}</label>
                    }
                },
                ..._heads
            ];
        } else {

            _res = _heads;
        }
       // debugger;
        return _res;
    }

    setTableData({dataSource}) {
        return dataSource.map((row, index) => {
          //  debugger;
            return {
                rowData: this
                    .state
                    .HeadData
                    .map((hd) => {

                        const {render, dataIndex, key} = hd;
                       // debugger;

                       
                        let text;
                        if (typeof dataIndex === 'number') {
                            text = get(row, dataIndex);
                        } else if (!dataIndex || dataIndex.length === 0) {
                            text = row;
                        } else {
                            text = get(row, dataIndex);
                        }



                        return {
                            key: hd.key,
                            content: render
                                ? render({text: text, record: row, index: index,column:hd})
                                : row[hd.key],
                                style:hd.tdStyle
                        }
                    })
            }
        })
    }

    pRender() {

        const {HeadData, TableData} = this.state;
        return <div>
           
            <Table
                tableData={TableData}
                headData={HeadData}
                sortClick={this.sortClick}
                headTdClick={this.headTdClick}
                rowClick={this.rowClick}
                tdClick={this.tdClick}/>
              
        </div>

    }

    pComponentWillReceiveProps(nextProps, nextContext) {

        if (nextProps.columns != this.props.columns) {
            this.state =  { HeadData : this.setHeadData(nextProps)};
            this.setState({
               // HeadData : this.setHeadData(nextProps),
                TableData: this.setTableData(nextProps)
            })
        }
        else {

        if (nextProps.dataSource != this.props.dataSource) {
            this.setState({
                TableData: this.setTableData(nextProps)
            })
        }
    }

       


        
       
    }

}

// export interface ColumnProps<T> {     title?: React.ReactNode;     key?:
// string;     dataIndex?: string;     render?: (text: any, record: T, index:
// number) => React.ReactNode;     filters?: { text: string; value: string }[];
//    onFilter?: (value: any, record: T) => boolean;     filterMultiple?:
// boolean;     filterDropdown?: React.ReactNode;     sorter?: boolean | ((a:
// any, b: any) => number);     colSpan?: number;     width?: string | number;
//   className?: string;     fixed?: boolean | ('left' | 'right');
// filteredValue?: any[];     sortOrder?: boolean | ('ascend' | 'descend');   }
