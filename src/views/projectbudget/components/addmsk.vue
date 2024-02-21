<template>
  <el-dialog
    title="新增三级预算"
    width="60%"
    :close-on-click-modal="false"
    align-center
  >
    <div class="expenditure">
      <div class="xmexpenditure">
        项目预算支出:{{ totalData.projectBudgetPay }}
      </div>
      <div>已付款金额:{{ totalData.projectPayAmount }}</div>
    </div>
    <div class="tables">
      <el-table
        :data="totalData.subjectRespList"
        :header-row-style="{ height: '60px' }"
        :row-style="{ height: '50px' }"
        :border="true"
        style="width: 60%"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{
          'text-align': 'center',
        }"
      >
        <el-table-column prop="name" label="预算科目名称" />
        <el-table-column prop="budgetAmount" label="预算金额" />
        <el-table-column prop="contractAmount" label="合同金额" />
        <el-table-column prop="payAmount" label="已付款金额" />
      </el-table>
    </div>
    <div class="addname">
      <div class="inputs">
        <div class="title">新增三级预算科目名称:</div>
        <el-input v-model="addform.name" placeholder="请输入科目编号" />
      </div>
      <div style="width: 25px"></div>
      <div class="inputs">
        <div class="title">新增三级科目预算费用合计:</div>
        <el-input
          disabled
          v-model="addform.payAmount"
          placeholder="请输入科目编号"
        />
      </div>
    </div>
    <div
      style="display: flex; align-items: center; justify-content: space-around"
    >
      <div class="inputs">
        <div class="title">1月:</div>
        <el-input
          type="number"
          @input="month"
          v-model="addform.januaryCost"
          placeholder="请输入月份金额"
        />
      </div>
      <div class="inputs">
        <div class="title">2月:</div>
        <el-input
          type="number"
          @input="month"
          v-model="addform.februaryCost"
          placeholder="请输入月份金额"
        />
      </div>
      <div class="inputs">
        <div class="title">3月:</div>
        <el-input
          type="number"
          @input="month"
          v-model="addform.marchCost"
          placeholder="请输入月份金额"
        />
      </div>
    </div>
    <div
      style="display: flex; align-items: center; justify-content: space-around"
    >
      <div class="inputs">
        <div class="title">4月:</div>
        <el-input
          type="number"
          @input="month"
          v-model="addform.aprilCost"
          placeholder="请输入月份金额"
        />
      </div>
      <div class="inputs">
        <div class="title">5月:</div>
        <el-input
          type="number"
          @input="month"
          v-model="addform.mayCost"
          placeholder="请输入月份金额"
        />
      </div>
      <div class="inputs">
        <div class="title">6月:</div>
        <el-input
          type="number"
          @input="month"
          v-model="addform.juneCost"
          placeholder="请输入月份金额"
        />
      </div>
    </div>
    <div
      style="display: flex; align-items: center; justify-content: space-around"
    >
      <div class="inputs">
        <div class="title">7月:</div>
        <el-input
          type="number"
          @input="month"
          v-model="addform.julyCost"
          placeholder="请输入月份金额"
        />
      </div>
      <div class="inputs">
        <div class="title">8月:</div>
        <el-input
          type="number"
          @input="month"
          v-model="addform.augustCost"
          placeholder="请输入月份金额"
        />
      </div>
      <div class="inputs">
        <div class="title">9月:</div>
        <el-input
          type="number"
          @input="month"
          v-model="addform.septemberCost"
          placeholder="请输入月份金额"
        />
      </div>
    </div>
    <div
      style="display: flex; align-items: center; justify-content: space-around"
    >
      <div class="inputs">
        <div class="title">10月:</div>
        <el-input
          type="number"
          @input="month"
          v-model="addform.octoberCost"
          placeholder="请输入月份金额"
        />
      </div>
      <div class="inputs">
        <div class="title">11月:</div>
        <el-input
          type="number"
          @input="month"
          v-model="addform.novemberCost"
          placeholder="请输入月份金额"
        />
      </div>
      <div class="inputs">
        <div class="title">12月:</div>
        <el-input
          type="number"
          @input="month"
          v-model="addform.decemberCost"
          placeholder="请输入月份金额"
        />
      </div>
    </div>
    <div style="display: flex; align-items: center; margin-left: 18px"></div>
    <div class="btns centerDialogVisibles-btn">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="info" @click="$emit('addclose')">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { getbudgetSubjects } from "@/api/budget";
