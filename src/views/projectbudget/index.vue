<template>
  <div class="app-container">
    <el-card>
      <!-- 头部搜索条件 -->
      <headinput
        :headerdata="header_data"
        @reset="reset"
        @search="search"
      ></headinput>
      <!-- 主表格 -->

      <hosttable
        :hosttableData="aggregateData.tablaList"
        @operatess="openMsk"
        @getProjectPage="tablaList"
        @openBudgetedit="openBudgetedit"
        @project="getdetails"
        @updateNum="getNum"
        :pageNo="queryParams.pageNo"
        :pageSize="queryParams.pageSize"
      ></hosttable>

      <div class="yeshu">
        <!-- 分页 -->
        <pagination
          v-if="total > 0"
          v-model:total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="tablaList"
        />
      </div>
      <!-- 项目预算详情弹框 -->
      <budgetdetails
        v-model="header_data.projectDetails"
        :detail="aggregateData.budgetdetail"
        @close="close"
      >
      </budgetdetails>
      <!-- 项目预算查看弹框 -->
      <div class="msk">
        <projectview
          @getedits="obtainDetails"
          @addys="addBudgetItem"
          @addbudget="addbudget"
          @edit="openEditMsk"
          @opeConstruction="opeConstruction"
          v-model="header_data.check"
          :projectBudgetList="aggregateData.mskList"
          @setid="setoperate"
          @closes="closeCheck"
          @operate="operate"
        ></projectview>
      </div>
      <!-- 预算修改编辑 -->
      <div>
        <!-- <msk v-model="header_data.editaMsk" @editclose="editclose" :eaitsobjct="obtainDetails" @edit="openEditMsk">
        </msk> -->
        <editmsk
          v-model="header_data.editaMsk"
          @editclose="editclose"
          :eaitsobjct="obtainDetails"
          @edit="openEditMsk"
        >
        </editmsk>
      </div>
      <!-- 新增预算编辑 -->
      <div>
        <addmsk
          v-model="header_data.addMsk"
          @addclose="addclose"
          :addlist="aggregateData.addobjct"
        >
        </addmsk>
      </div>
      <!-- 项目操作弹框 -->
      <div class="operate-msk">
        <projectoperations
          v-model="header_data.operateMsk"
          v-if="header_data.operateMsk"
          :illustrate="aggregateData.illustrate"
          :xmId="aggregateData.id"
          :details="aggregateData.operateDetails"
          :recordList="aggregateData.recordList"
          :tableDatas="aggregateData.operateList"
          @closess="closesOperate"
        >
        </projectoperations>
      </div>
      <!-- 旧操作 -->
      <div class="operate-msk">
        <projectconstruction
          v-model="header_data.constructionMsk"
          v-if="header_data.constructionMsk"
          :illustrate="aggregateData.illustrate"
          :details="aggregateData.operateDetails"
          :tableDatas="aggregateData.operateList"
          @closess="closesConstruction"
        >
        </projectconstruction>
      </div>

      <!-- 新项目预算查看 -->
      <budgetedit
        @getedits="obtainDetails"
        v-if="header_data.budgeteditShow"
        @addys="addBudgetItem"
        @addbudget="addbudget"
        @edit="openEditMsk"
        :projectBudgetList="aggregateData.mskList"
        @setid="setoperate"
        @closes="closeCheck"
        @operate="newoperate"
        :newList="aggregateData.newList"
        :newName="aggregateData.name"
        v-model="header_data.budgeteditShow"
      ></budgetedit>
      <!-- 新项目预算操作 -->
      <div class="operate-msk">
        <budgetoperate
          v-model="header_data.budgetoperateMsk"
          :xmId="aggregateData.id"
          v-if="header_data.budgetoperateMsk"
          :recordList="aggregateData.recordList"
          :illustrate="aggregateData.illustrate"
          :details="aggregateData.operateDetails"
          :tableDatas="aggregateData.operateList"
          @closess="closesOperate"
        >
        </budgetoperate>
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import {
  getProjectBudget,
  getProjectBudgetbyparentid,
  getitemname,
  getbudgetExamine,
  getbudgetExaminepage,
  getheOperationRecordIsDisplayed,
} from "@/api/budget";
import { ref, reactive, onMounted } from "vue";
import budgetdetails from "./components/budgetdetails.vue";
import projectview from "./components/projectview.vue";
import projectoperations from "./components/projectoperations.vue";
import headinput from "./components/headinput.vue";
import hosttable from "./components/hosttable.vue";
import editmsk from "./components/editmsk.vue";
import addmsk from "./components/addmsk.vue";
import budgetedit from "./components/budgetedit.vue";
import budgetoperate from "./components/budgetoperate.vue";
import projectconstruction from "./components/projectconstruction.vue";
import Bus from "./js/Bus";
const aggregateData = reactive<any>({
  id: "",
  recordList: [],
  name: "",
  newList: [],
  tablaList: [],
  mskList: [],
  operateList: [],
  illustrate: {},
  operateDetails: [],
  budgetdetail: {},
  tableData: {},
  list: [],
  total: 0,
  eaitsobjct: {},
  addobjct: {},
});
//分页总数
const total = ref(0);
//分页条数和页数
const queryParams = reactive<any>({
  pageNo: 1,
  pageSize: 10,
});
//头部输入框参数
const header_data = reactive({
  projectName: null,
  projectId: null,
  executiveProjectLeader: null,
  projectFirstLevel: null,
  budgetStatus: null,
  projectStatus: null,
  name: "",
  number: "",
  date: "",
  value: "",
  projectDetails: false,
  centerDialogVisibles: false,
  operateMsk: false,
  constructionMsk: false,
  check: false,
  editaMsk: false,
  addMsk: false,
  budgeteditShow: false,
  budgetoperateMsk: false,
});

