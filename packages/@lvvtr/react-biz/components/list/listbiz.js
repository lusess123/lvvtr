import React, {Component} from 'react';
import PComponent from './../../components/common/pcomponent'
import PForm from './../../components/form'

import RcTable from './../../components/list/rctable'
import Pagination from 'rc-pagination'
import './../common/styles/pagination.css'
import {Vif} from './../../components/common/util'
require("./../common/col");
import * as plug from './../common/colplug'
import UpdateBiz from './updatebiz'

import Dialog from 'rc-dialog'
import './rc-dialog.css'
import styles from './../../components/common/styles/style.scss'
import {callApi} from './../../middlewares/api'

const _createRenderFun = (dict, ColType, Option, render) => ({record, column, index, text}) => {
    const _value = record[column.key];
    const _row = dict && _value
        ? dict[_value]
        : "";
    let _content = _value;
    if (_row) {
        _content = _row.text;
    }

    if (ColType) {
        // ColType =
        const _colType = ColType
            .toLocaleUpperCase()
            .indexOf("DETAIL") >= 0
            ? ColType
            : "detail";

        const Coltype = plug.getCol({name: _colType});
        _content = <Coltype {...{Option,Items:dict,Value:_value,Text:_content}}/>;
    }
    if (render) {
        return render({record, column, index, _content});
    } else {
        return _content;
    }
}

export default class ListBiz extends PComponent {

    static defaultProps = {
        DataSet: {},
        ListColumns: [],
        SearchColumns: [],
        IsClientPagination: false,
        PageSize: 10,
        KeyFieldName: "id",
        BtnDict: {},
        GetUpdateDataUrl: "",
        SubmitUpdateDataUrl: "",
        SubmitInsertDataUrl: "",
        DeleteDataUrl: "",
        Title: " ",
        DefaultData: {}
    }

    constructor(props) {
        super(props);
        const _datasource = this._setDataSource(this.props);
        this.state = {
            columns: this._setColumns(this.props),
            dataSource: _datasource,
            LIST_PAGER: {
                total: _datasource.length,
                pageSize: this.props.PageSize,
                current: 1
            },
            SearchColumns: this._getSearchColumns(this.props),
            SearchData: {},
            EditDialogVisible: false,
            UpdateData: {},
            InsertData: this.getDefaultData(this.props),
            InsertDialogVisible: false
        }
        this.bindFns(
            "searchTrigger", "closeEditDialog",
            "_InsertSubmit", "_UpdateSubmit",
            "openInsert", "closeInsertDialog");
    }

    getDefaultData({DefaultData}) {
        return {
            ...DefaultData
        };
    }

    _getSearchColumns({ListColumns}) {
        return ListColumns
            .filter(a => {
            return a.Option && a.Option.Search
        })
            .map(col => {
                const _coltype = col.Option.Search
                    ? col.Option.Search.ColType
                    : col.Option.ColType;
                return {
                    label: col.title,
                    col: _coltype == "daterange"
                        ? 16
                        : 8,
                    name: col.key,
                    coltype: _coltype,
                    regname: col.Option
                        ? col.Option.RegName
                        : ""
                };
            })
    }

    _getRenderFun({DataSet, col}) {

        let dict = null;
        let ColType = null;
        const Option = col.Option;
        const render = col.render;
        if (Option) {
            ColType = Option.ColType;
            if (Option.RegName) {
                dict = DataSet[Option.RegName];
            }
        }

        return _createRenderFun(dict, ColType, Option, render);

    }

    openUpdate({id}) {
        this.setState({
            EditDialogVisible: true
        }, () => {

            callApi(this.props.GetUpdateDataUrl + "/" + id, {}, {}).then(a => {
                //alert(JSON.stringify(a));
                this.state.UpdateData = a.json;
                this.forceUpdate();
            })

        });
    }

    openInsert() {
        this.setState({
            InsertData: this.getDefaultData(this.props),
            InsertDialogVisible: true
        });
    }

    deleteData({id}) {
        // run operation successfully.
        callApi(this.props.DeleteDataUrl + "/" + id, {
            method: "DELETE"
        }, {}).then(a => {
            this.props.notify({message:this.props.Title + "删除成功"});
            if (this.props.loadData) {
                this
                    .props
                    .loadData();
            }
        })
    }

    _clickBtn({name, record}) {
        // alert(name); alert(JSON.stringify(this.props.BtnDict));
        switch (name) {
            case "Update":
                this.openUpdate({
                    id: record[this.props.KeyFieldName]
                });
                break;
            case "Delete":
                this.deleteData({
                    id: record[this.props.KeyFieldName]
                });
                break;
            default:
                if (this.props.BtnDict[name] && this.props.BtnDict[name].fun) {
                    this
                        .props
                        .BtnDict[name]
                        .fun({record, name, listbiz: this});
                }
                break;
        }
    }

