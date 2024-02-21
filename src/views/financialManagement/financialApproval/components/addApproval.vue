<template>
  <el-dialog title="审批" width="1200px" style="padding: 10px" align-center>
    <proTable
      :tableHeader="tableHeaderData"
      :isMoreSelect="false"
      :isShowIndex="false"
      :tableData="[tableData]"
      :totalNum="total"
      :isShowPagination="false"
    >
      <template v-slot:default="{ rows, cols }">
        <div v-if="cols.props == 'file'">
          <el-button
            v-if="rows.file"
            type="primary"
            @click="clickDownloadFile(rows.file)"
            link
          >
            下载
          </el-button>
          <div v-else>暂无附件</div>
        </div>
        <!-- 过滤一些内容-->
        <span v-else>
          {{ rows[cols.props] }}
        </span>
      </template>
    </proTable>
    <el-form
      ref="approvalFormRef"
      :model="approvalForm"
      :rules="rules"
      label-width="150px"
    >
      <el-form-item label="审批意见: " prop="examineStatus">
        <el-radio-group
          v-model="approvalForm.examineStatus"
          class="ml-4"
          @change="approvalForm.examineRemake = ''"
        >
          <el-radio :label="1">同意</el-radio>
          <el-radio :label="2">不同意</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="approvalForm.examineStatus != '1'"
        label="审批备注: "
        prop="examineRemake"
      >
        <el-input
          type="textarea"
          v-model="approvalForm.examineRemake"
          style="width: 320px"
          :rows="5"
        />
      </el-form-item>

      <div
        class="btn"
        style="display: flex; justify-content: right; margin: 30px 30px 0"
      >
        <el-button type="primary" @click="approvalClick">确认</el-button>
        <el-button type="info" @click="$emit('reset')"> 取消 </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import proTable from "@/components/myTable/table.vue";
import { reserveFundApproval } from "../api/index";
import { downloadFile } from "@/api/plan/feishu";
import { download } from "@/utils/getFileType";
const props = defineProps(["tableData", "userEnums"]);
const emits = defineEmits(["reset"]);
// Table表头
const tableHeaderData = [
  {
    label: "上传人",
    props: "createByUsername",
    enums: {
      enums: props.userEnums,
      value: "username",
      label: "name",
    },
  },
  { label: "审批类型", props: "excamineType" },
  { label: "所属科目", props: "subject", width: "200" },
  { label: "申请时间", props: "paymentDate" },
  { label: "付款金额", props: "payAmount" },
  { label: "所属月份", props: "getMonth" },
  { label: "附件", props: "file" },
  { label: "付款事由", props: "applicationNotes" },
  { label: "上传时间", props: "createTime" },
];
// form规则
const rules = reactive({
  examineStatus: [
    { required: true, message: "请选择审批意见", trigger: "blur" },
  ],
});
// 下载
const clickDownloadFile = (url) => {
  const formData = new FormData();
  formData.append("fileUrl", url);
  downloadFile(formData).then((res) => {
    download(res, url);
  });
};
// 审批form
const approvalForm = ref({
  examineStatus: "",
  examineRemake: "",
});
// 审批form ref
const approvalFormRef = ref(null);

// 审批按钮
const approvalClick = async (row) => {
  if (approvalFormRef.value) approvalFormRef.value.validate();
  console.log(approvalForm.value);
  reserveFundApproval({
    id: props.tableData.id,
    status: approvalForm.value.examineStatus,
    text: approvalForm.value.examineRemake,
  }).then(({ code, msg }) => {
    if (code === 200)
      ElMessage({
        type: "success",
        message: msg,
      });
    emits("reset");
  });
};

onMounted(() => {
  approvalForm.value.examineStatus = props.tableData.examineStatus;
  approvalForm.value.examineRemake = props.tableData.examineRemake;
});
</script>

<style></style>
