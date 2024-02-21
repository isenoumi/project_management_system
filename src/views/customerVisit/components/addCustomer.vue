<template>
  <el-dialog
    :title="props.id ? '编辑' : '新增'"
    width="1300px"
    :destroy-on-close="true"
    :append-to-body="true"
  >
    <el-form
      ref="formDataAdd"
      :model="customerForm"
      :rules="rules"
      label-width="140px"
    >
      <el-form-item label="客户名称: " prop="clientName">
        <el-input
          v-model="customerForm.clientName"
          class="input"
          autocomplete="off"
          required="required"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属区域: " prop="address">
        <el-cascader
          v-model="customerForm.address"
          ref="cascaderAddr"
          :options="cityData"
          :props="cityProps"
          placeholder="请选择省市区"
          @change="handleAddrChange"
        ></el-cascader>
      </el-form-item>

      <el-divider></el-divider>
      <div
        class="customer"
        v-for="(item, index) in customerForm.contactsList"
        :key="index"
      >
        <el-form-item
          label="客户联系人: "
          :rules="[
            { required: true, message: '请输入客户联系人', trigger: 'blur' },
          ]"
          :prop="'contactsList.' + index + '.linkman'"
        >
          <el-input
            v-model="item.linkman"
            class="input"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="联系人职务: "
          :prop="'contactsList.' + index + '.contactPosition'"
          :rules="[
            { required: true, message: '请输入联系人职务', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="item.contactPosition"
            class="input"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="联系人联系方式: "
          :prop="'contactsList.' + index + '.contactWay'"
          :rules="[
            {
              required: true,
              message: '请输入联系人联系方式',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model="item.contactWay"
            class="input"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <div class="btnList">
          <el-button
            v-if="customerForm.contactsList.length - 1 == index"
            type="primary"
            @click="addFormList('CUSTOMER_CONTACTS')"
            >新增</el-button
          >
          <el-button
            v-if="customerForm.contactsList.length > 1"
            @click.prevent="removeFormList(item, 'CUSTOMER_CONTACTS')"
            >删除
          </el-button>
        </div>
      </div>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('reset')">取消</el-button>
        <el-button type="primary" @click="addCustomerFun"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
const emit = defineEmits(["reset"]);
const props = defineProps(["id", "formData", "time"]);
import {
  customerVisitIdGet,
  customerVisitRecordsPut,
  customerVisitRecordsPost,
} from "@/api/visit/index";
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
  currentGenerationOptions: [{ value: 0, label: "" }],
  statusOptions: [{ value: 0, label: "" }],
  areaOptions: [{ value: 0, label: "" }],
  priorityOptions: [{ value: 0, label: "" }],
  salespersonOptions: [{ value: "", label: "" }],
});

// 客户信息form
const customerForm = ref({
  address: "",
  clientName: "",
  contactsList: [
    {
      linkman: "",
      contactPosition: "",
      contactWay: "",
      type: "CUSTOMER_CONTACTS",
    },
  ],
});
// form验证规则
const rules = reactive({
  address: [{ required: true, message: "请选择所属区域" }],
  clientName: [{ required: true, message: "请输入客户名称" }],
  customerContactsPosition: [
    { required: true, message: "请输入客户名称", trigger: "blur" },
  ],
  customerLinkman: [
    { required: true, message: "请输入客户联系人", trigger: "blur" },
  ],
  customerContactWay: [
    { required: true, message: "请输入联系人联系方式", trigger: "blur" },
  ],
});

// 地区选择
const handleAddrChange = (e) => {
  let addrNode = unref(cascaderAddr).getCheckedNodes()[0].pathLabels;
};
// 新增行
const addFormList = (type) => {
  switch (type) {
    case "CUSTOMER_CONTACTS":
      customerForm.value.contactsList.push({
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
    case "CUSTOMER_CONTACTS":
      const index1 = customerForm.value.contactsList.indexOf(item);
      if (index1 !== -1) {
        customerForm.value.contactsList.splice(index1, 1);
      }
      break;
  }
};
// 新增客户
const addCustomerFun = async () => {
  if (!customerForm.value) {
    return;
  }
  try {
    await formDataAdd.value.validate();
    addVisible.value = false;
    if (!props.id) {
      customerForm.value.address = JSON.stringify(customerForm.value.address);
      let list = [];
      customerForm.value.contactsList.forEach((item) => {
        if (item.linkman && item.contactWay && item.contactPosition) {
          list.push(item);
        }
      });
      // 客户新增
      const records = {
        item: customerForm.value,
        list,
      };
      Object.assign(records.item, {
        salesPersonnel: JSON.parse(localStorage.getItem("users")).name,
        salesPersonnelId: JSON.parse(localStorage.getItem("users")).id,
      });
      customerVisitRecordsPost(records).then(({ code, msg }) => {
        if (code == 200) {
          ElMessage({
            type: "success",
            message: msg,
          });
          customerForm.value = {
            address: "",
            clientName: "",
            contactsList: [
              {
                linkman: "",
                contactPosition: "",
                contactWay: "",
                type: "CUSTOMER_CONTACTS",
              },
            ],
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
      // 编辑
      customerForm.value.address = JSON.stringify(customerForm.value.address);
      let list = [];
      customerForm.value.contactsList.forEach((item) => {
        if (item.linkman || item.contactWay || item.contactPosition) {
          Object.assign(item, { clientVisitId: props.id });
          list.push(item);
        }
      });
      const records = {
        item: {
          ...customerForm.value,
          id: props.id,
          createTime: props.formData.createTime,
          createBy: props.formData.createBy,
        },
        list,
        visitType: 1,
      };
      Object.assign(records.item, {
        salesPersonnel: JSON.parse(localStorage.getItem("users")).name,
        salesPersonnelId: JSON.parse(localStorage.getItem("users")).id,
      });
      customerVisitRecordsPut(records).then(({ code, msg }) => {
        if (code == 200) {
          ElMessage({
            type: "success",
            message: msg,
          });
          customerForm.value = {
            address: "",
            clientName: "",
            contactsList: [
              {
                linkman: "",
                contactPosition: "",
                contactWay: "",
                type: "CUSTOMER_CONTACTS",
              },
            ],
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

// 枚举
onMounted(() => {
  options.value.currentGenerationOptions = JSON.parse(
    localStorage.getItem("currentGenerationOptions")
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
  if (props.id && Object.keys(props.formData).length > 0) {
    customerForm.value.address = JSON.parse(props.formData.address);
    customerForm.value.clientName = props.formData.clientName;
    customerVisitIdGet({ id: props.id, visitType: 1 }).then(({ data }) => {
      customerForm.value.contactsList = data.Visitors.filter(
        (item) => item.type == "CUSTOMER_CONTACTS"
      );
      if (customerForm.value.contactsList.length == 0)
        customerForm.value.contactsList.push({
          linkman: "",
          contactPosition: "",
          contactWay: "",
          type: "CUSTOMER_CONTACTS",
        });
    });
  } else {
    customerForm.value = {
      address: "",
      clientName: "",
      contactsList: [
        {
          linkman: "",
          contactPosition: "",
          contactWay: "",
          type: "CUSTOMER_CONTACTS",
        },
      ],
    };
  }
  if (formDataAdd.value) {
    nextTick(() => {
      formDataAdd.value.clearValidate();
    });
  }
});
</script>

<style scoped>
@import "../css/addproject.scss";
</style>
