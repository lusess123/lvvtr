import { IRoot } from "../comp/jsonitem";
const schema: IRoot = {
    title: "终端策略",
    type: "object",
  
    properties: {
      sys: {
        title: "系统",
        type: "object",
        properties: {
          password: {
            title: "密码策略",
            type: "object",
            properties: {
              force_fingermark: {
                title: "强制设置指纹",
                type: "boolean"
              },
              force_password: {
                title: "强制设置密码",
                type: "boolean"
              },
              items: {
                title: "密码设置项目",
                type: "object",
                properties: {
                  level: {
                    title: "密码等级",
                    type: "string",
                    enum: [
                      "只能为数字",
                      "必须包含字母",
                      "必须包含数字和字母",
                      "混合"
                    ]
                  },
                  mixlenth: {
                    title: "最小密码长度（4-16字符）",
                    type: "integer",
                   maximum:16,
                   minimum:4
  
                  },
                  locktime: {
                    title: "设备锁定前的最长宽限时间",
                    type: "string",
                    enum: [
                      "15秒",
                      "1分钟",
                      "5分钟",
                      "30分钟"
                    ]
                  },
                  savetimes: {
                    title: "密码保存次数",
                    type: "integer",
                 //  maximum:16,
                   minimum:0
  
                  },
                  failtimes: {
                    title: "数据擦除前密码失败次数（4-16）",
                    type: "integer",
                   maximum:16,
                   minimum:4
  
                  },
                }
              }
            }
          },
          limit:{
              title :"限制策略",
              type:"object",
              properties:{
                  container:{
                      title :"容器级限制",
                      type:"object",
                      properties:{
                          office_app : {
                              title :"office关联应用",
                              type :"string",
                              default:"WPS Office"
                          },
                          office_package : {
                              title :"office关联应用包名",
                              type :"string",
                              default:"cn.wps.moffice_eng"
                          },
                          nocamera:{
                              title :"禁止使用相机",
                              type:"boolean"
                          },
                          nosend:{
                              title :"禁止发送彩信和短信",
                              type:"boolean"
                          },
                          noscreen:{
                              title :"禁止截屏",
                              type:"boolean"
                          },
                           noopenhot:{
                              title :"禁止打开热点",
                              type:"boolean"
                          },
                           noreset:{
                              title :"禁止用户手动进行恢复出厂设置",
                              type:"boolean"
                          },
                           noupdate:{
                              title :"禁止用户手动升级系统",
                              type:"boolean"
                          },
                           noclipboard:{
                              title :"禁止粘贴板",
                              type:"boolean"
                          },
                           noblue:{
                              title :"禁止蓝牙传输",
                              type:"boolean"
                          },
                           nored:{
                              title :"禁止红外",
                              type:"boolean"
                          },
                           nophone:{
                              title :"禁止拨打/接听电话",
                              type:"boolean"
                          },
                           nowifi:{
                              title :"禁止WIFI",
                              type:"boolean"
                          }
                      }
                  },
                  dev :{
                      title :"设备级限制",
                      type :"object",
                      properties:{
                          no_usb_storage:{
                              title :"禁止USB存储",
                              type:"boolean"
                          },
                          no_usb_debugger:{
                              title :"禁止USB调试",
                              type:"boolean"
                          },
                      }
                  }
              }
          }
        }
      },
      rail:{
          title:"围栏",
          type:"object",
          properties:{
              railmap :{
                  title:"地图",
                  type:"string"
              },
              starttime :{
                   title:"开始时间",
                  type:"string",
                  "format": "date-time"
              },
               endtime :{
                   title:"结束时间",
                  type:"string",
                  "format": "date-time"
              },
              timecycle :{
                   title:"时间周期",
                  type:"string",
              }
          }
      },
      app :{
          title :"应用",
           type :"object",
           properties:{
               limitrule :{
                     title:"限制规则",
                  type:"string",
                  enum:["无","黑名单","白名单"]
               },
               applist :{
                  title:"应用列表(在下面输入框中输入标签值，并且回车，如果添加多个标签可用逗号：','或者'，'分开)",
                  type:"string",
               }
           }
      }
    }
  };

  export default schema;