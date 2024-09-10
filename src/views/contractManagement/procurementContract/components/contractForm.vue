<template>
  <el-form ref="formDataAdd" :model="form" :rules="rules" label-width="110">
    <div class="formBox">
      <div class="title">合同信息</div>
      <div class="formItemBox">
        <div class="formItem">
          <el-form-item label="合同类型: " prop="type">
            <el-select v-model="form.type" placeholder="请选择" clearable>
              <el-option
                v-for="item in options.contractTypeEnums"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="formItem">
          <el-form-item label="合同名称: " prop="name">
            <el-input
              v-model="form.name"
              class="input"
              autocomplete="off"
              required="required"
            ></el-input>
          </el-form-item>
        </div>
        <div class="formItem">
          <el-form-item label="所属项目: " prop="projectId">
            <el-select
              v-model="form.projectId"
              placeholder="请选择"
              :filterable="true"
              clearable
            >
              <el-option
                v-for="item in options.belongsToTheProject"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                @click="projectChange(item)"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="formItem">
          <el-form-item
            label="合同总金额(元): "
            label-width="140"
            prop="contractAmount"
          >
            <el-input
              v-model="form.contractAmount"
              class="input"
              autocomplete="off"
              required="required"
            ></el-input>
          </el-form-item>
        </div>

        <div class="formItem">
          <el-form-item label="合同签署日期: " prop="contractDate">
            <el-date-picker
              v-model="form.contractDate"
              type="date"
              placeholder="请选择日期"
              :disabled-date="disabledDate"
              :shortcuts="shortcuts"
              :size="size"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
            />
          </el-form-item>
        </div>
      </div>
    </div>
    <div></div>
    <div class="formBox">
      <div class="title">甲方信息</div>
      <div class="formItemBox">
        <div class="formItem">
          <el-form-item label="合同签署甲方: " prop="contractFirstParty">
            <el-select
              v-model="form.contractFirstParty"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in [
                  { value: '中环服', label: '中环服' },
                  { value: '伏泰云', label: '伏泰云' },
                ]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="formItem">
          <el-form-item label="甲方联系人: " prop="firstPartyContacts">
            <el-input
              v-model="form.firstPartyContacts"
              class="input"
              autocomplete="off"
              required="required"
            ></el-input>
          </el-form-item>
        </div>
        <div class="formItem">
          <el-form-item label="甲方联系方式: " prop="firstPartyPhone">
            <el-input
              v-model="form.firstPartyPhone"
              class="input"
              autocomplete="off"
              required="required"
            ></el-input>
          </el-form-item>
        </div>
      </div>
    </div>
    <div class="formBox" style="margin-bottom: 0">
      <div class="title">乙方信息</div>
      <div class="formItemBox">
        <div class="formItem">
          <el-form-item label="供应商: " prop="supplierNeme">
            <el-input
              v-model="form.supplierNeme"
              class="input"
              autocomplete="off"
              required="required"
            ></el-input>
          </el-form-item>
        </div>
        <div class="formItem">
          <el-form-item label="供应商联系人: " prop="supplierContacts">
            <el-input
              v-model="form.supplierContacts"
              class="input"
              autocomplete="off"
              required="required"
            ></el-input>
          </el-form-item>
        </div>
        <div class="formItem">
          <el-form-item
            label="供应商联系方式: "
            label-width="140"
            prop="supplierPhone"
          >
            <el-input
              v-model="form.supplierPhone"
              class="input"
              autocomplete="off"
              required="required"
            ></el-input>
          </el-form-item>
        </div>
        <div class="formItem">
          <el-form-item label="收款人全称: " prop="payeeName">
            <el-input
              v-model="form.payeeName"
              class="input"
              autocomplete="off"
              required="required"
            ></el-input>
          </el-form-item>
        </div>
        <div class="formItem">
          <el-form-item label="开户银行: " prop="bankOfDeposit">
            <el-input
              v-model="form.bankOfDeposit"
              class="input"
              autocomplete="off"
              required="required"
            ></el-input>
          </el-form-item>
        </div>
        <div class="formItem">
          <el-form-item label="银行账户: " prop="bankAccount">
            <el-input
              v-model="form.bankAccount"
              class="input"
              autocomplete="off"
              required="required"
            ></el-input>
          </el-form-item>
        </div>
      </div>
    </div>
    <el-divider />
    <div
      v-for="(item, index) in form.contractBudget"
      :key="index"
      class="customer"
    >
      <span style="margin-top: 6px; margin-right: 8px; margin-left: 6px"
        ><span style="color: red">* </span>关联预算科目:
      </span>
      <el-form-item
        :rules="{ required: true, message: '请选择一级科目' }"
        :prop="'contractBudget.' + index + '.budgetSubjectOneId'"
        label-width="0"
      >
        <el-select
          v-model="item.budgetSubjectOneId"
          placeholder="请选择一级科目"
          clearable
          @change="budgetOneChange($event, index)"
        >
          <el-option
            v-for="optionsItem in options.budgetOneOptions"
            :key="optionsItem.value"
            :label="optionsItem.label"
            :value="optionsItem.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <div style="margin: 0 25px">
        <el-form-item
          :rules="[{ required: true, message: '请选择二级科目' }]"
          :prop="'contractBudget.' + index + '.budgetSubjectTwoId'"
          label-width="0"
        >
          <el-select
            v-model="item.budgetSubjectTwoId"
            placeholder="请选择二级科目"
            clearable
            @change="budgetTwoChange($event, index)"
          >
            <el-option
              v-for="optionsItem in options.budgetTwoOptions"
              :key="optionsItem.value"
              :label="optionsItem.label"
              :value="optionsItem.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item
        v-if="!props.id"
        :rules="[{ required: true, message: '请选择三级科目' }]"
        :prop="'contractBudget.' + index + '.budgetSubjectThreeId'"
        label-width="0"
      >
        <el-select
          v-model="item.budgetSubjectThreeId"
          placeholder="请选择三级科目"
          clearable
          @change="budgetThreeCreateContract"
        >
          <el-option
            v-for="optionsItem in options.budgetThreeOptions"
            :key="optionsItem.value"
            :label="optionsItem.label"
            :value="optionsItem.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-else
        :rules="[{ required: true, message: '请选择三级科目' }]"
        :prop="'contractBudget.' + index + '.budgetSubjectThreeId'"
        label-width="0"
      >
        <el-select
          v-model="item.budgetSubjectThreeId"
          placeholder="请选择三级科目"
          clearable
          @change="budgetThreeChangeContract"
        >
          <el-option
            v-for="optionsItem in options.budgetThreeOptions"
            :key="optionsItem.value"
            :label="optionsItem.label"
            :value="optionsItem.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <div style="margin: 0 25px">
        <el-form-item
          :label="props.id ? '剩余预算金额（元）:' : '预算金额（元）:'"
          prop="budgetAmount"
          :label-width="props.id ? 150 : 120"
        >
          <span style="width: 40px"> {{ item.budgetAmount }} </span>
        </el-form-item>
      </div>

      <el-form-item
        label="合同金额: "
        :rules="[
          { required: true, message: '请输入合同金额' },
          {
            validator: checkContractAmount,
            trigger: 'blur',
          },
        ]"
        :prop="'contractBudget.' + index + '.contractAmount'"
        label-width="100"
      >
        <el-input
          v-model="item.contractAmount"
          class="input"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <div class="btnList">
        <el-button
          v-if="form.contractBudget.length - 1 == index"
          type="primary"
          @click="addFormList('CUSTOMER_CONTACTS')"
          >新增</el-button
        >
        <el-button
          v-if="form.contractBudget.length > 1"
          @click.prevent="removeFormList(item, 'CUSTOMER_CONTACTS')"
          >删除
        </el-button>
      </div>
    </div>
    <el-form-item label="附件: " prop="contractFile">
      <div class="tipsBox">
        <fileUpload
          :annex="fileUrl"
          @get-file-url="getFileUrl"
          @set-file-url="setFileUrl"
        ></fileUpload>
      </div>
    </el-form-item>
    <el-form-item label="备注: " prop="description">
      <el-input
        v-model="form.description"
        class="input"
        autocomplete="off"
        :autosize="{ minRows: 6, maxRows: 8 }"
        required="required"
        type="textarea"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script setup>
