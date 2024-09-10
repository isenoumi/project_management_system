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
      <div class="title">中标主体: {{ projectInfo.estimatedClosingTime }}</div>
      <div class="title">标书份数: {{ projectInfo.estimatedClosingTime }}</div>
      <div class="title">招标预算：{{ projectInfo.estimatedClosingTime }}</div>
      <div class="title">是否挂网：{{ projectInfo.estimatedClosingTime }}</div>
      <div class="title">开标时间：{{ projectInfo.estimatedClosingTime }}</div>
      <div class="title">
        预计挂网时间：{{ projectInfo.estimatedClosingTime }}
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
        <el-form-item label="招标状态: " v-if="isEdit" prop="biddingStatus">
          <el-radio-group v-model="biddingFrom.biddingStatus" class="ml-4">
            <el-radio label="WINNINGBIDDER">中标</el-radio>
            <el-radio label="NOTWINNINGTHEBID">未中标</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="biddingFrom.biddingStatus == 'WINNINGBIDDER'">
          <el-form-item label="项目名称: " prop="projectName">
            <el-input
              v-model="biddingFrom.projectName"
              class="input"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="项目类型: " prop="projectType">
            <el-select
              v-model="biddingFrom.projectType"
              :multiple="true"
              placeholder="请选择内容"
              clearable
            >
              <el-option
                v-for="item in options.typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item label="项目资金来源: " prop="projectSourceFunds">
            <el-select
              v-model="biddingFrom.projectSourceFunds"
              placeholder="请选择内容"
            >
              <el-option
                v-for="item in options.projectSourceFundsOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属区域: " prop="area">
            <el-cascader
              v-model="biddingFrom.area"
              ref="cascaderAddr"
              :options="cityData"
              :props="cityProps"
              placeholder="请选择省市区"
              @change="handleAddrChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="客户名称: " prop="customerName">
            <el-input
              v-model="biddingFrom.customerName"
              class="input"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="客户联系人: " prop="customerContacts">
            <el-input
              v-model="biddingFrom.customerContacts"
              class="input"
              autocomplete="off"
            ></el-input>
          </el-form-item> -->
          <el-form-item label="合同金额（万）: " prop="contractAmount">
            <el-input
              v-model="biddingFrom.contractAmount"
              class="input"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="合同签订时间: "
            prop="contractTime"
            style="width: 400px"
          >
            <el-date-picker
              v-model="biddingFrom.contractTime"
              type="datetime"
              placeholder="请选择日期"
              value-format="YYYY-MM-DD hh:mm:ss"
            />
          </el-form-item>
          <el-form-item label="工期: " prop="duration" style="width: 520px">
            <el-date-picker
              v-model="biddingFrom.duration"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD hh:mm:ss"
            />
          </el-form-item>
          <el-form-item label="项目执行经理: " prop="executiveProjectLeader">
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
          <el-form-item label="项目成员: " prop="projectMember">
            <el-select
              v-model="biddingFrom.projectMember"
              placeholder="请选择内容"
              :multiple="true"
              clearable
              filterable
            >
              <el-option
                v-for="item in options.executiveProjectLeaderOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="未中标原因分析: " prop="reason">
            <el-input
              v-model="biddingFrom.reason"
              :rows="10"
              type="textarea"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="招投标相关附件: " prop="biddingStatus">
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
  contractAmount: "",
  personnel: "",
  biddingStatus: "WINNINGBIDDER",
  reason: "",
  duration: "",
  contractTime: "",
  executiveProjectLeader: "",
  annex: "",
  projectMember: [],
});

// form 验证规则
const rules = ref({
  projectName: [{ required: true, message: "请输入项目名称" }],
  projectType: [{ required: true, message: "请选择项目类型" }],
  projectSourceFunds: [{ required: true, message: "请选择项目资金来源" }],
  area: [{ required: true, message: "请选择所属区域" }],
  customerName: [{ required: true, message: "请输入客户名称" }],
  // customerContacts: [{ required: true, message: "请输入客户联系人" }],
  contractAmount: [{ required: true, message: "请输入合同金额" }],
  personnel: [{ required: true, message: "请选择销售人员" }],
  // contractTime: [{ required: true, message: "请选择合同签订时间" }],
  // duration: [{ required: true, message: "请选择工期" }],
  // executiveProjectLeader: [{ required: true, message: "请选择项目执行经理" }],
  reason: [{ required: true, message: "请输入未中标原因" }],
  // projectMember: [{ required: true, message: "请选择项目成员" }],
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
    let duration = "";
    if (biddingFrom.value.duration)
      duration =
        biddingFrom.value.duration[0] + " - " + biddingFrom.value.duration[1];
    const data = {
      projectType: biddingFrom.value.projectType,
      id: props.id,
      duration,
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
    };
    if (props.isEdit) {
      // 中标
      if (biddingFrom.value.biddingStatus == "WINNINGBIDDER") {
        biddingPost(data).then(({ msg }) => {
          ElMessage({
            message: msg,
            type: "success",
          });
          emits("reset");
        });
      } else {
        // 未中标
        biddingPost({
          id: props.id,
          biddingStatus: biddingFrom.value.biddingStatus,
          result: biddingFrom.value.reason,
          annex: biddingFrom.value.annex,
        }).then(({ msg }) => {
          ElMessage({
            message: msg,
            type: "success",
          });
          emits("reset");
        });
      }
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
