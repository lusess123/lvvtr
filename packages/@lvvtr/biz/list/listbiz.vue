<template>
    <Card >

<p slot="title">
    <i class="fa fa-table"></i>
   {{vm.Title + "  列表"}}
</p>
 <search  :VUniId="VUniId" />
 <btnzone :VUniId="VUniId" />
 <listtable/>

</Card>
</template>

<script>
import moduledom from "@lvvtr/vue/vuemixin/modulecom.vue";
import module from "./listmodule";
import search from "./search.vue";
import listtable from "./listtable.vue";
import btnzone from "./btnzone.vue";

export default {
  mixins: [moduledom],
  components: { search, listtable, btnzone },

  props: ["fetchModule"],

  computed: {
    vm() {
      return this.vStore();
    }
  },
  watch: {
    fetchModule: function(newobj, oldobj) {
     // alert("重新修改");
      this.fetchVUniId();
    }
  },
  methods: {
    getModule() {
      // const _parms = this.$route.params ? this.$route.params : {};

      if (this.fetchModule) {
        return this.fetchModule();
      } else {
        return {};
      }
    }
  }
};
</script>

<style>
</style>
