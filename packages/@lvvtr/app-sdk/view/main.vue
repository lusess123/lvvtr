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
.ivu-select-dropdown{
    max-width: 600rem;
}
</style>
<template>
    <div class="layout">
        <Layout>
            <Header :style="{position: 'fixed', width: '100%'}"  class="header">
                <Menu mode="horizontal" theme="primary" active-name="1">
                  
                    <div class="layout-nav">
                        
                         <Dropdown transfer class="ivu-menu-submenu" :key="app.Name" v-for="(app) in getApps()">
        <span href="javascript:void(0)">
            <i :class="'fa  fa-' + app.Icon"> {{app.Title}}</i>
        </span>
        <DropdownMenu slot="list" transfer :style="{maxHeight:'300rem'}">
           <temple :key="menu.name" v-for="menu in app.getMenus()">
               <DropdownItem  :disabled="menu.children && menu.children.length > 0"  v-if="menu.children && menu.children.length > 0">
                   <i :class="'fa  fa-' + menu.icon"> {{menu.text}}</i>
             </DropdownItem>
              <DropdownItem v-else :disabled="menu.children && menu.children.length > 0">
                  <a :href="'#'+menu.name">   <i :class="'fa  fa-' + menu.icon"> {{menu.text}}</i></a>
             </DropdownItem>
             
              <DropdownItem v-if="menu.children && menu.children.length > 0" :key="page.name" v-for="page in menu.children">
                   <a :href="'#'+page.name"> <i :class="'fa  fa-' + page.icon"> {{page.text}}</i></a>
             </DropdownItem>
            </temple>
           
        </DropdownMenu>
    </Dropdown>
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
     // _res[0].getMenus()[0].
      return _res;
    }
  }
};
</script>
