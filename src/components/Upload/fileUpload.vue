<template>
  <el-upload
    v-model:file-list="fileList"
    class="upload-demo"
    :action="actionUrl"
    multiple
    :before-upload="beforeUpload"
    :on-success="handleSuccess"
    :on-remove="handleRemove"
    :limit="limit"
    :show-file-list="showFile"
    :data="data"
    :headers="headers"
    v-loading.fullscreen="loading"
  >
    <el-button v-if="show" :text="props.buttonType" type="primary">{{
      props.label
    }}</el-button>
  </el-upload>
</template>

<script setup lang="ts">
import type { UploadProps, UploadUserFile, ElMessage } from "element-plus";
import { ref } from "vue";
const emits = defineEmits(["getFileUrl", "setFileUrl"]);
const props = defineProps({
  label: { type: String, default: "上传附件" },
  planId: { type: String, default: "" },
  projectId: { type: String, default: "" },
  annex: { type: String, default: "" },
  actionUrl: { type: String, default: "" },
  data: { type: Object, default: () => {} },
  buttonType: { type: Boolean, default: true },
  showFile: { type: Boolean, default: false },
  limit: { type: Number, default: 9 },
});
const fileList = ref<UploadUserFile[]>([]);
const actionUrl = ref("");
const showFile = ref(true);
const show = ref(true);
const loading = ref(false);
const data = ref({});
const headers = ref({
  Authorization: localStorage.getItem("accessToken"),
});
if (props.actionUrl) {
  actionUrl.value = import.meta.env.VITE_APP_BASE_API + props.actionUrl;
  data.value = {
    ...props.data,
  };
  showFile.value = props.showFile;
} else {
  if (props.planId && props.projectId) {
    actionUrl.value =
      import.meta.env.VITE_APP_BASE_API +
      `/oms-project/api/t_project_plan/importExcel`;
    data.value = {
      planId: props.planId,
      projectId: props.projectId,
    };
    showFile.value = props.showFile;
  } else {
    showFile.value = true;
    actionUrl.value =
      import.meta.env.VITE_APP_BASE_API + "/oms-project/api/file/fileUpload";
    data.value = {
      fileDir: "file",
    };
  }
}

const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  let url = "";
  fileList.value.forEach((item) => {
    if (item.url && item.url != "undefined") {
      url += "," + item.url;
    }
  });
  emits("setFileUrl", url);
};
const handleSuccess: UploadProps["onSuccess"] = (res, uploadFile) => {
  ElMessage.success("上传成功");
  loading.value = false;
  emits("getFileUrl", res);
};

const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  console.log(uploadFile);
};

const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(`仅能提交一份文件`);
};
const beforeUpload = (file: any) => {
  loading.value = true;
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error("上传文件大小不能超过 2MB!");
    loading.value = false;
  }
  return isLt2M;
};
const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(`是否删除 ${uploadFile.name} ?`).then(
    () => true,
    () => false
  );
};

onMounted(() => {
  if (props.annex) {
    fileList.value = [];
    props.annex.split(",").forEach((item, index) => {
      if (item && item != "undefined" && item != "null") {
        fileList.value.push({ url: item, name: `附件(${index})` });
      }
    });
  } else {
    fileList.value = [];
  }
});
</script>
