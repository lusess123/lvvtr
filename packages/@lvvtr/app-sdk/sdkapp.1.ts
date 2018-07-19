
import {BaseApp} from "@lvvtr/sys/web/baseapp";
import {IMenu} from "@lvvtr/sys/web/imenu";

import iView from 'iview';
import Vue from 'vue';
import 'iview/dist/styles/iview.css';
Vue.use(iView);

import * as ioc from "@lvvtr/sys/ioc"

import policy from './view/devpolicy.vue'
import apppolicy from './view/apppolicy.vue'
import apipolicy from './view/apipolicy.vue'

import devlist from "./view/list/devlist.vue"
import applist from "./view/list/applist.vue"
import apilist from "./view/list/apilist.vue"
import apigrouplist from "./view/list/apigrouplist.vue"
import policytpllist from "./view/list/policytpllist.vue"
import policylist from "./view/list/policylist.vue"
import policydown from "./view/list/policydown.vue"
import loglist  from "./view/list/loglist.vue"
import "font-awesome/less/font-awesome.less";
//require( "./g.css");

import policeman  from "./view/list/policeman.vue"
import org  from "./view/list/org.vue"
import main from "./view/main.vue"
@ioc.PlugIn({RegName: "CentrolApp1", BaseType: "IApp", Doc: "集中管控1"})
export class CentrolApp1 extends BaseApp {
    protected MenuList = _menus;
    public Name : string = "CentrolApp";
    //<Icon type="social-github"></Icon>
    public Title : string = "集中管控1";
    public Doc : string = "集中管控";
    public Icon : string = "cloud-download";
    public TagName = "管控平台";
    public MainRoute = [
        {
            path: "/sdk",
            component: main,
            children :
            [
                {
                    path: "/devpolicy",
                    component: policy
                },
                {
                    path: "/apppolicy",
                    component: apppolicy
                },
                {
                    path: "/apipolicy",
                    component: apipolicy
                },
               
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
                    path:"/policeman",
                    component:policeman,
                    title:"警察"
                },
                {
                    path:"/org",
                    component:org,
                    title:"组织机构"
                }
        
            ]
        }
    ]

    

}

const _menus : IMenu[] = [
    {
        icon: "firefox",
        name: "aa111",
        text: "策略下发",
        children: [
            {
                icon: "",
                name: "/devlist",
                text: "终端列表"
            }, {
                icon: "",
                name: "/applist",
                text: "应用列表"
            }, {
                icon: "",
                name: "/apilist",
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
                name: "/policytpllist",
                text: "策略模版"
            }, {
                icon: "",
                name: "/policylist",
                text: "策略"
            }, {
                icon: "",
                name: "/policydown",
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
                name: "/org",
                text: "组织机构"
            }, {
                icon: "",
                name: "/policeman",
                text: "警员列表"
            }, {
                icon: "",
                name: "/apigrouplist",
                text: "服务"
            }

        ]
    }

]
