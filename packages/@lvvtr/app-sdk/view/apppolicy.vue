<template>
    <Card>
        <h1 slot="title">新增应用策略</h1>
      <Form ref="formValidate" :label-width="80">
        <FormItem label="策略名称" prop="name">
            <Input  placeholder="输入策略名称"></Input>
        </FormItem>
        <FormItem label="策略描述" prop="desc">
            <Input  type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入策略描述"></Input>
        </FormItem>
        </Form>
        <reactvm :Vm="schema"  ref="reactvm"  :ReactType="ReactType"  />
        </Card>
</template>

<script lang="ts">
import Form from "./../comp/jsonschema";
import reactvm from "@lvvtr/vue-react/reactvmmixin";
import _dev from './../policy/app';



const log = type => console.log.bind(console, type);

export default {
  components: { reactvm },
  data: function() {
    return {
      ReactType: Form,
      schema: {
        schema: _dev,
        onChange: log("changed"),
        onSubmit: log("changed"),
        onError: log("errors")
      }
    };
  }
};
</script>

<style>
</style>
