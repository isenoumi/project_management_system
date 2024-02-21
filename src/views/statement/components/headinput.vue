<template>
  <div class="headers">
    <div class="headerleft">
      <div class="inputs">
        <div class="title">项目名称:</div>
        <el-input
          v-model="headerdata.projectName"
          placeholder="请输入项目名称"
        />
      </div>
      <div class="inputs">
        <div class="title">项目编号:</div>
        <el-input v-model="headerdata.projectId" placeholder="请输入项目编号" />
      </div>
      <div class="inputs" style="display: flex; align-items: center">
        <div class="title">所属区域:</div>
        <el-cascader
          v-model="headerdata.area"
          :options="cityData"
          :props="cityProps"
          ref="cascaderAddr"
          placeholder="请选择省市区"
          clearable
        ></el-cascader>
      </div>
      <div class="inputs" style="display: flex; align-items: center">
        <div class="title">销售人员:</div>
        <!-- <el-input
          v-model="headerdata.salesperson"
          placeholder="请输入销售人员"
        /> -->
        <el-select
          filterable
          v-model="headerdata.salesperson"
          placeholder="请选择销售人员"
          clearable
        >
          <el-option
            v-for="item in options.salespersonOptions"
            :key="item.label"
            :label="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>
      </div>
      <div class="inputs" style="display: flex; align-items: center">
        <div class="title">售前人员:</div>
        <el-input
          v-model="headerdata.replyFileUsername"
          placeholder="请输入售前人员"
        />
      </div>
      <div class="inputs" style="display: flex; align-items: center">
        <div class="title" style="margin-right: -3px">项目状态:</div>
        <el-select
          v-model="headerdata.projectStatus"
          class="m-2"
          placeholder="请选择项目状态"
        >
          <el-option
            v-for="item in options.projectStatusOptions"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="inputs" style="margin-left: -6px">
        <div class="title">统计时间:</div>
        <el-date-picker
          v-model="headerdata.supportLatestTime"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          type="date"
          placeholder="请选择统计时间"
        />
      </div>
      <div class="btnList">
        <el-button type="primary" style="margin-left: 10px" @click="searchList"
          >搜索</el-button
        >
        <el-button
          type="primary"
          @click="handleUserExport"
          style="margin-left: 10px"
          >导出</el-button
        >
        <el-button type="info" @click="reset">重置</el-button>
      </div>
    </div>
  </div>
  <!-- <div
    class="headers"
    style="display: flex; justify-content: flex-end; margin-top: 20px"
  >
    <div class="headerleft">
      <el-button type="primary" style="margin-left: 10px" @click="searchList"
        >搜索</el-button
      >
      <el-button
        type="primary"
        @click="handleUserExport"
        style="margin-left: 10px"
        >导出</el-button
      >
      <el-button type="info" @click="reset">重置</el-button>
    </div>
  </div> -->
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { exportDailyPaper } from "@/api/presales/index";
import Bus from "../js/Bus";
import cityData from "@/assets/json/pcas-code.json";
//传递过来的数据
const props = defineProps({
  headerdata: {
    type: Object,
    default: {},
  },
});
const cityProps = ref({
  // 指定选项的 值 为选项对象的某个属性值
  value: "name",
  // 指定选项 标签 为选项对象的某个属性值
  label: "name",
  //指定选项的 子选项 为选项对象的某个属性值
  children: "children",
  checkStrictly: true,
});
//搜索
const searchList = () => {
  if (props.headerdata.area != undefined) {
    props.headerdata.area =
      props.headerdata.area[props.headerdata.area.length - 1];
  }
  Bus.emit("serchList", props.headerdata);
};
//重置
const reset = () => {
  Bus.emit("reseting", "1");
};
//导出
const handleUserExport = () => {
  exportDailyPaper({
    projectName: props.headerdata.projectName,
    projectId: props.headerdata.projectId,
    area: props.headerdata.area,
    salesperson: props.headerdata.salesperson,
    replyFileUsername: props.headerdata.replyFileUsername,
    projectStatus: props.headerdata.projectStatus,
    supportLatestTime: props.headerdata.supportLatestTime,
  }).then((res: any) => {
    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = `售前报表`;
    a.href = objectUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
};
//获取枚举
const options = ref({
  projectStatusOptions: [{ value: "", label: "" }],
  salespersonOptions: [{ value: "", label: "" }],
});
onMounted(() => {
  //获取项目状态
  options.value.projectStatusOptions = JSON.parse(
    localStorage.getItem("projectStatusOptions") || ""
  );
  options.value.salespersonOptions = JSON.parse(
    localStorage.getItem("salespersonOptions")
  );
});
</script>
<style scoped lang="scss">
@import "../css/index.scss";
</style>
