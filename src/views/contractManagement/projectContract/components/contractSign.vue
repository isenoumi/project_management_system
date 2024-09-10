<template>
  <el-dialog
    title="合同签订"
    width="70%"
    :destroy-on-close="true"
    :close-on-click-modal="false"
  >
    <div>
      <div style="font-size: 16px; font-weight: 700; margin: -20px 0 20px 0">
        项目信息
      </div>
      <div class="infoBox">
        <div class="title">项目名称：{{ projectForm.projectName }}</div>
        <!-- <div class="title">项目类型：{{ projectForm.projectType }}</div> -->
        <div class="title">
          项目资金来源：{{ projectForm.projectSourceFunds }}
        </div>
        <div class="title">所属公司：{{ projectForm.company }}</div>
        <div class="title" style="width: 300px">
          所属区域：{{ projectForm.area }}
        </div>
        <div class="title">客户名称：{{ projectForm.customerName }}</div>
        <div class="title">客户联系人：{{ projectForm.customerContacts }}</div>
        <div class="title">
          预合同金额（万）：{{ projectForm.prepareContractAmount }}
        </div>
        <div class="title">销售人员：{{ projectForm.salesperson }}</div>
        <div class="title">项目优先级：{{ projectForm.projectFirstLevel }}</div>
        <div class="title">所属部门：{{ projectForm.department }}</div>
        <div class="title">所属业务线：{{ projectForm.lineOfBusiness }}</div>
        <div class="title">
          预计成交时间：{{ projectForm.expectedTransactionTime }}
        </div>
      </div>
      <div class="infoBox">
        <div class="title">中标主体：{{ projectForm.biddingMainName }}</div>
        <div class="title">标书份数：{{ projectForm.biddingDocumentsNum }}</div>
        <div class="title">招标预算：{{ projectForm.tenderBudgetNum }}</div>
        <div class="title" style="width: 300px">
          是否挂网：{{
            projectForm.spreadNetStatus
              ? projectForm.spreadNetStatus == "YES"
                ? "是"
                : "否"
              : ""
          }}
        </div>
        <div
          class="title"
          v-if="
            projectForm.spreadNetStatus && projectForm.spreadNetStatus == 'YES'
          "
        >
          开标时间：{{ projectForm.biddingOpenTime }}
        </div>
        <div
          class="title"
          v-if="
            projectForm.spreadNetStatus && projectForm.spreadNetStatus == 'NO'
          "
        >
          预计挂网时间：{{ projectForm.spreadNetTime }}
        </div>
      </div>
    </div>

    <div>
      <div style="font-size: 16px; font-weight: 700; margin: 20px 0 20px 0">
        招标信息
      </div>
      <div class="infoBox">
        <div class="title">挂网编号：{{ projectForm.spreadNetCode }}</div>
        <div class="title">中标金额：{{ projectForm.biddingHaveAmount }}</div>
        <!-- <div class="title">中标主体：{{ projectForm.company }}</div>
        <div class="title" style="width: 300px">
          开标时间：{{ projectForm.area }}
        </div> -->
      </div>
    </div>

    <div>
      <div style="font-size: 16px; font-weight: 700; margin: 20px 0 20px 0">
        合同信息
      </div>
      <div>
        <el-form
          ref="formDataAdd"
          :model="contarctFrom"
          :rules="rules"
          label-width="160px"
        >
          <div>
            <el-form-item label="合同签订金额（万元）: " prop="contractAmount">
              <el-input-number
                v-model="contarctFrom.contractAmount"
                class="input"
                autocomplete="off"
                :min="0"
              ></el-input-number>
            </el-form-item>
            <el-form-item
              label="合同签订时间: "
              prop="contractDate"
              style="width: 400px"
            >
              <el-date-picker
                v-model="contarctFrom.contractDate"
                type="datetime"
                placeholder="请选择日期"
                value-format="YYYY-MM-DD hh:mm:ss"
              />
            </el-form-item>
            <el-form-item label="工期: " prop="duration" style="width: 520px">
              <el-date-picker
                v-model="contarctFrom.duration"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD hh:mm:ss"
              />
            </el-form-item>
          </div>

          <el-form-item label="合同相关附件: " prop="contractFile">
            <div class="tipsBox">
              <fileUpload
                @get-file-url="getFileUrl"
                @setFileUrl="setFileUrl"
                :annex="contarctFrom.annex"
              ></fileUpload>
              <!-- <div class="tips">
                按照具体情况上传招标要求文件、投标响应文件、中标通知书等其他相关附件
              </div> -->
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('reset')">取消</el-button>
        <el-button type="primary " @click="addBidding">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onUpdated, onMounted } from "vue";