    _setColumns({ListColumns, DataSet, BtnDict}) {
        const _columns = ListColumns.filter(col => {
            if (col.Option && col.Option.ShowPage) {
                if (col.Option.ShowPage.indexOf("List") >= 0)
                    return true;
                else
                    return false;
                }
            return true;
        }).map(col => {
            let _temp = {};
            let _col = {};
            if (col.Option) {
                // _col = {...col,...{Option:{...col.Option,...{ColType:"Detail"}}}};
                _temp = {

                    render: this._getRenderFun({DataSet, col})
                }

            }

            return {
                ...col,
                ..._temp
            };
        });

        if (BtnDict) {
            let _hasKey = false;

            let _btnColumn = {
                key: "btn",
                title: "操作",
                render: ((btnDict) => ({record}) => {

                    return <span className={styles.control}>{Object
                            .keys(btnDict)
                            .filter((key) => {
                                const _btn = btnDict[key];
                                if (_btn.show) {
                                    return _btn.show({record});
                                }
                                return true;
                            })
                            .map((key, index) => {
                                _hasKey = true;
                                const _btn = btnDict[key];
                                return [index != 0 ?"|":null,<a
                                    classsName={styles.hand}
                                    key={key}
                                    onClick={() => {
                                    this._clickBtn({name: key, record})
                                    }}>{_btn.Text}</a>];
                            })
}</span>;

                })(BtnDict)
            };

            _columns.push(_btnColumn);
        }

        return _columns;
    }

    _setDataSource({DataSet}) {
        return DataSet["LIST"];
    }

    pagination(pageNo, pageSize, array) {
        var offset = (pageNo - 1) * pageSize;
        return (offset + pageSize >= array.length)
            ? array.slice(offset, array.length)
            : array.slice(offset, offset + pageSize);
    }

    closeEditDialog() {
        this.setState(
            {
                EditDialogVisible: false,
                InsertData: this.getDefaultData(this.props)
            }
        );
    }

    closeInsertDialog() {
        this.setState(
            {
                InsertDialogVisible: false,

            });
    }

    _InsertSubmit() {
        //SubmitInsertDataUrl
        callApi(this.props.SubmitInsertDataUrl, {
            method: "POST"
        }, {
            body: JSON.stringify(this.state.InsertData)
        }).then(a => {
           // debugger;
            const _res = a.json;
            if (_res) {
                if (_res[this.props.KeyFieldName]) {

                    this.props.notify({message:this.props.Title + "新增成功"});
                    this.setState({
                        InsertDialogVisible: false,
                        InsertData: this.getDefaultData(this.props)
                    }, () => {
                        if (this.props.loadData) {
                            this
                                .props
                                .loadData();
                        }
                    });
                }
            }

        })
    }

    _UpdateSubmit() {
        // alert( JSON.stringify(  this.state.UpdateData));

        callApi(this.props.SubmitUpdateDataUrl + "/" + this.state.UpdateData[this.props.KeyFieldName], {
            method: "PUT"
        }, {
            body: JSON.stringify(this.state.UpdateData)
        }).then(a => {
            const _res = a.json;
            if (_res && _res.message) {
                if (_res.message == "update user success") {
                    this.setState({
                        EditDialogVisible: false,
                        UpdateData: {}
                    }, () => {
                        this.props.notify({message:this.props.Title + "更新成功"});
                        if (this.props.loadData) {
                            this
                                .props
                                .loadData();
                        }
                    });
                }
            }

        })

    }

