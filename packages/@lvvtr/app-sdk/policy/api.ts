import { IRoot } from "./../comp/jsonitem";
const _api :IRoot = {
    title :"接口",
    type:"object",
    properties:{
       flowlimit :{
           title :"流量限制",
           type:"object",
           properties:{
               unittime:{
                   title :"单位时间",
                   type:"string",
                   enum:["分钟","小时","天"]
               },
               apicall :{
                   title:"api流量限制",
                   type:"integer"

               },
               usercall :{
                title:"用户流量限制",
                type:"integer"

            },
            appcall :{
                title:"应用流量限制",
                type:"integer"

            }
           } 
       },
       accesscontrol:{
            title:"访问控制",
            type:"array",
            items:{
                title:"访问限制",
                type:"object" ,
                properties:{
                    rule :{
                        title:"限制规则",
                        type :"string",
                         enum:["黑名单","白名单"]
                    },
                    app :{
                        title:"应用",
                        type :"string"
                    },
                    dev :{
                        title:"终端",
                        type :"string"
                    }
                }
            }
       }
    }
}

export default _api