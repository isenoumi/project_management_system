<template>
  <el-dialog
    title="编辑三级预算"
    width="85%"
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
        style="width: 100%"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{
          'text-align': 'center',
        }"
      >
        <el-table-column prop="name" label="预算科目名称" />
        <el-table-column prop="budgetAmount" label="预算金额" />
        <el-table-column prop="contractAmount" label="合同金额" />
        <el-table-column prop="payAmount" label="已付款金额" />
        <el-table-column prop="ableAmount" label="剩余可用金额" />
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
    </div>
    <div class="addname">
      <div class="inputs">
        <div class="title">本次调剂金额:</div>
        <el-input
          type="number"
          disabled
          @input="metalsChange"
          v-model="metals"
          placeholder="请输入本次调剂金额"
        />
      </div>
      <div class="inputs">
        <div class="title" style="width: 92px">调剂月份:</div>
        <el-select
          v-model="monthNumber"
          class="m-2"
          clearable
          filterable
          @change="citySelectChange"
          placeholder="请选择调剂月份"
        >
          <el-option
            v-for="(items, index) in monthNumberList"
            :key="index"
            :label="items.label"
            :value="items.value"
          />
        </el-select>
      </div>
    </div>
    <div
      style="margin-left: 18px"
      v-for="(item, index) in formReport.list"
      :key="index"
    >
      <div style="display: flex; align-items: center">
        <div style="display: flex; align-items: center">
          <div class="inputs">
            <div class="title">调剂金额:</div>
            <el-input
              type="number"
              @input="moneyChange"
              v-model="item.transfermoney"
              placeholder="请输入调剂金额"
            />
          </div>
        </div>
        <div class="inputs">
          <div class="title" style="width: 92px">调剂到科目:</div>
          <el-select
            v-model="item.transfercode"
            class="m-2"
            clearable
            filterable
            @change="citySelectChange"
            placeholder="请选择调剂科目"
          >
            <el-option
              v-for="(items, index) in item.januaryCost1"
              :key="index"
              :label="items.label"
              @click.native="citychange(item.value)"
              :value="items.value"
            />
          </el-select>
        </div>
        <div class="inputs">
          <div class="title" style="width: 92px">调剂到月份:</div>
          <el-select
            v-model="item.toMonthNumber"
            class="m-2"
            clearable
            filterable
            @change="citySelectChange"
            placeholder="请选择调剂月份"
          >
            <el-option
              v-for="(items, index) in item.monthNumberList"
              :key="index"
              :label="items.label"
              :value="items.value"
            />
          </el-select>
        </div>
        <div style="margin-top: 20px">
          <el-button
            v-if="index + 1 == formReport.list.length"
            type="primary"
            @click="reportItem()"
          >
            添加
          </el-button>
          <el-button
            v-if="index !== 0"
            type="danger"
            @click="deletereport(item, index)"
          >
            删除
          </el-button>
        </div>
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
import { getupdateSubjectPrice } from "@/api/budget";
import Bus from "../js/Bus";
//父组件调用方法
const emit = defineEmits(["editclose"]);
//表格数据
const totalData = ref<any>({});
//获取三级id
const rowid = ref("");
//获取三级预算id
const edIds = ref("");
//下拉框搜索字段
const cityname = ref("");
//调剂月份
const monthNumber = ref(null);
//调剂月份下拉数据
const monthNumberList = ref<any>([
  {
    label: "1月",
    value: 1,
  },
  {
    label: "2月",
    value: 2,
  },
  {
    label: "3月",
    value: 3,
  },
  {
    label: "4月",
    value: 4,
  },
  {
    label: "5月",
    value: 5,
  },
  {
    label: "6月",
    value: 6,
  },
  {
    label: "7月",
    value: 7,
  },
  {
    label: "8月",
    value: 8,
  },
  {
    label: "9月",
    value: 9,
  },
  {
    label: "10月",
    value: 10,
  },
  {
    label: "11月",
    value: 11,
  },
  {
    label: "12月",
    value: 12,
  },
]);
//费用报销
const formReport = ref<any>({
  list: [
    {
      monthNumberList: [
        {
          label: "1月",
          value: 1,
        },
        {
          label: "2月",
          value: 2,
        },
        {
          label: "3月",
          value: 3,
        },
        {
          label: "4月",
          value: 4,
        },
        {
          label: "5月",
          value: 5,
        },
        {
          label: "6月",
          value: 6,
        },
        {
          label: "7月",
          value: 7,
        },
        {
          label: "8月",
          value: 8,
        },
        {
          label: "9月",
          value: 9,
        },
        {
          label: "10月",
          value: 10,
        },
        {
          label: "11月",
          value: 11,
        },
        {
          label: "12月",
          value: 12,
        },
      ],
      toMonthNumber: null,
      monthNumber: null,
      transfercode: "",
      januaryCost1: [],
      transfermoney: 0,
    },
  ],
});
//本次调剂金额
const metals = ref<any>("0");
//获取id
Bus.on("rowId", (row: any) => {
  rowid.value = row;
});
//获取二级预算id
Bus.on("edIds", (row: any) => {
  edIds.value = row;
});
//获取下拉列表
Bus.on("peojectList", (row: any) => {
  formReport.value.list[0].januaryCost1 = row;
});
//获取传递过来的id
Bus.on("editList", (row: any) => {
  totalData.value = row;
});
// 出发城市选择
const citychange = (val: any) => {
  let selectDay = formReport.value.list[0].januaryCost1.find(
    (item: any) => item.label === val
  );
  if (selectDay !== undefined) {
    cityname.value = selectDay.cityName;
  }
};
// 城市选择-输入值改变
const citySelectChange = (e: any) => {
  cityname.value = "";
};
//金额输入相加
const moneyChange = () => {
  let num = 0;
  formReport.value.list.map((v: any) => {
    num += Number(v.transfermoney);
  });
  metals.value = num;
};
//本次调剂金额输入
const metalsChange = (e: any) => {};
//新增费用报销
const reportItem = () => {
  formReport.value.list.push({
    toMonthNumber: null,
    transfercode: "",
    januaryCost1: formReport.value.list[0].januaryCost1,
    monthNumberList: formReport.value.list[0].monthNumberList,
    transfermoney: 0,
  });
};
//删除费用报销
const deletereport = (item: any, index: any) => {
  formReport.value.list.splice(index, 1);
  let num = 0;
  formReport.value.list.map((v: any) => {
    num += Number(v.transfermoney);
  });
  metals.value = num;
};

