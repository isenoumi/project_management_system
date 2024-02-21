<template>
  <div class="app-container">
    <el-card>
      <div class="header">
        <div class="headInput">
          <div class="title">合同名称:</div>
          <el-input
            v-model="query.name"
            placeholder="请输入合同名称"
            class="input"
          ></el-input>
        </div>
        <div class="headInput">
          <div class="title">供应商:</div>
          <el-input
            v-model="query.supplierNeme"
            placeholder="请输入供应商"
            class="input"
          ></el-input>
        </div>

        <div class="headSelect">
          <div class="title">合同类型:</div>
          <el-select
            v-model="query.type"
            placeholder="请选择合同类型"
            clearable
          >
            <el-option
              v-for="item in options.contractTypeEnums"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="headSelect">
          <div class="title">所属项目:</div>
          <el-select
            v-model="query.projectName"
            placeholder="请选择所属项目"
            clearable
            filterable
          >
            <el-option
              v-for="item in options.belongsToTheProject"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="btnList">
          <el-button type="primary" @click="queryList">查询 </el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          <el-button
            v-hasPerm="['CONTRACT_MANAGEMENT_ADD']"
            type="primary"
            @click="handleAddCustomerVisit"
          >
            新建合同
          </el-button>
        </div>
      </div>

      <div class="main">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column
            align="center"
            label="序号"
            type="index"
            width="60"
            :index="(e) => e + 1 + (query.pageNo - 1) * query.pageSize"
          />
          <el-table-column align="center" label="合同编号" prop="projectName">
            <template #default="scope">
              <div>
                <!-- {{ scope.row.projectName.slice(0, 10) }} -->
                {{ scope.row.id }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="合同名称" prop="name">
            <template #default="scope">
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="scope.row.name"
                placement="top-start"
              >
                {{
                  scope.row.name && scope.row.name.length > 8
                    ? scope.row.name.substring(0, 8) + "..."
                    : scope.row.name
                }}
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column align="center" label="所属项目" prop="projectName">
            <template #default="scope">
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="scope.row.projectName"
                placement="top-start"
              >
                {{
                  scope.row.projectName && scope.row.projectName.length > 10
                    ? scope.row.projectName.substring(0, 10) + "..."
                    : scope.row.projectName
                }}
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="合同签订甲方"
            prop="contractFirstParty"
          />

          <el-table-column
            align="center"
            label="甲方联系人"
            prop="firstPartyContacts"
          >
          </el-table-column>
          <el-table-column
            align="center"
            label="甲方联系方式"
            prop="firstPartyPhone"
          />
          <el-table-column align="center" label="供应商" prop="supplierNeme">
          </el-table-column>

          <el-table-column
            align="center"
            label="供应商联系人"
            prop="supplierContacts"
            width=""
          />
          <el-table-column
            align="center"
            label="供应商联系方式"
            prop="supplierPhone"
            width=""
          >
          </el-table-column>
          <el-table-column
            align="center"
            label="合同总金额（元）"
            prop="finallyMoney"
            width="140"
          />
          <el-table-column
            align="center"
            label="合同签署日期"
            prop="contractDate"
            width=""
          />

          <el-table-column align="center" label="操作" width="180">
            <template #default="scope">
              <el-button
                v-hasPerm="['CONTRACT_MANAGEMENT_EDIT']"
                ADD
                text
                type="primary"
                @click="handleContractChange(scope.row)"
              >
                变更
              </el-button>
              <el-button
                v-hasPerm="['CONTRACT_MANAGEMENT_DELETE']"
                text
                type="danger"
                @click="handleContractDelete(scope.row)"
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
  </div>
</template>
<!-- 图标选择器示例 -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import addContract from "./components/addContract.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { belongsToTheProject, contractTypeEnums } from "@/api/enum";
import { getContractPage, contractDel } from "@/api/contract/index";

// 合同id
const contractId = ref("");
// 项目信息form
const contractFormData = ref({});
// 新增合同弹框
const addContractVisible = ref(false);
// 变更合同弹框
const changeContractVisible = ref(false);
// 条件查询
const query = ref({
  supplierNeme: "", // 供应商名称
  name: "", // 合同名称
  type: "", // 合同类型
  projectName: "", // 项目名称
  currentPage: 1,
  pageNo: 1,
  pageSize: 10,
  total: 10,
});
// select下拉以及枚举
const options = ref({
  contractTypeEnums: [{ value: "", label: "" }],
  belongsToTheProject: [{ value: "", label: "" }],
});
// 合同信息表格
const tableData = ref([]);

// 每页数量
const handleSizeChange = (val: number) => {
  console.log(`每页 ${val} 条`);
};
// 下一页
const handleCurrentChange = (val: number) => {
  query.value.pageNo = val;
  queryList();
};
// 合同变更
const handleContractChange = (e: { [propsName: string]: any }) => {
  contractId.value = e.id;
  contractFormData.value = JSON.parse(JSON.stringify(e));
  addContractVisible.value = true;
};
// 合同删除
const handleContractDelete = (e: object) => {
  ElMessageBox.confirm("是否要删除此合同?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      contractDel(e.id).then(({ msg }) => {
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
const handleAddCustomerVisit = () => {
  addContractVisible.value = true;
  contractId.value = "";
};

// 重置
const reset = () => {
  addContractVisible.value = false;
  contractId.value = "";
  changeContractVisible.value = false;
  Object.assign(query.value, {
    supplierNeme: "",
    name: "",
    type: "",
    projectName: "",
  });
  queryList();
};
// 查询列表
const queryList = () => {
  getContractPage({
    pageSize: query.value.pageSize,
    pageNo: query.value.pageNo,
    supplierNeme: query.value.supplierNeme,
    name: query.value.name,
    type: query.value.type,
    projectId: query.value.projectName,
  }).then(({ data }) => {
    tableData.value = data.records;
    query.value.total = data.total;
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
  queryList();
});
</script>

<style lang="scss" scoped>
@import "./css/index.scss";
</style>
