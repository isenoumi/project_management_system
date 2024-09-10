<template>
  <el-dialog
    width="60%"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <div class="closeIcon" @click="$emit('biddingClose')">X</div>
    <div class="boxTitle">项目信息</div>
    <div class="infoBox">
      <div class="title">项目名称：{{ projectInfo.projectName }}</div>
      <!-- <div class="title">项目类型：{{ projectInfo.projectType }}</div> -->
      <div class="title">
        项目资金来源：{{ projectInfo.projectSourceFunds }}
      </div>
      <div class="title" style="width: 300px">
        所属区域：{{ projectInfo.area }}
      </div>
      <div class="title">客户名称：{{ projectInfo.customerName }}</div>
      <!-- <div class="title">客户联系人：{{ projectInfo.customerContacts }}</div> -->
      <div class="title">
        预合同金额（万）：{{ projectInfo.prepareContractAmount }}
      </div>
      <div class="title">销售人员：{{ projectInfo.salesperson }}</div>
      <div class="title">所属部门：{{ projectInfo.department }}</div>
      <div class="title">所属业务线：{{ projectInfo.lineOfBusiness }}</div>
      <div class="title">
        <!-- 预计成交时间：{{ projectInfo.expectedTransactionTime }} -->
        预计成交时间：{{ projectInfo.estimatedClosingTime }}
      </div>
      <el-divider />
      <div class="title">中标主体: {{ projectInfo.biddingMainName }}</div>
      <div class="title">标书份数: {{ projectInfo.biddingDocumentsNum }}</div>
      <div class="title">招标预算：{{ projectInfo.tenderBudgetNum }}</div>
      <div class="title">
        是否挂网：{{ projectInfo.spreadNetStatus == "YES" ? "是" : "否" }}
      </div>
      <div v-if="projectInfo.spreadNetStatus == 'YES'" class="title">
        开标时间：{{ projectInfo.biddingOpenTime }}
      </div>
      <div v-else class="title">
        预计挂网时间：{{ projectInfo.spreadNetTime }}
      </div>
    </div>

    <div class="boxTitle">招投标信息</div>
    <div>
      <el-form
        ref="formDataAdd"
        :model="biddingFrom"
        :rules="rules"
        label-width="140px"
      >
        <div>
          <el-form-item label="挂网编号: " prop="spreadNetCode">
            <el-input
              v-model="biddingFrom.spreadNetCode"
              class="input"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="中标金额（万）: " prop="biddingHaveAmount">
            <el-input-number
              v-model="biddingFrom.biddingHaveAmount"
              class="input"
              autocomplete="off"
              :min="0"
            ></el-input-number>
          </el-form-item>
          <!-- <el-form-item label="中标主体: " prop="executiveProjectLeader">
            <el-select
              v-model="biddingFrom.executiveProjectLeader"
              placeholder="请选择内容"
              clearable
            >
              <el-option
                v-for="item in options.executiveProjectLeaderOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="开标时间: "
            prop="contractTime"
            style="width: 400px"
          >
            <el-date-picker
              v-model="biddingFrom.contractTime"
              type="datetime"
              placeholder="请选择日期"
              value-format="YYYY-MM-DD hh:mm:ss"
            />
          </el-form-item> -->
        </div>
        <el-form-item label="招投标相关附件: " prop="">
          <div class="tipsBox">
            <fileUpload
              @get-file-url="getFileUrl"
              @setFileUrl="setFileUrl"
              :annex="fileUrl"
            ></fileUpload>
            <div class="tips">
              按照具体情况上传招标要求文件、投标响应文件、中标通知书等其他相关附件
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('reset')">取消</el-button>
        <el-button type="primary" @click="addBidding"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import fileUpload from "@/components/Upload/fileUpload.vue";
