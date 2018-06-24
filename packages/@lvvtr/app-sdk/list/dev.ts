import module, {sc, setBtn,setBtnG} from "./module"

export default() => {

    const _searchColumns = [
        sc("mobile", "手机号", "Text"),
        sc("policename", "警员姓名", "Text"),
        sc("imei", "IMEI号", "Text")

    ];

    const _listcolumns = [
        sc("id", "编号", "Hidden"),
        sc("mobile", "手机号", "Text"),
        sc("policename", "应用类型", "Text"),
        sc("imei", "IMEI号", "Text"),
        sc("orgName", "所属组织", "Text"),
        sc("mobilesate", "手机状态", "Text"),
        sc("isonline", "是否在线", "Text"),
        sc("isroot", "是否root", "Text"),
        sc("isout", "是否外出", "Text"),
        sc("lastconnecttime", "最后连接", "DateTime")
    ]

    const _btngroup = {
        ...setBtnG("操作","cogs"),
        ...setBtnG("限制/禁用功能","plug"),
        ...setBtnG("网络相关操作","wifi")
    }

    const _btns = {
        ...setBtn("详情"),
        ...setBtn("定位服务", "操作"),
        ...setBtn("分发文档", "操作"),
        ...setBtn("分发应用", "操作"),

        ...setBtn("禁止安装", "限制/禁用功能"),
        ...setBtn("禁用相机", "限制/禁用功能"),
        ...setBtn("限制通话", "限制/禁用功能"),
        ...setBtn("禁用麦克风", "限制/禁用功能"),
        ...setBtn("锁机", "限制/禁用功能"),
        ...setBtn("禁用usb调试", "限制/禁用功能"),

        ...setBtn("禁用蓝牙", "网络相关操作", "bluetooth"),
        ...setBtn("禁用gps", "网络相关操作", "location-arrow"),
        ...setBtn("禁用飞行模式", "网络相关操作"),
        ...setBtn("禁用个人热点", "网络相关操作"),

        ...setBtn("限制网络访问", "网络相关操作"),
        ...setBtn("强制开启移动数据", "网络相关操作"),
        ...setBtn("禁用移动数据", "网络相关操作"),
        ...setBtn("禁用WIFI", "网络相关操作", "wifi")
    }

    return module("终端", "dev")(_searchColumns, _listcolumns)(_btngroup, _btns)
}