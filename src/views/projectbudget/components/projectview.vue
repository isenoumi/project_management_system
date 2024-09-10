<template>
  <el-dialog
    title="查看"
    width="80%"
    :close-on-click-modal="false"
    align-center
  >
    <div class="title1">预算科目类别：{{ xmName }}</div>
    <!-- 老操作 -->
    <el-table
      v-if="xmName != '项目毛利测算汇总表'"
      ref="machineTable"
      @row-click="handledetail11"
      @expand-change="handleRowClickss"
      :data="tablesList"
      row-key="id"
      :header-row-style="{ height: '60px' }"
      :expand-row-keys="expands"
      :row-style="{ height: '50px' }"
      :border="true"
      style="width: 100%"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{
        'text-align': 'center',
      }"
    >
      <el-table-column type="expand" fixed="">
        <template #default="props">
          <el-table ref="cTable" :data="tabladata.data" border :editable="true">
            <el-table-column
              align="center"
              label="序号"
              :index="indexMethod"
              type="index"
              width="60"
            />
            <el-table-column
              v-for="(item, index) in tableList"
              :key="index"
              align="center"
              width="76"
              :label="item.label"
              :prop="item.prop"
            >
            </el-table-column>
            <el-table-column align="center" label="操作" width="129.5">
              <template #default="scope">
                <!-- <el-button type="primary"  link @click="construction(scope.row)">旧操作</el-button> -->
                <el-button type="primary" link @click="operation(scope.row)"
                  >操作</el-button
                >
                <el-button
                  type="primary"
                  v-hasPerm="['PROJECT_BUDGET_EDIT']"
                  link
                  @click="edits(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="primary"
                  link
                  @click="handleEdit(scope.$index, scope.row)"
                  v-hasPerm="['PROJECT_BUDGET_DEL']"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
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
      <el-table-column prop="payAmount" fixed label="付款费用合计" />
      <el-table-column prop="overExpenditure" fixed label="是否超标" />
      <el-table-column
        label="操作"
        fixed="right"
        width="140"
        v-if="show.buttonShow"
      >
        <template #default="scope">
          <el-button
            type="primary"
            v-hasPerm="['PROJECT_BUDGET_ADD']"
            link
            @click="addbudget(scope.row)"
            >新增三级科目</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 新操作 -->
    <el-table
      v-else
      v-hasPerm="['PROJECT_BUDGET_VIEW']"
      ref="machineTable"
      @row-click="handledetail11"
      @expand-change="handleRowClickss"
      :data="tablesList"
      row-key="id"
      :header-row-style="{ height: '60px' }"
      :expand-row-keys="expands"
      :row-style="{ height: '50px' }"
      :border="true"
      style="width: 100%"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{
        'text-align': 'center',
      }"
    >
      <el-table-column type="expand" fixed="">
        <template #default="props">
          <el-table ref="cTable" :data="tabladata.data" border :editable="true">
            <el-table-column
              align="center"
              label="序号"
              :index="indexMethod"
              type="index"
              width="60"
            />
            <el-table-column
              v-for="(item, index) in tabList"
              :key="index"
              align="center"
              :label="item.label"
              :prop="item.prop"
            >
            </el-table-column>
            <el-table-column align="center" label="操作" width="129.5">
              <template #default="scope">
                <el-button type="primary" link @click="operation(scope.row)"
                  >操作</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        fixed
        label="序号"
        :index="indexMethod"
        width="60"
      />
      <el-table-column prop="code" fixed label="科目编号" />
      <el-table-column prop="name" fixed label="预算科目类别" />
      <el-table-column prop="costAmount" fixed label="费用合计" />
    </el-table>
    <div class="btns centerDialogVisibles-btn">
      <el-button type="info" @click="detailsClose">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import {
  getProjectBudgetbyparentid,
  budgetSubject,
  getSubjectStatistic,
  getlevelAllThreeSubjects,
} from "@/api/budget";
import { useRouter } from "vue-router";
import Bus from "../js/Bus";
const router = useRouter();
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
  "opeConstruction",
]);
//表格数据
const tablesList = ref<any>([]);
//列表数据
const rowList = reactive<any>({
  list: [],
  user: "",
});
//获取预算科目类别
const xmName = ref("");
//获取id
Bus.on("closeerbudget", (row: any) => {
  if (row) {
    collapseAll();
    emit("closes");
  }
});
//获取预算科目类别
Bus.on("xmName", (row: any) => {
  xmName.value = row;
});
//获取id
Bus.on("twoeditId", (row: any) => {
  if (row) {
    let data = {
      id: row,
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
      tablesList.value = response.data;
    });
  }
});
//获取详情
Bus.on("detailemits", (row: any) => {
  if (row) {
    let data = {
      id: row,
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
      tablesList.value = response.data;
    });
  }
});
//关闭弹框
const detailsClose = () => {
  // collapseAll()
  emit("closes");
  Bus.emit("detailemit", "1");
};
//获取二级预算id
Bus.on("edsId", (row: any) => {
  if (row) {
    let data = {
      id: row,
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
      tablesList.value = response.data;
    });
  }
});
//用户权限展示按钮
const show = reactive<any>({
  show: false,
  buttonShow: false,
});
//新表格数据
const tabList = ref([
  {
    label: "科目编号",
    prop: "code",
  },
  {
    label: "预算科目类别",
    prop: "name",
  },
  {
    label: "费用合计",
    prop: "costAmount",
  },
  {
    label: "1月",
    prop: "januaryCost",
  },
  {
    label: "2月",
    prop: "februaryCost",
  },
  {
    label: "3月",
    prop: "marchCost",
  },
  {
    label: "4月",
    prop: "aprilCost",
  },
  {
    label: "5月",
    prop: "mayCost",
  },
  {
    label: "6月",
    prop: "juneCost",
  },
  {
    label: "7月",
    prop: "julyCost",
  },
  {
    label: "8月",
    prop: "augustCost",
  },
  {
    label: "9月",
    prop: "septemberCost",
  },
  {
    label: "10月",
    prop: "octoberCost",
  },
  {
    label: "11月",
    prop: "novemberCost",
  },
  {
    label: "12月",
    prop: "decemberCost",
  },
]);
//表格数据
const tableList = ref([
  {
    label: "科目编号",
    prop: "code",
  },
  {
    label: "预算科目类别",
    prop: "name",
  },
  {
    label: "预算费用合计",
    prop: "costAmount",
  },
  {
    label: "付款费用合计",
    prop: "payAmount",
  },
  {
    label: "是否超标",
    prop: "overExpenditure",
  },
  {
    label: "1月",
    prop: "januaryCost",
  },
  {
    label: "2月",
    prop: "februaryCost",
  },
  {
    label: "3月",
    prop: "marchCost",
  },
  {
    label: "4月",
    prop: "aprilCost",
  },
  {
    label: "5月",
    prop: "mayCost",
  },
  {
    label: "6月",
    prop: "juneCost",
  },
  {
    label: "7月",
    prop: "julyCost",
  },
  {
    label: "8月",
    prop: "augustCost",
  },
  {
    label: "9月",
    prop: "septemberCost",
  },
  {
    label: "10月",
    prop: "octoberCost",
  },
  {
    label: "11月",
    prop: "novemberCost",
  },
  {
    label: "12月",
    prop: "decemberCost",
  },
]);

