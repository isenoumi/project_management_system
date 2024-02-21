<template>
  <div class="app-container">
    <el-card>
      <div class="header">
        <div class="headInput">
          <div class="title">客户名称:</div>
          <el-input
            v-model="query.clientName"
            placeholder="请输入客户名称"
            class="input"
          ></el-input>
        </div>
        <div class="headInput">
          <div class="title">销售人员:</div>
          <!-- <el-input
            v-model="query.salesPersonnel"
            placeholder="请输入销售人员"
            class="input"
          ></el-input> -->
          <el-select
            filterable
            v-model="query.salesPersonnel"
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
        <div class="headInput">
          <div class="title">客户联系人:</div>
          <el-input
            v-model="query.linkman"
            placeholder="请输入客户联系人"
            class="input"
          ></el-input>
        </div>
        <div class="headSelect">
          <div class="title">所属区域:</div>
          <el-cascader
            v-model="query.address"
            :options="cityData"
            :props="cityProps"
            ref="cascaderAddr"
            placeholder="请选择省市区"
            clearable
          ></el-cascader>
        </div>
        <div class="btnList" style="display: flex; justify-content: right">
          <el-button type="primary" @click="queryList">查询 </el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          <el-button
            v-hasPerm="['CLIENT_VISIT_ADD']"
            type="primary"
            @click="handleAddCustomerVisit"
            style="margin-right: 10px"
          >
            新增客户
          </el-button>
          <!-- <fileUpload
            :label="'导入客户'"
            action-url="/oms-project/api/project/customerProfileImport"
            :data="{ saleName, saleId }"
            :buttonType="false"
            :showFile="false"
            @get-file-url="reset"
          ></fileUpload>
          <div style="margin-left: 10px">
            <fileUpload
              :label="'导入项目'"
              action-url="/oms-project/api/project/projectImport"
              :data="{ saleName, saleId }"
              :buttonType="false"
              :showFile="false"
              @get-file-url="reset"
            ></fileUpload>
          </div> -->
        </div>
      </div>

      <div class="main">
        <el-table
          :data="cumstomerTableData"
          border
          style="width: 100%"
          @expand-change="expandChange"
          :row-key="getRowKeys"
          :expand-row-keys="expands"
          v-loading="loading"
        >
          <el-table-column type="expand">
            <template #default="props">
              <div class="subTable">
                <projectTable
                  :id="projectTableId"
                  :table-data="projectTableData"
                  @reset="reset"
                ></projectTable>
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
          <el-table-column align="center" label="客户名称" prop="clientName">
            <template #default="scope">
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="scope.row.clientName"
                placement="top-start"
              >
                {{
                  scope.row.clientName && scope.row.clientName.length > 8
                    ? scope.row.clientName.substring(0, 8) + "..."
                    : scope.row.clientName
                }}
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="客户联系人"
            prop="customerContacts"
          >
            <template #default="scope">
              {{ scope.row.linkman ? scope.row.linkman + "..." : "" }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="联系人职务"
            prop="contactPosition"
          >
            <template #default="scope">
              {{
                scope.row.contactPosition
                  ? scope.row.contactPosition + "..."
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="联系人方式" prop="projectType">
            <template #default="scope">
              {{ scope.row.contactWay ? scope.row.contactWay + "..." : "" }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="销售人员"
            prop="salesPersonnel"
          >
            <!-- <template #default="scope">
              <div
                v-for="(item, index) in options.salespersonOptions"
                :key="index"
              >
                <div v-if="item.value == scope.row.salesPersonnelId">
                  {{ item.label }}
                </div>
              </div>
            </template> -->
          </el-table-column>

          <el-table-column align="center" label="所属区域" prop="address">
            <template #default="scope">
              <span>
                {{
                  scope.row.address
                    ? scope.row.address.replace(/[^\u4e00-\u9fa5]/gi, "")
                    : ""
                }}
              </span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" width="360">
            <template #default="scope">
              <el-button
                v-hasPerm="['CLIENT_VISIT_EDIT']"
                text
                type="primary"
                @click="handleCustomerEdit(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                v-hasPerm="['CLIENT_VISIT_DETAIL_VISIT']"
                text
                type="primary"
                @click="handleVisit(scope.row)"
              >
                客户拜访
              </el-button>
              <el-button
                v-hasPerm="['CLIENT_VISIT_DETAIL_PROJECT']"
                text
                type="primary"
                @click="handleAddProject(scope.row)"
              >
                新建项目
              </el-button>
              <el-button
                v-hasPerm="['CLIENT_VISIT_DELETE']"
                text
                type="danger"
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <!-- <el-pagination
            background
            layout="total, prev, pager, next"
            :total="query.total"
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
        :id="projectTableId"
        v-model="addProjectVisible"
        :formData="projectFormData"
        :type="projectUpdateType"
        :customerName="customerName"
        @reset="reset"
      ></addProject>
    </div>
    <div v-if="addCustomerVisible">
      <addCustomer
        :id="custmoerId"
        v-model="addCustomerVisible"
        :formData="customerFormData"
        @reset="reset"
      ></addCustomer>
    </div>
    <div v-if="projectInfoVisible">
      <addVisit
        :clientVisitId="clientVisitId"
        :type="visitType"
        v-model="projectInfoVisible"
        @reset="reset"
      ></addVisit>
    </div>
  </div>
</template>
<!-- 图标选择器示例 -->
<script setup>
import { ref, onMounted } from "vue";
import addProject from "./components/addproject.vue";
import addCustomer from "./components/addCustomer.vue";
import addVisit from "./components/addVisit.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import cityData from "@/assets/json/pcas-code.json";
import fileUpload from "@/components/Upload/fileUpload.vue";
import { getVisitInfoPage, visitDel, exportExcelApi } from "@/api/visit/index";

// 销售人员姓名
const saleName = ref(JSON.parse(localStorage.getItem("users")).name);
// 销售人员id
const saleId = ref(JSON.parse(localStorage.getItem("users")).id);
// 客户id
const custmoerId = ref("");
// 项目信息form
const projectFormData = ref({});
// 项目table
const projectTableData = ref([]);
// 项目跟新类型
const projectUpdateType = ref([]);
// 新增项目信息弹框
const addProjectVisible = ref(false);
// 新增客户
const addCustomerVisible = ref(false);
// 客户form
const customerFormData = ref(false);

// 客户信息table
const cumstomerTableData = ref([]);
// 编辑项目信息弹框
const projectInfoVisible = ref(false);
// 客户拜访,跟进类型
const visitType = ref(1);
// 项目table id
const projectTableId = ref("");
// 客户id
const clientVisitId = ref("");
// 客户名称
const customerName = ref("");
// 加载中
const loading = ref(false);
// 地区选择对象
const cascaderAddr = ref(null);
const cityProps = ref({
  // value: "code", // 指定选项的 值 为选项对象的某个属性值
  value: "name", // 指定选项的 值 为选项对象的某个属性值
  label: "name", // 指定选项 标签 为选项对象的某个属性值
  children: "children", //指定选项的 子选项 为选项对象的某个属性值
  checkStrictly: true,
});
// 条件查询
const query = ref({
  address: "",
  clientName: "",
  salesPersonnel: "",
  currentGeneration: "",
  linkman: "",
  customerManager: "",
  customerDecisionMakers: "",
  currentPage: 1,
  pageNo: 1,
  pageSize: 10,
  total: 10,
});
// select下拉以及枚举
const options = ref({
  currentGenerationOptions: [{ value: "", label: "" }],
  statusOptions: [{ value: "", label: "", color: "" }],
  areaOptions: [{ value: "", label: "" }],
  priorityOptions: [{ value: "", label: "" }],
  salespersonOptions: [{ value: "", label: "" }],
});

// 序号递增
const indexAdd = (index) =>
  index + 1 + (query.value.pageNo - 1) * query.value.pageSize;

// 获取row的key值
const getRowKeys = (row) => {
  return row.id;
};
// 要展开的行，数值的元素是row的key值
const expands = ref([]);
// 展开表格行
const expandChange = ({ id, projectName }) => {
  if (expands.value.includes(id)) {
    expands.value = expands.value.filter((val) => val !== id);
  } else {
    //判断是否已经存在展开的行
    if (expands.value.length != 0) {
      //如果存在展开行,清空expands数组,使它关闭
      expands.value.splice(0, expands.value.length);
      //打开点击的行
      expands.value.push(id);
    } else {
      //如果不存在展开行,直接push打开点击的行
      expands.value.push(id);
    }
  }
  projectTableId.value = id;
  localStorage.setItem("firstCode", projectName);
};

// 分页
const handleCurrentChange = (val) => {
  query.value.pageNo = val;
  queryList();
};
// 新增客户拜访
const handleVisit = (e) => {
  clientVisitId.value = e.id;
  projectInfoVisible.value = true;
};
// 客户编辑
const handleCustomerEdit = (e) => {
  visitType.value = 1;
  custmoerId.value = e.id;
  customerFormData.value = JSON.parse(JSON.stringify(e));
  // addProjectVisible.value = true;
  addCustomerVisible.value = true;
};
// 客户删除
const handleDelete = (e) => {
  ElMessageBox.confirm("是否要删除此客户?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      visitDel(e.id).then(({ code, msg }) => {
        reset();
        if (code == 200)
          ElMessage({
            type: "success",
            message: msg,
          });
      });
    })
    .catch(() => {});
};
// 新增项目
const handleAddProject = (e) => {
  addProjectVisible.value = true;
  projectTableId.value = e.id;
  customerName.value = e.clientName;
  projectUpdateType.value = "add";
};
// 新增客户
const handleAddCustomerVisit = () => {
  addCustomerVisible.value = true;
  custmoerId.value = "";
};
// 客户导入
const upload = (param) => {
  const formData = new FormData();
  formData.set("file", param.file);
  formData.set("id", "1");
  exportExcelApi(formData).then(({ msg }) => {
    ElMessage.success(msg);
    // getBuildList();
  });
};

// 重置
const reset = () => {
  addCustomerVisible.value = false;
  addProjectVisible.value = false;
  projectInfoVisible.value = false;
  Object.assign(query.value, {
    address: "",
    projectFirstLevel: "",
    salesPersonnel: "",
    clientName: "",
    currentGeneration: "",
    linkman: "",
    customerManager: "",
    customerDecisionMakers: "",
  });
  expands.value = [];
  queryList();
};
// 查询
const queryList = () => {
  loading.value = true;
  expands.value = [];
  let myAddress = "";
  if (query.value.address) {
    myAddress = query.value.address[query.value.address.length - 1];
  }
  let createBy = "";
  if (!localStorage.getItem("rolelist").includes("系统管理员"))
    createBy = JSON.parse(localStorage.getItem("users")).id;
  getVisitInfoPage({
    pageSize: query.value.pageSize,
    pageNo: query.value.pageNo,
    address: myAddress,
    salesPersonnel: query.value.salesPersonnel,
    clientName: query.value.clientName,
    currentGeneration: query.value.currentGeneration,
    linkman: query.value.linkman,
    customerManager: query.value.customerManager,
    customerDecisionMakers: query.value.customerDecisionMakers,
    createBy,
  }).then(({ data }) => {
    cumstomerTableData.value = data.records;
    query.value.total = data.total;
    loading.value = false;
  });
};
// 初始化加载
onMounted(() => {
  options.value.currentGenerationOptions = JSON.parse(
    localStorage.getItem("currentGenerationOptions")
  );
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
