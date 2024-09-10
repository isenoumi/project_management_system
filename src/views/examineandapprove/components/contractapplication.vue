<template>
  <div v-loading="loading">
    <div class="add-carefuls">
      <div class="inputs">
        <div class="title">所属合同：</div>
        <el-select
          v-model="query.contract"
          placeholder="请选择所属合同"
          clearable
          filterable
          @change="renyuanChange"
        >
          <el-option
            v-for="item in query.contractList"
            :key="item.value"
            :label="item.lable"
            :value="item.value"
            @click.native="citychange(item.label)"
          >
          </el-option>
        </el-select>
      </div>
      <div class="inputs">
        <div class="title">付款金额:</div>
        <el-input
          v-model="query.payment"
          :disabled="query.showinput"
          type="number"
          @input="getpayment"
          placeholder="请输入付款金额"
        />
      </div>
      <div class="inputs">
        <div class="title">付款方式:</div>
        <el-select
          v-model="query.paymentMethod"
          :disabled="query.showinput"
          @change="paymentMethodChange"
          class="m-2"
          placeholder="请选择付款方式"
        >
          <el-option
            v-for="item in query.paymentMethodList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="inputs">
        <div class="title">付款日期:</div>
        <el-date-picker
          :disabled="query.showinput"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          v-model="query.paymentDate"
          type="date"
          placeholder="请选择时间"
        />
      </div>
    </div>
    <div class="paymentable">
      <el-table
        :data="query.tableData"
        :header-row-style="{ height: '60px' }"
        :row-style="{ height: '50px' }"
        :border="true"
        style="width: 100%"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{
          'text-align': 'center',
        }"
      >
        <el-table-column prop="subjectCode" label="科目编号" />
        <el-table-column prop="subjectName" label="预算科目名称" />
        <el-table-column prop="thisIllustrate" label="说明" />
        <el-table-column prop="costAmount" label="预算费用合计" />
        <el-table-column prop="contractAmount" label="合同金额" />
        <el-table-column prop="ableContractAmount" label="剩余合同金额" />
      </el-table>
    </div>
    <div v-if="showList">
      <div class="add-carefuls" v-for="(item, index) in nameList" :key="index">
        <div class="inputs">
          <div class="name">{{ item.name }}</div>
          <div class="title">付款金额*:</div>
          <el-input
            v-model="item.payment"
            type="number"
            @input="paymentPut(nameList)"
          />
        </div>
      </div>
    </div>
    <div class="down">
      <el-upload
        v-loading="loading"
        v-model:file-list="query.fileList"
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
    </div>
    <div class="add-carefuls">
      <div class="textarea">
        <div>付款事由：</div>
        <div class="input-textarea">
          <el-input
            maxlength="1000"
            :disabled="query.showinput"
            placeholder="请输入付款事由"
            show-word-limit
            type="textarea"
            v-model="query.paymentRemarks"
            :autosize="{ minRows: 6, maxRows: 8 }"
          />
        </div>
      </div>
    </div>
    <div
      class="btn"
      style="display: flex; align-items: center; margin-top: 50px"
    >
      <el-button
        @click="paymentcontractSubmin"
        type="primary"
        :disabled="query.show"
        style="margin-right: 15px"
        >保存</el-button
      >
      <el-button @click="reverted" type="info" plain>返回</el-button>
      <!-- <el-button @click="txt" type="info" plain >测试</el-button> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import {
  getfeishuCreatesAnApproval,
  gettApprovaInstance,
  getselectPaymentWayEnums,
  getlistContractByProjectId,
  getlistSubjectByContractId,
  getsubmitContractualFeeApply,
} from "@/api/budget";
import type { UploadProps } from "element-plus";
import { createFeishuUpload } from "@/api/plan/feishu/index";
import { useRoute } from "vue-router";
const txt = () => {
  console.log("🚀");
};
//路由
const route = useRoute();
const id = reactive<any>({
  id: "",
  peojectId: "",
  projectId: "",
});
const cityname = ref("");
const showList = ref(false);
const nameList = ref<any>([]);
const loading = ref(false);
const submitList = ref<any>([
  {
    code: "",
    id: "",
  },
]);
const query = reactive<any>({
  showinput: true,
  contract: "",
  contractList: [],
  payment: 0,
  paymentDisabled: false,
  paymentMethod: "",
  paymentMethodList: [],
  paymentDate: "",
  tableData: [],
  accountName: "0",
  fileList: [],
  paymentRemarks: "",
  show: false,
  fileCode: [],
  cosUrl: "",
  paymentMethodData: [],
  uploadshow: true,
});
//支付方式枚举
const paymentMethod = () => {
  getselectPaymentWayEnums().then((res: any) => {
    query.paymentMethodList = res.data;
  });
};
//上传文件
const uploadData = ref({
  name: "文件",
  type: "attachment",
});
//所属合同输入
const renyuanChange = (e: any) => {
  query.showinput = false;
  cityname.value = "";
  let data = {
    contractId: e,
  };
  getlistSubjectByContractId(data).then((res: any) => {
    query.tableData = res.data;
    showList.value = true;
    nameList.value = [];
    query.tableData.forEach((v: any) => {
      let obj = {
        payment: Number(query.payment * v.contractAmountProportion).toFixed(2),
        name: v.subjectName,
        budgetSubjectId: v.subjectId,
      };

      nameList.value.push(obj);
    });
  });
};
// 搜索下拉
const citychange = (val: any) => {
  showList.value = true;
  let selectDay = query.contractList.find((item: any) => item.label === val);
  if (selectDay !== undefined) {
    cityname.value = selectDay.cityName;
  }
};
//付款金额输入
const getpayment = (e: any) => {
  showList.value = true;
  nameList.value = [];
  query.tableData.forEach((v: any) => {
    let obj = {
      payment: Number(e * v.contractAmountProportion).toFixed(2),
      name: v.subjectName,
      budgetSubjectId: v.subjectId,
    };

    nameList.value.push(obj);
  });
};
//付款金额输入
const paymentPut = (item: any) => {
  let nu = 0;
  item.map((v: any) => {
    nu += Number(v.payment);
  });
  query.payment = nu;
};
//付款方式类别选择
const paymentMethodChange = (val: any) => {
  let list = [
    {
      value: "k3qyajs4-njlbp9qhi9g-1",
      text: "CASH",
    },
    {
      value: "k3qyajs4-6lxuealpiu4-13",
      text: "BANK_CARDS",
    },
    {
      value: "k3qyajs4-snhe6ccvbko-11",
      text: "CHEQUE",
    },
    {
      value: "k3qyajs4-zsqgx0bywg-9",
      text: "WIRE_TRANSFER",
    },
    {
      value: "k3qyajs4-1yoz83ne4u4-7",
      text: "DRAFT",
    },
    {
      value: "k3qyajs4-2iqoo6rx1gl-5",
      text: "CREDIT",
    },
    {
      value: "k3qyajs4-lgejoyoj14-3",
      text: "OTHER",
    },
  ];
  let data: any = [];
  list.map((item: any) => {
    if (val === item.text) {
      data.push(item);
    }
  });
  query.paymentMethodData = data;
};
//上传文件
const upload = (param: any) => {
  loading.value = true;
  query.uploadshow = false;
  const formData = new FormData();
  formData.set("content", param.file);
  formData.set("type", "attachment");
  formData.set("name", param.file.name);
  createFeishuUpload(formData).then((res: any) => {
    if (JSON.parse(res.msg).data.code) {
      loading.value = false;
      query.fileCode = JSON.parse(res.msg).data.code;
    }
    query.cosUrl = JSON.parse(res.msg).cos_url;
  });
};
//返回
const reverted = () => {
  window.history.go(-1);
};

