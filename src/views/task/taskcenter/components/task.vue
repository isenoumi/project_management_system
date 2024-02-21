<template>
  <el-dialog
    title="详情"
    width="70%"
    :destroy-on-close="true"
    :append-to-body="true"
    @handleDialogOpen="handleDialogOpen"
  >
    <div class="boxTitle">
      任务名称:<span>
        {{ fatherTaskInfo ? fatherTaskInfo.projectTaskName : "" }}
      </span>
    </div>

    <div class="boxTitle">子任务名称:</div>
    <div class="tabs">
      <el-tabs
        ref="tabs"
        v-model="activeName"
        class="demo-tabs"
        @tab-click="handleClickApproval"
      >
        <el-tab-pane
          v-for="(item, index) in subTaskInfo"
          :label="item.projectTaskName"
          :name="item.id"
          :key="index"
        >
        </el-tab-pane>
      </el-tabs>
      <div class="table">
        <el-table border :data="subTaskTableData">
          <el-table-column
            align="center"
            label="序号"
            type="index"
            width="60"
          />

          <el-table-column
            v-for="(item, index) in subTaskTableList"
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
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('reset')">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { TabsPaneContext } from "element-plus";
import { ref, onUpdated, nextTick } from "vue";

import {
  getApprovaInstance,
  getApprovalDetails,
  downloadFile,
} from "@/api/plan/feishu/index";
import { getTaskNoticeDetailsProject } from "@/api/task/taskcenter/index";
import getFileType from "@/utils/getFileType";
const emits = defineEmits(["reset"]);
const props = defineProps(["subId", "projectTaskName", "taskVisible"]);
// tab选项卡ref
const tabs = ref(null);
// 当前选中tab
const activeName = ref("1");
// 任务信息
const fatherTaskInfo = ref({});
// 子任务信息
const subTaskInfo = ref([]);
// 子任务表格数据
const subTaskTableData = ref([]);
// 子任务表格表头
const subTaskTableList = ref([
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

// 点击查看审批按钮
const handleClickApproval = (tab: TabsPaneContext, event: Event) => {
  // 获得审批记录
  getApprovaInstance({
    pageSize: 9999,
    pageNo: 1,
    sourceId: tab.paneName,
    sourceType: "ProjectPlanItem",
  }).then((res) => {
    subTaskTableData.value = res.data.records;
    subTaskTableData.value.forEach((item) => {
      if (item.instanceCode) {
        // 审批记录初始化
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
};

// 附件下载
const handleDownload = (event: Event) => {
  const formData = new FormData();
  formData.append("fileUrl", event.attachment);
  downloadFile(formData).then((res) => {
    const blob = new Blob([res.data], { type: getFileType(event.attachment) });
    const objectUrl = URL.createObjectURL(blob);
    console.log(objectUrl);
    const a = document.createElement("a");
    a.download = "附件";
    a.href = objectUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
};

// 时间格式转化
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

// 打开任务dialog
const handleDialogOpen = () => {
  nextTick(() => {
    const tab = tabs.value;
  });
};
onUpdated(() => {
  if (props.subId && props.taskVisible) {
    getTaskNoticeDetailsProject(props.subId).then(({ data, code }) => {
      if (code == 200) {
        subTaskInfo.value = data.son;
        fatherTaskInfo.value = data.father;
        // sourceId.value = data.father.id;
        activeName.value = subTaskInfo.value[0].id;
      } else {
        ElMessage.error("查询失败, 计划未导入");
      }
    });
  }
});
</script>

<style scoped lang="scss">
@import "../css/task.scss";
</style>