//折叠面板绑定ref值
let machineTable = ref();
//表格折叠
const expands = ref([]);
//表格数据
const tabladata = reactive<any>({
  user: "",
  data: [],
});
//传递过来的主表格信息
interface Props {
  projectBudgetList?: any;
}
defineProps<Props>();
//列表编号
const indexMethod = (index: number) => {
  return index * 1 + 1;
};
//折叠表格
const collapseAll = () => {
  machineTable.value.toggleRowExpansion(tabladata.data[0]);
};
// 表格折叠方法
const handleRowClickss = (row: any, expandedRows: any) => {
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
  expands.value = [];
  let data = {
    id: row.id,
    lavel: 2,
  };
  // 获取项目预算查看弹框数据
  getProjectBudgetbyparentid(data).then((response: any) => {
    if (response.data.length > 0) {
      response.data.map((v: any) => {
        if (v.overExpenditure == 0) {
          v.overExpenditure = "未超过";
        } else if (v.overExpenditure == 1) {
          v.overExpenditure = "超过";
        }
      });
      tabladata.data = response.data;
    }
  });
  if (expandedRows) {
    // ture 代表之前是合起状态 现在要展开起来
    // 找到父节点一起放进数组
    expands.value.push(String(row.id));
    expands.value.push(String(row.pid));
  } else {
    // false 代表要合起来，
    //如果是根节点，根节点的pid不在列表所以无效,就算放进数组也没用
    // 如果是叶子节点 把pid 放进数组 代表只合起自己，当前节点的根节点还是会展开
    expands.value.push(String(row.pid));
  }
};
//兄弟传递参数
Bus.on("changeNav", (id: any) => {
  let data = {
    id: id,
    lavel: 2,
  };
  // 获取项目预算查看弹框数据
  getProjectBudgetbyparentid(data).then((response: any) => {
    response.data.map((v: any) => {
      if (v.overExpenditure == 0) {
        v.overExpenditure = "未超过";
      } else if (v.overExpenditure == 1) {
        v.overExpenditure = "超过";
      }
    });
    tabladata.data = response.data;
  });
});
//表格被点击方法
const handledetail11 = (row: any, column: any, event: any) => {
  machineTable.value.toggleRowExpansion(row);
};
//点击操作
const operation = (row: any) => {
  collapseAll();
  emit("operate");
  emit("setid", row);
};
//旧操作
const construction = (row: any) => {
  console.log(row, "xx");
  // collapseAll()
  // emit("opeConstruction")
  // emit("setid", row)
};

//删除三级预算
const handleEdit = (index: number, row: any) => {
  ElMessageBox.confirm("此操作将永久删除该文件, 是否继续?", "提示", {
    distinguishCancelAndClose: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(() => {
      let id = row.id;
      budgetSubject(id).then((response: any) => {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        tabladata.data.splice(index, 1);
      });
    })
    .catch((action: any) => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};
//编辑
const edits = (row: any) => {
  Bus.emit("rowId", row.id);
  let data = {
    subjectId: row.id,
  };
  let id = {
    projectId: row.peojectId,
  };
  getlevelAllThreeSubjects(id).then((res: any) => {
    Bus.emit("peojectList", res.data);
  });
  getSubjectStatistic(data).then((res: any) => {
    Bus.emit("editList", res.data);
  });
  collapseAll();
  emit("getedits", row);
  emit("edit");
};
//新增
const addbudget = (row: any) => {
  let data = {
    subjectId: row.id,
  };
  getSubjectStatistic(data).then((res: any) => {
    Bus.emit("tabsList", res.data);
  });
  emit("addys", row);
  emit("addbudget");
};
onMounted(() => {
  //获取的用户信息
  rowList.user = localStorage.getItem("rolelist");
  if (
    rowList.user.includes("系统管理员" || rowList.user.includes("项目负责人"))
  ) {
    show.buttonShow = true;
  } else {
    show.buttonShow = false;
  }
});
</script>
<style scoped lang="scss">
@import "../css/index.scss";
</style>
