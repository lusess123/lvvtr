import module, {sc, setBtn,setBtnG} from "./module"

export default() => {

    const _searchColumns = [
        sc("name", "名称", "Text"),
        sc("cname", "中文名", "Text"),
    ];

    const _listcolumns = [
        sc("id", "编号", "Hidden"),
        sc("name", "名称", "Text"),
        sc("cname", "身份证号", "Text"),

        sc("createid1", "警号", "Text"),
        sc("createtime2", "警种", "DateTime"),
        sc("createid3", "机构名称", "Text"),
        sc("createtime4", "岗位名称", "DateTime"),
        sc("createid5", "任职名称", "Text"),
        sc("createtime6", "职级名称", "DateTime"),
        sc("createid7", "电话号码", "Text")

    ]

    const _btngroup = {}

    const _btns = {
        ...setBtn("详情"),
       
       
    }

    return module("警察", "policemen")(_searchColumns, _listcolumns)(_btngroup, _btns)
}