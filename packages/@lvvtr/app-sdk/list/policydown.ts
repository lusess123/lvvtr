import module, {sc, setBtn,setBtnG} from "./module"

export default() => {

    const _searchColumns = [
        sc("trolobject", "管控对象", "Text"),
        sc("policy", "策略", "Text"),
    ];

    const _listcolumns = [
        sc("id", "编号", "Hidden"),
        sc("trolobject", "管控对象", "Text"),
        sc("policy", "策略", "Text"),


        sc("id1", "策略模版", "Hidden"),
        sc("trolobject1", "下发时间", "Text"),
        sc("policy1", "执行返回时间", "Text"),


        sc("createid1", "执行返回结果", "Text"),
        sc("createtime1", "状态", "DateTime")
    ]

    const _btngroup = {}

    const _btns = {
        ...setBtn("详情")
       
       
    }

    return module("策略下发", "policydown")(_searchColumns, _listcolumns)(_btngroup, _btns)
}