<template>
  <div class="app-container">
    <el-card>
      <div style="font-size: 20px; font-weight: 500">付款审批</div>
      <div style="font-size: 20px; font-weight: 600; margin-top: 15px">
        一级科目:{{ title.illustrate.fname }}
      </div>
      <div style="font-size: 20px; font-weight: 600; margin: 10px 0">
        二级科目:{{ title.illustrate.sname }}
      </div>
      <div style="font-size: 20px; font-weight: 600">
        三级科目:{{ header_data.threename }}
      </div>
      <div style="margin-top: 25px">
        <el-table
          :data="ids.list"
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
      <div>
        <el-tabs
          v-model="activeName"
          type="border-card"
          class="demo-tabs"
          @tab-click="handleClick"
        >
          <el-tab-pane label="新增付款审批" name="first">
            <el-row :gutter="12">
              <el-col :span="24" class="examine-card">
                <el-card shadow="always">
                  <div class="add-careful">
                    <div class="input">
                      <div class="title">审批类型选择:</div>
                      <el-select
                        v-model="header_data.procesSelect"
                        class="m-2"
                        @change="carefulchange"
                        placeholder="请选择审批类别"
                      >
                        <el-option
                          v-for="item in header_data.approvalTypeList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                    <div class="input">
                      <div class="title">项目编号:</div>
                      <el-input
                        disabled
                        v-model="header_data.projectCode"
                        placeholder="请输入项目编号"
                      />
                    </div>
                    <div class="input">
                      <div class="title">一级科目:</div>
                      <el-input
                        disabled
                        v-model="header_data.onelevel"
                        placeholder="请输入一级科目"
                      />
                    </div>
                    <div class="input">
                      <div class="title">二级科目:</div>
                      <el-input
                        disabled
                        v-model="header_data.secondary"
                        placeholder="请输入二级科目"
                      />
                    </div>
                    <div class="input">
                      <div class="title">三级科目:</div>
                      <el-input
                        disabled
                        v-model="header_data.threename"
                        placeholder="请输入三级科目"
                      />
                    </div>
                    <div class="input">
                      <div class="title">所属月份:</div>
                      <el-select
                        v-model="header_data.getMonth"
                        class="m-2"
                        @change="monthchange"
                        placeholder="请选择项目类型"
                      >
                        <el-option
                          v-for="item in header_data.getNotNullMonthoptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                    <div class="input">
                      <div class="title">
                        付款金额(剩余金额,{{ ids.money }}元):
                      </div>
                      <el-input
                        @input="handleInput"
                        v-model="header_data.payAmount"
                        :disabled="header_data.paymentDisabled"
                        type="number"
                        placeholder="请输入付款金额"
                      />
                    </div>
                    <div class="textarea">
                      <div>{{ header_data.subjectMatter }}事由：</div>
                      <div class="input-textarea">
                        <el-input
                          maxlength="1000"
                          placeholder="请输入付款事由"
                          show-word-limit
                          type="textarea"
                          v-model="header_data.paymentRemarks"
                          :autosize="{ minRows: 6, maxRows: 8 }"
                        />
                      </div>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col
                :span="24"
                class="examine-card"
                v-if="
                  header_data.procesSelect === 'CONTRACT_PAYMENT_APPLICATION' ||
                  header_data.procesSelect ===
                    'NON_CONTRACTUAL_PAYMENT_APPLICATIONS' ||
                  header_data.procesSelect === 'EXPENSE_REIMBURSEMENT'
                "
              >
                <el-card shadow="hover">
                  <div class="add-careful">
                    <!-- 合同付款申请 -->
                    <div
                      class="input"
                      v-if="
                        header_data.procesSelect ===
                        'CONTRACT_PAYMENT_APPLICATION'
                      "
                    >
                      <div class="title">合同类别:</div>
                      <el-select
                        v-model="header_data.contractType"
                        class="m-2"
                        @change="contractTypeChange"
                        placeholder="请选择合同类别"
                      >
                        <el-option
                          v-for="item in header_data.contractTypeList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                    <!-- 合同付款申请和非合同付款申请 -->
                    <div
                      class="input"
                      v-if="
                        header_data.procesSelect ===
                          'CONTRACT_PAYMENT_APPLICATION' ||
                        header_data.procesSelect ===
                          'NON_CONTRACTUAL_PAYMENT_APPLICATIONS'
                      "
                    >
                      <div class="title">付款方式:</div>
                      <el-select
                        v-model="header_data.paymentMethod"
                        @change="paymentMethodChange"
                        class="m-2"
                        placeholder="请选择付款方式"
                      >
                        <el-option
                          v-for="item in header_data.paymentMethodList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                    <div
                      class="input"
                      v-if="
                        header_data.procesSelect ===
                          'CONTRACT_PAYMENT_APPLICATION' ||
                        header_data.procesSelect ===
                          'NON_CONTRACTUAL_PAYMENT_APPLICATIONS'
                      "
                    >
                      <div class="title">付款日期:</div>
                      <el-date-picker
                        v-model="header_data.paymentDate"
                        type="date"
                        placeholder="请选择时间"
                      />
                    </div>
                    <div
                      class="input"
                      v-if="
                        header_data.procesSelect ===
                          'CONTRACT_PAYMENT_APPLICATION' ||
                        header_data.procesSelect ===
                          'NON_CONTRACTUAL_PAYMENT_APPLICATIONS'
                      "
                    >
                      <div class="title">收款人(单位)全称:</div>
                      <el-input
                        v-model="header_data.payeeUnit"
                        placeholder="请输入收款人单位"
                      />
                    </div>
                    <div
                      class="input"
                      v-if="
                        header_data.procesSelect ===
                          'CONTRACT_PAYMENT_APPLICATION' ||
                        header_data.procesSelect ===
                          'NON_CONTRACTUAL_PAYMENT_APPLICATIONS'
                      "
                    >
                      <div class="title">开户银行:</div>
                      <el-input
                        v-model="header_data.depositBank"
                        placeholder="请输入开户银行"
                      />
                    </div>
                    <div
                      class="input"
                      v-if="
                        header_data.procesSelect ===
                          'CONTRACT_PAYMENT_APPLICATION' ||
                        header_data.procesSelect ===
                          'NON_CONTRACTUAL_PAYMENT_APPLICATIONS'
                      "
                    >
                      <div class="title">银行账户:</div>
                      <el-input
                        v-model="header_data.bankAccount"
                        placeholder="请输入银行账户"
                      />
                    </div>
                    <!-- 费用报销 -->
                    <div
                      class="input"
                      v-if="header_data.procesSelect == 'EXPENSE_REIMBURSEMENT'"
                    >
                      <div class="title">报销类型:</div>
                      <el-select
                        v-model="header_data.reimbursementType"
                        class="m-2"
                        @change="reimbursementTypeChange"
                        placeholder="请选择报销类型"
                      >
                        <el-option
                          v-for="item in header_data.reimbursementTypeList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                  </div>
                  <!-- 费用报销 -->
                  <div
                    class="cost-form add-careful"
                    v-if="header_data.procesSelect === 'EXPENSE_REIMBURSEMENT'"
                  >
                    <el-form
                      class="flex"
                      v-for="(item, index) in state.editForm.header"
                      :key="index"
                    >
                      <el-form-item prop="reimbursementContent">
                        <div class="input">
                          <div class="title" style="font-size: 16px">
                            付款内容:
                          </div>
                          <el-input
                            v-model="item.reimbursementContent"
                            placeholder="请输入内容"
                          />
                        </div>
                      </el-form-item>
                      <el-form-item prop="reimbursementDate">
                        <div class="input">
                          <div class="title" style="font-size: 16px">
                            付款日期:
                          </div>
                          <el-date-picker
                            v-model="item.reimbursementDate"
                            type="date"
                            value-format="YYYY-MM-DDTHH:mm:ss.SSSZ"
                            format="YYYY-MM-DD"
                            placeholder="请选择时间"
                          />
                        </div>
                      </el-form-item>
                      <el-form-item prop="reimbursementAmount">
                        <div class="input">
                          <div class="title" style="font-size: 16px">金额:</div>
                          <el-input
                            @input="reimbursementChange"
                            type="number"
                            v-model="item.reimbursementAmount"
                            placeholder="请输入CNY-人民币"
                          />
                        </div>
                      </el-form-item>
                      <el-form-item style="margin-top: 25px">
                        <el-button
                          type="primary"
                          class="ml-3"
                          @click="addDetails"
                          >添加明细</el-button
                        >
                        <el-button
                          v-if="state.editForm.header.length > 1"
                          type="info"
                          @click="deleteDetails(index)"
                          >删除</el-button
                        >
                      </el-form-item>
                    </el-form>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="24" style="margin-top: 20px" class="examine-card">
                <el-card shadow="never">
                  <div class="down">
                    <el-upload
                      v-loading="loading"
                      v-model:file-list="form.fileList"
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
                </el-card>
              </el-col>
            </el-row>
            <div class="add-careful"></div>
            <div
              class="btn"
              style="display: flex; align-items: center; margin-top: 50px"
            >
              <el-button
                @click="submin"
                type="primary"
                :disabled="flag.show"
                style="margin-right: 15px"
                >确定</el-button
              >
              <el-button @click="reverted" type="info" plain>返回</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="付款审批记录" name="second">
            <el-table
              :data="tableData.list"
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
                width="60"
                :index="
                  (e) => e + 1 + (queryParams.pageNo - 1) * queryParams.pageSize
                "
              />
              <el-table-column prop="excamineType" label="审批类型" />
              <el-table-column prop="createByUsername" label="上传人" />
              <el-table-column prop="createTime" label="申请时间" />
              <el-table-column prop="payAmount" label="付款金额" />
              <el-table-column prop="getMonth" label="所属月份" />
              <el-table-column label="附件">
                <template #default="scope">
                  <el-button
                    type="primary"
                    :bg="false"
                    link
                    @click="handleEdit(scope.$index, scope.row)"
                    >下载</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column prop="applicationNotes" label="申请备注信息" />
              <el-table-column prop="examineTime" label="审批时间" />
              <el-table-column prop="examineBudget" label="审批预算" />
              <el-table-column prop="examineRemake" label="审批备注" />
              <el-table-column prop="examineStatus" label="审核状态" />
              <!-- <el-table-column prop="applicationNotes" label="备注" /> -->
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button
                    v-if="scope.row.excamineType == '费用报销'"
                    type="primary"
                    link
                    @click="expenseDetails(scope.row)"
                    >费用明细</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div
              style="display: flex; justify-content: flex-end; margin-top: 20px"
            >
              <pagination
                v-if="ids.total > 0"
                v-model:total="ids.total"
                v-model:page="queryParams.pageNo"
                v-model:limit="queryParams.pageSize"
                @pagination="handleQuery"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
    <!-- 费用明细弹框 -->
    <el-dialog
      title="费用明细"
      v-model="header_data.expenseDetails"
      width="40%"
      align-center
    >
      <el-table
        :data="header_data.expenseDetailsList"
        :header-row-style="{ height: '60px' }"
        :row-style="{ height: '50px' }"
        :border="true"
        style="width: 100%"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{
          'text-align': 'center',
        }"
      >
        <el-table-column prop="reimbursementContent" label="付款内容" />
        <el-table-column prop="reimbursementDate" label="付款日期" />
        <el-table-column prop="reimbursementAmount" label="付款金额" />
      </el-table>
      <div style="margin-left: 250px; margin-top: 20px">
        <pagination
          v-if="ids.total > 0"
          v-model:total="header_data.total"
          v-model:page="pages.pageNo"
          v-model:limit="pages.pageSize"
          @pagination="expensedetail"
        />
      </div>
    </el-dialog>
  </div>
