<template>
  <el-dialog
    title="立项审批"
    width="70%"
    :append-to-body="true"
    :destroy-on-close="true"
    :before-close="$emit('queryList')"
  >
    <div class="head">
      <div class="details-title"></div>
      <div class="details-item">
        <div>项目名称：{{ details.projectName }}</div>
        <div>
          项目资金来源：<span
            v-for="(item, index) in options.projectSourceFundsOptions"
            :key="index"
            ><span v-if="item.value === details.projectSourceFunds">{{
              item.label
            }}</span></span
          >
        </div>
        <div>
          所属区域：<span v-for="(item, index) in details.area" :key="index"
            ><span>{{ item + "," }}</span></span
          >
        </div>
        <div>客户名称：{{ details.customerName }}</div>
        <div>预合同金额（万）：{{ details.prepareContractAmount }}万</div>
        <div>销售人员：{{ details.salesperson }}</div>
        <div>
          项目优先级：<span
            v-for="(item, index) in options.priorityOptions"
            :key="index"
            ><span v-if="item.value === details.projectFirstLevel">{{
              item.label
            }}</span></span
          >
        </div>
        <div>项目机会：{{ details.projectOpportunities }}</div>
      </div>
      <div class="details-item" v-if="handlingList.length > 0">
        <div
          v-for="(item, index) in handlingList"
          :key="index"
          style="display: flex"
        >
          <div>客户经办人：{{ item.linkman }}</div>
          <div>经办人职务：{{ item.contactPosition }}</div>
          <div>经办人联系方式：{{ item.contactWay }}</div>
        </div>
      </div>
      <div class="details-item" v-if="decisionmaking.length > 0">
        <div
          v-for="(item, index) in decisionmaking"
          :key="index"
          style="display: flex"
        >
          <div>客户决策人：{{ item.linkman }}</div>
          <div>决策人职务：{{ item.contactPosition }}</div>
          <div>决策人联系方式：{{ item.contactWay }}</div>
        </div>
      </div>
      <div class="details-item">
        <div>渠道：{{ details.channel }}</div>
        <div>项目进展：{{ details.projectProgress }}</div>
        <div>
          三板斧完成情况：
          <span
            v-for="(item, index) in details.threePlateAxeState"
            :key="index"
            >{{ item + "," }}</span
          >
        </div>
        <div>资金情况：{{ details.fundingSituation }}</div>
        <div>决策链分析：{{ details.decisionChainAnalysis }}</div>
        <div>预计成交时间：{{ details.estimatedClosingTime }}</div>
        <div>竞争对手：{{ details.competitor }}</div>
      </div>
    </div>
    <!-- <div class="tips">
      请确认是否招投标。确认后将流转至下一流程，并在"招投标管理"中展示该项目。
    </div> -->
    <el-divider></el-divider>
    <el-form
      v-if="$props.noticeType == 'THE_PROJECT_WAS_APPROVED'"
      ref="formDataAdd"
      :model="form"
      :rules="rules"
      label-width="140px"
    >
      <el-form-item label="是否通过立项: " prop="yesNo">
        <el-radio-group v-model="form.yesNo">
          <el-radio label="YES">是</el-radio>
          <el-radio label="NO">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.yesNo == 'NO'" label="审批意见: " prop="remake">
        <el-input
          v-model="form.remake"
          class="input"
          autocomplete="off"
          required="required"
          style="width: 230px"
          type="textarea"
        ></el-input>
      </el-form-item>
    </el-form>
    <div v-else class="head">
      <div class="details-item">
        是否通过立项:
        {{ props.formData.approvalIsStatus == "YES" ? "是" : "否" }}
      </div>
      <div v-if="props.formData.rejectReason" class="details-item">
        审批意见: {{ props.formData.rejectReason }}
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('reset')">取消</el-button>
        <el-button type="primary" @click="add"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import {
  getclientDetailsAbove,
  requestHandler,
  yesBuildProject,
} from "../api/index";
import { useRoute } from "vue-router";
const emits = defineEmits(["reset", "queryList"]);
const props = defineProps(["id", "noticeId", "noticeType", "formData"]);
//路由
const route = useRoute();
//售前支持id
const id = ref<any>("");
//详情对象
const details = ref<any>({});
//客户经办人
const handlingList = ref<any>([]);
//客户决策人
const decisionmaking = ref<any>([]);
//获取详情数据
const getDetails = () => {
  let data = {
    id: props.id,
  };
  getclientDetailsAbove(data).then((res: any) => {
    details.value = res.data;
  });
  requestHandler(data).then((res: any) => {
    if (res.code === 200) {
      res.data.map((v: any) => {
        if (v.type === "CUSTOMER_MANAGER") {
          handlingList.value.push(v);
        }
        if (v.type == "CUSTOMER_DECISION_MAKERS") {
          decisionmaking.value.push(v);
        }
      });
    }
  });
};
// 项目新增对象
const formDataAdd = ref(null);
// 项目信息form
const form = ref({
  remake: "",
  yesNo: "",
});
// form验证规则
const rules = reactive({
  // remake: [{ required: true, message: "请输入审批意见" }],
  yesNo: [{ required: true, message: "请选择是否通过立项" }],
});
// 新增招投标
const add = async () => {
  if (!form.value) {
    return;
  }
  try {
    await formDataAdd.value.validate();
    // 中标
    yesBuildProject({
      ...form.value,
      id: props.noticeId,
    }).then(({ msg }) => {
      ElMessage({
        message: msg,
        type: "success",
      });
      emits("reset");
    });
  } catch (err) {
    console.log(err);
  }
};

//枚举匹配
const options = ref({
  projectSourceFundsOptions: [{ value: "", label: "" }],
  priorityOptions: [{ value: "", label: "" }],
});
onMounted(() => {
  //获取优先级
  options.value.priorityOptions = JSON.parse(
    localStorage.getItem("priorityOptions") || ""
  );
  //获取项目资金来源
  options.value.projectSourceFundsOptions = JSON.parse(
    localStorage.getItem("projectSourceFundsOptions") || ""
  );
  //获取详情数据
  getDetails();
});
</script>
<style lang="scss" scoped>
@import "../css/details.scss";
</style>
