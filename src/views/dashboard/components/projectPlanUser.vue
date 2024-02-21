<template>
  <el-dialog
    :title="props.title"
    width="70%"
    :destroy-on-close="true"
    :append-to-body="true"
  >
    <div class="main">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="expand">
          <template #default="props">
            <div class="subTable">
              <el-table :data="subTableData" border>
                <el-table-column
                  align="center"
                  label="序号"
                  type="index"
                  width="60"
                />

                <el-table-column
                  v-for="(item, index) in tableList"
                  :key="index"
                  align="center"
                  :label="item.label"
                  :prop="item.prop"
                >
                  <template #default="scope">
                    <!-- 判断为编辑状态 || !scope.row[item.prop] -->
                    <el-input
                      v-if="
                        state.tableRowEditIndex === scope.$index &&
                        state.tableColumnEditIndex == scope.column.id
                      "
                      :key="index"
                      ref="tableRowInputRef"
                      v-model="scope.row[item.prop]"
                      @keyup.enter="
                        ($event) => {
                          $event.target.blur();
                        }
                      "
                      @blur="onInputTableBlur(scope)"
                    />
                    <p v-else class="eidt-row-p" @dblclick="dbClickCell(scope)">
                      {{ scope.row[item.prop] }}
                    </p>
                    <!-- 判断为显示状态 -->
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="100">
                  <template #default="scope">
                    <div style="display: flex; justify-content: space-around">
                      <el-button
                        text
                        type="primary"
                        @click="handleEditPlan(scope.row)"
                      >
                        进度反馈
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="任务名称"
          prop="projectTaskName"
        />
        <el-table-column
          align="center"
          label="任务说明"
          prop="taskSpecification"
        />
        <el-table-column
          align="center"
          label="重要节点"
          prop="kmportantNodeNot"
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
        />
        <el-table-column align="center" label="备注" prop="name" />
      </el-table>
    </div>
    <task
      v-model="approvalVisible"
      @reset="close"
      :projectTaskName="myProjectTaskName"
      :sub-id="subId"
      :projectTaskCode="props.projectTaskCode"
    ></task>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('closeLog')">关闭</el-button>
        <!-- <el-button  type="primary" @click="savePlan"> 保存 </el-button> -->
      </span>
    </template>
  </el-dialog>
</template>
<!-- 图标选择器示例 -->
<script setup lang="ts">
import { ref, reactive, onUpdated } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getSubtaskById, subTaskUpdateList } from "@/api/plan/plan/index";
import task from "@/views/projectplan_u/components/task.vue";
const emits = defineEmits(["closeLog"]);
const props = defineProps(["id", "projectTaskCode", "title"]);
// 子计划id

const subId = ref("");
// 任务名
const myProjectTaskName = ref("");
// 审批弹框
const approvalVisible = ref(false);
const tableRowInputRef: any = ref(null);
// 表格表头
const tableList = ref([
  {
    label: "子任务名称",
    prop: "projectTaskName",
  },
  {
    label: "任务说明",
    prop: "taskSpecification",
  },
  {
    label: "重要节点",
    prop: "kmportantNodeNot",
  },
  {
    label: "开始时间",
    prop: "startDate",
  },
  {
    label: "结束时间",
    prop: "endDate",
  },
  {
    label: "甲方参与事项",
    prop: "partyInvolvement",
  },
  {
    label: "执行进度",
    prop: "executionProgress",
  },
  {
    label: "实施负责人",
    prop: "responsible",
  },
  {
    label: "备注",
    prop: "name",
  },
]);

// 计划数据
const tableData = ref([]);
// 子计划数据
const subTableData = ref([]);

// 编辑计划
const handleEditPlan = (e: object) => {
  localStorage.setItem("thirdCode", e.projectTaskName);
  subId.value = e.id;
  approvalVisible.value = true;
};

// 保存编辑
const savePlan = () => {
  subTaskUpdateList(subTableData.value).then(({ msg }) => {
    ElMessage({
      type: "success",
      message: msg,
    });
    emits("closeLog");
  });
  // emits("closeLog");
};

// 关闭dialog
const close = () => {
  approvalVisible.value = false;
};

//--------------------------
const state = reactive({
  tableList: [], // 表单数据
  // 编辑的表格行
  tableRowEditIndex: undefined,
  // 编辑的表格列
  tableColumnEditIndex: undefined,
});
// 双击可编辑的单元格
const dbClickCell = (scope: any) => {
  console.log(scope);
  // 找到单个格子独有的属性 - 这里是用所在行跟列id区别显示
  state.tableRowEditIndex = scope.$index;
  state.tableColumnEditIndex = scope.column.id;
  // nextTick(() => {
  //   // 获取焦点
  //   console.log(tableRowInputRef.value, "tableRowInputRef");
  //   tableRowInputRef.value.store.focus();
  //   // tableRowInputRef.value.focus();
  // });
};
// 表格中input取消焦点,select变化
const onInputTableBlur = (scope: any) => {
  console.log("取消焦点", scope);
  state.tableRowEditIndex = undefined;
  state.tableColumnEditIndex = undefined;
  const id = scope.row.id;
  const key = scope.column.property;
  const value = scope.row[key];
  console.log(id, key, value);
  // 更新给后端的数据接口
  // 提交数据........
};

onUpdated(() => {
  getSubtaskById(props.id).then(({ data }) => {
    localStorage.setItem("secondCode", data.father.projectTaskName);
    tableData.value = [];
    tableData.value.push(data.father);
    myProjectTaskName.value = data.father.projectTaskName;

    subTableData.value = data.son;
  });
});
</script>

<style lang="scss" scoped>
@import "../css/projectPlanUser.scss";
</style>