//保存
const paymentcontractSubmin = () => {
  if (!query.contract) {
    return ElMessage({
      type: "error",
      message: "请先选择所属合同",
    });
  }
  if (!query.paymentMethod) {
    return ElMessage({
      type: "error",
      message: "请选择付款方式",
    });
  }
  if (!query.paymentDate) {
    return ElMessage({
      type: "error",
      message: "请选择付款日期",
    });
  }
  if (!query.cosUrl) {
    return ElMessage({
      type: "error",
      message: "请上传附件",
    });
  }
  if (!query.paymentRemarks) {
    return ElMessage({
      type: "error",
      message: "请输入付款事由",
    });
  }
  let list: any = [];
  nameList.value.map((v: any) => {
    let data = {
      payments: v.payment,
    };
    list.push(data);
  });
  query.tableData = query.tableData.map((item: any, index: any) => {
    return { ...item, ...list[index] };
  });
  //所属合同
  let contractx = "";
  //方式
  let way = "";
  query.contractList.map((v: any) => {
    if (v.value === query.contract) {
      contractx = v.lable;
    }
  });
  query.paymentMethodList.map((v: any) => {
    if (query.paymentMethod == v.value) {
      way = v.label;
    }
  });
  const user = JSON.parse(localStorage.getItem("users") || "");
  let data = {
    contractId: query.contract,
    paymentDate: query.paymentDate,
    paymentWay: query.paymentMethod,
    file: query.cosUrl,
    applicationNotes: query.paymentRemarks,
    budgetSubjectPayments: nameList.value,
    fileCode: query.fileCode,
  };
  getsubmitContractualFeeApply(data).then((response: any) => {
    if (response.code === 200) {
      loading.value = true;
      submitList.value = [];
      query.tableData.forEach((v: any) => {
        //合同付款审批
        let contractPaymentList = [
          // 正式环境
          //所属合同
          {
            id: "widget16974235474810001",
            type: "input",
            value: contractx + "",
          },
          //付款方式
          {
            id: "widget16974235496620001",
            type: "input",
            value: way + "",
          },
          //付款日期
          {
            id: "widget16974235520760001",
            type: "input",
            value: query.paymentDate + "",
          },
          // //科目编号
          {
            id: "widget16974235537890001",
            type: "input",
            value: v.subjectCode + "",
          },
          //付款金额
          {
            id: "widget16974236353870001",
            type: "amount",
            currency: "CNY",
            value: Number(v.payments),
          },
          //预算费用合计
          {
            id: "widget16974236365140001",
            type: "amount",
            currency: "CNY",
            value: Number(v.costAmount),
          },
          //合同金额
          {
            id: "widget16974236615070001",
            type: "amount",
            currency: "CNY",
            value: Number(v.contractAmount),
          },
          //剩余合同金额
          {
            id: "widget16974236720380001",
            type: "amount",
            currency: "CNY",
            value: Number(v.ableContractAmount),
          },
          //付款事由
          {
            id: "widget16974236961970001",
            type: "textarea",
            value: query.paymentRemarks,
          },
          //附件
          {
            id: "widget16974237283850001",
            type: "attachmentV2",
            value: [query.fileCode],
          },
        ];
        //合同付款审批测试
        let contractPaymentListTest = [
          //所属合同
          {
            id: "widget16967537786820001",
            type: "input",
            value: contractx + "",
          },
          //付款方式
          {
            id: "widget16967538245300001",
            type: "input",
            value: way + "",
          },
          //付款日期
          {
            id: "widget16967538484230001",
            type: "input",
            value: query.paymentDate + "",
          },
          // //科目编号
          {
            id: "widget16967538861220001",
            type: "input",
            value: v.subjectCode + "",
          },
          //付款金额
          {
            id: "widget16510492513760001",
            type: "amount",
            currency: "CNY",
            value: Number(v.payments),
          },
          //预算费用合计
          {
            id: "widget16967539183990001",
            type: "amount",
            currency: "CNY",
            value: Number(v.costAmount),
          },
          //合同金额
          {
            id: "widget16967539509670001",
            type: "amount",
            currency: "CNY",
            value: Number(v.contractAmount),
          },
          //剩余合同金额
          {
            id: "widget16967539589550001",
            type: "amount",
            currency: "CNY",
            value: Number(v.ableContractAmount),
          },
          //付款事由
          {
            id: "widget16510492382000001",
            type: "textarea",
            value: query.paymentRemarks,
          },
          //附件
          {
            id: "widget16510493307470001",
            type: "attachmentV2",
            value: [query.fileCode],
          },
        ];
        const formData = new FormData();
        // TODO 合同付款审批
        // 正式
        // formData.append("params", JSON.stringify(contractPaymentList));
        // formData.append("approvalCode", "0C9044BF-E632-42E6-AB19-E239457AC946");

        // 测试
        formData.append("params", JSON.stringify(contractPaymentListTest));
        formData.append("approvalCode", "EAE47F26-3490-4417-A77E-1108A65F84AF");

        formData.append("feishuUserId", user.feishuUserId);
        // 提交审批创建飞书实例
        getfeishuCreatesAnApproval(formData).then((res: any) => {
          loading.value = false;
          if (res.code == 200) {
            const results = JSON.parse(res.msg);
            response.data.forEach((v: any) => {
              let responseList = {
                id: results.data.instance_code,
                code: v,
              };
              submitList.value.push(responseList);
            });
          }
        });
      });
      setTimeout(() => {
        let data = [];
        var obj: any = {};
        data = submitList.value.reduce(function (item: any, next: any) {
          obj[next.id]
            ? ""
            : (obj[next.id] =
                true && obj[next.code]
                  ? ""
                  : (obj[next.code] = true && item.push(next)));
          return item;
        }, []);
        data.forEach((item: any) => {
          // 提交飞书信息录入
          gettApprovaInstance({
            instanceCode: item.id,
            attachment: query.cosUrl, //附件
            sourceId: item.code,
            sourceType: "ProjectBudget",
            sourceBy: localStorage.getItem("username"),
            budgetExamineId: item.code,
          }).then((res: any) => {
            loading.value = false;
            if (res.code === 200) {
              ElMessage({
                type: "success",
                message: "提交审批成功",
              });
              showList.value = true;
              query.payment = 0;
              query.paymentMethod = "";
              query.paymentDate = "";
              query.cosUrl = "";
              query.fileList = [];
              query.paymentRemarks = "";
              nameList.value = [];
              query.tableData.forEach((v: any) => {
                let obj = {
                  payment: Number(
                    query.payment * v.contractAmountProportion
                  ).toFixed(2),
                  name: v.subjectName,
                  budgetSubjectId: v.subjectId,
                };

                nameList.value.push(obj);
              });
            }
          });
        });
      }, 2000);
    }
  });
};
//上传附件
const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  console.log(uploadFile);
};
//删除上传文件
const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  query.uploadshow = true;
};
//删除上传文件
const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(`是否删除文件 ${uploadFile.name} ?`).then(
    () => true,
    () => false
  );
};
//文件上传提交成功
const handleSuccess: UploadProps["onSuccess"] = (res, uploadFile) => {
  console.log(res, uploadFile);
};
//文件上传格式
const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  );
};
//获取所属合同
const contractList = () => {
  let data = {
    projectId: id.id,
  };
  getlistContractByProjectId(data).then((res: any) => {
    query.contractList = res.data;
  });
};
//初始化
onMounted(() => {
  id.id = route.query.peojectId;
  //付款方式枚举
  paymentMethod();
  contractList();
});
</script>
<style lang="scss" scoped>
@import "../css/examineandapprove.scss";
</style>
