import Vue from 'vue';
import App from './app.vue';

const _start = {
    el: '#app',

    render: h => h(App),
   
    mounted() {
    }
};
new Vue(_start);