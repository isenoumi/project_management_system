<template>
  <el-card>
    <headerTabs></headerTabs>
    <headinput :headerdata="headerdata"></headinput>
    <hostabla :carefulList="headerdata.carefulList" :headerdata="headerdata"></hostabla>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import Bus from './js/Bus'
import headinput from "./components/headinput.vue";
import hostabla from "./components/hosttable.vue";
import headerTabs from "./components/tabs.vue";
//头部输入框参数
const headerdata = ref<any>({
  projectName: "",
  projectId: "",
  area: "",
  salesperson: "",
  replyFileUsername: "",
  projectStatus: "",
  supportLatestTime: "",
});
//重置
Bus.on("reseting", (row: any) => {
  if (row) {
    headerdata.value = {
      projectName: "",
      projectId: "",
      area: "",
      salesperson: "",
      replyFileUsername: "",
      projectStatus: "",
      supportLatestTime: "",
    }
  }
});
onMounted(() => {

})
</script>