import { biddingPost, biddingEdit } from "@/api/bidding/index";
import {
  enumProjectType,
  enumProjectStatus,
  enumProjectFirst,
} from "@/api/enum/index";
import cityData from "@/assets/json/pcas-code.json";
import { myDict } from "@/utils/myDict";
// 地区select对象
const cascaderAddr = ref(null);
const cityProps = ref({
  value: "name", // 指定选项的 值 为选项对象的某个属性值
  label: "name", // 指定选项 标签 为选项对象的某个属性值
  children: "children", //指定选项的 子选项 为选项对象的某个属性值
  checkStrictly: true,
});
const emits = defineEmits(["reset", "biddingClose"]);
const props = defineProps(["formInfo", "id", "isEdit"]);
// from表单对象
const formDataAdd = ref(null);
// 文件链接
const fileUrl = ref("");
// 项目信息
const projectInfo = ref({});
// select下拉以及枚举
const options = ref({
  typeOptions: [{ value: "", label: "" }],
  statusOptions: [{ value: "", label: "" }],
  areaOptions: [{ value: "", label: "" }],
  priorityOptions: [{ value: "", label: "" }],
  projectSourceFundsOptions: [{ value: "专项资金", label: "专项资金" }],
  executiveProjectLeaderOptions: [],
});
// 招投标表单
const biddingFrom = ref({
  projectName: "",
  projectType: "",
  projectSourceFunds: "",
  area: "",
  customerName: "",
  customerContacts: "",
  contractAmount: 0,
  personnel: "",
  biddingStatus: "WINNINGBIDDER",
  reason: "",
  duration: "",
  contractTime: "",
  executiveProjectLeader: "",
  annex: "",
  projectMember: [],
  spreadNetCode: "",
  biddingHaveAmount: 0,
});

// form 验证规则
const rules = ref({
  projectName: [{ required: true, message: "请输入挂网编号" }],
  contractAmount: [{ required: true, message: "请输入中标金额" }],
  personnel: [{ required: true, message: "请选择销售人员" }],
  contractTime: [{ required: true, message: "请选择开标时间" }],
});
// 地区选择
const handleAddrChange = (e) => {
  let addrNode = unref(cascaderAddr).getCheckedNodes()[0].pathLabels;
};

// 新增招投标
const addBidding = async () => {
  if (!biddingFrom.value) {
    return;
  }
  try {
    await formDataAdd.value.validate();
    const data = {
      projectType: biddingFrom.value.projectType,
      id: props.id,
      executiveProjectLeader: biddingFrom.value.executiveProjectLeader,
      projectSourceFunds: biddingFrom.value.projectSourceFunds,
      customerName: biddingFrom.value.customerName,
      customerContacts: biddingFrom.value.customerContacts,
      area: biddingFrom.value.area,
      contractAmount: biddingFrom.value.contractAmount,
      contractTime: biddingFrom.value.contractTime,
      biddingStatus: biddingFrom.value.biddingStatus,
      projectId: biddingFrom.value.projectId,
      projectName: biddingFrom.value.projectName,
      annex: biddingFrom.value.annex,
      projectMember: biddingFrom.value.projectMember,
      biddingHaveAmount: biddingFrom.value.biddingHaveAmount,
      spreadNetCode: biddingFrom.value.spreadNetCode,
    };
    if (props.isEdit) {
      biddingPost(data).then(({ msg }) => {
        ElMessage({
          message: msg,
          type: "success",
        });
        emits("reset");
      });
    } else {
      biddingEdit(data).then(({ msg }) => {
        ElMessage({
          message: msg,
          type: "success",
        });
        emits("reset");
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// 附件链接url
const getFileUrl = (value: any) => {
  biddingFrom.value.annex += "," + value.msg;
};

// 回显附件链接url
const setFileUrl = (value: any) => {
  biddingFrom.value.annex = value;
};

watch(
  props,
  (n, o) => {
    projectInfo.value = myDict(JSON.parse(JSON.stringify(props.formInfo)));
    if (!props.isEdit) {
      biddingFrom.value = JSON.parse(JSON.stringify(props.formInfo));
      // console.log(biddingFrom.value.duration.split(" - "));
      if (biddingFrom.value.duration) {
        biddingFrom.value.duration = biddingFrom.value.duration.split(" - ");
      }
      fileUrl.value = biddingFrom.value.annex;
      console.log("biddingFrom.value,", biddingFrom.value);
    } else {
      Object.assign(
        biddingFrom.value,
        JSON.parse(JSON.stringify(props.formInfo))
      );
      if (biddingFrom.value.duration) {
        biddingFrom.value.duration = biddingFrom.value.duration.split(" - ");
      }
      biddingFrom.value.biddingStatus = "WINNINGBIDDER";
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

onMounted(() => {
  enumProjectType().then(({ data }) => {
    options.value.typeOptions = data;
  });
  enumProjectStatus().then(({ data }) => {
    options.value.statusOptions = data;
  });
  enumProjectFirst().then(({ data }) => {
    options.value.priorityOptions = data;
  });
  options.value.projectSourceFundsOptions = JSON.parse(
    localStorage.getItem("projectSourceFundsOptions")
  );
  options.value.executiveProjectLeaderOptions = JSON.parse(
    localStorage.getItem("executiveProjectLeaderOptions")
  );
});
</script>

<style scoped lang="scss">
@import "../css/addproject.scss";
</style>
