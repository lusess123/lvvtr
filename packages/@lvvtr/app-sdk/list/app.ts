import module, {sc, setBtn,setBtnG} from "./module"

export default() => {

    const _searchColumns = [
        sc("name", "应用名称", "Text"),
        sc("kind", "应用类型", "Text")

    ];

    const _listcolumns = [
        sc("id", "编号", "Hidden"),
        sc("name", "应用名称", "Text"),
        sc("kind", "应用类型", "Text"),

        sc("level", "应用等级", "Text"),
        sc("size", "大小", "Text"),
        sc("provide", "开发商", "Text"),
        sc("version", "版本号", "Text"),
        sc("state", "状态", "Text"),
        sc("createid", "创建者", "Text"),
        sc("createtime", "创建时间", "DateTime")
    ]

    const _btngroup = {}

    const _btns = {
        ...setBtn("安装"),
        ...setBtn("卸妆"),
        ...setBtn("更新"),
        ...setBtn("权限控制")
    }

    return module("应用", "app")(_searchColumns, _listcolumns)(_btngroup, _btns)
}