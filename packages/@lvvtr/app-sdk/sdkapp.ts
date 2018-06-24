
import {BaseApp} from "@lvvtr/sys/web/baseapp";
import {IMenu} from "@lvvtr/sys/web/imenu";

import iView from 'iview';
import Vue from 'vue';
import 'iview/dist/styles/iview.css';
Vue.use(iView);

import * as ioc from "@lvvtr/sys/ioc"

import devlist from "./view/list/devlist.vue"
import applist from "./view/list/applist.vue"
import apilist from "./view/list/apilist.vue"
import apigrouplist from "./view/list/apigrouplist.vue"
import policytpllist from "./view/list/policytpllist.vue"
import policylist from "./view/list/policylist.vue"
import policydown from "./view/list/policydown.vue"
import loglist  from "./view/list/loglist.vue"

import policeman  from "./view/list/policeman.vue"
import org  from "./view/list/org.vue"
@ioc.PlugIn({RegName: "CentrolApp", BaseType: "IApp", Doc: "集中管控"})
export class CentrolApp extends BaseApp {
    protected MenuList = _menus;
    public Name : string = "CentrolApp";
    //<Icon type="social-github"></Icon>
    public Title : string = "集中管控";
    public Doc : string = "集中管控";
    public Icon : string = "ios-cloud-download";
    public TagName = "管控平台";

    public MainRoute = [
       
        {
            path :"/devlist",
            component:devlist
        },
        {
            path:"/applist",
            component:applist
        },
        {
            path:"/apilist",
            component:apilist
        },
        {
            path:"/apigrouplist",
            component:apigrouplist
        },
        {
            path:"/policytpllist",
            component:policytpllist
        },
        {
            path:"/policylist",
            component:policylist,
            title:"策略列表"
        },
        {
            path:"/policydown",
            component:policydown,
            title:"策略下发"
        },
        {
            path:"/log",
            component:loglist,
            title:"管控日志"
        },
        {
            path:"/policaman",
            component:policeman,
            title:"警察"
        },
        {
            path:"/org",
            component:org,
            title:"组织机构"
        }

    ];

}

const _menus : IMenu[] = [
    {
        icon: "firefox",
        name: "aa111",
        text: "策略下发",
        children: [
            {
                icon: "",
                name: "/web/warplist/centroldev",
                text: "终端列表"
            }, {
                icon: "",
                name: "/web/warplist/centrolapp",
                text: "应用列表"
            }, {
                icon: "",
                name: "/web/warplist/centrolface",
                text: "接口列表"
            }
        ]
    }, {
        icon: "chrome",
        name: "aa1112",
        text: "策略管理",
        children: [
            // { icon: "", name: "/web/warplist/centrolpolicytype", text: "策略类型" },
            {
                icon: "",
                name: "/web/warplist/centrolpolicytpl",
                text: "策略模版"
            }, {
                icon: "",
                name: "/web/warplist/centrolpolicy",
                text: "策略"
            }, {
                icon: "",
                name: "/web/warplist/centrolpolicydown",
                text: "下发记录"
            }
           
        ]
    }, {
        icon: "chrome",
        name: "aa11123",
        text: "基础数据",
        children: [
            {
                icon: "",
                name: "/web/warplist/org",
                text: "组织机构"
            }, {
                icon: "",
                name: "/web/warplist/policemen",
                text: "警员列表"
            }, {
                icon: "",
                name: "/web/warplist/apigroup",
                text: "服务"
            }

        ]
    }

]
