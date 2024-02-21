<template>
  <div style="margin-top: 20px">
    <el-table
      :data="datalist"
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '50px' }"
      :border="true"
      style="width: 100%"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{
        'text-align': 'center',
      }"
    >
      <el-table-column
        type="index"
        label="序号"
        width="60"
        :index="(e) => e + 1 + (queryParams.pageNo - 1) * queryParams.pageSize"
      />
      <el-table-column prop="projectNum" label="所属项目编号" />
      <el-table-column prop="projectName" label="所属项目名称">
        <template #default="scope">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="scope.row.projectName"
            placement="top-start"
          >
            {{
              scope.row.projectName && scope.row.projectName > 6
                ? scope.row.projectName.substring(0, 6) + "..."
                : scope.row.projectName
            }}
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="createByUsername" label="上传人" />
      <el-table-column prop="excamineType" label="审批类型" />
      <el-table-column prop="allProjectName" label="所属科目">
        <template #default="scope">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="scope.row.allProjectName"
            placement="top-start"
          >
            {{
              scope.row.allProjectName && scope.row.allProjectName.length > 7
                ? scope.row.allProjectName.substring(0, 7) + "..."
                : scope.row.allProjectName
            }}
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="申请时间" width="100" />
      <el-table-column prop="payAmount" label="金额" />
      <el-table-column prop="payAfterAmount" label="付款金额" />
      <el-table-column prop="amountToBePaid" label="待付款金额" />
      <el-table-column prop="getMonth" label="所属月份" />
      <el-table-column prop="applicationNotes" label="付款事由">
        <template #default="scope">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="scope.row.applicationNotes"
            placement="top-start"
          >
            {{
              scope.row.applicationNotes &&
              scope.row.applicationNotes.length > 7
                ? scope.row.applicationNotes.substring(0, 7) + "..."
                : scope.row.applicationNotes
            }}
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="examineTime" label="审批时间" width="100" />
      <el-table-column prop="examineStatus" label="付款状态">
        <template #default="scope">
          <div v-for="(item, index) in props.carefulList" :key="index">
            <div v-if="item.value === scope.row.examineStatus">
              {{ item.label }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="examineRemake" label="备注">
        <template #default="scope">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="scope.row.examineRemake"
            placement="top-start"
          >
            {{
              scope.row.examineRemake && scope.row.examineRemake.length > 7
                ? scope.row.examineRemake.substring(0, 7) + "..."
                : scope.row.examineRemake
            }}
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="paymentMemos" label="付款备注">
        <template #default="scope">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="scope.row.paymentMemos"
            placement="top-start"
          >
            {{
              scope.row.paymentMemos && scope.row.paymentMemos.length > 7
                ? scope.row.paymentMemos.substring(0, 7) + "..."
                : scope.row.paymentMemos
            }}
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="payTime" label="付款时间" width="100" />
      <el-table-column prop="paymentAttachments" label="付款附件">
        <template #default="scope">
          <div v-if="scope.row.paymentAttachments">
            <el-button text type="primary" @click="handleDownload(scope.row)">
              下载
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            v-if="
              scope.row.examineStatus === 1 || scope.row.examineStatus === 6
            "
            type="primary"
            @click="payment(scope.row)"
            link
            >付款</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="yeshu">
      <pagination
        v-if="queryParams.total > 0"
        v-model:total="queryParams.total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getpayList"
      />
    </div>
    <el-dialog
      v-model="dialogFormVisible"
      title="付款"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="form">
        <el-form-item label="付款金额" :label-width="formLabelWidth">
          <el-input
            style="width: 300px"
            v-model="form.amount"
            type="number"
            placeholder="请输入付款金额"
          />
        </el-form-item>
        <el-form-item label="付款备注" :label-width="formLabelWidth">
          <el-input
            style="width: 300px"
            maxlength="1000"
            placeholder="请输入所需支持描述"
            show-word-limit
            type="textarea"
            v-model="form.paymentMemos"
            :autosize="{ minRows: 6, maxRows: 8 }"
          />
        </el-form-item>
        <el-form-item label="付款附件" :label-width="formLabelWidth">
          <el-upload
            v-loading="loading"
            v-model:file-list="form.fileList"
            class="upload-demo"
            :data="uploadData"
            action=""
            :http-request="upload"
            multiple
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-success="handleSuccess"
            :limit="1"
            :on-exceed="handleExceed"
            :show-file-list="true"
          >
            <el-button text type="primary">上传附件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="confirm"> 确认已付款 </el-button>
          <el-button @click="dialogFormVisible = false">返回</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import { getstatusPage, getediteMoney } from "@/api/payment";
import type { UploadProps } from "element-plus";
import { createFeishuUpload } from "@/api/plan/feishu/index";
import Bus from "../js/Bus";
//表格数据
const datalist = ref([]);
//弹框状态
const dialogFormVisible = ref(false);
//表单间隔
const formLabelWidth = "140px";
//表单数据
const form = reactive({
  payAfterAmount: 0,
  amountToBePaid: 0,
  uploadshow: true,
  fileCode: "",
  cosUrl: "",
  fileList: [],
  paymentMemos: "",
  amount: "",
  id: "",
});
// 加载状态
const loading = ref(false);
//上传文件
const uploadData = ref({
  name: "文件",
  type: "attachment",
});
//传递过来的数据
const props = defineProps({
  headerdata: {
    type: Object,
    default: {},
  },
  carefulList: {
    type: Object,
    default: {},
  },
});
//搜索条件
const queryParams = ref({
  total: 0,
  pageNo: 1,
  pageSize: 10,
  createBy: "",
  projectId: "",
  projectName: "",
  startTime: "",
  endTime: "",
  examineStatus: null,
});
//序号
const indexMethod: any = (index: number) => {
  return index * 1 + 1;
};
//上传附件
const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  console.log(uploadFile);
};
//删除上传文件
const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  form.uploadshow = true;
};
//文件上传格式
const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(`只能上传一个附件，请先删除，在重新上传`);
};
//文件上传提交成功
const handleSuccess: UploadProps["onSuccess"] = (res, uploadFile) => {
  console.log(res, uploadFile);
};
//删除上传文件
const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(`是否删除文件 ${uploadFile.name} ?`).then(
    () => true,
    () => false
  );
};
//上传文件
const upload = (param: any) => {
  loading.value = true;
  form.uploadshow = false;
  const formData = new FormData();
  formData.set("content", param.file);
  formData.set("type", "attachment");
  formData.set("name", param.file.name);
  createFeishuUpload(formData).then((res: any) => {
    if (JSON.parse(res.msg).data.code) {
      loading.value = false;
      form.fileCode = JSON.parse(res.msg).data.code;
    }
    form.cosUrl = JSON.parse(res.msg).data.url;
    console.log(JSON.parse(res.msg).data.url, "JSON.parse(res.msg).cos_url");
  });
};

