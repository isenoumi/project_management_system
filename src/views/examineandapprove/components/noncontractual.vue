<template>
  <div v-loading="loading">
    <!-- 特殊表单 -->
    <div v-for="(item, index) in formTab.list" :key="index" class="list-form">
      <div class="add-carefuls">
        <div class="inputs">
          <div class="title">科目*:</div>
          <el-select
            v-model="item.oneLevel"
            class="m-2"
            @change="oneChange(item.oneLevel, index)"
            placeholder="请选择一级科目"
          >
            <el-option
              v-for="(items, index) in item.oneSubject"
              :key="index"
              :label="items.label"
              :value="items.value || ''"
            />
          </el-select>
          <el-select
            v-model="item.secondary"
            class="m-2"
            @change="twoChange(item.secondary, index)"
            placeholder="请选择二级科目"
          >
            <el-option
              v-for="(items, index) in item.twoSubject"
              :key="index"
              :label="items.label"
              :value="items.value || ''"
            />
          </el-select>
          <el-select
            v-model="item.threeLevel"
            class="m-2"
            @change="threeChange(item.threeLevel, index)"
            placeholder="请选择三级科目"
          >
            <el-option
              v-for="(items, index) in item.threeSubject"
              :key="index"
              :label="items.label"
              :value="items.value || ''"
            />
          </el-select>
        </div>
        <div>
          <el-button
            v-if="index + 1 == formTab.list.length"
            type="primary"
            @click="addItem()"
          >
            添加付款审批
          </el-button>
          <el-button
            v-if="index !== 0"
            type="danger"
            @click="deleteItem(item, index)"
          >
            删除
          </el-button>
        </div>
      </div>
      <div style="margin-top: 25px">
        <el-table
          :data="item.datalist"
          :header-row-style="{ height: '60px' }"
          :row-style="{ height: '50px' }"
          :border="true"
          style="width: 100%"
          :cell-style="{ textAlign: 'center' }"
          :header-cell-style="{
            'text-align': 'center',
          }"
        >
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            width="60"
          />
          <el-table-column prop="code" label="科目编号" width="90" />
          <el-table-column prop="name" label="预算科目类别" width="110" />
          <el-table-column prop="costAmount" label="预算费用合计" width="120" />
          <el-table-column prop="payAmount" label="付款费用合计" width="120" />
          <el-table-column
            prop="overExpenditure"
            label="是否超标"
            width="100"
          />
          <el-table-column prop="januaryCost" label="1月" />
          <el-table-column prop="februaryCost" label="2月" />
          <el-table-column prop="marchCost" label="3月" />
          <el-table-column prop="aprilCost" label="4月" />
          <el-table-column prop="mayCost" label="5月" />
          <el-table-column prop="juneCost" label="6月" />
          <el-table-column prop="julyCost" label="7月" />
          <el-table-column prop="augustCost" label="8月" />
          <el-table-column prop="septemberCost" label="9月" />
          <el-table-column prop="octoberCost" label="10月" />
          <el-table-column prop="novemberCost" label="11月" />
          <el-table-column prop="decemberCost" label="12月" />
        </el-table>
      </div>
      <div class="add-carefuls">
        <div class="inputs">
          <div class="title">所属月份:</div>
          <el-select
            style="width: 180px"
            :disabled="item.monthshow"
            @change="monthChange(item.getMonth, index, item.datalist)"
            v-model="item.getMonth"
            class="m-2"
            placeholder="请选择所属月份"
          >
            <el-option
              v-for="items in item.getNotNullMonthoptions"
              :key="items.value"
              :label="items.label"
              :value="items.value"
            />
          </el-select>
        </div>
        <div class="inputs">
          <div class="title">付款金额:</div>
          <el-input
            style="width: 180px"
            :disabled="item.monthshow"
            v-model="item.payAmount"
            placeholder="请输入付款金额"
          />
        </div>
        <div class="inputs">
          <div class="title">付款方式:</div>
          <el-select
            :disabled="item.monthshow"
            style="width: 180px"
            v-model="item.paymentPlatform"
            @change="paymentMethodChange"
            class="m-2"
            placeholder="请选择付款方式"
          >
            <el-option
              v-for="items in item.paymentPlatformList"
              :key="items.value"
              :label="items.label"
              :value="items.value"
            />
          </el-select>
        </div>
        <div class="inputs">
          <div class="title">付款日期:</div>
          <el-date-picker
            :disabled="item.monthshow"
            style="width: 180px"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            v-model="item.paymentDate"
            type="date"
            placeholder="请选择时间"
          />
        </div>
        <div class="inputs">
          <div class="title">收款人(单位)全称:</div>
          <el-input
            :disabled="item.monthshow"
            style="width: 180px"
            v-model="item.payeeUnit"
            placeholder="请输入收款人单位"
          />
        </div>
        <div class="inputs">
          <div class="title">开户行:</div>
          <el-input
            :disabled="item.monthshow"
            style="width: 180px"
            v-model="item.openAccountBank"
            placeholder="请输入银行账户"
          />
        </div>
        <div class="inputs">
          <div class="title">银行账户:</div>
          <el-input
            :disabled="item.monthshow"
            style="width: 180px"
            v-model="item.bankAccount"
            placeholder="请输入银行账户"
          />
        </div>
      </div>
      <div class="down">
        <el-upload
          v-model:file-list="item.fileList"
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
          <el-button type="text" @click="btnupload(index)">上传附件</el-button>
        </el-upload>
      </div>
      <div class="add-carefuls">
        <div class="textarea">
          <div>付款事由：</div>
          <div class="input-textarea">
            <el-input
              :disabled="item.monthshow"
              maxlength="1000"
              placeholder="请输入付款事由"
              show-word-limit
              type="textarea"
              v-model="item.paymentRemarks"
              :autosize="{ minRows: 6, maxRows: 8 }"
            />
          </div>
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
        :disabled="flag.show"
        style="margin-right: 15px"
        >保存</el-button
      >
      <el-button @click="reverted" type="info" plain>返回</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import {
  getlevel1Subjects,
  getlevel2Subjects,
  getbudpage,
  getselectPaymentWayEnums,
  getsubmitNonContractualFeeApply,
  getfeishuCreatesAnApproval,
  gettApprovaInstance,
} from "@/api/budget";
import type { UploadProps } from "element-plus";
import { createFeishuUpload } from "@/api/plan/feishu/index";
import { useRoute } from "vue-router";
const route = useRoute();
const loading = ref(false);
//上传文件
const uploadData = ref({
  name: "文件",
  type: "attachment",
});
const show = reactive({
  upload: true,
});
const submitList = ref<any>([
  {
    code: "",
    id: "",
  },
]);
//按钮禁用状态
const flag = reactive<any>({
  show: false,
});
const datalist = reactive<any>({
  fileCode: [],
  cosUrl: "",
  num: 0,
  id: "",
  projectId: "",
  peojectId: "",
});
//非合同付款申请
const formTab = ref<any>({
  list: [
    {
      fileCode: [],
      openAccountBank: "",
      cosUrl: "",
      monthshow: true,
      //一级科目
      oneLevel: "",
      //二级科目
      secondary: "",
      //三级科目
      threeLevel: "",
      //所属月份
      getMonth: "",
      //付款金额
      payAmount: "0",
      //付款方式
      paymentPlatform: "",
      //付款日期
      paymentDate: "",
      //收款人(单位)全称
      payeeUnit: "",
      //银行账户
      bankAccount: "",
      //付款事由
      paymentRemarks: "",
      //上传附件
      fileList: [],
      //一级科目列表
      oneSubject: [],
      //二级科目列表
      twoSubject: [],
      //三级科目列表
      threeSubject: [],
      //表格数据列表
      datalist: [],
      //所属月份列表
      getNotNullMonthoptions: [
        {
          label: "全月份",
          value: "12",
        },
        {
          label: "1月",
          value: "1",
        },
        {
          label: "2月",
          value: "2",
        },
        {
          label: "3月",
          value: "3",
        },
        {
          label: "4月",
          value: "4",
        },
        {
          label: "5月",
          value: "5",
        },
        {
          label: "6月",
          value: "6",
        },
        {
          label: "7月",
          value: "7",
        },
        {
          label: "8月",
          value: "8",
        },
        {
          label: "9月",
          value: "9",
        },
        {
          label: "10月",
          value: "10",
        },
        {
          label: "11月",
          value: "11",
        },
      ],
      //付款方式
      paymentPlatformList: [],
    },
  ],
});
//返回
const reverted = () => {
  window.history.go(-1);
};
//支付方式枚举
const paymentMethod = () => {
  getselectPaymentWayEnums().then((res: any) => {
    formTab.value.list[0].paymentPlatformList = res.data;
  });
};
//保存
const paymentcontractSubmin = () => {
  console.log(datalist.fileCode, "formTab.value.list[0].payeeUnit");
  const user = JSON.parse(localStorage.getItem("users") || "");
  let result: any = {};
  let reslist: any = [];
  let num = "";
  let moon = "";
  let date = "";
  let annex = "";
  let notes = "";
  let pay = "";
  let payeeUnit = "";
  let openAccountBank = "";
  let bankAccount = "";
  let data: any = {
    budgetId: datalist.id,
    addReqs: [],
  };
  formTab.value.list.map((v: any) => {
    let list: any = {
      fileCode: datalist.fileCode,
      getMonth: v.getMonth,
      file: v.cosUrl,
      applicationNotes: v.paymentRemarks,
      paymentDate: v.paymentDate,
      budgetSubjectId: v.threeLevel,
      payAmount: v.payAmount,
      paymentWay: v.paymentPlatform,
      payeeUntil: v.payeeUnit,
      bankAccount: v.bankAccount,
      openAccountBank: v.openAccountBank,
    };
    data.addReqs.push(list);
  });
  data.addReqs.map((item: any) => {
    if (!item.budgetSubjectId) {
      num = "0";
    }
    if (!item.getMonth) {
      moon = "1";
    }
    if (!item.paymentDate) {
      date = "1";
    }
    if (!item.file) {
      annex = "1";
    }
    if (!item.applicationNotes) {
      notes = "1";
    }
    if (!item.paymentWay) {
      pay = "1";
    }

    if (!item.openAccountBank) {
      openAccountBank = "1";
    }
    if (!item.bankAccount) {
      bankAccount = "1";
    }
  });
  if (num === "0") {
    return ElMessage({
      type: "error",
      message: "请先选择科目",
    });
  }
  if (moon === "1") {
    return ElMessage({
      type: "error",
      message: "请选择所属月份",
    });
  }
  if (pay === "1") {
    return ElMessage({
      type: "error",
      message: "请选择付款方式",
    });
  }
  if (date === "1") {
    return ElMessage({
      type: "error",
      message: "请选择付款日期",
    });
  }
  if (payeeUnit === "1") {
    return ElMessage({
      type: "error",
      message: "请输入收款人单位名称",
    });
  }
  if (openAccountBank === "1") {
    return ElMessage({
      type: "error",
      message: "请输入开户行",
    });
  }
  if (bankAccount === "1") {
    return ElMessage({
      type: "error",
      message: "请输入银行账户",
    });
  }
  if (annex === "1") {
    return ElMessage({
      type: "error",
      message: "请上传附件",
    });
  }
  if (notes === "1") {
    return ElMessage({
      type: "error",
      message: "请输入付款事由",
    });
  }

  getsubmitNonContractualFeeApply(data).then((response: any) => {
    if (response.code === 200) {
      loading.value = true;
      reslist = response.data;
      submitList.value = [];
      formTab.value.list.map((v: any) => {
        v.getNotNullMonthoptions.map((v1: any) => {
          if (v1.value === "12") {
            v.getMonth = v1.label;
          }
        });
        v.oneSubject.map((v1: any) => {
          if (v1.value === v.oneLevel) {
            v.oneLevel = v1.label;
          }
        });

        v.twoSubject.map((v1: any) => {
          if (v1.value === v.secondary) {
            v.secondary = v1.label;
          }
        });
        v.threeSubject.map((v1: any) => {
          if (v1.value === v.threeLevel) {
            v.threeLevel = v1.label;
          }
        });

        v.paymentPlatformList.map((v1: any) => {
          if (v1.value === v.paymentPlatform) {
            v.paymentPlatform = v1.label;
          }
        });
        const formData = new FormData();
        //合同付款审批
        const contractPaymentList = [
          // 正式环境
          //一级科目
          {
            id: "widget16921499222090001",
            type: "input",
            value: v.oneLevel + "",
          },
          //二级科目
          {
            id: "widget16921499226570001",
            type: "input",
            value: v.secondary + "",
          },
          //三级科目
          {
            id: "widget16921499230730001",
            type: "input",
            value: v.threeLevel + "",
          },
          //科目编号
          {
            id: "widget16921499729000001",
            type: "input",
            value: v.datalist[0].code + "",
          },
          //是否超标
          {
            id: "widget16921499758170001",
            type: "input",
            value: v.datalist[0].overExpenditure + "",
          },
          //预算费用合计
          {
            id: "widget16974239296620001",
            type: "amount",
            currency: "CNY",
            value: Number(v.datalist[0].costAmount),
          },
          //付款费用合计
          {
            id: "widget16974239321060001",
            type: "amount",
            currency: "CNY",
            value: Number(v.datalist[0].payAmount),
          },
          //付款金额
          {
            id: "widget16974239541340001",
            type: "amount",
            currency: "CNY",
            value: Number(v.payAmount),
          },
          //所属月份
          {
            id: "widget16974239674270001",
            type: "input",
            value: v.getMonth + "",
          },
          //付款方式
          {
            id: "widget16974240183670001",
            type: "input",
            value: v.paymentPlatform + "",
          },
          //付款日期
          {
            id: "widget16974239834150001",
            type: "input",
            value: v.paymentDate + "",
          },
          //收款人（单位）全称
          {
            id: "widget16974240326500001",
            type: "input",
            value: v.payeeUnit,
          },
          //开户银行
          {
            id: "widget16974240504600001",
            type: "input",
            value: v.openAccountBank,
          },
          //银行账户
          {
            id: "widget16974240640420001",
            type: "input",
            value: v.bankAccount,
          },
          //付款事由
          {
            id: "widget0",
            type: "textarea",
            value: v.paymentRemarks + "",
          },
          //附件
          {
            id: "widget15828099482720001",
            type: "attachmentV2",
            value: [v.fileCode],
          },
        ];
        const contractPaymentListTest = [
          // 正式环境
          //一级科目
          {
            id: "widget16966645333720001",
            type: "input",
            value: v.oneLevel + "",
          },
          //二级科目
          {
            id: "widget16966646053290001",
            type: "input",
            value: v.secondary + "",
          },
          //三级科目
          {
            id: "widget16966646111610001",
            type: "input",
            value: v.threeLevel + "",
          },
          //科目编号
          {
            id: "widget16966646186920001",
            type: "input",
            value: v.datalist[0].code + "",
          },
          //是否超标
          {
            id: "widget16967486122830001",
            type: "input",
            value: v.datalist[0].overExpenditure + "",
          },
          //预算费用合计
          {
            id: "widget16966646381500001",
            type: "amount",
            currency: "CNY",
            value: Number(v.datalist[0].costAmount),
          },
          //付款费用合计
          {
            id: "widget16966646780140001",
            type: "amount",
            currency: "CNY",
            value: Number(v.datalist[0].payAmount),
          },
          //付款金额
          {
            id: "widget16967330962780001",
            type: "amount",
            currency: "CNY",
            value: Number(v.payAmount),
          },
          //所属月份
          {
            id: "widget16967310860240001",
            type: "input",
            value: v.getMonth + "",
          },
          //付款方式
          {
            id: "widget16967314831190001",
            type: "input",
            value: v.paymentPlatform + "",
          },
          //付款日期
          {
            id: "widget16967323059110001",
            type: "input",
            value: v.paymentDate + "",
          },
          //收款人（单位）全称
          {
            id: "widget16966649115750001",
            type: "input",
            value: v.payeeUnit,
          },
          //开户银行
          {
            id: "widget16966649315540001",
            type: "input",
            value: v.openAccountBank,
          },
          //银行账户
          {
            id: "widget16966649429250001",
            type: "input",
            value: v.bankAccount,
          },
          //付款事由
          {
            id: "widget16966649623880001",
            type: "textarea",
            value: v.paymentRemarks + "",
          },
          //附件
          {
            id: "widget16510493307470001",
            type: "attachmentV2",
            value: [v.fileCode],
          },
        ];
        // TODO 非合同付款审批
        // 正式环境
        // formData.append("params", JSON.stringify(contractPaymentList));
        // formData.append("approvalCode", "99C80AEA-A4A2-44D7-BF37-BF582736ACBA");

        // 测试环境
        formData.append("params", JSON.stringify(contractPaymentListTest));
        formData.append("approvalCode", "DF131AA0-467E-43F6-8AEE-952D04BFC590");

        formData.append("feishuUserId", user.feishuUserId);
        // 提交审批创建飞书实例
        getfeishuCreatesAnApproval(formData).then((res: any) => {
          if (res.code == 200) {
            result = JSON.parse(res.msg);
            response.data.map((v1: any) => {
              let responseList = {
                id: result.data.instance_code,
                code: v1,
                fileUrl: v.cosUrl,
              };
              submitList.value.push(responseList);
            });
          }
        });
      });
      setTimeout(() => {
        let data = [];
        var contractobj: any = {};
        data = submitList.value.reduce(function (item: any, next: any) {
          contractobj[next.id]
            ? ""
            : (contractobj[next.id] =
                true && contractobj[next.code]
                  ? ""
                  : (contractobj[next.code] =
                      true && contractobj[next.fileUrl]
                        ? ""
                        : (contractobj[next.fileUrl] =
                            true && item.push(next))));
          return item;
        }, []);
        data.forEach((item: any) => {
          gettApprovaInstance({
            instanceCode: item.id,
            attachment: item.fileUrl, //附件
            sourceId: item.code,
            sourceType: "ProjectBudget",
            sourceBy: localStorage.getItem("username"),
            budgetExamineId: item.code,
          }).then((res: any) => {
            if (res.code === 200) {
              loading.value = false;
              formTab.value.list = [
                {
                  openAccountBank: "",
                  cosUrl: "",
                  monthshow: true,
                  //一级科目
                  oneLevel: "",
                  //二级科目
                  secondary: "",
                  //三级科目
                  threeLevel: "",
                  //所属月份
                  getMonth: "",
                  //付款金额
                  payAmount: "0",
                  //付款方式
                  paymentPlatform: "",
                  //付款日期
                  paymentDate: "",
                  //收款人(单位)全称
                  payeeUnit: "",
                  //银行账户
                  bankAccount: "",
                  //付款事由
                  paymentRemarks: "",
                  //上传附件
                  fileList: [],
                  //一级科目列表
                  oneSubject: formTab.value.list[0].oneSubject,
                  //二级科目列表
                  twoSubject: formTab.value.list[0].twoSubject,
                  //三级科目列表
                  threeSubject: formTab.value.list[0].threeSubject,
                  //表格数据列表
                  datalist: [],
                  //所属月份列表
                  getNotNullMonthoptions: [
                    {
                      label: "1月",
                      value: "1",
                    },
                    {
                      label: "2月",
                      value: "2",
                    },
                    {
                      label: "3月",
                      value: "3",
                    },
                    {
                      label: "4月",
                      value: "4",
                    },
                    {
                      label: "5月",
                      value: "5",
                    },
                    {
                      label: "6月",
                      value: "6",
                    },
                    {
                      label: "7月",
                      value: "7",
                    },
                    {
                      label: "8月",
                      value: "8",
                    },
                    {
                      label: "9月",
                      value: "9",
                    },
                    {
                      label: "10月",
                      value: "10",
                    },
                    {
                      label: "11月",
                      value: "11",
                    },
                    {
                      label: "12月",
                      value: "12",
                    },
                  ],
                  //付款方式
                  paymentPlatformList:
                    formTab.value.list[0].paymentPlatformList,
                },
              ];
              return ElMessage({
                type: "success",
                message: "提交审批成功",
              });
            } else {
              loading.value = false;
            }
          });
        });
      }, 2000);
    }
  });
};
//付款方式下拉改变
const paymentMethodChange = () => {};

