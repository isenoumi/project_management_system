<template>
  <div>
    <el-table
      :data="tableData.list"
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '50px' }"
      :border="true"
      style="width: 100%"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{
        'text-align': 'center',
      }"
    >
      <el-table-column
        type="index"
        label="序号"
        width="60"
        :index="(e) => e + 1 + (queryParams.pageNo - 1) * queryParams.pageSize"
      />
      <el-table-column prop="createByUsername" label="上传人" />
      <el-table-column prop="examineType" label="审批类型" />
      <el-table-column prop="subject" label="所属科目" />
      <el-table-column prop="createTime" label="申请时间" />
      <el-table-column prop="payAmount" label="付款金额" />
      <el-table-column prop="getMonth" label="所属月份" />
      <el-table-column prop="applicationNotes" label="付款事由" />
      <el-table-column prop="examineTime" label="审批时间" />
      <!-- TODO 审批预算 -->
      <!-- <el-table-column prop="examineBudget" label="审批预算" /> -->
      <el-table-column prop="examineRemark" label="审批备注" />
      <el-table-column prop="examineStatus" label="审核状态" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            v-if="
              scope.row.examineStatus === '未通过' &&
              scope.row.examineType != '备用金'
            "
            type="primary"
            @click="onceMore(scope.row)"
            link
            >再次提交</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: flex-end; margin-top: 20px">
      <pagination
        v-if="queryParams.total > 0"
        v-model:total="queryParams.total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { getlistExamineRecord } from "@/api/budget";
import { useRoute, useRouter } from "vue-router";
import Bus from "../js/Bus";
const route = useRoute();
const router = useRouter();
const emit = defineEmits(["detailsMsk"]);
//传递数组
Bus.on("changeNav", (row: any) => {
  if (row.length > 0) {
    queryParams.pageNo = 1;
    tableData.list = row;
  }
});
//传递的条数
Bus.on("totals", (row: any) => {
  if (row) {
    queryParams.total = row;
  }
});

const tableData = reactive<any>({
  list: [{ name: "111" }],
  expenseDetailsList: [],
  id: "",
});

//分页条数
const total = ref(0);
//页数和条数
const queryParams = reactive<any>({
  total: 0,
  pageNo: 1,
  pageSize: 10,
});
//序号
const indexMethod = (index: number) => {
  return index * 1 + 1;
};
//分页刷新页面
const handleQuery = () => {
  getList();
};
//获取分页列表
const getList = () => {
  let data = {
    currentPage: queryParams.pageNo,
    pageSize: queryParams.pageSize,
    budgetId: tableData.id,
  };
  getlistExamineRecord(data).then((res: any) => {
    res.data.records.map((v: any) => {
      if (v.examineStatus == "0") {
        v.examineStatus = "待审批";
      } else if (v.examineStatus == "1") {
        v.examineStatus = "审批通过";
      } else if (v.examineStatus == "2") {
        v.examineStatus = "未通过";
      } else if (v.examineStatus === 9) {
        v.examineStatus = "结束付款申请";
      }
      if (v.excamineType == "CONTRACT_PAYMENT_APPLICATION") {
        v.excamineType = "合同付款申请";
      } else if (v.excamineType == "NON_CONTRACTUAL_PAYMENT_APPLICATIONS") {
        v.excamineType = "非合同付款申请";
      } else if (v.excamineType == "EXPENSE_REIMBURSEMENT") {
        v.excamineType = "费用报销";
      }
    });
    tableData.list = res.data.records;
    queryParams.total = res.data.total;
  });
};
const onceMore = (row: any) => {
  console.log(row, "xxx");
  router.push({
    path: "/reapproval/Reapproval",
    query: { id: row.id },
  });
};
//初始化
onMounted(() => {
  if (route.query.id) {
    tableData.id = route.query.id;
  }
  //获取分页列表
  getList();
});
</script>
<style lang="scss" scoped>
@import "../css/examineandapprove.scss";
</style>