// 附件下载
const handleDownload = (event: any) => {
  console.log(event.paymentAttachments, "xx");
  let a = document.createElement("a");
  document.body.appendChild(a);
  a.href = event.paymentAttachments;
  a.download = "模板" + ".xlsx";
  a.style.display = "none";
  a.click();
  document.body.removeChild(a);
};
//重置
Bus.on("reseting", (row: any) => {
  if (row) {
    queryParams.value.pageNo = 1;
    queryParams.value.createBy = "";
    queryParams.value.projectId = "";
    queryParams.value.projectName = "";
    queryParams.value.startTime = "";
    queryParams.value.endTime = "";
    queryParams.value.examineStatus = null;
    getpayList();
  }
});
//付款
const payment = (row: any) => {
  form.amountToBePaid = row.amountToBePaid;
  form.payAfterAmount = row.payAfterAmount;
  form.amount = row.payAmount;
  form.id = row.id;
  dialogFormVisible.value = true;
  form.paymentMemos = "";
  form.cosUrl = "";
  form.fileList = [];
  form.fileCode = "";
};
//确认已付款
const confirm = () => {
  console.log(form.amount, "form.amount");
  if (!form.amount) {
    return ElMessage.error("请输入确认付款金额");
  }
//   if (Number(form.amount) > form.amountToBePaid) {
//     return ElMessage.error("付款金额超出,请重新输入");
//   } else {
    const data = {
      id: form.id,
      money: form.amount,
      paymentMemos: form.paymentMemos,
      paymentAttachments: form.cosUrl,
    };
    getediteMoney(data).then((res: any) => {
      if (res.code === 200) {
        ElMessage.success("付款成功");
        dialogFormVisible.value = false;
        getpayList();
      }
    });
//   }
};
//搜索
Bus.on("serchList", (row: any) => {
  if (row) {
    queryParams.value.createBy = row.createByUsername;
    (queryParams.value.projectId = row.code),
      (queryParams.value.projectName = row.name),
      (queryParams.value.startTime = row.examineTime[0]),
      (queryParams.value.endTime = row.examineTime[1]),
      (queryParams.value.examineStatus = row.excamineType);
    getpayList();
  }
});
//获取列表
const getpayList = () => {
  let data = {
    pageNo: queryParams.value.pageNo,
    pageSize: queryParams.value.pageSize,
    createBy: queryParams.value.createBy,
    projectId: queryParams.value.projectId,
    projectName: queryParams.value.projectName,
    startTime: queryParams.value.startTime,
    endTime: queryParams.value.endTime,
    examineStatus: queryParams.value.examineStatus,
  };
  getstatusPage(data).then((res: any) => {
    datalist.value = res.data.records;
    queryParams.value.total = res.data.total;
  });
};
onMounted(() => {
  getpayList();
});
</script>
<style lang="scss" scoped>
@import "../css/index.scss";
</style>
