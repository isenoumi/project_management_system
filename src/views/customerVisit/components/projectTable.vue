<template>
  <div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column
        align="center"
        label="序号"
        :index="(e) => e + 1 + (pageNo - 1) * pageSize"
        type="index"
        width="60"
      />
      <el-table-column
        align="center"
        label="项目编号"
        prop="projectId"
        width="115"
      />
      <el-table-column align="center" label="项目名称" prop="projectName">
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
      <el-table-column align="center" label="所属公司" prop="company" />
      <el-table-column
        align="center"
        label="预合同金额（万）"
        prop="prepareContractAmount"
        width="140"
      />
      <!-- <el-table-column align="center" label="销售人员" prop="salesperson">
        <template #default="scope">
          <div v-for="(item, index) in options.salespersonOptions" :key="index">
            <div v-if="item.value == scope.row.salesperson">
              {{ item.label }}
            </div>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column
        align="center"
        label="项目优先级"
        prop="projectFirstLevel"
      >
        <template #default="scope">
          <div v-for="(item, index) in options.priorityOptions" :key="index">
            <div v-if="item.value == scope.row.projectFirstLevel">
              {{ item.label }}
            </div>
          </div>
        </template>
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
        label="售前累积支持次数"
        prop="cumulativeNumberSupportedTimes"
      />
      <el-table-column
        align="center"
        label="售前支持状态有无超期"
        prop="theSupportStatusExpires"
      >
        <template #default="scope">
          <div
            v-for="(item, index) in options.theSupportStatusExpiresOptions"
            :key="index"
          >
            <div v-if="item.value == scope.row.theSupportStatusExpires">
              {{ item.label }}
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="380">
        <template #default="scope">
          <el-button
            v-if="
              scope.row.projectStatus == 'NOTSTARTED' ||
              scope.row.projectStatus == 'BEGINPROJECT' ||
              scope.row.projectStatus == 'INPROGRESS' ||
              scope.row.projectStatus == 'APPLYING'
            "
            v-hasPerm="['PROJECT_EDIT']"
            text
            type="primary"
            @click="handleEditProject(scope.row)"
            >编辑项目
          </el-button>
          <el-button
            v-if="
              scope.row.projectStatus == 'NOTSTARTED' ||
              scope.row.projectStatus == 'BEGINPROJECT' ||
              scope.row.projectStatus == 'INPROGRESS' ||
              scope.row.projectStatus == 'APPLYING'
            "
            v-hasPerm="['CLIENT_VISIT_DETAIL_INTO']"
            text
            type="primary"
            @click="handleVisit(scope.row)"
            >客户跟进
          </el-button>
          <el-button
            v-if="
              scope.row.projectStatus == 'NOTSTARTED' ||
              scope.row.projectStatus == 'BEGINPROJECT' ||
              scope.row.projectStatus == 'APPLYING'
            "
            v-hasPerm="['CLIENT_VISIT_DETAIL_SUPPORT']"
            text
            type="primary"
            @click="handlePreSalesSupport(scope.row)"
            >售前支持</el-button
          >
          <el-button
            v-if="scope.row.projectStatus == 'NOTSTARTED'"
            v-hasPerm="['CLIENT_VISIT_DETAIL_BUILD']"
            text
            type="primary"
            @click="handleProjectMsg(scope.row)"
            >立项
          </el-button>
          <el-button
            v-if="scope.row.projectStatus == 'BEGINPROJECT'"
            v-hasPerm="['CLIENT_VISIT_DETAIL_BID']"
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
        :total="total"
        @current-change="handleCurrentChange"
      >
      </el-pagination> -->
      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="pageNo"
        v-model:limit="pageSize"
        @pagination="queryList"
      />
    </div>
    <div v-if="addProjectVisible">
      <addProject
        :id="props.id"
        v-model="addProjectVisible"
        :formData="projectFormData"
        type="edit"
        @reset="reset"
      ></addProject>
    </div>

    <div v-if="projectInfoVisible">
      <addVisit
        :id="addProjectId"
        :clientVisitId="props.id"
        :type="visitType"
        :projectFormData="projectInfo"
        v-model="projectInfoVisible"
        @reset="reset"
      ></addVisit>
    </div>

    <div v-if="detailProjectVisible">
      <detailProject
        :id="clientVisitId"
        :clientVisitId="props.id"
        :projectFormData="detailProjectInfo"
        v-model="detailProjectVisible"
        @reset="reset"
      ></detailProject>
    </div>

    <div v-if="biddingVisible">
      <biddingComponents
        :id="id"
        v-model="biddingVisible"
        @reset="reset"
      ></biddingComponents>
    </div>
  </div>
