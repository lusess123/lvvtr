import { IMenu } from "./imenu"
import * as ioc from "../ioc"
import { IRouteConfig} from "./route"


export interface IApp 
{
    Name :string ;
    Title:string ;
    Doc:string ;
    Icon:string ;
    Order?:number;
    TagName?:string;

    getMenus():IMenu[];
    getPlugs():ioc.IClassList;

    RootRoute?:IRouteConfig[];
    MainRoute?: IRouteConfig[];
    useContext(pre:any):Promise<any> ;
    afterUseContext(pre:any):Promise<any> ;
}