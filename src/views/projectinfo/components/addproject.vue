<template>
  <el-dialog
    :title="$props.id ? '编辑' : '新建项目'"
    width="30%"
    :destroy-on-close="true"
  >
    <el-form ref="formDataAdd" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="项目名称: " prop="projectName">
        <el-input
          v-model="form.projectName"
          class="input"
          autocomplete="off"
          required="required"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="项目类型: " prop="projectType">
        <el-select
          v-model="form.projectType"
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
      </el-form-item> -->
      <el-form-item label="所属公司: " prop="company">
        <el-select v-model="form.company" placeholder="请选择" clearable>
          <el-option
            v-for="item in options.companyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属业务线: " prop="lineOfBusiness">
        <el-select
          v-model="form.lineOfBusiness"
          :multiple="true"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in options.belongsToTheLineOfBusinessOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属部门: " prop="department">
        <el-select v-model="form.department" placeholder="请选择" clearable>
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
        <el-select v-model="form.projectSourceFunds" placeholder="请选择内容">
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
          v-model="form.area"
          ref="cascaderAddr"
          :options="cityData"
          :props="cityProps"
          placeholder="请选择省市区"
          @change="handleAddrChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="伏泰总部项目编号: " prop="headquartersProjectId">
        <el-input
          v-model="form.headquartersProjectId"
          class="input"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="客户名称: " prop="customerName">
        <el-input
          v-model="form.customerName"
          class="input"
          autocomplete="off"
          required="required"
        ></el-input>
      </el-form-item>
      <el-form-item label="客户联系人: " prop="customerContacts">
        <el-input
          v-model="form.customerContacts"
          class="input"
          autocomplete="off"
          required="required"
        ></el-input>
      </el-form-item>
      <el-form-item label="预合同金额（万）: " prop="prepareContractAmount">
        <el-input-number
          v-model="form.prepareContractAmount"
          class="input"
          required="required"
          :min="0.1"
          :precision="2"
          :step="0.1"
        />
      </el-form-item>
      <el-form-item label="销售人员: " prop="salesperson">
        <el-select
          v-model="form.salesperson"
          placeholder="请选择内容"
          clearable
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
          v-model="form.projectFirstLevel"
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
      <el-form-item label="预计成交时间: " prop="expectedTransactionTime">
        <el-date-picker
          v-model="form.expectedTransactionTime"
          type="month"
          placeholder="请选择月份"
          :disabled-date="disabledDate"
          :shortcuts="shortcuts"
          :size="size"
          value-format="YYYY-MM"
          format="YYYY-MM"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('reset')">取消</el-button>
        <el-button type="primary" @click="add"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
const emit = defineEmits(["reset"]);
const props = defineProps(["id", "formData"]);
import { projectPost, projectPut } from "@/api/info/index";
import { ref, reactive, onMounted, onUpdated } from "vue";
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
  typeOptions: [{ value: 0, label: "" }],
  statusOptions: [{ value: 0, label: "" }],
  areaOptions: [{ value: 0, label: "" }],
  priorityOptions: [{ value: 0, label: "" }],
  salespersonOptions: [{ value: "", label: "" }],
  projectSourceFundsOptions: [{ value: "专项资金", label: "专项资金" }],
  companyOptions: [
    { value: "中环服", label: "中环服" },
    // { value: "伏泰", label: "伏泰" },
    { value: "伏泰云", label: "伏泰云" },
  ],
  belongsToTheLineOfBusinessOptions: [
    { value: "城市管理信息化", label: "城市管理信息化" },
    { value: "数据服务", label: "数据服务" },
    { value: "垂直大模型", label: "垂直大模型" },
    { value: "垃圾分类", label: "垃圾分类" },
    { value: "智慧硬件", label: "智慧硬件" },
    { value: "无人化", label: "无人化" },
    { value: "咨询服务", label: "咨询服务" },
  ],
  departmentOptions: [
    { value: "四川1部", label: "四川1部" },
    { value: "四川2部", label: "四川2部" },
    { value: "生态事业部", label: "生态事业部" },
    { value: "重庆事业部", label: "西安事业部" },
    { value: "战略事业部", label: "战略事业部" },
    { value: "昆明事业部", label: "昆明事业部" },
  ],
});

