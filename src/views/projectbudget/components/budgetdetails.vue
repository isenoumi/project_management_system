<template>
  <el-dialog title="详情" width="70%" align-center>
    <div class="title1">项目信息</div>
    <div class="title3" style="margin: 20px 0">
      <div>项目类型：{{ detail.projectType }}</div>
      <div>所属区域：{{ detail.area }}</div>
      <div>客户名称：{{ detail.customerName }}</div>
      <div>客户联系人：{{ detail.customerContacts }}</div>
      <div>销售人员：{{ detail.salesperson }}</div>
      <div>项目资金来源：{{ detail.projectSourceFunds }}</div>
      <div>预合同金额(万)：{{ detail.prepareContractAmount }}</div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { onUpdated } from "vue";
import { myDict } from "@/utils/myDict";
//传递过来项目数据详情
const props = defineProps({
  detail: {
    type: Object,
    default: {},
  },
});
onUpdated(() => {
  console.log(myDict(props.detail), "asdas");
});
</script>
<style lang="scss" scoped>
@import "../css/index.scss";
</style>
