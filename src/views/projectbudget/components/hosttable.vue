<template>
  <div class="tabla">
    <el-table
      @row-click="handledetail11"
      ref="machineTable"
      :data="hosttableData"
      :header-row-style="{ height: '60px' }"
      @expand-change="handleRowClick"
      :row-style="{ height: '50px' }"
      :border="true"
      style="width: 100%"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{
        'text-align': 'center',
      }"
    >
      <el-table-column type="expand">
        <template #default="props">
          <el-table
            :data="tabletade.tabletade"
            :border="true"
            :cell-style="{ textAlign: 'center' }"
            :header-cell-style="{
              'text-align': 'center',
            }"
          >
            <el-table-column label="科目编号" prop="code" />
            <el-table-column label="预算科目类别" prop="name" />
            <el-table-column label="预算费用合计" prop="costAmount" />
            <el-table-column label="付款费用合计" prop="payAmount" />
            <el-table-column label="是否超预算" prop="overExpenditure" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  type="primary"
                  v-if="scope.$index == 0"
                  v-hasPerm="['PROJECT_BUDGET_VIEW']"
                  link
                  @click="survey(scope.row)"
                  >查看</el-button
                >
                <el-button type="primary" v-else link @click="survey(scope.row)"
                  >查看</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="60"
        :index="(e) => e + 1 + ($props.pageNo - 1) * $props.pageSize"
      />
      <el-table-column prop="projectId" label="项目编号" width="110" />
      <el-table-column prop="projectName" label="项目名称">
        <template #default="scope">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="scope.row.projectName"
            placement="top-start"
          >
            {{
              scope.row.projectName && scope.row.projectName.length > 8
                ? scope.row.projectName.substring(0, 8) + "..."
                : scope.row.projectName
            }}
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="contractTime" label="合同签订日期" width="100" />
      <el-table-column prop="duration" label="项目工期" width="100">
        <template #default="scope">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="scope.row.duration"
            placement="top-start"
          >
            {{
              scope.row.duration && scope.row.duration.length > 8
                ? scope.row.duration.substring(0, 8) + "..."
                : scope.row.duration
            }}
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="projectBudgetIncome" label="项目收入" />
      <el-table-column prop="projectBudgetPay" label="项目预算支出" />
      <el-table-column prop="projectBudgetGrossprofit" label="项目预毛利">
        <template #default="scope">
          <div>
            {{
              scope.row.projectBudgetGrossprofit
                ? (scope.row.projectBudgetGrossprofit * 100).toFixed(2) + "%"
                : ""
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="paymentFeesAmount" label="付款费用合计" />
      <el-table-column prop="executiveProjectLeader" label="项目执行经理">
        <template #default="scope">
          <div
            v-for="(item, index) in executiveProjectLeaderOptions"
            :key="index"
          >
            <div v-if="item.value == scope.row.executiveProjectLeader">
              {{ item.label }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="projectStatus" label="项目状态" />
      <el-table-column prop="budgetStatus" label="预算状态" />
      <el-table-column prop="projectFirstLevel" label="项目优先级" />
      <el-table-column label="操作" width="310">
        <template #default="scope">
          <div style="display: flex; justify-content: space-around">
            <fileUpload
              v-if="scope.row.budgetStatus == '未导入'"
              :plan-id="scope.row.id"
              :project-id="scope.row.peojectId"
              :label="'导入预算'"
              @get-file-url="getFileUrl"
            ></fileUpload>
            <el-button type="primary" link @click="detailed(scope.row)"
              >详情</el-button
            >
            <el-button
              type="primary"
              v-hasPerm="['PROJECT_BUDGET_PAY_LIMIT']"
              link
              @click="exceed(scope.row)"
              >预算支出上限</el-button
            >
            <el-button
              type="primary"
              v-hasPerm="['PROJECT_BUDGET_PAYMENT_APPROVAL']"
              link
              @click="gopayment(scope.row)"
              >付款审批</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="预算支出上限"
      v-model="expenditure"
      width="35%"
      align-center
    >
      <div class="inputs">
        <div class="title">预算支出上限*</div>
        <el-input
          tupe="number"
          @input="(v: any) => (expenditurelimitation = v.replace(/[^\d.]/g, ''))"
          v-model="expenditurelimitation"
          placeholder="请输入预算支出上限"
        />
      </div>
      <div
        class="btn"
        style="display: flex; align-items: center; margin-top: 50px"
      >
        <el-button
          v-if="btnshow"
          @click="budgetSave"
          type="primary"
          style="margin-right: 15px"
          >保存</el-button
        >
        <el-button
          v-else
          @click="budgetmodify"
          type="primary"
          style="margin-right: 15px"
          >确认修改</el-button
        >
        <el-button type="info" @click="expenditure = false" plain
          >返回</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { getbyparentid, getprojectselect, getisupperLimit } from "@/api/budget";
import { ref, defineExpose, onMounted } from "vue";
import fileUpload from "@/components/Upload/budgetfifle.vue";
import { useRouter } from "vue-router";
import Bus from "../js/Bus";
//调用父组件方法
const emit = defineEmits([
  "opens",
  "operatess",
  "updateNum",
  "project",
  "getProjectPage",
  "openBudgetedit",
]);
//路由跳转
const router = useRouter();
const numPlus = ref("");
//预算状态
const expenditure = ref(false);
//预算支出
const expenditurelimitation = ref("");
//预算id
const budgetId = ref("");
//预算按钮回显状态
const saveshow = ref(false);
//预算保存回显状态
const btnshow = ref(false);
// upload上传文件链接
const fileUrl = ref("");
//获取表格数据
interface Props {
  hosttableData?: any;
  pageNo?: any;
  pageSize?: any;
}
defineProps<Props>();
defineExpose({ numPlus });
//超出预算上限
const exceed = (item: any) => {
  expenditurelimitation.value = "";
  budgetId.value = item.id;
  expenditure.value = true;
  if (item.budgetUpperLimit) {
    expenditurelimitation.value = item.budgetUpperLimit;
    saveshow.value = true;
    btnshow.value = false;
  } else {
    saveshow.value = false;
    btnshow.value = true;
  }
};
//设置预算上限
const budgetSave = () => {
  let data = {
    id: budgetId.value,
    upperLimit: parseFloat(expenditurelimitation.value),
  };
  getisupperLimit(data).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: "success",
        message: res.msg,
      });
      expenditure.value = false;
      emit("getProjectPage");
    }
  });
};
//修改预算上限
const budgetmodify = () => {
  let data = {
    id: budgetId.value,
    upperLimit: parseFloat(expenditurelimitation.value),
  };
  getisupperLimit(data).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: "success",
        message: "修改成功",
      });
      expenditure.value = false;
      emit("getProjectPage");
    }
  });
};

