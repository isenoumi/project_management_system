<template>
  <el-dialog
    :title="'新建项目'"
    width="1300px"
    :destroy-on-close="true"
    :append-to-body="true"
  >
    <el-form
      ref="formDataAdd"
      :model="projectForm"
      :rules="rules"
      label-width="140px"
    >
      <div
        style="
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          align-items: center;
        "
      >
        <el-form-item label="项目名称: " prop="projectName">
          <el-input
            v-model="projectForm.projectName"
            class="input"
            autocomplete="off"
            required="required"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属公司: " prop="company">
          <el-select
            v-model="projectForm.company"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in options.companyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="伏泰总部项目编号: " prop="headquartersProjectId">
          <el-input
            v-model="projectForm.headquartersProjectId"
            class="input"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属业务线: " prop="lineOfBusiness">
          <el-select
            v-model="projectForm.lineOfBusiness"
            :multiple="true"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in options.lineOfBusinessOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门: " prop="department">
          <el-select
            v-model="projectForm.department"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in options.departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目资金来源: " prop="projectSourceFunds">
          <el-select
            v-model="projectForm.projectSourceFunds"
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
            v-model="projectForm.area"
            ref="cascaderAddr"
            :options="cityData"
            :props="cityProps"
            placeholder="请选择省市区"
            @change="handleAddrChange"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="预合同金额（万）: " prop="prepareContractAmount">
          <el-input-number
            v-model="projectForm.prepareContractAmount"
            class="input"
            required="required"
            :min="0.1"
            :precision="2"
            :step="0.1"
          />
        </el-form-item>
        <el-form-item label="项目类型: " prop="projectType">
          <el-select
            v-model="projectForm.projectType"
            :multiple="true"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in options.typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售人员: " prop="salesperson">
          <el-select
            v-model="projectForm.salesperson"
            placeholder="请选择内容"
            clearable
            filterable
          >
            <el-option
              v-for="item in options.salespersonOptions"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目优先级: " prop="projectFirstLevel">
          <el-select
            v-model="projectForm.projectFirstLevel"
            placeholder="请选择内容"
            clearable
          >
            <el-option
              v-for="item in options.priorityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目机会: " prop="projectOpportunities">
          <el-input
            v-model="projectForm.projectOpportunities"
            class="input"
            autocomplete="off"
            required="required"
            type="textarea"
          ></el-input>
        </el-form-item>
      </div>

      <el-divider></el-divider>

      <div
        class="customer"
        v-for="(item, index) in projectForm.operatorList"
        :key="index"
      >
        <el-form-item
          label="客户经办人: "
          :prop="'operatorList.' + index + '.linkman'"
        >
          <el-input
            v-model="item.linkman"
            class="input"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="经办人职务: "
          :prop="'operatorList.' + index + '.contactPosition'"
        >
          <el-input
            v-model="item.contactPosition"
            class="input"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="经办人联系方式: "
          :prop="'operatorList.' + index + '.contactWay'"
        >
          <el-input
            v-model="item.contactWay"
            class="input"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <div class="btnList">
          <el-button
            type="primary"
            v-if="projectForm.operatorList.length - 1 == index"
            @click="addFormList('CUSTOMER_MANAGER')"
            >新增</el-button
          >
          <el-button
            v-if="projectForm.operatorList.length > 1"
            @click.prevent="removeFormList(item, 'CUSTOMER_MANAGER')"
            >删除</el-button
          >
        </div>
      </div>
      <el-divider></el-divider>
      <div
        class="customer"
        v-for="(item, index) in projectForm.decisionList"
        :key="index"
      >
        <el-form-item
          label="客户决策人: "
          :prop="'operatorList.' + index + '.linkman'"
        >
          <el-input
            v-model="item.linkman"
            class="input"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="决策人职务: "
          :prop="'operatorList.' + index + '.contactPosition'"
        >
          <el-input
            v-model="item.contactPosition"
            class="input"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="决策人联系方式: "
          :prop="'operatorList.' + index + '.contactWay'"
        >
          <el-input
            v-model="item.contactWay"
            class="input"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <div class="btnList">
          <el-button
            type="primary"
            v-if="projectForm.decisionList.length - 1 == index"
            @click="addFormList('CUSTOMER_DECISION_MAKERS')"
            >新增</el-button
          >
          <el-button
            v-if="projectForm.decisionList.length > 1"
            @click.prevent="removeFormList(item, 'CUSTOMER_DECISION_MAKERS')"
            >删除</el-button
          >
        </div>
      </div>
      <el-divider></el-divider>
      <div>
        <el-form-item label="渠道: " prop="channel">
          <el-input
            v-model="projectForm.channel"
            class="input"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="所处阶段: " prop="theStageToWhichItBelongs">
          <el-select
            v-model="projectForm.theStageToWhichItBelongs"
            placeholder="请选择"
            clearable
            :multiple="true"
          >
            <el-option
              v-for="item in options.currentGenerationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目进展: " prop="projectProgress">
          <el-input
            v-model="projectForm.projectProgress"
            class="input"
            autocomplete="off"
            required="required"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="三板斧完成情况: " prop="threePlateAxeState">
          <el-checkbox-group v-model="projectForm.threePlateAxeState">
            <el-checkbox value="1" label="约参观" />
            <el-checkbox value="2" label="约交流" />
            <el-checkbox value="3" label="约高层拜访" />
          </el-checkbox-group>
        </el-form-item>
      </div>

      <el-divider></el-divider>
      <div>商务四要素</div>

      <el-form-item label="资金情况: " prop="fundingSituation">
        <el-input
          v-model="projectForm.fundingSituation"
          class="input"
          autocomplete="off"
          required="required"
          type="textarea"
          placeholder="概述资金情况是否到位，专项等事项"
        ></el-input>
      </el-form-item>
      <el-form-item label="决策链分析: " prop="decisionChainAnalysis">
        <el-input
          v-model="projectForm.decisionChainAnalysis"
          class="input"
          autocomplete="off"
          required="required"
          type="textarea"
        ></el-input>
      </el-form-item>

      <el-form-item label="预计成交时间: " prop="estimatedClosingTime">
        <el-date-picker
          v-model="projectForm.estimatedClosingTime"
          type="month"
          placeholder="请选择月份"
          value-format="YYYY-MM"
          format="YYYY-MM"
        />
      </el-form-item>
      <el-form-item label="竞争对手: " prop="competitor">
        <el-input
          v-model="projectForm.competitor"
          class="input"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('reset')">取消</el-button>
        <el-button type="primary" @click="addPropjectClick"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
