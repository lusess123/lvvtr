import module, {sc, setBtn,setBtnG} from "./module"

export default() => {

    const _searchColumns = [
        sc("name", "接口名称", "Text"),
        sc("group", "服务", "Text"),

    ];

    const _listcolumns = [
        sc("id", "编号", "Hidden"),
        sc("name", "接口名称", "Text"),
        sc("group", "服务", "Text"),

        sc("path", "接口路径", "Text"),
        sc("domain", "接口域名", "Text"),
        sc("desc", "接口描述", "Text"),

        sc("createid", "创建者", "Text"),
        sc("createtime", "创建时间", "DateTime")
    ]

    const _btngroup = {}

    const _btns = {
        ...setBtn("停止"),
        ...setBtn("启动"),
        ...setBtn("延时设置"),
        ...setBtn("限流设置"),
        ...setBtn("黑名单控制"),
        ...setBtn("白名单控制")
    }

    return module("接口", "api")(_searchColumns, _listcolumns)(_btngroup, _btns)
}