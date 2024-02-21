<template>
  <el-upload
    v-model:file-list="fileList"
    class="upload-demo"
    :action="actionUrl"
    multiple
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :on-success="handleSuccess"
    :limit="1"
    :on-exceed="handleExceed"
    :show-file-list="false"
    :data="data"
    :headers="headers"
    :on-progress="updateFile"
  >
    <el-button  text type="primary" v-loading.fullscreen.lock="uploading">{{ props.label }}</el-button>
    <!-- <template #tip>
                <div class="el-upload__tip">
                  jpg/png files with a size less than 500KB.
                </div>
              </template> -->
  </el-upload>
</template>

<script setup lang="ts">
import type { UploadProps, UploadUserFile } from "element-plus";
const emits = defineEmits(["getFileUrl"]);
const uploading=ref(false)
const props = defineProps({
  label: { type: String, default: "上传附件" },
  planId: { type: String, default: "" },
  projectId: { type: String, default: "" },
});
const actionUrl = ref("");
const data = ref({});
const headers = ref({
  Authorization: localStorage.getItem("accessToken"),
});
if (props.planId && props.projectId) {
  actionUrl.value =
    import.meta.env.VITE_APP_BASE_API +
    `/oms-project/api/budgetSubject/importExcel`;
  data.value = {
    budgentid: props.planId,
    projectid: props.projectId,
  };
} else {
  actionUrl.value =
    import.meta.env.VITE_APP_BASE_API + "/oms-project/api/file/fileUpload";
  data.value = {
    fileDir: "test",
  };
}
const fileList = ref<UploadUserFile[]>([]);
const updateFile=()=>{
  uploading.value=true
}
const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};
const handleSuccess: UploadProps["onSuccess"] = (res, uploadFile) => {
  console.log(res, uploadFile);
  uploading.value=false
  ElMessage.success("上传成功");
  emits("getFileUrl", res);
};

const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  console.log(uploadFile);
};

const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(
    // `The limit is 3, you selected ${files.length} files this time, add up to ${
    //   files.length + uploadFiles.length
    // } totally`
    `仅能提交一份文件`
  );
};

const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `Cancel the transfer of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  );
};
</script>
