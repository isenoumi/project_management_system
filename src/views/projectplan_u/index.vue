<template>
  <div class="app-container">
    <el-card>
      <div class="header">
        <div class="headInput">
          <div class="title">项目名称：</div>
          <el-input
            v-model="query.projectName"
            placeholder="请输入内容"
            class="input"
          ></el-input>
        </div>
        <div class="headInput">
          <div class="title">项目编号：</div>
          <el-input
            v-model="query.projectCode"
            placeholder="请输入内容"
            class="input"
          ></el-input>
        </div>
        <div class="headSelect">
          <div class="title">项目执行经理：</div>
          <el-select
            v-model="query.executiveProjectLeader"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in options.executiveProjectLeaderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="headSelect">
          <div class="title">项目优先级：</div>
          <el-select v-model="query.priority" placeholder="请选择" clearable>
            <el-option
              v-for="item in options.planPriorityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="headSelect">
          <div class="title">项目状态：</div>
          <el-select
            v-model="query.projectStatus"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in options.planProjectStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="headSelect">
          <div class="title">计划状态：</div>
          <el-select v-model="query.planStatus" placeholder="请选择" clearable>
            <el-option
              v-for="item in options.planStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="btnList">
          <el-button type="primary" @click="queryList">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          <el-button type="primary" @click="download">计划模板下载</el-button>
        </div>
      </div>

      <div class="main">
        <el-table
          :data="projectPlanTableData"
          border
          style="width: 100%"
          @expand-change="expandChange"
          :row-key="getRowKeys"
          :expand-row-keys="expands"
        >
          <el-table-column type="expand">
            <template #default="props">
              <div class="subTable">
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
            :index="(e) => e + 1 + (query.pageNo - 1) * query.pageSize"
          />
          <el-table-column
            v-for="(item, index) in tableColumn"
            :key="index"
            align="center"
            :label="item.label"
            :prop="item.prop"
            :width="item.width ? item.width : 'auto'"
          >
            <template #default="scope">
              <div v-if="item.label == '项目名称'">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="scope.row.projectName"
                  placement="top-start"
                >
                  {{
                    scope.row.projectName && scope.row.projectName.length > 8
                      ? scope.row.projectName.substring(0, 8) + "..."
                      : scope.row.projectName
                  }}
                </el-tooltip>
              </div>
              <div v-else-if="item.label == '项目工期'">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="scope.row.projectSchedule"
                  placement="top-start"
                >
                  {{
                    scope.row.projectSchedule &&
                    scope.row.projectSchedule.length > 10
                      ? scope.row.projectSchedule.substring(0, 10) + "..."
                      : scope.row.projectSchedule
                  }}
                </el-tooltip>
              </div>

              <div v-else>
                {{ scope.row[item.prop] }}
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" label="项目状态" prop="projectStatus">
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
          <el-table-column align="center" label="重要节点" prop="vitalNode">
            <template #default="scope">
              <span v-for="(item, index) in scope.row.vitalNode" :key="index">
                <span v-if="item == 1">★</span>
                <span v-else-if="item == '0'">☆</span>
              </span>
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
                  v-if="scope.row.planStatus == 'TO_BE_IMPORTED'"
                  :plan-id="scope.row.id"
                  :project-id="scope.row.projectNewId"
                  :label="'导入计划'"
                  @get-file-url="getFileUrl"
                ></fileUpload>
                <el-button
                  text
                  type="primary"
                  @click="handleViewProjectPlan(scope.row)"
                >
                  详情
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <!-- <el-pagination
            background
            layout="total,prev, pager, next"
            :total="query.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination> -->
          <pagination
            v-if="query.total > 0"
            v-model:total="query.total"
            v-model:page="query.pageNo"
            v-model:limit="query.pageSize"
            @pagination="queryList"
          />
        </div>
      </div>
    </el-card>
    <infoProject
      v-model="infoVisible"
      :id="projectId"
      @reset="reset"
    ></infoProject>
  </div>
</template>
<!-- 图标选择器示例 -->
<script setup lang="ts">
import { ref } from "vue";
import infoProject from "./components/infoproject.vue";
import subTable from "./components/subTable.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import fileUpload from "@/components/Upload/fileUpload.vue";
import { getPlanPage, getSubPlanPage } from "@/api/plan/plan/index";
import { downloadFile } from "@/api/plan/feishu/index";
import getFileType from "@/utils/getFileType";
// 项目新增弹框
const addVisible = ref(false);
// 项目详情弹框
const infoVisible = ref(false);
// 子表数据
const subTableData = ref([]);
const id = ref("");
// 子表id
const subProjectId = ref("");
// 父表数据id
const projectId = ref("");
// 表头
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
    width: 100,
  },
  {
    label: "项目工期",
    prop: "projectSchedule",
  },
  {
    label: "项目整体进度",
    prop: "projectProgress",
  },
  // {
  //   label: "重要节点",
  //   prop: "vitalNode",
  // },
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
// 条件查询
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
// select下拉以及枚举
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
// 刷新页面
const refresh = () => {
  getSubTableData();
};
// 项目计划表格数据
const projectPlanTableData = ref([]);
// 每页数量
const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`);
};
// 页面跳转
const handleCurrentChange = (val) => {
  query.value.pageNo = val;
  queryList();
};

// 查看项目计划信息
const handleViewProjectPlan = (e: object) => {
  projectId.value = e.projectNewId;
  infoVisible.value = true;
};

// 展开表格行
const expandChange = (row) => {
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
  subProjectId.value = row.projectNewId;
  id.value = row.id;
  localStorage.setItem("firstCode", row.projectName);
  getSubTableData();
};
// 查询子表格数据
const getSubTableData = () => {
  getSubPlanPage({ projectNewId: subProjectId.value, planId: id.value }).then(
    ({ data }) => {
      subTableData.value = data.records;
    }
  );
};
// 重置
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
// 搜索查询表格
const queryList = () => {
  getPlanPage({
    pageNo: query.value.pageNo,
    pageSize: query.value.pageSize,
    projectCode: query.value.projectCode,
    projectName: query.value.projectName,
    executiveProjectLeader: query.value.executiveProjectLeader,
    priority: query.value.priority,
    planStatus: query.value.planStatus,
    projectStatus: query.value.projectStatus,
  }).then(({ data }) => {
    if (data) {
      projectPlanTableData.value = data.records;
      query.value.total = data.total;
    } else {
      projectPlanTableData.value = [];
      query.value.total = 0;
    }
  });
};

//计划模板下载
const download = () => {
  const formData = new FormData();
  const fileUrl =
    // "http://cdn.cestech.com.cn/file/5645dde22c0643faaa090b5eabfc1476.xlsx";
    "https://oms.cestech.com.cn/file/5a269b9ae7934f6faa9b877eeeb7f68e.xlsx";

  formData.append("fileUrl", fileUrl);
  downloadFile(formData).then((res) => {
    const blob = new Blob([res.data], {
      type: getFileType(fileUrl),
    });
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = "计划模板";
    a.href = objectUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
};

// upload上传文件链接
const fileUrl = ref("");
// 得到附件链接url
const getFileUrl = (value: string) => {
  console.log(value, "adas");
  // ElMessage({
  //   type: "success",
  //   message: "导入成功",
  // });
  ElMessage({
    type: value.code == 500 ? "error" : "success",
    message: value.msg,
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
  queryList();
});
</script>

<style lang="scss" scoped>
@import "./css/projectplan.scss";
</style>
