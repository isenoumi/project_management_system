<template>
  <el-dialog
    title="查看"
    width="60%"
    :close-on-click-modal="false"
    align-center
  >
    <div
      style="display: flex; align-items: center; justify-content: space-around"
    >
      <div class="inputs">
        <div class="title">科目编号:</div>
        <el-input disabled v-model="eaitsobjct.code" placeholder="" />
      </div>
      <div class="inputs">
        <div class="title">预算科目类别:</div>
        <el-input v-model="eaitsobjct.name" placeholder="请输入项目名称" />
      </div>
      <div class="inputs">
        <div class="title">预算费用合计:</div>
        <el-input
          type="number"
          v-model="eaitsobjct.costAmount"
          placeholder="请输入预算费用合计"
        />
      </div>
    </div>
    <div
      style="display: flex; align-items: center; justify-content: space-around"
    >
      <div class="inputs">
        <div class="title">付款费用合计:</div>
        <el-input
          type="number"
          v-model="eaitsobjct.payAmount"
          placeholder="请输入付款费用合计"
        />
      </div>
      <div class="inputs">
        <div class="title">是否超标:</div>
        <el-input
          disabled
          v-model="eaitsobjct.overExpenditure"
          placeholder=""
        />
      </div>
      <div class="inputs">
        <div class="title">1月:</div>
        <el-input
          type="number"
          v-model="eaitsobjct.januaryCost"
          placeholder="请输入月份金额"
        />
      </div>
    </div>
    <div
      style="display: flex; align-items: center; justify-content: space-around"
    >
      <div class="inputs">
        <div class="title">2月:</div>
        <el-input
          type="number"
          v-model="eaitsobjct.februaryCost"
          placeholder="请输入月份金额"
        />
      </div>
      <div class="inputs">
        <div class="title">3月:</div>
        <el-input
          type="number"
          v-model="eaitsobjct.marchCost"
          placeholder="请输入月份金额"
        />
      </div>
      <div class="inputs">
        <div class="title">4月:</div>
        <el-input
          type="number"
          v-model="eaitsobjct.aprilCost"
          placeholder="请输入月份金额"
        />
      </div>
    </div>
    <div
      style="display: flex; align-items: center; justify-content: space-around"
    >
      <div class="inputs">
        <div class="title">5月:</div>
        <el-input
          type="number"
          v-model="eaitsobjct.mayCost"
          placeholder="请输入月份金额"
        />
      </div>
      <div class="inputs">
        <div class="title">6月:</div>
        <el-input
          type="number"
          v-model="eaitsobjct.juneCost"
          placeholder="请输入月份金额"
        />
      </div>
      <div class="inputs">
        <div class="title">7月:</div>
        <el-input
          type="number"
          v-model="eaitsobjct.julyCost"
          placeholder="请输入月份金额"
        />
      </div>
    </div>
    <div
      style="display: flex; align-items: center; justify-content: space-around"
    >
      <div class="inputs">
        <div class="title">8月:</div>
        <el-input
          type="number"
          v-model="eaitsobjct.augustCost"
          placeholder="请输入月份金额"
        />
      </div>

      <div class="inputs">
        <div class="title">9月:</div>
        <el-input
          type="number"
          v-model="eaitsobjct.septemberCost"
          placeholder="请输入月份金额"
        />
      </div>
      <div class="inputs">
        <div class="title">10月:</div>
        <el-input
          type="number"
          v-model="eaitsobjct.octoberCost"
          placeholder="请输入月份金额"
        />
      </div>
    </div>
    <div style="display: flex; align-items: center; margin-left: 18px">
      <div class="inputs">
        <div class="title">11月:</div>
        <el-input
          type="number"
          v-model="eaitsobjct.novemberCost"
          placeholder="请输入月份金额"
        />
      </div>
      <div class="inputs" style="margin-left: 18px">
        <div class="title">12月:</div>
        <el-input
          type="number"
          v-model="eaitsobjct.decemberCost"
          placeholder="请输入月份金额"
        />
      </div>
    </div>

    <div class="btns centerDialogVisibles-btn">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="info" @click="$emit('editclose')">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { getbudgetSubject } from "@/api/budget";
import Bus from "../js/Bus";
const emit = defineEmits(["editclose"]);
//兄弟组件传递过来的值编辑弹框值
const eaitsobjct = ref<any>({});
//获取兄弟组件传递id
Bus.on("editobjct", (row: any) => {
  eaitsobjct.value = row;
});
//保存
const save = () => {
  if (eaitsobjct.value.overExpenditure == "未超过") {
    eaitsobjct.value.overExpenditure = "0";
  } else {
    eaitsobjct.value.overExpenditure = "1";
  }
  //提交编辑
  getbudgetSubject(eaitsobjct.value).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: "success",
        message: "修改成功",
      });
      emit("editclose");
    }
  });
};
</script>
<style scoped lang="scss">
@import "../css/index.scss";
@import "../css/msk.scss";
</style>
