<template>
    <listbiz   :fetchModule="fetchModule"   />
</template>

<script>
import listbiz from "@lvvtr/biz/list/listbiz.vue"
import dev from './../../list/app'
export default {
          components :{listbiz},
          methods :{
              fetchModule(){
                   return dev();
              }
          }
}
</script>

<style>

</style>
