<template>
  <el-dialog title="项目信息" width="60%" :destroy-on-close="true">
    <div class="infoBox">
      <div class="title">项目名称：{{ projectPlanFrom.projectName }}</div>
      <div class="title">项目类型：{{ projectPlanFrom.projectType }}</div>
      <div class="title">
        项目资金来源：{{ projectPlanFrom.projectSourceFunds }}
      </div>
      <div class="title" style="width: 300px">
        所属区域：{{ projectPlanFrom.area }}
      </div>
      <div class="title">客户名称：{{ projectPlanFrom.customerName }}</div>
      <div class="title">
        客户联系人：{{ projectPlanFrom.customerContacts }}
      </div>
      <div class="title">
        预合同金额（万）：{{ projectPlanFrom.prepareContractAmount }}
      </div>
      <div class="title">销售人员：{{ projectPlanFrom.salesperson }}</div>
      <div class="title">
        项目优先级：{{ projectPlanFrom.projectFirstLevel }}
      </div>
    </div>

    <changeLog
      v-model="changeVisible"
      :form="operationRecordsData"
      @close-log="changeVisible = false"
    ></changeLog>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('reset')">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onUpdated, onMounted } from "vue";
import changeLog from "./changeLog.vue";
import { projectSelectPost } from "@/api/info/index";
import { myDict } from "@/utils/myDict.ts";
import { enumProjectType, enumProjectFirst } from "@/api/enum/index";

const emits = defineEmits(["reset"]);
const props = defineProps(["id"]);
// 枚举
const options = ref({});
// 操作记录数据
const operationRecordsData = ref({});
// 项目计划信息
const projectPlanFrom = ref({
  projectName: "",
  projectType: "",
  prepareContractAmount: "",
  area: "",
  customerName: "",
  customerContacts: "",
  projectSourceFunds: "",
  salesperson: "",
  projectFirstLevel: "",
});
// 操作记录弹框
const changeVisible = ref(false);
// 操作记录表格数据
const operationRecordsTableData = ref([]);

// 打开记录弹框
const openLog = (row) => {
  changeVisible.value = true;
  operationRecordsData.value = row;
};
onUpdated(() => {
  if (props.id) {
    projectSelectPost(props.id).then(({ data }) => {
      operationRecordsTableData.value = data.modifyIPage.records;
      projectPlanFrom.value = data.project;
      myDict(projectPlanFrom.value);
    });
  }
});

onMounted(() => {
  enumProjectType().then(({ data }) => {
    options.value.typeOptions = data;
  });
  enumProjectFirst().then(({ data }) => {
    options.value.priorityOptions = data;
  });
});
</script>

<style scoped lang="scss">
@import "../css/infoproject.scss";
</style>
