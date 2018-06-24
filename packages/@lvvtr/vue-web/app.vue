<template>
    <div id="main" class="app-main">
        <h1>开始页面</h1>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
       
        mounted () {

        },
        beforeDestroy () {

        },
        methods: {
    
        }
    };
</script>

<style>
html,body{
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    overflow: hidden;
}
.app-main{
    width: 100%;
    height: 100%;
}
.acs-mesg
{
    box-shadow:1px 2px 3px 1px #eee;
    position: "absolute";
    opacity:0.5;
    background:black;
}
</style>
