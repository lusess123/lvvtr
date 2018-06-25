<style>
.ivu-card{
    position: static;
}
</style>
<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  z-index: 99999；
}

.header {
  padding: 0;
  background: transparent;
}
.layout-logo {
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-nav {
  margin: 0 auto;
  margin-right: 20px;
}
.layout-footer-center {
  text-align: center;
}
</style>
<template>
    <div class="layout">
        <Layout>
            <Header :style="{position: 'fixed', width: '100%'}"  class="header">
                <Menu mode="horizontal" theme="primary" active-name="1">
                  
                    <div class="layout-nav">
                        <Submenu  style=”{zIndex:99999}“ transfer :name="app.Name"  :key="app.Name" v-for="(app) in getApps()">
                           <template slot="title">
                             <i :class="'fa  fa-' + app.Icon"> {{app.Title}}</i>
                            </template>
                            <MenuGroup  transfer title="使用">
                <MenuItem name="3-1">新增和启动</MenuItem>
                <MenuItem name="3-2">活跃分析</MenuItem>
                <MenuItem name="3-3">时段分析</MenuItem>
            </MenuGroup>
            <MenuGroup title="留存">
                <MenuItem name="3-4">用户留存</MenuItem>
                <MenuItem name="3-5">流失用户</MenuItem>
            </MenuGroup>
                        </Submenu>
                    </div>
                </Menu>
            </Header>
            <Content :style="{margin: '88px 20px 0', background: '#fff', minHeight: '500px'}">
                <router-view></router-view>
            </Content>
            <Footer class="layout-footer-center">2011-2016 &copy; TalkingData</Footer>
        </Layout>
    </div>
</template>
<script lang="ts">
import getapps from "@lvvtr/sys/web/appget";
import { IApp } from "@lvvtr/sys/web/iapp";
export default {
  methods: {
    getApps() {
      const _res = getapps();
      console.log(_res);
      return _res;
    }
  }
};
</script>