    pRender() {
        // debugger;
        const {columns, dataSource, SearchColumns, SearchData} = this.state;

        const _propPager = this.props.DataSet["LIST_PAGER"]
            ? this.props.DataSet["LIST_PAGER"]
            : {
                total: dataSource.length,
                pageSize: 10,
                current: 1
            };

        const _pager = this.props.IsClientPagination
            ? this.state.LIST_PAGER
            : _propPager

        const {total, pageSize, current} = _pager;

        const _source = this.props.IsClientPagination
            ? this.pagination(current, pageSize, dataSource)
            : dataSource;

        // alert(JSON.stringify(_source));

        return <div>
            <Dialog
                className={localStorage.getItem("theme")
                ? localStorage.getItem("theme")
                : ""}
                visible={this.state.EditDialogVisible}
                title={`修改${this.props.Title}信息`}
                wrapClassName="vertical-center-modal"
                onClose={this.closeEditDialog}>
                <UpdateBiz
                    BizStyle="Update"
                    onSubmitClick={this._UpdateSubmit}
                    {...this.props}
                    Data={this.state.UpdateData}/>
            </Dialog>
            <Dialog
                className={localStorage.getItem("theme")
                ? localStorage.getItem("theme")
                : ""}
                visible={this.state.InsertDialogVisible}
                title={`新增${this.props.Title}信息`}
                wrapClassName="vertical-center-modal"
                onClose={this.closeInsertDialog}>
                <UpdateBiz
                    BizStyle="Insert"
                    onSubmitClick={this._InsertSubmit}
                    {...this.props}
                    Data={this.state.InsertData}/>
            </Dialog>
            <div className={styles["form"]}>
            <PForm
                onColChange={this.searchTrigger}
                Data={SearchData}
                FormItems={SearchColumns}
                DataSet={this.props.DataSet}
                />
            <div
                style={{
                marginBottom: 8,
                marginLeft:16
            }}
                className={styles["ak-col-24"]}>
                <button onClick={this.openInsert} className={styles.btn}>新增</button>
            </div>
            <RcTable rowSelection columns={columns} dataSource={this.getData()}/>
            <div
                style={{
                marginTop: 16,
                float: "right"
            }}>
                <Vif vif={pageSize < total}>
                    <Pagination
                        total={total}
                        onChange={(c) => {
                        this.pageChange(c)
                    }}
                        showTotal={this.showTotal}
                        showSizeChanger={true}
                        pageSize={pageSize}
                        current={current}/>
                </Vif>
            </div>
            </div>
        </div>;
    }

    getData() {
        if (!this.props.IsClientPagination) {
            return this.state.dataSource;
        } else
            return this
                .state
                .dataSource
                .filter((row) => {
                    let _a = true;
                    debugger;
                    Object
                        .keys(this.state.SearchData)
                        .find((key) => {
                            if (!_a)
                                return true;
                            const _val = row[key];
                            const _searchVal = this.state.SearchData[key];
                            //if(!this.state.SearchData[key]) return true ; if(!_searchVal) return true ;

                            const _col = this
                                .state
                                .SearchColumns
                                .find(col => col.name == key);
                            if (_col) {
                                if (_col.coltype) {
                                    // row[key]
                                    if (_col.coltype.toLocaleUpperCase() == "TEXT") {
                                        if (_searchVal && _val.indexOf(_searchVal) < 0) {
                                            _a = false;
                                            return true;
                                        }
                                    }
                                    if (_col.coltype.toLocaleUpperCase() == "CHECKBOX") {
                                        const _ss = _searchVal.split(",");
                                        if (_val && _searchVal != "" && _ss.indexOf(_val) < 0) {
                                            _a = false;
                                            return true;
                                        }
                                    }
                                }
                            }
                            return false;
                        })
                    return _a;
                });
        }

    searchTrigger() {
        // alert( JSON.stringify( this.state.SearchData));
        this.state.LIST_PAGER.current = 1;
        if (this.props.onSearchTrigger) {
            this
                .props
                .onSearchTrigger(this.state.SearchData);
        }

        this.forceUpdate();

    }

    pageChange(pageNo) {
        if (this.props.IsClientPagination) {
            this.setState({
                LIST_PAGER: {
                    total: this.state.dataSource.length,
                    pageSize: this.props.PageSize,
                    current: pageNo
                }
            });
        } else {
            if (this.props.pageChange) {
                this
                    .props
                    .pageChange(pageNo);
            }
        }
    }

    showTotal(total) {
        return `共 ${total} 条`;
    }

    pComponentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.DataSet["LIST"] != this.props.DataSet["LIST"]) {
            const _datasource = this._setDataSource(nextProps);
            this.setState({
                dataSource: _datasource,
                LIST_PAGER: {
                    total: _datasource.length,
                    pageSize: this.props.PageSize,
                    current: 1
                }
            });
        }
    }

    pComponentDidMount() {}
}

// export interface ColumnProps<T> {     title?: React.ReactNode;     key?:
// string;     dataIndex?: string;     render?: (text: any, record: T, index:
// number) => React.ReactNode;     filters?: { text: string; value: string }[];
//  onFilter?: (value: any, record: T) => boolean;     filterMultiple?: boolean;
//     filterDropdown?: React.ReactNode;     sorter?: boolean | ((a: any, b:
// any) => number);     colSpan?: number;     width?: string | number;
// className?: string;     fixed?: boolean | ('left' | 'right'); filteredValue?:
// any[];     sortOrder?: boolean | ('ascend' | 'descend');   }
