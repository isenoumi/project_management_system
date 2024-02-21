<template>
  <el-dialog
    title="详情"
    width="50%"
    :destroy-on-close="true"
    class="diaLog"
    :append-to-body="true"
  >
    <div class="infoBox">
      <div class="title">项目名称：{{ props.form.projectName }}</div>
      <div class="title">项目类型：{{ props.form.projectType }}</div>
      <div class="title">项目资金来源：{{ props.form.projectSourceFunds }}</div>
      <div class="title" style="width: 300px">
        所属区域：{{ props.form.area }}
      </div>
      <div class="title">客户名称：{{ props.form.customerName }}</div>
      <div class="title">客户联系人：{{ props.form.customerContacts }}</div>
      <div class="title">
        预合同金额（万）：{{ props.form.prepareContractAmount }}
      </div>
      <div class="title">销售人员：{{ props.form.salesperson }}</div>
      <div class="title">项目优先级：{{ props.form.projectFirstLevel }}</div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('closeLog')">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { myDict } from "@/utils/myDict";
import { onUpdated } from "vue";
const emits = defineEmits(["closeLog"]);
const props = defineProps(["form"]);
onUpdated(() => {
  myDict(props.form);
});
</script>

<style lang="scss">
@import "../css/changlog.scss";
</style>