//保存数据
const save = () => {
  let data: any = {
    id: rowid.value,
    monthNumber: Number(monthNumber.value),
    updateReqs: [],
  };
  formReport.value.list.map((item: any) => {
    let list: any = {
      price: item.transfermoney ? item.transfermoney : "0",
      subjectId: item.transfercode,
      toMonthNumber: Number(item.toMonthNumber),
    };
    data.updateReqs.push(list);
  });
  getupdateSubjectPrice(data).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: "success",
        message: "保存成功",
      });
      formReport.value.list = [
        {
          monthNumberList: [
            {
              label: "1月",
              value: 1,
            },
            {
              label: "2月",
              value: 2,
            },
            {
              label: "3月",
              value: 3,
            },
            {
              label: "4月",
              value: 4,
            },
            {
              label: "5月",
              value: 5,
            },
            {
              label: "6月",
              value: 6,
            },
            {
              label: "7月",
              value: 7,
            },
            {
              label: "8月",
              value: 8,
            },
            {
              label: "9月",
              value: 9,
            },
            {
              label: "10月",
              value: 10,
            },
            {
              label: "11月",
              value: 11,
            },
            {
              label: "12月",
              value: 12,
            },
          ],
          toMonthNumber: null,
          monthNumber: null,
          transfercode: "",
          januaryCost1: [],
          transfermoney: 0,
        },
      ];
      metals.value = "0";

      emit("editclose");
      Bus.emit("edsId", edIds.value);
    } else {
      metals.value = "0";
    }
  });
};
</script>
<style scoped lang="scss">
@import "../css/index.scss";
@import "../css/addmsk.scss";
</style>