const emit = defineEmits(["reset"]);
const props = defineProps(["id", "formData"]);
import {
  levelOneSubjects,
  levelTwoSubjects,
  levelThreeSubjects,
  levelThreeSubjectsChange,
} from "@/api/contract/index";
import { ref, reactive, onMounted, onUpdated } from "vue";
import { contractTypeEnums, belongsToTheProject } from "@/api/enum";
import { number } from "echarts";

// 项目新增对象
const formDataAdd = ref(null);
// select下拉以及枚举
const options = ref({
  belongsToTheProject: [{ value: "", label: "" }], // 所属项目
  contractTypeEnums: [{ value: "", label: "" }], // 合同类型
});

// 合同信息form
const form = ref({
  name: "", // 合同名称
  type: "", // 合同类型
  projectId: "", // 项目id
  projectName: "", // 项目名称
  contractAmount: "", // 合同总金额
  contractDate: "", // 签署日期
  contractFirstParty: "", // 甲方
  firstPartyContacts: "", // 甲方联系人
  firstPartyPhone: "", // 甲方联系方式
  payeeName: "", // 收款人全称
  bankOfDeposit: "", // 开户银行
  bankAccount: "", // 银行账户
  supplierNeme: "", // 供应商名称
  supplierContacts: "", // 供应商联系人
  supplierPhone: "", // 供应商联系方式
  contractFile: "", // 附件
  description: "", // 备注
  contractBudget: [
    {
      budgetAmount: 0, // 预算金额
      budgetSubjectOneId: "", // 一级预算
      budgetSubjectTwoId: "", // 二级预算
      budgetSubjectThreeId: "", // 三级预算
      contractAmount: "", // 合同金额
    },
  ],
});
// form验证规则
const rules = reactive({
  type: [{ required: true, message: "请选择合同类型" }],
  name: [{ required: true, message: "请输入合同名称" }],
  projectId: [{ required: true, message: "请选择所属项目" }],
  contractAmount: [{ required: true, message: "请输入合同总金额" }],
  contractDate: [{ required: true, message: "请选择合同签署日期" }],
  contractFirstParty: [{ required: true, message: "请输入合同签署甲方" }],
  firstPartyContacts: [{ required: true, message: "请输入甲方联系人" }],
  firstPartyPhone: [{ required: true, message: "请输入甲方联系方式" }],
  bankOfDeposit: [{ required: true, message: "请输入开户银行" }],
  bankAccount: [{ required: true, message: "请输入银行账户" }],
  supplierNeme: [{ required: true, message: "请输入供应商" }],
  supplierContacts: [{ required: true, message: "请输入供应商联系人" }],
  supplierPhone: [{ required: true, message: "请输入供应商联系方式" }],
  payeeName: [{ required: true, message: "请输入收款人全称" }],
  contractFile: [
    { required: true, message: "请选择合同附件", trigger: "change" },
  ],
  // budgetSubjectOneId: [{ required: true, message: "请选择一级科目" }],
  // budgetSubjectTwoId: [{ required: true, message: "请选择二级科目" }],
  // budgetSubjectThreeId: [{ required: true, message: "请选择三级科目" }],
  // contractAmount: [{ required: true, message: "请输入合同金额" }],
});
// 新增行
const addFormList = (type) => {
  form.value.contractBudget.push({
    budgetSubjectOneId: "",
    budgetSubjectTwoId: "",
    budgetSubjectThreeId: "",
    contractAmount: "",
    budgetAmount: 0,
  });
};
// 删除行
const removeFormList = (item, type) => {
  const index = form.value.contractBudget.indexOf(item);
  if (index !== -1) {
    form.value.contractBudget.splice(index, 1);
  }
};
// 文件链接
const fileUrl = ref("");
// 附件链接url
const getFileUrl = async (value) => {
  form.value.contractFile += "," + value.msg;
  console.log(value,'附件上传')
  console.log(formDataAdd.value);
  try {
    await formDataAdd.value.validate();
  } catch (err) {}
};