//编辑传过来的id
const getNum = (value: string) => {
  Bus.emit("edIds", value);
  Bus.emit("twoeditId", value);
  let data = {
    id: value,
    lavel: 1,
  };
  getProjectBudgetbyparentid(data).then((response: any) => {
    response.data.map((v: any) => {
      if (v.overExpenditure == "0") {
        v.overExpenditure = "未超过";
      } else if (v.overExpenditure == "1") {
        v.overExpenditure = "超过";
      }
    });
    aggregateData.mskList = response.data;
    // openBudgetedit()
    header_data.check = true;
  });
};
//点击编辑传过来参数
const obtainDetails = (value: string) => {
  aggregateData.eaitsobjct = value;
};
//传过来的新增预算id
const addBudgetItem = (value: string) => {
  aggregateData.addobjct = value;
};
//新增审批
const getdetails = (value: string) => {
  aggregateData.budgetdetail = value;
  let data = {
    budgetSubjectId: "1688521241197150209",
    pageNo: queryParams.pageNo,
    pageSize: queryParams.pageSize,
  };
  getbudgetExaminepage(data).then((res) => {
    aggregateData.list = res.data.records;
    aggregateData.total = res.data.total;
  });
};

//查看项目预算
const setoperate = (value: any) => {
  aggregateData.operateList = [];
  aggregateData.id = value.id;
  console.log("222", value);
  if (value.overExpenditure == "0") {
    value.overExpenditure = "未超过";
  } else if (value.overExpenditure == "1") {
    value.overExpenditure = "超过";
  }
  aggregateData.operateList.push(value);
  let parentId = value.parentId;
  getitemname(parentId).then((response: any) => {
    aggregateData.illustrate = response.data;
  });
  let data = {
    budgetSubjectId: value.id,
    pageNo: 1,
    pageSize: 100,
  };
  getbudgetExamine(data).then((response: any) => {
    response.data.records.map((v: any) => {
      if (v.examineStatus === 0) {
        v.examineStatus = "待审批";
      } else if (v.examineStatus === 1) {
        v.examineStatus = "审批通过";
      } else {
        v.examineStatus = "未通过";
      }
    });
    aggregateData.operateDetails = response.data.records;
  });
  // 新操作
  let datas = {
    id: value.id,
  };
  getheOperationRecordIsDisplayed(datas).then((response: any) => {
    aggregateData.recordList = response.data;
  });
};
//获取二级预算id
Bus.on("detailemit", (row: any) => {
  if (row) {
    tablaList();
  }
});
Bus.on("closeerbudget", (row: any) => {
  if (row) {
    tablaList();
  }
});
//获取二级预算id
Bus.on("newprojectId", (row: any) => {
  if (row) {
    aggregateData.id = row;
  }
});