//
//折叠面板绑定ref值
let machineTable = ref();
//用户信息
const executiveProjectLeaderOptions = ref<any>([]);
//表格数据
const tabletade = reactive<any>({
  tabletade: [],
  user: "",
});
//序号
const indexMethod: any = (index: number) => {
  return index * 1 + 1;
};
//导入预算
const getFileUrl = (value: any) => {
  console.log("sada", value);
  ElMessage({
    type: value.code == 500 ? "error" : "success",
    message: value.msg,
  });
  emit("getProjectPage");
  fileUrl.value = value;
};
//查看
const survey = (row: any) => {
  numPlus.value = row.id;
  emit("opens");
  emit("updateNum", row.id);
  Bus.emit("xmName", row.name);
  Bus.emit("addsId", row.id);
};

//详情
const detailed = (row: any) => {
  let projectId = {
    id: row.peojectId,
  };
  getprojectselect(projectId).then((response: any) => {
    var arr = response.data.project.area.splice(",");
    response.data.project.area = arr.join(",");
    emit("project", response.data.project);
  });
  emit("operatess");
};
//付款审批
const gopayment = (row: any) => {
  router.push({
    path: "/examineandapprove/Examineandapprove",
    query: { id: row.id, projectId: row.projectId, peojectId: row.peojectId },
  });
};
//表格折叠事件
const handleRowClick = (row: any, expandedRows: any) => {
  console.log(row, expandedRows);
  let expands = ref<any>([]);
  if (expandedRows.length > 1) {
    expands.value = [];
    if (row) {
      expands.value.push(row);
    }
    nextTick(() => {
      machineTable.value.toggleRowExpansion(expandedRows[0]);
    });
  } else {
    expands.value = [];
  }
  tabletade.tabletade = [];
  const id = row.id;
  if (expandedRows.filter((item) => item.id === row.id)?.length > 0)
    getbyparentid(id)
      .then(({ data }) => {
        let list = data;
        list.map((v: any) => {
          if (v.overExpenditure == "0") {
            v.overExpenditure = "未超过";
          } else if (v.overExpenditure == "1") {
            v.overExpenditure = "超过";
          }
        });
        tabletade.tabletade = data;
      })
      .finally(() => {});
};
//点击表格
const handledetail11 = (row: any, column: any, event: any) => {
  machineTable.value.toggleRowExpansion(row);
};
onMounted(() => {
  //获取项目执行经理
  executiveProjectLeaderOptions.value = JSON.parse(
    localStorage.getItem("executiveProjectLeaderOptions") || ""
  );
  tabletade.user = localStorage.getItem("username");
});
</script>
<style scoped lang="scss">
@import "../css/index.scss";
</style>
import { filter } from "lodash";
