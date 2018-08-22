<template>
    <div>
       <reactvm :Vm="schema"    :ReactType="ReactType"  />
    </div>
</template>

<script lang="ts">
import reactvm from "@lvvtr/vue-react/reactvmmixin";
import Editor from "./../comp/reduxdemo"
export default {
    components: { reactvm },
        data(){
            return {
                ReactType:Editor,
                schema:{}
            }
        }
}
</script>

<style>

</style>
