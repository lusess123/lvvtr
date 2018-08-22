export const LinkErrorType = {
    SelfNode: -1
    , PortType: -2
    , LinkExist: -3
    , PortCount: -4
    , FromInPort: -5
    , Gentle: -99
};

export const LinkErrorMsg = {
    [LinkErrorType.SelfNode]: "连接失败，节点不能自相连"
    , [LinkErrorType.PortType]: "连接失败，同类型端口不能相连"
    , [LinkErrorType.LinkExist]: "连接失败，连接已存在"
    , [LinkErrorType.PortCount]: "连接失败，超出端口最大连接数"
    , [LinkErrorType.FromInPort]: "连接失败，请从输出端口开始建立连接"
    , [LinkErrorType.Gentle]: "连接失败"
};