import React, {Component} from 'react';
import PComponent from './../../components/common/pcomponent'
import RcTable from './../../components/list/rctable'
import styles from './style.scss'
import Table from './../table'
import {callApi} from './../../middlewares/api'
import get from 'lodash/get';

export default class biz extends PComponent {


    static defaultProps = {
            Forms:{},
            DataSet:{},
            MainForm:"MAIN"
    }

    constructor(props) {
        super(props);
        this.state = {
           ListProps :{

           }
        }
    }
    

    pRender() {
       return <RcTable  {...this.state.ListProps}   />
    }

    pComponentWillReceiveProps(nextProps, nextContext) {
       
    }

    pComponentDidMount(){
         
    }
}



// export interface ColumnProps<T> {
//     title?: React.ReactNode;
//     key?: string;
//     dataIndex?: string;
//     render?: (text: any, record: T, index: number) => React.ReactNode;
//     filters?: { text: string; value: string }[];
//     onFilter?: (value: any, record: T) => boolean;
//     filterMultiple?: boolean;
//     filterDropdown?: React.ReactNode;
//     sorter?: boolean | ((a: any, b: any) => number);
//     colSpan?: number;
//     width?: string | number;
//     className?: string;
//     fixed?: boolean | ('left' | 'right');
//     filteredValue?: any[];
//     sortOrder?: boolean | ('ascend' | 'descend');
//   }