</template>
<!-- 图标选择器示例 -->
<script setup lang="ts">
import {
  getitemname,
  getNotNullMonth,
  budgetExamine,
  getinsert,
  getspLits,
  getfeishuCreatesAnApproval,
  gettApprovaInstance,
  getselectExamineTypeEnums,
  getselectContractTypeEnums,
  getselectPaymentWayEnums,
  getselectReimbursementTypeEnums,
  getpagebyExamineId,
} from "@/api/budget";
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { UploadProps } from "element-plus";
import { useRouter } from "vue-router";
import { createFeishuUpload } from "@/api/plan/feishu/index";
const state = reactive<any>({
  editForm: {
    header: [
      {
        reimbursementContent: "",
        reimbursementDate: "",
        reimbursementAmount: 0,
      },
    ],
  },
});

//选项卡切换
const activeName = ref("first");
//上传文件
const uploadData = ref({
  name: "文件",
  type: "attachment",
});
//加载状态
const loading = ref(false);
//路由
const route = useRoute();
//列表数据
const ids = reactive<any>({
  id: "",
  money: "0",
  list: [],
  total: 0,
  exceed: "",
});
//按钮禁用状态
const flag = reactive<any>({
  show: false,
});
//表单验证
function handleInput(value: any) {
  // 使用正则表达式验证输入值是否为正整数
  const pattern = /^[1-9]\d*$/;
  if (pattern.test(value)) {
    // 如果输入值为正整数，则直接将其赋值给 inputValue
    header_data.payAmount = value;
  } else {
    // 如果输入值不为正整数，则从中提取出数字，并将其拼接为一个字符串后赋值给 inputValue
    const num = value.match(/\d+/g);
    header_data.payAmount = num ? num.join("") : "";
  }
}
//页数和条数
const queryParams = reactive<any>({
  budgetSubjectId: "",
  pageNo: 1,
  pageSize: 10,
});
//页数和条数
const pages = reactive<any>({
  pageNo: 1,
  pageSize: 10,
});

