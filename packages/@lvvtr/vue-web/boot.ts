//------------载入应用包,收集应用配置---------

//------------初始化壳子-----------
import Vue from 'vue';
import {router} from './router';
import App from './app.vue';
import Vuex from 'vuex';
import rxjs from 'rxjs';
import apps from '@lvvtr/sys/web/appget';
import storeconfig from './store'

Vue.use(Vuex);


const start = {
    el: '#app',
    router,
    StoreConfig:storeconfig,
    render: h => h(App),
    mounted() {}
};

//----------------后续再完成 生命周期的重载----------





const _callFuns = (calls, obj) => {
    return new Promise(_sconFun(calls, obj));
}

const _sconFun = (calls : any[], obj) => callback => {
    const _$ = rxjs.Observable.from;
    return _$(calls).mergeScan((acc, fun) => _$(fun(acc)), obj)
        .last()
        .subscribe(a => callback(a));
}

const _runs = apps().map(a => a.useContext);
const _afterRuns = apps().map(a => a.afterUseContext);

_callFuns(_runs, start).then((a : any) => {
    // debugger;
    const _vuexConfig = a.StoreConfig;
    a.StoreConfig = undefined;

    a.store = new Vuex.Store(_vuexConfig);
    _callFuns(_afterRuns, a).then((aa) => {
        new Vue(aa);
    });

});