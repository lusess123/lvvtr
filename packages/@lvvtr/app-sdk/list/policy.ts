import module, {sc, setBtn,setBtnG} from "./module"

export default() => {

    const _searchColumns = [
        sc("name", "名称", "Text"),
        sc("cname", "中文名", "Text"),
    ];

    const _listcolumns = [
        sc("id", "编号", "Hidden"),
        sc("name", "名称", "Text"),
        sc("cname", "中文名", "Text"),

        sc("createid", "创建者", "Text"),
        sc("createtime", "创建时间", "DateTime")
    ]

    const _btngroup = {}

    const _btns = {
        ...setBtn("策略详情"),
        ...setBtn("编辑"),
        ...setBtn("新增"),
        ...setBtn("删除"),

        ...setBtn("新增终端策略"),
        ...setBtn("新增接口策略"),
        ...setBtn("新增应用策略")
       
    }

    return module("策略", "policy")(_searchColumns, _listcolumns)(_btngroup, _btns)
}