//一级科目二级科目三级科目名称
const title = reactive<any>({
  illustrate: {},
});
const value1 = ref<[Date, Date]>([new Date(), new Date()]);
//表格数据
const tableData = reactive({
  list: [],
});
//上传文件存储名字
const cosUrl = ref("");
//表单
const form = ref({
  projectCode: "",
  taskCode: "",
  subTaskCode: "",
  fileList: [],
  remark: "",
  schedule: "",
  fileCode: [],
});
//审批选择
const examineApproveOptions = [
  {
    value: "1",
    label: "合同付款申请",
  },
  {
    value: "2",
    label: "非合同付款申请",
  },
  {
    value: "3",
    label: "费用报销",
  },
];
//表单数据
const header_data: any = reactive({
  file: "",
  threename: "",
  threelevel: "",
  secondary: "",
  onelevel: "",
  projectCode: "",
  payAmount: 0,
  getMonth: 13,
  ourUnitName: "",
  ourResponsibleName: "",
  otherUnitName: "",
  otherResponsibleName: "",
  startEndTime: "",
  name: "",
  number: "",
  date: "",
  otherPhone: "",
  total: 0,
  //费用明细列表
  expenseDetailsList: [],
  //费用明细弹框
  expenseDetails: false,
  //报销类型所需飞书实例
  reimbursementTypeData: [],
  //付款方式所需飞书实例
  paymentMethodData: [],
  //合同类别创建飞书所需数组
  contractTypeDate: [],
  //付款事由
  subjectMatter: "付款",
  //付款金额禁用状态
  paymentDisabled: false,
  //费用明细按钮
  excamineTypeBtn: false,
  getNotNullMonthoptions: [],
  //报销类型数组
  reimbursementTypeList: [],
  //支付方式数组
  paymentMethodList: [],
  //合同类别列表
  contractTypeList: [],
  //审批类型数组
  approvalTypeList: [],
  //审批类型选
  procesSelect: "",
  //付款事由
  paymentRemarks: "",
  //收款人单位
  payeeUnit: "",
  //开户行
  depositBank: "",
  //银行账户
  bankAccount: "",
  //报销类型
  reimbursementType: "",
  //付款日期
  paymentDate: "",
  //付款方式
  paymentMethod: "",
  //合同类别
  contractType: "",
});
// 点击添加明细:添加一行
const addDetails = () => {
  state.editForm.header.push({
    reimbursementContent: "",
    reimbursementDate: "",
    reimbursementAmount: 0,
  });
  if (state.editForm.header.length > 1) {
    let sum = 0;
    for (let i = 0; i < state.editForm.header.length; i++) {
      sum += Number(state.editForm.header[i].reimbursementAmount);
    }
    header_data.payAmount = sum;
  }
};
//费用明细输入事件
const reimbursementChange = () => {
  if (state.editForm.header.length == 1) {
    state.editForm.header.map((v: any) => {
      header_data.payAmount = Number(v.reimbursementAmount);
    });
  } else {
    let sum = 0;
    for (let i = 0; i < state.editForm.header.length; i++) {
      sum += Number(state.editForm.header[i].reimbursementAmount);
    }
    header_data.payAmount = sum;
  }
};
// 点击删除:删除一行
const deleteDetails = (index: number) => {
  if (state.editForm.header.length > 1) {
    state.editForm.header.splice(index, 1);
    console.log(state.editForm.header, "delete");
    let sum = 0;
    for (let i = 0; i < state.editForm.header.length; i++) {
      sum += Number(state.editForm.header[i].reimbursementAmount);
    }
    header_data.payAmount = sum;
  }
};
//重置表单
const rest = () => {
  header_data.getMonth = 13;
  header_data.payAmount = 0;
  header_data.bankAccount = "";
  header_data.paymentRemarks = "";
  header_data.contractType = "";
  header_data.paymentMethod = "";
  header_data.paymentDate = "";
  header_data.payeeUnit = "";
  header_data.depositBank = "";
  header_data.reimbursementType = "";
  state.editForm.header = [
    {
      reimbursementContent: "",
      reimbursementDate: "",
      reimbursementAmount: 0,
    },
  ];
};
//审批类型选择
const carefulchange = (val: any) => {
  rest();
  if (val == "EXPENSE_REIMBURSEMENT") {
    header_data.paymentDisabled = true;
    header_data.subjectMatter = "报销";
  } else {
    header_data.paymentDisabled = false;
    header_data.subjectMatter = "付款";
  }
};
//费用明细
const expenseDetails = (row: any) => {
  console.log(row, queryParams.pageNo, "xx");
  let data = {
    id: row.id,
    pageNo: pages.pageNo,
    pageSize: pages.pageSize,
  };
  getpagebyExamineId(data).then((res: any) => {
    console.log(res, "xxx");
    header_data.expenseDetails = true;
    header_data.expenseDetailsList = res.data.records;
    header_data.total = res.data.total;
  });
};
//合同类别选择
const contractTypeChange = (val: any) => {
  let list = [
    {
      value: "kuvyx1gz-v0f12u4jd9k-0",
      text: "ENGINEERING_CLASS",
    },
    {
      value: "kuvyx1he-drxcf82koyv-1",
      text: "MATERIAL_EQUIPMENT_CLASS",
    },
    {
      value: "kuvyx1he-d6nyaeo9ps-3",
      text: "SOFTWARE_ENGINEERING_CLASS",
    },
    {
      value: "kuvyx1he-0qbfcum23o-5",
      text: "MANAGEMENT_CLASSES",
    },
  ];
  let data: any = [];
  list.map((item: any) => {
    if (val === item.text) {
      data.push(item);
    }
  });
  header_data.contractTypeDate = data;
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
  header_data.paymentMethodData = data;
};
//报销明细类别选择
const reimbursementTypeChange = (val: any) => {
  let list = [
    {
      value: "k3qxnsi6-xgbnast102-0",
      text: "TRAVEL_EXPENSES",
    },
    {
      value: "k3qxoqnm-jftz0p5owx8-1",
      text: "ACCOMMODATION_FEE",
    },
    {
      value: "k3qxoqnm-i2q57lwtwn-9",
      text: "TRAVELLING_EXPENSES",
    },
    {
      value: "k3qxoqnm-f8kscj6csv6-7",
      text: "HOSPITALITY",
    },
    {
      value: "k3qxoqnm-wxejhab40rh-5",
      text: "GROUP_BUILDING_COSTS",
    },
    {
      value: "k3qxoqnm-e0l00fbyr2-3",
      text: "COMMUNICATION_CHARGES",
    },
    {
      value: "k3qxoqnm-0fh5kacioqg-11",
      text: "OTHER",
    },
  ];
  let data: any = [];
  list.map((item: any) => {
    if (val === item.text) {
      data.push(item);
    }
  });
  header_data.reimbursementTypeData = data;
};
//上传文件
const upload = (param: any) => {
  loading.value = true;
  const formData = new FormData();
  formData.set("content", param.file);
  formData.set("type", "attachment");
  formData.set("name", param.file.name);
  createFeishuUpload(formData).then((res: any) => {
    if (JSON.parse(res.msg).data.code) {
      loading.value = false;
      form.value.fileCode = JSON.parse(res.msg).data.code;
    }
    cosUrl.value = JSON.parse(res.msg).cos_url;
  });
};
//表格数据
function list() {
  let datas = {
    budgetSubjectId: ids.id,
    pageNo: queryParams.pageNo,
    pageSize: queryParams.pageSize,
  };
  if (ids.id) {
    getspLits(datas).then((response: any) => {
      response.data.records.map((v: any) => {
        if (v.examineStatus == "0") {
          v.examineStatus = "待审批";
        } else if (v.examineStatus == "1") {
          v.examineStatus = "审批通过";
        } else if (v.examineStatus == "2") {
          v.examineStatus = "未通过";
        }
        if (v.excamineType == "CONTRACT_PAYMENT_APPLICATION") {
          v.excamineType = "合同付款申请";
        } else if (v.excamineType == "NON_CONTRACTUAL_PAYMENT_APPLICATIONS") {
          v.excamineType = "非合同付款申请";
        } else if (v.excamineType == "EXPENSE_REIMBURSEMENT") {
          v.excamineType = "费用报销";
          header_data.excamineTypeBtn = true;
        }
      });
      tableData.list = response.data.records;
      ids.total = response.data.total;
    });
  }
}
//上传附件
const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  console.log(uploadFile);
};
//序号
const indexMethod = (index: number) => {
  return index * 1 + 1;
};
//删除上传文件
const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};
//table点击事件
const handleClick = (tab: any, event: any) => {
  console.log(tab, event);
};
//月份changen事件
function monthchange(val: any) {
  let data = {
    budgetSubjectId: ids.id,
    monthNo: val,
  };
  budgetExamine(data).then((response: any) => {
    ids.money = Number(response.data) - Number(ids.list[0].payAmount);
  });
}
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
//删除上传文件
const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `Cancel the transfer of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  );
};
//提交审批
function submin() {
  let datass = [];
  state.editForm.header.map((v: any) => {
    for (let key in v) {
      if (Object.prototype.hasOwnProperty.call(v, key)) {
        console.log("key-value", key, v[key]);
        if (key === "reimbursementContent") {
          datass.push([
            {
              id: "widget3",
              type: "input",
              value: v[key],
            },
          ]);
        } else if (key === "reimbursementDate") {
          datass.push([
            {
              id: "widget4",
              type: "date",
              value: v[key] + "",
            },
          ]);
        } else if (key === "reimbursementAmount") {
          datass.push([
            {
              id: "widget5",
              type: "amount",
              currency: "CNY",
              value: Number(v[key]),
            },
          ]);
        }
      }
    }
  });
  // console.log(data, '二维数组')
  if (Number(header_data.payAmount) <= Number(ids.money)) {
    ids.exceed = "未超预算";
  } else {
    ids.exceed = "超预算";
  }
  if (!header_data.procesSelect) {
    return ElMessage({ type: "info", message: "请选择审批类型" });
  }
  if (!header_data.payAmount) {
    return ElMessage({ type: "info", message: "请输入付款金额" });
  }

  if (!header_data.payAmount && !header_data.getMonth && !value1) {
    return ElMessage({
      type: "info",
      message: "请选择起止时间和月份以及付款金额",
    });
  }
  if (!cosUrl.value) {
    return ElMessage({ type: "info", message: "请先上传附件" });
  }
  let data = {
    budgetSubjectId: ids.id,
    budgetExamineDto: {
      fastSubject: header_data.onelevel,
      thirdSubject: header_data.threename,
      secondSubject: header_data.secondary,
      projectcode: header_data.projectCode,
      payAmount: header_data.payAmount,
      getMonth: header_data.getMonth,
      ourUnitName: header_data.ourUnitName,
      ourResponsibleName: header_data.ourResponsibleName,
      otherUnitName: header_data.otherUnitName,
      otherResponsibleName: header_data.otherResponsibleName,
      otherPhone: header_data.otherPhone,
      file: "string",
      applicationNotes: header_data.paymentRemarks,
      budgetSubjectId: ids.id,
      examineBudget: ids.money,
      budgetOverspend: ids.exceed,
      //审批类型
      excamineType: header_data.procesSelect,
      //合同类型
      contractType: header_data.contractType,
      //付款方式
      paymentWay: header_data.paymentMethod,
      //付款日期
      paymentDate: header_data.paymentDate,
      //收款人单位全称
      payeeUntil: header_data.payeeUnit,
      //开户银行
      openAccountBank: header_data.depositBank,
      //银行账户
      bankAccount: header_data.bankAccount,
      //报销类型
      reimbursementType: header_data.reimbursementType,
      //费用报销明细数组
      reimbursementDtos: state.editForm.header,
    },
    budgetAmount: ids.money,
  };
  //提交飞书实例创建
  getinsert(data).then((response: any) => {
    flag.show = true;
    // const list = [
    //     {
    //         id: "widget16913979976760001",
    //         type: "input",
    //         value: header_data.projectCode,
    //     },

    //     {
    //         id: "widget16913979976760001",
    //         type: "input",
    //         value: header_data.projectCode,
    //     },
    //     {
    //         id: "widget16913982947810001",
    //         type: "input",
    //         value: header_data.onelevel + "",
    //     },
    //     {
    //         id: "widget16913983103880001",
    //         type: "input",
    //         value: header_data.secondary + "",
    //     },
    //     {
    //         id: "widget16913983120360001",
    //         type: "input",
    //         value: header_data.threename + "",
    //     },
    //     {
    //         id: "widget16913993287970001",
    //         type: "input",
    //         value: header_data.getMonth + "",
    //     },
    //     {
    //         id: "widget16915444120570001",
    //         type: "input",
    //         value: header_data.payAmount + "",
    //     },
    //     {
    //         id: "widget16901849243650001",
    //         type: "attachmentV2",
    //         value: [form.value.fileCode],
    //     },
    //     {
    //         id: "widget16913980294030001",
    //         type: "input",
    //         value: header_data.ourUnitName,
    //     },
    //     {
    //         id: "widget16901848805320001",
    //         type: "input",
    //         value: header_data.otherUnitName,
    //     },
    //     {
    //         id: "widget16901848942380001",
    //         type: "input",
    //         value: header_data.otherResponsibleName,
    //     },
    //     {
    //         id: "widget16901849046290001",
    //         type: "input",
    //         value: header_data.otherPhone,
    //     },
    //     {
    //         id: "widget16901702754",
    //         type: "textarea",
    //         value: header_data.paymentRemarks,
    //     },
    //     // {
    //     //   id: "widget16920042076450001",
    //     //   type: "textarea",
    //     //   value: header_data.paymentRemarks,
    //     // },
    //     {
    //         id: "widget16920046990900001",
    //         type: "input",
    //         value: ids.exceed,
    //     },
    // ];
    //用户信息
    const user = JSON.parse(localStorage.getItem("users"));
    //飞书实例数据格式
    const formData = new FormData();
    // formData.append("params", JSON.stringify(list));
    if (header_data.procesSelect == "CONTRACT_PAYMENT_APPLICATION") {
      //合同付款审批
      const contractPaymentList = [
        //项目编号
        {
          id: "widget16922351122630001",
          type: "input",
          value: header_data.projectCode,
        },
        //一级科目
        {
          id: "widget16920835248480001",
          type: "input",
          value: header_data.onelevel + "",
        },
        //二级科目
        {
          id: "widget16920835268460001",
          type: "input",
          value: header_data.secondary + "",
        },
        //三级科目
        {
          id: "widget16920835287190001",
          type: "input",
          value: header_data.threename + "",
        },
        //付款金额
        {
          id: "widget16920835312280001",
          type: "input",
          value: header_data.payAmount + "",
        },
        //所属月份
        {
          id: "widget16920835341400001",
          type: "input",
          value: header_data.getMonth + "",
        },
        //是否超标
        {
          id: "widget16920836588320001",
          type: "input",
          value: ids.exceed + "",
        },

        //付款事由
        {
          id: "widget0",
          type: "textarea",
          value: header_data.paymentRemarks,
        },
        //合同类别
        {
          id: "widget16345198519540001",
          type: "radioV2",
          value: header_data.contractTypeDate[0].value,
        },
        //付款方式
        {
          id: "widget15754433486300001",
          type: "radioV2",
          value: header_data.paymentMethodData[0].value,
        },
        //付款日期
        {
          id: "widget3",
          type: "date",
          value: header_data.paymentDate,
        },
        //收款人（单位）全称
        {
          id: "widget4",
          type: "input",
          value: header_data.payeeUnit,
        },
        //开户银行
        {
          id: "widget5",
          type: "input",
          value: header_data.depositBank,
        },
        //银行账户
        {
          id: "widget8",
          type: "input",
          value: header_data.bankAccount,
        },
        //附件
        {
          id: "widget15828099482720001",
          type: "attachmentV2",
          value: [form.value.fileCode],
        },
      ];
      formData.append("params", JSON.stringify(contractPaymentList));
      formData.append("approvalCode", "9FBC1C20-A330-4D80-A566-B863DD2BED0D");
    } else if (
      header_data.procesSelect == "NON_CONTRACTUAL_PAYMENT_APPLICATIONS"
    ) {
      //非合同付款审批
      const nonContractualPayments = [
        //项目编号
        {
          id: "widget16921499209400001",
          type: "input",
          value: header_data.projectCode,
        },
        //一级科目
        {
          id: "widget16921499222090001",
          type: "input",
          value: header_data.onelevel + "",
        },
        //二级科目
        {
          id: "widget16921499226570001",
          type: "input",
          value: header_data.secondary + "",
        },
        //三级科目
        {
          id: "widget16921499230730001",
          type: "input",
          value: header_data.threename + "",
        },
        //付款金额
        {
          id: "widget16921499729000001",
          type: "input",
          value: header_data.payAmount + "",
        },
        //所属月份
        {
          id: "widget16922408817390001",
          type: "input",
          value: header_data.getMonth + "",
        },
        //是否超标
        {
          id: "widget16921499758170001",
          type: "input",
          value: ids.exceed + "",
        },

        //付款事由
        {
          id: "widget0",
          type: "textarea",
          value: header_data.paymentRemarks,
        },
        //付款方式
        {
          id: "widget15754433486300001",
          type: "radioV2",
          value: header_data.paymentMethodData[0].value,
        },
        //付款日期
        {
          id: "widget3",
          type: "date",
          value: header_data.paymentDate,
        },
        //收款人（单位）全称
        {
          id: "widget4",
          type: "input",
          value: header_data.payeeUnit,
        },
        //开户银行
        {
          id: "widget5",
          type: "input",
          value: header_data.depositBank,
        },
        //银行账户
        {
          id: "widget8",
          type: "input",
          value: header_data.bankAccount,
        },
        //附件
        {
          id: "widget15828099482720001",
          type: "attachmentV2",
          value: [form.value.fileCode],
        },
      ];
      formData.append("params", JSON.stringify(nonContractualPayments));
      formData.append("approvalCode", "99C80AEA-A4A2-44D7-BF37-BF582736ACBA");
    } else if (header_data.procesSelect == "EXPENSE_REIMBURSEMENT") {
      //费用报销申请
      const claimExpense = [
        //项目编号
        {
          id: "widget16922579027640001",
          type: "input",
          value: header_data.projectCode,
        },
        //一级科目
        {
          id: "widget16921502745900001",
          type: "input",
          value: header_data.onelevel + "",
        },
        //二级科目
        {
          id: "widget16921502749960001",
          type: "input",
          value: header_data.secondary + "",
        },
        //三级科目
        {
          id: "widget16921502754290001",
          type: "input",
          value: header_data.threename + "",
        },
        //付款金额
        {
          id: "widget16921502760440001",
          type: "input",
          value: header_data.payAmount + "",
        },
        //所属月份
        {
          id: "widget16921502764760001",
          type: "input",
          value: header_data.getMonth + "",
        },
        //是否超标
        {
          id: "widget16921504169150001",
          type: "input",
          value: ids.exceed + "",
        },

        //报销类型
        {
          id: "widget15754422868600001",
          type: "radioV2",
          value: header_data.reimbursementTypeData[0].value,
        },
        //报销事由
        {
          id: "widget1",
          type: "textarea",
          value: header_data.paymentRemarks + "",
        },
        //内容
        {
          id: "widget2",
          type: "fieldList",
          value: datass,
        },
      ];
      formData.append("params", JSON.stringify(claimExpense));
      formData.append("approvalCode", "D1337931-2F03-409F-936B-353AC23C6029");
    }

    formData.append("feishuUserId", user.feishuUserId);
    //提交审批创建飞书实例
    getfeishuCreatesAnApproval(formData).then((res: any) => {
      if (res.code == 200) {
        ElMessage({
          type: "success",
          message: "提交成功",
        });
        const result = JSON.parse(res.msg);
        //提交飞书信息录入
        gettApprovaInstance({
          instanceCode: result.data.instance_code,
          attachment: cosUrl.value, //附件
          sourceId: response.data,
          sourceType: "ProjectBudget",
          sourceBy: localStorage.getItem("username"),
          budgetExamineId: response.data,
        }).then((res: any) => {
          if (res.code === 200) {
            flag.show = false;
            window.history.go(-1);
          }
        });
      }
    });
  });
}
//分页刷新页面
function handleQuery() {
  list();
}
//分页刷新页面
function expensedetail() {
  expenseDetails();
}
//返回上一页
function reverted() {
  window.history.go(-1);
}
//审批类型枚举
const approvalType = () => {
  getselectExamineTypeEnums().then((res: any) => {
    header_data.approvalTypeList = res.data;
  });
};
//合同类型枚举
const ContractType = () => {
  getselectContractTypeEnums().then((res: any) => {
    header_data.contractTypeList = res.data;
  });
};
//支付方式枚举
const paymentMethod = () => {
  getselectPaymentWayEnums().then((res: any) => {
    header_data.paymentMethodList = res.data;
  });
};
//报销类型枚举
const reimbursementType = () => {
  getselectReimbursementTypeEnums().then((res: any) => {
    header_data.reimbursementTypeList = res.data;
  });
};
onMounted(() => {
  ids.list = [];
  header_data.threename = route.query.name;
  //获取来自上个页面传递的表格数据
  let data = {
    code: route.query.code,
    name: route.query.name,
    costAmount: route.query.costAmount,
    payAmount: route.query.payAmount,
    overExpenditure: route.query.overExpenditure,
    januaryCost: route.query.januaryCost,
    februaryCost: route.query.februaryCost,
    marchCost: route.query.marchCost,
    aprilCost: route.query.aprilCost,
    mayCost: route.query.mayCost,
    juneCost: route.query.juneCost,
    julyCost: route.query.julyCost,
    augustCost: route.query.augustCost,
    septemberCost: route.query.septemberCost,
    octoberCost: route.query.octoberCost,
    novemberCost: route.query.novemberCost,
    decemberCost: route.query.decemberCost,
  };
  ids.list.push(data);
  ids.id = route.query.id;
  //月份调用
  getitemname(ids.id).then((response: any) => {
    title.illustrate = response.data;
    header_data.onelevel = response.data.fname;
    header_data.secondary = response.data.sname;
    header_data.projectCode = response.data.projectCode;
  });
  list();
  //审批类型枚举
  approvalType();
  //合同类型枚举
  ContractType();
  //支付方式枚举
  paymentMethod();
  //报销类型枚举
  reimbursementType();
  getNotNullMonth(ids.id).then((response: any) => {
    header_data.getNotNullMonthoptions = response.data;
  });
});
</script>
<style lang="scss" scoped>
@import "./css/paymentapproval.scss";
</style>
