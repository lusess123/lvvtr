<template>
    <div>
       <reactvm :Vm="schema"  ref="reactvm"  :ReactType="ReactType"  />
    </div>
</template>

<script lang="ts">
import reactvm from "@lvvtr/vue-react/reactvmmixin";
import Editor from "./../comp/editor"
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
