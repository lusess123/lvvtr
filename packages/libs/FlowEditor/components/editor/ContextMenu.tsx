import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './ContextMenu.scss';


const Actions = {
    Rename: "rename"
    , Delete: "delete"
    , Run: "run"
    , ExportToDir: "ExportToDir"
    , ExportToLocal: "ExportToLocal"
    , CreateModel: "createModel"
};
class ContextMenu extends React.Component<any> {
    constructor(props, context) {
        super(props, context);
    }

    getItemDisable() {
        var selecteItems = this.props.graphEngine.getGraphModel().getSelectedItems();
        var itemDisableMap;
        var clickModel = this.props.clickModel;
        var showCreateModel = true;
        // if (!selecteItems || selecteItems.length == 0) {
        //     itemDisableMap = {
        //         [Actions.Rename]: true
        //         , [Actions.Delete]: true
        //         , [Actions.Run]: true
        //         , [Actions.ExportToDir]: true
        //         , [Actions.ExportToLocal]: true
        //         , [Actions.CreateModel]: true
        //     }
        // } else {
        //     itemDisableMap = {
        //         [Actions.Rename]: selecteItems.length != 1 || (selecteItems[0] instanceof LinkModel)//
        //     }
        // }
        if (clickModel && clickModel.ports) {
            for (let key in clickModel.ports){
                if (!clickModel.ports[key].in && clickModel.ports[key].type == "model") {
                    showCreateModel = false;
                    break;
                }
            }
        }
        itemDisableMap = {
            [Actions.Delete]: false
            , [Actions.CreateModel]: showCreateModel
        }
        return itemDisableMap;
    }

    onClick = event => {
        if (!(event.target.dataset.disabled === "true")) {// not disabled
            this.props.handlerContextMenuAction(event);
        }
        event.stopPropagation();
    };

    onMouseUp = event => {
        event.stopPropagation();
    };

    onMouseDown = event => {
        event.stopPropagation();
    };

    render() {
        var {isShow, pos, graphEngine, folderList, showSubFolderMenu} = this.props;
        var itemDisableMap = this.getItemDisable();
        // if (isShow) {
        //     itemDisableMap = this.getItemDisable();
        // }
        return (
            <div className={styles.contextMenuWrapper}
                 onClick={this.onClick}
                 onMouseUp={this.onMouseUp}
                 onMouseDown={this.onMouseDown}

                 style={{
                     display: isShow && pos && pos.x && pos.y ? "block" : "none"
                     , top: pos.y + "px"
                     , left: pos.x + "px"
                 }}
            >
                <ul className={styles.contextMenu}>
                    {// <li className={
                    //     classNames({
                    //         "disabled": itemDisableMap[Actions.Rename]
                    //     })
                    // } data-role={Actions.Rename}>重命名
                    // </li>
                    }

                    <li className={
                        classNames({
                            "disabled": itemDisableMap[Actions.CreateModel]
                        })
                    } data-role={Actions.CreateModel} data-disabled={itemDisableMap[Actions.CreateModel]}>生成模型
                    </li>

                    <li className={
                        classNames({
                            "disabled": itemDisableMap[Actions.Delete]
                        })
                    } data-role={Actions.Delete} data-disabled={itemDisableMap[Actions.Delete]}>删除
                    </li>

                    {// <li className={
                    //     classNames({
                    //         "disabled": itemDisableMap[Actions.ExportToDir]
                    //     })
                    // } data-role={Actions.ExportToDir}><span data-role={Actions.ExportToDir}>结果导出到目录</span>
                    //     {<span className={styles.subFolderMenu} style={{display: showSubFolderMenu ? "block" : "none"}}>
                    //         {folderList && folderList.map((item)=>{
                    //             return <span></span>;
                    //         })}
                    //         <span className={styles.createNew} data-role="createNewFolder">新建文件夹</span>
                    //     </span>}
                    // </li>
                    //
                    // <li className={
                    //     classNames({
                    //         "disabled": itemDisableMap[Actions.ExportToLocal]
                    //     })
                    // } data-role={Actions.ExportToLocal}>结果导出到本地
                    // </li>
                    }
                </ul>
            </div>
        )
    }
}

export default ContextMenu;
