<template>
  <el-dialog
    title="项目信息"
    width="70%"
    :destroy-on-close="true"
    :append-to-body="true"
  >
    <div class="main">
      <el-table :data="subTaskTableData" border style="width: 100%">
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
                  :width="item.width ? item.width : 'auto'"
                >
                  <template #default="scope">
                    <!-- 判断为编辑状态 || !scope.row[item.prop] -->
                    <!-- <el-input
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
                    </p> -->

                    <!-- 判断为显示状态 -->
                    <div v-if="item.label == '子任务名称'">
                      <el-tooltip
                        class="box-item"
                        effect="dark"
                        :content="scope.row.projectTaskName"
                        placement="top-start"
                      >
                        {{
                          scope.row.projectTaskName &&
                          scope.row.projectTaskName.length > 8
                            ? scope.row.projectTaskName.substring(0, 10) + "..."
                            : scope.row.projectTaskName
                        }}
                      </el-tooltip>
                    </div>
                    <div v-else-if="item.label == '任务说明'">
                      <el-tooltip
                        class="box-item"
                        effect="dark"
                        :content="scope.row.taskSpecification"
                        placement="top-start"
                      >
                        {{
                          scope.row.taskSpecification &&
                          scope.row.taskSpecification.length > 15
                            ? scope.row.taskSpecification.substring(0, 15) +
                              "..."
                            : scope.row.taskSpecification
                        }}
                      </el-tooltip>
                    </div>

                    <div v-else>
                      {{ scope.row[item.prop] }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="100">
                  <template #default="scope">
                    <div style="display: flex; justify-content: space-around">
                      <!-- TODO 进度反馈 -->
                      <!--  v-hasPerm="['PROJECT_PLAN PROGRESS_FEEDBACK']" -->
                      <el-button
                        text
                        type="primary"
                        @click="handleViewSubTable(scope.row)"
                      >
                        {{ isAdmin ? "进度反馈" : "查看" }}
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="任务名称" prop="projectTaskName">
          <template #default="scope">
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="scope.row.projectTaskName"
              placement="top-start"
            >
              {{
                scope.row.projectTaskName &&
                scope.row.projectTaskName.length > 10
                  ? scope.row.projectTaskName.substring(0, 10) + "..."
                  : scope.row.projectTaskName
              }}
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="任务说明"
          prop="taskSpecification"
        >
          <template #default="scope">
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="scope.row.taskSpecification"
              placement="top-start"
            >
              {{
                scope.row.taskSpecification && scope.row.taskSpecification > 10
                  ? scope.row.taskSpecification.substring(0, 10) + "..."
                  : scope.row.taskSpecification
              }}
            </el-tooltip>
          </template>
        </el-table-column>
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
      v-model="taskVisible"
      @reset="taskVisible = false"
      :projectTaskName="myProjectTaskName"
      :sub-id="subId"
      :projectTaskCode="props.projectTaskCode"
    ></task>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('closeLog')">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<!-- 图标选择器示例 -->
<script setup lang="ts">
import { ref, reactive, onMounted, onUpdated } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getSubtaskById, subTaskUpdateList } from "@/api/plan/plan/index";
import task from "./task.vue";
const emits = defineEmits(["closeLog"]);
const props = defineProps(["id", "projectTaskCode"]);

// 项目名称
const myProjectTaskName = ref("");
// 任务弹框
const taskVisible = ref(false);
// 表格单元格ref
const tableRowInputRef: any = ref(null);
// 子任务表格表头
const tableList = ref([
  {
    label: "子任务名称",
    prop: "projectTaskName",
  },
  {
    label: "任务说明",
    prop: "taskSpecification",
    width: 160,
  },
  {
    label: "重要节点",
    prop: "kmportantNodeNot",
  },
  {
    label: "开始时间",
    prop: "startDate",
    width: 100,
  },
  {
    label: "结束时间",
    prop: "endDate",
    width: 100,
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
// 子任务表格数据
const subTaskTableData = ref([]);
// 是否管理员
const isAdmin = ref(false);
// 二级表数据
const subTableData = ref([]);
// 二级表id
const subId = ref("");
// 查看二级表格信息
const handleViewSubTable = (e: object) => {
  localStorage.setItem("thirdCode", e.projectTaskName);
  subId.value = e.id;
  taskVisible.value = true;
};

// 保存子表编辑
const saveSubTable = () => {
  subTaskUpdateList(subTableData.value).then(({ msg }) => {
    ElMessage({
      type: "success",
      message: msg,
    });
    emits("closeLog");
  });
};

//--------------------------
// 双击编辑单元格状态
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
  nextTick(() => {
    // 获取焦点
    tableRowInputRef.value.store.focus();
    // tableRowInputRef.value.focus();
  });
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
    subTaskTableData.value = [];
    subTaskTableData.value.push(data.father);

    myProjectTaskName.value = data.father.projectTaskName;
    subTableData.value = data.son;
  });
});

onMounted(() => {
  isAdmin.value = localStorage.getItem("rolelist").includes("项目执行人");
});
</script>

<style lang="scss" scoped>
@import "../css/subTableInfo.scss";
</style>
