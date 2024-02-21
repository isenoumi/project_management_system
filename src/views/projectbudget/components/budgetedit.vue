<template>
  <el-dialog title="查看333" width="60%" :close-on-click-modal="false" center>
    <div class="title1" style="margin-bottom: 15px">
      预算科目类别：{{ newName }}
    </div>
    <el-table
      ref="machineTable"
      :data="newList"
      row-key="id"
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
        fixed
        label="序号"
        :index="indexMethod"
        width="60"
      />
      <el-table-column prop="code" fixed label="科目编号" />
      <el-table-column prop="name" fixed label="预算科目类别" />
      <el-table-column prop="costAmount" fixed label="预算费用合计" />
      <el-table-column label="操作" fixed="right" width="140">
        <template #default="scope">
          <el-button type="primary" @click="budgetOperate(scope.row)" link
            >操作</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="btns centerDialogVisibles-btn">
      <el-button type="info" @click="detailsClose">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import Bus from "../js/Bus";
//主页面调用的方法
const emit = defineEmits([
  "closes",
  "operate",
  "setid",
  "edit",
  "editclose",
  "getedits",
  "addbudget",
  "addys",
]);
interface Props {
  newList?: any;
  newName: String;
}
defineProps<Props>();
//关闭弹框
const detailsClose = () => {
  emit("closes");
  Bus.emit("detailemit", "1");
};

//列表编号
const indexMethod = (index: number) => {
  return index * 1 + 1;
};

//操作
const budgetOperate = (row: any) => {
  console.log(row, "骚操作");
  emit("operate");
  Bus.emit("newprojectId", row.id);
};

onMounted(() => {});
</script>
<style scoped lang="scss">
@import "../css/index.scss";
</style>