const emit = defineEmits(["reset"]);
const props = defineProps([
  "id",
  "formData",
  "type",
  "time",
  "addProjectId",
  "customerName",
]);
import { projectPost, projectPut } from "@/api/info/index";
import { getLinkManApi } from "@/api/visit/index";
import { ref, reactive, onMounted, onUpdated, nextTick, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import cityData from "@/assets/json/pcas-code.json";
// 新增弹框
const addVisible = ref(false);
// 项目新增对象
const formDataAdd = ref(null);
// 地区下拉对象
const cascaderAddr = ref(null);
const cityProps = ref({
  value: "name", // 指定选项的 值 为选项对象的某个属性值
  label: "name", // 指定选项 标签 为选项对象的某个属性值
  children: "children", //指定选项的 子选项 为选项对象的某个属性值
  checkStrictly: true,
});
// select下拉以及枚举
const options = ref({
  theStageToWhichItBelongsOptions: [{ value: 0, label: "" }],
  statusOptions: [{ value: 0, label: "" }],
  areaOptions: [{ value: 0, label: "" }],
  priorityOptions: [{ value: 0, label: "" }],
  salespersonOptions: [{ value: "", label: "" }],
  typeOptions: [{ value: 0, label: "" }],
  projectSourceFundsOptions: [{ value: "", label: "" }],
  companyOptions: [
    { value: "中环服", label: "中环服" },
    { value: "伏泰云", label: "伏泰云" },
  ],
  departmentOptions: [],
});

// 项目信息form
const projectForm = ref({
  projectName: "",
  projectType: [],
  prepareContractAmount: "",
  area: [],
  customerName: "",
  customerContacts: "",
  projectSourceFunds: "",
  salesperson: "",
  projectFirstLevel: "",
  company: "",
  headquartersProjectId: "",
  department: "",
  lineOfBusiness: [],
  expectedTransactionTime: "",
  projectOpportunities: "",
  address: "",
  clientName: "",
  customerContacts: "",
  channel: "",
  competitor: "",
  commercialRelation: "",
  salesPersonnel: "",
  theStageToWhichItBelongs: "",
  projectProgress: "",
  estimatedClosingTime: "",
  threePlateAxeState: [],
  operatorList: [
    {
      linkman: "",
      contactPosition: "",
      contactWay: "",
      type: "CUSTOMER_MANAGER",
    },
  ],
  decisionList: [
    {
      linkman: "",
      contactPosition: "",
      contactWay: "",
      type: "CUSTOMER_DECISION_MAKERS",
    },
  ],
});
// form验证规则
const rules = reactive({
  projectName: [{ required: true, message: "请输入项目名称" }],
  // lineOfBusiness: [{ required: true, message: "请选择所属业务线" }],
  company: [{ required: true, message: "请选择所属公司" }],
  customerName: [{ required: true, message: "请输入客户名称" }],
  customerContacts: [{ required: true, message: "请输入客户联系" }],
  prepareContractAmount: [{ required: true, message: "请输入预合同金额" }],
  salesperson: [{ required: true, message: "请选择销售人员" }],
  projectFirstLevel: [{ required: true, message: "请选择项目优先级" }],
  department: [{ required: true, message: "请选择所属部门" }],
});

// 地区选择
const handleAddrChange = (e) => {
  let addrNode = unref(cascaderAddr).getCheckedNodes()[0].pathLabels;
};
// 新增行
const addFormList = (type) => {
  switch (type) {
    case "CUSTOMER_MANAGER":
      projectForm.value.operatorList.push({
        linkman: "",
        contactPosition: "",
        contactWay: "",
        type,
      });
      break;
    case "CUSTOMER_DECISION_MAKERS":
      projectForm.value.decisionList.push({
        linkman: "",
        contactPosition: "",
        contactWay: "",
        type,
      });
      break;
  }
};
// 删除行
const removeFormList = (item, type) => {
  switch (type) {
    case "CUSTOMER_MANAGER":
      const index2 = projectForm.value.operatorList.indexOf(item);
      if (index2 !== -1) {
        projectForm.value.operatorList.splice(index2, 1);
      }
      break;
    case "CUSTOMER_DECISION_MAKERS":
      const index3 = projectForm.value.decisionList.indexOf(item);
      if (index3 !== -1) {
        projectForm.value.decisionList.splice(index3, 1);
      }
      break;
  }
};
// 新增项目计划
const addPropjectClick = async () => {
  if (!projectForm.value) {
    return;
  }
  try {
    await formDataAdd.value.validate();
    addVisible.value = false;

    if (props.type == "edit") {
      // 项目编辑
      projectPut({
        project: {
          ...projectForm.value,
          associateTheCustomerId: props.formData.associateTheCustomerId,
          id: props.formData.id,
        },
        list: [
          ...projectForm.value.decisionList,
          ...projectForm.value.operatorList,
        ],
      }).then(({ code, msg }) => {
        if (code == 200) {
          ElMessage({
            type: "success",
            message: msg,
          });
          projectForm.value = {
            projectName: "",
            projectType: [],
            prepareContractAmount: "",
            area: [],
            customerName: "",
            customerContacts: "",
            projectSourceFunds: "",
            salesperson: "",
            projectFirstLevel: "",
            company: "",
            department: "",
            lineOfBusiness: [],
            expectedTransactionTime: "",
          };
          emit("reset");
        } else {
          ElMessage({
            type: "fail",
            message: msg,
          });
        }
      });
    } else {
      // 项目新增
      projectPost({
        project: {
          ...projectForm.value,
          associateTheCustomerId: props.id,
          id: props.formData.id,
          customerName: props.customerName,
        },
        list: [
          ...projectForm.value.decisionList,
          ...projectForm.value.operatorList,
        ],
      }).then(({ code, msg }) => {
        if (code == 200) {
          ElMessage({
            type: "success",
            message: msg,
          });
          emit("reset", props.id);
        } else {
          ElMessage({
            type: "fail",
            message: msg,
          });
        }
      });
    }
  } catch (err) {}
};

// 枚举, 回显
onMounted(() => {
  options.value.theStageToWhichItBelongsOptions = JSON.parse(
    localStorage.getItem("theStageToWhichItBelongsOptions")
  );
  options.value.priorityOptions = JSON.parse(
    localStorage.getItem("priorityOptions")
  );
  options.value.projectSourceFundsOptions = JSON.parse(
    localStorage.getItem("projectSourceFundsOptions")
  );
  options.value.salespersonOptions = JSON.parse(
    localStorage.getItem("salespersonOptions")
  );
  options.value.typeOptions = JSON.parse(localStorage.getItem("typeOptions"));
  options.value.lineOfBusinessOptions = JSON.parse(
    localStorage.getItem("belongsToTheLineOfBusinessOptions")
  );
  options.value.departmentOptions = JSON.parse(
    localStorage.getItem("departmentOptions")
  );
  options.value.currentGenerationOptions = JSON.parse(
    localStorage.getItem("currentGenerationOptions")
  );
  if (props.type == "edit") {
    projectForm.value = JSON.parse(JSON.stringify(props.formData));
    if (props.formData.id)
      getLinkManApi({ id: props.formData.id }).then(({ data }) => {
        projectForm.value.decisionList = data.filter(
          (item) => item.type == "CUSTOMER_DECISION_MAKERS"
        );
        projectForm.value.operatorList = data.filter(
          (item) => item.type == "CUSTOMER_MANAGER"
        );
        if (projectForm.value.decisionList.length <= 0)
          projectForm.value.decisionList = [
            {
              linkman: "",
              contactPosition: "",
              contactWay: "",
              type: "CUSTOMER_DECISION_MAKERS",
            },
          ];
        if (projectForm.value.operatorList.length <= 0)
          projectForm.value.operatorList = [
            {
              linkman: "",
              contactPosition: "",
              contactWay: "",
              type: "CUSTOMER_MANAGER",
            },
          ];
      });
    else {
      projectForm.value.operatorList = [
        {
          linkman: "",
          contactPosition: "",
          contactWay: "",
          type: "CUSTOMER_MANAGER",
        },
      ];
      projectForm.value.decisionList = [
        {
          linkman: "",
          contactPosition: "",
          contactWay: "",
          type: "CUSTOMER_DECISION_MAKERS",
        },
      ];
    }
  } else if (formDataAdd.value) formDataAdd.value.resetFields();
  nextTick(() => {
    if (formDataAdd.value) formDataAdd.value.clearValidate();
  });
});
</script>

<style scoped>
@import "../css/addproject.scss";
</style>
