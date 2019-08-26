
import {pageview,column,btnGroup,dict,btn,controlType} from "../../biz/list/data";
import {getTableData, getBtnGroup,getNoGroupBtns,getBtnsByGroupName} from "../../biz/list/bf";
export default (Title:string,FormName:string)=>
               (searchColumns:column[],listColumns:column[])=>
               (btnGroups:dict<btnGroup>,btns:dict<btn>)=>
{ 
    const _fromName = FormName;
    const _fromName_search = _fromName + "_search"; 
   return {
    state() {

        const _res : pageview = {
            Title: Title,
            Data: {
                [_fromName_search]: [],
                [_fromName]: []
            },
            SearchForm: {
                Name: _fromName_search,
                Columns: searchColumns
                
            },
            ListForm: {
                Name: _fromName,
                Columns: listColumns,
                BtnGroups: btnGroups,
                Btns: btns
                    
            }
        };

        return _res;
    },
    mutations : {},
    actions : {
        btnClick:(context,obj)=>{
           // console.log(btn);
           //alert(obj.btn.DisplayName);
           switch(obj.btn.Name){
               case "新增终端策略":
               obj.$router.push({ path: '/devpolicy' })
               break;
                case "新增接口策略":
                obj.$router.push({ path: '/apipolicy' })
                break;
                case "新增应用策略":
                obj.$router.push({ path: '/apppolicy' })
                break;
               default:
               break;
           }
        }
    },
    getters : {
        getSearchColList(s) {
            return s.SearchForm.Columns;
        },
        Columns(s) {
            return getTableData(s);
        },
        Datasource: (s) => {
            return s.Data.dev;
        },
        getBtnGroup,
        getNoGroupBtns,
        getBtnsByGroupName

    }

    }
}

export const setBtnG = (name : string, icon?: string) => {
    let _a = {};
     _a[name] = {
        Name: name,
        DisplayName: name,
        Icon: icon       
    };

    return _a ;
}
export const setBtn = (name : string, group?:string,icon?: string) => {
    let _a = {};
     _a[name] = {
        Name: name,
        DisplayName: name,
        Icon: icon,
        Kind: "batch",
        GroupName:group
    };

    return _a ;
}


export const sc = (name:string , displayname :string ,controltype :controlType = "Text") => {
     
    return  {
        Name: name,
        DisplayName: displayname,
        ControlType: controltype
    }
}