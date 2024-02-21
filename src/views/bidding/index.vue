<template>
  <div class="app-container">
    <el-card>
      <div class="header">
        <div class="headInput">
          <div class="title">关联项目名称:</div>
          <el-input
            v-model="query.projectName"
            placeholder="请输入关联项目名称"
            class="input"
          ></el-input>
        </div>
        <div class="headInput">
          <div class="title">关联项目编号:</div>
          <el-input
            v-model="query.projectId"
            placeholder="请输入关联项目编号"
            class="input"
          ></el-input>
        </div>
        <div class="headSelect">
          <div class="title">招标状态:</div>
          <el-select
            v-model="query.biddingStatus"
            placeholder="请选择招标状态"
            clearable
          >
            <el-option
              v-for="item in options.biddingStatusOptions"
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
        </div>
      </div>

      <div class="main">
        <el-table :data="biddingTableData" border style="width: 100%">
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
            width="110"
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
                  scope.row.projectName && scope.row.projectName.length > 12
                    ? scope.row.projectName.substring(0, 12) + "..."
                    : scope.row.projectName
                }}
              </el-tooltip>
            </template>
          </el-table-column>
          <!-- <el-table-column
            align="center"
            label="项目类型"
            width="100"
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
          </el-table-column> -->
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
          <el-table-column
            align="center"
            label="所属区域"
            prop="area"
            width="140"
          >
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
          <!-- <el-table-column
            align="center"
            label="客户联系人"
            prop="customerContacts"
            width="120"
          /> -->

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
          <el-table-column
            align="center"
            label="合同金额（万）"
            prop="contractAmount"
            width="125"
          />
          <el-table-column
            align="center"
            label="合同签订时间"
            prop="contractTime"
            width="100"
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
                :content="scope.row.duration"
                placement="top-start"
              >
                {{
                  scope.row.duration && scope.row.duration.length > 10
                    ? scope.row.duration.substring(0, 10) + "..."
                    : scope.row.duration
                }}
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="项目执行经理"
            prop="executiveProjectLeader"
            width="130"
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
          <el-table-column align="center" label="招标状态" prop="biddingStatus">
            <template #default="scope">
              <div
                v-for="(item, index) in options.biddingStatusOptions"
                :key="index"
              >
                <div v-if="item.value == scope.row.biddingStatus">
                  {{ item.label }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template #default="scope">
              <el-button
                v-if="scope.row.biddingStatus == 'WINNINGBIDDER'"
                v-hasPerm="['BIDDING_EDIT']"
                text
                type="primary"
                @click="handleEditBidding(scope.row)"
                >编辑
              </el-button>

              <el-button
                v-if="scope.row.biddingStatus == 'TOBETENDERED'"
                v-hasPerm="['BIDDING_SET']"
                text
                type="danger"
                @click="handleAddBidding(scope.row)"
                >招投标
              </el-button>
              <el-button text type="primary" @click="handleInfo(scope.row)"
                >详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <!-- <el-pagination
            background
            layout="total, prev, pager, next"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination> -->
          <pagination
            v-if="total > 0"
            v-model:total="total"
            v-model:page="query.pageNo"
            v-model:limit="query.pageSize"
            @pagination="queryList"
          />
        </div>
      </div>
    </el-card>
    <div v-if="show">
      <addProject
        v-model="addVisible"
        :formInfo="formInfo"
        :id="id"
        :is-edit="isEdit"
        @biddingClose="biddingClose"
        @reset="reset"
      ></addProject>
    </div>

    <infoProject
      :id="id"
      v-model="infoVisible"
      :formInfo="formInfo"
      @reset="reset"
    ></infoProject>
  </div>
</template>
<!-- 图标选择器示例 -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import addProject from "./components/addproject.vue";
import infoProject from "./components/infoproject.vue";
import { getBiddingPage } from "@/api/bidding/index";
// 传给子组件的数据
const formInfo = ref({});
const id = ref("");
// 招投标是否编辑
const isEdit = ref(false);
// 招投标弹框
const addVisible = ref(false);
// 编辑弹框
const infoVisible = ref(false);
// 条件查询
const query = ref({
  projectName: "",
  projectId: "",
  biddingStatus: "",
  pageNo: 1,
  pageSize: 10,
});
// 总数
const total = ref(10);
// select下拉以及枚举
const options = ref({
  typeOptions: [{ value: 0, label: "" }],
  statusOptions: [{ value: 0, label: "" }],
  areaOptions: [{ value: 0, label: "" }],
  biddingStatusOptions: [{ value: 0, label: "" }],
  projectSourceFundsOptions: [{ value: "", label: "" }],
  executiveProjectLeaderOptions: [{ value: "", label: "" }],
  salespersonOptions: [{ value: "", label: "" }],
});
// 组件刷新
const show = ref(false);
// 招投表表格数据
const biddingTableData = ref([]);
// 每页数量
const handleSizeChange = (val: number) => {};
// 表格跳页
const handleCurrentChange = (val: number) => {
  query.value.pageNo = val;
  queryList();
};
// 招投标编辑
const handleEditBidding = (e: object) => {
  formInfo.value = e;
  id.value = e.id;
  isEdit.value = false;
  addVisible.value = true;
  nextTick(() => {
    show.value = true;
  });
};
// 招投标
const handleAddBidding = (e: object) => {
  formInfo.value = e;
  id.value = e.id;
  isEdit.value = true;
  addVisible.value = true;
  nextTick(() => {
    show.value = true;
  });
};
// 查看招投标详情
const handleInfo = (e: object) => {
  formInfo.value = e;
  id.value = e.id;
  infoVisible.value = true;
};

// dialog组件触发关闭招投标
const biddingClose = () => {
  console.log(addVisible.value, show.value);
  show.value = false;
  nextTick(() => {
    // show.value = true;
  });
};

// 重置
const reset = () => {
  query.value.projectId = "";
  query.value.projectName = "";
  query.value.biddingStatus = "";
  addVisible.value = false;
  show.value = false;
  infoVisible.value = false;
  queryList();
};
// 条件查询
const queryList = () => {
  getBiddingPage(query.value).then(({ data }) => {
    biddingTableData.value = data.records;
    total.value = data.total;
  });
};

onMounted(() => {
  options.value.typeOptions = JSON.parse(localStorage.getItem("typeOptions"));
  options.value.statusOptions = JSON.parse(
    localStorage.getItem("projectStatusOptions")
  );
  options.value.biddingStatusOptions = JSON.parse(
    localStorage.getItem("biddingStatusOptions")
  );
  options.value.projectSourceFundsOptions = JSON.parse(
    localStorage.getItem("projectSourceFundsOptions")
  );
  options.value.executiveProjectLeaderOptions = JSON.parse(
    localStorage.getItem("executiveProjectLeaderOptions")
  );
  options.value.salespersonOptions = JSON.parse(
    localStorage.getItem("salespersonOptions")
  );
  queryList();
});
</script>

<style lang="scss" scoped>
@import "./css/bidding.scss";
</style>
