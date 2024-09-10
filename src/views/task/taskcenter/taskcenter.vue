<template>
  <div class="app-container">
    <el-card>
      <div class="header">
        <div class="header-left">
          <div class="input">
            <div class="title">通知类型:</div>
            <el-select
              v-model="query.noticeType"
              class="m-2"
              placeholder="请选择通知类型"
              clearable
            >
              <el-option
                v-for="item in options.taskNoticeStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="input">
            <div class="title">时间:</div>
            <el-date-picker
              format="YYYY-MM-DD "
              value-format="YYYY-MM-DD "
              v-model="query.updateTime"
              type="date"
              placeholder="请选择时间"
              :default-value="new Date()"
            />
          </div>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="queryList">搜索 </el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </div>
      </div>
      <div class="tabla">
        <el-table
          :header-row-style="{ height: '60px' }"
          :row-style="{ height: '50px' }"
          :data="noticeTableData"
          style="width: 100%"
          :border="true"
          :cell-style="{ textAlign: 'center' }"
          :header-cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column
            type="index"
            label="序号"
            width="60"
            :index="(e) => e + 1 + (currentPage - 1) * pageSize"
          />

          <el-table-column prop="noticeType" label="通知类型" width="180">
            <template #default="scope">
              <div
                v-for="(item, index) in options.taskNoticeStatusOptions"
                :key="index"
              >
                <div v-if="item.value == scope.row.noticeType">
                  {{ item.label }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="itemName" label="事项名称" />
          <el-table-column prop="updateTime" label="更新时间" width="180">
            <template #default="scope">
              <div>
                {{ scope.row.updateTime.slice(0, 10) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="readStatus" label="通知状态" width="180">
            <template #default="scope">
              <div>
                {{ scope.row.readStatus }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template #default="scope">
              <el-button
                type="primary"
                v-hasPerm="['NOTICE_CENTER_APPROVAL']"
                link
                @click="handleViewNotice(scope.$index, scope.row)"
                >详情
              </el-button>
              <el-button
                v-if="
                  scope.row.noticeType === 'PROJECTBUDGET' &&
                  scope.row.approveStatus === 'REJECTED'
                "
                type="primary"
                link
                @click="reSubmit(scope.row)"
                >再次提交
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="yeshu">
        <!-- <el-pagination
          background
          layout="total, prev, pager, next"
          :total="total"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        /> -->
        <pagination
          v-if="total > 0"
          v-model:total="total"
          v-model:page="currentPage"
          v-model:limit="pageSize"
          @pagination="queryList"
        />
      </div>

      <el-dialog
        v-model="noticeVisible"
        title="通知发布"
        width="70%"
        align-center
        @close="queryList"
      >
        <div class="input">
          <div class="title">标题名称: {{ noticeForm.title }}</div>
        </div>
        <div class="txt">
          <div style="width: 85px">
            通知内容:
            <div class="content" v-html="noticeForm.content"></div>
          </div>
        </div>
        <div class="input" style="margin-top: 15px">
          <div class="title">上传附件:</div>
          <el-button v-if="noticeForm.annex" type="primary" @click="download">
            下载
          </el-button>
          <div v-else>暂无附件</div>
        </div>
        <div class="btn">
          <el-button type="info" @click="reset">关闭 </el-button>
        </div>
      </el-dialog>
      <div v-if="refresh">
        <budgetVue
          v-model="budgetVisible"
          :id="budgetId"
          @closess="(budgetVisible = true), (refresh = false)"
        >
        </budgetVue>
      </div>
      <task
        v-model="taskVisible"
        @reset="taskVisible = false"
        :taskVisible="taskVisible"
        :sub-id="id"
      ></task>
    </el-card>

    <div v-if="projectApprovalVisible">
      <projectApproval
        v-model="projectApprovalVisible"
        @reset="reset"
        @queryList="queryList"
        :id="id"
        :noticeId="noticeId"
        :noticeType="noticeType"
        :formData="lixiangForm"
      ></projectApproval>
    </div>
  </div>
</template>
<!-- 图标选择器示例 -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  getTaskNoticePage,
  getTaskNoticeOne,
  setReadStatus,
} from "@/api/task/taskcenter/index";
import task from "./components/task.vue";
import budgetVue from "./components/budget.vue";
import { downloadFile } from "@/api/plan/feishu";
import getFileType from "@/utils/getFileType";
import projectApproval from "./components/projectApproval.vue";
// 路由对象
const router = useRouter();
// 当前页码
const currentPage = ref(1);
// 每页个数
const pageSize = ref(10);
// 总数
const total = ref(10);
const id = ref("");
// 预算id
const budgetId = ref("");
// 页面刷新标识
const refresh = ref(false);
// 计划id
const planId = ref("");
const noticeId = ref("");
// 查看通知弹框
const noticeVisible = ref(false);
const projectApprovalVisible = ref(false);
// 查看计划任务弹框
const taskVisible = ref(false);
// 查看预算弹框
const budgetVisible = ref(false);
const noticeType = ref("");
// 消息通知form
const noticeForm = ref({});
const lixiangForm = ref({});
// select下拉
const options = ref({ taskNoticeStatusOptions: {} });
// 条件查询
const query = ref({
  projectName: "",
  projectId: "",
  noticeType: "",
  updateTime: "",
});
// 消息表格数据
const noticeTableData = ref([]);

// 表格序号
const indexMethod = (index: number) => {
  return index * 1 + 1;
};

// 查看通知详情
const handleViewNotice = (index: number, row: any) => {
  noticeType.value = row.noticeType;
  noticeId.value = row.id;
  setReadStatus({ id: row.id });
  if (row.noticeType == "PRE_SALES_SUPPORT") {
    router.push({
      path: "/presales/Presales",
      query: { id: row.projectId },
    });
  }
  if (row.noticeType == "NOTICE") {
    noticeVisible.value = true;
    getTaskNoticeOne({ id: row.noticeId }).then(({ data }) => {
      if (data) noticeForm.value = data;
    });
    // setReadStatus({ id: row.noticeId });
  } else if (row.noticeType == "PROJECTPLAN") {
    id.value = row.projectPlanId;
    taskVisible.value = true;
    planId.value = row.projectPlanId;
  } else if (row.noticeType == "PROJECTBUDGET") {
    budgetId.value = row.projectBudgetId;
    budgetVisible.value = true;
    nextTick(() => {
      refresh.value = true;
    });
  } else if (row.noticeType == "DAILY_COMMENT") {
    router.push({
      path: "/dashboard",
      query: { noticeId: row.id },
    });
  } else if (row.noticeType == "THE_PROJECT_WAS_APPROVED") {
    id.value = row.projectId;
    projectApprovalVisible.value = true;
  } else if (row.noticeType == "PROJECT_RESULTS") {
    id.value = row.projectId;
    projectApprovalVisible.value = true;
    lixiangForm.value = {
      approvalIsStatus: row.approvalIsStatus,
      rejectReason: row.rejectReason,
    };
  }
};
//再次提交
const reSubmit = (row: any) => {
  router.push({
    path: "/reapproval/Reapproval",
    query: { id: row.projectBudgetId },
  });
};
// 表格每页条数
const handleSizeChange = (val: number) => {};
// table 跳页
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  queryList();
};

// 文件下载
const download = () => {
  const urlArr = noticeForm.value.annex.split(",");
  urlArr.forEach((item) => {
    if (item && item != "null" && item != "undefined") {
      const formData = new FormData();
      formData.append("fileUrl", item);
      downloadFile(formData).then((res) => {
        const blob = new Blob([res.data], {
          type: getFileType(item),
        });
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.download = "附件";
        a.href = objectUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    }
  });
};

// 查询表格
const queryList = () => {
  getTaskNoticePage({
    pageNo: currentPage.value,
    projectId: query.value.projectId,
    projectName: query.value.projectName,
    noticeType: query.value.noticeType,
    updateTime: query.value.updateTime,
    username: JSON.parse(localStorage.getItem("users")).username,
  }).then(({ data }) => {
    noticeTableData.value = data.records;
    total.value = data.total;
  });
};

// 页面重置
const reset = () => {
  query.value = {
    projectName: "",
    projectId: "",
    noticeType: "",
    updateTime: "",
  };
  projectApprovalVisible.value = false;
  noticeVisible.value = false;
  queryList();
};

onMounted(() => {
  queryList();
  options.value.taskNoticeStatusOptions = JSON.parse(
    localStorage.getItem("taskNoticeStatusOptions")
  );
});
</script>
<style lang="scss" scoped>
@import "./css/taskcenter.scss";
</style>
