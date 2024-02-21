<template>
  <el-dialog
    title="详情"
    width="70%"
    :destroy-on-close="true"
    :append-to-body="true"
  >
    <div class="app-container">
      <el-card>
        <div class="main">
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            @expand-change="expandChange"
            :row-key="getRowKeys"
            :expand-row-keys="expands"
          >
            <el-table-column type="expand">
              <template #default="props">
                <div class="subTable">
                  <!-- <el-table :data="props.row.family" border>
                  <el-table-column label="Name" prop="name" />
                  <el-table-column label="State" prop="state" />
                  <el-table-column label="City" prop="city" />
                  <el-table-column label="Address" prop="address" />
                  <el-table-column label="Zip" prop="zip" />
                </el-table> -->

                  <subTable
                    :table-data="subTableData"
                    @refresh="refresh"
                  ></subTable>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="序号"
              type="index"
              width="60"
            />
            <el-table-column
              v-for="(item, index) in tableColumn"
              :key="index"
              align="center"
              :label="item.label"
              :prop="item.prop"
            >
            </el-table-column>
            <!-- <el-table-column align="center" label="项目编号" prop="date" />
          <el-table-column align="center" label="项目名称" prop="name" />
          <el-table-column align="center" label="合同签订日期" prop="name" />
          <el-table-column align="center" label="项目工期" prop="name" />
          <el-table-column align="center" label="项目整体进度" prop="name" />
          <el-table-column align="center" label="重要节点" prop="name" />
      
          <el-table-column align="center" label="项目状态" prop="name" />
          <el-table-column align="center" label="计划状态" prop="name" /> -->

            <el-table-column
              align="center"
              label="项目状态"
              prop="projectStatus"
            >
              <template #default="scope">
                <div
                  v-for="(item, index) in options.planProjectStatusOptions"
                  :key="index"
                >
                  <div v-if="item.value == scope.row.projectStatus">
                    {{ item.label }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="计划状态" prop="planStatus">
              <template #default="scope">
                <div
                  v-for="(item, index) in options.planStatusOptions"
                  :key="index"
                >
                  <div v-if="item.value == scope.row.planStatus">
                    {{ item.label }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="项目执行经理"
              prop="executiveProjectLeader"
            >
              <template #default="scope">
                <div
                  v-for="(item, index) in options.executiveProjectLeaderOptions"
                  :key="index"
                >
                  <div v-if="item.value == scope.row.executiveProjectLeader">
                    {{ item.label }}
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column align="center" label="项目优先级" prop="priority">
              <template #default="scope">
                <div
                  v-for="(item, index) in options.planPriorityOptions"
                  :key="index"
                >
                  <div v-if="item.value == scope.row.priority">
                    {{ item.label }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="220">
              <template #default="scope">
                <div style="display: flex; justify-content: space-around">
                  <fileUpload
                    v-if="scope.row.planStatus == 'TO_BE_IMPORTED' && isAdmin"
                    :plan-id="scope.row.id"
                    :project-id="scope.row.projectNewId"
                    :label="'导入计划'"
                    @get-file-url="getFileUrl"
                  ></fileUpload>
                  <el-button text type="primary" @click="handleInfo(scope.row)">
                    详情
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <infoProject
        v-model="infoVisible"
        :id="projectId"
        @reset="reset"
      ></infoProject>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="large" @click="$emit('reset')">关闭</el-button>
        <!-- <el-button type="primary" @click="add"> 确定 </el-button> -->
      </span>
    </template>
  </el-dialog>
</template>
<!-- 图标选择器示例 -->
<script setup lang="ts">
import { ref } from "vue";
import infoProject from "@/views/projectplan_u/components/infoproject.vue";
import subTable from "@/views/projectplan_u/components/subTable.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import fileUpload from "@/components/Upload/fileUpload.vue";
import {
  getPlanPage,
  getPlanOne,
  getSubtaskById,
  getSubPlanPage,
} from "@/api/plan/plan/index";
import { downloadFile } from "@/api/plan/feishu/index";
import getFileType from "@/utils/getFileType";
import { myDict } from "@/utils/myDict";
const emits = defineEmits(["reset"]);
const props = defineProps(["subId", "projectTaskName", "taskVisible"]);
const addVisible = ref(false);
const infoVisible = ref(false);
const isAdmin = ref(false);
const subTableData = ref([]);
const id = ref("");
const myProjectId = ref("");
const projectId = ref("");
const tableColumn = ref([
  {
    label: "项目编号",
    prop: "projectId",
  },
  {
    label: "项目名称",
    prop: "projectName",
  },
  {
    label: "合同签订日期",
    prop: "dateContract",
  },
  {
    label: "项目工期",
    prop: "projectSchedule",
  },
  {
    label: "项目整体进度",
    prop: "projectProgress",
  },
  {
    label: "重要节点",
    prop: "vitalNode",
  },
  // {
  //   label: "项目执行经理",
  //   prop: "executiveProjectLeader",
  // },
  // {
  //   label: "项目优先级",
  //   prop: "priority",
  // },
  // {
  //   label: "项目状态",
  //   prop: "projectStatus",
  // },
  // {
  //   label: "计划状态",
  //   prop: "planStatus",
  // },
]);

const query = ref({
  projectName: "",
  projectCode: "",
  projectStatus: "",
  planStatus: "",
  priority: "",
  executiveProjectLeader: "",
  currentPage: 1,
  pageNo: 1,
  pageSize: 10,
  total: 10,
});
const options = ref({
  typeOptions: [{ value: 0, label: "" }],
  statusOptions: [{ value: 0, label: "" }],
  areaOptions: [{ value: 0, label: "" }],
  planProjectStatusOptions: [{ value: "", label: "" }],
  projectStatusOptions: [{ value: "", label: "" }],
  planStatusOptions: [{ value: "", label: "" }],
  planPriorityOptions: [{ value: "", label: "" }],
  executiveProjectLeaderOptions: [{ value: "", label: "" }],
});

// 获取row的key值
const getRowKeys = (row) => {
  return row.id;
};
// 要展开的行，数值的元素是row的key值
const expands = ref([]);
// 页面刷新
const refresh = () => {
  getSubTableData();
};
const tableData = ref([]);
const handleInfo = (e: object) => {
  console.log(e);
  projectId.value = e.projectNewId;
  infoVisible.value = true;
};

// 展开子表
const expandChange = (row: any) => {
  console.log(row);
  if (expands.value.includes(row.id)) {
    expands.value = expands.value.filter((val) => val !== row.id);
  } else {
    //判断是否已经存在展开的行
    if (expands.value.length != 0) {
      //如果存在展开行,清空expands数组,使它关闭
      expands.value.splice(0, expands.value.length);
      //打开点击的行
      expands.value.push(row.id);
    } else {
      //如果不存在展开行,直接push打开点击的行
      expands.value.push(row.id);
    }
  }
  myProjectId.value = row.projectNewId;
  id.value = row.id;
  localStorage.setItem("firstCode", row.customerName);
  getSubTableData();
};
const getSubTableData = () => {
  getSubPlanPage({ projectNewId: myProjectId.value, planId: id.value }).then(
    ({ data }) => {
      subTableData.value = data.records;
    }
  );
};

// 重置页面
const reset = () => {
  addVisible.value = false;
  infoVisible.value = false;
  Object.assign(query.value, {
    projectName: "",
    projectCode: "",
    projectStatus: "",
    planStatus: "",
    priority: "",
    executiveProjectLeader: "",
  });
  queryList();
};
const queryList = () => {
  getPlanPage({
    // projectName: query.value.projectName,
    pageNo: 1,
    pageSize: 99,
    projectCode: props.subId,
  }).then(({ data }) => {
    if (data) {
      tableData.value = data.records;
      query.value.total = data.total;
    } else {
      tableData.value = [];
      query.value.total = 0;
    }
  });
};

// ---------------------upload
const fileUrl = ref("");
const getFileUrl = (value: string) => {
  console.log(value, "adas");
  ElMessage({
    type: "success",
    message: "导入成功",
  });
  reset();
  refresh();
  fileUrl.value = value;
};
onMounted(() => {
  options.value.planProjectStatusOptions = JSON.parse(
    localStorage.getItem("planProjectStatusOptions")
  );
  options.value.planPriorityOptions = JSON.parse(
    localStorage.getItem("priorityOptions")
  );
  options.value.planStatusOptions = JSON.parse(
    localStorage.getItem("planStatusOptions")
  );
  options.value.executiveProjectLeaderOptions = JSON.parse(
    localStorage.getItem("executiveProjectLeaderOptions")
  );
  isAdmin.value =
    localStorage.getItem("rolelist").includes("系统管理员") ||
    localStorage.getItem("rolelist").includes("项目负责人");
  queryList();
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: left;
}
/* .btnList {
  margin: 0 0 20px 1300px;
} */

.headInput,
.headSelect {
  /* width: 300px; */
  display: flex;
  align-items: center;
  margin: 15px 50px 15px 0;
  .title {
    width: 110px;
    text-align: right;
  }
  .input {
    width: 210px;
  }
}

.btn {
  margin-left: 40px;
}

.page {
  display: flex;
  justify-content: right;
  margin: 20px;
}
.subTable {
  padding: 20px;
}
</style>