// 项目点击
const projectChange = (e) => {
  if (e) {
    levelOneSubjects({ projectId: e.value }).then(({ data }) => {
      options.value.budgetOneOptions = data;
    });
    form.value.projectName = e.label;
  }
};
// 一级预算点击
const budgetOneChange = (e, index) => {
  console.log(e, index);
  if (e)
    levelTwoSubjects({ id: e }).then(({ data }) => {
      options.value.budgetTwoOptions = data;
    });
  form.value.contractBudget[index].budgetSubjectTwoId = "";
  form.value.contractBudget[index].budgetSubjectThreeId = "";
  form.value.contractBudget[index].budgetAmount = 0;
  form.value.contractBudget[index].contractAmount = "";
};
// 二级预算点击
const budgetTwoChange = (e, index) => {
  if (e)
    levelTwoSubjects({ id: e }).then(({ data }) => {
      options.value.budgetThreeOptions = data;
    });
  form.value.contractBudget[index].budgetSubjectThreeId = "";
  form.value.contractBudget[index].budgetAmount = 0;
  form.value.contractBudget[index].contractAmount = "";
};
// 三级预算新建点击
const budgetThreeCreateContract = (e) => {
  if (e)
    levelThreeSubjects({ id: e }).then(({ data }) => {
      form.value.contractBudget.forEach((item) => {
        if (item.budgetSubjectThreeId == e) item.budgetAmount = data;
      });
    });
};
// 三级预算变更点击
const budgetThreeChangeContract = (e) => {
  if (e)
    levelThreeSubjectsChange({ id: e }).then(({ data }) => {
      form.value.contractBudget.forEach((item) => {
        if (item.budgetSubjectThreeId == e) item.budgetAmount = data;
      });
    });
};
// 合同金额验证
const checkContractAmount = (rule, value, callback) => {
  if (
    value > form.value.contractBudget[rule.field.split(".")[1]].budgetAmount
  ) {
    callback(new Error("合同金额应小于预算金额"));
  } else {
    callback();
  }
};
// 回显附件链接url
const setFileUrl = (value) => {
  form.value.contractFile = value;
};
// 子组件抛出的对象
defineExpose({
  form,
  formDataAdd,
});
// 初始化数据
onUpdated(() => {
  form.value = {
    name: "",
    type: "",
    projectId: "",
    contractAmount: "",
    contractDate: "",
    contractFirstParty: "",
    firstPartyContacts: "",
    firstPartyPhone: "",
    payeeName: "",
    bankOfDeposit: "",
    bankAccount: "",
    supplierNeme: "",
    supplierContacts: "",
    supplierPhone: "",
    contractFile: "",
    description: "",
    contractBudget: [
      {
        budgetAmount: 0,
        budgetSubjectOneId: "",
        budgetSubjectTwoId: "",
        budgetSubjectThreeId: "",
        contractAmount: "",
      },
    ],
  };
});
// 枚举
onMounted(() => {
  contractTypeEnums().then(({ data }) => {
    options.value.contractTypeEnums = data;
  });
  belongsToTheProject().then(({ data }) => {
    options.value.belongsToTheProject = data;
  });
});
</script>

<style scoped lang="scss">
@import "../css/contractForm.scss";
</style>
