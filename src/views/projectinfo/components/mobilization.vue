<template>
  <el-dialog title="进场" width="50%" :destroy-on-close="true">
    <div class="content">
      <el-form
        ref="formDataAdd"
        :model="approvalFrom"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="" prop="">
          <div class="tips" style="color: #f56c6c">
            请确认是否进场，确定后该项目计划及预算将启动。
          </div>
        </el-form-item>
        <el-form-item label="项目执行经理: " prop="executiveProjectLeader">
          <el-select
            v-model="approvalFrom.executiveProjectLeader"
            placeholder="请选择项目执行经理"
            :disabled="disabled"
            clearable
            @change="(e) => (executiveProjectLeaderText = e)"
          >
            <el-option
              v-for="item in options.executiveProjectLeaderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目成员: " prop="projectMember">
          <el-select
            v-model="approvalFrom.projectMember"
            placeholder="请选择项目成员"
            :multiple="true"
            clearable
            filterable
            :disabled="disabled"
            @change="(e) => (projectMemberText = e)"
          >
            <el-option
              v-for="item in options.executiveProjectLeaderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否提前进场: " prop="advanceMobilization">
          <el-radio-group
            v-model="approvalFrom.advanceMobilization"
            :disabled="disabled"
          >
            <el-radio label="YES">是</el-radio>
            <el-radio label="NO">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="approvalFrom.advanceMobilization == 'YES'"
          label="提前进场原因: "
          prop="advanceMobilizationReason"
        >
          <el-input
            style="width: 220px"
            v-model="approvalFrom.advanceMobilizationReason"
            :rows="3"
            type="textarea"
            placeholder="请输入内容"
            :disabled="disabled"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="
            approvalFrom.advanceMobilization == 'YES'
              ? '合同预计签订时间'
              : '合同签订时间'
          "
          prop="contractExpectTime"
        >
          <el-date-picker
            v-model="approvalFrom.contractExpectTime"
            type="datetime"
            :placeholder="
              approvalFrom.advanceMobilization == 'YES'
                ? '合同预计签订时间'
                : '合同签订时间'
            "
            value-format="YYYY-MM-DD"
            format="YYYY-MM-DD"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item label="其他备注信息: " prop="description">
          <el-input
            style="width: 220px"
            v-model="approvalFrom.description"
            :rows="3"
            type="textarea"
            placeholder="请输入其他备注信息"
            :disabled="disabled"
          ></el-input>
        </el-form-item>
      </el-form>
      <div v-if="examineStatus">
        <div style="margin-bottom: 15px; margin-left: 25px; font-weight: 700">
          流转状态
          <span class="timelineTitle" style="margin-left: 40px">
            <span v-if="examineStatus == 'PENDING'" style="color: #67c23a">
              审批中
            </span>
            <span v-if="examineStatus == 'APPROVED'" style="color: #67c23a">
              审批通过
            </span>
            <span v-if="examineStatus == 'REJECTED'" style="color: #f56c6c">
              审批不通过
            </span>
          </span>
        </div>
        <div class="timelineBox">
          <div>
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in timelineList"
                :key="index"
                :color="activity.color"
              >
                {{ activity.content }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
        <div v-if="examineStatus == 'REJECTED'">
          不通过原因: {{ supportReplyDescription }}
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('reset')">取消</el-button>
        <el-button type="primary" v-if="!disabled" @click="add">
          确定进场
        </el-button>
        <el-button
          type="primary"
          v-if="examineStatus == 'REJECTED' && disabled"
          @click="disabled = false"
        >
          进场
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
const emits = defineEmits(["reset"]);
const props = defineProps(["id", "projectName"]);
import {
  createFeishuApproval,
  postApprovaInstance,
  addMobilization,
  getMobilization,
} from "../api/index";
import { ref, reactive, onMounted, onUpdated } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
// 新增弹框
const addVisible = ref(false);
// 项目新增对象
const formDataAdd = ref(null);
const disabled = ref(false);
const options = ref({
  executiveProjectLeaderOptions: [],
  mobilizationStatusEnums: [
    { value: "NOT_ENTERED", label: "未提前进场" },
    { value: "REFUSE_TO_ENTER", label: "拒绝提前进场" },
    { value: "ENTERED", label: "已提前进场" },
  ],
});
const executiveProjectLeaderText = ref("");
const projectMemberText = ref([]);

const examineStatus = ref("");
const status = ref("");
// 项目信息form
const approvalFrom = ref({});
// form验证规则
const rules = reactive({
  // description: [{ required: true, message: "请输入其他备注信息" }],
  contractExpectTime: [{ required: true, message: "请选择时间" }],
  advanceMobilizationReason: { required: true, message: "请输入提前进场原因" },
});
const timelineList = ref([]);
const supportReplyDescription = ref();

const add = async () => {
  // return;
  if (!approvalFrom.value) {
    return;
  }
  try {
    await formDataAdd.value.validate();
    addMobilization({ ...approvalFrom.value, projectId: props.id }).then(
      ({ data, msg, code }) => {
        console.log(data);
        // ElMessage.success(msg);
        if (code == 200) {
          // return;
          initiateApproval(msg);
        }

        // emits("reset");
      }
    );
  } catch (err) {
    console.log(err);
  }
};

// 提交审批
const initiateApproval = async (mobilizationId) => {
  if (!approvalFrom.value) {
    return;
  }
  try {
    await formDataAdd.value.validate();
    let projectMember = "";
    let executiveProjectLeader = "";
    if (approvalFrom.value.projectMember.length > 0) {
      approvalFrom.value.projectMember.map((item) => {
        projectMember +=
          options.value.executiveProjectLeaderOptions.filter(
            (e) => item == e.value
          )[0]?.label + " ";
      });
    }
    if (approvalFrom.value.executiveProjectLeader)
      executiveProjectLeader =
        options.value.executiveProjectLeaderOptions.filter(
          (e) => approvalFrom.value.executiveProjectLeader == e.value
        )[0]?.label;
    // debugger;
    // 审批实例
    const data = [
      //项目名称
      {
        id: "widget17092813889880001",
        type: "input",
        value: props.projectName + "",
      },
      // 项目执行经理
      {
        id: "widget17092813910310001",
        type: "input",
        value: executiveProjectLeader + "",
      },
      // 项目成员
      {
        id: "widget17092814174990001",
        type: "input",
        value: projectMember + "",
      },
      // 提前进场原因
      {
        id: "widget17092814283160001",
        type: "textarea",
        value: (approvalFrom.value.advanceMobilizationReason || "无") + "",
      },
      // 合同预计签署日期
      {
        id: "widget17092814425330001",
        type: "input",
        value: approvalFrom.value.contractExpectTime + "",
      },
      // 其他备注信息
      {
        id: "widget17092814539450001",
        type: "textarea",
        value: approvalFrom.value.description + "",
      },
    ];
    const formData = new FormData();
    formData.append("params", JSON.stringify(data));
    formData.append(
      "feishuUserId",
      JSON.parse(localStorage.getItem("users")).feishuUserId
    );
    formData.append("approvalCode", "0C471856-53C5-4431-8CFE-2723D62792F4");
    // 创建审批实例
    createFeishuApproval(formData).then((res) => {
      if (res.code == 200) {
        const result = JSON.parse(res.msg);
        if (result.data.instance_code) {
          postApprovaInstance({
            instanceCode: result.data.instance_code,
            // attachment: cosUrl.value,
            sourceId: mobilizationId,
            mobilizationId,
            sourceType: "Mobilization",
            // sourceBy: localStorage.getItem("nikename"),
            sourceBy: localStorage.getItem("username"),
          });
          ElMessage({
            type: "success",
            message: "提交成功",
          });
          approvalFrom.value.fileCode = [];
          approvalFrom.value.remark = "";
          approvalFrom.value.schedule = 0;
        } else {
          ElMessage({
            type: "error",
            message: "提交失败, 请稍后再试",
          });
        }
        emits("reset");
      }
    });
  } catch (err) {
    console.log(err);
  }
};

// 枚举
onMounted(() => {
  options.value.executiveProjectLeaderOptions = JSON.parse(
    localStorage.getItem("executiveProjectLeaderOptions")
  );
  getMobilization({ projectId: props.id }).then(({ data }) => {
    examineStatus.value = data.haveMobilization.examineStatus;
    approvalFrom.value = {
      executiveProjectLeader: data.haveMobilization.executiveProjectLeader,
      projectMember: data.haveMobilization.projectMember,
      advanceMobilization: data.haveMobilization.advanceMobilization,
      advanceMobilizationReason:
        data.haveMobilization.advanceMobilizationReason,
      contractExpectTime: data.haveMobilization.contractExpectTime,
      description: data.haveMobilization.description || "",
    };
    supportReplyDescription.value =
      data.haveMobilization.supportReplyDescription;
    disabled.value =
      examineStatus.value == "PENDING" ||
      examineStatus.value == "REJECTED" ||
      examineStatus.value == "APPROVED";

    timelineList.value = data.process;
    timelineList.value?.reverse();
    // formDataAdd.value.validate();
  });
  // if (props.ApprovalFormData) approvalFrom.value = props.ApprovalFormData;
});
</script>

<style scoped>
@import "../css/mobilization.scss";
</style>
