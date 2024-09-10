<template>
  <div class="app-container">
    <el-card>
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
            v-model="query.projectCode"
            placeholder="请输入项目编号"
            class="input"
          ></el-input>
        </div>

        <div class="headSelect">
          <div class="title">项目类型:</div>
          <el-select v-model="query.projectType" placeholder="请选择" clearable>
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
          <div class="title">所属区域:</div>
          <el-cascader
            v-model="query.area"
            ref="cascaderAddr"
            :options="cityData"
            :props="cityProps"
            placeholder="请选择省市区"
            @change="(e) => (areaText = e[e.length - 1])"
          ></el-cascader>
        </div>
        <div class="headSelect">
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
          <div class="title">合同签订状态:</div>
          <el-select
            filterable
            v-model="query.projectContractStatus"
            placeholder="请选择合同签订状态"
            clearable
          >
            <el-option
              v-for="item in options.projectContractStatusOptions"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="btnList">
          <el-button type="primary" @click="queryList">查询 </el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </div>
      </div>

      <div class="main" style="margin-top: 20px">
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
          <el-table-column align="center" label="项目编号" prop="projectName">
            <template #default="scope">
              <div>
                <!-- {{ scope.row.projectName.slice(0, 10) }} -->
                {{ scope.row.projectId }}
              </div>
            </template>
          </el-table-column>
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

          <el-table-column
            align="center"
            label="项目类型"
            width="120"
            prop="projectType"
          >
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
            width="120"
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

          <el-table-column prop="area" label="所属区域" align="center">
            <template #default="scope">
              <span>
                {{
                  scope.row.area
                    ? scope.row.area
                        .toString()
                        .replace(/[^\u4e00-\u9fa5]/gi, "")
                    : ""
                }}
              </span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="客户名称" prop="customerName">
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
          <el-table-column
            align="center"
            label="销售人员"
            prop="salesperson"
            width=""
          >
          </el-table-column>
          <el-table-column
            align="center"
            label="合同签订金额（万元）"
            prop="contractAmount"
            width="100"
          />
          <el-table-column
            align="center"
            label="合同签订时间"
            prop="contractDate"
            width=""
          />
          <el-table-column
            align="center"
            label="工期"
            width="120"
            prop="duration"
          >
            <template #default="scope">
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="
                  scope.row.durationStartTime +
                  ' - ' +
                  scope.row.durationEndTime
                "
                placement="top-start"
              >
                {{ scope.row.durationStartTime }}
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="合同签订状态"
            prop="projectContractStatus"
          >
            <template #default="scope">
              <div>
                <div
                  v-if="scope.row.projectContractStatus == 'NOT_SIGNED'"
                  style="color: red"
                >
                  未签订
                </div>
                <div v-if="scope.row.projectContractStatus == 'SIGNED'">
                  已签订
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template #default="scope">
              <el-button
                ADD
                text
                type="primary"
                @click="handleContractEdit(scope.row)"
                v-if="scope.row.projectContractStatus == 'SIGNED'"
              >
                编辑
              </el-button>
              <el-button
                text
                type="primary"
                @click="handleContractChange(scope.row)"
                v-if="scope.row.projectContractStatus == 'NOT_SIGNED'"
              >
                合同签订
              </el-button>
              <el-button
                text
                type="primary"
                @click="handleContractDetail(scope.row)"
              >
                详情
              </el-button>
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
    <addContract
      :id="contractId"
      v-model="addContractVisible"
      :formData="contractFormData"
      @reset="reset"
    ></addContract>
    <div v-if="contractSignVisible">
      <contractSign
        @reset="reset"
        :id="contractId"
        v-model="contractSignVisible"
        :formData="contractFormData"
        :isEdit="isEdit"
      ></contractSign>
    </div>
    <div v-if="contractDetailVisible">
      <contractDetail
        @reset="close"
        :id="contractId"
        v-model="contractDetailVisible"
        :formData="contractFormData"
      ></contractDetail>
    </div>
  </div>
