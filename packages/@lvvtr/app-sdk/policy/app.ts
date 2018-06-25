import { IRoot } from "./../comp/jsonitem";
const _app :IRoot = {
    title :" 应用策略",
    type :"object",
    properties:{
           enable :{
               title :"启用",
               type :"string",
               enum:["上架","下架"]
           }
          
    }
}

export default _app ;