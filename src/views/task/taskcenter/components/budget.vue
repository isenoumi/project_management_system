<template>
  <el-dialog title="详情" width="80%" align-center>
    <div class="app-container">
      <!-- 主表格 -->
      <hosttable
        :hosttableData="budgetSubTableData.tablaList"
        @operatess="header_data.centerDialogVisible = true"
        @getProjectPage="queryBudgetList"
        @project="getdetails"
        @updateNum="getBudgetFatherTableList"
      ></hosttable>
      <div class="yeshu">
        <pagination
          v-if="total > 0"
          v-model:total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="queryBudgetList"
        />
      </div>
      <!-- 项目预算详情弹框 -->
      <budgetdetails
        v-model="header_data.centerDialogVisible"
        :tableData="budgetInfo"
        :detail="budgetSubTableData.detail"
        @close="header_data.centerDialogVisible = false"
      >
      </budgetdetails>
      <!-- 项目预算查看弹框 -->
      <div class="msk">
        <projectview
          v-model="header_data.chakan"
          :budgetSubTableData="budgetSubTableData.mskList"
          @setid="setoperate"
          @addfamilyjson="budgetSubInfo"
          @closes="header_data.chakan = false"
          @operate="header_data.centerDialogVisibless = true"
        ></projectview>
      </div>
      <!-- 项目操作弹框 -->
      <div class="operate-msk">
        <projectoperations
          v-model="header_data.centerDialogVisibless"
          :illustrate="budgetSubTableData.illustrate"
          :details="budgetSubTableData.details"
          :tableDatas="budgetSubTableData.operateList"
          @closess="header_data.centerDialogVisibless = false"
          :objs="obj"
        ></projectoperations>
      </div>
    </div>
    <div class="btns" style="margin-top: 30px">
      <el-button type="info" @click="$emit('closess')"> 关闭 </el-button>
    </div>
  </el-dialog>
</template>
<!-- 图标选择器示例 -->
<script setup lang="ts">
import {
  getProjectBudgetbyparentid,
  getitemname,
  getbudgetExamine,
} from "@/api/budget";
import { ref, reactive, onMounted } from "vue";
import budgetdetails from "@/views/projectbudget/components/budgetdetails.vue";
import projectview from "@/views/projectbudget/components/projectview.vue";
import projectoperations from "@/views/projectbudget/components/projectoperations.vue";
import hosttable from "@/views/projectbudget/components/hosttable.vue";
import { getBudgetNoticeDetailsProject } from "@/api/task/taskcenter/index";
const props = defineProps(["id"]);
// 预算二级子表
const budgetSubTableData = reactive({
  tablaList: [],
  mskList: [],
  operateList: [],
  illustrate: {},
  details: [],
  detail: {},
});
// table总数
const total = ref(1);
// 分页信息
const queryParams = reactive<any>({
  pageNo: 1,
  pageSize: 10,
});
// 条件搜索
const header_data = reactive({
  projectName: "",
  projectId: "",
  executiveProjectLeader: "",
  projectFirstLevel: "",
  budgetStatus: "",
  projectStatus: "",
  name: "",
  number: "",
  date: "",
  value: "",
  centerDialogVisible: false,
  centerDialogVisibles: false,
  centerDialogVisibless: false,
  chakan: false,
});

// 预算详情数据
const budgetInfo = ref([]);

// 请求一级预算表格
const getBudgetFatherTableList = (value: string) => {
  let data = {
    id: value,
    lavel: 1,
  };
  getProjectBudgetbyparentid(data).then((response: any) => {
    console.log(response.data, "表格");
    response.data.map((v) => {
      console.log(v.overExpenditure, "超支");
      if (v.overExpenditure == "0") {
        v.overExpenditure = "未超过";
      } else if (v.overExpenditure == "1") {
        v.overExpenditure = "超过";
      }
    });
    budgetSubTableData.mskList = response.data;
    header_data.chakan = true;
  });
};

// 查看预算详情
const getdetails = (value: string) => {
  budgetSubTableData.detail = value;
};

// 审批记录表格
const setoperate = (value: any) => {
  budgetSubTableData.operateList = [];
  if (value.overExpenditure == "0") {
    value.overExpenditure = "未超过";
  } else if (value.overExpenditure == "1") {
    value.overExpenditure = "超过";
  }
  budgetSubTableData.operateList.push(value);
  let parentId = value.parentId;
  getitemname(parentId).then((response: any) => {
    budgetSubTableData.illustrate = response.data;
    // console.log(response,'parentId表格')
  });
  let data = {
    budgetSubjectId: value.id,
    pageNo: 1,
    pageSize: 100,
  };
  getbudgetExamine(data).then((response: any) => {
    console.log(response.data.records, "操作的详情表格");
    response.data.records.map((v: any) => {
      if (v.examineStatus === 0) {
        v.examineStatus = "待审批";
      } else if (v.examineStatus === 1) {
        v.examineStatus = "审批通过";
      } else {
        v.examineStatus = "未通过";
      }
    });
    budgetSubTableData.details = response.data.records;
  });
};
// 预算表格渲染
const queryBudgetList = () => {
  if (props.id) {
    getBudgetNoticeDetailsProject({
      id: props.id,
    }).then(({ data }) => {
      console.log(data, "数据");
      let v = data;
      if (v.projectStatus === "INPROGRESS") {
        v.projectStatus = "进行中";
      } else if (v.projectStatus === "NOTSTARTED") {
        v.projectStatus = "未开始";
      } else if (v.projectStatus === "FINISHED") {
        v.projectStatus = "已完结";
      } else if (v.projectStatus === "NOFINISHED") {
        v.projectStatus = "已完结(未中标)";
      }
      if (v.budgetStatus === 10) {
        v.budgetStatus = "已导入";
      } else {
        v.budgetStatus = "未导入";
      }
      if (v.projectFirstLevel === "ONE") {
        v.projectFirstLevel = "A";
      } else if (v.projectFirstLevel === "tWO") {
        v.projectFirstLevel = "B";
      } else if (v.projectFirstLevel == "THREE") {
        v.projectFirstLevel = "C";
      } else if (v.projectFirstLevel == "Four") {
        v.projectFirstLevel = "D";
      }
      budgetSubTableData.tablaList = [v];
    });
  }
};

// 预算子表信息渲染
const budgetSubInfo = () => {
  budgetSubTableData[0].family = [...budgetSubTableData[0].family];
};
// 初始化用户列表数据
onMounted(() => {
  queryBudgetList();
});
</script>
<style lang="scss" scoped>
@import "../css/budget.scss";
</style>
