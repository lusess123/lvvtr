// 节点运行状态

export const TaskStatus = {
    SETTING: "SETTING",//配置中
    WAITING: "WAITING",//等待运行
    RUNNING: "RUNNING",//运行中
    ERROR: "ERROR",//遇到错误，终止运行
    DONE: "DONE"//运行完成
};