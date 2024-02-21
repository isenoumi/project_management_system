<template>
  <el-dialog title="操作" width="70%" :close-on-click-modal="false" center>
    <div class="title1">一级科目：{{ illustrate.fname }}</div>
    <div class="title1 title2">二级科目：{{ illustrate.sname }}</div>
    <div class="title1">三级科目</div>
    <el-table
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '40px' }"
      :data="tableDatas"
      style="width: 100%"
      :border="true"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{
        'text-align': 'center',
      }"
    >
      <el-table-column prop="code" label="科目编号" width="100" />
      <el-table-column prop="name" label="预算科目类别" width="120" />
      <el-table-column prop="costAmount" label="预算费用合计" width="120" />
      <el-table-column prop="payAmount" label="付款费用合计" width="120" />
      <el-table-column prop="overExpenditure" label="是否超预算" width="120" />
      <el-table-column prop="januaryCost" label="1月" />
      <el-table-column prop="februaryCost" label="2月" />
      <el-table-column prop="marchCost" label="3月" />
      <el-table-column prop="aprilCost" label="4月" />
      <el-table-column prop="mayCost" label="5月" />
      <el-table-column prop="juneCost" label="6月" />
      <el-table-column prop="julyCost" label="7月" />
      <el-table-column prop="augustCost" label="8月" />
      <el-table-column prop="septemberCost" label="9月" />
      <el-table-column prop="octoberCost" label="10月" />
      <el-table-column prop="novemberCost" label="11月" />
      <el-table-column prop="decemberCost" label="12月" />
    </el-table>
    <div class="title1" style="margin: 15px 0">详情:</div>
    <el-table
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '40px' }"
      :data="details"
      style="width: 100%"
      :border="true"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{
        'text-align': 'center',
      }"
    >
      <el-table-column
        type="index"
        label="序号"
        :index="indexMethod"
        width="60"
      />
      <el-table-column prop="createByUsername" label="上传人" width="90" />
      <el-table-column prop="createTime" label="申请时间" width="120" />
      <el-table-column prop="payAmount" label="付款金额" />
      <el-table-column prop="getMonth" label="所属月份" width="120" />
      <el-table-column prop="getMonth" label="所属月份" width="120" />
      <el-table-column
        prop="applicationNotes"
        label="申请备注信息"
        width="120"
      />
      <el-table-column prop="examineTime" label="审批时间" />
      <el-table-column prop="examineBudget" label="审批预算" />
      <el-table-column prop="examineRemake" label="审批备注" />
      <el-table-column prop="examineStatus" label="审核状态" />
      <el-table-column prop="applicationNotes" label="备注" />
    </el-table>
    <div class="btns" style="margin-top: 30px">
      <el-button type="info" @click="$emit('closess')">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
//传递过来的值
interface Props {
  tableDatas?: any;
  illustrate: any;
  details?: any;
}
defineProps<Props>();
//序号
const indexMethod: any = (index: number) => {
  return index * 1 + 1;
};
</script>
<style scoped lang="scss">
@import "../css/index.scss";
</style>
