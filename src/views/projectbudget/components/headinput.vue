<template>
  <div class="header">
    <div class="header-left">
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
      <div class="inputs">
        <div class="title">项目执行经理:</div>
        <el-select
          v-model="headerdata.executiveProjectLeader"
          class="m-2"
          placeholder="请选择项目执行经理"
        >
          <el-option
            v-for="(item, index) in options.executiveProjectLeaderOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="inputs">
        <div class="title">项目优先级:</div>
        <el-select
          v-model="headerdata.projectFirstLevel"
          class="m-2"
          placeholder="请选择项目优先级"
        >
          <el-option
            v-for="item in firstlist"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div class="header-right">
      <div class="inputs">
        <div class="title">预算状态:</div>
        <el-select
          v-model="headerdata.budgetStatus"
          class="m-2"
          placeholder="请选择预算状态"
        >
          <el-option label="全部" value="" />
          <el-option label="未导入" value="1" />
          <el-option label="已导入" value="2" />
        </el-select>
      </div>
      <div class="inputs">
        <div class="title">项目状态:</div>
        <el-select
          v-model="headerdata.projectStatus"
          class="m-2"
          placeholder="请选择项目状态"
        >
          <el-option
            v-for="item in projectstate"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-button
        type="primary"
        style="margin-left: 20px"
        @click="$emit('search')"
        >搜索</el-button
      >
      <el-button type="info" @click="$emit('reset')">重置</el-button>
      <el-button type="primary" @click="download">预算模板下载</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getemp2, getemp1 } from "@/api/budget";
import { downloadFile } from "@/api/plan/feishu/index";
import getFileType from "@/utils/getFileType";
//获取搜索条件数据
interface Props {
  headerdata?: any;
}
defineProps<Props>();
// select下拉以及枚举
const options = ref({
  executiveProjectLeaderOptions: [{ value: "", label: "" }],
});
//项目优先级
const firstlist = ref<any>([]);
//项目状态
const projectstate = ref<any>([]);
//获取项目优先级
const getfirst = () => {
  getemp2().then((res: any) => {
    firstlist.value = res.data;
  });
};
//获取项目状态
const getsattus = () => {
  getemp1().then((res: any) => {
    projectstate.value = res.data;
  });
};
//预算模板下载
const download = () => {
  const formData = new FormData();
  const fileUrl =
    "https://oms.cestech.com.cn/file/27c21c6297c4448787bf4fff53f54205.xlsx";
  // "http://cdn.cestech.com.cn/file/3648e276b25b412a824540e3682fb9b1.xlsx";
  formData.append("fileUrl", fileUrl);
  downloadFile(formData).then((res) => {
    const blob = new Blob([res.data], {
      type: getFileType(fileUrl),
    });
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = "预算模板";
    a.href = objectUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
};
//初始化状态
onMounted(() => {
  //获取项目执行经理
  options.value.executiveProjectLeaderOptions = JSON.parse(
    localStorage.getItem("executiveProjectLeaderOptions") || ""
  );
  getfirst();
  getsattus();
});
</script>
<style scoped lang="scss">
@import "../css/index.scss";
</style>