//新操作
Bus.on("newOperate", (row: any) => {
  let data = {
    id: row.id,
  };
  getheOperationRecordIsDisplayed(data).then((response: any) => {
    aggregateData.recordList = response.data;
  });
});
//新预算查看
Bus.on("xmde", (rowss: any) => {
  aggregateData.name = rowss.name;
  let data = {
    id: rowss.id,
    lavel: 1,
  };
  getProjectBudgetbyparentid(data).then((response: any) => {
    aggregateData.newList = response.data;
  });
});
//获取二级预算id
Bus.on("detailemits", (row: any) => {
  if (row) {
    tablaList();
  }
});
//关闭项目操作弹框
const closesConstruction = () => {
  header_data.constructionMsk = false;
};
//打开项目操作弹框
const opeConstruction = () => {
  header_data.constructionMsk = true;
};

//获取主表格数据
const tablaList = () => {
  const list = {
    projectName: header_data.projectName,
    projectId: header_data.projectId,
    executiveProjectLeader: header_data.executiveProjectLeader,
    projectFirstLevel: header_data.projectFirstLevel,
    budgetStatus: header_data.budgetStatus,
    projectStatus: header_data.projectStatus,
    pageNo: queryParams.pageNo,
    pageSize: queryParams.pageSize,
    username: localStorage.getItem("nikename"),
  };
  getProjectBudget(list)
    .then(({ data }) => {
      let datalist = data.records;
      datalist.map((v: any) => {
        // if (v.projectStatus === "INPROGRESS") {
        //   v.projectStatus = "进行中";
        // } else if (v.projectStatus === "NOTSTARTED") {
        //   v.projectStatus = "未开始";
        // } else if (v.projectStatus === "FINISHED") {
        //   v.projectStatus = "已完结";
        // } else if (v.projectStatus === "NOFINISHED") {
        //   v.projectStatus = "已完结(未中标)";
        // }
        let temp = JSON.parse(
          localStorage.getItem("projectStatusOptions")
        ).filter((item) => v.projectStatus === item.value);
        v.projectStatus = temp[0]?.label;
        if (v.budgetStatus === 2) {
          v.budgetStatus = "已导入";
        } else {
          v.budgetStatus = "未导入";
        }
        if (v.projectFirstLevel === "ONE") {
          v.projectFirstLevel = "A";
        } else if (v.projectFirstLevel === "TWO") {
          v.projectFirstLevel = "B";
        } else if (v.projectFirstLevel == "THREE") {
          v.projectFirstLevel = "C";
        } else if (v.projectFirstLevel == "Four") {
          v.projectFirstLevel = "D";
        }
      });
      aggregateData.tablaList = datalist;
      total.value = data.total;
    })
    .finally(() => {});
};
//搜索主表
const search = () => {
  const data = {
    projectName: header_data.projectName,
    projectId: header_data.projectId,
    executiveProjectLeader: header_data.executiveProjectLeader,
    projectFirstLevel: header_data.projectFirstLevel,
    budgetStatus: header_data.budgetStatus,
    projectStatus: header_data.projectStatus,
    pageNo: queryParams.pageNo,
    pageSize: queryParams.pageSize,
  };
  tablaList();
};
//打开详情弹框
const openEditMsk = () => {
  header_data.editaMsk = true;
};
//打开项目预算查看
const addbudget = () => {
  header_data.addMsk = true;
};
//关闭新增预算编辑
const addclose = () => {
  header_data.addMsk = false;
};
//关闭预算修改编辑
const editclose = () => {
  header_data.editaMsk = false;
};
//关闭项目预算详情弹框
const close = () => {
  header_data.projectDetails = false;
};
//关闭项目预算查看
const closeCheck = () => {
  header_data.check = false;
  header_data.budgeteditShow = false;
};
//关闭项目操作弹框
const closesOperate = () => {
  header_data.operateMsk = false;
  header_data.budgetoperateMsk = false;
};
//打开项目操作弹框
const operate = () => {
  header_data.operateMsk = true;
};
//打开新操作
const newoperate = () => {
  header_data.budgetoperateMsk = true;
};
//打开项目预算详情弹框
const openMsk = () => {
  header_data.projectDetails = true;
};
//打开项目预算查看
const openBudgetedit = () => {
  header_data.budgeteditShow = true;
};
//重置按钮
const reset = () => {
  header_data.projectName = null;
  header_data.projectId = null;
  header_data.executiveProjectLeader = null;
  header_data.projectFirstLevel = null;
  header_data.budgetStatus = null;
  header_data.projectStatus = null;
  tablaList();
};
onMounted(() => {
  // 初始化用户列表数据
  tablaList();
});
</script>
<style lang="scss" scoped>
@import "./css/index.scss";
</style>
import { reduce } from "lodash";
