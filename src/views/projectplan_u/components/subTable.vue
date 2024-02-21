<template>
  <div>
    <el-table :data="props.tableData" border style="width: 100%">
      <el-table-column align="center" label="序号" type="index" width="60" />
      <el-table-column align="center" label="任务名称" prop="projectTaskName" />
      <el-table-column
        align="center"
        label="任务说明"
        prop="taskSpecification"
      />
      <el-table-column
        align="center"
        label="重要节点完成情况"
        prop="kmportantNodeNot"
        width="120"
      />
      <el-table-column align="center" label="开始时间" prop="startDate" />
      <el-table-column align="center" label="结束时间" prop="endDate" />
      <el-table-column
        align="center"
        label="甲方参与事项"
        prop="partyInvolvement"
      />
      <el-table-column
        align="center"
        label="执行进度"
        prop="executionProgress"
        width="140"
      />

      <el-table-column align="center" label="备注" prop="name" />
      <el-table-column
        v-if="props.showBtn"
        align="center"
        label="操作"
        width="280"
      >
        <template #default="scope">
          <el-button text type="primary" @click="handlePlanInfo(scope.row)"
            >查看
          </el-button>
          <!-- <el-button text type="danger" @click="handleDelete(scope.row)"
            >删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <subTableInfo
      v-model="subTaskinfoVisible"
      :id="id"
      @close-log="subTaskinfoVisible = false"
      :projectTaskCode="projectTaskCode"
    ></subTableInfo>
  </div>
</template>
<!-- 图标选择器示例 -->
<script setup lang="ts">
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import subTableInfo from "./subTableInfo.vue";
import { delPlan } from "@/api/plan/plan/index";
const emits = defineEmits(["refresh"]);
const props = defineProps({
  tableData: { type: Array, default: () => [] },
  showBtn: { type: Boolean, default: true },
});
// 计划任务code
const projectTaskCode = ref("");
// 子任务详情弹框
const subTaskinfoVisible = ref(false);
const id = ref("");

// 查看项目计划详情
const handlePlanInfo = (e: object) => {
  id.value = e.id;
  localStorage.setItem("secondCode", e.projectTaskName);
  projectTaskCode.value = e.projectTaskCode;
  subTaskinfoVisible.value = true;
};
// 删除项目计划
const handleDelete = (e: object) => {
  ElMessageBox.confirm("是否要删除此项目?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      delPlan(e.id).then((res) => {
        ElMessage({
          type: "success",
          message: res.msg,
        });
        emits("refresh");
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};
</script>

<style lang="scss" scoped>
@import "../css/subtable.scss";
</style>