import { editProjectContract, getProjectInfo } from "../api/index";
import { myDict } from "@/utils/myDict.ts";
import fileUpload from "@/components/Upload/fileUpload.vue";
const myRow = ref({});
const formDataAdd = ref(null);
const emits = defineEmits(["reset"]);
const props = defineProps(["id", "isEdit", "formData"]);
// select下拉
const options = ref({});
// 项目信息form
const projectForm = ref({
  projectName: "",
  projectType: "",
  prepareContractAmount: "",
  area: "",
  customerName: "",
  customerContacts: "",
  projectSourceFunds: "",
  salesperson: "",
  projectFirstLevel: "",
  department: "",
  lineOfBusiness: "",
  expectedTransactionTime: "",
});
// 招投标表单
const contarctFrom = ref({
  projectName: "",
  projectType: "",
  projectSourceFunds: "",
  area: "",
  customerName: "",
  customerContacts: "",
  contractAmount: "",
  personnel: "",
  reason: "",
  duration: "",
  contractDate: "",
  executiveProjectLeader: "",
  annex: "",
  contractFile: "",
});
// form 验证规则
const rules = ref({
  // projectName: [{ required: true, message: "请输入挂网编号" }],
  contractAmount: [{ required: true, message: "请输入合同签订金额" }],
  // personnel: [{ required: true, message: "请选择销售人员" }],
  contractDate: [{ required: true, message: "请选择合同签订时间" }],
});
// 新增招投标
const addBidding = async () => {
  if (!contarctFrom.value) {
    return;
  }
  try {
    await formDataAdd.value.validate();
    const data = {
      id: props.id,
      contractAmount: contarctFrom.value.contractAmount,
      contractDate: contarctFrom.value.contractDate,
      contractFile: contarctFrom.value.annex,
      durationStartTime: contarctFrom.value.duration[0],
      durationEndTime: contarctFrom.value.duration[1],
    };

    editProjectContract(data).then(({ msg }) => {
      ElMessage({
        message: msg,
        type: "success",
      });
      emits("reset");
    });
  } catch (err) {}
};

// 附件链接url
const getFileUrl = (value) => {
  contarctFrom.value.annex += "," + value.msg;
};

// 回显附件链接url
const setFileUrl = (value) => {
  contarctFrom.value.annex = value;
};
const changeVisible = ref(false);
// 操作记录表格
const operationRecordsTableData = ref([]);

// 查看项目信息
const openLog = (row) => {
  changeVisible.value = true;
  myRow.value = row;
};

onMounted(() => {
  options.value.typeOptions = JSON.parse(localStorage.getItem("typeOptions"));
  options.value.priorityOptions = JSON.parse(
    localStorage.getItem("priorityOptions")
  );
  getProjectInfo({ id: props.id }).then((res) => {
    console.log(res);
    projectForm.value = res.data;
    myDict(projectForm.value);
  });
  if (props.isEdit) {
    contarctFrom.value.contractAmount = props.formData.contractAmount;
    contarctFrom.value.contractDate = props.formData.contractDate;
    contarctFrom.value.annex = props.formData.contractFile;
    contarctFrom.value.duration = [
      props.formData.durationStartTime,
      props.formData.durationEndTime,
    ];
  }
});
</script>

<style scoped lang="scss">
@import "../css/contractDetails.scss";
</style>
