<template>
  <div class="app-container">
    <el-card>
      <el-tabs
        v-model="currentTab"
        class="demo-tabs"
        @tab-click="handleClickTab"
        v-hasPerm="['PROJECT_ALL']"
      >
        <el-tab-pane label="所有项目" name="first"></el-tab-pane>
        <el-tab-pane label="我的项目" name="second"></el-tab-pane>
      </el-tabs>
      <div class="header">
        <div class="headInput">
          <div class="title">项目名称:</div>
          <el-input
            v-model="query.projectName"
            placeholder="请输入项目名称"
            class="input"
          ></el-input>
        </div>
        <div class="headInput">
          <div class="title">项目编号:</div>
          <el-input
            v-model="query.projectId"
            placeholder="请输入项目编号"
            class="input"
          ></el-input>
        </div>
        <div class="headSelect">
          <div class="title">项目类型:</div>
          <el-select
            v-model="query.projectType"
            :multiple="true"
            placeholder="请选择项目类型"
            clearable
          >
            <el-option
              v-for="item in options.typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>

        <div class="headSelect">
          <div class="title">项目状态:</div>
          <el-select
            v-model="query.projectStatus"
            placeholder="请选择项目状态"
            clearable
          >
            <el-option
              v-for="item in options.statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :style="{ color: item.color }"
            >
            </el-option>
          </el-select>
        </div>
        <div class="headSelect">
          <div class="title">项目跟进状态:</div>
          <el-select
            v-model="query.projectFollowStatus"
            placeholder="请选择项目跟进状态"
            clearable
          >
            <el-option value="跟进中" label="跟进中"></el-option>
            <el-option value="无进展" label="无进展"></el-option>
          </el-select>
        </div>
        <div class="headSelect">
          <div class="title">所属区域:</div>
          <el-cascader
            v-model="query.area"
            :options="cityData"
            :props="cityProps"
            ref="cascaderAddr"
            placeholder="请选择省市区"
            clearable
          ></el-cascader>
        </div>
        <div class="headSelect" v-if="activeTab == 'first'">
          <div class="title">销售人员:</div>
          <el-select
            filterable
            v-model="query.salesperson"
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
        <div class="headSelect">
          <div class="title">项目优先级:</div>
          <el-select
            v-model="query.projectFirstLevel"
            placeholder="请选择项目优先级"
            clearable
          >
            <el-option
              v-for="item in options.priorityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="btnList">
          <el-button type="primary" @click="queryList">查询</el-button>
          <el-button style="margin-right: 10px" type="primary" @click="reset"
            >重置</el-button
          >
          <!-- <fileUpload
            :label="'导入项目'"
            action-url="/oms-project/api/project/projectImport"
            :data="{ saleName, saleId }"
            :buttonType="false"
            :showFile="false"
            @get-file-url="reset"
          ></fileUpload> -->
          <!-- <el-button
            v-hasPerm="['PROJECT_ADD']"
            
            type="primary"
            @click="handleAddProject"
            >新建项目</el-button
          > -->
        </div>
      </div>

      <div class="main">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column
            align="center"
            label="序号"
            type="index"
            width="60"
            :index="(e) => e + 1 + (query.pageNo - 1) * query.pageSize"
          />
          <el-table-column
            align="center"
            label="项目编号"
            prop="projectId"
            width="115"
          />
          <el-table-column align="center" label="所属公司" prop="company" />
          <el-table-column
            align="center"
            label="项目名称"
            prop="projectName"
            width="100"
          >
            <template #default="scope">
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
            </template>
          </el-table-column>
          <el-table-column align="center" label="项目类型" prop="projectType">
            <template #default="scope">
              <span v-for="(item1, index) in options.typeOptions" :key="index">
                <span
                  v-for="(item2, index2) in scope.row.projectType"
                  :key="index2"
                >
                  <span v-if="item2 == item1.value"
                    >{{ item1.label }} &nbsp;</span
                  >
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="项目资金来源"
            prop="projectSourceFunds"
          >
            <template #default="scope">
              <div
                v-for="(item, index) in options.projectSourceFundsOptions"
                :key="index"
              >
                <div v-if="item.value == scope.row.projectSourceFunds">
                  {{ item.label }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="所属区域"
            prop="area"
            width="140"
          >
            <template #default="scope">
              <span>
                {{
                  scope.row.area && scope.row.area.length > 0
                    ? scope.row.area
                        .toString()
                        .replace(/[^\u4e00-\u9fa5]/gi, "")
                    : ""
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="客户名称"
            prop="customerName"
            width="100"
          >
            <template #default="scope">
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="scope.row.customerName"
                placement="top-start"
              >
                {{
                  scope.row.customerName && scope.row.customerName.length > 8
                    ? scope.row.customerName.substring(0, 8) + "..."
                    : scope.row.customerName
                }}
              </el-tooltip>
            </template>
          </el-table-column>
          <!-- <el-table-column
            align="center"
            label="客户联系人"
            prop="customerContacts"
          /> -->
          <el-table-column
            align="center"
            label="预合同金额（万）"
            prop="prepareContractAmount"
          />
          <el-table-column align="center" label="销售人员" prop="salesperson">
            <!-- <template #default="scope">
              <div
                v-for="(item, index) in options.salespersonOptions"
                :key="index"
              >
                <div v-if="item.value == scope.row.salesperson">
                  {{ item.label }}
                </div>
              </div>
            </template> -->
          </el-table-column>

          <el-table-column align="center" label="项目状态" prop="projectStatus">
            <template #default="scope">
              <div v-for="(item, index) in options.statusOptions" :key="index">
                <div
                  v-if="item.value == scope.row.projectStatus"
                  :style="{ color: item.color }"
                >
                  {{ item.label }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="项目跟进状态"
            prop="projectFollowStatus"
          >
            <template #default="scope">
              <div
                :style="{
                  color: scope.row.projectFollowStatus == '无进展' ? 'red' : '',
                }"
              >
                {{ scope.row.projectFollowStatus }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="项目进度"
            prop="projectSchedule"
          />
          <el-table-column
            align="center"
            label="项目优先级"
            prop="projectFirstLevel"
          >
            <template #default="scope">
              <div
                v-for="(item, index) in options.priorityOptions"
                :key="index"
              >
                <div v-if="item.value == scope.row.projectFirstLevel">
                  {{ item.label }}
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column
            align="center"
            label="创建日期"
            prop="createTime"
            width="100"
          /> -->
          <el-table-column align="center" label="操作" width="380">
            <template #default="scope">
              <el-button
                v-if="
                  scope.row.projectStatus == 'NOTSTARTED' ||
                  scope.row.projectStatus == 'BEGINPROJECT' ||
                  scope.row.projectStatus == 'INPROGRESS'
                "
                v-hasPerm="['PROJECT_EDIT']"
                text
                type="primary"
                @click="handleEditProject(scope.row)"
                >编辑
              </el-button>
              <el-button
                v-if="
                  scope.row.projectStatus == 'NOTSTARTED' ||
                  scope.row.projectStatus == 'BEGINPROJECT' ||
                  scope.row.projectStatus == 'INPROGRESS'
                "
                text
                type="primary"
                @click="handleVisit(scope.row)"
                >客户跟进
              </el-button>
              <el-button
                v-if="
                  scope.row.projectStatus == 'NOTSTARTED' ||
                  scope.row.projectStatus == 'BEGINPROJECT'
                "
                text
                type="primary"
                @click="handlePreSalesSupport(scope.row)"
                >售前支持</el-button
              >
              <el-button
                v-if="scope.row.projectStatus == 'NOTSTARTED'"
                text
                type="primary"
                @click="handleProjectMsg(scope.row)"
                >立项
              </el-button>
              <el-button
                v-if="scope.row.projectStatus == 'BEGINPROJECT'"
                text
                type="primary"
                @click="handleBiddingMsg(scope.row)"
                >招投标
              </el-button>

              <el-button
                v-if="
                  scope.row.projectStatus == 'FINISHED' ||
                  scope.row.projectStatus == 'NOFINISHED'
                "
                text
                type="primary"
                @click="handleInfo(scope.row)"
                >详情
              </el-button>
              <!-- <el-button
                v-hasPerm="['PROJECT_DELETE']"
                text
                type="danger"
                @click="handleDelete(scope.row)"
                >删除</el-button
              > -->
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <!-- <el-pagination
            background
            layout="total, prev, pager, next"
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
    <div v-if="addProjectVisible">
      <addProject
        :id="associateTheCustomerId"
        v-model="addProjectVisible"
        :formData="projectFormData"
        type="edit"
        @reset="reset"
      ></addProject>
    </div>

    <div v-if="projectInfoVisible">
      <addVisit
        :id="visitId"
        :clientVisitId="associateTheCustomerId"
        :type="visitType"
        :projectFormData="projectInfo"
        v-model="projectInfoVisible"
        @reset="reset"
      ></addVisit>
    </div>

    <div v-if="detailProjectVisible">
      <detailProject
        :id="clientVisitId"
        :clientVisitId="associateTheCustomerId"
        :projectFormData="detailProjectInfo"
        v-model="detailProjectVisible"
        @reset="reset"
      ></detailProject>
    </div>
  </div>
</template>
<!-- 图标选择器示例 -->
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import addProject from "@/views/customerVisit/components/addproject.vue";
import addVisit from "@/views/customerVisit/components/addVisit.vue";
import detailProject from "@/views/customerVisit/components/detailProject.vue";
import fileUpload from "@/components/Upload/fileUpload.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import cityData from "@/assets/json/pcas-code.json";
import {
  getProjectInfoPage,
  projectDel,
  getMyProjectInfoPage,
} from "@/api/info/index";
import { projectEstablishment, bidding } from "@/api/visit/index";
const router = useRouter();

// 销售人员姓名
const saleName = ref(JSON.parse(localStorage.getItem("users")).name);
// 销售人员id
const saleId = ref(JSON.parse(localStorage.getItem("users")).id);

// 加载中
const loading = ref(false);
const id = ref("");
// 项目信息form
const projectFormData = ref({});
// 新增项目信息弹框
const addProjectVisible = ref(false);
// 编辑项目信息弹框
const projectInfoVisible = ref(false);
// 当前tab
const activeTab = ref("first");
// 地区选择对象
const cascaderAddr = ref(null);
const cityProps = ref({
  // value: "code", // 指定选项的 值 为选项对象的某个属性值
  value: "name", // 指定选项的 值 为选项对象的某个属性值
  label: "name", // 指定选项 标签 为选项对象的某个属性值
  children: "children", //指定选项的 子选项 为选项对象的某个属性值
  checkStrictly: true,
});
// 项目信息
const projectInfo = ref({});
// 客户跟进id
const visitId = ref("");
// 查看项目详情弹框
const detailProjectVisible = ref(false);
// 项目详情
const detailProjectInfo = ref({});
// 客户id
const clientVisitId = ref("");
// 关联客户id
const associateTheCustomerId = ref("");
// 客户拜访,跟进类型
const visitType = ref(2);
// 当前选中tab
const currentTab = ref("second");
// 是否显示tab
const showTabs = ref("first");
// 条件查询
const query = ref({
  area: "",
  projectFirstLevel: "",
  projectId: "",
  projectName: "",
  projectStatus: "",
  projectType: [],
  salesperson: "",
  currentPage: 1,
  projectFollowStatus: "",
  pageNo: 1,
  pageSize: 10,
  total: 10,
});
// select下拉以及枚举
const options = ref({
  typeOptions: [{ value: "", label: "" }],
  statusOptions: [{ value: "", label: "", color: "" }],
  areaOptions: [{ value: "", label: "" }],
  priorityOptions: [{ value: "", label: "" }],
  salespersonOptions: [{ value: "", label: "" }],
});
// 项目信息主表
const tableData = ref([]);

// 每页数量
const handleSizeChange = (val) => {};
// 跳页
const handleCurrentChange = (val) => {
  query.value.pageNo = val;
  queryList();
};

const handleClickTab = (e) => {
  activeTab.value = e.props.name;
  query.value.pageSize = 10;
  query.value.pageNo = 1;
  queryList();
};
// 客户跟进
const handleVisit = (e) => {
  projectInfo.value = JSON.parse(JSON.stringify(e));
  visitType.value = 2;
  visitId.value = e.id;
  associateTheCustomerId.value = e.associateTheCustomerId;
  projectInfoVisible.value = true;
};
// 项目编辑
const handleEditProject = (e) => {
  id.value = e.id;
  projectFormData.value = JSON.parse(JSON.stringify(e));
  addProjectVisible.value = true;
};
// 确认招投标
const handleBiddingMsg = (e) => {
  ElMessageBox.confirm(
    '请确认是否招投标。招投标后将流转至下一流程，并在"招投标管理"中展示该项目?',
    "提示",
    {
      confirmButtonText: "确认招投标",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(() => {
      bidding({ id: e.id }).then(({ code, msg }) => {
        if (code == 200)
          ElMessage({
            type: "success",
            message: msg,
          });
        queryList();
      });
    })
    .catch(() => {});
};
// 确认立项
const handleProjectMsg = (e) => {
  ElMessageBox.confirm(
    '请确认是否立项。立项后将流转至下一流程，并在"项目信息"中展示该项目?',
    "提示",
    {
      confirmButtonText: "确认立项",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(() => {
      projectEstablishment({ id: e.id }).then(({ code, msg }) => {
        if (code == 200)
          ElMessage({
            type: "success",
            message: msg,
          });
        queryList();
      });
    })
    .catch(() => {});
};
// 查看项目详情
const handleInfo = (e) => {
  clientVisitId.value = e.id;
  associateTheCustomerId.value = e.associateTheCustomerId;
  detailProjectVisible.value = true;
  detailProjectInfo.value = JSON.parse(JSON.stringify(e));
};
// 售前支持
const handlePreSalesSupport = ({ id }) => {
  router.push({
    path: "/presales/Presales",
    query: { id: id },
  });
};
// 项目信息删除
const handleDelete = (e) => {
  ElMessageBox.confirm("是否要删除此项目?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      projectDel(e.id).then(({ msg }) => {
        reset();
        ElMessage({
          type: "success",
          message: msg,
        });
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};
// 新增项目点击
const handleAddProject = () => {
  addProjectVisible.value = true;
  id.value = "";
};

// 重置
const reset = () => {
  addProjectVisible.value = false;
  projectInfoVisible.value = false;
  Object.assign(query.value, {
    area: "",
    projectFirstLevel: "",
    projectId: "",
    projectName: "",
    projectStatus: "",
    salesperson: "",
    projectType: [],
    projectFollowStatus: "",
  });
  queryList();
};
// 查询
const queryList = () => {
  loading.value = true;
  if (activeTab.value == "first")
    getProjectInfoPage({
      pageSize: query.value.pageSize,
      pageNo: query.value.pageNo,
      area: query.value.area,
      projectFirstLevel: query.value.projectFirstLevel,
      projectId: query.value.projectId,
      projectName: query.value.projectName,
      projectStatus: query.value.projectStatus,
      projectType: query.value.projectType,
      salesperson: query.value.salesperson,
      projectFollowStatus: query.value.projectFollowStatus,
    }).then(({ data }) => {
      tableData.value = data.records;
      query.value.total = data.total;
      loading.value = false;
    });
  else
    getMyProjectInfoPage({
      pageSize: query.value.pageSize,
      pageNo: query.value.pageNo,
      area: query.value.area,
      projectFirstLevel: query.value.projectFirstLevel,
      projectId: query.value.projectId,
      projectName: query.value.projectName,
      projectStatus: query.value.projectStatus,
      projectType: query.value.projectType,
      salesperson: JSON.parse(localStorage.getItem("users")).name,
      projectFollowStatus: query.value.projectFollowStatus,
    }).then(({ data }) => {
      tableData.value = data.records;
      query.value.total = data.total;
      loading.value = false;
    });
};

onMounted(() => {
  showTabs.value = localStorage.getItem("rolelist").includes("系统管理员");
  if (showTabs.value) {
    currentTab.value = "first";
    activeTab.value = "first";
  } else {
    currentTab.value = "second";
    activeTab.value = "second";
  }

  options.value.typeOptions = JSON.parse(localStorage.getItem("typeOptions"));
  options.value.statusOptions = JSON.parse(
    localStorage.getItem("projectStatusOptions")
  );
  options.value.priorityOptions = JSON.parse(
    localStorage.getItem("priorityOptions")
  );
  options.value.projectSourceFundsOptions = JSON.parse(
    localStorage.getItem("projectSourceFundsOptions")
  );
  options.value.salespersonOptions = JSON.parse(
    localStorage.getItem("salespersonOptions")
  );
  queryList();
});
</script>

<style lang="scss" scoped>
@import "./css/projectinfo.scss";
</style>
