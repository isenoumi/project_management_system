<template>
  <div class="header">
    <div class="header-left">
      <div class="inputs">
        <div class="title">上传人:</div>
        <el-input
          v-model="headerdata.createByUsername"
          placeholder="请输入上传人"
        />
      </div>
      <div class="inputs">
        <div class="title">所需项目编号:</div>
        <el-input v-model="headerdata.code" placeholder="请输入所需项目编号" />
      </div>
      <div class="inputs">
        <div class="title">所需项目名称:</div>
        <el-input v-model="headerdata.name" placeholder="请输入所需项目名称" />
      </div>
    </div>
    <div class="inputs" style="display: flex; align-items: center">
      <div class="title" style="margin-right: 10px">审批时间:</div>
      <el-date-picker
        v-model="headerdata.examineTime"
        type="daterange"
        value-format="YYYY-MM-DD"
        format="YYYY-MM-DD"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
      />
    </div>
    <div
      class="inputs"
      style="display: flex; align-items: center; margin-top: 20px"
    >
      <div class="title">审批类型:</div>
      <el-select
        style="width: 210px"
        v-model="headerdata.excamineType"
        class="m-2"
        placeholder="请选择审批类型"
      >
        <el-option
          v-for="item in headerdata.carefulList"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div style="margin: 20px 10px 0 20px">
      <el-button type="primary" style="margin-right: 8px" @click="searchList"
        >搜索</el-button
      >
      <el-button type="info" @click="reset">重置</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import Bus from "../js/Bus";
//传递过来的数据
const props = defineProps({
  headerdata: {
    type: Object,
    default: {},
  },
});
//搜索
const searchList = () => {
  Bus.emit("serchList", props.headerdata);
};
//重置
const reset = () => {
  Bus.emit("reseting", "1");
};
onMounted(() => {});
</script>
<style scoped lang="scss">
@import "../css/index.scss";
</style>
