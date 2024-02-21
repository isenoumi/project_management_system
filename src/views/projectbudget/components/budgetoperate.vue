<template>
  <el-dialog title="操作" width="70%" :close-on-click-modal="false" center>
    <div class="title1">一级科目：</div>
    <div class="title1 title2">二级科目：</div>
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
    <!-- 提交表单 -->
    <div style="display: flex; align-items: center">
      <el-form ref="mainBodyFormRef" :model="mainBodyForm" :rules="rules">
        <div style="display: flex; align-items: center">
          <el-form-item label="金额: " prop="money">
            <el-input
              v-model="mainBodyForm.money"
              placeholder="请输入设备名称"
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item
            style="margin-left: 20px; margin-right: 25px"
            label="发生月份: "
            prop="month"
          >
            <el-select
              v-model="mainBodyForm.month"
              style="width: 180px"
              placeholder="请选择设备负责人"
            >
              <el-option
                v-for="(item, index) in mainBodyForm.deviceheaderList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" style="margin-top: 20px">
            <el-input v-model="mainBodyForm.remarks" type="textarea" />
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="title1" style="margin: 15px 0">操作记录:</div>
    <el-table
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '40px' }"
      :data="props.recordList"
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
        width="60"
        :index="(e) => e + 1 + (queryParams.pageNo - 1) * queryParams.pageSize"
      />
      <el-table-column prop="createByUsername" label="金额" />
      <el-table-column prop="createTime" label="发生月份" />
      <el-table-column prop="payAmount" label="操作时间" />
      <el-table-column prop="getMonth" label="操作人" />
      <el-table-column prop="applicationNotes" label="备注" />
    </el-table>
    <div class="yeshu">
      <pagination
        v-if="queryParams.total > 0"
        v-model:total="queryParams.total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
      />
    </div>
    <div style="width: 170px; margin: 0 auto; margin-top: 30px">
      <el-button type="primary" @click="addMainBody">保存</el-button>
      <el-button type="info" @click="$emit('closesOperate')">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { getaccountAmountModification } from "@/api/budget";
//调父组件方法
const emit = defineEmits(["closesOperate"]);
//接受传递过来的值
const props = defineProps({
  tableDatas: <any>{
    type: Array,
    default: [],
  },
  xmId: <any>{
    type: String,
    default: "",
  },
  recordList: <any>{
    type: Array,
    default: [],
  },
});

// 主体form ref
const mainBodyFormRef = ref<any>(null);
// form规则
const rules = reactive({
  money: [{ required: true, message: "请输入金额" }],
  month: [{ required: true, message: "请选择月份" }],
});
//分页页数
const queryParams = ref({
  total: 10,
  pageNo: 1,
  pageSize: 10,
});
// 主体form
const mainBodyForm = ref<any>({
  month: "",
  money: "",
  remarks: "",
  deviceheaderList: [
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
      label: "11月",
      value: 11,
    },
    {
      label: "12月",
      value: 12,
    },
  ],
});
//提交表单
const addMainBody = async () => {
  if (!mainBodyForm.value) {
    return;
  }
  try {
    await mainBodyFormRef.value.validate();
    //新增参数
    let data = {
      id: props.xmId,
      money: mainBodyForm.value.money,
      month: mainBodyForm.value.month,
      remarks: mainBodyForm.value.remarks,
    };
    getaccountAmountModification(data).then((res: any) => {
      if (res.code === 200) {
        mainBodyForm.value.money = "";
        mainBodyForm.value.month = "";
        mainBodyForm.value.remarks = "";
        ElMessage.success("新增成功");
        emit("closesOperate");
      }
    });
  } catch (err) {}
};
//序号
const indexMethod: any = (index: number) => {
  return index * 1 + 1;
};
onMounted(() => {});
</script>
<style scoped lang="scss">
@import "../css/index.scss";

.yeshu {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