</template>
<!-- 图标选择器示例 -->
<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { delPlan } from "@/api/plan/plan/index";
import { getEnums } from "@/api/enum";
import addProject from "./addproject.vue";
import addVisit from "./addVisit.vue";
import detailProject from "./detailProject.vue";
import { projectEstablishment, bidding } from "@/api/visit/index";
import { getprojectTableDataApi } from "@/api/visit/index";
import biddingComponents from "@/views/projectinfo/components/bidding.vue";
const router = useRouter();
const emits = defineEmits(["refresh", "time"]);
const props = defineProps({
  tableData: { type: Array, default: () => [] },
  showBtn: { type: Boolean, default: true },
  id: { type: String, default: "" },
});
const biddingVisible = ref(false);
const id = ref("");
// 项目信息form
const projectFormData = ref({});
// 新增项目信息弹框
const addProjectVisible = ref(false);
// 编辑项目信息弹框
const projectInfoVisible = ref(false);
// 查看项目详情弹框
const detailProjectVisible = ref(false);
// 项目信息
const projectInfo = ref({});
// 项目详情
const detailProjectInfo = ref({});
// 客户id
const clientVisitId = ref("");
// 新增项目id
const addProjectId = ref("");
// 当前页
const pageNo = ref(1);
const pageSize = ref(10);
// 总数
const total = ref(1);
// 条件查询
const query = ref({});
// 客户拜访,跟进类型
const visitType = ref(2);
// select下拉以及枚举
const options = ref({
  typeOptions: [{ value: "", label: "" }],
  statusOptions: [{ value: "", label: "", color: "" }],
  areaOptions: [{ value: "", label: "" }],
  priorityOptions: [{ value: "", label: "" }],
  salespersonOptions: [{ value: "", label: "" }],
  theSupportStatusExpiresOptions: [{ value: "", label: "" }],
});
// 项目信息主表
const tableData = ref([]);
// 跳页
const handleCurrentChange = (val) => {
  query.value.pageNo = val;
  queryList();
};
// 客户跟进
const handleVisit = (e) => {
  projectInfo.value = JSON.parse(JSON.stringify(e));
  visitType.value = 2;
  addProjectId.value = e.id;
  projectInfoVisible.value = true;
};

// 售前支持
const handlePreSalesSupport = ({ id }) => {
  router.push({
    path: "/presales/Presales",
    query: { id: id },
  });
};
// 项目编辑
const handleEditProject = (e) => {
  addProjectId.value = e.id;
  projectFormData.value = {
    ...e,
    operatorList: [
      {
        linkman: "",
        contactPosition: "",
        contactWay: "",
        type: "CUSTOMER_MANAGER",
      },
    ],
    decisionList: [
      {
        linkman: "",
        contactPosition: "",
        contactWay: "",
        type: "CUSTOMER_DECISION_MAKERS",
      },
    ],
  };
  addProjectVisible.value = true;
};
// // 确认招投标
// const handleBiddingMsg = (e) => {
//   ElMessageBox.confirm(
//     '请确认是否招投标。招投标后将流转至下一流程，并在"招投标管理"中展示该项目?',
//     "提示",
//     {
//       confirmButtonText: "确认招投标",
//       cancelButtonText: "取消",
//       type: "warning",
//     }
//   )
//     .then(() => {
//       bidding({ id: e.id }).then(({ code, msg }) => {
//         if (code == 200)
//           ElMessage({
//             type: "success",
//             message: msg,
//           });
//         reset();
//       });
//     })
//     .catch(() => {});
// };

// 确认招投标
const handleBiddingMsg = (e) => {
  biddingVisible.value = true;
  id.value = e.id;
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
        reset();
      });
    })
    .catch(() => {});
};
// 查看项目详情
const handleInfo = (e) => {
  clientVisitId.value = e.id;
  detailProjectVisible.value = true;
  detailProjectInfo.value = JSON.parse(JSON.stringify(e));
};

// 重置
const reset = () => {
  addProjectVisible.value = false;
  projectInfoVisible.value = false;
  detailProjectVisible.value = false;
  biddingVisible.value = false;
  Object.assign(query.value, {
    area: "",
    projectFirstLevel: "",
    projectId: "",
    projectName: "",
    projectStatus: "",
    projectType: [],
  });
  queryList();
};
// 查询list
const queryList = () => {
  if (props.id)
    getprojectTableDataApi({
      pageSize: pageSize.value,
      pageNo: pageNo.value,
      id: props.id,
    }).then(({ data }) => {
      tableData.value = data.records;
      total.value = data.total;
    });
};

// 删除项目计划
const handleDelete = (e) => {
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

watch(
  props.tableData,
  (n, o) => {
    tableData.value = props.tableData;
  },
  {
    deep: true,
    immediate: true,
  }
);
onMounted(() => {
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
  getEnums({
    enumsName: "PreSalesSupportStatusEnums",
  }).then(({ data }) => {
    options.value.theSupportStatusExpiresOptions = data;
  });

  queryList();
});
</script>

<style lang="scss" scoped>
@import "../css/subtable.scss";
</style>