//删除非合同报销
const deleteItem = (item: any, index: any) => {
  formTab.value.list.splice(index, 1);
};

//非合同报销费用
const addItem = () => {
  formTab.value.list.push({
    fileCode: [],
    openAccountBank: "",
    cosUrl: "",
    monthshow: true,
    //一级科目
    oneLevel: "",
    //二级科目
    secondary: "",
    //三级科目
    threeLevel: "",
    //所属月份
    getMonth: "",
    //付款金额
    payAmount: "0",
    //付款方式
    paymentPlatform: "",
    //付款日期
    paymentDate: "",
    //收款人(单位)全称
    payeeUnit: "",
    //银行账户
    bankAccount: "",
    //付款事由
    paymentRemarks: "",
    //上传附件
    fileList: [],
    //一级科目列表
    oneSubject: formTab.value.list[0].oneSubject,
    //二级科目列表
    twoSubject: formTab.value.list[0].twoSubject,
    //三级科目列表
    threeSubject: formTab.value.list[0].threeSubject,
    //表格数据列表
    datalist: [],
    //所属月份列表
    getNotNullMonthoptions: [
      {
        label: "全月份",
        value: "12",
      },
      {
        label: "1月",
        value: "1",
      },
      {
        label: "2月",
        value: "2",
      },
      {
        label: "3月",
        value: "3",
      },
      {
        label: "4月",
        value: "4",
      },
      {
        label: "5月",
        value: "5",
      },
      {
        label: "6月",
        value: "6",
      },
      {
        label: "7月",
        value: "7",
      },
      {
        label: "8月",
        value: "8",
      },
      {
        label: "9月",
        value: "9",
      },
      {
        label: "10月",
        value: "10",
      },
      {
        label: "11月",
        value: "11",
      },
    ],
    //付款方式
    paymentPlatformList: formTab.value.list[0].paymentPlatformList,
  });
};
//上传文件
const upload = (param: any) => {
  loading.value = true;
  show.upload = false;
  const formData = new FormData();
  formData.set("content", param.file);
  formData.set("type", "attachment");
  formData.set("name", param.file.name);
  createFeishuUpload(formData).then((res: any) => {
    if (JSON.parse(res.msg).data.code) {
      loading.value = false;
      datalist.fileCode = JSON.parse(res.msg).data.code;
      formTab.value.list[datalist.num].fileCode = JSON.parse(res.msg).data.code;
      console.log(datalist.fileCode, "JSON.parse(res.msg).data.code");
    }
    formTab.value.list[datalist.num].cosUrl = JSON.parse(res.msg).cos_url;
    datalist.cosUrl = JSON.parse(res.msg).cos_url;
  });
};
//上传附件
const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  console.log(uploadFile);
};
//删除上传文件
const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  show.upload = true;
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
//序号
const indexMethod = (index: number) => {
  return index * 1 + 1;
};
//一级科目下拉改变
const oneChange = (e: any, index: any) => {
  let data = {
    id: e,
  };
  getlevel2Subjects(data).then((res: any) => {
    if (res.code === 200) {
      formTab.value.list.map((v: any) => {
        v.twoSubject = res.data;
      });
      formTab.value.list[index].secondary = "";
      formTab.value.list[index].threeLevel = "";
    }
  });
};
//获取一级科目下拉
const getlevel1Subject = () => {
  let data = {
    projectId: datalist.peojectId,
  };
  getlevel1Subjects(data).then((res: any) => {
    if (res.code === 200) {
      formTab.value.list.map((v: any) => {
        v.oneSubject = res.data;
      });
    }
  });
};
//二级科目下拉获取
const twoChange = (e: any, index: any) => {
  let data = {
    id: e,
  };
  getlevel2Subjects(data).then((res: any) => {
    if (res.code === 200) {
      formTab.value.list[index].threeSubject = res.data;
      formTab.value.list[index].threeLevel = "";
    }
  });
};
//三级科目下拉
const threeChange = (e: any, index: any) => {
  let data = {
    id: e,
  };
  getbudpage(data).then((res: any) => {
    if (res.code === 200) {
      if (res.data.overExpenditure === 0) {
        res.data.overExpenditure = "未超过";
      } else if (res.data.overExpenditure === 1) {
        res.data.overExpenditure = "超过";
      }
      let list = [];
      list.push(res.data);
      formTab.value.list[index].datalist = [];
      formTab.value.list[index].datalist = list;
    }
    formTab.value.list[index].monthshow = false;
  });
};
//月份下拉
const monthChange = (e: any, index: any, data: any) => {};
//文件上传提交成功
const btnupload = (index: any) => {
  datalist.num = index;
};
//初始化
onMounted(() => {
  if (route.query.id) {
    datalist.id = route.query.id;
    datalist.peojectId = route.query.peojectId;
    datalist.projectId = route.query.projectId;
  }
  paymentMethod();
  //一级科目下拉
  getlevel1Subject();
});
</script>
<style lang="scss" scoped>
@import "../css/examineandapprove.scss";
</style>
