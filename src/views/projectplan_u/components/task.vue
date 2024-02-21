<template>
  <el-dialog
    title="详情"
    width="60%"
    :destroy-on-close="true"
    :append-to-body="true"
  >
    <div class="boxTitle">
      任务名称:<span>{{ props.projectTaskName }}</span>
    </div>

    <div class="boxTitle">
      子任务名称:
      <span>{{ subTaskInfo ? subTaskInfo.projectTaskName : "" }}</span>
    </div>
    <div class="tabs">
      <div class="table" v-if="isAdmin && !isUser">
        <el-table border :data="approvalRecordTableData">
          <el-table-column
            align="center"
            label="序号"
            type="index"
            width="60"
          />

          <el-table-column
            v-for="(item, index) in approvalRecordTableList"
            :key="index"
            align="center"
            :label="item.label"
            :prop="item.prop"
          >
            <template #default="scope">
              <div v-if="item.prop == 'attachment'">
                <el-button
                  text
                  type="primary"
                  @click="handleDownload(scope.row)"
                >
                  下载
                </el-button>
              </div>
              <div v-else-if="item.prop == 'status'">
                <div
                  v-for="(item, index) in approvalStatusOptions"
                  :key="index"
                >
                  <div v-if="item.value == scope.row.status">
                    {{ item.label }}
                  </div>
                </div>
              </div>
              <div v-else>
                {{ scope.row[item.prop] }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-tabs
        v-else
        v-model="activeName"
        class="demo-tabs"
        @tab-click="addApproval"
      >
        <el-tab-pane label="新增进度反馈" name="first">
          <approveForm
            ref="approve"
            :sourceId="sourceId"
            :projectTaskCode="props.projectTaskCode"
            @close="$emit('reset')"
          ></approveForm>
        </el-tab-pane>
        <el-tab-pane label="进度反馈记录" name="second">
          <div class="table">
            <el-table border :data="approvalRecordTableData">
              <el-table-column
                align="center"
                label="序号"
                type="index"
                width="60"
              />

              <el-table-column
                v-for="(item, index) in approvalRecordTableList"
                :key="index"
                align="center"
                :label="item.label"
                :prop="item.prop"
              >
                <template #default="scope">
                  <div v-if="item.prop == 'attachment'">
                    <el-button
                      text
                      type="primary"
                      @click="handleDownload(scope.row)"
                    >
                      下载
                    </el-button>
                  </div>
                  <div v-else-if="item.prop == 'status'">
                    <div
                      v-for="(item, index) in approvalStatusOptions"
                      :key="index"
                    >
                      <div v-if="item.value == scope.row.status">
                        {{ item.label }}
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    {{ scope.row[item.prop] }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('reset')">关闭</el-button>
        <el-button @click="initiateApproval" type="primary">确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { TabsPaneContext } from "element-plus";
import { ref, onUpdated } from "vue";
import approveForm from "./approveForm.vue";
import { getSubtaskById } from "@/api/plan/plan/index";
import {
  getApprovaInstance,
  getApprovalDetails,
  downloadFile,
} from "@/api/plan/feishu/index";
import getFileType from "@/utils/getFileType";

const emits = defineEmits(["reset"]);
const props = defineProps(["subId", "projectTaskName", "projectTaskCode"]);
// 审批组件ref
const approve = ref(null);
// 子任务id
const sourceId = ref("");
// 是否管理员
const isAdmin = ref(false);
// 是否普通用户
const isUser = ref(false);
// 子任务信息
const subTaskInfo = ref({ projectTaskName: "", projectTaskCode: "" });
// 审批记录table数据
const approvalRecordTableData = ref([]);
// 审批记录table表头
const approvalRecordTableList = ref([
  {
    label: "上传人",
    prop: "sourceBy",
  },
  {
    label: "上传时间",
    prop: "startTime",
  },
  {
    label: "项目进度",
    prop: "jindu",
  },
  {
    label: "进度描述/备注",
    prop: "beizhu",
  },
  {
    label: "上传附件",
    prop: "attachment",
  },
  {
    label: "审批时间",
    prop: "ApprovalTime",
  },
  {
    label: "状态",
    prop: "status",
  },
  {
    label: "备注",
    prop: "comment",
  },
]);
// tab切换
const activeName = ref("first");
// 审批状态
const approvalStatusOptions = ref([
  {
    value: "PENDING",
    label: "进行中",
  },
  {
    value: "APPROVED",
    label: "已通过",
  },
  {
    value: "REJECTED",
    label: "已拒绝",
  },
  {
    value: "CANCELED",
    label: "已撤回",
  },
  {
    value: "DELETED",
    label: "已删除",
  },
  {
    value: "REVERTED",
    label: "已撤销",
  },
  {
    value: "OVERTIME_CLOSE",
    label: "超时被关闭",
  },
  {
    value: "OVERTIME_RECOVER",
    label: "超时实例被恢复",
  },
]);

// 添加审批
const addApproval = (tab: TabsPaneContext, event: Event) => {
  if (tab.paneName == "second") {
    getApprovaInstance({
      pageSize: 9999,
      pageNo: 1,
      sourceId: sourceId.value,
      sourceType: "ProjectPlanItem",
    }).then((res) => {
      approvalRecordTableData.value = res.data.records;
      approvalRecordTableData.value.forEach((item) => {
        // 查询审批记录
        if (item.instanceCode) {
          getApprovalDetails(item.instanceCode).then(({ data }) => {
            console.log(data);
            item.status = data.status;
            item.startTime = timestampToTime(
              parseInt(data.timeline[0].create_time)
            );
            item.beizhu = JSON.parse(data.form)[4].value;
            console.log("data.timeline.length", data.timeline.length);
            if (data.timeline.length > 1) {
              item.ApprovalTime = timestampToTime(
                parseInt(data.timeline[1].create_time)
              );
              item.comment = data.timeline[1].comment;
            }
            item.jindu = JSON.parse(data.form)[3].value;
          });
        }
      });
    });
  }
};

// 附件下载
const handleDownload = (event: Event) => {
  const urlArr = event.attachment.split(",");
  urlArr.forEach((item) => {
    if (item) {
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

// 转换时间格式
function timestampToTime(timestamp) {
  // 时间戳为10位需*1000，时间戳为13位不需乘1000
  var date = new Date(timestamp);
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  var h = date.getHours() + ":";
  var m = date.getMinutes() + ":";
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
}

// 发起审批
const initiateApproval = () => {
  if (activeName.value == "first") {
    approve.value.initiateApproval();
  }
};

onUpdated(() => {
  isAdmin.value =
    localStorage.getItem("rolelist").includes("系统管理员") ||
    localStorage.getItem("rolelist").includes("项目负责人");
  isUser.value = localStorage.getItem("rolelist").includes("项目执行人");
  if (isAdmin.value) {
    // 初始化审批记录表格
    if (props.subId) {
      getSubtaskById(props.subId).then(({ data }) => {
        subTaskInfo.value = data.father;
        sourceId.value = data.father.id;
        if (sourceId.value) {
          getApprovaInstance({
            pageSize: 9999,
            pageNo: 1,
            sourceId: sourceId.value,
            sourceType: "ProjectPlanItem",
          }).then((res) => {
            approvalRecordTableData.value = res.data.records;
            approvalRecordTableData.value.forEach((item) => {
              // 查询审批记录
              if (item.instanceCode) {
                getApprovalDetails(item.instanceCode).then(({ data }) => {
                  console.log(data);
                  item.status = data.status;
                  item.startTime = timestampToTime(
                    parseInt(data.timeline[0].create_time)
                  );
                  item.beizhu = JSON.parse(data.form)[4].value;
                  if (data.timeline.length > 1) {
                    item.ApprovalTime = timestampToTime(
                      parseInt(data.timeline[1].create_time)
                    );
                    item.comment = data.timeline[1].comment;
                  }
                  item.jindu = JSON.parse(data.form)[3].value;
                });
              }
            });
          });
        }
      });
    }
  } else {
    // 初始化项目计划信息
    if (props.subId) {
      getSubtaskById(props.subId).then(({ data }) => {
        console.log("object", data, props.subId);
        subTaskInfo.value = data.father;
        sourceId.value = data.father.id;
      });
    }
  }
});

onMounted(() => {
  isAdmin.value =
    localStorage.getItem("rolelist").includes("系统管理员") ||
    localStorage.getItem("rolelist").includes("项目负责人");
  isUser.value = localStorage.getItem("rolelist").includes("项目执行人");
});
</script>

<style scoped lang="scss">
@import "../css/task.scss";
</style>
