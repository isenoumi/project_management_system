<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="carefulName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="付款审批" name="付款审批">
          <!-- 审批类型选择 -->
          <el-tabs v-model="carefulType" type="border-card" class="demo-tabs">
            <!-- 合同付款申请 -->
            <el-tab-pane
              v-if="carefulType === '合同付款申请'"
              label="合同付款申请"
              name="合同付款申请"
            >
              <contractapplication></contractapplication>
            </el-tab-pane>
            <!-- 非合同付款申请 -->
            <el-tab-pane
              v-if="carefulType === '非合同付款申请'"
              label="非合同付款申请"
              name="非合同付款申请"
            >
              <noncontractual :getidList="getidList"></noncontractual>
            </el-tab-pane>
            <!-- 费用报销 -->
            <el-tab-pane
              v-if="carefulType === '费用报销'"
              label="费用报销"
              name="费用报销"
            >
              <expensereimbursement></expensereimbursement>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <!-- 审批记录 -->
        <!-- <el-tab-pane label="审批记录" name="审批记录">
                    <approvalrecord @detailsMsk="detailsMsk" ></approvalrecord>
                </el-tab-pane> -->
      </el-tabs>
    </el-card>
    <!-- 费用明细弹框 -->
    <costmsk v-model="tableData.show"></costmsk>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import Bus from "./js/Bus";
import { getlistExamineRecord, getgetId } from "@/api/budget";
import contractapplication from "./components/contractapplication.vue";
import noncontractual from "./components/noncontractual.vue";
import expensereimbursement from "./components/expensereimbursement.vue";
import approvalrecord from "./components/approvalrecord.vue";
import costmsk from "./components/costMsk.vue";
import { useRoute } from "vue-router";
import type { TabsPaneContext } from "element-plus";
//路由
const route = useRoute();
//头部选项卡默认选中
const carefulName = ref<any>("付款审批");
//审批类型选择
const carefulType = ref("合同付款申请");
//查询对象
const getidList = ref<any>({});
//审批记录弹框显示
const tableData = reactive({
  show: false,
});
//分页条数
const queryParams = reactive<any>({
  id: "",
  total: 0,
  pageNo: 1,
  pageSize: 10,
  list: [],
});
//选项卡切换
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(carefulName, "xx");
  if (carefulName._value != "审批记录") {
    console.log("111");
    let data = {
      currentPage: queryParams.pageNo,
      pageSize: queryParams.pageSize,
      budgetId: queryParams.id,
    };
    getlistExamineRecord(data).then((res: any) => {
      res.data.records.map((v: any) => {
        if (v.examineStatus == "0") {
          v.examineStatus = "待审批";
        } else if (v.examineStatus == "1") {
          v.examineStatus = "审批通过";
        } else if (v.examineStatus == "2") {
          v.examineStatus = "未通过";
        }
        if (v.excamineType == "CONTRACT_PAYMENT_APPLICATION") {
          v.excamineType = "合同付款申请";
        } else if (v.excamineType == "NON_CONTRACTUAL_PAYMENT_APPLICATIONS") {
          v.excamineType = "非合同付款申请";
        } else if (v.excamineType == "EXPENSE_REIMBURSEMENT") {
          v.excamineType = "费用报销";
        }
      });
      Bus.emit("changeNav", res.data.records);
      Bus.emit("totals", res.data.total);
      queryParams.list = res.data.records;
      queryParams.total = res.data.total;
    });
  }
  //   console.log(tab, event,carefulName,'切换')
};
//审批记录详情弹框
const detailsMsk = () => {
  tableData.show = true;
};
//初始化
onMounted(() => {
  queryParams.id = route.query.id;
  console.log(queryParams.id, "queryParams.id");
  getgetId(queryParams.id).then((res: any) => {
    if (res.code === 200) {
      carefulType.value = res.data.excamineType;
      getidList.value = res.data;
      console.log(getidList.value, "查询id");
    }
  });
});
</script>
<style lang="scss" scoped>
@import "./css/examineandapprove.scss";
</style>