import Bus from "../js/Bus";
const emit = defineEmits(["editclose", "addclose", "id"]);
const addsId = ref("");
//输入框数据
const addform = reactive({
  code: "",
  name: "",
  costAmount: "0",
  payAmount: 0,
  januaryCost: "0",
  februaryCost: "0",
  marchCost: "0",
  aprilCost: "0",
  mayCost: "0",
  juneCost: "0",
  julyCost: "0",
  augustCost: "0",
  septemberCost: "0",
  octoberCost: "0",
  novemberCost: "0",
  decemberCost: "0",
});
//表格数据
const totalData = ref<any>({});
//传递过来的数据
const props = defineProps({
  addlist: {
    type: Object,
    default: {},
  },
});
//计算月份金额总和
const month = () => {
  addform.payAmount =
    Number(addform.januaryCost) +
    Number(addform.februaryCost) +
    Number(addform.marchCost) +
    Number(addform.aprilCost) +
    Number(addform.mayCost) +
    Number(addform.juneCost) +
    Number(addform.julyCost) +
    Number(addform.augustCost) +
    Number(addform.septemberCost) +
    Number(addform.octoberCost) +
    Number(addform.novemberCost) +
    Number(addform.decemberCost);
};
//获取表格数据
Bus.on("tabsList", (row: any) => {
  totalData.value = row;
});
Bus.on("addsId", (row: any) => {
  if (row) {
    addsId.value = row;
  }
});

//保存数据
const save = () => {
  if (!addform.name) {
    return ElMessage({
      type: "info",
      message: "请输入预算科目类别",
    });
  }
  //保存需要的参数
  let data = {
    parentId: props.addlist.id,
    name: addform.name,
    januaryCost: addform.januaryCost ? addform.januaryCost : "0",
    februaryCost: addform.februaryCost ? addform.februaryCost : "0",
    marchCost: addform.marchCost ? addform.marchCost : "0",
    aprilCost: addform.aprilCost ? addform.aprilCost : "0",
    mayCost: addform.mayCost ? addform.mayCost : "0",
    juneCost: addform.juneCost ? addform.juneCost : "0",
    julyCost: addform.julyCost ? addform.julyCost : "0",
    augustCost: addform.augustCost ? addform.augustCost : "0",
    septemberCost: addform.septemberCost ? addform.septemberCost : "0",
    octoberCost: addform.octoberCost ? addform.octoberCost : "0",
    novemberCost: addform.novemberCost ? addform.novemberCost : "0",
    decemberCost: addform.decemberCost ? addform.decemberCost : "0",
  };
  //新增
  getbudgetSubjects(data).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: "success",
        message: "新增成功",
      });
      addform.code = "";
      addform.name = "";
      addform.costAmount = "";
      addform.payAmount = 0;
      addform.januaryCost = "0";
      addform.februaryCost = "0";
      addform.marchCost = "0";
      addform.aprilCost = "0";
      addform.mayCost = "0";
      addform.juneCost = "0";
      addform.julyCost = "0";
      addform.augustCost = "0";
      addform.septemberCost = "0";
      addform.octoberCost = "0";
      addform.novemberCost = "0";
      addform.decemberCost = "0";
      emit("addclose");
      Bus.emit("changeNav", props.addlist.id);
      Bus.emit("detailemits", addsId.value);
    }
  });
};
//初始化
onMounted(() => {});
</script>
<style scoped lang="scss">
@import "../css/index.scss";
@import "../css/addmsk.scss";
</style>