</template>
<!-- 图标选择器示例 -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import addContract from "./components/addContract.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { belongsToTheProject, contractTypeEnums } from "@/api/enum";
import { projectContractListGET } from "./api/index";
import cityData from "@/assets/json/pcas-code.json";
import contractDetail from "./components/contarctDetail.vue";
import contractSign from "./components/contractSign.vue";
const loading = ref(false);
// 合同id
const contractId = ref("");
// 项目信息form
const contractFormData = ref({});
// 新增合同弹框
const addContractVisible = ref(false);
const contractDetailVisible = ref(false);
const contractSignVisible = ref(false);
// 变更合同弹框
const changeContractVisible = ref(false);
// 条件查询
const query = ref({
  projectCode: "", // 供应商名称
  type: "", // 合同类型
  projectName: "", // 项目名称
  projectType: "",
  currentPage: 1,
  pageNo: 1,
  pageSize: 10,
  total: 10,
  area: [],
  salesperson: "",
  projectContractStatus: "",
});
// select下拉以及枚举
const options = ref({
  contractTypeEnums: [{ value: "", label: "" }],
  belongsToTheProject: [{ value: "", label: "" }],
  typeOptions: [{ value: "", label: "" }],
  projectSourceFundsOptions: [{ value: "", label: "" }],
  salespersonOptions: [{ value: "", label: "" }],
  projectContractStatusOptions: [
    { value: "NOT_SIGNED", label: "未签订" },
    { value: "SIGNED", label: "已签订" },
  ],
});
// 合同信息表格
const tableData = ref([]);
// 地区下拉对象
const cascaderAddr = ref(null);
const cityProps = ref({
  value: "name", // 指定选项的 值 为选项对象的某个属性值
  label: "name", // 指定选项 标签 为选项对象的某个属性值
  children: "children", //指定选项的 子选项 为选项对象的某个属性值
  checkStrictly: true,
});
const areaText = ref("");
const isEdit = ref(false);
// 合同签订
const handleContractChange = (e: { [propsName: string]: any }) => {
  contractId.value = e.id;
  contractFormData.value = JSON.parse(JSON.stringify(e));
  contractSignVisible.value = true;
  isEdit.value = false;
};
// 合同详情
const handleContractDetail = (e: { [propsName: string]: any }) => {
  contractId.value = e.id;
  contractFormData.value = JSON.parse(JSON.stringify(e));
  contractDetailVisible.value = true;
};
// 合同编辑
const handleContractEdit = (e: { [propsName: string]: any }) => {
  contractId.value = e.id;
  contractFormData.value = JSON.parse(JSON.stringify(e));
  contractSignVisible.value = true;
  isEdit.value = true;
};
// 新增项目点击
const handleAddCustomerVisit = () => {
  addContractVisible.value = true;
  contractId.value = "";
};

// 重置
const reset = () => {
  addContractVisible.value = false;
  contractDetailVisible.value = false;
  contractSignVisible.value = false;
  contractId.value = "";
  changeContractVisible.value = false;
  areaText.value = "";
  Object.assign(query.value, {
    projectCode: "",
    projectName: "",
    projectType: "",
    area: [],
    salesperson: "",
    projectContractStatus: "",
    pageNo: 1,
    pageSize: 10,
  });
  queryList();
};

const close = () => {
  addContractVisible.value = false;
  contractDetailVisible.value = false;
  contractSignVisible.value = false;
  contractId.value = "";
  changeContractVisible.value = false;
};
// 查询列表
const queryList = () => {
  loading.value = true;
  projectContractListGET({
    pageSize: query.value.pageSize,
    pageNo: query.value.pageNo,
    projectCode: query.value.projectCode,
    projectName: query.value.projectName,
    projectType: query.value.projectType,
    salesperson: query.value.salesperson,
    projectContractStatus: query.value.projectContractStatus,
    area: areaText.value,
  }).then(({ data }) => {
    console.log(data.records);
    tableData.value = data.records;
    query.value.total = data.total;
    loading.value = false;
  });
};

// 获取枚举
onMounted(() => {
  belongsToTheProject().then(({ data }) => {
    options.value.belongsToTheProject = data;
  });
  contractTypeEnums().then(({ data }) => {
    options.value.contractTypeEnums = data;
  });
  options.value.typeOptions = JSON.parse(localStorage.getItem("typeOptions"));

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
@import "./css/index.scss";
</style>
