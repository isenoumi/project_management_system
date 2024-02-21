<template>
  <el-form
    ref="approvalFromRef"
    :model="approvalFrom"
    :rules="rules"
    label-width="150px"
  >
    <el-form-item label="项目名称: " prop="projectCode">
      <el-input
        disabled
        v-model="approvalFrom.projectCode"
        class="input"
        autocomplete="off"
        required="required"
      ></el-input>
    </el-form-item>
    <el-form-item label="任务名称: " prop="taskCode">
      <el-input
        disabled
        v-model="approvalFrom.taskCode"
        class="input"
        autocomplete="off"
        required="required"
      ></el-input>
    </el-form-item>
    <el-form-item label="子任务名称: " prop="subTaskCode">
      <el-input
        disabled
        v-model="approvalFrom.subTaskCode"
        class="input"
        autocomplete="off"
        required="required"
      ></el-input>
    </el-form-item>
    <el-form-item label="项目进度: " prop="schedule">
      <el-input-number
        v-model="approvalFrom.schedule"
        :min="0"
        :max="100"
        controls-position="right"
      />
    </el-form-item>
    <el-form-item label="附件: " prop="fileList">
      <el-upload
        v-model:file-list="approvalFrom.fileList"
        class="upload-demo"
        :data="feishuFile"
        action=""
        :http-request="upload"
        multiple
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-success="handleSuccess"
        :limit="9"
        :on-exceed="handleExceed"
        :show-file-list="true"
        v-loading="fullscreenLoading"
      >
        <el-button text type="primary">上传附件</el-button>
      </el-upload>
    </el-form-item>
    <el-form-item label="进度描述/备注信息: " prop="remark">
      <el-input
        v-model="approvalFrom.remark"
        class="input"
        autocomplete="off"
        required="required"
        type="textarea"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
const emits = defineEmits(["close"]);
import type { UploadProps } from "element-plus";
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  createFeishuUpload,
  createFeishuApproval,
  postApprovaInstance,
} from "@/api/plan/feishu/index";

const props = defineProps(["sourceId", "projectTaskCode"]);
// 上传文件loading
const fullscreenLoading = ref(false);
// 返回的文件链接
const cosUrl = ref("");
// 审批表单ref
const approvalFromRef = ref(null);
// 飞书文件上传对象
const feishuFile = ref({
  name: "文件",
  type: "attachment",
});
// 审批表单
const approvalFrom = ref({
  projectCode: localStorage.getItem("firstCode"),
  taskCode: localStorage.getItem("secondCode"),
  subTaskCode: localStorage.getItem("thirdCode"),
  fileList: [],
  remark: "",
  schedule: 0,
  fileCode: [],
});
// form规则
const rules = reactive({
  projectCode: [{ required: true, message: "请输入项目名称" }],
  taskCode: [{ required: true, message: "请输入任务名称" }],
  subTaskCode: [{ required: true, message: "请输入子任务名称" }],
  schedule: [{ required: true, message: "请输入项目进度" }],
  fileList: [{ required: true, message: "请上传附件" }],
  // remark: [{ required: true, message: "请输入进度描述或备注信息" }],
});

// 提交审批
const initiateApproval = async () => {
  if (!cosUrl.value) {
    return ElMessage({
      type: "error",
      message: "请上传文件",
    });
  }
  if (!approvalFrom.value) {
    return;
  }
  try {
    await approvalFromRef.value.validate();
    // 审批实例
    const data = [
      {
        id: "widget16909922795540001",
        type: "input",
        value: approvalFrom.value.projectCode + "",
      },
      {
        id: "widget16909923958720001",
        type: "input",
        value: approvalFrom.value.taskCode + "",
      },
      {
        id: "widget16909924455700001",
        type: "input",
        value: approvalFrom.value.subTaskCode + "",
      },
      {
        id: "widget16914751698020001",
        type: "number",
        value: approvalFrom.value.schedule,
      },
      {
        id: "widget16901858087650001",
        type: "attachmentV2",
        value: approvalFrom.value.fileCode,
      },
      {
        id: "widget16920863635020001",
        type: "textarea",
        value: approvalFrom.value.remark + "",
      },
    ];
    const formData = new FormData();
    formData.append("params", JSON.stringify(data));
    formData.append(
      "feishuUserId",
      JSON.parse(localStorage.getItem("users")).feishuUserId
    );
    formData.append("approvalCode", "81094B07-1198-4F32-8771-0ECFB301693A");
    // 创建审批实例
    createFeishuApproval(formData).then((res) => {
      if (res.code == 200) {
        const result = JSON.parse(res.msg);
        if (result.data.instance_code) {
          postApprovaInstance({
            instanceCode: result.data.instance_code,
            attachment: cosUrl.value,
            sourceId: props.sourceId,
            sourceType: "ProjectPlanItem",
            sourceBy: localStorage.getItem("nikename"),
          });
          ElMessage({
            type: "success",
            message: "提交成功",
          });
          approvalFrom.value.fileCode = [];
          approvalFrom.value.remark = "";
          approvalFrom.value.schedule = 0;
          emits("close");
        } else {
          ElMessage({
            type: "error",
            message: "提交失败, 请稍后再试",
          });
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
};

// 飞书文件上传
const upload = (param: any) => {
  fullscreenLoading.value = true;
  const formData = new FormData();
  formData.set("content", param.file);
  formData.set("type", "attachment");
  formData.set("name", param.file.name);
  console.log(13546, param.file);
  createFeishuUpload(formData).then((res: any) => {
    console.log(JSON.parse(res.msg));
    fullscreenLoading.value = false;
    approvalFrom.value.fileCode.push(JSON.parse(res.msg).data.code);
    cosUrl.value += JSON.parse(res.msg).cos_url + ",";
  });
};

// 删除
const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {};
// 成功的回调
const handleSuccess: UploadProps["onSuccess"] = (res, uploadFile) => {};
// 预览
const handlePreview: UploadProps["onPreview"] = (uploadFile) => {};
// 本地上传
const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(`最多提交9份文件`);
};

// 删除图片
const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(`是否删除 ${uploadFile.name} ?`).then(
    () => true,
    () => false
  );
};

defineExpose({ initiateApproval });
</script>

<style scoped>
@import "../css/approveForm.scss";
</style>