// 项目信息form
const form = ref({
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
});
// form验证规则
const rules = reactive({
  projectName: [{ required: true, message: "请输入项目名称" }],
  projectType: [{ required: true, message: "请选择项目类型" }],
  company: [{ required: true, message: "请选择所属公司" }],
  projectSourceFunds: [{ required: true, message: "请选择项目资金来源" }],
  area: [{ required: true, message: "请选择所属区域" }],
  customerName: [{ required: true, message: "请输入客户名称" }],
  customerContacts: [{ required: true, message: "请输入客户联系" }],
  prepareContractAmount: [{ required: true, message: "请输入预合同金额" }],
  salesperson: [{ required: true, message: "请选择销售人员" }],
  projectFirstLevel: [{ required: true, message: "请选择项目优先级" }],
  department: [{ required: true, message: "请选择所属部门" }],
  lineOfBusiness: [{ required: true, message: "请选择所属业务线" }],
  expectedTransactionTime: [{ required: true, message: "请选择预计成交月份" }],
});

// 地区选择
const handleAddrChange = (e) => {
  let addrNode = unref(cascaderAddr).getCheckedNodes()[0].pathLabels;
  let addrText = addrNode.pathLabels;
};

// 新增项目计划
const add = async () => {
  if (!form.value) {
    return;
  }
  try {
    await formDataAdd.value.validate();
    addVisible.value = false;
    if (!props.id) {
      // 项目新增
      projectPost({
        project: form.value,
      }).then(({ code, msg }) => {
        if (code == 200) {
          ElMessage({
            type: "success",
            message: msg,
          });
          form.value = {
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
      // 项目编辑
      projectPut(form.value).then(({ code, msg }) => {
        if (code == 200) {
          ElMessage({
            type: "success",
            message: msg,
          });
          form.value = {
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
    }
  } catch (err) {}
};

// 初始化数据
onUpdated(() => {
  if (props.id) {
    form.value.projectName = props.formData.projectName;
    form.value.projectType = props.formData.projectType;
    form.value.prepareContractAmount = props.formData.prepareContractAmount;
    form.value.area = props.formData.area;
    form.value.customerName = props.formData.customerName;
    form.value.customerContacts = props.formData.customerContacts;
    form.value.projectSourceFunds = props.formData.projectSourceFunds;
    form.value.salesperson = props.formData.salesperson;
    form.value.projectFirstLevel = props.formData.projectFirstLevel;
    form.value.id = props.formData.id;
    form.value.projectId = props.formData.projectId;
    form.value.company = props.formData.company;
    form.value.headquartersProjectId = props.formData.headquartersProjectId;
    form.value.department = props.formData.department;
    form.value.lineOfBusiness = props.formData.lineOfBusiness;
    form.value.expectedTransactionTime = props.formData.expectedTransactionTime;
  } else {
    form.value = {
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
    };
  }
});

// 枚举
onMounted(() => {
  options.value.typeOptions = JSON.parse(localStorage.getItem("typeOptions"));
  options.value.priorityOptions = JSON.parse(
    localStorage.getItem("priorityOptions")
  );
  options.value.projectSourceFundsOptions = JSON.parse(
    localStorage.getItem("projectSourceFundsOptions")
  );
  options.value.salespersonOptions = JSON.parse(
    localStorage.getItem("salespersonOptions")
  );
  options.value.belongsToTheLineOfBusinessOptions = JSON.parse(
    localStorage.getItem("belongsToTheLineOfBusinessOptions")
  );
  options.value.departmentOptions = JSON.parse(
    localStorage.getItem("departmentOptions")
  );
});
</script>

<style scoped>
@import "../css/addproject.scss";
</style>
