<template>
  <el-card>
    <headinput :headerdata="headerdata"></headinput>
    <hostabla :carefulList="headerdata.carefulList" :headerdata="headerdata"></hostabla>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import Bus from './js/Bus'
import headinput from "./components/headinput.vue"
import hostabla from "./components/hosttable.vue"
//头部输入框参数
const headerdata = ref<any>({
  createByUsername: '',
  code: '',
  name: '',
  carefulList: [
    {
      label: '待付款',
      value: 1
    },
    {
      label: '已付款',
      value: 4
    },
    {
      label: '部分付款',
      value: 6
    }
  ],
  examineTime: [],
  excamineType: ''
});
//重置
Bus.on("reseting", (row: any) => {
  if (row) {
    headerdata.value = {
      createByUsername: '',
      code: '',
      name: '',
      examineTime: [],
      excamineType: '',
      carefulList: [
    {
      label: '待付款',
      value: 1
    },
    {
      label: '已付款',
      value: 4
    }
  ],
    }
  }
});

onMounted(() => {

})
</script>
