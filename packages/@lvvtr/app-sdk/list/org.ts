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
        sc("pname", "上级名称", "Text"),
        sc("cpname", "上级中文名", "Text"),

        sc("createid", "创建者", "Text"),
        sc("createtime", "创建时间", "DateTime")
    ]

    const _btngroup = {}

    const _btns = {
        ...setBtn("详情")
       
    }

    return module("组织机构", "org")(_searchColumns, _listcolumns)(_btngroup, _btns)
}