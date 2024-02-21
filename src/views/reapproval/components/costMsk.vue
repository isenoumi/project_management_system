<template>
  <el-dialog title="费用明细" width="40%" align-center>
    <el-table
      :data="tableData.expenseDetailsList"
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '50px' }"
      :border="true"
      style="width: 100%"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{
        'text-align': 'center',
      }"
    >
      <el-table-column prop="reimbursementContent" label="付款内容" />
      <el-table-column prop="reimbursementDate" label="付款日期" />
      <el-table-column prop="reimbursementAmount" label="付款金额" />
    </el-table>
    <div style="margin-left: 250px; margin-top: 20px">
      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="expensedetail"
      />
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
//分页数据
const tableData = reactive({
  expenseDetailsList: [],
});
//分页条数
const total = ref(0);
//页数和条数
const queryParams = reactive<any>({
  total: "",
  pageNo: 1,
  pageSize: 10,
});
//分页点击
const expensedetail = () => {};
//初始化
onMounted(() => {});
</script>
<style lang="scss" scoped>
@import "../css/examineandapprove.scss";
</style>
