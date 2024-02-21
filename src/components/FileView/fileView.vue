<template>
  <el-dialog title="文件预览" width="1400px" style="text-align: left">
    <!-- 图片 -->
    <div
      v-if="state.type == 'image'"
      class="picBox"
      style="width: 700px; margin: 0px auto"
    >
      <img :src="props.file" style="width: 700px" />
    </div>
    <!-- doc，excel -->
    <div v-else-if="state.type == 'doc'" class="picBox" v-loading="loading">
      <vue-office-docx
        :src="fileData"
        style="height: 100vh"
        @rendered="renderedHandler"
        @error="errorHandler"
      />
    </div>
    <div v-else-if="state.type == 'excel'" class="picBox" v-loading="loading">
      <vue-office-excel
        :src="fileData"
        style="height: 100vh"
        @rendered="renderedHandler"
        @error="errorHandler"
      />
    </div>
    <!-- pdf -->
    <div v-else-if="state.type == 'pdf'" class="picBox" v-loading="loading">
      <vue-office-pdf
        :src="fileData"
        @rendered="renderedHandler"
        @error="errorHandler"
      />
    </div>
    <div v-else>
      <div style="margin-bottom: 20px">该附件类型无法预览, 请下载后查看</div>
      <el-button type="primary" @click="handleDownload">下载附件</el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { downloadFile } from "@/api/plan/feishu";
import { ref, onMounted, watch, reactive } from "vue";
import getFileType from "@/utils/getFileType";
//引入VueOfficeDocx组件
import VueOfficeDocx from "@vue-office/docx";
//引入相关样式
import "@vue-office/docx/lib/index.css";
//引入VueOfficePdf组件
import VueOfficePdf from "@vue-office/pdf";
//引入VueOfficeExcel组件
import VueOfficeExcel from "@vue-office/excel";
//引入相关样式
import "@vue-office/excel/lib/index.css";
const props = defineProps(["file"]);
const word = ref(null);
const state = reactive({
  type: "",
  sheetData: [],
});
const loading = ref(false);
const handleClose = () => {};
const fileData = ref("");
const loadExcel = (file) => {
  console.log(loading.value);
  const formData = new FormData();
  formData.append("fileUrl", file);
  downloadFile(formData).then(({ data }) => {
    console.log(data);
    data.arrayBuffer().then((res) => {
      fileData.value = res;
      loading.value = false;
    });
  });
};
const renderedHandler = (e) => {
  console.log("渲染完成", e);
};
const errorHandler = (e) => {
  console.log("渲染完成", e);
};

// 附件下载
const handleDownload = () => {
  const formData = new FormData();
  formData.append("fileUrl", props.file);
  downloadFile(formData).then((res) => {
    const blob = new Blob([res.data], {
      type: getFileType(props.file),
    });
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = "附件";
    a.href = objectUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
};

//监听当前显示的文件路径，判断属于哪一种类型
watch(
  () => props.file,
  (nval) => {
    const index = nval.lastIndexOf(".");
    const ext = nval.substring(index + 1);
    loading.value = true;
    if (
      ext === "png" ||
      ext === "jpg" ||
      ext === "jpeg" ||
      ext === "bmp" ||
      ext === "gif" ||
      ext === "webp" ||
      ext === "psd" ||
      ext === "svg" ||
      ext === "tiff"
    ) {
      state.type = "image";
    } else if (ext === "pdf") {
      state.type = "pdf";
      loadExcel(props.file);
    } else if (ext == "xlsx") {
      state.type = "excel";
      loadExcel(props.file);
    } else if (ext == "docx") {
      //ext == "doc" ||
      state.type = "doc";
      loadExcel(props.file);
    } else {
      state.type = "";
    }

    console.log(state.type);
  },
  { immediate: true }
);
</script>

<style lang="css">
/* .child {
  width: 100%;
  height: calc(100vh - 70px);
  border: 0;
}

.dialog-box >>> .el-dialog__headerbtn {
  font-size: 34px;
  left: 200px;
  background-color: aqua;
}

::v-deep .el-dialog {
  left: 200px;
  width: calc(100% - 200px);
  height: calc(100vh - 0px);
  margin: 0;
}
 ::v-deep .el-dialog__body {
  padding: 0;
  height: calc(100vh - 70px);
  .picBox {
    height: 100%;
    .chile {
      height: 100%;
      height: calc(100vh - 70px);
    }
  }
}  */
</style>
